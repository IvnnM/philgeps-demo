# Quickstart and Validation Guide: PhilGEPS Tracker Demo

This guide shows how to run the demo once built and how to prove each user story works end to end. It contains no implementation code; see [data-model.md](./data-model.md) and [contracts/](./contracts/) for details.

## Prerequisites
- Node.js ^20.19 or >=22.12
- A modern browser (current Chrome, Edge, Firefox or Safari)
- The original source in `original-source/` (git-ignored) for building parity checklists

## Setup and run
1. Scaffold from the official Vite React-TypeScript template, then install the runtime and dev dependencies listed in [research.md](./research.md) section 19.
2. Start the dev server and open the printed local address.
3. Run unit tests (Vitest) and smoke tests (Playwright); run the linter (oxlint).
4. Build for production and deploy the static output to Vercel; the SPA rewrite file sends every path to the app.

## Demo accounts (fictional, listed on the login page)
One account per role: Super Admin, Office Admin, Warehouse Admin, Viewer.

## Validation scenarios
| # | Story | Steps | Expected outcome |
|---|---|---|---|
| V1 | US1 Roles | Sign in as each account; use the role switcher; open a forbidden page | Correct landing page and navigation for the role; denied page shows the "Access denied" message on the login page |
| V2 | US1 Reset | Change data, press Reset demo data, confirm | Starting data restored in under 2 seconds; back at login |
| V3 | US2 Projects | Filter the list; add a project; open every area of a keystage and a non-keystage project | Filters work; new project persists after reload; Keystage appears only when used |
| V4 | US3 Deliveries | Use cascading filters; add a single delivery with a DR number; add a batch; edit a batch delivery to add a DR number | Batch makes one delivery per school without a DR number; duplicates are rejected |
| V5 | US3 Status | In Edit, change status as Office Admin and as Warehouse Admin | Accepted offered only to Warehouse Admin; changes apply to all packages; revert to Pending works |
| V6 | US4 Receipt | As Super Admin press Simulate scan on a pending package | Prompt offers Continue as Warehouse Admin; role switches and receiving page opens |
| V7 | US4 Receipt | Add 1 to 5 photos, answer the question, confirm; try a sixth photo; confirm again | Status advances pending → accepted → delivered; sixth photo refused with a message; photos visible in delivery details |
| V8 | US4 Phone | Scan a QR code with a phone, signed out | Redirected to login for a pending package; note explains changes do not sync across devices |
| V9 | US5 Dashboards | Open the dashboards as Super Admin; reorder a chart; reload; complete a receipt | Cards show correct colours; order persists; figures reflect the new status |
| V10 | US6 Printing | Select deliveries with DR numbers; open receipts, labels and each report | Print-ready A4 views with complete content |
| V11 | US7 Users | As Super Admin add a user, sign in as that user, reset the password | User works; warehouse field shows only for Warehouse Admin |
| V12 | US8 Experience | First visit; take the tour; open every page at 375 px width | Welcome banner and tour work and can be relaunched; no clipped controls or sideways page scrolling |
| V13 | Data safety | Search the starting data and the repository | Zero real names, contacts, logos or brand names from the original |

## Parity check
For each page, tick its checklist in `docs/parity/` (derived from the original source), then ask the owner to review the running page. After approval, record Playwright screenshots as regression baselines.
