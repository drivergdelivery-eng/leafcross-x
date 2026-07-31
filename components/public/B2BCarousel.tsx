"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Network, Package, Factory, Truck } from "lucide-react";
import type { B2BService } from "@/lib/data/siteContent";

const ICONS = [Network, Package, Factory, Truck];

export default function B2BCarousel({ services }: { services: B2BService[] }) {
  const [active, setActive] = useState(0);
  const [dir, setDir] = useState<"next" | "prev">("next");
  const [animKey, setAnimKey] = useState(0);
  const n = services.length;

  const go = (direction: "next" | "prev") => {
    setDir(direction);
    setActive(prev => direction === "next" ? (prev + 1) % n : (prev - 1 + n) % n);
    setAnimKey(k => k + 1);
  };

  const prevIdx = (active - 1 + n) % n;
  const nextIdx = (active + 1) % n;
  const cards = [
    { ...services[prevIdx], Icon: ICONS[prevIdx % ICONS.length], center: false },
    { ...services[active],  Icon: ICONS[active  % ICONS.length], center: true  },
    { ...services[nextIdx], Icon: ICONS[nextIdx % ICONS.length], center: false },
  ];

  return (
    <>
      <style>{`
        @keyframes b2bFromRight { from { transform:translateX(60px);  opacity:0; } to { transform:translateX(0); opacity:1; } }
        @keyframes b2bFromLeft  { from { transform:translateX(-60px); opacity:0; } to { transform:translateX(0); opacity:1; } }
      `}</style>

      <section style={{ padding:"0 24px 96px" }}>
        <div key={animKey} style={{ display:"grid", gridTemplateColumns:"1fr 1.3fr 1fr", gap:20, alignItems:"center", maxWidth:1240, margin:"0 auto 64px", animation:`${dir==="next" ? "b2bFromRight" : "b2bFromLeft"} 0.42s cubic-bezier(0.25,0.46,0.45,0.94) both` }}>
          {cards.map(({ Icon, title, body, center }) => (
            <div key={title} style={{ background:center?"#0d0d0d":"#1b1b1b", borderRadius:16, padding:center?"60px 44px":"44px 30px", textAlign:"center", transform:center?"translateY(-24px)":"none", display:"flex", flexDirection:"column", alignItems:"center", gap:20 }}>
              <Icon size={center?76:56} color="#00f6ff" strokeWidth={1.5} />
              <h3 style={{ margin:0, color:"#fff", fontSize:center?22:17, fontWeight:600 }}>{title}</h3>
              <p style={{ margin:0, color:"rgba(255,255,255,0.6)", fontSize:center?15:13, lineHeight:1.75 }}>{body}</p>
              <Link href="/contact-us" style={{ color:"#fff", fontSize:14, fontWeight:600, display:"flex", alignItems:"center", gap:6, marginTop:4, textDecoration:"none" }}>
                Learn More &rarr;
              </Link>
            </div>
          ))}
        </div>
        <div style={{ display:"flex", justifyContent:"center", gap:16 }}>
          {(["prev","next"] as const).map(d => (
            <button key={d} onClick={() => go(d)} style={{ width:56, height:56, borderRadius:"50%", background:"#00f6ff", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
              {d==="prev" ? <ArrowLeft size={22} color="#000" strokeWidth={2.5} /> : <ArrowRight size={22} color="#000" strokeWidth={2.5} />}
            </button>
          ))}
        </div>
      </section>
    </>
  );
}
