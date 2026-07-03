import React, { useState, useEffect } from 'react';
import { UserProfile, Job, AppliedJobRecord } from './types';
import Dashboard from './components/Dashboard';
import ExploreJobs from './components/ExploreJobs';
import JobInformation from './components/JobInformation';
import Requesting from './components/Requesting';
import Notifications from './components/Notifications';
import Profile from './components/Profile';
import FlowVisualizer from './components/FlowVisualizer';
import { Briefcase, LayoutDashboard, Search, FileText, Bell, User, Info } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [profile, setProfile] = useState<UserProfile>({
    name: "Ruban ",
    email: "ruban21611@gmail.com",
    title: "Full-Stack Web Developer",
    location: "Remote (Global)",
    skills: ["HTML", "Tailwind CSS", "JavaScript", "React", "REST API", "Java", "Spring Boot", "Git"],
    experience: "Enthusiastic developer skilled in crafting visually polished frontends with Tailwind CSS, React, and native JavaScript. Experienced in constructing standard Java REST controllers, building robust backend microservice business modules, and optimizing workflows with AI APIs.",
    education: "Bachelor of Engineering in Computer Science, 2025"
  });
  const [triggerRefreshLogs, setTriggerRefreshLogs] = useState(false);
  const [appliedJobs, setAppliedJobs] = useState<AppliedJobRecord[]>([]);

  // Trigger a reload of dev logs in the FlowVisualizer whenever an API action happens
  const handleApiActionTriggered = () => {
    setTriggerRefreshLogs(prev => !prev);
  };

  const fetchApplications = async () => {
    try {
      const res = await fetch("/api/applications");
      if (res.ok) {
        const data = await res.json();
        setAppliedJobs(data);
      }
    } catch (e) {
      console.error("Failed to fetch applications", e);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [triggerRefreshLogs]);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'explore', label: 'Explore Jobs', icon: Search },
    { id: 'info', label: 'Job Info', icon: Info },
    { id: 'requesting', label: 'AI Requesting', icon: FileText },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'profile', label: 'My Profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans antialiased">
      {/* Upper Navigation Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-sm backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-600/10">
              <Briefcase className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-tight text-slate-900 block font-sans">
                JOB APPLICATION ASSISTANT
              </span>
              <span className="text-[10px] text-slate-400 font-bold tracking-wider font-mono uppercase block -mt-0.5">
                Full-Stack Java Architecture Model
              </span>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                    activeTab === item.id
                      ? 'bg-indigo-50 text-indigo-600 border border-indigo-100/50'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 text-xs font-bold px-3 py-1.5 bg-indigo-50/50 border border-indigo-100/40 text-indigo-700 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              {profile.email}
            </div>
          </div>
        </div>

        {/* Mobile Submenu Nav bar */}
        <div className="lg:hidden bg-slate-50/80 border-t border-slate-100 px-4 py-2 flex gap-1 overflow-x-auto select-none no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1 whitespace-nowrap ${
                  activeTab === item.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 bg-white border border-slate-100'
                }`}
              >
                <Icon className="w-3 h-3" />
                {item.label}
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Area Dashboard container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Active view viewport (8 cols on desktop) */}
        <div className="lg:col-span-8 space-y-6">
          {activeTab === 'dashboard' && (
            <Dashboard profile={profile} setTab={setActiveTab} setSelectedJob={setSelectedJob} appliedJobs={appliedJobs} />
          )}
          {activeTab === 'explore' && (
            <ExploreJobs setSelectedJob={setSelectedJob} setTab={setActiveTab} onActionTriggered={handleApiActionTriggered} />
          )}
          {activeTab === 'info' && (
            <JobInformation selectedJob={selectedJob} profile={profile} setTab={setActiveTab} onActionTriggered={handleApiActionTriggered} appliedJobs={appliedJobs} fetchApplications={fetchApplications} />
          )}
          {activeTab === 'requesting' && (
            <Requesting selectedJob={selectedJob} profile={profile} setTab={setActiveTab} onActionTriggered={handleApiActionTriggered} appliedJobs={appliedJobs} fetchApplications={fetchApplications} />
          )}
          {activeTab === 'notifications' && (
            <Notifications />
          )}
          {activeTab === 'profile' && (
            <Profile profile={profile} setProfile={setProfile} />
          )}
        </div>

        {/* Developer Console / Trace Flow (4 cols on desktop, hidden on mobile) */}
        <div className="lg:col-span-4 h-full hidden lg:block">
          <FlowVisualizer activeTab={activeTab} triggerRefreshLogs={triggerRefreshLogs} />
        </div>
      </main>

      {/* Footer copyright section */}
      <footer className="bg-white border-t border-slate-100 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-semibold font-mono">
          <div>
            JOB PORTAL PIPELINE &copy; 2026. All rights reserved.
          </div>
          <div className="flex gap-4">
            <span>Rest endpoints: /api/jobs, /api/ai/*</span>
            <span>•</span>
            <span>Spring Boot REST Controllers & Gemini Integration Model</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
