// src/views/charactersView.js
import { setupFavoritesUI, syncFavoritesUI } from "../features/favorites/favoritesUI.js";

const API_URL = "https://hp-api.onrender.com/api/characters";
const STORAGE_KEY = "wizardpedia:favorites:v1";

let allCharacters = [];
let currentList = []; // what we are currently showing (online list OR offline favorites)

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
    setupFavoritesUI(listEl);

    // One search listener only (no duplicates)
    searchEl.addEventListener("input", () => {
        const q = searchEl.value.trim().toLowerCase();
        const filtered = filterByName(currentList, q);

        renderList(filtered, listEl);
        syncFavoritesUI(listEl);

        if (filtered.length === 0) {
            listEl.innerHTML = `<p role="status">No matches found.</p>`;
        }
    });

    // Try online first, fallback to offline favorites
    try {
        const data = await fetchCharacters();
        allCharacters = normalizeCharacters(data);

        currentList = allCharacters;
        renderList(currentList, listEl);
        syncFavoritesUI(listEl);
    } catch (err) {
        console.error("Characters fetch failed:", err);

        const offlineFavs = readFavoritesFromStorage();

        if (offlineFavs.length > 0) {
            currentList = normalizeOfflineFavorites(offlineFavs);

            listEl.innerHTML = `
        <p role="status">
          You are offline – showing saved favorites.
        </p>
      `;
            // Render favorites list after the message
            listEl.insertAdjacentHTML("beforeend", `<div class="offline-favs"></div>`);
            const favContainer = listEl.querySelector(".offline-favs");
            favContainer.className = "poster-grid"; // keep same layout

            renderList(currentList, favContainer);
            syncFavoritesUI(favContainer);
        } else {
            // ✅ Task #38 - point 3
            listEl.innerHTML = `
        <p role="alert">
          You are offline and no favorites are saved.
        </p>
      `;
        }
    }
}

/* ---------------- Helpers ---------------- */

async function fetchCharacters() {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
}

function normalizeCharacters(data) {
    return (data || []).map((c) => ({
        id: c.id || c.name, // fallback
        name: c.name || "Unknown",
        house: c.house || "Unknown",
        image: c.image || "",
    }));
}

function readFavoritesFromStorage() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

// If your favorites in storage are only {id,name}, we still make it renderable.
function normalizeOfflineFavorites(favs) {
    return favs.map((f) => ({
        id: f.id,
        name: f.name || "Unknown",
        house: f.house || "Unknown",
        image: f.image || "",
    }));
}

function filterByName(items, query) {
    if (!query) return items;
    return items.filter((c) => (c.name || "").toLowerCase().includes(query));
}

function renderList(items, listEl) {
    if (!items.length) {
        listEl.innerHTML = `<p role="status">No characters found.</p>`;
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
