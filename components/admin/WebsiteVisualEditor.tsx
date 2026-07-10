"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Check, Eye, EyeOff, Save, ArrowLeft, Camera, Pencil, X, UserPlus, LogIn, ShoppingCart, CreditCard, Truck, Network, Package, Factory, RotateCcw, ShieldCheck } from "lucide-react";
import { defaultSiteContent, type SiteContent, type TabItem, type AboutItem, type ServiceCard, type B2BReason, type B2BService } from "@/lib/data/siteContent";

// ─── helpers ────────────────────────────────────────────────────────────────

function EditableText({
  value, onChange, editMode, multiline = false, style, as: Tag = "span",
}: {
  value: string; onChange: (v: string) => void; editMode: boolean;
  multiline?: boolean; style?: React.CSSProperties; as?: keyof React.JSX.IntrinsicElements;
}) {
  const [editing, setEditing] = useState(false);
  const [draft,   setDraft]   = useState(value);
  const commit = () => { onChange(draft); setEditing(false); };
  const cancel = () => { setDraft(value); setEditing(false); };

  if (!editMode) { const El = Tag as "span"; return <El style={style}>{value}</El>; }

  if (editing) {
    const base: React.CSSProperties = {
      background: "rgba(0,0,0,0.9)", border: "2px solid #00f6ff", borderRadius: 6,
      color: "#fff", fontSize: "inherit", fontWeight: "inherit", fontFamily: "inherit",
      letterSpacing: "inherit", lineHeight: "inherit",
      textTransform: "inherit" as React.CSSProperties["textTransform"],
      padding: "6px 10px", outline: "none", width: "100%", boxSizing: "border-box",
    };
    return (
      <span style={{ display: "inline-block", position: "relative", width: "100%" }}>
        {multiline
          ? <textarea autoFocus value={draft} rows={3} onChange={e => setDraft(e.target.value)} style={{ ...base, resize: "vertical", display: "block" }} />
          : <input autoFocus value={draft} onChange={e => setDraft(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") commit(); if (e.key === "Escape") cancel(); }}
              style={base} />
        }
        <span style={{ display: "flex", gap: 6, marginTop: 6 }}>
          <button onClick={commit} style={{ display:"flex",alignItems:"center",gap:4,padding:"4px 12px",borderRadius:6,border:"none",cursor:"pointer",background:"#00f6ff",color:"#000",fontSize:12,fontWeight:800 }}>
            <Check size={12}/> Save
          </button>
          <button onClick={cancel} style={{ display:"flex",alignItems:"center",gap:4,padding:"4px 10px",borderRadius:6,border:"1px solid rgba(255,255,255,0.2)",background:"none",color:"rgba(255,255,255,0.6)",fontSize:12,cursor:"pointer" }}>
            <X size={12}/> Cancel
          </button>
        </span>
      </span>
    );
  }

  const El = Tag as "span";
  return (
    <El onClick={() => { setDraft(value); setEditing(true); }}
      title="Click to edit"
      style={{ ...style, cursor: "text", outline: "1.5px dashed rgba(0,246,255,0.4)", outlineOffset: 2, borderRadius: 3 }}>
      {value}<Pencil size={10} style={{ marginLeft: 5, verticalAlign: "middle", color: "rgba(0,246,255,0.7)" }} />
    </El>
  );
}

function EditableImage({
  src, alt, editMode, onChange, style, imgStyle,
}: {
  src: string; alt: string; editMode: boolean; onChange: (url: string) => void;
  style?: React.CSSProperties; imgStyle?: React.CSSProperties;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState(src);
  const handleFile = (f: File) => { const u = URL.createObjectURL(f); setPreview(u); onChange(u); };
  return (
    <div style={{ position: "relative", ...style }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={preview} alt={alt} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", ...imgStyle }} />
      {editMode && (
        <div onClick={() => fileRef.current?.click()} style={{
          position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8,
          cursor: "pointer", opacity: 0, transition: "opacity 0.2s",
        }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = "1"}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = "0"}>
          <Camera size={28} color="#00f6ff" />
          <span style={{ color: "#fff", fontSize: 12, fontWeight: 700 }}>Replace Image</span>
        </div>
      )}
      <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }}
        onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
    </div>
  );
}

function SectionLabel({ label }: { label: string }) {
  return (
    <div style={{ position:"absolute", top:10, left:10, zIndex:10,
      background:"rgba(0,246,255,0.12)", border:"1px solid rgba(0,246,255,0.35)",
      color:"#00f6ff", fontSize:10, fontWeight:800, textTransform:"uppercase",
      letterSpacing:"0.1em", padding:"3px 10px", borderRadius:999, pointerEvents:"none" }}>
      {label}
    </div>
  );
}

function Wrap({ label, children }: { label: string; children: React.ReactNode }) {
  return <div style={{ position:"relative" }}><SectionLabel label={label}/>{children}</div>;
}

// ─── page editors ────────────────────────────────────────────────────────────

function HomeEditor({ c, set, setNested, setTabItem, em }:
  { c: SiteContent; set: Setter; setNested: NestedSetter; setTabItem: TabSetter; em: boolean }) {
  const [aTab, setATab] = useState<number|null>(0);
  const [bTab, setBTab] = useState<number|null>(0);
  return (
    <>
      {/* HERO */}
      <Wrap label="Homepage Hero">
        <section style={{ position:"relative", minHeight:"80vh", display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden", background:"#000" }}>
          <EditableImage src="/assets/extracted/hero-thumb.jpg" alt="Hero background" editMode={em}
            onChange={v => set("heroVideo", v)} style={{ position:"absolute", inset:0, height:"100%" }} />
          <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom,rgba(0,0,0,0.3),rgba(0,0,0,0.65))" }}/>
          <div style={{ position:"relative", zIndex:2, textAlign:"center", padding:"0 24px", maxWidth:900 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/extracted/hero-frame.png" alt="Leaf Cross" style={{ width:"100%", maxWidth:640, height:"auto", marginBottom:24 }}/>
            <p style={{ color:"rgba(255,255,255,0.85)", fontSize:"clamp(14px,1.6vw,19px)", lineHeight:1.6, margin:"0 0 36px" }}>
              <EditableText value={c.heroLicense} onChange={v=>set("heroLicense",v)} editMode={em} as="span"
                style={{ color:"rgba(255,255,255,0.85)", fontSize:"inherit", lineHeight:"inherit" }}/>
            </p>
            <div style={{ display:"flex", gap:16, justifyContent:"center", flexWrap:"wrap" }}>
              <div style={{ display:"inline-flex", alignItems:"center", padding:"13px 28px", borderRadius:999, background:"#00f6ff" }}>
                <EditableText value={c.heroCtaPrimary} onChange={v=>set("heroCtaPrimary",v)} editMode={em} as="span"
                  style={{ color:"#000", fontSize:14, fontWeight:800, textTransform:"uppercase", letterSpacing:"0.08em" }}/>
              </div>
              <div style={{ display:"inline-flex", alignItems:"center", padding:"13px 28px", borderRadius:999, border:"1px solid rgba(255,255,255,0.5)" }}>
                <EditableText value={c.heroCtaSecondary} onChange={v=>set("heroCtaSecondary",v)} editMode={em} as="span"
                  style={{ color:"#fff", fontSize:14, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em" }}/>
              </div>
            </div>
          </div>
        </section>
      </Wrap>

      {/* BRANDS */}
      <Wrap label="Homepage — Our Brands">
        <section style={{ background:"#000", padding:"72px 0" }}>
          <div style={{ width:"min(1180px,calc(100% - 40px))", margin:"0 auto" }}>
            <p style={{ textAlign:"center", color:"#fff", fontSize:"clamp(24px,4vw,44px)", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em", margin:"0 0 56px" }}>Our Brands</p>
            {[
              { logo:"/assets/extracted/allday-logo.svg",          name:"Allday Cannabis",       key:"allday" },
              { logo:"/assets/extracted/black-edition-logo.svg",   name:"Allday BLK Edition",    key:"blk" },
              { logo:"/assets/extracted/leafcross-brand-logo.svg", name:"Leaf Cross Biomedical", key:"leafcross" },
            ].map(({ logo, name, key }, i) => (
              <div key={name}>
                {i > 0 && <div style={{ borderTop:"1px solid rgba(255,255,255,0.1)" }}/>}
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", minHeight:200 }}>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"center", padding:"36px 48px", borderRight:"1px solid rgba(255,255,255,0.1)", order: i%2===0?0:1 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={logo} alt={name} style={{ maxWidth:240, width:"100%", height:"auto", mixBlendMode:"screen" }}/>
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"36px 48px", textAlign:"center", order: i%2===0?1:0 }}>
                    <h2 style={{ margin:"0 0 12px", color:"#fff", fontSize:"clamp(16px,2.5vw,30px)", fontWeight:700, textTransform:"uppercase" }}>{name}</h2>
                    <p style={{ margin:"0 0 20px", color:"rgba(255,255,255,0.55)", fontSize:14, lineHeight:1.6, maxWidth:300 }}>
                      <EditableText value={(c.brandCopies as Record<string,string>)[key]} onChange={v=>setNested("brandCopies",key,v)} editMode={em} multiline as="span"
                        style={{ color:"rgba(255,255,255,0.55)", fontSize:14, lineHeight:1.6 }}/>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </Wrap>

      {/* ALLDAY ACCORDION */}
      <Wrap label="AllDay Cannabis Section">
        <section style={{ background:"#050706", padding:"100px 0" }}>
          <div style={{ width:"min(1180px,calc(100% - 40px))", margin:"0 auto", display:"grid", gridTemplateColumns:"1fr 1fr", gap:72, alignItems:"start" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://leafcross.com/wp-content/uploads/2024/05/AllDay-Cannabis-Regular-Logo-1.svg" alt="Allday" style={{ width:"100%", maxWidth:380, height:"auto" }}/>
            </div>
            <div>
              {c.alldayTabs.map(({ title, body }, i) => (
                <div key={i} style={{ borderBottom:"1px solid rgba(255,255,255,0.12)" }}>
                  <button onClick={()=>setATab(aTab===i?null:i)} style={{ width:"100%", background:"none", border:"none", padding:"18px 0", textAlign:"left", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"space-between", gap:16 }}>
                    <span style={{ color: aTab===i?"#00f6ff":"rgba(255,255,255,0.38)", fontSize:"clamp(14px,1.8vw,20px)", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em" }}>
                      <EditableText value={title} onChange={v=>setTabItem("alldayTabs",i,"title",v)} editMode={em} as="span"
                        style={{ color:"inherit", fontSize:"inherit", fontWeight:"inherit", letterSpacing:"inherit", textTransform:"inherit" as React.CSSProperties["textTransform"] }}/>
                    </span>
                    <span style={{ color: aTab===i?"#00f6ff":"rgba(255,255,255,0.3)", fontSize:20, display:"inline-block", transform: aTab===i?"rotate(45deg)":"none" }}>+</span>
                  </button>
                  {aTab===i && (
                    <p style={{ margin:"0 0 20px", color:"rgba(255,255,255,0.78)", fontSize:"clamp(13px,1.3vw,16px)", lineHeight:1.75, paddingRight:12 }}>
                      <EditableText value={body} onChange={v=>setTabItem("alldayTabs",i,"body",v)} editMode={em} multiline as="span"
                        style={{ color:"rgba(255,255,255,0.78)", fontSize:"inherit", lineHeight:"inherit" }}/>
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </Wrap>

      {/* BLK EDITION ACCORDION */}
      <Wrap label="BLK Edition Section">
        <section style={{ background:"#050706", padding:"80px 0 0" }}>
          <div style={{ width:"min(1180px,calc(100% - 40px))", margin:"0 auto", display:"grid", gridTemplateColumns:"1fr 1fr", gap:72, alignItems:"start" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://leafcross.com/wp-content/uploads/2024/05/Final-by-Aaron-1.svg" alt="BLK Edition" style={{ width:"100%", maxWidth:400, height:"auto", mixBlendMode:"screen" }}/>
            </div>
            <div>
              {c.blkTabs.map(({ title, body }, i) => (
                <div key={i} style={{ borderBottom:"1px solid rgba(255,255,255,0.12)" }}>
                  <button onClick={()=>setBTab(bTab===i?null:i)} style={{ width:"100%", background:"none", border:"none", padding:"18px 0", textAlign:"left", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"space-between", gap:16 }}>
                    <span style={{ color: bTab===i?"#00f6ff":"rgba(255,255,255,0.38)", fontSize:"clamp(14px,1.8vw,20px)", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em" }}>
                      <EditableText value={title} onChange={v=>setTabItem("blkTabs",i,"title",v)} editMode={em} as="span"
                        style={{ color:"inherit", fontSize:"inherit", fontWeight:"inherit", letterSpacing:"inherit", textTransform:"inherit" as React.CSSProperties["textTransform"] }}/>
                    </span>
                    <span style={{ color: bTab===i?"#00f6ff":"rgba(255,255,255,0.3)", fontSize:20, display:"inline-block", transform: bTab===i?"rotate(45deg)":"none" }}>+</span>
                  </button>
                  {bTab===i && (
                    <p style={{ margin:"0 0 20px", color:"rgba(255,255,255,0.78)", fontSize:"clamp(13px,1.3vw,16px)", lineHeight:1.75, paddingRight:12 }}>
                      <EditableText value={body} onChange={v=>setTabItem("blkTabs",i,"body",v)} editMode={em} multiline as="span"
                        style={{ color:"rgba(255,255,255,0.78)", fontSize:"inherit", lineHeight:"inherit" }}/>
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div style={{ width:"min(860px,calc(100% - 80px))", margin:"64px auto", textAlign:"center" }}>
            <p style={{ margin:0, color:"rgba(255,255,255,0.82)", fontSize:"clamp(14px,1.4vw,17px)", lineHeight:1.8 }}>
              <EditableText value={c.blkBody} onChange={v=>set("blkBody",v)} editMode={em} multiline as="span"
                style={{ color:"rgba(255,255,255,0.82)", fontSize:"inherit", lineHeight:"inherit" }}/>
            </p>
          </div>
        </section>
      </Wrap>

      {/* ABOUT TAGLINE */}
      <Wrap label="About Tagline">
        <section style={{ background:"#0a0a0a", padding:"88px 0" }}>
          <div style={{ width:"min(780px,calc(100% - 80px))", margin:"0 auto", textAlign:"center" }}>
            <h2 style={{ margin:"0 0 18px", color:"#fff", fontSize:"clamp(24px,3.5vw,48px)", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.06em" }}>
              <EditableText value={c.aboutTitle} onChange={v=>set("aboutTitle",v)} editMode={em} as="span"
                style={{ color:"#fff", fontSize:"inherit", fontWeight:"inherit", textTransform:"inherit" as React.CSSProperties["textTransform"], letterSpacing:"inherit" }}/>
            </h2>
            <p style={{ margin:0, color:"rgba(255,255,255,0.6)", fontSize:"clamp(14px,1.5vw,18px)", lineHeight:1.7 }}>
              <EditableText value={c.aboutBody} onChange={v=>set("aboutBody",v)} editMode={em} multiline as="span"
                style={{ color:"rgba(255,255,255,0.6)", fontSize:"inherit", lineHeight:"inherit" }}/>
            </p>
          </div>
        </section>
      </Wrap>
    </>
  );
}

function AboutEditor({ c, set, setAboutItem, em }:
  { c: SiteContent; set: Setter; setAboutItem: (i:number, f:keyof AboutItem, v:string)=>void; em: boolean }) {
  return (
    <div style={{ background:"#000" }}>
      {c.aboutSections.map(({ title, body, image }, i) => (
        <Wrap key={i} label={`About — ${title}`}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr" }}>
            <div style={{ position:"relative", minHeight:420, order: i%2===0?0:1 }}>
              <EditableImage src={image} alt={title} editMode={em}
                onChange={v=>setAboutItem(i,"image",v)}
                style={{ position:"absolute", inset:0, height:"100%" }}/>
            </div>
            <div style={{ background:"#000", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"64px 56px", textAlign:"center", order: i%2===0?1:0 }}>
              <h2 style={{ margin:"0 0 24px", color:"#fff", fontSize:"clamp(28px,4vw,52px)", fontWeight:700, letterSpacing:"0.06em", textTransform:"uppercase" }}>
                <EditableText value={title} onChange={v=>setAboutItem(i,"title",v)} editMode={em} as="span"
                  style={{ color:"#fff", fontSize:"inherit", fontWeight:"inherit", textTransform:"inherit" as React.CSSProperties["textTransform"], letterSpacing:"inherit" }}/>
              </h2>
              <p style={{ margin:0, color:"rgba(255,255,255,0.82)", fontSize:"clamp(14px,1.4vw,17px)", lineHeight:1.75, maxWidth:460 }}>
                <EditableText value={body} onChange={v=>setAboutItem(i,"body",v)} editMode={em} multiline as="span"
                  style={{ color:"rgba(255,255,255,0.82)", fontSize:"inherit", lineHeight:"inherit" }}/>
              </p>
            </div>
          </div>
        </Wrap>
      ))}

      <Wrap label="About — Our Facility">
        <section style={{ background:"#000", padding:"80px 0" }}>
          <div style={{ width:"min(1180px,calc(100% - 40px))", margin:"0 auto" }}>
            <div style={{ textAlign:"center", marginBottom:48 }}>
              <p style={{ margin:"0 0 10px", color:"rgba(255,255,255,0.4)", fontSize:13, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em" }}>
                <EditableText value={c.facilityLocation} onChange={v=>set("facilityLocation",v)} editMode={em} as="span"
                  style={{ color:"rgba(255,255,255,0.4)", fontSize:13, fontWeight:700 }}/>
              </p>
              <h2 style={{ margin:0, color:"#fff", fontSize:"clamp(32px,5vw,60px)", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.04em" }}>
                <EditableText value={c.facilityTitle} onChange={v=>set("facilityTitle",v)} editMode={em} as="span"
                  style={{ color:"#fff", fontSize:"inherit", fontWeight:"inherit", textTransform:"inherit" as React.CSSProperties["textTransform"] }}/>
              </h2>
            </div>
            {/* top 3 */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:10 }}>
              {c.facilityImages.slice(0,3).map((src, i) => (
                <div key={i} style={{ aspectRatio:"4/3", borderRadius:10, overflow:"hidden", position:"relative" }}>
                  <EditableImage src={src} alt="Facility" editMode={em}
                    onChange={v=>{ const imgs=[...c.facilityImages]; imgs[i]=v; set("facilityImages",imgs as SiteContent["facilityImages"]); }}
                    style={{ position:"absolute", inset:0, height:"100%" }}/>
                </div>
              ))}
            </div>
            {/* bottom 2 */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              {c.facilityImages.slice(3,5).map((src, j) => (
                <div key={j} style={{ aspectRatio:"16/9", borderRadius:10, overflow:"hidden", position:"relative" }}>
                  <EditableImage src={src} alt="Facility" editMode={em}
                    onChange={v=>{ const imgs=[...c.facilityImages]; imgs[j+3]=v; set("facilityImages",imgs as SiteContent["facilityImages"]); }}
                    style={{ position:"absolute", inset:0, height:"100%" }}/>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Wrap>
    </div>
  );
}

function BrandsEditor({ c, set, setNested, setTabItem, em }:
  { c: SiteContent; set: Setter; setNested: NestedSetter; setTabItem: TabSetter; em: boolean }) {
  const [aTab, setATab] = useState<number|null>(0);
  const [bTab, setBTab] = useState<number|null>(0);
  return (
    <div>
      {/* Brand cards */}
      <Wrap label="Brands — Brand Cards">
        <section style={{ background:"#000", padding:"80px 0 40px" }}>
          <div style={{ width:"min(1180px,calc(100% - 40px))", margin:"0 auto" }}>
            <h1 style={{ margin:"0 0 56px", color:"#fff", fontSize:"clamp(48px,8vw,100px)", fontWeight:800, textTransform:"uppercase", letterSpacing:"-0.02em", lineHeight:0.9 }}>Brands</h1>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20 }}>
              {c.brandCards.map(({ logo, category }, i) => (
                <div key={i} style={{ display:"flex", flexDirection:"column", background:"#111", borderRadius:20, overflow:"hidden", minHeight:320 }}>
                  <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:"48px 32px" }}>
                    <EditableImage src={logo} alt="Brand logo" editMode={em}
                      onChange={v=>{ const cards=[...c.brandCards]; cards[i]={...cards[i],logo:v}; set("brandCards",cards); }}
                      imgStyle={{ objectFit:"contain", maxWidth:220, width:"100%", height:"auto", mixBlendMode:"screen" }}
                      style={{ width:"100%", height:100 }}/>
                  </div>
                  <div style={{ borderTop:"1px solid rgba(255,255,255,0.15)", margin:"0 24px" }}/>
                  <div style={{ padding:"16px 28px 24px" }}>
                    <p style={{ margin:0, fontSize:13, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em", color:"#fff" }}>
                      <EditableText value={category} onChange={v=>{ const cards=[...c.brandCards]; cards[i]={...cards[i],category:v}; set("brandCards",cards); }}
                        editMode={em} as="span" style={{ color:"#fff", fontSize:13, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em" }}/>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Wrap>

      {/* AllDay bags */}
      <Wrap label="Brands — AllDay Bag Lineup">
        <section style={{ background:"#000", padding:"72px 0" }}>
          <div style={{ width:"min(1180px,calc(100% - 40px))", margin:"0 auto" }}>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:24, alignItems:"end" }}>
              {c.alldayBags.map(({ src, label }, i) => (
                <div key={i} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:24 }}>
                  <EditableImage src={src} alt={label} editMode={em}
                    onChange={v=>{ const bags=[...c.alldayBags]; bags[i]={...bags[i],src:v}; set("alldayBags",bags); }}
                    style={{ width:"100%", aspectRatio:"1" }}
                    imgStyle={{ objectFit:"contain" }}/>
                  <p style={{ margin:0, color:"#fff", fontSize:"clamp(16px,2vw,22px)", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.06em" }}>
                    <EditableText value={label} onChange={v=>{ const bags=[...c.alldayBags]; bags[i]={...bags[i],label:v}; set("alldayBags",bags); }}
                      editMode={em} as="span" style={{ color:"#fff" }}/>
                  </p>
                </div>
              ))}
            </div>
            <p style={{ marginTop:72, textAlign:"center", color:"#fff", fontSize:"clamp(20px,3vw,38px)", fontWeight:400, lineHeight:1.45, maxWidth:740, marginInline:"auto" }}>
              <EditableText value={c.alldayTagline} onChange={v=>set("alldayTagline",v)} editMode={em} multiline as="span"
                style={{ color:"#fff", fontSize:"inherit", lineHeight:"inherit" }}/>
            </p>
          </div>
        </section>
      </Wrap>

      {/* AllDay accordion */}
      <Wrap label="Brands — AllDay Section">
        <section style={{ background:"#050706", padding:"100px 0" }}>
          <div style={{ width:"min(1180px,calc(100% - 40px))", margin:"0 auto", display:"grid", gridTemplateColumns:"1fr 1fr", gap:72, alignItems:"start" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://leafcross.com/wp-content/uploads/2024/05/AllDay-Cannabis-Regular-Logo-1.svg" alt="Allday" style={{ width:"100%", maxWidth:380, height:"auto" }}/>
            </div>
            <div>
              {c.alldayTabs.map(({ title, body }, i) => (
                <div key={i} style={{ borderBottom:"1px solid rgba(255,255,255,0.12)" }}>
                  <button onClick={()=>setATab(aTab===i?null:i)} style={{ width:"100%", background:"none", border:"none", padding:"18px 0", textAlign:"left", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"space-between", gap:16 }}>
                    <span style={{ color: aTab===i?"#00f6ff":"rgba(255,255,255,0.38)", fontSize:"clamp(14px,1.8vw,20px)", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em" }}>
                      <EditableText value={title} onChange={v=>setTabItem("alldayTabs",i,"title",v)} editMode={em} as="span"
                        style={{ color:"inherit", fontSize:"inherit", fontWeight:"inherit", letterSpacing:"inherit", textTransform:"inherit" as React.CSSProperties["textTransform"] }}/>
                    </span>
                    <span style={{ color: aTab===i?"#00f6ff":"rgba(255,255,255,0.3)", fontSize:20, transform: aTab===i?"rotate(45deg)":"none", display:"inline-block" }}>+</span>
                  </button>
                  {aTab===i && <p style={{ margin:"0 0 20px", color:"rgba(255,255,255,0.78)", fontSize:"clamp(13px,1.3vw,16px)", lineHeight:1.75, paddingRight:12 }}>
                    <EditableText value={body} onChange={v=>setTabItem("alldayTabs",i,"body",v)} editMode={em} multiline as="span"
                      style={{ color:"rgba(255,255,255,0.78)", fontSize:"inherit", lineHeight:"inherit" }}/>
                  </p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      </Wrap>

      {/* BLK bags */}
      <Wrap label="Brands — BLK Edition Bag Lineup">
        <section style={{ background:"#050706", padding:"72px 0" }}>
          <div style={{ width:"min(1180px,calc(100% - 40px))", margin:"0 auto" }}>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:24, alignItems:"end" }}>
              {c.blkBags.map(({ src, label }, i) => (
                <div key={i} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:24 }}>
                  <EditableImage src={src} alt={label} editMode={em}
                    onChange={v=>{ const bags=[...c.blkBags]; bags[i]={...bags[i],src:v}; set("blkBags",bags); }}
                    style={{ width:"100%", aspectRatio:"1" }}
                    imgStyle={{ objectFit:"contain" }}/>
                  <p style={{ margin:0, color:"#fff", fontSize:"clamp(16px,2vw,22px)", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.06em" }}>
                    <EditableText value={label} onChange={v=>{ const bags=[...c.blkBags]; bags[i]={...bags[i],label:v}; set("blkBags",bags); }}
                      editMode={em} as="span" style={{ color:"#fff" }}/>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Wrap>

      {/* BLK accordion */}
      <Wrap label="Brands — BLK Edition Section">
        <section style={{ background:"#050706", padding:"100px 0" }}>
          <div style={{ width:"min(1180px,calc(100% - 40px))", margin:"0 auto", display:"grid", gridTemplateColumns:"1fr 1fr", gap:72, alignItems:"start" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://leafcross.com/wp-content/uploads/2024/05/Final-by-Aaron-1.svg" alt="BLK Edition" style={{ width:"100%", maxWidth:400, height:"auto", mixBlendMode:"screen" }}/>
            </div>
            <div>
              {c.blkTabs.map(({ title, body }, i) => (
                <div key={i} style={{ borderBottom:"1px solid rgba(255,255,255,0.12)" }}>
                  <button onClick={()=>setBTab(bTab===i?null:i)} style={{ width:"100%", background:"none", border:"none", padding:"18px 0", textAlign:"left", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"space-between", gap:16 }}>
                    <span style={{ color: bTab===i?"#00f6ff":"rgba(255,255,255,0.38)", fontSize:"clamp(14px,1.8vw,20px)", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em" }}>
                      <EditableText value={title} onChange={v=>setTabItem("blkTabs",i,"title",v)} editMode={em} as="span"
                        style={{ color:"inherit", fontSize:"inherit", fontWeight:"inherit", letterSpacing:"inherit", textTransform:"inherit" as React.CSSProperties["textTransform"] }}/>
                    </span>
                    <span style={{ color: bTab===i?"#00f6ff":"rgba(255,255,255,0.3)", fontSize:20, transform: bTab===i?"rotate(45deg)":"none", display:"inline-block" }}>+</span>
                  </button>
                  {bTab===i && <p style={{ margin:"0 0 20px", color:"rgba(255,255,255,0.78)", fontSize:"clamp(13px,1.3vw,16px)", lineHeight:1.75, paddingRight:12 }}>
                    <EditableText value={body} onChange={v=>setTabItem("blkTabs",i,"body",v)} editMode={em} multiline as="span"
                      style={{ color:"rgba(255,255,255,0.78)", fontSize:"inherit", lineHeight:"inherit" }}/>
                  </p>}
                </div>
              ))}
            </div>
          </div>
          <div style={{ width:"min(860px,calc(100% - 80px))", margin:"64px auto", textAlign:"center" }}>
            <p style={{ margin:0, color:"rgba(255,255,255,0.82)", fontSize:"clamp(14px,1.4vw,17px)", lineHeight:1.8 }}>
              <EditableText value={c.blkBody} onChange={v=>set("blkBody",v)} editMode={em} multiline as="span"
                style={{ color:"rgba(255,255,255,0.82)", fontSize:"inherit", lineHeight:"inherit" }}/>
            </p>
          </div>
        </section>
      </Wrap>
    </div>
  );
}

function ServicesEditor({ c, set, setServiceCard, em }:
  { c: SiteContent; set: Setter; setServiceCard: (i:number,f:keyof ServiceCard,v:string)=>void; em: boolean }) {
  return (
    <div>
      <Wrap label="Services — Page Hero">
        <section style={{ position:"relative", minHeight:400, display:"flex", alignItems:"flex-end", justifyContent:"flex-start", overflow:"hidden", background:"#111" }}>
          <EditableImage src={c.servicesHeroImage} alt="Services hero" editMode={em}
            onChange={v=>set("servicesHeroImage",v)} style={{ position:"absolute", inset:0, height:"100%" }}/>
          <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.55)" }}/>
          <div style={{ position:"relative", zIndex:2, padding:"64px 48px" }}>
            <p style={{ margin:"0 0 10px", color:"rgba(255,255,255,0.5)", fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em" }}>Services</p>
            <h1 style={{ margin:"0 0 16px", color:"#fff", fontSize:"clamp(40px,7vw,90px)", fontWeight:800, textTransform:"uppercase", lineHeight:0.9 }}>
              <EditableText value={c.servicesHeroTitle} onChange={v=>set("servicesHeroTitle",v)} editMode={em} as="span"
                style={{ color:"#fff", fontSize:"inherit", fontWeight:"inherit", textTransform:"inherit" as React.CSSProperties["textTransform"] }}/>
            </h1>
            <p style={{ margin:0, color:"rgba(255,255,255,0.65)", fontSize:"clamp(14px,1.5vw,18px)", lineHeight:1.6, maxWidth:560 }}>
              <EditableText value={c.servicesHeroSubtitle} onChange={v=>set("servicesHeroSubtitle",v)} editMode={em} multiline as="span"
                style={{ color:"rgba(255,255,255,0.65)", fontSize:"inherit" }}/>
            </p>
          </div>
        </section>
      </Wrap>
      <Wrap label="Services — Service Cards">
        <section style={{ background:"#0a0a0a", padding:"80px 0" }}>
          <div style={{ width:"min(1100px,calc(100% - 40px))", margin:"0 auto", display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:24 }}>
            {c.servicesCards.map(({ title, body }, i) => (
              <div key={i} style={{ background:"#111", border:"1px solid rgba(255,255,255,0.07)", borderRadius:16, padding:"36px 32px" }}>
                <h2 style={{ margin:"0 0 14px", color:"#fff", fontSize:"clamp(20px,2.5vw,30px)", fontWeight:700 }}>
                  <EditableText value={title} onChange={v=>setServiceCard(i,"title",v)} editMode={em} as="span"
                    style={{ color:"#fff", fontSize:"inherit", fontWeight:"inherit" }}/>
                </h2>
                <p style={{ margin:0, color:"rgba(255,255,255,0.55)", fontSize:15, lineHeight:1.65 }}>
                  <EditableText value={body} onChange={v=>setServiceCard(i,"body",v)} editMode={em} multiline as="span"
                    style={{ color:"rgba(255,255,255,0.55)", fontSize:15, lineHeight:1.65 }}/>
                </p>
              </div>
            ))}
          </div>
        </section>
      </Wrap>
    </div>
  );
}

const RETAILER_STEPS = [
  { Icon: UserPlus,     label: "Register" },
  { Icon: LogIn,        label: "Login" },
  { Icon: ShoppingCart, label: "Order" },
  { Icon: CreditCard,   label: "Payment" },
  { Icon: Truck,        label: "Shipping" },
];

function RetailersEditor({ c, set, em }:
  { c: SiteContent; set: Setter; em: boolean }) {
  return (
    <div style={{ background:"#000" }}>
      {/* Hero + 5-step process + Note */}
      <Wrap label="Retailers — Page Header">
        <section style={{ padding:"80px 20px 60px", textAlign:"center" }}>
          <h1 style={{ margin:"0 0 32px", color:"#fff", fontSize:"clamp(56px,10vw,130px)", fontWeight:800, textTransform:"uppercase", letterSpacing:"-0.01em", lineHeight:0.95 }}>
            Retailers
          </h1>
          <p style={{ margin:"0 0 56px", color:"#fff", fontSize:"clamp(20px,3vw,32px)", fontWeight:500 }}>
            HOW{" "}
            <span style={{ color:"#00f6ff", fontWeight:700 }}>DIRECT DELIVERY</span>
            {" "}WORKS?
          </p>

          {/* 5-step process */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:0, flexWrap:"wrap", width:"min(900px,100%)", margin:"0 auto 56px" }}>
            {RETAILER_STEPS.map(({ Icon, label }, i) => (
              <div key={label} style={{ display:"flex", alignItems:"center" }}>
                <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:20, position:"relative" }}>
                  <span style={{ position:"absolute", top:-24, left:0, color:"rgba(255,255,255,0.6)", fontSize:13, fontWeight:600 }}>{i+1}</span>
                  <div style={{ width:100, height:100, borderRadius:"50%", background:"#00f6ff", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <Icon size={40} color="#000" strokeWidth={2}/>
                  </div>
                  <p style={{ margin:0, color:"#fff", fontSize:15, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em" }}>{label}</p>
                </div>
                {i < RETAILER_STEPS.length-1 && (
                  <div style={{ width:60, height:2, borderTop:"2px dashed rgba(255,255,255,0.3)", margin:"0 8px 28px", flexShrink:0 }}/>
                )}
              </div>
            ))}
          </div>

          {/* Note */}
          <div style={{ width:"min(860px,calc(100% - 40px))", margin:"0 auto 48px", textAlign:"center" }}>
            <p style={{ margin:0, color:"rgba(255,255,255,0.85)", fontSize:"clamp(14px,1.4vw,17px)", lineHeight:1.75 }}>
              <span style={{ color:"#00f6ff", fontWeight:700 }}>Note: </span>
              <EditableText value={c.retailersNote} onChange={v=>set("retailersNote",v)} editMode={em} multiline as="span"
                style={{ color:"rgba(255,255,255,0.85)", fontSize:"inherit", lineHeight:"inherit" }}/>
            </p>
          </div>
          <div style={{ borderTop:"1px solid rgba(255,255,255,0.12)", width:"min(900px,calc(100% - 40px))", margin:"0 auto" }}/>
        </section>
      </Wrap>

      {/* Login section */}
      <Wrap label="Retailers — Login Section">
        <section style={{ padding:"72px 24px 80px", textAlign:"center" }}>
          <h2 style={{ margin:"0 0 24px", color:"#fff", fontSize:"clamp(48px,8vw,100px)", fontWeight:800, textTransform:"uppercase", letterSpacing:"-0.01em" }}>Login</h2>
          <p style={{ margin:"0 0 36px", color:"rgba(255,255,255,0.55)", fontSize:18, lineHeight:1.6, maxWidth:480, marginInline:"auto" }}>
            <EditableText value={c.retailersLoginSubtitle} onChange={v=>set("retailersLoginSubtitle",v)} editMode={em} multiline as="span"
              style={{ color:"rgba(255,255,255,0.55)", fontSize:18, lineHeight:1.6 }}/>
          </p>
          <div style={{ display:"flex", gap:16, justifyContent:"center", flexWrap:"wrap" }}>
            <div style={{ display:"inline-flex", alignItems:"center", padding:"16px 48px", borderRadius:999, background:"#00f6ff" }}>
              <span style={{ color:"#000", fontSize:14, fontWeight:800, textTransform:"uppercase", letterSpacing:"0.1em" }}>Retailer Login</span>
            </div>
            <div style={{ display:"inline-flex", alignItems:"center", padding:"16px 48px", borderRadius:999, border:"1px solid rgba(255,255,255,0.3)" }}>
              <span style={{ color:"#fff", fontSize:14, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em" }}>Apply for Access</span>
            </div>
          </div>
        </section>
      </Wrap>
    </div>
  );
}

const B2B_ICONS = [Network, Package, Factory, Truck];

function B2BEditor({ c, set, em }:
  { c: SiteContent; set: Setter; em: boolean }) {
  const setService = (i: number, f: keyof B2BService, v: string) => {
    const updated = c.b2bServices.map((s, idx) => idx===i ? {...s,[f]:v} : s);
    set("b2bServices", updated);
  };
  return (
    <div style={{ background:"#000" }}>
      {/* Hero */}
      <Wrap label="B2B — Hero">
        <section style={{ padding:"80px 40px 48px" }}>
          <h1 style={{ margin:"0 0 16px", color:"#fff", fontSize:"clamp(52px,10vw,120px)", fontWeight:800, textTransform:"uppercase", letterSpacing:"-0.01em", lineHeight:0.9 }}>
            <EditableText value={c.b2bHeroTitle} onChange={v=>set("b2bHeroTitle",v)} editMode={em} as="span"
              style={{ color:"#fff", fontSize:"inherit", fontWeight:"inherit", textTransform:"inherit" as React.CSSProperties["textTransform"] }}/>
          </h1>
          <p style={{ margin:0, color:"#00f6ff", fontSize:"clamp(17px,2vw,24px)", fontWeight:600, fontStyle:"italic" }}>
            <EditableText value={c.b2bHeroSubtitle} onChange={v=>set("b2bHeroSubtitle",v)} editMode={em} as="span"
              style={{ color:"#00f6ff", fontSize:"inherit", fontWeight:"inherit" }}/>
          </p>
        </section>
      </Wrap>

      {/* Service cards carousel */}
      <Wrap label="B2B — Services Carousel">
        <section style={{ padding:"0 24px 96px" }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1.3fr 1fr", gap:20, alignItems:"center", maxWidth:1240, margin:"0 auto 48px" }}>
            {c.b2bServices.map(({ title, body }, i) => {
              const Icon = B2B_ICONS[i];
              const center = i === 1;
              return (
                <div key={i} style={{ background: center?"#0d0d0d":"#1b1b1b", borderRadius:16, padding: center?"60px 44px":"44px 30px", textAlign:"center", transform: center?"translateY(-24px)":"none", display:"flex", flexDirection:"column", alignItems:"center", gap:20 }}>
                  <Icon size={center?76:56} color="#00f6ff" strokeWidth={1.5}/>
                  <h3 style={{ margin:0, color:"#fff", fontSize: center?22:17, fontWeight:600 }}>
                    <EditableText value={title} onChange={v=>setService(i,"title",v)} editMode={em} as="span"
                      style={{ color:"#fff", fontSize:"inherit", fontWeight:"inherit" }}/>
                  </h3>
                  <p style={{ margin:0, color:"rgba(255,255,255,0.6)", fontSize: center?15:13, lineHeight:1.75 }}>
                    <EditableText value={body} onChange={v=>setService(i,"body",v)} editMode={em} multiline as="span"
                      style={{ color:"rgba(255,255,255,0.6)", fontSize:"inherit", lineHeight:"inherit" }}/>
                  </p>
                </div>
              );
            })}
          </div>
          <p style={{ textAlign:"center", color:"rgba(255,255,255,0.3)", fontSize:12, margin:0 }}>← Carousel on live site — all 4 cards shown above →</p>
        </section>
      </Wrap>

      {/* Why Work With Us */}
      <Wrap label="B2B — Why Work With Us">
        <section style={{ background:"#050706", padding:"88px 40px 100px", textAlign:"center", borderTop:"1px solid rgba(255,255,255,0.06)" }}>
          <h2 style={{ margin:"0 0 72px", color:"#fff", fontSize:"clamp(28px,5vw,68px)", fontWeight:300, textTransform:"uppercase", letterSpacing:"0.05em" }}>
            <EditableText value={c.b2bWhyTitle} onChange={v=>set("b2bWhyTitle",v)} editMode={em} as="span"
              style={{ color:"#fff", fontSize:"inherit", fontWeight:"inherit", textTransform:"inherit" as React.CSSProperties["textTransform"] }}/>
          </h2>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:36, maxWidth:1060, margin:"0 auto" }}>
            {c.b2bReasons.map(({ src, label }, i) => (
              <div key={i} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:24 }}>
                <EditableImage src={src} alt={label} editMode={em}
                  onChange={v=>{ const rs=[...c.b2bReasons]; rs[i]={...rs[i],src:v}; set("b2bReasons",rs); }}
                  style={{ width:140, height:140, flexShrink:0 }}
                  imgStyle={{ objectFit:"contain" }}/>
                <p style={{ margin:0, color:"rgba(255,255,255,0.9)", fontSize:16, fontWeight:500, lineHeight:1.45, maxWidth:180 }}>
                  <EditableText value={label} onChange={v=>{ const rs=[...c.b2bReasons]; rs[i]={...rs[i],label:v}; set("b2bReasons",rs); }}
                    editMode={em} as="span" style={{ color:"rgba(255,255,255,0.9)", fontSize:16 }}/>
                </p>
              </div>
            ))}
          </div>
        </section>
      </Wrap>
    </div>
  );
}

function B2BClientsEditor({ c, set, em }:
  { c: SiteContent; set: Setter; em: boolean }) {
  return (
    <div>
      <Wrap label="B2B Clients — Hero">
        <section style={{ position:"relative", minHeight:400, display:"flex", alignItems:"flex-end", overflow:"hidden", background:"#111" }}>
          <EditableImage src={c.b2bClientsHeroImage} alt="B2B Clients hero" editMode={em}
            onChange={v=>set("b2bClientsHeroImage",v)} style={{ position:"absolute", inset:0, height:"100%" }}/>
          <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.55)" }}/>
          <div style={{ position:"relative", zIndex:2, padding:"64px 48px" }}>
            <p style={{ margin:"0 0 10px", color:"rgba(255,255,255,0.5)", fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em" }}>B2B Clients</p>
            <h1 style={{ margin:"0 0 14px", color:"#fff", fontSize:"clamp(36px,7vw,80px)", fontWeight:800, textTransform:"uppercase", lineHeight:0.95 }}>
              <EditableText value={c.b2bClientsHeroTitle} onChange={v=>set("b2bClientsHeroTitle",v)} editMode={em} as="span"
                style={{ color:"#fff", fontSize:"inherit", fontWeight:"inherit", textTransform:"inherit" as React.CSSProperties["textTransform"] }}/>
            </h1>
            <p style={{ margin:0, color:"rgba(255,255,255,0.65)", fontSize:"clamp(14px,1.5vw,18px)", lineHeight:1.6, maxWidth:560 }}>
              <EditableText value={c.b2bClientsHeroSubtitle} onChange={v=>set("b2bClientsHeroSubtitle",v)} editMode={em} multiline as="span"
                style={{ color:"rgba(255,255,255,0.65)", fontSize:"inherit" }}/>
            </p>
          </div>
        </section>
      </Wrap>
      <Wrap label="B2B Clients — Service Icons">
        <section style={{ background:"#0a0a0a", padding:"80px 0" }}>
          <div style={{ width:"min(1100px,calc(100% - 40px))", margin:"0 auto", display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:32 }}>
            {c.b2bClientCards.map(({ image, title }, i) => (
              <div key={i} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:20, background:"#111", borderRadius:16, padding:"40px 24px", textAlign:"center" }}>
                <EditableImage src={image} alt={title} editMode={em}
                  onChange={v=>{ const cards=[...c.b2bClientCards]; cards[i]={...cards[i],image:v}; set("b2bClientCards",cards); }}
                  style={{ width:88, height:88, flexShrink:0 }}
                  imgStyle={{ objectFit:"contain" }}/>
                <h2 style={{ margin:0, color:"#fff", fontSize:15, fontWeight:700 }}>
                  <EditableText value={title} onChange={v=>{ const cards=[...c.b2bClientCards]; cards[i]={...cards[i],title:v}; set("b2bClientCards",cards); }}
                    editMode={em} as="span" style={{ color:"#fff", fontSize:15, fontWeight:700 }}/>
                </h2>
              </div>
            ))}
          </div>
        </section>
      </Wrap>
      <Wrap label="B2B Clients — Existing Clients">
        <section style={{ background:"#000", padding:"80px 0" }}>
          <div style={{ width:"min(1100px,calc(100% - 40px))", margin:"0 auto", display:"grid", gridTemplateColumns:"1fr 1fr", gap:64 }}>
            <div>
              <p style={{ margin:"0 0 12px", color:"rgba(255,255,255,0.4)", fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em" }}>Existing clients</p>
              <h2 style={{ margin:0, color:"#fff", fontSize:"clamp(28px,4vw,52px)", fontWeight:800, textTransform:"uppercase", lineHeight:1.1 }}>
                <EditableText value={c.b2bClientsExistingTitle} onChange={v=>set("b2bClientsExistingTitle",v)} editMode={em} as="span"
                  style={{ color:"#fff", fontSize:"inherit", fontWeight:"inherit", textTransform:"inherit" as React.CSSProperties["textTransform"] }}/>
              </h2>
            </div>
            <div>
              <p style={{ margin:0, color:"rgba(255,255,255,0.65)", fontSize:16, lineHeight:1.7 }}>
                <EditableText value={c.b2bClientsExistingBody} onChange={v=>set("b2bClientsExistingBody",v)} editMode={em} multiline as="span"
                  style={{ color:"rgba(255,255,255,0.65)", fontSize:16, lineHeight:1.7 }}/>
              </p>
            </div>
          </div>
        </section>
      </Wrap>
    </div>
  );
}

function ContactEditor({ c, set, em }:
  { c: SiteContent; set: Setter; em: boolean }) {
  return (
    <div>
      <Wrap label="Contact — Hero">
        <section style={{ position:"relative", minHeight:380, display:"flex", alignItems:"flex-end", overflow:"hidden", background:"#111" }}>
          <EditableImage src={c.contactHeroImage} alt="Contact hero" editMode={em}
            onChange={v=>set("contactHeroImage",v)} style={{ position:"absolute", inset:0, height:"100%" }}/>
          <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.55)" }}/>
          <div style={{ position:"relative", zIndex:2, padding:"64px 48px" }}>
            <p style={{ margin:"0 0 10px", color:"rgba(255,255,255,0.5)", fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em" }}>Contact Us</p>
            <h1 style={{ margin:"0 0 14px", color:"#fff", fontSize:"clamp(36px,7vw,80px)", fontWeight:800, textTransform:"uppercase", lineHeight:0.95 }}>
              <EditableText value={c.contactHeroTitle} onChange={v=>set("contactHeroTitle",v)} editMode={em} as="span"
                style={{ color:"#fff", fontSize:"inherit", fontWeight:"inherit", textTransform:"inherit" as React.CSSProperties["textTransform"] }}/>
            </h1>
            <p style={{ margin:0, color:"rgba(255,255,255,0.65)", fontSize:"clamp(14px,1.5vw,18px)", lineHeight:1.6, maxWidth:520 }}>
              <EditableText value={c.contactHeroSubtitle} onChange={v=>set("contactHeroSubtitle",v)} editMode={em} multiline as="span"
                style={{ color:"rgba(255,255,255,0.65)", fontSize:"inherit" }}/>
            </p>
          </div>
        </section>
      </Wrap>
      <Wrap label="Contact — Info">
        <section style={{ background:"#000", padding:"80px 0" }}>
          <div style={{ width:"min(1060px,calc(100% - 40px))", margin:"0 auto", display:"grid", gridTemplateColumns:"1fr 1fr", gap:64 }}>
            <div>
              <p style={{ margin:"0 0 10px", color:"rgba(255,255,255,0.4)", fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em" }}>Contact</p>
              <h2 style={{ margin:"0 0 20px", color:"#fff", fontSize:"clamp(28px,4vw,52px)", fontWeight:800, textTransform:"uppercase" }}>Leaf Cross Biomedical</h2>
              <p style={{ margin:"0 0 28px", color:"rgba(255,255,255,0.65)", fontSize:16, lineHeight:1.7 }}>
                <EditableText value={c.contactBodyText} onChange={v=>set("contactBodyText",v)} editMode={em} multiline as="span"
                  style={{ color:"rgba(255,255,255,0.65)", fontSize:16, lineHeight:1.7 }}/>
              </p>
              <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                {[
                  { label:"Email",   key:"contactEmail",   val:c.contactEmail },
                  { label:"Phone",   key:"contactPhone",   val:c.contactPhone },
                  { label:"Address", key:"contactAddress", val:c.contactAddress },
                ].map(({ label, key, val }) => (
                  <div key={key} style={{ display:"flex", gap:12, alignItems:"center" }}>
                    <span style={{ color:"rgba(255,255,255,0.35)", fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em", minWidth:64 }}>{label}</span>
                    <span style={{ color:"#fff", fontSize:15 }}>
                      <EditableText value={val} onChange={v=>set(key as keyof SiteContent, v as never)} editMode={em} as="span"
                        style={{ color:"#fff", fontSize:15 }}/>
                    </span>
                  </div>
                ))}
              </div>
            </div>
            {/* Form preview (not editable — structural) */}
            <div style={{ background:"rgba(255,255,255,0.03)", borderRadius:16, border:"1px solid rgba(255,255,255,0.07)", padding:"36px 32px", display:"flex", flexDirection:"column", gap:16 }}>
              {["Name","Email","Message"].map(f => (
                <div key={f}>
                  <p style={{ margin:"0 0 6px", color:"rgba(255,255,255,0.4)", fontSize:12, fontWeight:700, textTransform:"uppercase" }}>{f}</p>
                  <div style={{ height: f==="Message"?80:40, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:8 }}/>
                </div>
              ))}
              <div style={{ height:44, borderRadius:999, background:"#00f6ff", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <span style={{ color:"#000", fontSize:13, fontWeight:800, textTransform:"uppercase", letterSpacing:"0.1em" }}>Send Message</span>
              </div>
            </div>
          </div>
        </section>
      </Wrap>
    </div>
  );
}

function HeaderFooterEditor({ c, set, em }:
  { c: SiteContent; set: Setter; em: boolean }) {
  return (
    <div>
      <Wrap label="Header">
        <header style={{ background:"#fff", borderBottom:"1px solid #eee", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 40px", height:72 }}>
          <EditableImage src={c.header.logo} alt="Logo" editMode={em}
            onChange={v=>setNested2(set,c,"header","logo",v)}
            style={{ width:150, height:50 }} imgStyle={{ objectFit:"contain", height:"auto" }}/>
          <nav style={{ display:"flex", gap:28 }}>
            {["Retailer / B2B Login","About","Contact"].map(l => (
              <span key={l} style={{ color:"#000", fontSize:14, fontWeight:600 }}>{l}</span>
            ))}
          </nav>
        </header>
      </Wrap>

      <Wrap label="Footer">
        <footer style={{ background:"#111", borderTop:"1px solid rgba(255,255,255,0.07)", padding:"60px 40px 40px" }}>
          <div style={{ width:"min(1180px,calc(100% - 40px))", margin:"0 auto", display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr", gap:48 }}>
            <div>
              <EditableImage src={c.header.logo} alt="Logo" editMode={em}
                onChange={v=>setNested2(set,c,"header","logo",v)}
                style={{ width:160, height:54, marginBottom:16 }} imgStyle={{ objectFit:"contain", height:"auto" }}/>
              <p style={{ margin:0, color:"rgba(255,255,255,0.45)", fontSize:14, lineHeight:1.6 }}>
                <EditableText value={c.footer.tagline} onChange={v=>setNested2(set,c,"footer","tagline",v)} editMode={em} multiline as="span"
                  style={{ color:"rgba(255,255,255,0.45)", fontSize:14, lineHeight:1.6 }}/>
              </p>
            </div>
            {[["Company",["About","Brands","Services"]],["Partners",["Retailers","B2B","Contact"]],["Legal",["Privacy Policy","Terms of Use"]]].map(([heading, links]) => (
              <div key={heading as string}>
                <strong style={{ color:"rgba(255,255,255,0.5)", fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em", display:"block", marginBottom:14 }}>
                  {heading as string}
                </strong>
                {(links as string[]).map(l => (
                  <div key={l} style={{ marginBottom:8 }}>
                    <span style={{ color:"rgba(255,255,255,0.6)", fontSize:14 }}>{l}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </footer>
      </Wrap>
    </div>
  );
}

// ─── types for setters ───────────────────────────────────────────────────────
type Setter     = <K extends keyof SiteContent>(k: K, v: SiteContent[K]) => void;
type NestedSetter = (k: keyof SiteContent, sub: string, v: string) => void;
type TabSetter  = (kind: "alldayTabs"|"blkTabs", i: number, f: keyof TabItem, v: string) => void;

function setNested2<K extends keyof SiteContent>(
  set: Setter, c: SiteContent, key: K, sub: string, v: string
) {
  set(key, { ...(c[key] as Record<string,string>), [sub]: v } as SiteContent[K]);
}

// ─── main ────────────────────────────────────────────────────────────────────
const PAGES = ["Home","About","Brands","Retailers","B2B","Contact","Header & Footer"] as const;
type Page = typeof PAGES[number];

export default function WebsiteVisualEditor() {
  const searchParams = useSearchParams();
  const [content, setContent] = useState<SiteContent>(defaultSiteContent);
  const [editMode, setEditMode] = useState(true);
  const [page, setPage] = useState<Page>("Home");
  const [saved, setSaved] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [revertModal, setRevertModal] = useState(false);
  const [snapshotModal, setSnapshotModal] = useState(false);
  const [snapshotFlash, setSnapshotFlash] = useState(false);

  // Baseline: what Kill Switch reverts to. Loaded from localStorage so it survives refreshes.
  const [baseline, setBaseline] = useState<{ content: SiteContent; label: string } | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem("leafcross-site-baseline");
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  });

  const set: Setter = (k, v) => {
    setContent(prev => ({ ...prev, [k]: v }));
    setSaved(false);
  };

  const setNested: NestedSetter = (k, sub, v) => {
    setContent(prev => ({ ...prev, [k]: { ...(prev[k] as Record<string,string>), [sub]: v } }));
    setSaved(false);
  };

  const setTabItem: TabSetter = (kind, i, f, v) => {
    setContent(prev => ({ ...prev, [kind]: prev[kind].map((t, idx) => idx===i ? {...t,[f]:v} : t) }));
    setSaved(false);
  };

  const setAboutItem = (i: number, f: keyof AboutItem, v: string) => {
    setContent(prev => ({ ...prev, aboutSections: prev.aboutSections.map((s,idx) => idx===i ? {...s,[f]:v} : s) }));
    setSaved(false);
  };

  // Handle kill switch triggered from dashboard or ?action=snapshot from dashboard
  useEffect(() => {
    const killed = localStorage.getItem("leafcross-kill-triggered");
    if (killed === "1") {
      localStorage.removeItem("leafcross-kill-triggered");
      setContent(baseline ? baseline.content : defaultSiteContent);
      setConfirmed(true); // skip danger zone gate
      setSaved(false);
    }
    if (searchParams.get("action") === "snapshot") {
      setConfirmed(true); // skip danger zone gate, open editor so user can lock
      setSnapshotModal(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = () => {
    // TODO: persist to Supabase site_settings table
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleRevert = () => {
    setContent(baseline ? baseline.content : defaultSiteContent);
    setRevertModal(false);
    setSaved(false);
  };

  const handleSetSnapshot = () => {
    const now = new Date();
    const label = now.toLocaleString("en-CA", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
    const snap = { content, label };
    setBaseline(snap);
    try { localStorage.setItem("leafcross-site-baseline", JSON.stringify(snap)); } catch { /* storage full */ }
    setSnapshotModal(false);
    setSnapshotFlash(true);
    setTimeout(() => setSnapshotFlash(false), 2500);
  };

  const shared = { c: content, set, setNested, setTabItem, em: editMode };

  // ── Danger zone gate ────────────────────────────────────────────────────────
  if (!confirmed) {
    return (
      <div style={{
        minHeight:"100vh", background:"#000",
        display:"flex", alignItems:"center", justifyContent:"center", padding:24,
      }}>
        <div style={{
          background:"#111", border:"2px solid #ef4444",
          borderRadius:20, padding:"56px 48px", maxWidth:520, width:"100%", textAlign:"center",
        }}>
          {/* Warning icon */}
          <div style={{
            width:72, height:72, borderRadius:"50%",
            background:"rgba(239,68,68,0.12)", border:"2px solid rgba(239,68,68,0.4)",
            display:"flex", alignItems:"center", justifyContent:"center",
            margin:"0 auto 28px",
          }}>
            <span style={{ fontSize:32 }}>⚠️</span>
          </div>

          <p style={{ margin:"0 0 8px", color:"#ef4444", fontSize:11, fontWeight:800, textTransform:"uppercase", letterSpacing:"0.15em" }}>
            Danger Zone
          </p>
          <h2 style={{ margin:"0 0 20px", color:"#fff", fontSize:"clamp(22px,3vw,32px)", fontWeight:800, lineHeight:1.2 }}>
            You are entering the Website Editor
          </h2>
          <p style={{ margin:"0 0 36px", color:"rgba(255,255,255,0.55)", fontSize:15, lineHeight:1.7 }}>
            All changes made here are <strong style={{ color:"#fff" }}>live and final</strong>. There is no undo — once you save, the changes go directly to the website.
            <br/><br/>
            Make sure you know what you are editing before you save.
          </p>

          <div style={{ display:"flex", gap:12, justifyContent:"center" }}>
            <Link href="/admin" style={{
              display:"inline-flex", alignItems:"center", gap:6, padding:"12px 28px", borderRadius:10,
              border:"1px solid rgba(255,255,255,0.15)", background:"none",
              color:"rgba(255,255,255,0.5)", fontSize:14, fontWeight:700, textDecoration:"none",
            }}>
              <ArrowLeft size={15}/> Go Back
            </Link>
            <button
              onClick={() => setConfirmed(true)}
              style={{
                display:"flex", alignItems:"center", gap:6, padding:"12px 32px", borderRadius:10,
                border:"none", cursor:"pointer",
                background:"#ef4444", color:"#fff",
                fontSize:14, fontWeight:800, textTransform:"uppercase", letterSpacing:"0.06em",
              }}
            >
              I Understand — Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight:"100vh", background:"#f4f4f0" }}>

      {/* ── Revert confirmation modal ── */}
      {revertModal && (
        <div style={{
          position:"fixed", inset:0, zIndex:1000,
          background:"rgba(0,0,0,0.85)", backdropFilter:"blur(6px)",
          display:"flex", alignItems:"center", justifyContent:"center", padding:24,
        }}>
          <div style={{
            background:"#111", border:"2px solid #ef4444",
            borderRadius:20, padding:"52px 44px", maxWidth:480, width:"100%", textAlign:"center",
          }}>
            <div style={{
              width:68, height:68, borderRadius:"50%",
              background:"rgba(239,68,68,0.12)", border:"2px solid rgba(239,68,68,0.4)",
              display:"flex", alignItems:"center", justifyContent:"center",
              margin:"0 auto 24px",
            }}>
              <RotateCcw size={28} color="#ef4444"/>
            </div>
            <p style={{ margin:"0 0 6px", color:"#ef4444", fontSize:11, fontWeight:800, textTransform:"uppercase", letterSpacing:"0.15em" }}>
              Kill Switch
            </p>
            <h2 style={{ margin:"0 0 16px", color:"#fff", fontSize:"clamp(20px,3vw,28px)", fontWeight:800, lineHeight:1.2 }}>
              Revert All Changes?
            </h2>
            {baseline && (
              <div style={{ margin:"0 0 20px", background:"rgba(34,197,94,0.07)", border:"1px solid rgba(34,197,94,0.25)", borderRadius:10, padding:"10px 16px" }}>
                <p style={{ margin:0, color:"#22c55e", fontSize:12, fontWeight:700 }}>
                  <ShieldCheck size={12} style={{ verticalAlign:"middle", marginRight:6 }}/>
                  Reverting to locked snapshot: <strong>{baseline.label}</strong>
                </p>
              </div>
            )}
            <p style={{ margin:"0 0 32px", color:"rgba(255,255,255,0.5)", fontSize:14, lineHeight:1.7 }}>
              {baseline
                ? <>This will restore the website to the state you <strong style={{ color:"#fff" }}>locked in on {baseline.label}</strong>. All edits made since then will be wiped.</>
                : <>This will <strong style={{ color:"#fff" }}>undo every edit</strong> made in this session and restore the original default website content.</>
              }
            </p>
            <div style={{ display:"flex", gap:12, justifyContent:"center" }}>
              <button onClick={()=>setRevertModal(false)} style={{
                padding:"11px 28px", borderRadius:10,
                border:"1px solid rgba(255,255,255,0.15)", background:"none",
                color:"rgba(255,255,255,0.5)", fontSize:14, fontWeight:700, cursor:"pointer",
              }}>
                Cancel
              </button>
              <button onClick={handleRevert} style={{
                display:"flex", alignItems:"center", gap:7,
                padding:"11px 28px", borderRadius:10,
                border:"none", cursor:"pointer",
                background:"#ef4444", color:"#fff",
                fontSize:14, fontWeight:800, textTransform:"uppercase", letterSpacing:"0.06em",
              }}>
                <RotateCcw size={14}/> Yes, Revert Everything
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Set-as-live-state confirmation modal ── */}
      {snapshotModal && (
        <div style={{
          position:"fixed", inset:0, zIndex:1000,
          background:"rgba(0,0,0,0.85)", backdropFilter:"blur(6px)",
          display:"flex", alignItems:"center", justifyContent:"center", padding:24,
        }}>
          <div style={{
            background:"#111", border:"2px solid #22c55e",
            borderRadius:20, padding:"52px 44px", maxWidth:480, width:"100%", textAlign:"center",
          }}>
            <div style={{
              width:68, height:68, borderRadius:"50%",
              background:"rgba(34,197,94,0.1)", border:"2px solid rgba(34,197,94,0.4)",
              display:"flex", alignItems:"center", justifyContent:"center",
              margin:"0 auto 24px",
            }}>
              <ShieldCheck size={28} color="#22c55e"/>
            </div>
            <p style={{ margin:"0 0 6px", color:"#22c55e", fontSize:11, fontWeight:800, textTransform:"uppercase", letterSpacing:"0.15em" }}>
              Lock In State
            </p>
            <h2 style={{ margin:"0 0 16px", color:"#fff", fontSize:"clamp(20px,3vw,28px)", fontWeight:800, lineHeight:1.2 }}>
              Set This as the Live Baseline?
            </h2>
            <p style={{ margin:"0 0 32px", color:"rgba(255,255,255,0.5)", fontSize:14, lineHeight:1.7 }}>
              The <strong style={{ color:"#fff" }}>current state of the editor</strong> will be saved as the new revert target.
              <br/><br/>
              From now on, the <strong style={{ color:"#fff" }}>Kill Switch</strong> will restore the website to <em>this</em> exact state — not the original default.
            </p>
            <div style={{ display:"flex", gap:12, justifyContent:"center" }}>
              <button onClick={()=>setSnapshotModal(false)} style={{
                padding:"11px 28px", borderRadius:10,
                border:"1px solid rgba(255,255,255,0.15)", background:"none",
                color:"rgba(255,255,255,0.5)", fontSize:14, fontWeight:700, cursor:"pointer",
              }}>
                Cancel
              </button>
              <button onClick={handleSetSnapshot} style={{
                display:"flex", alignItems:"center", gap:7,
                padding:"11px 28px", borderRadius:10,
                border:"none", cursor:"pointer",
                background:"#22c55e", color:"#000",
                fontSize:14, fontWeight:800, textTransform:"uppercase", letterSpacing:"0.06em",
              }}>
                <ShieldCheck size={14}/> Lock In This State
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Top bar ── */}
      <div style={{ position:"sticky", top:0, zIndex:50, background:"#0a0a0a", borderBottom:"1px solid rgba(255,255,255,0.1)", display:"flex", alignItems:"center", gap:12, padding:"0 20px", height:54 }}>
        <Link href="/admin" style={{ display:"flex", alignItems:"center", gap:5, color:"rgba(255,255,255,0.5)", fontSize:13, fontWeight:600, textDecoration:"none", flexShrink:0 }}>
          <ArrowLeft size={14}/> Admin
        </Link>
        <span style={{ color:"rgba(255,255,255,0.12)" }}>|</span>
        <span style={{ color:"#fff", fontSize:14, fontWeight:700, flexShrink:0 }}>Website Editor</span>
        <div style={{ flex:1 }}/>
        {editMode && <span style={{ color:"rgba(255,255,255,0.35)", fontSize:12, flexShrink:0 }}>Click any text or image to edit</span>}
        <button onClick={()=>setSnapshotModal(true)} style={{
          display:"flex", alignItems:"center", gap:5, padding:"6px 14px", borderRadius:7,
          border:"1px solid rgba(34,197,94,0.4)",
          background: snapshotFlash ? "rgba(34,197,94,0.25)" : "rgba(34,197,94,0.07)",
          color: snapshotFlash ? "#22c55e" : "rgba(34,197,94,0.8)",
          fontSize:12, fontWeight:700, cursor:"pointer", textTransform:"uppercase", letterSpacing:"0.06em", flexShrink:0,
          transition:"background 0.3s, color 0.3s",
        }}>
          {snapshotFlash ? <><Check size={12} strokeWidth={3}/> Locked!</> : <><ShieldCheck size={12}/> {baseline ? `Locked: ${baseline.label}` : "Lock In State"}</>}
        </button>
        <button onClick={()=>setRevertModal(true)} style={{
          display:"flex", alignItems:"center", gap:5, padding:"6px 14px", borderRadius:7,
          border:"1px solid rgba(239,68,68,0.4)",
          background:"rgba(239,68,68,0.08)",
          color:"#ef4444",
          fontSize:12, fontWeight:700, cursor:"pointer", textTransform:"uppercase", letterSpacing:"0.06em", flexShrink:0,
        }}>
          <RotateCcw size={12}/> Kill Switch
        </button>
        <button onClick={()=>setEditMode(v=>!v)} style={{
          display:"flex", alignItems:"center", gap:5, padding:"6px 14px", borderRadius:7,
          border:"1px solid rgba(255,255,255,0.18)",
          background: editMode?"rgba(0,246,255,0.1)":"transparent",
          color: editMode?"#00f6ff":"rgba(255,255,255,0.45)",
          fontSize:12, fontWeight:700, cursor:"pointer", textTransform:"uppercase", letterSpacing:"0.06em", flexShrink:0,
        }}>
          {editMode ? <><EyeOff size={13}/> Stop Editing</> : <><Eye size={13}/> Edit Mode</>}
        </button>
        <button onClick={handleSave} style={{
          display:"flex", alignItems:"center", gap:5, padding:"7px 18px", borderRadius:7, border:"none", cursor:"pointer",
          background: saved?"#16a34a":"#00f6ff", color:"#000", fontSize:12, fontWeight:800,
          textTransform:"uppercase", letterSpacing:"0.06em", transition:"background 0.2s", flexShrink:0,
        }}>
          {saved ? <><Check size={13} strokeWidth={3}/> Saved!</> : <><Save size={13}/> Save All</>}
        </button>
      </div>

      {/* ── Page tabs ── */}
      <div style={{ position:"sticky", top:54, zIndex:40, background:"#1a1a1a", borderBottom:"1px solid rgba(255,255,255,0.08)", display:"flex", overflowX:"auto" }}>
        {PAGES.map(p => (
          <button key={p} onClick={()=>setPage(p)} style={{
            flexShrink:0, background:"none", border:"none", cursor:"pointer",
            padding:"12px 18px", fontSize:13, fontWeight:700,
            textTransform:"uppercase", letterSpacing:"0.06em",
            color: page===p?"#00f6ff":"rgba(255,255,255,0.35)",
            borderBottom: page===p?"2px solid #00f6ff":"2px solid transparent",
            whiteSpace:"nowrap",
          }}>
            {p}
          </button>
        ))}
      </div>

      {/* ── Page content ── */}
      <div>
        {page==="Home"            && <HomeEditor       {...shared}/>}
        {page==="About"           && <AboutEditor      c={content} set={set} setAboutItem={setAboutItem} em={editMode}/>}
        {page==="Brands"          && <BrandsEditor     {...shared}/>}
        {page==="Retailers"       && <RetailersEditor  c={content} set={set} em={editMode}/>}
        {page==="B2B"             && <B2BEditor        c={content} set={set} em={editMode}/>}
        {page==="Contact"         && <ContactEditor    c={content} set={set} em={editMode}/>}
        {page==="Header & Footer" && <HeaderFooterEditor c={content} set={set} em={editMode}/>}
      </div>

      {/* ── Bottom save bar ── */}
      <div style={{ position:"sticky", bottom:0, zIndex:50, background:"#0a0a0a", borderTop:"1px solid rgba(255,255,255,0.08)", display:"flex", alignItems:"center", justifyContent:"flex-end", padding:"10px 20px", gap:12 }}>
        <span style={{ color:"rgba(255,255,255,0.3)", fontSize:12, flex:1 }}>
          {editMode ? "Edit mode ON — click any text or photo to change it" : "Edit mode is OFF"}
        </span>
        <button onClick={handleSave} style={{
          display:"flex", alignItems:"center", gap:6, padding:"9px 26px", borderRadius:8, border:"none", cursor:"pointer",
          background: saved?"#16a34a":"#00f6ff", color:"#000", fontSize:13, fontWeight:800,
          textTransform:"uppercase", letterSpacing:"0.06em", transition:"background 0.2s",
        }}>
          {saved ? <><Check size={14} strokeWidth={3}/> Saved!</> : <><Save size={14}/> Save All Changes</>}
        </button>
      </div>
    </div>
  );
}
