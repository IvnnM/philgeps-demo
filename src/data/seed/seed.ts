/**
 * Seed data initialization — ensures localStorage has demo data on first run
 */

import { getCollection, setCollection } from '../db';
import { users } from './users';
import { projects } from './projects';
import { schools } from './seed-data';

export function seedDemoData(): void {
  // Seed users into localStorage if empty
  if (getCollection('users').length === 0) {
    setCollection('users', users);
  }

  // Seed projects into localStorage if empty
  if (getCollection('projects').length === 0) {
    setCollection('projects', projects);
  }

  // Seed schools into localStorage if empty
  if (getCollection('schools').length === 0) {
    setCollection('schools', schools);
  }

  // Seed packages, lots, keystages, items, etc. into localStorage if empty
  if (getCollection('lots').length === 0) {
    const lots = [
      { id: 1, projectId: 1, name: 'Lot 1', contractNo: 'DEP-2024-001-L1' },
      { id: 2, projectId: 1, name: 'Lot 2', contractNo: 'DEP-2024-001-L2' },
      { id: 3, projectId: 2, name: 'Lot 1', contractNo: 'DPWH-2024-015-L1' },
      { id: 4, projectId: 3, name: 'Lot 1', contractNo: 'DEP-2024-032-L1' },
    ];
    setCollection('lots', lots);
  }

  if (getCollection('keystages').length === 0) {
    const keystages = [
      { id: 1, projectId: 1, lotId: 1, num: 1, description: 'KS-L1' },
      { id: 2, projectId: 1, lotId: 2, num: 1, description: 'KS-L2' },
      { id: 3, projectId: 2, lotId: 3, num: 1, description: 'KS-L3' },
    ];
    setCollection('keystages', keystages);
  }

  if (getCollection('items').length === 0) {
    const items = [
      { id: 1, projectId: 1, name: 'Notebook', unit: 'pcs', supplierCost: 50 },
      { id: 2, projectId: 1, name: 'Pen', unit: 'pcs', supplierCost: 10 },
      { id: 3, projectId: 2, name: 'Table', unit: 'pcs', supplierCost: 5000 },
      { id: 4, projectId: 2, name: 'Chair', unit: 'pcs', supplierCost: 3000 },
    ];
    setCollection('items', items);
  }

  if (getCollection('packages').length === 0) {
    const packages = [
      { id: 1, lotId: 1, num: 100, width: 30, height: 20, length: 15 },
      { id: 2, lotId: 2, num: 50, width: 30, height: 20, length: 15 },
      { id: 3, lotId: 3, num: 200, width: 40, height: 25, length: 20 },
    ];
    setCollection('packages', packages);
  }

  if (getCollection('packageContents').length === 0) {
    const contents = [
      { packageId: 1, itemId: 1, qty: 50 },
      { packageId: 2, itemId: 1, qty: 20 },
      { packageId: 2, itemId: 2, qty: 30 },
    ];
    setCollection('packageContents', contents);
  }

  if (getCollection('packageStatuses').length === 0) {
    const statuses = [
      { id: 1, deliveryId: 1, packageId: 1, status: 'pending' },
      { id: 2, deliveryId: 1, packageId: 2, status: 'pending' },
    ];
    setCollection('packageStatuses', statuses);
  }

  if (getCollection('deliveries').length === 0) {
    const deliveries = [
      { id: 1, projectId: 1, schoolId: 1, lotId: 1, keystageId: 1, packageType: 'C1', drNo: 'DR-2024-001', deliveryDate: '2024-03-15', status: 'Accepted', createdAt: '2024-03-15T10:00:00Z' },
      { id: 2, projectId: 1, schoolId: 2, lotId: 2, keystageId: 1, packageType: 'C1', drNo: 'DR-2024-002', deliveryDate: '2024-03-16', status: 'Accepted', createdAt: '2024-03-16T10:00:00Z' },
    ];
    setCollection('deliveries', deliveries);
  }

  if (getCollection('invoices').length === 0) {
    const invoices = [
      { id: 1, projectId: 1, invoiceNo: 'INV-2024-001', amount: 500000, status: 'Paid', date: '2024-04-01' },
      { id: 2, projectId: 2, invoiceNo: 'INV-2024-015', amount: 1200000, status: 'Paid', date: '2024-05-01' },
    ];
    setCollection('invoices', invoices);
  }

  if (getCollection('documentChecklist').length === 0) {
    const checklist = [
      { projectId: 1, docType: 'acknowledgement-receipt', status: 'pending' },
      { projectId: 1, docType: 'packing-label', status: 'pending' },
      { projectId: 1, docType: 'reports-report', status: 'pending' },
    ];
    setCollection('documentChecklist', checklist);
  }

  // REMOVED: Auto-login has been removed. Users must log in manually.
  // No session is set on fresh browser visit.
}
