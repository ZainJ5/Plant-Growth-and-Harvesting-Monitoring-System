import React, { useState } from 'react';
import { Camera, Upload, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';

const PlantScanner = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const simulateAI = () => {
    setIsAnalyzing(true);
    // This represents the "Integration of Plant APIs" mentioned in the proposal [cite: 18, 71]
    setTimeout(() => {
      setIsAnalyzing(false);
      setResult({
        status: "Healthy",
        confidence: "94%",
        note: "No signs of pests or fungi detected."
      });
    }, 2000);
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm mt-6">
      <div className="flex items-center gap-2 mb-4">
        <Camera className="text-emerald-500" size={20} />
        <h3 className="font-bold text-slate-800">AI Health Scanner</h3>
      </div>

      <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center">
        {selectedImage ? (
          <img src={selectedImage} className="h-40 mx-auto rounded-xl mb-4 shadow-sm" alt="Preview" />
        ) : (
          <Upload className="mx-auto text-slate-300 mb-2" size={32} />
        )}
        
        <input type="file" id="plant-input" className="hidden" onChange={handleImageChange} accept="image/*" />
        <label htmlFor="plant-input" className="cursor-pointer text-xs font-bold text-emerald-600 hover:text-emerald-700">
          {selectedImage ? "Change Image" : "Upload Plant Photo"}
        </label>
      </div>

      {selectedImage && !result && (
        <button 
          onClick={simulateAI}
          disabled={isAnalyzing}
          className="w-full mt-4 bg-slate-900 text-white py-3 rounded-xl font-bold text-sm flex justify-center items-center gap-2"
        >
          {isAnalyzing ? <><Loader2 className="animate-spin" size={16}/> Analyzing...</> : "Start AI Diagnosis"}
        </button>
      )}

      {result && (
        <div className="mt-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-3">
          <CheckCircle className="text-emerald-600" size={20} />
          <div>
            <p className="text-sm font-bold text-emerald-800">Result: {result.status}</p>
            <p className="text-[10px] text-emerald-600 font-medium">Confidence: {result.confidence}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlantScanner;
