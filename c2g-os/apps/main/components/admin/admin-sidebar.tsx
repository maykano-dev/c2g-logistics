'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ADMIN_NAV_GROUPS } from './admin-navigation';
import { LogOut, ShieldAlert } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    // clear the 2FA cookie by forcing a reload to /admin
    window.location.href = '/admin';
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-zinc-800 flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-500/10 text-indigo-500 rounded-xl flex items-center justify-center">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">C2G Admin</h1>
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">Super User</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-6">
        {ADMIN_NAV_GROUPS.map((group, index) => (
          <div key={index} className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-4 mb-2">
              {group.group}
            </h3>
            <div className="space-y-1">
              {group.items.map((link) => {
                const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== '/admin/dashboard');
                const Icon = link.icon;
                
                return (
                  <Link 
                    key={link.name} 
                    href={link.href}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${
                      isActive 
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20 font-medium' 
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-zinc-500'}`} />
                    <span className="text-sm">{link.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-zinc-800">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-colors font-medium text-sm"
        >
          <LogOut className="w-5 h-5" />
          Secure Logout
        </button>
      </div>
    </div>
  );
}
