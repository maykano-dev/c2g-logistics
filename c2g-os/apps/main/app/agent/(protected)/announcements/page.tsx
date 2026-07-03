'use client';

import { useState, useEffect, useTransition } from 'react';
import { Radio, Plus, Trash2, Power, Eye, Calendar, Info, AlertTriangle, MessageCircle, X } from 'lucide-react';
import { fetchAnnouncements, createAnnouncement, toggleAnnouncement, deleteAnnouncement } from './actions';
import { format } from 'date-fns';

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [showModal, setShowModal] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'info',
    priority: 0,
    start_date: '',
    end_date: ''
  });

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    setLoading(true);
    const res = await fetchAnnouncements();
    if (res.success) {
      setAnnouncements(res.data || []);
    }
    setLoading(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const payload: any = {
        title: formData.title,
        message: formData.message,
        type: formData.type,
        priority: Number(formData.priority)
      };
      
      if (formData.start_date) payload.start_date = new Date(formData.start_date).toISOString();
      if (formData.end_date) payload.end_date = new Date(formData.end_date).toISOString();

      const res = await createAnnouncement(payload);
      if (res.success) {
        setShowModal(false);
        setFormData({ title: '', message: '', type: 'info', priority: 0, start_date: '', end_date: '' });
        loadAnnouncements();
      } else {
        alert("Error creating announcement: " + res.error);
      }
    });
  };

  const handleToggle = async (id: string, current: boolean) => {
    startTransition(async () => {
      await toggleAnnouncement(id, current);
      loadAnnouncements();
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return;
    startTransition(async () => {
      await deleteAnnouncement(id);
      loadAnnouncements();
    });
  };

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'info': return <Info className="w-4 h-4 text-blue-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'success': return <Radio className="w-4 h-4 text-emerald-500" />;
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return <MessageCircle className="w-4 h-4 text-indigo-500" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-24">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Radio className="w-6 h-6 text-indigo-500" /> Announcements
          </h1>
          <p className="text-zinc-400">Manage broadcasts to all active customers.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors w-fit shadow-lg shadow-indigo-500/20"
        >
          <Plus className="w-4 h-4" /> New Broadcast
        </button>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-zinc-500 animate-pulse">Loading announcements...</div>
        ) : announcements.length === 0 ? (
          <div className="p-12 text-center text-zinc-500">No announcements created yet.</div>
        ) : (
          <div className="divide-y divide-zinc-800">
            {announcements.map((ann) => (
              <div key={ann.id} className="p-5 hover:bg-zinc-800/50 transition-colors flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center shrink-0">
                    {getTypeIcon(ann.type)}
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg flex items-center gap-2">
                      {ann.title}
                      {!ann.is_active && <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-red-500/10 text-red-500 border border-red-500/20">Inactive</span>}
                      {ann.is_active && <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">Live</span>}
                    </h3>
                    <p className="text-sm text-zinc-400 mt-1 line-clamp-2">{ann.message}</p>
                    
                    <div className="flex items-center gap-4 mt-3 text-xs text-zinc-500 font-medium">
                      <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Created {format(new Date(ann.created_at), 'MMM dd, yyyy')}</span>
                      {ann.start_date && <span>Starts: {format(new Date(ann.start_date), 'MMM dd')}</span>}
                      {ann.end_date && <span>Ends: {format(new Date(ann.end_date), 'MMM dd')}</span>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto shrink-0 border-t border-zinc-800 md:border-0 pt-4 md:pt-0 mt-2 md:mt-0">
                  <button 
                    onClick={() => handleToggle(ann.id, ann.is_active)}
                    disabled={isPending}
                    className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-colors disabled:opacity-50 ${ann.is_active ? 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white' : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20'}`}
                  >
                    <Power className="w-4 h-4" /> {ann.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                  <button 
                    onClick={() => handleDelete(ann.id)}
                    disabled={isPending}
                    className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors disabled:opacity-50 border border-transparent hover:border-red-500/20"
                    title="Delete Announcement"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div 
            className="bg-zinc-950 border border-zinc-800 rounded-3xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Radio className="w-5 h-5 text-indigo-500" /> New Broadcast
              </h2>
              <button onClick={() => setShowModal(false)} className="text-zinc-500 hover:text-white"><X className="w-5 h-5"/></button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Announcement Title</label>
                <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500" placeholder="e.g. System Maintenance" />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Message</label>
                <textarea required rows={4} value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500 resize-none custom-scrollbar" placeholder="Enter the broadcast message..." />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Type</label>
                  <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500">
                    <option value="info">Information</option>
                    <option value="warning">Warning</option>
                    <option value="success">Success</option>
                    <option value="error">Critical Error</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Priority (0-10)</label>
                  <input type="number" min="0" max="10" value={formData.priority} onChange={e => setFormData({...formData, priority: parseInt(e.target.value)})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Start Date (Optional)</label>
                  <input type="datetime-local" value={formData.start_date} onChange={e => setFormData({...formData, start_date: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">End Date (Optional)</label>
                  <input type="datetime-local" value={formData.end_date} onChange={e => setFormData({...formData, end_date: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500" />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-xl font-bold text-white bg-zinc-800 hover:bg-zinc-700 transition-colors">Cancel</button>
                <button type="submit" disabled={isPending} className="px-5 py-2.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 transition-colors flex items-center gap-2">
                  <Radio className="w-4 h-4" /> Broadcast
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
