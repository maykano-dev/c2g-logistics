import { 
  LayoutDashboard, 
  Ticket,
  Users,
  Store,
  Ship,
  MessageSquare,
  AlertTriangle,
  Radio,
  Settings,
  BookOpen,
  Box,
  Truck,
  Link as LinkIcon
} from 'lucide-react';

export const AGENT_NAV_GROUPS = [
  {
    group: 'Workspace',
    items: [
      { name: 'Dashboard Overview', href: '/agent/dashboard', icon: LayoutDashboard },
    ]
  },
  {
    group: 'Logistics',
    items: [
      { name: 'Shipments', href: '/agent/shipments', icon: Ship },
      { name: 'Reservations', href: '/agent/reservations', icon: Truck },
    ]
  },
  {
    group: 'Commerce',
    items: [
      { name: 'Link Orders', href: '/agent/global-orders/link-orders', icon: LinkIcon },
      { name: 'Mall Orders', href: '/agent/global-orders/mall-orders', icon: Store },
    ]
  },
  {
    group: 'People',
    items: [
      { name: 'User Management', href: '/agent/customers/users', icon: Users },
      { name: 'Announcements', href: '/agent/announcements', icon: Radio },
    ]
  },
  {
    group: 'Action Center',
    items: [
      { name: 'Reference Center', href: '/agent/reference', icon: BookOpen },
    ]
  }
];
