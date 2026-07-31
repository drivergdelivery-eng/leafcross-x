export const dynamic = "force-dynamic";

import Link from "next/link";
import { UserPlus, LogIn, ShoppingCart, CreditCard, Truck } from "lucide-react";
import { getSiteContent } from "@/lib/data/getSiteContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Retailer Portal | Leaf Cross Biomedical",
  description: "Licensed Canadian cannabis retailers can apply for a Leaf Cross Biomedical partner account to access private menus, place orders, and manage their account online.",
};

const steps = [
  { icon: UserPlus,    label: "Register" },
  { icon: LogIn,       label: "Login" },
  { icon: ShoppingCart,label: "Order" },
  { icon: CreditCard,  label: "Payment" },
  { icon: Truck,       label: "Shipping" },
];

export default async function RetailersPage() {
  const c = await getSiteContent();
  return (
    <main style={{ background: "#000", minHeight: "100vh" }}>

      {/* Hero heading */}
      <section style={{ padding: "80px 20px 60px", textAlign: "center" }}>
        <h1 style={{
          margin: "0 0 32px",
          color: "#fff",
          fontSize: "clamp(56px, 10vw, 130px)",
          fontWeight: 800,
          textTransform: "uppercase",
          letterSpacing: "-0.01em",
          lineHeight: 0.95,
        }}>
          Retailers
        </h1>

        <p style={{
          margin: "0 0 56px",
          color: "#fff",
          fontSize: "clamp(20px, 3vw, 32px)",
          fontWeight: 500,
        }}>
          HOW{" "}
          <span style={{ color: "#00f6ff", fontWeight: 700 }}>DIRECT DELIVERY</span>
          {" "}WORKS?
        </p>

        {/* 5-step process */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          gap: 0, flexWrap: "wrap",
          width: "min(900px, 100%)", margin: "0 auto 48px",
        }}>
          {steps.map(({ icon: Icon, label }, i) => (
            <div key={label} style={{ display: "flex", alignItems: "center" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, position: "relative" }}>
                <span style={{
                  position: "absolute", top: -24, left: 0,
                  color: "rgba(255,255,255,0.6)", fontSize: 13, fontWeight: 600,
                }}>
                  {i + 1}
                </span>
                <div style={{
                  width: 100, height: 100, borderRadius: "50%",
                  background: "#00f6ff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Icon size={40} color="#000" strokeWidth={2} />
                </div>
                <p style={{
                  margin: 0, color: "#fff",
                  fontSize: 15, fontWeight: 700,
                  textTransform: "uppercase", letterSpacing: "0.08em",
                }}>
                  {label}
                </p>
              </div>

              {/* Connector line */}
              {i < steps.length - 1 && (
                <div style={{
                  width: 60, height: 2,
                  borderTop: "2px dashed rgba(255,255,255,0.3)",
                  margin: "0 8px 28px",
                  flexShrink: 0,
                }} />
              )}
            </div>
          ))}
        </div>

        {/* Note */}
        <div style={{ width: "min(860px, calc(100% - 40px))", margin: "0 auto 48px", textAlign: "center" }}>
          <p style={{ margin: 0, color: "rgba(255,255,255,0.85)", fontSize: "clamp(14px, 1.4vw, 17px)", lineHeight: 1.75 }}>
            <span style={{ color: "#00f6ff", fontWeight: 700 }}>Note: </span>
            {c.retailersNote}
          </p>
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.12)", width: "min(900px, calc(100% - 40px))", margin: "0 auto" }} />
      </section>

      {/* Login section */}
      <section style={{ padding: "72px 20px", textAlign: "center" }}>
        <h2 style={{
          margin: "0 0 24px", color: "#fff",
          fontSize: "clamp(48px, 8vw, 100px)",
          fontWeight: 800, textTransform: "uppercase",
          letterSpacing: "-0.01em",
        }}>
          Login
        </h2>
        <p style={{ margin: "0 0 36px", color: "rgba(255,255,255,0.55)", fontSize: 18, lineHeight: 1.6, maxWidth: 480, marginInline: "auto" }}>
          {c.retailersLoginSubtitle}
        </p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/login" style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            padding: "16px 48px", borderRadius: 999,
            background: "#00f6ff", color: "#000",
            fontSize: 14, fontWeight: 800, textTransform: "uppercase",
            letterSpacing: "0.1em", textDecoration: "none",
          }}>
            Retailer Login
          </Link>
          <Link href="/retailers/apply" style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            padding: "16px 48px", borderRadius: 999,
            border: "1px solid rgba(255,255,255,0.3)", color: "#fff",
            fontSize: 14, fontWeight: 700, textTransform: "uppercase",
            letterSpacing: "0.1em", textDecoration: "none",
          }}>
            Apply for Access
          </Link>
        </div>
      </section>


    </main>
  );
}
