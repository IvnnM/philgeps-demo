// Entity types — PhilGEPS Tracker Demo
// All types use union types / as const (erasableSyntaxOnly per constitution §Technology)

export type Role = 'SuperAdmin' | 'OfficeAdmin' | 'WarehouseAdmin' | 'Viewer';
export type Agency = 'DepEd' | 'DPWH';
export type ProjectStatus = 'Pending' | 'Ongoing' | 'Delivered' | 'Completed' | 'Cancelled';
export type DeliveryStatus = 'Pending' | 'Ongoing' | 'Delivered' | 'Completed' | 'Cancelled' | 'Accepted';
export type PackageStatus = 'pending' | 'accepted' | 'delivered';
export type PackageType = 'C1' | 'C2' | 'C3' | 'C4' | 'C5' | 'C6';

export interface Project {
  id: number; refNo: string; name: string; agency: Agency;
  contractAmount: number; abc: number; startDate: string; endDate: string;
  status: ProjectStatus; keystage: boolean;
}
export interface Lot { id: number; projectId: number; name: string; contractNo: string; }
export interface Keystage { id: number; lotId: number; num: number; description: string; }
export interface Item { id: number; projectId: number; name: string; unit: string; supplierCost: number; }
export interface Package {
  id: number; lotId: number; keystageId?: number; num: number;
  height: number; width: number; length: number;
}
export interface PackageContent { packageId: number; itemId: number; qty: number; }
export interface School {
  id: number; name: string; address: string; contactPerson: string;
  contactNo: string; municipality: string; division: string; region: string;
}
export interface ProjectSchool { projectId: number; schoolId: number; }
export interface Delivery {
  id: number; projectId: number; schoolId: number; lotId: number;
  keystageId?: number; packageType: PackageType; drNo?: string;
  deliveryDate: string; deliveredDate?: string; status: DeliveryStatus; createdAt: string;
}
export interface PackageStatusRow { id: number; deliveryId: number; packageId: number; status: PackageStatus; }
export interface DeliveryPhoto { id: number; packageStatusId: number; stage: 'accepted' | 'delivered'; blob: Blob; createdAt: string; }
export interface User {
  id: number; name: string; email: string; password: string; role: Role; warehouseId?: number;
}
export interface Warehouse { id: number; name: string; }
export interface Invoice { id: number; projectId: number; invoiceNo: string; amount: number; status: string; date: string; }
export interface DocumentChecklistItem { projectId: number; docType: string; status: string; }
export interface DemoMeta {
  schemaVersion: number; seedId: string; bannerDismissed: boolean; tourDismissed: boolean;
  chartOrder: Record<string, string[]>; session?: { userId: number; role: Role };
}
