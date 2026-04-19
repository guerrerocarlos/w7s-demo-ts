const FRONTEND_HTML = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>W7S Demo TS</title>
    <style>
      :root {
        color-scheme: light;
        --bg: #f6f2e8;
        --ink: #13222f;
        --accent: #ff6b35;
        --panel: #fffdf8;
        --muted: #6b7280;
        --border: #d9cdb8;
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        font-family: "Space Grotesk", "Segoe UI", sans-serif;
        background:
          radial-gradient(circle at top left, rgba(255, 107, 53, 0.18), transparent 28%),
          linear-gradient(180deg, #fff9ef 0%, var(--bg) 100%);
        color: var(--ink);
        min-height: 100vh;
      }
      main { max-width: 960px; margin: 0 auto; padding: 48px 20px 72px; }
      .hero { display: grid; gap: 18px; margin-bottom: 28px; }
      .eyebrow { text-transform: uppercase; letter-spacing: 0.12em; color: var(--accent); font-weight: 700; font-size: 0.8rem; }
      h1 { margin: 0; font-size: clamp(2.4rem, 7vw, 5.5rem); line-height: 0.95; }
      .lede { max-width: 58ch; font-size: 1.1rem; color: #314558; }
      .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px; }
      .card { background: var(--panel); border: 1px solid var(--border); border-radius: 18px; padding: 18px; box-shadow: 0 10px 30px rgba(19, 34, 47, 0.08); }
      .card h2 { margin-top: 0; margin-bottom: 8px; font-size: 1.05rem; }
      .pill { display: inline-block; padding: 6px 10px; border-radius: 999px; background: rgba(255, 107, 53, 0.12); color: #9a3412; font-size: 0.85rem; font-weight: 700; }
      pre { margin: 12px 0 0; padding: 12px; background: #fff7ea; border-radius: 12px; overflow: auto; font-size: 0.88rem; }
      .muted { color: var(--muted); }
    </style>
  </head>
  <body>
    <main>
      <section class="hero">
        <span class="eyebrow">W7S Demo TS</span>
        <h1>Prebuilt interpreter and isolate outputs.</h1>
        <p class="lede">
          This repo keeps TypeScript as source, but GitHub Actions builds the backend and worker
          before deploy so the runtime can consume ready-to-run JavaScript outputs.
        </p>
      </section>
      <section class="grid">
        <article class="card">
          <span class="pill">Frontend</span>
          <h2>Served by \`worker/\`</h2>
          <p class="muted">This HTML shell is returned by the isolate worker at \`/\`.</p>
        </article>
        <article class="card">
          <span class="pill">Backend</span>
          <h2>\`/api/hello\`</h2>
          <p class="muted">Interpreter route result:</p>
          <pre id="backend-result">Loading...</pre>
        </article>
        <article class="card">
          <span class="pill">Isolate</span>
          <h2>\`/edge\`</h2>
          <p class="muted">Isolate worker result:</p>
          <pre id="edge-result">Loading...</pre>
        </article>
      </section>
    </main>
    <script type="module" src="./app.js"></script>
  </body>
</html>`;

const FRONTEND_APP_JS = `const renderJson = async (path, elementId) => {
  const target = document.getElementById(elementId);
  if (!target) return;
  try {
    const response = await fetch(path, { headers: { accept: "application/json" } });
    const payload = await response.json();
    target.textContent = JSON.stringify(payload, null, 2);
  } catch (error) {
    target.textContent = JSON.stringify(
      { ok: false, message: error instanceof Error ? error.message : String(error) },
      null,
      2
    );
  }
};
renderJson("./api/hello", "backend-result");
renderJson("./edge", "edge-result");
`;

type JsonInit = {
  status?: number;
  headers?: HeadersInit;
};

const json = (payload: unknown, init?: JsonInit) =>
  new Response(JSON.stringify(payload, null, 2), {
    status: init?.status ?? 200,
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...init?.headers
    }
  });

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/edge") {
      return json({
        runtime: "isolate",
        route: "/edge",
        message: "Hello from the isolate worker TypeScript build.",
        ok: true
      });
    }

    if (url.pathname === "/app.js") {
      return new Response(FRONTEND_APP_JS, {
        status: 200,
        headers: {
          "content-type": "application/javascript; charset=utf-8",
          "cache-control": "no-cache"
        }
      });
    }

    if (url.pathname === "/" || url.pathname === "/index.html") {
      return new Response(FRONTEND_HTML, {
        status: 200,
        headers: {
          "content-type": "text/html; charset=utf-8",
          "cache-control": "no-cache"
        }
      });
    }

    return json(
      {
        runtime: "isolate",
        route: url.pathname,
        message: "Not found in the isolate worker.",
        ok: false
      },
      { status: 404 }
    );
  }
};
