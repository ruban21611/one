import React, { useState } from 'react';
import { Job, UserProfile, JobMatchAnalysis } from '../types';
import { Sparkles, BrainCircuit, Check, X, AlertCircle, Calendar, MapPin, Briefcase, DollarSign, ArrowRight, Loader2, RefreshCw, ExternalLink, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface JobInformationProps {
  selectedJob: Job | null;
  profile: UserProfile;
  setTab: (tab: string) => void;
  onActionTriggered?: () => void;
  appliedJobs: any[];
  fetchApplications: () => Promise<void>;
}

export default function JobInformation({
  selectedJob,
  profile,
  setTab,
  onActionTriggered,
  appliedJobs,
  fetchApplications
}: JobInformationProps) {
  const [analysis, setAnalysis] = useState<JobMatchAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSimulatedAI, setIsSimulatedAI] = useState(false);

  // Apply form states
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [coverLetterText, setCoverLetterText] = useState('');
  const [applying, setApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);
  const [applyError, setApplyError] = useState('');

  const isApplied = appliedJobs?.some(app => app.job.id === selectedJob?.id);

  const handleAnalyze = async () => {
    if (!selectedJob) return;
    setLoading(true);
    try {
      const res = await fetch('/api/ai/analyze-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job: selectedJob, profile })
      });
      if (res.ok) {
        const data = await res.json();
        setAnalysis(data.analysis);
        setIsSimulatedAI(data.isSimulatedAI || false);
        if (onActionTriggered) onActionTriggered();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenApply = () => {
    // Generate a default cover letter intro based on candidate profile details
    const defaultText = `Dear Hiring Team at ${selectedJob?.company || 'Company'},\n\nI am writing to apply for the ${selectedJob?.title || 'Developer'} position. As a ${profile.title || 'Developer'} with skilled competencies in ${profile.skills.slice(0, 4).join(', ')}, I am highly motivated to contribute to your engineering team.\n\nThank you for considering my application.\n\nSincerely,\n${profile.name}`;
    setCoverLetterText(defaultText);
    setShowApplyForm(true);
    setApplyError('');
  };

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) return;
    setApplying(true);
    setApplyError('');
    try {
      const res = await fetch('/api/jobs/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job: selectedJob,
          profile,
          coverLetter: coverLetterText
        })
      });
      if (res.ok) {
        setApplySuccess(true);
        await fetchApplications();
        if (onActionTriggered) onActionTriggered();
        setTimeout(() => {
          setShowApplyForm(false);
          setApplySuccess(false);
          setTab('dashboard'); // Redirect to dashboard to see application in the active pipeline
        }, 1800);
      } else {
        const errData = await res.json();
        setApplyError(errData.error || 'Failed to submit application.');
      }
    } catch (err) {
      setApplyError('Network error submitting application to REST controller.');
    } finally {
      setApplying(false);
    }
  };

  if (!selectedJob) {
    return (
      <div id="info-tab-empty" className="bg-white border border-slate-100 rounded-xl p-8 text-center space-y-4 shadow-sm">
        <BrainCircuit className="w-12 h-12 text-indigo-500 mx-auto animate-pulse" />
        <div className="space-y-1.5 max-w-sm mx-auto">
          <h3 className="font-bold text-slate-950 text-sm">No Job Selected</h3>
          <p className="text-slate-400 text-xs leading-relaxed">
            Please navigate to the <strong className="text-slate-600">Explore Jobs</strong> tab to search, then click "Details" on any vacancy to trigger Gemini AI fitting insights.
          </p>
        </div>
        <button
          onClick={() => setTab('explore')}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 font-bold text-xs text-white rounded-lg transition-colors inline-flex items-center gap-1"
        >
          Browse Open Positions <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div id="info-tab-filled" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Job Description (Left 7 Columns) */}
      <div className="lg:col-span-7 bg-white border border-slate-100 rounded-xl p-5 md:p-6 space-y-6 shadow-sm">
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-950 font-sans">{selectedJob.title}</h1>
              <p className="text-indigo-600 font-semibold text-sm mt-0.5">{selectedJob.company}</p>
            </div>
            <span className="inline-flex items-center px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-bold rounded-lg whitespace-nowrap">
              {selectedJob.salary}
            </span>
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-500 font-mono border-y border-slate-50 py-3">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {selectedJob.location}
            </span>
            <span className="flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-slate-400" />
              {selectedJob.contractType}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Posted: {new Date(selectedJob.created).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">Job Specification</h3>
          <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">{selectedJob.description}</p>
        </div>

        <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-50">
          {isApplied ? (
            <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 border border-emerald-100/60 px-4 py-2 rounded-lg text-xs font-bold shadow-sm">
              <Check className="w-4 h-4 text-emerald-600" /> Submitted & Tracked via REST API ✓
            </div>
          ) : (
            <button
              onClick={handleOpenApply}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-505 font-bold text-xs text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
            >
              Apply with Profile <Send className="w-3.5 h-3.5" />
            </button>
          )}
          
          <button
            onClick={() => setTab('requesting')}
            className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold text-xs rounded-lg transition-colors border border-slate-100 flex items-center gap-1.5"
          >
            Optimize with AI <Sparkles className="w-3.5 h-3.5 text-slate-400" />
          </button>
          
          <a
            href={selectedJob.url}
            target="_blank"
            referrerPolicy="no-referrer"
            className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-500 font-bold text-xs rounded-lg transition-colors border border-slate-100 flex items-center gap-1.5 ml-auto"
          >
            External Details <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Inline Application Slide-down Form */}
        <AnimatePresence>
          {showApplyForm && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="mt-6 border border-indigo-100 bg-indigo-50/20 rounded-xl p-5 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-indigo-100/30 pb-2.5">
                <div className="space-y-0.5">
                  <h4 className="font-bold text-xs text-indigo-950 uppercase tracking-wide">REST Job Application Form</h4>
                  <p className="text-[10px] text-indigo-500 font-mono font-bold">DISPATCHING VIA JOBAPPLICATIONSERVICE.JAVA</p>
                </div>
                <button
                  onClick={() => setShowApplyForm(false)}
                  className="p-1 rounded-full hover:bg-indigo-100/50 text-indigo-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {applySuccess ? (
                <div className="p-6 text-center space-y-3 bg-white border border-emerald-100 rounded-lg shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto text-emerald-600">
                    <Check className="w-5 h-5 animate-bounce" />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-slate-900">Application Transmitted!</h5>
                    <p className="text-[10px] text-slate-400 mt-1">Successfully recorded application ID with Spring Boot rest pipeline.</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleApplySubmit} className="space-y-4">
                  {applyError && (
                    <div className="p-3 bg-rose-50 border border-rose-100 rounded-lg text-rose-700 text-xs font-bold flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" /> {applyError}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-[10px] font-bold text-indigo-900 uppercase tracking-wider block mb-1 font-mono">Candidate Name</span>
                      <div className="p-2 bg-white border border-slate-100 rounded-lg font-semibold text-slate-700">
                        {profile.name}
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-indigo-900 uppercase tracking-wider block mb-1 font-mono">Contact Email</span>
                      <div className="p-2 bg-white border border-slate-100 rounded-lg font-semibold text-slate-700 overflow-hidden text-ellipsis">
                        {profile.email}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <label className="text-[10px] font-bold text-indigo-900 uppercase tracking-wider block font-mono">Cover Letter (Editable)</label>
                    <textarea
                      value={coverLetterText}
                      onChange={(e) => setCoverLetterText(e.target.value)}
                      rows={6}
                      className="w-full p-3 bg-white border border-slate-200 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 rounded-lg text-xs text-slate-700 leading-relaxed font-medium focus:outline-none"
                      placeholder="Add an optional intro cover letter..."
                      required
                    />
                  </div>

                  <div className="flex gap-2 justify-end">
                    <button
                      type="button"
                      onClick={() => setShowApplyForm(false)}
                      className="px-3.5 py-2 border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-lg text-xs font-bold transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={applying}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-505 disabled:bg-slate-300 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
                    >
                      {applying ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          Submitting REST Pipeline...
                        </>
                      ) : (
                        <>
                          Confirm Submission <Send className="w-3 h-3" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* AI Analyzer Panel (Right 5 Columns) */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        <div className="bg-gradient-to-br from-slate-950 to-indigo-950 border border-slate-800 rounded-xl p-5 text-white shadow-md relative overflow-hidden flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-indigo-400" />
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-300">
                  Gemini Fit Profiler
                </h3>
              </div>
              <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full font-semibold font-mono">
                {isSimulatedAI ? 'Local Rules' : 'Gemini 3.5'}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Match this job against your personal skills, experience summary, and education using AI.
            </p>

            {!analysis && (
              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analyzing Alignment...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                    Calculate Match Strength
                  </>
                )}
              </button>
            )}
          </div>

          {analysis && (
            <div className="mt-4 pt-4 border-t border-slate-800 space-y-4">
              {/* Fit Meter */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-300 font-semibold">Overall Alignment Fit:</span>
                  <span className="text-sm font-bold text-indigo-400">{analysis.fitRating}%</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800/80">
                  <div
                    className="bg-indigo-500 h-full rounded-full transition-all duration-1000"
                    style={{ width: `${analysis.fitRating}%` }}
                  />
                </div>
              </div>

              {/* Skills Overlap */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1">
                    <Check className="w-3 h-3" /> Overlapping Skills
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {analysis.matchingSkills.map((s, i) => (
                      <span key={i} className="text-[9px] px-1.5 py-0.5 bg-emerald-950/40 text-emerald-300 border border-emerald-900/40 rounded">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] text-pink-400 font-bold uppercase tracking-wider flex items-center gap-1">
                    <X className="w-3 h-3" /> Gaps / Missing
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {analysis.missingSkills.map((s, i) => (
                      <span key={i} className="text-[9px] px-1.5 py-0.5 bg-pink-950/40 text-pink-300 border border-pink-900/40 rounded">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Pros & Cons */}
              <div className="space-y-2 pt-2 border-t border-slate-900">
                <div className="space-y-1">
                  <div className="text-[10px] text-indigo-400 font-bold uppercase">Role Advantages</div>
                  <ul className="text-[10px] text-slate-300 space-y-1 list-disc pl-3 leading-relaxed">
                    {analysis.pros.map((p, i) => <li key={i}>{p}</li>)}
                  </ul>
                </div>
              </div>

              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="w-full py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold text-[11px] rounded border border-slate-800 transition-colors flex items-center justify-center gap-1.5"
              >
                <RefreshCw className="w-3 h-3" /> Re-analyze Profile
              </button>
            </div>
          )}
        </div>

        {/* Practice Interview Questions */}
        {analysis && (
          <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-50 pb-2.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider">AI Interview Simulator Prep</h4>
            </div>
            <div className="space-y-3">
              {analysis.interviewQuestions.map((q, i) => (
                <div key={i} className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1.5">
                  <div className="text-[10px] font-bold text-indigo-600 uppercase">Question {i + 1}</div>
                  <p className="text-xs text-slate-700 font-medium leading-relaxed">{q}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
