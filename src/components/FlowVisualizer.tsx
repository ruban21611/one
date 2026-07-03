import React, { useEffect, useState } from 'react';
import { DevLog } from '../types';
import { Terminal, Cpu, Database, Network, ArrowRight, RefreshCw, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FlowVisualizerProps {
  activeTab: string;
  triggerRefreshLogs?: boolean;
}

export default function FlowVisualizer({ activeTab, triggerRefreshLogs }: FlowVisualizerProps) {
  const [logs, setLogs] = useState<DevLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [highlightedComponent, setHighlightedComponent] = useState<string | null>(null);
  const [highlightedPath, setHighlightedPath] = useState<number | null>(null);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/logs');
      if (res.ok) {
        const data = await res.json();
        setLogs(data);
        
        // Highlight active components based on the latest log
        if (data.length > 0) {
          const latest = data[0];
          if (latest.caller === 'front-end') {
            setHighlightedComponent('frontend');
            setHighlightedPath(1);
          } else if (latest.caller === 'back-end') {
            setHighlightedComponent('backend');
            setHighlightedPath(2);
          } else if (latest.caller === 'adzuna-api') {
            setHighlightedComponent('adzuna');
            setHighlightedPath(3);
          } else if (latest.caller === 'gemini-api') {
            setHighlightedComponent('gemini');
            setHighlightedPath(4);
          }
          
          // Clear highlight after 3 seconds
          setTimeout(() => {
            setHighlightedComponent(null);
            setHighlightedPath(null);
          }, 3500);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, [triggerRefreshLogs]);

  // Determine active flow nodes based on activeTab
  const getTabLabel = (tab: string) => {
    switch (tab) {
      case 'dashboard': return 'Dashboard (index.html)';
      case 'explore': return 'Explore Jobs (explore.html)';
      case 'info': return 'Job Details (information.html)';
      case 'requesting': return 'AI Application (requesting.html)';
      case 'notifications': return 'Alerts (notification.html)';
      case 'profile': return 'User Profile (profile.html)';
      default: return 'Frontend';
    }
  };

  return (
    <div id="flow-visualizer-container" className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl text-slate-100 flex flex-col h-full">
      {/* Title Header */}
      <div className="bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-400" />
          <h2 className="font-mono text-sm font-semibold tracking-wider text-slate-200">
            SYSTEM ARCHITECTURE & FLOW VISUALIZER
          </h2>
        </div>
        <button 
          onClick={fetchLogs} 
          className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
          title="Refresh Logs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Interactive System Flow Diagram */}
      <div className="p-6 bg-slate-950/40 border-b border-slate-800 flex flex-col items-center justify-center relative min-h-[220px]">
        {/* Floating background grids */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px] opacity-10" />

        <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10 items-center">
          {/* Node 1: FRONT END */}
          <div className={`p-4 rounded-xl border text-center transition-all duration-500 flex flex-col items-center justify-center h-32 ${
            activeTab || highlightedComponent === 'frontend'
              ? 'bg-indigo-950/40 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.2)]'
              : 'bg-slate-900/80 border-slate-800'
          }`}>
            <Network className={`w-8 h-8 mb-2 ${activeTab ? 'text-indigo-400 animate-pulse' : 'text-slate-400'}`} />
            <h3 className="font-semibold text-xs text-indigo-200 uppercase tracking-wide">Front End</h3>
            <p className="text-[10px] text-indigo-400 font-mono mt-1 px-1 py-0.5 bg-indigo-950/80 rounded border border-indigo-900/60 truncate max-w-full">
              {getTabLabel(activeTab)}
            </p>
          </div>

          {/* Node 2: BACK END */}
          <div className={`p-4 rounded-xl border text-center transition-all duration-500 flex flex-col items-center justify-center h-32 ${
            highlightedComponent === 'backend'
              ? 'bg-emerald-950/40 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)] scale-105'
              : 'bg-slate-900/80 border-slate-800'
          }`}>
            <Cpu className={`w-8 h-8 mb-2 ${highlightedComponent === 'backend' ? 'text-emerald-400 animate-bounce' : 'text-slate-400'}`} />
            <h3 className="font-semibold text-xs text-emerald-200 uppercase tracking-wide">Back End REST API</h3>
            <div className="text-[9px] text-slate-400 font-mono mt-1 text-left space-y-0.5">
              <div>• JobRestController.java</div>
              <div>• JobSearchService.java</div>
            </div>
          </div>

          {/* Third Column: Split into Gemini AI & Adzuna API */}
          <div className="flex flex-col gap-3 justify-center h-32">
            {/* Adzuna API wrapper */}
            <div className={`p-2.5 rounded-lg border text-center transition-all duration-500 flex items-center gap-2.5 ${
              highlightedComponent === 'adzuna'
                ? 'bg-cyan-950/50 border-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.25)]'
                : 'bg-slate-900/80 border-slate-800'
            }`}>
              <Database className="w-4 h-4 text-cyan-400 flex-shrink-0" />
              <div className="text-left overflow-hidden">
                <div className="text-[10px] font-bold text-cyan-300">Adzuna API</div>
                <div className="text-[8px] text-slate-400 font-mono truncate">AdzunaApiWrapper.java</div>
              </div>
            </div>

            {/* Gemini API wrapper */}
            <div className={`p-2.5 rounded-lg border text-center transition-all duration-500 flex items-center gap-2.5 ${
              highlightedComponent === 'gemini'
                ? 'bg-pink-950/50 border-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.25)]'
                : 'bg-slate-900/80 border-slate-800'
            }`}>
              <Cpu className="w-4 h-4 text-pink-400 flex-shrink-0" />
              <div className="text-left overflow-hidden">
                <div className="text-[10px] font-bold text-pink-300">Gemini LLM API</div>
                <div className="text-[8px] text-slate-400 font-mono truncate">GeminiIntegrationService.java</div>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic arrows showing the live communication paths (1, 2, 3, 4) from the diagram */}
        <div className="mt-4 flex flex-wrap gap-4 text-[10px] font-mono justify-center border-t border-slate-800/40 pt-3 w-full">
          <span className={`px-2 py-0.5 rounded transition-all duration-300 ${highlightedPath === 1 ? 'bg-indigo-950 text-indigo-400 font-bold border border-indigo-900' : 'text-slate-500'}`}>
            [1] Client → REST API
          </span>
          <span className={`px-2 py-0.5 rounded transition-all duration-300 ${highlightedPath === 2 ? 'bg-emerald-950 text-emerald-400 font-bold border border-emerald-900' : 'text-slate-500'}`}>
            [2] Controller → Service
          </span>
          <span className={`px-2 py-0.5 rounded transition-all duration-300 ${highlightedPath === 3 ? 'bg-cyan-950 text-cyan-400 font-bold border border-cyan-900' : 'text-slate-500'}`}>
            [3] Service → Adzuna API
          </span>
          <span className={`px-2 py-0.5 rounded transition-all duration-300 ${highlightedPath === 4 ? 'bg-pink-950 text-pink-400 font-bold border border-pink-900' : 'text-slate-500'}`}>
            [4] Service → Gemini API
          </span>
        </div>
      </div>

      {/* Terminal Output Log viewer */}
      <div className="flex-1 flex flex-col min-h-[160px] overflow-hidden">
        <div className="bg-slate-950 p-2 px-4 border-b border-slate-800 flex items-center gap-2">
          <Terminal className="w-4 h-4 text-indigo-400" />
          <span className="font-mono text-xs font-semibold text-slate-400">
            Console Trace Logs (Live Express Backend)
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 font-mono text-xs space-y-3 bg-slate-950 text-slate-300 max-h-[300px]">
          {logs.length === 0 ? (
            <div className="text-slate-500 italic text-center py-4">No requests captured yet. Make an action in the application to stream logs...</div>
          ) : (
            logs.map((log) => {
              // Color based on log type
              const getBadgeColor = () => {
                if (log.caller === 'front-end') return 'text-indigo-400 bg-indigo-950/50 border border-indigo-900/60';
                if (log.caller === 'back-end') return 'text-emerald-400 bg-emerald-950/50 border border-emerald-900/60';
                if (log.caller === 'adzuna-api') return 'text-cyan-400 bg-cyan-950/50 border border-cyan-900/60';
                return 'text-pink-400 bg-pink-950/50 border border-pink-900/60';
              };

              return (
                <div key={log.id} className="border-b border-slate-900/80 pb-2.5 last:border-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="text-[10px] text-slate-500">{log.timestamp}</span>
                    <span className="px-1.5 py-0.5 bg-slate-800 text-slate-400 rounded text-[10px] font-bold">
                      {log.method}
                    </span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider font-bold ${getBadgeColor()}`}>
                      {log.caller}
                    </span>
                    <span className="text-[10px] text-indigo-300/80 truncate">
                      {log.endpoint}
                    </span>
                    {log.javaClassTrace?.controller && (
                      <span className="text-[9px] px-1 py-0.2 bg-slate-900 text-slate-500 border border-slate-800 rounded font-sans ml-auto">
                        {log.javaClassTrace.controller}
                      </span>
                    )}
                  </div>
                  <div className="text-slate-300 text-xs pl-2 border-l-2 border-slate-800 break-words leading-relaxed whitespace-pre-wrap">
                    {log.payload}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
