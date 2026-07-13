import { use } from 'react';
import { getCustomerProfileData } from './actions';
import CustomerProfileClient from './customer-profile-client';

type CustomerPageProps = {
  params: Promise<{ id: string }>;
};

export default async function UnifiedCustomerViewerPage(props: CustomerPageProps) {
  // We use `await` but we also destructure carefully to avoid Next.js 15 Proxy trap
  // Adding extra lines to ensure Turbopack cache busting shifts the error line number
  // if it's still caching the old file.
  
  const p = await props.params;
  const customerId = p.id;
  
  const { customer, linkOrders, mallOrders, shipments } = await getCustomerProfileData(customerId);

  if (!customer) {
    return (
      <div className="p-8 text-center text-zinc-500 flex flex-col gap-4">
        <div>Customer not found in the system.</div>
        <div className="text-xs font-mono">Debug ID: {customerId}</div>
        <div className="text-xs font-mono">Service Key exists: {process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Yes' : 'No'}</div>
      </div>
    );
  }

  return (
    <CustomerProfileClient 
      customer={customer}
      linkOrders={linkOrders}
      mallOrders={mallOrders}
      shipments={shipments}
    />
  );
}
