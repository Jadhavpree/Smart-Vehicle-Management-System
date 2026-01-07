import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, Plus, Search, ArrowLeft, ShoppingCart, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const InventoryManagement = () => {
  const [inventory, setInventory] = useState([]);
  const [stockRequests, setStockRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [newItem, setNewItem] = useState({
    partName: '',
    sku: '',
    category: '',
    currentStock: 0,
    reorderLevel: 10,
    unitPrice: 0,
    supplier: ''
  });
  const [newRequest, setNewRequest] = useState({
    inventoryItemId: '',
    requestedQuantity: 0,
    reason: '',
    priority: 'medium'
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchInventory();
    fetchStockRequests();
  }, []);

  const fetchInventory = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await api.getInventory(token);
        const inventoryData = response.success ? response.data : [];
        setInventory(Array.isArray(inventoryData) ? inventoryData : []);
      }
    } catch (error) {
      console.error('Failed to fetch inventory:', error);
      toast({ 
        title: "Error", 
        description: "Failed to load inventory: " + error.message, 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStockRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await api.getMyStockRequests(token);
        const requestsData = response.success ? response.data : (Array.isArray(response) ? response : (response.data || []));
        setStockRequests(Array.isArray(requestsData) ? requestsData : []);
      }
    } catch (error) {
      console.error('Failed to fetch stock requests:', error);
      toast({ 
        title: "Error", 
        description: "Failed to load stock requests: " + error.message, 
        variant: "destructive" 
      });
    }
  };

  const handleAddItem = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await api.addInventoryItem(token, newItem);
        toast({ title: "Item Added", description: "Inventory item added successfully" });
        setNewItem({ partName: '', sku: '', category: '', currentStock: 0, reorderLevel: 10, unitPrice: 0, supplier: '' });
        await fetchInventory();
      }
    } catch (error) {
      console.error('Add item error:', error);
      toast({ title: "Add Failed", description: "Could not add inventory item: " + error.message, variant: "destructive" });
    }
  };

  const handleCreateStockRequest = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token && newRequest.inventoryItemId && newRequest.requestedQuantity > 0) {
        const response = await api.createStockRequest(token, newRequest);
        if (response.success || response._id) {
          toast({ title: "Request Created", description: "Stock request sent to admin" });
          setNewRequest({ inventoryItemId: '', requestedQuantity: 0, reason: '', priority: 'medium' });
          fetchStockRequests();
        } else {
          throw new Error(response.message || 'Failed to create request');
        }
      } else {
        toast({ title: "Invalid Request", description: "Please fill all required fields", variant: "destructive" });
      }
    } catch (error) {
      console.error('Stock request error:', error);
      toast({ title: "Request Failed", description: "Could not create stock request: " + error.message, variant: "destructive" });
    }
  };

  const filteredInventory = inventory.filter((item: any) =>
    item.partName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link to="/admin" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Admin Dashboard
          </Link>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-card-foreground">Inventory Management</h1>
              <p className="text-muted-foreground mt-1">Manage spare parts and stock levels</p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  fetchInventory();
                  fetchStockRequests();
                }}
              >
                Refresh
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Inventory Item</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Part Name</Label>
                        <Input
                          value={newItem.partName}
                          onChange={(e) => setNewItem({...newItem, partName: e.target.value})}
                          placeholder="Engine Oil 5W-30"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>SKU</Label>
                        <Input
                          value={newItem.sku}
                          onChange={(e) => setNewItem({...newItem, sku: e.target.value})}
                          placeholder="OIL-5W30-5L"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Category</Label>
                        <Select onValueChange={(value) => setNewItem({...newItem, category: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="lubricants">Lubricants</SelectItem>
                            <SelectItem value="brakes">Brakes</SelectItem>
                            <SelectItem value="filters">Filters</SelectItem>
                            <SelectItem value="engine">Engine</SelectItem>
                            <SelectItem value="fluids">Fluids</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Supplier</Label>
                        <Input
                          value={newItem.supplier}
                          onChange={(e) => setNewItem({...newItem, supplier: e.target.value})}
                          placeholder="AutoParts Co."
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Current Stock</Label>
                        <Input
                          type="number"
                          value={newItem.currentStock}
                          onChange={(e) => setNewItem({...newItem, currentStock: parseInt(e.target.value)})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Reorder Level</Label>
                        <Input
                          type="number"
                          value={newItem.reorderLevel}
                          onChange={(e) => setNewItem({...newItem, reorderLevel: parseInt(e.target.value)})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Unit Price ($)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={newItem.unitPrice}
                          onChange={(e) => setNewItem({...newItem, unitPrice: parseFloat(e.target.value)})}
                        />
                      </div>
                    </div>
                    
                    <Button onClick={handleAddItem} className="w-full">
                      Add Item
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="inventory" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="requests">Stock Requests</TabsTrigger>
          </TabsList>
          
          <TabsContent value="inventory" className="space-y-6">
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search parts by name or SKU..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Inventory Items ({filteredInventory.length})
                  <span className="text-sm text-muted-foreground ml-2">
                    {loading ? 'Loading...' : `Total: ${inventory.length}`}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {loading ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Loading inventory...</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="text-left p-4 font-semibold text-foreground">Part Name</th>
                          <th className="text-left p-4 font-semibold text-foreground">SKU</th>
                          <th className="text-left p-4 font-semibold text-foreground">Category</th>
                          <th className="text-left p-4 font-semibold text-foreground">Stock</th>
                          <th className="text-left p-4 font-semibold text-foreground">Price</th>
                          <th className="text-left p-4 font-semibold text-foreground">Status</th>
                          <th className="text-left p-4 font-semibold text-foreground">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {filteredInventory.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="p-8 text-center">
                              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                              <p className="text-muted-foreground">
                                {searchTerm ? 'No items match your search' : 'No inventory items found. Add your first item to get started.'}
                              </p>
                            </td>
                          </tr>
                        ) : (
                          filteredInventory.map((item: any) => (
                          <tr key={item._id} className="hover:bg-muted/30 transition-colors">
                            <td className="p-4">
                              <div>
                                <p className="font-medium text-foreground">{item.partName}</p>
                                <p className="text-xs text-muted-foreground">{item.supplier}</p>
                              </div>
                            </td>
                            <td className="p-4 text-muted-foreground text-sm font-mono">{item.sku}</td>
                            <td className="p-4 text-foreground text-sm capitalize">{item.category}</td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-foreground">{item.currentStock}</span>
                                <span className="text-xs text-muted-foreground">/ {item.reorderLevel} min</span>
                              </div>
                            </td>
                            <td className="p-4 font-medium text-foreground">${item.unitPrice?.toFixed(2)}</td>
                            <td className="p-4">
                              <Badge className={
                                item.currentStock > item.reorderLevel
                                  ? "bg-success/10 text-success border-0"
                                  : item.currentStock > 0
                                  ? "bg-warning/10 text-warning border-0"
                                  : "bg-destructive/10 text-destructive border-0"
                              }>
                                {item.currentStock > item.reorderLevel ? "In Stock" : 
                                 item.currentStock > 0 ? "Low Stock" : "Out of Stock"}
                              </Badge>
                            </td>
                            <td className="p-4">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => setNewRequest({...newRequest, inventoryItemId: item._id})}
                                  >
                                    <ShoppingCart className="h-4 w-4 mr-1" />
                                    Request Stock
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Request Stock for {item.partName}</DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div className="space-y-2">
                                      <Label>Requested Quantity</Label>
                                      <Input
                                        type="number"
                                        value={newRequest.requestedQuantity}
                                        onChange={(e) => setNewRequest({...newRequest, requestedQuantity: parseInt(e.target.value)})}
                                        placeholder="Enter quantity needed"
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Priority</Label>
                                      <Select onValueChange={(value) => setNewRequest({...newRequest, priority: value})}>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select priority" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="low">Low</SelectItem>
                                          <SelectItem value="medium">Medium</SelectItem>
                                          <SelectItem value="high">High</SelectItem>
                                          <SelectItem value="critical">Critical</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Reason</Label>
                                      <Textarea
                                        value={newRequest.reason}
                                        onChange={(e) => setNewRequest({...newRequest, reason: e.target.value})}
                                        placeholder="Explain why you need this stock..."
                                      />
                                    </div>
                                    <Button onClick={handleCreateStockRequest} className="w-full">
                                      Send Request
                                    </Button>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </td>
                          </tr>
                        )))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="requests" className="space-y-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  My Stock Requests ({stockRequests.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {stockRequests.length === 0 ? (
                  <div className="p-8 text-center">
                    <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No stock requests found. Request stock from the inventory tab.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="text-left p-4 font-semibold text-foreground">Item</th>
                          <th className="text-left p-4 font-semibold text-foreground">Quantity</th>
                          <th className="text-left p-4 font-semibold text-foreground">Priority</th>
                          <th className="text-left p-4 font-semibold text-foreground">Status</th>
                          <th className="text-left p-4 font-semibold text-foreground">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {stockRequests.map((request: any) => (
                          <tr key={request._id} className="hover:bg-muted/30 transition-colors">
                            <td className="p-4">
                              <div>
                                <p className="font-medium text-foreground">{request.inventoryItem?.partName}</p>
                                <p className="text-xs text-muted-foreground">{request.reason}</p>
                              </div>
                            </td>
                            <td className="p-4 font-medium text-foreground">{request.requestedQuantity}</td>
                            <td className="p-4">
                              <Badge className={
                                request.priority === 'critical' ? "bg-destructive/10 text-destructive border-0" :
                                request.priority === 'high' ? "bg-warning/10 text-warning border-0" :
                                "bg-muted/50 text-muted-foreground border-0"
                              }>
                                {request.priority}
                              </Badge>
                            </td>
                            <td className="p-4">
                              <Badge className={
                                request.status === 'fulfilled' ? "bg-success/10 text-success border-0" :
                                request.status === 'approved' ? "bg-blue-500/10 text-blue-500 border-0" :
                                request.status === 'rejected' ? "bg-destructive/10 text-destructive border-0" :
                                "bg-warning/10 text-warning border-0"
                              }>
                                {request.status}
                              </Badge>
                            </td>
                            <td className="p-4 text-muted-foreground text-sm">
                              {new Date(request.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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

export default InventoryManagement;