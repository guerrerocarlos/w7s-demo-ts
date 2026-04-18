# w7s-demo

Minimal W7S mixed-mode demo:

- `backend/` contains interpreter-backed routes
- `worker/` contains the isolate worker
- `frontend/` contains the frontend shell mirrored by the worker

Deployed behavior:

- `/api/hello` resolves through the interpreter
- `/edge` resolves through the isolate worker
- `/` resolves through the isolate worker and renders the demo frontend
