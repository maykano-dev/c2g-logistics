'use client';

import { UserCircle, Clock, CalendarCheck, AlertTriangle, ShieldCheck, Activity, Award } from 'lucide-react';

export default function EmployeeHRView() {
  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500 pb-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
            <UserCircle className="w-6 h-6 text-indigo-500" /> My Profile & Performance
          </h1>
          <p className="text-zinc-400 mt-1">Track your attendance, performance scores, and daily shift logs.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Profile Card */}
        <div className="lg:col-span-1 bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col">
          <div className="bg-indigo-600 h-24 relative">
             <div className="absolute -bottom-10 left-6 w-20 h-20 bg-zinc-900 border-4 border-zinc-900 rounded-2xl flex items-center justify-center shadow-xl">
               <UserCircle className="w-12 h-12 text-zinc-500" />
             </div>
          </div>
          <div className="pt-14 px-6 pb-6">
            <h2 className="text-xl font-bold text-white">Staff Member</h2>
            <p className="text-zinc-400 text-sm mb-4">C2G-EMP-1042</p>
            
            <div className="flex items-center gap-2 mb-6">
              <span className="px-2 py-1 bg-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest rounded border border-indigo-500/20">
                Procurement Officer
              </span>
              <span className="px-2 py-1 bg-emerald-500/20 text-emerald-500 text-xs font-bold uppercase tracking-widest rounded border border-emerald-500/20">
                Active
              </span>
            </div>

            <div className="space-y-4 pt-4 border-t border-zinc-800">
              <div>
                <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mb-1">Network Status</p>
                <div className="flex items-center gap-2 text-sm text-emerald-500 font-bold">
                  <ShieldCheck className="w-4 h-4" /> Validated Office IP
                </div>
              </div>
              <div>
                <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mb-1">Warnings</p>
                <div className="flex items-center gap-2 text-sm text-zinc-400">
                  <AlertTriangle className="w-4 h-4 text-zinc-600" /> 0 Active Warnings
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance & Activity */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Performance Score */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden">
            <Award className="absolute -right-4 -top-4 w-32 h-32 text-indigo-500/5 pointer-events-none" />
            <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-6 flex items-center gap-2">
              <Activity className="w-4 h-4" /> Your 30-Day Performance
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-center">
                <p className="text-3xl font-black text-white mb-1">142</p>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Tasks Completed</p>
              </div>
              <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-center">
                <p className="text-3xl font-black text-emerald-500 mb-1">98%</p>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">On-Time Rate</p>
              </div>
              <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-center">
                <p className="text-3xl font-black text-white mb-1">1.2h</p>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Avg Speed</p>
              </div>
              <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-center">
                <p className="text-3xl font-black text-white mb-1">A+</p>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Overall Grade</p>
              </div>
            </div>
            <p className="text-xs text-zinc-500 mt-4 text-center italic">Scores are automatically calculated from the system audit log.</p>
          </div>

          {/* Attendance Log */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-zinc-800 bg-zinc-950/50 flex justify-between items-center">
              <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                <CalendarCheck className="w-4 h-4" /> Recent Attendance Log
              </h3>
            </div>
            
            <div className="p-2 space-y-2">
              {[
                { date: 'Today, 14 June', in: '08:14 AM', out: '--:--', status: 'clocked_in' },
                { date: 'Yesterday, 13 June', in: '08:02 AM', out: '05:30 PM', status: 'completed' },
                { date: 'Tuesday, 12 June', in: '08:15 AM', out: '05:15 PM', status: 'completed' },
                { date: 'Monday, 11 June', in: '--:--', out: '--:--', status: 'absent' },
                { date: 'Friday, 08 June', in: '07:55 AM', out: '04:00 PM', status: 'completed' },
              ].map((log, i) => (
                <div key={i} className={`p-4 rounded-xl flex justify-between items-center ${
                  log.status === 'absent' ? 'bg-red-500/5 border border-red-500/20' : 
                  'bg-zinc-950/50 border border-zinc-800/50'
                }`}>
                  <div>
                    <p className={`text-sm font-bold ${log.status === 'absent' ? 'text-red-400' : 'text-white'}`}>{log.date}</p>
                    <div className="flex gap-4 mt-1 text-xs font-mono">
                      <span className="text-emerald-500">IN: {log.in}</span>
                      <span className="text-zinc-500">OUT: {log.out}</span>
                    </div>
                  </div>
                  {log.status === 'absent' && (
                    <span className="px-2 py-1 bg-red-500/20 text-red-500 text-[10px] font-bold uppercase tracking-widest rounded">Absent Flag</span>
                  )}
                  {log.status === 'clocked_in' && (
                    <span className="px-2 py-1 bg-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-widest rounded">Active Shift</span>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
