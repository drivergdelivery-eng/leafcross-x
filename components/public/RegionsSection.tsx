"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const regions = ["Okanagan", "Kootenay", "Vancouver Island", "Cariboo"];

export function RegionsSection() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % regions.length);
        setVisible(true);
      }, 400);
    }, 2600);
    return () => clearInterval(interval);
  }, []);

  return (
    <section style={{ background: "#050706", padding: "96px 0 112px", position: "relative", overflow: "hidden" }}>
      {/* Real BC regional districts map — subtle background */}
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        opacity: 0.18, pointerEvents: "none",
      }}>
        <Image
          src="/assets/bc-map.svg"
          alt=""
          width={700}
          height={626}
          style={{ width: "min(700px, 85vw)", height: "auto", filter: "brightness(0) invert(1)" }}
          unoptimized
        />
      </div>

      {/* Content */}
      <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
        <p style={{
          margin: "0 0 64px",
          color: "#fff",
          fontSize: "clamp(18px, 2.5vw, 28px)",
          fontWeight: 400,
          textTransform: "uppercase",
          letterSpacing: "0.18em",
        }}>
          Regions We Support
        </p>

        <div style={{ minHeight: "clamp(80px, 12vw, 140px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <h2 style={{
            margin: 0,
            color: "#4ade80",
            fontSize: "clamp(48px, 10vw, 130px)",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            lineHeight: 1,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.35s ease, transform 0.35s ease",
          }}>
            {regions[index]}
          </h2>
        </div>

        {/* Dot indicators */}
        <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 48 }}>
          {regions.map((r, i) => (
            <button
              key={r}
              onClick={() => { setVisible(false); setTimeout(() => { setIndex(i); setVisible(true); }, 300); }}
              aria-label={r}
              style={{
                width: i === index ? 28 : 8, height: 8,
                borderRadius: 999, border: "none", cursor: "pointer",
                background: i === index ? "#4ade80" : "rgba(255,255,255,0.25)",
                transition: "all 0.3s ease",
                padding: 0,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
