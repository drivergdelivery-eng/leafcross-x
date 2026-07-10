"use client";
import { useState, useRef } from "react";
import Image from "next/image";
import { Check, Plus, X, UploadCloud, Trash2 } from "lucide-react";
import { alldayProducts, blkProducts, typeColors, type MenuProduct } from "@/lib/data/menu";

type EditableProduct = MenuProduct & { active: boolean; previewUrl?: string };

const toEditable = (p: MenuProduct): EditableProduct => ({ ...p, active: true });

const emptyForm = {
  name: "",
  type: "Sativa" as MenuProduct["type"],
  brand: "allday" as MenuProduct["brand"],
  price: "",
  unit: "3.5g",
  packageSize: "",
  description: "",
  imageFile: null as File | null,
  previewUrl: "",
};

export default function MenuManagerClient() {
  const [brand, setBrand] = useState<"allday" | "blk">("allday");
  const [allday, setAllday] = useState<EditableProduct[]>(alldayProducts.map(toEditable));
  const [blk, setBlk]     = useState<EditableProduct[]>(blkProducts.map(toEditable));
  const [saved, setSaved]  = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const products    = brand === "allday" ? allday : blk;
  const setProducts = brand === "allday" ? setAllday : setBlk;

  const update = (slug: string, field: keyof EditableProduct, value: unknown) => {
    setProducts(prev => prev.map(p => p.slug === slug ? { ...p, [field]: value } : p));
    setSaved(false);
  };

  const removeProduct = (slug: string) => {
    setProducts(prev => prev.filter(p => p.slug !== slug));
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const setField = (key: keyof typeof emptyForm, value: unknown) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const handleImageFile = (file: File) => {
    setField("imageFile", file);
    setField("previewUrl", URL.createObjectURL(file));
  };

  const handleAddStrain = () => {
    if (!form.name.trim()) return;
    const slug = `${form.brand}-${form.name.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`;
    const newProduct: EditableProduct = {
      slug,
      name: form.name.trim(),
      type: form.type,
      brand: form.brand,
      image: form.previewUrl || "",
      price: parseFloat(form.price) || 0,
      unit: form.unit || "3.5g",
      packageSize: form.packageSize || undefined,
      description: form.description || undefined,
      active: true,
      previewUrl: form.previewUrl || undefined,
    };
    if (form.brand === "allday") setAllday(prev => [...prev, newProduct]);
    else setBlk(prev => [...prev, newProduct]);
    setBrand(form.brand);
    setForm(emptyForm);
    setShowForm(false);
    setSaved(false);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8,
    color: "#fff", fontSize: 14, padding: "10px 12px",
    outline: "none", boxSizing: "border-box",
  };
  const labelStyle: React.CSSProperties = {
    display: "block", marginBottom: 6,
    color: "rgba(255,255,255,0.4)", fontSize: 11,
    fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em",
  };

  return (
    <div>
      {/* Tabs + Add button */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28, borderBottom: "1px solid rgba(0,0,0,0.1)", paddingBottom: 0 }}>
        <div style={{ display: "flex", gap: 8 }}>
          {[{ key: "allday", label: "AllDay Cannabis" }, { key: "blk", label: "AllDay BLK Edition" }].map(({ key, label }) => (
            <button key={key} onClick={() => setBrand(key as "allday" | "blk")} style={{
              background: "none", border: "none", cursor: "pointer",
              padding: "10px 24px", fontSize: 13, fontWeight: 700,
              textTransform: "uppercase", letterSpacing: "0.08em",
              color: brand === key ? "#000" : "rgba(0,0,0,0.35)",
              borderBottom: `2px solid ${brand === key ? "#000" : "transparent"}`,
              marginBottom: -1,
            }}>{label}</button>
          ))}
        </div>
        <button
          onClick={() => setShowForm(v => !v)}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "9px 18px", borderRadius: 8, border: "none", cursor: "pointer",
            background: showForm ? "rgba(255,255,255,0.1)" : "#00f6ff",
            color: showForm ? "rgba(255,255,255,0.7)" : "#000",
            fontSize: 13, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em",
          }}
        >
          {showForm ? <><X size={14} /> Cancel</> : <><Plus size={14} /> Add New Strain</>}
        </button>
      </div>

      {/* ── ADD NEW STRAIN FORM ── */}
      {showForm && (
        <div style={{
          background: "#111", border: "1px solid rgba(0,246,255,0.25)",
          borderRadius: 16, padding: 28, marginBottom: 28,
        }}>
          <h3 style={{ margin: "0 0 24px", color: "#fff", fontSize: 17, fontWeight: 700 }}>New Strain</h3>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
            {/* Image upload */}
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>Product Photo</label>
              <div
                onClick={() => fileRef.current?.click()}
                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleImageFile(f); }}
                style={{
                  border: `2px dashed ${dragging ? "#00f6ff" : "rgba(255,255,255,0.2)"}`,
                  borderRadius: 12, padding: form.previewUrl ? 0 : "40px 24px",
                  textAlign: "center", cursor: "pointer",
                  background: dragging ? "rgba(0,246,255,0.04)" : "transparent",
                  overflow: "hidden", position: "relative",
                  height: form.previewUrl ? 200 : undefined,
                  transition: "border-color 0.2s",
                }}
              >
                {form.previewUrl ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={form.previewUrl} alt="preview" style={{ width: "100%", height: 200, objectFit: "cover", display: "block" }} />
                    <div style={{
                      position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      opacity: 0, transition: "opacity 0.2s",
                    }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = "1"}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = "0"}
                    >
                      <span style={{ color: "#fff", fontSize: 13, fontWeight: 700 }}>Change Photo</span>
                    </div>
                  </>
                ) : (
                  <>
                    <UploadCloud size={32} color="rgba(255,255,255,0.3)" style={{ marginBottom: 10 }} />
                    <p style={{ margin: 0, color: "rgba(255,255,255,0.4)", fontSize: 13 }}>
                      Drag & drop or click to upload
                    </p>
                    <p style={{ margin: "4px 0 0", color: "rgba(255,255,255,0.25)", fontSize: 11 }}>JPG, PNG, WEBP</p>
                  </>
                )}
                <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }}
                  onChange={e => { const f = e.target.files?.[0]; if (f) handleImageFile(f); }} />
              </div>
            </div>

            {/* Name */}
            <div>
              <label style={labelStyle}>Strain Name *</label>
              <input value={form.name} onChange={e => setField("name", e.target.value)}
                placeholder="e.g. Purple Haze" style={inputStyle} />
            </div>

            {/* Type */}
            <div>
              <label style={labelStyle}>Type *</label>
              <select value={form.type} onChange={e => setField("type", e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
                <option value="Sativa">Sativa</option>
                <option value="Indica">Indica</option>
                <option value="Hybrid">Hybrid</option>
                <option value="CBD">CBD</option>
              </select>
            </div>

            {/* Brand */}
            <div>
              <label style={labelStyle}>Brand *</label>
              <select value={form.brand} onChange={e => setField("brand", e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
                <option value="allday">AllDay Cannabis</option>
                <option value="blk">AllDay BLK Edition</option>
              </select>
            </div>

            {/* Price */}
            <div>
              <label style={labelStyle}>Price *</label>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>$</span>
                <input type="number" step="0.01" min="0" value={form.price}
                  onChange={e => setField("price", e.target.value)}
                  placeholder="0.00" style={{ ...inputStyle, width: "auto", flex: 1 }} />
              </div>
            </div>

            {/* Unit */}
            <div>
              <label style={labelStyle}>Unit</label>
              <select value={form.unit} onChange={e => setField("unit", e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
                <option value="3.5g">3.5g</option>
                <option value="7g">7g</option>
                <option value="14g">14g</option>
                <option value="28g">28g (1oz)</option>
                <option value="unit">Per Unit</option>
              </select>
            </div>

            {/* Package Size */}
            <div>
              <label style={labelStyle}>Packaging Size</label>
              <input value={form.packageSize} onChange={e => setField("packageSize", e.target.value)}
                placeholder="e.g. 3.5g — 6 units/case" style={inputStyle} />
            </div>

            {/* Description */}
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>Description</label>
              <textarea value={form.description} onChange={e => setField("description", e.target.value)}
                placeholder="Tasting notes, effects, lineage, terpenes..." rows={3} style={{
                  ...inputStyle, resize: "vertical", lineHeight: 1.6,
                }} />
            </div>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={handleAddStrain} disabled={!form.name.trim()} style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "11px 28px", borderRadius: 8, border: "none", cursor: "pointer",
              background: form.name.trim() ? "#00f6ff" : "rgba(255,255,255,0.1)",
              color: form.name.trim() ? "#000" : "rgba(255,255,255,0.3)",
              fontSize: 13, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em",
            }}>
              <Plus size={15} /> Add Strain
            </button>
            <button onClick={() => { setForm(emptyForm); setShowForm(false); }} style={{
              padding: "11px 20px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.12)",
              background: "none", color: "rgba(255,255,255,0.4)", fontSize: 13, fontWeight: 700, cursor: "pointer",
            }}>Cancel</button>
          </div>
        </div>
      )}

      {/* ── PRODUCT LIST ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 28 }}>
        {/* Header */}
        <div style={{
          display: "grid", gridTemplateColumns: "48px 1fr 80px 120px 180px 80px 36px",
          gap: 12, padding: "0 12px",
          color: "rgba(255,255,255,0.35)", fontSize: 11, fontWeight: 700,
          textTransform: "uppercase", letterSpacing: "0.08em",
        }}>
          <span /><span>Product</span><span>Type</span><span>Price</span><span>Packaging</span><span style={{ textAlign: "center" }}>Active</span><span />
        </div>

        {products.map(p => (
          <div key={p.slug} style={{
            display: "grid", gridTemplateColumns: "48px 1fr 80px 120px 180px 80px 36px",
            gap: 12, alignItems: "center",
            background: p.active ? "#111" : "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 10, padding: "10px 12px",
            opacity: p.active ? 1 : 0.45,
            transition: "opacity 0.2s",
          }}>
            {/* Thumb */}
            <div style={{ width: 40, height: 40, borderRadius: 6, overflow: "hidden", position: "relative", flexShrink: 0, background: "#222" }}>
              {p.image && (
                p.image.startsWith("blob:") || p.image.startsWith("data:") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.image} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <Image src={p.image} alt={p.name} fill style={{ objectFit: "cover" }} sizes="40px" />
                )
              )}
            </div>

            {/* Name + description */}
            <div>
              <span style={{ color: "#fff", fontSize: 14, fontWeight: 600 }}>{p.name}</span>
              {p.description && (
                <p style={{ margin: "2px 0 0", color: "rgba(255,255,255,0.35)", fontSize: 11, lineHeight: 1.4,
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 240 }}>
                  {p.description}
                </p>
              )}
            </div>

            {/* Type */}
            <span style={{
              display: "inline-block",
              background: typeColors[p.type], color: "#000",
              fontSize: 10, fontWeight: 800, textTransform: "uppercase",
              padding: "2px 8px", borderRadius: 999,
            }}>{p.type}</span>

            {/* Price */}
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>$</span>
              <input type="number" step="0.01" min="0" value={p.price}
                onChange={e => update(p.slug, "price", parseFloat(e.target.value) || 0)}
                style={{
                  width: 72, background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.15)", borderRadius: 6,
                  color: "#fff", fontSize: 14, fontWeight: 600,
                  padding: "5px 8px", outline: "none",
                }} />
            </div>

            {/* Packaging */}
            <input value={p.packageSize ?? p.unit} placeholder="e.g. 3.5g — 6/case"
              onChange={e => update(p.slug, "packageSize", e.target.value)}
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.15)", borderRadius: 6,
                color: "#fff", fontSize: 12, padding: "5px 8px", outline: "none", width: "100%", boxSizing: "border-box",
              }} />

            {/* Toggle */}
            <div style={{ display: "flex", justifyContent: "center" }}>
              <button onClick={() => update(p.slug, "active", !p.active)} style={{
                width: 44, height: 24, borderRadius: 999,
                background: p.active ? "#00f6ff" : "rgba(255,255,255,0.1)",
                border: "none", cursor: "pointer", position: "relative", transition: "background 0.2s",
              }}>
                <span style={{
                  position: "absolute", top: 3,
                  left: p.active ? "calc(100% - 21px)" : 3,
                  width: 18, height: 18, borderRadius: "50%",
                  background: "#fff", transition: "left 0.2s",
                }} />
              </button>
            </div>

            {/* Delete */}
            <button onClick={() => removeProduct(p.slug)} style={{
              background: "none", border: "none", cursor: "pointer",
              color: "rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center",
              padding: 4, borderRadius: 4,
            }}>
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Save */}
      <button onClick={handleSave} style={{
        display: "flex", alignItems: "center", gap: 8,
        padding: "12px 40px", borderRadius: 8, border: "none",
        background: saved ? "#16a34a" : "#00f6ff",
        color: "#000", fontSize: 14, fontWeight: 800,
        textTransform: "uppercase", letterSpacing: "0.08em",
        cursor: "pointer", transition: "background 0.2s",
      }}>
        {saved ? <><Check size={16} strokeWidth={3} /> Saved</> : "Save Changes"}
      </button>
    </div>
  );
}
