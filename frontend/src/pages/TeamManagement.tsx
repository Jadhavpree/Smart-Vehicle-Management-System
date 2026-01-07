import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Plus, ArrowLeft, Wrench, Edit, Trash2, Award } from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const TeamManagement = () => {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'mechanic',
    specialization: [],
    employeeId: '',
    hourlyRate: 50,
    certifications: []
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchTeam();
    // Auto-refresh every 10 seconds for real-time updates
    const interval = setInterval(fetchTeam, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchTeam = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await api.getTeamMembers(token);
        setTeam(response.success ? response.data : []);
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to load team", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.name.trim()) {
      toast({ title: "Validation Error", description: "Name is required", variant: "destructive" });
      return;
    }
    if (!formData.email.trim()) {
      toast({ title: "Validation Error", description: "Email is required", variant: "destructive" });
      return;
    }
    if (!formData.phone.trim()) {
      toast({ title: "Validation Error", description: "Phone is required", variant: "destructive" });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      if (editingMember) {
        await api.updateTeamMember(token, editingMember._id, formData);
        toast({ title: "Success", description: "Team member updated" });
      } else {
        await api.addTeamMember(token, formData);
        toast({ title: "Success", description: "Team member added" });
      }

      setDialogOpen(false);
      resetForm();
      fetchTeam();
    } catch (error: any) {
      const errorMsg = error?.message || "Operation failed";
      toast({ title: "Error", description: errorMsg, variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this team member?')) return;
    
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await api.deleteTeamMember(token, id);
        toast({ title: "Success", description: "Team member removed" });
        fetchTeam();
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete", variant: "destructive" });
    }
  };

  const handleStatusChange = async (memberId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await api.updateTeamMemberStatus(token, memberId, newStatus);
        toast({ title: "Success", description: "Status updated" });
        fetchTeam();
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
    }
  };

  const handleEdit = (member: any) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      email: member.email,
      phone: member.phone,
      role: member.role,
      specialization: member.specialization || [],
      employeeId: member.employeeId || '',
      hourlyRate: member.hourlyRate,
      certifications: member.certifications || []
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setEditingMember(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'mechanic',
      specialization: [],
      employeeId: '',
      hourlyRate: 50,
      certifications: []
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link to="/service-center" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-card-foreground">Team Management</h1>
              <p className="text-muted-foreground mt-1">Manage your mechanics and staff</p>
            </div>
            <Dialog open={dialogOpen} onOpenChange={(open) => {
              setDialogOpen(open);
              if (!open) resetForm();
            }}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Team Member
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{editingMember ? 'Edit' : 'Add'} Team Member</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Full Name *</Label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Employee ID</Label>
                      <Input
                        value={formData.employeeId}
                        onChange={(e) => setFormData({...formData, employeeId: e.target.value})}
                        placeholder="EMP-001"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Email *</Label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="john@example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone *</Label>
                      <Input
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        placeholder="+1234567890"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Role *</Label>
                      <Select value={formData.role} onValueChange={(value) => setFormData({...formData, role: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mechanic">Mechanic</SelectItem>
                          <SelectItem value="technician">Technician</SelectItem>
                          <SelectItem value="service_advisor">Service Advisor</SelectItem>
                          <SelectItem value="manager">Manager</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Hourly Rate ($)</Label>
                      <Input
                        type="number"
                        value={formData.hourlyRate}
                        onChange={(e) => setFormData({...formData, hourlyRate: parseFloat(e.target.value)})}
                      />
                    </div>
                  </div>

                  <Button onClick={handleSubmit} className="w-full">
                    {editingMember ? 'Update' : 'Add'} Team Member
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Team Members ({team.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Loading team...</p>
              </div>
            ) : team.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Team Members</h3>
                <p className="text-muted-foreground mb-4">Add your first team member to get started</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {team.map((member: any) => (
                  <Card key={member._id} className="border-border">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                              <Wrench className="h-6 w-6 text-primary" />
                            </div>
                            {/* Real-time status indicator */}
                            <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                              member.status === 'available' ? 'bg-green-500' :
                              member.status === 'busy' ? 'bg-red-500' :
                              member.status === 'on_break' ? 'bg-yellow-500' :
                              member.status === 'offline' ? 'bg-gray-400' :
                              'bg-blue-500'
                            }`} />
                          </div>
                          <div>
                            <h3 className="font-bold text-foreground">{member.name}</h3>
                            <p className="text-sm text-muted-foreground capitalize">{member.role.replace('_', ' ')}</p>
                          </div>
                        </div>
                        <Badge className={
                          member.status === 'available' ? 'bg-green-500/10 text-green-600 border-0' :
                          member.status === 'busy' ? 'bg-red-500/10 text-red-600 border-0' :
                          member.status === 'on_break' ? 'bg-yellow-500/10 text-yellow-600 border-0' :
                          member.status === 'offline' ? 'bg-gray-500/10 text-gray-600 border-0' :
                          'bg-blue-500/10 text-blue-600 border-0'
                        }>
                          {member.status === 'available' ? '🟢 Available' :
                           member.status === 'busy' ? '🔴 Busy' :
                           member.status === 'on_break' ? '🟡 On Break' :
                           member.status === 'offline' ? '⚫ Offline' :
                           member.status}
                        </Badge>
                      </div>

                      <div className="space-y-2 text-sm mb-4">
                        <div>
                          <p className="text-muted-foreground">Email</p>
                          <p className="text-foreground">{member.email}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Phone</p>
                          <p className="text-foreground">{member.phone}</p>
                        </div>
                        {member.employeeId && (
                          <div>
                            <p className="text-muted-foreground">Employee ID</p>
                            <p className="text-foreground font-mono">{member.employeeId}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-muted-foreground">Hourly Rate</p>
                          <p className="text-foreground font-bold">${member.hourlyRate}/hr</p>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-4 border-t border-border">
                        <Select value={member.status} onValueChange={(value) => handleStatusChange(member._id, value)}>
                          <SelectTrigger className="flex-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="available">🟢 Available</SelectItem>
                            <SelectItem value="busy">🔴 Busy</SelectItem>
                            <SelectItem value="on_break">🟡 On Break</SelectItem>
                            <SelectItem value="offline">⚫ Offline</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button size="sm" variant="outline" onClick={() => handleEdit(member)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDelete(member._id)} className="text-destructive hover:bg-destructive/10">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TeamManagement;
