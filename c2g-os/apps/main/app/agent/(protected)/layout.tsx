import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import AgentSidebar from '@/components/agent/agent-sidebar';
import AgentMobileNav from '@/components/agent/agent-mobile-nav';

export default async function AgentProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Check if they are a super admin first, so you can test it without being an employee
  const { data: admin } = await supabase
    .from('admins')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!admin) {
    // If not an admin, verify they are a C2G employee
    const { data: employee } = await supabase
      .from('employees')
      .select('staff_role, status')
      .eq('id', user.id)
      .single();

    if (!employee || employee.status !== 'active') {
      redirect('/dashboard'); 
    }

    const allowedRoles = ['customer_service', 'admin', 'founder', 'manager'];
    if (!allowedRoles.includes(employee.staff_role)) {
      redirect('/dashboard');
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 flex overflow-x-hidden w-full">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-72 shrink-0 border-r border-zinc-800 bg-zinc-950 fixed h-full z-10">
        <AgentSidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-72 flex flex-col min-h-screen w-full min-w-0">
        {/* Mobile Header/Nav */}
        <div className="lg:hidden sticky top-0 z-20">
          <AgentMobileNav />
        </div>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 w-full overflow-x-hidden relative">
          {children}
        </main>
      </div>
    </div>
  );
}
