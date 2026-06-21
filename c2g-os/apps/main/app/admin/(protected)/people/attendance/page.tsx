'use client';

import { useState } from 'react';
import { Clock, Calendar, CheckCircle2, XCircle, AlertTriangle, Search, Filter, MonitorSmartphone } from 'lucide-react';
import { format } from 'date-fns';

export default function AttendanceView() {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock Data since we are building UI before DB integration
  const [attendanceRecords] = useState([
    { id: 1, employee: 'David Boakye', role: 'Warehouse Lead', status: 'clocked_in', time_in: new Date(new Date().setHours(8, 5, 0)), time_out: null, device_ip: '192.168.1.45', warnings: 0 },
    { id: 2, employee: 'Sarah Mensah', role: 'Procurement Officer', status: 'clocked_out', time_in: new Date(new Date().setHours(7, 50, 0)), time_out: new Date(new Date().setHours(17, 10, 0)), device_ip: '192.168.1.12', warnings: 0 },
    { id: 3, employee: 'Kwame Osei', role: 'Logistics Coord', status: 'absent', time_in: null, time_out: null, device_ip: null, warnings: 1 },
    { id: 4, employee: 'Abena Yeboah', role: 'Customer Support', status: 'clocked_in', time_in: new Date(new Date().setHours(9, 15, 0)), time_out: null, device_ip: '10.0.0.8', warnings: 3 }, // Flagged account
  ]);

  const filtered = attendanceRecords.filter(r => r.employee.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto pb-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
            <Calendar className="w-6 h-6 text-indigo-500" /> Employee Attendance
          </h1>
          <p className="text-zinc-400 mt-1">Track daily clock-ins, device IP verification, and absenteeism.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-zinc-900 border border-emerald-500/30 p-4 rounded-xl">
          <p className="text-xs text-emerald-500 uppercase font-bold tracking-widest mb-1">Present Today</p>
          <p className="text-3xl font-black text-white">{attendanceRecords.filter(r => r.status !== 'absent').length}</p>
        </div>
        <div className="bg-zinc-900 border border-red-500/30 p-4 rounded-xl">
          <p className="text-xs text-red-500 uppercase font-bold tracking-widest mb-1">Absent</p>
          <p className="text-3xl font-black text-white">{attendanceRecords.filter(r => r.status === 'absent').length}</p>
        </div>
        <div className="bg-zinc-900 border border-amber-500/30 p-4 rounded-xl">
          <p className="text-xs text-amber-500 uppercase font-bold tracking-widest mb-1">Late Arrivals</p>
          <p className="text-3xl font-black text-white">1</p>
        </div>
        <div className="bg-zinc-900 border border-purple-500/30 p-4 rounded-xl relative overflow-hidden">
           <div className="absolute top-0 right-0 p-2 text-purple-500/10">
             <AlertTriangle className="w-16 h-16 transform rotate-12" />
           </div>
          <p className="text-xs text-purple-500 uppercase font-bold tracking-widest mb-1 relative z-10">Flagged Accounts</p>
          <p className="text-3xl font-black text-white relative z-10">{attendanceRecords.filter(r => r.warnings >= 3).length}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-zinc-900 border border-zinc-800 rounded-2xl">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input 
            type="text"
            placeholder="Search employees..."
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
                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Employee</th>
                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Time In/Out</th>
                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Device Check</th>
                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider text-right">Warnings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {filtered.map(record => (
                <tr key={record.id} className="hover:bg-zinc-800/50 transition-colors">
                  <td className="p-4">
                    <p className="text-sm font-bold text-white">{record.employee}</p>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider mt-1">{record.role}</p>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 w-fit ${
                      record.status === 'clocked_in' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                      record.status === 'clocked_out' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                      'bg-red-500/10 text-red-500 border border-red-500/20'
                    }`}>
                      {record.status === 'clocked_in' && <CheckCircle2 className="w-3 h-3" />}
                      {record.status === 'clocked_out' && <Clock className="w-3 h-3" />}
                      {record.status === 'absent' && <XCircle className="w-3 h-3" />}
                      {record.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-4">
                    {record.status === 'absent' ? (
                      <span className="text-sm text-zinc-600 italic">No logs today</span>
                    ) : (
                      <>
                        <div className="text-sm text-zinc-200">
                          <span className="text-zinc-500 text-xs w-8 inline-block">IN:</span> 
                          {record.time_in ? format(record.time_in, 'hh:mm a') : '--'}
                          {record.time_in && record.time_in.getHours() >= 9 && <span className="ml-2 text-[10px] text-amber-500 font-bold bg-amber-500/10 px-1 rounded">LATE</span>}
                        </div>
                        <div className="text-sm text-zinc-400 mt-1">
                          <span className="text-zinc-600 text-xs w-8 inline-block">OUT:</span> 
                          {record.time_out ? format(record.time_out, 'hh:mm a') : '--'}
                        </div>
                      </>
                    )}
                  </td>
                  <td className="p-4">
                    {record.device_ip ? (
                      <div className="flex items-center gap-2">
                        <MonitorSmartphone className="w-4 h-4 text-zinc-500" />
                        <div>
                          <p className="text-xs font-mono text-zinc-300">{record.device_ip}</p>
                          <p className="text-[10px] text-emerald-500 mt-0.5">Verified Office Network</p>
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-zinc-600">N/A</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    {record.warnings >= 3 ? (
                      <div className="flex flex-col items-end">
                        <span className="text-red-500 font-black text-lg">{record.warnings}</span>
                        <span className="text-[10px] font-bold uppercase text-red-400 bg-red-500/10 px-2 py-0.5 rounded mt-1">Account Flagged</span>
                      </div>
                    ) : record.warnings > 0 ? (
                      <span className="text-amber-500 font-bold">{record.warnings}</span>
                    ) : (
                      <span className="text-zinc-600 text-sm">0</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card Layout */}
        <div className="md:hidden flex flex-col divide-y divide-zinc-800">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-zinc-500">No attendance records found.</div>
          ) : (
            filtered.map(record => (
              <div key={record.id} className="p-4 flex flex-col gap-4 hover:bg-zinc-800/20 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-bold text-white">{record.employee}</p>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider">{record.role}</p>
                  </div>
                  <div>
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 w-fit ${
                      record.status === 'clocked_in' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                      record.status === 'clocked_out' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                      'bg-red-500/10 text-red-500 border border-red-500/20'
                    }`}>
                      {record.status === 'clocked_in' && <CheckCircle2 className="w-3 h-3" />}
                      {record.status === 'clocked_out' && <Clock className="w-3 h-3" />}
                      {record.status === 'absent' && <XCircle className="w-3 h-3" />}
                      {record.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 bg-zinc-950 p-3 rounded-xl border border-zinc-800/50">
                  <div className="col-span-2 sm:col-span-1">
                    <p className="text-xs text-zinc-500 mb-1">Time Log</p>
                    {record.status === 'absent' ? (
                      <span className="text-sm text-zinc-600 italic">No logs today</span>
                    ) : (
                      <>
                        <div className="text-sm text-zinc-200">
                          <span className="text-zinc-500 text-[10px] w-6 inline-block">IN:</span> 
                          {record.time_in ? format(record.time_in, 'hh:mm a') : '--'}
                          {record.time_in && record.time_in.getHours() >= 9 && <span className="ml-2 text-[10px] text-amber-500 font-bold bg-amber-500/10 px-1 rounded">LATE</span>}
                        </div>
                        <div className="text-sm text-zinc-400 mt-0.5">
                          <span className="text-zinc-600 text-[10px] w-6 inline-block">OUT:</span> 
                          {record.time_out ? format(record.time_out, 'hh:mm a') : '--'}
                        </div>
                      </>
                    )}
                  </div>
                  
                  {record.device_ip && (
                    <div className="col-span-2 sm:col-span-1 mt-2 sm:mt-0 border-t border-zinc-800 sm:border-0 pt-2 sm:pt-0">
                      <p className="text-xs text-zinc-500 mb-1 flex items-center gap-1"><MonitorSmartphone className="w-3 h-3" /> Device Check</p>
                      <p className="text-xs font-mono text-zinc-300">{record.device_ip}</p>
                      <p className="text-[10px] text-emerald-500 mt-0.5">Verified Network</p>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end mt-1">
                  {record.warnings >= 3 ? (
                    <div className="flex items-center gap-2">
                      <span className="text-red-500 font-black text-sm">{record.warnings} Warnings</span>
                      <span className="text-[10px] font-bold uppercase text-red-400 bg-red-500/10 px-2 py-0.5 rounded">Flagged</span>
                    </div>
                  ) : record.warnings > 0 ? (
                    <span className="text-amber-500 font-bold text-xs">{record.warnings} Warnings</span>
                  ) : (
                    <span className="text-zinc-600 text-xs">0 Warnings</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
