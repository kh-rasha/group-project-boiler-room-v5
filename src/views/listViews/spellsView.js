import { renderListPage } from "./listView.js";

export function renderSpells(appEl) {
  return renderListPage(appEl, { type: "spells" });
}