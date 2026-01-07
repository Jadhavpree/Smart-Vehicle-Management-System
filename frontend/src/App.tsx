import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import ForgotPassword from "./pages/ForgotPassword";
import CustomerDashboard from "./pages/CustomerDashboard";
import ServiceCenterDashboard from "./pages/ServiceCenterDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import VehicleRegistration from "./pages/VehicleRegistration";
import VehicleDetails from "./pages/VehicleDetails";
import ServiceBooking from "./pages/ServiceBooking";
import JobCardDetail from "./pages/JobCardDetail";
import InvoiceDetail from "./pages/InvoiceDetail";
import PaymentPage from "./pages/PaymentPage";
import Profile from "./pages/Profile";
import UserManagement from "./pages/UserManagement";
import ReviewsRatings from "./pages/ReviewsRatings";
import ReviewPage from "./pages/ReviewPage";
import MechanicPerformance from "./pages/MechanicPerformance";
import SupplierManagement from "./pages/SupplierManagement";
import InventoryManagement from "./pages/InventoryManagement";
import InventoryTest from "./pages/InventoryTest";
import TeamManagement from "./pages/TeamManagement";
import Analytics from "./pages/Analytics";
import Notifications from "./pages/Notifications";
import NotFound from "./pages/NotFound";
import DatabaseViewer from "./pages/DatabaseViewer";
import Debug from "./pages/Debug";
import ProtectedRoute from "./components/ProtectedRoute";
import { SystemFlow } from "./services/systemFlow";

const queryClient = new QueryClient();

// Role-based redirect component
const RoleBasedRedirect = () => {
  const userRole = localStorage.getItem('userRole') || 'customer';
  const defaultRoute = SystemFlow.getDefaultRoute(userRole);
  window.location.href = defaultRoute;
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/customer" element={<ProtectedRoute><CustomerDashboard /></ProtectedRoute>} />
          <Route path="/service-center" element={<ProtectedRoute><ServiceCenterDashboard /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/vehicle/register" element={<ProtectedRoute><VehicleRegistration /></ProtectedRoute>} />
          <Route path="/vehicle/:id" element={<ProtectedRoute><VehicleDetails /></ProtectedRoute>} />
          <Route path="/booking" element={<ProtectedRoute><ServiceBooking /></ProtectedRoute>} />
          <Route path="/job-card/:id" element={<ProtectedRoute><JobCardDetail /></ProtectedRoute>} />
          <Route path="/invoice/:id" element={<ProtectedRoute><InvoiceDetail /></ProtectedRoute>} />
          <Route path="/payment/:id" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/inventory" element={<ProtectedRoute><InventoryManagement /></ProtectedRoute>} />
          <Route path="/inventory-test" element={<ProtectedRoute><InventoryTest /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute><UserManagement /></ProtectedRoute>} />
          <Route path="/reviews" element={<ProtectedRoute><ReviewsRatings /></ProtectedRoute>} />
          <Route path="/review/:bookingId" element={<ProtectedRoute><ReviewPage /></ProtectedRoute>} />
          <Route path="/admin/mechanics" element={<ProtectedRoute><MechanicPerformance /></ProtectedRoute>} />
          <Route path="/suppliers" element={<ProtectedRoute><SupplierManagement /></ProtectedRoute>} />
          <Route path="/team" element={<ProtectedRoute><TeamManagement /></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
          <Route path="/database" element={<ProtectedRoute><DatabaseViewer /></ProtectedRoute>} />
          <Route path="/debug" element={<Debug />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
