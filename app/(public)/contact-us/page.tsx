"use client";
import { useState, useEffect } from "react";
import { PageHero } from "@/components/public/PageHero";
import { CheckCircle } from "lucide-react";
import { defaultSiteContent, type SiteContent } from "@/lib/data/siteContent";

export default function ContactPage() {
  const [c, setC] = useState<SiteContent>(defaultSiteContent);
  const [name, setName]             = useState("");
  const [email, setEmail]           = useState("");
  const [partnerType, setPartnerType] = useState("");
  const [message, setMessage]       = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted]   = useState(false);
  const [error, setError]           = useState("");

  useEffect(() => {
    fetch("/api/site-content").then(r => r.json()).then(data => {
      if (data && !data.error) setC({ ...defaultSiteContent, ...data });
    }).catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, partner_type: partnerType || null, message }),
    });
    const json = await res.json();
    setSubmitting(false);
    if (!res.ok) setError(json.error || "Something went wrong. Please try again.");
    else setSubmitted(true);
  };

  return (
    <>
      <PageHero eyebrow="Contact Us" title={c.contactHeroTitle} subtitle={c.contactHeroSubtitle} image={c.contactHeroImage} />
      <section className="section darkSection">
        <div className="container split">
          <div>
            <p className="eyebrow">Contact</p>
            <h2 className="display" style={{ fontSize: "clamp(42px, 6vw, 82px)" }}>Leaf Cross Biomedical</h2>
            <p className="lead">{c.contactBodyText}</p>
            <div style={{ display:"flex", flexDirection:"column", gap:10, marginTop:24 }}>
              {([["Email", c.contactEmail], ["Phone", c.contactPhone], ["Address", c.contactAddress]] as [string,string][]).map(([label, val]) => (
                <div key={label} style={{ display:"flex", gap:12, alignItems:"center" }}>
                  <span style={{ color:"rgba(255,255,255,0.35)", fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em", minWidth:64 }}>{label}</span>
                  <span style={{ color:"#fff", fontSize:15 }}>{val}</span>
                </div>
              ))}
            </div>
          </div>

          {submitted ? (
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:20, padding:"60px 0", textAlign:"center" }}>
              <CheckCircle size={56} color="#00f6ff" />
              <h3 style={{ margin:0, color:"#fff", fontSize:24, fontWeight:800 }}>Message Sent!</h3>
              <p style={{ margin:0, color:"rgba(255,255,255,0.6)", fontSize:16, lineHeight:1.6, maxWidth:340 }}>
                Thanks for reaching out. We&apos;ll get back to you at <strong style={{ color:"#fff" }}>{email}</strong> shortly.
              </p>
            </div>
          ) : (
            <form className="grid formPanel" onSubmit={handleSubmit}>
              <div className="field"><label htmlFor="name">Name</label><input id="name" value={name} onChange={e => setName(e.target.value)} required /></div>
              <div className="field"><label htmlFor="email">Email</label><input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required /></div>
              <div className="field">
                <label style={{ marginBottom:4 }}>I am a</label>
                <div style={{ display:"flex", gap:24 }}>
                  {[["retailer","Retailer"],["b2b","B2B / Wholesaler"]].map(([val, label]) => (
                    <label key={val} style={{ display:"flex", alignItems:"center", gap:10, color:"rgba(255,255,255,0.75)", fontSize:15, fontWeight:400, cursor:"pointer" }}>
                      <input type="radio" name="partnerType" value={val} checked={partnerType===val} onChange={() => setPartnerType(val)} style={{ accentColor:"#00f6ff", width:18, height:18 }} />
                      {label}
                    </label>
                  ))}
                </div>
              </div>
              <div className="field"><label htmlFor="message">Message</label><textarea id="message" value={message} onChange={e => setMessage(e.target.value)} required /></div>
              {error && <p style={{ margin:0, color:"#f87171", fontSize:14 }}>{error}</p>}
              <button className="button" type="submit" disabled={submitting}>{submitting ? "Sending…" : "Send message"}</button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
