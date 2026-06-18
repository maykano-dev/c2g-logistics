'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Search, Plus, Filter, Edit, Eye, Plane, Ship, Zap } from 'lucide-react';
import { format } from 'date-fns';

export default function AdminShipmentsView() {
  const [shipments, setShipments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchShipments();
  }, []);

  const fetchShipments = async () => {
    setLoading(true);
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('shipments')
      .select('*')
      .order('created_at', { ascending: false });

    if (data && !error) {
      setShipments(data);
    } else {
      console.error('Error fetching shipments', error);
    }
    setLoading(false);
  };

  const getModeBadge = (mode: string) => {
    const m = mode?.toLowerCase() || '';
    if (m.includes('express')) return <span className="px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-orange-500/10 text-orange-500 border border-orange-500/20 flex items-center gap-1 w-fit"><Zap className="w-3 h-3"/> Express</span>;
    if (m.includes('sea')) return <span className="px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center gap-1 w-fit"><Ship className="w-3 h-3"/> Sea</span>;
    return <span className="px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-500 border border-blue-500/20 flex items-center gap-1 w-fit"><Plane className="w-3 h-3"/> Normal Air</span>;
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'in transit': return <span className="px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-500 border border-blue-500/20">In Transit</span>;
      case 'arrived': return <span className="px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">Arrived</span>;
      case 'pending': return <span className="px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">Pending</span>;
      default: return <span className="px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-zinc-500/10 text-zinc-500 border border-zinc-500/20">{status || 'Unknown'}</span>;
    }
  };

  const filteredShipments = shipments.filter(s => 
    s.tracking_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.container_id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Shipments</h1>
          <p className="text-zinc-400">Manage global containers and tracking events.</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors w-fit">
          <Plus className="w-4 h-4" /> Create Shipment
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-zinc-900 border border-zinc-800 rounded-2xl">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input 
            type="text"
            placeholder="Search by Container ID or Tracking Number..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full h-10 bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
        <button className="px-4 h-10 border border-zinc-800 bg-zinc-950 text-white rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-zinc-800 transition-colors shrink-0">
          <Filter className="w-4 h-4" /> Filters
        </button>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-950/50">
                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Container ID</th>
                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Mode</th>
                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Departure</th>
                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Location</th>
                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {loading ? (
                <tr><td colSpan={6} className="p-8 text-center text-zinc-500">Loading shipments...</td></tr>
              ) : filteredShipments.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-zinc-500">No shipments found.</td></tr>
              ) : (
                filteredShipments.map(shipment => (
                  <tr key={shipment.id} className="hover:bg-zinc-800/50 transition-colors group">
                    <td className="p-4">
                      <p className="text-sm text-white font-mono font-medium">{shipment.container_id || 'N/A'}</p>
                      <p className="text-[10px] text-zinc-500 mt-1">{shipment.tracking_number}</p>
                    </td>
                    <td className="p-4">
                      {getModeBadge(shipment.shipping_mode)}
                    </td>
                    <td className="p-4">
                      {getStatusBadge(shipment.status)}
                    </td>
                    <td className="p-4 text-sm text-zinc-300">
                      {shipment.departure_date ? format(new Date(shipment.departure_date), 'MMM dd, yyyy') : 'Pending'}
                    </td>
                    <td className="p-4 text-sm text-zinc-400">
                      {shipment.current_location || 'Not updated'}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors" title="View Details">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-indigo-400 hover:text-white hover:bg-indigo-500/20 rounded-lg transition-colors" title="Edit Shipment">
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
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
