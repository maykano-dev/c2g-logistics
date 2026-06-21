'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Search, Filter, ShieldAlert, Edit, Plus } from 'lucide-react';
import { format } from 'date-fns';

export default function AdminTeamView() {
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    setLoading(true);
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('admins')
      .select('*, auth_user:user_id'); // Just basic select for now, since we don't have a direct relation to users table exported
      // Wait, admins table might not have user emails directly if it relies on auth.users. 
      // We will just show the admin data available.

    if (data && !error) {
      setAdmins(data);
    } else {
      console.error('Error fetching admins', error);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Team Access</h1>
          <p className="text-zinc-400">Manage administrator and employee privileges.</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors w-fit">
          <Plus className="w-4 h-4" /> Add Member
        </button>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto hidden md:block">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-950/50">
                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">User ID</th>
                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">2FA Status</th>
                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Role</th>
                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {loading ? (
                <tr><td colSpan={4} className="p-8 text-center text-zinc-500">Loading team...</td></tr>
              ) : admins.length === 0 ? (
                <tr><td colSpan={4} className="p-8 text-center text-zinc-500">No admins found.</td></tr>
              ) : (
                admins.map(admin => (
                  <tr key={admin.id} className="hover:bg-zinc-800/50 transition-colors group">
                    <td className="p-4">
                      <p className="text-sm text-white font-mono">{admin.user_id}</p>
                    </td>
                    <td className="p-4">
                      {admin.totp_enabled ? (
                        <span className="px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                          Enabled
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-red-500/10 text-red-500 border border-red-500/20">
                          Disabled
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 flex items-center gap-1 w-fit">
                        <ShieldAlert className="w-3 h-3" /> Super Admin
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button className="p-2 text-indigo-400 hover:text-white hover:bg-indigo-500/20 rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
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
            <div className="p-8 text-center text-zinc-500">Loading team...</div>
          ) : admins.length === 0 ? (
            <div className="p-8 text-center text-zinc-500">No admins found.</div>
          ) : (
            admins.map(admin => (
              <div key={admin.id} className="p-4 flex flex-col gap-4 hover:bg-zinc-800/20 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex flex-col gap-1 pr-4 break-all">
                    <p className="text-sm text-white font-mono">{admin.user_id}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 flex items-center gap-1 w-fit">
                    <ShieldAlert className="w-3 h-3" /> Super Admin
                  </span>

                  <div className="flex items-center gap-3">
                    {admin.totp_enabled ? (
                      <span className="text-[10px] font-bold uppercase text-emerald-500">2FA On</span>
                    ) : (
                      <span className="text-[10px] font-bold uppercase text-red-500">2FA Off</span>
                    )}
                    <button className="p-2 text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded-lg transition-colors">
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
