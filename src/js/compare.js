import { escapeHTML, formatPrice } from "./ui.js";

const COMPARISON_ROWS = [
  {
    key: "price",
    label: "Price",
    direction: "min",
    format: (value) => formatPrice(value),
  },
  { key: "cpu", label: "CPU", direction: null, format: (value) => value },
  {
    key: "ramGB",
    label: "RAM (GB)",
    direction: "max",
    format: (value) => `${value} GB`,
  },
  {
    key: "storageGB",
    label: "Storage (GB)",
    direction: "max",
    format: (value) => `${value} GB`,
  },
  {
    key: "batteryHours",
    label: "Battery (hours)",
    direction: "max",
    format: (value) => `${value} hours`,
  },
  {
    key: "weightKg",
    label: "Weight (kg)",
    direction: "min",
    format: (value) => `${value} kg`,
  },
  {
    key: "screenInches",
    label: "Screen (inches)",
    direction: null,
    format: (value) => `${value}"`,
  },
  {
    key: "category",
    label: "Category",
    direction: null,
    format: (value) => value,
  },
];

function getBestValue(laptops, key, direction) {
  const values = laptops
    .map((laptop) => Number(laptop[key]))
    .filter(Number.isFinite);

  if (values.length === 0) return null;
  return direction === "min" ? Math.min(...values) : Math.max(...values);
}

export function renderComparisonTable(laptops, container) {
  if (!container) return;

  if (laptops.length < 2) {
    container.innerHTML = `
            <p class="py-8 text-center">
                Select at least two favorite laptops to compare.
            </p>`;
    return;
  }

  if (laptops.length > 4) {
    container.textContent = "You can compare a maximum of four laptops.";
    return;
  }

  const header = `
        <thead>
            <tr>
                <th scope="col">Specification</th>
                ${laptops
                  .map(
                    (laptop) => `
                    <th scope="col">${escapeHTML(laptop.name)}</th>
                `,
                  )
                  .join("")}
            </tr>
        </thead>`;

  const body = COMPARISON_ROWS.map((row) => {
    const best = row.direction
      ? getBestValue(laptops, row.key, row.direction)
      : null;

    const cells = laptops
      .map((laptop) => {
        const rawValue = laptop[row.key];
        const numericValue = Number(rawValue);
        const isBest =
          row.direction !== null &&
          Number.isFinite(numericValue) &&
          numericValue === best;

        return `
                <td class="${isBest ? "best-value font-bold" : ""}">
                    ${escapeHTML(row.format(rawValue ?? "N/A"))}
                    ${isBest ? '<span aria-label="best value"> ★</span>' : ""}
                </td>`;
      })
      .join("");

    return `
            <tr>
                <th scope="row">${escapeHTML(row.label)}</th>
                ${cells}
            </tr>`;
  }).join("");

  container.innerHTML = `
        <div class="overflow-x-auto">
            <table class="w-full min-w-max">
                ${header}
                <tbody>${body}</tbody>
            </table>
        </div>`;
}
