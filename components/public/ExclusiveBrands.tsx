import Image from "next/image";
import type { BrandItem } from "@/lib/data/siteContent";

type Props = { eyebrow: string; title: string; brands: BrandItem[] };

export function ExclusiveBrands({ eyebrow, title, brands }: Props) {
  return (
    <section style={{ background: "#000", padding: "72px 0" }}>
      <div className="container">
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <p style={{ margin: "0 0 10px", color: "#00f6ff", fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.18em" }}>
            {eyebrow}
          </p>
          <h2 style={{ margin: 0, color: "#fff", fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            {title}
          </h2>
        </div>
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "nowrap",
          gap: "clamp(24px, 4vw, 56px)",
        }}>
          {brands.map((brand, idx) => (
            <div key={idx} style={{ position: "relative", flexShrink: 0, width: "clamp(180px, 22vw, 280px)", height: "clamp(100px, 12vw, 160px)" }}>
              <Image
                src={brand.logo}
                alt={brand.name}
                fill
                style={{ objectFit: "contain", objectPosition: "center" }}
                sizes="160px"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
