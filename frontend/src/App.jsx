import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

// Import Pages
import LoginPage from './pages/Login';
import SignupPage from './pages/SignUp';
import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <Routes>
      {/* Default Path */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      
      {/* Protected Route - Dashboard (requires JWT token) */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}