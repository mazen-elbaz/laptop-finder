import { getLaptops } from "./api.js";
import {
  toggleFavorite,
  addToCompare,
  isFavorite,
  getCompareIds,
  removeFromCompare,
} from "./storage.js";
import {
  initializeSharedUI,
  renderLaptopCards,
  renderSkeleton,
  showMessage,
  refreshFavoriteButtons,
} from "./ui.js";

initializeSharedUI();

const grid = document.getElementById("laptop-grid");
const loading = document.getElementById("loading-skeleton");
const errorElement = document.getElementById("error-message");
const searchInput = document.getElementById("search-input");
const categoryFilter = document.getElementById("category-filter");
const maxPriceInput = document.getElementById("max-price");
const minRamInput = document.getElementById("min-ram");
const sortByInput = document.getElementById("sort-by");
const sortOrderInput = document.getElementById("sort-order");
const resultCount = document.getElementById("result-count");

let allLaptops = [];

function getFilteredLaptops() {
  const search = searchInput?.value.trim().toLowerCase() || "";
  const category = categoryFilter?.value || "";
  const maxPrice =
    maxPriceInput?.value === "" ? Infinity : Number(maxPriceInput.value);
  const minRam = minRamInput?.value === "" ? 0 : Number(minRamInput.value);

  const filtered = allLaptops.filter((laptop) => {
    const matchesSearch =
      laptop.name.toLowerCase().includes(search) ||
      laptop.brand.toLowerCase().includes(search);

    const matchesCategory = !category || laptop.category === category;
    const matchesPrice = Number(laptop.price) <= maxPrice;
    const matchesRam = Number(laptop.ramGB) >= minRam;

    return matchesSearch && matchesCategory && matchesPrice && matchesRam;
  });

  const sortKey = sortByInput?.value || "";
  const direction = sortOrderInput?.value === "desc" ? -1 : 1;

  if (sortKey) {
    return [...filtered].sort((a, b) => {
      return (Number(a[sortKey]) - Number(b[sortKey])) * direction;
    });
  }

  return filtered;
}

function updateCatalogue() {
  const filteredLaptops = getFilteredLaptops();
  renderLaptopCards(filteredLaptops, grid, { showCompareButton: true });

  if (resultCount) {
    resultCount.textContent = `${filteredLaptops.length} laptop(s) found`;
  }
}

async function initializeCatalogue() {
  renderSkeleton(loading || grid);

  try {
    allLaptops = await getLaptops();
    if (loading) loading.innerHTML = "";
    updateCatalogue();
  } catch (error) {
    if (loading) loading.innerHTML = "";
    showMessage(
      errorElement || grid,
      "Unable to load laptops. Check your connection and try again.",
    );
  }
}

[
  searchInput,
  categoryFilter,
  maxPriceInput,
  minRamInput,
  sortByInput,
  sortOrderInput,
]
  .filter(Boolean)
  .forEach((control) => {
    control.addEventListener(
      control === searchInput ? "input" : "change",
      updateCatalogue,
    );
  });

grid?.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const { action, id } = button.dataset;

  if (action === "favorite") {
    toggleFavorite(id);
    refreshFavoriteButtons();
  }

  if (action === "compare") {
    if (!isFavorite(id)) {
      showMessage(
        errorElement,
        "Add this laptop to favorites before comparing it.",
      );
      return;
    }

    if (getCompareIds().includes(String(id))) {
      removeFromCompare(id);
      showMessage(errorElement, "Laptop removed from comparison.");
    } else if (!addToCompare(id)) {
      showMessage(
        errorElement,
        "You can select a maximum of four laptops to compare.",
      );
    } else {
      showMessage(errorElement, "Laptop added to comparison.");
    }

    updateCatalogue();
  }
});

initializeCatalogue();
