'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Command, Loader2, User, Package, Ship, ShoppingCart, Truck } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

interface SearchResult {
  id: string;
  type: 'customer' | 'shipment' | 'link_order' | 'mall_order' | 'reservation';
  title: string;
  subtitle: string;
  icon: any;
  route: string;
}

export default function CommandBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
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
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }

    const search = async () => {
      setIsSearching(true);
      const supabase = createClient();
      
      const q = `%${query}%`;
      
      const isNum = !isNaN(Number(query)) && query.trim() !== '';
      const orderQuery = isNum 
        ? `id.eq.${query},product_name.ilike.${q},notes.ilike.${q}`
        : `product_name.ilike.${q},notes.ilike.${q}`;

      const [customers, shipments, linkOrders, mallOrders, reservations] = await Promise.all([
        supabase.from('customers').select('id, full_name, email, phone, unique_id').or(`full_name.ilike.${q},email.ilike.${q},phone.ilike.${q},unique_id.ilike.${q}`).limit(5),
        supabase.from('shipments').select('id, tracking_number, items_description').or(`tracking_number.ilike.${q},items_description.ilike.${q}`).limit(5),
        supabase.from('orders').select('id, product_name, notes').eq('type', 'link_order').or(orderQuery).limit(5),
        supabase.from('ecom_orders').select('id, order_id, customer_name').or(`order_id.ilike.${q},customer_name.ilike.${q}`).limit(5),
        supabase.from('shipment_reservations').select('id').or(`id.ilike.${q}`).limit(5)
      ]);

      if (customers.error) console.error("Customers Search Error:", customers.error);
      if (shipments.error) console.error("Shipments Search Error:", shipments.error);
      if (linkOrders.error) console.error("Link Orders Search Error:", linkOrders.error);
      if (mallOrders.error) console.error("Mall Orders Search Error:", mallOrders.error);
      if (reservations.error) console.error("Reservations Search Error:", reservations.error);

      const formattedResults: SearchResult[] = [];

      if (customers.data) {
        customers.data.forEach(c => formattedResults.push({
          id: c.id, type: 'customer', title: c.full_name, subtitle: `${c.unique_id} • ${c.phone}`, icon: User, route: `/agent/customers/${c.id}`
        }));
      }
      if (shipments.data) {
        shipments.data.forEach(s => formattedResults.push({
          id: s.id, type: 'shipment', title: s.tracking_number, subtitle: s.items_description || 'Shipment', icon: Ship, route: `/agent/shipments?search=${s.tracking_number}`
        }));
      }
      if (linkOrders.data) {
        linkOrders.data.forEach(o => formattedResults.push({
          id: o.id, type: 'link_order', title: `LNK-${o.id.substring(0,8).toUpperCase()}`, subtitle: o.product_name || 'Link Order', icon: Package, route: `/agent/global-orders/link-orders?search=${o.id}`
        }));
      }
      if (mallOrders.data) {
        mallOrders.data.forEach(m => formattedResults.push({
          id: m.id, type: 'mall_order', title: m.order_id || `MALL-${m.id.substring(0,8).toUpperCase()}`, subtitle: m.customer_name || 'Mall Order', icon: ShoppingCart, route: `/agent/global-orders/mall-orders?search=${m.id}`
        }));
      }
      if (reservations.data) {
        reservations.data.forEach(r => formattedResults.push({
          id: r.id, type: 'reservation', title: `RES-${r.id.substring(0,8).toUpperCase()}`, subtitle: 'Shipment Reservation', icon: Truck, route: `/agent/reservations?search=${r.id}`
        }));
      }

      setResults(formattedResults);
      setIsSearching(false);
    };

    const debounce = setTimeout(search, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const handleSelect = (route: string) => {
    setIsOpen(false);
    setQuery('');
    router.push(route);
  };

  const groupedResults = results.reduce((acc, curr) => {
    if (!acc[curr.type]) acc[curr.type] = [];
    acc[curr.type].push(curr);
    return acc;
  }, {} as Record<string, SearchResult[]>);

  const typeLabels = {
    customer: 'Customers',
    shipment: 'Shipments',
    link_order: 'Link Orders',
    mall_order: 'Mall Orders',
    reservation: 'Reservations'
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
                placeholder="Search by name, ID, phone, tracking number..."
                className="flex-1 bg-transparent text-lg text-white placeholder-zinc-500 outline-none"
              />
              {isSearching && <Loader2 className="w-5 h-5 text-indigo-500 animate-spin" />}
            </div>

            <div className="max-h-[60vh] overflow-y-auto">
              {!query && (
                <div className="p-8 text-center text-zinc-500 text-sm">
                  <p>Type to search across the entire platform.</p>
                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    <span className="px-2 py-1 bg-zinc-800 rounded text-xs cursor-pointer hover:text-white transition-colors" onClick={() => setQuery('C2G-')}>C2G-</span>
                    <span className="px-2 py-1 bg-zinc-800 rounded text-xs cursor-pointer hover:text-white transition-colors" onClick={() => setQuery('TRK-')}>TRK-</span>
                  </div>
                </div>
              )}

              {query && results.length === 0 && !isSearching && (
                <div className="p-8 text-center text-zinc-500 text-sm">
                  No results found for "{query}"
                </div>
              )}

              {results.length > 0 && (
                <div className="p-2 space-y-4">
                  {Object.entries(groupedResults).map(([type, items]) => (
                    <div key={type}>
                      <div className="px-3 py-2 text-xs font-bold uppercase tracking-widest text-zinc-500">
                        {(typeLabels as any)[type] || type}
                      </div>
                      {items.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => handleSelect(item.route)}
                          className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-indigo-500/10 hover:text-indigo-400 group transition-colors text-left"
                        >
                          <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-indigo-400 group-hover:bg-indigo-500/20 shrink-0">
                            <item.icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-white group-hover:text-indigo-400 truncate">{item.title}</span>
                            </div>
                            <div className="text-xs text-zinc-500 truncate mt-0.5">
                              {item.subtitle}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
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
