import ReservationsClient from '@/app/admin/(protected)/operations/reservations/reservations-client';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reservations Management | Support',
};

export default function AgentReservationsPage() {
  return (
    <div className="space-y-6 relative">
      <div className="absolute top-0 right-0 z-10 pointer-events-none">
        <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 px-4 py-2 rounded-lg text-sm font-bold shadow-lg backdrop-blur-md">
          Read-Only View
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-white">Shipment Reservations</h1>
        <p className="text-zinc-400 text-sm">
          View customer shipment reservations.
        </p>
      </div>
      
      <ReservationsClient readOnly={true} />
    </div>
  );
}
