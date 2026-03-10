# Onboarding Sample App - Agent Guidelines

## Project Overview

Internal customer onboarding tool for CS team. React 18 + Vite frontend, Express.js backend, in-memory storage. Training exercise using "Elephant Carpaccio" (thin vertical slices) methodology.

## Commands

| Command | Purpose |
|---------|---------|
| `npm run install:all` | Install dependencies for root + server + client (run first) |
| `npm start` | Run server (port 3001) + client (port 5173) concurrently |
| `npm run server` | Run backend only |
| `npm run client` | Run frontend only |
| `npm run test:unit` | Run server unit tests (node:test) |
| `npm run test:e2e` | Run Playwright E2E tests |

## Project Structure

```
client/          React 18 + Vite SPA (JSX, ESM)
server/          Express.js API (CommonJS)
  src/data/      In-memory store + seed data
  src/models/    Domain models (Customer, Tenant, OnboardingStep)
sample-data/     CSV test data (3 customers, varying schemas)
tests/e2e/       Playwright E2E tests
docs/            Work plan, session logs
.cognition/      Skills and config for Devin CLI / Devin.ai
```

## Conventions

- **JavaScript only** -- no TypeScript. Pure JS throughout.
- **Server:** CommonJS (`require`/`module.exports`). Express 4.
- **Client:** ESM (`import`/`export`). React 18 + JSX. Vanilla CSS.
- **Testing:** `node:test` + `node:assert` for unit tests. Playwright for E2E.
- **No database** -- in-memory store only.
- **No auth** -- not needed for this tool.
- Follow existing code style in neighboring files.
- Do not add unnecessary dependencies. Check `package.json` before importing anything.

## Workflow

This project uses a parallel task execution workflow:

1. Work is defined in `docs/work-plan.md` (phases and tasks)
2. The `coordinate` skill marks tasks as in-progress and generates execution prompts
3. Tasks execute in parallel on git worktrees (local CLI) or branches (Devin.ai)
4. The `integrate` skill merges completed branches back to `main` sequentially
5. The `retro` skill reviews completed batches for skill improvements

See `.cognition/skills/` for full skill documentation.

## Commit Messages

- Concise, focused on "why" not "what"
- Format: `<what was done> (<scope>)` -- e.g., `Add customer list API endpoint (server)`
- Do not include `Co-Authored-By` or `Generated with` trailers
