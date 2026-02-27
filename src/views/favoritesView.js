import { getFavorites } from "../storage/favoritesStorage.js";
import { setupFavoritesUI, syncFavoritesUI } from "../features/favorites/favoritesUI.js";

export function renderFavorites(appEl) {
  const favorites = getFavorites();

  appEl.innerHTML = `
    <section class="layout layout--detail">
      <div class="main-col">
        <section class="content-card">
          <a href="#" class="back-link" data-back>← Back</a>

          <header class="page-header">
            <h1>Favorites</h1>
          </header>

          <div id="fav-grid" class="poster-grid" aria-live="polite">
            ${
              favorites.length === 0
                ? `<p role="status">No favorites saved yet.</p>`
                : renderFavoritesGrid(favorites)
            }
          </div>
        </section>
      </div>
    </section>
  `;

  // Back: gå tillbaka till sidan du kom ifrån
  const back = appEl.querySelector("[data-back]");
  back?.addEventListener("click", (e) => {
    e.preventDefault();
    if (history.length > 1) history.back();
    else location.hash = "#/home";
  });

  // ESC = back
  window.addEventListener(
    "keydown",
    (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        if (history.length > 1) history.back();
        else location.hash = "#/home";
      }
    },
    { once: true }
  );

  // Favorites UI (delegation + sync)
  const gridEl = appEl.querySelector("#fav-grid");
  if (gridEl) {
    setupFavoritesUI(gridEl, { removeCardOnUnfavorite: true });
    syncFavoritesUI(gridEl);
  }

  // Fokus på main (som du redan gjort innan)
  document.getElementById("main")?.focus();
}

function renderFavoritesGrid(items) {
  return items
    .map((fav) => {
      const type = fav.type || "characters"; // fallback om gamla favoriter saknar type
      const img = fav.img || ""; // om du sparar img i favorites
      const subtitle = fav.subtitle || "";

      return `
        <a
          class="poster-card"
          href="#/detail?type=${encodeURIComponent(type)}&id=${encodeURIComponent(fav.id)}"
          aria-label="Open ${escapeHtml(fav.name)}"
        >
          <div class="poster-frame">
            ${
              img
                ? `<img class="poster-img" src="${escapeHtml(img)}" alt="${escapeHtml(
                    fav.name
                  )}" loading="lazy" />`
                : `<div class="poster-placeholder" aria-hidden="true"></div>`
            }
          </div>

          <h3 class="poster-title">${escapeHtml(fav.name)}</h3>
          ${subtitle ? `<p class="poster-subtitle">${escapeHtml(subtitle)}</p>` : ""}

          <button
            type="button"
            class="fav-btn"
            data-fav-btn
            data-id="${escapeHtml(fav.id)}"
            data-name="${escapeHtml(fav.name)}"
            data-type="${escapeHtml(type)}"
            data-img="${escapeHtml(img)}"
            data-subtitle="${escapeHtml(subtitle)}"
            aria-pressed="false"
            aria-label="Toggle favorite"
          >☆</button>
        </a>
      `;
    })
    .join("");
}

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}