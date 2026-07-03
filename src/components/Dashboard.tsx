import React, { useState } from 'react';
import { UserProfile, Job, AppliedJobRecord } from '../types';
import { Briefcase, CheckCircle, Clock, Bell, User, Cpu, Sparkles, Star, ChevronRight, FileText, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DashboardProps {
  profile: UserProfile;
  setTab: (tab: string) => void;
  setSelectedJob: (job: Job | null) => void;
  appliedJobs: AppliedJobRecord[];
}

const SAMPLE_RECENT_JOBS: Job[] = [
  {
    id: "job-1",
    title: "Senior React Developer",
    company: "InnovateTech",
    location: "San Francisco, CA (Hybrid)",
    salary: "$130,000 - $160,000",
    contractType: "Full-time",
    description: "We are seeking a Senior React Developer to join our growing product team. You will lead the development of our core client-side dashboard, using React 18, Vite, Tailwind CSS...",
    created: "2026-06-28T10:00:00Z",
    url: "#"
  },
  {
    id: "job-3",
    title: "Python Data Scientist",
    company: "InsightAI",
    location: "Remote (US)",
    salary: "$140,000 - $170,000",
    contractType: "Full-time",
    description: "We are looking for a Python Data Scientist to help build our next-generation recommendation engine...",
    created: "2026-07-01T08:15:00Z",
    url: "#"
  }
];

export default function Dashboard({ profile, setTab, setSelectedJob, appliedJobs }: DashboardProps) {
  const [expandedAppId, setExpandedAppId] = useState<string | null>(null);

  const stats = [
    { label: "Jobs Explored", value: "24", icon: Briefcase, color: "text-indigo-600 bg-indigo-50 border-indigo-100" },
    { label: "Matches Simulated", value: "8", icon: Cpu, color: "text-pink-600 bg-pink-50 border-pink-100" },
    { label: "Applications Sent", value: String(appliedJobs.length), icon: CheckCircle, color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
    { label: "Active Alerts", value: "4", icon: Bell, color: "text-amber-600 bg-amber-50 border-amber-100" }
  ];

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Submitted': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'Reviewing': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'Interviewing': return 'bg-purple-50 text-purple-700 border-purple-100';
      case 'Offered': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Declined': return 'bg-rose-50 text-rose-700 border-rose-100';
      default: return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  return (
    <div id="dashboard-tab" className="space-y-6">
      {/* Hero Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-12 translate-x-12" />
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-xs font-semibold border border-indigo-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            AI-Enhanced Java + React Architecture
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white font-sans">
            Welcome back, {profile.name || "Candidate"}!
          </h1>
          <p className="text-slate-300 max-w-xl text-sm md:text-base">
            Your full-stack application pipeline is fully operational. We bridged your React frontend views to your simulated Java microservices backend connecting to the Adzuna and Gemini APIs!
          </p>
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setTab('explore')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 font-medium text-xs text-white rounded-lg transition-colors shadow-lg shadow-indigo-600/20"
            >
              Explore Active Listings
            </button>
            <button
              onClick={() => setTab('profile')}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs rounded-lg transition-colors border border-slate-700"
            >
              View Developer Profile
            </button>
          </div>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const IconComponent = stat.icon;
          return (
            <div key={i} className="p-4 bg-white border border-slate-100 rounded-xl shadow-sm flex items-center gap-4">
              <div className={`p-3 rounded-lg border ${stat.color}`}>
                <IconComponent className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-950 tracking-tight">{stat.value}</div>
                <div className="text-xs text-slate-500 font-medium">{stat.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Snapshot */}
        <div className="lg:col-span-1 bg-white border border-slate-100 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <User className="w-5 h-5 text-indigo-600" />
            <h2 className="font-semibold text-sm text-slate-900 uppercase tracking-wider">Candidate Snapshot</h2>
          </div>
          <div className="space-y-3 text-sm">
            <div>
              <div className="text-xs text-slate-400 font-semibold">Target Title</div>
              <div className="font-semibold text-slate-800">{profile.title}</div>
            </div>
            <div>
              <div className="text-xs text-slate-400 font-semibold">Location Preference</div>
              <div className="font-semibold text-slate-800">{profile.location}</div>
            </div>
            <div>
              <div className="text-xs text-slate-400 font-semibold">Skills Tag Cloud</div>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {profile.skills.map((skill, index) => (
                  <span key={index} className="text-[10px] font-bold px-2 py-0.5 bg-slate-50 text-slate-600 border border-slate-100 rounded">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-400 font-semibold">Education</div>
              <div className="text-slate-600 font-medium text-xs mt-0.5">{profile.education}</div>
            </div>
          </div>
        </div>

        {/* Recommended Jobs */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-indigo-600" />
              <h2 className="font-semibold text-sm text-slate-900 uppercase tracking-wider">Top Match Recommendations</h2>
            </div>
            <button onClick={() => setTab('explore')} className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-0.5">
              Explore All <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          
          <div className="space-y-3.5">
            {SAMPLE_RECENT_JOBS.map((job) => (
              <div 
                key={job.id} 
                onClick={() => {
                  setSelectedJob(job);
                  setTab('info');
                }}
                className="p-4 rounded-xl border border-slate-100 hover:border-indigo-100 hover:bg-slate-50/50 cursor-pointer transition-all flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center font-bold text-indigo-600 text-sm">
                  {job.company.charAt(0)}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-slate-800 text-sm hover:text-indigo-600 transition-colors">
                      {job.title}
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded">
                      {job.salary}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 font-medium flex items-center gap-2">
                    <span>{job.company}</span>
                    <span>•</span>
                    <span>{job.location}</span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1">{job.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Applied Jobs Pipeline Section */}
      <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <div>
            <h2 className="font-semibold text-sm text-slate-900 uppercase tracking-wider">Active Applications Pipeline</h2>
            <p className="text-[10px] text-slate-400 font-mono font-bold tracking-wider uppercase">REST-Tracked Submissions via JobApplicationService.java</p>
          </div>
        </div>

        {appliedJobs.length === 0 ? (
          <div className="text-center py-8 bg-slate-50/30 rounded-xl border border-dashed border-slate-200">
            <p className="text-slate-500 text-xs font-semibold">No active applications submitted yet.</p>
            <p className="text-slate-400 text-[10px] mt-1">Explore job listings and apply using customized credentials or generated materials!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {appliedJobs.map((record) => {
              const isExpanded = expandedAppId === record.id;
              return (
                <div key={record.id} className="border border-slate-100 rounded-xl hover:border-slate-200 transition-all overflow-hidden bg-white">
                  <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center font-bold text-emerald-600 text-xs flex-shrink-0 mt-0.5">
                        {record.job.company.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-slate-900">{record.job.title}</h4>
                        <div className="flex flex-wrap items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-slate-500 font-semibold">{record.job.company}</span>
                          <span className="text-slate-300">•</span>
                          <span className="text-[10px] text-slate-400 font-medium font-mono">Applied: {record.appliedDate}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-50">
                      <span className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold tracking-wider uppercase font-mono ${getStatusBadgeColor(record.status)}`}>
                        {record.status}
                      </span>
                      {record.coverLetter && (
                        <button
                          onClick={() => setExpandedAppId(isExpanded ? null : record.id)}
                          className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-100 text-slate-500 hover:text-slate-700 flex items-center gap-1 text-[10px] font-bold transition-colors"
                        >
                          <FileText className="w-3 h-3" />
                          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>
                      )}
                    </div>
                  </div>

                  <AnimatePresence>
                    {isExpanded && record.coverLetter && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="bg-slate-50/50 border-t border-slate-100 p-4"
                      >
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Submitted Cover Letter</span>
                          <div className="p-3 bg-white border border-slate-100 rounded-lg text-[11px] text-slate-600 leading-relaxed whitespace-pre-wrap font-medium">
                            {record.coverLetter}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
