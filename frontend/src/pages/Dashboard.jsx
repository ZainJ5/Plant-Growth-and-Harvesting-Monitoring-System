import PlantScanner from '../components/PlantScanner';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL, getAuthHeaders } from '../api/config';
import { 
  LogOut, Leaf, Thermometer, Droplets, Wind, 
  Clock, Power, BellRing, CheckCircle2, 
  ListRestart, Zap, ShieldCheck, User, Loader2
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();

  // User profile from backend
  const [userProfile, setUserProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState(null);
  
  // --- STATE MANAGEMENT ---
  const [systemTime, setSystemTime] = useState(new Date().toLocaleTimeString());
  const [isWatering, setIsWatering] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isAutoMode, setIsAutoMode] = useState(true);
  const [sensorData, setSensorData] = useState({
    temperature: 24.8,
    humidity: 62,
    soilMoisture: 32
  });
  
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('irrigationHistory');
    return saved ? JSON.parse(saved) : [
      { id: 1, time: "10:30 AM", action: "Auto-Irrigation", status: "Completed", type: "success" },
      { id: 2, time: "12:15 PM", action: "System Check", status: "Healthy", type: "info" }
    ];
  });

  // Fetch user profile from backend
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setProfileLoading(false);
      return;
    }
    fetch(`${API_BASE_URL}/user/profile`, {
      headers: getAuthHeaders()
    })
      .then((res) => {
        if (res.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('isAuthenticated');
          window.location.href = '/login';
          return null;
        }
        if (!res.ok) throw new Error('Failed to load profile');
        return res.json();
      })
      .then((data) => {
        if (data) {
          setUserProfile(data.user || null);
          setProfileError(null);
        }
      })
      .catch(() => setProfileError(true))
      .finally(() => setProfileLoading(false));
  }, []);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setSystemTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulate sensor data updates
  useEffect(() => {
    const sensorTimer = setInterval(() => {
      setSensorData(prev => ({
        temperature: (prev.temperature + (Math.random() - 0.5) * 0.5).toFixed(1),
        humidity: Math.max(30, Math.min(90, prev.humidity + (Math.random() - 0.5) * 2)),
        soilMoisture: Math.max(20, Math.min(80, prev.soilMoisture + (Math.random() - 0.5) * 2))
      }));
    }, 5000);
    return () => clearInterval(sensorTimer);
  }, []);

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
        status: "Success",
        type: "success"
      };
      setHistory([newEntry, ...history]);
      setTimeout(() => setShowSuccess(false), 4000);
    }, 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  const displayName = userProfile
    ? [userProfile.firstname, userProfile.lastname].filter(Boolean).join(' ') || userProfile.username || userProfile.email
    : localStorage.getItem('userEmail') || 'User';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/20 to-teal-50/20 font-sans">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        
        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-lg mb-8 border border-emerald-100/50 animate-fadeIn">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-3 rounded-2xl text-white shadow-lg shadow-emerald-200">
              <Leaf size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">AgriTech Pro</h1>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Clock size={12} /> {systemTime}
                </p>
                <span className="text-slate-300">•</span>
                <p className={`text-xs font-bold uppercase ${
                  isAutoMode ? 'text-emerald-600' : 'text-blue-600'
                }`}>
                  {isAutoMode ? 'AI Auto Mode' : 'Manual Control'}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl">
              <User size={16} className="text-slate-500" />
              {profileLoading ? (
                <Loader2 size={14} className="animate-spin text-slate-500" />
              ) : profileError ? (
                <span className="text-sm font-medium text-slate-600">{localStorage.getItem('userEmail') || 'User'}</span>
              ) : (
                <span className="text-sm font-medium text-slate-700">{displayName}</span>
              )}
            </div>
            <button 
              onClick={handleLogout} 
              className="flex items-center gap-2 px-4 py-2 text-slate-600 font-bold text-sm hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
            >
              <LogOut size={18} /> Sign Out
            </button>
          </div>
        </header>

        {/* SENSOR GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl shadow-lg border border-orange-100 text-center transform transition-all hover:scale-105 hover:shadow-xl animate-fadeIn">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-orange-100 mb-4">
              <Thermometer className="text-orange-600" size={28} />
            </div>
            <h2 className="text-4xl font-black text-slate-800 mb-1">{sensorData.temperature}°C</h2>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Ambient Temperature</p>
          </div>
          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl shadow-lg border border-blue-100 text-center transform transition-all hover:scale-105 hover:shadow-xl animate-fadeIn" style={{ animationDelay: '0.1s' }}>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-100 mb-4">
              <Droplets className="text-blue-600" size={28} />
            </div>
            <h2 className="text-4xl font-black text-slate-800 mb-1">{Math.round(sensorData.humidity)}%</h2>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Humidity</p>
          </div>
          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl shadow-lg border border-emerald-100 text-center transform transition-all hover:scale-105 hover:shadow-xl animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-100 mb-4">
              <Wind className="text-emerald-600" size={28} />
            </div>
            <h2 className="text-4xl font-black text-slate-800 mb-1">{Math.round(sensorData.soilMoisture)}%</h2>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Soil Moisture</p>
          </div>
        </div>

        {/* PLANT SCANNER */}
        <div className="mb-8">
          <PlantScanner />
        </div>

        {/* SYSTEM CONTROLS WITH TOGGLE */}
        <div className="bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-lg border border-slate-100 mb-8 animate-fadeIn">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div>
              <h3 className="text-xl font-black text-slate-800 flex items-center gap-2 mb-1">
                <Power size={22} className="text-emerald-500" /> Control Center
              </h3>
              <p className="text-sm text-slate-500 font-medium">Manage irrigation and system settings</p>
            </div>
            
            {/* THE TOGGLE SWITCH */}
            <div className="flex items-center gap-3 bg-gradient-to-r from-slate-50 to-emerald-50/50 p-2.5 rounded-2xl border-2 border-slate-200 shadow-sm">
              <span className={`text-xs font-black transition-colors ${!isAutoMode ? 'text-blue-600' : 'text-slate-400'}`}>MANUAL</span>
              <button 
                onClick={() => setIsAutoMode(!isAutoMode)}
                className={`w-14 h-7 rounded-full transition-all relative shadow-inner ${
                  isAutoMode ? 'bg-gradient-to-r from-emerald-500 to-teal-600' : 'bg-slate-300'
                }`}
              >
                <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-all shadow-md ${
                  isAutoMode ? 'translate-x-7' : 'translate-x-0'
                }`}></div>
              </button>
              <span className={`text-xs font-black transition-colors ${isAutoMode ? 'text-emerald-600' : 'text-slate-400'}`}>AUTO AI</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button 
              onClick={handleIrrigation}
              disabled={isWatering || isAutoMode}
              className={`flex items-center gap-3 font-bold py-4 px-8 rounded-2xl transition-all text-sm shadow-lg transform hover:scale-105 active:scale-95
                ${isAutoMode 
                  ? 'bg-slate-100 text-slate-400 border-2 border-slate-200 cursor-not-allowed shadow-none' 
                  : isWatering 
                    ? 'bg-blue-500 text-white animate-pulse' 
                    : 'bg-gradient-to-r from-slate-900 to-slate-800 text-white hover:from-slate-800 hover:to-slate-700 hover:shadow-xl'
                }`}
            >
              {isWatering ? (
                <>
                  <Loader2 className="animate-spin" size={18} /> Pump Active...
                </>
              ) : (
                <>
                  <BellRing size={18} /> Trigger Irrigation
                </>
              )}
            </button>
            
            <div className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold border-2 shadow-sm ${
              isAutoMode 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                : 'bg-blue-50 border-blue-200 text-blue-700'
            }`}>
              {isAutoMode ? (
                <>
                  <ShieldCheck size={18} className="text-emerald-600"/> AI is Monitoring Soil
                </>
              ) : (
                <>
                  <Zap size={18} className="text-blue-600"/> Manual Override Enabled
                </>
              )}
            </div>

            {showSuccess && (
              <div className="flex items-center gap-2 px-5 py-3 bg-emerald-50 border-2 border-emerald-200 rounded-xl text-emerald-700 text-xs font-bold animate-fadeIn">
                <CheckCircle2 size={18} /> Irrigation Completed!
              </div>
            )}
          </div>
        </div>

        {/* ACTIVITY LOG */}
        <div className="bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-lg border border-slate-100 animate-fadeIn">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
              <ListRestart size={22} className="text-blue-500" /> Analytics Feed
            </h3>
            <span className="text-xs text-slate-500 font-medium">{history.length} entries</span>
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {history.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <p className="text-sm font-medium">No activity yet</p>
              </div>
            ) : (
              history.map((item, index) => (
                <div 
                  key={item.id} 
                  className="flex justify-between items-center p-4 bg-gradient-to-r from-slate-50 to-white rounded-2xl border border-slate-100 hover:shadow-md transition-all animate-slideIn"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-2 h-2 rounded-full ${
                      item.type === 'success' ? 'bg-emerald-500' : 
                      item.type === 'info' ? 'bg-blue-500' : 
                      'bg-slate-400'
                    }`}></div>
                    <div>
                      <span className="text-xs font-black text-slate-400 block">{item.time}</span>
                      <span className="text-sm font-bold text-slate-700">{item.action}</span>
                    </div>
                  </div>
                  <span className={`text-xs font-black px-3 py-1.5 rounded-full shadow-sm border uppercase ${
                    item.type === 'success' 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                      : item.type === 'info'
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}>
                    {item.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
