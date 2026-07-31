export type TabItem     = { title: string; body: string };
export type ServiceCard = { title: string; body: string };
export type B2BReason   = { src: string; label: string };
export type B2BService  = { title: string; body: string };
export type PhaseItem   = { src: string; phase: string; label: string; desc: string };
export type StrainItem  = { src: string; name: string };
export type BrandItem   = { name: string; tagline: string; logo: string; accent: string; href: string };
export type CraftIcon   = { src: string; alt: string };

export type SiteContent = {
  // ── HEADER / FOOTER ───────────────────────────────────────────
  header:  { logo: string };
  footer:  { tagline: string };

  // ── HOMEPAGE — HERO ───────────────────────────────────────────
  heroLicense:      string;
  heroCtaPrimary:   string;
  heroCtaSecondary: string;

  // ── HOMEPAGE — CRAFT PROCESS ──────────────────────────────────
  craftEyebrow: string;
  craftTitle:   string;
  craftIcons:   CraftIcon[];

  // ── HOMEPAGE — PHENO HUNT GALLERY ─────────────────────────────
  phenoGalleryEyebrow: string;
  phenoGalleryTitle:   string;
  phenoGalleryDesc:    string;
  phenoStrains:        StrainItem[];

  // ── HOMEPAGE — PHILOSOPHY / PHENO HUNT ────────────────────────
  phenoHuntTitle:  string;
  phenoHuntBody:   string;
  phenoHuntCta:    string;
  partnerTitle:    string;
  partnerBody:     string;
  partnerCta:      string;

  // ── HOMEPAGE — BRAND CARDS ────────────────────────────────────
  brandsEyebrow: string;
  brandsTitle:   string;
  homeBrands:    BrandItem[];

  // ── HOMEPAGE — GROW SLIDESHOW ─────────────────────────────────
  growEyebrow: string;
  growTitle:   string;
  growDesc:    string;
  growSlides:  string[];

  // ── ABOUT PAGE ────────────────────────────────────────────────
  aboutHeroImage:    string;
  aboutHeroTitle:    string;
  aboutHeroSubtitle: string;

  aboutPhases: PhaseItem[];

  aboutWhoImage:  string;
  aboutWhoTitle:  string;
  aboutWhoBody1:  string;
  aboutWhoBody2:  string;

  aboutStandardsImage:  string;
  aboutStandardsTitle:  string;
  aboutStandardsBody1:  string;
  aboutStandardsBody2:  string;

  aboutPartnerImage:  string;
  aboutPartnerTitle:  string;
  aboutPartnerBody1:  string;
  aboutPartnerBody2:  string;

  // ── SERVICES PAGE ─────────────────────────────────────────────
  servicesHeroImage:    string;
  servicesHeroTitle:    string;
  servicesHeroSubtitle: string;
  servicesCards:        ServiceCard[];

  // ── RETAILERS PAGE ────────────────────────────────────────────
  retailersNote:          string;
  retailersLoginSubtitle: string;

  // ── B2B PAGE ──────────────────────────────────────────────────
  b2bHeroTitle:    string;
  b2bHeroSubtitle: string;
  b2bServices:     B2BService[];
  b2bWhyTitle:     string;
  b2bReasons:      B2BReason[];

  // ── CONTACT PAGE ──────────────────────────────────────────────
  contactHeroImage:    string;
  contactHeroTitle:    string;
  contactHeroSubtitle: string;
  contactBodyText:     string;
  contactEmail:        string;
  contactPhone:        string;
  contactAddress:      string;
};

export const defaultSiteContent: SiteContent = {
  header: { logo: "/assets/extracted/hero-frame.png" },
  footer: { tagline: "Health Canada licensed cannabis processor and retailer-only ordering partner in Nelson, BC." },

  // Homepage hero
  heroLicense:      "Health Canada Licensed Micro Cannabis Cultivator and Processor",
  heroCtaPrimary:   "Apply to become a retail partner",
  heroCtaSecondary: "View brands",

  // Homepage craft process
  craftEyebrow: "Our Craft Process",
  craftTitle:   "Small Batch. No Shortcuts.",
  craftIcons: [
    { src: "/icons/grown-with-love.png", alt: "Grown with Love"  },
    { src: "/icons/small-batches.png",   alt: "Small Batches"    },
    { src: "/icons/hand-trimmed.png",    alt: "Hand Trimmed"     },
    { src: "/icons/hang-dry.png",        alt: "Hang Dry"         },
    { src: "/icons/cure-30-days.png",    alt: "Cure for 30 Days" },
  ],

  // Homepage pheno gallery
  phenoGalleryEyebrow: "In The Garden",
  phenoGalleryTitle:   "Pheno Hunt",
  phenoGalleryDesc:    "We grow dozens of phenotypes to select only the best expression of each cultivar.",
  phenoStrains: [
    { src: "/assets/strains/gas-daddy.jpg",         name: "Gas Daddy"          },
    { src: "/assets/strains/halle-berry.jpg",       name: "Halle Berry"        },
    { src: "/assets/grow/bud-close-1.jpg",          name: ""                   },
    { src: "/assets/strains/joker.jpg",             name: "Joker"              },
    { src: "/assets/strains/lemon-cherry-soap.jpg", name: "Lemon Cherry Soap"  },
    { src: "/assets/strains/slumber-party.jpg",     name: "Slumber Party"      },
    { src: "/assets/grow/bud-close-2.jpg",          name: ""                   },
    { src: "/assets/strains/sunset-sherbert.jpg",   name: "Sunset Sherbert"    },
    { src: "/assets/strains/sunset-soap.jpg",       name: "Sunset Soap"        },
    { src: "/assets/strains/abracadabra.jpg",       name: "Abracadabra"        },
    { src: "/assets/grow/bud-close-3.jpg",          name: ""                   },
    { src: "/assets/strains/67.jpg",                name: "#67"                },
    { src: "/assets/strains/fx.jpg",                name: "FX"                 },
    { src: "/assets/strains/fx-1.jpg",              name: "FX — Select 1"      },
    { src: "/assets/strains/fx-3.jpg",              name: "FX — Select 3"      },
  ],

  // Homepage philosophy
  phenoHuntTitle: "Why Pheno Hunt",
  phenoHuntBody:  "Every seed has the potential to express itself differently, even when it's from the same genetic cross. Through pheno hunting, we grow and evaluate many plants to discover the exceptional few.\n\nWe select each cultivar for its terpene profile, flavour, aroma, appearance, smoking experience, and overall effect—not just how it looks in the bag. Our goal is to find genetics that deliver the complete cannabis experience, from first impression to the final exhale.\n\nMany of our pheno hunt selections are released as small-batch drops through our retail partners, allowing us to gather real-world feedback from budtenders and consumers before selecting the cultivars that become part of our long-term lineup. This collaborative approach helps ensure we're commercializing genetics that people genuinely enjoy—not just the ones we choose internally.\n\nBy combining careful selection with real customer feedback, we develop distinctive flower that helps our partners stand out and keeps customers coming back.",
  phenoHuntCta:   "Discover Our Process",
  partnerTitle:   "Let's Help Each Other Stand Out",
  partnerBody:    "We're passionate about partnering with retailers who appreciate premium craft cannabis, unique genetics, and products with a story. Together, we can bring distinctive cultivars to your shelves and create memorable experiences for your customers.",
  partnerCta:     "Become a Retail Partner",

  // Homepage brand cards
  brandsEyebrow: "Exclusive to Our Network",
  brandsTitle:   "Brand Releases",
  homeBrands: [
    { name: "All Day Cannabis",          tagline: "Everyday craft. Uncompromising quality.", logo: "/logos/allday-logo-new.png",         accent: "#00f6ff", href: "/brands#allday" },
    { name: "Nelson Craft Cannabis",     tagline: "Rooted in the Kootenays.",                logo: "/logos/nelson-craft-logo-new.png",   accent: "#a78bfa", href: "/brands"        },
    { name: "GC Exotics",               tagline: "Rare genetics. Elevated experiences.",     logo: "/logos/gc-exotics-logo-new.png",     accent: "#f59e0b", href: "/brands"        },
    { name: "Haida Gwaii Craft Cannabis",tagline: "Island-grown. Pristine terroir.",         logo: "/logos/haida-gwaii-logo.jpg",   accent: "#f5c842", href: "/brands"        },
  ],

  // Homepage grow slideshow
  growEyebrow: "Our Grow",
  growTitle:   "From the Facility",
  growDesc:    "Double-tier cultivation rooms, in-house genetics, and hands-on attention at every stage of the grow.",
  growSlides: [
    "/assets/grow/facility-photo-1.jpg",
    "/assets/grow/facility-photo-2.jpg",
    "/assets/grow/facility-photo-3.jpg",
    "/assets/grow/facility-photo-4.jpg",
    "/assets/grow/facility-photo-5.jpg",
    "/assets/grow/facility-photo-6.jpg",
    "/assets/grow/facility-photo-7.jpg",
    "/assets/grow/facility-photo-8.jpg",
    "/assets/grow/facility-photo-9.jpg",
    "/assets/grow/facility-photo-10.jpg",
  ],

  // About page
  aboutHeroImage:    "/assets/grow/facility-wide-2.jpg",
  aboutHeroTitle:    "Built for Partnership",
  aboutHeroSubtitle: "A licensed micro-cultivator and processor dedicated to producing premium craft cannabis — built from the ground up with our partners in mind.",

  aboutPhases: [
    { src: "/assets/grow/bud-close-2.jpg", phase: "Phase 1", label: "Early Flower",   desc: "Structure forms, pistils push through" },
    { src: "/assets/grow/bud-close-3.jpg", phase: "Phase 2", label: "Mid Flower",     desc: "Density builds, terpenes develop" },
    { src: "/assets/grow/bud-close-1.jpg", phase: "Phase 3", label: "Harvest Ready",  desc: "Peak trichome expression" },
  ],

  aboutWhoImage:  "/assets/grow/grow-room-person.jpg",
  aboutWhoTitle:  "Everything Begins With the Consumer",
  aboutWhoBody1:  "Leaf Cross is a licensed micro-cultivator and processor dedicated to producing premium craft cannabis. Everything we do begins with the consumer. From pheno hunting and cultivation to curing and the final smoking experience, our focus is on creating flower that delivers exceptional flavour, terpene expression, and memorable effects.",
  aboutWhoBody2:  "Our cultivation combines modern technology with traditional craftsmanship. We grow indoors under LED lighting in a highly controlled environment, using automated irrigation and coco coir to promote consistent, healthy plant growth.",

  aboutStandardsImage:  "/assets/grow/standards-grow-room.jpg",
  aboutStandardsTitle:  "Quality Starts With Clean Cultivation",
  aboutStandardsBody1:  "We believe quality starts with clean cultivation. That's why we maintain rigorous sanitation standards and use beneficial insects as part of our biological pest management program, minimizing the need for sprays whenever possible.",
  aboutStandardsBody2:  "Every harvest is hand-trimmed, hang-dried, and slowly cold-cured for approximately 30 days to preserve the character of each cultivar. From seed selection to the final cure, every step is guided by our commitment to producing distinctive craft cannabis.",

  aboutPartnerImage:  "/assets/grow/facility-wide-1.jpg",
  aboutPartnerTitle:  "A Stronger Industry Through Collaboration",
  aboutPartnerBody1:  "We believe a stronger cannabis industry is built through collaboration. Every part of the supply chain — from breeders, cultivators, processors, and brands to distributors, retailers, and budtenders — plays an important role in delivering exceptional products to consumers.",
  aboutPartnerBody2:  "We're always excited to connect with like-minded people who share our passion for quality, innovation, and craftsmanship. Whether you're a brand, retailer, distributor, cultivator, or another industry partner, we'd love to hear from you and explore how we can create something meaningful together.",

  // Services page
  servicesHeroImage:    "/assets/wordpress/Home_Card_Services.png",
  servicesHeroTitle:    "What We Do",
  servicesHeroSubtitle: "Retailer support, processing coordination, wholesale ordering, and shipment workflows.",
  servicesCards: [
    { title: "Product Management", body: "Admin and manager users can safely manage products, brands, prices, and availability." },
    { title: "Retailer Access",    body: "Retailers apply, get reviewed, and access private menu content only after approval." },
    { title: "Order Review",       body: "Orders are submitted as B2B requests, then reviewed before payment and shipment." },
    { title: "Sales Support",      body: "Payment instructions, invoices, and order status updates are handled in one portal." },
  ],

  // Retailers page
  retailersNote:          "We have NO case limit per SKU. We reserve the right to cancel your order if payment is not received within 48 hours. To ensure shipping the same day, all payments must be received before 11am, or else it will be processed on the next business day. All sales are final.",
  retailersLoginSubtitle: "Already an approved retailer? Log in to access your private menu, cart, and order history.",

  // B2B page
  b2bHeroTitle:    "B2B Clients",
  b2bHeroSubtitle: "What We Offer",
  b2bServices: [
    { title: "In-House Distribution",   body: "Take advantage of our in-house BC direct delivery portal, where clients can tap into our dedicated sales and marketing teams. Our portal provides a convenient platform for selling your products, allowing you to reach a wider audience while benefiting from the expertise of our seasoned professionals." },
    { title: "Procurement Services",    body: "At Leaf Cross Biomed, we understand the importance of quality cannabis materials. Our procurement services cover everything from bulk-dried cannabis to extracts and finished products. Leveraging our extensive network, we assist both domestic and international clients in procuring top-tier materials in Canada." },
    { title: "Contract Manufacturing",  body: "Discover the seamless efficiency of Contract Manufacturing, where we provide end-to-end solutions through our vertically integrated partners. From processing dried cannabis, pre-rolls, extracts, beverages, vapes, tinctures, to capsules, we offer a comprehensive range of services." },
    { title: "Tolling Services",        body: "Leaf Cross Biomed provides excise stamping and tolling services to domestic clients, facilitating distribution to provincial distributors. Additionally, we extend our tolling services to international clients, streamlining the export process for both domestic and global markets." },
  ],
  b2bWhyTitle: "Why Work With Us",
  b2bReasons: [
    { src: "https://leafcross.com/wp-content/uploads/2024/05/file-removebg-preview.png", label: "Access to Premium Craft Cannabis" },
    { src: "https://leafcross.com/wp-content/uploads/2024/05/2-removebg-preview.png",    label: "Trusted Industry Experience" },
    { src: "https://leafcross.com/wp-content/uploads/2024/05/3-removebg-preview.png",    label: "Distribution Network" },
    { src: "https://leafcross.com/wp-content/uploads/2024/05/4-removebg-preview.png",    label: "Speed to Market" },
  ],

  // Contact page
  contactHeroImage:    "/assets/wordpress/About_DSCF0726_LEAF.jpg",
  contactHeroTitle:    "Get in Touch",
  contactHeroSubtitle: "Retailer inquiries, account questions, and payment confirmation support.",
  contactBodyText:     "Retailer inquiries, account questions, and payment confirmation support. Bulk Sale, Retail Partner and Marketing Inquiries.",
  contactEmail:        "info@leafcross.com",
  contactPhone:        "1-800-LEAFCROSS",
  contactAddress:      "Nelson, BC, Canada",
};
