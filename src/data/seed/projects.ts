// Projects seed data — 3 projects
import type { Project } from '../types';

export const projects: Project[] = [
  {
    id: 1, refNo: 'DEP-2024-001', name: 'Bayanihan Elementary Supplies', agency: 'DepEd',
    contractAmount: 500000, abc: 450000, startDate: '2024-01-15', endDate: '2024-06-30',
    status: 'Ongoing', keystage: true,
  },
  {
    id: 2, refNo: 'DPWH-2024-015', name: 'Valley Public School Infrastructure', agency: 'DPWH',
    contractAmount: 1200000, abc: 1100000, startDate: '2024-02-01', endDate: '2024-08-31',
    status: 'Ongoing', keystage: false,
  },
  {
    id: 3, refNo: 'DEP-2024-032', name: 'Pacyum Elementary Teaching Materials', agency: 'DepEd',
    contractAmount: 320000, abc: 300000, startDate: '2024-03-10', endDate: '2024-09-15',
    status: 'Delivered', keystage: false,
  },
];
