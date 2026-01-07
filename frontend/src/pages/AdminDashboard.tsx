import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign,
  Car,
  Wrench,
  Package,
  Activity,
  Settings,
  UserCheck,
  FileText,
  Shield,
  Loader2,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import UserNav from "@/components/UserNav";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

const AdminDashboard = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [stockRequests, setStockRequests] = useState([]);
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    loadDashboardData();
    loadUsers();
    const interval = setInterval(() => {
      loadDashboardData();
      loadUsers();
    }, 10000); // Refresh every 10 seconds for real-time updates
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const [statsResponse, requestsResponse] = await Promise.all([
        api.get('/admin/stats'),
        api.getAllStockRequests(token)
      ]);
      
      if (statsResponse.success) {
        setDashboardData(statsResponse.data);
      }
      
      if (requestsResponse.success) {
        setStockRequests(requestsResponse.data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await api.get('/admin/users');
      if (response.success) {
        setUsers(response.data);
      }
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  };

  const handleStockRequestAction = async (requestId: string, status: string, adminNotes?: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      await api.updateStockRequestStatus(token, requestId, status, adminNotes);
      
      toast({
        title: "Request Updated",
        description: `Stock request has been ${status}.`
      });
      
      loadDashboardData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update stock request",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const overview = dashboardData?.overview || {};
  const overviewStats = [
    { label: "Total Revenue", value: `$${overview.totalRevenue || '0'}`, change: "+12.5%", icon: DollarSign, color: "text-success" },
    { label: "Active Users", value: overview.activeUsers || '0', change: "+8.2%", icon: Users, color: "text-primary" },
    { label: "Services Completed", value: overview.servicesCompleted || '0', change: "+15.3%", icon: Wrench, color: "text-accent" },
    { label: "Vehicles Serviced", value: overview.vehiclesServiced || '0', change: "+10.1%", icon: Car, color: "text-secondary" }
  ];

  const revenueData = dashboardData?.monthlyData || [];
  const serviceTypesData = dashboardData?.serviceTypes || [];
  const topVehicles = dashboardData?.topVehicles || [];

  const customers = users.filter(u => u.role === 'customer');
  const serviceCenters = users.filter(u => u.role === 'mechanic');
  const admins = users.filter(u => u.role === 'admin');

  const inventoryTrends = revenueData.map((item: any) => ({
    month: item.month,
    used: Math.floor(item.services * 6.5),
    purchased: Math.floor(item.services * 7)
  }));

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-card-foreground">Admin Dashboard</h1>
              <p className="text-muted-foreground mt-1">System analytics and performance insights</p>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/admin/users">
                <Button variant="outline" size="sm">
                  <Users className="h-4 w-4 mr-2" />
                  Manage Users
                </Button>
              </Link>
              <Link to="/inventory">
                <Button variant="outline" size="sm">
                  <Package className="h-4 w-4 mr-2" />
                  Inventory
                </Button>
              </Link>
              <Link to="/admin/mechanics">
                <Button variant="outline" size="sm">
                  <Wrench className="h-4 w-4 mr-2" />
                  Mechanics
                </Button>
              </Link>
              <Link to="/database">
                <Button variant="outline" size="sm">
                  <Shield className="h-4 w-4 mr-2" />
                  Database
                </Button>
              </Link>
              <Link to="/analytics">
                <Button variant="outline" size="sm">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Analytics
                </Button>
              </Link>
              <UserNav />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Link to="/admin/users">
            <Card className="border-border hover:border-primary/50 transition-colors cursor-pointer">
              <CardContent className="p-4 text-center">
                <UserCheck className="h-8 w-8 mx-auto mb-2 text-primary" />
                <p className="font-medium text-foreground">User Management</p>
                <p className="text-sm text-muted-foreground">Manage all users</p>
              </CardContent>
            </Card>
          </Link>
          <Link to="/inventory">
            <Card className="border-border hover:border-primary/50 transition-colors cursor-pointer">
              <CardContent className="p-4 text-center">
                <Package className="h-8 w-8 mx-auto mb-2 text-accent" />
                <p className="font-medium text-foreground">Inventory</p>
                <p className="text-sm text-muted-foreground">Stock management</p>
              </CardContent>
            </Card>
          </Link>
          <Link to="/admin/mechanics">
            <Card className="border-border hover:border-primary/50 transition-colors cursor-pointer">
              <CardContent className="p-4 text-center">
                <Wrench className="h-8 w-8 mx-auto mb-2 text-secondary" />
                <p className="font-medium text-foreground">Mechanics</p>
                <p className="text-sm text-muted-foreground">Performance tracking</p>
              </CardContent>
            </Card>
          </Link>
          <Link to="/reviews">
            <Card className="border-border hover:border-primary/50 transition-colors cursor-pointer">
              <CardContent className="p-4 text-center">
                <FileText className="h-8 w-8 mx-auto mb-2 text-success" />
                <p className="font-medium text-foreground">Reviews</p>
                <p className="text-sm text-muted-foreground">Customer feedback</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {overviewStats.map((stat, index) => (
            <Card key={index} className="border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                    <p className={`text-sm font-medium ${stat.color}`}>
                      {stat.change}
                    </p>
                  </div>
                  <div className="p-3 bg-muted rounded-xl">
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="revenue" className="space-y-6">
          <TabsList className="bg-muted">
            <TabsTrigger value="revenue" className="data-[state=active]:bg-background">
              <TrendingUp className="h-4 w-4 mr-2" />
              Revenue
            </TabsTrigger>
            <TabsTrigger value="services" className="data-[state=active]:bg-background">
              <BarChart3 className="h-4 w-4 mr-2" />
              Services
            </TabsTrigger>
            <TabsTrigger value="inventory" className="data-[state=active]:bg-background">
              <Package className="h-4 w-4 mr-2" />
              Inventory
            </TabsTrigger>
            <TabsTrigger value="performance" className="data-[state=active]:bg-background">
              <Activity className="h-4 w-4 mr-2" />
              Performance
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-background">
              <Users className="h-4 w-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="stock-requests" className="data-[state=active]:bg-background">
              <Package className="h-4 w-4 mr-2" />
              Stock Requests
              {stockRequests.filter((r: any) => r.status === 'pending').length > 0 && (
                <Badge className="ml-2 bg-red-100 text-red-700 border-0 text-xs px-1.5">
                  {stockRequests.filter((r: any) => r.status === 'pending').length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Revenue Analytics */}
          <TabsContent value="revenue" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-xl">Monthly Revenue Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" stroke="hsl(var(--foreground))" />
                      <YAxis stroke="hsl(var(--foreground))" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: "hsl(var(--card))", 
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px"
                        }} 
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="hsl(210, 85%, 28%)" 
                        strokeWidth={3}
                        name="Revenue ($)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-xl">Service Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={serviceTypesData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {serviceTypesData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: "hsl(var(--card))", 
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px"
                        }} 
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-xl">Top Vehicle Makes by Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topVehicles.map((vehicle, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{vehicle.make}</p>
                          <p className="text-sm text-muted-foreground">{vehicle.count} vehicles serviced</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-foreground">{vehicle.revenue}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Services Analytics */}
          <TabsContent value="services" className="space-y-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-xl">Services Completed per Month</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--foreground))" />
                    <YAxis stroke="hsl(var(--foreground))" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))", 
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px"
                      }} 
                    />
                    <Legend />
                    <Bar dataKey="services" fill="hsl(185, 70%, 45%)" name="Services Completed" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Inventory Analytics */}
          <TabsContent value="inventory" className="space-y-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-xl">Parts Usage vs Purchase Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={inventoryTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--foreground))" />
                    <YAxis stroke="hsl(var(--foreground))" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))", 
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px"
                      }} 
                    />
                    <Legend />
                    <Bar dataKey="used" fill="hsl(25, 95%, 53%)" name="Parts Used" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="purchased" fill="hsl(145, 65%, 45%)" name="Parts Purchased" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Performance Metrics */}
          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-xl">Average Service Time</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { service: "Oil Change", time: "45 min", status: "Excellent" },
                    { service: "Full Service", time: "3.5 hrs", status: "Good" },
                    { service: "Brake Service", time: "2.2 hrs", status: "Good" },
                    { service: "Engine Diagnosis", time: "1.8 hrs", status: "Excellent" }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between pb-3 border-b border-border last:border-0">
                      <div>
                        <p className="font-medium text-foreground">{item.service}</p>
                        <p className="text-sm text-success">{item.status}</p>
                      </div>
                      <p className="font-bold text-foreground">{item.time}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-xl">Customer Satisfaction</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-success mb-2">4.8</div>
                    <p className="text-muted-foreground">out of 5.0</p>
                  </div>
                  <div className="space-y-3">
                    {[
                      { stars: 5, count: 234, percentage: 75 },
                      { stars: 4, count: 45, percentage: 15 },
                      { stars: 3, count: 18, percentage: 6 },
                      { stars: 2, count: 8, percentage: 3 },
                      { stars: 1, count: 3, percentage: 1 }
                    ].map((rating, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <span className="text-sm font-medium text-foreground w-12">{rating.stars} ★</span>
                        <div className="flex-1 bg-muted rounded-full h-2">
                          <div 
                            className="bg-success h-2 rounded-full" 
                            style={{ width: `${rating.percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground w-12 text-right">{rating.count}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Management */}
          <TabsContent value="users" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card className="border-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Customers</p>
                      <p className="text-3xl font-bold text-foreground">{customers.length}</p>
                    </div>
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Service Centers</p>
                      <p className="text-3xl font-bold text-foreground">{serviceCenters.length}</p>
                    </div>
                    <Wrench className="h-8 w-8 text-accent" />
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Admins</p>
                      <p className="text-3xl font-bold text-foreground">{admins.length}</p>
                    </div>
                    <Shield className="h-8 w-8 text-secondary" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-xl">All Customers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {customers.map((user: any) => (
                    <div key={user._id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/30">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Vehicles: {user.vehicleCount || 0}</p>
                        <p className="text-sm text-muted-foreground">Bookings: {user.bookingCount || 0}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-xl">All Service Centers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {serviceCenters.map((user: any) => (
                    <div key={user._id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/30">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                          <Wrench className="h-5 w-5 text-accent" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                          <p className="text-sm text-muted-foreground">{user.phone}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Job Cards: {user.jobCardCount || 0}</p>
                        <p className="text-sm text-success">Completed: {user.completedJobs || 0}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Stock Requests Management */}
          <TabsContent value="stock-requests" className="space-y-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-xl">Stock Requests from Service Centers</CardTitle>
              </CardHeader>
              <CardContent>
                {stockRequests.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No Stock Requests</h3>
                    <p className="text-muted-foreground">No pending stock requests from service centers.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {stockRequests.map((request: any) => (
                      <div key={request._id} className="border border-border rounded-lg p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h4 className="text-lg font-semibold text-foreground">{request.inventoryItem?.partName}</h4>
                            <p className="text-sm text-muted-foreground">SKU: {request.inventoryItem?.sku} • Category: {request.inventoryItem?.category}</p>
                          </div>
                          <div className="flex gap-2">
                            <Badge className={
                              request.priority === 'critical' ? 'bg-red-100 text-red-800 border-0' :
                              request.priority === 'high' ? 'bg-orange-100 text-orange-800 border-0' :
                              request.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 border-0' :
                              'bg-gray-100 text-gray-800 border-0'
                            }>
                              {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)} Priority
                            </Badge>
                            <Badge className={
                              request.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-0' :
                              request.status === 'approved' ? 'bg-blue-100 text-blue-800 border-0' :
                              request.status === 'fulfilled' ? 'bg-green-100 text-green-800 border-0' :
                              'bg-red-100 text-red-800 border-0'
                            }>
                              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Requested By</p>
                            <p className="font-medium text-foreground">{request.requestedBy?.name}</p>
                            <p className="text-xs text-muted-foreground">{request.requestedBy?.email}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Requested Qty</p>
                            <p className="font-medium text-foreground text-lg">{request.requestedQuantity}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Stock at Request</p>
                            <p className="font-medium text-foreground">{request.currentStock}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Current Stock</p>
                            <p className="font-medium text-foreground">{request.inventoryItem?.currentStock}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Requested Date</p>
                            <p className="font-medium text-foreground">{new Date(request.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <p className="text-sm text-muted-foreground mb-2">Reason for Request:</p>
                          <p className="text-foreground bg-muted/30 p-3 rounded-lg">{request.reason}</p>
                        </div>
                        
                        {request.status === 'pending' && (
                          <div className="flex gap-2 pt-4 border-t border-border">
                            <Button 
                              size="sm" 
                              onClick={() => handleStockRequestAction(request._id, 'approved')}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <CheckCircle2 className="h-4 w-4 mr-2" />
                              Approve
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleStockRequestAction(request._id, 'rejected', 'Request rejected by admin')}
                              className="border-red-200 text-red-700 hover:bg-red-50"
                            >
                              Reject
                            </Button>
                            <Button 
                              size="sm" 
                              onClick={() => handleStockRequestAction(request._id, 'fulfilled')}
                              className="bg-blue-600 hover:bg-blue-700 text-white ml-auto"
                            >
                              Mark as Fulfilled
                            </Button>
                          </div>
                        )}
                        
                        {request.status !== 'pending' && request.adminNotes && (
                          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-sm text-blue-800 font-medium mb-1">Admin Notes:</p>
                            <p className="text-sm text-blue-700">{request.adminNotes}</p>
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
  );
};

export default AdminDashboard;