# Onboarding Sample App - Agent Guidelines

Customer onboarding dashboard -- an internal tool for the CS team to track customers through a four-stage pipeline. Built as a training exercise for AI-assisted development using thin vertical slices.

Each subdirectory (`client/`, `server/`, `tests/`, `sample-data/`) has its own AGENTS.md with section-specific guidance.

## Commands

| Command | Purpose |
|---------|---------|
| `npm run install:all` | Install dependencies for root + server + client (run first) |
| `npm start` | Run server (port 3001) + client (port 5173) concurrently |
| `npm run server` | Run backend only |
| `npm run client` | Run frontend only |
| `npm run test:unit` | Run server unit tests (node:test) |
| `npm run test:e2e` | Run Playwright E2E tests (app starts automatically) |

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

- JavaScript (no TypeScript) -- CommonJS in server, ES modules in client
- No external database -- all data is in-memory and resets on server restart
- No authentication
- Plain CSS only -- no preprocessors or CSS-in-JS
- Playwright e2e tests start the app automatically -- do not start it manually before running `npm run test:e2e`
- Follow existing code style in neighboring files
- Do not add unnecessary dependencies. Check `package.json` before importing anything

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
