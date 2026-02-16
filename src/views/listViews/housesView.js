import { renderListPage } from "./listView.js";

export function renderHouses(appEl) {
  return renderListPage(appEl, { type: "houses" });
}