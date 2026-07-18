import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import EditPackageForm from './edit-package-form';

export default async function EditPackagePage(props: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await props.params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      redirect('/login');
    }

    const { data: pkg, error } = await supabase
      .from('shipments')
      .select('*')
      .eq('id', id)
      .eq('customer_id', user.id)
      .single();

    if (error || !pkg) {
      console.error("Edit package query error:", error, "id:", id, "user_id:", user.id);
      return (
        <div className="max-w-3xl mx-auto space-y-6 pb-20 p-8 text-center text-red-500">
          <h1 className="text-2xl font-bold">Error loading package</h1>
          <p>{error?.message || "Package not found or you do not have permission."}</p>
          <p className="text-sm text-zinc-500">ID: {id}</p>
        </div>
      );
    }

    return (
      <div className="max-w-3xl mx-auto space-y-6 pb-20">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Edit Package</h1>
          <p className="text-muted-foreground mt-2">Update your package details before it is confirmed in the warehouse.</p>
        </div>
        <EditPackageForm packageData={JSON.parse(JSON.stringify(pkg))} />
      </div>
    );
  } catch (err: any) {
    if (err?.message === 'NEXT_REDIRECT') throw err; // Allow redirects to pass through
    return (
      <div className="p-8 text-center text-red-500">
        <h1 className="text-2xl font-bold">Critical Server Error</h1>
        <p className="font-mono text-sm mt-4 bg-black/10 p-4 rounded">{err?.message || String(err)}</p>
        <p className="font-mono text-xs mt-2 text-left bg-black/10 p-4 rounded overflow-auto whitespace-pre">{err?.stack}</p>
      </div>
    );
  }
}
