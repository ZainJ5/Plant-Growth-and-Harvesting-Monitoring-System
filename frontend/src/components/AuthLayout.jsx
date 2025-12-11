import { Leaf } from 'lucide-react';
// Wrapper for authentication pages
const AuthLayout = ({ children, title, subtitle }) => {
  return (

    <div className='min-h-screen bg-green-50 flex items-center justify-center p-4 relative overflow-hidden'>
      
      {/* white login card */}
      <div className="bg-white p-88 md:p-10 rounded-2xl shadow-xl w-full max-w-md border border-green-100 relative z-10">
        
        {/* 1. Top Section: Icon & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4 text-green-600 animate-bounce-slow">
            <Leaf size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">{title}</h2>
          <p className="text-gray-500 text-sm mt-2">{subtitle}</p>
        </div>

        {/* input fields */}
        {children}
        
        {/* bottom text */}
        <div className="mt-8 pt-6 text-center">
          <p className="text-xs text-gray-400 font-medium">
            GDG On Campus GIKI • Plant Monitoring System
          </p>
        </div>
      </div>
    </div>
  )
}

export default AuthLayout;