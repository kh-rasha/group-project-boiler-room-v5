// src/storage/favoritesStorage.js

const STORAGE_KEY = "wizardpedia:favorites:v1";

function safeParse(json) {
    try {
        return JSON.parse(json);
    } catch {
        return null;
    }
}

export function getFavorites() {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? safeParse(raw) : null;
    return Array.isArray(parsed) ? parsed : [];
}

export function saveFavorites(favorites) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
}

export function isFavorite(id) {
    return getFavorites().some((fav) => fav.id === id);
}

export function addFavorite(character) {
    const favorites = getFavorites();
    if (favorites.some((f) => f.id === character.id)) return favorites;

    const next = [character, ...favorites];
    saveFavorites(next);
    return next;
}

export function removeFavorite(id) {
    const favorites = getFavorites();
    const next = favorites.filter((f) => f.id !== id);
    saveFavorites(next);
    return next;
}

export function toggleFavorite(character) {
    return isFavorite(character.id)
        ? removeFavorite(character.id)
        : addFavorite(character);
}
