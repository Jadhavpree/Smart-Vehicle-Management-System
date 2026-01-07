import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Car, 
  Wrench, 
  Calendar, 
  FileText, 
  Package, 
  BarChart3,
  ArrowRight,
  Gauge,
  Users,
  Shield,
  CheckCircle,
  Star,
  Zap,
  Clock,
  TrendingUp
} from "lucide-react";
import { Link } from "react-router-dom";
import UserNav from "@/components/UserNav";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
                <Gauge className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Smart Vehicle Management and Maintenance System</span>
            </div>
            <UserNav />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-28 pb-20 px-4 sm:px-6 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-secondary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        
        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-8 animate-fade-in">
            <Badge className="mb-6 bg-secondary/20 text-secondary border-secondary/30 px-4 py-1.5">
              <Zap className="h-3.5 w-3.5 mr-1.5" />
              Trusted by 500+ Service Centers
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 leading-tight">
              Smart Vehicle Management
              <span className="block bg-gradient-to-r from-secondary via-accent to-secondary bg-clip-text text-transparent">
                and Maintenance System
              </span>
            </h1>
            <p className="text-primary-foreground/80 text-lg sm:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
              The complete digital platform for booking, tracking, and managing vehicle maintenance with real-time updates and seamless workflows.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button size="lg" className="bg-gradient-to-r from-secondary to-accent hover:opacity-90 text-secondary-foreground shadow-xl shadow-secondary/30 w-full sm:w-auto group">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/customer">
                <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 backdrop-blur w-full sm:w-auto">
                  View Live Demo
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            {[
              { value: "10K+", label: "Services Completed", icon: CheckCircle },
              { value: "500+", label: "Service Centers", icon: Wrench },
              { value: "98%", label: "Customer Satisfaction", icon: Star },
              { value: "24/7", label: "Support Available", icon: Clock }
            ].map((stat, i) => (
              <div key={i} className="text-center p-4 rounded-xl bg-primary-foreground/5 backdrop-blur-sm border border-primary-foreground/10">
                <stat.icon className="h-5 w-5 text-secondary mx-auto mb-2" />
                <p className="text-2xl sm:text-3xl font-bold text-primary-foreground">{stat.value}</p>
                <p className="text-xs sm:text-sm text-primary-foreground/70">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 sm:px-6 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              Powerful Features
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Everything You Need to
              <span className="text-gradient"> Succeed</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Six powerful modules designed to streamline every aspect of your automotive service operations
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Car, title: "Vehicle Management", desc: "Complete vehicle profiles with VIN tracking and maintenance schedules", color: "primary" },
              { icon: Calendar, title: "Smart Booking", desc: "Online scheduling with real-time slots and SMS reminders", color: "accent" },
              { icon: Wrench, title: "Job Card System", desc: "Digital job cards with task assignment and progress tracking", color: "secondary" },
              { icon: Package, title: "Inventory Control", desc: "Real-time spare parts tracking with auto-reorder alerts", color: "primary" },
              { icon: FileText, title: "Digital Invoicing", desc: "Automated billing with payment gateway integration", color: "accent" },
              { icon: BarChart3, title: "Analytics Dashboard", desc: "Revenue reports, trends, and operational KPIs", color: "secondary" }
            ].map((feature, index) => (
              <Card 
                key={index} 
                className="group border-border hover:border-primary/40 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 overflow-hidden"
              >
                <CardContent className="p-6 relative">
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-${feature.color}/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-${feature.color}/10 transition-colors`} />
                  <div className={`relative w-12 h-12 rounded-xl bg-gradient-to-br from-${feature.color}/20 to-${feature.color}/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <feature.icon className={`h-6 w-6 text-${feature.color}`} />
                  </div>
                  <h3 className="font-bold text-lg text-card-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* User Portals */}
      <section className="py-20 px-4 sm:px-6 gradient-steel">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <Badge className="mb-4 bg-accent/10 text-accent border-accent/20">
              Role-Based Access
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Tailored For Every
              <span className="text-gradient-accent"> User</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Three distinct interfaces designed for customers, service centers, and administrators
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link to="/customer" className="block group">
              <Card className="h-full border-2 border-transparent hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-primary to-primary/50" />
                <CardContent className="p-8">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-bold text-xl text-card-foreground mb-2">Customer Portal</h3>
                  <p className="text-muted-foreground mb-6">Self-service platform for vehicle owners</p>
                  <ul className="space-y-3 mb-6">
                    {["Register vehicles", "Book services online", "Track progress", "View invoices"].map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-success" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground group-hover:shadow-lg transition-all">
                    Open Portal <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/service-center" className="block group">
              <Card className="h-full border-2 border-accent/30 hover:border-accent transition-all duration-300 hover:shadow-2xl hover:shadow-accent/10 overflow-hidden md:-translate-y-4">
                <div className="h-1 bg-gradient-to-r from-accent to-secondary" />
                <CardContent className="p-8 relative">
                  <Badge className="absolute top-4 right-4 bg-secondary text-secondary-foreground border-0">Popular</Badge>
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Wrench className="h-8 w-8 text-accent" />
                  </div>
                  <h3 className="font-bold text-xl text-card-foreground mb-2">Service Center</h3>
                  <p className="text-muted-foreground mb-6">Complete workshop management system</p>
                  <ul className="space-y-3 mb-6">
                    {["Manage job cards", "Track inventory", "Assign mechanics", "Generate invoices"].map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-success" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full bg-gradient-to-r from-accent to-secondary hover:opacity-90 text-primary-foreground shadow-lg group-hover:shadow-xl transition-all">
                    Open Dashboard <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/admin" className="block group">
              <Card className="h-full border-2 border-transparent hover:border-secondary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-secondary/10 overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-secondary to-secondary/50" />
                <CardContent className="p-8">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary/20 to-secondary/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Shield className="h-8 w-8 text-secondary" />
                  </div>
                  <h3 className="font-bold text-xl text-card-foreground mb-2">Admin Panel</h3>
                  <p className="text-muted-foreground mb-6">Full system control and oversight</p>
                  <ul className="space-y-3 mb-6">
                    {["User management", "System settings", "Analytics reports", "Full control"].map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-success" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground group-hover:shadow-lg transition-all">
                    Open Admin <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 bg-gradient-to-br from-primary via-primary to-accent">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur rounded-full px-4 py-2 mb-6">
            <TrendingUp className="h-4 w-4 text-secondary" />
            <span className="text-primary-foreground/90 text-sm">Boost your service efficiency by 40%</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-4">
            Ready to Transform Your Service Center?
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-8 max-w-xl mx-auto">
            Join thousands of service centers already using Smart Vehicle Management and Maintenance System to streamline their operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-xl w-full sm:w-auto">
                Start Your Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/service-center">
              <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 w-full sm:w-auto">
                See It In Action
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-4 sm:px-6 bg-card border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Gauge className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <span className="font-bold text-foreground">Smart Vehicle Management and Maintenance System</span>
                <p className="text-xs text-muted-foreground">Vehicle Service Management</p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="hover:text-foreground transition-colors">Support</a>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 Smart Vehicle Management and Maintenance System. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
