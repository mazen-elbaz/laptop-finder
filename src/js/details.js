import { getLaptops } from "./api.js";
import {
  isFavorite,
  toggleFavorite,
  addToCompare,
  removeFromCompare,
  getCompareIds,
} from "./storage.js";
import {
  initializeSharedUI,
  escapeHTML,
  formatPrice,
  showMessage,
} from "./ui.js";

initializeSharedUI();

const detailsContainer = document.getElementById("laptop-details");
const loading = document.getElementById("loading-skeleton");
const errorElement = document.getElementById("error-message");
const favoriteButton = document.getElementById("favorite-button");
const compareButton = document.getElementById("compare-button");

const laptopId = new URLSearchParams(window.location.search).get("id");

let currentLaptop = null;

function renderDetails(laptop) {
  const fields = [
    ["Brand", laptop.brand],
    ["Category", laptop.category],
    ["CPU", laptop.cpu],
    ["RAM", `${laptop.ramGB} GB`],
    ["Storage", `${laptop.storageGB} GB`],
    ["Battery", `${laptop.batteryHours} hours`],
    ["Weight", `${laptop.weightKg} kg`],
    ["Screen", `${laptop.screenInches} inches`],
  ];

  detailsContainer.innerHTML = `
        <article class="grid gap-6 md:grid-cols-2">
            <img src="${escapeHTML(laptop.image || "")}"
                 alt="${escapeHTML(laptop.name)}"
                 class="w-full object-contain"
                 onerror="this.hidden=true">
            <div>
                <p>${escapeHTML(laptop.brand)} · ${escapeHTML(laptop.category)}</p>
                <h1 class="text-3xl font-bold">${escapeHTML(laptop.name)}</h1>
                <p class="text-xl font-bold my-4">${formatPrice(laptop.price)}</p>
                <p>${escapeHTML(laptop.description || "No description available.")}</p>
            </div>
        </article>
        <h2 class="text-2xl font-semibold mt-8">Full specifications</h2>
        <div class="overflow-x-auto">
            <table class="w-full">
                <tbody>
                    ${fields
                      .map(
                        ([label, value]) => `
                        <tr>
                            <th scope="row" class="text-left p-3">${escapeHTML(label)}</th>
                            <td class="p-3">${escapeHTML(value)}</td>
                        </tr>
                    `,
                      )
                      .join("")}
                </tbody>
            </table>
        </div>`;

  updateActionButtons();
}

function updateActionButtons() {
  if (!currentLaptop) return;

  const favorite = isFavorite(currentLaptop.id);
  if (favoriteButton) {
    favoriteButton.textContent = favorite
      ? "Remove from favorites"
      : "Add to favorites";
    favoriteButton.setAttribute("aria-pressed", String(favorite));
  }

  const selected = getCompareIds().includes(String(currentLaptop.id));
  if (compareButton) {
    compareButton.textContent = selected
      ? "Remove from comparison"
      : "Add to comparison";
    compareButton.setAttribute("aria-pressed", String(selected));
  }
}

favoriteButton?.addEventListener("click", () => {
  if (!currentLaptop) return;
  toggleFavorite(currentLaptop.id);
  updateActionButtons();
});

compareButton?.addEventListener("click", () => {
  if (!currentLaptop) return;

  const selected = getCompareIds().includes(String(currentLaptop.id));

  if (!isFavorite(currentLaptop.id) && !selected) {
    showMessage(
      errorElement,
      "Add this laptop to favorites first. The comparison list is built from favorites.",
    );
    return;
  }

  if (selected) {
    removeFromCompare(currentLaptop.id);
    showMessage(errorElement, "Removed from comparison.");
  } else if (addToCompare(currentLaptop.id)) {
    showMessage(errorElement, "Added to comparison.");
  } else {
    showMessage(errorElement, "You can compare a maximum of four laptops.");
  }

  updateActionButtons();
});

async function initializeDetails() {
  if (!laptopId) {
    showMessage(
      errorElement || detailsContainer,
      "No laptop ID was provided in the URL.",
    );
    if (loading) loading.innerHTML = "";
    return;
  }

  try {
    const laptops = await getLaptops();
    currentLaptop = laptops.find((laptop) => String(laptop.id) === laptopId);

    if (!currentLaptop) {
      showMessage(
        errorElement || detailsContainer,
        "Laptop not found. Please return to the catalogue.",
      );
      return;
    }

    if (loading) loading.innerHTML = "";
    renderDetails(currentLaptop);
  } catch (error) {
    showMessage(
      errorElement || detailsContainer,
      "Could not load this laptop.",
    );
  }
}

initializeDetails();
