"use client";

import { useState } from "react";
import Image from "next/image";

const cultivars = [
  { name: "Gas Daddy",         src: "/assets/strains/gas-daddy.jpg" },
  { name: "Slumber Party",     src: "/assets/strains/slumber-party.jpg" },
  { name: "FX 3",              src: "/assets/strains/fx-3.jpg" },
  { name: "Halle Berry",       src: "/assets/strains/halle-berry.jpg" },
  { name: "Joker",             src: "/assets/strains/joker.jpg" },
  { name: "Lemon Cherry Soap", src: "/assets/strains/lemon-cherry-soap.jpg" },
  { name: "67",                src: "/assets/strains/67.jpg" },
  { name: "FX 1",              src: "/assets/strains/fx-1.jpg" },
  { name: "Sunset Sherbert",   src: "/assets/strains/sunset-sherbert.jpg" },
  { name: "Abracadabra",       src: "/assets/strains/abracadabra.jpg" },
  { name: "Sunset Soap",       src: "/assets/strains/sunset-soap.jpg" },
  { name: "FX",                src: "/assets/strains/fx.jpg" },
];

const BODY = "A premium in-house cultivar from the Allday Black Edition collection. Carefully selected through our extensive phenotyping process, this strain delivers bold flavors, exceptional potency, and a smooth, consistent experience. Grown with cutting-edge techniques and cold-cured over a minimum of 20 days, it represents the pinnacle of our craft — distinctive cannabinoid and terpene profiles that stand out on any top-shelf menu.";

export function CultivarsSlideshow() {
  const [index, setIndex]     = useState(0);
  const [dir, setDir]         = useState<"next" | "prev">("next");
  const [animKey, setAnimKey] = useState(0);

  const navigate = (direction: "next" | "prev") => {
    setDir(direction);
    setAnimKey((k) => k + 1);
    setIndex((i) =>
      direction === "next"
        ? (i + 1) % cultivars.length
        : (i - 1 + cultivars.length) % cultivars.length
    );
  };

  const { name, src } = cultivars[index];

  return (
    <section style={{ background: "#050706", padding: "0 0 100px", position: "relative" }}>
      <style>{`
        @keyframes slideFromRight {
          from { opacity: 0; transform: perspective(800px) translateX(80px) rotateY(-8deg) scale(0.94); }
          to   { opacity: 1; transform: perspective(800px) translateX(0)   rotateY(0deg)  scale(1); }
        }
        @keyframes slideFromLeft {
          from { opacity: 0; transform: perspective(800px) translateX(-80px) rotateY(8deg) scale(0.94); }
          to   { opacity: 1; transform: perspective(800px) translateX(0)    rotateY(0deg) scale(1); }
        }
        .cultivar-slide-next { animation: slideFromRight 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; }
        .cultivar-slide-prev { animation: slideFromLeft  0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; }
      `}</style>

      <div style={{ width: "min(1280px, calc(100% - 80px))", margin: "0 auto", position: "relative" }}>

        {/* Side arrows */}
        {(["prev", "next"] as const).map((d) => (
          <button
            key={d}
            onClick={() => navigate(d)}
            aria-label={d === "prev" ? "Previous strain" : "Next strain"}
            style={{
              position: "absolute",
              top: "50%", transform: "translateY(-50%)",
              [d === "prev" ? "left" : "right"]: -52,
              zIndex: 2,
              width: 44, height: 44, borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.25)",
              background: "rgba(255,255,255,0.07)",
              color: "#fff", fontSize: 24, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "background 0.2s, border-color 0.2s",
            }}
          >
            {d === "prev" ? "‹" : "›"}
          </button>
        ))}

        {/* Animated slide content */}
        <div
          key={animKey}
          className={dir === "next" ? "cultivar-slide-next" : "cultivar-slide-prev"}
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center", minHeight: 520 }}
        >
          {/* Left: bud photo */}
          <div style={{ position: "relative", display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
            <Image
              src={src}
              alt={name}
              width={600}
              height={700}
              style={{ width: "100%", maxWidth: 480, height: "auto", objectFit: "contain" }}
            />
          </div>

          {/* Right: info */}
          <div style={{ paddingTop: 16 }}>
            <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
              {["AllDay Black Edition", "Cultivars"].map((tag) => (
                <span key={tag} style={{
                  padding: "6px 16px", borderRadius: 999,
                  border: "1px solid rgba(255,255,255,0.35)",
                  color: "#fff", fontSize: 13, fontWeight: 500,
                }}>
                  {tag}
                </span>
              ))}
            </div>

            <h3 style={{
              margin: "0 0 16px", color: "#fff",
              fontSize: "clamp(28px, 4vw, 52px)",
              fontWeight: 800, textTransform: "uppercase",
              letterSpacing: "0.02em", lineHeight: 1.05,
            }}>
              {name}
            </h3>

            <p style={{
              margin: "0 0 32px",
              color: "rgba(255,255,255,0.72)",
              fontSize: "clamp(14px, 1.3vw, 16px)",
              lineHeight: 1.75,
            }}>
              {BODY}
            </p>

            <button style={{
              padding: "14px 36px", borderRadius: 999,
              background: "#00f6ff", border: "none",
              color: "#000", fontSize: 14, fontWeight: 800,
              textTransform: "uppercase", letterSpacing: "0.1em",
              cursor: "pointer",
            }}>
              Get Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
