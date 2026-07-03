import ReservationsClient from './reservations-client';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reservations Management | Admin',
};

export default function AdminReservationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-white">Shipment Reservations</h1>
        <p className="text-zinc-400 text-sm">
          Manage and assign customer shipment reservations to cargo containers.
        </p>
      </div>
      
      <ReservationsClient />
    </div>
  );
}
