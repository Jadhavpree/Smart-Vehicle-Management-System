import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  ArrowLeft, 
  ArrowRight, 
  Car, 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle,
  Wrench,
  DollarSign
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { api } from "@/lib/api";

const bookingSchema = z.object({
  vehicleId: z.string().min(1, "Please select a vehicle"),
  serviceCenterId: z.string().optional(),
  serviceType: z.string().min(1, "Please select a service type"),
  description: z.string().max(500, "Description too long").optional(),
  preferredDate: z.date({
    required_error: "Please select a date",
  }),
  timeSlot: z.string().min(1, "Please select a time slot"),
});

type BookingForm = z.infer<typeof bookingSchema>;

const ServiceBooking = () => {
  const [step, setStep] = useState(1);
  const [vehicles, setVehicles] = useState([]);
  const [serviceCenters, setServiceCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingNumber, setBookingNumber] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const form = useForm<BookingForm>({
    resolver: zodResolver(bookingSchema),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/auth');
          return;
        }
        
        const [vehiclesRes, centersRes] = await Promise.all([
          api.getVehicles(token),
          api.getServiceCenters(token)
        ]);
        
        if (vehiclesRes.success) {
          const formattedVehicles = vehiclesRes.data.map((vehicle: any) => ({
            id: vehicle._id,
            label: `${vehicle.year} ${vehicle.make} ${vehicle.model} - ${vehicle.licensePlate}`
          }));
          setVehicles(formattedVehicles);
        }
        
        if (centersRes.success) {
          setServiceCenters(centersRes.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error",
          description: "Failed to load data. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate, toast]);

  const serviceTypes = [
    { 
      id: "oil-change", 
      name: "Oil Change", 
      duration: "45 min", 
      price: "$65",
      description: "Complete oil and filter change with multi-point inspection"
    },
    { 
      id: "full-service", 
      name: "Full Service", 
      duration: "3 hours", 
      price: "$245",
      description: "Comprehensive vehicle inspection and maintenance"
    },
    { 
      id: "brake-service", 
      name: "Brake Service", 
      duration: "2 hours", 
      price: "$185",
      description: "Complete brake inspection, pad replacement if needed"
    },
    { 
      id: "tire-service", 
      name: "Tire Service", 
      duration: "1.5 hours", 
      price: "$95",
      description: "Tire rotation, balancing, and pressure check"
    },
    { 
      id: "engine-diagnosis", 
      name: "Engine Diagnosis", 
      duration: "1 hour", 
      price: "$120",
      description: "Computer diagnostic scan and issue identification"
    },
    { 
      id: "transmission", 
      name: "Transmission Service", 
      duration: "2.5 hours", 
      price: "$295",
      description: "Transmission fluid change and inspection"
    },
  ];

  const timeSlots = [
    { value: "08:00", label: "8:00 AM", available: true, booked: 2 },
    { value: "09:00", label: "9:00 AM", available: true, booked: 1 },
    { value: "10:00", label: "10:00 AM", available: false, booked: 3 },
    { value: "11:00", label: "11:00 AM", available: true, booked: 0 },
    { value: "12:00", label: "12:00 PM", available: true, booked: 1 },
    { value: "13:00", label: "1:00 PM", available: false, booked: 3 },
    { value: "14:00", label: "2:00 PM", available: true, booked: 0 },
    { value: "15:00", label: "3:00 PM", available: true, booked: 2 },
    { value: "16:00", label: "4:00 PM", available: true, booked: 1 },
  ];

  const onSubmit = async (data: BookingForm) => {
    try {
      const token = localStorage.getItem('token');
      const bookingData = {
        vehicle: data.vehicleId,
        serviceCenter: data.serviceCenterId,
        serviceType: serviceTypes.find(s => s.id === data.serviceType)?.name || data.serviceType,
        description: data.description || '',
        scheduledDate: data.preferredDate,
        timeSlot: data.timeSlot
      };
      
      const response = await api.createBooking(token, bookingData);
      
      if (response.success) {
        const confirmationNumber = `BK-${Date.now().toString().slice(-8)}`;
        setBookingNumber(confirmationNumber);
        setShowConfirmation(true);
        
        toast({
          title: "✅ Booking Confirmed!",
          description: `Confirmation #${confirmationNumber} - Your appointment is scheduled.`,
        });
      } else {
        throw new Error(response.message || 'Booking failed');
      }
    } catch (error: any) {
      toast({
        title: "Booking Failed",
        description: error.message || "Failed to create booking. Please try again.",
        variant: "destructive"
      });
    }
  };

  const nextStep = async () => {
    let fieldsToValidate: (keyof BookingForm)[] = [];
    
    if (step === 1) {
      fieldsToValidate = ["vehicleId", "serviceType"];
    } else if (step === 2) {
      fieldsToValidate = ["preferredDate", "timeSlot"];
    }

    const result = await form.trigger(fieldsToValidate);
    if (result) {
      setStep(step + 1);
    }
  };

  const progress = (step / 3) * 100;
  const selectedService = serviceTypes.find(s => s.id === form.watch("serviceType"));
  const selectedCenter = serviceCenters.find((c: any) => c._id === form.watch("serviceCenterId"));

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link to="/customer" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-card-foreground">Book a Service</h1>
          <p className="text-muted-foreground mt-1">Schedule your vehicle maintenance appointment</p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Step {step} of 3</span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Indicators */}
        <div className="flex justify-between mb-8">
          {[
            { num: 1, label: "Service", icon: Wrench },
            { num: 2, label: "Schedule", icon: CalendarIcon },
            { num: 3, label: "Confirm", icon: CheckCircle },
          ].map((s) => (
            <div key={s.num} className="flex flex-col items-center flex-1">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-colors ${
                  step >= s.num
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                <s.icon className="h-5 w-5" />
              </div>
              <span className={`text-xs font-medium ${step >= s.num ? "text-foreground" : "text-muted-foreground"}`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          {/* Step 1: Select Vehicle & Service */}
          {step === 1 && (
            <div className="space-y-6">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Select Vehicle</CardTitle>
                  <CardDescription>Choose which vehicle needs service</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="vehicle">Your Vehicles</Label>
                    {vehicles.length > 0 && (
                      <div className="mb-3 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                        <p className="text-sm font-medium text-primary mb-2">⚡ Quick Select - Saved Vehicles</p>
                        <div className="grid grid-cols-1 gap-2">
                          {vehicles.slice(0, 3).map((vehicle: any) => (
                            <Button
                              key={vehicle.id}
                              type="button"
                              variant="outline"
                              className={`justify-start h-auto py-3 ${
                                form.watch("vehicleId") === vehicle.id
                                  ? "border-primary bg-primary/10"
                                  : "border-border hover:border-primary/50"
                              }`}
                              onClick={() => form.setValue("vehicleId", vehicle.id)}
                            >
                              <Car className="h-4 w-4 mr-2 flex-shrink-0" />
                              <span className="text-left">{vehicle.label}</span>
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                    <Select onValueChange={(value) => form.setValue("vehicleId", value)} disabled={loading}>
                      <SelectTrigger id="vehicle" className="w-full">
                        <SelectValue placeholder={loading ? "Loading vehicles..." : vehicles.length === 0 ? "No vehicles found" : "Or select from all vehicles"} />
                      </SelectTrigger>
                      <SelectContent>
                        {vehicles.length === 0 && !loading ? (
                          <div className="p-4 text-center text-muted-foreground">
                            <Car className="h-8 w-8 mx-auto mb-2" />
                            <p className="text-sm">No vehicles registered</p>
                            <p className="text-xs">Please register a vehicle first</p>
                          </div>
                        ) : (
                          vehicles.map((vehicle: any) => (
                            <SelectItem key={vehicle.id} value={vehicle.id}>
                              <div className="flex items-center gap-2">
                                <Car className="h-4 w-4" />
                                {vehicle.label}
                              </div>
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    {form.formState.errors.vehicleId && (
                      <p className="text-sm text-destructive">{form.formState.errors.vehicleId.message}</p>
                    )}
                    {vehicles.length === 0 && !loading && (
                      <div className="mt-2 p-3 bg-muted/50 rounded-lg border border-border">
                        <p className="text-sm text-muted-foreground mb-2">No vehicles found in your account.</p>
                        <Link to="/vehicle/register">
                          <Button size="sm" variant="outline">
                            <Car className="h-4 w-4 mr-2" />
                            Register Vehicle
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {serviceCenters.length > 0 && (
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle>Select Service Center</CardTitle>
                    <CardDescription>Choose your preferred service center</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="serviceCenter">Available Service Centers</Label>
                      <Select onValueChange={(value) => form.setValue("serviceCenterId", value)} disabled={loading}>
                        <SelectTrigger id="serviceCenter" className="w-full">
                          <SelectValue placeholder={loading ? "Loading service centers..." : "Select a service center"} />
                        </SelectTrigger>
                        <SelectContent>
                          {serviceCenters.map((center: any) => (
                            <SelectItem key={center._id} value={center._id}>
                              <div className="flex flex-col">
                                <span className="font-medium">{center.name}</span>
                                {center.address && <span className="text-xs text-muted-foreground">{center.address}</span>}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {form.formState.errors.serviceCenterId && (
                        <p className="text-sm text-destructive">{form.formState.errors.serviceCenterId.message}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Select Service Type</CardTitle>
                  <CardDescription>Choose the service you need</CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    onValueChange={(value) => form.setValue("serviceType", value)}
                    className="space-y-3"
                  >
                    {serviceTypes.map((service) => (
                      <div
                        key={service.id}
                        className={`flex items-start space-x-3 p-4 rounded-lg border-2 transition-colors cursor-pointer ${
                          form.watch("serviceType") === service.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <RadioGroupItem value={service.id} id={service.id} className="mt-1" />
                        <label htmlFor={service.id} className="flex-1 cursor-pointer">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-foreground">{service.name}</h3>
                            <div className="flex items-center gap-3">
                              <Badge variant="outline" className="border-border">
                                <Clock className="h-3 w-3 mr-1" />
                                {service.duration}
                              </Badge>
                              <Badge className="bg-secondary text-secondary-foreground">
                                <DollarSign className="h-3 w-3" />
                                {service.price.replace('$', '')}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">{service.description}</p>
                        </label>
                      </div>
                    ))}
                  </RadioGroup>
                  {form.formState.errors.serviceType && (
                    <p className="text-sm text-destructive mt-2">{form.formState.errors.serviceType.message}</p>
                  )}

                  <div className="mt-6 space-y-2">
                    <Label htmlFor="description">Additional Notes (Optional)</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe any specific issues or requirements..."
                      rows={3}
                      maxLength={500}
                      {...form.register("description")}
                    />
                    <p className="text-xs text-muted-foreground">
                      {form.watch("description")?.length || 0}/500 characters
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 2: Select Date & Time */}
          {step === 2 && (
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Choose Date & Time</CardTitle>
                <CardDescription>Select your preferred appointment slot</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Select Date</Label>
                    <Calendar
                      mode="single"
                      selected={form.watch("preferredDate")}
                      onSelect={(date) => date && form.setValue("preferredDate", date)}
                      disabled={(date) => date < new Date() || date.getDay() === 0}
                      className="rounded-lg border border-border"
                    />
                    {form.formState.errors.preferredDate && (
                      <p className="text-sm text-destructive">{form.formState.errors.preferredDate.message}</p>
                    )}
                    <p className="text-xs text-muted-foreground">Sundays are closed</p>
                  </div>

                  <div className="space-y-2">
                    <Label>Select Time Slot</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {timeSlots.map((slot) => (
                        <div key={slot.value} className="relative">
                          <Button
                            type="button"
                            variant={form.watch("timeSlot") === slot.value ? "default" : "outline"}
                            className={`w-full ${
                              form.watch("timeSlot") === slot.value
                                ? "bg-primary text-primary-foreground"
                                : "border-border"
                            } ${!slot.available ? "opacity-50 cursor-not-allowed" : ""}`}
                            onClick={() => slot.available && form.setValue("timeSlot", slot.value)}
                            disabled={!slot.available}
                          >
                            <Clock className="h-4 w-4 mr-2" />
                            {slot.label}
                          </Button>
                          {slot.available && slot.booked > 0 && (
                            <Badge className="absolute -top-2 -right-2 h-5 px-1.5 text-xs bg-orange-500 text-white border-0">
                              {slot.booked}
                            </Badge>
                          )}
                          {!slot.available && (
                            <Badge className="absolute -top-2 -right-2 h-5 px-1.5 text-xs bg-red-500 text-white border-0">
                              Full
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                    {form.formState.errors.timeSlot && (
                      <p className="text-sm text-destructive">{form.formState.errors.timeSlot.message}</p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2">
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded bg-muted border border-border" />
                        <span>Unavailable</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded bg-primary" />
                        <span>Available</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Review & Confirm */}
          {step === 3 && (
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Review Your Booking</CardTitle>
                <CardDescription>Please confirm your appointment details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between p-4 bg-muted/30 rounded-lg">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Vehicle</p>
                      <p className="font-semibold text-foreground">
                        {vehicles.find(v => v.id === form.watch("vehicleId"))?.label}
                      </p>
                    </div>
                    <Car className="h-5 w-5 text-muted-foreground" />
                  </div>

                  {selectedCenter && (
                    <div className="flex items-start justify-between p-4 bg-muted/30 rounded-lg">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Service Center</p>
                        <p className="font-semibold text-foreground">{selectedCenter.name}</p>
                        {selectedCenter.address && (
                          <p className="text-sm text-muted-foreground">{selectedCenter.address}</p>
                        )}
                      </div>
                      <Wrench className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}

                  <div className="flex items-start justify-between p-4 bg-muted/30 rounded-lg">
                    <div className="space-y-1 flex-1">
                      <p className="text-sm text-muted-foreground">Service</p>
                      <p className="font-semibold text-foreground">{selectedService?.name}</p>
                      <p className="text-sm text-muted-foreground">{selectedService?.description}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <Badge variant="outline" className="border-border">
                          <Clock className="h-3 w-3 mr-1" />
                          {selectedService?.duration}
                        </Badge>
                        <Badge className="bg-secondary text-secondary-foreground">
                          {selectedService?.price}
                        </Badge>
                      </div>
                    </div>
                    <Wrench className="h-5 w-5 text-muted-foreground" />
                  </div>

                  <div className="flex items-start justify-between p-4 bg-muted/30 rounded-lg">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Date & Time</p>
                      <p className="font-semibold text-foreground">
                        {form.watch("preferredDate") && format(form.watch("preferredDate"), "MMMM dd, yyyy")}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {timeSlots.find(t => t.value === form.watch("timeSlot"))?.label}
                      </p>
                    </div>
                    <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                  </div>

                  {form.watch("description") && (
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Additional Notes</p>
                      <p className="text-sm text-foreground">{form.watch("description")}</p>
                    </div>
                  )}
                </div>

                <div className="border-t border-border pt-4">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span className="text-foreground">Estimated Total</span>
                    <span className="text-secondary">{selectedService?.price}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Final price may vary based on actual work required
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep(step - 1)}
              disabled={step === 1}
              className="border-border"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>

            {step < 3 ? (
              <Button
                type="button"
                onClick={nextStep}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button type="submit" className="bg-success hover:bg-success/90 text-white">
                <CheckCircle className="mr-2 h-4 w-4" />
                Confirm Booking
              </Button>
            )}
          </div>
        </form>

        {/* Success Confirmation Modal */}
        {showConfirmation && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="max-w-md w-full border-border animate-in fade-in zoom-in duration-300">
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-10 w-10 text-success" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">✅ Booking Confirmed!</h2>
                <p className="text-muted-foreground mb-4">Your service appointment has been scheduled successfully</p>
                
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-4">
                  <p className="text-sm text-muted-foreground mb-1">Confirmation Number</p>
                  <p className="text-2xl font-bold text-primary font-mono">{bookingNumber}</p>
                </div>

                <div className="space-y-2 text-sm text-left mb-6">
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Service:</span>
                    <span className="font-medium text-foreground">{selectedService?.name}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Date:</span>
                    <span className="font-medium text-foreground">
                      {form.watch("preferredDate") && format(form.watch("preferredDate"), "MMM dd, yyyy")}
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground">Time:</span>
                    <span className="font-medium text-foreground">
                      {timeSlots.find(t => t.value === form.watch("timeSlot"))?.label}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => navigate("/customer")}
                    className="flex-1 bg-primary hover:bg-primary/90"
                  >
                    Go to Dashboard
                  </Button>
                  <Button
                    onClick={() => window.print()}
                    variant="outline"
                    className="flex-1"
                  >
                    Print Confirmation
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceBooking;
