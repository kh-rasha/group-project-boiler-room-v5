export function renderHome(appEl) {
  appEl.innerHTML = `
    <section class="layout">

      <section class="hero" aria-labelledby="hero-title">
        <h1 id="hero-title">Live the Unwritten</h1>

        <div class="hero-content">
          <div class="hero-text">
            <p>Welcome to the Wizarding World of Harry Potter!</p>
            <p>Browse characters, spells, locations and beasts.</p>
          </div>

          <div class="hero-image placeholder" role="img" aria-label="Hogwarts image placeholder"></div>
        </div>
      </section>

      <aside class="about" aria-labelledby="about-title">
        <h2 id="about-title">About us</h2>
        <p>
          Wizardpedia is a fan-made wiki for exploring the wizarding world.
        </p>
      </aside>

      <nav class="browse" aria-label="Browse categories">
        <h2>Browse</h2>
        <a class="browse-btn" href="#/characters">Characters</a>
        <a class="browse-btn" href="#/locations">Locations</a>
        <a class="browse-btn" href="#/spells">Spells</a>
        <a class="browse-btn" href="#/beasts">Beasts</a>
      </nav>

    </section>
  `;
}