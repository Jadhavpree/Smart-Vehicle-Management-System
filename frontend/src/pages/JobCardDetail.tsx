import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Car, 
  User, 
  Calendar, 
  Clock,
  Wrench,
  Package,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  FileText
} from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const JobCardDetail = () => {
  const { toast } = useToast();
  const [progress, setProgress] = useState(65);
  
  const jobCard = {
    id: "JC-2024-001",
    vehicle: "Toyota Camry - ABC-1234",
    customer: "John Doe",
    customerPhone: "+1 (555) 123-4567",
    customerEmail: "john.doe@email.com",
    service: "Full Service",
    startDate: "2024-03-10",
    estimatedCompletion: "2024-03-11",
    mechanic: "Mike Johnson",
    status: "In Progress",
    mileage: "45,230 km"
  };

  const [tasks, setTasks] = useState([
    { id: 1, name: "Engine oil change", completed: true, time: "30 min" },
    { id: 2, name: "Oil filter replacement", completed: true, time: "15 min" },
    { id: 3, name: "Brake inspection", completed: true, time: "20 min" },
    { id: 4, name: "Tire rotation", completed: false, time: "25 min" },
    { id: 5, name: "Fluid level check", completed: false, time: "10 min" },
    { id: 6, name: "Battery test", completed: false, time: "15 min" },
  ]);

  const [parts, setParts] = useState([
    { id: 1, name: "Engine Oil (5W-30)", quantity: 5, unit: "liters", price: 8.99 },
    { id: 2, name: "Oil Filter", quantity: 1, unit: "piece", price: 12.50 },
    { id: 3, name: "Air Filter", quantity: 1, unit: "piece", price: 22.50 },
  ]);

  const [notes, setNotes] = useState([
    { id: 1, timestamp: "2024-03-10 09:15", author: "Mike Johnson", text: "Started full service. Initial inspection completed." },
    { id: 2, timestamp: "2024-03-10 10:30", author: "Mike Johnson", text: "Oil and filter changed. Minor brake pad wear noticed - within acceptable limits." },
  ]);

  const toggleTask = (taskId: number) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
    
    const completedCount = tasks.filter(t => t.completed).length;
    const newProgress = Math.round((completedCount / tasks.length) * 100);
    setProgress(newProgress);
  };

  const updateStatus = (status: string) => {
    toast({
      title: "Status Updated",
      description: `Job card status changed to ${status}`,
    });
  };

  const completedTasks = tasks.filter(t => t.completed).length;
  const totalLabor = tasks.reduce((sum, task) => sum + parseFloat(task.time), 0);
  const totalParts = parts.reduce((sum, part) => sum + (part.quantity * part.price), 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link to="/service-center" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
              <h1 className="text-3xl font-bold text-card-foreground">Job Card: {jobCard.id}</h1>
              <p className="text-muted-foreground mt-1">{jobCard.service}</p>
            </div>
            <div className="flex gap-2">
              <Select onValueChange={updateStatus} defaultValue={jobCard.status}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="On Hold">On Hold</SelectItem>
                </SelectContent>
              </Select>
              <Button className="bg-success hover:bg-success/90 text-white">
                <FileText className="mr-2 h-4 w-4" />
                Generate Invoice
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Overview */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Work Progress</CardTitle>
                <CardDescription>
                  {completedTasks} of {tasks.length} tasks completed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Overall Progress</span>
                    <span className="font-medium text-foreground">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-3" />
                </div>
              </CardContent>
            </Card>

            {/* Tasks Checklist */}
            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Service Tasks</CardTitle>
                    <CardDescription>Track completion of service procedures</CardDescription>
                  </div>
                  <Button size="sm" variant="outline" className="border-border">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Task
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                        task.completed
                          ? "bg-success/5 border-success/20"
                          : "bg-card border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <Checkbox
                          checked={task.completed}
                          onCheckedChange={() => toggleTask(task.id)}
                          className={task.completed ? "border-success data-[state=checked]:bg-success" : ""}
                        />
                        <div className="flex-1">
                          <p className={`font-medium ${task.completed ? "text-muted-foreground line-through" : "text-foreground"}`}>
                            {task.name}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="border-border">
                          <Clock className="h-3 w-3 mr-1" />
                          {task.time}
                        </Badge>
                        {task.completed && (
                          <CheckCircle className="h-5 w-5 text-success" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Parts Used */}
            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Parts & Materials</CardTitle>
                    <CardDescription>Spare parts used in this service</CardDescription>
                  </div>
                  <Button size="sm" variant="outline" className="border-border">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Part
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {parts.map((part) => (
                    <div key={part.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                      <div className="flex items-center gap-3 flex-1">
                        <Package className="h-5 w-5 text-primary" />
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{part.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {part.quantity} {part.unit} × ${part.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-foreground">${(part.quantity * part.price).toFixed(2)}</span>
                        <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Separator />
                  <div className="flex justify-between items-center pt-2">
                    <span className="font-semibold text-foreground">Total Parts Cost</span>
                    <span className="text-lg font-bold text-secondary">${totalParts.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Service Notes */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Service Notes</CardTitle>
                <CardDescription>Timeline of updates and observations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {notes.map((note) => (
                    <div key={note.id} className="p-3 rounded-lg bg-muted/30">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-foreground">{note.author}</span>
                        <span className="text-xs text-muted-foreground">{note.timestamp}</span>
                      </div>
                      <p className="text-sm text-foreground">{note.text}</p>
                    </div>
                  ))}
                </div>
                <div className="space-y-2 pt-4 border-t border-border">
                  <Label htmlFor="newNote">Add Note</Label>
                  <Textarea
                    id="newNote"
                    placeholder="Enter service observations, findings, or updates..."
                    rows={3}
                  />
                  <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    Add Note
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Summary */}
          <div className="space-y-6">
            {/* Vehicle & Customer Info */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-lg">Job Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Car className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">Vehicle</p>
                      <p className="font-medium text-foreground">{jobCard.vehicle}</p>
                      <p className="text-xs text-muted-foreground mt-1">Mileage: {jobCard.mileage}</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-start gap-3">
                    <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">Customer</p>
                      <p className="font-medium text-foreground">{jobCard.customer}</p>
                      <p className="text-xs text-muted-foreground mt-1">{jobCard.customerPhone}</p>
                      <p className="text-xs text-muted-foreground">{jobCard.customerEmail}</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-start gap-3">
                    <Wrench className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">Assigned Mechanic</p>
                      <p className="font-medium text-foreground">{jobCard.mechanic}</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">Timeline</p>
                      <p className="text-sm font-medium text-foreground">Started: {jobCard.startDate}</p>
                      <p className="text-sm font-medium text-foreground">Est. Complete: {jobCard.estimatedCompletion}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cost Summary */}
            <Card className="border-border border-2 border-secondary/20">
              <CardHeader>
                <CardTitle className="text-lg">Cost Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Labor</span>
                    <span className="font-medium text-foreground">$120.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Parts</span>
                    <span className="font-medium text-foreground">${totalParts.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax (10%)</span>
                    <span className="font-medium text-foreground">${((120 + totalParts) * 0.1).toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-lg font-bold text-foreground">Total</span>
                    <span className="text-2xl font-bold text-secondary">
                      ${((120 + totalParts) * 1.1).toFixed(2)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Status Alert */}
            <Card className="border-warning/50 bg-warning/5">
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <AlertCircle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">Pending Approval</p>
                    <p className="text-xs text-muted-foreground">
                      Customer needs to approve additional brake pad replacement ($85)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCardDetail;