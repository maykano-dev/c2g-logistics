'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Search, Filter, Camera, CheckCircle2, XCircle, AlertCircle, PackageCheck, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { adminUpdateQCStatus } from '@/app/admin/qc-actions';
import { useModal } from "@/components/providers/modal-provider";

export default function QualityControlView() {
  const [inspections, setInspections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { showAlert, showConfirm } = useModal();

  useEffect(() => {
    fetchInspections();
  }, []);

  const fetchInspections = async () => {
    setLoading(true);
    const supabase = createClient();
    
    // Fallback mock data in case the table is empty or missing
    const mockData = [
      { id: '1', package_id: 'PKG-9021', tracking_number: 'YT1293847921', status: 'pending', notes: '', inspected_at: null, inspector: null },
      { id: '2', package_id: 'PKG-9022', tracking_number: 'SF8849201923', status: 'passed', notes: 'Item matches description. No damage.', inspected_at: new Date().toISOString(), inspector: 'QC-Chen' },
      { id: '3', package_id: 'PKG-9023', tracking_number: 'ZT9928371625', status: 'failed', notes: 'Wrong color (received Red, ordered Blue).', inspected_at: new Date(Date.now() - 3600000).toISOString(), inspector: 'QC-Lin' },
      { id: '4', package_id: 'PKG-9024', tracking_number: 'YT4458291029', status: 'replacement_requested', notes: 'Item broken in transit. Supplier contacted for replacement.', inspected_at: new Date(Date.now() - 7200000).toISOString(), inspector: 'QC-Wei' },
    ];

    try {
      const { data, error } = await supabase
        .from('qc_inspections')
        .select('*, incoming_packages(tracking_number, customer_name)')
        .order('inspected_at', { ascending: false });

      if (data && data.length > 0 && !error) {
        setInspections(data);
      } else {
        setInspections(mockData);
      }
    } catch (e) {
      setInspections(mockData);
    }
    
    setLoading(false);
  };

  const filtered = inspections.filter(i => 
    i.tracking_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.package_id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUpdateQC = async (id: string, newStatus: string) => {
    const confirmed = await showConfirm({
      title: 'Update QC Status',
      message: `Are you sure you want to mark this package as ${newStatus}?`,
      type: newStatus === 'passed' ? 'success' : 'danger',
      confirmText: `Yes, mark as ${newStatus}`
    });

    if (!confirmed) return;

    const res = await adminUpdateQCStatus(id, newStatus);
    if (res.success) {
      setInspections(prev => prev.map(i => i.id === id ? { ...i, status: newStatus, inspected_at: new Date().toISOString() } : i));
      showAlert({ title: 'Success', message: `Status updated to ${newStatus}`, type: 'success' });
    } else {
      showAlert({ title: 'Error', message: 'Action failed: ' + res.error, type: 'danger' });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto pb-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
            <PackageCheck className="w-6 h-6 text-indigo-500" /> Quality Control (China Warehouse)
          </h1>
          <p className="text-zinc-400 mt-1">Intercept wrong or damaged items before they are shipped to Ghana.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
          <p className="text-xs text-zinc-500 uppercase font-bold tracking-widest mb-1">Awaiting QC</p>
          <p className="text-3xl font-black text-white">{inspections.filter(i => i.status === 'pending').length}</p>
        </div>
        <div className="bg-zinc-900 border border-emerald-500/30 p-4 rounded-xl">
          <p className="text-xs text-emerald-500 uppercase font-bold tracking-widest mb-1">Passed Today</p>
          <p className="text-3xl font-black text-white">{inspections.filter(i => i.status === 'passed').length}</p>
        </div>
        <div className="bg-zinc-900 border border-red-500/30 p-4 rounded-xl">
          <p className="text-xs text-red-500 uppercase font-bold tracking-widest mb-1">Failed / Intercepted</p>
          <p className="text-3xl font-black text-white">{inspections.filter(i => i.status === 'failed').length}</p>
        </div>
        <div className="bg-zinc-900 border border-amber-500/30 p-4 rounded-xl">
          <p className="text-xs text-amber-500 uppercase font-bold tracking-widest mb-1">Replacements</p>
          <p className="text-3xl font-black text-white">{inspections.filter(i => i.status === 'replacement_requested').length}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-zinc-900 border border-zinc-800 rounded-2xl">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input 
            type="text"
            placeholder="Scan or search tracking number..."
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
                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Tracking / ID</th>
                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">QC Status</th>
                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Inspector Notes</th>
                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Photos</th>
                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {loading ? (
                <tr><td colSpan={5} className="p-8 text-center text-zinc-500">Loading QC queue...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-zinc-500">No packages in queue.</td></tr>
              ) : (
                filtered.map(item => (
                  <tr key={item.id} className="hover:bg-zinc-800/50 transition-colors">
                    <td className="p-4">
                      <p className="text-sm font-mono font-medium text-white">{item.tracking_number}</p>
                      <p className="text-[10px] text-zinc-500">{item.package_id}</p>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded flex items-center gap-1 w-fit text-[10px] font-bold uppercase tracking-wider ${
                        item.status === 'passed' ? 'bg-emerald-500/10 text-emerald-500' :
                        item.status === 'failed' ? 'bg-red-500/10 text-red-500' :
                        item.status === 'replacement_requested' ? 'bg-amber-500/10 text-amber-500' :
                        'bg-zinc-800 text-zinc-400'
                      }`}>
                        {item.status === 'passed' && <CheckCircle2 className="w-3 h-3" />}
                        {item.status === 'failed' && <XCircle className="w-3 h-3" />}
                        {item.status === 'replacement_requested' && <AlertTriangle className="w-3 h-3" />}
                        {item.status === 'pending' && <AlertCircle className="w-3 h-3" />}
                        {item.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-4">
                      {item.notes ? (
                        <p className="text-xs text-zinc-300 max-w-xs">{item.notes}</p>
                      ) : (
                        <p className="text-xs text-zinc-600 italic">No notes added.</p>
                      )}
                      {item.inspected_at && <p className="text-[10px] text-zinc-500 mt-1">By {item.inspector || 'System'} at {format(new Date(item.inspected_at), 'HH:mm')}</p>}
                    </td>
                    <td className="p-4">
                      <button className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded hover:bg-indigo-500/20 transition-colors">
                        <Camera className="w-3 h-3" /> {item.status === 'pending' ? 'Add Photo' : 'View (2)'}
                      </button>
                    </td>
                    <td className="p-4 text-right">
                      {item.status === 'pending' ? (
                         <div className="flex items-center justify-end gap-2">
                           <button onClick={() => handleUpdateQC(item.id, 'passed')} className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-colors">Pass</button>
                           <button onClick={() => handleUpdateQC(item.id, 'failed')} className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-lg transition-colors">Fail</button>
                         </div>
                      ) : (
                        <button className="text-xs font-bold text-zinc-400 hover:text-white transition-colors">Edit Decision</button>
                      )}
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
            <div className="p-8 text-center text-zinc-500">Loading QC queue...</div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-zinc-500">No packages in queue.</div>
          ) : (
            filtered.map(item => (
              <div key={item.id} className="p-4 flex flex-col gap-4 hover:bg-zinc-800/20 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-mono font-medium text-white">{item.tracking_number}</p>
                    <p className="text-xs text-zinc-500">{item.package_id}</p>
                  </div>
                  <div>
                    <span className={`px-2 py-1 rounded flex items-center gap-1 w-fit text-[10px] font-bold uppercase tracking-wider ${
                      item.status === 'passed' ? 'bg-emerald-500/10 text-emerald-500' :
                      item.status === 'failed' ? 'bg-red-500/10 text-red-500' :
                      item.status === 'replacement_requested' ? 'bg-amber-500/10 text-amber-500' :
                      'bg-zinc-800 text-zinc-400'
                    }`}>
                      {item.status === 'passed' && <CheckCircle2 className="w-3 h-3" />}
                      {item.status === 'failed' && <XCircle className="w-3 h-3" />}
                      {item.status === 'replacement_requested' && <AlertTriangle className="w-3 h-3" />}
                      {item.status === 'pending' && <AlertCircle className="w-3 h-3" />}
                      {item.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800/50">
                  {item.notes ? (
                    <p className="text-xs text-zinc-300">{item.notes}</p>
                  ) : (
                    <p className="text-xs text-zinc-600 italic">No notes added.</p>
                  )}
                  {item.inspected_at && <p className="text-[10px] text-zinc-500 mt-2">By {item.inspector || 'System'} at {format(new Date(item.inspected_at), 'HH:mm')}</p>}
                </div>

                <div className="flex items-center justify-between">
                  <button className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded hover:bg-indigo-500/20 transition-colors">
                    <Camera className="w-3 h-3" /> {item.status === 'pending' ? 'Add Photo' : 'View (2)'}
                  </button>
                  <div>
                    {item.status === 'pending' ? (
                       <div className="flex items-center gap-2">
                         <button onClick={() => handleUpdateQC(item.id, 'passed')} className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-colors">Pass</button>
                         <button onClick={() => handleUpdateQC(item.id, 'failed')} className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-lg transition-colors">Fail</button>
                       </div>
                    ) : (
                      <button className="text-xs font-bold text-zinc-400 hover:text-white transition-colors">Edit</button>
                    )}
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
