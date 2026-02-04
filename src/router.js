
export function createRouter(appSelector) {
  const appRoot = document.querySelector(appSelector);
  if (!appRoot) throw new Error(`Hittar inte elementet: ${appSelector}`);

  const routes = {
  };

  function parseHash() {
    const raw = (location.hash || "#").slice(1); 
    const [route, query] = raw.split("?");
    const params = Object.fromEntries(new URLSearchParams(query || ""));
    return { route, params };
  }

  function render() {
    const { route, params } = parseHash();
    const pageFn = routes[route] || ;

    // Rendera sidan
    appRoot.innerHTML = pageFn(params);

    // Mount efter render
    if 
  }

  window.addEventListener("hashchange", render);
  render();
}