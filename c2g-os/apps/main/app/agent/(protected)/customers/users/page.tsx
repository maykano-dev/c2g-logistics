import AdminCustomersView from '@/app/admin/(protected)/customers/users/page';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Customer Management | Support',
};

export default function AgentCustomersPage() {
  return (
    <>
      <AdminCustomersView />
    </>
  );
}
