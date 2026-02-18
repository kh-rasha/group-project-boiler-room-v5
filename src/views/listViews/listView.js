import { setupFavoritesUI, syncFavoritesUI } from "../../features/favorites/favoritesUI.js";
import { HOUSE_IMAGES } from "../../utils/houseImages.js";

const HP_API = "https://hp-api.onrender.com/api";
const POTTER_DB = "https://api.potterdb.com/v1";
const STORAGE_KEY = "wizardpedia:favorites:v1";

 // Renderar en lista (characters/books/movies/spells/houses) i en content-card,
export async function renderListPage(appEl, { type }) {
  const cfg = LIST_CONFIG[type];
  if (!cfg) {
    appEl.innerHTML = `<p role="alert">Unknown list type: ${escapeHtml(type)}</p>`;
    return;
  }

  appEl.innerHTML = `
    <section class="layout layout--detail">
      <div class="main-col">
        <section class="content-card detail">
          <a href="#" class="back-link" data-back>← Back</a>
          <header class="page-header">
            <h1>${escapeHtml(cfg.title)}</h1>

            <label for="list-search" class="sr-only">Search</label>

            <input
              type="search"
              id="list-search"
              placeholder="Search ${escapeHtml(cfg.title)}…"
              aria-label="Search ${escapeHtml(cfg.title)}"
              autocomplete="off"
            />

            ${(cfg.filters?.length ? `
            <div class="filters" role="group" aria-label="Filters">
              <label class="filter-label" for="filter-by">Filter</label>
              <select id="filter-by">
                <option value="">None</option>
                ${cfg.filters.map(f => `<option value="${escapeHtml(f.key)}">${escapeHtml(f.label)}</option>`).join("")}
              </select>

              <label class="filter-label" for="filter-value">Value</label>
              <select id="filter-value" disabled>
                <option value="">All</option>
              </select>

              <button type="button" id="filter-clear">Clear</button>
            </div>
          ` : ``)}

          <div id="list-grid" class="posterlist-grid" aria-live="polite">
            <p>Loading…</p>
          </div>
          </header>

         
        </section>
      </div>
    </section>
  `;

  const back = appEl.querySelector("[data-back]");

  // Går tillbaka till senaste öppnade sidan
  back?.addEventListener("click", (e) => {
    e.preventDefault();

    if (history.length > 1) {
      history.back();
    } else {
      location.hash = "#/home";
    }
  });

  // ESC = stäng (gå tillbaka)
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        history.back(); 
      }
    };
    window.addEventListener("keydown", onKeyDown, { once: true });

  const gridEl = appEl.querySelector("#list-grid");
  const searchEl = appEl.querySelector("#list-search")
  const filterByEl = appEl.querySelector("#filter-by");
  const filterValueEl = appEl.querySelector("#filter-value");
  const clearBtn = appEl.querySelector("#filter-clear");

  // Filters

  let selectedKey = "";
  let selectedVal = "";

  function fillValueOptions(items, key) {
    const values = Array.from(
      new Set(items.map(x => (x[key] || "").trim()).filter(Boolean))
    ).sort((a,b) => a.localeCompare(b));

    filterValueEl.innerHTML = `<option value="">All</option>`;
    values.forEach(v => {
      const opt = document.createElement("option");
      opt.value = v;
      opt.textContent = v;
      filterValueEl.appendChild(opt);
    });

    filterValueEl.disabled = false;
  }

  function applyFilters() {
    const q = searchEl.value.trim().toLowerCase();
    let list = currentList;

    if (selectedKey && selectedVal) {
      list = list.filter(x => (x[selectedKey] || "") === selectedVal);
    }

    if (q) {
      list = list.filter(x => (x.name || "").toLowerCase().includes(q));
    }

    renderList(list, gridEl, type);
    syncFavoritesUI(gridEl);

    if (!list.length) gridEl.innerHTML = `<p role="status">No matches found.</p>`;
  }

  // koppla events endast om filtret finns på sidan
  if (filterByEl && filterValueEl && clearBtn) {
    filterByEl.addEventListener("change", () => {
      selectedKey = filterByEl.value;
      selectedVal = "";

      if (!selectedKey) {
        filterValueEl.innerHTML = `<option value="">All</option>`;
        filterValueEl.disabled = true;
        applyFilters();
        return;
      }

      fillValueOptions(currentList, selectedKey);
      applyFilters();
    });

    filterValueEl.addEventListener("change", () => {
      selectedVal = filterValueEl.value;
      applyFilters();
    });

    clearBtn.addEventListener("click", () => {
      searchEl.value = "";
      filterByEl.value = "";
      filterValueEl.innerHTML = `<option value="">All</option>`;
      filterValueEl.disabled = true;
      selectedKey = "";
      selectedVal = "";
      applyFilters();
      searchEl.focus();
    });
  }

  searchEl.addEventListener("input", applyFilters);


  // Favorites (delegation)
  setupFavoritesUI(gridEl);

  let currentList = [];

  searchEl.addEventListener("input", () => {
    const q = searchEl.value.trim().toLowerCase();
    const filtered = q
      ? currentList.filter((x) => (x.name || "").toLowerCase().includes(q))
      : currentList;

    renderList(filtered, gridEl, type);
    syncFavoritesUI(gridEl);

    if (!filtered.length) gridEl.innerHTML = `<p role="status">No matches found.</p>`;
  });

  // Försök online → annars offline favorites
  try {
    const raw = await cfg.fetcher();
    currentList = cfg.normalize(raw);

    renderList(currentList, gridEl, type);
    syncFavoritesUI(gridEl);
  } catch (err) {
    console.error(`${type} fetch failed:`, err);

    // OFFLINE → visa sparade favorites om vi har
    if (err?.type === "offline") {
      const offlineFavs = readFavoritesFromStorage();
      const offlineForType = filterFavsByTypeCompatible(offlineFavs, type);

      if (offlineForType.length > 0) {
        currentList = offlineForType.map((f) => ({
          id: f.id,
          name: f.name || "Unknown",
          subtitle: f.subtitle || "",
          img: f.img || "",
        }));

        gridEl.innerHTML = `
          <p role="status">You are offline — showing saved favorites.</p>
          <div class="poster-grid" id="offline-favs"></div>
        `;

        const favContainer = gridEl.querySelector("#offline-favs");
        renderList(currentList, favContainer, type);
        syncFavoritesUI(favContainer);
        return;
      }

      gridEl.innerHTML = `<p role="alert">You are offline and no favorites are saved.</p>`;
      return;
    }

    // Online/API error
    gridEl.innerHTML = `
      <p role="alert">We couldn’t load ${escapeHtml(cfg.title)} right now. Please try again.</p>
      <p><button type="button" id="retry-list">Try again</button></p>
    `;

    appEl.querySelector("#retry-list")?.addEventListener("click", () => {
      renderListPage(appEl, { type });
    });
  }
}

/* ---------------- Config per typ ---------------- */

const LIST_CONFIG = {
  characters: {
    title: "Characters",
    fetcher: () => fetchWithHandling(`${HP_API}/characters`),
    normalize: (data) => (data || []).map((c) => ({
      id: c.id || c.name,
      name: c.name || "Unknown",
      subtitle: c.house || "Unknown",
      house: c.house || "",
      species: c.species || "",
      gender: c.gender || "",
      ancestry: c.ancestry || "",
      img: c.image || "",
    })),
    filters: [
      { key: "house", label: "House" },
      { key: "species", label: "Species" },
      { key: "gender", label: "Gender" },
      { key: "ancestry", label: "Ancestry" },
    ],
  },

  books: {
    title: "Books",
    fetcher: async () => (await fetchWithHandling(`${POTTER_DB}/books`)).data || [],
    normalize: (data) => (data || []).map((b) => ({
      id: b.id,
      name: b.attributes?.title || "Unknown",
      subtitle: b.attributes?.author || "",
      author: b.attributes?.author || "",
      release_year: (b.attributes?.release_date || "").slice(0, 4),
      img: b.attributes?.cover || "",
    })),
    filters: [
      { key: "author", label: "Author" },
      { key: "release_year", label: "Year" },
    ],
  },

  movies: {
    title: "Movies",
    fetcher: async () => (await fetchWithHandling(`${POTTER_DB}/movies`)).data || [],
    normalize: (data) => (data || []).map((m) => ({
      id: m.id,
      name: m.attributes?.title || "Unknown",
      subtitle: m.attributes?.release_date || "",
      release_year: (m.attributes?.release_date || "").slice(0, 4),
      img: m.attributes?.poster || "",
    })),
    filters: [
      { key: "release_year", label: "Year" },
    ],
  },

  spells: {
    title: "Spells",
    fetcher: () => fetchWithHandling(`${HP_API}/spells`),
    normalize: (data) => (data || []).map((s) => ({
      id: s.id || s.name,
      name: s.name || "Unknown",
      subtitle: s.description ? "Has description" : "No description",
      hasDescription: s.description ? "Yes" : "No",
      img: "",
    })),
    filters: [
      { key: "hasDescription", label: "Has description" },
    ],
  },

  houses: {
    title: "Houses",
    fetcher: async () => ([
      { id: "gryffindor", name: "Gryffindor" },
      { id: "slytherin", name: "Slytherin" },
      { id: "ravenclaw", name: "Ravenclaw" },
      { id: "hufflepuff", name: "Hufflepuff" },
    ]),
    normalize: (data) => (data || []).map((h) => ({
      id: h.id,
      name: h.name,
      subtitle: "Hogwarts House",
      img: HOUSE_IMAGES?.[h.id] || "",
    })),
    filters: [], 
  },
};

/* ---------------- Rendering ---------------- */

function renderList(items, listEl, type) {
  if (!items.length) {
    listEl.innerHTML = `<p role="status">No items found.</p>`;
    return;
  }

  listEl.innerHTML = items
    .slice(0, 60)
    .map(
      (item) => `
      <a
        class="poster-card"
        href="#/detail?type=${encodeURIComponent(type)}&id=${encodeURIComponent(item.id)}"
        aria-label="Open ${escapeHtml(item.name)}"
      >
        <div class="poster-frame">
          ${
            item.img
              ? `<img class="poster-img" src="${escapeHtml(item.img)}" alt="${escapeHtml(
                  item.name
                )}" loading="lazy" />`
              : `<div class="poster-placeholder" aria-hidden="true"></div>`
          }
        </div>

        <h3 class="poster-title">${escapeHtml(item.name)}</h3>
        ${item.subtitle ? `<p class="poster-subtitle">${escapeHtml(item.subtitle)}</p>` : ""}

        <button
          type="button"
          class="fav-btn"
          data-fav-btn
          data-id="${escapeHtml(item.id)}"
          data-name="${escapeHtml(item.name)}"
          data-type="${escapeHtml(type)}"
          aria-pressed="false"
          aria-label="Toggle favorite"
        >☆</button>
      </a>
    `
    )
    .join("");
}

/* ---------------- Fetch + offline handling ---------------- */

async function fetchWithHandling(url, { timeoutMs = 8000 } = {}) {
  if (!navigator.onLine) {
    const err = new Error("offline");
    err.type = "offline";
    throw err;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) {
      const err = new Error(`API responded with ${res.status}`);
      err.type = "api";
      err.status = res.status;
      throw err;
    }
    return await res.json();
  } catch (e) {
    if (e.name === "AbortError") {
      const err = new Error("timeout");
      err.type = "timeout";
      throw err;
    }
    if (!navigator.onLine) {
      const err = new Error("offline");
      err.type = "offline";
      throw err;
    }
    const err = new Error("network");
    err.type = "network";
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}

/* ---------------- Favorites offline helpers ---------------- */

function readFavoritesFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

 // Kompatibel filtrering:
 
function filterFavsByTypeCompatible(favs, type) {
  const hasType = favs.some((f) => "type" in (f || {}));
  if (!hasType) return favs;
  return favs.filter((f) => f?.type === type);
}

/* ---------------- Utils ---------------- */

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}