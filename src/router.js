import { renderCharacters } from "./views/charactersView.js";

import { renderHome } from "./views/homeView.js";

export function renderRoute() {
  const app = document.getElementById("app");
  const main = document.getElementById("main");

  // fokus på main vid vybyte (tangentbord)
  main?.focus();

  const hash = location.hash || "#/home";

  if (hash.startsWith("#/home")) {
    renderHome(app);
    return;
  }
  if (hash.startsWith("#/characters")) {
    renderCharacters(app);
    return;
  }


  // placeholders tills ni bygger vidare
  app.innerHTML = `
    <section>
      <h1>Inte byggt än</h1>
      <p><a href="#/home">Tillbaka till Home</a></p>
    </section>
  `;
}