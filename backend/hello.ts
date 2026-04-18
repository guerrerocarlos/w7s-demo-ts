export default async function handle() {
  return {
    status: 200,
    headers: {
      "content-type": "application/json; charset=utf-8"
    },
    body: {
      runtime: "interpreter",
      route: "/api/hello",
      message: "Hello from the backend interpreter.",
      ok: true
    }
  };
}
