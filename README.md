# w7s-demo-ts

Minimal W7S mixed-mode demo with prebuild steps:

- `backend/` contains interpreter-backed TypeScript routes
- `backend/dist/` is produced in CI before deploy
- `worker/` contains the isolate worker TypeScript source
- `worker/index.js` is produced in CI before deploy
- `frontend/` contains the frontend shell mirrored by the worker
- `backend/hello.ts` declares its route with inline metadata comments
- `.github/workflows/deploy.yml` runs `npm ci` and `npm run build` before backend+worker deploy
- `DEMO_VERSION` tracks manual verification bumps

Deployed behavior:

- `/api/hello` resolves through the interpreter
- `/edge` resolves through the isolate worker
- `/` resolves through the isolate worker and renders the demo frontend

Current `DEMO_VERSION`: `2026-04-19-ts-build-1`
