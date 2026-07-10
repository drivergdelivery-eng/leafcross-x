import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { extractedAssets } from "@/lib/data/assets";
import { GrowSlideshow } from "@/components/public/GrowSlideshow";
import { PhenoHuntGallery } from "@/components/public/PhenoHuntGallery";
import { PhilosophySection } from "@/components/public/PhilosophySection";
import { ExclusiveBrands } from "@/components/public/ExclusiveBrands";

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <video
          className="heroVideo"
          src={extractedAssets.homeClip}
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="heroShade" />
        <div className="container heroInner">
          <div className="heroCopy">
            <Image
              className="heroWordmark"
              src={extractedAssets.heroFrame}
              alt="Leaf Cross Biomedical"
              width={1516}
              height={700}
              priority
            />
            <p className="heroLicense">
              Health Canada Licensed Cannabis Processor and Retailer Supply
              Partner Located in Nelson, BC
            </p>
            <div className="heroActions">
              <Link className="button" href="/retailers">
                Apply for retailer access <ArrowRight size={18} />
              </Link>
              <Link className="button secondary" href="/brands">
                View brands
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Craft Process Highlights ── */}
      <section style={{ background: "#0a0a0a", padding: "80px 0 72px" }}>
        <div className="container">
          <p style={{
            textAlign: "center", margin: "0 0 8px",
            color: "#00f6ff", fontSize: 11, fontWeight: 800,
            textTransform: "uppercase", letterSpacing: "0.18em",
          }}>
            Our Craft Process
          </p>
          <h2 style={{
            textAlign: "center", margin: "0 0 56px",
            color: "#fff", fontSize: "clamp(26px, 3.5vw, 40px)",
            fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em",
          }}>
            Small Batch. No Shortcuts.
          </h2>

          <div style={{
            display: "flex", justifyContent: "center", alignItems: "flex-start",
            gap: "clamp(16px, 3vw, 48px)", flexWrap: "wrap",
          }}>
            {[
              {
                label: "Grown With Love",
                svg: (
                  <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
                    <path d="M20 6C14 6 8 11 8 18c0 5 3.5 8 8 9.5V36h8v-8.5C28.5 26 32 23 32 18c0-7-6-12-12-12z" stroke="#00f6ff" strokeWidth="1.8" strokeLinejoin="round"/>
                    <path d="M20 18v18M14 14c1.5 2 3.5 3.5 6 4M26 14c-1.5 2-3.5 3.5-6 4" stroke="#00f6ff" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                ),
              },
              {
                label: "Small Batch",
                svg: (
                  <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
                    <rect x="10" y="18" width="20" height="16" rx="2" stroke="#00f6ff" strokeWidth="1.8"/>
                    <path d="M13 18v-4a7 7 0 0114 0v4" stroke="#00f6ff" strokeWidth="1.8" strokeLinecap="round"/>
                    <circle cx="20" cy="26" r="3" stroke="#00f6ff" strokeWidth="1.5"/>
                  </svg>
                ),
              },
              {
                label: "Hand Trimmed",
                svg: (
                  <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
                    <path d="M14 28l-4 4M14 28l2-8 4-6 4 6 2 8" stroke="#00f6ff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 20c0 0 2-4 4-4s4 4 4 4" stroke="#00f6ff" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M26 28l4 4" stroke="#00f6ff" strokeWidth="1.8" strokeLinecap="round"/>
                    <path d="M10 24h20" stroke="#00f6ff" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                ),
              },
              {
                label: "Hang Dried",
                svg: (
                  <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
                    <path d="M8 10h24" stroke="#00f6ff" strokeWidth="1.8" strokeLinecap="round"/>
                    <path d="M13 10v4l-2 12h4l2-8 3 8h4l-2-12V10" stroke="#00f6ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M27 10v4l-1 6" stroke="#00f6ff" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                ),
              },
              {
                label: "30-Day Cold Cure",
                svg: (
                  <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
                    <circle cx="20" cy="20" r="12" stroke="#00f6ff" strokeWidth="1.8"/>
                    <path d="M20 10v20M10 20h20" stroke="#00f6ff" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M13.5 13.5l13 13M26.5 13.5l-13 13" stroke="#00f6ff" strokeWidth="1.2" strokeLinecap="round" strokeDasharray="2 3"/>
                    <path d="M20 14l1.5 2.5L20 19l-1.5-2.5L20 14z" fill="#00f6ff"/>
                  </svg>
                ),
              },
            ].map(({ label, svg }) => (
              <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, width: 140 }}>
                {/* Hexagon */}
                <div style={{ position: "relative", width: 96, height: 108 }}>
                  <svg viewBox="0 0 96 108" fill="none" width="96" height="108" style={{ position: "absolute", inset: 0 }}>
                    <path
                      d="M48 4L88 26V74L48 96L8 74V26L48 4Z"
                      fill="rgba(0,246,255,0.06)"
                      stroke="#00f6ff"
                      strokeWidth="1.5"
                    />
                  </svg>
                  <div style={{
                    position: "absolute", inset: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {svg}
                  </div>
                </div>
                <p style={{
                  margin: 0, color: "#fff", fontSize: 13, fontWeight: 700,
                  textTransform: "uppercase", letterSpacing: "0.08em",
                  textAlign: "center", lineHeight: 1.35,
                }}>
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PhenoHuntGallery />

      <PhilosophySection />

      <ExclusiveBrands />

      <GrowSlideshow />

    </>
  );
}
