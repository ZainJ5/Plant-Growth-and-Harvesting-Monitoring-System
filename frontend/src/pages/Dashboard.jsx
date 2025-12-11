import React from 'react';
import { LogOut, Leaf } from 'lucide-react';

const Dashboard = ({ onLogout }) => {
  return (
    <div className="p-10 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Simple Header */}
        <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-lg text-green-600">
              <Leaf size={24} />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">AgriTech Dashboard</h1>
          </div>
          
          <button 
            onClick={onLogout}
            className="flex items-center gap-2 text-red-500 font-semibold hover:bg-red-50 px-4 py-2 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </div>

        {/* Placeholder Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-40 flex items-center justify-center text-gray-400">
            Chart 1 Placeholder
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-40 flex items-center justify-center text-gray-400">
            Chart 2 Placeholder
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-40 flex items-center justify-center text-gray-400">
            Stats Placeholder
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;