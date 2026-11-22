import { getLaptops } from "./api.js";
import {
  getFavoriteLaptops,
  getCompareIds,
  setCompareIds,
  clearCompare,
} from "./storage.js";
import { initializeSharedUI, escapeHTML, showMessage } from "./ui.js";
import { renderComparisonTable } from "./compare.js";

initializeSharedUI();

const selectionList = document.getElementById("compare-selection-list");
const tableContainer = document.getElementById("compare-table");
const messageElement = document.getElementById("compare-message");
const clearButton = document.getElementById("clear-compare");

let favoriteLaptops = [];

function renderSelectionList() {
  const selectedIds = getCompareIds();

  if (!selectionList) return;

  if (favoriteLaptops.length === 0) {
    selectionList.innerHTML = `
            <div class="compare-empty col-span-full">
                <h2 class="text-xl font-semibold">No favorites to compare</h2>
                <p class="mt-2">Save at least two laptops, then return here to compare them side by side.</p>
                <a class="btn-action inline-block mt-4" href="laptops.html">Browse laptops</a>
            </div>`;
    renderComparisonTable([], tableContainer);
    if (clearButton) clearButton.disabled = true;
    return;
  }

  selectionList.innerHTML = favoriteLaptops
    .map((laptop) => {
      const id = escapeHTML(laptop.id);
      const checked = selectedIds.includes(String(laptop.id));

      return `
            <label class="compare-option ${checked ? "is-selected" : ""}">
                <input type="checkbox" data-compare-id="${id}" ${checked ? "checked" : ""}>
                <img src="${escapeHTML(laptop.image || "")}" alt="" class="h-16 w-20 object-contain" onerror="this.hidden=true">
                <span class="min-w-0"><strong class="block truncate">${escapeHTML(laptop.name)}</strong><small>${escapeHTML(laptop.brand)} · ${escapeHTML(laptop.category)}</small></span>
            </label>`;
    })
    .join("");

  if (clearButton) clearButton.disabled = selectedIds.length === 0;
  updateComparison();
}

function updateComparison() {
  const selectedIds = getCompareIds();
  const selectedLaptops = favoriteLaptops.filter((laptop) =>
    selectedIds.includes(String(laptop.id)),
  );

  renderComparisonTable(selectedLaptops, tableContainer);

  if (messageElement) {
    messageElement.textContent = `${selectedLaptops.length} of 4 selected${selectedLaptops.length < 2 ? ". Select at least 2 to compare." : "."}`;
  }

  if (clearButton) clearButton.disabled = selectedLaptops.length === 0;
}

selectionList?.addEventListener("change", (event) => {
  const checkbox = event.target.closest("input[data-compare-id]");
  if (!checkbox) return;

  const id = checkbox.dataset.compareId;
  const currentIds = getCompareIds();

  const updatedIds = checkbox.checked
    ? [...currentIds, id]
    : currentIds.filter((currentId) => currentId !== id);

  if (updatedIds.length > 4) {
    checkbox.checked = false;
    showMessage(messageElement, "You can compare a maximum of four laptops.");
    return;
  }

  setCompareIds(updatedIds);
  renderSelectionList();
});

clearButton?.addEventListener("click", () => {
  clearCompare();
  renderSelectionList();
});

async function initializeComparePage() {
  try {
    const laptops = await getLaptops();
    favoriteLaptops = getFavoriteLaptops(laptops);

    // Remove saved comparison IDs that are no longer favorites.
    const favoriteIds = favoriteLaptops.map((laptop) => String(laptop.id));
    setCompareIds(getCompareIds().filter((id) => favoriteIds.includes(id)));

    renderSelectionList();
  } catch (error) {
    showMessage(
      messageElement || selectionList,
      "Could not load laptops for comparison.",
    );
  }
}

initializeComparePage();
