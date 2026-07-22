"use client";
import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { X, Upload } from 'lucide-react';

export function CreateMarketingModal({ 
  isOpen, 
  onClose, 
  activeTab,
  onSuccess 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  activeTab: string,
  onSuccess: () => void 
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Announcement state
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('info');
  
  // Ads state
  const [link, setLink] = useState('');
  const [file, setFile] = useState<File | null>(null);
  
  // Broadcast state
  const [audience, setAudience] = useState('all');
  const [channel, setChannel] = useState('telegram');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const supabase = createClient();
    
    try {
      if (activeTab === 'announcements') {
        const { error: err } = await supabase.from('announcements').insert({
          title,
          message,
          type,
          icon: 'megaphone',
          is_active: true
        });
        if (err) throw err;
      } 
      else if (activeTab === 'ads') {
        if (!file) throw new Error('Please select an image for the ad');
        
        const formData = new FormData();
        formData.append('file', file);
        formData.append('intent', 'shop_ads');
        
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });
        
        const uploadData = await uploadRes.json();
        if (!uploadData.success || !uploadData.url) {
          throw new Error(uploadData.error || 'Failed to upload image');
        }
        
        const { error: err } = await supabase.from('shop_ads').insert({
          image_url: uploadData.url,
          link,
          is_active: true
        });
        if (err) throw err;
      }
      else if (activeTab === 'broadcasts') {
        const { error: err } = await supabase.from('telegram_broadcasts').insert({
          message_text: message,
          audience,
          channel,
          status: 'pending'
        });
        if (err) throw err;
      }
      
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-zinc-800 bg-zinc-950/50">
          <h2 className="text-xl font-bold text-white capitalize">
            Create New {activeTab === 'ads' ? 'Ad' : activeTab.slice(0, -1)}
          </h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors p-2 hover:bg-zinc-800 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          {activeTab === 'announcements' && (
            <>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Title</label>
                <input required value={title} onChange={e => setTitle(e.target.value)} type="text" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Message</label>
                <textarea required value={message} onChange={e => setMessage(e.target.value)} rows={4} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Type</label>
                <select value={type} onChange={e => setType(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all appearance-none">
                  <option value="info">Info</option>
                  <option value="success">Success</option>
                  <option value="warning">Warning</option>
                  <option value="error">Error</option>
                </select>
              </div>
            </>
          )}
          
          {activeTab === 'ads' && (
            <>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Ad Image</label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-zinc-800 border-dashed rounded-xl cursor-pointer bg-zinc-950 hover:bg-zinc-900 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-3 text-zinc-500" />
                      <p className="mb-2 text-sm text-zinc-400"><span className="font-bold">Click to upload</span></p>
                      <p className="text-xs text-zinc-500">{file ? file.name : "PNG, JPG or WEBP (Max. 8MB)"}</p>
                    </div>
                    <input required onChange={e => setFile(e.target.files?.[0] || null)} type="file" className="hidden" accept="image/png, image/jpeg, image/webp" />
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Destination Link</label>
                <input required value={link} onChange={e => setLink(e.target.value)} type="url" placeholder="https://..." className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" />
              </div>
            </>
          )}
          
          {activeTab === 'broadcasts' && (
            <>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Audience</label>
                <select value={audience} onChange={e => setAudience(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all appearance-none">
                  <option value="all">All Users</option>
                  <option value="active">Active Customers</option>
                  <option value="inactive">Inactive Customers</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Channel</label>
                <select value={channel} onChange={e => setChannel(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all appearance-none">
                  <option value="telegram">Telegram Channel</option>
                  <option value="email">Email</option>
                  <option value="in_app">In-App Notification</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Message</label>
                <textarea required value={message} onChange={e => setMessage(e.target.value)} rows={6} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"></textarea>
              </div>
            </>
          )}
          
          <div className="pt-4 flex gap-3">
            <button type="button" onClick={onClose} disabled={loading} className="flex-1 px-4 py-2.5 rounded-xl border border-zinc-800 text-white font-bold hover:bg-zinc-800 transition-colors disabled:opacity-50">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="flex-1 px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-500 transition-colors disabled:opacity-50 flex justify-center items-center">
              {loading ? 'Saving...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
