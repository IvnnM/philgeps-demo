// IndexedDB photo store — PhilGEPS Tracker Demo
import { openDB } from 'idb';
import type { IDBPDatabase } from 'idb';
import type { DeliveryPhoto } from './types';

const DB_NAME = 'pgd-photos';
const DB_VERSION = 1;
const STORE = 'photos';
let db: IDBPDatabase | null = null;

export function getDB(): IDBPDatabase {
  if (db) return db;
  getDBPromise().then(d => { db = d; });
  return db!;
}

function getDBPromise(): Promise<IDBPDatabase> {
  if (db) return Promise.resolve(db);
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(d) {
      if (!d.objectStoreNames.contains(STORE)) {
        const s = d.createObjectStore(STORE, { keyPath: 'id' });
        s.createIndex('packageStatusId', 'packageStatusId');
      }
    },
  });
}

export async function savePhoto(photo: DeliveryPhoto): Promise<void> {
  const ddb = await getDBPromise();
  await ddb.put(STORE, photo);
}

export async function listPhotos(packageStatusId: number): Promise<DeliveryPhoto[]> {
  const ddb = await getDBPromise();
  return ddb.getAll(STORE, packageStatusId);
}

export async function deleteAllPhotos(): Promise<void> {
  const ddb = await getDBPromise();
  await ddb.clear(STORE);
}
