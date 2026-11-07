// Vitest setup — mocks localStorage BEFORE any module imports
// This file is loaded by vitest.config.ts via setupFiles

import { beforeEach } from 'vitest';

// Create a mock localStorage implementation
const localStorageMock = (() => {
  let store: { [key: string]: string } = {};

  return {
    getItem: (key: string): string | null => {
      return store[key] || null;
    },
    setItem: (key: string, value: string): void => {
      store[key] = value;
    },
    removeItem: (key: string): void => {
      delete store[key];
    },
    clear: (): void => {
      store = {};
    },
    get length(): number {
      return Object.keys(store).length;
    },
    key: (index: number): string | null => {
      const keys = Object.keys(store);
      return keys[index] || null;
    },
  };
})();

// Override localStorage on globalThis BEFORE any module loads
Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
  writable: true,
  configurable: true,
});

// Import the db module (synchronously)
import { setCollection } from '../../src/data/db';

// Import the seed data (synchronously)
import { users, projects, warehouses, schools, deliveries, lots, keystages, items, packages, packageContents, projectSchools, packageStatuses, invoices, documentChecklist } from '../../src/data/seed/index';

// Seed demo data before each test
beforeEach(() => {
  localStorageMock.clear();

  setCollection('users', users);
  setCollection('projects', projects);
  setCollection('warehouses', warehouses);
  setCollection('schools', schools);
  setCollection('deliveries', deliveries);
  setCollection('lots', lots);
  setCollection('keystages', keystages);
  setCollection('items', items);
  setCollection('packages', packages);
  setCollection('packageContents', packageContents);
  setCollection('projectSchools', projectSchools);
  setCollection('packageStatuses', packageStatuses);
  setCollection('invoices', invoices);
  setCollection('documentChecklist', documentChecklist);
});
