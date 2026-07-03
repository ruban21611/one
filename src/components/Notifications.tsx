import React, { useState } from 'react';
import { Notification } from '../types';
import { Bell, Info, CheckCircle2, AlertTriangle, AlertCircle, Trash2, MailCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: "notif-1",
    title: "New Match Alert",
    message: "We found 2 new React Developer job matches in San Francisco matching your profile skills tag cloud.",
    type: "success",
    time: "10 mins ago",
    read: false
  },
  {
    id: "notif-2",
    title: "Java Backend Router Active",
    message: "Rest controller endpoint '/api/jobs' resolved successfully using local simulated indexes.",
    type: "info",
    time: "1 hour ago",
    read: false
  },
  {
    id: "notif-3",
    title: "Resume Optimizer Ready",
    message: "Your Cover Letter and custom resume accomplishment bullets have been generated successfully.",
    type: "success",
    time: "2 hours ago",
    read: true
  },
  {
    id: "notif-4",
    title: "Adzuna API Warning",
    message: "No ADZUNA_APP_ID is active in environment secrets. System is operating under simulated local search mode.",
    type: "warning",
    time: "1 day ago",
    read: true
  }
];

export default function Notifications() {
  const [notifs, setNotifs] = useState<Notification[]>(INITIAL_NOTIFICATIONS);

  const markAllRead = () => {
    setNotifs(notifs.map(n => ({ ...n, read: true })));
  };

  const toggleRead = (id: string) => {
    setNotifs(notifs.map(n => n.id === id ? { ...n, read: !n.read } : n));
  };

  const deleteNotif = (id: string) => {
    setNotifs(notifs.filter(n => n.id !== id));
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'info': return <Info className="w-4 h-4 text-indigo-500" />;
      case 'success': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case 'alert': return <AlertCircle className="w-4 h-4 text-rose-500" />;
    }
  };

  const getBorderColor = (type: Notification['type']) => {
    switch (type) {
      case 'info': return 'border-l-indigo-500';
      case 'success': return 'border-l-emerald-500';
      case 'warning': return 'border-l-amber-500';
      case 'alert': return 'border-l-rose-500';
    }
  };

  return (
    <div id="notifications-tab" className="space-y-6">
      <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-50 pb-3">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-indigo-600" />
            <h2 className="font-bold text-sm text-slate-900 uppercase tracking-wider">Matched Alerts & Notifications</h2>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={markAllRead}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 bg-indigo-50/50 hover:bg-indigo-50 border border-indigo-100/50 px-2.5 py-1 rounded-lg transition-colors"
            >
              <MailCheck className="w-3.5 h-3.5" /> Mark All Read
            </button>
          </div>
        </div>

        {notifs.length === 0 ? (
          <div className="text-center py-12 space-y-2">
            <p className="text-slate-500 text-sm font-semibold">All caught up!</p>
            <p className="text-slate-400 text-xs">No active alerts or matched postings found.</p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {notifs.map((n) => (
                <div
                  key={n.id}
                  className={`p-4 rounded-xl border border-slate-100 border-l-4 ${getBorderColor(n.type)} flex items-start gap-3.5 transition-all ${
                    n.read ? 'bg-slate-50/40 opacity-80' : 'bg-white shadow-sm'
                  }`}
                >
                  <div className="p-1.5 bg-slate-50 border border-slate-100 rounded-lg flex-shrink-0 mt-0.5">
                    {getIcon(n.type)}
                  </div>
                  
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-4">
                      <h4 className={`text-xs font-bold ${n.read ? 'text-slate-700' : 'text-slate-900 font-extrabold'}`}>
                        {n.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-medium font-mono whitespace-nowrap">{n.time}</span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">{n.message}</p>
                  </div>

                  <div className="flex items-center gap-1 self-center ml-2">
                    <button
                      onClick={() => toggleRead(n.id)}
                      className={`text-[10px] font-bold px-2 py-1 rounded transition-colors ${
                        n.read ? 'bg-slate-100 hover:bg-slate-200 text-slate-500' : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-600'
                      }`}
                    >
                      {n.read ? 'Mark Unread' : 'Mark Read'}
                    </button>
                    <button
                      onClick={() => deleteNotif(n.id)}
                      className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete Notification"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
