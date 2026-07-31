export const dynamic = "force-dynamic";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { getSiteContent } from "@/lib/data/getSiteContent";

export const metadata: Metadata = {
  title: "About Us | Leaf Cross Biomedical",
  description: "Leaf Cross Biomedical is a Health Canada licensed cannabis processor based in Nelson, BC — crafting premium dried flower, extracts, and concentrates.",
};

export default async function AboutPage() {
  const c = await getSiteContent();
  return (
    <main style={{ background: "#000" }}>

      {/* Hero */}
      <section style={{ background:"#000", padding:"100px 0 80px", borderBottom:"1px solid rgba(0,246,255,0.12)" }}>
        <div style={{ textAlign:"center", padding:"0 clamp(24px,5vw,80px)", maxWidth:860, margin:"0 auto" }}>
          <p style={{ margin:"0 0 14px", color:"#00f6ff", fontSize:11, fontWeight:800, textTransform:"uppercase", letterSpacing:"0.22em" }}>About Leaf Cross Biomedical</p>
          <h1 style={{ margin:"0 0 16px", color:"#fff", fontSize:"clamp(44px,7vw,96px)", fontWeight:800, textTransform:"uppercase", letterSpacing:"0.03em", lineHeight:0.95 }}>
            {c.aboutHeroTitle}
          </h1>
          <div style={{ width:64, height:3, background:"linear-gradient(90deg,#00f6ff,#a78bfa)", margin:"0 auto 20px", borderRadius:2 }} />
          <p style={{ margin:0, color:"rgba(255,255,255,0.65)", fontSize:"clamp(16px,1.6vw,20px)", lineHeight:1.75, maxWidth:620, marginInline:"auto" }}>
            {c.aboutHeroSubtitle}
          </p>
        </div>
      </section>

      {/* Who We Are */}
      <section style={{ position:"relative", padding:"120px 0" }}>
        <Image src={c.aboutWhoImage} alt="Leaf Cross cultivation" fill style={{ objectFit:"cover", objectPosition:"center" }} />
        <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.7)" }} />
        <div style={{ position:"relative", zIndex:2, width:"min(1180px,calc(100% - 40px))", margin:"0 auto", display:"flex", justifyContent:"flex-start" }}>
          <div style={{ maxWidth:620, background:"rgba(0,0,0,0.55)", backdropFilter:"blur(16px)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:20, padding:"48px 52px" }}>
            <p style={{ margin:"0 0 10px", color:"#00f6ff", fontSize:11, fontWeight:800, textTransform:"uppercase", letterSpacing:"0.18em" }}>Who We Are</p>
            <h2 style={{ margin:"0 0 28px", color:"#fff", fontSize:"clamp(24px,3vw,36px)", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.04em", lineHeight:1.1 }}>
              {c.aboutWhoTitle}
            </h2>
            <p style={{ margin:"0 0 20px", color:"rgba(255,255,255,0.75)", fontSize:16, lineHeight:1.8 }}>{c.aboutWhoBody1}</p>
            <p style={{ margin:0, color:"rgba(255,255,255,0.75)", fontSize:16, lineHeight:1.8 }}>{c.aboutWhoBody2}</p>
          </div>
        </div>
      </section>

      {/* Our Standards */}
      <section style={{ position:"relative", padding:"120px 0" }}>
        <Image src={c.aboutStandardsImage} alt="Leaf Cross facility" fill style={{ objectFit:"cover", objectPosition:"center" }} />
        <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.68)" }} />
        <div style={{ position:"relative", zIndex:2, width:"min(1180px,calc(100% - 40px))", margin:"0 auto", display:"flex", justifyContent:"flex-end" }}>
          <div style={{ maxWidth:620, background:"rgba(0,0,0,0.55)", backdropFilter:"blur(16px)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:20, padding:"48px 52px" }}>
            <p style={{ margin:"0 0 10px", color:"#00f6ff", fontSize:11, fontWeight:800, textTransform:"uppercase", letterSpacing:"0.18em" }}>Our Standards</p>
            <h2 style={{ margin:"0 0 28px", color:"#fff", fontSize:"clamp(28px,3.5vw,44px)", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.04em", lineHeight:1.1 }}>
              {c.aboutStandardsTitle}
            </h2>
            <p style={{ margin:"0 0 20px", color:"rgba(255,255,255,0.75)", fontSize:18, lineHeight:1.8 }}>{c.aboutStandardsBody1}</p>
            <p style={{ margin:0, color:"rgba(255,255,255,0.75)", fontSize:18, lineHeight:1.8 }}>{c.aboutStandardsBody2}</p>
          </div>
        </div>
      </section>

      {/* Partnership */}
      <section style={{ background:"#000", padding:"120px 0", borderTop:"1px solid rgba(0,246,255,0.12)" }}>
        <div style={{ width:"min(860px,calc(100% - 40px))", margin:"0 auto", textAlign:"center" }}>
          <p style={{ margin:"0 0 18px", color:"#00f6ff", fontSize:11, fontWeight:800, textTransform:"uppercase", letterSpacing:"0.22em" }}>Built for Partnership</p>
          <h2 style={{ margin:"0 0 24px", color:"#fff", fontSize:"clamp(32px,5vw,64px)", fontWeight:800, textTransform:"uppercase", letterSpacing:"0.04em", lineHeight:1.0 }}>
            {c.aboutPartnerTitle}
          </h2>
          <div style={{ width:64, height:3, background:"linear-gradient(90deg,#00f6ff,#a78bfa)", margin:"0 auto 40px", borderRadius:2 }} />
          <p style={{ margin:"0 0 20px", color:"rgba(255,255,255,0.7)", fontSize:"clamp(15px,1.4vw,17px)", lineHeight:1.9 }}>{c.aboutPartnerBody1}</p>
          <p style={{ margin:"0 0 56px", color:"rgba(255,255,255,0.7)", fontSize:"clamp(15px,1.4vw,17px)", lineHeight:1.9 }}>{c.aboutPartnerBody2}</p>
          <Link href="/contact-us" className="button" style={{ display:"inline-flex", alignItems:"center", gap:12, fontSize:15, padding:"16px 40px", letterSpacing:"0.06em" }}>
            Let&apos;s Connect <ArrowRight size={18} />
          </Link>
        </div>
      </section>

    </main>
  );
}
