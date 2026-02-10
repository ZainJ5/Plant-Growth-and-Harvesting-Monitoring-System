import React, { useState } from 'react';
import { Camera, Upload, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000';

const PlantScanner = () => {
  const [selectedImage, setSelectedImage] = useState(null); // preview URL
  const [file, setFile] = useState(null); // actual file to upload
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleImageChange = (e) => {
    const nextFile = e.target.files[0];
    if (nextFile) {
      setSelectedImage(URL.createObjectURL(nextFile));
      setFile(nextFile);
      setResult(null);
      setError(null);
    }
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
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze plant image');
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
      });
    } catch (err) {
      setError(err.message || 'Something went wrong while analyzing the plant.');
    } finally {
      setIsAnalyzing(false);
    }
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
        <label
          htmlFor="plant-input"
          className="cursor-pointer text-xs font-bold text-emerald-600 hover:text-emerald-700"
        >
          {selectedImage ? 'Change Image' : 'Upload Plant Photo'}
        </label>
      </div>

      {file && !result && (
        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing}
          className="w-full mt-4 bg-slate-900 text-white py-3 rounded-xl font-bold text-sm flex justify-center items-center gap-2 disabled:opacity-70"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="animate-spin" size={16} /> Analyzing...
            </>
          ) : (
            'Start AI Diagnosis'
          )}
        </button>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-50 rounded-2xl border border-red-100 flex items-center gap-3 text-left">
          <AlertTriangle className="text-red-500" size={20} />
          <p className="text-xs text-red-700 font-medium">{error}</p>
        </div>
      )}

      {result && !error && (
        <div className="mt-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-3">
          <CheckCircle className="text-emerald-600" size={20} />
          <div>
            <p className="text-sm font-bold text-emerald-800">Result: {result.status}</p>
            <p className="text-[10px] text-emerald-600 font-medium">Confidence: {result.confidence}</p>
            {result.note && (
              <p className="text-[10px] text-emerald-700 font-medium mt-1">
                {result.note}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlantScanner;
