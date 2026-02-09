export function renderHome(appEl) {
  // Placeholder-data nu, koppla till API senare
  const characters = [
    { id: "harry", name: "Harry Potter", subtitle: "Gryffindor" },
    { id: "hermione", name: "Hermione Granger", subtitle: "Gryffindor" },
    { id: "ron", name: "Ron Weasley", subtitle: "Gryffindor" },
    { id: "snape", name: "Severus Snape", subtitle: "Slytherin" },
    { id: "dumbledore", name: "Albus Dumbledore", subtitle: "Headmaster" },
    { id: "malfoy", name: "Draco Malfoy", subtitle: "Slytherin" },

  ];

  appEl.innerHTML = `
    <section class="layout">

      <section class="hero" aria-labelledby="hero-title">
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

        <!-- Characters section INSIDE the same hero card -->
        <section class="hero-characters" aria-labelledby="characters-title">
          <div class="section-head">
            <h2 id="characters-title">Characters</h2>
            <a class="section-link" href="#/characters">View all</a>
          </div>

          <div class="character-grid poster-grid">
          ${characters.map(c => `
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
            </a>
          `).join("")}
        </div>
        </section>
      </section>

      <div class="side">
        <aside class="about" aria-labelledby="about-title">
          <h2 id="about-title">About us</h2>
          <div class="hero-text">
          <p>Wizardpedia is a fan-made wiki for exploring the wizarding world.</p>
          </div>
        </aside>

        <nav class="browse" aria-label="Browse categories">
          <h2>Browse</h2>
          <a class="browse-btn" href="#/characters">Characters</a>
          <a class="browse-btn" href="#/locations">Locations</a>
          <a class="browse-btn" href="#/spells">Spells</a>
          <a class="browse-btn" href="#/beasts">Beasts</a>
        </nav>
      </div>

    </section>
  `;
}

function escapeHtml(s) {
  return String(s)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;");
}