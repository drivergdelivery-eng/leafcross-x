"use client";
import { useState } from "react";
import Link from "next/link";
import { X, ArrowRight } from "lucide-react";

type Props = {
  phenoTitle:   string;
  phenoBody:    string;
  phenoCta:     string;
  partnerTitle: string;
  partnerBody:  string;
  partnerCta:   string;
};

export function PhilosophySection({ phenoTitle, phenoBody, phenoCta, partnerTitle, partnerBody, partnerCta }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <section style={{ background: "#0a0a0a", padding: "96px 0" }}>
        <div className="container">
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"clamp(48px,6vw,96px)", alignItems:"flex-start" }}>

            {/* Left — Why Pheno Hunt */}
            <div>
              <p style={{ margin:"0 0 10px", color:"#00f6ff", fontSize:11, fontWeight:800, textTransform:"uppercase", letterSpacing:"0.18em" }}>
                Our Philosophy
              </p>
              <h2 style={{ margin:"0 0 24px", color:"#fff", fontSize:"clamp(26px,3.5vw,42px)", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.05em", lineHeight:1.1 }}>
                {phenoTitle}
              </h2>
              <p style={{ margin:"0 0 36px", color:"rgba(255,255,255,0.6)", fontSize:16, lineHeight:1.75 }}>
                {phenoBody.split('\n\n')[0]}
              </p>
              <button
                onClick={() => setOpen(true)}
                style={{ display:"inline-flex", alignItems:"center", gap:10, padding:"13px 28px", borderRadius:6, border:"1.5px solid #00f6ff", background:"transparent", color:"#00f6ff", fontSize:13, fontWeight:800, textTransform:"uppercase", letterSpacing:"0.06em", cursor:"pointer", transition:"background 160ms ease, color 160ms ease" }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background="#00f6ff"; (e.currentTarget as HTMLButtonElement).style.color="#000"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background="transparent"; (e.currentTarget as HTMLButtonElement).style.color="#00f6ff"; }}
              >
                {phenoCta} <ArrowRight size={16} />
              </button>
            </div>

            {/* Right — Partner */}
            <div style={{ position:"relative" }}>
              <div style={{ position:"absolute", left:0, top:"10%", bottom:"10%", width:1, background:"linear-gradient(to bottom,transparent,rgba(0,246,255,0.3),transparent)" }} />
              <div style={{ paddingLeft:"clamp(32px,4vw,56px)" }}>
                <p style={{ margin:"0 0 10px", color:"#00f6ff", fontSize:11, fontWeight:800, textTransform:"uppercase", letterSpacing:"0.18em" }}>
                  Partner With Us
                </p>
                <h2 style={{ margin:"0 0 24px", color:"#fff", fontSize:"clamp(24px,3vw,38px)", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.05em", lineHeight:1.15 }}>
                  {partnerTitle}
                </h2>
                <p style={{ margin:"0 0 36px", color:"rgba(255,255,255,0.6)", fontSize:16, lineHeight:1.75 }}>
                  {partnerBody}
                </p>
                <Link href="/retailers" style={{ color:"#00f6ff", fontSize:15, fontWeight:600, textDecoration:"underline", textUnderlineOffset:3 }}>
                  {partnerCta}
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Modal */}
      {open && (
        <div onClick={() => setOpen(false)} style={{ position:"fixed", inset:0, zIndex:900, background:"rgba(0,0,0,0.92)", backdropFilter:"blur(8px)", display:"flex", alignItems:"center", justifyContent:"center", padding:24, overflowY:"auto" }}>
          <div onClick={e => e.stopPropagation()} style={{ background:"#0f0f0f", border:"1px solid rgba(255,255,255,0.08)", borderRadius:20, padding:"clamp(32px,5vw,56px)", maxWidth:700, width:"100%", position:"relative" }}>
            <button onClick={() => setOpen(false)} style={{ position:"absolute", top:20, right:20, display:"flex", alignItems:"center", justifyContent:"center", width:36, height:36, borderRadius:8, border:"1px solid rgba(255,255,255,0.12)", background:"rgba(255,255,255,0.05)", color:"rgba(255,255,255,0.5)", cursor:"pointer" }}>
              <X size={16} />
            </button>
            <p style={{ margin:"0 0 10px", color:"#00f6ff", fontSize:11, fontWeight:800, textTransform:"uppercase", letterSpacing:"0.18em" }}>Our Philosophy</p>
            <h2 style={{ margin:"0 0 32px", color:"#fff", fontSize:"clamp(24px,3vw,36px)", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.05em", lineHeight:1.1 }}>
              {phenoTitle}
            </h2>
            <div style={{ width:48, height:2, background:"#00f6ff", marginBottom:32 }} />
            {phenoBody.split('\n\n').map((para, i) => (
              <p key={i} style={{ margin:"0 0 22px", color:"rgba(255,255,255,0.85)", fontSize:16, lineHeight:1.8, fontWeight:500 }}>{para}</p>
            ))}
            <button onClick={() => setOpen(false)} style={{ marginTop:8, display:"inline-flex", alignItems:"center", gap:8, padding:"12px 24px", borderRadius:6, border:"none", background:"#00f6ff", color:"#000", fontSize:13, fontWeight:800, textTransform:"uppercase", letterSpacing:"0.06em", cursor:"pointer" }}>
              Got It
            </button>
          </div>
        </div>
      )}
    </>
  );
}
