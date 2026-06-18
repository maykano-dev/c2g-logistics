'use client';

import { Users, Mail, Phone, MapPin, Search, Filter, Plus, UserPlus, FileText } from 'lucide-react';

export default function EmployeesDirectoryView() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
            <Users className="w-6 h-6 text-indigo-500" /> Employee Directory
          </h1>
          <p className="text-zinc-400 mt-1">Manage staff, HR records, roles, and branch assignments.</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-indigo-900/20 transition-all flex items-center gap-2">
          <UserPlus className="w-4 h-4" /> Onboard Staff
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-zinc-900 border border-zinc-800 rounded-2xl">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input 
            type="text"
            placeholder="Search employees by name, role, or department..."
            className="w-full h-10 bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
        <div className="flex gap-2">
          <select className="bg-zinc-950 border border-zinc-800 text-zinc-300 text-sm rounded-lg px-4 focus:outline-none focus:border-indigo-500">
            <option>All Branches</option>
            <option>China Warehouse</option>
            <option>Ghana HQ</option>
            <option>Remote</option>
          </select>
          <button className="px-4 h-10 border border-zinc-800 bg-zinc-950 text-white rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-zinc-800 transition-colors shrink-0">
            <Filter className="w-4 h-4" /> Filters
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { name: 'David Boakye', role: 'Warehouse Lead', branch: 'China Warehouse', email: 'david@c2g.com', phone: '+86 150 0000 0000', status: 'active' },
          { name: 'Sarah Mensah', role: 'Procurement Officer', branch: 'Ghana HQ', email: 'sarah@c2g.com', phone: '+233 24 000 0000', status: 'active' },
          { name: 'Kwame Osei', role: 'Logistics Coordinator', branch: 'China Warehouse', email: 'kwame@c2g.com', phone: '+86 150 1111 1111', status: 'on_leave' },
          { name: 'Abena Yeboah', role: 'Customer Support', branch: 'Remote', email: 'abena@c2g.com', phone: '+233 20 000 0000', status: 'active' },
          { name: 'Michael Chen', role: 'QC Inspector', branch: 'China Warehouse', email: 'michael@c2g.com', phone: '+86 138 0000 0000', status: 'active' },
          { name: 'Emmanuel Tech', role: 'System Admin', branch: 'Ghana HQ', email: 'emmanuel@c2g.com', phone: '+233 55 000 0000', status: 'active' },
        ].map((emp, i) => (
          <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-indigo-500/50 transition-colors group relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-1 h-full ${emp.status === 'active' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
            
            <div className="flex justify-between items-start mb-4">
              <div className="flex gap-3">
                <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-lg font-bold text-zinc-400 group-hover:bg-indigo-500/20 group-hover:text-indigo-400 transition-colors">
                  {emp.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{emp.name}</h3>
                  <p className="text-xs text-zinc-400 mt-0.5">{emp.role}</p>
                </div>
              </div>
              <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded ${
                emp.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
              }`}>
                {emp.status.replace('_', ' ')}
              </span>
            </div>

            <div className="space-y-2 mt-6">
              <div className="flex items-center gap-3 text-xs text-zinc-400">
                <Mail className="w-3.5 h-3.5 text-zinc-500" /> {emp.email}
              </div>
              <div className="flex items-center gap-3 text-xs text-zinc-400">
                <Phone className="w-3.5 h-3.5 text-zinc-500" /> {emp.phone}
              </div>
              <div className="flex items-center gap-3 text-xs text-zinc-400">
                <MapPin className="w-3.5 h-3.5 text-zinc-500" /> {emp.branch}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-800 flex justify-between">
               <button className="text-xs font-bold text-zinc-500 hover:text-white transition-colors flex items-center gap-1">
                 <FileText className="w-3 h-3" /> HR File
               </button>
               <button className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
                 Manage Role
               </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
