import { renderHome } from "./views/homeView.js";
import { renderDetail } from "./views/detailView.js";
import { renderFavorites } from "./views/favoritesView.js";
import { renderAbout } from "./views/aboutView.js";

import { renderCharacters } from "./views/listViews/charactersView.js";
import { renderBooks } from "./views/listViews/booksView.js";
import { renderMovies } from "./views/listViews/moviesView.js";
import { renderSpells } from "./views/listViews/spellsView.js";
import { renderHouses } from "./views/listViews/housesView.js";

export function renderRoute() {
  const app = document.getElementById("app");
  const main = document.getElementById("main");
  main?.focus();

  const hash = location.hash || "#/home";

  if (hash.startsWith("#/home")) return renderHome(app);
  if (hash.startsWith("#/detail")) return renderDetail(app);
  if (hash.startsWith("#/favorites")) return renderFavorites(app);
  if (hash.startsWith("#/about")) return renderAbout(app);
  if (hash.startsWith("#/characters")) return renderCharacters(app);
  if (hash.startsWith("#/books")) return renderBooks(app);
  if (hash.startsWith("#/movies")) return renderMovies(app);
  if (hash.startsWith("#/spells")) return renderSpells(app);
  if (hash.startsWith("#/houses")) return renderHouses(app);

  app.innerHTML = `
    <section>
      <h1>Inte byggt än</h1>
      <p><a href="#/home">Tillbaka till Home</a></p>
    </section>
  `;
}