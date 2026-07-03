import React, { useState, useEffect } from 'react';
import { Job } from '../types';
import { Search, MapPin, Briefcase, DollarSign, Filter, ExternalLink, HelpCircle, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface ExploreJobsProps {
  setSelectedJob: (job: Job | null) => void;
  setTab: (tab: string) => void;
  onActionTriggered?: () => void;
}

export default function ExploreJobs({ setSelectedJob, setTab, onActionTriggered }: ExploreJobsProps) {
  const [what, setWhat] = useState('');
  const [where, setWhere] = useState('');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState('Local Storage');

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/jobs?what=${encodeURIComponent(what)}&where=${encodeURIComponent(where)}`);
      if (res.ok) {
        const data = await res.json();
        setJobs(data.jobs || []);
        setSource(data.source || 'Unknown');
        if (onActionTriggered) onActionTriggered();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <div id="explore-tab" className="space-y-6">
      <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm">
        <h2 className="text-base font-bold text-slate-950 mb-3 flex items-center gap-2">
          <Search className="w-5 h-5 text-indigo-600" />
          Explore Job Market Openings
        </h2>
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-5 relative">
            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={what}
              onChange={(e) => setWhat(e.target.value)}
              placeholder="Job title, keywords, skill, technology..."
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
            />
          </div>
          <div className="md:col-span-4 relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={where}
              onChange={(e) => setWhere(e.target.value)}
              placeholder="City, state, remote, region..."
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
            />
          </div>
          <div className="md:col-span-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full h-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-400 font-bold text-sm text-white rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              {loading ? 'Searching...' : 'Find Jobs'}
            </button>
          </div>
        </form>

        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5 font-medium">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Connection Mode: <strong className="text-slate-600">{source}</strong>
          </div>
          <div className="text-right">
            Configure <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-600 font-mono text-[10px]">ADZUNA_APP_ID</code> and <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-600 font-mono text-[10px]">KEY</code> in secrets to link live data!
          </div>
        </div>
      </div>

      {/* Jobs Results Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm text-slate-900 uppercase tracking-wider">
            Available Positions ({jobs.length})
          </h3>
          <span className="text-xs text-slate-400">Showing top relevant match recommendations</span>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 bg-white border border-slate-100 rounded-xl">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-2"></div>
            <p className="text-slate-500 text-sm font-medium font-mono">Invoking RestApi & AdzunaApiWrapper.java...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12 bg-white border border-slate-100 rounded-xl space-y-2">
            <p className="text-slate-500 text-sm font-semibold">No job vacancies found matching those keywords.</p>
            <p className="text-slate-400 text-xs">Try broader keywords or clear your location filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white border border-slate-100 rounded-xl p-5 hover:border-indigo-100 hover:shadow-md hover:shadow-indigo-500/5 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-slate-950 text-sm line-clamp-1 hover:text-indigo-600 transition-colors">
                        {job.title}
                      </h4>
                      <p className="text-xs text-slate-500 font-semibold">{job.company}</p>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded whitespace-nowrap">
                      {job.salary}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-xs text-slate-500 font-medium font-mono">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                      {job.contractType}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                    {job.description}
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <span className="text-[10px] text-slate-400">
                    Posted: {new Date(job.created).toLocaleDateString()}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedJob(job);
                        setTab('info');
                      }}
                      className="px-3 py-1.5 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 text-xs font-bold rounded border border-slate-100 hover:border-indigo-100 transition-colors flex items-center gap-1"
                    >
                      Details & AI Match <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
