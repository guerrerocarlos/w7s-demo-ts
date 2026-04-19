# w7s-demo

Minimal W7S mixed-mode demo:

- `backend/` contains interpreter-backed routes
- `worker/` contains the isolate worker
- `frontend/` contains the frontend shell mirrored by the worker
- `backend/hello.ts` declares its route with inline metadata comments
- `DEMO_VERSION` tracks manual verification bumps

Deployed behavior:

- `/api/hello` resolves through the interpreter
- `/edge` resolves through the isolate worker
- `/` resolves through the isolate worker and renders the demo frontend

Current `DEMO_VERSION`: `2026-04-18-bump-1`
