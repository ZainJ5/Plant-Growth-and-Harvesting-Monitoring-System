import React from 'react';
import { useState } from 'react';
import { User, Lock, Mail } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';


const LoginPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
      email: '',
      password: ''
    });

  // maps for input fields
  const formFields = [
    { 
      id: 'email', 
      name: 'email', 
      label: 'Email Address', 
      type: 'email', 
      placeholder: 'name@giki.edu.pk', 
      icon: <Mail size={18} /> 
    },
    { 
      id: 'password', 
      name: 'password', 
      label: 'Password', 
      type: 'password', 
      placeholder: 'Create a password', 
      icon: <Lock size={18} /> 
    }
  ];

  // generic handler

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type" : "application/json"
        },
        body: JSON.stringify({ data: formData })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        const message = data.message || "Unable to sign you in. Please check your credentials.";
        alert(message);
        return;
      }

      // Login succeeded – send user to dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error("Login error:", err);
      alert("Something went wrong while logging in. Please try again.");
    }
  }
  return (
    <AuthLayout title="Welcome Back" subtitle="Monitor your growth & harvest in real-time">
      <form onSubmit={(e) => { handleLogin(e); }}>
        
        {formFields.map((field) => (
          <InputField 
            key={field.id}
            label={field.label}
            name={field.name}
            type={field.type}
            placeholder={field.placeholder}
            icon={field.icon}
            value={formData[field.name]} 
            onChange={handleChange}      
          />
        ))}

        <PrimaryButton type="submit">
          Sign In to Dashboard
        </PrimaryButton>
      </form>

      {/* Register Link */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          Don't have an account?{' '}
          <Link to="/signup" className="font-bold text-green-600 hover:text-green-500 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;