---
name: retro
description: Retrospective for the task execution workflow. Reviews session logs, git history, and completed tasks to find skill improvements. Use when the user says "retro", "retrospective", "review skills", or after completing a batch of tasks.
argument-hint: "[latest | all | phase N]"
triggers:
  - user
---

# Retrospective

Analyze completed task sessions to find improvements for the `execute-task`, `coordinate`, and `integrate` skills.

## Inputs

Parse the user's prompt to determine scope:
- `latest` or no argument -> analyze since the last retro (check `retro-log.md` for the date)
- `all` -> analyze everything
- `phase N` -> analyze a specific phase (e.g., `phase 1`)

## Step 1: Read Skill Files

Read all skill files:
- `.cognition/skills/execute-task/SKILL.md`
- `.cognition/skills/execute-task/conventions.md`
- `.cognition/skills/coordinate/SKILL.md`
- `.cognition/skills/integrate/SKILL.md`
- `.cognition/skills/retro/retro-log.md`

Also read:
- `docs/work-plan.md` (for completed task entries)

## Step 2: Gather Data

### 2a: Session Logs

Read all session logs in `docs/session-logs/` within scope. Extract from each:
- Outcome (DONE / PARTIAL / BLOCKED)
- "What Didn't Go Well" entries
- "Decisions Made" entries
- "Discoveries" entries

### 2b: Git History

```bash
git log --oneline --format='%h %ai %s' | head -50
```

Count: total tasks completed, commits per task, integration merges.

### 2c: Conversation Context

If this retro is run at the end of a session (not standalone), also scan the current conversation for friction points, decisions, and discoveries.

## Step 3: Analyze

Look for findings in these categories:

### Convention Drift
- Are conventions in `conventions.md` still accurate?
- Any new patterns used in recent tasks that aren't documented?
- Any documented patterns that are stale or contradicted by practice?

### Process Tuning
- Is the parallel workflow (coordinate -> execute -> integrate) working smoothly?
- Integration friction points?
- Are session logs capturing the right information?
- Are the Devin.ai prompts effective? Do they need more/less context?

### Skill Drift
- Are agents following the skill instructions, or has practice diverged?
- Any steps being routinely skipped or reordered?
- Are any phases unnecessary for this project's scale?

### Missing Guidance
- Were there decisions agents had to make that the skills don't cover?
- Any repeated questions or confusion across sessions?

## Step 4: Cross-Reference Retro Log

Read `.cognition/skills/retro/retro-log.md`. For each finding from Step 3:
- If it was **previously applied** -> skip (unless the fix didn't work)
- If it was **previously skipped with valid reasoning** -> skip (unless new data changes the reasoning)
- If it's **new** -> include in the report

## Step 5: Produce the Report

Present findings as a prioritized list:

```
### [PRIORITY] Finding title
**Category:** Convention Drift | Process Tuning | Skill Drift | Missing Guidance
**Evidence:** Specific data points (session log excerpts, commit counts, conversation quotes)
**Proposed change:** Which file, which section, what to add/modify/remove
**Why it matters:** How this prevents future friction
```

**Priority levels:**
- **HIGH** -- Wrong or missing guidance that caused real problems.
- **MEDIUM** -- Pattern worth capturing. Skills work without it, but it saves time.
- **LOW** -- Minor polish.

**Reporting rules:**
- Every finding must cite specific evidence.
- 3 high-quality findings beat 15 marginal ones.
- If nothing meaningful is found, say so -- that's a sign of mature skills.
- Don't invent hypothetical improvements.

## Step 6: Apply Approved Changes

For each finding, state whether you recommend applying or skipping, and why. Then ask the user to decide.

For approved findings:
1. Apply edits to the relevant skill files
2. **Update `retro-log.md`** -- add an entry for this retro with all applied and skipped findings

Group changes by file. Apply all edits to one file before moving to the next.

## Guidelines

- **Data first, opinions second.** Ground every finding in specific numbers or quotes.
- **Be specific.** "Update conventions" is useless. "Add CSV parsing pattern to conventions.md" is actionable.
- **Respect sample size.** Don't generalize from 2 data points.
- **Keep skills lean.** Prefer adding to `conventions.md` and `retro-log.md` over SKILL.md.
- **Don't duplicate.** Check existing files before proposing additions.
