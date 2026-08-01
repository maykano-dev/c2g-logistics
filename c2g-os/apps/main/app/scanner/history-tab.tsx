"use client";

import { useState, useEffect, useMemo } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Search, Package, Clock, RefreshCcw, Filter, ChevronDown } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

import { ScanLog } from './scanner-client';


export default function HistoryTab({ sessionHistory }: { sessionHistory: ScanLog[] }) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'updated' | 'already_processed' | 'not_found'>('all');
  const supabase = createClient();

  const fetchGlobalHistory = async () => {
    setLoading(true);
    try {
      let queryBuilder = supabase
        .from('scan_logs')
        .select('id, scanned_tracking, scan_result, customer_name, current_status, scanned_at')
        .order('scanned_at', { ascending: false })
        .limit(1000);

      const { data, error } = await queryBuilder;

      if (error) throw error;

      const formatted = (data || []).map((s: any) => {
        let message = '';
        if (s.scan_result === 'updated') message = 'Package marked as CHINA WAREHOUSE';
        else if (s.scan_result === 'already_processed') message = `Already processed (${s.current_status || 'in_warehouse'})`;
        else message = 'Package not found in database';

        return {
          id: s.id,
          tracking_number: s.scanned_tracking,
          customer_name: s.customer_name,
          status: s.scan_result,
          message: message,
          updated_at: s.scanned_at,
          source: 'scan_log'
        };
      });

      setItems(formatted);
    } catch (err: any) {
      console.error('Error fetching global scan history:', err.message || JSON.stringify(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGlobalHistory();
  }, []);

  // Merge session history with global items, avoiding duplicates
  const allItems = useMemo(() => {
    const merged = [...sessionHistory];
    const sessionTrackingNumbers = new Set(sessionHistory.map(h => h.trackingNumber));
    
    items.forEach(item => {
      if (!sessionTrackingNumbers.has(item.tracking_number)) {
        merged.push(item);
      }
    });
    return merged;
  }, [sessionHistory, items]);

  // Client-side filtering for instant search through scanned packages
  const displayItems = useMemo(() => {
    let filtered = allItems;

    // Filter by search query (tracking number or customer name)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter((item: any) => {
        const tracking = (item.trackingNumber || item.tracking_number || '').toLowerCase();
        const name = (item.customerName || item.customer_name || '').toLowerCase();
        return tracking.includes(q) || name.includes(q);
      });
    }

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter((item: any) => item.status === filterStatus);
    }

    return filtered;
  }, [allItems, searchQuery, filterStatus]);

  // Summary stats
  const stats = useMemo(() => {
    const total = allItems.length;
    const found = allItems.filter((i: any) => i.status === 'updated').length;
    const notFound = allItems.filter((i: any) => i.status === 'not_found' || i.status === 'error').length;
    const duplicates = allItems.filter((i: any) => i.status === 'already_processed').length;
    return { total, found, notFound, duplicates };
  }, [allItems]);

  return (
    <div className="h-full w-full bg-zinc-950 flex flex-col pt-safe">
      <div className="p-4 border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-xl shrink-0 z-10 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Scan History</h2>
          <button 
            onClick={fetchGlobalHistory} 
            disabled={loading}
            className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors disabled:opacity-50"
          >
            <RefreshCcw className={`w-4 h-4 text-zinc-400 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-2">
          <button onClick={() => setFilterStatus('all')} className={`text-center p-2 rounded-xl border transition-all ${filterStatus === 'all' ? 'bg-blue-500/20 border-blue-500/50' : 'bg-zinc-900 border-zinc-800'}`}>
            <p className="text-lg font-black text-white">{stats.total}</p>
            <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">Total</p>
          </button>
          <button onClick={() => setFilterStatus('updated')} className={`text-center p-2 rounded-xl border transition-all ${filterStatus === 'updated' ? 'bg-green-500/20 border-green-500/50' : 'bg-zinc-900 border-zinc-800'}`}>
            <p className="text-lg font-black text-green-400">{stats.found}</p>
            <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">Found</p>
          </button>
          <button onClick={() => setFilterStatus('not_found')} className={`text-center p-2 rounded-xl border transition-all ${filterStatus === 'not_found' ? 'bg-red-500/20 border-red-500/50' : 'bg-zinc-900 border-zinc-800'}`}>
            <p className="text-lg font-black text-red-400">{stats.notFound}</p>
            <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">Not Found</p>
          </button>
          <button onClick={() => setFilterStatus('already_processed')} className={`text-center p-2 rounded-xl border transition-all ${filterStatus === 'already_processed' ? 'bg-blue-500/20 border-blue-500/50' : 'bg-zinc-900 border-zinc-800'}`}>
            <p className="text-lg font-black text-blue-400">{stats.duplicates}</p>
            <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">Dupes</p>
          </button>
        </div>

        {/* Search Bar - searches through already loaded scans */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search scanned packages by tracking or name..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {loading && allItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 gap-3 text-zinc-500">
            <RefreshCcw className="w-6 h-6 animate-spin" />
            <p className="text-sm font-medium">Loading history...</p>
          </div>
        ) : displayItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-zinc-500">
            <Package className="w-12 h-12 mb-3 opacity-20" />
            {searchQuery || filterStatus !== 'all' ? (
              <>
                <p className="text-base font-medium text-white mb-1">No matching packages</p>
                <p className="text-sm">Try a different search or filter.</p>
              </>
            ) : (
              <>
                <p className="text-base font-medium text-white mb-1">No packages scanned yet</p>
                <p className="text-sm">Scanned packages will appear here.</p>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {displayItems.map((item: any, idx) => {
              const trackingNumber = item.trackingNumber || item.tracking_number;
              const customerName = item.customerName || item.customer_name;
              const status = item.status;
              const message = item.message;
              const timestamp = item.timestamp || item.updated_at;
              
              let bgColor = "bg-blue-500/10";
              let iconColor = "text-blue-500";
              let badgeColor = "text-blue-400 bg-blue-400/10";
              let badgeText = "SCANNED";

              if (status === 'updated') {
                bgColor = "bg-green-500/10"; iconColor = "text-green-500"; badgeColor = "text-green-400 bg-green-400/10"; badgeText = "FOUND";
              } else if (status === 'already_processed') {
                bgColor = "bg-blue-500/10"; iconColor = "text-blue-500"; badgeColor = "text-blue-400 bg-blue-400/10"; badgeText = "DUPLICATE";
              } else if (status === 'not_found' || status === 'error') {
                bgColor = "bg-red-500/10"; iconColor = "text-red-500"; badgeColor = "text-red-400 bg-red-400/10"; badgeText = "NOT FOUND";
              }

              return (
                <div key={item.id || idx} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex gap-4 items-start shadow-sm">
                  <div className={`w-10 h-10 rounded-full ${bgColor} flex items-center justify-center shrink-0`}>
                    <Package className={`w-5 h-5 ${iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <div className="min-w-0 flex-1 pr-2">
                        <p className="font-bold text-white text-lg truncate">{customerName || 'Unknown Customer'}</p>
                        <h3 className="font-mono text-sm text-zinc-400 truncate">{trackingNumber}</h3>
                      </div>
                      <span className="text-[10px] text-zinc-500 flex items-center gap-1 whitespace-nowrap">
                        <Clock className="w-3 h-3" />
                        {timestamp ? formatDistanceToNow(new Date(timestamp), { addSuffix: true }) : 'Just now'}
                      </span>
                    </div>
                    <div className="flex justify-between items-end gap-2 mt-2">
                      <p className={`text-xs truncate ${status === 'not_found' || status === 'error' ? 'text-red-400' : 'text-zinc-500'}`}>{message}</p>
                      <span className={`text-[10px] uppercase tracking-wider font-bold shrink-0 px-2 py-1 rounded ${badgeColor}`}>
                        {badgeText}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
