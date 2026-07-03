import { LinkOrdersView } from '@/app/admin/(protected)/global-orders/link-orders/page';

export default function AgentLinkOrdersPage() {
  return (
    <div className="relative">
      <div className="absolute top-0 left-0 p-4 w-full z-10 pointer-events-none">
        <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 px-4 py-2 rounded-lg text-sm font-bold w-fit mx-auto shadow-lg backdrop-blur-md">
          Read-Only View (Support Role)
        </div>
      </div>
      {/* We pass readOnly to visual cues, but also wrap the table area in CSS that hides action columns if needed */}
      <LinkOrdersView readOnly={true} />
      
      {/* CSS injection to hide admin actions if readOnly is true (hack to avoid massively refactoring 600 line files) */}
      <style>{`
        /* Hide update status button, shipping fee inputs, etc. if needed */
        button[title="Update Status"],
        button:has(.lucide-save),
        button:has(.lucide-trash-2) {
          display: none !important;
        }
        input[type="number"],
        select {
          pointer-events: none;
          opacity: 0.7;
        }
      `}</style>
    </div>
  );
}
