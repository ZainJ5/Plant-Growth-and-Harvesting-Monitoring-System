import React from 'react';
import { User, Lock } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';

// Note: We added 'onNavigate' to the props here
const LoginPage = ({ onLogin, onNavigate }) => {
  return (
    <AuthLayout title="Welcome Back" subtitle="Monitor your growth & harvest in real-time">
      <form onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
        
        <InputField 
          label="Email Address" 
          type="email" 
          placeholder="name@giki.edu.pk" 
          icon={<User size={18} />} 
        />
        
        <div className="mb-6">
          <InputField 
            label="Password" 
            type="password" 
            placeholder="••••••••" 
            icon={<Lock size={18} />} 
          />
          {/* Forgot Password Link */}
          <div className="flex justify-end mt-1">
            <a href="#" className="text-sm font-medium text-green-600 hover:text-green-500 hover:underline">
              Forgot Password?
            </a>
          </div>
        </div>

        <PrimaryButton onClick={onLogin}>
          Sign In to Dashboard
        </PrimaryButton>
      </form>

      {/* Register Link */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          Don't have an account?{' '}
          <button 
            onClick={() => onNavigate('signup')} 
            className="font-bold text-green-600 hover:text-green-500 hover:underline"
          >
            Register here
          </button>
        </p>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;