---
name: execute-task
description: Execute a single task from the work plan. Reads the task definition, implements the feature, verifies it, and commits. Use when dispatched by the coordinate skill, or when the user says "execute task", "/execute-task", or provides a task ID like "1.2".
argument-hint: "<task-id>"
triggers:
  - user
  - model
---

# Task Executor

Implement a single task from `docs/work-plan.md` in the current worktree/branch.

You are the **implementer**. You read the task spec, understand the codebase context, write the code, verify it works, and commit.

## Phase 1: Read Context

1. **Read the task definition:**
   - Read `docs/work-plan.md` and find the task matching `$ARGUMENTS` (e.g., `1.2`)
   - Extract: title, description, acceptance criteria, dependencies
   - If no argument provided, check the current branch name (`feature/task-<id>`) to infer the task ID

2. **Read project context:**
   - Read `AGENTS.md` for project conventions and commands
   - Read `.cognition/skills/execute-task/conventions.md` for detailed patterns
   - Read files relevant to the task (inspect the areas you'll modify)

3. **Check dependencies:**
   - If the task depends on another task, verify that task's changes are present in the current branch
   - If dependencies are missing, **stop and report** -- don't proceed with incomplete context

4. **Plan the implementation:**
   - List the files you'll create or modify
   - Identify which existing code patterns to follow
   - Note any decisions you need to make

## Phase 2: Implement

1. **Install dependencies** (if not already installed):
   ```bash
   npm run install:all
   ```

2. **Write the code:**
   - Follow conventions from `AGENTS.md` and `conventions.md`
   - Match existing code style in neighboring files
   - Keep changes focused on the task scope -- don't gold-plate

3. **Write or update tests:**
   - Add unit tests for new server logic (using `node:test` + `node:assert`)
   - Update E2E tests if the UI changes (using Playwright)
   - If the task doesn't warrant new tests, note why in the session log

## Phase 3: Verify

Run verification in order. Fix issues before moving to the next step.

1. **Unit tests:**
   ```bash
   npm run test:unit
   ```

2. **Start the app and smoke test** (if UI changes were made):
   ```bash
   npm start
   ```
   Check that the app loads and the new feature works. Stop the server when done.

3. **E2E tests** (if appropriate for the change):
   ```bash
   npm run test:e2e
   ```

4. **If tests fail:** diagnose, fix, and re-run from step 1. Don't proceed with failing tests.

## Phase 4: Commit

1. **Stage and review changes:**
   ```bash
   git add -A
   git diff --cached --stat
   ```

2. **Commit with a descriptive message:**
   ```bash
   git commit -m "<what was done> (<scope>)"
   ```
   Examples:
   - `Add customer list API endpoint (server)`
   - `Implement Customer Info tab with detail view (client)`
   - `Add CSV parsing for sample data import (server)`

   Do not include `Co-Authored-By` or `Generated with` trailers.

3. **If multiple logical changes**, split into separate commits. Keep each commit focused.

## Phase 5: Session Log

Write a brief session log to `docs/session-logs/<YYYY-MM-DD>-task-<id>.md`:

```markdown
# Session Log: Task <id> - <title>
**Date:** <date>
**Platform:** Devin CLI | Devin.ai
**Branch:** feature/task-<id>

## Outcome
- Files created/modified: <list>
- Tests added: <count>
- Status: DONE | PARTIAL | BLOCKED

## What Went Well
<brief notes>

## What Didn't Go Well
<friction points, if any>

## Decisions Made
<key choices and rationale>

## Discoveries
<new patterns, conventions, or issues found>
```

---

## Important Rules

- **Stay in scope.** Implement only what the task specifies. Note ideas for future tasks but don't act on them.
- **Follow conventions.** Read `conventions.md` and `AGENTS.md` before writing code. Match existing patterns.
- **Don't modify the work plan.** Only the coordinator updates `docs/work-plan.md` on main.
- **Don't merge.** Only commit to your feature branch. Integration is handled by the `integrate` skill.
- **Tests must pass.** Never commit with failing tests.
- **Session logs are not optional.** Write one even for trivial tasks -- it feeds the retro skill.
- **No Co-Authored-By trailers** in commit messages.
