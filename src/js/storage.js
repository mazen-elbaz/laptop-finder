// All persistent browser data is managed here.
const FAVORITES_KEY = "laptopFinderFavorites";
const COMPARE_KEY = "laptopFinderCompare";

function readArray(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(value) ? value.map(String) : [];
  } catch {
    return [];
  }
}

function writeArray(key, values) {
  localStorage.setItem(key, JSON.stringify(values.map(String)));
}

export const getFavorites = () => readArray(FAVORITES_KEY);

export function isFavorite(id) {
  return getFavorites().includes(String(id));
}

export function toggleFavorite(id) {
  const idString = String(id);
  const favorites = getFavorites();
  const exists = favorites.includes(idString);

  const updated = exists
    ? favorites.filter((favoriteId) => favoriteId !== idString)
    : [...favorites, idString];

  writeArray(FAVORITES_KEY, updated);
  return !exists;
}

export function removeFavorite(id) {
  const updated = getFavorites().filter(
    (favoriteId) => favoriteId !== String(id),
  );
  writeArray(FAVORITES_KEY, updated);
}

export function clearFavorites() {
  localStorage.removeItem(FAVORITES_KEY);
}

export function getFavoriteLaptops(laptops) {
  const favoriteIds = getFavorites();
  return laptops.filter((laptop) => favoriteIds.includes(String(laptop.id)));
}

// Comparison selection is separate from favorites. Only favorite laptops
// should be selected on compare.html, and no more than four can be selected.
export const getCompareIds = () => readArray(COMPARE_KEY);

export function setCompareIds(ids) {
  const uniqueIds = [...new Set(ids.map(String))];
  if (uniqueIds.length > 4) {
    return false;
  }
  writeArray(COMPARE_KEY, uniqueIds);
  return true;
}

export function addToCompare(id) {
  const idString = String(id);
  const ids = getCompareIds();

  if (ids.includes(idString)) return true;
  if (ids.length >= 4) return false;

  writeArray(COMPARE_KEY, [...ids, idString]);
  return true;
}

export function removeFromCompare(id) {
  writeArray(
    COMPARE_KEY,
    getCompareIds().filter((compareId) => compareId !== String(id)),
  );
}

export function clearCompare() {
  localStorage.removeItem(COMPARE_KEY);
}
