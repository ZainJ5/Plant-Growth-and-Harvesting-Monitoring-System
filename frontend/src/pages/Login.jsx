import React from 'react';
import { useState } from 'react';
import { Lock, Mail, AlertCircle } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';

const LoginPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const formFields = [
    { 
      id: 'email', 
      name: 'email', 
      label: 'Email Address', 
      type: 'email', 
      placeholder: 'name@giki.edu.pk', 
      icon: <Mail size={18} />,
      required: true
    },
    { 
      id: 'password', 
      name: 'password', 
      label: 'Password', 
      type: 'password', 
      placeholder: 'Enter your password', 
      icon: <Lock size={18} />,
      required: true
    }
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ data: formData })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        const message = data.message || "Unable to sign you in. Please check your credentials.";
        setErrors({ general: message });
        return;
      }

      // Store login state (you might want to use a proper auth context/store)
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userEmail', formData.email);
      
      // Login succeeded – send user to dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error("Login error:", err);
      setErrors({ general: "Network error. Please check your connection and try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome Back" subtitle="Monitor your growth & harvest in real-time">
      <form onSubmit={handleLogin} className="space-y-1">
        {errors.general && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 animate-fadeIn">
            <AlertCircle className="text-red-500 flex-shrink-0" size={18} />
            <p className="text-sm text-red-700 font-medium">{errors.general}</p>
          </div>
        )}
        
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
            error={errors[field.name]}
            required={field.required}
          />
        ))}

        <div className="mt-6">
          <PrimaryButton type="submit" loading={loading} disabled={loading}>
            Sign In to Dashboard
          </PrimaryButton>
        </div>
      </form>

      {/* Register Link */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/signup" className="font-bold text-emerald-600 hover:text-emerald-700 hover:underline transition-colors">
            Register here
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;