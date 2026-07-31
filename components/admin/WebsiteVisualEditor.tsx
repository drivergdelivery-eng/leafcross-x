"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Check, Save, ArrowLeft, Pencil, X, Camera, Eye, EyeOff,
  UserPlus, LogIn, ShoppingCart, CreditCard, Truck,
  Network, Package, Factory, Plus, Trash2,
} from "lucide-react";
import { defaultSiteContent, type SiteContent, type B2BService, type ServiceCard, type PhaseItem, type B2BReason, type StrainItem, type BrandItem, type CraftIcon } from "@/lib/data/siteContent";

// ─── Editable Text ────────────────────────────────────────────────────────────

function ET({
  value, onChange, em, multiline = false, style, tag: Tag = "span",
}: {
  value: string; onChange: (v: string) => void; em: boolean;
  multiline?: boolean; style?: React.CSSProperties; tag?: keyof React.JSX.IntrinsicElements;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const commit = () => { onChange(draft); setEditing(false); };
  const cancel = () => { setDraft(value); setEditing(false); };

  useEffect(() => { if (!editing) setDraft(value); }, [value, editing]);

  if (!em) { const El = Tag as "span"; return <El style={style}>{value}</El>; }
  if (editing) {
    const base: React.CSSProperties = { background:"rgba(0,0,0,0.92)", border:"2px solid #00f6ff", borderRadius:6, color:"#fff", fontSize:"inherit", fontWeight:"inherit", fontFamily:"inherit", letterSpacing:"inherit", lineHeight:"inherit", padding:"6px 10px", outline:"none", width:"100%", boxSizing:"border-box" };
    return (
      <span style={{ display:"inline-block", position:"relative", width:"100%" }}>
        {multiline
          ? <textarea autoFocus value={draft} rows={3} onChange={e => setDraft(e.target.value)} style={{ ...base, resize:"vertical", display:"block" }} />
          : <input autoFocus value={draft} onChange={e => setDraft(e.target.value)} onKeyDown={e => { if (e.key==="Enter") commit(); if (e.key==="Escape") cancel(); }} style={base} />
        }
        <span style={{ display:"flex", gap:6, marginTop:6 }}>
          <button onClick={commit} style={{ display:"flex", alignItems:"center", gap:4, padding:"4px 12px", borderRadius:6, border:"none", cursor:"pointer", background:"#00f6ff", color:"#000", fontSize:12, fontWeight:800 }}><Check size={12}/> Save</button>
          <button onClick={cancel} style={{ display:"flex", alignItems:"center", gap:4, padding:"4px 10px", borderRadius:6, border:"1px solid rgba(255,255,255,0.2)", background:"none", color:"rgba(255,255,255,0.6)", fontSize:12, cursor:"pointer" }}><X size={12}/> Cancel</button>
        </span>
      </span>
    );
  }
  const El = Tag as "span";
  return (
    <El onClick={() => { setDraft(value); setEditing(true); }} title="Click to edit"
      style={{ ...style, cursor:"text", outline:"1.5px dashed rgba(0,246,255,0.5)", outlineOffset:2, borderRadius:3 }}>
      {value}<Pencil size={10} style={{ marginLeft:5, verticalAlign:"middle", color:"rgba(0,246,255,0.8)" }}/>
    </El>
  );
}

// ─── Editable Image ───────────────────────────────────────────────────────────

function EI({
  src, alt, em, onChange, style, imgStyle,
}: {
  src: string; alt: string; em: boolean; onChange: (url: string) => void;
  style?: React.CSSProperties; imgStyle?: React.CSSProperties;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState(src);
  const [uploading, setUploading] = useState(false);

  useEffect(() => { setPreview(src); }, [src]);

  const handleFile = async (f: File) => {
    setUploading(true);
    setPreview(URL.createObjectURL(f));
    const fd = new FormData();
    fd.append("file", f);
    try {
      const res = await fetch("/api/admin/upload-image", { method:"POST", body:fd });
      const json = await res.json();
      if (json.url) { setPreview(json.url); onChange(json.url); }
      else setPreview(src);
    } catch { setPreview(src); }
    finally { setUploading(false); }
  };

  return (
    <div style={{ position:"relative", ...style }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={preview} alt={alt} style={{ width:"100%", height:"100%", objectFit:"cover", display:"block", ...imgStyle }} />
      {em && (
        <div onClick={() => !uploading && fileRef.current?.click()}
          style={{ position:"absolute", inset:0, background:uploading?"rgba(0,0,0,0.7)":"rgba(0,0,0,0.55)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:8, cursor:uploading?"wait":"pointer", opacity:0, transition:"opacity 0.2s", zIndex:5 }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity="1"}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity="0"}>
          <Camera size={28} color="#00f6ff"/>
          <span style={{ color:"#fff", fontSize:12, fontWeight:700 }}>{uploading ? "Uploading…" : "Replace Photo"}</span>
        </div>
      )}
      <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={e => { const f=e.target.files?.[0]; if(f) handleFile(f); e.target.value=""; }}/>
    </div>
  );
}

// ─── Section label wrapper ────────────────────────────────────────────────────

function Wrap({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ position:"relative", marginBottom:2 }}>
      <div style={{ position:"absolute", top:10, left:10, zIndex:10, background:"rgba(0,246,255,0.12)", border:"1px solid rgba(0,246,255,0.35)", color:"#00f6ff", fontSize:10, fontWeight:800, textTransform:"uppercase", letterSpacing:"0.1em", padding:"3px 10px", borderRadius:999, pointerEvents:"none" }}>
        {label}
      </div>
      {children}
    </div>
  );
}

type Setter = <K extends keyof SiteContent>(k: K, v: SiteContent[K]) => void;

// ─── HOME ─────────────────────────────────────────────────────────────────────

function HomeEditor({ c, set, em }: { c: SiteContent; set: Setter; em: boolean }) {
  const updateCraftIcon = (i: number, f: keyof CraftIcon, v: string) =>
    set("craftIcons", c.craftIcons.map((ic, idx) => idx === i ? { ...ic, [f]: v } : ic));

  const updateStrain = (i: number, f: keyof StrainItem, v: string) =>
    set("phenoStrains", c.phenoStrains.map((s, idx) => idx === i ? { ...s, [f]: v } : s));

  const removeStrain = (i: number) =>
    set("phenoStrains", c.phenoStrains.filter((_, idx) => idx !== i));

  const updateBrand = (i: number, f: keyof BrandItem, v: string) =>
    set("homeBrands", c.homeBrands.map((b, idx) => idx === i ? { ...b, [f]: v } : b));

  const updateGrowSlide = (i: number, url: string) =>
    set("growSlides", c.growSlides.map((s, idx) => idx === i ? url : s));

  const removeGrowSlide = (i: number) =>
    set("growSlides", c.growSlides.filter((_, idx) => idx !== i));

  const uploadImage = async (file: File, onDone: (url: string) => void) => {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload-image", { method: "POST", body: fd });
    const json = await res.json();
    if (json.url) onDone(json.url);
  };

  return (
    <>
      {/* ── Header preview ── */}
      <Wrap label="Header — Logo (also editable in Header & Footer tab)">
        <header style={{ background:"#000", borderBottom:"1px solid rgba(255,255,255,0.1)", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 40px", height:72 }}>
          <EI src={c.header.logo} alt="Logo" em={em} onChange={v=>set("header",{...c.header,logo:v})} style={{ width:180, height:52 }} imgStyle={{ objectFit:"contain", objectPosition:"left center", height:"auto" }}/>
          <nav style={{ display:"flex", gap:28 }}>
            {["Retail Partner Login","About","Contact"].map(l=><span key={l} style={{ color:"rgba(255,255,255,0.7)", fontSize:14, fontWeight:600 }}>{l}</span>)}
          </nav>
        </header>
      </Wrap>

      {/* ── Hero ── */}
      <Wrap label="Homepage — Hero">
        <section style={{ position:"relative", minHeight:"70vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#0a0a0a", overflow:"hidden" }}>
          <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom,rgba(0,0,0,0.4),rgba(0,0,0,0.7))" }}/>
          <div style={{ position:"relative", zIndex:2, textAlign:"center", padding:"0 24px", maxWidth:900 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/extracted/hero-frame.png" alt="Leaf Cross" style={{ width:"100%", maxWidth:640, height:"auto", marginBottom:24 }}/>
            <p style={{ color:"rgba(255,255,255,0.85)", fontSize:"clamp(14px,1.6vw,18px)", lineHeight:1.6, margin:"0 0 32px" }}>
              <ET value={c.heroLicense} onChange={v=>set("heroLicense",v)} em={em} style={{ color:"inherit", fontSize:"inherit", lineHeight:"inherit" }}/>
            </p>
            <div style={{ display:"flex", gap:16, justifyContent:"center", flexWrap:"wrap" }}>
              <div style={{ display:"inline-flex", alignItems:"center", padding:"13px 28px", borderRadius:999, background:"#00f6ff" }}>
                <ET value={c.heroCtaPrimary} onChange={v=>set("heroCtaPrimary",v)} em={em} style={{ color:"#000", fontSize:14, fontWeight:800, textTransform:"uppercase", letterSpacing:"0.08em" }}/>
              </div>
              <div style={{ display:"inline-flex", alignItems:"center", padding:"13px 28px", borderRadius:999, border:"1px solid rgba(255,255,255,0.5)" }}>
                <ET value={c.heroCtaSecondary} onChange={v=>set("heroCtaSecondary",v)} em={em} style={{ color:"#fff", fontSize:14, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em" }}/>
              </div>
            </div>
          </div>
        </section>
      </Wrap>

      {/* ── Craft Process ── */}
      <Wrap label="Homepage — Craft Process">
        <section style={{ background:"#0a0a0a", padding:"80px 40px 72px" }}>
          <p style={{ textAlign:"center", margin:"0 0 8px", color:"#00f6ff", fontSize:11, fontWeight:800, textTransform:"uppercase", letterSpacing:"0.18em" }}>
            <ET value={c.craftEyebrow} onChange={v=>set("craftEyebrow",v)} em={em} style={{ color:"inherit", fontSize:"inherit" }}/>
          </p>
          <h2 style={{ textAlign:"center", margin:"0 0 56px", color:"#fff", fontSize:"clamp(26px,3.5vw,40px)", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.06em" }}>
            <ET value={c.craftTitle} onChange={v=>set("craftTitle",v)} em={em} tag="span" style={{ color:"#fff", fontSize:"inherit", fontWeight:"inherit", textTransform:"inherit" as React.CSSProperties["textTransform"] }}/>
          </h2>
          <div style={{ display:"flex", justifyContent:"center", alignItems:"flex-start", gap:32, flexWrap:"wrap" }}>
            {c.craftIcons.map((icon, i) => (
              <div key={i} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:10, width:160 }}>
                <EI src={icon.src} alt={icon.alt} em={em} onChange={v=>updateCraftIcon(i,"src",v)} style={{ width:140, height:140 }} imgStyle={{ objectFit:"contain" }}/>
                <p style={{ margin:0, color:"rgba(255,255,255,0.7)", fontSize:12, fontWeight:600, textAlign:"center", textTransform:"uppercase", letterSpacing:"0.06em" }}>
                  <ET value={icon.alt} onChange={v=>updateCraftIcon(i,"alt",v)} em={em} style={{ color:"inherit", fontSize:"inherit" }}/>
                </p>
              </div>
            ))}
          </div>
        </section>
      </Wrap>

      {/* ── Pheno Hunt Gallery ── */}
      <Wrap label="Homepage — Pheno Hunt Gallery">
        <section style={{ background:"#050505", padding:"72px 40px 80px" }}>
          <div style={{ maxWidth:1180, margin:"0 auto" }}>
            <p style={{ margin:"0 0 8px", color:"#00f6ff", fontSize:11, fontWeight:800, textTransform:"uppercase", letterSpacing:"0.18em" }}>
              <ET value={c.phenoGalleryEyebrow} onChange={v=>set("phenoGalleryEyebrow",v)} em={em} style={{ color:"inherit", fontSize:"inherit" }}/>
            </p>
            <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", gap:24, marginBottom:36, flexWrap:"wrap" }}>
              <h2 style={{ margin:0, color:"#fff", fontSize:"clamp(28px,4vw,48px)", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.06em" }}>
                <ET value={c.phenoGalleryTitle} onChange={v=>set("phenoGalleryTitle",v)} em={em} tag="span" style={{ color:"#fff", fontSize:"inherit", fontWeight:"inherit", textTransform:"inherit" as React.CSSProperties["textTransform"] }}/>
              </h2>
              <p style={{ margin:0, color:"rgba(255,255,255,0.45)", fontSize:15, maxWidth:400, lineHeight:1.6 }}>
                <ET value={c.phenoGalleryDesc} onChange={v=>set("phenoGalleryDesc",v)} em={em} multiline style={{ color:"inherit", fontSize:"inherit" }}/>
              </p>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))", gap:12 }}>
              {c.phenoStrains.map((strain, i) => (
                <div key={i} style={{ position:"relative", borderRadius:12, overflow:"hidden", aspectRatio:"3/4" }}>
                  <EI src={strain.src} alt={strain.name || "Strain"} em={em} onChange={v=>updateStrain(i,"src",v)} style={{ position:"absolute", inset:0, height:"100%" }} imgStyle={{ objectFit:"cover" }}/>
                  <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"24px 10px 10px", background:"linear-gradient(transparent,rgba(0,0,0,0.8))", zIndex:2 }}>
                    <p style={{ margin:0, color:"#fff", fontSize:11, fontWeight:800, textTransform:"uppercase", letterSpacing:"0.08em" }}>
                      <ET value={strain.name} onChange={v=>updateStrain(i,"name",v)} em={em} style={{ color:"inherit", fontSize:"inherit" }}/>
                    </p>
                  </div>
                  {em && (
                    <button onClick={()=>removeStrain(i)} style={{ position:"absolute", top:6, right:6, zIndex:10, width:24, height:24, borderRadius:"50%", background:"rgba(239,68,68,0.85)", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <Trash2 size={12} color="#fff"/>
                    </button>
                  )}
                </div>
              ))}
              {em && (
                <label style={{ borderRadius:12, border:"2px dashed rgba(0,246,255,0.3)", aspectRatio:"3/4", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:8, cursor:"pointer", background:"rgba(0,246,255,0.03)" }}>
                  <Plus size={24} color="#00f6ff"/>
                  <span style={{ color:"#00f6ff", fontSize:11, fontWeight:700, textTransform:"uppercase" }}>Add Photo</span>
                  <input type="file" accept="image/*" style={{ display:"none" }} onChange={async e=>{
                    const f=e.target.files?.[0]; if(!f) return; e.target.value="";
                    await uploadImage(f, url => set("phenoStrains",[...c.phenoStrains,{src:url,name:""}]));
                  }}/>
                </label>
              )}
            </div>
          </div>
        </section>
      </Wrap>

      {/* ── Philosophy ── */}
      <Wrap label="Homepage — Philosophy">
        <section style={{ background:"#0a0a0a", padding:"80px 40px" }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:64, maxWidth:1180, margin:"0 auto" }}>
            <div>
              <p style={{ color:"#00f6ff", fontSize:11, fontWeight:800, textTransform:"uppercase", letterSpacing:"0.18em", margin:"0 0 10px" }}>Our Philosophy</p>
              <h2 style={{ color:"#fff", fontSize:"clamp(22px,3vw,38px)", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.05em", lineHeight:1.1, margin:"0 0 20px" }}>
                <ET value={c.phenoHuntTitle} onChange={v=>set("phenoHuntTitle",v)} em={em} tag="span" style={{ color:"#fff", fontSize:"inherit", fontWeight:"inherit", textTransform:"inherit" as React.CSSProperties["textTransform"] }}/>
              </h2>
              <p style={{ color:"rgba(255,255,255,0.6)", fontSize:15, lineHeight:1.75, margin:"0 0 28px" }}>
                <ET value={c.phenoHuntBody} onChange={v=>set("phenoHuntBody",v)} em={em} multiline style={{ color:"inherit", fontSize:"inherit", lineHeight:"inherit" }}/>
              </p>
              <div style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"11px 22px", borderRadius:6, border:"1.5px solid #00f6ff", color:"#00f6ff", fontSize:13, fontWeight:800, textTransform:"uppercase", letterSpacing:"0.06em" }}>
                <ET value={c.phenoHuntCta} onChange={v=>set("phenoHuntCta",v)} em={em} style={{ color:"inherit", fontSize:"inherit", fontWeight:"inherit" }}/>
              </div>
            </div>
            <div style={{ paddingLeft:48, borderLeft:"1px solid rgba(0,246,255,0.2)" }}>
              <p style={{ color:"#00f6ff", fontSize:11, fontWeight:800, textTransform:"uppercase", letterSpacing:"0.18em", margin:"0 0 10px" }}>Partner With Us</p>
              <h2 style={{ color:"#fff", fontSize:"clamp(20px,2.5vw,34px)", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.05em", lineHeight:1.15, margin:"0 0 20px" }}>
                <ET value={c.partnerTitle} onChange={v=>set("partnerTitle",v)} em={em} tag="span" style={{ color:"#fff", fontSize:"inherit", fontWeight:"inherit", textTransform:"inherit" as React.CSSProperties["textTransform"] }}/>
              </h2>
              <p style={{ color:"rgba(255,255,255,0.6)", fontSize:15, lineHeight:1.75, margin:"0 0 28px" }}>
                <ET value={c.partnerBody} onChange={v=>set("partnerBody",v)} em={em} multiline style={{ color:"inherit", fontSize:"inherit", lineHeight:"inherit" }}/>
              </p>
              <span style={{ color:"#00f6ff", fontSize:14, fontWeight:600, textDecoration:"underline", textUnderlineOffset:3 }}>
                <ET value={c.partnerCta} onChange={v=>set("partnerCta",v)} em={em} style={{ color:"inherit", fontSize:"inherit", fontWeight:"inherit" }}/>
              </span>
            </div>
          </div>
        </section>
      </Wrap>

      {/* ── Brand Cards ── */}
      <Wrap label="Homepage — Brand Cards">
        <section style={{ background:"#000", padding:"96px 40px" }}>
          <div style={{ maxWidth:1180, margin:"0 auto" }}>
            <div style={{ textAlign:"center", marginBottom:64 }}>
              <p style={{ margin:"0 0 10px", color:"#00f6ff", fontSize:11, fontWeight:800, textTransform:"uppercase", letterSpacing:"0.18em" }}>
                <ET value={c.brandsEyebrow} onChange={v=>set("brandsEyebrow",v)} em={em} style={{ color:"inherit", fontSize:"inherit" }}/>
              </p>
              <h2 style={{ margin:0, color:"#fff", fontSize:"clamp(28px,4vw,48px)", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.06em" }}>
                <ET value={c.brandsTitle} onChange={v=>set("brandsTitle",v)} em={em} tag="span" style={{ color:"#fff", fontSize:"inherit", fontWeight:"inherit", textTransform:"inherit" as React.CSSProperties["textTransform"] }}/>
              </h2>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))", gap:20 }}>
              {c.homeBrands.map((brand, i) => (
                <div key={i} style={{ background:"#0d0d0d", border:`1px solid ${brand.accent}40`, borderRadius:16, padding:"40px 32px 36px", overflow:"hidden", position:"relative" }}>
                  <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:brand.accent, borderRadius:"16px 16px 0 0" }}/>
                  <EI src={brand.logo} alt={brand.name} em={em} onChange={v=>updateBrand(i,"logo",v)} style={{ width:"100%", height:72, marginBottom:28 }} imgStyle={{ objectFit:"contain", objectPosition:"left center" }}/>
                  <h3 style={{ margin:"0 0 10px", color:"#fff", fontSize:18, fontWeight:800, textTransform:"uppercase", letterSpacing:"0.05em", lineHeight:1.15 }}>
                    <ET value={brand.name} onChange={v=>updateBrand(i,"name",v)} em={em} style={{ color:"#fff", fontSize:"inherit", fontWeight:"inherit", textTransform:"inherit" as React.CSSProperties["textTransform"] }}/>
                  </h3>
                  <p style={{ margin:0, color:"rgba(255,255,255,0.45)", fontSize:13, lineHeight:1.6 }}>
                    <ET value={brand.tagline} onChange={v=>updateBrand(i,"tagline",v)} em={em} multiline style={{ color:"inherit", fontSize:"inherit" }}/>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Wrap>

      {/* ── Grow Slideshow ── */}
      <Wrap label="Homepage — Grow Photos">
        <section style={{ background:"#050706", padding:"80px 40px" }}>
          <div style={{ maxWidth:1180, margin:"0 auto" }}>
            <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", gap:24, marginBottom:40, flexWrap:"wrap" }}>
              <div>
                <p style={{ color:"rgba(255,255,255,0.35)", fontSize:13, fontWeight:700, textTransform:"uppercase", margin:"0 0 10px" }}>
                  <ET value={c.growEyebrow} onChange={v=>set("growEyebrow",v)} em={em} style={{ color:"inherit", fontSize:"inherit" }}/>
                </p>
                <h2 style={{ margin:0, fontSize:"clamp(38px,6vw,80px)", lineHeight:0.92, textTransform:"uppercase", color:"#fff" }}>
                  <ET value={c.growTitle} onChange={v=>set("growTitle",v)} em={em} tag="span" style={{ color:"#fff", fontSize:"inherit", fontWeight:"inherit", textTransform:"inherit" as React.CSSProperties["textTransform"] }}/>
                </h2>
              </div>
              <p style={{ maxWidth:420, color:"rgba(255,255,255,0.62)", fontSize:18, lineHeight:1.5, margin:0 }}>
                <ET value={c.growDesc} onChange={v=>set("growDesc",v)} em={em} multiline style={{ color:"inherit", fontSize:"inherit" }}/>
              </p>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))", gap:10 }}>
              {c.growSlides.map((src, i) => (
                <div key={i} style={{ position:"relative", borderRadius:12, overflow:"hidden", aspectRatio:"3/4", background:"#0b0d0b" }}>
                  <EI src={src} alt={`Grow photo ${i+1}`} em={em} onChange={v=>updateGrowSlide(i,v)} style={{ position:"absolute", inset:0, height:"100%" }} imgStyle={{ objectFit:"cover" }}/>
                  {em && (
                    <button onClick={()=>removeGrowSlide(i)} style={{ position:"absolute", top:6, right:6, zIndex:10, width:24, height:24, borderRadius:"50%", background:"rgba(239,68,68,0.85)", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <Trash2 size={12} color="#fff"/>
                    </button>
                  )}
                </div>
              ))}
              {em && (
                <label style={{ borderRadius:12, border:"2px dashed rgba(0,246,255,0.3)", aspectRatio:"3/4", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:8, cursor:"pointer", background:"rgba(0,246,255,0.03)" }}>
                  <Plus size={24} color="#00f6ff"/>
                  <span style={{ color:"#00f6ff", fontSize:11, fontWeight:700, textTransform:"uppercase" }}>Add Photo</span>
                  <input type="file" accept="image/*" style={{ display:"none" }} onChange={async e=>{
                    const f=e.target.files?.[0]; if(!f) return; e.target.value="";
                    await uploadImage(f, url => set("growSlides",[...c.growSlides,url]));
                  }}/>
                </label>
              )}
            </div>
          </div>
        </section>
      </Wrap>

      {/* ── Footer preview ── */}
      <Wrap label="Footer — Tagline (also editable in Header & Footer tab)">
        <footer style={{ background:"#111", borderTop:"1px solid rgba(255,255,255,0.07)", padding:"56px 40px 40px" }}>
          <div style={{ maxWidth:1180, margin:"0 auto", display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr", gap:48 }}>
            <div>
              <EI src={c.header.logo} alt="Logo" em={em} onChange={v=>set("header",{...c.header,logo:v})} style={{ width:160, height:48, marginBottom:16 }} imgStyle={{ objectFit:"contain", objectPosition:"left center", height:"auto" }}/>
              <p style={{ margin:0, color:"rgba(255,255,255,0.45)", fontSize:14, lineHeight:1.6 }}>
                <ET value={c.footer.tagline} onChange={v=>set("footer",{...c.footer,tagline:v})} em={em} multiline style={{ color:"inherit", fontSize:"inherit", lineHeight:"inherit" }}/>
              </p>
            </div>
            {[["Company",["About","Brands","Services"]],["Partners",["Retailers","B2B","Contact"]],["Legal",["Privacy Policy","Terms of Use"]]].map(([heading,links])=>(
              <div key={heading as string}>
                <strong style={{ color:"rgba(255,255,255,0.5)", fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em", display:"block", marginBottom:12 }}>{heading as string}</strong>
                {(links as string[]).map(l=><div key={l} style={{ marginBottom:8 }}><span style={{ color:"rgba(255,255,255,0.6)", fontSize:14 }}>{l}</span></div>)}
              </div>
            ))}
          </div>
        </footer>
      </Wrap>
    </>
  );
}

// ─── ABOUT ────────────────────────────────────────────────────────────────────

function AboutEditor({ c, set, em }: { c: SiteContent; set: Setter; em: boolean }) {
  const updatePhase = (i: number, f: keyof PhaseItem, v: string) =>
    set("aboutPhases", c.aboutPhases.map((p,idx) => idx===i ? {...p,[f]:v} : p));
  return (
    <>
      <Wrap label="About — Hero">
        <section style={{ position:"relative", minHeight:480, display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden" }}>
          <EI src={c.aboutHeroImage} alt="About hero" em={em} onChange={v=>set("aboutHeroImage",v)} style={{ position:"absolute", inset:0, height:"100%" }}/>
          <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.62)", zIndex:1 }}/>
          <div style={{ position:"relative", zIndex:2, textAlign:"center", padding:"48px clamp(24px,5vw,72px)", background:"rgba(0,0,0,0.45)", backdropFilter:"blur(12px)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:20, maxWidth:720, margin:"0 24px" }}>
            <h1 style={{ margin:"0 0 20px", color:"#fff", fontSize:"clamp(28px,5vw,60px)", fontWeight:800, textTransform:"uppercase", letterSpacing:"0.04em", lineHeight:1 }}>
              <ET value={c.aboutHeroTitle} onChange={v=>set("aboutHeroTitle",v)} em={em} tag="span" style={{ color:"#fff", fontSize:"inherit", fontWeight:"inherit", textTransform:"inherit" as React.CSSProperties["textTransform"] }}/>
            </h1>
            <div style={{ width:48, height:2, background:"#00f6ff", margin:"0 auto 20px" }}/>
            <p style={{ margin:0, color:"rgba(255,255,255,0.75)", fontSize:"clamp(14px,1.4vw,17px)", lineHeight:1.7 }}>
              <ET value={c.aboutHeroSubtitle} onChange={v=>set("aboutHeroSubtitle",v)} em={em} multiline style={{ color:"inherit", fontSize:"inherit", lineHeight:"inherit" }}/>
            </p>
          </div>
        </section>
      </Wrap>

      <Wrap label="About — Three Phases of Flower">
        <section style={{ background:"#050505", padding:"64px 40px" }}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16, maxWidth:1180, margin:"0 auto" }}>
            {c.aboutPhases.map(({ src, phase, label, desc }, i) => (
              <div key={i} style={{ position:"relative", borderRadius:16, overflow:"hidden", aspectRatio:"3/4" }}>
                <EI src={src} alt={label} em={em} onChange={v=>updatePhase(i,"src",v)} style={{ position:"absolute", inset:0, height:"100%" }} imgStyle={{ objectFit:"cover" }}/>
                <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,rgba(0,0,0,0.85) 0%,rgba(0,0,0,0.1) 55%)", zIndex:1 }}/>
                <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"24px 20px", zIndex:2 }}>
                  <p style={{ margin:"0 0 4px", color:"#00f6ff", fontSize:10, fontWeight:800, textTransform:"uppercase", letterSpacing:"0.16em" }}>
                    <ET value={phase} onChange={v=>updatePhase(i,"phase",v)} em={em} style={{ color:"inherit", fontSize:"inherit" }}/>
                  </p>
                  <p style={{ margin:"0 0 4px", color:"#fff", fontSize:17, fontWeight:800, textTransform:"uppercase" }}>
                    <ET value={label} onChange={v=>updatePhase(i,"label",v)} em={em} style={{ color:"inherit", fontSize:"inherit", fontWeight:"inherit", textTransform:"inherit" as React.CSSProperties["textTransform"] }}/>
                  </p>
                  <p style={{ margin:0, color:"rgba(255,255,255,0.5)", fontSize:13, lineHeight:1.5 }}>
                    <ET value={desc} onChange={v=>updatePhase(i,"desc",v)} em={em} multiline style={{ color:"inherit", fontSize:"inherit" }}/>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </Wrap>

      {([
        { label:"About — Who We Are",     imgKey:"aboutWhoImage" as const,       titleKey:"aboutWhoTitle" as const,       body1Key:"aboutWhoBody1" as const,       body2Key:"aboutWhoBody2" as const,       eyebrow:"Who We Are",      justify:"flex-start" },
        { label:"About — Our Standards",  imgKey:"aboutStandardsImage" as const,  titleKey:"aboutStandardsTitle" as const,  body1Key:"aboutStandardsBody1" as const,  body2Key:"aboutStandardsBody2" as const,  eyebrow:"Our Standards",   justify:"flex-end"   },
        { label:"About — Partnership",    imgKey:"aboutPartnerImage" as const,    titleKey:"aboutPartnerTitle" as const,    body1Key:"aboutPartnerBody1" as const,    body2Key:"aboutPartnerBody2" as const,    eyebrow:"Built for Partnership", justify:"center"  },
      ] as const).map(({ label, imgKey, titleKey, body1Key, body2Key, eyebrow, justify }) => (
        <Wrap key={label} label={label}>
          <section style={{ position:"relative", padding:"100px 40px", overflow:"hidden" }}>
            <EI src={c[imgKey]} alt={eyebrow} em={em} onChange={v=>set(imgKey,v)} style={{ position:"absolute", inset:0, height:"100%" }} imgStyle={{ objectFit:"cover" }}/>
            <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.7)", zIndex:1 }}/>
            <div style={{ position:"relative", zIndex:2, maxWidth:1180, margin:"0 auto", display:"flex", justifyContent:justify }}>
              <div style={{ maxWidth:620, background:"rgba(0,0,0,0.55)", backdropFilter:"blur(16px)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:20, padding:"44px 48px", textAlign: justify==="center" ? "center" : "left" }}>
                <p style={{ margin:"0 0 10px", color:"#00f6ff", fontSize:11, fontWeight:800, textTransform:"uppercase", letterSpacing:"0.18em" }}>{eyebrow}</p>
                <h2 style={{ margin:"0 0 24px", color:"#fff", fontSize:"clamp(22px,2.8vw,34px)", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.04em", lineHeight:1.1 }}>
                  <ET value={c[titleKey]} onChange={v=>set(titleKey,v)} em={em} tag="span" style={{ color:"#fff", fontSize:"inherit", fontWeight:"inherit", textTransform:"inherit" as React.CSSProperties["textTransform"] }}/>
                </h2>
                {justify==="center" && <div style={{ width:48, height:2, background:"#00f6ff", margin:"0 auto 24px" }}/>}
                <p style={{ margin:"0 0 16px", color:"rgba(255,255,255,0.75)", fontSize:15, lineHeight:1.8 }}>
                  <ET value={c[body1Key]} onChange={v=>set(body1Key,v)} em={em} multiline style={{ color:"inherit", fontSize:"inherit", lineHeight:"inherit" }}/>
                </p>
                <p style={{ margin:0, color:"rgba(255,255,255,0.75)", fontSize:15, lineHeight:1.8 }}>
                  <ET value={c[body2Key]} onChange={v=>set(body2Key,v)} em={em} multiline style={{ color:"inherit", fontSize:"inherit", lineHeight:"inherit" }}/>
                </p>
              </div>
            </div>
          </section>
        </Wrap>
      ))}
    </>
  );
}

// ─── RETAILERS ────────────────────────────────────────────────────────────────

const STEPS = [
  { Icon: UserPlus, label:"Register" }, { Icon: LogIn, label:"Login" },
  { Icon: ShoppingCart, label:"Order" }, { Icon: CreditCard, label:"Payment" },
  { Icon: Truck, label:"Shipping" },
];

function RetailersEditor({ c, set, em }: { c: SiteContent; set: Setter; em: boolean }) {
  return (
    <>
      <Wrap label="Retailers — How It Works">
        <section style={{ background:"#000", padding:"80px 24px 60px", textAlign:"center" }}>
          <h1 style={{ margin:"0 0 32px", color:"#fff", fontSize:"clamp(48px,8vw,110px)", fontWeight:800, textTransform:"uppercase", letterSpacing:"-0.01em", lineHeight:0.95 }}>Retailers</h1>
          <p style={{ margin:"0 0 48px", color:"#fff", fontSize:"clamp(18px,2.5vw,28px)", fontWeight:500 }}>HOW <span style={{ color:"#00f6ff", fontWeight:700 }}>DIRECT DELIVERY</span> WORKS?</p>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:0, flexWrap:"wrap", width:"min(900px,100%)", margin:"0 auto 48px" }}>
            {STEPS.map(({ Icon, label }, i) => (
              <div key={label} style={{ display:"flex", alignItems:"center" }}>
                <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:18, position:"relative" }}>
                  <span style={{ position:"absolute", top:-22, left:0, color:"rgba(255,255,255,0.6)", fontSize:13, fontWeight:600 }}>{i+1}</span>
                  <div style={{ width:90, height:90, borderRadius:"50%", background:"#00f6ff", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <Icon size={36} color="#000" strokeWidth={2}/>
                  </div>
                  <p style={{ margin:0, color:"#fff", fontSize:14, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em" }}>{label}</p>
                </div>
                {i < STEPS.length-1 && <div style={{ width:48, height:2, borderTop:"2px dashed rgba(255,255,255,0.3)", margin:"0 6px 24px", flexShrink:0 }}/>}
              </div>
            ))}
          </div>
          <div style={{ width:"min(820px,calc(100% - 40px))", margin:"0 auto" }}>
            <p style={{ margin:0, color:"rgba(255,255,255,0.85)", fontSize:"clamp(14px,1.4vw,17px)", lineHeight:1.75 }}>
              <span style={{ color:"#00f6ff", fontWeight:700 }}>Note: </span>
              <ET value={c.retailersNote} onChange={v=>set("retailersNote",v)} em={em} multiline style={{ color:"rgba(255,255,255,0.85)", fontSize:"inherit", lineHeight:"inherit" }}/>
            </p>
          </div>
        </section>
      </Wrap>
      <Wrap label="Retailers — Login">
        <section style={{ background:"#000", padding:"64px 24px 80px", textAlign:"center" }}>
          <h2 style={{ margin:"0 0 20px", color:"#fff", fontSize:"clamp(40px,7vw,90px)", fontWeight:800, textTransform:"uppercase", letterSpacing:"-0.01em" }}>Login</h2>
          <p style={{ margin:"0 0 32px", color:"rgba(255,255,255,0.55)", fontSize:17, lineHeight:1.6, maxWidth:460, marginInline:"auto" }}>
            <ET value={c.retailersLoginSubtitle} onChange={v=>set("retailersLoginSubtitle",v)} em={em} multiline style={{ color:"inherit", fontSize:"inherit", lineHeight:"inherit" }}/>
          </p>
          <div style={{ display:"flex", gap:16, justifyContent:"center", flexWrap:"wrap" }}>
            <div style={{ display:"inline-flex", alignItems:"center", padding:"14px 44px", borderRadius:999, background:"#00f6ff" }}><span style={{ color:"#000", fontSize:14, fontWeight:800, textTransform:"uppercase", letterSpacing:"0.1em" }}>Retailer Login</span></div>
            <div style={{ display:"inline-flex", alignItems:"center", padding:"14px 44px", borderRadius:999, border:"1px solid rgba(255,255,255,0.3)" }}><span style={{ color:"#fff", fontSize:14, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em" }}>Apply for Access</span></div>
          </div>
        </section>
      </Wrap>
    </>
  );
}

// ─── B2B ──────────────────────────────────────────────────────────────────────

const B2B_ICONS = [Network, Package, Factory, Truck];

function B2BEditor({ c, set, em }: { c: SiteContent; set: Setter; em: boolean }) {
  const updateSvc = (i: number, f: keyof B2BService, v: string) =>
    set("b2bServices", c.b2bServices.map((s,idx) => idx===i ? {...s,[f]:v} : s));
  const updateReason = (i: number, f: keyof B2BReason, v: string) =>
    set("b2bReasons", c.b2bReasons.map((r,idx) => idx===i ? {...r,[f]:v} : r));
  return (
    <>
      <Wrap label="B2B — Hero">
        <section style={{ background:"#000", padding:"64px 40px 40px" }}>
          <h1 style={{ margin:"0 0 16px", color:"#fff", fontSize:"clamp(48px,9vw,110px)", fontWeight:800, textTransform:"uppercase", letterSpacing:"-0.01em", lineHeight:0.9 }}>
            <ET value={c.b2bHeroTitle} onChange={v=>set("b2bHeroTitle",v)} em={em} tag="span" style={{ color:"#fff", fontSize:"inherit", fontWeight:"inherit", textTransform:"inherit" as React.CSSProperties["textTransform"] }}/>
          </h1>
          <p style={{ margin:0, color:"#00f6ff", fontSize:"clamp(16px,2vw,24px)", fontWeight:600, fontStyle:"italic" }}>
            <ET value={c.b2bHeroSubtitle} onChange={v=>set("b2bHeroSubtitle",v)} em={em} style={{ color:"inherit", fontSize:"inherit", fontWeight:"inherit" }}/>
          </p>
        </section>
      </Wrap>
      <Wrap label="B2B — Service Cards">
        <section style={{ background:"#000", padding:"0 24px 80px" }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1.3fr 1fr", gap:20, maxWidth:1200, margin:"0 auto" }}>
            {c.b2bServices.map(({ title, body }, i) => {
              const Icon = B2B_ICONS[i % B2B_ICONS.length];
              const center = i===1;
              return (
                <div key={i} style={{ background:center?"#0d0d0d":"#1b1b1b", borderRadius:16, padding:center?"56px 40px":"40px 28px", textAlign:"center", transform:center?"translateY(-20px)":"none", display:"flex", flexDirection:"column", alignItems:"center", gap:18 }}>
                  <Icon size={center?72:52} color="#00f6ff" strokeWidth={1.5}/>
                  <h3 style={{ margin:0, color:"#fff", fontSize:center?21:16, fontWeight:600 }}>
                    <ET value={title} onChange={v=>updateSvc(i,"title",v)} em={em} style={{ color:"#fff", fontSize:"inherit", fontWeight:"inherit" }}/>
                  </h3>
                  <p style={{ margin:0, color:"rgba(255,255,255,0.6)", fontSize:center?14:12, lineHeight:1.75 }}>
                    <ET value={body} onChange={v=>updateSvc(i,"body",v)} em={em} multiline style={{ color:"inherit", fontSize:"inherit", lineHeight:"inherit" }}/>
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      </Wrap>
      <Wrap label="B2B — Why Work With Us">
        <section style={{ background:"#050706", padding:"80px 40px 96px", textAlign:"center", borderTop:"1px solid rgba(255,255,255,0.06)" }}>
          <h2 style={{ margin:"0 0 64px", color:"#fff", fontSize:"clamp(28px,5vw,68px)", fontWeight:300, textTransform:"uppercase", letterSpacing:"0.05em" }}>
            <ET value={c.b2bWhyTitle} onChange={v=>set("b2bWhyTitle",v)} em={em} tag="span" style={{ color:"#fff", fontSize:"inherit", fontWeight:"inherit", textTransform:"inherit" as React.CSSProperties["textTransform"] }}/>
          </h2>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:32, maxWidth:1040, margin:"0 auto" }}>
            {c.b2bReasons.map(({ src, label }, i) => (
              <div key={i} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:24 }}>
                <EI src={src} alt={label} em={em} onChange={v=>updateReason(i,"src",v)} style={{ width:130, height:130, flexShrink:0 }} imgStyle={{ objectFit:"contain" }}/>
                <p style={{ margin:0, color:"rgba(255,255,255,0.9)", fontSize:15, fontWeight:500, lineHeight:1.45, maxWidth:180 }}>
                  <ET value={label} onChange={v=>updateReason(i,"label",v)} em={em} style={{ color:"inherit", fontSize:"inherit", fontWeight:"inherit" }}/>
                </p>
              </div>
            ))}
          </div>
        </section>
      </Wrap>
    </>
  );
}

// ─── SERVICES ─────────────────────────────────────────────────────────────────

function ServicesEditor({ c, set, em }: { c: SiteContent; set: Setter; em: boolean }) {
  const updateCard = (i: number, f: keyof ServiceCard, v: string) =>
    set("servicesCards", c.servicesCards.map((s,idx) => idx===i ? {...s,[f]:v} : s));
  return (
    <>
      <Wrap label="Services — Hero">
        <section style={{ position:"relative", minHeight:380, display:"flex", alignItems:"flex-end", overflow:"hidden", background:"#111" }}>
          <EI src={c.servicesHeroImage} alt="Services hero" em={em} onChange={v=>set("servicesHeroImage",v)} style={{ position:"absolute", inset:0, height:"100%" }} imgStyle={{ objectFit:"cover" }}/>
          <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.55)", zIndex:1 }}/>
          <div style={{ position:"relative", zIndex:2, padding:"56px 44px" }}>
            <p style={{ margin:"0 0 8px", color:"rgba(255,255,255,0.5)", fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em" }}>Services</p>
            <h1 style={{ margin:"0 0 14px", color:"#fff", fontSize:"clamp(36px,6vw,80px)", fontWeight:800, textTransform:"uppercase", lineHeight:0.95 }}>
              <ET value={c.servicesHeroTitle} onChange={v=>set("servicesHeroTitle",v)} em={em} tag="span" style={{ color:"#fff", fontSize:"inherit", fontWeight:"inherit", textTransform:"inherit" as React.CSSProperties["textTransform"] }}/>
            </h1>
            <p style={{ margin:0, color:"rgba(255,255,255,0.65)", fontSize:"clamp(14px,1.5vw,18px)", lineHeight:1.6, maxWidth:520 }}>
              <ET value={c.servicesHeroSubtitle} onChange={v=>set("servicesHeroSubtitle",v)} em={em} multiline style={{ color:"inherit", fontSize:"inherit" }}/>
            </p>
          </div>
        </section>
      </Wrap>
      <Wrap label="Services — Cards">
        <section style={{ background:"#0a0a0a", padding:"72px 40px" }}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:20, maxWidth:1060, margin:"0 auto" }}>
            {c.servicesCards.map(({ title, body }, i) => (
              <div key={i} style={{ background:"#111", border:"1px solid rgba(255,255,255,0.07)", borderRadius:16, padding:"32px 28px" }}>
                <h2 style={{ margin:"0 0 12px", color:"#fff", fontSize:"clamp(18px,2.5vw,28px)", fontWeight:700 }}>
                  <ET value={title} onChange={v=>updateCard(i,"title",v)} em={em} style={{ color:"#fff", fontSize:"inherit", fontWeight:"inherit" }}/>
                </h2>
                <p style={{ margin:0, color:"rgba(255,255,255,0.55)", fontSize:14, lineHeight:1.65 }}>
                  <ET value={body} onChange={v=>updateCard(i,"body",v)} em={em} multiline style={{ color:"inherit", fontSize:"inherit", lineHeight:"inherit" }}/>
                </p>
              </div>
            ))}
          </div>
        </section>
      </Wrap>
    </>
  );
}

// ─── CONTACT ──────────────────────────────────────────────────────────────────

function ContactEditor({ c, set, em }: { c: SiteContent; set: Setter; em: boolean }) {
  return (
    <>
      <Wrap label="Contact — Hero">
        <section style={{ position:"relative", minHeight:340, display:"flex", alignItems:"flex-end", overflow:"hidden", background:"#111" }}>
          <EI src={c.contactHeroImage} alt="Contact hero" em={em} onChange={v=>set("contactHeroImage",v)} style={{ position:"absolute", inset:0, height:"100%" }} imgStyle={{ objectFit:"cover" }}/>
          <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.55)", zIndex:1 }}/>
          <div style={{ position:"relative", zIndex:2, padding:"52px 44px" }}>
            <p style={{ margin:"0 0 8px", color:"rgba(255,255,255,0.5)", fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em" }}>Contact Us</p>
            <h1 style={{ margin:"0 0 12px", color:"#fff", fontSize:"clamp(32px,6vw,72px)", fontWeight:800, textTransform:"uppercase", lineHeight:0.95 }}>
              <ET value={c.contactHeroTitle} onChange={v=>set("contactHeroTitle",v)} em={em} tag="span" style={{ color:"#fff", fontSize:"inherit", fontWeight:"inherit", textTransform:"inherit" as React.CSSProperties["textTransform"] }}/>
            </h1>
            <p style={{ margin:0, color:"rgba(255,255,255,0.65)", fontSize:"clamp(14px,1.4vw,17px)", lineHeight:1.6, maxWidth:480 }}>
              <ET value={c.contactHeroSubtitle} onChange={v=>set("contactHeroSubtitle",v)} em={em} multiline style={{ color:"inherit", fontSize:"inherit" }}/>
            </p>
          </div>
        </section>
      </Wrap>
      <Wrap label="Contact — Info">
        <section style={{ background:"#000", padding:"72px 40px" }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:56, maxWidth:1020, margin:"0 auto" }}>
            <div>
              <h2 style={{ margin:"0 0 20px", color:"#fff", fontSize:"clamp(24px,3.5vw,48px)", fontWeight:800, textTransform:"uppercase" }}>Leaf Cross Biomedical</h2>
              <p style={{ margin:"0 0 24px", color:"rgba(255,255,255,0.65)", fontSize:15, lineHeight:1.7 }}>
                <ET value={c.contactBodyText} onChange={v=>set("contactBodyText",v)} em={em} multiline style={{ color:"inherit", fontSize:"inherit", lineHeight:"inherit" }}/>
              </p>
              <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                {([["Email","contactEmail",c.contactEmail],["Phone","contactPhone",c.contactPhone],["Address","contactAddress",c.contactAddress]] as [string,keyof SiteContent,string][]).map(([label,key,val]) => (
                  <div key={key} style={{ display:"flex", gap:12, alignItems:"center" }}>
                    <span style={{ color:"rgba(255,255,255,0.35)", fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em", minWidth:60 }}>{label}</span>
                    <span style={{ color:"#fff", fontSize:14 }}><ET value={val} onChange={v=>set(key,v as never)} em={em} style={{ color:"#fff", fontSize:14 }}/></span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background:"rgba(255,255,255,0.03)", borderRadius:16, border:"1px solid rgba(255,255,255,0.07)", padding:"32px 28px", display:"flex", flexDirection:"column", gap:14 }}>
              {["Name","Email","Message"].map(f => (
                <div key={f}>
                  <p style={{ margin:"0 0 6px", color:"rgba(255,255,255,0.4)", fontSize:11, fontWeight:700, textTransform:"uppercase" }}>{f}</p>
                  <div style={{ height:f==="Message"?72:36, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:8 }}/>
                </div>
              ))}
              <div style={{ height:40, borderRadius:999, background:"#00f6ff", display:"flex", alignItems:"center", justifyContent:"center" }}><span style={{ color:"#000", fontSize:12, fontWeight:800, textTransform:"uppercase", letterSpacing:"0.1em" }}>Send Message</span></div>
            </div>
          </div>
        </section>
      </Wrap>
    </>
  );
}

// ─── HEADER & FOOTER ──────────────────────────────────────────────────────────

function HeaderFooterEditor({ c, set, em }: { c: SiteContent; set: Setter; em: boolean }) {
  return (
    <>
      <Wrap label="Header — Logo">
        <header style={{ background:"#000", borderBottom:"1px solid rgba(255,255,255,0.08)", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 40px", height:72 }}>
          <EI src={c.header.logo} alt="Logo" em={em} onChange={v=>set("header",{...c.header,logo:v})} style={{ width:180, height:52 }} imgStyle={{ objectFit:"contain", objectPosition:"left center", height:"auto" }}/>
          <nav style={{ display:"flex", gap:28 }}>
            {["About","Services","Contact"].map(l=><span key={l} style={{ color:"rgba(255,255,255,0.7)", fontSize:14, fontWeight:600 }}>{l}</span>)}
          </nav>
        </header>
      </Wrap>
      <Wrap label="Footer — Tagline">
        <footer style={{ background:"#111", borderTop:"1px solid rgba(255,255,255,0.07)", padding:"56px 40px 40px" }}>
          <div style={{ maxWidth:1180, margin:"0 auto", display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr", gap:48 }}>
            <div>
              <EI src={c.header.logo} alt="Logo" em={em} onChange={v=>set("header",{...c.header,logo:v})} style={{ width:160, height:48, marginBottom:16 }} imgStyle={{ objectFit:"contain", objectPosition:"left center", height:"auto" }}/>
              <p style={{ margin:0, color:"rgba(255,255,255,0.45)", fontSize:14, lineHeight:1.6 }}>
                <ET value={c.footer.tagline} onChange={v=>set("footer",{...c.footer,tagline:v})} em={em} multiline style={{ color:"inherit", fontSize:"inherit", lineHeight:"inherit" }}/>
              </p>
            </div>
            {[["Company",["About","Services","Contact"]],["Partners",["Retailers","B2B"]],["Legal",["Privacy Policy","Terms"]]].map(([heading,links])=>(
              <div key={heading as string}>
                <strong style={{ color:"rgba(255,255,255,0.5)", fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em", display:"block", marginBottom:12 }}>{heading as string}</strong>
                {(links as string[]).map(l=><div key={l} style={{ marginBottom:8 }}><span style={{ color:"rgba(255,255,255,0.6)", fontSize:14 }}>{l}</span></div>)}
              </div>
            ))}
          </div>
        </footer>
      </Wrap>
    </>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

const PAGES = ["Home","About","Retailers","B2B","Services","Contact","Header & Footer"] as const;
type Page = typeof PAGES[number];

export default function WebsiteVisualEditor() {
  const searchParams = useSearchParams();
  const [content, setContent] = useState<SiteContent>(defaultSiteContent);
  const [editMode, setEditMode] = useState(true);
  const [page, setPage] = useState<Page>("Home");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    fetch("/api/admin/site-content")
      .then(r => r.json())
      .then(data => {
        if (data && typeof data === "object" && !data.error) {
          setContent({ ...defaultSiteContent, ...(data as Partial<SiteContent>) });
        }
      })
      .catch(() => {});
    if (searchParams.get("confirmed")==="1") setConfirmed(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const set: Setter = (k, v) => { setContent(prev => ({...prev,[k]:v})); setSaved(false); setSaveError(""); };

  const handleSave = async () => {
    setSaving(true); setSaveError("");
    try {
      const res = await fetch("/api/admin/site-content", { method:"PUT", headers:{"Content-Type":"application/json"}, body:JSON.stringify(content) });
      if (res.ok) { setSaved(true); setTimeout(()=>setSaved(false),2500); }
      else { const j=await res.json(); setSaveError(j.error ?? "Save failed"); }
    } catch { setSaveError("Network error"); }
    finally { setSaving(false); }
  };

  if (!confirmed) {
    return (
      <div style={{ minHeight:"100vh", background:"#000", display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
        <div style={{ background:"#111", border:"2px solid #ef4444", borderRadius:20, padding:"52px 44px", maxWidth:500, width:"100%", textAlign:"center" }}>
          <div style={{ width:68, height:68, borderRadius:"50%", background:"rgba(239,68,68,0.12)", border:"2px solid rgba(239,68,68,0.4)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 24px" }}>
            <span style={{ fontSize:30 }}>⚠️</span>
          </div>
          <p style={{ margin:"0 0 8px", color:"#ef4444", fontSize:11, fontWeight:800, textTransform:"uppercase", letterSpacing:"0.15em" }}>Danger Zone</p>
          <h2 style={{ margin:"0 0 20px", color:"#fff", fontSize:"clamp(20px,3vw,30px)", fontWeight:800, lineHeight:1.2 }}>You are entering the Website Editor</h2>
          <p style={{ margin:"0 0 36px", color:"rgba(255,255,255,0.55)", fontSize:15, lineHeight:1.7 }}>
            Changes made here go <strong style={{ color:"#fff" }}>directly live</strong> when you save. There is no undo.
          </p>
          <div style={{ display:"flex", gap:12, justifyContent:"center" }}>
            <Link href="/admin" style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"12px 24px", borderRadius:10, border:"1px solid rgba(255,255,255,0.15)", background:"none", color:"rgba(255,255,255,0.5)", fontSize:14, fontWeight:700, textDecoration:"none" }}>
              <ArrowLeft size={15}/> Go Back
            </Link>
            <button onClick={()=>setConfirmed(true)} style={{ display:"flex", alignItems:"center", gap:6, padding:"12px 28px", borderRadius:10, border:"none", cursor:"pointer", background:"#ef4444", color:"#fff", fontSize:14, fontWeight:800, textTransform:"uppercase", letterSpacing:"0.06em" }}>
              I Understand — Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight:"100vh", background:"#0a0a0a" }}>
      {/* Top bar */}
      <div style={{ position:"sticky", top:0, zIndex:50, background:"#0a0a0a", borderBottom:"1px solid rgba(255,255,255,0.1)", display:"flex", alignItems:"center", gap:12, padding:"0 20px", height:54 }}>
        <Link href="/admin" style={{ display:"flex", alignItems:"center", gap:5, color:"rgba(255,255,255,0.5)", fontSize:13, fontWeight:600, textDecoration:"none", flexShrink:0 }}><ArrowLeft size={14}/> Admin</Link>
        <span style={{ color:"rgba(255,255,255,0.12)" }}>|</span>
        <span style={{ color:"#fff", fontSize:14, fontWeight:700, flexShrink:0 }}>Website Editor</span>
        <div style={{ flex:1 }}/>
        {editMode && <span style={{ color:"rgba(255,255,255,0.3)", fontSize:12, flexShrink:0 }}>Click any text or photo to edit</span>}
        {saveError && <span style={{ color:"#f87171", fontSize:12, flexShrink:0 }}>{saveError}</span>}
        <button onClick={()=>setEditMode(v=>!v)} style={{ display:"flex", alignItems:"center", gap:5, padding:"6px 14px", borderRadius:7, border:"1px solid rgba(255,255,255,0.18)", background:editMode?"rgba(0,246,255,0.1)":"transparent", color:editMode?"#00f6ff":"rgba(255,255,255,0.45)", fontSize:12, fontWeight:700, cursor:"pointer", textTransform:"uppercase", letterSpacing:"0.06em", flexShrink:0 }}>
          {editMode ? <><EyeOff size={13}/> Preview</> : <><Eye size={13}/> Edit</>}
        </button>
        <button onClick={handleSave} disabled={saving} style={{ display:"flex", alignItems:"center", gap:5, padding:"7px 18px", borderRadius:7, border:"none", cursor:saving?"wait":"pointer", background:saved?"#16a34a":saving?"rgba(0,246,255,0.5)":"#00f6ff", color:"#000", fontSize:12, fontWeight:800, textTransform:"uppercase", letterSpacing:"0.06em", transition:"background 0.2s", flexShrink:0 }}>
          {saved ? <><Check size={13} strokeWidth={3}/> Saved!</> : saving ? "Saving…" : <><Save size={13}/> Save All</>}
        </button>
      </div>

      {/* Page tabs */}
      <div style={{ position:"sticky", top:54, zIndex:40, background:"#111", borderBottom:"1px solid rgba(255,255,255,0.08)", display:"flex", overflowX:"auto" }}>
        {PAGES.map(p=>(
          <button key={p} onClick={()=>setPage(p)} style={{ flexShrink:0, background:"none", border:"none", cursor:"pointer", padding:"12px 18px", fontSize:13, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.06em", color:page===p?"#00f6ff":"rgba(255,255,255,0.35)", borderBottom:page===p?"2px solid #00f6ff":"2px solid transparent", whiteSpace:"nowrap" }}>
            {p}
          </button>
        ))}
      </div>

      {/* Content */}
      <div>
        {page==="Home"            && <HomeEditor          c={content} set={set} em={editMode}/>}
        {page==="About"           && <AboutEditor         c={content} set={set} em={editMode}/>}
        {page==="Retailers"       && <RetailersEditor     c={content} set={set} em={editMode}/>}
        {page==="B2B"             && <B2BEditor           c={content} set={set} em={editMode}/>}
        {page==="Services"        && <ServicesEditor      c={content} set={set} em={editMode}/>}
        {page==="Contact"         && <ContactEditor       c={content} set={set} em={editMode}/>}
        {page==="Header & Footer" && <HeaderFooterEditor  c={content} set={set} em={editMode}/>}
      </div>

      {/* Bottom save */}
      <div style={{ position:"sticky", bottom:0, zIndex:50, background:"#0a0a0a", borderTop:"1px solid rgba(255,255,255,0.08)", display:"flex", alignItems:"center", justifyContent:"flex-end", padding:"10px 20px", gap:12 }}>
        <span style={{ color:"rgba(255,255,255,0.25)", fontSize:12, flex:1 }}>{editMode ? "Edit mode — click any text or photo to change it" : "Preview mode"}</span>
        <button onClick={handleSave} disabled={saving} style={{ display:"flex", alignItems:"center", gap:6, padding:"9px 26px", borderRadius:8, border:"none", cursor:saving?"wait":"pointer", background:saved?"#16a34a":saving?"rgba(0,246,255,0.5)":"#00f6ff", color:"#000", fontSize:13, fontWeight:800, textTransform:"uppercase", letterSpacing:"0.06em", transition:"background 0.2s" }}>
          {saved ? <><Check size={14} strokeWidth={3}/> Saved!</> : saving ? "Saving…" : <><Save size={14}/> Save All Changes</>}
        </button>
      </div>
    </div>
  );
}
