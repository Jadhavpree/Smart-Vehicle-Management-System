import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import UserNav from "@/components/UserNav";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { 
  Wrench, 
  Package, 
  FileText, 
  AlertTriangle, 
  CheckCircle2,
  Clock,
  TrendingUp,
  Search,
  Filter,
  Plus,
  MoreVertical,
  User,
  Car,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Gauge,
  Settings,
  Bell,
  ChevronRight,
  Loader2,
  RefreshCw,
  Users,
  BarChart3
} from "lucide-react";

const ServiceCenterDashboard = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [stockRequests, setStockRequests] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);
  const [addItemDialogOpen, setAddItemDialogOpen] = useState(false);
  const [simpleAddDialogOpen, setSimpleAddDialogOpen] = useState(false);
  const [mechanicDialogOpen, setMechanicDialogOpen] = useState(false);
  const [selectedBookingForMechanic, setSelectedBookingForMechanic] = useState(null);
  const [selectedMechanic, setSelectedMechanic] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [requestForm, setRequestForm] = useState({
    quantity: '',
    reason: '',
    priority: 'medium'
  });
  const [newItemForm, setNewItemForm] = useState({
    partName: '',
    sku: '',
    category: '',
    unitPrice: '',
    supplier: '',
    description: '',
    reorderLevel: '10',
    quantity: '',
    reason: '',
    priority: 'medium'
  });
  const [simpleItemForm, setSimpleItemForm] = useState({
    partName: '',
    sku: '',
    category: '',
    unitPrice: '',
    supplier: '',
    reorderLevel: '10',
    currentStock: '0'
  });
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0
  });

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const [bookingsData, statsData, inventoryData, requestsData, teamData] = await Promise.all([
        api.getServiceCenterBookings(token),
        api.getServiceCenterStats(token),
        api.getInventory(token),
        api.getMyStockRequests(token).catch(() => ({ data: [] })),
        api.getTeamMembers(token).catch(() => ({ data: [] }))
      ]);

      setBookings(bookingsData);
      setStats(statsData);
      setInventory(inventoryData.data || inventoryData || []);
      setStockRequests(requestsData.data || []);
      setTeamMembers(teamData.data || []);
    } catch (error) {
      console.error('Failed to load service center data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveBooking = async (bookingId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      await api.updateBookingStatus(token, bookingId, 'confirmed');
      toast({
        title: "Booking Approved",
        description: "The booking has been approved successfully."
      });
      loadData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve booking",
        variant: "destructive"
      });
    }
  };

  const handleRejectBooking = async (bookingId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      await api.updateBookingStatus(token, bookingId, 'rejected');
      toast({
        title: "Booking Rejected",
        description: "The booking has been rejected."
      });
      loadData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject booking",
        variant: "destructive"
      });
    }
  };

  const handleUpdateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      await api.updateBookingStatus(token, bookingId, newStatus);
      
      const statusMessages = {
        'job_card_created': 'Job card created successfully',
        'in_service': 'Service has been started',
        'ready_for_billing': 'Service completed, ready for billing'
      };
      
      toast({
        title: "Status Updated",
        description: statusMessages[newStatus] || `Status updated to ${newStatus}`
      });
      loadData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive"
      });
    }
  };

  const handleCreateJobCard = async (bookingId: string) => {
    // Open mechanic selection dialog
    setSelectedBookingForMechanic(bookingId);
    setSelectedMechanic('');
    setMechanicDialogOpen(true);
  };

  const handleConfirmJobCardWithMechanic = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token || !selectedBookingForMechanic) return;

      const response = await api.createJobCard(token, { 
        bookingId: selectedBookingForMechanic,
        assignedMechanic: selectedMechanic || undefined
      });
      
      if (response.success || response._id) {
        await api.updateBookingStatus(token, selectedBookingForMechanic, 'job_card_created');
        
        toast({
          title: "Job Card Created",
          description: selectedMechanic ? "Job card created and mechanic assigned" : "Job card created successfully"
        });
        setMechanicDialogOpen(false);
        loadData();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create job card",
        variant: "destructive"
      });
    }
  };

  const handleGenerateInvoice = async (bookingId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      // First get the job card for this booking
      const jobCardsResponse = await api.getJobCards(token);
      let jobCard = jobCardsResponse.data?.find((jc: any) => jc.booking === bookingId || jc.booking?._id === bookingId);
      
      // If no job card found, create one first
      if (!jobCard) {
        console.log('No job card found, creating one...');
        const createJobCardResponse = await api.createJobCard(token, { bookingId });
        
        if (createJobCardResponse.success || createJobCardResponse._id) {
          jobCard = createJobCardResponse.data || createJobCardResponse;
        } else {
          toast({
            title: "Error",
            description: "Failed to create job card for invoice",
            variant: "destructive"
          });
          return;
        }
      }

      const response = await api.createInvoice(token, jobCard._id);
      
      if (response.success) {
        // Update booking status to paid
        await api.updateBookingStatus(token, bookingId, 'paid');
        
        toast({
          title: "Invoice Generated",
          description: "Redirecting to invoice details..."
        });
        
        // Navigate to invoice detail page
        window.location.href = `/invoice/${response.data._id}`;
        
        // Refresh data
        loadData();
      }
    } catch (error) {
      console.error('Invoice generation error:', error);
      toast({
        title: "Error",
        description: "Failed to generate invoice",
        variant: "destructive"
      });
    }
  };

  const handleRequestStock = (item: any) => {
    setSelectedItem({ ...item, _id: item.id });
    setRequestForm({
      quantity: '',
      reason: '',
      priority: item.priority
    });
    setRequestDialogOpen(true);
  };

  const handleAddNewItem = () => {
    setNewItemForm({
      partName: '',
      sku: '',
      category: '',
      unitPrice: '',
      supplier: '',
      description: '',
      reorderLevel: '10',
      quantity: '',
      reason: 'New inventory item needed',
      priority: 'medium'
    });
    setAddItemDialogOpen(true);
  };

  const handleSubmitNewItem = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      // First create the inventory item
      const itemResponse = await api.addInventoryItem(token, {
        partName: newItemForm.partName,
        sku: newItemForm.sku,
        category: newItemForm.category,
        unitPrice: parseFloat(newItemForm.unitPrice),
        supplier: newItemForm.supplier,
        description: newItemForm.description,
        reorderLevel: parseInt(newItemForm.reorderLevel),
        currentStock: 0
      });

      const itemId = itemResponse.data?._id || itemResponse._id;
      if (itemId) {
        // Then create a stock request for it
        await api.createStockRequest(token, {
          inventoryItemId: itemId,
          requestedQuantity: parseInt(newItemForm.quantity),
          reason: newItemForm.reason,
          priority: newItemForm.priority
        });

        toast({
          title: "Item Added & Stock Requested",
          description: "New item added to inventory and stock request submitted."
        });
      }

      setAddItemDialogOpen(false);
      loadData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item or submit request",
        variant: "destructive"
      });
    }
  };

  const handleAddSimpleItem = () => {
    setSimpleItemForm({
      partName: '',
      sku: '',
      category: '',
      unitPrice: '',
      supplier: '',
      reorderLevel: '10',
      currentStock: '0'
    });
    setSimpleAddDialogOpen(true);
  };

  const handleSubmitSimpleItem = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      await api.addInventoryItem(token, {
        partName: simpleItemForm.partName,
        sku: simpleItemForm.sku,
        category: simpleItemForm.category,
        unitPrice: parseFloat(simpleItemForm.unitPrice),
        supplier: simpleItemForm.supplier,
        reorderLevel: parseInt(simpleItemForm.reorderLevel),
        currentStock: parseInt(simpleItemForm.currentStock)
      });

      toast({
        title: "Item Added",
        description: "New inventory item added successfully."
      });

      setSimpleAddDialogOpen(false);
      loadData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item",
        variant: "destructive"
      });
    }
  };

  const handleSubmitStockRequest = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token || !selectedItem) return;

      await api.createStockRequest(token, {
        inventoryItemId: selectedItem._id,
        requestedQuantity: parseInt(requestForm.quantity),
        reason: requestForm.reason,
        priority: requestForm.priority
      });

      toast({
        title: "Stock Request Submitted",
        description: "Your request has been sent to the admin for approval."
      });

      setRequestDialogOpen(false);
      loadData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit stock request",
        variant: "destructive"
      });
    }
  };

  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const activeBookings = bookings.filter(b => ['confirmed', 'job_card_created', 'in_service', 'ready_for_billing'].includes(b.status));

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const activeJobCards = [
    {
      id: "JC-2024-001",
      vehicle: "2024 Toyota Camry",
      licensePlate: "ABC-1234",
      customer: "John Doe",
      phone: "+1 234 567 8900",
      service: "Full Service Package",
      mechanic: "Mike Johnson",
      mechanicAvatar: "MJ",
      progress: 65,
      status: "In Progress",
      priority: "Normal",
      startDate: "Mar 10, 2024",
      estimatedCompletion: "Mar 11, 2024",
      estimatedCost: "$345.00"
    },
    {
      id: "JC-2024-002",
      vehicle: "2023 Honda Civic",
      licensePlate: "XYZ-5678",
      customer: "Jane Smith",
      phone: "+1 234 567 8901",
      service: "Brake System Repair",
      mechanic: "Sarah Williams",
      mechanicAvatar: "SW",
      progress: 30,
      status: "In Progress",
      priority: "High",
      startDate: "Mar 10, 2024",
      estimatedCompletion: "Mar 10, 2024",
      estimatedCost: "$520.00"
    },
    {
      id: "JC-2024-003",
      vehicle: "2022 BMW X5",
      licensePlate: "LMN-9012",
      customer: "Robert Wilson",
      phone: "+1 234 567 8902",
      service: "Engine Diagnosis",
      mechanic: "David Chen",
      mechanicAvatar: "DC",
      progress: 90,
      status: "Almost Done",
      priority: "Normal",
      startDate: "Mar 09, 2024",
      estimatedCompletion: "Mar 10, 2024",
      estimatedCost: "$180.00"
    }
  ];

  const pendingApprovals = [
    {
      id: "BA-001",
      vehicle: "2021 Ford Focus",
      licensePlate: "DEF-9012",
      customer: "Robert Brown",
      email: "robert@email.com",
      service: "Engine Diagnosis",
      requestDate: "Mar 09, 2024",
      preferredDate: "Mar 12, 2024",
      preferredTime: "10:00 AM",
      notes: "Check engine light is on"
    },
    {
      id: "BA-002",
      vehicle: "2023 BMW X5",
      licensePlate: "GHI-3456",
      customer: "Emily Davis",
      email: "emily@email.com",
      service: "Transmission Service",
      requestDate: "Mar 08, 2024",
      preferredDate: "Mar 13, 2024",
      preferredTime: "2:00 PM",
      notes: "Transmission slipping issue"
    },
    {
      id: "BA-003",
      vehicle: "2020 Mercedes C-Class",
      licensePlate: "JKL-7890",
      customer: "Michael Lee",
      email: "michael@email.com",
      service: "AC Repair",
      requestDate: "Mar 10, 2024",
      preferredDate: "Mar 14, 2024",
      preferredTime: "9:00 AM",
      notes: "AC not cooling properly"
    }
  ];

  const inventoryItems = Array.isArray(inventory) ? inventory.map(item => {
    const stockPercentage = (item.currentStock / item.reorderLevel) * 100;
    let status, priority;
    
    if (item.currentStock <= 0) {
      status = "Out of Stock";
      priority = "critical";
    } else if (stockPercentage <= 25) {
      status = "Critical";
      priority = "critical";
    } else if (stockPercentage <= 50) {
      status = "Low Stock";
      priority = "high";
    } else if (stockPercentage <= 75) {
      status = "Medium Stock";
      priority = "medium";
    } else {
      status = "In Stock";
      priority = "low";
    }
    
    return {
      id: item._id,
      name: item.partName,
      sku: item.sku,
      category: item.category,
      stock: item.currentStock,
      reorderLevel: item.reorderLevel,
      status,
      priority,
      unitPrice: `$${item.unitPrice}`,
      supplier: item.supplier || "N/A"
    };
  }) : [];

  const todayStats = {
    activeJobs: stats.inProgress || 0,
    completed: stats.completed || 0,
    pending: stats.pending || 0,
    revenue: "$2,450",
    activeChange: "+2",
    completedChange: "+3",
    pendingChange: "-1",
    revenueChange: "+15%"
  };

  const mechanics = teamMembers.map(member => ({
    name: member.name,
    avatar: member.name.split(' ').map(n => n[0]).join('').toUpperCase(),
    status: member.status === 'active' ? 'Available' : 'Inactive',
    currentJob: null
  }));

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Gauge className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-lg font-bold text-card-foreground hidden sm:block">AutoServe Pro</span>
              </Link>
              <div className="h-6 w-px bg-border hidden sm:block" />
              <h1 className="text-lg font-semibold text-card-foreground hidden sm:block">Service Center</h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search jobs, vehicles..." 
                  className="pl-9 w-64 bg-muted/50 border-0 focus-visible:ring-1"
                />
              </div>
              <Link to="/team">
                <Button variant="outline" size="sm" className="hidden lg:flex">
                  <Users className="h-4 w-4 mr-2" />
                  Team
                </Button>
              </Link>
              <Link to="/analytics">
                <Button variant="outline" size="sm" className="hidden lg:flex">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Analytics
                </Button>
              </Link>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-secondary rounded-full" />
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5 text-muted-foreground" />
              </Button>
              <UserNav />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Dashboard Overview</h1>
            <p className="text-muted-foreground mt-1">Manage your workshop operations</p>
          </div>
          <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-lg shadow-secondary/20">
            <Plus className="mr-2 h-4 w-4" />
            New Job Card
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <Card className="card-premium">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Active Jobs</p>
                  <p className="text-2xl sm:text-3xl font-bold text-foreground">{todayStats.activeJobs}</p>
                  <div className="flex items-center gap-1 text-success text-sm">
                    <ArrowUpRight className="h-4 w-4" />
                    <span>{todayStats.activeChange} today</span>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-primary/10">
                  <Wrench className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-premium">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl sm:text-3xl font-bold text-foreground">{todayStats.completed}</p>
                  <div className="flex items-center gap-1 text-success text-sm">
                    <ArrowUpRight className="h-4 w-4" />
                    <span>{todayStats.completedChange} today</span>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-success/10">
                  <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-premium">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl sm:text-3xl font-bold text-foreground">{todayStats.pending}</p>
                  <div className="flex items-center gap-1 text-warning text-sm">
                    <ArrowDownRight className="h-4 w-4" />
                    <span>{todayStats.pendingChange} today</span>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-warning/10">
                  <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-premium">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Today's Revenue</p>
                  <p className="text-2xl sm:text-3xl font-bold text-foreground">{todayStats.revenue}</p>
                  <div className="flex items-center gap-1 text-success text-sm">
                    <ArrowUpRight className="h-4 w-4" />
                    <span>{todayStats.revenueChange}</span>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-secondary/10">
                  <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-secondary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {/* Mechanics Status */}
          <Card className="card-premium lg:col-span-1">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Team Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mechanics.map((mechanic, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                      {mechanic.avatar}
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">{mechanic.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {mechanic.currentJob || "No active job"}
                      </p>
                    </div>
                  </div>
                  <Badge className={
                    mechanic.status === "Available" 
                      ? "bg-success/10 text-success border-0"
                      : "bg-warning/10 text-warning border-0"
                  }>
                    {mechanic.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="jobs" className="space-y-6">
              <div className="flex items-center justify-between">
                <TabsList className="bg-muted">
                  <TabsTrigger value="jobs" className="data-[state=active]:bg-background">
                    <Wrench className="h-4 w-4 mr-2" />
                    Active Jobs
                    <Badge className="ml-2 bg-primary/10 text-primary border-0 text-xs px-1.5">
                      {activeBookings.length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="approvals" className="data-[state=active]:bg-background">
                    <FileText className="h-4 w-4 mr-2" />
                    Pending Approvals
                    <Badge className="ml-2 bg-secondary text-secondary-foreground border-0 text-xs px-1.5">
                      {pendingBookings.length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="inventory" className="data-[state=active]:bg-background">
                    <Package className="h-4 w-4 mr-2" />
                    Inventory
                  </TabsTrigger>
                  <TabsTrigger value="requests" className="data-[state=active]:bg-background">
                    <FileText className="h-4 w-4 mr-2" />
                    Stock Requests
                    {stockRequests.filter(r => r.status === 'pending').length > 0 && (
                      <Badge className="ml-2 bg-orange-100 text-orange-700 border-0 text-xs px-1.5">
                        {stockRequests.filter(r => r.status === 'pending').length}
                      </Badge>
                    )}
                  </TabsTrigger>
                </TabsList>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={loadData} className="hidden sm:flex">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                  <Button variant="outline" size="sm" className="hidden sm:flex">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </div>
              </div>

              {/* Active Job Cards */}
              <TabsContent value="jobs" className="space-y-4 m-0">
                {activeBookings.length === 0 ? (
                  <Card className="card-premium">
                    <CardContent className="p-8 text-center">
                      <Wrench className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">No Active Jobs</h3>
                      <p className="text-muted-foreground">All jobs are completed or no bookings have been approved yet.</p>
                    </CardContent>
                  </Card>
                ) : (
                  activeBookings.map((job) => (
                  <Card key={job._id} className="card-premium group">
                    <CardContent className="p-0">
                      <div className="flex flex-col lg:flex-row">
                        {/* Left Section - Main Info */}
                        <div className="flex-1 p-6 space-y-4">
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <div className="flex items-center gap-3">
                                <h3 className="text-lg font-bold text-foreground">#{job._id.slice(-6)}</h3>
                                <Badge className="bg-primary/10 text-primary border-0 capitalize">
                                  {job.status.replace('_', ' ')}
                                </Badge>
                              </div>
                              <p className="text-muted-foreground">{job.serviceType}</p>
                            </div>
                            <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-muted">
                                <Car className="h-4 w-4 text-muted-foreground" />
                              </div>
                              <div>
                                <p className="font-medium text-foreground text-sm">
                                  {job.vehicle?.year} {job.vehicle?.make} {job.vehicle?.model}
                                </p>
                                <p className="text-xs text-muted-foreground">{job.vehicle?.licensePlate}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-muted">
                                <User className="h-4 w-4 text-muted-foreground" />
                              </div>
                              <div>
                                <p className="font-medium text-foreground text-sm">{job.customer?.name}</p>
                                <p className="text-xs text-muted-foreground">{job.customer?.phone || job.customer?.email}</p>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Status Progress</span>
                              <span className="font-medium text-foreground">
                                {job.status === 'confirmed' ? '25%' : 
                                 job.status === 'job_card_created' ? '50%' : 
                                 job.status === 'in_service' ? '75%' : '100%'}
                              </span>
                            </div>
                            <Progress 
                              value={
                                job.status === 'confirmed' ? 25 : 
                                job.status === 'job_card_created' ? 50 : 
                                job.status === 'in_service' ? 75 : 100
                              } 
                              className="h-2" 
                            />
                          </div>
                        </div>

                        {/* Right Section - Meta & Actions */}
                        <div className="lg:w-64 p-6 bg-muted/30 border-t lg:border-t-0 lg:border-l border-border space-y-4">
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Booked</span>
                              <span className="text-foreground">{formatDate(job.createdAt)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Preferred Date</span>
                              <span className="text-foreground">{formatDate(job.preferredDate)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Time</span>
                              <span className="text-foreground">{formatTime(job.preferredDate)}</span>
                            </div>
                          </div>

                          {job.notes && (
                            <div className="p-3 rounded-lg bg-muted/50 text-sm">
                              <p className="text-muted-foreground">Notes:</p>
                              <p className="text-foreground">{job.notes}</p>
                            </div>
                          )}

                          <div className="flex gap-2 pt-2">
                            <Link to={`/job-card/${job._id}`} className="flex-1">
                              <Button size="sm" variant="outline" className="w-full">
                                Details
                              </Button>
                            </Link>
                            {job.status === 'confirmed' && (
                              <Button 
                                size="sm" 
                                onClick={() => handleCreateJobCard(job._id)}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                              >
                                Create Job Card
                              </Button>
                            )}
                            {job.status === 'job_card_created' && (
                              <Button 
                                size="sm" 
                                onClick={() => handleUpdateBookingStatus(job._id, 'in_service')}
                                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
                              >
                                Start Service
                              </Button>
                            )}
                            {job.status === 'in_service' && (
                              <Button 
                                size="sm" 
                                onClick={() => handleUpdateBookingStatus(job._id, 'ready_for_billing')}
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                              >
                                Complete Service
                              </Button>
                            )}
                            {job.status === 'ready_for_billing' && (
                              <Button 
                                size="sm" 
                                onClick={() => handleGenerateInvoice(job._id)}
                                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                              >
                                Generate Invoice
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  ))
                )}
              </TabsContent>

              {/* Pending Approvals */}
              <TabsContent value="approvals" className="space-y-4 m-0">
                {pendingBookings.length === 0 ? (
                  <Card className="card-premium">
                    <CardContent className="p-8 text-center">
                      <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">No Pending Approvals</h3>
                      <p className="text-muted-foreground">All booking requests have been processed.</p>
                    </CardContent>
                  </Card>
                ) : (
                  pendingBookings.map((booking) => (
                  <Card key={booking._id} className="card-premium">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                        <div className="flex-1 space-y-4">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-bold text-foreground">{booking.serviceType}</h3>
                              <Badge className="bg-warning/10 text-warning border-0">
                                Pending Review
                              </Badge>
                            </div>
                            <p className="text-muted-foreground">
                              {booking.vehicle?.year} {booking.vehicle?.make} {booking.vehicle?.model} • {booking.vehicle?.licensePlate}
                            </p>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Customer</p>
                              <p className="font-medium text-foreground">{booking.customer?.name}</p>
                              <p className="text-xs text-muted-foreground">{booking.customer?.email}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Requested</p>
                              <p className="font-medium text-foreground">{formatDate(booking.createdAt)}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Preferred Date</p>
                              <p className="font-medium text-foreground">{formatDate(booking.preferredDate)}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Preferred Time</p>
                              <p className="font-medium text-foreground">{formatTime(booking.preferredDate)}</p>
                            </div>
                          </div>

                          {booking.notes && (
                            <div className="p-3 rounded-lg bg-muted/50 text-sm">
                              <p className="text-muted-foreground">Notes: <span className="text-foreground">{booking.notes}</span></p>
                            </div>
                          )}
                        </div>

                        <div className="flex md:flex-col gap-2">
                          <Button 
                            size="sm" 
                            onClick={() => handleApproveBooking(booking._id)}
                            className="flex-1 bg-success hover:bg-success/90 text-primary-foreground"
                          >
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleRejectBooking(booking._id)}
                            className="flex-1 border-destructive text-destructive hover:bg-destructive/10"
                          >
                            Reject
                          </Button>
                          <Button size="sm" variant="ghost" className="flex-1">
                            Reschedule
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  ))
                )}
              </TabsContent>

              {/* Inventory Management */}
              <TabsContent value="inventory" className="m-0">
                <Card className="card-premium">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Spare Parts Inventory</CardTitle>
                      <CardDescription>Manage your stock levels and reorders</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Dialog open={simpleAddDialogOpen} onOpenChange={setSimpleAddDialogOpen}>
                        <DialogTrigger asChild>
                          <Button onClick={handleAddSimpleItem} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Item
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add New Inventory Item</DialogTitle>
                          </DialogHeader>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="partName">Part Name *</Label>
                              <Input
                                id="partName"
                                value={simpleItemForm.partName}
                                onChange={(e) => setSimpleItemForm({...simpleItemForm, partName: e.target.value})}
                                placeholder="Enter part name"
                              />
                            </div>
                            <div>
                              <Label htmlFor="sku">SKU *</Label>
                              <Input
                                id="sku"
                                value={simpleItemForm.sku}
                                onChange={(e) => setSimpleItemForm({...simpleItemForm, sku: e.target.value})}
                                placeholder="Enter SKU"
                              />
                            </div>
                            <div>
                              <Label htmlFor="category">Category *</Label>
                              <Input
                                id="category"
                                value={simpleItemForm.category}
                                onChange={(e) => setSimpleItemForm({...simpleItemForm, category: e.target.value})}
                                placeholder="e.g., Engine, Brakes"
                              />
                            </div>
                            <div>
                              <Label htmlFor="unitPrice">Unit Price *</Label>
                              <Input
                                id="unitPrice"
                                type="number"
                                step="0.01"
                                value={simpleItemForm.unitPrice}
                                onChange={(e) => setSimpleItemForm({...simpleItemForm, unitPrice: e.target.value})}
                                placeholder="0.00"
                              />
                            </div>
                            <div>
                              <Label htmlFor="supplier">Supplier</Label>
                              <Input
                                id="supplier"
                                value={simpleItemForm.supplier}
                                onChange={(e) => setSimpleItemForm({...simpleItemForm, supplier: e.target.value})}
                                placeholder="Supplier name"
                              />
                            </div>
                            <div>
                              <Label htmlFor="reorderLevel">Reorder Level *</Label>
                              <Input
                                id="reorderLevel"
                                type="number"
                                value={simpleItemForm.reorderLevel}
                                onChange={(e) => setSimpleItemForm({...simpleItemForm, reorderLevel: e.target.value})}
                                placeholder="10"
                              />
                            </div>
                            <div className="col-span-2">
                              <Label htmlFor="currentStock">Initial Stock</Label>
                              <Input
                                id="currentStock"
                                type="number"
                                value={simpleItemForm.currentStock}
                                onChange={(e) => setSimpleItemForm({...simpleItemForm, currentStock: e.target.value})}
                                placeholder="0"
                              />
                            </div>
                          </div>
                          <div className="flex gap-2 pt-4">
                            <Button onClick={handleSubmitSimpleItem} className="flex-1">
                              Add Item
                            </Button>
                            <Button variant="outline" onClick={() => setSimpleAddDialogOpen(false)} className="flex-1">
                              Cancel
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Dialog open={addItemDialogOpen} onOpenChange={setAddItemDialogOpen}>
                        <DialogTrigger asChild>
                          <Button onClick={handleAddNewItem} className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                            <Plus className="h-4 w-4 mr-2" />
                            Request New Item
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Add New Inventory Item & Request Stock</DialogTitle>
                          </DialogHeader>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="partName">Part Name *</Label>
                              <Input
                                id="partName"
                                value={newItemForm.partName}
                                onChange={(e) => setNewItemForm({...newItemForm, partName: e.target.value})}
                                placeholder="Enter part name"
                              />
                            </div>
                            <div>
                              <Label htmlFor="sku">SKU *</Label>
                              <Input
                                id="sku"
                                value={newItemForm.sku}
                                onChange={(e) => setNewItemForm({...newItemForm, sku: e.target.value})}
                                placeholder="Enter SKU"
                              />
                            </div>
                            <div>
                              <Label htmlFor="category">Category *</Label>
                              <Input
                                id="category"
                                value={newItemForm.category}
                                onChange={(e) => setNewItemForm({...newItemForm, category: e.target.value})}
                                placeholder="e.g., Engine, Brakes, Filters"
                              />
                            </div>
                            <div>
                              <Label htmlFor="unitPrice">Unit Price *</Label>
                              <Input
                                id="unitPrice"
                                type="number"
                                step="0.01"
                                value={newItemForm.unitPrice}
                                onChange={(e) => setNewItemForm({...newItemForm, unitPrice: e.target.value})}
                                placeholder="0.00"
                              />
                            </div>
                            <div>
                              <Label htmlFor="supplier">Supplier</Label>
                              <Input
                                id="supplier"
                                value={newItemForm.supplier}
                                onChange={(e) => setNewItemForm({...newItemForm, supplier: e.target.value})}
                                placeholder="Supplier name"
                              />
                            </div>
                            <div>
                              <Label htmlFor="reorderLevel">Reorder Level *</Label>
                              <Input
                                id="reorderLevel"
                                type="number"
                                value={newItemForm.reorderLevel}
                                onChange={(e) => setNewItemForm({...newItemForm, reorderLevel: e.target.value})}
                                placeholder="10"
                              />
                            </div>
                            <div className="col-span-2">
                              <Label htmlFor="description">Description</Label>
                              <Textarea
                                id="description"
                                value={newItemForm.description}
                                onChange={(e) => setNewItemForm({...newItemForm, description: e.target.value})}
                                placeholder="Item description..."
                                rows={2}
                              />
                            </div>
                            <div>
                              <Label htmlFor="requestQuantity">Initial Stock Request *</Label>
                              <Input
                                id="requestQuantity"
                                type="number"
                                value={newItemForm.quantity}
                                onChange={(e) => setNewItemForm({...newItemForm, quantity: e.target.value})}
                                placeholder="Quantity needed"
                              />
                            </div>
                            <div>
                              <Label htmlFor="requestPriority">Request Priority</Label>
                              <Select value={newItemForm.priority} onValueChange={(value) => setNewItemForm({...newItemForm, priority: value})}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="low">Low</SelectItem>
                                  <SelectItem value="medium">Medium</SelectItem>
                                  <SelectItem value="high">High</SelectItem>
                                  <SelectItem value="critical">Critical</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="col-span-2">
                              <Label htmlFor="requestReason">Reason for Request</Label>
                              <Textarea
                                id="requestReason"
                                value={newItemForm.reason}
                                onChange={(e) => setNewItemForm({...newItemForm, reason: e.target.value})}
                                placeholder="Why is this item needed?"
                                rows={2}
                              />
                            </div>
                          </div>
                          <div className="flex gap-2 pt-4">
                            <Button onClick={handleSubmitNewItem} className="flex-1">
                              Add Item & Request Stock
                            </Button>
                            <Button variant="outline" onClick={() => setAddItemDialogOpen(false)} className="flex-1">
                              Cancel
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-muted/50 border-y border-border">
                          <tr>
                            <th className="text-left p-4 font-semibold text-foreground text-sm">Part Name</th>
                            <th className="text-left p-4 font-semibold text-foreground text-sm">SKU</th>
                            <th className="text-left p-4 font-semibold text-foreground text-sm">Category</th>
                            <th className="text-left p-4 font-semibold text-foreground text-sm">Stock</th>
                            <th className="text-left p-4 font-semibold text-foreground text-sm">Price</th>
                            <th className="text-left p-4 font-semibold text-foreground text-sm">Status</th>
                            <th className="text-left p-4 font-semibold text-foreground text-sm">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {inventoryItems.map((item) => (
                            <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                              <td className="p-4">
                                <div>
                                  <p className="font-medium text-foreground">{item.name}</p>
                                  <p className="text-xs text-muted-foreground">{item.supplier}</p>
                                </div>
                              </td>
                              <td className="p-4 text-muted-foreground text-sm font-mono">{item.sku}</td>
                              <td className="p-4 text-foreground text-sm">{item.category}</td>
                              <td className="p-4">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-foreground">{item.stock}</span>
                                  <span className="text-xs text-muted-foreground">/ {item.reorderLevel} min</span>
                                </div>
                              </td>
                              <td className="p-4 font-medium text-foreground">{item.unitPrice}</td>
                              <td className="p-4">
                                <Badge className={
                                  item.status === "In Stock" 
                                    ? "bg-success/10 text-success border-0"
                                    : item.status === "Medium Stock"
                                    ? "bg-blue/10 text-blue border-0"
                                    : item.status === "Low Stock"
                                    ? "bg-warning/10 text-warning border-0"
                                    : item.status === "Critical"
                                    ? "bg-destructive/10 text-destructive border-0"
                                    : "bg-gray/10 text-gray border-0"
                                }>
                                  {item.status === "Critical" && <AlertTriangle className="h-3 w-3 mr-1" />}
                                  {item.status === "Out of Stock" && <AlertTriangle className="h-3 w-3 mr-1" />}
                                  {item.status}
                                </Badge>
                              </td>
                              <td className="p-4">
                                {item.status === "In Stock" ? (
                                  <Button size="sm" variant="outline" className="text-xs" disabled>
                                    In Stock
                                  </Button>
                                ) : (
                                  <Dialog open={requestDialogOpen && selectedItem?.id === item.id} onOpenChange={setRequestDialogOpen}>
                                    <DialogTrigger asChild>
                                      <Button 
                                        size="sm" 
                                        variant="outline" 
                                        className={`text-xs ${
                                          item.priority === 'critical' ? 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100' :
                                          item.priority === 'high' ? 'bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100' :
                                          item.priority === 'medium' ? 'bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100' :
                                          'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                                        }`}
                                        onClick={() => handleRequestStock(item)}
                                      >
                                        Request Stock
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                      <DialogHeader>
                                        <DialogTitle>Request Stock for {selectedItem?.name}</DialogTitle>
                                      </DialogHeader>
                                      <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4 p-3 bg-muted/30 rounded-lg">
                                          <div>
                                            <Label className="text-sm font-medium">Current Stock</Label>
                                            <p className="text-lg font-bold">{inventory.find(inv => inv._id === selectedItem?.id)?.currentStock || 0}</p>
                                          </div>
                                          <div>
                                            <Label className="text-sm font-medium">Reorder Level</Label>
                                            <p className="text-lg font-bold">{inventory.find(inv => inv._id === selectedItem?.id)?.reorderLevel || 0}</p>
                                          </div>
                                        </div>
                                        <div>
                                          <Label htmlFor="quantity">Requested Quantity *</Label>
                                          <Input
                                            id="quantity"
                                            type="number"
                                            value={requestForm.quantity}
                                            onChange={(e) => setRequestForm({...requestForm, quantity: e.target.value})}
                                            placeholder="Enter quantity needed"
                                          />
                                        </div>
                                        <div>
                                          <Label htmlFor="priority">Priority (Auto-detected: {selectedItem?.priority})</Label>
                                          <Select value={requestForm.priority} onValueChange={(value) => setRequestForm({...requestForm, priority: value})}>
                                            <SelectTrigger>
                                              <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="low">Low</SelectItem>
                                              <SelectItem value="medium">Medium</SelectItem>
                                              <SelectItem value="high">High</SelectItem>
                                              <SelectItem value="critical">Critical</SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </div>
                                        <div>
                                          <Label htmlFor="reason">Reason for Request *</Label>
                                          <Textarea
                                            id="reason"
                                            value={requestForm.reason}
                                            onChange={(e) => setRequestForm({...requestForm, reason: e.target.value})}
                                            placeholder="Explain why this stock is needed..."
                                            rows={3}
                                          />
                                        </div>
                                        <div className="flex gap-2 pt-4">
                                          <Button onClick={handleSubmitStockRequest} className="flex-1">
                                            Submit Request
                                          </Button>
                                          <Button variant="outline" onClick={() => setRequestDialogOpen(false)} className="flex-1">
                                            Cancel
                                          </Button>
                                        </div>
                                      </div>
                                    </DialogContent>
                                  </Dialog>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Stock Requests */}
              <TabsContent value="requests" className="m-0">
                <Card className="card-premium">
                  <CardHeader>
                    <CardTitle>My Stock Requests</CardTitle>
                    <CardDescription>Track your inventory requests and their status</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {stockRequests.length === 0 ? (
                      <div className="text-center py-8">
                        <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold text-foreground mb-2">No Stock Requests</h3>
                        <p className="text-muted-foreground">You haven't made any stock requests yet.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {stockRequests.map((request) => (
                          <div key={request._id} className="border border-border rounded-lg p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h4 className="font-semibold text-foreground">{request.inventoryItem?.partName}</h4>
                                <p className="text-sm text-muted-foreground">SKU: {request.inventoryItem?.sku}</p>
                              </div>
                              <Badge className={
                                request.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-0' :
                                request.status === 'approved' ? 'bg-blue-100 text-blue-800 border-0' :
                                request.status === 'fulfilled' ? 'bg-green-100 text-green-800 border-0' :
                                'bg-red-100 text-red-800 border-0'
                              }>
                                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                              <div>
                                <p className="text-muted-foreground">Requested Qty</p>
                                <p className="font-medium text-foreground">{request.requestedQuantity}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Stock at Request</p>
                                <p className="font-medium text-foreground">{request.currentStock}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Priority</p>
                                <Badge className={
                                  request.priority === 'critical' ? 'bg-red-100 text-red-800 border-0' :
                                  request.priority === 'high' ? 'bg-orange-100 text-orange-800 border-0' :
                                  request.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 border-0' :
                                  'bg-gray-100 text-gray-800 border-0'
                                }>
                                  {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)}
                                </Badge>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Requested</p>
                                <p className="font-medium text-foreground">{new Date(request.createdAt).toLocaleDateString()}</p>
                              </div>
                            </div>
                            <div className="text-sm">
                              <p className="text-muted-foreground mb-1">Reason:</p>
                              <p className="text-foreground">{request.reason}</p>
                            </div>
                            {request.adminNotes && (
                              <div className="mt-3 p-3 bg-muted/50 rounded-lg text-sm">
                                <p className="text-muted-foreground mb-1">Admin Notes:</p>
                                <p className="text-foreground">{request.adminNotes}</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Mechanic Assignment Dialog */}
      <Dialog open={mechanicDialogOpen} onOpenChange={setMechanicDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Mechanic to Job Card</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="mechanic">Select Mechanic</Label>
              <Select value={selectedMechanic} onValueChange={setSelectedMechanic}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a mechanic (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No mechanic (assign later)</SelectItem>
                  {teamMembers
                    .filter(m => m.role === 'mechanic' && m.status === 'active')
                    .map((mechanic) => (
                      <SelectItem key={mechanic._id} value={mechanic._id}>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                            {mechanic.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </div>
                          <span>{mechanic.name}</span>
                          {mechanic.specialization && mechanic.specialization.length > 0 && (
                            <span className="text-xs text-muted-foreground">({mechanic.specialization.join(', ')})</span>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {teamMembers.filter(m => m.role === 'mechanic').length === 0 && (
                <p className="text-sm text-muted-foreground mt-2">
                  No mechanics available. <Link to="/team" className="text-primary hover:underline">Add team members</Link>
                </p>
              )}
            </div>
            <div className="flex gap-2 pt-4">
              <Button onClick={handleConfirmJobCardWithMechanic} className="flex-1">
                Create Job Card
              </Button>
              <Button variant="outline" onClick={() => setMechanicDialogOpen(false)} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ServiceCenterDashboard;