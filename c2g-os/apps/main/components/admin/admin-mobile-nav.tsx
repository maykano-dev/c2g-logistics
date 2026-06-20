'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ADMIN_NAV_GROUPS } from './admin-navigation';
import { LogOut, ShieldAlert, Menu, X } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

export default function AdminMobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/admin';
  };

  return (
    <>
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-500/10 text-indigo-500 rounded-lg flex items-center justify-center">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <span className="font-bold text-white">C2G Admin</span>
        </div>
        <button 
          onClick={() => setIsOpen(true)}
          className="p-2 -mr-2 text-zinc-400 hover:text-white transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Drawer Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer Content */}
      <div 
        className={`fixed top-0 left-0 h-full w-72 bg-zinc-950 border-r border-zinc-800 z-50 transform transition-transform duration-300 ease-in-out flex flex-col pt-[env(safe-area-inset-top)] ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <span className="text-xs uppercase tracking-widest text-zinc-500 font-bold">Navigation</span>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 -mr-2 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-4">
          {ADMIN_NAV_GROUPS.map((group, index) => (
            <div key={index} className="space-y-1">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 px-3 mb-1">
                {group.group}
              </h3>
              {group.items.map((link) => {
                const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== '/admin/dashboard');
                const Icon = link.icon;
                
                return (
                  <Link 
                    key={link.name} 
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                      isActive 
                        ? 'bg-indigo-600 text-white font-medium' 
                        : 'text-zinc-400 hover:text-white active:bg-zinc-900'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-zinc-500'}`} />
                    <span className="text-sm">{link.name}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-zinc-800">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-colors font-medium text-sm"
          >
            <LogOut className="w-5 h-5" />
            Secure Logout
          </button>
        </div>
      </div>
    </>
  );
}
