# Feature Specification: PhilGEPS Tracker Demo (Portfolio Showcase)

**Feature Branch**: `001-philgeps-tracker-demo`

**Created**: 2026-11-03

**Status**: Draft

**Input**: User description: "Build a frontend-only demo clone of the PhilGEPS / MMC Project Tracker, a procurement-to-delivery tracker for school-equipment contracts. It is a portfolio showcase: visitors open it with no setup, log in or switch between roles, browse projects and deliveries, confirm a package receipt through a QR code with photos, view dashboards, and print documents. There is no server or real database; all data is fictional and kept on the visitor's device. It must look and behave the same as the original, may be improved with mobile support, a welcome banner and a guided tour, and has a fictional brand."

## Clarifications

### Session 2026-11-03

- Q: When a user adds deliveries in a batch, what does the batch create and when does each delivery get its DR number? → A: Batch creates one delivery per selected school without a DR number; the DR number is entered later in Edit and must be unique when entered. Single add still asks for a DR number.
- Q: In Edit Delivery, should users be able to change a delivery's status directly, in addition to the QR receipt flow? → A: Yes. Edit includes a status control (Pending, Accepted, Delivered, Cancelled); a change applies to all of the delivery's packages, and reverting to Pending is allowed.
- Q: Which roles may move a Pending delivery to Accepted using the Edit status control? → A: Only Warehouse Admin, in both the QR flow and Edit. Every role that can edit deliveries can still set Delivered, Cancelled or Pending and change other fields.
- Q: What limits should apply to the photos added when confirming a package? → A: Up to 5 photos per confirmation, each reduced so its longest side is about 1,000 pixels; adding a sixth shows a message.
- Q: When a signed-in visitor who is not Warehouse Admin presses "Simulate scan" on a pending package, what should happen? → A: A prompt explains that only Warehouse Admin can accept and offers "Continue as Warehouse Admin"; one click switches role and opens the receiving page (demo-only addition).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Enter the demo and experience each role (Priority: P1)

A visitor opens the demo, sees a login page that looks like the original with demo accounts listed, signs in, and lands on the page appropriate to their role. After signing in they can switch to any other role to see how navigation and access change, and can reset the demo to its starting data at any time.

**Why this priority**: Role-based behaviour is a headline feature of the original, and the login is the entry point to every other story.

**Independent Test**: Sign in as each demo account, confirm the landing page and navigation for that role, open a page the role may not see, then reset the demo and confirm the starting state returns.

**Acceptance Scenarios**:

1. **Given** the login page, **When** a visitor enters valid demo credentials, **Then** they land on their role's start page and see a welcome message with their name.
2. **Given** the login page, **When** a visitor enters invalid credentials, **Then** an error message "Invalid username or password!" appears and they stay on the login page.
3. **Given** a signed-in visitor, **When** they choose another role in the demo role switcher, **Then** navigation, landing page and page access immediately follow that role's rules, exactly as if they had signed in as that role.
4. **Given** a signed-in visitor, **When** they open a page their role may not access, **Then** they are sent to the login page with the message "You do not have the required role to view this page. Access denied."
5. **Given** the visitor has changed data, **When** they use "Reset demo data" and confirm, **Then** all data returns to the starting set and they return to the login page.

---

### User Story 2 - Browse and manage projects (Priority: P1)

A visitor sees the list of projects, filters it by year, agency and status, pages through results, adds a new project, and opens a project to explore its Overview, Schools, Lots, Keystage (only for projects that use it), Items, Packages and Reports.

**Why this priority**: Projects are the root of all other data and the first screen for most roles.

**Independent Test**: Add a project, filter to it, and open every area of a project that uses keystage and one that does not.

**Acceptance Scenarios**:

1. **Given** the project list, **When** the visitor applies or removes filters, **Then** the list updates to match.
2. **Given** the Add Project form, **When** valid values are saved, **Then** the project appears in the list with a success message and is still there after reloading the page.
3. **Given** a project that does not use keystage, **When** its areas are shown, **Then** Keystage is absent; for a project that uses keystage it is present.
4. **Given** a project's Reports area, **When** opened, **Then** charts show delivery progress by region, by lot, and by status for that project.
5. **Given** a project's Overview, **When** opened, **Then** it shows project information, delivery progress, the project's deliveries, and read-only invoices and document checklist.

---

### User Story 3 - Track deliveries (Priority: P1)

A visitor sees deliveries grouped by delivery receipt (DR) number with each package's contents and status. They narrow the list with cascading filters and search, add single or batch deliveries, edit a delivery, and open a delivery's details including photos.

**Why this priority**: Deliveries are the operational core and feed the QR flow, dashboards, and printing.

**Independent Test**: Create a delivery and a batch, filter down to them, edit one, and open its details.

**Acceptance Scenarios**:

1. **Given** the deliveries page, **When** the visitor picks Year, then Project, then Status, then (Lot, Keystage) and (Region, Division, Municipality), **Then** dependent filters become available in that order and the list updates.
2. **Given** the Add Delivery form, **When** valid details including a DR number are saved, **Then** the delivery appears with every package marked pending.
3. **Given** the Batch Delivery form with a project, lot, keystage (if used), package type, date and a selection of schools, **When** it is saved, **Then** one delivery per selected school is created, each with pending packages and no DR number yet.
4. **Given** a delivery without a DR number, **When** the visitor edits it and enters a DR number, **Then** it is saved if the number is unique.
5. **Given** the Edit form for a delivery, **When** the visitor sets its status to Delivered (or, as Warehouse Admin, to Accepted), **Then** all of the delivery's packages take that status and the list, receiving page and dashboards reflect it.
6. **Given** a Super Admin or Office Admin editing a Pending delivery, **When** they open the status control, **Then** Accepted is not offered; it is offered only to Warehouse Admin.
7. **Given** an accepted or delivered delivery, **When** the visitor reverts its status to Pending, **Then** all of its packages return to pending.
8. **Given** the Edit form, **When** the visitor sets the status to Cancelled, **Then** the delivery shows as Cancelled in the list and its packages can no longer be confirmed through the receiving page.
9. **Given** a duplicate DR number or a missing required field, **When** the visitor saves, **Then** a clear message is shown and nothing is stored.
10. **Given** a delivery that has photos, **When** its details are opened, **Then** the photos are displayed.

---

### User Story 4 - Confirm package receipt with a QR code (Priority: P2)

A visitor sees a QR code for a package. They scan it with a phone, or press "Simulate scan" on a computer, to open the receiving page. There they review the packing list, add one or more photos, answer a simple arithmetic check, and confirm. The package moves from pending to accepted, and from accepted to delivered on the next confirmation, and a success page is shown.

**Why this priority**: It is the most distinctive interaction of the original and the best showcase, but it depends on deliveries existing.

**Independent Test**: Simulate a scan of a pending package twice and confirm its status and photos update in the deliveries list and dashboards.

**Acceptance Scenarios**:

1. **Given** a pending package, **When** the receiving page opens, **Then** it shows the project, school, DR number (when assigned) and the packing list (item and quantity).
2. **Given** no photo added or a wrong arithmetic answer, **When** the visitor tries to confirm, **Then** confirmation is blocked with a clear message.
3. **Given** valid photos and a correct answer, **When** the visitor confirms, **Then** the package advances one step (pending to accepted, or accepted to delivered), photos are saved with the delivery, and a success page shows the new status.
4. **Given** five photos already added, **When** the visitor tries to add a sixth, **Then** a message explains the limit and the sixth is not added.
5. **Given** a delivered package, **When** it is confirmed again, **Then** its status stays delivered.
6. **Given** a pending package and a visitor who is not signed in as Warehouse Admin, **When** they open its receiving page, **Then** they are sent to the login page.
7. **Given** a visitor signed in as Super Admin, Office Admin or Viewer, **When** they press "Simulate scan" on a pending package, **Then** a prompt explains that only Warehouse Admin can accept and offers "Continue as Warehouse Admin"; choosing it switches the role and opens the receiving page.
8. **Given** a package that does not exist, **When** its link is opened, **Then** a clear "not found" page is shown.
9. **Given** a visitor scanning with a phone, **When** they confirm, **Then** only that phone's data changes and a visible note explains that changes do not sync between devices.

---

### User Story 5 - Read dashboards (Priority: P2)

Authorised roles see a main dashboard with three headline cards (Sales Generation, Finance, Production), coloured green, yellow or red by performance, and can open the Sales Generation and Production dashboards, which contain charts. Charts can be dragged into a different order and the order is remembered.

**Why this priority**: Dashboards make the value of the data visible at a glance and are a strong portfolio visual.

**Independent Test**: Compare each card's value and colour to the starting data, drag a chart to a new position, reload, and confirm the order stays.

**Acceptance Scenarios**:

1. **Given** the starting data, **When** the main dashboard opens, **Then** each card shows its value in the correct colour band and a time-of-day greeting appears.
2. **Given** a dashboard, **When** a chart is dragged to a new position, **Then** the new order is kept after reloading.
3. **Given** a package status changes through the QR flow, **When** the dashboards are reopened, **Then** the affected figures reflect the change.

---

### User Story 6 - Print documents (Priority: P2)

From the deliveries page a visitor selects delivery receipts and opens a printable Acknowledgement Receipt (which includes a QR code) or printable packing labels. From reports they open printable delivery reports.

**Why this priority**: Printed documents are part of the real workflow and show breadth of the clone.

**Independent Test**: Open each printable view and confirm it shows complete content and prints cleanly on A4 paper.

**Acceptance Scenarios**:

1. **Given** selected DR numbers, **When** the visitor generates receipts, **Then** a print-ready view with one receipt per DR opens.
2. **Given** selected DR numbers, **When** the visitor generates labels, **Then** a print-ready packing-label view for the selection opens.
3. **Given** the available reports (delivery status, accepted and delivered by lot, accepted and delivered by region, monthly trend), **When** one is opened, **Then** it shows a report header and complete data ready to print.

---

### User Story 7 - Manage users (Priority: P3)

Administrators see a list of users, add a user, edit a user, and reset a user's password, working only with fictional accounts.

**Why this priority**: Supports the role story but is not needed to demonstrate the tracker itself.

**Independent Test**: Add a user, sign in as that user, then edit and reset the password.

**Acceptance Scenarios**:

1. **Given** the Add User form, **When** valid data is saved, **Then** the user appears in the list and can sign in.
2. **Given** the Warehouse Admin role is chosen, **When** the form updates, **Then** a warehouse field appears with a list of fictional warehouses.

---

### User Story 8 - Be guided, and use it on a phone (Priority: P3)

A first-time visitor sees a dismissible welcome banner explaining that this is a demo and offering a guided tour, which can be relaunched at any time. Every in-scope page is usable on a phone.

**Why this priority**: These make the demo self-explanatory for portfolio viewers, but the tracker works without them.

**Independent Test**: Open the demo for the first time, take the tour, then open every in-scope page at phone width.

**Acceptance Scenarios**:

1. **Given** a first visit, **When** the demo loads, **Then** a welcome banner explains the demo and offers the tour; dismissing it is remembered.
2. **Given** a phone-width screen, **When** any in-scope page is opened, **Then** no content is clipped, tables remain usable, and the navigation can be opened.
3. **Given** a computer-width screen, **When** any page is opened, **Then** it looks identical to the original.

---

### Edge Cases

- A photo cannot be saved because device storage is full or the photo limit is exceeded: show a friendly error and leave the package status unchanged.
- Stored data is from an older version of the demo: detect it, restore the starting data, and tell the visitor.
- A receiving link refers to a package that does not exist: show the "not found" page.
- A visitor opens a deep link while signed out: ask them to sign in, then continue to the page if their role allows it.
- The demo is open in two tabs: the latest change wins and the other tab shows current data when focused.
- A delivery with saved photos is cancelled or reverted to Pending: its saved photos stay attached and remain visible in its details.
- A touch device is used to reorder charts: reordering works or the order stays unchanged without errors.
- A project has fewer records than one page: pagination controls stay hidden.

## Requirements *(mandatory)*

### Functional Requirements

**Access and roles**

- **FR-001**: The system MUST provide a login page matching the original's look, with the demo accounts listed, a welcome message on success, and an error message on failure.
- **FR-002**: The system MUST support four roles, each with its own navigation, landing page and page-access rules based on the original, with the original's quirks fixed:
  - **Super Admin**: all in-scope areas (Dashboard, Projects with every project area, Deliveries, Users); lands on the Dashboard. Takes over what the original's Admin role did.
  - **Office Admin**: Dashboard, Projects with every project area, and Deliveries, but not Users; lands on the Dashboard. Takes over what the original's Office Coordinator did.
  - **Warehouse Admin**: Deliveries (view, add, edit), and the only role that can accept pending packages, through the receiving flow or the Edit status control; lands on Deliveries. Takes over what the original's Warehouse Coordinator did.
  - **Viewer**: read-only access to Projects and Deliveries (no add, edit or delete controls); lands on Projects.
- **FR-003**: The system MUST provide a demo-only role switcher after sign-in that applies exactly the same rules as signing in as that role.
- **FR-004**: The system MUST hide navigation items for areas outside this demo's scope (Warehouse, Logistics, Billing, Reports), so each role's navigation lists only in-scope areas.
- **FR-005**: The system MUST provide a "Reset demo data" control with confirmation that restores the starting data.

**Projects**

- **FR-006**: The system MUST list projects 10 per page with Year, Agency and Status filters, Filter and Remove Filter actions, and pagination.
- **FR-007**: Users MUST be able to add a project with reference number, name, contract amount, approved budget, agency (DepEd or DPWH), whether it uses keystage (DepEd only), and start and end dates, with amounts shown in Philippine pesos.
- **FR-008**: The system MUST provide per-project areas: Overview, Schools, Lots, Keystage (only when the project uses it), Items, Packages and Reports.
- **FR-009**: The Overview MUST show project information, delivery progress, the project's deliveries, and read-only invoices and document checklist (no uploads).
- **FR-010**: Users MUST be able to view and add schools, and list, add and edit lots, keystages, items and packages (packages with dimensions and item contents).
- **FR-011**: The Reports area MUST show delivery progress by region, by lot and by status as charts.

**Deliveries**

- **FR-012**: The system MUST list deliveries grouped by DR number, showing project, school, status, date, and each package's items and status; deliveries that do not yet have a DR number appear as individual rows.
- **FR-013**: The system MUST provide cascading filters (Year, Project, Status, Lot, Keystage, Region, Division, Municipality) and a search box.
- **FR-014**: Users MUST be able to add a single delivery (DR number required), add deliveries in a batch, and edit a delivery. A batch applies one project, lot, keystage (if used), package type and date to a selection of schools and creates one delivery per school without a DR number. A DR number can be entered or changed in Edit. Required fields MUST be validated and DR numbers MUST be unique when set. Edit MUST also include a status control (Pending, Accepted, Delivered, Cancelled) whose change applies to all of the delivery's packages, and reverting to Pending MUST be allowed. Only Warehouse Admin is offered Accepted; Viewer cannot add or edit.
- **FR-015**: The system MUST provide a delivery details page that shows saved photos.

**QR receipt flow**

- **FR-016**: The system MUST show a QR code for each package that opens its receiving page, and a "Simulate scan" action beside it for computer users. When a signed-in visitor who is not Warehouse Admin uses "Simulate scan" on a pending package, a prompt MUST explain that only Warehouse Admin can accept and offer "Continue as Warehouse Admin", which switches the role and opens the receiving page (a demo-only addition).
- **FR-017**: The receiving page MUST show the packing list, require at least one photo (multiple allowed, camera or library), require a correct answer to a simple arithmetic question, and show a success page after confirmation. Accepting a *pending* package (here or through the Edit status control) MUST be limited to users signed in as Warehouse Admin; anyone else who opens a pending package's receiving page directly (for example by scanning its QR code) is sent to the login page, which lists the Warehouse Admin demo account. Confirming an already accepted package (accepted to delivered) is open to any visitor, as in the original. Warehouse Admin lands on Deliveries in the demo, because the Warehouse area is out of scope.
- **FR-018**: Each package MUST follow the lifecycle pending, accepted, delivered through the receiving flow; confirming a delivered package leaves it delivered. A delivery's status can also be changed in Edit (FR-014), and a package of a Cancelled delivery MUST show a "delivery cancelled" message on its receiving page with confirmation unavailable.
- **FR-019**: A confirmation MUST accept up to 5 photos; each photo MUST be reduced so its longest side is about 1,000 pixels before saving, kept with the delivery, and shown in delivery details. Adding a sixth photo MUST show a message and not add it. If saving fails, the package status MUST NOT change.
- **FR-020**: The receiving page MUST show a note that changes made on another device are not shared.

**Dashboards**

- **FR-021**: The main dashboard MUST show three cards (Sales Generation, Finance, Production) coloured green at 80 and above, yellow at 50 and above, red below 50, with a time-of-day greeting in Philippine time.
- **FR-022**: Card values MUST follow the original's calculations: Projects Win is the share of projects that are Ongoing, Delivered or Completed; Margin is approved budget minus item cost over approved budget for those projects; Sales Generation is the average of Projects Win and Margin; Completion Rate is the share of school-and-lot pairs with delivered or accepted status among ongoing projects; Production is the average of Completion Rate, Logistics Performance, Warehouse Performance and Delivered-versus-Paid.
- **FR-023**: Finance, Logistics Performance, Warehouse Performance and Delivered-versus-Paid depend on areas outside this demo and MUST use fictional sample values, indicated by a subtle "sample" note.
- **FR-024**: The system MUST provide Sales Generation and Production dashboards with the original's chart types and allow charts to be reordered by dragging, remembering the order.

**Printing**

- **FR-025**: The system MUST provide printable Acknowledgement Receipts (with QR code), packing labels, and the reports for delivery status, accepted and delivered by lot, accepted and delivered by region, and monthly trend, using print-ready layouts on A4.

**Users**

- **FR-026**: Administrators MUST be able to list, add and edit users and reset passwords, with a warehouse choice for the Warehouse Admin role.

**Experience, fidelity and data**

- **FR-027**: The system MUST show a dismissible welcome banner and a guided tour that can be relaunched.
- **FR-028**: The system MUST be fully usable on phone-width screens, including a way to open the navigation, without changing the computer-width appearance.
- **FR-029**: Screens MUST look and behave like the original (layout, colours, icons, labels, messages, confirmations, loading indicators); every difference MUST be a documented difference or a visibly separate demo-only addition.
- **FR-030**: All data MUST be fictional, and the demo MUST use its own fictional product name and logo instead of the original's.
- **FR-031**: Data MUST be created automatically on first visit, be the same for every visitor at the start, and persist on the visitor's device across reloads and restarts.

### Key Entities *(include if feature involves data)*

- **Project**: a procurement contract (reference number, name, agency, contract amount, approved budget, dates, status, keystage or not).
- **Lot**: a subdivision of a project with a contract number; contains packages and, for keystage projects, keystages.
- **Keystage**: an education-level grouping within a lot, used only by some projects.
- **Item**: an equipment item with unit and supplier cost, belonging to a project.
- **Package**: a type of delivery bundle (C1 to C6) with dimensions and item contents (item and quantity).
- **School**: a recipient with region, division and municipality; linked to projects.
- **Delivery**: a delivery to a school, with date and status (Pending, Delivered, Accepted, Cancelled), identified by a DR number that is unique once set (batch-created deliveries have none until edited).
- **Package Status**: the state of one package within a delivery (pending, accepted, delivered), with its photos.
- **Photo**: a picture saved when a package is confirmed.
- **User**: a demo account with name, email, one of four roles and, for Warehouse Admin, a warehouse.
- **Warehouse**: a fictional named location used only as a label.
- **Invoice** and **Document checklist item**: read-only fictional records shown on a project's Overview.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A first-time visitor reaches a populated dashboard within 3 clicks and 10 seconds of opening the demo, with no setup.
- **SC-002**: 100% of in-scope pages pass a parity checklist against the original and are accepted by the owner on review.
- **SC-003**: All four roles show the correct navigation, landing page and access outcome.
- **SC-004**: The full receipt journey (open, add photo, answer, confirm) completes in under 60 seconds and the new status appears in deliveries and dashboards.
- **SC-005**: The starting data contains every delivery status, region, lot and KPI colour band at least once, and enough deliveries to show multiple pages.
- **SC-006**: Every in-scope page works at 375 px width with no clipped controls and no sideways page scrolling.
- **SC-007**: "Reset demo data" restores the starting data in under 2 seconds.
- **SC-008**: Data entered by a visitor is still present after reloading and after closing and reopening the browser.
- **SC-009**: A review of the starting data finds zero real people, schools, phone numbers, emails, logos or brand names from the original.

## Assumptions

- **Audience and purpose**: a portfolio showcase for prospective clients and employers; visitors need no account setup.
- **Starting data**: exactly 3 projects (one with keystage, one without, one for the other agency), about 60 schools across several regions, and about 150 deliveries, all hand-written and fictional. Project pagination is therefore not visible by default but works when more projects are added; delivery pagination is visible.
- **In scope**: login and roles, projects with their areas, deliveries, users, the Main, Sales Generation and Production dashboards, the QR receipt flow, and printable documents.
- **Out of scope**: warehouse and inventory management, logistics, billing and invoicing workflows, bulk file import and export, working offline, the Operation, Finance and Collection dashboards, dark mode, and a formal accessibility audit.
- **Original as reference**: no screenshots of the original exist; look and behaviour are taken from the original's source code and checked by the owner on the running demo.
- **Roles**: the original's seven roles are reduced to four as a documented difference: Admin merges into Super Admin, Office Coordinator into Office Admin, and Warehouse Coordinator into Warehouse Admin. One demo account is listed per role.
- **Receipt flow**: only Warehouse Admin can accept a pending package, so a visitor must sign in as Warehouse Admin to complete the first step; accepting a package does not change any stock levels, because warehouse management is out of scope; the stock-availability column is omitted.
- **Sample values**: stand-in KPI values and fictional warehouse names are the only numbers not derived from the starting data.
- **Supplier cost**: item costs exist in the starting data (needed for the Margin calculation) but are not shown or edited on any screen, as in the original.
- **Statuses**: comparisons ignore upper and lower case, as in the original.
- **Arithmetic check**: a simple addition question, as in the original.
- **Delivery status changes**: editing a delivery's status, including Cancelled and reverting to Pending, never changes stock levels (stock is out of scope) and never deletes saved photos.
- **Printing and DR numbers**: receipts and labels are generated per DR number, so only deliveries that have a DR number can be selected for them.
- **Cross-device note**: a phone and a computer keep separate data, so a scan on a phone does not update the computer's view.
- **Browsers**: current versions of Chrome, Edge, Firefox and Safari on computers and phones.
