

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

export function isFavorite(id, type) {
  return getFavorites().some(
    (fav) => fav.id === id && fav.type === type
  );
}

export function addFavorite(item) {
  const favorites = getFavorites();

  if (favorites.some((f) => f.id === item.id && f.type === item.type)) {
    return favorites;
  }

  const normalized = {
    id: item.id,
    name: item.name,
    type: item.type || "characters",
    img: item.img || "",
    subtitle: item.subtitle || ""
  };

  const next = [normalized, ...favorites];
  saveFavorites(next);
  return next;
}

export function removeFavorite(id, type) {
  const favorites = getFavorites();
  const next = favorites.filter(
    (f) => !(f.id === id && f.type === type)
  );
  saveFavorites(next);
  return next;
}

export function toggleFavorite(item) {
  return isFavorite(item.id, item.type)
    ? removeFavorite(item.id, item.type)
    : addFavorite(item);
}
