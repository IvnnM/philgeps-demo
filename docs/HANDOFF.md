# Handoff: running implementation with your AI agent (Hermes or any agent)

## What the agent needs
The whole project folder, because `.specify/`, `specs/`, `AGENTS.md` and `.claude/skills/` work together. Spec Kit's own slash commands (`/speckit-implement`) are not installed for Hermes, so the agent follows the same instructions as plain text from `.claude/skills/speckit-implement/SKILL.md`.

## One-time setup
1. Unzip the project into a new folder and open it in your agent.
2. Create `original-source/` inside it and unzip `philgeps-source-review.zip` there (task T009 does this too). It is git-ignored; it is only a reference for parity.
3. Make it a git repo (`git init`) so each task or phase can be committed.

## Prompts (copy-paste, one at a time)

### 1. Orientation (no code)
> Read `AGENTS.md` and every file it lists, in order. Do not write code. Follow Step 1 to 3 of `.claude/skills/speckit-implement/SKILL.md` (prerequisite check, checklist gate, load context). Reply with: a 10-line summary of what we are building, the checklist status table, and any conflicts or questions you found.

### 2. Phases 1 and 2 (Setup and Foundational)
> Execute Phase 1 and Phase 2 of `specs/001-philgeps-tracker-demo/tasks.md`, following `.claude/skills/speckit-implement/SKILL.md` and the plan. Mark each completed task `- [x]`. Run lint and tests. Stop at the Phase 2 checkpoint and report.

### 3. Each user story phase (change the phase number)
> Execute Phase 3 (User Story 1) of `tasks.md`. Write the parity checklist and tests first and confirm the tests fail, then implement. Mark tasks `- [x]`, run lint, unit tests and the story's end-to-end test, then stop at the checkpoint and report. I will review the pages and tick the parity checklist.

Order: Phase 3 (US1), 4 (US2), 5 (US3) = **suggested MVP**; then 6 (US4), 7 (US5), 8 (US6), 9 (US7), 10 (US8), 11 (Polish).

### 4. Review prompt after each phase
> Compare what you built with the spec's acceptance scenarios and functional requirements for this phase, and with `plan.md` and the contracts. List any requirement not met, any task ticked but not working, and any deviation.

### 5. If you want to change something
> I want to change X. Do not touch code. Update `spec.md` (and `plan.md`, `data-model.md`, `contracts/` or `tasks.md` if affected), show me the diff, and wait for my approval.

## Your part
- After each story phase, open the running app, check it against that story's parity checklist in `docs/parity/`, and tell the agent what differs from the original.
- Approve before moving to the next phase.

## If the agent loses context
Start a fresh session and send prompt 1, then continue from the first unticked task in `tasks.md`.
