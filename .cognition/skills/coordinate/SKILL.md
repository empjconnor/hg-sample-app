---
name: coordinate
description: Orchestrate parallel task execution. Read the work plan, mark tasks as in-progress, create worktrees, and generate execution prompts for Devin CLI or Devin.ai sessions. Use when the user says "next N", "coordinate", "dispatch", "what's next", or provides a number of tasks to launch.
argument-hint: "[next N | status]"
triggers:
  - user
  - model
---

# Work Coordinator

Read the work plan, select the next batch of tasks, and prepare them for parallel execution on Devin CLI (local worktrees) or Devin.ai (web UI sessions).

You are the **coordinator**. You manage task lifecycle, worktree creation, and prompt generation. The actual implementation happens in separate sessions running the `execute-task` skill.

## Determine Mode

Parse the user's prompt:

- `next N` or just a number (e.g., `3`) -> **Dispatch mode** -- select and dispatch the next N pending tasks
- `status` -> **Status mode** -- show current work plan state
- Specific task IDs (e.g., `1.2 1.3 1.5`) -> **Dispatch mode** targeting those tasks
- `devin.ai N` or `remote N` -> **Dispatch mode** generating Devin.ai prompts only (no worktrees)

---

## Status Mode

1. Read `docs/work-plan.md`
2. Present a summary table:

```
| Phase | Total | Done | In Progress | Pending | Skipped |
|-------|-------|------|-------------|---------|---------|
```

3. List any IN PROGRESS tasks with their branches
4. Show which tasks are next eligible for dispatch (PENDING with satisfied dependencies)

---

## Dispatch Mode

### Phase 0: Select & Confirm

1. Read `docs/work-plan.md` to find the current state
2. Identify the next N tasks that are:
   - Status is `PENDING`
   - Dependencies are satisfied (referenced tasks are `DONE`)
   - Marked `Parallel: yes` or have no dependency conflicts with each other
3. Present a confirmation table:

```
| Task | Title | Worktree / Branch | Can Parallel |
|------|-------|-------------------|--------------|
| 1.2  | Customer list API | feature/task-1-2 | yes |
| 1.3  | Customer Info tab | feature/task-1-3 | yes |
```

4. **Wait for user confirmation.** User may adjust selections before proceeding.

### Phase 1: Mark & Prepare

After confirmation:

1. **Mark tasks as IN PROGRESS** in `docs/work-plan.md`. Update each task:
   ```
   **Status:** IN PROGRESS (branch: feature/task-<id>)
   ```
   Update the Summary table counts.

2. **Commit the markers** to main:
   ```bash
   git add docs/work-plan.md
   git commit -m "Mark tasks <list> as in-progress"
   ```

3. **Determine dispatch target** -- ask the user if not already clear:
   - **Local (Devin CLI)** -> Phase 2A
   - **Remote (Devin.ai)** -> Phase 2B
   - **Both** -> Run Phase 2A for some tasks and Phase 2B for others

### Phase 2A: Local Dispatch (Devin CLI + Worktrees)

1. **Push main to remote** so worktree branches have the latest markers:
   ```bash
   git push origin main
   ```

2. **Create worktrees** from main:
   ```bash
   git worktree add "C:\Dev\Hg_AEA\ElephantCarpaccio\worktrees\task-<id>" -b feature/task-<id>
   ```
   Repeat for each task.

3. **Generate `launch-tasks.sh`** in the repo root:

   ```bash
   #!/bin/bash
   # Auto-generated: Launch parallel task execution
   # Run from a SEPARATE terminal (not inside an active Devin session)
   # Generated: [DATE]

   BASH_EXE="C:\Program Files\Git\bin\bash.exe"

   # Task <id> - <title>
   wt new-tab --title "Task <id> - <title>" -d "C:\Dev\Hg_AEA\ElephantCarpaccio\worktrees\task-<id>" "$BASH_EXE" --login -c "devin -- '/execute-task <id>'"

   # (repeat for each task)
   ```

4. **Tell the user:**
   ```
   Worktrees and launch script ready.
   Run from a separate terminal (not this Devin session):
     bash launch-tasks.sh

   Each tab will open a Devin CLI session targeting one task.
   Come back here and say "/integrate" when they're done.
   ```

### Phase 2B: Remote Dispatch (Devin.ai Web UI)

1. **Push main to remote** so Devin.ai sessions can find the branches:
   ```bash
   git push origin main
   ```

2. **Create and push branches** for each task:
   ```bash
   git branch feature/task-<id> main
   git push origin feature/task-<id>
   ```
   Repeat for each task.

3. **Generate prompts** for each Devin.ai session. Each prompt is a self-contained block the user pastes into app.devin.ai:

   ````
   ---
   **Task <id>: <title>**
   **Branch:** feature/task-<id>
   **Repo:** <repo-url>

   Work on branch `feature/task-<id>`.

   Read `AGENTS.md` for project conventions and commands.
   Read `docs/work-plan.md` and find task <id> for full requirements.
   Read `.cognition/skills/execute-task/SKILL.md` for the execution workflow.

   Implement the task following the execute-task skill phases:
   1. Read context -- work plan entry, existing code
   2. Implement the feature
   3. Verify -- run `npm run test:unit` and check for errors
   4. Commit with a descriptive message

   **Acceptance criteria from work plan:**
   [PASTE ACCEPTANCE CRITERIA FROM THE TASK ENTRY]
   ````

4. **Tell the user:**
   ```
   Branches pushed and prompts ready.
   Start a Devin.ai session for each task above, paste the prompt, and set it to the correct branch.
   Come back here and say "/integrate" when they're done.
   ```

---

## Important Rules

- **Main stays clean.** Only the coordinator updates docs/work-plan.md on main. Implementation happens on feature branches.
- **Push before dispatch.** Always push main (and branches for Devin.ai) before telling the user to launch sessions.
- **IN PROGRESS markers** prevent double-assignment. Never dispatch a task that's already IN PROGRESS.
- **Respect dependencies.** If a task says `Parallel: no (depends on X)`, X must be DONE before dispatching.
- **Confirm before acting.** Always show the plan and wait for user confirmation before marking tasks or creating worktrees.
- **Don't launch from inside a Devin session.** The launch script must be run from a separate terminal.
- **No Co-Authored-By trailers** in commit messages.
