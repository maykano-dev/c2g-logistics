import { getCustomerProfileData } from './actions';
import CustomerProfileClient from './customer-profile-client';

export default async function UnifiedCustomerViewerPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  
  const { customer, linkOrders, mallOrders, shipments } = await getCustomerProfileData(id);

  if (!customer) {
    return (
      <div className="p-8 text-center text-zinc-500 flex flex-col gap-4">
        <div>Customer not found in the system.</div>
        <div className="text-xs font-mono">Debug ID: {id}</div>
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
