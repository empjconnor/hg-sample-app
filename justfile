set shell := ["pwsh", "-NoProfile", "-Command"]

# Onboarding Sample App - Command Reference

# Install all dependencies (root, server, client)
install:
    npm run install:all

# Start the full app (server on :3001 + client on :5173)
start:
    npm start

# Start backend server only (port 3001)
server:
    npm run server

# Start frontend dev server only (port 5173)
client:
    npm run client

# Build the client for production
build:
    cd client && npm run build

# Run all tests (unit + e2e)
test:
    npm test

# Run unit tests only
test-unit:
    npm run test:unit

# Run e2e tests only (requires app running)
test-e2e:
    npm run test:e2e

# Run server in watch mode (auto-restart on changes)
dev-server:
    cd server && npm run dev

# Preview production client build
preview:
    cd client && npm run preview

# Health check the running server
health:
    curl -s http://localhost:3001/api/health | node -e "process.stdin.on('data',d=>console.log(JSON.parse(d)))"
