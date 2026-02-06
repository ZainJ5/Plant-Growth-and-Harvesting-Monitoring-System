import React from 'react';
import { useState } from 'react';
import { User, Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';

const SignupPage = () => {

  // state variables
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    username: '',
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // maps for input fields
  const formFields = [
    { 
      id: 'username', 
      name: 'username', // Matches formData key
      label: 'Username', 
      type: 'text', 
      placeholder: 'FarmerJohn', 
      icon: <User size={18} /> 
    },
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

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      console.log('Submitting Form:', formData);
      const response = await fetch("http://localhost:5000/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ data: formData })
      });

      const responseData = await response.json();
      console.log('Response:', responseData);

      if (response.ok && responseData.success) {
        setSuccess(true);
        setFormData({
          firstname: '',
          lastname: '',
          username: '',
          email: '',
          password: ''
        });
        
        // Navigate to login after successful signup
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } else {
        setError(responseData.message || 'Registration failed');
      }
    } catch (err) {
      console.error('SignUp error:', err);
      setError('An error occurred during registration. Please try again.');
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <AuthLayout title="Create Account" subtitle="Join the smart agriculture network">
      <form onSubmit={handleSignUp}>
        
        {/* We keep the Name row separate because it has a unique 2-column layout */}
        <div className="flex gap-4">
          <div className="w-1/2">
            <InputField 
              label="First Name" 
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              type="text" 
              placeholder="Jane" 
              icon={<User size={18} />} 
            />
          </div>
          <div className="w-1/2">
            <InputField 
              label="Last Name" 
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              type="text" 
              placeholder="Doe" 
              icon={<User size={18} />} 
            />
          </div>
        </div>

        {/* Mapping for each element in formfields*/}
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

        <div className="mt-6">
          <PrimaryButton type="submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Dashboard'}
          </PrimaryButton>
        </div>

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
            <p className="text-sm text-green-600 font-medium">Account created! Redirecting to login...</p>
          </div>
        )}
      </form>

      {/* 7. ROUTING: Using Link instead of button + onClick */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          Already have an account?{' '}
          <Link 
            to="/login" 
            className="font-bold text-green-600 hover:text-green-500 hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default SignupPage;