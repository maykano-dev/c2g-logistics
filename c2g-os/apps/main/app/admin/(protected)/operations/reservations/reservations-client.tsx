'use client';

import { useState, useEffect, useTransition } from 'react';
import { Search, Plus, Filter, Edit, Save, Plane, Ship, Zap, ChevronDown, CheckSquare, Square, Copy, X, Eye, Package, Link as LinkIcon, ShoppingBag } from 'lucide-react';
import { format } from 'date-fns';
import { updateReservationStatus, bulkUpdateReservationStatus, updateAdminReservation, getReservationItems } from './actions';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

// Constants for Dropdowns
const STATUS_OPTIONS = [
  'In Warehouse',
  'In Transit',
  'Arrived Ghana',
  'Clearance',
  'Available for pickup',
  'Delivered',
  'Completed',
  'Cancelled'
];

export default function ReservationsClient({ readOnly = false }: { readOnly?: boolean }) {
  const router = useRouter();
  
  const [initialReservations, setInitialReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All Statuses');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  
  // Selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  
  // Modals
  const [showEditModal, setShowEditModal] = useState<any>(null); // holds reservation data
  const [showItemsModal, setShowItemsModal] = useState<any>(null); // holds reservation data
  const [reservationItems, setReservationItems] = useState<any>({ packages: [], linkOrders: [], mallOrders: [] });
  const [loadingItems, setLoadingItems] = useState(false);
  
  // Pending transition for Server Actions
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    setLoading(true);
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('shipment_reservations')
      .select(`
        *,
        customers (
          name,
          email,
          phone
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching admin reservations:', error);
    } else if (data) {
      setInitialReservations(data);
    }
    
    setLoading(false);
  };

  // Status Styling Logic
  const getStatusColorClass = (status: string) => {
    const s = status?.toLowerCase() || '';
    if (s.includes('delivered') || s.includes('completed')) return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30';
    if (s.includes('cancelled')) return 'bg-red-500/10 text-red-500 border-red-500/30';
    if (s.includes('warehouse')) return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
    if (s.includes('transit')) return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
    if (s.includes('pickup') || s.includes('arrived')) return 'bg-teal-500/10 text-teal-400 border-teal-500/30';
    if (s.includes('clearance')) return 'bg-yellow-600/10 text-yellow-500 border-yellow-600/30';
    return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30'; // pending/awaiting
  };

  const formatItemStatus = (status: string) => {
    if (!status) return '';
    return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  // Handlers
  const handleStatusChange = (id: string, newStatus: string) => {
    startTransition(async () => {
      await updateReservationStatus(id, newStatus);
      router.refresh();
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = new Set(filteredReservations.map(s => s.id));
      setSelectedIds(allIds);
    } else {
      setSelectedIds(new Set());
    }
  };

  const toggleSelection = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const handleBulkStatusUpdate = (newStatus: string) => {
    if (selectedIds.size === 0) return;
    const ids = Array.from(selectedIds);
    startTransition(async () => {
      await bulkUpdateReservationStatus(ids, newStatus);
      setSelectedIds(new Set()); // clear selection
      router.refresh();
    });
  };

  const handleCopyIds = () => {
    const ids = Array.from(selectedIds).join('\n');
    navigator.clipboard.writeText(ids);
    alert(`Copied ${selectedIds.size} reservation IDs to clipboard!`);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showEditModal) return;
    startTransition(async () => {
      const res = await updateAdminReservation(showEditModal.id, {
        tracking_number: showEditModal.id, // Automatically set to reservation ID
        shipping_mode: showEditModal.shipping_mode,
        deposit_amount: showEditModal.deposit_amount,
        deposit_paid: showEditModal.deposit_paid,
        final_shipping_cost: showEditModal.final_shipping_cost,
        status: showEditModal.status,
      });
      if (res.success) {
        setShowEditModal(null);
        router.refresh();
      } else {
        alert("Failed to edit reservation: " + res.error);
      }
    });
  };

  const handleViewItems = async (res: any) => {
    setShowItemsModal(res);
    setLoadingItems(true);
    const result = await getReservationItems(res.id);
    if (result.success) {
      setReservationItems(result.data);
    } else {
      alert("Failed to load items");
    }
    setLoadingItems(false);
  };

  // Filter Logic
  const filteredReservations = initialReservations.filter(res => {
    const matchesSearch = res.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          res.tracking_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          res.customers?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Default to 'In Warehouse' if not set, for matching purposes
    const resStatus = res.status || 'In Warehouse';
    
    const matchesStatus = filterStatus === 'All Statuses' || (resStatus.toLowerCase() === filterStatus.toLowerCase());
    return matchesSearch && matchesStatus;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredReservations.length / itemsPerPage);
  const paginatedReservations = filteredReservations.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (loading) {
    return <div className="p-8 text-zinc-500 flex items-center gap-2"><Zap className="w-4 h-4 animate-pulse" /> Loading reservations...</div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-24">
      {/* Filters Bar */}
      <div className="flex flex-col lg:flex-row gap-4 p-4 bg-zinc-900 border border-zinc-800 rounded-2xl">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input 
            type="text"
            placeholder="Search by Reservation ID, Tracking # or Customer..."
            value={searchTerm}
            onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full h-10 bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
        
        <div className="flex gap-2 shrink-0 overflow-x-auto pb-1 lg:pb-0">
          <select 
            value={filterStatus}
            onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
            className="h-10 bg-zinc-950 border border-zinc-800 rounded-lg px-4 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors appearance-none pr-8 relative"
            style={{ backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23a1a1aa\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1em' }}
          >
            <option>All Statuses</option>
            {STATUS_OPTIONS.map(s => <option key={s} value={s.toLowerCase().replace(/ /g, '_')}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden relative">
        <div className="overflow-x-auto hidden md:block [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-950/50">
                <th className="p-4 w-10">
                  {!readOnly && (
                    <button onClick={() => handleSelectAll(selectedIds.size !== paginatedReservations.length && paginatedReservations.length > 0)} className="text-zinc-500 hover:text-white">
                      {selectedIds.size === paginatedReservations.length && paginatedReservations.length > 0 ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                    </button>
                  )}
                </th>
                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider w-[200px]">Reservation ID</th>
                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider w-full">Customer</th>
                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Items</th>
                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Method</th>
                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Deposit</th>
                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {paginatedReservations.length === 0 ? (
                <tr><td colSpan={8} className="p-8 text-center text-zinc-500">No reservations found.</td></tr>
              ) : (
                paginatedReservations.map(res => {
                  const currentStatusRaw = res.status || 'in_warehouse';
                  const normalizedStatus = STATUS_OPTIONS.find(s => s.toLowerCase().replace(/ /g, '_') === currentStatusRaw.toLowerCase()) || 'In Warehouse';
                  return (
                  <tr key={res.id} className={`hover:bg-zinc-800/50 transition-colors group ${selectedIds.has(res.id) ? 'bg-indigo-500/5' : ''}`}>
                    <td className="p-4">
                      {!readOnly && (
                        <button onClick={() => toggleSelection(res.id)} className={`${selectedIds.has(res.id) ? 'text-indigo-500' : 'text-zinc-600'} hover:text-indigo-400 transition-colors`}>
                          {selectedIds.has(res.id) ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                        </button>
                      )}
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-white font-mono font-medium">{res.id}</p>
                      {res.tracking_number && <p className="text-[10px] text-zinc-400 mt-0.5 tracking-wider">TRK: {res.tracking_number}</p>}
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-zinc-200">{res.customers?.name}</p>
                      <p className="text-[10px] text-zinc-500">{res.customers?.phone || res.customers?.email}</p>
                    </td>
                    <td className="p-4 text-sm text-zinc-300">
                      <div className="flex items-center gap-1.5">
                        <Package className="w-4 h-4 text-zinc-500" />
                        <span className="font-bold">{res.total_items}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-zinc-300">
                      <div className="flex items-center gap-1.5 capitalize">
                        {res.shipping_mode === 'sea' ? <Ship className="w-4 h-4 text-blue-400" /> : <Plane className="w-4 h-4 text-sky-400" />}
                        {res.shipping_mode.replace('_', ' ')}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="relative inline-block w-fit">
                        <select
                          value={normalizedStatus}
                          onChange={(e) => handleStatusChange(res.id, e.target.value.toLowerCase().replace(/ /g, '_'))}
                          disabled={isPending || readOnly}
                          className={`appearance-none px-3 py-1.5 pr-8 rounded-lg text-xs font-bold tracking-wider border outline-none cursor-pointer transition-all disabled:opacity-50 ${getStatusColorClass(normalizedStatus)}`}
                          style={{ backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1em' }}
                        >
                          {STATUS_OPTIONS.map(s => <option key={s} value={s} className="bg-zinc-900 text-white">{s}</option>)}
                        </select>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {res.deposit_paid ? (
                          <span className="px-2 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold rounded-md uppercase tracking-wider">Paid</span>
                        ) : (
                          <span className="px-2 py-1 bg-orange-500/10 text-orange-500 text-[10px] font-bold rounded-md uppercase tracking-wider">Pending</span>
                        )}
                        <span className="text-xs font-bold">₵{Number(res.deposit_amount).toFixed(2)}</span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleViewItems(res)}
                          className="p-2 text-zinc-400 hover:text-white bg-zinc-950 border border-zinc-800 hover:bg-zinc-800 rounded-lg transition-colors" 
                          title="View Items"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {!readOnly && (
                          <button 
                            onClick={() => setShowEditModal(res)}
                            className="p-2 text-zinc-400 hover:text-white bg-zinc-950 border border-zinc-800 hover:bg-zinc-800 rounded-lg transition-colors" 
                            title="Edit Reservation"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )})
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card Layout */}
          <div className="md:hidden flex flex-col divide-y divide-zinc-800">
            {paginatedReservations.length === 0 ? (
              <div className="p-8 text-center text-zinc-500">No reservations found.</div>
            ) : (
              paginatedReservations.map(res => {
                const currentStatusRaw = res.status || 'in_warehouse';
                const normalizedStatus = STATUS_OPTIONS.find(s => s.toLowerCase().replace(/ /g, '_') === currentStatusRaw.toLowerCase()) || 'In Warehouse';
                return (
                  <div key={res.id} className={`p-4 flex flex-col gap-4 ${selectedIds.has(res.id) ? 'bg-indigo-500/5' : ''}`}>
                    <div className="flex items-start gap-3">
                      {!readOnly && (
                        <button onClick={() => toggleSelection(res.id)} className={`mt-0.5 ${selectedIds.has(res.id) ? 'text-indigo-500' : 'text-zinc-600'}`}>
                          {selectedIds.has(res.id) ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                        </button>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-white font-mono font-bold">{res.id}</p>
                          <div className="flex gap-2 shrink-0">
                            <button onClick={() => handleViewItems(res)} className="bg-zinc-800/50 hover:bg-zinc-800 text-white p-2 rounded-xl transition-colors shrink-0">
                              <Eye className="w-4 h-4" />
                            </button>
                            {!readOnly && (
                              <button onClick={() => setShowEditModal(res)} className="bg-zinc-800/50 hover:bg-zinc-800 text-white p-2 rounded-xl transition-colors shrink-0">
                                <Edit className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-zinc-400 mt-0.5">{res.customers?.name} <span className="text-zinc-600">({res.customers?.phone})</span></p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <select
                          value={normalizedStatus}
                          onChange={(e) => handleStatusChange(res.id, e.target.value.toLowerCase().replace(/ /g, '_'))}
                          disabled={isPending || readOnly}
                          className={`appearance-none w-full px-3 py-1.5 pr-8 rounded-lg text-[10px] font-bold tracking-wider border outline-none cursor-pointer transition-all disabled:opacity-50 ${getStatusColorClass(normalizedStatus)}`}
                          style={{ backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1em' }}
                        >
                          {STATUS_OPTIONS.map(s => <option key={s} value={s} className="bg-zinc-900 text-white">{s}</option>)}
                        </select>
                      </div>
                      <span className="px-2 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-[10px] font-bold text-zinc-300 capitalize flex items-center gap-1">
                        {res.shipping_mode === 'sea' ? <Ship className="w-3 h-3 text-blue-400" /> : <Plane className="w-3 h-3 text-sky-400" />}
                        {res.shipping_mode.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm bg-zinc-950 p-3 rounded-xl border border-zinc-800/50">
                      <div>
                        <p className="text-[10px] text-zinc-500 mb-1 uppercase tracking-wider font-bold">Items</p>
                        <p className="text-zinc-300 font-medium flex items-center gap-1"><Package className="w-3.5 h-3.5 text-zinc-500" /> {res.total_items}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-zinc-500 mb-1 uppercase tracking-wider font-bold">Deposit ({res.deposit_paid ? 'Paid' : 'Unpaid'})</p>
                        <p className="text-zinc-300 font-bold">
                          {res.deposit_paid ? <span className="text-emerald-400">₵{Number(res.deposit_amount).toFixed(2)}</span> : <span className="text-orange-500">₵{Number(res.deposit_amount).toFixed(2)}</span>}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
      </div>
      
      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between p-4 bg-zinc-900 border border-zinc-800 rounded-2xl">
          <p className="text-sm text-zinc-400">
            Showing <span className="text-white font-medium">{((currentPage - 1) * itemsPerPage) + 1}</span> to <span className="text-white font-medium">{Math.min(currentPage * itemsPerPage, filteredReservations.length)}</span> of <span className="text-white font-medium">{filteredReservations.length}</span>
          </p>
          <div className="flex items-center gap-2">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white disabled:opacity-50 hover:bg-zinc-800 transition-colors">Prev</button>
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white disabled:opacity-50 hover:bg-zinc-800 transition-colors">Next</button>
          </div>
        </div>
      )}

      {/* Floating Bulk Action Bar */}
      {selectedIds.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] md:w-auto bg-zinc-800 border border-zinc-700 p-2 rounded-2xl shadow-2xl flex flex-col md:flex-row items-center gap-2 md:gap-4 animate-in slide-in-from-bottom-10 z-40">
          <div className="flex items-center justify-between w-full md:w-auto px-4 md:border-r border-zinc-700 pb-2 md:pb-0 border-b md:border-b-0">
            <div>
              <span className="text-white font-bold">{selectedIds.size}</span>
              <span className="text-zinc-400 text-sm ml-2">selected</span>
            </div>
            <button onClick={() => setSelectedIds(new Set())} className="md:hidden p-1 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-lg transition-colors" title="Clear Selection">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center justify-between md:justify-start w-full md:w-auto gap-2 px-2 md:pr-2">
            <button onClick={handleCopyIds} className="flex items-center gap-2 px-3 py-2 hover:bg-zinc-700 rounded-xl text-sm font-medium text-white transition-colors shrink-0">
              <Copy className="w-4 h-4" /> <span className="hidden sm:inline">Copy IDs</span>
            </button>
            <div className="relative flex-1 md:flex-initial flex items-center gap-2 bg-zinc-950 border border-zinc-700 rounded-xl px-2 shrink-0 min-w-0">
              <span className="text-[10px] sm:text-xs text-zinc-400 pl-2 hidden sm:block whitespace-nowrap">Set Status:</span>
              <select 
                className="bg-transparent text-xs sm:text-sm text-white py-2 pl-2 pr-8 outline-none appearance-none cursor-pointer w-full"
                onChange={(e) => {
                  if (e.target.value) {
                    handleBulkStatusUpdate(e.target.value.toLowerCase().replace(/ /g, '_'));
                    e.target.value = '';
                  }
                }}
                disabled={isPending}
                style={{ backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23a1a1aa\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1em' }}
              >
                <option value="">Choose...</option>
                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <button onClick={() => setSelectedIds(new Set())} className="hidden md:block p-2 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-xl transition-colors" title="Clear Selection">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Edit Reservation Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-0 md:p-4" onClick={() => setShowEditModal(null)}>
          <div 
            className="bg-zinc-950 md:border md:border-zinc-800 md:rounded-3xl w-full h-full md:h-auto max-w-lg overflow-hidden flex flex-col md:max-h-[90vh] max-h-[100dvh] animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Edit className="w-5 h-5 text-indigo-500" /> Edit Reservation
              </h2>
              <button onClick={() => setShowEditModal(null)} className="text-zinc-500 hover:text-white"><X className="w-5 h-5"/></button>
            </div>
            <form onSubmit={handleEditSubmit} className="p-6 space-y-4 overflow-y-auto custom-scrollbar">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Master Tracking Number</label>
                  <input type="text" value={showEditModal.id || ''} disabled className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-500 cursor-not-allowed outline-none" />
                  <p className="text-[10px] text-zinc-500 mt-1">The tracking number is automatically set to the Reservation ID.</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Shipping Method</label>
                    <select value={showEditModal.shipping_mode} onChange={e => setShowEditModal({...showEditModal, shipping_mode: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500">
                      <option value="air_normal">Air Normal</option>
                      <option value="air_express">Air Express</option>
                      <option value="sea">Sea Freight</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Status</label>
                    <select value={STATUS_OPTIONS.find(s => s.toLowerCase().replace(/ /g, '_') === showEditModal.status?.toLowerCase()) || 'In Warehouse'} onChange={e => setShowEditModal({...showEditModal, status: e.target.value.toLowerCase().replace(/ /g, '_')})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500">
                      {STATUS_OPTIONS.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Deposit Amount (₵)</label>
                    <input type="number" step="0.01" value={showEditModal.deposit_amount || ''} onChange={e => setShowEditModal({...showEditModal, deposit_amount: parseFloat(e.target.value)})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2 flex justify-between items-center">
                      Deposit Paid?
                      <input type="checkbox" checked={showEditModal.deposit_paid} onChange={e => setShowEditModal({...showEditModal, deposit_paid: e.target.checked})} className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-zinc-900" />
                    </label>
                    <div className={`w-full border rounded-xl px-4 py-3 font-bold text-sm text-center ${showEditModal.deposit_paid ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30' : 'bg-orange-500/10 text-orange-500 border-orange-500/30'}`}>
                      {showEditModal.deposit_paid ? 'PAID' : 'PENDING'}
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Final Shipping Cost (₵)</label>
                  <input type="number" step="0.01" value={showEditModal.final_shipping_cost || ''} onChange={e => setShowEditModal({...showEditModal, final_shipping_cost: parseFloat(e.target.value)})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500" placeholder="0.00" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800 mt-6">
                <button type="button" onClick={() => setShowEditModal(null)} className="px-5 py-2.5 rounded-xl font-bold text-white bg-zinc-800 hover:bg-zinc-700 transition-colors">Cancel</button>
                <button type="submit" disabled={isPending} className="px-5 py-2.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 transition-colors flex items-center gap-2">
                  <Save className="w-4 h-4" /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Items Modal */}
      {showItemsModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-0 md:p-4" onClick={() => setShowItemsModal(null)}>
          <div 
            className="bg-zinc-950 md:border md:border-zinc-800 md:rounded-3xl w-full h-full md:h-auto max-w-2xl overflow-hidden flex flex-col md:max-h-[90vh] max-h-[100dvh] animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Package className="w-5 h-5 text-indigo-500" /> Reservation Details
                </h2>
                <div className="flex items-center gap-3 mt-2">
                  <p className="text-sm text-zinc-400 font-mono">{showItemsModal.id}</p>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase border ${getStatusColorClass(showItemsModal.status || 'in_warehouse')}`}>
                    {STATUS_OPTIONS.find(s => s.toLowerCase().replace(/ /g, '_') === (showItemsModal.status || 'in_warehouse').toLowerCase()) || 'In Warehouse'}
                  </span>
                </div>
              </div>
              <button onClick={() => setShowItemsModal(null)} className="text-zinc-500 hover:text-white"><X className="w-5 h-5"/></button>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
              {/* Customer Details Block */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider mb-1">Customer Info</p>
                  <p className="text-sm font-bold text-white">{showItemsModal.customers?.name}</p>
                  <p className="text-xs text-zinc-400">{showItemsModal.customers?.email}</p>
                  <p className="text-xs text-zinc-400">{showItemsModal.customers?.phone}</p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider mb-1">Shipping Details</p>
                  <p className="text-sm font-bold text-white capitalize flex items-center gap-1 sm:justify-end">
                    {showItemsModal.shipping_mode === 'sea' ? <Ship className="w-4 h-4 text-blue-400" /> : <Plane className="w-4 h-4 text-sky-400" />}
                    {showItemsModal.shipping_mode?.replace('_', ' ')}
                  </p>
                  <p className="text-xs text-zinc-400 mt-1">Total Items: {showItemsModal.total_items}</p>
                </div>
              </div>

              {loadingItems ? (
                <div className="flex justify-center py-12">
                  <Zap className="w-8 h-8 text-indigo-500 animate-pulse" />
                </div>
              ) : (
                <>
                  {reservationItems.packages.length > 0 && (
                    <div>
                      <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Package className="w-4 h-4" /> Warehouse Packages ({reservationItems.packages.length})
                      </h3>
                      <div className="space-y-2">
                        {reservationItems.packages.map((pkg: any) => (
                          <div key={pkg.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-white font-mono">{pkg.tracking_number}</p>
                              <p className="text-xs text-zinc-400">{pkg.items_description}</p>
                            </div>
                            <div className="text-right">
                              {pkg.total_weight_kg && <p className="text-xs text-zinc-500 mt-1">{pkg.total_weight_kg} kg</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {reservationItems.linkOrders.length > 0 && (
                    <div>
                      <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <LinkIcon className="w-4 h-4" /> Link Orders ({reservationItems.linkOrders.length})
                      </h3>
                      <div className="space-y-2">
                        {reservationItems.linkOrders.map((order: any) => (
                          <div key={order.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-white line-clamp-1">{order.product_name}</p>
                              <p className="text-xs text-zinc-400 font-mono text-[10px]">LNK-{order.id.substring(0, 8).toUpperCase()}</p>
                            </div>
                            <div className="text-right">
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {reservationItems.mallOrders.length > 0 && (
                    <div>
                      <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4" /> Mall Orders ({reservationItems.mallOrders.length})
                      </h3>
                      <div className="space-y-2">
                        {reservationItems.mallOrders.map((order: any) => (
                          <div key={order.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-white font-mono">{order.order_id}</p>
                              <p className="text-xs text-zinc-400">{order.items?.length || 0} items</p>
                            </div>
                            <div className="text-right">
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {reservationItems.packages.length === 0 && reservationItems.linkOrders.length === 0 && reservationItems.mallOrders.length === 0 && (
                    <div className="text-center py-12 text-zinc-500">
                      No items found in this reservation.
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="p-4 border-t border-zinc-800 bg-zinc-950/80 backdrop-blur">
              <button onClick={() => setShowItemsModal(null)} className="w-full py-3 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl font-bold transition-colors">Close View</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
