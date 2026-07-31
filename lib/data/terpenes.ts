export type Terpene = {
  name: string;
  description: string;
  aroma: string;
  color: string; // badge accent color
};

export const terpeneList: Terpene[] = [
  {
    name: "Myrcene",
    aroma: "Earthy · Musky · Fruity",
    description: "The most abundant terpene in cannabis. Promotes relaxation, enhances the sedating effects of THC, and may help with sleep.",
    color: "#86efac",
  },
  {
    name: "Limonene",
    aroma: "Citrus · Lemon · Fresh",
    description: "Uplifting and mood-enhancing. Known for stress relief and anti-anxiety effects. Common in citrus-forward strains.",
    color: "#fde68a",
  },
  {
    name: "Caryophyllene",
    aroma: "Spicy · Peppery · Woody",
    description: "The only terpene that directly activates cannabinoid receptors (CB2). Anti-inflammatory and may help with pain relief.",
    color: "#fdba74",
  },
  {
    name: "Linalool",
    aroma: "Floral · Lavender · Sweet",
    description: "Best known from lavender. Calming, anxiety-reducing, and may have analgesic properties. Promotes restful sleep.",
    color: "#c4b5fd",
  },
  {
    name: "Pinene",
    aroma: "Pine · Fresh · Herbal",
    description: "Promotes alertness and memory retention. May counteract some short-term memory effects of THC. Anti-inflammatory.",
    color: "#6ee7b7",
  },
  {
    name: "Humulene",
    aroma: "Hoppy · Earthy · Woody",
    description: "Shares its profile with hops in beer. Known for appetite-suppressing effects and anti-inflammatory properties.",
    color: "#d4a96a",
  },
  {
    name: "Terpinolene",
    aroma: "Floral · Herbal · Piney",
    description: "A multifaceted terpene with piney, floral, and herbal notes. Mildly sedating and found in uplifting sativa strains.",
    color: "#a5f3fc",
  },
  {
    name: "Ocimene",
    aroma: "Sweet · Herbal · Woody",
    description: "An uplifting terpene with antifungal and antiviral properties. Common in tropical and fruity cultivars.",
    color: "#99f6e4",
  },
  {
    name: "Bisabolol",
    aroma: "Floral · Sweet · Nutty",
    description: "Gentle and soothing. Used widely in skincare for anti-irritant properties. May enhance cannabinoid absorption.",
    color: "#f9a8d4",
  },
  {
    name: "Geraniol",
    aroma: "Rose · Floral · Fruity",
    description: "Produces a rosy, sweet aroma. Neuroprotective properties and may help with inflammation and pain.",
    color: "#fca5a5",
  },
  {
    name: "Valencene",
    aroma: "Citrus · Sweet · Orange",
    description: "Named after Valencia oranges. Uplifting and refreshing with anti-inflammatory benefits. Enhances mood.",
    color: "#fb923c",
  },
  {
    name: "Nerolidol",
    aroma: "Floral · Citrus · Woody",
    description: "A sedating terpene found in jasmine and ginger. Anti-parasitic and antifungal. Good for sleep-oriented strains.",
    color: "#e2e8f0",
  },
];

export const terpeneByName: Record<string, Terpene> = Object.fromEntries(
  terpeneList.map(t => [t.name, t])
);
