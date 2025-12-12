import React, { useState } from 'react';

import LoginPage from './pages/Login';
import SignupPage from './pages/SignUp'
import Dashboard from './pages/Dashboard';

export default function App() {
  // We track the specific page name now: 'login', 'signup', or 'dashboard'
  const [currentPage, setCurrentPage] = useState('login');

  const handleLogin = () => {
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setCurrentPage('login');
  };

  // Managinh the routing
  return (
    <div>
      {currentPage === 'login' && (
        <LoginPage 
          onLogin={handleLogin} 
          onNavigate={setCurrentPage} // Pass the function to switch pages
        />
      )}
      
      {currentPage === 'signup' && (
        <SignupPage 
          onLogin={handleLogin} 
          onNavigate={setCurrentPage} 
        />
      )}
      
      {currentPage === 'dashboard' && (
        <Dashboard onLogout={handleLogout} />
      )}
    </div>
  );
}