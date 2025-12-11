import React, { useState } from 'react';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

export default function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div>
      {isLoggedIn ? (
        // If logged in, show Dashboard and pass the logout function
        <Dashboard onLogout={() => setIsLoggedIn(false)} />
      ) : (
        // If NOT logged in, show Login Page and pass the login function
        <Login onLogin={() => setIsLoggedIn(true)} />
      )}
    </div>
  );
}