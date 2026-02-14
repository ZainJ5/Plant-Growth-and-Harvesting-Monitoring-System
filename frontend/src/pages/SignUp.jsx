import React from 'react';
import { useState } from 'react';
import { User, Mail, Lock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import { API_BASE_URL, jsonHeaders } from '../api/config';

const SignupPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    username: '',
    email: '',
    password: ''
  });

  const formFields = [
    { 
      id: 'username', 
      name: 'username',
      label: 'Username', 
      type: 'text', 
      placeholder: 'FarmerJohn', 
      icon: <User size={18} />,
      required: true
    },
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
      placeholder: 'Create a strong password', 
      icon: <Lock size={18} />,
      required: true
    }
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstname.trim()) {
      newErrors.firstname = 'First name is required';
    }
    
    if (!formData.lastname.trim()) {
      newErrors.lastname = 'Last name is required';
    }
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (/\s/.test(formData.username)) {
      newErrors.username = 'Username cannot contain spaces';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    
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
    setSuccess(false);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});
    setSuccess(false);

    try {
      const response = await fetch(`${API_BASE_URL}/api/signup`, {
        method: "POST",
        headers: jsonHeaders(),
        body: JSON.stringify({ data: formData })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        const message = data.message || "Unable to create your account. Please check your details.";
        setErrors({ general: message });
        return;
      }

      // Success!
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      console.error("Signup error:", err);
      setErrors({ general: "Network error. Please check your connection and try again." });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <AuthLayout title="Create Account" subtitle="Join the smart agriculture network">
      <form onSubmit={handleSignUp} className="space-y-1">
        {errors.general && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 animate-fadeIn">
            <AlertCircle className="text-red-500 flex-shrink-0" size={18} />
            <p className="text-sm text-red-700 font-medium">{errors.general}</p>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="text-emerald-500 flex-shrink-0" size={18} />
            <p className="text-sm text-emerald-700 font-medium">Account created successfully! Redirecting...</p>
          </div>
        )}
        
        {/* Name row with 2-column layout */}
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
              error={errors.firstname}
              required
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
              error={errors.lastname}
              required
            />
          </div>
        </div>

        {/* Other fields */}
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
          <PrimaryButton type="submit" loading={loading} disabled={loading || success}>
            Create Dashboard
          </PrimaryButton>
        </div>
      </form>

      {/* Sign In Link */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <Link 
            to="/login" 
            className="font-bold text-emerald-600 hover:text-emerald-700 hover:underline transition-colors"
          >
            Sign In
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default SignupPage;