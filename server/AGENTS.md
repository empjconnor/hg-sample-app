# Server — AGENTS.md

- Unit tests use the Node.js built-in test runner (`node:test` + `node:assert`) — do not add external test frameworks
- All API routes are read-only (GET only) unless new write endpoints are added
- The store module (`src/data/store.js`) exposes accessor functions — do not mutate the arrays directly
