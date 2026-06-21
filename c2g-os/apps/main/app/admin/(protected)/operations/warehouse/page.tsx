'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Search, Filter, Box, Barcode, Eye, Edit } from 'lucide-react';
import { format } from 'date-fns';

export default function AdminPackagesView() {
  const [activeTab, setActiveTab] = useState<'incoming' | 'scanned' | 'unmatched'>('unmatched');
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPackages();
  }, [activeTab]);

  const fetchPackages = async () => {
    setLoading(true);
    const supabase = createClient();
    
    if (activeTab === 'incoming') {
      const { data, error } = await supabase
        .from('incoming_packages')
        .select('*, customers(name, phone)')
        .order('created_at', { ascending: false });
      if (data && !error) setPackages(data);
    } else if (activeTab === 'scanned') {
      const { data, error } = await supabase
        .from('scan_logs')
        .select('*')
        .order('scanned_at', { ascending: false });
      if (data && !error) setPackages(data);
    } else if (activeTab === 'unmatched') {
      const { data, error } = await supabase
        .from('unmatched_packages')
        .select('*')
        .order('created_at', { ascending: false });
      if (data && !error) setPackages(data);
    }
    
    setLoading(false);
  };

  const filteredPackages = packages.filter(p => {
    if (activeTab === 'incoming') {
      return p.tracking_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
             p.customers?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    } else if (activeTab === 'scanned') {
      return p.scanned_tracking?.toLowerCase().includes(searchTerm.toLowerCase()) ||
             p.customer_name?.toLowerCase().includes(searchTerm.toLowerCase());
    } else {
      return p.tracking_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
             p.notes?.toLowerCase().includes(searchTerm.toLowerCase());
    }
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Packages Hub</h1>
          <p className="text-zinc-400">Manage incoming and warehouse-scanned packages.</p>
        </div>
      </div>

      <div className="flex bg-zinc-900 border border-zinc-800 rounded-xl p-1 w-fit">
        <button 
          onClick={() => setActiveTab('incoming')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === 'incoming' ? 'bg-indigo-600 text-white shadow' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}
        >
          <Box className="w-4 h-4" /> Expected
        </button>
        <button 
          onClick={() => setActiveTab('scanned')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === 'scanned' ? 'bg-indigo-600 text-white shadow' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}
        >
          <Barcode className="w-4 h-4" /> Scanned
        </button>
        <button 
          onClick={() => setActiveTab('unmatched')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === 'unmatched' ? 'bg-red-600 text-white shadow' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}
        >
          <Box className="w-4 h-4" /> Unmatched Queue
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-zinc-900 border border-zinc-800 rounded-2xl">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input 
            type="text"
            placeholder="Search by tracking number, customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
        <button className="px-4 h-10 border border-zinc-800 bg-zinc-950 text-white rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-zinc-800 transition-colors shrink-0">
          <Filter className="w-4 h-4" /> Filters
        </button>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto hidden md:block">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-950/50">
                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Tracking Number</th>
                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  {activeTab === 'unmatched' ? 'Weight / CBM' : 'Customer'}
                </th>
                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  {activeTab === 'unmatched' ? 'Notes / Status' : 'Courier / Result'}
                </th>
                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  {activeTab === 'incoming' ? 'Expected At' : (activeTab === 'scanned' ? 'Scanned At' : 'Arrival Date')}
                </th>
                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {loading ? (
                <tr><td colSpan={5} className="p-8 text-center text-zinc-500">Loading packages...</td></tr>
              ) : filteredPackages.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-zinc-500">No packages found for this tab.</td></tr>
              ) : (
                filteredPackages.map(pkg => (
                  <tr key={pkg.id} className="hover:bg-zinc-800/50 transition-colors group">
                    <td className="p-4">
                      <p className="text-sm text-white font-mono font-medium">
                        {activeTab === 'incoming' ? pkg.tracking_number : (activeTab === 'scanned' ? pkg.scanned_tracking : pkg.tracking_number)}
                      </p>
                    </td>
                    <td className="p-4">
                      {activeTab === 'unmatched' ? (
                        <>
                          <p className="text-sm text-zinc-200">{pkg.weight ? `${pkg.weight} kg` : 'N/A weight'}</p>
                          <p className="text-[10px] text-zinc-500">{pkg.cbm ? `${pkg.cbm} CBM` : 'N/A CBM'}</p>
                        </>
                      ) : (
                        <>
                          <p className="text-sm text-zinc-200">{activeTab === 'incoming' ? pkg.customers?.name : pkg.customer_name || 'Unknown'}</p>
                          {activeTab === 'incoming' && (
                            <p className="text-[10px] text-zinc-500">{pkg.customers?.phone || pkg.customer_id}</p>
                          )}
                        </>
                      )}
                    </td>
                    <td className="p-4 text-sm text-zinc-300">
                      {activeTab === 'incoming' ? (pkg.status || 'N/A') : 
                       (activeTab === 'scanned' ? (pkg.scan_result === 'success' ? 'Added to DB' : pkg.scan_result || 'N/A') :
                       (
                         <div>
                           <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold ${pkg.status === 'pending' ? 'bg-red-500/10 text-red-500' : 'bg-zinc-500/10 text-zinc-500'}`}>{pkg.status}</span>
                           {pkg.notes && <p className="text-[10px] text-zinc-400 mt-1 truncate max-w-[150px]">{pkg.notes}</p>}
                         </div>
                       ))}
                    </td>
                    <td className="p-4 text-sm text-zinc-300">
                      {activeTab === 'incoming' ? 
                        (pkg.created_at ? format(new Date(pkg.created_at), 'MMM dd, yyyy') : 'Unknown') :
                        (activeTab === 'scanned' ? 
                          (pkg.scanned_at ? format(new Date(pkg.scanned_at), 'MMM dd, yyyy HH:mm') : 'Unknown') :
                          (pkg.arrival_date ? format(new Date(pkg.arrival_date), 'MMM dd, yyyy HH:mm') : 'Unknown')
                        )
                      }
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-indigo-400 hover:text-white hover:bg-indigo-500/20 rounded-lg transition-colors">
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

        {/* Mobile Card Layout */}
        <div className="md:hidden flex flex-col divide-y divide-zinc-800">
          {loading ? (
            <div className="p-8 text-center text-zinc-500">Loading packages...</div>
          ) : filteredPackages.length === 0 ? (
            <div className="p-8 text-center text-zinc-500">No packages found for this tab.</div>
          ) : (
            filteredPackages.map(pkg => (
              <div key={pkg.id} className="p-4 flex flex-col gap-4 hover:bg-zinc-800/20 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm text-white font-mono font-medium">
                      {activeTab === 'incoming' ? pkg.tracking_number : (activeTab === 'scanned' ? pkg.scanned_tracking : pkg.tracking_number)}
                    </p>
                    {activeTab !== 'unmatched' && (
                      <p className="text-xs text-zinc-500">{activeTab === 'incoming' ? pkg.customers?.name : pkg.customer_name || 'Unknown'}</p>
                    )}
                  </div>
                  <div>
                    {activeTab === 'unmatched' ? (
                      <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold ${pkg.status === 'pending' ? 'bg-red-500/10 text-red-500' : 'bg-zinc-500/10 text-zinc-500'}`}>{pkg.status}</span>
                    ) : (
                      <span className="px-2 py-1 rounded text-[10px] uppercase font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        {activeTab === 'incoming' ? (pkg.status || 'Expected') : (pkg.scan_result === 'success' ? 'Added' : pkg.scan_result || 'Scanned')}
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 bg-zinc-950 p-3 rounded-xl border border-zinc-800/50 text-xs">
                  {activeTab === 'unmatched' ? (
                    <>
                      <div><span className="text-zinc-500">Weight:</span> <span className="text-zinc-300 ml-1">{pkg.weight ? `${pkg.weight} kg` : 'N/A'}</span></div>
                      <div><span className="text-zinc-500">CBM:</span> <span className="text-zinc-300 ml-1">{pkg.cbm ? `${pkg.cbm} CBM` : 'N/A'}</span></div>
                      {pkg.notes && <div className="col-span-2 text-zinc-400 mt-1">{pkg.notes}</div>}
                    </>
                  ) : (
                    <>
                      <div className="col-span-2"><span className="text-zinc-500">Contact:</span> <span className="text-zinc-300 ml-1">{activeTab === 'incoming' ? pkg.customers?.phone || pkg.customer_id : pkg.customer_id}</span></div>
                    </>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-[10px] text-zinc-600">
                    {activeTab === 'incoming' ? 
                      (pkg.created_at ? format(new Date(pkg.created_at), 'MMM dd, yyyy') : 'Unknown') :
                      (activeTab === 'scanned' ? 
                        (pkg.scanned_at ? format(new Date(pkg.scanned_at), 'MMM dd, yyyy HH:mm') : 'Unknown') :
                        (pkg.arrival_date ? format(new Date(pkg.arrival_date), 'MMM dd, yyyy HH:mm') : 'Unknown')
                      )
                    }
                  </p>
                  <div className="flex items-center gap-2">
                    <button className="p-2 bg-zinc-800/50 text-zinc-400 hover:text-white rounded-xl transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-xl transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
