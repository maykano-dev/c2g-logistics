import { Metadata } from 'next';
import WarehouseLoginClient from './warehouse-login-client';

export const metadata: Metadata = {
  title: 'Warehouse Portal Login | C2G Logistics',
  description: 'Login to the C2G Logistics China Warehouse Dashboard',
};

export default function WarehouseLoginPage() {
  return <WarehouseLoginClient />;
}
