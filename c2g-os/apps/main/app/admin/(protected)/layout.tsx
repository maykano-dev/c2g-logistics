import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import AdminSidebar from '@/components/admin/admin-sidebar';
import AdminMobileNav from '@/components/admin/admin-mobile-nav';

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin');
  }

  // Verify Admin status
  const { data: admin } = await supabase
    .from('admins')
    .select('totp_enabled')
    .eq('user_id', user.id)
    .single();

  if (!admin) {
    redirect('/'); // Normal users shouldn't even know this exists
  }

  // Enforce 2FA Cookie
  const cookieStore = await cookies();
  const is2faVerified = cookieStore.get('admin_2fa_verified')?.value === 'true';

  if (admin.totp_enabled && !is2faVerified) {
    redirect('/admin');
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 flex overflow-x-hidden w-full">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-72 shrink-0 border-r border-zinc-800 bg-zinc-950 fixed h-full z-10">
        <AdminSidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-72 flex flex-col min-h-screen w-full min-w-0">
        {/* Mobile Header/Nav */}
        <div className="lg:hidden sticky top-0 z-20">
          <AdminMobileNav />
        </div>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 w-full overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
