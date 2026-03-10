# Work Plan

> Single source of truth for all tasks. Updated by the `coordinate` skill and manually by the user.

## Format Reference

Each task follows this structure:

```
### <phase>.<task> <Title>
**Status:** PENDING | IN PROGRESS (branch: feature/<task-id>) | DONE | SKIPPED
**Parallel:** yes | no (depends on <task-id>)
**Description:** What to build, acceptance criteria, relevant files.
```

**Status values:**
- `PENDING` -- not started
- `IN PROGRESS (branch: feature/<task-id>)` -- assigned to an agent, branch created
- `DONE` -- merged into main
- `SKIPPED` -- deliberately skipped, with reason

**Parallel field:** `yes` means the task can run simultaneously with other tasks in the same phase. `no` with a dependency reference means it must wait for another task.

---

## Summary

| Phase | Description | Total | Done | In Progress | Pending | Skipped |
|-------|-------------|-------|------|-------------|---------|---------|
| 1     | -           | 0     | 0    | 0           | 0       | 0       |

**Next up:** (none yet)

---

## Phase 1: (To be defined)

<!-- Add tasks here using the format above. Example:

### 1.1 Load sample data into the store
**Status:** PENDING
**Parallel:** yes
**Description:** Read all 3 customer CSV folders from sample-data/ and load them into the in-memory store on server startup. Each customer should appear in the dashboard with their onboarding state.

**Acceptance criteria:**
- All 3 sample customers appear on the dashboard
- Each has a unique onboarding state with steps at "pending"
- Existing unit tests still pass
- `GET /api/customers` returns all customers
-->
