import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Calendar, Car, Clock, FileText, Plus, Settings, CheckCircle2, AlertCircle, Wrench, Bell, RefreshCw, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";
import UserNav from "@/components/UserNav";
import NotificationBell from "@/components/NotificationBell";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const CustomerDashboard = () => {
  const { toast } = useToast();
  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [serviceHistory, setServiceHistory] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastStatusCheck, setLastStatusCheck] = useState({});

  const fetchData = async (showNotifications = false) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error('No token found');
        setLoading(false);
        return;
      }
      
      // Fetch vehicles
      const vehiclesResponse = await api.getVehicles(token);
      if (vehiclesResponse.success) {
        setVehicles(vehiclesResponse.data || []);
      }
      
      // Fetch bookings
      const bookingsResponse = await api.getBookings(token);
      if (bookingsResponse.success) {
        const userBookings = bookingsResponse.data || [];
        
        // Check for status changes and show notifications
        if (showNotifications) {
          userBookings.forEach((booking: any) => {
            const lastStatus = lastStatusCheck[booking._id];
            if (lastStatus && lastStatus !== booking.status) {
              showStatusNotification(booking, lastStatus, booking.status);
            }
          });
        }
        
        // Update last status check
        const statusMap = {};
        userBookings.forEach((booking: any) => {
          statusMap[booking._id] = booking.status;
        });
        setLastStatusCheck(statusMap);
        
        // Separate upcoming and completed bookings
        const upcoming = userBookings.filter((booking: any) => 
          ['pending', 'confirmed', 'job_card_created', 'in_service'].includes(booking.status)
        );
        const completed = userBookings.filter((booking: any) => 
          ['ready_for_billing', 'paid'].includes(booking.status)
        );
        
        setBookings(upcoming);
        setServiceHistory(completed);
      }

      // Fetch invoices
      const invoicesResponse = await api.getInvoices(token);
      if (invoicesResponse.success) {
        console.log('Invoices received:', invoicesResponse.data);
        setInvoices(invoicesResponse.data || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const showStatusNotification = (booking: any, oldStatus: string, newStatus: string) => {
    const statusMessages = {
      'confirmed': 'Your booking has been approved by the service center!',
      'job_card_created': 'Job card created - work will begin soon',
      'in_service': 'Your vehicle is now being serviced',
      'ready_for_billing': 'Service completed! Your vehicle is ready for pickup',
      'paid': 'Payment processed successfully'
    };
    
    const message = statusMessages[newStatus] || `Status updated to ${newStatus.replace('_', ' ')}`;
    
    toast({
      title: "Service Update",
      description: `${booking.serviceType}: ${message}`,
      duration: 5000
    });
  };

  const getStatusInfo = (status: string) => {
    const statusConfig = {
      'pending': { 
        label: 'Pending Approval', 
        color: 'bg-yellow-100 text-yellow-800', 
        progress: 10,
        icon: Clock,
        description: 'Waiting for service center approval'
      },
      'confirmed': { 
        label: 'Approved', 
        color: 'bg-blue-100 text-blue-800', 
        progress: 25,
        icon: CheckCircle2,
        description: 'Booking confirmed, preparing for service'
      },
      'job_card_created': { 
        label: 'Job Card Created', 
        color: 'bg-purple-100 text-purple-800', 
        progress: 50,
        icon: FileText,
        description: 'Work order created, service will begin soon'
      },
      'in_service': { 
        label: 'In Service', 
        color: 'bg-orange-100 text-orange-800', 
        progress: 75,
        icon: Wrench,
        description: 'Your vehicle is currently being serviced'
      },
      'ready_for_billing': { 
        label: 'Ready for Pickup', 
        color: 'bg-green-100 text-green-800', 
        progress: 90,
        icon: CheckCircle2,
        description: 'Service completed, ready for pickup and payment'
      },
      'paid': { 
        label: 'Completed', 
        color: 'bg-green-100 text-green-800', 
        progress: 100,
        icon: CheckCircle2,
        description: 'Service completed and paid'
      }
    };
    
    return statusConfig[status] || {
      label: status.replace('_', ' ').toUpperCase(),
      color: 'bg-gray-100 text-gray-800',
      progress: 0,
      icon: AlertCircle,
      description: 'Status unknown'
    };
  };

  useEffect(() => {
    fetchData();
    // Auto-refresh every 30 seconds to check for status updates
    const interval = setInterval(() => fetchData(true), 30000);
    return () => clearInterval(interval);
  }, []);

  // Refresh data when component becomes visible
  useEffect(() => {
    const handleFocus = () => {
      fetchData(true);
    };
    
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);



  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-card-foreground">Customer Dashboard</h1>
              <p className="text-muted-foreground mt-1">Manage your vehicles and service appointments</p>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => fetchData(true)}
                className="hidden sm:flex"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
              <Link to="/booking">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Plus className="mr-2 h-4 w-4" />
                  Book Service
                </Button>
              </Link>
              <NotificationBell />
              <UserNav />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="vehicles" className="space-y-6">
          <TabsList className="bg-muted">
            <TabsTrigger value="vehicles" className="data-[state=active]:bg-background">
              <Car className="h-4 w-4 mr-2" />
              My Vehicles
            </TabsTrigger>
            <TabsTrigger value="bookings" className="data-[state=active]:bg-background">
              <Calendar className="h-4 w-4 mr-2" />
              Bookings
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-background">
              <FileText className="h-4 w-4 mr-2" />
              Service History
            </TabsTrigger>
            <TabsTrigger value="invoices" className="data-[state=active]:bg-background">
              <CreditCard className="h-4 w-4 mr-2" />
              Invoices
            </TabsTrigger>
          </TabsList>

          {/* My Vehicles Tab */}
          <TabsContent value="vehicles" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-foreground">Your Vehicles</h2>
              <Link to="/vehicle/register">
                <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Vehicle
                </Button>
              </Link>
            </div>
            
            {loading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Loading your vehicles...</p>
              </div>
            ) : vehicles.length === 0 ? (
              <div className="text-center py-12">
                <Car className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Vehicles Registered</h3>
                <p className="text-muted-foreground mb-4">Add your first vehicle to start booking services</p>
                <Link to="/vehicle/register">
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Plus className="mr-2 h-4 w-4" />
                    Register Vehicle
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {vehicles.map((vehicle) => (
                  <Card key={vehicle._id} className="border-border hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl">
                            {vehicle.year} {vehicle.make} {vehicle.model}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            {vehicle.licensePlate}
                          </CardDescription>
                        </div>
                        <Badge className="bg-success/10 text-success hover:bg-success/20 border-0">
                          {vehicle.status || 'Active'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">VIN</p>
                          <p className="font-medium text-foreground font-mono text-xs">{vehicle.vin}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Mileage</p>
                          <p className="font-medium text-foreground">{vehicle.mileage?.toLocaleString()} km</p>
                        </div>
                      </div>
                      {vehicle.color && (
                        <div className="text-sm">
                          <p className="text-muted-foreground">Color</p>
                          <p className="font-medium text-foreground">{vehicle.color}</p>
                        </div>
                      )}
                      <div className="pt-4 border-t border-border">
                        <div className="flex gap-2">
                          <Link to="/booking" className="flex-1">
                            <Button size="sm" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                              Book Service
                            </Button>
                          </Link>
                          <Link to={`/vehicle/${vehicle._id}`}>
                            <Button size="sm" variant="outline" className="border-border">
                              <Settings className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Upcoming Services</h2>
            
            {loading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Loading your bookings...</p>
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Upcoming Bookings</h3>
                <p className="text-muted-foreground mb-4">You don't have any scheduled services yet</p>
                <Link to="/booking">
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Plus className="mr-2 h-4 w-4" />
                    Book Service
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking: any) => {
                  const statusInfo = getStatusInfo(booking.status);
                  const StatusIcon = statusInfo.icon;
                  
                  return (
                    <Card key={booking._id} className="border-border">
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="text-lg font-bold text-foreground">{booking.serviceType}</h3>
                              <p className="text-sm text-muted-foreground mt-1">
                                {booking.vehicle?.year} {booking.vehicle?.make} {booking.vehicle?.model} • {booking.vehicle?.licensePlate}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <StatusIcon className="h-4 w-4 text-muted-foreground" />
                              <Badge className={statusInfo.color}>
                                {statusInfo.label}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Progress</span>
                              <span className="font-medium text-foreground">{statusInfo.progress}%</span>
                            </div>
                            <Progress value={statusInfo.progress} className="h-2" />
                            <p className="text-sm text-muted-foreground">{statusInfo.description}</p>
                          </div>
                          
                          <div className="flex items-center justify-between pt-2 border-t border-border">
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {new Date(booking.preferredDate).toLocaleDateString()}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {new Date(booking.preferredDate).toLocaleTimeString('en-US', {
                                  hour: 'numeric',
                                  minute: '2-digit',
                                  hour12: true
                                })}
                              </div>
                            </div>
                            <Button variant="outline" size="sm" className="border-border">
                              View Details
                            </Button>
                          </div>
                          
                          {booking.notes && (
                            <div className="p-3 rounded-lg bg-muted/50 text-sm">
                              <p className="text-muted-foreground">Notes: <span className="text-foreground">{booking.notes}</span></p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* Service History Tab */}
          <TabsContent value="history" className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Service History</h2>
            
            {loading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Loading service history...</p>
              </div>
            ) : serviceHistory.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Service History</h3>
                <p className="text-muted-foreground mb-4">Your completed services will appear here</p>
                <Link to="/booking">
                  <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                    <Plus className="mr-2 h-4 w-4" />
                    Book Your First Service
                  </Button>
                </Link>
              </div>
            ) : (
              <Card className="border-border">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="text-left p-4 font-semibold text-foreground">Date</th>
                          <th className="text-left p-4 font-semibold text-foreground">Vehicle</th>
                          <th className="text-left p-4 font-semibold text-foreground">Service</th>
                          <th className="text-left p-4 font-semibold text-foreground">Status</th>
                          <th className="text-left p-4 font-semibold text-foreground">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {serviceHistory.map((record: any) => {
                          // Get the invoice for this booking to check payment status
                          const relatedInvoice = invoices.find((inv: any) => inv.serviceType === record.serviceType && (inv.vehicle?._id === record.vehicle?._id || inv.vehicle === record.vehicle));
                          const isPaid = relatedInvoice?.status === 'paid';
                          
                          return (
                          <tr key={record._id} className="hover:bg-muted/30 transition-colors">
                            <td className="p-4 text-foreground">
                              {record.scheduledDate 
                                ? new Date(record.scheduledDate).toLocaleDateString()
                                : record.preferredDate
                                ? new Date(record.preferredDate).toLocaleDateString()
                                : 'N/A'
                              }
                            </td>
                            <td className="p-4 text-foreground">
                              {record.vehicle?.year} {record.vehicle?.make} {record.vehicle?.licensePlate}
                            </td>
                            <td className="p-4 text-foreground">{record.serviceType}</td>
                            <td className="p-4">
                              <Badge className={
                                isPaid
                                  ? 'bg-success/10 text-success hover:bg-success/20 border-0'
                                  : 'bg-warning/10 text-warning hover:bg-warning/20 border-0'
                              }>
                                {isPaid ? 'PAID' : 'PENDING PAYMENT'}
                              </Badge>
                            </td>
                            <td className="p-4">
                              <div className="flex gap-2">
                                {relatedInvoice && (
                                  <Link to={`/invoice/${relatedInvoice._id}`}>
                                    <Button size="sm" variant="outline" className="border-border">
                                      View Invoice
                                    </Button>
                                  </Link>
                                )}
                                {isPaid && (
                                  <Link to={`/review/${record._id}`}>
                                    <Button size="sm" className="bg-primary hover:bg-primary/90">
                                      Rate Service
                                    </Button>
                                  </Link>
                                )}
                                {!isPaid && relatedInvoice && (
                                  <Link to={`/payment/${relatedInvoice._id}`}>
                                    <Button size="sm" className="bg-success hover:bg-success/90 text-white">
                                      Pay Now
                                    </Button>
                                  </Link>
                                )}
                              </div>
                            </td>
                          </tr>
                        );})}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Invoices Tab */}
          <TabsContent value="invoices" className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Invoices & Payments</h2>
            
            {loading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Loading invoices...</p>
              </div>
            ) : invoices.length === 0 ? (
              <div className="text-center py-12">
                <CreditCard className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Invoices</h3>
                <p className="text-muted-foreground">Your invoices will appear here after service completion</p>
              </div>
            ) : (
              <div className="space-y-4">
                {invoices.map((invoice: any) => (
                  <Card key={invoice._id} className="border-border">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-foreground">
                            Invoice {invoice.invoiceNumber}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {invoice.serviceType} • {invoice.vehicle?.year} {invoice.vehicle?.make} {invoice.vehicle?.model}
                          </p>
                        </div>
                        <Badge className={
                          invoice.status === 'paid'
                            ? 'bg-success/10 text-success border-0'
                            : invoice.status === 'failed'
                            ? 'bg-destructive/10 text-destructive border-0'
                            : 'bg-warning/10 text-warning border-0'
                        }>
                          {invoice.status === 'paid' ? 'Paid' : invoice.status === 'failed' ? 'Failed' : 'Pending'}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Date</p>
                          <p className="font-medium text-foreground">
                            {new Date(invoice.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Labor</p>
                          <p className="font-medium text-foreground">${invoice.laborCost?.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Parts</p>
                          <p className="font-medium text-foreground">${invoice.partsCost?.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Total</p>
                          <p className="font-bold text-secondary">${invoice.totalAmount?.toFixed(2)}</p>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-4 border-t border-border">
                        <Link to={`/invoice/${invoice._id}`} className="flex-1">
                          <Button size="sm" variant="outline" className="w-full border-border">
                            View Invoice
                          </Button>
                        </Link>
                        {invoice.status === 'pending' && (
                          <Link to={`/payment/${invoice._id}`} className="flex-1">
                            <Button size="sm" className="w-full bg-success hover:bg-success/90 text-white">
                              <CreditCard className="mr-2 h-4 w-4" />
                              Pay Now
                            </Button>
                          </Link>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CustomerDashboard;
