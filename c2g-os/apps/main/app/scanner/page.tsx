import { Metadata } from 'next';
import ScannerClient from './scanner-client';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Warehouse Scanner | C2G Logistics',
  description: 'Fast barcode scanner for warehouse operations',
};

export default async function ScannerPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/scanner/login');
  }

  // Check for admin role
  const { data: admin } = await supabase
    .from('admins')
    .select('role')
    .eq('user_id', user.id)
    .maybeSingle();

  // Check for employee role
  const { data: employee } = await supabase
    .from('employees')
    .select('staff_role, status')
    .eq('user_id', user.id)
    .maybeSingle();

  const isAdmin = admin && ['super_admin', 'manager', 'china_warehouse'].includes(admin.role);
  const isWarehouseStaff = employee && employee.status === 'approved' && employee.staff_role === 'warehouse';

  if (!isAdmin && !isWarehouseStaff) {
    redirect('/dashboard');
  }

  return (
    <div className="fixed inset-0 bg-black flex flex-col overflow-hidden">
      <ScannerClient />
    </div>
  );
}
