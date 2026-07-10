import Image from "next/image";
import Link from "next/link";
import { brands } from "@/lib/data/site";
import { RegionsSection } from "@/components/public/RegionsSection";
import { BlkEditionSection } from "@/components/public/BlkEditionSection";
import { AlldaySection } from "@/components/public/AlldaySection";
import { CultivarsSlideshow } from "@/components/public/CultivarsSlideshow";

const cardData = [
  { brandIndex: 0, category: "Community Genetics" },
  { brandIndex: 1, category: "In-House Genetics" },
  { brandIndex: 2, category: "Medical" },
];

export default function BrandsPage() {
  return (
    <>

      {/* ── BRANDS heading ── */}
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

      {/* ── 3 brand cards ── */}
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
                  {/* Logo */}
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

                  {/* Divider */}
                  <div style={{ borderTop: "1px solid rgba(255,255,255,0.15)", margin: "0 24px" }} />

                  {/* Category label */}
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

      <AlldaySection />
      {/* Allday product lineup */}
      <section style={{ background: "#000", padding: "80px 0 100px" }}>
        <div style={{ width: "min(1280px, calc(100% - 40px))", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24, alignItems: "end" }}>
            {[
              { src: "https://leafcross.com/wp-content/uploads/2024/05/pink.svg",   label: "Sativa" },
              { src: "https://leafcross.com/wp-content/uploads/2024/05/purple.svg", label: "Indica" },
              { src: "https://leafcross.com/wp-content/uploads/2024/05/green.svg",  label: "Hybrid" },
              { src: "https://leafcross.com/wp-content/uploads/2024/05/blue.svg",   label: "CBD"    },
            ].map(({ src, label }) => (
              <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 32 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={`Allday ${label}`}
                  style={{ width: "100%", height: "auto", objectFit: "contain" }}
                />
                <button style={{
                  width: "85%", padding: "16px 0",
                  background: "#00f6ff", border: "none", borderRadius: 999,
                  color: "#000", fontSize: 14, fontWeight: 800,
                  textTransform: "uppercase", letterSpacing: "0.12em", cursor: "pointer",
                }}>
                  Get Now
                </button>
              </div>
            ))}
          </div>

          <p style={{
            marginTop: 88, textAlign: "center",
            color: "#fff", fontSize: "clamp(24px, 3.2vw, 42px)",
            fontWeight: 400, lineHeight: 1.45, maxWidth: 820,
            margin: "88px auto 0",
          }}>
            Join us—Allday Cannabis, where community, quality, and fun come together in every puff
          </p>
        </div>
      </section>

      {/* Allday strains grid */}
      <section style={{ background: "#000", padding: "0 0 100px" }}>
        <div style={{ width: "min(1280px, calc(100% - 40px))", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <p style={{ margin: "0 0 4px", color: "#fff", fontSize: "clamp(28px, 4vw, 52px)", fontWeight: 300, textTransform: "uppercase", letterSpacing: "0.12em" }}>
              Strains
            </p>
            <h2 style={{ margin: 0, color: "#fff", fontSize: "clamp(36px, 6vw, 72px)", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.04em" }}>
              Mix N Match
            </h2>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center" }}>
            {[
              "https://leafcross.com/wp-content/uploads/2024/04/INDICA-Jelly-Bean.jpg",
              "https://leafcross.com/wp-content/uploads/2024/04/SATIVA-Dream-Catcher.jpg",
              "https://leafcross.com/wp-content/uploads/2024/04/HYBRID-Sweet-Gas.jpg",
              "https://leafcross.com/wp-content/uploads/2024/04/SATIVA-Grapefruit-Skunk.jpg",
              "https://leafcross.com/wp-content/uploads/2024/04/CBD-Lemon-Haze.jpg",
              "https://leafcross.com/wp-content/uploads/2024/04/SATIVA-Hippie-Vibes.jpg",
              "https://leafcross.com/wp-content/uploads/2024/04/HYBRID-Pink-Tingz.jpg",
              "https://leafcross.com/wp-content/uploads/2024/04/INDICA-Salty-Pink.jpg",
              "https://leafcross.com/wp-content/uploads/2024/04/SATIVA-Love-Haze.jpg",
              "https://leafcross.com/wp-content/uploads/2024/04/INDICA-Grape-Soda.jpg",
              "https://leafcross.com/wp-content/uploads/2024/04/SATIVA-Mandarin-Sunset.jpg",
              "https://leafcross.com/wp-content/uploads/2024/04/INDICA-Flawless-Victory.jpg",
              "https://leafcross.com/wp-content/uploads/2024/04/SATIVA-Sour-Mango.jpg",
              "https://leafcross.com/wp-content/uploads/2024/04/INDICA-Pine-Star.jpg",
            ].map((src) => {
              const name = src.split("/").pop()?.replace(".jpg", "").replace(/-/g, " ") ?? "";
              return (
                <div key={src} style={{ borderRadius: 16, overflow: "hidden", width: "calc(28% - 12px)" }}>
                  <Image
                    src={src}
                    alt={name}
                    width={800}
                    height={800}
                    style={{ width: "100%", height: "auto", display: "block" }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <RegionsSection />

      <BlkEditionSection />
      <CultivarsSlideshow />

      {/* ── Leaf Cross Biomedical brand detail ── */}
      <section className="section darkSection" id="LeafCross">
        <div className="container brandStory">
          <div>
            <Image className="brandStoryLogo" src={brands[2].logo} alt="Leaf Cross Biomedical" width={320} height={130} />
            <h2 className="display" style={{ fontSize: "clamp(42px, 7vw, 92px)" }}>Premium Quality</h2>
            <p className="lead">
              The Leaf Cross Biomedical brand remains public-facing, while
              medical-patient product workflows are removed from the future
              system.
            </p>
          </div>
          <Image className="brandFeatureImage" src="/assets/wordpress/Brand_Premium_Craft.png" alt="" width={760} height={520} />
        </div>
      </section>
    </>
  );
}
