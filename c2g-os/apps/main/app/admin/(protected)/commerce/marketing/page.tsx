'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Megaphone, Plus, Image as ImageIcon, Send, Edit, Trash2, Search, Video, ImagePlus, CheckCircle, XCircle, Copy, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { adminHandleGalleryStatus } from '@/app/admin/gallery-actions';
import { adminBulkUpdateHeroImages, getHeroImages } from '@/app/admin/hero-actions';
import { useModal } from "@/components/providers/modal-provider";
import { CreateMarketingModal } from './CreateMarketingModal';

type TabType = 'hero' | 'announcements' | 'broadcasts' | 'ads' | 'gallery' | 'searchLogs';

export default function AdminMarketingView() {
  const [activeTab, setActiveTab] = useState<TabType>('hero');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingHero, setUploadingHero] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDraggingHero, setIsDraggingHero] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const { showConfirm, showAlert } = useModal();

  useEffect(() => {
    setSelectedIds([]);
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    const supabase = createClient();
    
    if (activeTab === 'hero') {
      const res = await getHeroImages();
      if (res.success) setData(res.images || []);
    } else if (activeTab === 'announcements') {
      const { data: res } = await supabase.from('announcements').select('*').order('created_at', { ascending: false });
      if (res) setData(res);
    } else if (activeTab === 'ads') {
      const { data: res } = await supabase.from('shop_ads').select('*').order('created_at', { ascending: false });
      if (res) setData(res);
    } else if (activeTab === 'gallery') {
      // We might want to join with customers for user info, but simple select for now
      const { data: res } = await supabase.from('gallery_submissions').select('*').order('submitted_at', { ascending: false });
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
    const confirmed = await showConfirm({
      title: 'Confirm Action',
      message: `Are you sure you want to ${action} this gallery item?`,
      type: action === 'delete' || action === 'reject' ? 'danger' : 'success',
      confirmText: `Yes, ${action}`
    });

    if (!confirmed) return;

    const res = await adminHandleGalleryStatus(id, action);
    if (res.success) {
      if (action === 'delete') {
        setData(prev => prev.filter(item => item.id !== id));
      } else {
        const newStatus = action === 'approve' ? 'approved' : 'rejected';
        setData(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
      }
      showAlert({ title: 'Success', message: `Item successfully ${action}d.`, type: 'success' });
    } else {
      showAlert({ title: 'Error', message: 'Action failed: ' + res.error, type: 'danger' });
    }
  };

  const handleDeleteItem = async (id: string) => {
    const confirmed = await showConfirm({
      title: 'Delete Item',
      message: 'Are you sure you want to delete this item? This action cannot be undone.',
      type: 'danger',
      confirmText: 'Delete'
    });

    if (!confirmed) return;

    const { deleteMarketingItem } = await import('./actions');
    let tableName: 'announcements' | 'shop_ads' | 'telegram_broadcasts' = 'announcements';
    if (activeTab === 'ads') tableName = 'shop_ads';
    if (activeTab === 'broadcasts') tableName = 'telegram_broadcasts';

    const res = await deleteMarketingItem(id, tableName);
    if (res.success) {
      setData(prev => prev.filter(item => item.id !== id));
      showAlert({ title: 'Success', message: 'Item deleted successfully.', type: 'success' });
    } else {
      showAlert({ title: 'Error', message: 'Failed to delete item: ' + res.error, type: 'danger' });
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    
    const confirmed = await showConfirm({
      title: 'Bulk Delete',
      message: `Are you sure you want to delete ${selectedIds.length} item(s)? This action cannot be undone.`,
      type: 'danger',
      confirmText: 'Delete All'
    });

    if (!confirmed) return;

    const { bulkDeleteMarketingItems } = await import('./actions');
    let tableName: 'announcements' | 'shop_ads' | 'telegram_broadcasts' = 'announcements';
    if (activeTab === 'ads') tableName = 'shop_ads';
    if (activeTab === 'broadcasts') tableName = 'telegram_broadcasts';

    const res = await bulkDeleteMarketingItems(selectedIds, tableName);
    if (res.success) {
      setData(prev => prev.filter(item => !selectedIds.includes(item.id)));
      setSelectedIds([]);
      showAlert({ title: 'Success', message: 'Items deleted successfully.', type: 'success' });
    } else {
      showAlert({ title: 'Error', message: 'Failed to delete items: ' + res.error, type: 'danger' });
    }
  };

  const handleResend = async (id: string) => {
    const confirmed = await showConfirm({
      title: 'Resend Item',
      message: 'This will reset the creation date and broadcast this item as if it were new. Continue?',
      type: 'warning',
      confirmText: 'Resend'
    });

    if (!confirmed) return;

    const { resendMarketingItem } = await import('./actions');
    let tableName: 'announcements' | 'telegram_broadcasts' = 'announcements';
    if (activeTab === 'broadcasts') tableName = 'telegram_broadcasts';

    const res = await resendMarketingItem(id, tableName);
    if (res.success) {
      showAlert({ title: 'Success', message: 'Item resent successfully.', type: 'success' });
      fetchData();
    } else {
      showAlert({ title: 'Error', message: 'Failed to resend item: ' + res.error, type: 'danger' });
    }
  };

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === data.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(data.map(item => item.id));
    }
  };

  const processHeroFiles = async (files: FileList | null, resetInput?: () => void) => {
    if (!files || files.length !== 15) {
      showAlert({ title: 'Error', message: 'Please select exactly 15 images to upload.', type: 'danger' });
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file) continue;
      if (!allowedTypes.includes(file.type)) {
        showAlert({ title: 'Error', message: `File "${file.name}" has an invalid type. Only JPEG, PNG, WEBP, and GIF are allowed.`, type: 'danger' });
        if (resetInput) resetInput();
        return;
      }
    }

    setUploadingHero(true);
    setUploadProgress(0);
    const uploadedUrls: string[] = [];

    try {
      // Upload all 15 images
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file) continue;
        const formData = new FormData();
        formData.append('file', file);
        formData.append('intent', 'marketing');

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });

        const data = await res.json();
        if (data.success && data.url) {
          uploadedUrls.push(data.url);
          setUploadProgress(i + 1);
        } else {
          throw new Error(data.error || 'Failed to upload one of the images');
        }
      }

      if (uploadedUrls.length === 15) {
        setUploadProgress(16); // indicates updating DB
        const updateRes = await adminBulkUpdateHeroImages(uploadedUrls);
        if (updateRes.success) {
          showAlert({ title: 'Success', message: 'Hero images replaced successfully!', type: 'success' });
          fetchData();
        } else {
          throw new Error(updateRes.error);
        }
      }
    } catch (err: any) {
      showAlert({ title: 'Error', message: err.message || 'An error occurred during upload', type: 'danger' });
    } finally {
      setUploadingHero(false);
      setUploadProgress(0);
      if (resetInput) resetInput();
    }
  };

  const handleHeroBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    processHeroFiles(target.files, () => {
      target.value = '';
    });
  };

  const handleDragOverHero = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingHero(true);
  };

  const handleDragLeaveHero = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingHero(false);
  };

  const handleDropHero = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingHero(false);
    processHeroFiles(e.dataTransfer.files);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Marketing & Communications</h1>
          <p className="text-zinc-400">Manage promotions, banners, and broadcasts.</p>
        </div>
        {activeTab !== 'searchLogs' && (
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors w-fit"
          >
            <Plus className="w-4 h-4" /> Create New
          </button>
        )}
      </div>

      <div className="flex bg-zinc-900 border border-zinc-800 rounded-xl p-1 w-fit overflow-x-auto max-w-full">
        <button 
          onClick={() => setActiveTab('hero')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-colors whitespace-nowrap ${activeTab === 'hero' ? 'bg-indigo-600 text-white shadow' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}
        >
          <ImageIcon className="w-4 h-4" /> Hero Images
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
        {activeTab === 'hero' ? (
          <div className="p-6 space-y-6">
            <div 
              className={`flex items-center justify-between p-6 border-2 border-dashed rounded-xl transition-colors ${isDraggingHero ? 'border-indigo-500 bg-indigo-500/10' : 'border-transparent'}`}
              onDragOver={handleDragOverHero}
              onDragLeave={handleDragLeaveHero}
              onDrop={handleDropHero}
            >
              <div>
                <h2 className="text-lg font-bold text-white">Landing Page Hero Gallery</h2>
                <p className="text-sm text-zinc-400">These 15 images are displayed in the 3 sliding columns on the main landing page.</p>
                {isDraggingHero && <p className="text-sm text-indigo-400 font-bold mt-2 animate-pulse">Drop images here to upload!</p>}
              </div>
              <div className="relative">
                <input 
                  type="file" 
                  multiple 
                  accept="image/jpeg, image/png, image/webp" 
                  onChange={handleHeroBulkUpload}
                  disabled={uploadingHero}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed" 
                />
                <button 
                  disabled={uploadingHero}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" /> 
                  {uploadingHero 
                    ? (uploadProgress === 16 ? 'Updating Gallery...' : `Uploading ${uploadProgress}/15...`) 
                    : 'Bulk Replace 15 Images'}
                </button>
              </div>
            </div>

            {loading ? (
              <div className="text-center text-zinc-500 py-8">Loading images...</div>
            ) : data.length === 0 ? (
              <div className="text-center text-zinc-500 py-8">No hero images found. Please upload 15 images.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map(colIndex => (
                  <div key={colIndex} className="space-y-4">
                    <h3 className="font-bold text-zinc-400 text-sm">Column {colIndex} (Scrolls {colIndex === 2 ? 'Down' : 'Up'})</h3>
                    <div className="flex flex-col gap-3">
                      {data.filter(img => img.column_index === colIndex).map((item, idx) => (
                        <div key={item.id} className="relative group rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800 h-32">
                          <img src={item.image_url} alt={`Hero ${colIndex}-${idx}`} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                          <div className="absolute top-2 left-2 bg-black/60 px-2 py-0.5 rounded text-[10px] text-white font-bold backdrop-blur-sm">
                            {idx + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : activeTab === 'gallery' ? (
          <div className="p-6">
            {loading ? (
              <div className="text-center text-zinc-500 py-8">Loading gallery...</div>
            ) : data.length === 0 ? (
              <div className="text-center text-zinc-500 py-8">No gallery submissions found.</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {data.map(item => (
                  <div key={item.id} className="relative group aspect-square rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800">
                    {item.media_type === 'video' ? (
                      <div className="w-full h-full flex flex-col items-center justify-center">
                        <Video className="w-8 h-8 text-zinc-600 mb-2" />
                        <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Video</span>
                      </div>
                    ) : (
                      <img src={item.media_url || item.url} alt="Gallery item" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    )}
                    
                    {/* Status Badge */}
                    <div className="absolute top-2 left-2 z-10">
                      <span className={`px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider backdrop-blur-md ${
                        item.status === 'approved' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                        item.status === 'rejected' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                        'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {item.status || 'pending'}
                      </span>
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-2 p-4">
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(item.media_url || item.url);
                          showAlert({ title: 'Success', message: 'URL copied to clipboard', type: 'success' });
                        }}
                        className="bg-zinc-800 hover:bg-zinc-700 text-white p-2 rounded-lg transition-colors"
                        title="Copy Image URL"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      
                      {item.status === 'pending' && (
                        <div className="flex items-center gap-2 mt-2">
                          <button onClick={() => handleGalleryAction(item.id, 'approve')} className="bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-400 p-2 rounded-lg transition-colors" title="Approve">
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleGalleryAction(item.id, 'reject')} className="bg-amber-500/20 hover:bg-amber-500/40 text-amber-400 p-2 rounded-lg transition-colors" title="Reject">
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                      {item.status !== 'pending' && (
                        <div className="flex items-center gap-2 mt-2">
                           <button onClick={() => handleGalleryAction(item.id, 'delete')} className="bg-red-500/20 hover:bg-red-500/40 text-red-400 p-2 rounded-lg transition-colors" title="Delete">
                             <Trash2 className="w-4 h-4" />
                           </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            {selectedIds.length > 0 && activeTab !== 'searchLogs' && (
              <div className="bg-zinc-800/50 p-4 border-b border-zinc-800 flex items-center justify-between animate-in fade-in slide-in-from-top-4">
                <span className="text-sm font-medium text-white">{selectedIds.length} item(s) selected</span>
                <button onClick={handleBulkDelete} className="bg-red-500/20 hover:bg-red-500/40 text-red-400 px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors">
                  <Trash2 className="w-4 h-4" /> Delete Selected
                </button>
              </div>
            )}
            <div className="overflow-x-auto hidden md:block">
              <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-950/50">
                  {activeTab !== 'searchLogs' && (
                    <th className="p-4 w-12 text-center">
                      <input 
                        type="checkbox" 
                        checked={selectedIds.length > 0 && selectedIds.length === data.length}
                        onChange={toggleSelectAll}
                        className="rounded border-zinc-700 bg-zinc-900 text-indigo-500 focus:ring-indigo-500/50 focus:ring-offset-0 cursor-pointer" 
                      />
                    </th>
                  )}
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
                      {activeTab !== 'searchLogs' && (
                        <td className="p-4 text-center">
                          <input 
                            type="checkbox" 
                            checked={selectedIds.includes(item.id)}
                            onChange={() => toggleSelection(item.id)}
                            className="rounded border-zinc-700 bg-zinc-900 text-indigo-500 focus:ring-indigo-500/50 focus:ring-offset-0 cursor-pointer" 
                          />
                        </td>
                      )}
                      <td className="p-4">
                        {activeTab === 'searchLogs' ? (
                          <div>
                            <p className="text-sm text-white font-bold">{item.search_query}</p>
                            <p className="text-xs text-zinc-500 mt-1">IP Address: {item.ip_address || 'Anonymous'}</p>
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
                        {(item.created_at || item.submitted_at) ? format(new Date(item.created_at || item.submitted_at), 'MMM dd, yyyy HH:mm') : 'Unknown'}
                      </td>
                      <td className="p-4 text-right">
                        {activeTab === 'searchLogs' ? (
                          <span className="text-zinc-600 text-sm">Log Entry</span>
                        ) : (
                          <div className="flex items-center justify-end gap-2">
                            {(activeTab === 'announcements' || activeTab === 'broadcasts') && (
                              <button onClick={() => handleResend(item.id)} className="p-2 text-emerald-400 hover:text-white hover:bg-emerald-500/20 rounded-lg transition-colors" title="Resend">
                                <RefreshCw className="w-4 h-4" />
                              </button>
                            )}
                            <button className="p-2 text-indigo-400 hover:text-white hover:bg-indigo-500/20 rounded-lg transition-colors" title="Edit">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDeleteItem(item.id)} className="p-2 text-red-400 hover:text-white hover:bg-red-500/20 rounded-lg transition-colors" title="Delete">
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

          
          <div className="md:hidden flex flex-col divide-y divide-zinc-800">
            {loading ? (
              <div className="p-8 text-center text-zinc-500">Loading {activeTab}...</div>
            ) : data.length === 0 ? (
              <div className="p-8 text-center text-zinc-500">No records found.</div>
            ) : (
              data.map(item => (
                <div key={item.id} className="p-4 flex flex-col gap-4 hover:bg-zinc-800/20 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    {activeTab !== 'searchLogs' && (
                      <div className="pt-1">
                        <input 
                          type="checkbox" 
                          checked={selectedIds.includes(item.id)}
                          onChange={() => toggleSelection(item.id)}
                          className="rounded border-zinc-700 bg-zinc-900 text-indigo-500 focus:ring-indigo-500/50 focus:ring-offset-0 cursor-pointer" 
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0 pr-4">
                      {activeTab === 'searchLogs' ? (
                        <>
                          <p className="text-sm text-white font-bold">{item.search_query}</p>
                          <p className="text-xs text-zinc-500 mt-1">IP Address: {item.ip_address || 'Anonymous'}</p>
                        </>
                      ) : activeTab === 'ads' ? (
                        <div className="flex items-center gap-3">
                          <img src={item.image_url || item.url} alt="Ad" className="w-16 h-10 rounded object-cover border border-zinc-700" />
                          <p className="text-sm text-zinc-400 truncate">{item.link || 'No link'}</p>
                        </div>
                      ) : (
                        <p className="text-sm text-white font-medium">{item.title || item.message || 'Untitled'}</p>
                      )}
                    </div>
                    <div>
                      {activeTab !== 'searchLogs' && (
                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${item.is_active !== false ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-zinc-500/10 text-zinc-500 border border-zinc-500/20'}`}>
                          {item.is_active !== false ? 'Active' : 'Inactive'}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <p className="text-[10px] text-zinc-500">
                      {(item.created_at || item.submitted_at) ? format(new Date(item.created_at || item.submitted_at), 'MMM dd, yyyy HH:mm') : 'Unknown'}
                    </p>
                    
                    {activeTab === 'searchLogs' ? (
                      <span className="text-zinc-600 text-[10px] uppercase font-bold tracking-wider">Log Entry</span>
                    ) : (
                      <div className="flex items-center gap-2">
                        {(activeTab === 'announcements' || activeTab === 'broadcasts') && (
                          <button onClick={() => handleResend(item.id)} className="p-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl transition-colors" title="Resend">
                            <RefreshCw className="w-4 h-4" />
                          </button>
                        )}
                        <button className="p-2 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-xl transition-colors" title="Edit">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeleteItem(item.id)} className="p-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl transition-colors" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
          </>
        )}
      </div>

      <CreateMarketingModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        activeTab={activeTab} 
        onSuccess={() => {
          fetchData();
          showAlert({ title: 'Success', message: 'Item created successfully!', type: 'success' });
        }} 
      />
    </div>
  );
}
