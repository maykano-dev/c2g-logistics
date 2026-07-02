import { createClient } from '@/utils/supabase/server';
import ReservationsClient from './reservations-client';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reservations Management | Admin',
};

export const dynamic = 'force-dynamic';

export default async function AdminReservationsPage() {
  const supabase = await createClient();
  
  // Fetch all reservations
  const { data: reservations, error } = await supabase
    .from('shipment_reservations')
    .select(`
      *,
      customers (
        first_name,
        last_name,
        email,
        phone
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching admin reservations:', error);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-white">Shipment Reservations</h1>
        <p className="text-zinc-400 text-sm">
          Manage and assign customer shipment reservations to cargo containers.
        </p>
      </div>
      
      <ReservationsClient initialReservations={reservations || []} />
    </div>
  );
}
