import { getCustomerProfileData } from './actions';
import CustomerProfileClient from './customer-profile-client';

export default async function UnifiedCustomerViewerPage({ params }: { params: { id: string } }) {
  const { id } = params;
  
  const { customer, linkOrders, mallOrders, shipments } = await getCustomerProfileData(id);

  if (!customer) {
    return <div className="p-8 text-center text-zinc-500">Customer not found in the system.</div>;
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
