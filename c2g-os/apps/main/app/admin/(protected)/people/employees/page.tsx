'use client';

import { useState, useEffect } from 'react';
import { Users, Mail, Phone, MapPin, Search, Filter, Plus, UserPlus, FileText, CheckCircle2, XCircle } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { adminSetEmployeeStatus } from '@/app/admin/employee-actions';
import { useModal } from "@/components/providers/modal-provider";

export default function EmployeesDirectoryView() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [addEmail, setAddEmail] = useState('');
  const [addRole, setAddRole] = useState('customer_service');
  const [isAdding, setIsAdding] = useState(false);
  const { showConfirm, showAlert } = useModal();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (data && !error) {
      setEmployees(data);
    }
    setLoading(false);
  };

  const handleStatusChange = async (id: string, status: string) => {
    const confirmed = await showConfirm({
      title: 'Confirm Status Change',
      message: `Are you sure you want to change this employee's status to ${status}?`,
      type: status === 'active' ? 'success' : 'danger',
      confirmText: `Yes, make ${status}`
    });

    if (!confirmed) return;

    const res = await adminSetEmployeeStatus(id, status);
    if (res.success) {
      setEmployees(prev => prev.map(emp => emp.id === id ? { ...emp, status } : emp));
      showAlert({ title: 'Success', message: `Employee status updated to ${status}`, type: 'success' });
    } else {
      showAlert({ title: 'Error', message: 'Failed to update status: ' + res.error, type: 'danger' });
    }
  };

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addEmail) return;
    
    setIsAdding(true);
    const { adminAddEmployeeByEmail } = await import('@/app/admin/employee-actions');
    const res = await adminAddEmployeeByEmail(addEmail, addRole);
    
    if (res.success) {
      showAlert({ title: 'Success', message: 'Employee added successfully', type: 'success' });
      setShowAddModal(false);
      setAddEmail('');
      fetchEmployees(); // Refresh the list
    } else {
      showAlert({ title: 'Error', message: res.error || 'Failed to add employee', type: 'danger' });
    }
    setIsAdding(false);
  };

  const filtered = employees.filter(emp => {
    const matchesSearch = emp.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          emp.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || emp.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
            <Users className="w-6 h-6 text-indigo-500" /> Employee Directory
          </h1>
          <p className="text-zinc-400 mt-1">Manage staff, HR records, roles, and branch assignments.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-indigo-900/20 transition-all flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" /> Onboard Staff
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-zinc-900 border border-zinc-800 rounded-2xl">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input 
            type="text"
            placeholder="Search employees by name, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
        <div className="flex gap-2">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 text-zinc-300 text-sm rounded-lg px-4 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
          <button className="px-4 h-10 border border-zinc-800 bg-zinc-950 text-white rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-zinc-800 transition-colors shrink-0">
            <Filter className="w-4 h-4" /> Filters
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center p-12 text-zinc-500">Loading directory...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center p-12 text-zinc-500">No employees found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((emp) => (
            <div key={emp.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-indigo-500/50 transition-colors group relative overflow-hidden">
              <div className={`absolute top-0 left-0 w-1 h-full ${
                emp.status === 'active' ? 'bg-emerald-500' : 
                emp.status === 'pending' ? 'bg-amber-500' : 'bg-red-500'
              }`}></div>
              
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-3">
                  <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-lg font-bold text-zinc-400 group-hover:bg-indigo-500/20 group-hover:text-indigo-400 transition-colors">
                    {emp.full_name?.split(' ').map((n: string) => n[0]).join('').substring(0,2).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{emp.full_name}</h3>
                    <p className="text-xs text-zinc-400 mt-0.5 capitalize">{emp.staff_role || 'No Role Assigned'}</p>
                  </div>
                </div>
                <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded ${
                  emp.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 
                  emp.status === 'pending' ? 'bg-amber-500/10 text-amber-400' : 'bg-red-500/10 text-red-400'
                }`}>
                  {emp.status}
                </span>
              </div>

              <div className="space-y-2 mt-6">
                <div className="flex items-center gap-3 text-xs text-zinc-400">
                  <Mail className="w-3.5 h-3.5 text-zinc-500" /> {emp.email}
                </div>
                <div className="flex items-center gap-3 text-xs text-zinc-400">
                  <Phone className="w-3.5 h-3.5 text-zinc-500" /> {emp.phone || 'No phone'}
                </div>
                {/* Branches would be joined from a branches table if we had one, mapping to generic text for now */}
                <div className="flex items-center gap-3 text-xs text-zinc-400">
                  <MapPin className="w-3.5 h-3.5 text-zinc-500" /> C2G Location
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-800 flex justify-between items-center">
                 <button className="text-xs font-bold text-zinc-500 hover:text-white transition-colors flex items-center gap-1">
                   <FileText className="w-3 h-3" /> HR File
                 </button>
                 
                 {emp.status === 'pending' ? (
                   <div className="flex gap-2">
                     <button onClick={() => handleStatusChange(emp.id, 'active')} className="text-emerald-500 hover:bg-emerald-500/20 p-1.5 rounded-lg transition-colors">
                       <CheckCircle2 className="w-4 h-4" />
                     </button>
                     <button onClick={() => handleStatusChange(emp.id, 'rejected')} className="text-red-500 hover:bg-red-500/20 p-1.5 rounded-lg transition-colors">
                       <XCircle className="w-4 h-4" />
                     </button>
                   </div>
                 ) : (
                   <button className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
                     Manage Role
                   </button>
                 )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => !isAdding && setShowAddModal(false)}></div>
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">Onboard New Staff</h3>
              <button onClick={() => !isAdding && setShowAddModal(false)} className="text-zinc-500 hover:text-white">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleAddEmployee} className="p-6 space-y-4">
              <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl mb-6">
                <p className="text-xs text-indigo-400">The user must have already registered an account on C2G Logistics using this email before you can assign them a staff role.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Staff Email Address</label>
                <input 
                  type="email" 
                  value={addEmail}
                  onChange={(e) => setAddEmail(e.target.value)}
                  className="w-full h-12 bg-zinc-900 border border-zinc-800 rounded-xl px-4 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="employee@c2glogistics.com"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Assign Role</label>
                <select 
                  value={addRole}
                  onChange={(e) => setAddRole(e.target.value)}
                  className="w-full h-12 bg-zinc-900 border border-zinc-800 rounded-xl px-4 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                >
                  <option value="customer_service">Customer Service (Agent)</option>
                  <option value="warehouse">China Warehouse Staff</option>
                  <option value="admin">Administrator</option>
                  <option value="manager">Manager</option>
                </select>
              </div>

              <button 
                type="submit" 
                disabled={isAdding}
                className="w-full h-12 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl font-bold mt-4 transition-colors"
              >
                {isAdding ? 'Adding Staff...' : 'Onboard Employee'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
