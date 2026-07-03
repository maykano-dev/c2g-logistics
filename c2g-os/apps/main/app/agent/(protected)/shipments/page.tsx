import { ShipmentsView } from '@/app/admin/(protected)/operations/shipments/page';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shipments | Support',
};

export default function AgentShipmentsPage() {
  return (
    <div className="relative">
      <div className="absolute top-0 right-0 z-10 pointer-events-none mt-2 mr-2">
        <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 px-4 py-2 rounded-lg text-sm font-bold shadow-lg backdrop-blur-md">
          Read-Only View
        </div>
      </div>
      <ShipmentsView readOnly={true} />
      
      <style>{`
        button[title="Edit Shipment"],
        button:has(.lucide-plus),
        button:has(.lucide-save) {
          display: none !important;
        }
        select {
          pointer-events: none;
          opacity: 0.7;
        }
      `}</style>
    </div>
  );
}
