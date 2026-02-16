import { renderListPage } from "./listView.js";

export function renderMovies(appEl) {
  return renderListPage(appEl, { type: "movies" });
}