"use client";

import { useState, useRef } from "react";
import Image from "next/image";

const slides = [
  "/assets/grow/facility-new-1.jpg",
  "/assets/grow/facility-new-2.jpg",
  "/assets/grow/facility-new-3.jpg",
  "/assets/grow/facility-new-4.jpg",
  "/assets/grow/facility-new-5.jpg",
  "/assets/grow/grow-room-person.jpg",
  "/assets/grow/facility-wide-1.jpg",
  "/assets/grow/facility-wide-2.jpg",
  "/assets/grow/bud-close-1.jpg",
  "/assets/grow/bud-close-2.jpg",
  "/assets/grow/bud-close-3.jpg",
  "/assets/strains/gas-daddy.jpg",
  "/assets/strains/slumber-party.jpg",
  "/assets/strains/fx-3.jpg",
  "/assets/strains/halle-berry.jpg",
  "/assets/strains/joker.jpg",
  "/assets/strains/lemon-cherry-soap.jpg",
  "/assets/strains/67.jpg",
  "/assets/strains/fx-1.jpg",
  "/assets/strains/sunset-sherbert.jpg",
  "/assets/strains/abracadabra.jpg",
  "/assets/strains/sunset-soap.jpg",
  "/assets/strains/fx.jpg",
];

export function GrowSlideshow() {
  const [current, setCurrent] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);
  const next = () => setCurrent((c) => (c + 1) % slides.length);

  // Show current + 1 on each side (looping)
  const visible = [-1, 0, 1].map((offset) => ({
    src: slides[(current + offset + slides.length) % slides.length],
    offset,
  }));

  return (
    <section style={{ background: "#050706", padding: "96px 0" }}>
      <div style={{ width: "min(1180px, calc(100% - 40px))", margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, marginBottom: 40 }}>
          <div>
            <p style={{ color: "#2f4d26", fontSize: 13, fontWeight: 700, textTransform: "uppercase", margin: "0 0 10px" }}>Our Grow</p>
            <h2 style={{ margin: 0, fontSize: "clamp(38px, 6vw, 80px)", lineHeight: 0.92, textTransform: "uppercase", color: "#fff" }}>
              From the Facility
            </h2>
          </div>
          <p style={{ maxWidth: 420, color: "rgba(255,255,255,0.62)", fontSize: 18, lineHeight: 1.5, margin: 0 }}>
            Double-tier cultivation rooms, in-house genetics, and hands-on attention at every stage of the grow.
          </p>
        </div>

        <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 12 }}>
          {/* Prev arrow */}
          <button
            onClick={prev}
            aria-label="Previous"
            style={{
              flexShrink: 0, width: 44, height: 44, borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.25)",
              background: "rgba(255,255,255,0.08)", color: "#fff",
              fontSize: 24, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            ‹
          </button>

          {/* Image strip */}
          <div ref={trackRef} style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1.5fr 1fr", gap: 12, overflow: "hidden" }}>
            {visible.map(({ src, offset }) => (
              <div
                key={src + offset}
                style={{
                  position: "relative",
                  borderRadius: 16,
                  overflow: "hidden",
                  aspectRatio: "3 / 4",
                  opacity: offset === 0 ? 1 : 0.5,
                  transition: "opacity 300ms ease",
                  background: "#0b0d0b",
                  cursor: offset !== 0 ? "pointer" : "default",
                }}
                onClick={() => offset !== 0 && setCurrent((current + offset + slides.length) % slides.length)}
              >
                <Image
                  src={src}
                  alt="Leaf Cross"
                  fill
                  style={{ objectFit: "contain" }}
                />
              </div>
            ))}
          </div>

          {/* Next arrow */}
          <button
            onClick={next}
            aria-label="Next"
            style={{
              flexShrink: 0, width: 44, height: 44, borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.25)",
              background: "rgba(255,255,255,0.08)", color: "#fff",
              fontSize: 24, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            ›
          </button>
        </div>
      </div>
    </section>
  );
}
