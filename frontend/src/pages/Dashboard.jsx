import PlantScanner from '../components/PlantScanner';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LogOut, Leaf, Thermometer, Droplets, Wind, 
  Clock, Power, BellRing, CheckCircle2, 
  AlertCircle, ListRestart, Zap, ShieldCheck
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  
  // --- STATE MANAGEMENT ---
  const [systemTime, setSystemTime] = useState(new Date().toLocaleTimeString());
  const [isWatering, setIsWatering] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isAutoMode, setIsAutoMode] = useState(true); // Toggle State
  
const [history, setHistory] = useState(() => {
  const saved = localStorage.getItem('irrigationHistory');
  return saved ? JSON.parse(saved) : [
    { id: 1, time: "10:30 AM", action: "Auto-Irrigation", status: "Completed" },
    { id: 2, time: "12:15 PM", action: "System Check", status: "Healthy" }
  ];
});

  useEffect(() => {
  localStorage.setItem('irrigationHistory', JSON.stringify(history));
}, [history]);

  const handleIrrigation = () => {
    setIsWatering(true);
    setShowSuccess(false);

    setTimeout(() => {
      setIsWatering(false);
      setShowSuccess(true);
      
      const newEntry = {
        id: Date.now(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        action: "Manual Override Water",
        status: "Success"
      };
      setHistory([newEntry, ...history]);
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
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1 text-center">
                <Clock size={10} /> {systemTime} | Mode: {isAutoMode ? 'AI Auto' : 'Manual Control'}
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
            <h2 className="text-3xl font-black text-slate-800">24.8°C</h2>
            <p className="text-slate-400 text-[10px] font-bold uppercase mt-2">Ambient Temp</p>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 text-center">
            <Droplets className="mx-auto text-blue-500 mb-4" size={24} />
            <h2 className="text-3xl font-black text-slate-800">62%</h2>
            <p className="text-slate-400 text-[10px] font-bold uppercase mt-2">Humidity</p>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 text-center">
            <Wind className="mx-auto text-emerald-500 mb-4" size={24} />
            <h2 className="text-3xl font-black text-slate-800">32%</h2>
            <p className="text-slate-400 text-[10px] font-bold uppercase mt-2">Soil Moisture</p>
          </div>
        </div>
        {/* PASTE THE NEW COMPONENT HERE */}
        <div className="mb-8">
           <PlantScanner />
        </div>

        {/* SYSTEM CONTROLS WITH TOGGLE */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 mb-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Power size={20} className="text-emerald-500" /> Control Center
            </h3>
            
            {/* THE TOGGLE SWITCH */}
            <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-2xl border border-slate-100">
              <span className={`text-[10px] font-black ${!isAutoMode ? 'text-blue-600' : 'text-slate-400'}`}>MANUAL</span>
              <button 
                onClick={() => setIsAutoMode(!isAutoMode)}
                className={`w-12 h-6 rounded-full transition-all relative ${isAutoMode ? 'bg-emerald-500' : 'bg-slate-300'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isAutoMode ? 'left-7' : 'left-1'}`}></div>
              </button>
              <span className={`text-[10px] font-black ${isAutoMode ? 'text-emerald-600' : 'text-slate-400'}`}>AUTO AI</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <button 
              onClick={handleIrrigation}
              disabled={isWatering || isAutoMode}
              className={`flex items-center gap-3 font-bold py-4 px-8 rounded-2xl transition-all text-sm shadow-md 
                ${isAutoMode ? 'bg-slate-50 text-slate-300 border border-slate-100 cursor-not-allowed shadow-none' : 
                  isWatering ? 'bg-blue-100 text-blue-600' : 'bg-slate-900 text-white hover:bg-slate-800'}
              `}
            >
              {isWatering ? "Pump Active..." : <><BellRing size={18} /> Trigger Irrigation</>}
            </button>
            
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl text-slate-500 text-xs font-bold border border-slate-100">
               {isAutoMode ? <ShieldCheck size={16} className="text-emerald-500"/> : <Zap size={16} className="text-blue-500"/>}
               {isAutoMode ? "AI is Monitoring Soil" : "Manual Override Enabled"}
            </div>
          </div>
        </div>

        {/* ACTIVITY LOG */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <ListRestart size={20} className="text-blue-500" /> Analytics Feed
          </h3>
          <div className="space-y-3">
            {history.map((item) => (
              <div key={item.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-black text-slate-400">{item.time}</span>
                  <span className="text-sm font-bold text-slate-700">{item.action}</span>
                </div>
                <span className="text-[10px] font-black px-3 py-1 bg-white rounded-full shadow-sm text-emerald-600 border border-slate-100 uppercase">
                  {item.status}
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
