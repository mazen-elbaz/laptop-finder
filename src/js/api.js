export async function getLaptops() {
  try {
    const response = await fetch("./data/laptops.json");

    if (!response.ok) {
      throw new Error(
        `Request failed: ${response.status} ${response.statusText}`,
      );
    }

    const laptops = await response.json();

    if (!Array.isArray(laptops)) {
      throw new Error("The laptop data must be a JSON array.");
    }

    return laptops;
  } catch (error) {
    console.error("Could not load laptops:", error);
    throw error;
  }
}
