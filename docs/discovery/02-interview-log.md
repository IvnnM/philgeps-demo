# Interview Log (one question at a time)

Decisions made here feed `/speckit-constitution`, `/speckit-specify`, `/speckit-clarify`, and `/speckit-plan`.

| # | Topic | Question | Answer | Status |
|---|---|---|---|---|
| 1 | Demo purpose & audience | Who is this demo for and what should it achieve? | **Portfolio / showcase of my work** | ✅ answered |
| 2 | Scope | Which modules are in v1? | **Core + Showpiece** (Login, Projects + sub-pages, Deliveries, Users, Dashboards, QR scan flow, printable AR/labels/reports) | ✅ answered |
| 3 | Roles | Which roles to demo and how to switch? | **Both**: faithful login page (identical to original) + role switcher after login | ✅ answered |
| 4 | Sample data | Volume & realism of fictional data? | **Small & curated**: ~3 projects, ~60 schools, ~150 deliveries (hand-authored, fictional) | ✅ answered |
| 5 | "Identical" definition | Pixel-identical vs same look & behaviour; keep Bootstrap/DataTables/Chart.js? | **Same look & behaviour**; markup/code underneath may be modernised (components, bundler allowed) | ✅ answered |
| 6 | Tech stack | Which framework/build tooling? | **Vite + React + TypeScript** (recommended by Claude, accepted) | ✅ answered |
| 7 | Server-feature replacements | How to replace QR, PDF/AR/labels, photo upload, captcha? | **Real QR codes** (open scan page at hosted URL) **+ "Simulate scan" button** beside each QR | ✅ answered |
| 8 | Photo upload | How should the scan page's photo step work? | **Real file/camera picker; photos compressed & stored locally**, persisted and shown in delivery details | ✅ answered |
| 9 | Printable outputs | AR / labels / 10 reports: browser print vs generated PDF? | **Print-styled pages + browser print dialog** (Save as PDF); no PDF library | ✅ answered |
| 10 | Hosting | Where will it be deployed? | **Vercel** | ✅ answered |
| 11 | Improvements | Which improvements beyond parity? | **Full mobile responsiveness** + **Guided tour & welcome banner** (dark mode and a11y pass not selected) | ✅ answered |
| 12 | Testing & parity verification | How to verify quality and visual parity? | **Vitest** (data logic) + **Playwright smoke tests**; visual parity checked **manually against screenshots you provide** | ✅ answered |
| 13 | Dashboards | Which of the 5 sub-dashboards (and KPI logic) to include? | **Main dashboard + Sales Generation + Production only** (Operation, Finance, Collection dropped) | ✅ answered |

## Implications of Q12
- Vitest covers the repository/query layer (joins, KPI formulas, status transitions, inventory-free accept logic).
- Playwright smoke: login, role switch + nav, project list/detail, add delivery, scan flow (simulate), print routes render, reset data.
- **Superseded (Q17):** owner cannot supply screenshots; parity checklists are derived from the original source, with owner review per phase and Playwright baselines of the demo as regression guards.

## Implications of Q11
- Responsive layouts must keep desktop view identical to the original; mobile adds collapsed navbar (original already uses `navbar-expand-lg`), card-style or horizontally scrollable tables, stacked filters/modals.
- Guided tour (e.g. driver.js / custom) with a dismissible welcome banner; both are clearly demo-only additions and can be re-launched from a Help control.
- Basic keyboard/label hygiene still expected as good practice, but no formal a11y audit in v1.

## Implications of Q10
- Can use clean URLs (`BrowserRouter`) with a `vercel.json` SPA rewrite instead of hash routing; QR codes use `window.location.origin`. (Supersedes the HashRouter assumption in Q6.)
- HTTPS is available, so a service worker/PWA is technically possible later (offline mode is out of v1 scope).
- Vite static build, zero server config, preview deployments per branch.

## Implications of Q9
- No jsPDF/html2pdf dependency; dedicated print routes with `@media print` CSS (A4), matching the original `report/print_*.php` approach.
- AR and packing labels become print routes too (original used dompdf A4 portrait).

## Implications of Q8
- Photos are downscaled client-side (e.g. max ~1024px, JPEG ~0.7) and stored in **IndexedDB** (localStorage's ~5 MB cap can't hold them). All structured data stays in **localStorage** as requested. This is a technical necessity, flagged as a minor deviation from "localStorage only".
- Cap photos per delivery and show a friendly error on quota failure; "Reset demo data" clears both stores.

## Implications of Q7
- QR encodes `<hosted-url>/#/scan?id=<package_status_id>&delivery_id=<id>`; seed data must be **deterministic** so a phone with empty storage resolves the same IDs.
- **Known limitation:** a phone has its own localStorage, so a scan on a phone will NOT update the desktop view. Document this in the demo (a small info note on the scan page). Simulate-scan on desktop is the path that updates the visible dashboard.
- Captcha: keep the original's simple math captcha, client-side (assumed; revisit in spec if you disagree).

## Implications of Q6
- Bootstrap 5 + Bootstrap Icons used directly for visual parity; Chart.js via react-chartjs-2; dnd-kit (or SortableJS) for chart reorder; `qrcode` lib; print-CSS for AR/labels/reports.
- Hash routing (HashRouter) for static hosting; role-guarded routes; typed localStorage repository layer.
- DataTables: custom styled table vs React wrapper still to be decided in the plan.

## Implications of Q5
- Visual parity is the acceptance bar: same Bootstrap 5 look, layouts, colours, icons, DataTables behaviour, Chart.js chart types, modals, toasts.
- Underlying structure is free: component-based code, bundler, TypeScript, tests all allowed.
- Needs a verification method in the spec (side-by-side screenshots per page vs. original).

## Implications of Q4
- Fits comfortably in localStorage (~tens of KB); photos are the only size risk (cap/compress or store in IndexedDB).
- Curate so every status, region, lot, keystage and KPI colour band (green/yellow/red) appears; at least one project with keystage=1 and one without, one DepEd and one DPWH.
- Pagination (10/page) still needs >10 rows in Projects/Deliveries to be visible: ~150 deliveries satisfies this; 3 projects does not, so consider 11+ projects or lower page size (decide in spec).

## Implications of Q3
- Login page reproduces original (email/password, toast on error) against fictional seeded users; demo credentials hinted on page.
- Role switcher is a *demo-only addition* (an allowed improvement) and must re-apply role-based navbar + landing-page + access-denied toast exactly as the original.

## Implications of Q2
- **Out of v1:** Warehouse/Inventory, Logistics (+Leaflet map), Billing groups, CSV import/export, offline/service-worker mode.
- **Dependency to resolve later:** scan flow's *accept* step deducts warehouse stock in the original; with Warehouse out of scope it must be simulated or skipped.
- Delivery list's Warehouse column and Logistics/Warehouse dashboard KPIs need fictional stand-ins or removal.

## Implications of Q1
- Optimise for first-impression polish, a guided/zero-setup experience, and breadth of visible features over operational depth.
- Demo must run with no login friction (e.g. one-click role switcher) and have a "Reset demo data" control.
- Must be publicly hostable (static), so **all data fictional**; no real DepEd names/contacts.

## Planned topics (to be asked one at a time, order may change)
2. Scope — which modules are in / out for v1
3. Roles — which roles to demo, and how to switch between them
4. Sample-data volume & realism (fictional names, regions, projects)
5. Storage — localStorage vs IndexedDB for photos / large datasets, reset-demo button
6. "Identical" definition — pixel-identical vs. same look & behaviour; keep Bootstrap/DataTables/Chart.js?
7. Tech stack for the clone — static multi-page HTML (closest to original) vs. build tool
8. Replacing server features — QR, PDF/AR/labels, photo upload, CSV import/export, captcha, offline mode
9. Hosting/deployment target (GitHub Pages, static server, local only)
10. Improvements wishlist (accessibility, responsive, i18n, dark mode, guided tour, ...)
11. Constitution principles (testing, browser support, no external network, etc.)

| 14 | Branding | Keep or rebrand? | **Fictional rebrand**: new name & logo, same layout & colours | ✅ answered (resolves FR-025) |
| 15 | Dashboard KPIs | Finance card & Production sub-KPIs | **Three cards kept**: Finance = static sample value; Production keeps 4 sub-KPIs with fictional stand-ins for out-of-scope ones | ✅ answered (resolves FR-017) |

| 16 | Pagination | 3 projects hide pagination; add more projects? | **Exactly 3 projects**; pagination implemented & tested but not visible on Projects (visible on Deliveries) | ✅ answered |

## Drafts produced
- `.specify/memory/constitution.md` v1.0.0
- `specs/001-philgeps-demo/{spec,plan,research,data-model,quickstart}.md`, `contracts/`
- Open: 0 `[NEEDS CLARIFICATION]` markers left in spec.md; branding, dashboard KPIs, pagination resolved
- Status: **awaiting owner approval; no code written**

## Approval
- 2026-11-02: Owner approved spec + plan.
- `tasks.md` generated (76 tasks, 8 phases). Owner cannot supply screenshots (Q17): parity reference switched to original source code; constitution bumped to v1.0.1. Pending: go-ahead to start Phase 0.

## Consistency check (Q18)
- Report: `docs/analysis/consistency-report.md` — 7 fixes applied, 4 decisions pending (B1 role quirks, B2 out-of-scope nav, B3 warehouse roles/scan accept, B4 overview invoices/documents).

## Handoff (owner request)
- Q19 not answered; owner asked to finish the md files for handoff to their own agent (Hermes). Recommended defaults applied for B1–B4 (see consistency-report §D). Added `AGENTS.md` and `docs/handoff-prompts.md`. tasks.md now 77 tasks.

## Restart (Q20): proper Spec Kit run
- Hand-written drafts archived to `docs/archive/v0-hand-drafts/`.
- Step 1 `/speckit-constitution` executed via the real skill + `resolve-template.sh`: constitution v1.0.0 ratified 2026-11-03.
- Next: step 2 `/speckit-specify` (feature description will be derived from interview answers Q1–Q18).
- Step 2 `/speckit-specify` executed: `specs/001-philgeps-tracker-demo/spec.md`, `checklists/requirements.md`, `.specify/feature.json`. 3 `[NEEDS CLARIFICATION]` markers awaiting owner (FR-002, FR-004, FR-017).
- Clarification answers: Q1=A (fix Admin/Viewer quirks), Q2=B (hide out-of-scope nav), Q3=B (only warehouse roles may accept pending packages). Owner proposes a smaller role set (merge removed roles into their admin role); FR-002 pending that decision.
- Q4: role set = 4 roles (Super Admin, Office Admin, Warehouse Admin, Viewer). FR-002 resolved. Spec has 0 clarification markers; checklist 16/16 pass. Ready for `/speckit-clarify` (optional) or `/speckit-plan`.
- Step 3 `/speckit-clarify` executed: 5 questions (batch/DR numbers, Edit status control, who may accept via Edit, photo limits, Simulate-scan prompt) integrated into spec.md `## Clarifications`. Checklist 16/16. Next: `/speckit-plan`.
- Step 4 `/speckit-plan` executed (no hooks): `plan.md`, `research.md`, `data-model.md`, `quickstart.md`, `contracts/routes-and-access.md`, `contracts/storage.md`. Dependency set verified by scratch install + build + lint. Constitution Check: all gates pass pre- and post-design. Next: `/speckit-tasks`.
- Step 5 `/speckit-tasks` executed (no hooks): `tasks.md` with 116 tasks in 11 phases, 56 parallelizable. Format validated (checkbox, sequential IDs, story labels, file paths); all 31 FRs mapped to tasks. Next: `/speckit-analyze` (read-only), then implementation.
- Analyze skipped by owner (Q8). Handoff prepared: `AGENTS.md`, `docs/HANDOFF.md`; prerequisites gate and checklist gate verified PASS.
