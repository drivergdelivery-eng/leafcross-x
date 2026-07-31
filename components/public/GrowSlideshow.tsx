"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = { eyebrow: string; title: string; desc: string; slides: string[] };

export function GrowSlideshow({ eyebrow, title, desc, slides }: Props) {
  const [current, setCurrent] = useState(0);
  const len = slides.length;
  const prev = () => setCurrent((c) => (c - 1 + len) % len);
  const next = () => setCurrent((c) => (c + 1) % len);

  useEffect(() => {
    const timer = setInterval(() => setCurrent((c) => (c + 1) % len), 4000);
    return () => clearInterval(timer);
  }, [len]);

  return (
    <section style={{ background: "#050706", padding: "88px 0" }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: 44 }}>
          <p style={{ margin: "0 0 8px", color: "#00f6ff", fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.18em" }}>
            {eyebrow}
          </p>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
            <h2 style={{ margin: 0, color: "#fff", fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", lineHeight: 1.05 }}>
              {title}
            </h2>
            <p style={{ margin: 0, color: "rgba(255,255,255,0.45)", fontSize: 15, maxWidth: 400, lineHeight: 1.6 }}>
              {desc}
            </p>
          </div>
        </div>

        {/* Carousel */}
        <div style={{ position: "relative", borderRadius: 20, overflow: "hidden", aspectRatio: "16/9", background: "#0b0d0b" }}>
          <Image
            key={current}
            src={slides[current]}
            alt="Facility"
            fill
            style={{ objectFit: "cover", transition: "opacity 300ms ease" }}
            sizes="100vw"
            priority
          />

          {/* Arrows */}
          <button
            onClick={prev}
            style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", zIndex: 10, width: 48, height: 48, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.3)", background: "rgba(0,0,0,0.5)", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }}
          >
            <ChevronLeft size={22} />
          </button>
          <button
            onClick={next}
            style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", zIndex: 10, width: 48, height: 48, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.3)", background: "rgba(0,0,0,0.5)", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }}
          >
            <ChevronRight size={22} />
          </button>

          {/* Dots */}
          <div style={{ position: "absolute", bottom: 16, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 8, zIndex: 10 }}>
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                style={{ width: i === current ? 24 : 8, height: 8, borderRadius: 4, border: "none", background: i === current ? "#00f6ff" : "rgba(255,255,255,0.35)", cursor: "pointer", padding: 0, transition: "all 250ms ease" }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
