import { Navigate } from 'react-router-dom';
import { SystemFlow } from '../services/systemFlow';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');
  
  if (!token) {
    return <Navigate to="/auth" replace />;
  }
  
  // If specific roles are required, validate
  if (allowedRoles && allowedRoles.length > 0) {
    if (!userRole || !allowedRoles.includes(userRole)) {
      // Redirect to correct dashboard for user's role
      const correctRoute = SystemFlow.getDefaultRoute(userRole || 'customer');
      return <Navigate to={correctRoute} replace />;
    }
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;