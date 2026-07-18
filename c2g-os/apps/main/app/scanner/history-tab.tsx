"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Search, Package, Clock, RefreshCcw } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

import { ScanLog } from './scanner-client';

import { ScanLog } from './scanner-client';

export default function HistoryTab({ sessionHistory }: { sessionHistory: ScanLog[] }) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const supabase = createClient();

  const fetchGlobalHistory = async (query: string = '') => {
    setLoading(true);
    try {
      let queryBuilder = supabase
        .from('scan_logs')
        .select('id, scanned_tracking, scan_result, customer_name, current_status, scanned_at')
        .order('scanned_at', { ascending: false })
        .limit(50);

      if (query.trim()) {
        queryBuilder = queryBuilder.ilike('scanned_tracking', `%${query}%`);
      }

      const { data, error } = await queryBuilder;

      if (error) throw error;

      const formatted = (data || []).map((s: any) => {
        let message = '';
        if (s.scan_result === 'updated') message = 'Package marked as IN WAREHOUSE';
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
    fetchGlobalHistory('');
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchGlobalHistory(searchQuery);
  };

  // Merge session history with global items, avoiding duplicates
  const displayItems = [...sessionHistory];
  const sessionTrackingNumbers = new Set(sessionHistory.map(h => h.trackingNumber));
  
  items.forEach(item => {
    if (!sessionTrackingNumbers.has(item.tracking_number)) {
      displayItems.push(item);
    }
  });

  return (
    <div className="h-full w-full bg-zinc-950 flex flex-col pt-safe">
      <div className="p-4 border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-xl shrink-0 z-10">
        <h2 className="text-xl font-bold text-white mb-4">Scan History</h2>
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => {
               setSearchQuery(e.target.value);
               if (!e.target.value.trim()) fetchGlobalHistory('');
            }}
            placeholder="Search tracking number globally..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          />
        </form>
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {loading && displayItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 gap-3 text-zinc-500">
            <RefreshCcw className="w-6 h-6 animate-spin" />
            <p className="text-sm font-medium">Loading history...</p>
          </div>
        ) : displayItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-zinc-500">
            <Package className="w-12 h-12 mb-3 opacity-20" />
            <p className="text-base font-medium text-white mb-1">No packages found globally</p>
            <p className="text-sm">Try a different tracking number.</p>
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
                bgColor = "bg-green-500/10"; iconColor = "text-green-500"; badgeColor = "text-green-400 bg-green-400/10"; badgeText = "UPDATED";
              } else if (status === 'already_processed') {
                bgColor = "bg-blue-500/10"; iconColor = "text-blue-500"; badgeColor = "text-blue-400 bg-blue-400/10"; badgeText = "DUPLICATE";
              } else if (status === 'not_found' || status === 'error') {
                bgColor = "bg-red-500/10"; iconColor = "text-red-500"; badgeColor = "text-red-400 bg-red-400/10"; badgeText = "FAILED";
              }

              return (
                <div key={item.id || idx} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex gap-4 items-start shadow-sm">
                  <div className={`w-10 h-10 rounded-full ${bgColor} flex items-center justify-center shrink-0`}>
                    <Package className={`w-5 h-5 ${iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-white font-mono truncate pr-2">{trackingNumber}</h3>
                      <span className="text-[10px] text-zinc-500 flex items-center gap-1 whitespace-nowrap">
                        <Clock className="w-3 h-3" />
                        {timestamp ? formatDistanceToNow(new Date(timestamp), { addSuffix: true }) : 'Just now'}
                      </span>
                    </div>
                    <div className="flex justify-between items-end gap-2">
                      <div className="min-w-0">
                        <p className="text-sm text-zinc-400 truncate">{customerName || 'Unknown Customer'}</p>
                        <p className={`text-xs mt-0.5 truncate ${status === 'not_found' || status === 'error' ? 'text-red-400' : 'text-zinc-500'}`}>{message}</p>
                      </div>
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
