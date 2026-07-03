import React, { useState } from 'react';
import { Job, UserProfile, ApplicationMaterials } from '../types';
import { Brain, FileText, CheckCircle, Clipboard, Mail, Send, Sparkles, Loader2, RefreshCw, AlertCircle, Check } from 'lucide-react';
import { motion } from 'motion/react';

interface RequestingProps {
  selectedJob: Job | null;
  profile: UserProfile;
  setTab: (tab: string) => void;
  onActionTriggered?: () => void;
  appliedJobs: any[];
  fetchApplications: () => Promise<void>;
}

export default function Requesting({
  selectedJob,
  profile,
  setTab,
  onActionTriggered,
  appliedJobs,
  fetchApplications
}: RequestingProps) {
  const [customRequest, setCustomRequest] = useState('');
  const [materials, setMaterials] = useState<ApplicationMaterials | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSimulatedAI, setIsSimulatedAI] = useState(false);
  const [activeOutputTab, setActiveOutputTab] = useState<'coverLetter' | 'resumePoints' | 'outreachEmail'>('coverLetter');
  const [copied, setCopied] = useState(false);

  // Apply states
  const [applying, setApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);
  const [applyError, setApplyError] = useState('');

  // Fallback default job details if none is selected
  const defaultJob: Job = {
    id: 'custom-job',
    title: 'Software Engineer',
    company: 'Innovators Inc',
    location: 'Remote',
    salary: 'Negotiable',
    contractType: 'Full-time',
    description: 'We are seeking a versatile software engineer with good technical problem-solving skills.',
    created: new Date().toISOString(),
    url: '#'
  };

  const jobToOptimize = selectedJob || defaultJob;
  const isApplied = appliedJobs?.some(app => app.job.id === jobToOptimize.id);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setApplySuccess(false);
    setApplyError('');
    try {
      const res = await fetch('/api/ai/generate-application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job: jobToOptimize, profile, customRequest })
      });
      if (res.ok) {
        const data = await res.json();
        setMaterials(data.materials);
        setIsSimulatedAI(data.isSimulatedAI || false);
        if (onActionTriggered) onActionTriggered();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyWithGenerated = async () => {
    if (!materials) return;
    setApplying(true);
    setApplyError('');
    try {
      const res = await fetch('/api/jobs/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job: jobToOptimize,
          profile,
          coverLetter: materials.coverLetter
        })
      });
      if (res.ok) {
        setApplySuccess(true);
        await fetchApplications();
        if (onActionTriggered) onActionTriggered();
        setTimeout(() => {
          setApplySuccess(false);
          setTab('dashboard'); // Redirect to dashboard to see active tracking
        }, 1800);
      } else {
        const errData = await res.json();
        setApplyError(errData.error || 'Failed to submit application.');
      }
    } catch (err) {
      setApplyError('Network error submitting application.');
    } finally {
      setApplying(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="requesting-tab" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Parameters & Controls (Left 5 Columns) */}
      <form onSubmit={handleGenerate} className="lg:col-span-5 bg-white border border-slate-100 rounded-xl p-5 shadow-sm space-y-4 h-fit">
        <div className="flex items-center gap-2 border-b border-slate-50 pb-3">
          <Brain className="w-5 h-5 text-indigo-600" />
          <h2 className="font-bold text-sm text-slate-900 uppercase tracking-wider">AI Optimizer Settings</h2>
        </div>

        <div className="space-y-3.5 text-xs">
          {/* Active Job Selection info */}
          <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-lg space-y-1">
            <div className="text-[10px] font-bold text-slate-400 uppercase">Target Job Position</div>
            {selectedJob ? (
              <div>
                <div className="font-semibold text-slate-800 text-xs">{selectedJob.title}</div>
                <div className="text-slate-500 font-medium">{selectedJob.company} • {selectedJob.location}</div>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-2">
                <span className="text-slate-400 font-medium italic">Using generic template. No active job selected.</span>
                <button
                  type="button"
                  onClick={() => setTab('explore')}
                  className="px-2 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-[10px] font-bold rounded border border-indigo-100 transition-colors"
                >
                  Select Job
                </button>
              </div>
            )}
          </div>

          {/* Profile overview */}
          <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-lg space-y-1">
            <div className="text-[10px] font-bold text-slate-400 uppercase">Applicant Template</div>
            <div>
              <div className="font-semibold text-slate-800 text-xs">{profile.name}</div>
              <div className="text-slate-500 font-medium">{profile.title} • {profile.skills.slice(0, 3).join(', ')}...</div>
            </div>
          </div>

          {/* Custom Focus instruction field */}
          <div className="space-y-1.5">
            <label className="text-slate-500 font-bold uppercase text-[10px]">Special Instructions (Optional)</label>
            <textarea
              value={customRequest}
              onChange={(e) => setCustomRequest(e.target.value)}
              placeholder="e.g. Highlight my engineering leadership, emphasize remote collaboration experience, or limit total length to 200 words..."
              className="w-full h-24 p-3 bg-slate-50 border border-slate-100 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 placeholder-slate-400 leading-relaxed font-medium"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-505 disabled:bg-slate-200 font-bold text-xs text-white rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Splicing & Optimizing Materials...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-300" />
              Synthesize Application Packs
            </>
          )}
        </button>
      </form>

      {/* Output Viewer (Right 7 Columns) */}
      <div className="lg:col-span-7 bg-white border border-slate-100 rounded-xl p-5 md:p-6 shadow-sm flex flex-col justify-between min-h-[420px]">
        {!materials ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 py-12">
            <FileText className="w-12 h-12 text-slate-300 animate-pulse" />
            <div className="space-y-1 max-w-xs">
              <h3 className="font-bold text-slate-900 text-sm">Awaiting Generation</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Configure your custom instructions in the settings, then trigger the Gemini API generation engine to synthesize optimized application packages.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col space-y-4">
            {/* Tab selection */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
              <div className="flex gap-1.5">
                <button
                  onClick={() => setActiveOutputTab('coverLetter')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1 ${
                    activeOutputTab === 'coverLetter'
                      ? 'bg-indigo-50 text-indigo-600 border border-indigo-100'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" /> Cover Letter
                </button>
                <button
                  onClick={() => setActiveOutputTab('resumePoints')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1 ${
                    activeOutputTab === 'resumePoints'
                      ? 'bg-indigo-50 text-indigo-600 border border-indigo-100'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <CheckCircle className="w-3.5 h-3.5" /> Tailored Bullets
                </button>
                <button
                  onClick={() => setActiveOutputTab('outreachEmail')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1 ${
                    activeOutputTab === 'outreachEmail'
                      ? 'bg-indigo-50 text-indigo-600 border border-indigo-100'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" /> outreach Email
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[9px] bg-slate-50 text-slate-400 border border-slate-100 px-2 py-0.5 rounded font-mono font-semibold">
                  {isSimulatedAI ? 'Local Templates' : 'Gemini 3.5 Generated'}
                </span>
                <button
                  onClick={() => {
                    const txt = activeOutputTab === 'coverLetter' ? materials.coverLetter : activeOutputTab === 'outreachEmail' ? materials.outreachEmail : materials.optimizedResumePoints.join('\n');
                    copyToClipboard(txt);
                  }}
                  className="p-1.5 rounded bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors border border-slate-100"
                  title="Copy to Clipboard"
                >
                  {copied ? (
                    <span className="text-[10px] font-bold text-emerald-600 px-1">Copied!</span>
                  ) : (
                    <Clipboard className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Tab content displays */}
            <div className="flex-1 bg-slate-50/50 border border-slate-100 rounded-xl p-4 md:p-5 max-h-[360px] overflow-y-auto">
              {activeOutputTab === 'coverLetter' && (
                <p className="text-xs text-slate-700 leading-relaxed font-sans whitespace-pre-wrap">
                  {materials.coverLetter}
                </p>
              )}

              {activeOutputTab === 'resumePoints' && (
                <div className="space-y-3 font-sans">
                  <div className="text-[10px] font-bold text-slate-400 uppercase mb-2">Resume Highlight Accomplishments:</div>
                  {materials.optimizedResumePoints.map((point, index) => (
                    <div key={index} className="flex items-start gap-2 text-xs text-slate-700 leading-relaxed pl-1.5 border-l-2 border-indigo-500/60">
                      <p className="font-medium">{point}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeOutputTab === 'outreachEmail' && (
                <p className="text-xs text-slate-700 leading-relaxed font-sans whitespace-pre-wrap">
                  {materials.outreachEmail}
                </p>
              )}
            </div>

            {/* Action suggestion */}
            <div className="pt-4 border-t border-slate-150 space-y-3">
              {applyError && (
                <div className="p-3 bg-rose-50 border border-rose-100 rounded-lg text-rose-700 text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" /> {applyError}
                </div>
              )}

              {applySuccess ? (
                <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-lg text-emerald-700 text-xs font-bold flex items-center gap-2 justify-center">
                  <Check className="w-4 h-4 text-emerald-600" /> Application submitted successfully! Redirecting...
                </div>
              ) : isApplied ? (
                <div className="p-3 bg-emerald-50/60 border border-emerald-100/40 rounded-lg text-emerald-700 text-xs font-bold flex items-center gap-1.5 justify-center">
                  <Check className="w-4 h-4 text-emerald-600" /> Submitted & Tracked via Java Backend REST Controller ✓
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-indigo-50/30 p-3 rounded-xl border border-indigo-100/30">
                  <div className="text-left">
                    <h5 className="font-bold text-xs text-indigo-950">Ready to apply to this role?</h5>
                    <p className="text-[10px] text-slate-500 mt-0.5">Submit directly to the simulated Java backend REST controller.</p>
                  </div>
                  <button
                    onClick={handleApplyWithGenerated}
                    disabled={applying}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-505 disabled:bg-slate-300 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                  >
                    {applying ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Submitting Application...
                      </>
                    ) : (
                      <>
                        Submit with this Cover Letter <Send className="w-3 h-3" />
                      </>
                    )}
                  </button>
                </div>
              )}

              <div className="text-[10px] text-slate-400 font-medium font-mono text-center pt-1.5 flex items-center justify-center gap-1">
                <Send className="w-3 h-3 text-indigo-500" /> AI-optimized cover letters and tailored resume bullet points are generated on demand.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
