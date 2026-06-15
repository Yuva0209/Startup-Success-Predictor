import React, { useState, useRef } from 'react';
import { Upload, X, FileText, AlertCircle, Play, Sparkles, Building2, Loader2 } from 'lucide-react';
import { MetricsPanel } from './MetricsPanel';

interface DashboardProps {
  onStartAnalyzing: () => void;
  onAnalysisComplete: (result: any) => void;
  predictionResult: any;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  onStartAnalyzing, 
  onAnalysisComplete, 
  predictionResult
}) => {
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    industry: 'AI/ML',
    stage: 'Seed',
    teamSize: '1-5',
    experience: '1-3 years',
    description: '',
    websiteUrl: '',
    businessModel: 'B2B SaaS',
    targetMarket: 'Enterprise'
  });
  
  const [pitchDeck, setPitchDeck] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // Drag and drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === "application/pdf" || file.name.endsWith(".pdf") || file.name.endsWith(".ppt") || file.name.endsWith(".pptx")) {
        setPitchDeck(file);
        setError(null);
      } else {
        setError("Only PDF or PowerPoint presentation files are supported.");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPitchDeck(e.target.files[0]);
      setError(null);
    }
  };

  const removeFile = () => {
    setPitchDeck(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError("Please enter a startup name.");
      return;
    }
    if (!formData.description.trim()) {
      setError("Please enter a startup description.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const data = new FormData();
      data.append('name', formData.name);
      data.append('industry', formData.industry);
      data.append('stage', formData.stage);
      data.append('team_size', formData.teamSize);
      data.append('experience', formData.experience);
      data.append('description', formData.description);
      data.append('website_url', formData.websiteUrl);
      data.append('business_model', formData.businessModel);
      data.append('target_market', formData.targetMarket);
      
      if (pitchDeck) {
        data.append('pitch_deck', pitchDeck);
      }

      const response = await fetch('http://127.0.0.1:8000/api/predict', {
        method: 'POST',
        body: data,
      });

      if (!response.ok) {
        throw new Error("Failed to evaluate. Please ensure the backend is running.");
      }

      const result = await response.json();
      
      // Trigger full screen animation step
      onStartAnalyzing();
      
      // Simulate backend completion trigger
      setTimeout(() => {
        onAnalysisComplete(result);
        setLoading(false);
      }, 9800); // Matching the timing of AIProcessing steps

    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred during evaluation.");
      setLoading(false);
    }
  };

  const handleLoadDemo = () => {
    setFormData({
      name: 'NeuroLink Systems',
      industry: 'AI/ML',
      stage: 'Seed',
      teamSize: '6-15',
      experience: '5+ years',
      description: 'An AI-powered neuromorphic hardware acceleration platform designed to process deep neural networks locally with 10x lower latency and 100x lower power footprint than current edge GPU solutions.',
      websiteUrl: 'https://neurolink.ai',
      businessModel: 'B2B SaaS',
      targetMarket: 'Enterprise'
    });
    setPitchDeck(new File(["demo"], "neurolink_pitch_deck.pdf", { type: "application/pdf" }));
    setError(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Panel: Inputs Form */}
      <div className="lg:col-span-5 glass-panel p-6 rounded-2xl border border-white/5 shadow-xl space-y-6">
        <div className="flex justify-between items-center pb-4 border-b border-white/5">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brandPurple" />
              Startup Evaluator
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">Input parameters to predict success metrics</p>
          </div>
          <button 
            type="button" 
            onClick={handleLoadDemo}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-brandPurple/15 text-brandPurple border border-brandPurple/20 hover:bg-brandPurple/25 transition-colors"
          >
            Load Demo Data
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-brandRed/10 border border-brandRed/20 text-brandRed text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Startup Name</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Stripe, Robinhood"
              className="w-full px-3 py-2 text-sm glass-input"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Industry</label>
              <select 
                name="industry" 
                value={formData.industry}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm glass-input"
              >
                <option value="AI/ML">AI / Machine Learning</option>
                <option value="SaaS">B2B SaaS / Platforms</option>
                <option value="Fintech">Financial Tech</option>
                <option value="Healthcare">Health & MedTech</option>
                <option value="CleanTech">CleanTech / Sustainability</option>
                <option value="E-commerce">E-Commerce / Consumer</option>
                <option value="EdTech">EdTech</option>
                <option value="Other">Other / Tech Vertical</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Funding Stage</label>
              <select 
                name="stage" 
                value={formData.stage}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm glass-input"
              >
                <option value="Pre-Seed">Pre-Seed / Idea</option>
                <option value="Seed">Seed Stage</option>
                <option value="Series A">Series A</option>
                <option value="Series B">Series B</option>
                <option value="Bootstrapped">Bootstrapped</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Team Size</label>
              <select 
                name="teamSize" 
                value={formData.teamSize}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm glass-input"
              >
                <option value="1-5">1-5 Employees</option>
                <option value="6-15">6-15 Employees</option>
                <option value="16-50">16-50 Employees</option>
                <option value="50+">50+ Employees</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Founder Experience</label>
              <select 
                name="experience" 
                value={formData.experience}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm glass-input"
              >
                <option value="<1 year">Under 1 Year</option>
                <option value="1-3 years">1-3 Years</option>
                <option value="3-5 years">3-5 Years</option>
                <option value="5+ years">5+ Years (Serial)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Business Model</label>
              <select 
                name="businessModel" 
                value={formData.businessModel}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm glass-input"
              >
                <option value="B2B SaaS">B2B SaaS</option>
                <option value="B2C Subscription">B2C Subscription</option>
                <option value="Marketplace">Marketplace / Platform</option>
                <option value="Transactional">Transactional / API</option>
                <option value="Other">Other Model</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Target Market</label>
              <select 
                name="targetMarket" 
                value={formData.targetMarket}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm glass-input"
              >
                <option value="Enterprise">Enterprise Corporations</option>
                <option value="SMB">SMB / Mid-Market</option>
                <option value="Consumer">B2C Consumer Retail</option>
                <option value="Developers">Developers / Infrastructure</option>
                <option value="Healthcare">Clinics & Healthcare</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Startup Description</label>
            <textarea 
              name="description" 
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="What core problem do you solve? Describe your technology, product, and growth engine..."
              className="w-full px-3 py-2 text-sm glass-input resize-none"
            ></textarea>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Website URL (Optional)</label>
            <input 
              type="url" 
              name="websiteUrl" 
              value={formData.websiteUrl}
              onChange={handleChange}
              placeholder="https://example.com"
              className="w-full px-3 py-2 text-sm glass-input"
            />
          </div>

          {/* Pitch Deck Upload Zone */}
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Pitch Deck Upload (Optional)</label>
            
            <div 
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`w-full min-h-[100px] border border-dashed rounded-xl flex flex-col items-center justify-center p-4 cursor-pointer transition-all ${
                dragActive 
                  ? 'border-brandPurple bg-brandPurple/5' 
                  : pitchDeck 
                    ? 'border-brandEmerald bg-brandEmerald/5' 
                    : 'border-white/10 hover:border-brandPurple/40 hover:bg-white/5'
              }`}
            >
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,.ppt,.pptx"
                className="hidden" 
              />
              {pitchDeck ? (
                <div className="flex items-center gap-3 w-full justify-between">
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <div className="p-2 bg-brandEmerald/10 rounded-lg text-brandEmerald">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="text-left overflow-hidden">
                      <p className="text-xs font-bold text-white truncate max-w-[180px]">{pitchDeck.name}</p>
                      <p className="text-[10px] text-gray-400">{(pitchDeck.size / (1024 * 1024)).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <button 
                    type="button" 
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile();
                    }}
                    className="p-1 rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <>
                  <Upload className="w-6 h-6 text-gray-400 mb-1 animate-pulse" />
                  <p className="text-xs text-white font-medium">Drag and drop pitch deck, or click to upload</p>
                  <p className="text-[10px] text-gray-400 mt-1">Accepts PDF or PPT documents (Max 10MB)</p>
                </>
              )}
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl glow-btn glow-btn-primary text-white font-bold text-sm transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing Models...
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Analyze Startup
              </>
            )}
          </button>
        </form>
      </div>

      {/* Right Panel: Display Results */}
      <div className="lg:col-span-7 space-y-6">
        {predictionResult ? (
          <MetricsPanel result={predictionResult} formData={formData} />
        ) : (
          <div className="glass-panel p-8 rounded-2xl border border-white/5 min-h-[500px] flex flex-col items-center justify-center text-center relative overflow-hidden">
            {/* Background Grid Accent */}
            <div className="grid-bg"></div>
            
            <div className="relative p-6 bg-brandIndigo/5 rounded-full border border-brandIndigo/10 mb-6">
              <Building2 className="w-12 h-12 text-brandPurple animate-pulse" />
            </div>
            
            <h3 className="text-xl font-bold text-white relative z-10">
              Awaiting Startup Evaluation Input
            </h3>
            <p className="text-sm text-slate-400 max-w-sm mt-2 leading-relaxed relative z-10">
              Provide your startup concept details on the left, upload your investor pitch deck, and click "Analyze Startup" to initialize predictive analysis.
            </p>
            
            <div className="grid grid-cols-2 gap-4 max-w-md w-full mt-8 relative z-10">
              <div className="p-4 rounded-xl border border-white/5 bg-white/5 text-left">
                <span className="text-xs font-extrabold text-brandCyan block mb-1">VC Prediction</span>
                <p className="text-[11px] text-gray-400 leading-normal">
                  Calculate probability metrics for fundraising capability and scaling readiness.
                </p>
              </div>
              <div className="p-4 rounded-xl border border-white/5 bg-white/5 text-left">
                <span className="text-xs font-extrabold text-brandPurple block mb-1">Deep Benchmarks</span>
                <p className="text-[11px] text-gray-400 leading-normal">
                  Map performance criteria against actual industry averages in real-time.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
