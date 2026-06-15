import React from 'react';
import AnimatedBackground from "./AnimatedBackground";
import TextType from "./TextType";

import {
  ShieldCheck, BarChart3, Users, Cpu, FilePieChart,
  ArrowRight
} from 'lucide-react';

interface LandingPageProps {
  onStartApp: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartApp }) => {
  return (

    <>
      <AnimatedBackground />

      <div className="space-y-24 pb-20">
        {/* Hero Section */}
        <section className="relative pt-12 md:pt-20 flex flex-col items-center justify-center text-center">
          {/* Glow Mesh Orbs */}
          <div className="radial-orb w-[500px] h-[500px] bg-brandPurple/20 -top-40 left-1/2 -translate-x-1/2 animate-pulse-slow"></div>

          <div className="relative z-10 max-w-4xl space-y-6 px-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brandPurple/10 border border-brandPurple/25 text-xs text-brandIndigo font-semibold uppercase tracking-wider mb-2">
              <Cpu className="w-3.5 h-3.5" />
              Empowered by Predictive AI
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
              <TextType words={["Predict Startup Success", "Analyze Startups", "Score Founders", "Forecast VC Wins"]} />
              <br />
              <span className="bg-gradient-to-r from-brandPurple via-brandIndigo to-brandCyan bg-clip-text text-transparent">
                Before Investors Do
              </span>
            </h1>
            <p className="text-base md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
              AI-powered startup evaluation using pitch deck analysis, market intelligence, founder strength, and predictive analytics.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
              <button
                onClick={onStartApp}
                className="w-full sm:w-auto px-8 py-4 rounded-xl glow-btn glow-btn-primary text-white font-bold text-base flex items-center justify-center gap-2"
              >
                Analyze Startup
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={onStartApp}
                className="w-full sm:w-auto px-8 py-4 rounded-xl glass-panel text-white font-bold text-base hover:bg-white/10 transition-colors border border-white/10"
              >
                View Demo
              </button>
            </div>
          </div>

          {/* Hero Visual Mockup: Dashboard Preview */}
          <div className="relative z-10 w-full max-w-5xl mt-16 px-4">
            <div className="glass-panel p-4 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden group">
              {/* Inner Dashboard Preview Grid */}
              <div className="grid grid-cols-12 gap-4 bg-[#09071c] p-4 rounded-xl border border-white/5 opacity-90">
                {/* Form Side Mock */}
                <div className="col-span-12 md:col-span-4 border-r border-white/5 pr-4 text-left hidden md:block space-y-3">
                  <div className="h-4 w-24 bg-white/10 rounded"></div>
                  <div className="h-8 bg-white/5 rounded border border-white/5"></div>
                  <div className="h-4 w-16 bg-white/10 rounded"></div>
                  <div className="h-8 bg-white/5 rounded border border-white/5"></div>
                  <div className="h-4 w-28 bg-white/10 rounded"></div>
                  <div className="h-20 bg-white/5 rounded border border-white/5"></div>
                  <div className="h-10 bg-brandPurple/30 rounded flex items-center justify-center text-[10px] text-white font-bold">
                    Evaluating Concept...
                  </div>
                </div>

                {/* Scores Side Mock */}
                <div className="col-span-12 md:col-span-8 space-y-4">
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <div className="h-5 w-32 bg-white/15 rounded"></div>
                    <div className="h-5 w-20 bg-brandEmerald/20 rounded-full border border-brandEmerald/25"></div>
                  </div>

                  {/* Visual Chart Bars Mockup */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex flex-col items-center">
                      <span className="text-[10px] text-gray-400">Success Rate</span>
                      <span className="text-xl font-bold text-brandEmerald mt-1">84%</span>
                    </div>
                    <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex flex-col items-center">
                      <span className="text-[10px] text-gray-400">Risk Profile</span>
                      <span className="text-xl font-bold text-brandRed mt-1">16%</span>
                    </div>
                    <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex flex-col items-center">
                      <span className="text-[10px] text-gray-400">Moat Index</span>
                      <span className="text-xl font-bold text-brandCyan mt-1">High</span>
                    </div>
                  </div>

                  <div className="h-28 bg-white/5 rounded-xl border border-white/5 flex items-center justify-center">
                    <div className="w-11/12 h-5/6 flex items-end justify-between px-4">
                      <div className="w-8 h-1/2 bg-brandPurple/60 rounded-t"></div>
                      <div className="w-8 h-2/3 bg-brandBlue/60 rounded-t"></div>
                      <div className="w-8 h-5/6 bg-brandCyan/60 rounded-t"></div>
                      <div className="w-8 h-2/5 bg-brandEmerald/60 rounded-t"></div>
                      <div className="w-8 h-3/4 bg-brandIndigo/60 rounded-t"></div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Glowing borders on overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#030014] via-transparent to-transparent pointer-events-none"></div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="max-w-6xl mx-auto px-4 space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold text-white">Advanced Evaluation Features</h2>
            <p className="text-sm text-slate-400 max-w-xl mx-auto">
              Our predictive engines assess key metrics to deliver institutional-grade assessments of startup parameters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
              <div className="p-3 bg-brandPurple/10 rounded-xl text-brandPurple inline-block border border-brandPurple/20">
                <FilePieChart className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Pitch Deck Parser</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Extract context and strategic keywords from uploaded PDFs to identify target product scopes.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
              <div className="p-3 bg-brandIndigo/10 rounded-xl text-brandIndigo inline-block border border-brandIndigo/20">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Founder Assessment</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Score founder competence based on historical experience thresholds and team structural composition.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
              <div className="p-3 bg-brandCyan/10 rounded-xl text-brandCyan inline-block border border-brandCyan/20">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Industry Benchmarking</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Map and overlay startup metric indices against actual top-performing market competitors.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
              <div className="p-3 bg-brandEmerald/10 rounded-xl text-brandEmerald inline-block border border-brandEmerald/20">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">SWOT & Acceleration</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Generate quadrant matrices and detailed strategies to improve operational benchmarks.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="bg-white/[0.01] border-y border-white/5 py-16">
          <div className="max-w-6xl mx-auto px-4 space-y-12">
            <div className="text-center space-y-3">
              <h2 className="text-3xl font-bold text-white">How It Works</h2>
              <p className="text-sm text-slate-400">Get investor-grade predictions in three simple steps</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Step 1 */}
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-brandPurple/10 border border-brandPurple/30 flex items-center justify-center text-brandIndigo font-bold text-lg">
                  1
                </div>
                <h3 className="text-lg font-bold text-white">Input Details</h3>
                <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                  Provide startup concepts, select stage parameters, and upload investor pitch decks.
                </p>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-brandCyan/10 border border-brandCyan/30 flex items-center justify-center text-brandCyan font-bold text-lg">
                  2
                </div>
                <h3 className="text-lg font-bold text-white">Deep AI Scan</h3>
                <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                  Our FastAPI backend parses parameters, running ML algorithms and evaluating keywords.
                </p>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-brandEmerald/10 border border-brandEmerald/30 flex items-center justify-center text-brandEmerald font-bold text-lg">
                  3
                </div>
                <h3 className="text-lg font-bold text-white">VC Evaluation</h3>
                <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                  Review interactive charts, download evaluation reports, and act on strategic insights.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* AI Tech Stack */}
        <section className="max-w-6xl mx-auto px-4 space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold text-white">AI Technology Stack</h2>
            <p className="text-sm text-slate-400">Institutional infrastructure for high-accuracy predictions</p>
          </div>

          <div className="glass-panel p-8 rounded-3xl border border-white/5 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 border-r border-white/5">
              <span className="text-2xl font-black text-brandPurple block">FASTAPI</span>
              <span className="text-[10px] text-gray-500 block mt-1 uppercase tracking-widest">REST Framework</span>
            </div>
            <div className="p-4 md:border-r border-white/5">
              <span className="text-2xl font-black text-brandCyan block">PYPDF</span>
              <span className="text-[10px] text-gray-500 block mt-1 uppercase tracking-widest">Text Extractor</span>
            </div>
            <div className="p-4 border-r border-white/5">
              <span className="text-2xl font-black text-brandIndigo block">RECHARTS</span>
              <span className="text-[10px] text-gray-500 block mt-1 uppercase tracking-widest">Vector Graphics</span>
            </div>
            <div className="p-4">
              <span className="text-2xl font-black text-brandEmerald block">REACT + TS</span>
              <span className="text-[10px] text-gray-500 block mt-1 uppercase tracking-widest">Typed UI Layouts</span>
            </div>
          </div>
        </section>

        {/* Success Metrics */}
        <section className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-white/5 text-center space-y-1">
            <span className="text-4xl font-extrabold text-white block">14,200+</span>
            <span className="text-xs text-brandCyan font-semibold uppercase tracking-wider">Startups Evaluated</span>
            <p className="text-[11px] text-gray-500 mt-2">Active database of technology ventures and metric pools.</p>
          </div>
          <div className="glass-panel p-6 rounded-2xl border border-white/5 text-center space-y-1">
            <span className="text-4xl font-extrabold text-white block">88.4%</span>
            <span className="text-xs text-brandPurple font-semibold uppercase tracking-wider">Prediction Accuracy</span>
            <p className="text-[11px] text-gray-500 mt-2">Validated metric outcomes matching subsequent seed triggers.</p>
          </div>
          <div className="glass-panel p-6 rounded-2xl border border-white/5 text-center space-y-1">
            <span className="text-4xl font-extrabold text-white block">$1.2B+</span>
            <span className="text-xs text-brandEmerald font-semibold uppercase tracking-wider">Aggregate Funding Tracked</span>
            <p className="text-[11px] text-gray-500 mt-2">Capital transactions monitored post-platform evaluation.</p>
          </div>
        </section>

        {/* Testimonials */}
        <section className="max-w-5xl mx-auto px-4 space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold text-white">Trusted by Top Allocators</h2>
            <p className="text-sm text-slate-400">What leading VC funds and accelerators say about our predictive analytics</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4 flex flex-col justify-between">
              <p className="text-xs text-slate-300 italic leading-relaxed">
                "We have integrated this success predictor into our pre-screening workflow. It helps us identify diamonds in the rough by evaluating core defensibility and market growth variables from decks before our first meeting."
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                <div className="w-10 h-10 rounded-full bg-brandPurple/20 flex items-center justify-center font-bold text-brandPurple">
                  MK
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Marcus Vance</h4>
                  <p className="text-[10px] text-gray-400">Managing Partner, Horizon Capital</p>
                </div>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4 flex flex-col justify-between">
              <p className="text-xs text-slate-300 italic leading-relaxed">
                "As a serial founder, I used this platform to benchmark my new medtech concept. The recommendations on compliance schemas and defensive patent filings directly shaped our seed stage roadmap."
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                <div className="w-10 h-10 rounded-full bg-brandCyan/20 flex items-center justify-center font-bold text-brandCyan">
                  AL
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Dr. Sarah Patel</h4>
                  <p className="text-[10px] text-gray-400">Founder, BioNode Systems</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call To Action */}
        <section className="max-w-4xl mx-auto px-4">
          <div className="glass-panel p-10 rounded-3xl border border-brandPurple/30 bg-gradient-to-r from-brandPurple/15 to-brandBlue/5 text-center space-y-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-32 h-32 bg-brandPurple/20 rounded-full blur-2xl"></div>

            <h2 className="text-2xl md:text-4xl font-extrabold text-white">Ready to Evaluate Your Startup?</h2>
            <p className="text-xs md:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
              Get an instant evaluation report containing SWOT metrics, competitive analyses, and strategic suggestions.
            </p>

            <button
              onClick={onStartApp}
              className="px-8 py-4 rounded-xl glow-btn glow-btn-primary text-white font-bold text-base inline-flex items-center gap-2"
            >
              Get Started Now
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </section>
      </div>
    </>
  );
};