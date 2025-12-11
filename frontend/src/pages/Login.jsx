import React from 'react';
import { User, Lock } from 'lucide-react';

import AuthLayout from '../components/AuthLayout';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';

const LoginPage = ({ onLogin }) => {
  return (
    <AuthLayout title="Welcome Back" subtitle="Monitor your growth">
      <form onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
        <InputField 
          label="Email Address" 
          type="email" 
          placeholder="name@giki.edu.pk" 
          icon={<User size={18} />} 
        />
        
        <InputField 
          label="Password" 
          type="password" 
          placeholder="••••••••" 
          icon={<Lock size={18} />} 
        />

        <div className="mt-6">
          <PrimaryButton onClick={onLogin}>
            Sign In to Dashboard
          </PrimaryButton>
        </div>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;