"use client";
import { useState, useEffect } from "react";
import { Check, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import type { SiteContent } from "@/lib/data/siteContent";

type EditableField = {
  key: keyof SiteContent;
  label: string;
  multiline?: boolean;
};

type EditorSection = {
  id: string;
  title: string;
  fields: EditableField[];
};

const sections: EditorSection[] = [
  {
    id: "hero",
    title: "Homepage Hero",
    fields: [
      { key: "heroLicense",      label: "License Text (below logo)" },
      { key: "heroCtaPrimary",   label: "Primary Button Text" },
      { key: "heroCtaSecondary", label: "Secondary Button Text" },
    ],
  },
  {
    id: "pheno",
    title: "Homepage — Philosophy",
    fields: [
      { key: "phenoHuntTitle", label: "Why Pheno Hunt — Title" },
      { key: "phenoHuntBody",  label: "Why Pheno Hunt — Body", multiline: true },
      { key: "phenoHuntCta",   label: "Why Pheno Hunt — Button Text" },
      { key: "partnerTitle",   label: "Partner Section — Title" },
      { key: "partnerBody",    label: "Partner Section — Body", multiline: true },
      { key: "partnerCta",     label: "Partner Section — Link Text" },
    ],
  },
  {
    id: "retailers",
    title: "Retailers Page",
    fields: [
      { key: "retailersNote",          label: "Ordering Note",   multiline: true },
      { key: "retailersLoginSubtitle", label: "Login Subtitle" },
    ],
  },
  {
    id: "contact",
    title: "Contact Information",
    fields: [
      { key: "contactEmail",    label: "Email" },
      { key: "contactPhone",    label: "Phone" },
      { key: "contactAddress",  label: "Address" },
      { key: "contactBodyText", label: "Page Body Text", multiline: true },
    ],
  },
  {
    id: "services",
    title: "Services Page",
    fields: [
      { key: "servicesHeroTitle",    label: "Hero Title" },
      { key: "servicesHeroSubtitle", label: "Hero Subtitle", multiline: true },
    ],
  },
];

export default function WebsiteEditorClient() {
  const [content, setContent]   = useState<Partial<SiteContent>>({});
  const [loading, setLoading]   = useState(true);
  const [openId, setOpenId]     = useState<string | null>("hero");
  const [saving, setSaving]     = useState(false);
  const [saved, setSaved]       = useState(false);
  const [error, setError]       = useState("");

  useEffect(() => {
    fetch("/api/admin/site-content")
      .then(r => r.json())
      .then((data: SiteContent) => setContent(data))
      .catch(() => setError("Failed to load current content."))
      .finally(() => setLoading(false));
  }, []);

  const updateField = (key: keyof SiteContent, value: string) => {
    setContent(prev => ({ ...prev, [key]: value }));
    setSaved(false);
    setError("");
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/site-content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Save failed");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "40px 0", color: "rgba(255,255,255,0.4)" }}>
        <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} />
        <span style={{ fontSize: 14 }}>Loading current content…</span>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>

      {/* Sections */}
      {sections.map(section => {
        const isOpen = openId === section.id;
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
              {isOpen
                ? <ChevronUp size={18} color="rgba(255,255,255,0.4)" />
                : <ChevronDown size={18} color="rgba(255,255,255,0.4)" />}
            </button>

            {isOpen && (
              <div style={{ padding: "0 20px 20px", display: "flex", flexDirection: "column", gap: 16 }}>
                {section.fields.map(field => {
                  const val = (content[field.key] as string) ?? "";
                  return (
                    <div key={field.key as string}>
                      <label style={{
                        display: "block", marginBottom: 8,
                        color: "rgba(255,255,255,0.45)", fontSize: 11,
                        fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em",
                      }}>{field.label}</label>
                      {field.multiline ? (
                        <textarea
                          value={val}
                          onChange={e => updateField(field.key, e.target.value)}
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
                          value={val}
                          onChange={e => updateField(field.key, e.target.value)}
                          style={{
                            width: "100%", background: "rgba(255,255,255,0.06)",
                            border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8,
                            color: "#fff", fontSize: 14, padding: "10px 14px",
                            outline: "none", boxSizing: "border-box",
                          }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {/* Single save button for all sections */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, paddingTop: 8 }}>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "12px 36px", borderRadius: 8, border: "none",
            cursor: saving ? "default" : "pointer",
            background: saved ? "#16a34a" : saving ? "rgba(0,246,255,0.5)" : "#00f6ff",
            color: "#000", fontSize: 13, fontWeight: 800,
            textTransform: "uppercase", letterSpacing: "0.07em",
            transition: "background 0.2s",
          }}
        >
          {saved
            ? <><Check size={15} strokeWidth={3} /> Saved to Site</>
            : saving ? "Saving…" : "Save All Changes"}
        </button>
        {error && (
          <p style={{ margin: 0, color: "#f87171", fontSize: 13 }}>{error}</p>
        )}
        {!error && (
          <p style={{ margin: 0, color: "rgba(255,255,255,0.25)", fontSize: 12 }}>
            Changes go live on the public site immediately after saving.
          </p>
        )}
      </div>
    </div>
  );
}
