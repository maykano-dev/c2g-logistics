'use client';

import { useState, useEffect, useTransition } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Search, Plus, Filter, Edit, Save, Plane, Ship, Zap, ChevronDown, CheckSquare, Square, Copy, X } from 'lucide-react';
import { format } from 'date-fns';
import { updateShipmentStatus, bulkUpdateShipmentStatus, createAdminShipment, updateAdminShipment } from './actions';

// Constants for Dropdowns
const STATUS_OPTIONS = [
  'Pending',
  'Awaiting Arrival (China)',
  'In Warehouse',
  'In Transit',
  'Clearance',
  'Available for pickup',
  'Delivered',
  'Cancelled'
];

const METHOD_OPTIONS = [
  'Air Express',
  'Air Normal',
  'Sea Shipping'
];

export default function AdminShipmentsView() {
  const [shipments, setShipments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All Statuses');
  const [filterMethod, setFilterMethod] = useState('All Methods');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  
  // Selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  
  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState<any>(null); // holds shipment data
  
  // Pending transition for Server Actions
  const [isPending, startTransition] = useTransition();

  // Create Form State
  const [formData, setFormData] = useState({
    tracking_number: '',
    customer_name: '',
    customer_unique_id: '',
    method: 'Air Normal',
    total_weight_kg: 0,
    shipping_cost: 0,
    status: 'Pending'
  });

  useEffect(() => {
    fetchShipments();
  }, []);

  useEffect(() => {
    setCurrentPage(1); // Reset page on filter change
  }, [searchTerm, filterStatus, filterMethod]);

  const fetchShipments = async () => {
    setLoading(true);
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('shipments')
      .select('*')
      .order('created_at', { ascending: false });

    if (data && !error) {
      setShipments(data);
    }
    setLoading(false);
  };

  // Status Styling Logic
  const getStatusColorClass = (status: string) => {
    const s = status?.toLowerCase() || '';
    if (s.includes('delivered')) return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30';
    if (s.includes('cancelled')) return 'bg-red-500/10 text-red-500 border-red-500/30';
    if (s.includes('warehouse')) return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
    if (s.includes('transit')) return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
    if (s.includes('pickup')) return 'bg-teal-500/10 text-teal-400 border-teal-500/30';
    return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30'; // pending/awaiting
  };

  // Handlers
  const handleStatusChange = (id: string, newStatus: string) => {
    // Optimistic update
    setShipments(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
    startTransition(async () => {
      await updateShipmentStatus(id, newStatus);
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = new Set(filteredShipments.map(s => s.id));
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
    // Optimistic update
    setShipments(prev => prev.map(s => ids.includes(s.id) ? { ...s, status: newStatus } : s));
    startTransition(async () => {
      await bulkUpdateShipmentStatus(ids, newStatus);
      setSelectedIds(new Set()); // clear selection
    });
  };

  const handleCopyTracking = () => {
    const selectedShipments = shipments.filter(s => selectedIds.has(s.id));
    const trackings = selectedShipments.map(s => s.tracking_number).join('\n');
    navigator.clipboard.writeText(trackings);
    alert(`Copied ${selectedShipments.length} tracking numbers to clipboard!`);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await createAdminShipment(formData);
      if (res.success) {
        setShowCreateModal(false);
        fetchShipments(); // refresh
        // reset form
        setFormData({ tracking_number: '', customer_name: '', customer_unique_id: '', method: 'Air Normal', total_weight_kg: 0, shipping_cost: 0, status: 'Pending' });
      } else {
        alert("Failed to create shipment: " + res.error);
      }
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showEditModal) return;
    startTransition(async () => {
      const res = await updateAdminShipment(showEditModal.id, {
        tracking_number: showEditModal.tracking_number,
        customer_name: showEditModal.customer_name,
        customer_unique_id: showEditModal.customer_unique_id,
        method: showEditModal.method,
        total_weight_kg: showEditModal.total_weight_kg,
        shipping_cost: showEditModal.shipping_cost,
        status: showEditModal.status,
      });
      if (res.success) {
        setShowEditModal(null);
        fetchShipments(); // refresh
      } else {
        alert("Failed to edit shipment: " + res.error);
      }
    });
  };

  // Filter Logic
  const filteredShipments = shipments.filter(s => {
    const matchesSearch = s.tracking_number?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          s.customer_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All Statuses' || (s.status && s.status.toLowerCase() === filterStatus.toLowerCase());
    const matchesMethod = filterMethod === 'All Methods' || (s.method && s.method.toLowerCase() === filterMethod.toLowerCase());
    return matchesSearch && matchesStatus && matchesMethod;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredShipments.length / itemsPerPage);
  const paginatedShipments = filteredShipments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Manage Shipments</h1>
          <p className="text-zinc-400">View tracking events, update statuses, and send notifications.</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors w-fit shadow-lg shadow-indigo-500/20"
        >
          <Plus className="w-4 h-4" /> Add Shipment
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col lg:flex-row gap-4 p-4 bg-zinc-900 border border-zinc-800 rounded-2xl">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input 
            type="text"
            placeholder="Search by Tracking # or Customer..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full h-10 bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
        
        <div className="flex gap-2 shrink-0 overflow-x-auto pb-1 lg:pb-0">
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="h-10 bg-zinc-950 border border-zinc-800 rounded-lg px-4 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors appearance-none pr-8 relative"
            style={{ backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23a1a1aa\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1em' }}
          >
            <option>All Statuses</option>
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          
          <select 
            value={filterMethod}
            onChange={(e) => setFilterMethod(e.target.value)}
            className="h-10 bg-zinc-950 border border-zinc-800 rounded-lg px-4 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors appearance-none pr-8 relative"
            style={{ backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23a1a1aa\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1em' }}
          >
            <option>All Methods</option>
            {METHOD_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
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
                  <button onClick={() => handleSelectAll(selectedIds.size !== paginatedShipments.length && paginatedShipments.length > 0)} className="text-zinc-500 hover:text-white">
                    {selectedIds.size === paginatedShipments.length && paginatedShipments.length > 0 ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                  </button>
                </th>
                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider w-[200px]">Tracking #</th>
                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider w-full">Customer</th>
                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Date Booked</th>
                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Method</th>
                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Weight</th>
                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Shipping Fee</th>
                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {loading ? (
                <tr><td colSpan={9} className="p-8 text-center text-zinc-500">Loading shipments...</td></tr>
              ) : paginatedShipments.length === 0 ? (
                <tr><td colSpan={9} className="p-8 text-center text-zinc-500">No shipments found.</td></tr>
              ) : (
                paginatedShipments.map(shipment => {
                  const normalizedStatus = STATUS_OPTIONS.find(s => s.toLowerCase() === shipment.status?.toLowerCase()) || 'Pending';
                  return (
                  <tr key={shipment.id} className={`hover:bg-zinc-800/50 transition-colors group ${selectedIds.has(shipment.id) ? 'bg-indigo-500/5' : ''}`}>
                    <td className="p-4">
                      <button onClick={() => toggleSelection(shipment.id)} className={`${selectedIds.has(shipment.id) ? 'text-indigo-500' : 'text-zinc-600'} hover:text-indigo-400 transition-colors`}>
                        {selectedIds.has(shipment.id) ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                      </button>
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-white font-mono font-medium">{shipment.tracking_number}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-zinc-200">{shipment.customer_name || 'N/A'}</p>
                      <p className="text-[10px] text-zinc-500">CUS-{shipment.customer_unique_id || 'UNKNOWN'}</p>
                    </td>
                    <td className="p-4 text-sm text-zinc-300">
                      {shipment.created_at ? format(new Date(shipment.created_at), 'dd MMM yyyy') : 'N/A'}
                    </td>
                    <td className="p-4 text-sm text-zinc-300">
                      {shipment.method || 'N/A'}
                    </td>
                    <td className="p-4">
                      {/* Inline Status Dropdown */}
                      <div className="relative inline-block w-fit">
                        <select
                          value={normalizedStatus}
                          onChange={(e) => handleStatusChange(shipment.id, e.target.value)}
                          disabled={isPending}
                          className={`appearance-none px-3 py-1.5 pr-8 rounded-lg text-xs font-bold tracking-wider border outline-none cursor-pointer transition-all disabled:opacity-50 ${getStatusColorClass(normalizedStatus)}`}
                          style={{ backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1em' }}
                        >
                          {STATUS_OPTIONS.map(s => <option key={s} value={s} className="bg-zinc-900 text-white">{s}</option>)}
                        </select>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-zinc-300">
                      {shipment.total_weight_kg ? `${shipment.total_weight_kg} kg` : 'N/A'}
                    </td>
                    <td className="p-4 text-sm text-zinc-300">
                      {shipment.shipping_cost ? `₵${Number(shipment.shipping_cost).toFixed(2)}` : 'Not set'}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => setShowEditModal(shipment)}
                          className="p-2 text-zinc-400 hover:text-white bg-zinc-950 border border-zinc-800 hover:bg-zinc-800 rounded-lg transition-colors" 
                          title="Edit Shipment"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
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
            {loading ? (
              <div className="p-8 text-center text-zinc-500">Loading shipments...</div>
            ) : paginatedShipments.length === 0 ? (
              <div className="p-8 text-center text-zinc-500">No shipments found.</div>
            ) : (
              paginatedShipments.map(shipment => {
                const normalizedStatus = STATUS_OPTIONS.find(s => s.toLowerCase() === shipment.status?.toLowerCase()) || 'Pending';
                return (
                  <div key={shipment.id} className={`p-4 flex flex-col gap-4 ${selectedIds.has(shipment.id) ? 'bg-indigo-500/5' : ''}`}>
                    <div className="flex items-start gap-3">
                      <button onClick={() => toggleSelection(shipment.id)} className={`mt-0.5 ${selectedIds.has(shipment.id) ? 'text-indigo-500' : 'text-zinc-600'}`}>
                        {selectedIds.has(shipment.id) ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                      </button>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-white font-mono font-medium">{shipment.tracking_number}</p>
                          <button 
                            onClick={() => setShowEditModal(shipment)}
                            className="bg-zinc-800/50 hover:bg-zinc-800 text-white p-2 rounded-xl transition-colors shrink-0 ml-2" 
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-xs text-zinc-400 mt-0.5">{shipment.customer_name || 'N/A'} <span className="text-zinc-600">(CUS-{shipment.customer_unique_id || 'UNKNOWN'})</span></p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <select
                          value={normalizedStatus}
                          onChange={(e) => handleStatusChange(shipment.id, e.target.value)}
                          disabled={isPending}
                          className={`appearance-none w-full px-3 py-1.5 pr-8 rounded-lg text-[10px] font-bold tracking-wider border outline-none cursor-pointer transition-all disabled:opacity-50 ${getStatusColorClass(normalizedStatus)}`}
                          style={{ backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1em' }}
                        >
                          {STATUS_OPTIONS.map(s => <option key={s} value={s} className="bg-zinc-900 text-white">{s}</option>)}
                        </select>
                      </div>
                      <span className="px-2 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs font-bold text-zinc-300">
                        {shipment.method || 'N/A'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm bg-zinc-950 p-3 rounded-xl border border-zinc-800/50">
                      <div>
                        <p className="text-xs text-zinc-500 mb-1">Weight</p>
                        <p className="text-zinc-300 font-medium">{shipment.total_weight_kg ? `${shipment.total_weight_kg} kg` : 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-zinc-500 mb-1">Shipping Fee</p>
                        <p className="text-zinc-300 font-medium">
                          {shipment.shipping_cost ? <span className="text-emerald-400">₵{Number(shipment.shipping_cost).toFixed(2)}</span> : <span className="text-yellow-500">Not set</span>}
                        </p>
                      </div>
                    </div>
                    
                    <p className="text-[10px] text-zinc-600 text-center">{shipment.created_at ? format(new Date(shipment.created_at), 'MMM dd, yyyy') : 'N/A'}</p>
                  </div>
                )
              })
            )}
          </div>
      </div>
      
      {/* Pagination Footer */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between p-4 bg-zinc-900 border border-zinc-800 rounded-2xl">
          <p className="text-sm text-zinc-400">
            Showing <span className="text-white font-medium">{((currentPage - 1) * itemsPerPage) + 1}</span> to <span className="text-white font-medium">{Math.min(currentPage * itemsPerPage, filteredShipments.length)}</span> of <span className="text-white font-medium">{filteredShipments.length}</span> results
          </p>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white disabled:opacity-50 hover:bg-zinc-800 transition-colors"
            >
              Previous
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }).map((_, idx) => {
                // Show a window of pages around current page
                if (idx === 0 || idx === totalPages - 1 || Math.abs(currentPage - 1 - idx) <= 1) {
                  return (
                    <button
                      key={idx}
                      onClick={() => setCurrentPage(idx + 1)}
                      className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${currentPage === idx + 1 ? 'bg-indigo-600 text-white border border-indigo-500' : 'bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800'}`}
                    >
                      {idx + 1}
                    </button>
                  );
                }
                if (Math.abs(currentPage - 1 - idx) === 2) {
                  return <span key={idx} className="text-zinc-500 px-1">...</span>;
                }
                return null;
              })}
            </div>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white disabled:opacity-50 hover:bg-zinc-800 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Floating Bulk Action Bar */}
      {selectedIds.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-zinc-800 border border-zinc-700 p-2 rounded-2xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-bottom-10 z-40">
          <div className="px-4 border-r border-zinc-700">
            <span className="text-white font-bold">{selectedIds.size}</span>
            <span className="text-zinc-400 text-sm ml-2">selected</span>
          </div>
          <div className="flex items-center gap-2 pr-2">
            <button onClick={handleCopyTracking} className="flex items-center gap-2 px-3 py-2 hover:bg-zinc-700 rounded-xl text-sm font-medium text-white transition-colors">
              <Copy className="w-4 h-4" /> Copy Tracking #s
            </button>
            <div className="relative flex items-center gap-2 bg-zinc-950 border border-zinc-700 rounded-xl px-2">
              <span className="text-xs text-zinc-400 pl-2">Set Status:</span>
              <select 
                className="bg-transparent text-sm text-white py-2 pl-2 pr-8 outline-none appearance-none cursor-pointer"
                onChange={(e) => {
                  if (e.target.value) {
                    handleBulkStatusUpdate(e.target.value);
                    e.target.value = ''; // reset after action
                  }
                }}
                disabled={isPending}
                style={{ backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23a1a1aa\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1em' }}
              >
                <option value="">Choose...</option>
                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <button onClick={() => setSelectedIds(new Set())} className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-xl transition-colors" title="Clear Selection">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Create Shipment Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-0 md:p-4" onClick={() => setShowCreateModal(false)}>
          <div 
            className="bg-zinc-950 md:border md:border-zinc-800 md:rounded-3xl w-full h-full md:h-auto max-w-lg overflow-hidden flex flex-col md:max-h-[90vh] max-h-[100dvh] animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-indigo-500" /> Create Shipment
              </h2>
              <button onClick={() => setShowCreateModal(false)} className="text-zinc-500 hover:text-white"><X className="w-5 h-5"/></button>
            </div>
            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Tracking Number</label>
                  <input type="text" required value={formData.tracking_number} onChange={e => setFormData({...formData, tracking_number: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500" placeholder="e.g. YT123456789" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Customer Name</label>
                    <input type="text" required value={formData.customer_name} onChange={e => setFormData({...formData, customer_name: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500" placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Customer C2G ID</label>
                    <input type="text" required value={formData.customer_unique_id} onChange={e => setFormData({...formData, customer_unique_id: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500" placeholder="833992" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Shipping Method</label>
                    <select value={formData.method} onChange={e => setFormData({...formData, method: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500">
                      {METHOD_OPTIONS.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Initial Status</label>
                    <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500">
                      {STATUS_OPTIONS.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Weight (KG)</label>
                    <input type="number" step="0.01" value={formData.total_weight_kg || ''} onChange={e => setFormData({...formData, total_weight_kg: parseFloat(e.target.value)})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500" placeholder="0.00" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Shipping Fee (GHS)</label>
                    <input type="number" step="0.01" value={formData.shipping_cost || ''} onChange={e => setFormData({...formData, shipping_cost: parseFloat(e.target.value)})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500" placeholder="0.00" />
                  </div>
                </div>
                
                <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                  <p className="text-xs text-indigo-400 font-medium">Note: Admin created shipments are automatically marked as "Registration Paid" and "Shipping Fee Paid" by default.</p>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowCreateModal(false)} className="px-5 py-2.5 rounded-xl font-bold text-white bg-zinc-800 hover:bg-zinc-700 transition-colors">Cancel</button>
                <button type="submit" disabled={isPending} className="px-5 py-2.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 transition-colors flex items-center gap-2">
                  <Save className="w-4 h-4" /> Save Shipment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Shipment Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-0 md:p-4" onClick={() => setShowEditModal(null)}>
          <div 
            className="bg-zinc-950 md:border md:border-zinc-800 md:rounded-3xl w-full h-full md:h-auto max-w-lg overflow-hidden flex flex-col md:max-h-[90vh] max-h-[100dvh] animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Edit className="w-5 h-5 text-indigo-500" /> Edit Shipment
              </h2>
              <button onClick={() => setShowEditModal(null)} className="text-zinc-500 hover:text-white"><X className="w-5 h-5"/></button>
            </div>
            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Tracking Number</label>
                  <input type="text" required value={showEditModal.tracking_number} onChange={e => setShowEditModal({...showEditModal, tracking_number: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Customer Name</label>
                    <input type="text" required value={showEditModal.customer_name} onChange={e => setShowEditModal({...showEditModal, customer_name: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Customer C2G ID</label>
                    <input type="text" required value={showEditModal.customer_unique_id} onChange={e => setShowEditModal({...showEditModal, customer_unique_id: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Shipping Method</label>
                    <select value={showEditModal.method} onChange={e => setShowEditModal({...showEditModal, method: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500">
                      {METHOD_OPTIONS.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Status</label>
                    <select value={showEditModal.status} onChange={e => setShowEditModal({...showEditModal, status: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500">
                      {STATUS_OPTIONS.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Weight (KG)</label>
                    <input type="number" step="0.01" value={showEditModal.total_weight_kg || ''} onChange={e => setShowEditModal({...showEditModal, total_weight_kg: parseFloat(e.target.value)})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Shipping Fee (GHS)</label>
                    <input type="number" step="0.01" value={showEditModal.shipping_cost || ''} onChange={e => setShowEditModal({...showEditModal, shipping_cost: parseFloat(e.target.value)})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500" />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowEditModal(null)} className="px-5 py-2.5 rounded-xl font-bold text-white bg-zinc-800 hover:bg-zinc-700 transition-colors">Cancel</button>
                <button type="submit" disabled={isPending} className="px-5 py-2.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 transition-colors flex items-center gap-2">
                  <Save className="w-4 h-4" /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
