export function renderHome(appEl) {
  // Placeholder-data nu, koppla till API senare
  const characters = [
    { id: "harry", name: "Harry Potter" },
    { id: "hermione", name: "Hermione Granger" },
    { id: "ron", name: "Ron Weasley" },
    { id: "snape", name: "Severus Snape" },
    { id: "dumbledore", name: "Albus Dumbledore" },
    { id: "malfoy", name: "Draco Malfoy" },
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
    { id: "music", name: "Soundtrack Feature" },
    { id: "hogwarts", name: "Hogwarts Tour" },
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

        <!-- CONTENT CARDS -->
        ${renderPosterSection({
          title: "Characters",
          route: "characters",
          items: characters.slice(0, 6),
        })}

        ${renderPosterSection({
          title: "Books",
          route: "books",
          items: books.slice(0, 6),
        })}

        ${renderPosterSection({
          title: "Movies",
          route: "movies",
          items: movies.slice(0, 6),
        })}

        ${renderPosterSection({
          title: "Videos",
          route: "videos",
          items: videos.slice(0, 6),
        })}
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
}

function renderPosterSection({ title, route, items }) {
  const titleId = `${route}-title`;

  return `
    <section class="content-card" aria-labelledby="${titleId}">
      <div class="section-head">
        <h2 id="${titleId}" class="section-title">${escapeHtml(title)}</h2>
        <a class="section-link" href="#/${route}">View all</a>
      </div>

      <div class="poster-grid">
        ${items.map(item => `
          <a class="poster-card"
             href="#/${route}?id=${encodeURIComponent(item.id)}"
             aria-label="Open ${escapeHtml(title)} item: ${escapeHtml(item.name)}">
            <div class="poster-frame">
              <img
                class="poster-img"
                src="${item.img || "https://via.placeholder.com/400x500?text=Item"}"
                alt="${escapeHtml(item.name)}"
                loading="lazy"
              />
            </div>
            <h3 class="poster-title">${escapeHtml(item.name)}</h3>
          </a>
        `).join("")}
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