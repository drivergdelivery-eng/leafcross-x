"use client";
import { useState } from "react";
import Link from "next/link";
import { X, ArrowRight } from "lucide-react";

export function PhilosophySection() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* ── Section ── */}
      <section style={{ background: "#0a0a0a", padding: "96px 0" }}>
        <div className="container">
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "clamp(48px, 6vw, 96px)",
            alignItems: "center",
          }}>

            {/* Left — Why Pheno Hunt */}
            <div>
              <p style={{
                margin: "0 0 10px",
                color: "#00f6ff",
                fontSize: 11,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.18em",
              }}>
                Our Philosophy
              </p>
              <h2 style={{
                margin: "0 0 24px",
                color: "#fff",
                fontSize: "clamp(26px, 3.5vw, 42px)",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                lineHeight: 1.1,
              }}>
                Why Pheno Hunt
              </h2>
              <p style={{
                margin: "0 0 36px",
                color: "rgba(255,255,255,0.6)",
                fontSize: 16,
                lineHeight: 1.75,
              }}>
                Every seed has the potential to express itself differently, even when it&apos;s from the same genetic cross. Through pheno hunting, we grow and evaluate many plants to discover the exceptional few.
              </p>
              <button
                onClick={() => setOpen(true)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "13px 28px",
                  borderRadius: 6,
                  border: "1.5px solid #00f6ff",
                  background: "transparent",
                  color: "#00f6ff",
                  fontSize: 13,
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  cursor: "pointer",
                  transition: "background 160ms ease, color 160ms ease",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = "#00f6ff";
                  (e.currentTarget as HTMLButtonElement).style.color = "#000";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                  (e.currentTarget as HTMLButtonElement).style.color = "#00f6ff";
                }}
              >
                Discover Our Process <ArrowRight size={16} />
              </button>
            </div>

            {/* Divider */}
            <div style={{ position: "relative" }}>
              <div style={{
                position: "absolute",
                left: 0,
                top: "10%",
                bottom: "10%",
                width: 1,
                background: "linear-gradient(to bottom, transparent, rgba(0,246,255,0.3), transparent)",
              }} />
              <div style={{ paddingLeft: "clamp(32px, 4vw, 56px)" }}>
                <p style={{
                  margin: "0 0 10px",
                  color: "#00f6ff",
                  fontSize: 11,
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.18em",
                }}>
                  Partner With Us
                </p>
                <h2 style={{
                  margin: "0 0 24px",
                  color: "#fff",
                  fontSize: "clamp(24px, 3vw, 38px)",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  lineHeight: 1.15,
                }}>
                  Let&apos;s Help Each Other Stand Out
                </h2>
                <p style={{
                  margin: "0 0 36px",
                  color: "rgba(255,255,255,0.6)",
                  fontSize: 16,
                  lineHeight: 1.75,
                }}>
                  We&apos;re passionate about partnering with retailers who appreciate premium craft cannabis, unique genetics, and products with a story. Together, we can bring distinctive cultivars to your shelves and create memorable experiences for your customers.
                </p>
                <Link
                  href="/retailers"
                  className="button"
                >
                  Let&apos;s Be Partners <ArrowRight size={16} />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Modal ── */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 900,
            background: "rgba(0,0,0,0.92)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
            overflowY: "auto",
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: "#0f0f0f",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 20,
              padding: "clamp(32px, 5vw, 56px)",
              maxWidth: 700,
              width: "100%",
              position: "relative",
            }}
          >
            {/* Close */}
            <button
              onClick={() => setOpen(false)}
              style={{
                position: "absolute",
                top: 20,
                right: 20,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 36,
                height: 36,
                borderRadius: 8,
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(255,255,255,0.05)",
                color: "rgba(255,255,255,0.5)",
                cursor: "pointer",
              }}
            >
              <X size={16} />
            </button>

            {/* Eyebrow */}
            <p style={{
              margin: "0 0 10px",
              color: "#00f6ff",
              fontSize: 11,
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.18em",
            }}>
              Our Philosophy
            </p>

            {/* Title */}
            <h2 style={{
              margin: "0 0 32px",
              color: "#fff",
              fontSize: "clamp(24px, 3vw, 36px)",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              lineHeight: 1.1,
            }}>
              Why Pheno Hunt
            </h2>

            {/* Divider */}
            <div style={{ width: 48, height: 2, background: "#00f6ff", marginBottom: 32 }} />

            {/* Body */}
            {[
              "Every seed has the potential to express itself differently, even when it's from the same genetic cross. Through pheno hunting, we grow and evaluate many plants to discover the exceptional few.",
              "We select each cultivar for its terpene profile, flavour, aroma, appearance, smoking experience, and overall effect—not just how it looks in the bag. Our goal is to find genetics that deliver the complete cannabis experience, from first impression to the final exhale.",
              "Many of our pheno hunt selections are released as small-batch drops through our retail partners, allowing us to gather real-world feedback from budtenders and consumers before selecting the cultivars that become part of our long-term lineup. This collaborative approach helps ensure we're commercializing genetics that people genuinely enjoy—not just the ones we choose internally.",
              "By combining careful selection with real customer feedback, we develop distinctive flower that helps our partners stand out and keeps customers coming back.",
            ].map((para, i) => (
              <p
                key={i}
                style={{
                  margin: "0 0 22px",
                  color: i === 0 ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.6)",
                  fontSize: 16,
                  lineHeight: 1.8,
                  fontWeight: i === 0 ? 500 : 400,
                }}
              >
                {para}
              </p>
            ))}

            <button
              onClick={() => setOpen(false)}
              style={{
                marginTop: 8,
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "12px 24px",
                borderRadius: 6,
                border: "none",
                background: "#00f6ff",
                color: "#000",
                fontSize: 13,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                cursor: "pointer",
              }}
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </>
  );
}
