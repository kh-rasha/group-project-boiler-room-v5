
import { isFavorite, toggleFavorite } from "../../storage/favoritesStorage.js";

/**
 * Initializes favorite button behavior inside a container
 * (e.g. the characters list container).
 * Uses event delegation to handle all favorite buttons.
 */
export function setupFavoritesUI(containerEl, { removeCardOnUnfavorite = false } = {}) {
  if (!containerEl) return;

  containerEl.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-fav-btn]");
    if (!btn) return;

    e.preventDefault();
    e.stopPropagation();

    const id = btn.dataset.id;
    const name = btn.dataset.name;
    const type = btn.dataset.type;
    const img = btn.dataset.img || "";
    const subtitle = btn.dataset.subtitle || "";
    if (!id) return;

    const wasFavorite = isFavorite(id, type);

    toggleFavorite({ id, name, type, img, subtitle });

    const isNowFavorite = isFavorite(id, type);
    updateFavButton(btn, isNowFavorite);

    // ✅ Bara i favorites-view: ta bort kortet direkt när man avfavoritar
    if (removeCardOnUnfavorite && wasFavorite && !isNowFavorite) {
      const card = btn.closest(".poster-card");
      if (card) {
        card.classList.add("poster-card--removing");
        setTimeout(() => {
          card.remove();

          if (!containerEl.querySelector(".poster-card")) {
            containerEl.innerHTML = `<p role="status">No favorites saved yet.</p>`;
          }
        }, 220);
      }
    }
  });
}



/**
 * Synchronizes favorite buttons with stored favorites.
 * Should be called after rendering character cards.
 */
export function syncFavoritesUI(containerEl) {
  if (!containerEl) return;

  containerEl.querySelectorAll("[data-fav-btn]").forEach((btn) => {
    updateFavButton(
      btn,
      isFavorite(btn.dataset.id, btn.dataset.type)
    );
  });
}

/**
 * Updates the visual state and accessibility attributes
 * of a favorite button.
 */
function updateFavButton(btn, isFav) {
    btn.textContent = isFav ? "★" : "☆";
    btn.setAttribute(
        "aria-label",
        isFav ? "Remove from favorites" : "Add to favorites"
    );
    btn.setAttribute("aria-pressed", isFav ? "true" : "false");
}
