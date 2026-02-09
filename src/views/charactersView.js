// src/views/charactersView.js
import { setupFavoritesUI, syncFavoritesUI } from "../features/favorites/favoritesUI.js";

const API_URL = "https://hp-api.onrender.com/api/characters";

let allCharacters = [];

export async function renderCharacters(appEl) {
    appEl.innerHTML = `
    <section class="page">
      <header class="page-header">
        <h1>Characters</h1>

        <label for="character-search" class="sr-only">Search characters</label>
        <input
          type="search"
          id="character-search"
          placeholder="Search characters…"
          aria-label="Search characters"
          autocomplete="off"
        />
      </header>

      <div id="characters-list" class="poster-grid" aria-live="polite">
        <p>Loading characters…</p>
      </div>
    </section>
  `;

    const listEl = appEl.querySelector("#characters-list");
    const searchEl = appEl.querySelector("#character-search");

    // Favorites click handling (event delegation)
    setupFavoritesUI(appEl);

    try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`API error: ${res.status}`);

        const data = await res.json();

        // Normalize data
        allCharacters = data.map((c) => ({
            id: c.id || c.name, // fallback
            name: c.name || "Unknown",
            house: c.house || "Unknown",
            image: c.image || "",
        }));

        renderList(allCharacters, listEl);
        syncFavoritesUI(appEl);
    } catch (err) {
        console.error(err);
        listEl.innerHTML = `<p role="alert">Could not load characters. Please try again.</p>`;
        return;
    }

    // Live filter on input
    searchEl.addEventListener("input", () => {
        const q = searchEl.value.trim().toLowerCase();
        const filtered = allCharacters.filter((c) => c.name.toLowerCase().includes(q));
        renderList(filtered, listEl);
        syncFavoritesUI(appEl);
    });
}

function renderList(items, listEl) {
    if (!items.length) {
        listEl.innerHTML = `<p role="status">No characters found</p>`;
        return;
    }

    listEl.innerHTML = items
        .slice(0, 50)
        .map(
            (c) => `
      <div class="poster-card">
        <a href="#/character?id=${encodeURIComponent(c.id)}" class="poster-link">
          <div class="poster-frame">
            ${
                c.image
                    ? `<img class="poster-img" src="${escapeHtml(c.image)}" alt="${escapeHtml(c.name)}" loading="lazy" />`
                    : `<div class="img-placeholder" aria-hidden="true"></div>`
            }
          </div>
          <h3 class="poster-title">${escapeHtml(c.name)}</h3>
          <p class="poster-subtitle">${escapeHtml(c.house)}</p>
        </a>

        <button
          type="button"
          class="fav-btn"
          data-fav-btn
          data-id="${escapeHtml(c.id)}"
          data-name="${escapeHtml(c.name)}"
          aria-pressed="false"
          aria-label="Add to favorites"
        >☆</button>
      </div>
    `
        )
        .join("");
}

function escapeHtml(s) {
    return String(s)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;");
}
