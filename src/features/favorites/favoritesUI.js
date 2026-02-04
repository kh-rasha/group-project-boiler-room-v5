
import { isFavorite, toggleFavorite } from "../../storage/favoritesStorage.js";

/**
 * Initializes favorite button behavior inside a container
 * (e.g. the characters list container).
 * Uses event delegation to handle all favorite buttons.
 */
export function setupFavoritesUI(containerEl) {
    if (!containerEl) return;

    // Event delegation: listen for clicks on any favorite button
    containerEl.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-fav-btn]");
        if (!btn) return;

        const id = btn.dataset.id;
        const name = btn.dataset.name;

        // Toggle favorite state in storage
        toggleFavorite({ id, name });

        // Update button UI after toggling
        updateFavButton(btn, isFavorite(id));
    });
}

/**
 * Synchronizes favorite buttons with stored favorites.
 * Should be called after rendering character cards.
 */
export function syncFavoritesUI(containerEl) {
    if (!containerEl) return;

    containerEl.querySelectorAll("[data-fav-btn]").forEach((btn) => {
        updateFavButton(btn, isFavorite(btn.dataset.id));
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
