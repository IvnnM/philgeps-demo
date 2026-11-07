# Contract: Browser Storage

**Spec**: FR-005, FR-019, FR-031; Success Criteria SC-007, SC-008.

## localStorage (prefix `pgd:v1:`)
| Key suffix | Content |
|---|---|
| `projects`, `lots`, `keystages`, `items`, `packages`, `packageContents`, `schools`, `projectSchools`, `deliveries`, `packageStatuses`, `users`, `warehouses`, `invoices`, `documentChecklist` | JSON arrays of the entities in `data-model.md` |
| `meta` | `{ schemaVersion, seedId, bannerDismissed, tourDismissed, chartOrder }` |
| `session` | `{ userId, role }` |

## IndexedDB
- Database `pgd-photos`, object store `photos` (keyPath `id`, index `packageStatusId`).

## Behaviour
- **First load**: if `meta` is missing, seed all collections from the deterministic fixtures.
- **Version mismatch** (`schemaVersion` differs): re-seed and show a notice.
- **Reset demo data**: delete every `pgd:*` key and the `pgd-photos` database, re-seed, sign out.
- **Photo save order**: save photos, then update PackageStatus; on failure show a friendly message and change nothing.
- **Quota / blocked storage**: catch errors on every read and write, show a visible notice, and keep the app usable in memory for the session.
- **Two tabs**: last write wins; collections reload on window focus.
- **Reads** are tolerant: missing or corrupt keys trigger a re-seed of that collection with a notice.
