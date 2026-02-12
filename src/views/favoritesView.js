
import { getFavorites } from "../storage/favoritesStorage.js";

export function renderFavorites(appEl) {
    const favorites = getFavorites();

    appEl.innerHTML = `
    <section class="page">
      <header class="page-header">
        <h1>Favorites</h1>
      </header>

      <div class="favorites-list" aria-live="polite">
        ${
        favorites.length === 0
            ? `<p role="status">No favorites saved yet.</p>`
            : renderFavoritesList(favorites)
    }
      </div>
    </section>
  `;

    // Accessibility: focus the main content after route change
    const main = document.getElementById("main");
    main?.focus();
}

function renderFavoritesList(items) {
    return `
    <ul class="favorites-ul">
      ${items
        .map(
            (fav) => `
        <li>
          <a class="favorites-link" href="#/character?id=${encodeURIComponent(fav.id)}">
            ${escapeHtml(fav.name)}
          </a>
        </li>
      `
        )
        .join("")}
    </ul>
  `;
}

function escapeHtml(s) {
    return String(s)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;");
}
