import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import EditPackageForm from './edit-package-form';

export default async function EditPackagePage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/login');
  }

  const { data: pkg, error } = await supabase
    .from('shipments')
    .select('*')
    .eq('id', params.id)
    .eq('customer_id', user.id)
    .single();

  if (error || !pkg) {
    redirect('/dashboard/packages');
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Edit Package</h1>
        <p className="text-muted-foreground mt-2">Update your package details before it is confirmed in the warehouse.</p>
      </div>
      <EditPackageForm packageData={pkg} />
    </div>
  );
}
