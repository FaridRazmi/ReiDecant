export interface Product {
  id: string;
  name: string;
  price: number;
  category: "niche" | "aquatic" | "oud" | "designer";
  description: string;
}

export const PRODUCTS: Product[] = [
  // ── Niche Originals ──
  {
    id: "Rare-Reef-10ml",
    name: "Rare Reef – 10ml Decant",
    price: 30,
    category: "Fresh",
    description: "Fresh · Citrus · Musk",
  },
  {
    id: "Rare-Reef-5ml",
    name: "Rare Reef – 5ml Decant",
    price:16,
    category: "Fresh",
    description: "Fresh · Citrus · Musk",
  },
  {
    id: "Sce-10ml",
    name: "Afnan Supremacy Collector Edition 10ml Decant",
    price: 45,
    category: "Fresh",
    description: "Afnan Supremacy Collector Edition",
  },
  {
    id: "Sce-5ml",
    name: "Afnan Supremacy Collector Edition 5ml Decant",
    price: 25,
    category: "Fresh",
    description: "Afnan Supremacy Collector Edition",
  },

  {
    id: "Rey-5ml",
    name: "Rey Maison Asrar 5ml Decant",
    price: 17,
    category: "oud",
    description: "Dupe of YSL Myself",
  },

  {
    id: "Rey-10ml",
    name: "Rey Maison Asrar 10ml Decant",
    price: 30,
    category: "oud",
    description: "Dupe of YSL Myself",
  },
  
];

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function getProductsByCategory(category: string): Product[] {
  return PRODUCTS.filter((p) => p.category === category);
}
