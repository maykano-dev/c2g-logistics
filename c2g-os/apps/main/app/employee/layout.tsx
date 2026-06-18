import { ReactNode } from 'react';
import Link from 'next/link';
import { Package, Truck, LayoutDashboard, Settings, UserCircle, LifeBuoy, DollarSign, Target, Activity } from 'lucide-react';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function EmployeeLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch role from a dedicated employees or admins table.
  // We use a safe fallback role 'unassigned' if they are not in the system yet.
  const { data: adminData } = await supabase
    .from('admins')
    .select('role')
    .eq('user_id', user.id)
    .single();

  const role = adminData?.role || 'unassigned';

  // Define visible routes based on role
  const getNavLinks = (role: string) => {
    const links = [
      { name: 'Action Center', href: '/employee', icon: Target },
      { name: 'My Attendance', href: '/employee/hr', icon: UserCircle },
    ];

    if (role === 'super_admin' || role === 'manager') {
      links.push({ name: 'Admin Dashboard', href: '/admin/dashboard', icon: LayoutDashboard });
      links.push({ name: 'Issue Center', href: '/employee/issues', icon: LifeBuoy });
    }

    if (role === 'china_warehouse' || role === 'super_admin' || role === 'manager') {
      links.push({ name: 'Scanner UI', href: '/employee/warehouse', icon: Package });
    }

    if (role === 'ghana_ops' || role === 'super_admin' || role === 'manager') {
      links.push({ name: 'My Queue', href: '/employee/queue', icon: LifeBuoy });
      links.push({ name: 'Dispatch Tracking', href: '/employee/dispatch', icon: Truck });
    }

    if (role === 'procurement' || role === 'super_admin' || role === 'manager') {
      links.push({ name: 'Procurement Pipeline', href: '/employee/procurement', icon: DollarSign });
    }

    return links;
  };

  const navLinks = getNavLinks(role);

  return (
    <div className="flex h-screen bg-black overflow-hidden">
      {/* Specialized Employee Sidebar */}
      <aside className="w-64 border-r border-zinc-800 bg-[#0c0c0e] flex flex-col shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-zinc-800">
          <span className="text-xl font-black text-white tracking-tighter">
            C2G <span className="text-indigo-500">Workspace</span>
          </span>
        </div>
        
        <div className="p-4 border-b border-zinc-800 bg-zinc-950/50">
          <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mb-1">Assigned Role</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-sm font-bold text-white uppercase tracking-wider">{role.replace('_', ' ')}</span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          <p className="px-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 mt-4">My Workflow</p>
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-zinc-400 rounded-lg hover:text-white hover:bg-zinc-800/50 transition-colors">
              <link.icon className="w-4 h-4" />
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-zinc-800">
           <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-zinc-400 rounded-lg hover:text-white hover:bg-zinc-800/50 transition-colors">
              <Settings className="w-4 h-4" />
              Settings & Security
           </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <div className="flex-1 p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
