"use client";

import { useState } from "react";
import { AlertTriangle, Filter, Search, Bell, Ban, ShieldAlert } from "lucide-react";

export default function DebtManagementClient({ debtors }: { debtors: any[] }) {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filteredDebtors = debtors.filter(d => {
    if (filter !== "All" && d.riskLevel !== filter) return false;
    if (search && !d.name.toLowerCase().includes(search.toLowerCase()) && !d.phone.includes(search)) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
          <input
            type="text"
            placeholder="Search debtors..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>
        
        <select 
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
        >
          <option value="All">All Risk Levels</option>
          <option value="High">High Risk</option>
          <option value="Medium">Medium Risk</option>
          <option value="Low">Low Risk</option>
        </select>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-400">
            <thead className="bg-zinc-950/50 text-zinc-500 font-medium">
              <tr>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Outstanding Items</th>
                <th className="px-6 py-4 text-right">Total Debt</th>
                <th className="px-6 py-4 text-center">Risk Level</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {filteredDebtors.map(debtor => (
                <tr key={debtor.id} className="hover:bg-zinc-800/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-zinc-200">{debtor.name}</div>
                    <div className="text-xs text-zinc-500">{debtor.phone}</div>
                  </td>
                  <td className="px-6 py-4">
                    {debtor.unpaidShipments > 0 && <div>{debtor.unpaidShipments} Shipping Fees</div>}
                    {debtor.unpaidRegistrations > 0 && <div>{debtor.unpaidRegistrations} Registrations</div>}
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-white">
                    ₵{debtor.totalDebt.toLocaleString(undefined, {minimumFractionDigits: 2})}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold ${
                      debtor.riskLevel === 'High' ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' :
                      debtor.riskLevel === 'Medium' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                      'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                    }`}>
                      {debtor.riskLevel === 'High' && <ShieldAlert className="w-3.5 h-3.5" />}
                      {debtor.riskLevel}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-zinc-300 transition-colors" title="Send Reminder">
                      <Bell className="w-4 h-4" />
                    </button>
                    <button className="p-2 bg-rose-500/10 hover:bg-rose-500/20 rounded-lg text-rose-500 transition-colors" title="Suspend Account">
                      <Ban className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              
              {filteredDebtors.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                    No debtors found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
