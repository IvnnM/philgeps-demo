# Phase 1 Data Model: PhilGEPS Tracker Demo

**Spec**: [spec.md](./spec.md) | **Research**: [research.md](./research.md)

All records are fictional, hand-authored, with stable integer IDs (Constitution II, III). Structured entities live in `localStorage`; photos live in IndexedDB (see `contracts/storage.md`). Status text comparisons are case-insensitive.

## Entities

### Project
| Field | Type | Rules |
|---|---|---|
| id | int | stable seed id |
| refNo | string | required |
| name | string | required |
| agency | `DepEd` \| `DPWH` | required |
| contractAmount | number (PHP) | required, ≥ 0 |
| abc | number (PHP) | approved budget, required, ≥ 0 |
| startDate, endDate | date | required, end ≥ start |
| status | `Pending` \| `Ongoing` \| `Delivered` \| `Completed` \| `Cancelled` | drives Projects Win KPI |
| keystage | boolean | only settable when agency is `DepEd` |

Relationships: has many Lots, Items, Deliveries, Invoices, DocumentChecklistItems; many-to-many Schools via ProjectSchool.

### Lot
`id, projectId, name, contractNo`. Has many Keystages (only if project.keystage) and Packages.

### Keystage
`id, lotId, num (int), description`. Has many Packages.

### Item
`id, projectId, name, unit, supplierCost`. **supplierCost exists only in seed data, has no screen**, and feeds the Margin KPI.

### Package
`id, lotId, keystageId?, num (int), height, width, length (numbers)`. Has many PackageContent rows.

### PackageContent
`packageId, itemId, qty (int ≥ 1)`. Primary key (packageId, itemId).

### School
`id, name, address, contactPerson, contactNo, municipality, division, region`. **Fictional only.** Filters by region, division, municipality cascade from these fields.

### ProjectSchool
`projectId, schoolId`. Links schools to a project.

### Delivery
| Field | Type | Rules |
|---|---|---|
| id | int | |
| projectId, schoolId, lotId | int | required |
| keystageId | int? | required iff project.keystage |
| packageType | `C1`..`C6` | required |
| drNo | string? | **unique when set**; required when added singly; absent for batch-created deliveries until edited; case-insensitive uniqueness |
| deliveryDate | date | required |
| deliveredDate | date? | set when status becomes Delivered |
| status | `Pending` \| `Accepted` \| `Delivered` \| `Cancelled` | see transitions |
| createdAt | datetime | |

### PackageStatus
`id, deliveryId, packageId, status (pending | accepted | delivered)`. **One row per package of the delivery's lot (and keystage)**, created as `pending` when the delivery is created. Each row is one QR code.

### DeliveryPhoto (IndexedDB)
`id, packageStatusId, stage (accepted | delivered), blob (JPEG, longest side ≈ 1,000 px), createdAt`. At most 5 per confirmation.

### User
`id, name, email (unique), password (demo credential), role (SuperAdmin | OfficeAdmin | WarehouseAdmin | Viewer), warehouseId?`. `warehouseId` shown and set only for `WarehouseAdmin`.

### Warehouse
`id, name`. Fictional read-only labels used by users and delivery details.

### Invoice (read-only display)
`id, projectId, invoiceNo, amount, status, date`.

### DocumentChecklistItem (read-only display)
`projectId, docType (BAC Resolution, Notice of Award, Notice to Proceed, Delivery Receipt, Inspection Report), status`.

### DemoMeta
`schemaVersion, seedId, bannerDismissed, tourDismissed, chartOrder: { [dashboardId]: string[] }, session: { userId, role }`.

## State transitions

**PackageStatus (receiving flow)**: `pending → accepted → delivered`; confirming `delivered` leaves it `delivered`. Only Warehouse Admin may perform `pending → accepted`. A package of a Cancelled delivery cannot be confirmed.

**Delivery (derived, per original `check.php`)**: after a package confirmation, the delivery becomes `Accepted` only when all its packages are accepted, and `Delivered` (setting `deliveredDate`) only when all are delivered; otherwise it keeps its status.

**Delivery (Edit status control)**: sets the delivery and all its packages together. Allowed values: Pending, Delivered, Cancelled for all editing roles; **Accepted only for Warehouse Admin**. Reverting to Pending resets all packages to `pending` and keeps saved photos. Cancelling keeps photos. Stock levels are never touched (out of scope).

## Derived data (queries, `src/data/queries/`)
- **Deliveries list**: group by `drNo`; rows with no `drNo` appear individually; join project, school, lot, keystage, warehouse label, package statuses with item contents.
- **Cascading filters**: Year → Project → Status → Lot → Keystage → Region → Division → Municipality; each level enabled by the previous.
- **Project reports**: percentage of accepted/delivered by region, by lot, and status breakdown.
- **KPIs (spec FR-022)**: Projects Win; Margin = (Σ abc − Σ(item.supplierCost × packageContent.qty)) ÷ Σ abc over qualifying projects; Sales Generation = average of the two; Completion Rate = delivered-or-accepted school–lot pairs ÷ all pairs for Ongoing projects with deliveries; Production = average of Completion Rate and three stand-ins; Finance = stand-in. Colour band: green ≥ 80, yellow ≥ 50, red < 50.

## Validation rules (from spec)
- Project: required fields; keystage only for DepEd; currency shown as PHP pesos with two decimals.
- Delivery: required fields; `drNo` unique when set; `keystageId` required iff project uses keystage.
- Confirmation: at least 1 and at most 5 photos; correct arithmetic answer; storage failure leaves status unchanged.
- User: unique email; role from the four allowed; warehouse only for Warehouse Admin.

## Seed requirements (Success Criterion SC-005, SC-009)
3 projects (DepEd with keystage, DepEd without, DPWH), about 60 schools over several regions, about 150 deliveries covering every delivery status, a mix with and without DR numbers, photos for a few accepted/delivered packages, 4 users (one per role), fictional warehouses, invoices and checklist rows. Every KPI colour band is represented. No real names, contacts, logos or brands.
