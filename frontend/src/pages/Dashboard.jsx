import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Leaf, Thermometer, Droplets, Wind, Clock, Power, BellRing } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [systemTime, setSystemTime] = useState(new Date().toLocaleTimeString());

  // Real-time system clock logic
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogOut = () => {
    navigate("/login");
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* Top Navigation Bar */}
        <header className="flex justify-between items-center bg-white p-5 rounded-3xl shadow-sm mb-8 border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="bg-emerald-500 p-2.5 rounded-2xl text-white shadow-lg shadow-emerald-100">
              <Leaf size={24} />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-800 tracking-tight">AgriTech Pro</h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1">
                <Clock size={10} /> Active Session: {systemTime}
              </p>
            </div>
          </div>
          
          <button 
            onClick={handleLogOut}
            className="group flex items-center gap-2 text-slate-500 font-bold text-sm hover:text-red-500 transition-all"
          >
            <div className="p-2 rounded-xl group-hover:bg-red-50 transition-colors">
              <LogOut size={18} />
            </div>
            Sign Out
          </button>
        </header>

        {/* Live Sensor Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Temp Card */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow text-center">
            <div className="bg-orange-50 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Thermometer className="text-orange-500" size={24} />
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase mb-1">Ambient Temp</p>
            <h2 className="text-3xl font-black text-slate-800">24.8°C</h2>
            <div className="mt-4 py-1 px-3 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-full inline-block">
              STABLE
            </div>
          </div>

          {/* Humidity Card */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow text-center">
            <div className="bg-blue-50 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Droplets className="text-blue-500" size={24} />
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase mb-1">Air Humidity</p>
            <h2 className="text-3xl font-black text-slate-800">62%</h2>
            <div className="mt-4 py-1 px-3 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-full inline-block">
              OPTIMAL
            </div>
          </div>

          {/* Moisture Card */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow text-center">
            <div className="bg-emerald-50 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Wind className="text-emerald-500" size={24} />
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase mb-1">Soil Moisture</p>
            <h2 className="text-3xl font-black text-slate-800">38%</h2>
            <div className="mt-4 py-1 px-3 bg-amber-50 text-amber-600 text-[10px] font-black rounded-full inline-block">
              LOW LEVEL
            </div>
          </div>
        </div>

        {/* Interactive Controls */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Power size={20} className="text-emerald-500" /> System Controls
          </h3>
          <div className="flex flex-wrap gap-4">
            <button className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-6 rounded-2xl transition-all shadow-lg shadow-emerald-100 flex items-center gap-2 text-sm">
              <BellRing size={18} /> Trigger Manual Irrigation
            </button>
            <button className="bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 px-6 rounded-2xl transition-all shadow-lg shadow-slate-200 text-sm">
              Export Sensor Logs (.CSV)
            </button>
            <button className="border-2 border-slate-100 hover:border-slate-200 text-slate-500 font-bold py-3 px-6 rounded-2xl transition-all text-sm">
              System Diagnostics
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
