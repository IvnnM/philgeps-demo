// Seed data — schools and deliveries
import type { School } from '../types';

export const schools: School[] = [
  { id: 1, name: 'San Isidro National School', address: '123 Main St', contactPerson: 'Juan Dela Cruz', contactNo: '09123456789', municipality: 'Manila', division: 'Manila', region: 'National Capital Region' },
  { id: 2, name: 'Luzon East Elementary', address: '456 East Ave', contactPerson: 'Maria Santos', contactNo: '09123456789', municipality: 'Quezon City', division: 'Manila', region: 'National Capital Region' },
  { id: 3, name: 'Luzon West Elementary', address: '789 West Ave', contactPerson: 'Pedro Reyes', contactNo: '09123456789', municipality: 'Taguig', division: 'Manila', region: 'National Capital Region' },
  { id: 4, name: 'Luzon North Elementary', address: '321 North Blvd', contactPerson: 'Ana Bautista', contactNo: '09123456789', municipality: 'Marikina', division: 'Manila', region: 'National Capital Region' },
  { id: 5, name: 'Luzon South Elementary', address: '654 South Rd', contactPerson: 'Carlos Gomez', contactNo: '09123456789', municipality: 'Pasig', division: 'Manila', region: 'National Capital Region' },
  { id: 6, name: 'Luzon Central Elementary', address: '987 Central Blvd', contactPerson: 'Luz Dizon', contactNo: '09123456789', municipality: 'Valenzuela', division: 'Manila', region: 'National Capital Region' },
  { id: 7, name: 'Luzon East Secondary', address: '111 East Ave', contactPerson: 'Rico Cruz', contactNo: '09123456789', municipality: 'Pasay', division: 'Manila', region: 'National Capital Region' },
  { id: 8, name: 'Luzon West Secondary', address: '222 West Blvd', contactPerson: 'Lita Martin', contactNo: '09123456789', municipality: 'Parañaque', division: 'Manila', region: 'National Capital Region' },
  { id: 9, name: 'Luzon North Elementary', address: '333 North Rd', contactPerson: 'Omar Cruz', contactNo: '09123456789', municipality: 'Malabon', division: 'Manila', region: 'National Capital Region' },
  { id: 10, name: 'Luzon South Secondary', address: '444 South Ave', contactPerson: 'Lia Galvez', contactNo: '09123456789', municipality: 'Pateros', division: 'Manila', region: 'National Capital Region' },
  { id: 11, name: 'Visayas Central Elementary', address: '555 Central Blvd', contactPerson: 'Rina Navarro', contactNo: '09123456789', municipality: 'Iloilo', division: 'Western Visayas', region: 'Visayas' },
  { id: 12, name: 'Visayas East Elementary', address: '666 East Ave', contactPerson: 'Ramon Villanueva', contactNo: '09123456789', municipality: 'Cebu', division: 'Central Visayas', region: 'Visayas' },
  { id: 13, name: 'Visayas West Elementary', address: '777 West Ave', contactPerson: 'Lily Tan', contactNo: '09123456789', municipality: 'Iloilo', division: 'Western Visayas', region: 'Visayas' },
  { id: 14, name: 'Visayas South Elementary', address: '888 South St', contactPerson: 'Marites Lim', contactNo: '09123456789', municipality: 'Iloilo', division: 'Western Visayas', region: 'Visayas' },
  { id: 15, name: 'Visayas North Elementary', address: '999 North Blvd', contactPerson: 'Santos Gutierrez', contactNo: '09123456789', municipality: 'Bohol', division: 'Central Visayas', region: 'Visayas' },
  { id: 16, name: 'Mindanao East Elementary', address: '1010 East Ave', contactPerson: 'Manny Dayao', contactNo: '09123456789', municipality: 'Davao', division: 'Davao Region', region: 'Mindanao' },
  { id: 17, name: 'Mindanao West Elementary', address: '202 West Blvd', contactPerson: 'Lily Davao', contactNo: '09123456789', municipality: 'Davao', division: 'Davao Region', region: 'Mindanao' },
  { id: 18, name: 'Mindanao South Elementary', address: '303 South Ave', contactPerson: 'Jomar Magsaysay', contactNo: '09123456789', municipality: 'Davao', division: 'Davao Region', region: 'Mindanao' },
  { id: 19, name: 'Mindanao North Elementary', address: '404 North Blvd', contactPerson: 'Leah Manalo', contactNo: '09123456789', municipality: 'Cotabato', division: 'SOCCSKSARGEN', region: 'Mindanao' },
  { id: 20, name: 'Mindanao Central Elementary', address: '505 Central Blvd', contactPerson: 'Rizal Uy', contactNo: '09123456789', municipality: 'Zamboanga', division: 'Zamboanga Peninsula', region: 'Mindanao' },
];

export const initialData = {
  projects: [],
  schools,
  deliveries: [],
  users: [],
  warehouses: [],
};
