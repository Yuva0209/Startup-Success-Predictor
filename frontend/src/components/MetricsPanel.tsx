import React, { useState } from 'react';

import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LineChart, Line, CartesianGrid
} from 'recharts';
import {
  Download, Award, ShieldAlert, Zap, Sparkles, Brain,
  ArrowRight, ShieldCheck, CheckCircle2, Loader2
} from 'lucide-react';

interface RadarData {
  subject: string;
  A: number;
  B: number;
  fullMark: number;
}

interface BenchmarkData {
  metric: string;
  startup: number;
  average: number;
  topDecile: number;
}

interface TrendData {
  period: string;
  probability: number;
  marketTraction: number;
}

interface HeatmapCell {
  x: string;
  y: string;
  value: number;
}

interface SWOT {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

interface Recommendation {
  title: string;
  detail: string;
  impact: string;
}

interface PredictionResult {
  startup_name: string;
  industry: string;
  funding_stage: string;
  success_probability: number;
  status: string;
  risk_score: number;
  market_potential_score: number;
  founder_strength_score: number;
  innovation_score: number;
  investment_readiness_score: number;
  scalability_score: number;
  competition_score: number;
  swot: SWOT;
  recommendations: Recommendation[];
  radar_chart: RadarData[];
  benchmarks: BenchmarkData[];
  trends: TrendData[];
  heatmap: HeatmapCell[];
  growth_forecast: string;
  funding_potential: string;
  investor_readiness: string;
}

interface MetricsPanelProps {
  result: PredictionResult;
  formData: any; // Raw form fields to pass to PDF generator
}

export const MetricsPanel: React.FC<MetricsPanelProps> = ({ result, formData }) => {
  const [downloading, setDownloading] = useState(false);

  const handleDownloadPDF = async () => {
    try {
      setDownloading(true);
      const data = new FormData();
      data.append('name', result.startup_name);
      data.append('industry', result.industry);
      data.append('stage', result.funding_stage);
      data.append('team_size', formData.teamSize || '1-5');
      data.append('experience', formData.experience || '1-3 years');
      data.append('description', formData.description || '');
      data.append('business_model', formData.businessModel || 'B2B SaaS');
      data.append('target_market', formData.targetMarket || 'Enterprise');
      data.append('success_probability', result.success_probability.toString());
      data.append('risk_score', result.risk_score.toString());
      data.append('market_potential', result.market_potential_score.toString());
      data.append('founder_strength', result.founder_strength_score.toString());
      data.append('innovation', result.innovation_score.toString());
      data.append('investment_readiness', result.investment_readiness_score.toString());

      data.append('strengths_list', result.swot.strengths.join('|'));
      data.append('weaknesses_list', result.swot.weaknesses.join('|'));
      data.append('opportunities_list', result.swot.opportunities.join('|'));
      data.append('threats_list', result.swot.threats.join('|'));

      const recsFormatted = result.recommendations.map(r => `${r.title}:${r.detail}`).join('|');
      data.append('recommendations_list', recsFormatted);

      const response = await fetch('http://127.0.0.1:8000/api/download-report', {
        method: 'POST',
        body: data,
      });

      if (!response.ok) {
        throw new Error('PDF Generation failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${result.startup_name.replace(/\s+/g, '_')}_Success_Evaluation_Report.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error('Error downloading report:', err);
      alert('Failed to generate and download PDF report. Ensure backend is running.');
    } finally {
      setDownloading(false);
    }
  };

  // SVG parameters for circular gauge
  const radius = 60;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (result.success_probability / 100) * circumference;

  return (
    <div className="space-y-6">
      {/* Top Banner: Success Score & Download Report */}
      <div className="flex flex-col md:flex-row items-center justify-between p-6 glass-panel rounded-2xl gap-6 relative overflow-hidden border border-brandPurple/20">
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-brandPurple/20 to-brandBlue/0 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex items-center gap-6">
          {/* Circular Gauge */}
          <div className="relative flex items-center justify-center">
            <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
              <circle
                stroke="rgba(255, 255, 255, 0.05)"
                fill="transparent"
                strokeWidth={stroke}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
              />
              <circle
                stroke="url(#successGradient)"
                fill="transparent"
                strokeWidth={stroke}
                strokeDasharray={circumference + ' ' + circumference}
                style={{ strokeDashoffset }}
                strokeLinecap="round"
                r={normalizedRadius}
                cx={radius}
                cy={radius}
              />
              <defs>
                <linearGradient id="successGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10B981" />
                  <stop offset="100%" stopColor="#06B6D4" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-2xl font-extrabold text-white leading-none">
                {result.success_probability}%
              </span>
              <span className="text-[10px] text-gray-400 font-medium tracking-wide mt-0.5">SUCCESS</span>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              {result.startup_name}
              <span className="text-xs px-2 py-0.5 rounded-full bg-brandEmerald/10 text-brandEmerald border border-brandEmerald/25 font-semibold">
                {result.status}
              </span>
            </h3>
            <p className="text-sm text-gray-400 mt-1">
              Industry: <span className="text-gray-200 font-semibold">{result.industry}</span> &nbsp;|&nbsp;
              Stage: <span className="text-gray-200 font-semibold">{result.funding_stage}</span>
            </p>
            <div className="flex gap-4 mt-3">
              <div className="text-xs">
                <span className="text-gray-400 block">Risk Score</span>
                <span className="text-brandRed font-semibold text-sm">{result.risk_score}%</span>
              </div>
              <div className="w-[1px] bg-white/10"></div>
              <div className="text-xs">
                <span className="text-gray-400 block">Growth Forecast</span>
                <span className="text-brandCyan font-semibold text-sm">{result.growth_forecast}</span>
              </div>
              <div className="w-[1px] bg-white/10"></div>
              <div className="text-xs">
                <span className="text-gray-400 block">Investor Readiness</span>
                <span className="text-brandPurple font-semibold text-sm">{result.investor_readiness}</span>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleDownloadPDF}
          disabled={downloading}
          className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl glow-btn glow-btn-primary text-white font-semibold text-sm transition-all"
        >
          {downloading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating PDF...
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              Download PDF Report
            </>
          )}
        </button>
      </div>

      {/* Grid: Radar Chart & Metrics Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Evaluation Chart */}
        <div className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col justify-between">
          <div>
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <Brain className="w-4 h-4 text-brandPurple" />
              Startup Dimensions Evaluation
            </h4>
            <p className="text-xs text-gray-400 mt-0.5">Multi-criteria radar chart analysis vs industry benchmark</p>
          </div>
          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={result.radar_chart}>
                <PolarGrid stroke="rgba(255,255,255,0.08)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#64748b' }} stroke="rgba(255,255,255,0.05)" />
                <Radar name="Your Startup" dataKey="A" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.25} />
                <Radar name="Industry Median" dataKey="B" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.05} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f0c22', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  labelClassName="text-white font-semibold text-xs"
                />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Benchmarks Comparison Chart */}
        <div className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col justify-between">
          <div>
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-brandCyan" />
              Industry Benchmark Comparison
            </h4>
            <p className="text-xs text-gray-400 mt-0.5">Detailed metric evaluation relative to key target indices</p>
          </div>
          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={result.benchmarks} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="metric" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <YAxis domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f0c22', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  labelClassName="text-white font-semibold text-xs"
                />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                <Bar name="Your Startup" dataKey="startup" fill="#6d28d9" radius={[4, 4, 0, 0]} />
                <Bar name="Avg Competitor" dataKey="average" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar name="Top Decile" dataKey="topDecile" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Dynamic Grid: Projections & Opportunity Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Analysis Chart */}
        <div className="glass-panel p-6 rounded-2xl border border-white/5">
          <h4 className="text-base font-bold text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-brandAmber" />
            24-Month Probability Projection
          </h4>
          <p className="text-xs text-gray-400 mt-0.5">Success indicators mapping along scaling and funding schedules</p>
          <div className="h-60 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={result.trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="period" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <YAxis domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f0c22', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  labelClassName="text-white font-semibold text-xs"
                />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                <Line name="Success Prob %" type="monotone" dataKey="probability" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line name="Market Traction %" type="monotone" dataKey="marketTraction" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Opportunity Heatmap */}
        <div className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col justify-between">
          <div>
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brandCyan" />
              Risk / Reward Heatmap Matrix
            </h4>
            <p className="text-xs text-gray-400 mt-0.5">Visual mapping of opportunity nodes across risk boundaries</p>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4 flex-1 items-center">
            {result.heatmap.map((cell, idx) => {
              const bgOpacity = (cell.value / 100).toFixed(2);
              let bgColor = `rgba(79, 70, 229, ${bgOpacity})`; // Brand Indigo base
              if (cell.x.includes("High Risk")) {
                bgColor = `rgba(239, 68, 68, ${bgOpacity})`; // Red risk
              } else if (cell.y.includes("High Reward")) {
                bgColor = `rgba(16, 185, 129, ${bgOpacity})`; // Green reward
              }

              return (
                <div
                  key={idx}
                  className="flex flex-col items-center justify-center p-3 rounded-lg border border-white/5 text-center transition-all hover:scale-105"
                  style={{ backgroundColor: bgColor }}
                >
                  <span className="text-[10px] text-gray-300 font-bold block truncate max-w-full">{cell.y}</span>
                  <span className="text-[9px] text-gray-400 block mt-0.5 truncate max-w-full">{cell.x}</span>
                  <span className="text-base font-extrabold text-white mt-1">{Math.round(cell.value)}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* SWOT Quadrant Matrix */}
      <div className="glass-panel p-6 rounded-2xl border border-white/5">
        <h4 className="text-base font-bold text-white flex items-center gap-2 mb-4">
          <ShieldCheck className="w-4 h-4 text-brandEmerald" />
          Dynamic SWOT Assessment Matrix
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Strengths */}
          <div className="p-4 rounded-xl border border-brandEmerald/10 bg-brandEmerald/5 hover:bg-brandEmerald/10 transition-colors">
            <span className="text-xs font-extrabold text-brandEmerald tracking-widest block mb-2 uppercase">Strengths</span>
            <ul className="space-y-1.5">
              {result.swot.strengths.map((s, idx) => (
                <li key={idx} className="text-xs text-slate-300 flex items-start gap-1.5 leading-relaxed">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brandEmerald mt-0.5 flex-shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Weaknesses */}
          <div className="p-4 rounded-xl border border-brandAmber/10 bg-brandAmber/5 hover:bg-brandAmber/10 transition-colors">
            <span className="text-xs font-extrabold text-brandAmber tracking-widest block mb-2 uppercase">Weaknesses</span>
            <ul className="space-y-1.5">
              {result.swot.weaknesses.map((w, idx) => (
                <li key={idx} className="text-xs text-slate-300 flex items-start gap-1.5 leading-relaxed">
                  <ShieldAlert className="w-3.5 h-3.5 text-brandAmber mt-0.5 flex-shrink-0" />
                  {w}
                </li>
              ))}
            </ul>
          </div>

          {/* Opportunities */}
          <div className="p-4 rounded-xl border border-brandCyan/10 bg-brandCyan/5 hover:bg-brandCyan/10 transition-colors">
            <span className="text-xs font-extrabold text-brandCyan tracking-widest block mb-2 uppercase">Opportunities</span>
            <ul className="space-y-1.5">
              {result.swot.opportunities.map((o, idx) => (
                <li key={idx} className="text-xs text-slate-300 flex items-start gap-1.5 leading-relaxed">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brandCyan mt-0.5 flex-shrink-0" />
                  {o}
                </li>
              ))}
            </ul>
          </div>

          {/* Threats */}
          <div className="p-4 rounded-xl border border-brandRed/10 bg-brandRed/5 hover:bg-brandRed/10 transition-colors">
            <span className="text-xs font-extrabold text-brandRed tracking-widest block mb-2 uppercase">Threats</span>
            <ul className="space-y-1.5">
              {result.swot.threats.map((t, idx) => (
                <li key={idx} className="text-xs text-slate-300 flex items-start gap-1.5 leading-relaxed">
                  <ShieldAlert className="w-3.5 h-3.5 text-brandRed mt-0.5 flex-shrink-0" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Strategic AI Recommendations */}
      <div className="glass-panel p-6 rounded-2xl border border-white/5">
        <h4 className="text-base font-bold text-white flex items-center gap-2 mb-4">
          <Award className="w-4 h-4 text-brandIndigo" />
          Strategic Acceleration Recommendations
        </h4>
        <div className="space-y-3">
          {result.recommendations.map((rec, idx) => (
            <div
              key={idx}
              className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all"
            >
              <div className="mt-1">
                {rec.impact === "High" ? (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-brandRed/10 text-brandRed border border-brandRed/20 font-bold uppercase tracking-wider">
                    High Impact
                  </span>
                ) : rec.impact === "Medium" ? (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-brandAmber/10 text-brandAmber border border-brandAmber/20 font-bold uppercase tracking-wider">
                    Med Impact
                  </span>
                ) : (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-brandBlue/10 text-brandBlue border border-brandBlue/20 font-bold uppercase tracking-wider">
                    Low Impact
                  </span>
                )}
              </div>
              <div className="flex-1">
                <h5 className="text-sm font-bold text-white">{rec.title}</h5>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">{rec.detail}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-500 self-center" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
