import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Search, 
  Plus, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Package, 
  Truck, 
  Phone, 
  Mail, 
  MapPin,
  ArrowLeft,
  ExternalLink,
  Star
} from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const SupplierManagement = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddSupplierOpen, setIsAddSupplierOpen] = useState(false);

  const suppliers = [
    {
      id: 1,
      name: "AutoParts Co.",
      contact: "Rajesh Kumar",
      email: "rajesh@autoparts.com",
      phone: "+91 9876543210",
      address: "Industrial Area, Thane",
      category: "Lubricants & Fluids",
      rating: 4.8,
      totalOrders: 156,
      deliveryTime: "2-3 days",
      status: "Active",
      products: ["Engine Oil", "Coolant", "Brake Fluid"],
    },
    {
      id: 2,
      name: "BrakeMaster Inc.",
      contact: "Priya Sharma",
      email: "priya@brakemaster.com",
      phone: "+91 9876543211",
      address: "MIDC, Pune",
      category: "Brakes & Suspension",
      rating: 4.6,
      totalOrders: 89,
      deliveryTime: "3-4 days",
      status: "Active",
      products: ["Brake Pads", "Rotors", "Suspension Parts"],
    },
    {
      id: 3,
      name: "FilterPro",
      contact: "Amit Patel",
      email: "amit@filterpro.com",
      phone: "+91 9876543212",
      address: "Andheri, Mumbai",
      category: "Filters",
      rating: 4.5,
      totalOrders: 234,
      deliveryTime: "1-2 days",
      status: "Active",
      products: ["Air Filters", "Oil Filters", "Fuel Filters"],
    },
    {
      id: 4,
      name: "SparkTech",
      contact: "Neha Verma",
      email: "neha@sparktech.com",
      phone: "+91 9876543213",
      address: "Bhiwandi, Maharashtra",
      category: "Electrical",
      rating: 4.3,
      totalOrders: 67,
      deliveryTime: "2-3 days",
      status: "Inactive",
      products: ["Spark Plugs", "Batteries", "Alternators"],
    },
    {
      id: 5,
      name: "TirePlus",
      contact: "Suresh Reddy",
      email: "suresh@tireplus.com",
      phone: "+91 9876543214",
      address: "Nagpur, Maharashtra",
      category: "Tires & Wheels",
      rating: 4.7,
      totalOrders: 112,
      deliveryTime: "4-5 days",
      status: "Active",
      products: ["Tires", "Alloy Wheels", "Wheel Covers"],
    },
  ];

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    supplier.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddSupplier = () => {
    toast({
      title: "Supplier Added",
      description: "New supplier has been added successfully.",
    });
    setIsAddSupplierOpen(false);
  };

  const handleDeleteSupplier = (supplierName: string) => {
    toast({
      title: "Supplier Removed",
      description: `${supplierName} has been removed from the system.`,
      variant: "destructive",
    });
  };

  const stats = {
    totalSuppliers: suppliers.length,
    activeSuppliers: suppliers.filter(s => s.status === "Active").length,
    totalOrders: suppliers.reduce((sum, s) => sum + s.totalOrders, 0),
    avgRating: (suppliers.reduce((sum, s) => sum + s.rating, 0) / suppliers.length).toFixed(1),
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link to="/service-center" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-card-foreground">Supplier Management</h1>
              <p className="text-muted-foreground mt-1">Manage your spare parts suppliers</p>
            </div>
            <Dialog open={isAddSupplierOpen} onOpenChange={setIsAddSupplierOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Supplier
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Supplier</DialogTitle>
                  <DialogDescription>
                    Register a new spare parts supplier
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Company Name</Label>
                    <Input placeholder="Enter company name" />
                  </div>
                  <div className="space-y-2">
                    <Label>Contact Person</Label>
                    <Input placeholder="Enter contact person name" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input type="email" placeholder="Email address" />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <Input placeholder="Phone number" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Input placeholder="e.g., Lubricants, Brakes, Filters" />
                  </div>
                  <div className="space-y-2">
                    <Label>Address</Label>
                    <Textarea placeholder="Full address" rows={2} />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddSupplierOpen(false)}>Cancel</Button>
                  <Button onClick={handleAddSupplier}>Add Supplier</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Truck className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.totalSuppliers}</p>
                  <p className="text-sm text-muted-foreground">Total Suppliers</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-success/10">
                  <Package className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.activeSuppliers}</p>
                  <p className="text-sm text-muted-foreground">Active Suppliers</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent/10">
                  <Package className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.totalOrders}</p>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-warning/10">
                  <Star className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.avgRating}</p>
                  <p className="text-sm text-muted-foreground">Avg Rating</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="border-border mb-6">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search suppliers by name or category..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Suppliers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSuppliers.map((supplier) => (
            <Card key={supplier.id} className="border-border hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{supplier.name}</CardTitle>
                    <CardDescription>{supplier.contact}</CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Supplier
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Orders
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-destructive"
                        onClick={() => handleDeleteSupplier(supplier.name)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove Supplier
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge className="bg-primary/10 text-primary border-0">{supplier.category}</Badge>
                  <Badge className={
                    supplier.status === "Active" 
                      ? "bg-success/10 text-success border-0" 
                      : "bg-muted text-muted-foreground border-0"
                  }>
                    {supplier.status}
                  </Badge>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    {supplier.email}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    {supplier.phone}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {supplier.address}
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {supplier.products.slice(0, 3).map((product) => (
                    <Badge key={product} variant="outline" className="text-xs">
                      {product}
                    </Badge>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Star className="h-3 w-3 fill-warning text-warning" />
                      <span className="font-semibold text-foreground">{supplier.rating}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Rating</p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-foreground">{supplier.totalOrders}</p>
                    <p className="text-xs text-muted-foreground">Orders</p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-foreground">{supplier.deliveryTime}</p>
                    <p className="text-xs text-muted-foreground">Delivery</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SupplierManagement;
