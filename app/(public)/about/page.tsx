import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function AboutPage() {
  return (
    <main style={{ background: "#000" }}>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section style={{ position: "relative", minHeight: "92vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Image
          src="/assets/grow/facility-wide-2.jpg"
          alt="Leaf Cross grow facility"
          fill
          priority
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
        {/* Dark overlay */}
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.62)" }} />

        {/* Text box */}
        <div style={{
          position: "relative",
          zIndex: 2,
          textAlign: "center",
          padding: "56px clamp(24px, 5vw, 80px)",
          background: "rgba(0,0,0,0.45)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 20,
          maxWidth: 760,
          margin: "0 24px",
        }}>
          <p style={{ margin: "0 0 14px", color: "#00f6ff", fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.2em" }}>
            About Leaf Cross Biomedical
          </p>
          <h1 style={{
            margin: "0 0 24px",
            color: "#fff",
            fontSize: "clamp(36px, 6vw, 72px)",
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            lineHeight: 1,
          }}>
            Built for<br />Partnership
          </h1>
          <div style={{ width: 56, height: 3, background: "#00f6ff", margin: "0 auto 24px" }} />
          <p style={{ margin: 0, color: "rgba(255,255,255,0.75)", fontSize: "clamp(15px, 1.5vw, 18px)", lineHeight: 1.7, maxWidth: 560, marginInline: "auto" }}>
            A licensed micro-cultivator and processor dedicated to producing premium craft cannabis — built from the ground up with our partners in mind.
          </p>
        </div>
      </section>

      {/* ── 3 PHASES OF FLOWER ───────────────────────────────────────────── */}
      <section style={{ background: "#050505", padding: "80px 0" }}>
        <div style={{ width: "min(1180px, calc(100% - 40px))", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <p style={{ margin: "0 0 10px", color: "#00f6ff", fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.18em" }}>
              In The Garden
            </p>
            <h2 style={{ margin: 0, color: "#fff", fontSize: "clamp(24px, 3vw, 38px)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Three Phases of Flower
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {[
              { src: "/assets/grow/bud-close-2.jpg", phase: "Phase 1", label: "Early Flower", desc: "Structure forms, pistils push through" },
              { src: "/assets/grow/bud-close-3.jpg", phase: "Phase 2", label: "Mid Flower",   desc: "Density builds, terpenes develop" },
              { src: "/assets/grow/bud-close-1.jpg", phase: "Phase 3", label: "Harvest Ready", desc: "Peak trichome expression" },
            ].map(({ src, phase, label, desc }) => (
              <div key={label} style={{ position: "relative", borderRadius: 16, overflow: "hidden", aspectRatio: "3/4" }}>
                <Image src={src} alt={label} fill style={{ objectFit: "cover", objectPosition: "center" }} />
                {/* Gradient overlay */}
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.1) 55%)" }} />
                {/* Label */}
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "28px 24px" }}>
                  <p style={{ margin: "0 0 4px", color: "#00f6ff", fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.16em" }}>{phase}</p>
                  <p style={{ margin: "0 0 6px", color: "#fff", fontSize: 18, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</p>
                  <p style={{ margin: 0, color: "rgba(255,255,255,0.5)", fontSize: 13, lineHeight: 1.5 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHO WE ARE ───────────────────────────────────────────────────── */}
      <section style={{ position: "relative", padding: "120px 0" }}>
        <Image src="/assets/grow/grow-room-person.jpg" alt="Leaf Cross cultivation" fill style={{ objectFit: "cover", objectPosition: "center" }} />
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.7)" }} />
        <div style={{ position: "relative", zIndex: 2, width: "min(1180px, calc(100% - 40px))", margin: "0 auto", display: "flex", justifyContent: "flex-start" }}>
          <div style={{
            maxWidth: 620,
            background: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 20,
            padding: "48px 52px",
          }}>
            <p style={{ margin: "0 0 10px", color: "#00f6ff", fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.18em" }}>Who We Are</p>
            <h2 style={{ margin: "0 0 28px", color: "#fff", fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", lineHeight: 1.1 }}>
              Everything Begins With the Consumer
            </h2>
            <p style={{ margin: "0 0 20px", color: "rgba(255,255,255,0.75)", fontSize: 16, lineHeight: 1.8 }}>
              Leaf Cross is a licensed micro-cultivator and processor dedicated to producing premium craft cannabis. Everything we do begins with the consumer. From pheno hunting and cultivation to curing and the final smoking experience, our focus is on creating flower that delivers exceptional flavour, terpene expression, and memorable effects.
            </p>
            <p style={{ margin: 0, color: "rgba(255,255,255,0.75)", fontSize: 16, lineHeight: 1.8 }}>
              Our cultivation combines modern technology with traditional craftsmanship. We grow indoors under LED lighting in a highly controlled environment, using automated irrigation and coco coir to promote consistent, healthy plant growth.
            </p>
          </div>
        </div>
      </section>

      {/* ── OUR STANDARDS ────────────────────────────────────────────────── */}
      <section style={{ position: "relative", padding: "120px 0" }}>
        <Image src="/assets/grow/facility-new-2.jpg" alt="Leaf Cross facility" fill style={{ objectFit: "cover", objectPosition: "center" }} />
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.68)" }} />
        <div style={{ position: "relative", zIndex: 2, width: "min(1180px, calc(100% - 40px))", margin: "0 auto", display: "flex", justifyContent: "flex-end" }}>
          <div style={{
            maxWidth: 620,
            background: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 20,
            padding: "48px 52px",
          }}>
            <p style={{ margin: "0 0 10px", color: "#00f6ff", fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.18em" }}>Our Standards</p>
            <h2 style={{ margin: "0 0 28px", color: "#fff", fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", lineHeight: 1.1 }}>
              Quality Starts With Clean Cultivation
            </h2>
            <p style={{ margin: "0 0 20px", color: "rgba(255,255,255,0.75)", fontSize: 16, lineHeight: 1.8 }}>
              We believe quality starts with clean cultivation. That&apos;s why we maintain rigorous sanitation standards and use beneficial insects as part of our biological pest management program, minimizing the need for sprays whenever possible.
            </p>
            <p style={{ margin: 0, color: "rgba(255,255,255,0.75)", fontSize: 16, lineHeight: 1.8 }}>
              Every harvest is hand-trimmed, hang-dried, and slowly cold-cured for approximately 30 days to preserve the character of each cultivar. From seed selection to the final cure, every step is guided by our commitment to producing distinctive craft cannabis.
            </p>
          </div>
        </div>
      </section>

      {/* ── PARTNERSHIP ──────────────────────────────────────────────────── */}
      <section style={{ position: "relative", padding: "120px 0" }}>
        <Image src="/assets/grow/facility-wide-1.jpg" alt="Leaf Cross drying room" fill style={{ objectFit: "cover", objectPosition: "center" }} />
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.72)" }} />
        <div style={{ position: "relative", zIndex: 2, width: "min(1180px, calc(100% - 40px))", margin: "0 auto", display: "flex", justifyContent: "center" }}>
          <div style={{
            maxWidth: 720,
            background: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 20,
            padding: "56px 64px",
            textAlign: "center",
          }}>
            <p style={{ margin: "0 0 10px", color: "#00f6ff", fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.18em" }}>Built for Partnership</p>
            <h2 style={{ margin: "0 0 28px", color: "#fff", fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", lineHeight: 1.1 }}>
              A Stronger Industry Through Collaboration
            </h2>
            <div style={{ width: 48, height: 2, background: "#00f6ff", margin: "0 auto 28px" }} />
            <p style={{ margin: "0 0 20px", color: "rgba(255,255,255,0.75)", fontSize: 16, lineHeight: 1.85 }}>
              We believe a stronger cannabis industry is built through collaboration. Every part of the supply chain — from breeders, cultivators, processors, and brands to distributors, retailers, and budtenders — plays an important role in delivering exceptional products to consumers.
            </p>
            <p style={{ margin: "0 0 40px", color: "rgba(255,255,255,0.75)", fontSize: 16, lineHeight: 1.85 }}>
              We&apos;re always excited to connect with like-minded people who share our passion for quality, innovation, and craftsmanship. Whether you&apos;re a brand, retailer, distributor, cultivator, or another industry partner, we&apos;d love to hear from you and explore how we can create something meaningful together.
            </p>
            <Link href="/contact-us" className="button" style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
              Let&apos;s Connect <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
