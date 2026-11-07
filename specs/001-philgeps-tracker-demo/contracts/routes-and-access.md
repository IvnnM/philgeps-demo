# UI Contract: Routes, Roles and Access

**Spec**: [spec.md](../spec.md) FR-001 to FR-005, FR-016 to FR-018. This is the user-facing contract of the application (it has no server API).

## Roles and navigation (in-scope items only; out-of-scope items are hidden)
| Role | Navigation | Landing page |
|---|---|---|
| Super Admin | Dashboard, Projects, Deliveries, Users | Dashboard |
| Office Admin | Dashboard, Projects, Deliveries | Dashboard |
| Warehouse Admin | Deliveries | Deliveries |
| Viewer | Projects, Deliveries | Projects |

A logout control is always visible when signed in. The navbar collapses behind a toggler on phone widths (demo addition).

## Routes and access
| Path | Allowed roles | Notes |
|---|---|---|
| `/login` | public | Lists the four demo accounts (demo chrome) |
| `/dashboard`, `/dashboard/sales-generation`, `/dashboard/production` | Super Admin, Office Admin | |
| `/projects` | Super Admin, Office Admin, Viewer | Viewer read-only |
| `/projects/:id/overview`, `/schools`, `/lots`, `/keystage`, `/items`, `/packages`, `/reports` | Super Admin, Office Admin, Viewer | `/keystage` only when the project uses keystage; Viewer read-only |
| `/deliveries`, `/deliveries/:id` | all four roles | Viewer read-only |
| `/users` | Super Admin | |
| `/scan?package=<packageStatusId>` | public | See receiving rules below |
| `/scan/success?status=<status>` | public | |
| `/print/ar`, `/print/labels`, `/print/reports/:name` | Super Admin, Office Admin, Warehouse Admin, Viewer (as for the page that opens them) | A4 print layout; `:name` is one of `delivery-status`, `accepted-delivered-by-lot`, `accepted-delivered-by-region`, `monthly-trend` |
| `*` | public | Not-found page |

## Access behaviour
- **Denied page**: redirect to `/login` with danger message "You do not have the required role to view this page. Access denied."
- **Signed out deep link**: go to `/login`, then continue to the requested page if the role allows it.
- **Viewer**: no Add, Edit, Delete or Edit-status controls anywhere.

## Control visibility
| Control | Super Admin | Office Admin | Warehouse Admin | Viewer |
|---|---|---|---|---|
| Add/edit projects and project areas | yes | yes | n/a (no access) | no |
| Add single / batch delivery, edit delivery | yes | yes | yes | no |
| Edit status: Pending, Delivered, Cancelled | yes | yes | yes | no |
| Edit status: **Accepted** | no | no | **yes** | no |
| Users page | yes | no | no | no |
| Role switcher, Reset demo data, tour (demo chrome) | yes | yes | yes | yes |

## Receiving flow (`/scan`)
- **QR link format**: `<origin>/scan?package=<packageStatusId>`; the origin is the deployed site.
- **Unknown package id** → "not found" page.
- **Cancelled delivery** → message "delivery cancelled"; confirmation unavailable.
- **Pending package**, visitor not signed in as Warehouse Admin, opened directly (for example scanned) → redirect to `/login` (which lists the Warehouse Admin account); after sign-in return to the same package.
- **"Simulate scan"** (button beside each QR), pending package, signed-in visitor who is not Warehouse Admin → prompt explaining the rule with "Continue as Warehouse Admin"; choosing it switches the role and opens the receiving page (demo addition).
- **Accepted package** → confirmation open to any visitor (accepted → delivered).
- **Confirm** requires 1 to 5 photos and a correct arithmetic answer; photos are saved before the status changes.
- **Cross-device note** shown on the page: changes on another device are not shared.

## Original messages to reproduce
- Login success: "Welcome <name>!"; login failure: "Invalid username or password!".
