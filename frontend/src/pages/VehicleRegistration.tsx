import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Car, FileText, Upload, CheckCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

const vehicleSchema = z.object({
  make: z.string().min(1, "Vehicle make is required").max(50, "Make name too long"),
  model: z.string().min(1, "Vehicle model is required").max(50, "Model name too long"),
  year: z.string().regex(/^\d{4}$/, "Invalid year format"),
  vin: z.string().length(17, "VIN must be exactly 17 characters").regex(/^[A-HJ-NPR-Z0-9]+$/, "Invalid VIN format"),
  licensePlate: z.string().min(2, "License plate required").max(15, "License plate too long"),
  color: z.string().min(1, "Color is required"),
  mileage: z.string().regex(/^\d+$/, "Mileage must be a number"),
  engineType: z.string().min(1, "Engine type is required"),
  transmissionType: z.string().min(1, "Transmission type is required"),
  fuelType: z.string().min(1, "Fuel type is required"),
  notes: z.string().max(500, "Notes too long").optional(),
});

type VehicleForm = z.infer<typeof vehicleSchema>;

const VehicleRegistration = () => {
  const [step, setStep] = useState(1);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const form = useForm<VehicleForm>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      notes: "",
    },
  });

  const onSubmit = async (data: VehicleForm) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Not authenticated');
      }

      const vehicleData = {
        ...data,
        year: parseInt(data.year),
        mileage: parseInt(data.mileage)
      };
      
      const response = await api.addVehicle(token, vehicleData);
      
      if (response.success) {
        toast({
          title: "Vehicle Registered Successfully",
          description: "Your vehicle has been added to your account.",
        });
        navigate("/customer");
      } else {
        toast({
          title: "Registration Failed",
          description: response.message || "Failed to register vehicle.",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to register vehicle.",
        variant: "destructive"
      });
    }
  };

  const nextStep = async () => {
    let fieldsToValidate: (keyof VehicleForm)[] = [];
    
    if (step === 1) {
      fieldsToValidate = ["make", "model", "year", "vin"];
    } else if (step === 2) {
      fieldsToValidate = ["licensePlate", "color", "mileage"];
    }

    const result = await form.trigger(fieldsToValidate);
    if (result) {
      setStep(step + 1);
    }
  };

  const progress = (step / 4) * 100;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link to="/customer" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-card-foreground">Register New Vehicle</h1>
          <p className="text-muted-foreground mt-1">Add your vehicle details to start booking services</p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Step {step} of 4</span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Indicators */}
        <div className="flex justify-between mb-8">
          {[
            { num: 1, label: "Basic Info", icon: Car },
            { num: 2, label: "Details", icon: FileText },
            { num: 3, label: "Specifications", icon: FileText },
            { num: 4, label: "Review", icon: CheckCircle },
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
          {/* Step 1: Basic Information */}
          {step === 1 && (
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Basic Vehicle Information</CardTitle>
                <CardDescription>Enter the fundamental details about your vehicle</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="make">Vehicle Make *</Label>
                    <Input
                      id="make"
                      placeholder="e.g., Toyota, Honda, Ford"
                      {...form.register("make")}
                    />
                    {form.formState.errors.make && (
                      <p className="text-sm text-destructive">{form.formState.errors.make.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="model">Vehicle Model *</Label>
                    <Input
                      id="model"
                      placeholder="e.g., Camry, Civic, F-150"
                      {...form.register("model")}
                    />
                    {form.formState.errors.model && (
                      <p className="text-sm text-destructive">{form.formState.errors.model.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="year">Year *</Label>
                    <Input
                      id="year"
                      placeholder="e.g., 2022"
                      {...form.register("year")}
                    />
                    {form.formState.errors.year && (
                      <p className="text-sm text-destructive">{form.formState.errors.year.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="vin">VIN (Vehicle Identification Number) *</Label>
                    <Input
                      id="vin"
                      placeholder="17-character VIN"
                      maxLength={17}
                      {...form.register("vin")}
                      className="uppercase"
                    />
                    {form.formState.errors.vin && (
                      <p className="text-sm text-destructive">{form.formState.errors.vin.message}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Find this on your vehicle's dashboard or registration documents
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Vehicle Details */}
          {step === 2 && (
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Vehicle Details</CardTitle>
                <CardDescription>Provide additional identification information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="licensePlate">License Plate Number *</Label>
                    <Input
                      id="licensePlate"
                      placeholder="e.g., ABC-1234"
                      {...form.register("licensePlate")}
                      className="uppercase"
                    />
                    {form.formState.errors.licensePlate && (
                      <p className="text-sm text-destructive">{form.formState.errors.licensePlate.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="color">Vehicle Color *</Label>
                    <Input
                      id="color"
                      placeholder="e.g., Black, White, Silver"
                      {...form.register("color")}
                    />
                    {form.formState.errors.color && (
                      <p className="text-sm text-destructive">{form.formState.errors.color.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mileage">Current Mileage (km) *</Label>
                    <Input
                      id="mileage"
                      type="number"
                      placeholder="e.g., 45000"
                      {...form.register("mileage")}
                    />
                    {form.formState.errors.mileage && (
                      <p className="text-sm text-destructive">{form.formState.errors.mileage.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="documents">Upload Documents (Optional)</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-1">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Registration, insurance, or inspection documents (PDF, JPG, PNG up to 10MB)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Specifications */}
          {step === 3 && (
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Technical Specifications</CardTitle>
                <CardDescription>Engine and transmission details for better service</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="engineType">Engine Type *</Label>
                    <Select onValueChange={(value) => form.setValue("engineType", value)}>
                      <SelectTrigger id="engineType">
                        <SelectValue placeholder="Select engine type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="inline-4">Inline-4</SelectItem>
                        <SelectItem value="v6">V6</SelectItem>
                        <SelectItem value="v8">V8</SelectItem>
                        <SelectItem value="electric">Electric</SelectItem>
                        <SelectItem value="hybrid">Hybrid</SelectItem>
                        <SelectItem value="diesel">Diesel</SelectItem>
                      </SelectContent>
                    </Select>
                    {form.formState.errors.engineType && (
                      <p className="text-sm text-destructive">{form.formState.errors.engineType.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="transmissionType">Transmission Type *</Label>
                    <Select onValueChange={(value) => form.setValue("transmissionType", value)}>
                      <SelectTrigger id="transmissionType">
                        <SelectValue placeholder="Select transmission" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="automatic">Automatic</SelectItem>
                        <SelectItem value="manual">Manual</SelectItem>
                        <SelectItem value="cvt">CVT</SelectItem>
                        <SelectItem value="dual-clutch">Dual-Clutch</SelectItem>
                      </SelectContent>
                    </Select>
                    {form.formState.errors.transmissionType && (
                      <p className="text-sm text-destructive">{form.formState.errors.transmissionType.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fuelType">Fuel Type *</Label>
                    <Select onValueChange={(value) => form.setValue("fuelType", value)}>
                      <SelectTrigger id="fuelType">
                        <SelectValue placeholder="Select fuel type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gasoline">Gasoline</SelectItem>
                        <SelectItem value="diesel">Diesel</SelectItem>
                        <SelectItem value="electric">Electric</SelectItem>
                        <SelectItem value="hybrid">Hybrid</SelectItem>
                        <SelectItem value="plug-in-hybrid">Plug-in Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                    {form.formState.errors.fuelType && (
                      <p className="text-sm text-destructive">{form.formState.errors.fuelType.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any special modifications, known issues, or service preferences..."
                    rows={4}
                    maxLength={500}
                    {...form.register("notes")}
                  />
                  <p className="text-xs text-muted-foreground">
                    {form.watch("notes")?.length || 0}/500 characters
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Review */}
          {step === 4 && (
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Review & Confirm</CardTitle>
                <CardDescription>Please verify all information before submitting</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-foreground">Basic Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Make:</span>
                        <span className="font-medium text-foreground">{form.watch("make")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Model:</span>
                        <span className="font-medium text-foreground">{form.watch("model")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Year:</span>
                        <span className="font-medium text-foreground">{form.watch("year")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">VIN:</span>
                        <span className="font-medium text-foreground font-mono">{form.watch("vin")}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-foreground">Vehicle Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">License Plate:</span>
                        <span className="font-medium text-foreground">{form.watch("licensePlate")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Color:</span>
                        <span className="font-medium text-foreground">{form.watch("color")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Mileage:</span>
                        <span className="font-medium text-foreground">{form.watch("mileage")} km</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 md:col-span-2">
                    <h3 className="font-semibold text-foreground">Specifications</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Engine:</span>
                        <span className="font-medium text-foreground">{form.watch("engineType")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Transmission:</span>
                        <span className="font-medium text-foreground">{form.watch("transmissionType")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Fuel Type:</span>
                        <span className="font-medium text-foreground">{form.watch("fuelType")}</span>
                      </div>
                    </div>
                  </div>

                  {form.watch("notes") && (
                    <div className="space-y-2 md:col-span-2">
                      <h3 className="font-semibold text-foreground">Notes</h3>
                      <p className="text-sm text-muted-foreground">{form.watch("notes")}</p>
                    </div>
                  )}
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

            {step < 4 ? (
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
                Register Vehicle
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default VehicleRegistration;
