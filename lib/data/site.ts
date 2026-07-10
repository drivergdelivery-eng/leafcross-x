import { extractedAssets } from "./assets";

export const publicNav = [
  { label: "Home", href: "/" },
  { label: "Brands", href: "/brands" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Retailers", href: "/retailers" },
  { label: "B2B Clients", href: "/b2b-clients" },
  { label: "Subscription", href: "/subscription" },
  { label: "Contact", href: "/contact-us" }
];

export const removedLegacyPaths = [
  "/medical-patients",
  "/medical-patients-shop",
  "/veterans"
];

export const brands = [
  {
    name: "Allday",
    anchor: "Allday",
    logo: extractedAssets.brandLogos.allday,
    copy:
      "Approachable, consistent product presentation for everyday retail shelves."
  },
  {
    name: "Blk Addition",
    anchor: "Blk Addition",
    logo: extractedAssets.brandLogos.blackEdition,
    copy:
      "A sharper retail brand presence for curated product drops and premium menu placement."
  },
  {
    name: "Leaf Cross",
    anchor: "LeafCross",
    logo: extractedAssets.brandLogos.leafCross,
    copy:
      "Leaf Cross Biomedical's core product identity, rebuilt for approved retailer access only."
  }
];

export const paymentInstructions = {
  eTransfer: "Send E-Transfer payments to info@leafcross.com.",
  bankWire: "Bank wire details will be provided on the invoice or by admin.",
  directDeposit:
    "Direct deposit details will be provided on the invoice or by admin.",
  policy: "Payment must be received before shipment."
};

export const monthlySubscription = {
  title: "Monthly Retailer Subscription",
  summary:
    "Preserved from the current Leaf Cross site as a manual recurring retailer workflow, not an automatic card payment system.",
  cadence: "Monthly",
  payment:
    "Invoices use E-Transfer, Bank Wire, or Direct Deposit. Payment must be received before shipment.",
  adminHandling:
    "Admin or manager can review recurring orders, generate invoices, and pause or cancel subscriptions."
};

export const orderFinancialRules = {
  gstRate: 0.05,
  flatShipping: 28.99,
  invoiceFormatExample: "INV-2026-000001"
};
