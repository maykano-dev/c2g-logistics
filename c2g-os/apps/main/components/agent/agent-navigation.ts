import { 
  LayoutDashboard, 
  Ticket,
  Users,
  Store,
  Ship,
  MessageSquare,
  AlertTriangle,
  Radio,
  BarChart4,
  Settings,
  BookOpen
} from 'lucide-react';

export const AGENT_NAV_GROUPS = [
  {
    group: 'Workspace',
    items: [
      { name: 'Dashboard Overview', href: '/agent/dashboard', icon: LayoutDashboard },
      { name: 'Support Tickets', href: '/agent/tickets', icon: Ticket },
      { name: 'Conversations', href: '/agent/conversations', icon: MessageSquare },
    ]
  },
  {
    group: 'Customer Data',
    items: [
      { name: 'Customers', href: '/agent/customers', icon: Users },
      { name: 'Customer Orders', href: '/agent/orders', icon: Store },
      { name: 'Shipments', href: '/agent/shipments', icon: Ship },
    ]
  },
  {
    group: 'Action Center',
    items: [
      { name: 'Escalations', href: '/agent/escalations', icon: AlertTriangle },
      { name: 'Broadcasts', href: '/agent/broadcasts', icon: Radio },
      { name: 'Reference Center', href: '/agent/reference', icon: BookOpen },
    ]
  },
  {
    group: 'System',
    items: [
      { name: 'Analytics', href: '/agent/analytics', icon: BarChart4 },
      { name: 'Settings', href: '/agent/settings', icon: Settings },
    ]
  }
];
