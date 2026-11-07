# Parity Documentation — Projects Area

**Document owner:** PhilGEPS Tracker demo (Spec 001)  
**Reference source:** `original-source/` — a flattened extraction of the PhilGEPS PHP/MySQL source (visual reference only; git-ignored, never committed)  
**Demo target:** `src/features/projects/` — React 19 + TypeScript + Vite + Bootstrap 5

> **Reading order** — this document assumes you have read the three project files that define the original system:
> `docs/discovery/01-original-system-analysis.md` (what the original does), `docs/discovery/02-interview-log.md` (design decisions), and `docs/analysis/consistency-report.md` (fixes applied to the spec). All original page numbers below refer to files inside `original-source/`.

---

## 1. Project structure and folder layout mapping

### 1.1 Workspace layout (demo repository)

The demo is a Vite + React + TypeScript SPA. The feature code lives under `src/`; the parity reference lives under `original-source/` (git-ignored).

| Demo path | Purpose |
|---|---|
| `src/app/App.tsx` | Route table (`react-router-dom` `<Routes>`); wires every feature page |
| `src/app/Layout.tsx` | Root layout — dark navbar, `<Outlet/>` for page content, `<Toast/>` |
| `src/auth/roles.ts` | Single source of truth for roles, navigation scope, access control, landing pages, control visibility |
| `src/data/db.ts` | localStorage repository layer (`pgd:v1:*` keys); collection getters/setters; session; reset |
| `src/data/types.ts` | Entity type definitions (Project, Lot, Keystage, Item, Package, School, Delivery, etc.) |
| `src/data/queries/*.ts` | Data operations: `projects.ts` (CRUD + filtering), `projectReports.ts` (report calculations) |
| `src/data/seed/` | Fictional seed fixtures (`seed-data.ts`, `projects.ts`, `seed.ts`, `users.ts`) |
| `src/features/projects/` | All project-area pages + modal |
| `src/features/deliveries/` | Delivery list + detail |
| `src/features/dashboards/` | Dashboard, Sales Generation, Production |
| `src/features/login/`, `src/features/users/`, `src/features/scan/`, `src/features/print/` | Auth, user management, scan flow, printable AR/labels/reports |
| `src/demo/` (also `demo/` in root) | Demo chrome: GuidedTour, RoleSwitcher, ResetButton, SimulateScanPrompt, StorageNotice, WelcomeBanner |
|| `src/components/` | Shared UI primitives: `Peso.tsx`, `Toast.tsx` (currency + toast) |
|| `styles/` | `original.css` (clone of original site CSS), `bootstrap-override.css`, `responsive.css`, `print.css` |
|| `original-source/` | **Git-ignored**; the flattened PHP/MySQL extraction; used for parity checklists only |

### 1.2 Original source layout (`original-source/`)

The original is a flat, server-rendered PHP application (PHP 8 + MySQL/PDO + Bootstrap 5 + jQuery + Chart.js):

| Folder / file | Purpose |
|---|---|
| `index.php` | Login gate; empty form if non-logged-in |
| `dashboard*.php` (5 files) | The 5 sub-dashboards (sales generation, production, operation, finance, collection) |
| `projects.php`, `project_details.php` | Project list with filters/pagination; project detail (loaded via AJAX) |
| `schools.php`, `lots.php`, `keystage.php`, `items.php`, `packages.php`, `project_reports.php` | Project sub-areas (see Section 2) |
| `deliveries.php`, `deliveries_details.php`, `manual_checking.php` | Deliveries list + detail + manual inspection |
| `inventory.php`, `warehouse*.php` | Warehouse stock + warehouse list/reports |
| `logistics*.php` | Logistics providers, region↔warehouse assignment, locations |
| `reports.php`, `project_reports.php` | Report entry + per-project dashboard with charts |
| `users.php` | User CRUD + password reset |
| `script/*.php` | AJAX handlers: CRUD (`add_`, `edit_`, `delete_`, `update_`), filters (`filterProjects.php`, `filterSchool.php`, …), getters (`get_project.php`, `get_school.php`, …), report data |
| `template/header.php`, `template/footer.php` | Shared layout, session start, Bootstrap + DataTables + Chart.js includes |
| `partials/*.php` | Reusable modal forms (item, lot, keystage, package, school, user, delivery modals) |
| `assets/css/`, `assets/js/`, `assets/uploads/` | Base CSS, client JS (sortable, charts, filters, project details), seed uploads |
| `report/print_*.php` | 10 printable reports (delivery status, accepted/delivered by region/lot, monthly trend, inventory, top updated items) |
| `philgeps.sql` | MySQL schema dump (stale relative to the code) |

### 1.3 Mapping table (folder → folder)

| Demo area | Original area | Note |
|---|---|---|
| `src/features/projects/` | `projects.php` + `project_details.php` + sub-pages | Project workspace |
| `src/features/deliveries/` | `deliveries.php`, `deliveries_details.php`, `manual_checking.php` | In scope for demo, partial |
| `src/features/dashboards/` | `dashboard.php` + 5 sub-dashboards | In scope: dashboard + sales-gen + production only |
| `src/features/login/` | `index.php`, `script/authenticate.php`, `logout.php` | Login page reproduced |
| `src/features/users/` | `users.php` | In scope |
| `src/features/scan/` | `entry.php` → `scan.php` → `check.php` → `success.php`, `offline_scan.php` | In scope; warehouse accept simulated |
| `src/features/print/` | `report/print_*.php` | In scope: AR, labels, 10 reports |
|| `src/data/` | `script/` helpers + `config/db.php` | Repository layer: `db.ts` (localStorage), `types.ts`, `queries/*.ts` (joins/aggregates), `seed/*` |
|| `src/auth/roles.ts` | `role_auth.php` | Role definitions + access control (controls.canEditX) |
|| `src/components/` | `template/partials/*.php` + `script/` | UI primitives: `Peso.tsx`, `Toast.tsx` |
|| `src/lib/` | — | **Empty** — no repository code here |
| `styles/original.css` | `assets/css/style.css` | Stylistic reference only |
| `original-source/` | — | **Git-ignored, visual reference only** |

---

## 2. Key page comparison — original PHP page → React component

### 2.1 Projects (list + CRUD)

- **Original:** `projects.php` — server-side rendered table (10/page), `Year` / `Agency` / `Status` filter selects populated by `script/populateFilter.php`, a Filter button calls `script/filterProjects.php` via AJAX and rewrites the `<tbody>`, Pagination links (`?page=N`), an **Add Project** button that opens `modal #addProjectModal`.
- **Demo:** `ProjectsPage.tsx` — the same filter bar (Year/Agency/Status) and a search box, implemented in `useState` + `useEffect`/filter functions over the `projects` collection; pagination is rendered as Prev/Next buttons plus a "Page X of Y" footer; Add/Edit use the `AddProjectModal` component.
- **CRUD:** original uses `script/add_project.php`, `script/update_project.php`, `script/delete.php`; demo uses `data/queries/projects.ts` (`addProject`, `updateProject`, `deleteProject`) which mutate the `projects` localStorage collection.
- **Appropriateness check:** With seed data (~3 projects), pagination is implemented and tested but not visible on Projects; it is visible on Deliveries.

### 2.2 Project Overview

- **Original:** `project_details.php` — fetches `project_details_data.php?id=N` via AJAX and injects the returned HTML into `#projectContainer`. The original content (not fully present in the extracted files) includes project info, KPIs and an *Invoices* section plus a *Document Checklist* (BAC Resolution, Notice of Award, NTP, Delivery Receipt, Inspection Report, with file upload). The spec (PR #B4) resolved this: Invoices/Document Checklist are static/non-interactive in the demo.
- **Demo:** `OverviewPage.tsx` — reads `projects` and `deliveries` from localStorage on mount; renders a card "Project Information" (refNo, name, agency, status, keystage, dates, contract amount, ABC) and a "Key Performance Indicators" card (Contract Amount, Approved Budget/ABC, Outstanding, Delivery Progress %). The invoices/document checklist are not included.
- **Difference:** the demo delivers a *subset* of the original overview (information + delivery progress); invoices and document checklist are omitted (see §4).

### 2.3 Schools

- **Original:** `schools.php` — expects `?id=<projectId>`; lists schools linked to the project (`schools_project` join); import modal, region/division/municipality filters (chained), search, pagination (10/page), delete button. Uses `script/filterSchool.php`.
- **Demo:** `SchoolsPage.tsx` — reads `schools` + `projectSchools` collections; shows a search box; adds a school and *links* it to the project in the same state shape; "Link"/"Unlink" button reflects current linkage; no import modal, no pagination.
- **Difference:** no CSV import, no region/division/municipality chained filters, no pagination, no delete.

### 2.4 Lots

- **Original:** `lots.php` — lists lots for a project; the **Keystage** column is shown only when the project is a keystage project, otherwise a **Cartons/packages** count; add/edit/delete modal; `lot_id` param.
- **Demo:** `LotsPage.tsx` — lists lots for the project with `Lot Number`, `Contract No`, `Created`, and Action buttons; add modal; edit is wired to a TODO modal (per the code comment); delete works.
- **Difference:** no keystage sub-column (the demo separates keystage into its own page), no cartons/packages count, no edit modal.

### 2.5 Keystage

- **Original:** `keystage.php` — list of keystages across a project's lots (optionally filtered by `lot_id`); columns: Keystage, Cartons, Actions; add/edit/delete.
- **Demo:** `KeystagePage.tsx` — only rendered when the project `keystage === true`; shows a warning message otherwise; columns: Keystage No, Lot, Description; add modal (lot select populated from lots).
- **Difference:** no cartons count column, no edit modal, no lot-scoped view (shows all lots), edit is present in code but no UI wired.

### 2.6 Items

- **Original:** `items.php` — per project list (10/page) with Import Item modal; columns: Item Name, Unit, Actions; edit/delete.
- **Demo:** `ItemsPage.tsx` — same columns (Item Name, Unit, Actions); add modal (also stores `supplierCost: 0` + `createdAt`); no import modal, no pagination, edit button wired but no edit form exposed.
- **Difference:** no CSV import, no pagination, no supplier cost editing (demo seed uses `supplierCost: 0`).

### 2.7 Packages

- **Original:** `packages.php` — per project (or per keystage/lot) list with dimensions, content (item names), quantity; **Generate QR** button; add/edit modal with a dynamic "add more items" row; CSV import of items available from `items.php`.
- **Demo:** `PackagesPage.tsx` — columns: Package Number, Dimensions, Contents, Qty, Actions; add modal (package number, lot select, width/height/length, contents comma-separated); contents rendered from the `packageContents` collection; no QR generation.
- **Difference:** no QR code generation, no CSV import, contents are a simple comma-separated text field (no granular qty per item with add-more rows as in the original).

### 2.8 Reports

- **Original:** `reports.php` — entry with Year/Agency/Status filters and a Generate Report button; `project_reports.php` — per-project dashboard with overall progress KPI, status breakdown cards, 4 bar charts (accepted/delivered % by region & lot) + a pie chart (delivery status breakdown). Charts use Chart.js loaded from CDN (`https://cdn.jsdelivr.net/npm/chart.js`), auto-refresh every 60s.
- **Demo:** `ReportsPage.tsx` — same page title, a chart-type tab selector (By Region / By Lot / By Status), one Chart.js bar chart (`react-chartjs-2`) in a 400px card, plus a summary card (Total Contract Amount, Total ABC, Generated Date). `data/queries/projectReports.ts` implements `calculateProjectReports` (by agency, by status, by keystage-as-lot proxy).
- **Difference:** removed the overall-progress KPI card, status breakdown cards, and the second pair of charts (the original had 5 charts; the demo shows 1). No auto-refresh. No PDF/Excel export buttons.

---

## 3. UI differences — original (PHP SSR) vs demo (React CSR)

| Dimension | Original (`original-source/`) | Demo (`src/`) |
|---|---|---|
| **Rendering** | PHP server-side rendering; every request re-renders the page; navigation = full page reload | React client-side routing; `<BrowserRouter>` + `<Routes>`; pages swap in place; no reload |
| **Routing** | URLs like `projects.php?id=3`, `schools.php?id=3&page=2`, `?page=N` query params | Clean URLs: `/projects`, `/projects/:id/overview`, `/schools`, `/lots`, `/keystage`, `/items`, `/packages`, `/reports` (react-router) |
| **UI framework** | Bootstrap 5 (local `5.3.7` + CDN copies), jQuery, DataTables (`dataTables.bootstrap5`) | Bootstrap 5 (via npm `bootstrap` + `bootstrap-icons`) + custom React components; DataTables replaced by custom tables |
| **Charts** | Chart.js loaded from CDN, `new Chart(...)` in page `<script>`, auto-refresh every 60s | `react-chartjs-2` wrapped component, registered via `ChartJS.register(...)`, one chart per report view, no auto-refresh |
| **State** | Server-side variables + `$_SESSION` + form/POST bodies | `useState`/`useReducer` + `localStorage` collections (`pgd:v1:*`) |
| **Modals** | Bootstrap `modal` markup + `data-bs-toggle`; JS in page `<script>` | React portal-less inline modals (`.modal show` overlay) rendered by the component, controlled by `useState` |
| **Forms** | Plain HTML forms posting to `script/*.php`; jQuery handlers | Controlled inputs (`value`/`onChange`); validation in component; `Peso` component for currency |
| **Navigation** | Link with `href`; sidebar nav in `template/header.php` filtered per role | `NavLink`-style `<a>` with `location.pathname.startsWith(item)` active styling (from `Layout.tsx` + `roles.ts`) |
| **Icons** | Bootstrap Icons (`bi`) via CDN/local font | Bootstrap Icons (`bi`) installed as npm package + `bootstrap-icons` CSS |
| **Session/auth** | PHP `session_start()` + `$_SESSION` + `role_auth.php` gate | `session` localStorage key + `RouteGuard/RoleSwitcher` demo chrome + `getSession()` |

---

## 4. Visual and behavioral differences (summary)

These are the differences the owner should review. Each is either a **Documented Difference** (per spec principle I) or a **Demo Addition** (per spec principle V).

| # | Area | Original behaviour | Demo behaviour | Type |
|---|---|---|---|---|
| D1 | Routing | Server-rendered page per request; links full-reload | Client-side route swapping; no reload; clean URLs | Difference |
| D2 | Data store | MySQL database (`philgeps.sql`); SQL joins/aggregates | `localStorage` collections; JS re-implements joins/aggregates (`queries/*.ts`) | Difference |
| D3 | Auth session | PHP `$_SESSION`; `session_start()` on every page | `session` localStorage key; demo-only RoleSwitcher + RouteGuard; simulated auth | Difference |
| D4 | Project overview | Full info + Invoices + Document Checklist (with upload) | Info + KPIs only; invoices/documents omitted | Difference |
| D5 | Reports | 5 charts + status cards + auto-refresh (60s) + PDF/Excel export | 1 chart + summary; no auto-refresh; no export | Difference |
| D6 | Deliveries | Full list with DR group, filters, warehouse/logistics, batch add, AR/labels PDF | Stub (text card) — deliveries area is out-of-scope in the current approved scope | Difference |
| D7 | Login | Real backend authentication | Simulated; demo accounts listed on the login page; role switcher after login | Demo Addition |
| D8 | Seed data | `philgeps.sql` (real-looking DepEd names/emails, real user email — flagged in docs) | Hand-authored fictional seed data (`data/seed/*`) | Difference |
| D9 | Photos | Server upload → DB/`uploads/` | Photos compressed client-side, stored in `IndexedDB` (not `localStorage`, which has a ~5 MB cap) | Difference |
| D10 | Offline mode | Service worker + IndexedDB background sync | Not implemented (SPA static deploy; service worker out of scope) | Difference |
| D11 | Charts | Chart.js CDN auto-refresh, 5 chart types | `react-chartjs-2` single chart; same chart types (bar) | Difference |
| D12 | Role gating | `role_auth.php` per page + `$_SESSION` | `controls.ts` + `auth/RouteGuard`; Viewer read-only | Difference |
| D13 | Navbar | `template/header.php` nav filtered per role; no mobile toggler | `Layout.tsx` nav filtered per role; **mobile navbar toggler added** (demo addition, T071) | Demo Addition |
| D14 | Booleans/edge cases | Case-insensitive MySQL status comparison | Explicit status comparisons (normalized in data-model) | Difference |
| D15 | QR codes | Server-generated (endroid) | Client-side `qrcode` lib; QR is a link to `/scan?id=...` | Difference |

---

## 5. Comparison table — original pages vs demo components

| Original page | Demo component | Route | Key CRUD | Charts | CRUD (own data) | Notes |
|---|---|---|---|---|---|---|
| `index.php` | `src/features/login/LoginPage.tsx` | `/login` | — | — | — | Login + demo accounts |
| `dashboard.php` (+ 5 sub-dashboards) | `src/features/dashboards/DashboardPage`, `SalesGenerationPage`, `ProductionPage` | `/dashboard`, `/dashboard/sales-generation`, `/dashboard/production` | — | 5 (2 in scope) | — | finance, operation, collection out of scope |
| `projects.php` | `src/features/projects/ProjectsPage.tsx` | `/projects` | Add/Edit/Delete | — | Filter + 10/page | Pagination visible on Deliveries only |
| `project_details.php` | `src/features/projects/OverviewPage.tsx` | `/projects/:id/overview` | — | — | View | Invoices/docs omitted |
| `schools.php` | `src/features/projects/SchoolsPage.tsx` | `/schools` | Add + Link | — | Search + Link | No import, no pagination |
| `lots.php` | `src/features/projects/LotsPage.tsx` | `/lots` | Add/Edit(partial)/Delete | — | — | No keystage column; edit = TODO |
| `keystage.php` | `src/features/projects/KeystagePage.tsx` | `/keystage` | Add/Delete | — | — | Only for keystage projects; no edit |
| `items.php` | `src/features/projects/ItemsPage.tsx` | `/items` | Add/Delete | — | — | No import, no pagination |
| `packages.php` | `src/features/projects/PackagesPage.tsx` | `/packages` | Add/Delete | — | Dimensions | No QR generation |
| `project_reports.php` / `reports.php` | `src/features/projects/ReportsPage.tsx` | `/reports` | — | 1 (of 5) | — | No auto-refresh, no export |
| `deliveries.php`, `deliveries_details.php`, `manual_checking.php` | `src/features/deliveries/DeliveriesPage.tsx` + `DeliveryDetailsPage.tsx` | `/deliveries` | Partial | — | Filter + batch (demo) | Deliverable is a stub per approved scope |
| `inventory.php`, `warehouse*.php` | — | — | — | — | — | Out of scope |
| `logistics*.php` | — | — | — | — | — | Out of scope |
| `users.php` | `src/features/users/UsersPage.tsx` | `/users` | CRUD | — | — | Super Admin only |
| `scan.php` (mobile flow) | `src/features/scan/ScanPage.tsx`, `SuccessPage.tsx` | `/scan`, `/scan/success` | — | — | Photo + status | Accept simulated |
| `report/print_*.php` | `src/features/print/ArPage`, `LabelsPage`, `ReportPage` | `/print/ar`, `/print/labels`, `/print/reports/:name` | — | Print CSS | — | Browser print (Save as PDF) |

---

## 6. State management approach

### 6.1 Demo — localStorage collections

All structured state lives in `localStorage` under the `pgd:v1:` prefix (`src/data/db.ts`). Collections (the demo's analogue of database tables):

```
pgd:v1:projects, pgd:v1:lots, pgd:v1:keystages, pgd:v1:items,
pgd:v1:packages, pgd:v1:packageContents, pgd:v1:schools, pgd:v1:projectSchools,
pgd:v1:deliveries, pgd:v1:packageStatuses, pgd:v1:users, pgd:v1:warehouses,
pgd:v1:invoices, pgd:v1:documentChecklist
```

Plus two singleton keys:
- `pgd:v1:session` → `{ userId, role }`
- `pgd:v1:meta` → `{ schemaVersion, seedId, bannerDismissed, tourDismissed, chartOrder }`

**Seeding:** on first load (missing `meta`), all collections are populated from deterministic hand-authored seed fixtures (`data/seed/*`). Seed IDs are stable so QR links and tests are reproducible.

**Writes:** `setCollection(name, data)` mutates the in-memory array and persists to `localStorage`; reads (`getCollection`) tolerate missing/corrupt keys and re-seed that collection on demand.

**Reset:** `resetAll()` deletes every `pgd:*` key + the `pgd-photos` IndexedDB database, re-seeds, and signs out. Exposed as a **Reset demo data** control.

### 6.2 Original — PHP sessions + MySQL

- **Session:** `session_start()` in `template/header.php`; `$_SESSION` holds `user_id`, `username`, `name`, `role`.
- **Data:** MySQL (`philgeps.sql`); SQL joins/aggregates computed by the DB (`SELECT COUNT(*)`, `SUM(status = 'Pending')`, `GROUP BY`, `LIMIT/OFFSET` pagination).
- **Auth gate:** `script/role_auth.php` reads `$_SESSION`; redirects to `index.php` when not authorized.
- **Forms/CRUD:** `$_POST`/`$_GET`/`$_FILES` submitted to `script/*.php`; results return via AJAX (`fetch`) where needed (e.g. `filterProjects.php`, `project_details_data.php`).
- **Reports:** `script/get_report_data.php` returns JSON; page `<script>` consumes it.

### 6.3 Mapping of concepts

| Concept | Original | Demo |
|---|---|---|
| Database table → collection | `projects`, `lots`, `keystages`, `items`, `packages`, `package_content`, `school`, `schools_project`, `deliveries`, `package_status`, `users`, `warehouse` | `pgd:v1:projects`, `pgd:v1:lots`, …, `pgd:v1:warehouses` |
| Join/aggregate | SQL | `calculateProjectReports` (reports), `filterProjects` (queries) |
| Session | `$_SESSION` | `pgd:v1:session` |
| Auth gate | `role_auth.php` | `controls.canEditX()` + `auth/RouteGuard` |
| File uploads (photos) | `$_FILES` → `uploads/` | Compressed `Blob` → `IndexedDB` (`pgd-photos`) |
| CSRF/session tokens | PHP session cookie | None (static SPA; demo-only) |

---

## 7. `original-source/` — git-ignored reference only

- `original-source/` is listed in the repository `.gitignore`; it is **never committed** and is a read-only visual reference.
- It is a flattened extraction of the PhilGEPS PHP/MySQL source. It is **not** part of the demo build and is not imported anywhere in the React code.
- All parity checklists (including this file) are derived from it, per spec principle I. No real DepEd names, contacts, emails, accounts, logos, or brand names from the original may appear in the demo.
- It must not be modified and must not be used as a dependency at build time.

---

## 8. Ownership and review

| Document | Status |
|---|---|
| This parity file | Draft — reviewed at Phase 0 (parity checklists), then per-section owner review |
| `original-source/` | Read-only; git-ignored |
| Demo source changes | None — this document is reference-only; it does not modify code or tests |

**Next step:** one checkbox-style parity checklist (like `docs/parity/login.md`) per key page, with the owner's review and Playwright baseline acceptance.
