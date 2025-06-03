import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black bg-opacity-90">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-draugr-500"></div>
      </div>
    );
  }
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login?redirect=hidden" replace />;
  }
  
  // If not admin, redirect to home
  if (!user.isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  // If authenticated and admin, render the children
  return children;
};

export default AdminRoute; 