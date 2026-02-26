import React, { useState, type ChangeEvent } from 'react';
//import { useNavigate } from 'react-router-dom';
import { scanFromFile, scanFromText } from '../services/api';


type AnalysisMode = 'text' | 'file';

export const RequirementsInput: React.FC = () => {
  
//  const navigate = useNavigate();

  const [mode, setMode] = useState<AnalysisMode>('text');
  const [textContent, setTextContent] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    try {
      if (mode === 'text') {
        // ENDPOINT PARA TEXTO (JSON)
        await scanFromText({ content: textContent });
      } else if (mode === 'file' && file) {
        // ENDPOINT PARA ARCHIVOS (FormData)
        await scanFromFile(file)
      }
      //navigate('/');
    } catch (error) {
      console.error('Error analizando:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 shadow-2xl rounded-2xl p-6">
      {/* Selector de Modo */}
      <div className="flex items-center justify-center gap-4 mb-4">
        <button 
          onClick={() => setMode('text')}
          className={`btn ${mode === 'text' ? 'btn-primary' : 'btn-outline'} px-5 py-2.5 bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white font-medium rounded-lg transition-all duration-200 focus:ring-2 focus:ring-slate-600 focus:outline-none`}
        >
          Paste Text
        </button>
        <button 
          onClick={() => setMode('file')}
          className={`btn ${mode === 'file' ? 'btn-primary' : 'btn-outline'} px-5 py-2.5 bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white font-medium rounded-lg transition-all duration-200 focus:ring-2 focus:ring-slate-600 focus:outline-none`}
        >
          Upload File
        </button>
      </div>

      {/* Input Dinámico */}
      {mode === 'text' ? (
        <textarea
          className="w-full h-64 p-4 font-mono text-sm text-slate-200 bg-slate-800/50 border border-slate-700 rounded-xl placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all resize-none shadow-inner"
          placeholder="Paste requirements.txt content here..."
          value={textContent}
          onChange={(e) => setTextContent(e.target.value)}
        />
      ) : (
        <input
          type="file"
          className="file-input file-input-bordered w-full"
          onChange={handleFileChange}
        />
      )}

      <button 
        onClick={handleSubmit} 
        disabled={loading || (mode === 'file' && !file)}
        className="mt-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg shadow-lg shadow-blue-500/20 transition-all duration-200 active:scale-95 focus:ring-2 focus:ring-blue-400 focus:outline-none"
      >
        {loading ? 'Analyzing...' : 'Start Audit'}
      </button>
    </div>
  );
};

