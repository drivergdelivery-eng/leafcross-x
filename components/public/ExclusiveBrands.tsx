"use client";
import Image from "next/image";
import Link from "next/link";

const brands = [
  {
    id: "allday",
    name: "All Day Cannabis",
    tagline: "Everyday craft. Uncompromising quality.",
    logo: "/assets/extracted/allday-logo.svg",
    accent: "#00f6ff",
    href: "/brands#allday",
  },
  {
    id: "nelson",
    name: "Nelson Craft Cannabis",
    tagline: "Rooted in the Kootenays.",
    logo: null,
    initials: "NCC",
    accent: "#a78bfa",
    href: "/brands",
  },
  {
    id: "gc",
    name: "GC Exotics",
    tagline: "Rare genetics. Elevated experiences.",
    logo: null,
    initials: "GCX",
    accent: "#f59e0b",
    href: "/brands",
  },
  {
    id: "team",
    name: "Team Cannabis",
    tagline: "Built by growers, for the culture.",
    logo: null,
    initials: "TC",
    accent: "#4ade80",
    href: "/brands",
  },
];

export function ExclusiveBrands() {
  return (
    <section style={{ background: "#000", padding: "96px 0" }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <p style={{
            margin: "0 0 10px",
            color: "#00f6ff",
            fontSize: 11,
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.18em",
          }}>
            Exclusive to Our Network
          </p>
          <h2 style={{
            margin: 0,
            color: "#fff",
            fontSize: "clamp(28px, 4vw, 48px)",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}>
            Brand Releases
          </h2>
        </div>

        {/* Brand cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 20,
        }}>
          {brands.map(brand => (
            <Link
              key={brand.id}
              href={brand.href}
              style={{ textDecoration: "none" }}
            >
              <div style={{
                position: "relative",
                background: "#0d0d0d",
                border: `1px solid rgba(255,255,255,0.07)`,
                borderRadius: 16,
                padding: "40px 32px 36px",
                overflow: "hidden",
                transition: "border-color 240ms ease, transform 240ms ease",
                cursor: "pointer",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: 0,
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.borderColor = brand.accent;
                el.style.transform = "translateY(-4px)";
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.borderColor = "rgba(255,255,255,0.07)";
                el.style.transform = "translateY(0)";
              }}
              >
                {/* Top accent line */}
                <div style={{
                  position: "absolute",
                  top: 0, left: 0, right: 0,
                  height: 3,
                  background: brand.accent,
                  borderRadius: "16px 16px 0 0",
                }} />

                {/* Logo or initials badge */}
                <div style={{
                  marginBottom: 28,
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  minHeight: 64,
                }}>
                  {brand.logo ? (
                    <Image
                      src={brand.logo}
                      alt={brand.name}
                      width={180}
                      height={60}
                      style={{ objectFit: "contain", objectPosition: "left", maxWidth: 180, height: "auto" }}
                    />
                  ) : (
                    <div style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 64,
                      height: 64,
                      borderRadius: 12,
                      background: `${brand.accent}15`,
                      border: `1px solid ${brand.accent}40`,
                      color: brand.accent,
                      fontSize: 18,
                      fontWeight: 900,
                      letterSpacing: "0.06em",
                    }}>
                      {brand.initials}
                    </div>
                  )}
                </div>

                {/* Brand name */}
                <h3 style={{
                  margin: "0 0 10px",
                  color: "#fff",
                  fontSize: 18,
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  lineHeight: 1.15,
                }}>
                  {brand.name}
                </h3>

                {/* Tagline */}
                <p style={{
                  margin: "0 0 24px",
                  color: "rgba(255,255,255,0.45)",
                  fontSize: 13,
                  lineHeight: 1.6,
                  flexGrow: 1,
                }}>
                  {brand.tagline}
                </p>

                {/* CTA */}
                <span style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  color: brand.accent,
                  fontSize: 11,
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                }}>
                  View Brand →
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom note */}
        <p style={{
          marginTop: 48,
          textAlign: "center",
          color: "rgba(255,255,255,0.25)",
          fontSize: 13,
        }}>
          Exclusive brand access is available to approved retail partners only.{" "}
          <Link href="/retailers" style={{ color: "#00f6ff", textDecoration: "none", fontWeight: 700 }}>
            Apply to become a partner →
          </Link>
        </p>
      </div>
    </section>
  );
}
