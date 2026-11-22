import { isFavorite, getCompareIds } from "./storage.js";

export function escapeHTML(value = "") {
  return String(value).replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[character],
  );
}

export function formatPrice(price) {
  const number = Number(price);
  return Number.isFinite(number) ? number.toLocaleString() : "N/A";
}

export function renderLaptopCards(laptops, container, options = {}) {
  if (!container) return;

  const { showCompareButton = false } = options;

  if (laptops.length === 0) {
    container.innerHTML = `<p class="col-span-full text-center py-10">No laptops found.</p>`;
    return;
  }

  container.innerHTML = laptops
    .map((laptop) => {
      const id = escapeHTML(laptop.id);
      const name = escapeHTML(laptop.name);
      const brand = escapeHTML(laptop.brand);
      const image = escapeHTML(laptop.image || "");
      const category = escapeHTML(laptop.category || "");
      const favorite = isFavorite(laptop.id);
      const compared = getCompareIds().includes(String(laptop.id));

      return `
            <article class="laptop-card">
                <a href="./details.html?id=${encodeURIComponent(id)}" class="block">
                    <img src="${image}" alt="${name}" class="w-full h-48 object-contain"
                         onerror="this.hidden=true">
                    <div class="p-4">
                        <p class="text-sm">${brand} · ${category}</p>
                        <h2 class="text-lg font-semibold">${name}</h2>
                        <p class="font-bold mt-2">${formatPrice(laptop.price)}</p>
                        <p class="text-sm mt-2">
                            ${escapeHTML(laptop.cpu)} · ${escapeHTML(laptop.ramGB)} GB RAM
                        </p>
                    </div>
                </a>
                <div class="card-actions">
                    <button class="btn-action btn-favorite" type="button"
                            data-action="favorite" data-id="${id}"
                            aria-pressed="${favorite}"
                            aria-label="${favorite ? "Remove" : "Add"} ${name} ${favorite ? "from" : "to"} favorites">
                        ${favorite ? "Remove favorite" : "Add to favorites"}
                    </button>
                    ${
                      showCompareButton
                        ? `
                        <button class="btn-action btn-compare" type="button"
                                data-action="compare" data-id="${id}"
                                aria-pressed="${compared}"
                                aria-label="${compared ? "Remove" : "Add"} ${name} ${compared ? "from" : "to"} comparison">
                            ${compared ? "Remove from compare" : "Add to compare"}
                        </button>`
                        : ""
                    }
                </div>
            </article>
        `;
    })
    .join("");
}

export function renderSkeleton(container, count = 6) {
  if (!container) return;

  container.innerHTML = Array.from(
    { length: count },
    () => `
        <div class="laptop-card animate-pulse p-4">
            <div class="h-40 rounded bg-gray-300"></div>
            <div class="h-4 rounded bg-gray-300 mt-4 w-2/3"></div>
            <div class="h-4 rounded bg-gray-300 mt-3 w-1/2"></div>
            <div class="h-8 rounded bg-gray-300 mt-5"></div>
        </div>
    `,
  ).join("");
}

export function showMessage(container, message, className = "") {
  if (!container) return;
  container.innerHTML = `<p class="${className}">${escapeHTML(message)}</p>`;
}

export function refreshFavoriteButtons() {
  document.querySelectorAll('[data-action="favorite"]').forEach((button) => {
    const favorite = isFavorite(button.dataset.id);
    button.textContent = favorite ? "Remove favorite" : "Add to favorites";
    button.setAttribute("aria-pressed", String(favorite));
  });
}

export function initializeNavigation() {
  const toggle = document.querySelector("[data-nav-toggle]");
  const menu = document.querySelector("[data-nav-menu]");

  if (!toggle || !menu) return;

  toggle.addEventListener("click", () => {
    const isExpanded = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!isExpanded));
    menu.classList.toggle("hidden");
  });
}

export function initializeSharedUI() {
  initializeNavigation();
}
