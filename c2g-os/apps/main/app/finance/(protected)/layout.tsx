import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import FinanceSidebar from '@/components/finance/sidebar';

export default async function FinanceProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/finance/login');
  }

  // 1. Check if user is a Master Admin
  const { data: admin } = await supabase
    .from('admins')
    .select('id')
    .eq('user_id', user.id)
    .single();

  // 2. Check if user is a Finance Employee
  const { data: financeRole } = await supabase
    .from('finance_roles')
    .select('role')
    .eq('user_id', user.id)
    .single();

  if (!admin && !financeRole) {
    // Neither a Master Admin nor a Finance employee
    redirect('/'); 
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 flex overflow-x-hidden w-full selection:bg-indigo-500/30">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-72 shrink-0 border-r border-zinc-800 bg-zinc-950 fixed h-full z-10">
        <FinanceSidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-72 flex flex-col min-h-screen w-full min-w-0">
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 w-full overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
