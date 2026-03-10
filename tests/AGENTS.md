# Tests — AGENTS.md

- E2E tests use Playwright (Chromium only) — do not add other browser projects
- New E2E specs go in `tests/e2e/` using `*.spec.js` naming
- Playwright auto-starts the app via `webServer` config — do not start it manually before running tests
- Do not use CSS selectors (`.locator('.class')`, `querySelector`) to find interactive elements or text content — use `page.getByRole`, `page.getByText`, or `page.getByLabel` instead. CSS selectors are acceptable only for asserting visual styles (e.g., verifying a badge's background color)
- Use `test.describe.configure({ mode: 'serial' })` when tests in a describe block depend on shared state. Reset application state before each test (e.g., reload the page or call a reset endpoint) to prevent ordering-dependent failures
