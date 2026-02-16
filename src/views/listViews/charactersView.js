import { renderListPage } from "./listView.js";

export function renderCharacters(appEl) {
  return renderListPage(appEl, { type: "characters" });
}