'use client';

import { Megaphone, Send, Clock, Users, Mail, BellRing } from 'lucide-react';

export default function AnnouncementsView() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
            <Megaphone className="w-6 h-6 text-indigo-500" /> Broadcasts & Announcements
          </h1>
          <p className="text-zinc-400 mt-1">Send push notifications, emails, and dashboard alerts to all users or specific segments.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Composer */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col gap-6">
          <div>
            <label className="block text-xs font-bold uppercase text-zinc-500 tracking-widest mb-2">Target Audience</label>
            <div className="grid grid-cols-3 gap-2">
              <button className="py-2 bg-indigo-600 border border-indigo-500 text-white text-sm font-bold rounded-lg flex items-center justify-center gap-2">
                <Users className="w-4 h-4" /> All Users
              </button>
              <button className="py-2 bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white rounded-lg text-sm font-medium transition-colors">
                Importers Only
              </button>
              <button className="py-2 bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white rounded-lg text-sm font-medium transition-colors">
                Ghana Drivers
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-zinc-500 tracking-widest mb-2">Delivery Channels</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm text-white cursor-pointer group">
                <input type="checkbox" defaultChecked className="rounded border-zinc-700 bg-zinc-950 text-indigo-500" />
                <BellRing className="w-4 h-4 text-indigo-400" /> Push Notification
              </label>
              <label className="flex items-center gap-2 text-sm text-white cursor-pointer group">
                <input type="checkbox" defaultChecked className="rounded border-zinc-700 bg-zinc-950 text-indigo-500" />
                <Mail className="w-4 h-4 text-emerald-400" /> Email Blast
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-zinc-500 tracking-widest mb-2">Message Subject</label>
              <input type="text" placeholder="e.g. Holiday Shipping Schedule Changes" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-zinc-500 tracking-widest mb-2">Message Body</label>
              <textarea rows={6} placeholder="Type your announcement here..." className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500 resize-none"></textarea>
            </div>
          </div>

          <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors">
            <Send className="w-4 h-4" /> Send Broadcast Now
          </button>
        </div>

        {/* History */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col overflow-hidden">
          <div className="p-4 border-b border-zinc-800 bg-zinc-950/50">
            <h2 className="text-sm font-bold uppercase tracking-widest text-white">Broadcast History</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
             {[
               { title: 'China Holiday Break Notification', date: 'Oct 1, 2024', reach: '4,209 Users', channels: ['Push', 'Email'] },
               { title: 'System Maintenance Window', date: 'Sep 15, 2024', reach: 'All Admins', channels: ['Push'] },
               { title: 'New C2G Mall Rates', date: 'Aug 30, 2024', reach: '1,050 Importers', channels: ['Email'] },
             ].map((msg, i) => (
               <div key={i} className="p-4 bg-zinc-950/50 border border-zinc-800/50 rounded-xl">
                 <div className="flex justify-between items-start mb-2">
                   <h3 className="text-sm font-bold text-white">{msg.title}</h3>
                   <span className="text-[10px] text-zinc-500 flex items-center gap-1"><Clock className="w-3 h-3"/> {msg.date}</span>
                 </div>
                 <div className="flex items-center gap-3 text-xs">
                   <span className="text-zinc-400">Reach: <span className="text-zinc-200 font-medium">{msg.reach}</span></span>
                   <span className="text-zinc-700">•</span>
                   <span className="text-zinc-400">Via: <span className="text-zinc-200 font-medium">{msg.channels.join(', ')}</span></span>
                 </div>
               </div>
             ))}
          </div>
        </div>

      </div>
    </div>
  );
}
