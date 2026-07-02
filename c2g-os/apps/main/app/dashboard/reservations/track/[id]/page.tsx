import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import TrackerClient from '../../../packages/[id]/tracker-client';
import Link from 'next/link';

export default async function ReservationTrackingPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  // Fetch the reservation details
  const { data: reservation, error } = await supabase
    .from('shipment_reservations')
    .select('*')
    .eq('id', resolvedParams.id)
    .eq('customer_id', user.id)
    .single();

  const { data: wallet } = await supabase
    .from('wallets')
    .select('available_balance')
    .eq('customer_id', user.id)
    .single();
    
  const walletBalance = wallet ? parseFloat(wallet.available_balance || '0') : 0;

  if (error || !reservation) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4">
        <h2 className="text-2xl font-bold">Reservation Not Found</h2>
        <p className="text-muted-foreground">This reservation doesn't exist or you don't have permission to view it.</p>
        <Link href="/dashboard/reservations" className="text-primary hover:underline">
          Return to Reservations
        </Link>
      </div>
    );
  }

  // Map reservation to pkg format expected by TrackerClient
  const hasStarted = ['in_transit', 'arrived_ghana', 'ready_for_pickup', 'completed'].includes(reservation.status);
  
  const pkg = {
    id: reservation.id,
    tracking_number: reservation.tracking_number || reservation.id,
    items_description: `Reservation containing ${reservation.total_items} items`,
    method: reservation.shipping_mode,
    shipment_start_date: hasStarted ? reservation.updated_at : null,
    status: reservation.status,
    registration_fee_paid: null, // Bypass the registration fee lock
    weight: 'See Items',
    cbm: 'See Items',
    created_at: reservation.created_at
  };

  return (
    <TrackerClient 
      pkg={pkg} 
      walletBalance={walletBalance} 
      registrationFee={0} 
      backLink="/dashboard/reservations" 
      backLabel="Back to Reservations" 
    />
  );
}
