// Versioned localStorage layer — PhilGEPS Tracker Demo
import type { DemoMeta } from './types';

const PREFIX = 'pgd:v1:';
function key(suffix: string): string { return PREFIX + suffix; }

function read<T>(suffix: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key(suffix));
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch { return fallback; }
}

function write(suffix: string, value: unknown): void {
  try { localStorage.setItem(key(suffix), JSON.stringify(value)); }
  catch (e) { console.error('localStorage write failed:', e); throw e; }
}

export function getMeta(): DemoMeta {
  return read('meta', { schemaVersion: 1, seedId: 'seed-v1', bannerDismissed: false, tourDismissed: false, chartOrder: {}, });
}
export function setMeta(m: DemoMeta): void { write('meta', m); }
export function getSession(): { userId: number; role: import('./types').Role } | null {
  const raw = localStorage.getItem(key('session'));
  if (!raw) return null;
  try { return JSON.parse(raw) as { userId: number; role: import('./types').Role }; } catch { return null; }
}
export function setSession(s: { userId: number; role: import('./types').Role }): void { write('session', s); }
export function clearSession(): void { localStorage.removeItem(key('session')); }

export const collections: Record<string, string> = {
  projects: 'projects', lots: 'lots', keystages: 'keystages', items: 'items',
  packages: 'packages', packageContents: 'packageContents', schools: 'schools',
  projectSchools: 'projectSchools', deliveries: 'deliveries', packageStatuses: 'packageStatuses',
  users: 'users', warehouses: 'warehouses', invoices: 'invoices', documentChecklist: 'documentChecklist',
};
export function getCollection<T>(name: string): T[] { return read(collections[name], []); }
export function setCollection(name: string, data: unknown): void { write(collections[name], data); }
export function resetAll(): void {
  for (const n of Object.values(collections)) localStorage.removeItem(key(n));
  localStorage.removeItem(key('meta')); localStorage.removeItem(key('session'));
}
