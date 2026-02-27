export type Product = {
  id: string;
  name: string;
  house: string;
  category: "fresh" | "sweet";
  /** Base price for 5ml decant (RM) */
  price5ml: number;
  description: string;
  notes: string[];
  image: string; // path relative to /public
};

/** Price for a 10ml decant = price5ml * 2 - 1 */
export function getPrice10ml(price5ml: number): number {
  return price5ml * 2 - 1;
}

export const PRODUCTS: Product[] = [
  {
    id: "hawas-ice",
    name: "Hawas Ice",
    house: "Rasasi",
    category: "fresh",
    price5ml: 12,
    description: "A refreshing icy aquatic — clean, cool, and effortlessly magnetic.",
    notes: ["Bergamot", "Cardamom", "Sea Water", "Musk"],
    image: "/product/ice.jpeg",
  },
  {
    id: "rare-reef",
    name: "Rare Reef",
    house: "Afnan",
    category: "fresh",
    price5ml: 12,
    description: "An oceanic dive into sea salt, driftwood, and sheer aquatic musk.",
    notes: ["Sea Salt", "Aquatic", "Driftwood", "Musk"],
    image: "/product/rare reef.jpeg",
  },
  {
    id: "rey-edp",
    name: "Rey EDP",
    house: "Maison Asoor",
    category: "sweet",
    price5ml: 22,
    description: "A regal white floral oriental — powdery, noble, and unforgettable.",
    notes: ["Rose", "Iris", "Sandalwood", "Ambergris"],
    image: "/product/rey.webp",
  },
  {
    id: "supremacy-ce",
    name: "Supremacy Collector's Edition",
    house: "Afnan",
    category: "sweet",
    price5ml: 18,
    description: "Bold, smoky, and commanding — a collector's statement in every spray.",
    notes: ["Oud", "Smoke", "Vetiver", "Cedar"],
    image: "/product/sce.webp",
  },
  {
    id: "khamrah",
    name: "Khamrah",
    house: "Lattafa",
    category: "sweet",
    price5ml: 14,
    description: "An intoxicating oriental with warm amber, rich oud, and sweet vanilla — deeply addictive.",
    notes: ["Amber", "Oud", "Vanilla", "Musk", "Sandalwood"],
    image: "/product/khamrah-1772184752890.jpeg",
  },
];

/** Lookup a product by its ID — used by the booking API */
export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}
