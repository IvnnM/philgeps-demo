# Phase 0 Research: PhilGEPS Tracker Demo

**Date**: 2026-11-03 | **Spec**: [spec.md](./spec.md)

All Technical Context unknowns are resolved below. Library versions were checked against the npm registry on 2026-11-03, and the full dependency set was installed and built in a scratch project (React 19.3.1, TypeScript 7.0.2, Vite 8.3.5, Node 22) with no resolution conflicts, a clean `tsc -b && vite build`, and a clean `oxlint` run.

## 1. Toolchain baseline
- **Decision**: Scaffold with the official `create-vite` 9.3.3 `react-ts` template and keep its pinned baseline: React ^19.3.1, TypeScript ~7.0.2, Vite ^8.3.5, `@vitejs/plugin-react` ^6, oxlint. Node ^20.19 or >=22.12 (tooling only).
- **Rationale**: The template's combination is known to work together; hand-picking versions risks peer conflicts (Vite 8's React plugin has an unusual peer set). Verified by building the starter.
- **Alternatives considered**: Hand-assembled Vite config (more risk, no benefit); Next.js (adds a server runtime the constitution forbids); pinning TypeScript 5/6 (unnecessary since TS 7 builds and lints clean here).
- **Implication**: the template enables `erasableSyntaxOnly`, so code MUST avoid TypeScript `enum` and `namespace`; use union types and `as const` objects.

## 2. Routing and hosting
- **Decision**: `react-router-dom` 7.18.5 with `BrowserRouter`; Vercel static hosting with a `vercel.json` rewrite sending all paths to `index.html`. Clean URLs; QR links use `window.location.origin`.
- **Rationale**: Constitution V (static deploy, one SPA rewrite). Clean URLs read better in a portfolio and in QR codes than hash routes.
- **Alternatives**: HashRouter (only needed on hosts without rewrites; rejected); file-based routers (extra tooling).

## 3. Styling and parity
- **Decision**: Bootstrap 5.3.8 CSS and Bootstrap Icons 1.13.2 imported directly, plus a small stylesheet reproducing the original's custom CSS (pagination buttons, chart-item and drag-handle styles, dashboard cards). No Bootstrap JS bundle for components we rebuild in React (modals, dropdowns, collapse implemented with React state).
- **Rationale**: Constitution I. The original uses Bootstrap 5 with Bootstrap Icons, so using the same classes gives matching visuals. Original loaded 5.3.2 (CDN) and 5.3.7 (local) at once; the demo uses a single version (5.3.8) as a documented, invisible difference.
- **Alternatives**: react-bootstrap (wraps the same CSS, but extra dependency and different DOM in places); Tailwind/MUI (break parity).

## 4. Data tables
- **Decision**: A custom `DataTable` component styled to match the original's DataTables look (search box, page-length, info text, pagination); no jQuery.
- **Rationale**: The data set is small (about 150 rows); pulling in jQuery + DataTables for it conflicts with Constitution V.
- **Alternatives**: DataTables React wrapper (adds jQuery); TanStack Table (headless, more code than needed).

## 5. Charts
- **Decision**: `chart.js` 4.6.1 with `react-chartjs-2` 5.3.1 (peer: React up to 19, Chart.js ^4.1.1, verified).
- **Rationale**: Same engine as the original's charts, so chart types and look carry over.
- **Alternatives**: Recharts, ECharts (different visuals).

## 6. Drag-to-reorder charts
- **Decision**: `@dnd-kit/core` 6.3.1 + `@dnd-kit/sortable` 10.0.0 (peers: React >=16.8, verified). Order saved per dashboard on the device (not per role).
- **Rationale**: Declarative and works with touch and keyboard; the original used SortableJS imperatively.
- **Alternatives**: SortableJS (imperative DOM mutation fights React); native HTML5 drag (poor touch support).

## 7. QR codes
- **Decision**: `qrcode` 1.5.4 rendering to canvas/data URL on the client.
- **Rationale**: Mature, small, no server. (Last release Aug 2024; stable API, acceptable for a demo.)
- **Alternatives**: `qr-code-styling` (heavier); hand-written encoder (no).

## 8. Photos
- **Decision**: Native canvas downscale (longest side about 1,000 px, JPEG quality about 0.7), maximum 5 per confirmation, stored as Blobs in IndexedDB via `idb` 8.0.4 keyed by package-status id. The package status is updated only after photos save successfully.
- **Rationale**: Spec FR-019; localStorage's roughly 5 MB limit cannot hold photos. Native canvas avoids an extra compression library.
- **Alternatives**: base64 in localStorage (quota); `browser-image-compression` (unneeded dependency).

## 9. Structured data storage
- **Decision**: Versioned JSON collections in `localStorage` behind a typed repository layer (`src/data`). Seed is TypeScript fixtures with fixed IDs. A schema version mismatch triggers re-seed with a notice. Reset clears all app keys and the photo database.
- **Rationale**: Constitution II and III. Expected data under 200 KB.
- **Alternatives**: IndexedDB for everything (more complex, no need at this size); a state library with persistence (extra dependency).

## 10. Authentication and roles
- **Decision**: Four fictional demo accounts (one per role) with credentials shown on the login page; session stored on the device. One `roles` module is the single source for navigation, landing page, route access and control visibility, per `contracts/routes-and-access.md`. No security claim is made.
- **Rationale**: Spec FR-001 to FR-004; a single source avoids the original's inconsistent per-page gates.
- **Alternatives**: Per-page checks as in the original (the source of its quirks).

## 11. Package and status model (resolves the clarify-step deferral)
- **Decision**: A delivery owns one package-status row per package defined for its lot (and keystage if used). Each row has its own QR code and status (pending, accepted, delivered). No per-delivery package quantity is modelled.
- **Rationale**: Verified in the original schema and `get_delivery_packages.php`. The original's package quantity field only drives stock deduction, which is out of scope.
- **Delivery status** follows the original's rule (verified in `check.php`): after a package is confirmed, the delivery moves to Accepted only when *all* its packages are accepted, and to Delivered (recording a delivered date) only when *all* are delivered; otherwise it keeps its current status. The Edit status control sets the delivery and all of its packages together (spec FR-014); Cancelled is explicit.
- **Alternatives**: Modelling quantities (unused in v1).

## 12. KPI calculations
- **Decision**: Pure functions in `src/data/queries/kpis.ts` implementing spec FR-022 exactly; stand-in values (Finance, Logistics Performance, Warehouse Performance, Delivered-versus-Paid) in one clearly named seed file. Status comparisons are case-insensitive. Supplier cost exists in seed items but has no screen.
- **Rationale**: Mirrors `dashboard.php`; unit-testable (Constitution IV).

## 13. Printing
- **Decision**: Dedicated print routes with `@media print` A4 CSS; the page opens the browser print dialog. No PDF library.
- **Rationale**: Constitution technology constraints and the owner's answer. Viewer may open prints (read-only output).
- **Alternatives**: jsPDF/html2pdf (rejected by owner).

## 14. Guided tour and welcome banner
- **Decision**: `driver.js` 1.10.2 for the tour; steps defined per role; banner and tour dismissal stored on the device; both re-launchable from a Help control.
- **Alternatives**: custom tour (more code); Shepherd.js (heavier).

## 15. Responsive strategy
- **Decision**: Bootstrap grid plus `table-responsive`; card-style rows for tables below 576 px; add a navbar toggler (the original has a collapsing navbar but no toggler button, so its menu is unreachable on phones). Desktop CSS stays untouched.
- **Rationale**: FR-028 and Constitution technology constraints.

## 16. Time zone and formatting
- **Decision**: `Intl.DateTimeFormat` with `Asia/Manila` for the greeting; `Intl.NumberFormat('en-PH', { currency: 'PHP' })` for pesos.

## 17. Testing
- **Decision**: Vitest 5.1.0 with jsdom 30 and Testing Library 16 for logic and key components; Playwright 1.64.1 for smoke journeys on desktop and a 375 px viewport; oxlint for linting.
- **Rationale**: Constitution IV. Vitest 5 supports Vite 8 (peer verified).

## 18. Fidelity method (no screenshots available)
- **Decision**: For each page, a parity checklist derived from the original source (structure, Bootstrap classes, CSS values, labels, validation messages, scripts) lives in `docs/parity/`. The original source sits in a git-ignored `original-source/` folder. After the owner approves a page, Playwright screenshots of the demo become regression baselines.
- **Rationale**: Constitution I; the original cannot be run here (no PHP/MySQL) and no screenshots exist.

## 19. Dependency justification (Constitution V)
| Runtime dependency | Why it is needed |
|---|---|
| react, react-dom | UI framework chosen in constitution |
| react-router-dom | Routing, route guards, deep links |
| bootstrap, bootstrap-icons | Visual parity |
| chart.js, react-chartjs-2 | Charts matching original |
| @dnd-kit/core, @dnd-kit/sortable | Chart reordering |
| qrcode | QR codes for packages and receipts |
| idb | Small, typed IndexedDB wrapper for photos |
| driver.js | Guided tour |

Twelve runtime packages; none duplicates another. No state library, no PDF library, no jQuery.

## 20. Deferred spec items resolved here
- Viewer printing: allowed (read-only output).
- Chart-order memory: per device, per dashboard.
- Guided tour steps: defined per role at implementation time from the visible navigation.
