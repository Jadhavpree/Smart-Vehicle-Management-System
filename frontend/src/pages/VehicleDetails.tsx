import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Edit, Trash2, Save, X, Calendar, Wrench, FileText, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

const VehicleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [vehicle, setVehicle] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: "",
    vin: "",
    licensePlate: "",
    mileage: "",
    color: "",
    engineType: "",
    transmissionType: "",
    fuelType: "",
    notes: ""
  });

  useEffect(() => {
    loadVehicleData();
  }, [id]);

  const loadVehicleData = async () => {
    try {
      const token = localStorage.getItem("token");
      const vehiclesResponse = await api.getVehicles(token);
      
      if (vehiclesResponse.success) {
        const foundVehicle = vehiclesResponse.data.find((v: any) => v._id === id);
        if (foundVehicle) {
          setVehicle(foundVehicle);
          setFormData({
            make: foundVehicle.make || "",
            model: foundVehicle.model || "",
            year: foundVehicle.year?.toString() || "",
            vin: foundVehicle.vin || "",
            licensePlate: foundVehicle.licensePlate || "",
            mileage: foundVehicle.mileage?.toString() || "",
            color: foundVehicle.color || "",
            engineType: foundVehicle.engineType || "",
            transmissionType: foundVehicle.transmissionType || "",
            fuelType: foundVehicle.fuelType || "",
            notes: foundVehicle.notes || ""
          });
        }
      }

      const historyResponse = await api.getVehicleHistory(token, id);
      setHistory(historyResponse || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load vehicle data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      await api.updateVehicle(token, id, {
        ...formData,
        year: parseInt(formData.year),
        mileage: parseInt(formData.mileage)
      });

      toast({
        title: "Success",
        description: "Vehicle updated successfully"
      });

      setIsEditing(false);
      loadVehicleData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update vehicle",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await api.deleteVehicle(token, id);

      toast({
        title: "Success",
        description: "Vehicle deleted successfully"
      });

      navigate("/customer");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete vehicle",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading vehicle details...</p>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Vehicle not found</p>
          <Link to="/customer">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link to="/customer" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-card-foreground">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </h1>
              <p className="text-muted-foreground mt-1">{vehicle.licensePlate}</p>
            </div>
            <div className="flex gap-2">
              {!isEditing ? (
                <>
                  <Button variant="outline" onClick={() => setIsEditing(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="destructive" onClick={() => setDeleteDialog(true)}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button onClick={handleUpdate}>
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="details" className="space-y-6">
          <TabsList className="bg-muted">
            <TabsTrigger value="details">Vehicle Details</TabsTrigger>
            <TabsTrigger value="history">Service History</TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>Vehicle Information</CardTitle>
                <CardDescription>
                  {isEditing ? "Update your vehicle details" : "View your vehicle information"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Make</Label>
                    <Input
                      value={formData.make}
                      onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Model</Label>
                    <Input
                      value={formData.model}
                      onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Year</Label>
                    <Input
                      type="number"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>VIN</Label>
                    <Input
                      value={formData.vin}
                      onChange={(e) => setFormData({ ...formData, vin: e.target.value })}
                      disabled={!isEditing}
                      className="font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>License Plate</Label>
                    <Input
                      value={formData.licensePlate}
                      onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Mileage (km)</Label>
                    <Input
                      type="number"
                      value={formData.mileage}
                      onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Color</Label>
                    <Input
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Engine Type</Label>
                    {isEditing ? (
                      <Select value={formData.engineType} onValueChange={(value) => setFormData({ ...formData, engineType: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="v4">V4</SelectItem>
                          <SelectItem value="v6">V6</SelectItem>
                          <SelectItem value="v8">V8</SelectItem>
                          <SelectItem value="electric">Electric</SelectItem>
                          <SelectItem value="hybrid">Hybrid</SelectItem>
                          <SelectItem value="diesel">Diesel</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input value={formData.engineType} disabled />
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Transmission</Label>
                    {isEditing ? (
                      <Select value={formData.transmissionType} onValueChange={(value) => setFormData({ ...formData, transmissionType: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="automatic">Automatic</SelectItem>
                          <SelectItem value="manual">Manual</SelectItem>
                          <SelectItem value="cvt">CVT</SelectItem>
                          <SelectItem value="dual-clutch">Dual-Clutch</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input value={formData.transmissionType} disabled />
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Fuel Type</Label>
                    {isEditing ? (
                      <Select value={formData.fuelType} onValueChange={(value) => setFormData({ ...formData, fuelType: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gasoline">Gasoline</SelectItem>
                          <SelectItem value="diesel">Diesel</SelectItem>
                          <SelectItem value="electric">Electric</SelectItem>
                          <SelectItem value="hybrid">Hybrid</SelectItem>
                          <SelectItem value="plug-in-hybrid">Plug-in Hybrid</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input value={formData.fuelType} disabled />
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    disabled={!isEditing}
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Service History</CardTitle>
                <CardDescription>Complete service record for this vehicle</CardDescription>
              </CardHeader>
              <CardContent>
                {history.length === 0 ? (
                  <div className="text-center py-12">
                    <Wrench className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">No Service History</h3>
                    <p className="text-muted-foreground mb-4">This vehicle hasn't been serviced yet</p>
                    <Link to="/booking">
                      <Button>Book Service</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {history.map((record: any) => (
                      <div key={record._id} className="border border-border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold text-lg">{record.serviceType}</h4>
                            <p className="text-sm text-muted-foreground">
                              {new Date(record.preferredDate).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge className={
                            record.status === 'paid' ? 'bg-success/10 text-success' :
                            record.status === 'in_service' ? 'bg-orange-100 text-orange-800' :
                            'bg-blue-100 text-blue-800'
                          }>
                            {record.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </div>
                        {record.assignedMechanic && (
                          <p className="text-sm text-muted-foreground">
                            Mechanic: {record.assignedMechanic.name}
                          </p>
                        )}
                        {record.notes && (
                          <p className="text-sm mt-2 p-2 bg-muted/50 rounded">{record.notes}</p>
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

      <Dialog open={deleteDialog} onOpenChange={setDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Delete Vehicle
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this vehicle? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VehicleDetails;
