import {
  LayoutDashboard,
  Activity,
  ShoppingCart,
  Store,
  PackageSearch,
  Users,
  PackageCheck,
  Megaphone,
  ShieldCheck,
  Settings,
  Ship,
  Plane,
  CreditCard,
  Wallet,
  Briefcase,
  CalendarClock,
  BarChart4,
  FileText,
  BadgeAlert,
  SearchCheck,
  Container,
  Link as LinkIcon
} from 'lucide-react';

export const ADMIN_NAV_GROUPS = [
  {
    group: 'Mission Control',
    items: [
      { name: 'Overview', href: '/admin/dashboard', icon: LayoutDashboard },
      { name: 'Operations Center', href: '/admin/mission-control', icon: Activity },
    ]
  },
  {
    group: 'Operations',
    items: [
      { name: 'Link Orders', href: '/admin/operations/link-orders', icon: LinkIcon },
      { name: 'Procurement (B4M)', href: '/admin/operations/procurement', icon: ShoppingCart },
      { name: 'China Warehouse', href: '/admin/operations/warehouse', icon: PackageCheck },
      { name: 'Shipments', href: '/admin/operations/shipments', icon: Ship },
    ]
  },
  {
    group: 'Commerce',
    items: [
      { name: 'Mall Orders', href: '/admin/commerce/mall-orders', icon: Store },
      { name: 'Products', href: '/admin/commerce/products', icon: PackageSearch },
      { name: 'Importers', href: '/admin/commerce/importers', icon: Users },
      { name: 'Marketing', href: '/admin/commerce/marketing', icon: Megaphone },
    ]
  },
  {
    group: 'Customers',
    items: [
      { name: 'User Management', href: '/admin/customers/users', icon: Users },
      { name: 'Support Tickets', href: '/admin/customers/support', icon: BadgeAlert },
      { name: 'Announcements', href: '/admin/customers/announcements', icon: Megaphone },
    ]
  },
  {
    group: 'Finance',
    items: [
      { name: 'Payments', href: '/admin/finance/payments', icon: CreditCard },
      { name: 'Revenue', href: '/admin/finance/revenue', icon: BarChart4 },
      { name: 'Withdrawals', href: '/admin/finance/withdrawals', icon: Wallet },
    ]
  },
  {
    group: 'People',
    items: [
      { name: 'Employees', href: '/admin/people/employees', icon: Briefcase },
      { name: 'Roles & Permissions', href: '/admin/people/roles', icon: ShieldCheck },
      { name: 'Attendance', href: '/admin/people/attendance', icon: CalendarClock },
    ]
  },
  {
    group: 'System & Analytics',
    items: [
      { name: 'Reports', href: '/admin/analytics/reports', icon: FileText },
      { name: 'Performance', href: '/admin/analytics/performance', icon: BarChart4 },
      { name: 'Global Settings', href: '/admin/system/settings', icon: Settings },
      { name: 'Audit Logs', href: '/admin/system/audit', icon: FileText },
    ]
  }
];
