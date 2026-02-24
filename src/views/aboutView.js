export function renderAbout(appEl) {
  appEl.innerHTML = `
    <section class="layout layout--detail">
      <div class="main-col">
        <section class="content-card">
          <a href="#" class="back-link" data-back>← Back</a>

          <header class="page-header">
            <h1>About Wizardpedia</h1>
          </header>

          <div class="about-page">
            <p>
              Wizardpedia is a fan-made Harry Potter wiki built as a Progressive Web App.
              The goal is to browse characters, spells, books, movies and Hogwarts houses in a fast and accessible way.
            </p>

            <h2 class="section-title" style="margin-top: 2rem;">Features</h2>
            <ul class="about-list">
              <li>Search + filtering</li>
              <li>Favorites (saved locally)</li>
              <li>Offline support (Service Worker + cache)</li>
              <li>Accessible navigation (keyboard + focus)</li>
            </ul>

            <h2 class="section-title" style="margin-top: 2rem;">Tech</h2>
            <ul class="about-list">
              <li>Vanilla JS + Vite</li>
              <li>HP API + PotterDB</li>
              <li>PWA (manifest + service worker)</li>
            </ul>
          </div>
        </section>
      </div>
    </section>
  `;

  // Back ska gå tillbaka dit man kom ifrån (som ni gjort på list/detalj)
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

  // Fokus för tillgänglighet
  back?.focus();
}