import { Metadata } from 'next';
import ScannerClient from './scanner-client';

export const metadata: Metadata = {
  title: 'Warehouse Scanner | C2G Logistics',
  description: 'Fast barcode scanner for warehouse operations',
};

export default function ScannerPage() {
  return (
    <div className="min-h-screen bg-black">
      <ScannerClient />
    </div>
  );
}
