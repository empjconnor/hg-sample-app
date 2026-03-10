---
name: integrate
description: Merge completed task branches back into main. Surveys work branches, integrates them sequentially, resolves conflicts, verifies, and cleans up worktrees. Use when the user says "integrate", "merge", or after parallel tasks complete.
argument-hint: "[all | <task-id>]"
triggers:
  - user
  - model
---

# Integration Skill

Merge completed task branches back into main -- one at a time, sequentially. All conflict resolution happens in work branches so main only receives clean merges.

## Determine Mode

Parse the user's prompt:

- `integrate` or `all` -> **Survey all** work branches, then integrate
- `integrate <task-id>` (e.g., `integrate 1.2`) -> **Direct integrate** that specific branch
- `cleanup` -> **Cleanup mode** -- remove stale worktrees and branches

---

## Step 1: Survey Work Branches

List all worktrees and remote branches to find task branches:

```bash
git worktree list
git branch -r | grep feature/task-
```

For each `feature/task-*` branch, check if it has commits beyond main:

```bash
git log main..feature/task-<id> --oneline
```

Present a summary:

```
| Task | Branch | Status | Commits |
|------|--------|--------|---------|
| 1.2  | feature/task-1-2 | 2 commits (ready) | Add customer list API... |
| 1.3  | feature/task-1-3 | 3 commits (ready) | Implement Customer Info... |
| 1.4  | feature/task-1-4 | 0 commits (no work) | -- |
```

Skip branches with no commits. **Wait for user confirmation** on which branches to integrate and in what order.

---

## Step 2: Integrate Each Branch (Sequential)

For each branch, in order:

### a) Survey the branch

Before making any changes, inspect what the branch contains:

```bash
git log main..feature/task-<id> --oneline
git diff main..feature/task-<id> --stat
git diff main..feature/task-<id> --name-only
```

### b) Present overview and wait for approval

Show a summary:

```
Integrating feature/task-1-2 (2 commits):
  a1b2c3d Add customer list API endpoint
  d4e5f6a Add unit tests for customer API

Files changed:
| Type | File | Details |
|------|------|---------|
| Server | server/src/index.js | Modified (new routes) |
| Test | server/src/models/models.test.js | Modified (new tests) |
| Docs | docs/session-logs/2026-03-10-task-1-2.md | New |

Proceed?
```

**Wait for user approval before making any changes.**

### c) Merge main into work branch

If a local worktree exists:
```bash
cd "C:\Dev\Hg_AEA\ElephantCarpaccio\worktrees\task-<id>"
git merge main
```

If remote-only (Devin.ai branch), fetch and merge locally:
```bash
git fetch origin feature/task-<id>
git checkout feature/task-<id>
git merge main
```

### d) Resolve conflicts

Expected conflicts:
- `docs/work-plan.md` -- IN PROGRESS markers vs updates from previously-integrated branches. Resolution: keep both completed entries, update counts.
- `server/src/index.js` -- if multiple tasks added routes. Resolution: combine both.
- Test files -- usually different files, shouldn't conflict. If they do, investigate.

### e) Verify in the work branch

```bash
npm run install:all
npm run test:unit
```

If failures, diagnose and fix in the work branch before proceeding.

### f) Fast-forward merge into main

```bash
cd "C:\Dev\Hg_AEA\ElephantCarpaccio\main\HgOnboardingSampleApp"
git merge feature/task-<id>
```

This should be a clean fast-forward since we just merged main into the work branch.

### g) Update work plan

Update `docs/work-plan.md`:
- Change task status from `IN PROGRESS` to `DONE`
- Update the Summary table counts

Commit:
```bash
git add docs/work-plan.md
git commit -m "Mark task <id> as done"
```

### h) Clean up

If a local worktree exists:
```bash
git worktree remove "C:\Dev\Hg_AEA\ElephantCarpaccio\worktrees\task-<id>"
```

If `git worktree remove` fails (common on Windows -- file locks from a previous session):
```bash
rm -rf "C:\Dev\Hg_AEA\ElephantCarpaccio\worktrees\task-<id>"
git worktree prune
```

Delete the branch:
```bash
git branch -d feature/task-<id>
git push origin --delete feature/task-<id>
```

### i) Repeat

Move to the next branch. Step (c) will now pick up the updated main.

---

## Step 3: Final Cleanup

After all branches are integrated:

1. Delete `launch-tasks.sh` if it exists
2. Verify main builds and all tests pass:
   ```bash
   npm run install:all
   npm run test:unit
   ```
3. Push main:
   ```bash
   git push origin main
   ```
4. Show a summary of what was integrated

---

## Cleanup Mode

When the user says `cleanup`:

1. List all worktrees: `git worktree list`
2. List all task branches: `git branch | grep feature/task-`
3. For each, check if it has unmerged commits
4. Present findings and **wait for confirmation** before removing anything
5. Remove confirmed worktrees and branches

---

## Important Rules

- **Main stays clean.** Only receives fast-forward merges from fully-resolved work branches.
- **All conflict resolution happens in work branches.** Never resolve conflicts on main.
- **Sequential integration.** Even though tasks run in parallel, integration is strictly one-at-a-time. Each integration picks up the state left by the previous one.
- **Verify before merging to main.** Tests must pass in the work branch after conflict resolution.
- **Confirm before destructive actions.** Always confirm before merging, removing worktrees, or deleting branches.
- **Push after integration.** Push main after each integration batch so Devin.ai sessions can see the latest state.
- **No Co-Authored-By trailers** in commit messages.
