# Implementation Plan: PhilGEPS Tracker Demo (Portfolio Showcase)

**Branch**: `001-philgeps-tracker-demo` | **Date**: 2026-11-03 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-philgeps-tracker-demo/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command; its definition describes the execution workflow.

## Summary

Rebuild the in-scope screens of the original PHP/MySQL tracker (login and four roles, projects and their areas, deliveries, users, three dashboards, the QR receipt flow, and printable documents) as a static single-page web app that looks and behaves like the original. Technical approach (see [research.md](./research.md)): Vite, React and TypeScript with Bootstrap 5 for visual parity and Chart.js for charts; a typed repository layer over browser storage (structured data in `localStorage`, compressed photos in IndexedDB) replaces SQL; deterministic fictional seed data with a reset control; QR codes, photo handling and printing run in the browser; deployed as a static build on Vercel. Key decisions:
- One `roles` module drives navigation, landing pages, route access and control visibility for the four roles.
- Every SQL join and KPI of the original becomes a pure, unit-tested function.
- Parity is verified through per-page checklists derived from the original source (no screenshots exist) plus owner review.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript ~7.0.2 (strict, `erasableSyntaxOnly`) on Node ^20.19 or >=22.12 for tooling only

**Primary Dependencies**: React 19.3, React Router 7.18, Bootstrap 5.3.8 and Bootstrap Icons 1.13, Chart.js 4.6 with react-chartjs-2 5.3, qrcode 1.5, @dnd-kit/core 6.3 and @dnd-kit/sortable 10, idb 8, driver.js 1.10; build with Vite 8.3 (versions verified 2026-11-03, see research.md)

**Storage**: Browser `localStorage` (versioned JSON collections) and IndexedDB (photo blobs); no server or database

**Testing**: Vitest 5.1 with jsdom and Testing Library for logic and components; Playwright 1.64 for smoke journeys (desktop and 375 px); oxlint for linting

**Target Platform**: Current Chrome, Edge, Firefox and Safari on desktop and mobile; static hosting on Vercel

**Project Type**: Single-page web application (frontend only)

**Performance Goals**: Populated dashboard within 10 seconds of opening (SC-001); reset in under 2 seconds (SC-007); instant filtering on about 150 delivery rows

**Constraints**: No network calls for data; localStorage about 5 MB (structured data expected under 200 KB); at most 5 photos per confirmation, about 1,000 px longest side; desktop look identical to the original; no PDF, jQuery or state-management libraries

**Scale/Scope**: About 20 screens, 4 roles, 3 projects, about 60 schools, about 150 deliveries

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Plan response | Result |
|---|---|---|
| I. Fidelity to the Original | Bootstrap 5 and Bootstrap Icons with the original's classes and CSS values; per-page parity checklists from the original source in `docs/parity/`; owner review per page; differences listed as documented differences or demo additions | Pass |
| II. Frontend-Only, Fictional Data | No backend or network data calls; localStorage plus IndexedDB for photos; seed authored from scratch; original source git-ignored and never committed; new fictional brand | Pass |
| III. Deterministic and Resettable State | Fixed-ID fixtures in `src/data/seed`; schema version in `meta`; visible Reset demo data control (`contracts/storage.md`) | Pass |
| IV. Test the Logic, Smoke the Flows | Vitest for queries, filters, KPIs, status transitions, seed integrity and roles; Playwright for journeys V1 to V13 in quickstart.md | Pass |
| V. Simplicity and Static Deployability | Static Vite build, one `vercel.json` rewrite, 12 runtime dependencies each justified (research.md section 19), no PDF/jQuery/state libraries | Pass |
| Technology and Delivery Constraints | Stack equals constitution (Vite, React, TypeScript, Bootstrap 5, Chart.js, Vercel); print via browser dialog; desktop is the parity baseline | Pass |
| Development Workflow | Spec Kit order followed (constitution, specify, clarify, plan; tasks next); no implementation before approval; demo additions isolated in `src/demo` | Pass |

**Re-check after Phase 1 design**: all gates still pass. The data model, contracts and quickstart add no new dependencies or scope. No violations.

## Project Structure

### Documentation (this feature)

```text
specs/001-philgeps-tracker-demo/
├── plan.md                  # This file (/speckit-plan command output)
├── research.md              # Phase 0 output (/speckit-plan command)
├── data-model.md            # Phase 1 output (/speckit-plan command)
├── quickstart.md            # Phase 1 output (/speckit-plan command)
├── contracts/               # Phase 1 output (/speckit-plan command)
│   ├── routes-and-access.md
│   └── storage.md
├── checklists/requirements.md
└── tasks.md                 # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
src/
├── app/                 # router, layout shell (navbar, toasts, loading overlay), route guards, not-found
├── auth/                # session, demo accounts, roles module (navigation, landing, access, controls)
├── data/
│   ├── db.ts            # localStorage collections, versioning, reset
│   ├── photos.ts        # IndexedDB photo store, canvas downscale
│   ├── repositories/    # one module per entity
│   ├── queries/         # joins, filters, project reports, KPIs, delivery status rules
│   └── seed/            # deterministic fictional fixtures, KPI stand-ins
├── features/
│   ├── login/  projects/  deliveries/  scan/  dashboards/  print/  users/
├── components/          # DataTable, FilterBar, Pagination, ConfirmModal, StatusBadge, QrCode, Toast
├── demo/                # RoleSwitcher, ResetButton, WelcomeBanner, GuidedTour, SimulateScanPrompt, LimitationNote
├── styles/              # original-look overrides on top of Bootstrap
└── main.tsx
public/                  # newly created fictional logo and favicons
tests/
├── unit/                # Vitest
└── e2e/                 # Playwright
docs/parity/             # per-page parity checklists derived from the original source
vercel.json              # single-page-app rewrite
original-source/         # original PHP source, read-only, git-ignored, never committed
```

**Structure Decision**: One Vite single-page project (frontend only) organised by feature folders. All storage access is isolated in `src/data`, so screens contain no storage logic. Everything that is not part of the original lives in `src/demo` so it can be removed without touching core screens (Development Workflow rule on demo chrome).

## Complexity Tracking

No Constitution Check violations; nothing to justify.
