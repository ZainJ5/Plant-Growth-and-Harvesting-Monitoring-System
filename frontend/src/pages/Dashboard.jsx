import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LogOut, Leaf, Thermometer, Droplets, Wind, 
  Clock, Power, BellRing, CheckCircle2, 
  AlertCircle, ListRestart 
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  
  // --- STATE MANAGEMENT ---
  const [systemTime, setSystemTime] = useState(new Date().toLocaleTimeString());
  const [isWatering, setIsWatering] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  //  This stores the history of  actions
  const [history, setHistory] = useState([
    { id: 1, time: "10:30 AM", action: "Auto-Irrigation", status: "Completed" },
    { id: 2, time: "12:15 PM", action: "System Check", status: "Healthy" }
  ]);

  // Live Clock Logic
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Interaction Logic with History Logging
  const handleIrrigation = () => {
    setIsWatering(true);
    setShowSuccess(false);

    setTimeout(() => {
      setIsWatering(false);
      setShowSuccess(true);
      
      // ADD TO HISTORY: This adds a new row to the table automatically
      const newEntry = {
        id: Date.now(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        action: "Manual Irrigation",
        status: "Success"
      };
      setHistory([newEntry, ...history]); // Adds the newest action to the top
      
      setTimeout(() => setShowSuccess(false), 4000);
    }, 3000);
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* HEADER */}
        <header className="flex justify-between items-center bg-white p-5 rounded-3xl shadow-sm mb-8 border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="bg-emerald-600 p-2.5 rounded-2xl text-white shadow-lg shadow-emerald-100">
              <Leaf size={24} />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-800 tracking-tight">AgriTech Pro</h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1">
                <Clock size={10} /> {systemTime} | Frontend Dev Mode
              </p>
            </div>
          </div>
          <button onClick={() => navigate("/login")} className="text-slate-500 font-bold text-sm flex items-center gap-2 hover:text-red-500 transition-colors">
            <LogOut size={18} /> Sign Out
          </button>
        </header>

        {/* SENSOR GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 text-center">
            <Thermometer className="mx-auto text-orange-500 mb-4" size={24} />
            <p className="text-slate-400 text-xs font-bold uppercase mb-1">Temp</p>
            <h2 className="text-3xl font-black text-slate-800">24.8°C</h2>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 text-center">
            <Droplets className="mx-auto text-blue-500 mb-4" size={24} />
            <p className="text-slate-400 text-xs font-bold uppercase mb-1">Humidity</p>
            <h2 className="text-3xl font-black text-slate-800">62%</h2>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 text-center">
            <Wind className="mx-auto text-emerald-500 mb-4" size={24} />
            <p className="text-slate-400 text-xs font-bold uppercase mb-1">Moisture</p>
            <h2 className="text-3xl font-black text-slate-800">32%</h2>
          </div>
        </div>

        {/* CONTROLS */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Power size={20} className="text-emerald-500" /> Active Controls
            </h3>
            {showSuccess && (
              <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm bg-emerald-50 px-4 py-2 rounded-xl animate-pulse">
                <CheckCircle2 size={16} /> Irrigation Triggered
              </div>
            )}
          </div>
          <button 
            onClick={handleIrrigation}
            disabled={isWatering}
            className={`flex items-center gap-3 font-bold py-4 px-8 rounded-2xl transition-all shadow-lg text-sm ${isWatering ? 'bg-blue-100 text-blue-600' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
          >
            {isWatering ? "System Watering..." : "Trigger Manual Irrigation"}
          </button>
        </div>

        {/* ACTION HISTORY LOG */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <ListRestart size={20} className="text-blue-500" /> Recent Activity Log
          </h3>
          <div className="space-y-4">
            {history.map((item) => (
              <div key={item.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-black text-slate-400">{item.time}</span>
                  <span className="text-sm font-bold text-slate-700">{item.action}</span>
                </div>
                <span className={`text-[10px] font-black px-3 py-1 rounded-full ${item.status === 'Success' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
                  {item.status.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
