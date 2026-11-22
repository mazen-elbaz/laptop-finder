# Student Laptop Finder

A static laptop discovery app for browsing, filtering, favoriting, and comparing laptops.

## Features

- Browse all laptops with search, category, price, RAM, and sorting filters.
- Open a dedicated details page for each laptop.
- Add or remove laptops from favorites.
- View favorite laptops with total and average price statistics.
- Compare two to four favorite laptops side by side.
- Highlight the best numeric value in each comparison row.
- Store favorites and comparison selections in browser `localStorage`.

## Pages

- `src/index.html`: Dashboard with statistics, all laptops, cheapest laptop, and favorite previews.
- `src/laptops.html`: Searchable and filterable laptop catalogue.
- `src/details.html?id=1`: Detailed laptop view. Replace `1` with another laptop ID.
- `src/favorites.html`: Saved laptops and favorite statistics.
- `src/compare.html`: Select and compare favorite laptops.

## Run Locally

From the `Assignment_2/src` directory:

```bash
npm install
npm run dev
```

`npm run dev` watches `css/input.css` and rebuilds `css/output.css`.

Because the app loads JSON with `fetch`, open it through a local web server instead of directly from a `file://` URL. For example, with the VS Code Live Server extension, open `src/index.html` using **Open with Live Server**.

## Project Structure

```text
src/
├── index.html
├── laptops.html
├── details.html
├── favorites.html
├── compare.html
├── data/
│   └── laptops.json
├── css/
│   ├── input.css
│   └── output.css
└── js/
    ├── api.js
    ├── compare-page.js
    ├── compare.js
    ├── details.js
    ├── favorites.js
    ├── home.js
    ├── laptops.js
    ├── storage.js
    └── ui.js
```

## Browser Storage

The app stores user selections locally in the browser:

- `laptopFinderFavorites`: favorite laptop IDs.
- `laptopFinderCompare`: selected comparison laptop IDs.

Comparison is limited to four laptops, and only favorited laptops can be compared.

## Data

Laptop records are loaded from `src/data/laptops.json`. Each record includes its name, brand, price, category, specifications, image, and description.
