export type TabItem    = { title: string; body: string };
export type AboutItem  = { title: string; body: string; image: string };
export type ServiceCard= { title: string; body: string };
export type B2BReason  = { src: string; label: string };
export type B2BClientCard = { image: string; title: string };
export type B2BService = { title: string; body: string };

export type SiteContent = {
  // ── HEADER / FOOTER ────────────────────────────────────────────
  header: { logo: string; tagline: string };
  footer: { tagline: string };

  // ── HOMEPAGE ───────────────────────────────────────────────────
  heroVideo: string;
  heroLicense: string;
  heroCtaPrimary: string;
  heroCtaSecondary: string;
  brandCopies: { allday: string; blk: string; leafcross: string };

  // ── ABOUT ──────────────────────────────────────────────────────
  aboutSections: AboutItem[];
  facilityTitle: string;
  facilityLocation: string;
  facilityImages: string[];

  // ── BRANDS ─────────────────────────────────────────────────────
  alldayTagline: string;
  alldayBags: { src: string; label: string }[];
  blkBags: { src: string; label: string }[];
  alldayTabs: TabItem[];
  blkTabs: TabItem[];
  blkBody: string;
  brandCards: { logo: string; category: string }[];

  // ── SERVICES ───────────────────────────────────────────────────
  servicesHeroTitle: string;
  servicesHeroSubtitle: string;
  servicesHeroImage: string;
  servicesCards: ServiceCard[];

  // ── RETAILERS ─────────────────────────────────────────────────
  retailersNote: string;
  retailersLoginSubtitle: string;

  // ── B2B PAGE ──────────────────────────────────────────────────
  b2bHeroTitle: string;
  b2bHeroSubtitle: string;
  b2bServices: B2BService[];
  b2bWhyTitle: string;
  b2bReasons: B2BReason[];

  // ── B2B CLIENTS PAGE ──────────────────────────────────────────
  b2bClientsHeroTitle: string;
  b2bClientsHeroSubtitle: string;
  b2bClientsHeroImage: string;
  b2bClientCards: B2BClientCard[];
  b2bClientsExistingTitle: string;
  b2bClientsExistingBody: string;

  // ── CONTACT ───────────────────────────────────────────────────
  contactHeroTitle: string;
  contactHeroSubtitle: string;
  contactHeroImage: string;
  contactBodyText: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;

  // ── ABOUT TAGLINE (homepage) ──────────────────────────────────
  aboutTitle: string;
  aboutBody: string;
};

export const defaultSiteContent: SiteContent = {
  header: {
    logo: "/assets/extracted/leaf-cross-logo.png",
    tagline: "Health Canada Licensed Cannabis Processor",
  },
  footer: {
    tagline: "Health Canada licensed cannabis processor and retailer-only ordering partner in Nelson, BC.",
  },

  heroVideo: "/assets/extracted/home-clip.mp4",
  heroLicense: "Health Canada Licensed Cannabis Processor and Retailer Supply Partner Located in Nelson, BC",
  heroCtaPrimary: "Apply for retailer access",
  heroCtaSecondary: "View brands",
  brandCopies: {
    allday:    "Approachable, consistent product presentation for everyday retail shelves.",
    blk:       "A sharper retail brand presence for curated product drops and premium menu placement.",
    leafcross: "Leaf Cross Biomedical's core product identity, rebuilt for approved retailer access only.",
  },

  aboutSections: [
    {
      title: "VISION",
      body: "We envision a world where the power of cannabis is harnessed to foster well-being, healing, and joy.",
      image: "/assets/strains/gas-daddy.jpg",
    },
    {
      title: "MISSION",
      body: "Our mission is to ensure the highest-quality cannabis, rooted in care and craftsmanship, is shared with people worldwide by producing, curating, and distributing premium craft cannabis products.",
      image: "/assets/strains/halle-berry.jpg",
    },
    {
      title: "COLLABORATION",
      body: "We believe that collaboration is the key to unlocking the full potential of cannabis. By working together with experts, enthusiasts, and industry partners, we aim to create a collective force that drives innovation and progress.",
      image: "/assets/strains/joker.jpg",
    },
    {
      title: "COMMUNITY",
      body: "Leaf Cross Biomedical is more than a company; it's a community. We are dedicated to building connections and creating a supportive network for individuals who believe in the positive impact of cannabis.",
      image: "/assets/strains/fx-3.jpg",
    },
  ],
  facilityTitle: "Our Facility",
  facilityLocation: "Nelson, BC",
  facilityImages: [
    "/assets/grow/facility-new-4.jpg",
    "/assets/grow/facility-new-1.jpg",
    "/assets/grow/facility-new-3.jpg",
    "/assets/grow/facility-new-2.jpg",
    "/assets/grow/facility-new-5.jpg",
  ],

  alldayTagline: "Join us — Allday Cannabis, where community, quality, and fun come together in every puff",
  alldayBags: [
    { src: "https://leafcross.com/wp-content/uploads/2024/05/pink.svg",   label: "Sativa" },
    { src: "https://leafcross.com/wp-content/uploads/2024/05/purple.svg", label: "Indica" },
    { src: "https://leafcross.com/wp-content/uploads/2024/05/green.svg",  label: "Hybrid" },
    { src: "https://leafcross.com/wp-content/uploads/2024/05/blue.svg",   label: "CBD"    },
  ],
  blkBags: [
    { src: "https://leafcross.com/wp-content/uploads/2024/05/black-11.svg", label: "Sativa" },
    { src: "https://leafcross.com/wp-content/uploads/2024/05/black.svg",    label: "Indica" },
    { src: "https://leafcross.com/wp-content/uploads/2024/05/black-3.svg",  label: "Hybrid" },
    { src: "https://leafcross.com/wp-content/uploads/2024/05/black-4.svg",  label: "CBD"    },
  ],
  alldayTabs: [
    { title: "Community Focus", body: "We champion small craft growers in British Columbia, promoting community and raising awareness for BC craft cannabis." },
    { title: "Fun and Vibrant", body: "Allday is not just a brand; it's a celebration. We embody the joy and love of the cannabis community, making every experience vibrant and fun." },
    { title: "High-Quality, Affordable Cannabis", body: "Quality without compromise. Allday brings you top-notch products at prices that won't break the bank." },
    { title: "For Connoisseurs and Beyond", body: "Calling all cannabis connoisseurs! Explore unique strains, mix, and match to create personalized profiles and blends." },
  ],
  blkTabs: [
    { title: "Unique Cultivars", body: "We are dedicated to sharing unique genetics with the world. Our in-house breeding program is constantly evolving, driven by a relentless pursuit of new and unique cultivars." },
    { title: "Innovation", body: "Our commitment to sustainability drives us to embrace cutting-edge technologies. By integrating advanced scientific methods, modern technology, and sustainable agricultural practices, we strive to minimize our carbon footprint while cultivating premium cannabis." },
    { title: "Premium Craft", body: "Each strain we introduce undergoes a meticulous selection process. Through extensive phenotyping, we pinpoint the ideal phenotype that meets our high standards — bold flavors, ideal bud structure, and rich trichomes." },
    { title: "Smokes Smooth", body: "We take the curing process to the next level with our cold, slow curing technique, extending over a minimum of 20 days. This meticulous process ensures that each batch maintains the perfect moisture content, resulting in a smooth, consistent smoke every time." },
  ],
  blkBody: "At Allday Black Edition, we redefine cultivation with a blend of cutting-edge technology and hands-on craftsmanship. Our focus on efficiency, sustainability, and precision creates a perfect environment for growing. We're committed to discovering and nurturing unique cultivars, allowing each plant to express its full potential.",
  brandCards: [
    { logo: "/assets/extracted/allday-logo.svg",          category: "Community Genetics" },
    { logo: "/assets/extracted/black-edition-logo.svg",   category: "In-House Genetics"  },
    { logo: "/assets/extracted/leafcross-brand-logo.svg", category: "Medical"            },
  ],

  servicesHeroTitle: "What We Do",
  servicesHeroSubtitle: "Retailer support, processing coordination, wholesale ordering, and shipment workflows.",
  servicesHeroImage: "/assets/wordpress/Home_Card_Services.png",
  servicesCards: [
    { title: "Product Management", body: "Admin and manager users can safely manage products, brands, prices, and availability." },
    { title: "Retailer Access",    body: "Retailers apply, get reviewed, and access private menu content only after approval." },
    { title: "Order Review",       body: "Orders are submitted as B2B requests, then reviewed before payment and shipment." },
    { title: "Sales Support",      body: "Payment instructions, invoices, and order status updates are handled in one portal." },
  ],

  retailersNote: "We have NO case limit per SKU. We reserve the right to cancel your order if payment is not received within 48 hours. To ensure shipping the same day, all payments must be received before 11am, or else it will be processed on the next business day. All sales are final.",
  retailersLoginSubtitle: "Already an approved retailer? Log in to access your private menu, cart, and order history.",

  b2bHeroTitle: "B2B Clients",
  b2bHeroSubtitle: "What We Offer",
  b2bServices: [
    {
      title: "In-House Distribution",
      body: "Take advantage of our in-house BC direct delivery portal, where clients can tap into our dedicated sales and marketing teams. Our portal provides a convenient platform for selling your products, allowing you to reach a wider audience while benefiting from the expertise of our seasoned professionals.",
    },
    {
      title: "Procurement Services",
      body: "At Leaf Cross Biomed, we understand the importance of quality cannabis materials. Our procurement services cover everything from bulk-dried cannabis to extracts and finished products. Leveraging our extensive network, we assist both domestic and international clients in procuring top-tier materials in Canada.",
    },
    {
      title: "Contract Manufacturing",
      body: "Discover the seamless efficiency of Contract Manufacturing, where we provide end-to-end solutions through our vertically integrated partners. From processing dried cannabis, pre-rolls, extracts, beverages, vapes, tinctures, to capsules, we offer a comprehensive range of services.",
    },
    {
      title: "Tolling Services",
      body: "Leaf Cross Biomed provides excise stamping and tolling services to domestic clients, facilitating distribution to provincial distributors. Additionally, we extend our tolling services to international clients, streamlining the export process for both domestic and global markets.",
    },
  ],
  b2bWhyTitle: "Why Work With Us",
  b2bReasons: [
    { src: "https://leafcross.com/wp-content/uploads/2024/05/file-removebg-preview.png", label: "Access to Premium Craft Cannabis" },
    { src: "https://leafcross.com/wp-content/uploads/2024/05/2-removebg-preview.png",    label: "Trusted Industry Experience" },
    { src: "https://leafcross.com/wp-content/uploads/2024/05/3-removebg-preview.png",    label: "Distribution Network" },
    { src: "https://leafcross.com/wp-content/uploads/2024/05/4-removebg-preview.png",    label: "Speed to Market" },
  ],

  b2bClientsHeroTitle: "What We Offer",
  b2bClientsHeroSubtitle: "Premium craft cannabis access, industry experience, distribution support, and speed to market.",
  b2bClientsHeroImage: "/assets/wordpress/B2B_Hero.png",
  b2bClientCards: [
    { image: "/assets/wordpress/B2B_Icon_2.png",    title: "Access to Premium Craft Cannabis" },
    { image: "/assets/wordpress/B2B_Icon_3.png",    title: "Trusted Industry Experience" },
    { image: "/assets/wordpress/B2B_Icon_4.png",    title: "Distribution Network" },
    { image: "/assets/wordpress/B2B_Icon_file.png", title: "Speed to Market" },
  ],
  b2bClientsExistingTitle: "Manual import, no stale accounts",
  b2bClientsExistingBody: "Existing accounts will not be blindly migrated from WordPress. Admin or manager users can manually create only active retailer accounts in the new system.",

  contactHeroTitle: "Get in Touch",
  contactHeroSubtitle: "Retailer inquiries, account questions, and payment confirmation support.",
  contactHeroImage: "/assets/wordpress/About_DSCF0726_LEAF.jpg",
  contactBodyText: "Retailer inquiries, payment confirmation, and account questions can be routed through the new admin dashboard.",
  contactEmail: "info@leafcross.com",
  contactPhone: "1-800-LEAFCROSS",
  contactAddress: "Nelson, BC, Canada",

  aboutTitle: "Rooted in craft. Grown with purpose.",
  aboutBody: "Leaf Cross Biomedical is a Health Canada licensed cannabis processor based in Nelson, BC, committed to delivering premium craft cannabis to licensed retailers across British Columbia.",
};
