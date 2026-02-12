import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Import Pages
import LoginPage from './pages/Login';
import SignupPage from './pages/SignUp';
import Dashboard from './pages/Dashboard';

// Import Route Guards
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';

export default function App() {
  return (
    <Routes>
      {/* Default Path */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      
      {/* Public Routes - Redirect to dashboard if already authenticated */}
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        } 
      />
      <Route 
        path="/signup" 
        element={
          <PublicRoute>
            <SignupPage />
          </PublicRoute>
        } 
      />
      
      {/* Protected Route (The Dashboard) - Redirect to login if not authenticated */}
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