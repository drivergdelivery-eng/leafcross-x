export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { getSiteContent } from "@/lib/data/getSiteContent";
import B2BCarousel from "@/components/public/B2BCarousel";

export const metadata: Metadata = {
  title: "B2B Wholesale | Leaf Cross Biomedical",
  description: "Partner with Leaf Cross Biomedical for B2B cannabis wholesale. Licensed Canadian retailers can apply for private menu access and direct ordering.",
};

export default async function B2BPage() {
  const c = await getSiteContent();
  return (
    <main style={{ background:"#000", minHeight:"100vh" }}>

      {/* Hero */}
      <section style={{ padding:"80px 40px 48px" }}>
        <h1 style={{ margin:"0 0 20px", color:"#fff", fontSize:"clamp(56px,10vw,130px)", fontWeight:800, textTransform:"uppercase", letterSpacing:"-0.01em", lineHeight:0.9 }}>
          {c.b2bHeroTitle}
        </h1>
        <p style={{ margin:0, color:"#00f6ff", fontSize:"clamp(18px,2vw,26px)", fontWeight:600, fontStyle:"italic" }}>
          {c.b2bHeroSubtitle}
        </p>
      </section>

      <B2BCarousel services={c.b2bServices} />

      {/* Why Work With Us */}
      <section style={{ background:"#050706", padding:"96px 40px 112px", textAlign:"center", borderTop:"1px solid rgba(255,255,255,0.06)" }}>
        <h2 style={{ margin:"0 0 80px", color:"#fff", fontSize:"clamp(32px,5vw,72px)", fontWeight:300, textTransform:"uppercase", letterSpacing:"0.05em", lineHeight:1 }}>
          {c.b2bWhyTitle}
        </h2>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:40, maxWidth:1100, margin:"0 auto" }}>
          {c.b2bReasons.map(({ src, label }) => (
            <div key={label} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:32 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={label} style={{ width:150, height:150, objectFit:"contain" }} />
              <p style={{ margin:0, color:"rgba(255,255,255,0.9)", fontSize:17, fontWeight:500, lineHeight:1.45, maxWidth:200 }}>{label}</p>
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}
