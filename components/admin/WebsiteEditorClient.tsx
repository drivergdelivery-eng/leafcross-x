"use client";
import { useState } from "react";
import { Check, ChevronDown, ChevronUp } from "lucide-react";

type Field = { key: string; label: string; value: string; multiline?: boolean };
type Section = { id: string; title: string; fields: Field[] };

const initial: Section[] = [
  {
    id: "hero",
    title: "Homepage Hero",
    fields: [
      { key: "hero_heading",    label: "Main Heading",  value: "Premium BC Cannabis" },
      { key: "hero_subheading", label: "Subheading",    value: "Health Canada licensed cannabis processor in Nelson, BC." },
      { key: "hero_cta",        label: "CTA Button Text",value: "View Our Brands" },
    ],
  },
  {
    id: "about",
    title: "About Section",
    fields: [
      { key: "about_tagline", label: "Tagline", value: "Rooted in craft. Grown with purpose." },
      { key: "about_body", label: "Body Text", multiline: true, value: "Leaf Cross Biomedical is a Health Canada licensed cannabis processor based in Nelson, BC, committed to delivering premium craft cannabis to licensed retailers across British Columbia." },
    ],
  },
  {
    id: "allday",
    title: "AllDay Cannabis Brand",
    fields: [
      { key: "allday_tagline", label: "Tagline", value: "Community. Quality. Fun." },
      { key: "allday_body", label: "Brand Description", multiline: true, value: "Allday Cannabis champions small craft growers while bringing vibrant, affordable, high-quality cannabis to communities across BC." },
    ],
  },
  {
    id: "blk",
    title: "AllDay BLK Edition Brand",
    fields: [
      { key: "blk_tagline", label: "Tagline", value: "Unique cultivars. Premium craft. Smokes smooth." },
      { key: "blk_body", label: "Brand Description", multiline: true, value: "AllDay BLK Edition represents the pinnacle of craft cannabis — rare cultivars, premium processing, and a smooth experience from start to finish." },
    ],
  },
  {
    id: "contact",
    title: "Contact Information",
    fields: [
      { key: "contact_email",   label: "Email",   value: "info@leafcross.com" },
      { key: "contact_phone",   label: "Phone",   value: "1-800-LEAFCROSS" },
      { key: "contact_address", label: "Address", value: "Nelson, BC, Canada" },
    ],
  },
  {
    id: "retailers_note",
    title: "Retailers Page Note",
    fields: [
      { key: "retailers_note_body", label: "Note Text", multiline: true, value: "We have NO case limit per SKU. We reserve the right to cancel your order if payment is not received within 48 hours. To ensure shipping the same day, all payments must be received before 11am, or else it will be processed on the next business day. All sales are final." },
    ],
  },
];

export default function WebsiteEditorClient() {
  const [sections, setSections] = useState<Section[]>(initial);
  const [openId, setOpenId] = useState<string | null>("hero");
  const [saved, setSaved] = useState<Record<string, boolean>>({});

  const updateField = (sectionId: string, key: string, value: string) => {
    setSections(prev => prev.map(s =>
      s.id === sectionId
        ? { ...s, fields: s.fields.map(f => f.key === key ? { ...f, value } : f) }
        : s
    ));
    setSaved(prev => ({ ...prev, [sectionId]: false }));
  };

  const handleSave = (sectionId: string) => {
    // TODO: persist to Supabase site_settings table
    setSaved(prev => ({ ...prev, [sectionId]: true }));
    setTimeout(() => setSaved(prev => ({ ...prev, [sectionId]: false })), 2500);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {sections.map(section => {
        const isOpen = openId === section.id;
        const isSaved = saved[section.id];

        return (
          <div key={section.id} style={{
            background: "#111", border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 12, overflow: "hidden",
          }}>
            <button
              onClick={() => setOpenId(isOpen ? null : section.id)}
              style={{
                width: "100%", background: "none", border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "18px 20px", color: "#fff",
              }}
            >
              <span style={{ fontSize: 15, fontWeight: 700 }}>{section.title}</span>
              {isOpen ? <ChevronUp size={18} color="rgba(255,255,255,0.4)" /> : <ChevronDown size={18} color="rgba(255,255,255,0.4)" />}
            </button>

            {isOpen && (
              <div style={{ padding: "0 20px 20px", display: "flex", flexDirection: "column", gap: 16 }}>
                {section.fields.map(field => (
                  <div key={field.key}>
                    <label style={{
                      display: "block", marginBottom: 8,
                      color: "rgba(255,255,255,0.45)", fontSize: 11,
                      fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em",
                    }}>{field.label}</label>
                    {field.multiline ? (
                      <textarea
                        value={field.value}
                        onChange={e => updateField(section.id, field.key, e.target.value)}
                        rows={4}
                        style={{
                          width: "100%", background: "rgba(255,255,255,0.06)",
                          border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8,
                          color: "#fff", fontSize: 14, padding: "12px 14px",
                          outline: "none", resize: "vertical", boxSizing: "border-box",
                          lineHeight: 1.6,
                        }}
                      />
                    ) : (
                      <input
                        value={field.value}
                        onChange={e => updateField(section.id, field.key, e.target.value)}
                        style={{
                          width: "100%", background: "rgba(255,255,255,0.06)",
                          border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8,
                          color: "#fff", fontSize: 14, padding: "10px 14px",
                          outline: "none", boxSizing: "border-box",
                        }}
                      />
                    )}
                  </div>
                ))}
                <button
                  onClick={() => handleSave(section.id)}
                  style={{
                    alignSelf: "flex-start",
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "10px 28px", borderRadius: 8, border: "none", cursor: "pointer",
                    background: isSaved ? "#16a34a" : "#00f6ff",
                    color: "#000", fontSize: 13, fontWeight: 800,
                    textTransform: "uppercase", letterSpacing: "0.06em",
                    transition: "background 0.2s",
                  }}
                >
                  {isSaved ? <><Check size={14} strokeWidth={3} /> Saved</> : "Save Section"}
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
