const renderJson = async (path, elementId) => {
  const target = document.getElementById(elementId);
  if (!target) return;
  try {
    const response = await fetch(path, {
      headers: {
        accept: "application/json"
      }
    });
    const payload = await response.json();
    target.textContent = JSON.stringify(payload, null, 2);
  } catch (error) {
    target.textContent = JSON.stringify(
      {
        ok: false,
        message: error instanceof Error ? error.message : String(error)
      },
      null,
      2
    );
  }
};

renderJson("./api/hello", "backend-result");
renderJson("./edge", "edge-result");
