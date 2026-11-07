# AGENTS.md

This repository uses **Spec-Driven Development with GitHub Spec Kit**. The specification, plan and tasks are approved. Your job is to **implement `tasks.md`**, not to redesign.

## Source of truth (read in this order before any code)
1. `.specify/memory/constitution.md`
2. `specs/001-philgeps-tracker-demo/spec.md`
3. `specs/001-philgeps-tracker-demo/plan.md`
4. `specs/001-philgeps-tracker-demo/research.md`, `data-model.md`, `contracts/`, `quickstart.md`
5. `specs/001-philgeps-tracker-demo/tasks.md` (the work list)

## How to implement
Follow the procedure in `.claude/skills/speckit-implement/SKILL.md` (these are plain instructions; slash commands may not exist in your agent). In short: check `checklists/` pass, load the files above, then execute `tasks.md` phase by phase, tests before implementation, and mark each finished task `- [x]` in `tasks.md`.

## Rules
- One phase at a time. Stop at each **Checkpoint** and report what you built, what you ran, and any deviation.
- Do not build anything outside the spec (see "Out of scope" in `spec.md` Assumptions).
- All data is fictional. Never copy real names, contacts, logos or brand names from `original-source/` (git-ignored, read-only, used only for parity checklists).
- If documents conflict or something is ambiguous, **stop and ask**. Do not guess. Changes to requirements go into `spec.md` first, with the owner's approval.
- Ignore `docs/archive/` if present (superseded drafts).
