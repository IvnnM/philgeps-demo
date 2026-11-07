<!--
SYNC IMPACT REPORT (temporary review scratch; remove before committing)
Version change: (unversioned template) -> 1.0.0 (initial ratification)
Modified principles: none (all new)
Added principles: I. Fidelity to the Original; II. Frontend-Only, Fictional Data;
  III. Deterministic and Resettable State; IV. Test the Logic, Smoke the Flows;
  V. Simplicity and Static Deployability
Added sections: Technology and Delivery Constraints; Development Workflow
Removed sections: none
Templates reviewed: plan-template.md (Constitution Check reads this file at runtime),
  spec-template.md, tasks-template.md -- no changes required
Deferred TODOs: none
-->

# PhilGEPS Demo Constitution

## Core Principles

### I. Fidelity to the Original (NON-NEGOTIABLE)
The demo MUST look and behave like the original system it clones (the MMC Project Tracker):
same Bootstrap 5 visual language, layouts, colours, icons, labels, validation messages, modals,
toasts, table behaviour and chart types. Internal code structure MAY be modernised. The original
source code is the reference of truth for look and behaviour, because no screenshots exist.
Every page MUST have a parity checklist derived from that source and reviewed by the owner.
Any deviation MUST be listed in the spec as a Documented Difference or a Demo Addition.

### II. Frontend-Only, Fictional Data
The product MUST run entirely in the browser with no backend, no real database and no network
calls for data. Structured data MUST live in `localStorage`; binary data that cannot fit its
quota (photos) MUST live in `IndexedDB`. All seed data MUST be fictional. Real school names,
people, phone numbers, emails, accounts, uploaded files, logos and brand names from the original
MUST NOT appear in this repository. Original source files MUST NOT be committed.

### III. Deterministic and Resettable State
Seed data MUST be hand-authored with stable identifiers so links, QR codes and tests are
reproducible. The app MUST seed itself on first load, MUST version its stored schema, and MUST
provide a visible way to reset all stored data back to the seed.

### IV. Test the Logic, Smoke the Flows
Business logic (queries, filters, KPI formulas, status transitions, seed integrity) MUST be
covered by unit tests. Key user journeys MUST be covered by browser smoke tests. A task is not
done until its tests pass and its parity checklist is ticked and reviewed by the owner.

### V. Simplicity and Static Deployability
The output MUST be a static build deployable with no server configuration beyond a single-page
app rewrite. Dependencies MUST be few and each MUST be justified in the plan. Features outside
the approved spec MUST NOT be built (YAGNI); scope changes go through the spec first.

## Technology and Delivery Constraints
- Stack: Vite, React and TypeScript, with Bootstrap 5 and Bootstrap Icons for styling and
  Chart.js for charts. Alternatives require an amendment to this constitution.
- Hosting target: Vercel (static).
- Desktop rendering is the parity baseline. Mobile responsiveness MUST NOT change the desktop look.
- Printable documents MUST use print-styled pages and the browser print dialog; no PDF library.
- Supported browsers: current Chrome, Edge, Firefox and Safari, on desktop and mobile.

## Development Workflow
- Spec Kit order MUST be followed: constitution, specify, clarify, plan, tasks, analyze,
  implement. No implementation begins until the owner approves the spec and plan.
- Work proceeds in independently demonstrable user-story slices, highest priority first.
- Anything not in the original system (role switcher, reset control, guided tour, welcome
  banner, mobile layouts, limitation notes) MUST be visually distinguishable as demo chrome and
  removable without affecting core screens.
- When documents conflict, stop and resolve the conflict in the spec rather than guessing.

## Governance
This constitution supersedes other practices. Amendments MUST be documented with a version bump
and approved by the owner. Versioning follows semantic rules: MAJOR for removed or redefined
principles, MINOR for added principles or materially expanded guidance, PATCH for clarifications.
Every plan MUST pass the Constitution Check; any violation MUST be recorded in the plan's
Complexity Tracking table with a justification. Compliance is reviewed at the end of each phase.

**Version**: 1.0.0 | **Ratified**: 2026-11-03 | **Last Amended**: 2026-11-03
