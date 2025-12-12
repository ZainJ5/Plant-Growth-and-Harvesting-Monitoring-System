import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

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
      
      {/* Protected Route (The Dashboard) */}
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}