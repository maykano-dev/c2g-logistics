import { Metadata } from 'next';
import AgentDashboardClient from './overview-client';
import { getAgentDashboardStats } from './actions';

export const metadata: Metadata = {
  title: 'COS Dashboard Overview',
  description: 'C2G Customer Service Dashboard',
};

export const dynamic = 'force-dynamic';

export default async function AgentDashboardView() {
  const stats = await getAgentDashboardStats();

  return (
    <AgentDashboardClient stats={stats} />
  );
}
