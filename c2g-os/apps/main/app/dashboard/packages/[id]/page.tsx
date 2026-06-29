import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import TrackerClient from './tracker-client';
import Link from 'next/link';
import { getRegistrationFee } from '../actions';

export default async function PackageTrackingPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  // Fetch the shipment details
  const { data: pkg, error } = await supabase
    .from('shipments')
    .select('*')
    .eq('id', resolvedParams.id)
    .eq('customer_id', user.id)
    .single();

  const { data: wallet } = await supabase
    .from('wallets')
    .select('available_balance')
    .eq('customer_id', user.id)
    .single();
    
  const walletBalance = wallet ? parseFloat(wallet.available_balance || 0) : 0;

  if (error || !pkg) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4">
        <h2 className="text-2xl font-bold">Package Not Found</h2>
        <p className="text-muted-foreground">This package doesn't exist or you don't have permission to view it.</p>
        <Link href="/dashboard/packages" className="text-primary hover:underline">
          Return to Packages
        </Link>
      </div>
    );
  }

  const registrationFee = await getRegistrationFee();

  return <TrackerClient pkg={pkg} walletBalance={walletBalance} registrationFee={registrationFee} />;
}
