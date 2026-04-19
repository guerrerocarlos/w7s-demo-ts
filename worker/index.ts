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
        marker: "WORKER EDGE MARKER",
        ok: true
      });
    }

    return json(
      {
        runtime: "isolate",
        route: url.pathname,
        marker: "WORKER 404 MARKER",
        message: "Not found in the isolate worker. Static hosting should handle frontend paths.",
        ok: false
      },
      { status: 404 }
    );
  }
};
