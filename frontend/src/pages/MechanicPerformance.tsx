import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Star, 
  Clock, 
  Wrench, 
  TrendingUp, 
  Award, 
  Users, 
  ArrowLeft,
  CheckCircle,
  Target,
  Loader2
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

const MechanicPerformance = () => {
  const { toast } = useToast();
  const [mechanics, setMechanics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMechanics();
    const interval = setInterval(loadMechanics, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadMechanics = async () => {
    try {
      const token = localStorage.getItem('token');
      const userRole = localStorage.getItem('userRole');
      if (!token) return;

      // Admin sees all mechanics, service centers see their own
      const response = userRole === 'admin' 
        ? await api.getAdminMechanics(token)
        : await api.getMechanicsPerformance(token);
      
      if (response.success) {
        setMechanics(userRole === 'admin' ? response.data : response.data.individuals || []);
      }
    } catch (error) {
      console.error('Load mechanics error:', error);
      toast({
        title: "Error",
        description: "Failed to load mechanic data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const teamStats = {
    totalJobs: mechanics.reduce((sum, m) => sum + (m.totalJobs || 0), 0),
    avgRating: mechanics.length > 0 ? (mechanics.reduce((sum, m) => sum + (m.avgRating || 0), 0) / mechanics.length).toFixed(1) : '0',
    avgOnTimeRate: mechanics.length > 0 ? Math.round(mechanics.reduce((sum, m) => sum + (m.onTimeRate || 0), 0) / mechanics.length) : 0,
    avgSatisfaction: mechanics.length > 0 ? Math.round(mechanics.reduce((sum, m) => sum + (m.satisfaction || 0), 0) / mechanics.length) : 0,
  };

  const monthlyComparison = [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link to="/admin" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Admin Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-card-foreground">Mechanic Performance</h1>
          <p className="text-muted-foreground mt-1">Track and analyze team performance metrics</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Team Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Wrench className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{teamStats.totalJobs}</p>
                  <p className="text-sm text-muted-foreground">Total Jobs</p>
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
                  <p className="text-2xl font-bold text-foreground">{teamStats.avgRating}</p>
                  <p className="text-sm text-muted-foreground">Avg Rating</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-success/10">
                  <Clock className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{teamStats.avgOnTimeRate}%</p>
                  <p className="text-sm text-muted-foreground">On-Time Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent/10">
                  <Award className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{teamStats.avgSatisfaction}%</p>
                  <p className="text-sm text-muted-foreground">Satisfaction</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Team Comparison Chart */}
        {monthlyComparison.length > 0 && (
          <Card className="border-border mb-8">
            <CardHeader>
              <CardTitle>Monthly Job Completion Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyComparison}>
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
                  <Bar dataKey="mike" name="Mike Johnson" fill="hsl(210, 85%, 28%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="sarah" name="Sarah Williams" fill="hsl(185, 70%, 45%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="david" name="David Chen" fill="hsl(25, 95%, 53%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="alex" name="Alex Turner" fill="hsl(145, 65%, 45%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Individual Mechanic Cards */}
        <h2 className="text-2xl font-bold text-foreground mb-6">Individual Performance</h2>
        {mechanics.length === 0 ? (
          <Card className="border-border">
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No mechanics found. Add team members to see performance data.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mechanics.map((mechanic) => (
              <Card key={mechanic.id} className="border-border">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-xl font-bold text-primary">
                      {mechanic.name.split(' ').map((n: string) => n[0]).join('')}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{mechanic.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{mechanic.role}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Star className="h-4 w-4 fill-warning text-warning" />
                        <span className="font-medium text-foreground">{(mechanic.avgRating || mechanic.rating || 0).toFixed(1)}</span>
                        <span className="text-muted-foreground text-sm">({mechanic.totalJobs || mechanic.completedJobs || 0} jobs)</span>
                      </div>
                    </div>
                  </div>
                  <Badge className="bg-success/10 text-success border-0">
                    {mechanic.satisfaction || mechanic.customerSatisfaction || 0}% Satisfaction
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 rounded-lg bg-muted/50">
                    <CheckCircle className="h-5 w-5 text-success mx-auto mb-1" />
                    <p className="text-lg font-bold text-foreground">{mechanic.totalJobs || mechanic.completedJobs || 0}</p>
                    <p className="text-xs text-muted-foreground">Completed</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <Clock className="h-5 w-5 text-accent mx-auto mb-1" />
                    <p className="text-lg font-bold text-foreground">{mechanic.avgTime || mechanic.avgServiceTime || '0.0'}</p>
                    <p className="text-xs text-muted-foreground">Avg Time</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <Target className="h-5 w-5 text-secondary mx-auto mb-1" />
                    <p className="text-lg font-bold text-foreground">{mechanic.efficiency || 0}%</p>
                    <p className="text-xs text-muted-foreground">Efficiency</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        )}
      </div>
    </div>
  );
};

export default MechanicPerformance;