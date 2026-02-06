import React from 'react';
import { useState } from 'react';
import { User, Lock, Mail, AlertCircle, CheckCircle } from 'lucide-react';
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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

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
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      console.log('Submitting Form:', formData);
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ data: formData })
      });

      const responseData = await response.json();
      console.log('Response:', responseData);

      if (response.ok && responseData.success) {
        // STEP 1: SAVE JWT TOKEN TO LOCALSTORAGE
        if (responseData.token) {
          localStorage.setItem('authToken', responseData.token);
          console.log('Token saved to localStorage');
        }
        
        setSuccess(true);
        setFormData({
          email: '',
          password: ''
        });
        
        // Navigate to dashboard after successful login
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } else {
        setError(responseData.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred during login. Please try again.');
    } finally {
      setLoading(false);
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

        <PrimaryButton type="submit" disabled={loading}>
          {loading ? 'Signing In...' : 'Sign In to Dashboard'}
        </PrimaryButton>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertCircle size={18} className="text-red-600" />
            <p className="text-sm text-red-600 font-medium">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
            <CheckCircle size={18} className="text-green-600" />
            <p className="text-sm text-green-600 font-medium">Login successful! Redirecting...</p>
          </div>
        )}
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