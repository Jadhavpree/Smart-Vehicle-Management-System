import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Car, Mail, Lock, User, Phone, Building, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { SystemFlow } from "@/services/systemFlow";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const signupSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters").max(100, "Name too long"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^\+?[1-9]\d{9,14}$/, "Invalid phone number"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  userType: z.enum(["customer", "service_center", "admin"]),
  companyName: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginForm = z.infer<typeof loginSchema>;
type SignupForm = z.infer<typeof signupSchema>;

const Auth = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [userType, setUserType] = useState<"customer" | "service_center" | "admin">("customer");
  const [isLoading, setIsLoading] = useState(false);

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const signupForm = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      userType: "customer",
    },
  });

  const onLogin = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      const response = await api.login(data.email, data.password);
      
      if (response.success) {
        // Store auth data
        localStorage.setItem('token', response.token);
        localStorage.setItem('userId', response.user.id);
        localStorage.setItem('userRole', response.user.role);
        localStorage.setItem('userName', response.user.name);
        
        toast({
          title: "Login Successful",
          description: "Redirecting to your dashboard...",
        });
        
        // Redirect based on role
        const redirectPath = SystemFlow.getDefaultRoute(response.user.role);
        navigate(redirectPath);
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSignup = async (data: SignupForm) => {
    setIsLoading(true);
    try {
      const response = await api.register(
        data.fullName,
        data.email,
        data.password,
        data.userType === 'service_center' ? 'mechanic' : data.userType
      );
      
      if (response.success) {
        toast({
          title: "Account Created Successfully",
          description: "You can now sign in with your credentials.",
        });
        
        // Switch to login tab
        const loginTab = document.querySelector('[value="login"]') as HTMLElement;
        loginTab?.click();
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to create account. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary to-accent flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="text-white space-y-6 hidden lg:block">
          <div className="inline-flex items-center gap-3 mb-8">
            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
              <Car className="h-8 w-8" />
            </div>
            <span className="text-2xl font-bold">Smart Vehicle Service</span>
          </div>
          <h1 className="text-4xl font-bold leading-tight">
            Streamline Your Vehicle Maintenance Experience
          </h1>
          <p className="text-lg text-white/90">
            Join thousands of satisfied customers and service centers using our platform
          </p>
          <div className="space-y-4 pt-6">
            {[
              "Easy online appointment booking",
              "Real-time service tracking",
              "Digital service records",
              "Automated reminders & notifications"
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-2 w-2 bg-secondary rounded-full" />
                <span className="text-white/90">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Auth Forms */}
        <Card className="border-0 shadow-2xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Welcome</CardTitle>
            <CardDescription className="text-center">
              Sign in to your account or create a new one
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 bg-muted">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              {/* Login Tab */}
              <TabsContent value="login">
                <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="you@example.com"
                        className="pl-10"
                        {...loginForm.register("email")}
                      />
                    </div>
                    {loginForm.formState.errors.email && (
                      <p className="text-sm text-destructive">{loginForm.formState.errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                        {...loginForm.register("password")}
                      />
                    </div>
                    {loginForm.formState.errors.password && (
                      <p className="text-sm text-destructive">{loginForm.formState.errors.password.message}</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="remember" />
                      <label
                        htmlFor="remember"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Remember me
                      </label>
                    </div>
                    <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing In..." : "Sign In"}
                  </Button>
                  
                  {/* Admin Quick Login */}
                  <div className="mt-4 p-3 bg-muted/50 rounded-lg border border-border">
                    <p className="text-xs text-muted-foreground mb-2 text-center">Quick Admin Access</p>
                    <Button 
                      type="button"
                      variant="outline"
                      size="sm"
                      className="w-full text-xs"
                      onClick={() => {
                        loginForm.setValue('email', 'admin@admin.com');
                        loginForm.setValue('password', 'admin123');
                      }}
                    >
                      <Shield className="h-3 w-3 mr-1" />
                      Use Admin Credentials
                    </Button>
                  </div>
                </form>
              </TabsContent>

              {/* Signup Tab */}
              <TabsContent value="signup">
                <form onSubmit={signupForm.handleSubmit(onSignup)} className="space-y-4">
                  <div className="space-y-2">
                    <Label>I am a</Label>
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        type="button"
                        variant={userType === "customer" ? "default" : "outline"}
                        className={userType === "customer" ? "bg-primary text-primary-foreground" : ""}
                        onClick={() => {
                          setUserType("customer");
                          signupForm.setValue("userType", "customer");
                        }}
                      >
                        Customer
                      </Button>
                      <Button
                        type="button"
                        variant={userType === "service_center" ? "default" : "outline"}
                        className={userType === "service_center" ? "bg-primary text-primary-foreground" : ""}
                        onClick={() => {
                          setUserType("service_center");
                          signupForm.setValue("userType", "service_center");
                        }}
                      >
                        Service Center
                      </Button>
                      <Button
                        type="button"
                        variant={userType === "admin" ? "default" : "outline"}
                        className={userType === "admin" ? "bg-primary text-primary-foreground" : ""}
                        onClick={() => {
                          setUserType("admin");
                          signupForm.setValue("userType", "admin");
                        }}
                      >
                        Admin
                      </Button>
                    </div>
                  </div>

                  {userType === "service_center" && (
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name</Label>
                      <div className="relative">
                        <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="companyName"
                          placeholder="Your Service Center Name"
                          className="pl-10"
                          {...signupForm.register("companyName")}
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="fullName"
                        placeholder="John Doe"
                        className="pl-10"
                        {...signupForm.register("fullName")}
                      />
                    </div>
                    {signupForm.formState.errors.fullName && (
                      <p className="text-sm text-destructive">{signupForm.formState.errors.fullName.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="you@example.com"
                        className="pl-10"
                        {...signupForm.register("email")}
                      />
                    </div>
                    {signupForm.formState.errors.email && (
                      <p className="text-sm text-destructive">{signupForm.formState.errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+1234567890"
                        className="pl-10"
                        {...signupForm.register("phone")}
                      />
                    </div>
                    {signupForm.formState.errors.phone && (
                      <p className="text-sm text-destructive">{signupForm.formState.errors.phone.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                        {...signupForm.register("password")}
                      />
                    </div>
                    {signupForm.formState.errors.password && (
                      <p className="text-sm text-destructive">{signupForm.formState.errors.password.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                        {...signupForm.register("confirmPassword")}
                      />
                    </div>
                    {signupForm.formState.errors.confirmPassword && (
                      <p className="text-sm text-destructive">{signupForm.formState.errors.confirmPassword.message}</p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox id="terms" required />
                    <label htmlFor="terms" className="text-sm leading-none">
                      I agree to the{" "}
                      <Link to="/terms" className="text-primary hover:underline">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link to="/privacy" className="text-primary hover:underline">
                        Privacy Policy
                      </Link>
                    </label>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;