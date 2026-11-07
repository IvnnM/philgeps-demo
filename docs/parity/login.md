# Parity Checklist: Login Page

**Source**: `original-source/index.php`, `script/authenticate.php`, their CSS and partials

**Owner review**: Pending

## Page structure
- [ ] Card-based layout with dark header
- [ ] Title "PhilGEPS Tracker" with box-arrow-right icon
- [ ] Form with email and password fields
- [ ] Submit button with box-arrow-in-right icon
- [ ] Demo accounts list in collapsible panel

## Bootstrap classes
- [ ] `card`, `card-header`, `card-body`
- [ ] `bg-dark`, `text-white` for header
- [ ] `form-control`, `form-label`
- [ ] `btn`, `btn-primary`
- [ ] `list-group`, `list-group-item`
- [ ] `alert`, `alert-danger`

## CSS values
- [ ] Form control: `#ced4da` border
- [ ] Card: `box-shadow: 0 0.5rem 1rem rgba(0,0,0,0.15)`
- [ ] Padding: `0.375rem 0.75rem`

## Labels and messages
- [ ] "Email address" label
- [ ] "Password" label
- [ ] "Demo accounts:" header
- [ ] Error: "Invalid username or password!"

## Validation messages
- [ ] Required field validation
- [ ] Email format validation

## Responsive
- [ ] Card works at 375px width
- [ ] No horizontal scroll on phone
