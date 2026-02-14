import React, { useState } from 'react';
import { Camera, Upload, Loader2, CheckCircle, AlertTriangle, X, Sparkles } from 'lucide-react';
import { API_BASE_URL, getAuthHeaders } from '../api/config';

const PlantScanner = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [file, setFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleImageChange = (e) => {
    const nextFile = e.target.files[0];
    if (nextFile) {
      // Validate file type
      if (!nextFile.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }
      // Validate file size (max 10MB)
      if (nextFile.size > 10 * 1024 * 1024) {
        setError('Image size must be less than 10MB');
        return;
      }
      setSelectedImage(URL.createObjectURL(nextFile));
      setFile(nextFile);
      setResult(null);
      setError(null);
    }
  };

  const handleClear = () => {
    setSelectedImage(null);
    setFile(null);
    setResult(null);
    setError(null);
    // Reset file input
    const input = document.getElementById('plant-input');
    if (input) input.value = '';
  };

  const handleAnalyze = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`${API_BASE_URL}/plant/check`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: formData,
      });

      const data = await response.json();

      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('isAuthenticated');
        window.location.href = '/login';
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to analyze plant image');
      }

      // Map backend response into a UI-friendly shape
      const isHealthy = data.is_healthy;
      const mainDisease = Array.isArray(data.diseases) && data.diseases.length > 0 ? data.diseases[0] : null;
      const classification = Array.isArray(data.classification) && data.classification.length > 0 ? data.classification[0] : null;

      setResult({
        status: isHealthy === null ? 'Unknown' : isHealthy ? 'Healthy' : 'Unhealthy',
        confidence: classification?.probability
          ? `${Math.round(classification.probability * 100)}%`
          : mainDisease?.probability
            ? `${Math.round(mainDisease.probability * 100)}%`
            : 'N/A',
        note: mainDisease?.name
          ? `Top issue: ${mainDisease.name}`
          : classification?.name
            ? `Top match: ${classification.name}`
            : 'No specific issues detected.',
        isHealthy: isHealthy
      });
    } catch (err) {
      setError(err.message || 'Something went wrong while analyzing the plant.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-lg animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2.5 rounded-xl text-white shadow-lg shadow-emerald-200">
            <Camera size={22} />
          </div>
          <div>
            <h3 className="font-black text-slate-800 text-lg">AI Health Scanner</h3>
            <p className="text-xs text-slate-500 font-medium">Upload a plant image for instant diagnosis</p>
          </div>
        </div>
        {selectedImage && (
          <button
            onClick={handleClear}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
            title="Clear image"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <div className={`bg-gradient-to-br from-slate-50 to-emerald-50/30 border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
        selectedImage ? 'border-emerald-300' : 'border-slate-200 hover:border-emerald-300'
      }`}>
        {selectedImage ? (
          <div className="space-y-4">
            <div className="relative inline-block">
              <img 
                src={selectedImage} 
                className="h-48 w-auto mx-auto rounded-xl shadow-lg object-cover" 
                alt="Plant preview" 
              />
              {isAnalyzing && (
                <div className="absolute inset-0 bg-black/20 rounded-xl flex items-center justify-center">
                  <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg">
                    <Loader2 className="animate-spin text-emerald-600" size={32} />
                  </div>
                </div>
              )}
            </div>
            <p className="text-xs text-slate-600 font-medium">{file?.name}</p>
          </div>
        ) : (
          <div className="py-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white shadow-md mb-4">
              <Upload className="text-emerald-500" size={32} />
            </div>
            <p className="text-sm font-bold text-slate-700 mb-2">Upload Plant Photo</p>
            <p className="text-xs text-slate-500 mb-4">JPG, PNG up to 10MB</p>
          </div>
        )}

        <input 
          type="file" 
          id="plant-input" 
          className="hidden" 
          onChange={handleImageChange} 
          accept="image/*" 
          disabled={isAnalyzing}
        />
        {!selectedImage && (
          <label
            htmlFor="plant-input"
            className="inline-flex items-center gap-2 cursor-pointer px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-all transform hover:scale-105 shadow-md hover:shadow-lg"
          >
            <Upload size={16} />
            Choose Image
          </label>
        )}
      </div>

      {file && !result && !isAnalyzing && (
        <button
          onClick={handleAnalyze}
          className="w-full mt-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white py-4 rounded-xl font-bold text-sm flex justify-center items-center gap-2 hover:from-slate-800 hover:to-slate-700 transition-all transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
        >
          <Sparkles size={18} />
          Start AI Diagnosis
        </button>
      )}

      {isAnalyzing && (
        <div className="mt-4 p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-center gap-3 animate-fadeIn">
          <Loader2 className="animate-spin text-blue-600" size={20} />
          <div>
            <p className="text-sm font-bold text-blue-800">Analyzing plant health...</p>
            <p className="text-xs text-blue-600 font-medium">This may take a few seconds</p>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-50 rounded-2xl border border-red-200 flex items-start gap-3 animate-fadeIn">
          <AlertTriangle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
          <div className="flex-1">
            <p className="text-sm font-bold text-red-800 mb-1">Analysis Failed</p>
            <p className="text-xs text-red-700 font-medium">{error}</p>
          </div>
        </div>
      )}

      {result && !error && (
        <div className={`mt-4 p-5 rounded-2xl border-2 flex items-start gap-4 animate-fadeIn ${
          result.isHealthy 
            ? 'bg-emerald-50 border-emerald-200' 
            : result.status === 'Unknown'
            ? 'bg-amber-50 border-amber-200'
            : 'bg-red-50 border-red-200'
        }`}>
          <div className={`p-2 rounded-xl ${
            result.isHealthy 
              ? 'bg-emerald-500' 
              : result.status === 'Unknown'
              ? 'bg-amber-500'
              : 'bg-red-500'
          }`}>
            <CheckCircle className="text-white" size={24} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <p className={`text-base font-black ${
                result.isHealthy 
                  ? 'text-emerald-800' 
                  : result.status === 'Unknown'
                  ? 'text-amber-800'
                  : 'text-red-800'
              }`}>
                Status: {result.status}
              </p>
            </div>
            <div className="space-y-1">
              <p className={`text-xs font-bold ${
                result.isHealthy 
                  ? 'text-emerald-700' 
                  : result.status === 'Unknown'
                  ? 'text-amber-700'
                  : 'text-red-700'
              }`}>
                Confidence: {result.confidence}
              </p>
              {result.note && (
                <p className={`text-xs font-medium mt-2 ${
                  result.isHealthy 
                    ? 'text-emerald-700' 
                    : result.status === 'Unknown'
                    ? 'text-amber-700'
                    : 'text-red-700'
                }`}>
                  {result.note}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlantScanner;
