import { Leaf } from 'lucide-react';

// Wrapper for authentication pages
const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className='min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex items-center justify-center p-4 relative overflow-hidden'>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse-slow"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute -bottom-32 left-1/2 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      </div>
      
      {/* white login card */}
      <div className="bg-white/95 backdrop-blur-sm p-8 md:p-10 rounded-3xl shadow-2xl w-full max-w-md border border-emerald-100/50 relative z-10 animate-fadeIn">
        
        {/* 1. Top Section: Icon & Title */}
        <div className="text-center mb-8 animate-slideIn">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 mb-4 text-white shadow-lg shadow-emerald-200 transform transition-transform hover:scale-105">
            <Leaf size={36} />
          </div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">{title}</h2>
          <p className="text-gray-600 text-sm font-medium">{subtitle}</p>
        </div>

        {/* input fields */}
        <div className="animate-fadeIn" style={{ animationDelay: '0.2s' }}>
          {children}
        </div>
        
        {/* bottom text */}
        <div className="mt-8 pt-6 text-center border-t border-gray-100">
          <p className="text-xs text-gray-400 font-medium">
            GDG On Campus GIKI • Plant Monitoring System
          </p>
        </div>
      </div>
    </div>
  )
}

export default AuthLayout;