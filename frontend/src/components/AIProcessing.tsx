import React, { useState, useEffect } from 'react';
import { Loader2, CheckCircle2, Circle } from 'lucide-react';

interface AIProcessingProps {
  onComplete: () => void;
}

const STEPS = [
  { label: "Reading Pitch Deck & Data", subText: "Parsing PDF structure & text layers..." },
  { label: "Extracting Business Features", subText: "Identifying business model & sector keywords..." },
  { label: "Analyzing Market Trends", subText: "Evaluating competitor density & TAM metrics..." },
  { label: "Evaluating Founder Profile", subText: "Scoring executive leadership experience..." },
  { label: "Generating Success Prediction", subText: "Running neural network classification layers..." },
  { label: "Building Report & Analytics Dashboard", subText: "Synthesizing SWOT matrix & recommendations..." }
];

export const AIProcessing: React.FC<AIProcessingProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (currentStep < STEPS.length) {
      // Simulate progress inside the current step
      const stepDuration = 1500; // 1.5 seconds per step
      const startTime = Date.now();
      
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const stepProgress = Math.min((elapsed / stepDuration) * 100, 100);
        
        // Calculate total progress
        const overallProgress = ((currentStep * 100) + stepProgress) / STEPS.length;
        setProgress(overallProgress);

        if (elapsed >= stepDuration) {
          clearInterval(interval);
          setCompletedSteps(prev => [...prev, currentStep]);
          setCurrentStep(prev => prev + 1);
        }
      }, 50);

      return () => clearInterval(interval);
    } else {
      // All steps finished, add a slight delay before triggering callback
      const timeout = setTimeout(() => {
        onComplete();
      }, 800);
      return () => clearTimeout(timeout);
    }
  }, [currentStep, onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-[#030014]/90 backdrop-blur-md flex flex-col items-center justify-center p-6">
      {/* Background Orbs */}
      <div className="radial-orb w-[400px] h-[400px] bg-brandPurple/25 top-1/4 left-1/4 animate-pulse-slow"></div>
      <div className="radial-orb w-[400px] h-[400px] bg-brandBlue/25 bottom-1/4 right-1/4 animate-pulse-slow"></div>
      
      <div className="w-full max-w-xl glass-panel p-8 rounded-2xl relative border border-white/10 shadow-2xl">
        {/* Glowing Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-4 bg-brandIndigo/10 rounded-full border border-brandIndigo/20 mb-4 animate-bounce">
            <Loader2 className="w-8 h-8 text-brandCyan animate-spin" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            AI Startup Evaluation Engine Active
          </h2>
          <p className="text-sm text-gray-400 mt-2">
            Running multi-factor predictive modeling on your startup profile
          </p>
        </div>

        {/* Overall Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-xs text-gray-400 mb-2 font-medium">
            <span>Overall Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
            <div 
              className="h-full bg-gradient-to-r from-brandPurple via-brandIndigo to-brandCyan transition-all duration-150 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Steps List */}
        <div className="space-y-4">
          {STEPS.map((step, idx) => {
            const isCompleted = completedSteps.includes(idx);
            const isCurrent = currentStep === idx;
            
            return (
              <div 
                key={idx} 
                className={`flex items-start p-3 rounded-lg border transition-all duration-300 ${
                  isCurrent 
                    ? 'bg-brandIndigo/10 border-brandIndigo/30 shadow-md shadow-brandIndigo/5' 
                    : isCompleted 
                      ? 'bg-transparent border-transparent opacity-70' 
                      : 'bg-transparent border-transparent opacity-40'
                }`}
              >
                <div className="mr-3 mt-0.5">
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-brandEmerald" />
                  ) : isCurrent ? (
                    <Loader2 className="w-5 h-5 text-brandCyan animate-spin" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-500" />
                  )}
                </div>
                <div>
                  <h4 className={`text-sm font-semibold ${
                    isCurrent ? 'text-white' : isCompleted ? 'text-gray-300' : 'text-gray-400'
                  }`}>
                    {step.label}
                  </h4>
                  {isCurrent && (
                    <p className="text-xs text-brandCyan/90 mt-0.5 font-medium animate-pulse">
                      {step.subText}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
