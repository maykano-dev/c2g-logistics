'use client';

import { useState, useEffect } from 'react';
import { Megaphone, Send, Clock, Users, Mail, BellRing } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { createAnnouncement } from '@/app/admin/announcement-actions';
import { format } from 'date-fns';

export default function AnnouncementsView() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [audience, setAudience] = useState('all');

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: false });

    if (data && !error) {
      setAnnouncements(data);
    }
    setLoading(false);
  };

  const handleCreate = async () => {
    if (!title || !content) {
      alert('Please provide a subject and message body.');
      return;
    }

    setIsSubmitting(true);
    const result = await createAnnouncement(title, content, audience);
    if (result.success) {
      setTitle('');
      setContent('');
      setAudience('all');
      fetchAnnouncements(); // Refresh list
    } else {
      alert('Error creating announcement: ' + result.error);
    }
    setIsSubmitting(false);
  };

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
              <button 
                onClick={() => setAudience('all')}
                className={`py-2 text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-colors ${audience === 'all' ? 'bg-indigo-600 border border-indigo-500 text-white' : 'bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white'}`}
              >
                <Users className="w-4 h-4" /> All Users
              </button>
              <button 
                onClick={() => setAudience('importers')}
                className={`py-2 text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-colors ${audience === 'importers' ? 'bg-indigo-600 border border-indigo-500 text-white' : 'bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white'}`}
              >
                Importers Only
              </button>
              <button 
                onClick={() => setAudience('staff')}
                className={`py-2 text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-colors ${audience === 'staff' ? 'bg-indigo-600 border border-indigo-500 text-white' : 'bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white'}`}
              >
                Staff Only
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-zinc-500 tracking-widest mb-2">Delivery Channels</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm text-white cursor-pointer group">
                <input type="checkbox" defaultChecked className="rounded border-zinc-700 bg-zinc-950 text-indigo-500" />
                <BellRing className="w-4 h-4 text-indigo-400" /> In-App Alert
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
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Holiday Shipping Schedule Changes" 
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-zinc-500 tracking-widest mb-2">Message Body</label>
              <textarea 
                rows={6} 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Type your announcement here..." 
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500 resize-none"
              ></textarea>
            </div>
          </div>

          <button 
            onClick={handleCreate}
            disabled={isSubmitting}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
          >
            {isSubmitting ? 'Sending...' : <><Send className="w-4 h-4" /> Send Broadcast Now</>}
          </button>
        </div>

        {/* History */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col overflow-hidden h-[600px]">
          <div className="p-4 border-b border-zinc-800 bg-zinc-950/50">
            <h2 className="text-sm font-bold uppercase tracking-widest text-white">Broadcast History</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
             {loading ? (
               <div className="text-center text-zinc-500 py-8">Loading history...</div>
             ) : announcements.length === 0 ? (
               <div className="text-center text-zinc-500 py-8">No announcements yet.</div>
             ) : (
               announcements.map((msg) => (
                 <div key={msg.id} className="p-4 bg-zinc-950/50 border border-zinc-800/50 rounded-xl">
                   <div className="flex justify-between items-start mb-2">
                     <h3 className="text-sm font-bold text-white">{msg.title}</h3>
                     <span className="text-[10px] text-zinc-500 flex items-center gap-1 shrink-0"><Clock className="w-3 h-3"/> {format(new Date(msg.created_at), 'MMM dd, yyyy')}</span>
                   </div>
                   <div className="flex items-center gap-3 text-xs mb-2">
                     <span className="text-zinc-400">Audience: <span className="text-zinc-200 font-medium capitalize">{msg.target_audience}</span></span>
                     <span className="text-zinc-700">•</span>
                     <span className="text-zinc-400">Status: <span className={msg.is_active ? 'text-emerald-400 font-medium' : 'text-zinc-500'}>{msg.is_active ? 'Active' : 'Archived'}</span></span>
                   </div>
                   <p className="text-xs text-zinc-500 line-clamp-2">{msg.content}</p>
                 </div>
               ))
             )}
          </div>
        </div>

      </div>
    </div>
  );
}
