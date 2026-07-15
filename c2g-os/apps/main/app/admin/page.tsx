import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import AdminLogin from '@/components/admin/admin-login';

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    const { data: admin } = await supabase
      .from('admins')
      .select('totp_enabled')
      .eq('user_id', user.id)
      .single();

    if (admin) {
      const cookieStore = await cookies();
      const is2faVerified = cookieStore.get('admin_2fa_verified')?.value === 'true';

      if (!admin.totp_enabled || is2faVerified) {
        redirect('/admin/dashboard');
      }
    }
  }

  return <AdminLogin />;
}
