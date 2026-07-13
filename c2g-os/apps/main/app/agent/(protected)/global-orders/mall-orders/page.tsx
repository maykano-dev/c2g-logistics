import { MallOrdersView } from '@/app/admin/(protected)/global-orders/mall-orders/page';

export default function AgentMallOrdersPage() {
  return (
    <div className="relative">
      <div className="absolute top-0 left-0 p-4 w-full z-10 pointer-events-none">
        <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 px-4 py-2 rounded-lg text-sm font-bold w-fit mx-auto shadow-lg backdrop-blur-md">
          Read-Only View (Support Role)
        </div>
      </div>
      <MallOrdersView readOnly={true} />
      
      <style>{`
        button[title="Update Status"],
        button:has(.lucide-save),
        button:has(.lucide-trash-2) {
          display: none !important;
        }
        input[type="number"] {
          pointer-events: none;
          opacity: 0.7;
        }
      `}</style>
    </div>
  );
}
