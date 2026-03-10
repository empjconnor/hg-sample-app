# Tests — AGENTS.md

- E2E tests use Playwright (Chromium only) — do not add other browser projects
- New E2E specs go in `tests/e2e/` using `*.spec.js` naming
- Playwright auto-starts the app via `webServer` config — do not start it manually before running tests
- Prefer `page.getByRole` and semantic locators over CSS selectors (per Playwright best practices)
