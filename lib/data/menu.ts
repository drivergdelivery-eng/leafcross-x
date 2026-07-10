export type MenuProduct = {
  slug: string;
  name: string;
  type: "Sativa" | "Indica" | "Hybrid" | "CBD";
  brand: "allday" | "blk";
  image: string;
  price: number;
  unit: string;
  description?: string;
  packageSize?: string;
};

export const alldayProducts: MenuProduct[] = [
  { slug: "jelly-bean",       name: "Jelly Bean",       type: "Indica",  brand: "allday", image: "https://leafcross.com/wp-content/uploads/2024/04/INDICA-Jelly-Bean.jpg",       price: 12.59, unit: "3.5g" },
  { slug: "dream-catcher",    name: "Dream Catcher",    type: "Sativa",  brand: "allday", image: "https://leafcross.com/wp-content/uploads/2024/04/SATIVA-Dream-Catcher.jpg",    price: 13.34, unit: "3.5g" },
  { slug: "sweet-gas",        name: "Sweet Gas",        type: "Hybrid",  brand: "allday", image: "https://leafcross.com/wp-content/uploads/2024/04/HYBRID-Sweet-Gas.jpg",        price: 12.24, unit: "3.5g" },
  { slug: "grapefruit-skunk", name: "Grapefruit Skunk", type: "Sativa",  brand: "allday", image: "https://leafcross.com/wp-content/uploads/2024/04/SATIVA-Grapefruit-Skunk.jpg", price: 13.00, unit: "3.5g" },
  { slug: "lemon-haze",       name: "Lemon Haze",       type: "CBD",     brand: "allday", image: "https://leafcross.com/wp-content/uploads/2024/04/CBD-Lemon-Haze.jpg",          price: 11.50, unit: "3.5g" },
  { slug: "hippie-vibes",     name: "Hippie Vibes",     type: "Sativa",  brand: "allday", image: "https://leafcross.com/wp-content/uploads/2024/04/SATIVA-Hippie-Vibes.jpg",     price: 13.57, unit: "3.5g" },
  { slug: "pink-tingz",       name: "Pink Tingz",       type: "Hybrid",  brand: "allday", image: "https://leafcross.com/wp-content/uploads/2024/04/HYBRID-Pink-Tingz.jpg",       price: 12.80, unit: "3.5g" },
  { slug: "salty-pink",       name: "Salty Pink",       type: "Indica",  brand: "allday", image: "https://leafcross.com/wp-content/uploads/2024/04/INDICA-Salty-Pink.jpg",       price: 13.16, unit: "3.5g" },
  { slug: "love-haze",        name: "Love Haze",        type: "Sativa",  brand: "allday", image: "https://leafcross.com/wp-content/uploads/2024/04/SATIVA-Love-Haze.jpg",        price: 12.99, unit: "3.5g" },
  { slug: "grape-soda",       name: "Grape Soda",       type: "Indica",  brand: "allday", image: "https://leafcross.com/wp-content/uploads/2024/04/INDICA-Grape-Soda.jpg",       price: 12.75, unit: "3.5g" },
  { slug: "mandarin-sunset",  name: "Mandarin Sunset",  type: "Sativa",  brand: "allday", image: "https://leafcross.com/wp-content/uploads/2024/04/SATIVA-Mandarin-Sunset.jpg",  price: 13.22, unit: "3.5g" },
  { slug: "flawless-victory", name: "Flawless Victory", type: "Indica",  brand: "allday", image: "https://leafcross.com/wp-content/uploads/2024/04/INDICA-Flawless-Victory.jpg", price: 14.00, unit: "3.5g" },
  { slug: "sour-mango",       name: "Sour Mango",       type: "Sativa",  brand: "allday", image: "https://leafcross.com/wp-content/uploads/2024/04/SATIVA-Sour-Mango.jpg",       price: 13.50, unit: "3.5g" },
  { slug: "pine-star",        name: "Pine Star",        type: "Indica",  brand: "allday", image: "https://leafcross.com/wp-content/uploads/2024/04/INDICA-Pine-Star.jpg",        price: 12.50, unit: "3.5g" },
];

export const blkProducts: MenuProduct[] = [
  { slug: "blk-gas-daddy",         name: "Gas Daddy",         type: "Indica", brand: "blk", image: "/assets/strains/gas-daddy.jpg",         price: 16.00, unit: "3.5g" },
  { slug: "blk-slumber-party",     name: "Slumber Party",     type: "Indica", brand: "blk", image: "/assets/strains/slumber-party.jpg",     price: 16.50, unit: "3.5g" },
  { slug: "blk-fx-3",              name: "FX 3",              type: "Hybrid", brand: "blk", image: "/assets/strains/fx-3.jpg",              price: 17.00, unit: "3.5g" },
  { slug: "blk-halle-berry",       name: "Halle Berry",       type: "Sativa", brand: "blk", image: "/assets/strains/halle-berry.jpg",       price: 16.00, unit: "3.5g" },
  { slug: "blk-joker",             name: "Joker",             type: "Hybrid", brand: "blk", image: "/assets/strains/joker.jpg",             price: 17.50, unit: "3.5g" },
  { slug: "blk-lemon-cherry-soap", name: "Lemon Cherry Soap", type: "Hybrid", brand: "blk", image: "/assets/strains/lemon-cherry-soap.jpg", price: 16.75, unit: "3.5g" },
  { slug: "blk-67",                name: "67",                type: "Indica", brand: "blk", image: "/assets/strains/67.jpg",                price: 15.50, unit: "3.5g" },
  { slug: "blk-fx-1",              name: "FX 1",              type: "Hybrid", brand: "blk", image: "/assets/strains/fx-1.jpg",              price: 16.00, unit: "3.5g" },
  { slug: "blk-sunset-sherbert",   name: "Sunset Sherbert",   type: "Hybrid", brand: "blk", image: "/assets/strains/sunset-sherbert.jpg",   price: 17.00, unit: "3.5g" },
  { slug: "blk-abracadabra",       name: "Abracadabra",       type: "Sativa", brand: "blk", image: "/assets/strains/abracadabra.jpg",       price: 16.50, unit: "3.5g" },
  { slug: "blk-sunset-soap",       name: "Sunset Soap",       type: "Hybrid", brand: "blk", image: "/assets/strains/sunset-soap.jpg",       price: 16.25, unit: "3.5g" },
  { slug: "blk-fx",                name: "FX",                type: "Sativa", brand: "blk", image: "/assets/strains/fx.jpg",                price: 15.75, unit: "3.5g" },
];

export const typeColors: Record<string, string> = {
  Sativa:  "#4ade80",
  Indica:  "#a78bfa",
  Hybrid:  "#60a5fa",
  CBD:     "#fbbf24",
};
