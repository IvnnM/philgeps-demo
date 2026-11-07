// Roles module — single source for navigation, landing, access, controls
import type { Role, DeliveryStatus } from '../data/types';
export const ROLES: Record<Role, { name: string; description: string; nav: string[] }> = {
  SuperAdmin: { name: 'Super Admin', description: 'All in-scope areas (Dashboard, Projects, Deliveries, Users)', nav: ['dashboard', 'projects', 'deliveries', 'users'] },
  OfficeAdmin: { name: 'Office Admin', description: 'Dashboard, Projects, Deliveries', nav: ['dashboard', 'projects', 'deliveries'] },
  WarehouseAdmin: { name: 'Warehouse Admin', description: 'Deliveries (view, add, edit)', nav: ['deliveries'] },
  Viewer: { name: 'Viewer', description: 'Read-only access to Projects and Deliveries', nav: ['projects', 'deliveries'] },
};
export const IN_SCOPE_NAV = ['dashboard', 'projects', 'deliveries', 'users', 'scan', 'print'];
export function canAccess(role: Role, item: string): boolean {
  if (item === 'users') return role === 'SuperAdmin';
  if (item === 'scan' || item === 'print') return true;
  return ROLES[role].nav.includes(item);
}
export function getLandingPage(role: Role): string {
  switch (role) {
    case 'SuperAdmin':
    case 'OfficeAdmin':
      return '/dashboard';
    case 'WarehouseAdmin':
      return '/deliveries';
    case 'Viewer':
      return '/projects';
    default:
      return '/dashboard';
  }
}
export const CONTROLS = {
  canEditProjects: (r: Role) => r === 'SuperAdmin' || r === 'OfficeAdmin',
  canEditDeliveries: (r: Role) => r === 'SuperAdmin' || r === 'OfficeAdmin' || r === 'WarehouseAdmin',
  canSetAccepted: (r: Role) => r === 'WarehouseAdmin',
  canManageUsers: (r: Role) => r === 'SuperAdmin',
  canAddDeliveries: (r: Role) => r === 'SuperAdmin' || r === 'OfficeAdmin' || r === 'WarehouseAdmin',
  canEditStatus: (r: Role, s: DeliveryStatus) => (s === 'Accepted') ? r === 'WarehouseAdmin' : r === 'SuperAdmin' || r === 'OfficeAdmin' || r === 'WarehouseAdmin',
  canViewUsers: (r: Role) => r === 'SuperAdmin',
  canResetDemo: (_r: Role) => true,
  canSetTitleAccepted: (r: Role) => r === 'SuperAdmin' || r === 'OfficeAdmin' || r === 'WarehouseAdmin',
} as const;
