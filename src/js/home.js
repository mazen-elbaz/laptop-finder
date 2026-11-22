import { getLaptops } from "./api.js";
import { getFavorites, getFavoriteLaptops, toggleFavorite } from "./storage.js";

import { initializeSharedUI, renderLaptopCards, formatPrice } from "./ui.js";

initializeSharedUI();

async function initializeHome() {
  try {
    const laptops = await getLaptops();

    if (laptops.length === 0) {
      document.getElementById("total-laptops").textContent = "0";
      document.getElementById("lowest-price").textContent = "N/A";
      document.getElementById("favorites-count").textContent = "0";
      renderLaptopCards([], document.getElementById("laptop-list"));
      renderLaptopCards([], document.getElementById("favorites-grid"));
      return;
    }

    // 1. Display total laptops
    document.getElementById("total-laptops").textContent = laptops.length;

    // 2. Find and display the lowest price
    const cheapestLaptop = laptops.reduce((cheapest, laptop) =>
      Number(laptop.price) < Number(cheapest.price) ? laptop : cheapest,
    );

    document.getElementById("lowest-price").textContent = formatPrice(
      cheapestLaptop.price,
    );

    // Display cheapest laptop card
    const lowestContainer = document.getElementById("lowest-price-laptop");

    renderLaptopCards([cheapestLaptop], lowestContainer);

    // 3. Display favorites count
    const favorites = getFavoriteLaptops(laptops);

    document.getElementById("favorites-count").textContent = favorites.length;

    // 4. Display favorite laptop cards
    const favoriteGrid = document.getElementById("favorites-grid");

    renderLaptopCards(favorites, favoriteGrid);

    // 5. Display all laptops
    const laptopList = document.getElementById("laptop-list");

    renderLaptopCards(laptops, laptopList);
  } catch (error) {
    console.error("Homepage initialization failed:", error);

    const errorElement = document.getElementById("error-message");

    if (errorElement) {
      errorElement.textContent = "Unable to load laptop data.";
    }
  }
}

document.addEventListener("click", (event) => {
  const button = event.target.closest('button[data-action="favorite"]');
  if (!button) return;

  toggleFavorite(button.dataset.id);
  initializeHome();
});

initializeHome();
