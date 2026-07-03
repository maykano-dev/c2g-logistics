'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Loader2, User, Box, Truck, CreditCard, ChevronRight } from 'lucide-react';
import { searchOmni } from '@/app/admin/omni-search-actions';
import { useRouter } from 'next/navigation';

export default function OmniSearchBar({ onSelectCustomer }: { onSelectCustomer?: (id: string) => void }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.length >= 2) {
        setLoading(true);
        const res = await searchOmni(query);
        if (res.success) {
          setResults(res.results || []);
          setIsOpen(true);
        }
        setLoading(false);
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleSelect = (item: any) => {
    setIsOpen(false);
    setQuery('');
    
    if (item.type === 'customer' && onSelectCustomer) {
      onSelectCustomer(item.id);
    } else if (item.type === 'order') {
      if (item.orderType === 'link_order') {
        router.push(`/admin/global-orders/link-orders?search=${item.id}`);
      } else {
        router.push(`/admin/global-orders/mall-orders?search=${item.id}`);
      }
    } else if (item.type === 'reservation') {
      router.push(`/admin/reservations?search=${item.id}`);
    } else if (item.type === 'wallet_transaction') {
      router.push(`/admin/finance?search=${item.id}`);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'customer': return <User className="w-4 h-4 text-indigo-400" />;
      case 'order': return <Box className="w-4 h-4 text-blue-400" />;
      case 'reservation': return <Truck className="w-4 h-4 text-emerald-400" />;
      case 'wallet_transaction': return <CreditCard className="w-4 h-4 text-purple-400" />;
      default: return <Search className="w-4 h-4 text-zinc-400" />;
    }
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-xl">
      <div className="relative">
        {loading ? (
          <Loader2 className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 animate-spin" />
        ) : (
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
        )}
        
        <input 
          type="text"
          placeholder="Omni-Search: Name, Email, Tracking #, Order ID..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => { if (results.length > 0) setIsOpen(true); }}
          className="w-full h-10 bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors shadow-inner"
        />
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-2 text-xs font-bold text-zinc-500 uppercase tracking-wider bg-zinc-950 border-b border-zinc-800">
            Search Results
          </div>
          <div className="max-h-[60vh] overflow-y-auto">
            {results.map((item, idx) => (
              <button
                key={`${item.type}-${item.id}-${idx}`}
                onClick={() => handleSelect(item)}
                className="w-full flex items-center gap-4 p-3 hover:bg-zinc-800 border-b border-zinc-800/50 last:border-0 transition-colors text-left group"
              >
                <div className="w-10 h-10 rounded-full bg-zinc-950 flex items-center justify-center shrink-0 border border-zinc-800 group-hover:border-indigo-500/50 transition-colors">
                  {getIcon(item.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-white truncate">{item.title}</p>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-zinc-800 text-zinc-400 border border-zinc-700 whitespace-nowrap">
                      {item.badge}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 truncate mt-0.5">{item.subtitle}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors" />
              </button>
            ))}
          </div>
        </div>
      )}

      {isOpen && query.length >= 2 && results.length === 0 && !loading && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl p-6 text-center z-50">
          <p className="text-zinc-400 text-sm">No results found for "{query}"</p>
          <p className="text-xs text-zinc-500 mt-1">Try a different tracking number or name.</p>
        </div>
      )}
    </div>
  );
}
