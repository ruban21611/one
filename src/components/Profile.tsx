import React, { useState } from 'react';
import { UserProfile } from '../types';
import { User, Mail, Briefcase, MapPin, Award, FileText, GraduationCap, Save, Plus, X } from 'lucide-react';
import { motion } from 'motion/react';

interface ProfileProps {
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
}

export default function Profile({ profile, setProfile }: ProfileProps) {
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [title, setTitle] = useState(profile.title);
  const [location, setLocation] = useState(profile.location);
  const [skills, setSkills] = useState<string[]>(profile.skills);
  const [experience, setExperience] = useState(profile.experience);
  const [education, setEducation] = useState(profile.education);
  const [newSkill, setNewSkill] = useState('');
  const [saved, setSaved] = useState(false);

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile({
      name,
      email,
      title,
      location,
      skills,
      experience,
      education
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div id="profile-tab" className="bg-white border border-slate-100 rounded-xl p-5 md:p-6 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-slate-50 pb-3">
        <div className="flex items-center gap-2">
          <User className="w-5 h-5 text-indigo-600" />
          <h2 className="font-bold text-sm text-slate-900 uppercase tracking-wider">Candidate Developer Profile</h2>
        </div>
        {saved && (
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-lg animate-pulse">
            Profile saved successfully!
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name */}
          <div className="space-y-1.5 text-xs">
            <label className="text-slate-500 font-bold uppercase text-[10px] flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" /> Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-100 rounded-lg text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              required
            />
          </div>

          {/* Email */}
          <div className="space-y-1.5 text-xs">
            <label className="text-slate-500 font-bold uppercase text-[10px] flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" /> Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-100 rounded-lg text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              required
            />
          </div>

          {/* Title */}
          <div className="space-y-1.5 text-xs">
            <label className="text-slate-500 font-bold uppercase text-[10px] flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-slate-400" /> Professional Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-100 rounded-lg text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              required
            />
          </div>

          {/* Location */}
          <div className="space-y-1.5 text-xs">
            <label className="text-slate-500 font-bold uppercase text-[10px] flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" /> Target Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-100 rounded-lg text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              required
            />
          </div>
        </div>

        {/* Skills Tag Cloud Manager */}
        <div className="space-y-3">
          <label className="text-slate-500 font-bold uppercase text-[10px] flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-slate-400" /> Skills Tag Cloud
          </label>
          
          <div className="flex flex-wrap gap-1.5 p-3 bg-slate-50 border border-slate-100 rounded-lg min-h-[44px]">
            {skills.map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-white text-slate-700 text-xs font-bold rounded-lg border border-slate-100 shadow-sm"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="p-0.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-rose-600 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex gap-2 max-w-sm">
            <input
              type="text"
              placeholder="e.g. Docker, TypeScript, Jenkins..."
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              className="flex-1 p-2 bg-slate-50 border border-slate-100 rounded-lg text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="px-3 py-2 bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 border border-slate-100 hover:border-indigo-100 rounded-lg transition-colors text-xs font-bold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Skill
            </button>
          </div>
        </div>

        {/* Experience summary description */}
        <div className="space-y-1.5 text-xs">
          <label className="text-slate-500 font-bold uppercase text-[10px] flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-slate-400" /> Work Experience Summary
          </label>
          <textarea
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            className="w-full h-28 p-3 bg-slate-50 border border-slate-100 rounded-lg text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 placeholder-slate-400 leading-relaxed"
            placeholder="Write a summary of your professional milestones, titles, and environments..."
            required
          />
        </div>

        {/* Education details */}
        <div className="space-y-1.5 text-xs">
          <label className="text-slate-500 font-bold uppercase text-[10px] flex items-center gap-1.5">
            <GraduationCap className="w-3.5 h-3.5 text-slate-400" /> Education & Qualifications
          </label>
          <input
            type="text"
            value={education}
            onChange={(e) => setEducation(e.target.value)}
            className="w-full p-2.5 bg-slate-50 border border-slate-100 rounded-lg text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            placeholder="e.g. B.S. in Computer Science, State University, 2024"
            required
          />
        </div>

        <button
          type="submit"
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-505 font-bold text-xs text-white rounded-lg transition-colors flex items-center gap-2 shadow-sm"
        >
          <Save className="w-4 h-4" /> Save Developer Profile
        </button>
      </form>
    </div>
  );
}
