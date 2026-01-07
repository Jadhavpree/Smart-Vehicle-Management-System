import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Database, Users, Car, Calendar, Wrench, Package, FileText, ArrowLeft } from "lucide-react";
import { api } from "@/lib/api";
import UserNav from "@/components/UserNav";
import { Link } from "react-router-dom";

const DatabaseViewer = () => {
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const userRole = localStorage.getItem('userRole');
      
      const [users, vehicles, bookings, jobcards, inventory, invoices] = await Promise.all([
        api.getAllUsers(token),
        api.get('/admin/all-vehicles'),
        api.getAllBookings(token),
        api.get('/admin/jobcards'),
        userRole === 'admin' ? api.get('/admin/inventory') : api.getInventory(token),
        api.get('/admin/all-invoices')
      ]);

      setData({
        users: users.data || [],
        vehicles: vehicles.data || [],
        bookings: bookings.data || [],
        jobcards: jobcards.data || [],
        inventory: inventory.data || [],
        invoices: invoices.data || []
      });
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Auto-refresh every 10 seconds for real-time data
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const collections = [
    { key: 'users', label: 'Users', icon: Users, color: 'text-blue-600' },
    { key: 'vehicles', label: 'Vehicles', icon: Car, color: 'text-green-600' },
    { key: 'bookings', label: 'Bookings', icon: Calendar, color: 'text-purple-600' },
    { key: 'jobcards', label: 'Job Cards', icon: Wrench, color: 'text-orange-600' },
    { key: 'inventory', label: 'Inventory', icon: Package, color: 'text-red-600' },
    { key: 'invoices', label: 'Invoices', icon: FileText, color: 'text-indigo-600' }
  ];

  const renderData = (items: any[], type: string) => {
    if (!items || items.length === 0) {
      return <p className="text-muted-foreground text-center py-8">No {type} found</p>;
    }

    return (
      <div className="space-y-4">
        {items.map((item, index) => (
          <Card key={item._id || index} className="border-border">
            <CardContent className="p-4">
              {type === 'users' && (
                <div className="grid grid-cols-2 gap-4">
                  <div><strong>Name:</strong> {item.name}</div>
                  <div><strong>Email:</strong> {item.email}</div>
                  <div><strong>Role:</strong> {item.role}</div>
                  <div><strong>Phone:</strong> {item.phone || 'N/A'}</div>
                  <div><strong>Created:</strong> {new Date(item.createdAt).toLocaleDateString()}</div>
                </div>
              )}
              {type === 'vehicles' && (
                <div className="grid grid-cols-2 gap-4">
                  <div><strong>Make:</strong> {item.make}</div>
                  <div><strong>Model:</strong> {item.model}</div>
                  <div><strong>Year:</strong> {item.year}</div>
                  <div><strong>License:</strong> {item.licensePlate}</div>
                  <div><strong>Owner:</strong> {item.owner?.name || 'N/A'}</div>
                  <div><strong>Color:</strong> {item.color}</div>
                </div>
              )}
              {type === 'bookings' && (
                <div className="grid grid-cols-2 gap-4">
                  <div><strong>Customer:</strong> {item.customer?.name}</div>
                  <div><strong>Service:</strong> {item.serviceType}</div>
                  <div><strong>Status:</strong> {item.status}</div>
                  <div><strong>Date:</strong> {new Date(item.scheduledDate).toLocaleDateString()}</div>
                  <div><strong>Vehicle:</strong> {item.vehicle?.make} {item.vehicle?.model}</div>
                </div>
              )}
              {type === 'job cards' && (
                <div className="grid grid-cols-2 gap-4">
                  <div><strong>Job #:</strong> {item.jobCardNumber}</div>
                  <div><strong>Customer:</strong> {item.customer?.name}</div>
                  <div><strong>Status:</strong> {item.status}</div>
                  <div><strong>Progress:</strong> {item.progress || 0}%</div>
                  <div><strong>Mechanic:</strong> {item.assignedMechanic?.name || 'Unassigned'}</div>
                </div>
              )}
              {type === 'inventory' && (
                <div className="grid grid-cols-2 gap-4">
                  <div><strong>Name:</strong> {item.partName}</div>
                  <div><strong>SKU:</strong> {item.sku}</div>
                  <div><strong>Stock:</strong> {item.currentStock}</div>
                  <div><strong>Price:</strong> ${item.unitPrice}</div>
                  <div><strong>Category:</strong> {item.category}</div>
                  <div><strong>Service Center:</strong> {item.serviceCenter?.name || 'N/A'}</div>
                </div>
              )}
              {type === 'invoices' && (
                <div className="grid grid-cols-2 gap-4">
                  <div><strong>Customer:</strong> {item.customer?.name}</div>
                  <div><strong>Amount:</strong> ${item.totalAmount}</div>
                  <div><strong>Status:</strong> {item.status}</div>
                  <div><strong>Date:</strong> {new Date(item.createdAt).toLocaleDateString()}</div>
                  <div><strong>Vehicle:</strong> {item.vehicle?.make} {item.vehicle?.model}</div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link to="/admin" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-card-foreground flex items-center gap-2">
                <Database className="h-8 w-8" />
                Database Viewer
              </h1>
              <p className="text-muted-foreground mt-1">
                View real-time data from MongoDB
                {lastUpdated && (
                  <span className="ml-2 text-xs">
                    • Last updated: {lastUpdated.toLocaleTimeString()}
                  </span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                onClick={fetchData} 
                disabled={loading}
                variant="outline"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Refreshing...' : 'Refresh Data'}
              </Button>
              <UserNav />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {collections.map((collection) => {
            const Icon = collection.icon;
            const count = data[collection.key]?.length || 0;
            
            return (
              <Card key={collection.key} className="border-border">
                <CardContent className="p-4 text-center">
                  <Icon className={`h-6 w-6 mx-auto mb-2 ${collection.color}`} />
                  <p className="text-2xl font-bold text-foreground">{count}</p>
                  <p className="text-sm text-muted-foreground">{collection.label}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="bg-muted">
            {collections.map((collection) => {
              const Icon = collection.icon;
              const count = data[collection.key]?.length || 0;
              
              return (
                <TabsTrigger 
                  key={collection.key} 
                  value={collection.key}
                  className="data-[state=active]:bg-background"
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {collection.label}
                  <Badge className="ml-2 bg-primary/10 text-primary border-0 text-xs">
                    {count}
                  </Badge>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {collections.map((collection) => (
            <TabsContent key={collection.key} value={collection.key}>
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <collection.icon className={`h-5 w-5 ${collection.color}`} />
                    {collection.label} Collection
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {renderData(data[collection.key], collection.label.toLowerCase())}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default DatabaseViewer;