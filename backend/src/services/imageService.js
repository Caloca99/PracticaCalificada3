const FALLBACK_IMAGE = "https://picsum.photos/seed/product-default/600/400";

export async function getProductImage(productName) {
  try {
    const response = await fetch("https://fakestoreapi.com/products?limit=20");

    if (!response.ok) {
      throw new Error("External API did not respond successfully");
    }

    const products = await response.json();
    const index = Math.abs(hashText(productName)) % products.length;
    return products[index]?.image || buildPicsumUrl(productName);
  } catch (_error) {
    return buildPicsumUrl(productName);
  }
}

function buildPicsumUrl(seed) {
  const cleanSeed = encodeURIComponent(seed || "product");
  return `https://picsum.photos/seed/${cleanSeed}/600/400`;
}

function hashText(text) {
  return [...text].reduce((hash, char) => hash + char.charCodeAt(0), 0);
}

export { FALLBACK_IMAGE };
