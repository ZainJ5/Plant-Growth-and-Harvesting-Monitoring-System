import React from 'react';
import { User, Mail, Lock } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';

const SignupPage = ({ onNavigate, onLogin }) => {
  return (
    <AuthLayout title="Create Account" subtitle="Join the smart agriculture network">
      <form onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
        
        {/* Row for First & Last Name */}
        <div className="flex gap-4">
          <div className="w-1/2">
            <InputField 
              label="First Name" 
              type="text" 
              placeholder="Jane" 
              icon={<User size={18} />} 
            />
          </div>
          <div className="w-1/2">
            <InputField 
              label="Last Name" 
              type="text" 
              placeholder="Doe" 
              icon={<User size={18} />} 
            />
          </div>
        </div>

        <InputField 
          label="Username" 
          type="text" 
          placeholder="FarmerJohn" 
          icon={<User size={18} />} 
        />

        <InputField 
          label="Email Address" 
          type="email" 
          placeholder="name@giki.edu.pk" 
          icon={<Mail size={18} />} 
        />
        
        <div className="mb-6">
          <InputField 
            label="Password" 
            type="password" 
            placeholder="Create a password" 
            icon={<Lock size={18} />} 
          />
        </div>

        <PrimaryButton onClick={onLogin}>
          Create Dashboard
        </PrimaryButton>
      </form>

      {/* Link back to Login */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          Already have an account?{' '}
          <button 
            onClick={() => onNavigate('login')} 
            className="font-bold text-green-600 hover:text-green-500 hover:underline"
          >
            Sign In
          </button>
        </p>
      </div>
    </AuthLayout>
  );
};

export default SignupPage;