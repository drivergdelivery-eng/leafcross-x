"use client";

import { useState } from "react";

type TabItem = { title: string; body: string };

const defaultTabs: TabItem[] = [
  {
    title: "Community Focus",
    body: "We champion small craft growers in British Columbia, promoting community and raising awareness for BC craft cannabis.",
  },
  {
    title: "Fun and Vibrant",
    body: "Allday is not just a brand; it's a celebration. We embody the joy and love of the cannabis community, making every experience vibrant and fun.",
  },
  {
    title: "High-Quality, Affordable Cannabis",
    body: "Quality without compromise. Allday brings you top-notch products at prices that won't break the bank.",
  },
  {
    title: "For Connoisseurs and Beyond",
    body: "Calling all cannabis connoisseurs! Explore unique strains, mix, and match to create personalized profiles and blends. All day is your playground for the finest cannabis experiences.",
  },
];

export function AlldaySection({ tabs: propTabs }: { tabs?: TabItem[] }) {
  const tabs = propTabs ?? defaultTabs;
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="Allday" style={{ background: "#050706", padding: "120px 0" }}>
      <div style={{
        width: "min(1180px, calc(100% - 40px))", margin: "0 auto",
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "start",
      }}>
        {/* Left: logo */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", paddingTop: 16 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://leafcross.com/wp-content/uploads/2024/05/AllDay-Cannabis-Regular-Logo-1.svg"
            alt="Allday Cannabis"
            style={{ width: "100%", maxWidth: 400, height: "auto" }}
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
    </section>
  );
}
