'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Megaphone, Plus, Image as ImageIcon, Send, Edit, Trash2, Search, Video, ImagePlus, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { adminHandleGalleryStatus } from '@/app/admin/gallery-actions';

type TabType = 'promotions' | 'announcements' | 'broadcasts' | 'ads' | 'gallery' | 'searchLogs';

export default function AdminMarketingView() {
  const [activeTab, setActiveTab] = useState<TabType>('ads');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    const supabase = createClient();
    
    if (activeTab === 'promotions') {
      const { data: res } = await supabase.from('promotions').select('*').order('created_at', { ascending: false });
      if (res) setData(res);
    } else if (activeTab === 'announcements') {
      const { data: res } = await supabase.from('announcements').select('*').order('created_at', { ascending: false });
      if (res) setData(res);
    } else if (activeTab === 'ads') {
      const { data: res } = await supabase.from('shop_ads').select('*').order('created_at', { ascending: false });
      if (res) setData(res);
    } else if (activeTab === 'gallery') {
      // We might want to join with customers for user info, but simple select for now
      const { data: res } = await supabase.from('gallery_submissions').select('*').order('created_at', { ascending: false });
      if (res) setData(res);
    } else if (activeTab === 'searchLogs') {
      const { data: res } = await supabase.from('user_searches').select('*').order('created_at', { ascending: false }).limit(200);
      if (res) setData(res);
    } else {
      // broadcast logic
      setData([]);
    }
    
    setLoading(false);
  };

  const handleGalleryAction = async (id: string, action: 'approve' | 'reject' | 'delete') => {
    const res = await adminHandleGalleryStatus(id, action);
    if (res.success) {
      if (action === 'delete') {
        setData(prev => prev.filter(item => item.id !== id));
      } else {
        const newStatus = action === 'approve' ? 'approved' : 'rejected';
        setData(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
      }
    } else {
      alert('Action failed: ' + res.error);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Marketing & Communications</h1>
          <p className="text-zinc-400">Manage promotions, banners, and broadcasts.</p>
        </div>
        {activeTab !== 'searchLogs' && (
          <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors w-fit">
            <Plus className="w-4 h-4" /> Create New
          </button>
        )}
      </div>

      <div className="flex bg-zinc-900 border border-zinc-800 rounded-xl p-1 w-fit overflow-x-auto max-w-full">
        <button 
          onClick={() => setActiveTab('promotions')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-colors whitespace-nowrap ${activeTab === 'promotions' ? 'bg-indigo-600 text-white shadow' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}
        >
          <ImageIcon className="w-4 h-4" /> Promotions
        </button>
        <button 
          onClick={() => setActiveTab('ads')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-colors whitespace-nowrap ${activeTab === 'ads' ? 'bg-indigo-600 text-white shadow' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}
        >
          <ImagePlus className="w-4 h-4" /> Shop Ads
        </button>
        <button 
          onClick={() => setActiveTab('announcements')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-colors whitespace-nowrap ${activeTab === 'announcements' ? 'bg-indigo-600 text-white shadow' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}
        >
          <Megaphone className="w-4 h-4" /> Announcements
        </button>
        <button 
          onClick={() => setActiveTab('broadcasts')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-colors whitespace-nowrap ${activeTab === 'broadcasts' ? 'bg-indigo-600 text-white shadow' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}
        >
          <Send className="w-4 h-4" /> Broadcasts
        </button>
        <button 
          onClick={() => setActiveTab('gallery')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-colors whitespace-nowrap ${activeTab === 'gallery' ? 'bg-indigo-600 text-white shadow' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}
        >
          <Video className="w-4 h-4" /> Gallery
        </button>
        <button 
          onClick={() => setActiveTab('searchLogs')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-colors whitespace-nowrap ${activeTab === 'searchLogs' ? 'bg-indigo-600 text-white shadow' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}
        >
          <Search className="w-4 h-4" /> Search Logs
        </button>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-950/50">
                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Content</th>
                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Date Created</th>
                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {loading ? (
                <tr><td colSpan={4} className="p-8 text-center text-zinc-500">Loading {activeTab}...</td></tr>
              ) : data.length === 0 ? (
                <tr><td colSpan={4} className="p-8 text-center text-zinc-500">No records found.</td></tr>
              ) : (
                data.map(item => (
                  <tr key={item.id} className="hover:bg-zinc-800/50 transition-colors group">
                    <td className="p-4">
                      {activeTab === 'searchLogs' ? (
                        <div>
                          <p className="text-sm text-white font-bold">{item.query || item.search_term}</p>
                          <p className="text-xs text-zinc-500 mt-1">User ID: {item.user_id || 'Anonymous'}</p>
                        </div>
                      ) : activeTab === 'gallery' ? (
                        <div className="flex items-center gap-3">
                          {item.media_type === 'video' ? (
                            <div className="w-12 h-12 rounded bg-zinc-800 flex items-center justify-center">
                              <Video className="w-5 h-5 text-zinc-500" />
                            </div>
                          ) : (
                            <img src={item.media_url || item.url} alt="Gallery" className="w-12 h-12 rounded object-cover" />
                          )}
                          <p className="text-sm text-zinc-400">{item.media_type}</p>
                        </div>
                      ) : activeTab === 'ads' ? (
                        <div className="flex items-center gap-3">
                          <img src={item.image_url || item.url} alt="Ad" className="w-16 h-10 rounded object-cover border border-zinc-700" />
                          <p className="text-sm text-zinc-400">{item.link || 'No link'}</p>
                        </div>
                      ) : (
                        <p className="text-sm text-white font-medium">{item.title || item.message || 'Untitled'}</p>
                      )}
                    </td>
                    <td className="p-4">
                      {activeTab === 'searchLogs' ? (
                        <span className="text-zinc-500 text-sm">-</span>
                      ) : activeTab === 'gallery' ? (
                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                          item.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                          item.status === 'rejected' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                          'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                        }`}>
                          {item.status || 'pending'}
                        </span>
                      ) : item.is_active !== false ? (
                        <span className="px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-zinc-500/10 text-zinc-500 border border-zinc-500/20">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-sm text-zinc-400">
                      {item.created_at ? format(new Date(item.created_at), 'MMM dd, yyyy HH:mm') : 'Unknown'}
                    </td>
                    <td className="p-4 text-right">
                      {activeTab === 'searchLogs' ? (
                        <span className="text-zinc-600 text-sm">Log Entry</span>
                      ) : activeTab === 'gallery' ? (
                        <div className="flex items-center justify-end gap-2">
                          {item.status === 'pending' && (
                            <>
                              <button onClick={() => handleGalleryAction(item.id, 'approve')} className="p-2 text-emerald-400 hover:text-white hover:bg-emerald-500/20 rounded-lg transition-colors" title="Approve">
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleGalleryAction(item.id, 'reject')} className="p-2 text-amber-400 hover:text-white hover:bg-amber-500/20 rounded-lg transition-colors" title="Reject">
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          <button onClick={() => handleGalleryAction(item.id, 'delete')} className="p-2 text-red-400 hover:text-white hover:bg-red-500/20 rounded-lg transition-colors" title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-2 text-indigo-400 hover:text-white hover:bg-indigo-500/20 rounded-lg transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-red-400 hover:text-white hover:bg-red-500/20 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
