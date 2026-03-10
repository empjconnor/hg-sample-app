# Project Conventions

Reference file for the execute-task skill. Keep this updated as patterns emerge.

## Tech Stack

- **Frontend:** React 18, Vite 5, JSX, vanilla CSS, ESM imports
- **Backend:** Express.js 4, CommonJS (`require`/`module.exports`), Node.js
- **Testing:** `node:test` + `node:assert` (unit), Playwright (E2E)
- **Storage:** In-memory only (no database)

## Server Patterns

### API Routes
- All routes in `server/src/index.js` (may be refactored to route files as project grows)
- RESTful: `GET /api/<resource>`, `POST /api/<resource>`, `PUT /api/<resource>/:id`
- Error responses: `res.status(404).json({ error: 'Not found' })`
- Validation: check required fields, return 400 with descriptive error

### Data Store
- `server/src/data/store.js` -- in-memory store with get/add/update functions
- Mutation methods already exist: `addCustomer()`, `addTenant()`, `updateOnboardingState()`
- New store methods should follow existing patterns (find by ID, return copies not references)

### Models
- `server/src/models/index.js` -- factory functions: `createCustomer()`, `createTenant()`, `createOnboardingStep()`
- Use `crypto.randomUUID()` for IDs
- Validate inputs in factory functions

## Client Patterns

### Components
- Currently single-file (`App.jsx`). Extract to `client/src/components/` as complexity grows.
- Naming: PascalCase for components (`CustomerInfo.jsx`), camelCase for utilities
- State: React hooks (`useState`, `useEffect`). No state management library.
- API calls: `fetch('/api/...')` with error handling (Vite proxy forwards `/api/*` to server)

### Styling
- Vanilla CSS in `client/src/index.css`
- Class-based selectors (`.customer-card`, `.progress-bar`)
- No CSS framework or CSS-in-JS

### Navigation
- Tab-based navigation in `App.jsx` (not react-router)
- Tabs: Dashboard, Customer Info, Data Mapping, Tenant Setup, Import

## Testing Patterns

### Unit Tests (server)
```javascript
const { describe, it } = require('node:test');
const assert = require('node:assert');

describe('FeatureName', () => {
  it('should do something', () => {
    const result = someFunction();
    assert.strictEqual(result, expected);
  });
});
```

### E2E Tests (Playwright)
```javascript
const { test, expect } = require('@playwright/test');

test('description', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toHaveText('Expected');
});
```
- Config: `playwright.config.js` -- starts server automatically via `webServer` config
- Tests in `tests/e2e/`

## Sample Data

Three customers with different schemas:

| Customer | Column Style | Date Format |
|----------|-------------|-------------|
| ABC Accounting | Title Case | MM/DD/YYYY |
| XYZ Financial Services | camelCase | YYYY-MM-DD |
| Premier Bookkeeping | snake_case | DD-MM-YYYY |

CSV files in `sample-data/<CustomerName>/`. Each has: clients, contacts, chart_of_accounts, transactions.

Picklist values also vary (e.g., "Active" vs "A" vs "ACTIVE"). Data mapping logic must normalize these.

## Folder Structure (Target)

As the project grows, files should be organized as:

```
server/src/
  index.js              Express app + routes (or split to routes/)
  data/store.js         In-memory data store
  models/index.js       Domain model factories
  services/             Business logic (CSV parsing, mapping, etc.)

client/src/
  App.jsx               Root component + tab navigation
  components/           Feature components (CustomerInfo, DataMapping, etc.)
  hooks/                Custom React hooks (if needed)
  utils/                Shared utilities
```
