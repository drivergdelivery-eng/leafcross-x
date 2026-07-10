import { extractedAssets } from "./assets";

export type RetailProduct = {
  name: string;
  slug: string;
  category: "Sativa" | "Indica" | "Hybrid" | "CBD";
  priceRange: string;
  status: "active" | "draft" | "private";
  image?: string;
};

export const retailerProducts: RetailProduct[] = [
  {
    name: "Grass Dance PR Lot SCC14481",
    slug: "grass-dance-pr-lot-scc14481",
    category: "Sativa",
    priceRange: "$102.36-$291.00",
    status: "active"
  },
  {
    name: "Super Lemon Haze",
    slug: "love-haze",
    category: "Sativa",
    priceRange: "$111.96-$15.00",
    status: "active"
  },
  {
    name: "Flawless Victory",
    slug: "flawless-vic",
    category: "Indica",
    priceRange: "$111.96",
    status: "active",
    image: extractedAssets.wordpress.flawlessVic
  },
  {
    name: "Sweet Gas",
    slug: "sweet-gas",
    category: "Hybrid",
    priceRange: "$12.24-$33.79",
    status: "active"
  },
  {
    name: "Pine Star",
    slug: "pine-star",
    category: "Hybrid",
    priceRange: "$12.50",
    status: "active"
  },
  {
    name: "Slaty Pink",
    slug: "slaty-pink",
    category: "Hybrid",
    priceRange: "$13.16-$37.93",
    status: "active"
  },
  {
    name: "Everyday Indica",
    slug: "everyday-indica",
    category: "Indica",
    priceRange: "$100.44",
    status: "active"
  },
  {
    name: "Jelly Bean",
    slug: "jelly-bean",
    category: "Hybrid",
    priceRange: "$12.59-$35.97",
    status: "active"
  },
  {
    name: "Sour Mango",
    slug: "sour-mango",
    category: "Hybrid",
    priceRange: "$111.95",
    status: "active"
  },
  {
    name: "Mandarin Sunset",
    slug: "mandarin-sunset",
    category: "Sativa",
    priceRange: "$13.22-$38.78",
    status: "active"
  },
  {
    name: "Hippie Vibes",
    slug: "hippie-vibes",
    category: "Sativa",
    priceRange: "$13.57-$38.79",
    status: "active"
  },
  {
    name: "Dream Catcher",
    slug: "dream-catcher",
    category: "Sativa",
    priceRange: "$13.34-$37.98",
    status: "active"
  },
  {
    name: "OG Kush x Sour Diesel",
    slug: "og-kush-x-sour-diesel-3",
    category: "Hybrid",
    priceRange: "Variable",
    status: "active",
    image: extractedAssets.wordpress.ogKushSourDiesel
  },
  {
    name: "Midnight Blueberry",
    slug: "midnight-blueberry",
    category: "Indica",
    priceRange: "Draft",
    status: "draft"
  },
  {
    name: "TOM FORD",
    slug: "tom-ford",
    category: "Indica",
    priceRange: "Draft",
    status: "draft"
  },
  {
    name: "Everyday CBD",
    slug: "everyday-cbd",
    category: "CBD",
    priceRange: "Private",
    status: "private"
  },
  {
    name: "Everyday Sativa",
    slug: "everyday-sativa",
    category: "Sativa",
    priceRange: "Private",
    status: "private"
  }
];

export const excludedMedicalProducts = [
  "Edibles",
  "Dried Cannabis",
  "Topicals",
  "Capsules",
  "Tinctures"
];
