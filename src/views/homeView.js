import { setupFavoritesUI, syncFavoritesUI } from "../features/favorites/favoritesUI.js";
import { HOUSE_IMAGES } from "../utils/houseImages.js";

const HP_API = "https://hp-api.onrender.com/api";
const POTTER_DB = "https://api.potterdb.com/v1";

function getFriendlyMessage(type) {
  if (type === "offline") {
    return "You are offline — we can’t fetch new data right now. Favorites will still work.";
  }
  return "We couldn’t load the data right now. Please try again in a moment.";
}


export async function renderHome(appEl) {
  const heroHtml = `
    <section class="hero content-card" aria-labelledby="hero-title">
      <h1 id="hero-title">Welcome to Wizardpedia</h1>

      <div class="hero-content">
        <div class="hero-text">
          <p>
            Step into the wizarding world of Harry Potter.
            Wizardpedia is a fan-made wiki dedicated to exploring the magical universe of witches and wizards.
          </p>
          <p>
            Here you can browse well-known characters, discover powerful spells, explore iconic locations,
            and learn more about magical creatures from the wizarding world. Whether you are looking for familiar names or hidden details,
            Wizardpedia gathers everything in one place.
          </p>
          <p>
            Whether you are a longtime fan revisiting familiar tales or a newcomer curious about the wizarding universe,
            Wizardpedia offers an easy way to browse, learn, and explore. Built as a Progressive Web App, the site is designed to be accessible,
            responsive, and usable both online and offline.
          </p>
          <p>
            Created by fans, for fans — this is a place to explore, revisit, and rediscover the magic.
          </p>
        </div>
      </div>
    </section>
  `;

  appEl.innerHTML = `
    <section class="layout">
      <div class="main-col">
        ${heroHtml}
        <section class="content-card"><p>Loading…</p></section>
      </div>
    </section>
  `;

  try {
  const [
  charactersRes,
  spellsRes,
  booksRes,
  moviesRes,
  gryffRes,
  slythRes,
  ravenRes,
  huffRes
] = await Promise.all([
  fetch(`${HP_API}/characters`),
  fetch(`${HP_API}/spells`),
  fetch(`${POTTER_DB}/books`),
  fetch(`${POTTER_DB}/movies`),
  fetch(`${HP_API}/characters/house/gryffindor`),
  fetch(`${HP_API}/characters/house/slytherin`),
  fetch(`${HP_API}/characters/house/ravenclaw`),
  fetch(`${HP_API}/characters/house/hufflepuff`),
]);

    if (!charactersRes.ok) throw new Error("Failed characters");
    if (!spellsRes.ok) throw new Error("Failed spells");
    if (!booksRes.ok) throw new Error("Failed books");
    if (!moviesRes.ok) throw new Error("Failed movies");
    if (!gryffRes.ok) throw new Error("Failed house gryffindor");
    if (!slythRes.ok) throw new Error("Failed house slytherin");
    if (!ravenRes.ok) throw new Error("Failed house ravenclaw");
    if (!huffRes.ok) throw new Error("Failed house hufflepuff");

    const characters = await charactersRes.json();
    const spells = await spellsRes.json();
    const books = (await booksRes.json()).data;
    const movies = (await moviesRes.json()).data;
    const [gryff, slyth, raven, huff] = await Promise.all([gryffRes.json(), slythRes.json(),ravenRes.json(),huffRes.json(),]);

    const houses = [
    { id: "gryffindor", name: "Gryffindor", count: gryff.length },
    { id: "slytherin", name: "Slytherin", count: slyth.length },
    { id: "ravenclaw", name: "Ravenclaw", count: raven.length },
    { id: "hufflepuff", name: "Hufflepuff", count: huff.length },
].map(h => ({
    id: h.id,
    name: `${h.name} (${h.count})`,
    img: HOUSE_IMAGES[h.id] || null,
}));

    appEl.innerHTML = `
      <section class="layout">
        <div class="main-col">
          ${heroHtml}

          ${renderPosterSection({
            title: "Characters",
            route: "characters",
            items: characters.slice(0, 6).map((c) => ({
              id: c.id || c.name,
              name: c.name,
              img: c.image,
            })),
          })}

          ${renderPosterSection({
            title: "Books",
            route: "books",
            items: books.slice(0, 6).map((b) => ({
              id: b.id,
              name: b.attributes.title,
              img: b.attributes.cover,
            })),
          })}

          ${renderPosterSection({
            title: "Movies",
            route: "movies",
            items: movies.slice(0, 6).map((m) => ({
              id: m.id,
              name: m.attributes.title,
              img: m.attributes.poster,
            })),
          })}

          ${renderPosterSection({
            title: "Spells",
            route: "spells",
            items: spells.slice(0, 6).map((s) => ({
              id: s.id || s.name,
              name: s.name,
              img: null,
            })),
          })}

          ${renderPosterSection({
          title: "Houses",
          route: "houses",
          items: houses
        })}


        </div>

        <div class="side">
          <aside class="about content-card" aria-labelledby="about-title">
            <h2 id="about-title" class="section-title">About us</h2>
            <p id="about-text">Wizardpedia is a fan-made wiki for exploring the wizarding world.</p>
          </aside>

          <nav class="browse content-card" aria-label="Browse categories">
            <h2 class="section-title">Browse</h2>
            <a class="browse-btn" href="#/characters">Characters</a>
            <a class="browse-btn" href="#/books">Books</a>
            <a class="browse-btn" href="#/movies">Movies</a>
            <a class="browse-btn" href="#/spells">Spells</a>
            <a class="browse-btn" href="#/houses">Houses</a>
          </nav>
        </div>
      </section>
    `;

    // Favorites: initiera på alla grids på startsidan
    appEl.querySelectorAll(".poster-grid").forEach((grid) => {
      setupFavoritesUI(grid);
      syncFavoritesUI(grid);
    });
} catch (err) {
  console.error(err);

  const isOffline = !navigator.onLine;

  appEl.innerHTML = `
    <section class="layout">
      <div class="main-col">
        ${heroHtml}
        <p role="alert">
          ${getFriendlyMessage(isOffline ? "offline" : "error")}
        </p>

        ${
          isOffline
            ? `<p>Tip: Turn on your internet connection and reload to update the content.</p>`
            : `
              <p>If the problem continues, try again.</p>
              <p>
                <button type="button" id="retry-btn">
                  Try again
                </button>
              </p>
            `
        }
      </div>
    </section>
  `;

  const retryBtn = appEl.querySelector("#retry-btn");
  if (retryBtn) {
    retryBtn.addEventListener("click", () => renderHome(appEl));
  }
}


  const retryBtn = appEl.querySelector("#retry-btn");
  if (retryBtn) retryBtn.addEventListener("click", () => renderHome(appEl));
}


function renderPosterSection({ title, route, items }) {
  return `
    <section class="content-card" aria-labelledby="${route}-title">
      <div class="section-head">
        <h2 id="${route}-title" class="section-title">${escapeHtml(title)}</h2>
        <a class="section-link" href="#/${route}">View all</a>
      </div>

      <div class="poster-grid">
        ${items
          .map(
            (item) => `
          <a class="poster-card" href="#/detail?type=${encodeURIComponent(route)}&id=${encodeURIComponent(item.id)}">
            <div class="poster-frame">
              ${
                item.img
                  ? `<img class="poster-img" src="${item.img}" alt="${escapeHtml(
                      item.name
                    )}" loading="lazy"/>`
                  : `<div class="poster-placeholder"></div>`
              }
            </div>

            <h3 class="poster-title">${escapeHtml(item.name)}</h3>

            <button
              type="button"
              class="fav-btn"
              data-fav-btn
              data-id="${escapeHtml(item.id)}"
              data-name="${escapeHtml(item.name)}"
              data-type="${escapeHtml(route)}"
              aria-pressed="false"
              aria-label="Add to favorites"
            >☆</button>
          </a>
        `
          )
          .join("")}
      </div>
    </section>
  `;
}

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}