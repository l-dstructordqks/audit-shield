import React, { useState, type ChangeEvent } from 'react';
//import { useNavigate } from 'react-router-dom';
import { analyzeTraffic, scanFromFile, scanFromText, scanFull } from '../services/api';
import { useNavigate } from 'react-router';


type AnalysisMode = 'text' | 'file';

export const RequirementsInput: React.FC = () => {
  
//  const navigate = useNavigate();

  const [mode, setMode] = useState<AnalysisMode>('text');
  const [textContent, setTextContent] = useState<string>('');
  const [txtFile, setTxtFile] = useState<File | null>(null);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [txtLabel, setTxtLabel] = useState('upload .txt file here');
  const [csvLabel, setCsvLabel] = useState('upload .csv file here')
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();
  
  const handleTxtChange = (e: ChangeEvent<HTMLInputElement>) => {
  if (e.target.files && e.target.files[0]) {
    setTxtLabel(e.target.files[0].name);
    setTxtFile(e.target.files[0]);
  }
};

const handleCsvChange = (e: ChangeEvent<HTMLInputElement>) => {
  if (e.target.files && e.target.files[0]) {
    setCsvLabel(e.target.files[0].name);
    setCsvFile(e.target.files[0]);
  }
};

  const handleSubmit = async () => {
    setLoading(true);
    
    try {
      if (mode === 'text') {
        // ENDPOINT PARA TEXTO (JSON)
        const packageResult = await scanFromText({ content: textContent });
        navigate('/RequirementsAnalysis', {
          state: { data: packageResult }
        });
      } 
      if (mode === 'file') {
        if (txtFile && !csvFile) {
          //console.log("Solo TXT");
          const packageResult = await scanFromFile(txtFile);
          navigate('/RequirementsAnalysis', {
            state: { data: packageResult }
          });
          //await scanOnlyTxt(txtFile);
        } 
        else if (!txtFile && csvFile) {
          //console.log("Solo CSV");
          const trafficResult = await analyzeTraffic(csvFile);
          navigate('/RequirementsAnalysis', {
            state: { data: trafficResult }
          });
          //console.log("Solo CSV");
          //await scanOnlyCsv(csvFile);
        } 
        else if (txtFile && csvFile) {
          //console.log("Ambos archivos");
          const fullResult = await scanFull(txtFile, csvFile);
          //console.log(fullResult);
          navigate('/RequirementsAnalysis', {
            state: { data: fullResult }
          });
          
          //await scanBothFiles(txtFile, csvFile);
        } 
        else {
          //console.log("No se subió ningún archivo");
          navigate('/');
        }
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
          className="w-full h-44 p-4 font-mono text-sm text-slate-200 bg-slate-800/50 border border-slate-700 rounded-xl placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-transparent transition-all resize-none shadow-inner"
          placeholder="Paste requirements.txt content here..."
          value={textContent}
          onChange={(e) => setTextContent(e.target.value)}
        />
      ) : (
        <div className='flex gap-3 py-3 justify-center'>
        <input
          id='requirements'
          type="file"
          className="hidden"
          onChange={handleTxtChange}
          accept='.txt'
        />
        <label htmlFor="requirements" className="font-mono text-sm text-slate-200 bg-slate-800/50 border border-slate-700 rounded-xl placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all resize-none shadow-inner py-1 min-w-50 px-2 flex items-center justify-center gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="21"
            height="21"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ffffff"
            stroke-width="1"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M14 3v4a1 1 0 0 0 1 1h4" />
            <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
            <path d="M9 17h6" />
            <path d="M9 13h6" />
          </svg>

          {txtLabel}
        </label>
        <input
          id='network'
          type="file"
          className="hidden"
          onChange={handleCsvChange}
          accept='.csv'
        />
        <label htmlFor="network" className="font-mono text-sm text-slate-200 bg-slate-800/50 border border-slate-700 rounded-xl placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all resize-none shadow-inner min-h-4 py-1 min-w-50 px-2 flex items-center justify-center gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="21"
            height="21"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ffffff"
            stroke-width="1"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M14 3v4a1 1 0 0 0 1 1h4" />
            <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
            <path d="M8 11h8v7h-8z" />
            <path d="M8 15h8" />
            <path d="M11 11v7" />
          </svg>
          {csvLabel}
        </label>
        </div>
      )}

      <button 
        onClick={handleSubmit} 
        disabled={
          loading ||
          (mode === 'file' && !txtFile && !csvFile)
        }
        className="mt-2 px-5 py-2.5 bg-gray-200 hover:bg-white text-blue-950 font-semibold rounded-lg shadow-lg shadow-blue-500/20 transition-all duration-200 active:scale-95 focus:ring-2 focus:ring-blue-400 focus:outline-none"
      >
        {loading ? 'Analyzing...' : 'Start Audit'}
      </button>
    </div>
  );
};

