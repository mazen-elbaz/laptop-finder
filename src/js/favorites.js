import { getLaptops } from "./api.js";
import {
  getFavoriteLaptops,
  removeFavorite,
  clearFavorites,
} from "./storage.js";
import {
  initializeSharedUI,
  renderLaptopCards,
  renderSkeleton,
  showMessage,
  formatPrice,
} from "./ui.js";

initializeSharedUI();

const grid = document.getElementById("favorites-grid");
const loading = document.getElementById("loading-skeleton");
const errorElement = document.getElementById("error-message");
const clearButton = document.getElementById("clear-favorites");

function updateFavoriteStats(laptops) {
  const total = laptops.reduce((sum, laptop) => sum + Number(laptop.price), 0);
  const average = laptops.length ? total / laptops.length : 0;

  const totalElement = document.getElementById("favorites-total");
  const averageElement = document.getElementById("favorites-average");

  if (totalElement) totalElement.textContent = formatPrice(total);
  if (averageElement) averageElement.textContent = formatPrice(average);
}

async function initializeFavorites() {
  renderSkeleton(loading || grid);

  try {
    const allLaptops = await getLaptops();
    const favorites = getFavoriteLaptops(allLaptops);

    if (loading) loading.innerHTML = "";
    updateFavoriteStats(favorites);
    renderLaptopCards(favorites, grid);

    if (clearButton) clearButton.disabled = favorites.length === 0;
  } catch (error) {
    if (loading) loading.innerHTML = "";
    showMessage(errorElement || grid, "Could not load your favorites.");
  }
}

grid?.addEventListener("click", (event) => {
  const button = event.target.closest('button[data-action="favorite"]');
  if (!button) return;

  removeFavorite(button.dataset.id);
  initializeFavorites();
});

clearButton?.addEventListener("click", () => {
  clearFavorites();
  initializeFavorites();
});

initializeFavorites();
