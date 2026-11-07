# Consistency Check — spec / plan / tasks vs. original source
Date: 2026-11-02 · Method: cross-read the three documents and verified claims against the original PHP source.

## A. Fixed now (no decision needed)
| # | Finding | Fix |
|---|---|---|
| A1 | Plan said "8 runtime deps" but listed ~12; also named two photo-compression options | Claim corrected; native canvas compression chosen (spec, plan, T008) |
| A2 | FR-017 formulas were described from memory | Rewritten from `dashboard.php`: Win % + Margin average; Completion Rate over Ongoing school–lot pairs; Production = avg of 4; Finance card hard-coded 81 applied *after* Sales Generation |
| A3 | Margin KPI needs `item.supplier_price × qty`, but no Items UI exposes supplier price | Item.supplierPrice required in seed, no UI (data-model, T032) |
| A4 | Original compares statuses case-insensitively via MySQL (`'ongoing'` vs `'Ongoing'`) | Rule added to data-model and T056 |
| A5 | FR-024 mentioned "password-confirm patterns" (only used by out-of-scope inventory approval) | Removed |
| A6 | Original navbar has **no toggler**, so nav is unreachable on phones | Added to T071 (mobile addition) |
| A7 | `routes.md` role table was approximate | Rewritten from `header.php`, `authenticate.php`, and per-page gates |

## B. Decisions (resolved with the recommended default; owner may override)
| # | Finding | Options |
|---|---|---|
| B1 | **Role quirks**: Admin lands on Dashboard but is denied; Viewer's nav links and landing page are all denied | Replicate faithfully / fix (Admin → Projects; Viewer read-only on Projects & Deliveries) |
| B2 | **Out-of-scope nav items**: Warehouse, Logistics, Billing, Reports (and Users visibility) appear in role navbars | Hide / show disabled "not in demo" |
| B3 | **Warehouse roles & scan accept rule**: Warehouse roles land on Inventory (out of scope); in the original, accepting a *pending* package requires a warehouse session, else redirect to login | Allow any role / limit accept to warehouse roles with a demo landing page |
| B4 | **Project Overview** also contains *Invoices* and a *Document Checklist* (BAC Resolution, Notice of Award, Notice to Proceed, Delivery Receipt, Inspection Report, with file upload); neither is in the data model or tasks | Include with fictional data / omit / show as static non-interactive |

## C. Coverage check (requirements ↔ tasks)
All 25 FRs and 8 user stories map to at least one task (checked by reading tasks.md). Gaps found: Overview invoices/documents (B4). No orphan tasks.

## D. Defaults applied for B1–B4 (override by editing spec.md FR-002/007/014, routes.md, tasks.md)
- B1 fix quirks (Admin → Projects; Viewer read-only) · B2 show out-of-scope nav items disabled with tooltip · B3 any visitor may accept pending packages; Warehouse roles land on Deliveries · B4 static Invoices/Document Checklist.
