import { Navigate } from 'react-router-dom';

/**
 * ProtectedRoute Component
 * 
 * This component wraps routes that require authentication.
 * It checks if a valid JWT token exists in localStorage.
 * 
 * Usage:
 * <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
 */
const ProtectedRoute = ({ children }) => {
  // Check if token exists in localStorage
  const token = localStorage.getItem('authToken');
  
  // If no token, redirect to login
  if (!token) {
    console.log('⛔ No token found - redirecting to login');
    return <Navigate to="/login" replace />;
  }
  
  // Token exists, allow access to the route
  console.log('✅ Token found - allowing access');
  return children;
};

export default ProtectedRoute;
