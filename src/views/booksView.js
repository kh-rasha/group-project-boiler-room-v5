import { renderListPage } from "./listView.js";

export function renderBooks(appEl) {
  return renderListPage(appEl, { type: "books" });
}