// Demo users — one per role (fictional)
import type { User } from '../types';

export const users: User[] = [
  { id: 1, name: 'Super Admin', email: 'superadmin@demo.example', password: 'demo123', role: 'SuperAdmin', warehouseId: 1 },
  { id: 2, name: 'Office Admin', email: 'officeadmin@demo.example', password: 'demo123', role: 'OfficeAdmin' },
  { id: 3, name: 'Warehouse Admin', email: 'warehouseadmin@demo.example', password: 'demo123', role: 'WarehouseAdmin', warehouseId: 2 },
  { id: 4, name: 'Viewer', email: 'viewer@demo.example', password: 'demo123', role: 'Viewer' },
];

export const warehouses = [
  { id: 1, name: 'Metro Manila DC' },
  { id: 2, name: 'Cebu Distribution Hub' },
];
