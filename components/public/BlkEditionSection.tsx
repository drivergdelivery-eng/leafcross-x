"use client";

import { useState } from "react";

const tabs = [
  {
    title: "Unique Cultivars",
    body: "We are dedicated to sharing unique genetics with the world. Our in-house breeding program is constantly evolving, driven by a relentless pursuit of new and unique cultivars. We delve deep into research and development to create groundbreaking and exclusive strains.",
  },
  {
    title: "Innovation",
    body: "Our commitment to sustainability drives us to embrace cutting-edge technologies. By integrating advanced scientific methods, modern technology, and sustainable agricultural practices, we strive to minimize our carbon footprint while cultivating premium cannabis. Our innovative approach ensures that we not only lead in quality but also in environmental stewardship.",
  },
  {
    title: "Premium Craft",
    body: "Each strain we introduce undergoes a meticulous selection process. Through extensive phenotyping, we pinpoint the ideal phenotype that meets our high standards—bold flavors, ideal bud structure, and rich trichomes are the hallmarks of our craft. Only the finest expressions make it to our shelves, ensuring a top-tier cannabis experience.",
  },
  {
    title: "Smokes Smooth",
    body: "We take the curing process to the next level with our cold, slow curing technique, extending over a minimum of 20 days. This meticulous process ensures that each batch maintains the perfect moisture content, resulting in a smooth, consistent smoke every time.",
  },
];

export function BlkEditionSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="Blk Addition" style={{ background: "#050706" }}>

      {/* Accordion */}
      <div style={{ padding: "80px 0 0" }}>
        <div style={{
          width: "min(1180px, calc(100% - 40px))", margin: "0 auto",
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "start",
        }}>
        {/* Left: BLK Edition logo */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", paddingTop: 16 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://leafcross.com/wp-content/uploads/2024/05/Final-by-Aaron-1.svg"
            alt="Allday Cannabis BLK Edition"
            style={{ width: "100%", maxWidth: 420, height: "auto", mixBlendMode: "screen" }}
          />
        </div>

        {/* Right: accordion tabs */}
        <div>
          {tabs.map(({ title, body }, i) => {
            const isOpen = open === i;
            return (
              <div key={title} style={{ borderBottom: "1px solid rgba(255,255,255,0.12)" }}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  style={{
                    width: "100%", background: "none", border: "none",
                    padding: "24px 0", textAlign: "left", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
                  }}
                >
                  <span style={{
                    color: isOpen ? "#00f6ff" : "rgba(255,255,255,0.38)",
                    fontSize: "clamp(16px, 2vw, 24px)",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    transition: "color 0.25s ease",
                  }}>
                    {title}
                  </span>
                  <span style={{
                    color: isOpen ? "#00f6ff" : "rgba(255,255,255,0.3)",
                    fontSize: 22, fontWeight: 300, flexShrink: 0,
                    transition: "transform 0.25s ease, color 0.25s ease",
                    display: "inline-block",
                    transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                  }}>
                    +
                  </span>
                </button>

                {/* Expandable body */}
                <div style={{
                  maxHeight: isOpen ? 400 : 0,
                  overflow: "hidden",
                  transition: "max-height 0.35s ease",
                }}>
                  <p style={{
                    margin: "0 0 28px",
                    color: "rgba(255,255,255,0.78)",
                    fontSize: "clamp(14px, 1.4vw, 17px)",
                    lineHeight: 1.75,
                    paddingRight: 16,
                  }}>
                    {body}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        </div>
      </div>

      {/* BLK Edition product bag lineup — below accordion, above strain grid */}
      <div style={{ padding: "80px 0 0" }}>
        <div style={{ width: "min(1280px, calc(100% - 40px))", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24, alignItems: "end" }}>
            {[
              { src: "https://leafcross.com/wp-content/uploads/2024/05/black-11.svg", label: "Sativa" },
              { src: "https://leafcross.com/wp-content/uploads/2024/05/black.svg",    label: "Indica" },
              { src: "https://leafcross.com/wp-content/uploads/2024/05/black-3.svg",  label: "Hybrid" },
              { src: "https://leafcross.com/wp-content/uploads/2024/05/black-4.svg",  label: "CBD"    },
            ].map(({ src, label }) => (
              <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={`Allday BLK Edition ${label}`} style={{ width: "100%", height: "auto", objectFit: "contain" }} />
                <p style={{ margin: 0, color: "#fff", fontSize: "clamp(18px, 2vw, 26px)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  {label}
                </p>
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

          {/* Write-up */}
          <p style={{
            margin: "72px auto 0",
            maxWidth: 900,
            textAlign: "center",
            color: "rgba(255,255,255,0.82)",
            fontSize: "clamp(15px, 1.5vw, 18px)",
            lineHeight: 1.8,
          }}>
            At Allday Black Edition, we redefine cultivation with a blend of cutting-edge technology and hands-on craftsmanship. Our focus on efficiency, sustainability, and precision creates a perfect environment for growing. We&apos;re committed to discovering and nurturing unique cultivars, allowing each plant to express its full potential in terms of potency and distinctive cannabinoid and terpene profiles. Through a careful balance of patience and love in the curing process, we ensure that our products stand out with exceptional quality and individuality. Join us in exploring the art and science behind cannabis cultivation.
          </p>
        </div>
      </div>

      {/* Our Cultivars heading */}
      <div style={{ padding: "96px 0 48px", textAlign: "center" }}>
        <h2 style={{
          margin: 0, color: "#fff",
          fontSize: "clamp(40px, 7vw, 96px)",
          fontWeight: 700, textTransform: "uppercase",
          letterSpacing: "0.04em",
        }}>
          Our Cultivars
        </h2>
      </div>

    </section>
  );
}
