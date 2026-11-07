# Original System Analysis — "MMC Project Tracker" (PhilGEPS Tracker)

> Source reviewed: `philgeps-source-review.zip` (PHP 8 + MySQL/PDO, Bootstrap 5, jQuery, DataTables, Chart.js).
> Status: **DISCOVERY — read-only analysis. No demo code has been written.**

## 1. What the system actually is

Not the government PhilGEPS portal. It is an internal **procurement-to-delivery tracker** for
supplier contracts (mostly DepEd school-equipment projects won via PhilGEPS). It tracks a project
from contract → lots/keystages → packages of items → deliveries to individual schools →
warehouse stock → logistics → proof of receipt (QR scan + photos) → billing groups.

Branding in UI: navbar "MMC PROJECT Tracker"; toasts/footers say "PhilGEPS Tracker".

## 2. Module map

| Area | Pages (original) | What it does |
|---|---|---|
| Auth | `index.php`, `script/authenticate.php`, `logout.php` | Email+password login, role-based redirect, toast on result |
| Dashboard | `dashboard.php` + 5 sub-dashboards (sales generation, production, operation, finance, collection) | KPI cards (green ≥80 / yellow ≥50 / red <50), Chart.js charts (bar/line/doughnut/pie), **drag-to-reorder charts (SortableJS)** |
| Projects | `projects.php`, `project_details.php` | List (10/page) with Year/Agency/Status filters, add project (ref no, name, contract amount, ABC, agency DepEd/DPWH, keystage toggle, dates) |
| Project sub-nav | `schools.php`, `lots.php`, `keystage.php` (only if keystage=1), `items.php`, `packages.php`, `project_reports.php` | Schools in project (import CSV, batch by ID range), lots w/ contract no., keystages per lot, items (CSV import), packages (dimensions + item contents), % charts by region/lot |
| Deliveries | `deliveries.php`, `deliveries_details.php`, `manual_checking.php` | DR-grouped list; add / batch add / CSV import; edit; batch generate **Acknowledgement Receipt (AR)** & packing **labels** (PDF); filters Year→Project→Status→Lot→Keystage→Region→Division→Municipality; **Deliveries Grouping = billing groups** (statuses: for billing / billed / paid) |
| Warehouse | `inventory.php`, `warehouse_details.php`, `warehouse_reports.php` | Per-warehouse stock; add stock → **For Approval → Approved/Rejected** (password re-entry to approve); inventory history; warehouse list CRUD |
| Logistics | `logistics.php`, `logistics_details.php`, `logistics_location.php`, `logistics_accepted_deliveries.php`, `logistics_reports.php` | Logistics providers, region↔warehouse assignment (Leaflet map), out-to-logistics summary, CSV exports |
| Scan flow (mobile) | `entry.php` → `scan.php` → `check.php` → `success.php`, `offline_scan.php`, `sw.js`, `captcha.php` | QR on package → packing list → photo upload + captcha → **pending → accepted → delivered**; accepting deducts warehouse inventory (FIFO across stock records); **offline mode** with IndexedDB + service-worker background sync |
| Reports | `report/print_*.php` (10 printable reports) | Delivery status, accepted/delivered by lot/region, monthly trend, inventory history/warehouse, top updated items |
| Users | `users.php` | CRUD, reset password, role + warehouse assignment |
| Placeholders | `billing.php`, `reports.php`, `procurement.php` | Nav items struck-through & disabled in the original |

## 3. Roles (code is authoritative; SQL dump is stale)

`Super Admin`, `Admin`, `Office Admin`, `Office Coordinator`, `Warehouse Admin`, `Warehouse Coordinator`, `Viewer`
(plus stray gates referencing `Logistics Admin` / `Coordinator` that no user dropdown can assign).
Landing page by role: Office Admin → Dashboard; Warehouse roles → Inventory; Office Coordinator/Viewer → Projects.
Top nav is filtered per role (see `template/header.php`).

## 4. Core domain model (from code + schema)

`projects` → `lot` → `keystage` (optional, DepEd) → `package` → `package_content` (item × qty) ← `item`
`deliveries` (DR no., school, lot, keystage, package type C1–C6, date, status Pending/Delivered/Accepted/Cancelled, logistics_location)
→ `package_status` (per package: pending/accepted/delivered/warehouse) → `delivery_photo`
`school` (region/division/municipality), `schools_project`, `warehouse`, `inventory` (+ approval status),
`logistics`, `logistics_location` (logistics × warehouse × region), `grouping`/`billing_grouped` (billing),
`invoices`, `documents`, `activity_logs`, `users`.

## 5. Things that CANNOT be copied 1:1 in a frontend-only demo (need a decision)

- Server PDF (dompdf) & QR generation (endroid) → client-side equivalents
- Photo upload to server → in-browser (data URL / IndexedDB)
- PHP sessions, captcha, password hashing → simulated auth
- CSV exports → client-side Blob downloads
- Service-worker background sync → can be simulated; true offline needs hosting over HTTPS/localhost
- SQL joins/aggregates (dashboards) → re-implemented in JS over stored arrays
- `localStorage` ≈ 5 MB cap: original schema has ~9.7k schools / ~9.7k deliveries in templates

## 6. Issues noticed in the original (candidate "improvements" / things NOT to replicate)

- Seed SQL ships **real-looking DepEd school head names, phones, emails** and a real user's email → demo must use **fictional** data only.
- Dashboard "Finance KPI" is a hard-coded `81`; Billing/Reports/Procurement are unfinished.
- Schema dump out of sync with code (`inventory_status`, `billing_grouped`, `grouping`, `supplier_price`, `ABC`, `warehouse_id` on users missing).
- Header loads two Bootstrap versions (CDN 5.3.2 + local 5.3.7 + JS 5.3.8).
- Login gate in `index.php` is commented out; several role gates reference non-existent roles.
- SQL built by string interpolation in places (irrelevant for a frontend-only demo, but worth noting).
