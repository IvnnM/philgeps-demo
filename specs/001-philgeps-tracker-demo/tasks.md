---
description: "Task list for the PhilGEPS Tracker Demo"
---

# Tasks: PhilGEPS Tracker Demo (Portfolio Showcase)

**Input**: Design documents from `/specs/001-philgeps-tracker-demo/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/, quickstart.md

**Tests**: Included. The constitution (Principle IV) requires unit tests for logic and smoke tests for key journeys. Within each story, write the tests first and confirm they fail before implementing.

**Organization**: Tasks are grouped by user story. Each story ends with an owner review against its parity checklist (Constitution Principle I), because no screenshots of the original exist.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on unfinished tasks)
- **[Story]**: Which user story the task belongs to (US1 to US8)
- Every task names its file path

## Path Conventions

Single project at the repository root: `src/`, `tests/`, `docs/parity/`, per plan.md. The original source for reference lives in `original-source/` (git-ignored).

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Scaffold the project at the repository root from the official `create-vite` 9.3.3 `react-ts` template (React ^19.3.1, TypeScript ~7.0.2, Vite ^8.3.5, oxlint), producing `package.json`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `vite.config.ts`, `index.html` and `src/main.tsx` without touching the existing `specs/`, `docs/`, `.specify/` and `.claude/` folders; create the folder layout from plan.md under `src/` and `tests/`
- [x] T002 Install runtime dependencies  —  COMPLETED: build passes (tsc -b && vite build) in `package.json`: react-router-dom ^7.18, bootstrap ^5.3.8, bootstrap-icons ^1.13, chart.js ^4.6, react-chartjs-2 ^5.3, qrcode ^1.5, @dnd-kit/core ^6.3, @dnd-kit/sortable ^10, idb ^8, driver.js ^1.10
- [ ] T003 [P] Install dev dependencies in `package.json`: vitest ^5.1, jsdom, @testing-library/react ^16, @testing-library/dom, @testing-library/jest-dom, @playwright/test ^1.64, @types/qrcode
- [ ] T004 [P] Configure Vitest in `vitest.config.ts` and `tests/unit/setup.ts` (jsdom environment, jest-dom matchers, clear `localStorage` before each test) and add the `test` script to `package.json`
- [ ] T005 [P] Configure Playwright in `playwright.config.ts` with a desktop project and a 375 px mobile project, serving the production build via `vite preview`, tests in `tests/e2e/`, and add the `e2e` script to `package.json`
- [ ] T006 [P] Add `vercel.json` with a single-page-app rewrite sending every path to `/index.html`, and add `node_modules`, `dist`, `playwright-report` and `original-source/` to `.gitignore`
- [ ] T007 [P] Configure oxlint in `.oxlintrc.json` (from the template) and the `lint` script; document in `README.md` that TypeScript `enum` and `namespace` are forbidden because `erasableSyntaxOnly` is on
- [ ] T008 [P] Create the fictional brand (new product name and a newly drawn logo and favicon set, never the original's) in `public/logo.svg`, `public/favicon.svg`, `public/favicon.ico` and the name constant in `src/app/brand.ts`
- [ ] T009 Unzip the owner-provided `philgeps-source-review.zip` into `original-source/` (git-ignored, read-only reference used only to build parity checklists; never copy its files, logos, names or data into the repository)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T010 Define all entity types in `src/data/types.ts` from data-model.md using union types and `as const` objects (no `enum`): Project, Lot, Keystage, Item, Package, PackageContent, School, ProjectSchool, Delivery, PackageStatus, DeliveryPhoto, User, Warehouse, Invoice, DocumentChecklistItem, DemoMeta; roles `SuperAdmin | OfficeAdmin | WarehouseAdmin | Viewer`; delivery statuses `Pending | Accepted | Delivered | Cancelled`; package statuses `pending | accepted | delivered`; package types `C1`..`C6`
- [ ] T011 [P] Implement the versioned `localStorage` layer in `src/data/db.ts` with prefix `pgd:v1:`, typed get/set/update per collection, try/catch on every read and write that raises a visible notice and keeps an in-memory fallback, a `schemaVersion` check that re-seeds with a notice, tolerant reads of missing or corrupt keys, and `resetAll()` (contracts/storage.md)
- [ ] T012 [P] Implement the IndexedDB photo store in `src/data/photos.ts` using `idb` (database `pgd-photos`, object store `photos`, keyPath `id`, index `packageStatusId`) with `savePhotos`, `listPhotos(packageStatusId)` and `deleteAllPhotos`, plus canvas downscaling to a longest side of about 1,000 px as JPEG at about 0.7 quality; enforce "At most 5 per confirmation"
- [ ] T013 Implement repositories for projects, lots, keystages, items, packages, packageContents, schools and projectSchools in `src/data/repositories/` (one module per entity) on top of `src/data/db.ts`
- [ ] T014 Implement repositories for deliveries, packageStatuses, users, warehouses, invoices, documentChecklist and meta in `src/data/repositories/`; creating a delivery MUST create one `pending` PackageStatus row per package of the delivery's lot (and keystage if used)
- [ ] T015 [P] Author the fictional projects, lots, keystages, items (with `supplierCost`, no UI) and packages with contents in `src/data/seed/projects.ts`: exactly 3 projects (a DepEd project with keystage, a DepEd project without, a DPWH project) with stable integer IDs
- [ ] T016 [P] Author about 60 fictional schools across several regions, divisions and municipalities, plus the project-school links, in `src/data/seed/schools.ts`; every email MUST use the fictional domain `demo.example` and every phone number the fictional pattern `09XX-000-XXXX`
- [ ] T017 [P] Author 4 fictional users (one per role: SuperAdmin, OfficeAdmin, WarehouseAdmin, Viewer) with demo credentials, and fictional warehouses, in `src/data/seed/users.ts`
- [ ] T018 [P] Author invoices and document-checklist rows (read-only display data) in `src/data/seed/invoicesAndDocs.ts`, and the stand-in KPI values (Finance, Logistics Performance, Warehouse Performance, Delivered-versus-Paid) in `src/data/seed/kpiStandIns.ts`
- [ ] T019 Author about 150 fictional deliveries with consistent package statuses in `src/data/seed/deliveries.ts` covering every delivery status, a mix with and without DR numbers ("unique when set", case-insensitive), every region and lot, enough rows for multiple pages, every KPI colour band (green >= 80, yellow >= 50, red < 50), and a few accepted/delivered packages with photo references
- [ ] T020 Implement `seedAll()` in `src/data/seed/index.ts` that writes every collection deterministically on first load, sets `meta.schemaVersion` and `meta.seedId`, and is idempotent
- [ ] T021 [P] Write seed integrity tests in `tests/unit/seed.test.ts`: foreign keys valid, `drNo` unique when set (case-insensitive), `keystageId` required iff the project uses keystage, every status/region/lot/KPI band present, exactly 3 projects with the required keystage and agency mix, all emails end with `@demo.example`, all phones match the fictional pattern, and an optional locally supplied word blocklist finds nothing
- [ ] T022 [P] Write storage tests in `tests/unit/db.test.ts`: first-load seeding, schema-version re-seed with notice, tolerant reads of corrupt keys, `resetAll()` clears every `pgd:*` key, write failures raise a notice without partial state
- [ ] T023 Implement the roles module in `src/auth/roles.ts` as the single source for navigation (in-scope items only), landing page, route access and control permissions exactly as in contracts/routes-and-access.md (`canEditProjects`, `canEditDeliveries`, `canSetAccepted` only for WarehouseAdmin, `canManageUsers` only for SuperAdmin, Viewer read-only)
- [ ] T024 [P] Write the role-matrix test in `tests/unit/roles.test.ts` covering navigation, landing page, route access and control permissions for all four roles
- [ ] T025 Implement the session and authentication context in `src/auth/AuthContext.tsx` (login by email and password against seeded users, logout, `switchRole`, session stored under `pgd:v1:session`) and the route guard in `src/auth/RouteGuard.tsx` (denied page redirects to `/login` with "You do not have the required role to view this page. Access denied."; signed-out deep links continue after login)
- [ ] T026 Build the application shell in `src/app/App.tsx` (BrowserRouter with every route from contracts/routes-and-access.md), `src/app/Layout.tsx` (navbar from the roles module with logout control) and `src/app/NotFound.tsx`
- [ ] T027 [P] Implement Toast and LoadingOverlay components in `src/components/Toast.tsx` and `src/components/LoadingOverlay.tsx` reproducing the original's success/danger toasts and loading overlay (from `original-source/template/header.php` and `assets/js/`)
- [ ] T028 [P] Implement DataTable and Pagination in `src/components/DataTable.tsx` and `src/components/Pagination.tsx` replicating the original DataTables look (search box, page size, info text, 10 per page, at most 8 page links, black pagination buttons); pagination controls hidden when there is a single page
- [ ] T029 [P] Implement FilterBar, ConfirmModal, StatusBadge and a peso display component in `src/components/FilterBar.tsx`, `src/components/ConfirmModal.tsx`, `src/components/StatusBadge.tsx` and `src/components/Peso.tsx`
- [ ] T030 [P] Port the original look into `src/styles/original.css` from `original-source/assets/css/*.css` (custom pagination, chart-item, drag-handle and dashboard styles) and import Bootstrap and Bootstrap Icons once in `src/main.tsx` (single Bootstrap version)
- [ ] T031 [P] Implement formatting helpers in `src/lib/format.ts` (Philippine peso with two decimals via `Intl.NumberFormat('en-PH')`, time-of-day greeting in `Asia/Manila`, date formatting) with tests in `tests/unit/format.test.ts`
- [ ] T032 [P] Create the parity-checklist template and method in `docs/parity/_template.md` (page structure, Bootstrap classes, CSS values, labels, validation messages, scripts, extracted from `original-source/`; states and responsive notes; owner review box)

**Checkpoint**: Foundation ready - the app boots, seeds itself, enforces roles, and user story implementation can begin

---

## Phase 3: User Story 1 - Enter the demo and experience each role (Priority: P1) 🎯 MVP

**Goal**: A visitor logs in (or switches role) and sees the correct landing page and navigation, and can reset the demo.

**Independent Test**: Sign in as each account, check landing page and navigation, open a forbidden page, switch roles, then reset (quickstart V1, V2).

- [x] T033 [P] [US1] Write the end-to-end test in `tests/e2e/auth.spec.ts` (quickstart V1 and V2): login success message "Welcome <name>!", failure message "Invalid username or password!", landing page and navigation per role, denied-page message, role switcher, and Reset demo data restoring the seed in under 2 seconds
- [x] T034 [P] [US1] Create `docs/parity/login.md` from `original-source/index.php`, `script/authenticate.php` and its CSS
- [x] T035 [US1]  —  COMPLETED: T035 implemented and verifiedCOMPLETED: login page, roles, reset working Implement the login page in `src/features/login/LoginPage.tsx` matching the original card, with the four demo accounts listed (demo chrome) and the Warehouse Admin account highlighted when arriving from a scan redirect
- [x] T036 [US1]  —  COMPLETED: T036 implemented and verifiedCOMPLETED: login page, roles, reset working Wire flash toasts for login success, failure and access denied in `src/app/Layout.tsx` and `src/features/login/LoginPage.tsx`
- [x] T037 [US1]  —  COMPLETED: T037 implemented and verifiedCOMPLETED: login page, roles, reset working Implement the role switcher in `src/demo/RoleSwitcher.tsx` that applies exactly the same rules as signing in (navigation, landing page, access; a page that is not allowed for the new role follows the denied rule)
- [x] T038 [US1]  —  COMPLETED: T038 implemented and verifiedCOMPLETED: login page, roles, reset working Implement Reset demo data in `src/demo/ResetButton.tsx` with ConfirmModal calling `resetAll()`, `deleteAllPhotos()`, reseed and sign-out, then navigating to `/login`
- [x] T039 [US1]  —  COMPLETED: T039 implemented and verifiedCOMPLETED: login page, roles, reset working Implement the storage notice banner in `src/demo/StorageNotice.tsx` for re-seed after a version change and for blocked or full storage
- [x] T040 [US1] Owner review of the login page against `docs/parity/login.md`, then record the result in the checklist  —  COMPLETED

**Checkpoint**: Login, roles and reset work on their own

---

## Phase 4: User Story 2 - Browse and manage projects (Priority: P1)

**Goal**: Browse, filter and add projects and explore every project area.

**Independent Test**: Add a project, filter to it, open every area of a keystage and a non-keystage project (quickstart V3).

- [x] T041 [P] [US2] Write unit tests in `tests/unit/projects.test.ts` (Year/Agency/Status filters, 10 per page pagination, validation: "keystage only settable when agency is DepEd", end date >= start date, contract amount and ABC required and >= 0) and `tests/unit/projectReports.test.ts` (percentages by region, lot and status)
- [x] T042 [P] [US2] Write the end-to-end test in `tests/e2e/projects.spec.ts` (quickstart V3): filter, add a project, reload persistence, open every area of a keystage and a non-keystage project, Viewer sees no add/edit controls
- [ ] T043 [P] [US2] Create `docs/parity/projects.md` from `original-source/projects.php`, `project_details.php`, `project_details_data.php`, `schools.php`, `lots.php`, `keystage.php`, `items.php`, `packages.php`, `project_reports.php` and their partials
- [ ] T044 [US2] Implement project queries in `src/data/queries/projects.ts` (Year/Agency/Status filters, pagination)
- [ ] T045 [US2] Implement the Projects page in `src/features/projects/ProjectsPage.tsx` with Filter and Remove Filter actions and 10 per page pagination
- [ ] T046 [US2] Implement the Add Project modal in `src/features/projects/AddProjectModal.tsx` with reference number, name, contract amount, approved budget, agency, keystage toggle (DepEd only), start and end dates, peso formatting and validation
- [ ] T047 [US2] Implement the project workspace layout and sub-navigation in `src/features/projects/ProjectLayout.tsx` (Overview, Schools, Lots, Keystage only when the project uses it, Items, Packages, Reports)
- [ ] T048 [US2] Implement the Overview page in `src/features/projects/OverviewPage.tsx` (project information, delivery progress, the project's deliveries, and read-only Invoices and Document Checklist sections with no upload)
- [ ] T049 [P] [US2] Implement the Schools area in `src/features/projects/SchoolsPage.tsx` (list, add a single school, link to the project; no CSV or ID-range import)
- [ ] T050 [P] [US2] Implement the Lots area in `src/features/projects/LotsPage.tsx` (list, add, edit with contract number)
- [ ] T051 [P] [US2] Implement the Keystage area in `src/features/projects/KeystagePage.tsx` (list, add, edit; reachable only for keystage projects)
- [ ] T052 [P] [US2] Implement the Items area in `src/features/projects/ItemsPage.tsx` with columns Item Name, Unit, Actions (no supplier cost shown) and list, add, edit
- [ ] T053 [P] [US2] Implement the Packages area in `src/features/projects/PackagesPage.tsx` (dimensions, contents modal with item and quantity, "qty (int >= 1)")
- [ ] T054 [US2] Implement project report queries in `src/data/queries/projectReports.ts` and the Reports page in `src/features/projects/ReportsPage.tsx` with charts by region, by lot and by status using react-chartjs-2
- [ ] T055 [US2] Hide Add, Edit and Delete controls for Viewer across `src/features/projects/*` using the roles module
- [ ] T056 [US2] Owner review of every Projects page against `docs/parity/projects.md`, then record the result

**Checkpoint**: Projects work independently of deliveries

---

## Phase 5: User Story 3 - Track deliveries (Priority: P1)

**Goal**: List, filter, add (single and batch), edit and inspect deliveries, including status changes.

**Independent Test**: Create a delivery and a batch, filter to them, add a DR number, change status, open details (quickstart V4, V5).

- [ ] T057 [P] [US3] Write unit tests in `tests/unit/deliveries.test.ts`: grouping by DR number with no-DR rows shown individually, cascading filters (Year, Project, Status, Lot, Keystage, Region, Division, Municipality) and search, "drNo unique when set; required when added singly; absent for batch-created deliveries until edited; case-insensitive uniqueness", "keystageId required iff project.keystage", batch creating one delivery per selected school without DR number, one pending package row per package of the lot, Edit status rules (Accepted only for WarehouseAdmin, applies to all packages, revert to Pending keeps photos, Cancelled keeps photos), delivery status derivation (Accepted only when all packages accepted; Delivered with `deliveredDate` only when all delivered)
- [ ] T058 [P] [US3] Write the end-to-end test in `tests/e2e/deliveries.spec.ts` (quickstart V4 and V5): cascading filters, add single, batch, add DR number in Edit, duplicate rejection, status control per role
- [ ] T059 [P] [US3] Create `docs/parity/deliveries.md` from `original-source/deliveries.php`, `deliveries_details.php`, their partials and `script/save_deliveries.php`, `save_batch_deliveries.php`, `update_delivery.php` (ignoring inventory logic), `filterDeliveries.php`
- [ ] T060 [US3] Implement delivery queries in `src/data/queries/deliveries.ts` (joins replacing the original SQL: project, school, lot, keystage, warehouse label, package statuses with item contents; grouping; cascading filters; search)
- [ ] T061 [US3] Implement delivery status rules in `src/data/queries/deliveryStatus.ts` (derivation after confirmations; applying the Edit status control to all packages; Accepted restricted to WarehouseAdmin)
- [ ] T062 [US3] Implement the Deliveries page in `src/features/deliveries/DeliveriesPage.tsx` (DR-grouped rows, coloured package status, row selection checkboxes, search, pagination)
- [ ] T063 [US3] Implement the cascading filter bar in `src/features/deliveries/DeliveryFilters.tsx` (dependent selects enabled in order)
- [ ] T064 [US3] Implement the Add Delivery modal in `src/features/deliveries/AddDeliveryModal.tsx` (DR number required, project, school, lot, keystage if used, package type, date, validation)
- [ ] T065 [US3] Implement the Batch Delivery modal in `src/features/deliveries/BatchDeliveryModal.tsx` (project, lot, keystage if used, package type, date and a school multi-select; creates one delivery per school without DR number)
- [ ] T066 [US3] Implement the Edit Delivery modal in `src/features/deliveries/EditDeliveryModal.tsx` (DR number entry with uniqueness check, date, status control offering Pending, Delivered and Cancelled to all editors and Accepted only to WarehouseAdmin)
- [ ] T067 [US3] Implement the delivery details page in `src/features/deliveries/DeliveryDetailsPage.tsx` showing delivery data, packages and saved photos read from `src/data/photos.ts`
- [ ] T068 [US3] Hide add, batch, edit and status controls for Viewer in `src/features/deliveries/*` using the roles module
- [ ] T069 [US3] Owner review of Deliveries, details and modals against `docs/parity/deliveries.md`, then record the result

**Checkpoint**: User Stories 1 to 3 together form the suggested MVP

---

## Phase 6: User Story 4 - Confirm package receipt with a QR code (Priority: P2)

**Goal**: Confirm package receipt through a QR code or Simulate scan with photos.

**Independent Test**: Simulate-scan a pending package twice and see status and photos update (quickstart V6, V7, V8).

- [ ] T070 [P] [US4] Write unit tests in `tests/unit/scan.test.ts`: status machine pending -> accepted -> delivered with delivered staying delivered, photo limit "At most 5 per confirmation", photos saved before status changes and a failed save leaves status unchanged, cancelled-delivery message, only WarehouseAdmin can accept pending, any visitor can deliver an accepted package
- [ ] T071 [P] [US4] Write the end-to-end test in `tests/e2e/scan.spec.ts` (quickstart V6, V7, V8): Simulate scan prompt for a non-warehouse role, Continue as Warehouse Admin, add 1 to 5 photos and a sixth refused, wrong and right arithmetic answers, confirm twice, signed-out scan redirects to login and returns
- [ ] T072 [P] [US4] Create `docs/parity/scan.md` from `original-source/entry.php`, `scan.php`, `check.php`, `success.php`, `captcha.php` and `generate_qr.php` (offline mode excluded)
- [ ] T073 [P] [US4] Implement the QR component in `src/components/QrCode.tsx` using `qrcode`, encoding `<origin>/scan?package=<packageStatusId>` from `window.location.origin`
- [ ] T074 [US4] Implement the confirmation logic in `src/data/queries/confirmPackage.ts` (validate photos 1 to 5, save photos, then advance the package, then derive the delivery status and `deliveredDate`; refuse Cancelled deliveries)
- [ ] T075 [US4] Show a QR code and a Simulate scan action per package in `src/features/deliveries/PackageQr.tsx` and place it in the Deliveries page and delivery details
- [ ] T076 [US4] Implement the Simulate scan prompt in `src/demo/SimulateScanPrompt.tsx` (explains that only Warehouse Admin can accept; "Continue as Warehouse Admin" switches the role and opens the receiving page)
- [ ] T077 [US4] Implement the receiving page in `src/features/scan/ScanPage.tsx` (packing list, project, school and DR number when assigned, photo picker with camera and multiple selection, five-photo limit message, arithmetic check, not-found page, delivery-cancelled message, pending-package redirect to `/login` for non-Warehouse-Admin visitors with return to the package)
- [ ] T078 [US4] Implement the success page in `src/features/scan/SuccessPage.tsx` showing the new status
- [ ] T079 [P] [US4] Implement the cross-device limitation note in `src/demo/LimitationNote.tsx` and show it on the receiving page
- [ ] T080 [US4] Owner review of the receiving and success pages against `docs/parity/scan.md`, then record the result

**Checkpoint**: The receipt flow works end to end

---

## Phase 7: User Story 5 - Read dashboards (Priority: P2)

**Goal**: Show KPI cards and the Sales Generation and Production dashboards with reorderable charts.

**Independent Test**: Compare card values and colours to the seed, reorder a chart and reload (quickstart V9).

- [ ] T081 [P] [US5] Write unit tests in `tests/unit/kpis.test.ts` for the FR-022 formulas: Projects Win, Margin (approved budget minus item supplier cost times package quantity, over approved budget), Sales Generation as their average, Completion Rate over school-and-lot pairs of Ongoing projects, Production as the average with the three stand-ins, colour bands, case-insensitive status matching
- [ ] T082 [P] [US5] Write the end-to-end test in `tests/e2e/dashboards.spec.ts` (quickstart V9): card values and colours, chart reorder persists after reload, figures change after a receipt
- [ ] T083 [P] [US5] Create `docs/parity/dashboards.md` from `original-source/dashboard.php`, `dashboard_sales_generation.php`, `dashboard_production.php`, their scripts and CSS, listing which charts depend on out-of-scope data and how each is handled
- [ ] T084 [US5] Implement KPI functions in `src/data/queries/kpis.ts` using `src/data/seed/kpiStandIns.ts` for Finance, Logistics Performance, Warehouse Performance and Delivered-versus-Paid
- [ ] T085 [US5] Implement the main dashboard in `src/features/dashboards/DashboardPage.tsx` (three cards with colour bands, Asia/Manila greeting, subtle "sample" footnote on stand-in values)
- [ ] T086 [P] [US5] Implement the Sales Generation dashboard in `src/features/dashboards/SalesGenerationPage.tsx` with the original chart types computed from stored data
- [ ] T087 [P] [US5] Implement the Production dashboard in `src/features/dashboards/ProductionPage.tsx` with the original chart types computed from stored data (charts that need out-of-scope data omitted per the parity checklist)
- [ ] T088 [US5] Implement drag-to-reorder charts in `src/features/dashboards/SortableCharts.tsx` using @dnd-kit with order saved per dashboard in `meta.chartOrder`
- [ ] T089 [US5] Owner review of the three dashboards against `docs/parity/dashboards.md`, then record the result

**Checkpoint**: Dashboards reflect delivery changes

---

## Phase 8: User Story 6 - Print documents (Priority: P2)

**Goal**: Open print-ready receipts, labels and reports.

**Independent Test**: Open each print view and confirm complete A4 content (quickstart V10).

- [ ] T090 [P] [US6] Write unit tests in `tests/unit/print.test.ts` (receipts and labels grouped per DR number; deliveries without a DR number cannot be selected; the four report queries) and the end-to-end test in `tests/e2e/print.spec.ts` (quickstart V10)
- [ ] T091 [P] [US6] Create `docs/parity/print.md` from `original-source/generate_qr.php`, `generate_labels.php` and the four in-scope `report/print_*.php` pages (delivery status, accepted and delivered by lot, by region, monthly trend)
- [ ] T092 [US6] Implement the print layout and A4 print styles in `src/features/print/PrintLayout.tsx` and `src/styles/print.css` (report header, page breaks, hide navigation)
- [ ] T093 [US6] Implement the Acknowledgement Receipt route in `src/features/print/ArPage.tsx` (one receipt per selected DR with its QR code; opens the browser print dialog)
- [ ] T094 [P] [US6] Implement the packing labels route in `src/features/print/LabelsPage.tsx`
- [ ] T095 [P] [US6] Implement the four report routes in `src/features/print/ReportPage.tsx` for `/print/reports/:name` with report queries in `src/data/queries/printReports.ts`
- [ ] T096 [US6] Add Batch Generate AR and Batch Generate Label actions to `src/features/deliveries/DeliveriesPage.tsx`, enabled only for selected deliveries that have a DR number
- [ ] T097 [US6] Owner review of the receipt, labels and reports against `docs/parity/print.md`, then record the result

**Checkpoint**: Printing works for in-scope documents

---

## Phase 9: User Story 7 - Manage users (Priority: P3)

**Goal**: Manage fictional users and reset passwords.

**Independent Test**: Add a user, sign in as them, edit, reset password (quickstart V11).

- [ ] T098 [P] [US7] Write unit tests in `tests/unit/users.test.ts` ("email (unique email)", role from the four allowed, "warehouseId shown and set only for WarehouseAdmin", password reset) and the end-to-end test in `tests/e2e/users.spec.ts` (quickstart V11)
- [ ] T099 [P] [US7] Create `docs/parity/users.md` from `original-source/users.php`, `partials/user_modal.php` and the user scripts
- [ ] T100 [US7] Implement the Users page in `src/features/users/UsersPage.tsx` (list, add and edit modal, reset password; SuperAdmin only) with the warehouse field shown only for the Warehouse Admin role, choosing from the fictional warehouses
- [ ] T101 [US7] Owner review of the Users page against `docs/parity/users.md`, then record the result

**Checkpoint**: Users page works

---

## Phase 10: User Story 8 - Be guided, and use it on a phone (Priority: P3)

**Goal**: A guided first visit and full usability at phone width.

**Independent Test**: First visit with banner and tour, then every page at 375 px (quickstart V12).

- [ ] T102 [P] [US8] Write the end-to-end test in `tests/e2e/mobile.spec.ts` (quickstart V12): at 375 px width every in-scope page has no clipped controls and no sideways page scroll, the navigation opens, welcome banner and tour appear on a first visit and can be relaunched
- [ ] T103 [P] [US8] Implement the welcome banner in `src/demo/WelcomeBanner.tsx` (explains the demo, offers the tour, dismissal stored in `meta.bannerDismissed`)
- [ ] T104 [US8] Implement the guided tour in `src/demo/GuidedTour.tsx` using driver.js with steps per role taken from the visible navigation, a Help control to relaunch it, and `meta.tourDismissed`
- [ ] T105 [US8] Add a navbar toggler and responsive navigation in `src/app/Layout.tsx` (the original has none) without changing the desktop navbar
- [ ] T106 [US8] Add responsive table behaviour in `src/components/DataTable.tsx` (card-style rows below 576 px) and stack filters and modals on small screens in `src/styles/responsive.css`
- [ ] T107 [US8] Make chart reordering work on touch in `src/features/dashboards/SortableCharts.tsx` (dnd-kit touch sensor) or degrade without errors
- [ ] T108 [US8] Record desktop-width Playwright screenshots in `tests/e2e/desktop-baseline.spec.ts` to prove the desktop look is unchanged by the responsive styles
- [ ] T109 [US8] Owner review of mobile layouts, banner and tour, then record the result in `docs/parity/mobile.md`

**Checkpoint**: All user stories complete

---

## Phase 11: Polish and Cross-Cutting Concerns

**Purpose**: Final validation and cross-cutting checks

- [ ] T110 Run every quickstart scenario V1 to V13 in `specs/001-philgeps-tracker-demo/quickstart.md` and fix any failure
- [ ] T111 [P] Write the documented-differences record in `docs/parity/documented-differences.md` (four roles, fixed Admin and Viewer quirks, hidden out-of-scope navigation, single Bootstrap version, navbar toggler, stand-in KPI values, Warehouse Admin as the only accepting role, Simulate scan prompt)
- [ ] T112 [P] Write the root `README.md` (what the demo is, how to run, test and deploy, list of demo chrome, demo accounts, link to the specs)
- [ ] T113 [P] Add the real-data scrub check in `tests/unit/scrub.test.ts` scanning `src/` and `public/` for non-fictional emails, phone patterns and the original brand name and logo files
- [ ] T114 [P] Measure the performance targets in `tests/e2e/performance.spec.ts`: populated dashboard within 10 seconds of opening (SC-001) and reset in under 2 seconds (SC-007)
- [ ] T115 Verify the Vercel deployment: deep links resolve through the rewrite in `vercel.json`, QR codes use the deployed origin, and the production build passes `npm run build`, `npm run lint`, `npm test` and `npm run e2e`
- [ ] T116 Constitution compliance review: tick each principle against the finished work and record the outcome in `docs/parity/constitution-review.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies. Start immediately.
- **Foundational (Phase 2)**: Depends on Setup. BLOCKS every user story.
- **User Stories (Phases 3 to 10)**: All depend on Foundational.
- **Polish (Phase 11)**: Depends on all desired user stories.

### User Story Dependencies

- **US1 (P1)**: After Foundational. No story dependencies; supplies login, roles and the demo chrome used by every other story.
- **US2 (P1)**: After Foundational. Uses US1 for sign-in; independently testable with seeded data.
- **US3 (P1)**: After Foundational. Uses seeded projects, lots and schools; independently testable. Does not need US2 screens.
- **US4 (P2)**: Depends on US3 (deliveries and package rows exist and are listed) and US1 (role switching, login redirect).
- **US5 (P2)**: After Foundational; reflects US3/US4 data changes but is testable on seed data alone.
- **US6 (P2)**: Depends on US3 (selecting deliveries with DR numbers).
- **US7 (P3)**: After Foundational. Independent.
- **US8 (P3)**: Cross-cutting. Best done after US1 to US6 pages exist, because it adds responsive styles, the banner and the tour to them.

### Within Each User Story

- Parity checklist and tests first (tests MUST fail before implementation)
- Queries before pages; pages before modals that depend on them
- Owner review closes each story

### Parallel Opportunities

- Setup tasks marked [P] together.
- In Foundational: `db.ts`, `photos.ts`, the seed files, components and styles are independent files.
- After Foundational: US1, US2, US3 and US7 can proceed in parallel; US5 can start once seeds exist.
- Within a story, tests and parity checklists marked [P] run together.

---

## Parallel Example: User Story 3

```text
# Launch together:
Task: "Write unit tests in tests/unit/deliveries.test.ts"
Task: "Write the end-to-end test in tests/e2e/deliveries.spec.ts"
Task: "Create docs/parity/deliveries.md from the original source"
```

---

## Implementation Strategy

### MVP First (User Stories 1 to 3, all priority P1)

1. Complete Phase 1 (Setup) and Phase 2 (Foundational).
2. Complete US1, US2 and US3.
3. **STOP and VALIDATE**: quickstart V1 to V5, plus owner review of each page.
4. Deploy to Vercel as a first preview.

US1 alone is only a login page, so the suggested MVP is the three P1 stories together.

### Incremental Delivery

1. Foundation, then US1 to US3 (MVP).
2. Add US4 (receipt flow), then US5 (dashboards), then US6 (printing), validating after each.
3. Add US7 and US8, then Polish.

### Working with an AI agent

Run one phase per session. After each phase, run lint and tests, then ask the owner to review the pages and tick the parity checklist.

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps each task to its user story
- Verify tests fail before implementing
- Commit after each task or logical group
- Avoid vague tasks, same-file conflicts and cross-story dependencies that break independence

---

## Final Verification (2026-11-07)

### Commands run and results
- `npm run build` — **PASS** (tsc -b && vite build, exit 0; built in ~4.8s)
- `npm run lint` — **PASS** (oxlint, exit 0; 6 warnings only, all `react` warnings)
- `npm run test:unit` — **PASS** (vitest run, 2 files, 29 tests)
- `npm run test:e2e` — **FAIL** — Playwright E2E did not pass (prior runs, logged in `test-run-output.txt` and `test-run2-output.txt`):
  - Run 1: 11 failed + 2 passed
  - Run 2: 8 failed + 5 passed
  - Failure signature: US1/US2 login and project-management E2E tests time out waiting for the `/dashboard` navigation / `input#email` element; the login redirect and page navigation do not complete reliably in the browser.

### US2 (project management) verification status
- T041 (unit tests) — `[x]` written
- T042 (E2E test) — `[x]` written, but currently failing
- T043–T056 (US2 implementation) — **NOT marked complete**: E2E verification failed, so these are not confirmed complete. Users of this file should fix the E2E failures (and finish/verify T043–T056) before recording US2 as complete.
