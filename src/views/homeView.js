import { setupFavoritesUI, syncFavoritesUI } from "../features/favorites/favoritesUI.js";

export function renderHome(appEl) {
  const characters = [
    { id: "harry", name: "Harry Potter", subtitle: "Gryffindor" },
    { id: "hermione", name: "Hermione Granger", subtitle: "Gryffindor" },
    { id: "ron", name: "Ron Weasley", subtitle: "Gryffindor" },
    { id: "snape", name: "Severus Snape", subtitle: "Slytherin" },
    { id: "dumbledore", name: "Albus Dumbledore", subtitle: "Headmaster" },
    { id: "malfoy", name: "Draco Malfoy", subtitle: "Slytherin" },
  ];

  const books = [
    { id: "ps", name: "Philosopher’s Stone" },
    { id: "cos", name: "Chamber of Secrets" },
    { id: "poa", name: "Prisoner of Azkaban" },
    { id: "gof", name: "Goblet of Fire" },
    { id: "oop", name: "Order of the Phoenix" },
    { id: "hbp", name: "Half-Blood Prince" },
  ];

  const movies = [
    { id: "m1", name: "Sorcerer’s Stone" },
    { id: "m2", name: "Chamber of Secrets" },
    { id: "m3", name: "Prisoner of Azkaban" },
    { id: "m4", name: "Goblet of Fire" },
    { id: "m5", name: "Order of the Phoenix" },
    { id: "m6", name: "Half-Blood Prince" },
  ];

  const videos = [
    { id: "trailer", name: "Official Trailer" },
    { id: "bts", name: "Behind the Scenes" },
    { id: "interview", name: "Cast Interview" },
    { id: "hogwarts", name: "Hogwarts Tour" },
    { id: "music", name: "Soundtrack Feature" },
    { id: "magic", name: "Magic Moments" },
  ];

  appEl.innerHTML = `
    <section class="layout">

      <div class="main-col">
        <!-- HERO -->
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

        <!-- CHARACTERS (med favorites) -->
        <section class="content-card characters" aria-labelledby="characters-title">
          <div class="section-head">
            <h2 id="characters-title" class="section-title">Characters</h2>
            <a class="section-link" href="#/characters">View all</a>
          </div>

          <!-- ✅ Denna behåller .poster-grid så favoritesUI kan hitta knapparna -->
          <div class="poster-grid poster-grid--characters">
            ${characters.slice(0, 6).map((c) => `
              <a class="poster-card" href="#/character?id=${encodeURIComponent(c.id)}">
                <div class="poster-frame">
                  <img
                    class="poster-img"
                    src="${c.img || "https://via.placeholder.com/400x500?text=Character"}"
                    alt="${escapeHtml(c.name)}"
                    loading="lazy"
                  />
                </div>

                <h3 class="poster-title">${escapeHtml(c.name)}</h3>

                <button
                  type="button"
                  class="fav-btn"
                  data-fav-btn
                  data-id="${escapeHtml(c.id)}"
                  data-name="${escapeHtml(c.name)}"
                  aria-pressed="false"
                  aria-label="Add to favorites"
                >☆</button>
              </a>
            `).join("")}
          </div>
        </section>

        <!-- BOOKS -->
        <section class="content-card books" aria-labelledby="books-title">
          <div class="section-head">
            <h2 id="books-title" class="section-title">Books</h2>
            <a class="section-link" href="#/books">View all</a>
          </div>

          <div class="poster-grid">
            ${books.slice(0, 6).map((b) => `
              <a class="poster-card" href="#/books?id=${encodeURIComponent(b.id)}">
                <div class="poster-frame">
                  <img
                    class="poster-img"
                    src="${b.img || "https://via.placeholder.com/400x500?text=Book"}"
                    alt="${escapeHtml(b.name)}"
                    loading="lazy"
                  />
                </div>
                <h3 class="poster-title">${escapeHtml(b.name)}</h3>
                
                <button
                type="button"
                class="fav-btn"
                data-fav-btn
                data-id="${b.id}"
                data-name="${escapeHtml(b.name)}"
                data-type="book"
                aria-pressed="false"
                aria-label="Add to favorites"
              >☆</button 
              </a>
            `).join("")}
          </div>
        </section>

        <!-- MOVIES -->
        <section class="content-card movies" aria-labelledby="movies-title">
          <div class="section-head">
            <h2 id="movies-title" class="section-title">Movies</h2>
            <a class="section-link" href="#/movies">View all</a>
          </div>

          <div class="poster-grid">
            ${movies.slice(0, 6).map((m) => `
              <a class="poster-card" href="#/movies?id=${encodeURIComponent(m.id)}">
                <div class="poster-frame">
                  <img
                    class="poster-img"
                    src="${m.img || "https://via.placeholder.com/400x500?text=Movie"}"
                    alt="${escapeHtml(m.name)}"
                    loading="lazy"
                  />
                </div>
                <h3 class="poster-title">${escapeHtml(m.name)}</h3>
                <button
                type="button"
                class="fav-btn"
                data-fav-btn
                data-id="${m.id}"
                data-name="${escapeHtml(m.name)}"
                data-type="book"
                aria-pressed="false"
                aria-label="Add to favorites"
              >☆</button    
              </a>
            `).join("")}
          </div>
        </section>

        <!-- VIDEOS -->
        <section class="content-card videos" aria-labelledby="videos-title">
          <div class="section-head">
            <h2 id="videos-title" class="section-title">Videos</h2>
            <a class="section-link" href="#/videos">View all</a>
          </div>

          <div class="poster-grid">
            ${videos.slice(0, 6).map((v) => `
              <a class="poster-card" href="#/videos?id=${encodeURIComponent(v.id)}">
                <div class="poster-frame">
                  <img
                    class="poster-img"
                    src="${v.img || "https://via.placeholder.com/400x500?text=Video"}"
                    alt="${escapeHtml(v.name)}"
                    loading="lazy"
                  />
                </div>
                <h3 class="poster-title">${escapeHtml(v.name)}</h3>
                <button
                type="button"
                class="fav-btn"
                data-fav-btn
                data-id="${v.id}"
                data-name="${escapeHtml(v.name)}"
                data-type="book"
                aria-pressed="false"
                aria-label="Add to favorites"
              >☆</button
              </a>
            `).join("")}
          </div>
        </section>
      </div>

      <!-- SIDE -->
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
          <a class="browse-btn" href="#/videos">Videos</a>
          <a class="browse-btn" href="#/locations">Locations</a>
          <a class="browse-btn" href="#/spells">Spells</a>
          <a class="browse-btn" href="#/beasts">Beasts</a>
        </nav>
      </div>

    </section>
  `;

const grids = appEl.querySelectorAll(".poster-grid");

grids.forEach(grid => {
  setupFavoritesUI(grid);
  syncFavoritesUI(grid);
});

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
}