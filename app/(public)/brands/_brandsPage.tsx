// Original brands page (disabled) — to re-enable, copy contents into page.tsx and update SiteContent if needed
export const dynamic = "force-dynamic";

import Image from "next/image";
import Link from "next/link";
import { brands } from "@/lib/data/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Brands | Leaf Cross Biomedical",
  description: "Explore Leaf Cross Biomedical's portfolio of cannabis brands — Allday Cannabis, Allday BLK Edition, GC Exotics, Nelson Craft Cannabis, Haida Gwaii, and more.",
};
import { RegionsSection } from "@/components/public/RegionsSection";
import { BlkEditionSection } from "@/components/public/BlkEditionSection";
import { AlldaySection } from "@/components/public/AlldaySection";
import { CultivarsSlideshow } from "@/components/public/CultivarsSlideshow";

const cardData = [
  { brandIndex: 0, category: "Community Genetics" },
  { brandIndex: 1, category: "In-House Genetics" },
  { brandIndex: 2, category: "Medical" },
];

const alldayTabs = [
  { title: "Community Focus", body: "We champion small craft growers in British Columbia, promoting community and raising awareness for BC craft cannabis." },
  { title: "Fun and Vibrant", body: "Allday is not just a brand; it's a celebration. We embody the joy and love of the cannabis community, making every experience vibrant and fun." },
  { title: "High-Quality, Affordable Cannabis", body: "Quality without compromise. Allday brings you top-notch products at prices that won't break the bank." },
  { title: "For Connoisseurs and Beyond", body: "Calling all cannabis connoisseurs! Explore unique strains, mix, and match to create personalized profiles and blends." },
];
const blkTabs = [
  { title: "Unique Cultivars", body: "We are dedicated to sharing unique genetics with the world. Our in-house breeding program is constantly evolving, driven by a relentless pursuit of new and unique cultivars." },
  { title: "Innovation", body: "Our commitment to sustainability drives us to embrace cutting-edge technologies." },
  { title: "Premium Craft", body: "Each strain we introduce undergoes a meticulous selection process." },
  { title: "Smokes Smooth", body: "We take the curing process to the next level with our cold, slow curing technique." },
];
const blkBody = "At Allday Black Edition, we redefine cultivation with a blend of cutting-edge technology and hands-on craftsmanship.";

export default async function BrandsPageFull() {
  return (
    <>
      <section style={{ background: "#000", padding: "140px 0 80px" }}>
        <div style={{ width: "min(1180px, calc(100% - 40px))", margin: "0 auto" }}>
          <h1 style={{
            margin: 0, color: "#fff",
            fontSize: "clamp(48px, 8vw, 110px)",
            fontWeight: 800, textTransform: "uppercase",
            letterSpacing: "-0.02em", lineHeight: 0.9,
          }}>
            Brands
          </h1>
        </div>
      </section>

      <section style={{ background: "#efefef", padding: "72px 0 88px" }}>
        <div style={{ width: "min(1180px, calc(100% - 40px))", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {cardData.map(({ brandIndex, category }) => {
              const brand = brands[brandIndex];
              return (
                <Link
                  key={brand.name}
                  href={`#${encodeURIComponent(brand.anchor)}`}
                  style={{
                    display: "flex", flexDirection: "column",
                    background: "#111", borderRadius: 20,
                    overflow: "hidden", textDecoration: "none", color: "#fff",
                    minHeight: 340,
                  }}
                >
                  <div style={{
                    flex: 1,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    padding: "56px 32px",
                  }}>
                    <Image
                      src={brand.logo}
                      alt={brand.name}
                      width={280}
                      height={120}
                      style={{ objectFit: "contain", maxWidth: "100%", height: "auto" }}
                    />
                  </div>
                  <div style={{ borderTop: "1px solid rgba(255,255,255,0.15)", margin: "0 24px" }} />
                  <div style={{ padding: "18px 28px 28px" }}>
                    <p style={{
                      margin: 0, fontSize: 13, fontWeight: 700,
                      textTransform: "uppercase", letterSpacing: "0.1em", color: "#fff",
                    }}>
                      {category}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <AlldaySection tabs={alldayTabs} />
      <RegionsSection />
      <BlkEditionSection tabs={blkTabs} body={blkBody} />
      <CultivarsSlideshow />
    </>
  );
}
