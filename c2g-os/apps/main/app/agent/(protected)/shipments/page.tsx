import { ShipmentsView } from '@/app/admin/(protected)/operations/shipments/page';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shipments | Support',
};

export default function AgentShipmentsPage() {
  return (
    <div>
      <div className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-4 py-2 rounded-lg text-sm font-bold mb-6 flex items-center justify-between">
        <span>Support Mode Active</span>
        <span className="opacity-75 text-xs font-normal tracking-wide">You have full permissions to manage shipments here.</span>
      </div>
      <ShipmentsView />
    </div>
  );
}
