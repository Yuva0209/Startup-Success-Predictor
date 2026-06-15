import { useState } from 'react';
import { Rocket, Cpu, ExternalLink } from 'lucide-react';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { AIProcessing } from './components/AIProcessing';

function App() {
  const [view, setView] = useState<'landing' | 'dashboard'>('landing');
  const [analyzing, setAnalyzing] = useState(false);
  const [predictionResult, setPredictionResult] = useState<any>(null);

  const handleStartAnalyzing = () => {
    setAnalyzing(true);
  };

  const handleAnalysisComplete = (result: any) => {
    setPredictionResult(result);
    setAnalyzing(false);
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col justify-between select-none">
      {/* Background Layer: Grids and Glowing Orbs */}
      <div className="grid-bg z-0 pointer-events-none"></div>
      <div className="radial-orb w-[600px] h-[600px] bg-brandPurple/10 -top-60 -left-60 animate-float-orb-1"></div>
      <div className="radial-orb w-[500px] h-[500px] bg-brandBlue/10 bottom-20 -right-40 animate-float-orb-2"></div>
      <div className="radial-orb w-[400px] h-[400px] bg-brandCyan/10 top-1/2 left-1/3 -translate-y-1/2 animate-float-orb-3"></div>

      {/* Global Navigation Header */}
      <header className="relative z-20 border-b border-white/5 bg-[#030014]/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div 
            onClick={() => setView('landing')} 
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="p-2 bg-gradient-to-tr from-brandPurple to-brandBlue rounded-xl text-white shadow-lg shadow-brandPurple/20 transition-transform group-hover:scale-105">
              <Rocket className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-lg tracking-tight text-white flex items-center gap-1.5">
              VentureCast
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brandPurple/15 text-brandPurple border border-brandPurple/20 uppercase">
                AI
              </span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            <button 
              onClick={() => setView('landing')} 
              className={`hover:text-white transition-colors ${view === 'landing' ? 'text-white' : ''}`}
            >
              Overview
            </button>
            <button 
              onClick={() => { setView('dashboard'); }} 
              className={`hover:text-white transition-colors ${view === 'dashboard' ? 'text-white' : ''}`}
            >
              Predictor Dashboard
            </button>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noreferrer" 
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              Docs
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </nav>

          <div>
            {view === 'landing' ? (
              <button 
                onClick={() => setView('dashboard')}
                className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white text-sm font-bold transition-all"
              >
                Launch Dashboard
              </button>
            ) : (
              <button 
                onClick={() => {
                  setView('landing');
                  setPredictionResult(null);
                }}
                className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white text-sm font-bold transition-all"
              >
                Reset & Exit
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content View Switcher */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {view === 'landing' ? (
          <LandingPage onStartApp={() => setView('dashboard')} />
        ) : (
          <Dashboard 
            onStartAnalyzing={handleStartAnalyzing}
            onAnalysisComplete={handleAnalysisComplete}
            predictionResult={predictionResult}
          />
        )}
      </main>

      {/* Full screen AI processing overlay */}
      {analyzing && (
        <AIProcessing onComplete={() => setAnalyzing(false)} />
      )}

      {/* Footer Details */}
      <footer className="relative z-10 border-t border-white/5 bg-[#030014]/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-brandPurple" />
            <span>VentureCast AI Evaluator Platform © 2026. All Rights Reserved.</span>
          </div>
          <div className="flex items-center gap-4 text-gray-500">
            <a href="#terms" className="hover:text-gray-300">Terms of Use</a>
            <span>•</span>
            <a href="#privacy" className="hover:text-gray-300">Privacy Policy</a>
            <span>•</span>
            <a href="#github" className="hover:text-gray-300 flex items-center gap-1">
              Source Code
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
