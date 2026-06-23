'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Command, Loader2, User, Package, Ship } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

export default function CommandBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const search = async () => {
      setIsSearching(true);
      const supabase = createClient();
      
      // In a real implementation, you'd want an RPC or a dedicated search view
      // This is a basic demonstration of searching across customers.
      // We will search by customer unique_id, full_name, email, or phone.
      const { data, error } = await supabase
        .from('customers')
        .select('id, full_name, email, phone, unique_id')
        .or(`full_name.ilike.%${query}%,email.ilike.%${query}%,phone.ilike.%${query}%,unique_id.ilike.%${query}%`)
        .limit(5);

      if (!error && data) {
        setResults(data);
      }
      setIsSearching(false);
    };

    const debounce = setTimeout(search, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const handleSelect = (customerId: string) => {
    setIsOpen(false);
    setQuery('');
    router.push(`/agent/customers/${customerId}`);
  };

  return (
    <>
      <div 
        className="flex-1 max-w-2xl hidden md:flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-300 transition-colors cursor-text"
        onClick={() => setIsOpen(true)}
      >
        <Search className="w-4 h-4" />
        <span className="text-sm flex-1 text-left">Search anything... (Customers, Orders, Tracking)</span>
        <div className="flex items-center gap-1 text-[10px] font-mono bg-zinc-950 px-2 py-1 rounded">
          <Command className="w-3 h-3" /> K
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4 sm:px-0">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          <div className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 shadow-2xl rounded-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 px-4 py-4 border-b border-zinc-800">
              <Search className="w-5 h-5 text-zinc-500" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, ID (C2G-...), phone, or tracking..."
                className="flex-1 bg-transparent text-lg text-white placeholder-zinc-500 outline-none"
              />
              {isSearching && <Loader2 className="w-5 h-5 text-indigo-500 animate-spin" />}
            </div>

            <div className="max-h-[60vh] overflow-y-auto">
              {!query && (
                <div className="p-8 text-center text-zinc-500 text-sm">
                  <p>Type to search across the entire platform.</p>
                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    <span className="px-2 py-1 bg-zinc-800 rounded text-xs">C2G-000123</span>
                    <span className="px-2 py-1 bg-zinc-800 rounded text-xs">024xxxxxxx</span>
                    <span className="px-2 py-1 bg-zinc-800 rounded text-xs">john@gmail.com</span>
                    <span className="px-2 py-1 bg-zinc-800 rounded text-xs">TRK-7829</span>
                  </div>
                </div>
              )}

              {query && results.length === 0 && !isSearching && (
                <div className="p-8 text-center text-zinc-500 text-sm">
                  No results found for "{query}"
                </div>
              )}

              {results.length > 0 && (
                <div className="p-2">
                  <div className="px-3 py-2 text-xs font-bold uppercase tracking-widest text-zinc-500">Customers</div>
                  {results.map((customer) => (
                    <button
                      key={customer.id}
                      onClick={() => handleSelect(customer.id)}
                      className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-indigo-500/10 hover:text-indigo-400 group transition-colors text-left"
                    >
                      <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-indigo-400 group-hover:bg-indigo-500/20">
                        <User className="w-5 h-5" />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white group-hover:text-indigo-400">{customer.full_name}</span>
                          <span className="text-xs font-mono text-zinc-500">{customer.unique_id}</span>
                        </div>
                        <div className="text-xs text-zinc-500 truncate mt-0.5">
                          {customer.email} • {customer.phone}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <div className="p-3 bg-zinc-950 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-500">
              <div className="flex gap-4">
                <span><kbd className="font-mono bg-zinc-800 px-1 rounded text-[10px]">↑↓</kbd> to navigate</span>
                <span><kbd className="font-mono bg-zinc-800 px-1 rounded text-[10px]">enter</kbd> to select</span>
              </div>
              <span><kbd className="font-mono bg-zinc-800 px-1 rounded text-[10px]">esc</kbd> to close</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
