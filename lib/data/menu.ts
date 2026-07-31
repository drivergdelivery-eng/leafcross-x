export type ProductVariant = {
  size: string;        // "3.5g", "7g", "14g", "28g"
  sku: string;         // government-registered SKU per format
  price: number;       // price per unit at this size
  inventory?: number;  // units available for this size
  maxOrderQty?: number; // max units a retailer can order of this size
};

export type ProductStatus =
  | "Available"
  | "Sold Out"
  | "Running Out"
  | "Coming Soon"
  | "Dry/Curing"
  | "Harvesting"
  | "Flowering"
  | "Vegging";

export type MenuProduct = {
  slug: string;
  name: string;
  type: "Sativa" | "Indica" | "Hybrid" | "CBD";
  brand: string;
  image: string;
  images?: string[];
  sku?: string;
  price: number;          // price per unit
  pricePerCase?: number;  // price per case
  unit: string;           // unit size e.g. "3.5g"
  unitsPerCase?: number;  // units in a case
  inventory?: number;     // available units in stock
  maxOrderQty?: number;   // max units a retailer can order at once
  description?: string;
  packageSize?: string;   // free-form notes
  status?: ProductStatus;
  terpene1?: string;      // terpene name (matches terpeneList)
  terpene2?: string;
  terpene3?: string;
  thc?: string;           // e.g. "25%–30%" or "28%" or "Less than 1%"
  cbd?: string;
  cbg?: string;
  variants?: ProductVariant[];
};

export const statusConfig: Record<ProductStatus, { bg: string; color: string; label: string }> = {
  "Available":   { bg: "#4ade80", color: "#052e16", label: "Available"   },
  "Running Out": { bg: "#fb923c", color: "#431407", label: "Running Out" },
  "Sold Out":    { bg: "#f87171", color: "#450a0a", label: "Sold Out"    },
  "Coming Soon": { bg: "#60a5fa", color: "#172554", label: "Coming Soon" },
  "Dry/Curing":  { bg: "#fbbf24", color: "#451a03", label: "Dry / Curing"},
  "Harvesting":  { bg: "#a3e635", color: "#1a2e05", label: "Harvesting"  },
  "Flowering":   { bg: "#f472b6", color: "#500724", label: "Flowering"   },
  "Vegging":     { bg: "#2dd4bf", color: "#042f2e", label: "Vegging"     },
};

export const allStatuses: ProductStatus[] = [
  "Available", "Running Out", "Sold Out", "Coming Soon",
  "Dry/Curing", "Harvesting", "Flowering", "Vegging",
];

export const alldayProducts: MenuProduct[] = [
  { slug: "jelly-bean",       name: "Jelly Bean",       type: "Indica",  brand: "allday", image: "https://leafcross.com/wp-content/uploads/2024/04/INDICA-Jelly-Bean.jpg",       price: 12.59, pricePerCase: 302.16, unit: "3.5g", unitsPerCase: 24, inventory: 120, maxOrderQty: 48, status: "Available",   thc: "22%–26%",   cbd: "Less than 1%", cbg: "1%–2%",  terpene1: "Myrcene",       terpene2: "Linalool",     terpene3: "Caryophyllene" },
  { slug: "dream-catcher",    name: "Dream Catcher",    type: "Sativa",  brand: "allday", image: "https://leafcross.com/wp-content/uploads/2024/04/SATIVA-Dream-Catcher.jpg",    price: 13.34, pricePerCase: 320.16, unit: "3.5g", unitsPerCase: 24, inventory: 96,  maxOrderQty: 48, status: "Available",   thc: "24%–28%",   cbd: "Less than 1%", cbg: "1%",     terpene1: "Limonene",      terpene2: "Terpinolene",  terpene3: "Ocimene"       },
  { slug: "sweet-gas",        name: "Sweet Gas",        type: "Hybrid",  brand: "allday", image: "https://leafcross.com/wp-content/uploads/2024/04/HYBRID-Sweet-Gas.jpg",        price: 12.24, pricePerCase: 293.76, unit: "3.5g", unitsPerCase: 24, inventory: 8,   maxOrderQty: 24, status: "Running Out", thc: "20%–24%",   cbd: "Less than 1%", cbg: "1%–2%",  terpene1: "Caryophyllene", terpene2: "Myrcene",      terpene3: "Humulene"      },
  { slug: "grapefruit-skunk", name: "Grapefruit Skunk", type: "Sativa",  brand: "allday", image: "https://leafcross.com/wp-content/uploads/2024/04/SATIVA-Grapefruit-Skunk.jpg", price: 13.00, pricePerCase: 312.00, unit: "3.5g", unitsPerCase: 24, inventory: 72,  maxOrderQty: 48, status: "Available",   thc: "22%–27%",   cbd: "Less than 1%", cbg: "1%",     terpene1: "Limonene",      terpene2: "Pinene",       terpene3: "Ocimene"       },
  { slug: "lemon-haze",       name: "Lemon Haze",       type: "CBD",     brand: "allday", image: "https://leafcross.com/wp-content/uploads/2024/04/CBD-Lemon-Haze.jpg",          price: 11.50, pricePerCase: 276.00, unit: "3.5g", unitsPerCase: 24, inventory: 0,   maxOrderQty: 24, status: "Sold Out",    thc: "Less than 1%", cbd: "15%–18%",  cbg: "3%–4%",  terpene1: "Limonene",      terpene2: "Terpinolene"                             },
  { slug: "hippie-vibes",     name: "Hippie Vibes",     type: "Sativa",  brand: "allday", image: "https://leafcross.com/wp-content/uploads/2024/04/SATIVA-Hippie-Vibes.jpg",     price: 13.57, pricePerCase: 325.68, unit: "3.5g", unitsPerCase: 24, inventory: 144, maxOrderQty: 48, status: "Available",   thc: "25%–30%",   cbd: "Less than 1%", cbg: "1%–2%",  terpene1: "Terpinolene",   terpene2: "Limonene",     terpene3: "Myrcene"       },
  { slug: "pink-tingz",       name: "Pink Tingz",       type: "Hybrid",  brand: "allday", image: "https://leafcross.com/wp-content/uploads/2024/04/HYBRID-Pink-Tingz.jpg",       price: 12.80, pricePerCase: 307.20, unit: "3.5g", unitsPerCase: 24, inventory: 48,  maxOrderQty: 48, status: "Available",   thc: "21%–25%",   cbd: "Less than 1%", cbg: "1%",     terpene1: "Linalool",      terpene2: "Geraniol",     terpene3: "Bisabolol"     },
  { slug: "salty-pink",       name: "Salty Pink",       type: "Indica",  brand: "allday", image: "https://leafcross.com/wp-content/uploads/2024/04/INDICA-Salty-Pink.jpg",       price: 13.16, pricePerCase: 315.84, unit: "3.5g", unitsPerCase: 24, inventory: 60,  maxOrderQty: 48, status: "Available",   thc: "23%–27%",   cbd: "Less than 1%", cbg: "1%–2%",  terpene1: "Myrcene",       terpene2: "Linalool"                                  },
  { slug: "love-haze",        name: "Love Haze",        type: "Sativa",  brand: "allday", image: "https://leafcross.com/wp-content/uploads/2024/04/SATIVA-Love-Haze.jpg",        price: 12.99, pricePerCase: 311.76, unit: "3.5g", unitsPerCase: 24, inventory: 0,   maxOrderQty: 24, status: "Coming Soon",                                                                                                                            },
  { slug: "grape-soda",       name: "Grape Soda",       type: "Indica",  brand: "allday", image: "https://leafcross.com/wp-content/uploads/2024/04/INDICA-Grape-Soda.jpg",       price: 12.75, pricePerCase: 306.00, unit: "3.5g", unitsPerCase: 24, inventory: 84,  maxOrderQty: 48, status: "Available",   thc: "20%–24%",   cbd: "Less than 1%", cbg: "1%",     terpene1: "Myrcene",       terpene2: "Caryophyllene", terpene3: "Linalool"     },
  { slug: "mandarin-sunset",  name: "Mandarin Sunset",  type: "Sativa",  brand: "allday", image: "https://leafcross.com/wp-content/uploads/2024/04/SATIVA-Mandarin-Sunset.jpg",  price: 13.22, pricePerCase: 317.28, unit: "3.5g", unitsPerCase: 24, inventory: 108, maxOrderQty: 48, status: "Available",   thc: "24%–28%",   cbd: "Less than 1%", cbg: "1%–2%",  terpene1: "Valencene",     terpene2: "Limonene",     terpene3: "Ocimene"       },
  { slug: "flawless-victory", name: "Flawless Victory", type: "Indica",  brand: "allday", image: "https://leafcross.com/wp-content/uploads/2024/04/INDICA-Flawless-Victory.jpg", price: 14.00, pricePerCase: 336.00, unit: "3.5g", unitsPerCase: 24, inventory: 36,  maxOrderQty: 36, status: "Available",   thc: "26%–30%",   cbd: "Less than 1%", cbg: "2%–3%",  terpene1: "Caryophyllene", terpene2: "Humulene",     terpene3: "Pinene"        },
  { slug: "sour-mango",       name: "Sour Mango",       type: "Sativa",  brand: "allday", image: "https://leafcross.com/wp-content/uploads/2024/04/SATIVA-Sour-Mango.jpg",       price: 13.50, pricePerCase: 324.00, unit: "3.5g", unitsPerCase: 24, inventory: 0,   maxOrderQty: 24, status: "Dry/Curing"                                                                                                                              },
  { slug: "pine-star",        name: "Pine Star",        type: "Indica",  brand: "allday", image: "https://leafcross.com/wp-content/uploads/2024/04/INDICA-Pine-Star.jpg",        price: 12.50, pricePerCase: 300.00, unit: "3.5g", unitsPerCase: 24, inventory: 72,  maxOrderQty: 48, status: "Available",   thc: "21%–25%",   cbd: "Less than 1%", cbg: "1%–2%",  terpene1: "Pinene",        terpene2: "Myrcene",      terpene3: "Humulene"      },
];

export const blkProducts: MenuProduct[] = [
  { slug: "blk-gas-daddy",         name: "Gas Daddy",         type: "Indica", brand: "blk", image: "/assets/strains/gas-daddy.jpg",         price: 16.00, pricePerCase: 384.00, unit: "3.5g", unitsPerCase: 24, inventory: 96,  maxOrderQty: 48, status: "Available",   thc: "26%–30%",   cbd: "Less than 1%", cbg: "2%–3%",  terpene1: "Caryophyllene", terpene2: "Myrcene",     terpene3: "Humulene"      },
  { slug: "blk-slumber-party",     name: "Slumber Party",     type: "Indica", brand: "blk", image: "/assets/strains/slumber-party.jpg",     price: 16.50, pricePerCase: 396.00, unit: "3.5g", unitsPerCase: 24, inventory: 72,  maxOrderQty: 48, status: "Available",   thc: "24%–28%",   cbd: "Less than 1%", cbg: "1%–2%",  terpene1: "Myrcene",       terpene2: "Linalool",    terpene3: "Nerolidol"     },
  { slug: "blk-fx-3",              name: "FX 3",              type: "Hybrid", brand: "blk", image: "/assets/strains/fx-3.jpg",              price: 17.00, pricePerCase: 408.00, unit: "3.5g", unitsPerCase: 24, inventory: 6,   maxOrderQty: 24, status: "Running Out", thc: "27%–31%",   cbd: "Less than 1%", cbg: "1%",     terpene1: "Limonene",      terpene2: "Caryophyllene"                             },
  { slug: "blk-halle-berry",       name: "Halle Berry",       type: "Sativa", brand: "blk", image: "/assets/strains/halle-berry.jpg",       price: 16.00, pricePerCase: 384.00, unit: "3.5g", unitsPerCase: 24, inventory: 48,  maxOrderQty: 48, status: "Available",   thc: "22%–26%",   cbd: "Less than 1%", cbg: "1%–2%",  terpene1: "Terpinolene",   terpene2: "Ocimene",     terpene3: "Limonene"      },
  { slug: "blk-joker",             name: "Joker",             type: "Hybrid", brand: "blk", image: "/assets/strains/joker.jpg",             price: 17.50, pricePerCase: 420.00, unit: "3.5g", unitsPerCase: 24, inventory: 120, maxOrderQty: 48, status: "Available",   thc: "28%–33%",   cbd: "Less than 1%", cbg: "2%",     terpene1: "Caryophyllene", terpene2: "Pinene",      terpene3: "Myrcene"       },
  { slug: "blk-lemon-cherry-soap", name: "Lemon Cherry Soap", type: "Hybrid", brand: "blk", image: "/assets/strains/lemon-cherry-soap.jpg", price: 16.75, pricePerCase: 402.00, unit: "3.5g", unitsPerCase: 24, inventory: 0,   maxOrderQty: 24, status: "Flowering"                                                                                                                                                              },
  { slug: "blk-67",                name: "67",                type: "Indica", brand: "blk", image: "/assets/strains/67.jpg",                price: 15.50, pricePerCase: 372.00, unit: "3.5g", unitsPerCase: 24, inventory: 84,  maxOrderQty: 48, status: "Available",   thc: "24%–28%",   cbd: "Less than 1%", cbg: "1%–2%",  terpene1: "Myrcene",       terpene2: "Linalool",    terpene3: "Bisabolol"     },
  { slug: "blk-fx-1",              name: "FX 1",              type: "Hybrid", brand: "blk", image: "/assets/strains/fx-1.jpg",              price: 16.00, pricePerCase: 384.00, unit: "3.5g", unitsPerCase: 24, inventory: 60,  maxOrderQty: 48, status: "Available",   thc: "25%–29%",   cbd: "Less than 1%", cbg: "1%",     terpene1: "Limonene",      terpene2: "Ocimene",     terpene3: "Pinene"        },
  { slug: "blk-sunset-sherbert",   name: "Sunset Sherbert",   type: "Hybrid", brand: "blk", image: "/assets/strains/sunset-sherbert.jpg",   price: 17.00, pricePerCase: 408.00, unit: "3.5g", unitsPerCase: 24, inventory: 0,   maxOrderQty: 24, status: "Vegging"                                                                                                                                                                },
  { slug: "blk-abracadabra",       name: "Abracadabra",       type: "Sativa", brand: "blk", image: "/assets/strains/abracadabra.jpg",       price: 16.50, pricePerCase: 396.00, unit: "3.5g", unitsPerCase: 24, inventory: 108, maxOrderQty: 48, status: "Available",   thc: "23%–27%",   cbd: "Less than 1%", cbg: "1%–2%",  terpene1: "Terpinolene",   terpene2: "Limonene",    terpene3: "Ocimene"       },
  { slug: "blk-sunset-soap",       name: "Sunset Soap",       type: "Hybrid", brand: "blk", image: "/assets/strains/sunset-soap.jpg",       price: 16.25, pricePerCase: 390.00, unit: "3.5g", unitsPerCase: 24, inventory: 0,   maxOrderQty: 24, status: "Harvesting"                                                                                                                                                             },
  { slug: "blk-fx",                name: "FX",                type: "Sativa", brand: "blk", image: "/assets/strains/fx.jpg",                price: 15.75, pricePerCase: 378.00, unit: "3.5g", unitsPerCase: 24, inventory: 36,  maxOrderQty: 36, status: "Available",   thc: "26%–30%",   cbd: "Less than 1%", cbg: "2%–3%",  terpene1: "Pinene",        terpene2: "Humulene",    terpene3: "Caryophyllene" },
];

export const typeColors: Record<string, string> = {
  Sativa:  "#4ade80",
  Indica:  "#a78bfa",
  Hybrid:  "#60a5fa",
  CBD:     "#fbbf24",
};
