"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Check, Plus, X, UploadCloud, Trash2, Camera, ChevronLeft, ChevronRight } from "lucide-react";
import {
  alldayProducts, blkProducts, typeColors, statusConfig, allStatuses,
  type MenuProduct, type ProductStatus, type ProductVariant,
} from "@/lib/data/menu";
import { terpeneList } from "@/lib/data/terpenes";

type EditableProduct = MenuProduct & { active: boolean; images: string[]; previewUrl?: string };

type BrandEntry = {
  value: string;
  label: string;
  logo: string;
  description: string;
  accentColor: string;
};

const seedBrands: BrandEntry[] = [
  { value: "allday",      label: "AllDay Cannabis",       logo: "/logos/allday-logo.png",          description: "", accentColor: "#00f6ff" },
  { value: "blk",         label: "AllDay BLK Edition",    logo: "/assets/extracted/black-edition-logo.svg", description: "", accentColor: "#ffffff" },
  { value: "nelsonCraft", label: "Nelson Craft Cannabis", logo: "/logos/nelson-craft-logo.jpg",    description: "", accentColor: "#c8a96e" },
  { value: "gcExotics",   label: "GC Exotics",            logo: "/logos/gc-exotics-logo.jpg",      description: "", accentColor: "#ffd700" },
  { value: "haidaGwaii",  label: "Haida Gwaii",           logo: "/logos/haida-gwaii-logo.jpg",     description: "", accentColor: "#f5c842" },
  { value: "leafcross",   label: "Leaf Cross Biomedical", logo: "/logos/lc-bio-logo.png",          description: "", accentColor: "#00f6ff" },
];

const toEditable = (p: MenuProduct & { active?: boolean }): EditableProduct => ({
  ...p,
  active: p.active ?? true,
  images: p.images ?? (p.image ? [p.image] : []),
});

const emptyForm = {
  name: "",
  sku: "",
  type: "Sativa" as MenuProduct["type"],
  brand: "allday",
  noBrand: false,
  status: "Available" as ProductStatus,
  price: "",
  pricePerCase: "",
  unit: "3.5g",
  unitsPerCase: "",
  inventory: "",
  maxOrderQty: "",
  thc: "",
  cbd: "",
  cbg: "",
  terpene1: "",
  terpene2: "",
  terpene3: "",
  packageSize: "",
  description: "",
  imageFile: null as File | null,
  previewUrl: "",
  variants: [] as ProductVariant[],
};

const emptyBrandForm = {
  label: "",
  accentColor: "#00f6ff",
  description: "",
  logoPreview: "",
  logoFile: null as File | null,
};

export default function MenuManagerClient() {
  const staticAll = [...alldayProducts.map(toEditable), ...blkProducts.map(toEditable)];
  const [products, setProducts]   = useState<EditableProduct[]>(staticAll);
  const [dbSeeded, setDbSeeded]   = useState(false);
  const [menuLoading, setMenuLoading] = useState(true);
  const [brands, setBrands]       = useState<BrandEntry[]>(seedBrands);
  const [brandFilter, setBrandFilter] = useState<string>("all");
  // (variants stored directly in products state — update() spreads {...p} which preserves p.variants)
  const [saved, setSaved]         = useState(false);
  const [saving, setSaving]       = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [seeding, setSeeding]     = useState(false);
  const [showForm, setShowForm]   = useState(false);
  const [showBrandForm, setShowBrandForm] = useState(false);
  const [form, setForm]           = useState(emptyForm);
  const [brandForm, setBrandForm] = useState(emptyBrandForm);
  const [dragging, setDragging]   = useState(false);
  const [brandDragging, setBrandDragging] = useState(false);
  const fileRef     = useRef<HTMLInputElement>(null);
  const brandLogoRef = useRef<HTMLInputElement>(null);
  const editImgRef  = useRef<HTMLInputElement>(null);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [editingAddSlug, setEditingAddSlug] = useState<string | null>(null);
  const addImgRef   = useRef<HTMLInputElement>(null);

  // Load live menu from DB on mount
  useEffect(() => {
    fetch("/api/admin/menu")
      .then(r => r.json())
      .then(j => {
        if (j.data?.length) {
          const loaded = j.data.map((p: MenuProduct & { active?: boolean }) => toEditable({ ...p, active: p.active ?? true }));
          setProducts(loaded);
          setDbSeeded(true);
        } else {
          setDbSeeded(false); // DB empty — show seed prompt
        }
      })
      .catch(() => {})
      .finally(() => setMenuLoading(false));
  }, []);

  const uniqueBrandValues = Array.from(new Set(products.map(p => p.brand)));

  const visibleProducts = brandFilter === "all"
    ? products
    : products.filter(p => p.brand === brandFilter);

  const getBrandLabel = (val: string) => brands.find(b => b.value === val)?.label ?? val;

  const update = (slug: string, field: keyof EditableProduct, value: unknown) => {
    setProducts(prev => prev.map(p => p.slug === slug ? { ...p, [field]: value } : p));
    setSaved(false);
  };

  const SIZES = ["3.5g", "7g", "14g", "28g"];

  const addProductVariant = (slug: string, basePrice: number) => {
    setProducts(prev => prev.map(p => {
      if (p.slug !== slug) return p;
      const current = Array.isArray(p.variants) ? p.variants : [];
      const used = new Set(current.map(v => v.size));
      const nextSize = SIZES.find(s => !used.has(s)) ?? "3.5g";
      return { ...p, variants: [...current, { size: nextSize, sku: "", price: basePrice, inventory: 0, maxOrderQty: undefined }] };
    }));
    setSaved(false);
  };

  const updateProductVariant = (slug: string, idx: number, field: keyof ProductVariant, val: string | number | undefined) => {
    setProducts(prev => prev.map(p => {
      if (p.slug !== slug) return p;
      const vs = [...(Array.isArray(p.variants) ? p.variants : [])];
      vs[idx] = { ...vs[idx], [field]: val };
      return { ...p, variants: vs };
    }));
    setSaved(false);
  };

  const removeProductVariant = (slug: string, idx: number) => {
    setProducts(prev => prev.map(p => {
      if (p.slug !== slug) return p;
      return { ...p, variants: (Array.isArray(p.variants) ? p.variants : []).filter((_, i) => i !== idx) };
    }));
    setSaved(false);
  };

  const removeProduct = async (slug: string) => {
    // Compute remaining BEFORE the async state update
    const remaining = products.filter(p => p.slug !== slug);
    setProducts(remaining);
    setSaved(false);
    // Immediately persist to DB — also removes the deleted product from the table
    try {
      await fetch("/api/admin/menu", {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(remaining.map((p, i) => ({ ...p, active: p.active, sort_order: i }))),
      });
    } catch { /* silent — Save button is a fallback */ }
  };

  // Replace primary image on an existing product
  const handleEditImageFile = (file: File) => {
    if (!editingSlug) return;
    const url = URL.createObjectURL(file);
    setProducts(prev => prev.map(p => {
      if (p.slug !== editingSlug) return p;
      const imgs = [url, ...p.images.slice(1)];
      return { ...p, image: url, images: imgs };
    }));
    setEditingSlug(null);
    setSaved(false);
  };

  // Add an extra image to an existing product
  const handleAddImageFile = (file: File) => {
    if (!editingAddSlug) return;
    const url = URL.createObjectURL(file);
    setProducts(prev => prev.map(p => {
      if (p.slug !== editingAddSlug) return p;
      const imgs = [...p.images, url];
      return { ...p, images: imgs };
    }));
    setEditingAddSlug(null);
    setSaved(false);
  };

  const removeImage = (slug: string, url: string) => {
    setProducts(prev => prev.map(p => {
      if (p.slug !== slug) return p;
      const imgs = p.images.filter(i => i !== url);
      return { ...p, images: imgs, image: imgs[0] ?? "" };
    }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);
    try {
      const res = await fetch("/api/admin/menu", {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(products.map((p, i) => ({
          ...p,
          pricePerCase: Math.round(p.price * 24 * 100) / 100,
          unitsPerCase: 24,
          variants:   Array.isArray(p.variants) ? p.variants : [],
          active:     p.active,
          sort_order: i,
        }))),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Save failed");
      setDbSeeded(true);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleSeed = async () => {
    setSeeding(true);
    try {
      const res = await fetch("/api/admin/menu", { method: "POST" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Seed failed");
      // Reload from DB
      const r2 = await fetch("/api/admin/menu");
      const j2 = await r2.json();
      if (j2.data?.length) {
        setProducts(j2.data.map((p: MenuProduct & { active?: boolean }) => toEditable({ ...p, active: p.active ?? true })));
        setDbSeeded(true);
      }
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : "Seed failed");
    } finally {
      setSeeding(false);
    }
  };

  const setField = (key: keyof typeof emptyForm, value: unknown) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const setBrandField = (key: keyof typeof emptyBrandForm, value: unknown) =>
    setBrandForm(prev => ({ ...prev, [key]: value }));

  const handleImageFile = (file: File) => {
    setField("imageFile", file);
    setField("previewUrl", URL.createObjectURL(file));
  };

  const handleBrandLogoFile = (file: File) => {
    setBrandField("logoFile", file);
    setBrandField("logoPreview", URL.createObjectURL(file));
  };

  const handleAddBrand = () => {
    if (!brandForm.label.trim()) return;
    const slug = brandForm.label.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    const value = `custom-${slug}-${Date.now()}`;
    setBrands(prev => [...prev, {
      value,
      label: brandForm.label.trim(),
      logo: brandForm.logoPreview,
      description: brandForm.description,
      accentColor: brandForm.accentColor,
    }]);
    setBrandForm(emptyBrandForm);
    setShowBrandForm(false);
  };

  // Variant helpers for the "Add Strain" form
  const addFormVariant = () => {
    setForm(prev => {
      const used = new Set(prev.variants.map(v => v.size));
      const nextSize = SIZES.find(s => !used.has(s)) ?? "3.5g";
      return { ...prev, variants: [...prev.variants, { size: nextSize, sku: "", price: parseFloat(prev.price) || 0, inventory: 0, maxOrderQty: undefined }] };
    });
  };
  const updateFormVariant = (idx: number, field: keyof ProductVariant, val: string | number | undefined) => {
    setForm(prev => {
      const vs = [...prev.variants];
      vs[idx] = { ...vs[idx], [field]: val };
      return { ...prev, variants: vs };
    });
  };
  const removeFormVariant = (idx: number) => {
    setForm(prev => ({ ...prev, variants: prev.variants.filter((_, i) => i !== idx) }));
  };

  const handleAddStrain = () => {
    if (!form.name.trim()) return;
    const effectiveBrand = form.noBrand ? "" : form.brand;
    const slug = `${effectiveBrand || "nobrand"}-${form.name.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`;
    const newProduct: EditableProduct = {
      slug,
      name:         form.name.trim(),
      sku:          form.sku.trim() || undefined,
      type:         form.type,
      brand:        effectiveBrand,
      image:        form.previewUrl || "",
      images:       form.previewUrl ? [form.previewUrl] : [],
      price:        parseFloat(form.price) || 0,
      pricePerCase: parseFloat(form.pricePerCase) || undefined,
      unit:         form.unit || "3.5g",
      unitsPerCase: parseInt(form.unitsPerCase) || undefined,
      inventory:    parseInt(form.inventory) >= 0 ? parseInt(form.inventory) : undefined,
      maxOrderQty:  parseInt(form.maxOrderQty) || undefined,
      thc:          form.thc || undefined,
      cbd:          form.cbd || undefined,
      cbg:          form.cbg || undefined,
      terpene1:     form.terpene1 || undefined,
      terpene2:     form.terpene2 || undefined,
      terpene3:     form.terpene3 || undefined,
      packageSize:  form.packageSize || undefined,
      description:  form.description || undefined,
      variants:     form.variants.length > 0 ? form.variants : undefined,
      active:       true,
      status:       form.status,
    };
    setProducts(prev => [...prev, newProduct]);
    setForm(emptyForm);
    setShowForm(false);
    setSaved(false);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", background: "#1a1a1a",
    border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8,
    color: "#fff", fontSize: 14, padding: "10px 12px",
    outline: "none", boxSizing: "border-box",
    appearance: "none" as const,
  };
  const labelStyle: React.CSSProperties = {
    display: "block", marginBottom: 6,
    color: "rgba(255,255,255,0.4)", fontSize: 11,
    fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em",
  };
  const filterPillStyle = (active: boolean): React.CSSProperties => ({
    padding: "6px 16px", borderRadius: 999,
    border: active ? "none" : "1px solid rgba(255,255,255,0.15)",
    background: active ? "#00f6ff" : "rgba(255,255,255,0.06)",
    color: active ? "#000" : "rgba(255,255,255,0.6)",
    fontSize: 12, fontWeight: 700,
    textTransform: "uppercase" as const, letterSpacing: "0.06em",
    cursor: "pointer", transition: "all 0.15s ease",
  });

  // Shared select style for row dropdowns — dark text so it's readable on macOS light mode
  const rowSelectStyle = (extra?: React.CSSProperties): React.CSSProperties => ({
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.18)",
    borderRadius: 4, color: "#fff",
    fontSize: 10, fontWeight: 700,
    padding: "2px 5px", outline: "none",
    cursor: "pointer", boxSizing: "border-box",
    ...extra,
  });

  return (
    <div>
      {/* Hidden file inputs for image editing */}
      <input ref={editImgRef}  type="file" accept="image/*" style={{ display: "none" }}
        onChange={e => { const f = e.target.files?.[0]; if (f) handleEditImageFile(f); e.target.value = ""; }} />
      <input ref={addImgRef}   type="file" accept="image/*" style={{ display: "none" }}
        onChange={e => { const f = e.target.files?.[0]; if (f) handleAddImageFile(f); e.target.value = ""; }} />

      {/* ── Toolbar ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        {/* Brand filter pills */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <button style={filterPillStyle(brandFilter === "all")} onClick={() => setBrandFilter("all")}>
            All ({products.length})
          </button>
          {uniqueBrandValues.map(b => (
            <button key={b} style={filterPillStyle(brandFilter === b)} onClick={() => setBrandFilter(b)}>
              {getBrandLabel(b)} ({products.filter(p => p.brand === b).length})
            </button>
          ))}
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => { setShowBrandForm(v => !v); setShowForm(false); }}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "9px 18px", borderRadius: 8, border: "none", cursor: "pointer",
              background: showBrandForm ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.08)",
              color: showBrandForm ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.6)",
              fontSize: 13, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em",
            }}
          >
            {showBrandForm ? <><X size={14} /> Cancel</> : <><Plus size={14} /> Add Brand</>}
          </button>
          <button
            onClick={() => { setShowForm(v => !v); setShowBrandForm(false); }}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "9px 18px", borderRadius: 8, border: "none", cursor: "pointer",
              background: showForm ? "rgba(255,255,255,0.1)" : "#00f6ff",
              color: showForm ? "rgba(255,255,255,0.7)" : "#000",
              fontSize: 13, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em",
            }}
          >
            {showForm ? <><X size={14} /> Cancel</> : <><Plus size={14} /> Add Strain</>}
          </button>
        </div>
      </div>

      {/* ── ADD NEW BRAND FORM ── */}
      {showBrandForm && (
        <div style={{ background: "#111", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 16, padding: 28, marginBottom: 28 }}>
          <h3 style={{ margin: "0 0 24px", color: "#fff", fontSize: 17, fontWeight: 700 }}>New Brand</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>

            {/* Brand Logo */}
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>Brand Logo</label>
              <div
                onClick={() => brandLogoRef.current?.click()}
                onDragOver={e => { e.preventDefault(); setBrandDragging(true); }}
                onDragLeave={() => setBrandDragging(false)}
                onDrop={e => { e.preventDefault(); setBrandDragging(false); const f = e.dataTransfer.files[0]; if (f) handleBrandLogoFile(f); }}
                style={{
                  border: `2px dashed ${brandDragging ? "#00f6ff" : "rgba(255,255,255,0.2)"}`,
                  borderRadius: 12, cursor: "pointer",
                  background: brandDragging ? "rgba(0,246,255,0.04)" : "transparent",
                  display: "flex", alignItems: "center", gap: 20, padding: 16,
                  transition: "border-color 0.2s",
                }}
              >
                {brandForm.logoPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={brandForm.logoPreview} alt="logo preview" style={{ height: 60, maxWidth: 160, objectFit: "contain" }} />
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flex: 1, padding: "16px 0" }}>
                    <UploadCloud size={28} color="rgba(255,255,255,0.3)" />
                    <p style={{ margin: 0, color: "rgba(255,255,255,0.4)", fontSize: 12 }}>Upload brand logo — PNG, SVG, JPG</p>
                  </div>
                )}
                <input ref={brandLogoRef} type="file" accept="image/*,.svg" style={{ display: "none" }}
                  onChange={e => { const f = e.target.files?.[0]; if (f) handleBrandLogoFile(f); }} />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Brand Name *</label>
              <input value={brandForm.label} onChange={e => setBrandField("label", e.target.value)}
                placeholder="e.g. Mountain Craft" style={inputStyle} autoFocus />
            </div>

            <div>
              <label style={labelStyle}>Accent Colour</label>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <input type="color" value={brandForm.accentColor}
                  onChange={e => setBrandField("accentColor", e.target.value)}
                  style={{ width: 44, height: 36, border: "none", borderRadius: 6, cursor: "pointer", background: "none", padding: 0 }} />
                <input value={brandForm.accentColor} onChange={e => setBrandField("accentColor", e.target.value)}
                  placeholder="#00f6ff" style={{ ...inputStyle, flex: 1 }} />
              </div>
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>Description (optional)</label>
              <textarea value={brandForm.description} onChange={e => setBrandField("description", e.target.value)}
                placeholder="Short brand tagline or description…" rows={2}
                style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }} />
            </div>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={handleAddBrand} disabled={!brandForm.label.trim()} style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "11px 28px", borderRadius: 8, border: "none", cursor: "pointer",
              background: brandForm.label.trim() ? "#00f6ff" : "rgba(255,255,255,0.1)",
              color: brandForm.label.trim() ? "#000" : "rgba(255,255,255,0.3)",
              fontSize: 13, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em",
            }}>
              <Plus size={15} /> Add Brand
            </button>
            <button onClick={() => { setBrandForm(emptyBrandForm); setShowBrandForm(false); }} style={{
              padding: "11px 20px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.12)",
              background: "none", color: "rgba(255,255,255,0.4)", fontSize: 13, fontWeight: 700, cursor: "pointer",
            }}>Cancel</button>
          </div>
        </div>
      )}

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
                    <p style={{ margin: 0, color: "rgba(255,255,255,0.4)", fontSize: 13 }}>Drag & drop or click to upload</p>
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

            {/* SKU */}
            <div>
              <label style={labelStyle}>SKU (optional)</label>
              <input value={form.sku} onChange={e => setField("sku", e.target.value)}
                placeholder="e.g. AD-PH-3.5G" style={inputStyle} />
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

            {/* Brand — existing or none */}
            <div>
              <label style={labelStyle}>Brand</label>
              <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                <div style={{ flex: "1 1 200px" }}>
                  <select
                    value={form.noBrand ? "__none__" : form.brand}
                    onChange={e => {
                      if (e.target.value === "__none__") {
                        setField("noBrand", true);
                      } else {
                        setField("noBrand", false);
                        setField("brand", e.target.value);
                      }
                    }}
                    style={{ ...inputStyle, cursor: "pointer" }}
                  >
                    <option value="__none__">— No Brand —</option>
                    {brands.map(b => (
                      <option key={b.value} value={b.value}>{b.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Status */}
            <div>
              <label style={labelStyle}>Availability Status *</label>
              <select value={form.status} onChange={e => setField("status", e.target.value as ProductStatus)} style={{ ...inputStyle, cursor: "pointer" }}>
                {allStatuses.map(s => (
                  <option key={s} value={s}>{statusConfig[s].label}</option>
                ))}
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

            {/* Price per case */}
            <div>
              <label style={labelStyle}>Price per Case</label>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>$</span>
                <input type="number" step="0.01" min="0" value={form.pricePerCase}
                  onChange={e => setField("pricePerCase", e.target.value)}
                  placeholder="0.00" style={{ ...inputStyle, width: "auto", flex: 1 }} />
              </div>
            </div>

            {/* Unit size */}
            <div>
              <label style={labelStyle}>Unit Size</label>
              <select value={form.unit} onChange={e => setField("unit", e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
                <option value="3.5g">3.5g</option>
                <option value="7g">7g</option>
                <option value="14g">14g</option>
                <option value="28g">28g (1oz)</option>
                <option value="unit">Per Unit</option>
              </select>
            </div>

            {/* Units per case */}
            <div>
              <label style={labelStyle}>Units per Case</label>
              <input type="number" min="1" step="1" value={form.unitsPerCase}
                onChange={e => setField("unitsPerCase", e.target.value)}
                placeholder="e.g. 24" style={inputStyle} />
            </div>

            {/* Inventory */}
            <div>
              <label style={labelStyle}>Available Inventory (units)</label>
              <input type="number" min="0" step="1" value={form.inventory}
                onChange={e => setField("inventory", e.target.value)}
                placeholder="e.g. 120" style={inputStyle} />
            </div>

            {/* Max order qty */}
            <div>
              <label style={labelStyle}>Max Order Qty (per retailer)</label>
              <input type="number" min="1" step="1" value={form.maxOrderQty}
                onChange={e => setField("maxOrderQty", e.target.value)}
                placeholder="e.g. 48" style={inputStyle} />
            </div>

            {/* Cannabinoids */}
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={{ ...labelStyle, marginBottom: 12 }}>Cannabinoid Content (optional)</label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                {(["thc", "cbd", "cbg"] as const).map(key => (
                  <div key={key}>
                    <label style={{ ...labelStyle, fontSize: 10, color: key === "thc" ? "#4ade80" : key === "cbd" ? "#60a5fa" : "#c4b5fd" }}>
                      {key.toUpperCase()}
                    </label>
                    <input value={form[key]} onChange={e => setField(key, e.target.value)}
                      placeholder={key === "cbd" ? "e.g. Less than 1%" : "e.g. 25%–30%"}
                      style={inputStyle} />
                  </div>
                ))}
              </div>
            </div>

            {/* Terpenes */}
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={{ ...labelStyle, marginBottom: 12 }}>Terpenes (optional)</label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                {(["terpene1", "terpene2", "terpene3"] as const).map((key, i) => (
                  <div key={key}>
                    <label style={{ ...labelStyle, fontSize: 10 }}>Terpene {i + 1}</label>
                    <select value={form[key]} onChange={e => setField(key, e.target.value)}
                      style={{ ...inputStyle, cursor: "pointer" }}>
                      <option value="">— None —</option>
                      {terpeneList.map(t => (
                        <option key={t.name} value={t.name}>{t.name}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>

            {/* Package Size notes */}
            <div>
              <label style={labelStyle}>Packaging Notes (optional)</label>
              <input value={form.packageSize} onChange={e => setField("packageSize", e.target.value)}
                placeholder="e.g. sealed glass jar" style={inputStyle} />
            </div>

            {/* Description */}
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>Description</label>
              <textarea value={form.description} onChange={e => setField("description", e.target.value)}
                placeholder="Tasting notes, effects, lineage, terpenes..." rows={3}
                style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }} />
            </div>

            {/* Package Size Variants */}
            <div style={{ gridColumn: "1 / -1" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <label style={labelStyle}>Package Sizes / Government SKUs</label>
                <button type="button" onClick={addFormVariant} style={{
                  display: "flex", alignItems: "center", gap: 5,
                  padding: "5px 12px", borderRadius: 6, border: "none",
                  background: "rgba(0,246,255,0.12)", color: "#00f6ff",
                  fontSize: 11, fontWeight: 800, cursor: "pointer",
                }}>
                  <Plus size={11} /> Add Size
                </button>
              </div>
              {form.variants.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {form.variants.map((v, i) => (
                    <div key={`form-variant-${i}`} style={{ background: "rgba(0,246,255,0.04)", border: "1px solid rgba(0,246,255,0.15)", borderRadius: 10, padding: "14px 16px" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "110px 1fr 140px 28px", gap: 10, alignItems: "center", marginBottom: 10 }}>
                        <select value={v.size} onChange={e => updateFormVariant(i, "size", e.target.value)} style={{ ...inputStyle, fontSize: 13 }}>
                          <option value="3.5g">3.5g</option>
                          <option value="7g">7g</option>
                          <option value="14g">14g</option>
                          <option value="28g">28g (1oz)</option>
                        </select>
                        <input value={v.sku} onChange={e => updateFormVariant(i, "sku", e.target.value)}
                          placeholder="Government-registered SKU…" style={inputStyle} />
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>$</span>
                          <input type="number" step="0.01" min="0" value={v.price}
                            onChange={e => updateFormVariant(i, "price", parseFloat(e.target.value) || 0)}
                            placeholder="0.00" style={{ ...inputStyle, flex: 1 }} />
                        </div>
                        <button type="button" onClick={() => removeFormVariant(i)} style={{
                          background: "none", border: "none", cursor: "pointer",
                          color: "rgba(255,255,255,0.3)", padding: 4,
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          <X size={14} />
                        </button>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                        <div>
                          <label style={{ ...labelStyle, fontSize: 10 }}>Cases Available (Stock)</label>
                          <input type="number" min="0" step="1" value={v.inventory ?? ""}
                            placeholder="0"
                            onChange={e => updateFormVariant(i, "inventory", parseInt(e.target.value) >= 0 ? parseInt(e.target.value) : 0)}
                            style={inputStyle} />
                        </div>
                        <div>
                          <label style={{ ...labelStyle, fontSize: 10 }}>Max Order Qty</label>
                          <input type="number" min="1" step="1" value={v.maxOrderQty ?? ""}
                            placeholder="—"
                            onChange={e => updateFormVariant(i, "maxOrderQty", parseInt(e.target.value) || undefined)}
                            style={inputStyle} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ margin: 0, color: "rgba(255,255,255,0.25)", fontSize: 12 }}>
                  Optional — add one row per package size. Each size needs its own government-registered SKU.
                </p>
              )}
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
          display: "grid", gridTemplateColumns: "56px 1fr 110px 90px 150px 120px 290px 80px 36px",
          gap: 12, padding: "0 12px",
          color: "rgba(255,255,255,0.35)", fontSize: 11, fontWeight: 700,
          textTransform: "uppercase", letterSpacing: "0.08em",
        }}>
          <span /><span>Product</span><span>Brand</span><span>Type</span><span>Status</span>
          <span>Price (unit/case)</span><span>Sizes / SKUs</span>
          <span style={{ textAlign: "center" }}>Active</span><span />
        </div>

        {visibleProducts.map(p => (
          <div key={p.slug} style={{
            display: "grid", gridTemplateColumns: "56px 1fr 110px 90px 150px 120px 290px 80px 36px",
            gap: 12, alignItems: "start",
            background: p.active ? "#111" : "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 10, padding: "10px 12px",
            opacity: p.active ? 1 : 0.45,
            transition: "opacity 0.2s",
          }}>

            {/* Thumbnail + image strip */}
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {/* Primary thumb — click to replace */}
              <div
                style={{ width: 48, height: 48, borderRadius: 6, overflow: "hidden", position: "relative", flexShrink: 0, background: "#222", cursor: "pointer" }}
                onClick={() => { setEditingSlug(p.slug); editImgRef.current?.click(); }}
                title="Click to replace main photo"
              >
                {(p.previewUrl || p.images[0] || p.image) && (
                  (p.previewUrl || p.images[0] || p.image).startsWith("blob:") || (p.previewUrl || p.images[0] || p.image).startsWith("data:") ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.previewUrl || p.images[0] || p.image} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <Image src={p.images[0] || p.image} alt={p.name} fill style={{ objectFit: "cover" }} sizes="48px" />
                  )
                )}
                <div style={{
                  position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  opacity: 0, transition: "opacity 0.15s",
                }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = "1"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = "0"}
                >
                  <Camera size={14} color="#fff" />
                </div>
              </div>

              {/* Extra image strip */}
              {p.images.length > 1 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {p.images.slice(1).map((img, idx) => (
                    <div key={idx} style={{ position: "relative", width: 24, height: 24, borderRadius: 3, overflow: "hidden", background: "#333" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      <button
                        onClick={() => removeImage(p.slug, img)}
                        style={{ position: "absolute", inset: 0, background: "rgba(239,68,68,0.8)", border: "none", color: "#fff", cursor: "pointer", display: "none", alignItems: "center", justifyContent: "center" }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.display = "flex"}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.display = "none"}
                      >
                        <X size={8} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {/* Add photo */}
              <button
                title="Add another photo"
                onClick={() => { setEditingAddSlug(p.slug); addImgRef.current?.click(); }}
                style={{
                  width: 24, height: 24, borderRadius: 4, border: "1px dashed rgba(255,255,255,0.25)",
                  background: "transparent", color: "rgba(255,255,255,0.4)",
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 14, lineHeight: 1,
                }}
              >+</button>
            </div>

            {/* Name + SKU + description + cannabinoids + terpene selects */}
            <div>
              <input value={p.name}
                onChange={e => update(p.slug, "name", e.target.value)}
                style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 4, color: "#fff", fontSize: 14, fontWeight: 600, padding: "2px 6px", outline: "none", width: "100%", boxSizing: "border-box" }} />
              {/* SKU */}
              <input
                value={(p as Record<string,unknown>).sku as string ?? ""}
                onChange={e => update(p.slug, "sku" as keyof EditableProduct, e.target.value || undefined)}
                placeholder="SKU…"
                style={{ marginTop: 2, background: "transparent", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 4, color: "rgba(255,255,255,0.45)", fontSize: 9, padding: "2px 6px", outline: "none", width: "100%", boxSizing: "border-box", fontWeight: 600, letterSpacing: "0.04em" }} />
              <input value={p.description ?? ""}
                onChange={e => update(p.slug, "description", e.target.value || undefined)}
                placeholder="Description…"
                style={{ marginTop: 2, background: "transparent", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 4, color: "rgba(255,255,255,0.4)", fontSize: 10, padding: "2px 6px", outline: "none", width: "100%", boxSizing: "border-box" }} />

              {/* Cannabinoid inputs */}
              <div style={{ display: "flex", flexDirection: "column", gap: 3, marginTop: 5 }}>
                {(["thc", "cbd", "cbg"] as const).map(key => {
                  const colors: Record<string, string> = { thc: "#4ade80", cbd: "#60a5fa", cbg: "#c4b5fd" };
                  return (
                    <div key={key} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <span style={{ color: colors[key], fontSize: 8, fontWeight: 800, width: 22, flexShrink: 0, textTransform: "uppercase" }}>{key}</span>
                      <input value={(p as Record<string, unknown>)[key] as string ?? ""}
                        onChange={e => update(p.slug, key as keyof typeof p, e.target.value || undefined)}
                        placeholder="—"
                        style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${colors[key]}33`, borderRadius: 4, color: "#fff", fontSize: 10, padding: "2px 5px", outline: "none", width: 100, boxSizing: "border-box" }} />
                    </div>
                  );
                })}
              </div>

              {/* Terpene selects — dark text for macOS readability */}
              <div style={{ display: "flex", flexDirection: "column", gap: 3, marginTop: 5 }}>
                {(["terpene1", "terpene2", "terpene3"] as const).map((key, i) => {
                  const val = (p as Record<string, unknown>)[key] as string | undefined;
                  const tc  = terpeneList.find(x => x.name === val);
                  return (
                    <div key={key} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 8, fontWeight: 800, width: 22, flexShrink: 0 }}>T{i + 1}</span>
                      <select value={val ?? ""}
                        onChange={e => update(p.slug, key as keyof typeof p, e.target.value || undefined)}
                        style={rowSelectStyle({
                          background: val && tc ? `${tc.color}22` : "rgba(255,255,255,0.05)",
                          border: `1px solid ${val && tc ? tc.color + "55" : "rgba(255,255,255,0.12)"}`,
                          width: 108,
                        })}
                      >
                        <option value="">— None —</option>
                        {terpeneList.map(t => (
                          <option key={t.name} value={t.name}>{t.name}</option>
                        ))}
                      </select>
                    </div>
                  );
                })}
              </div>

            </div>

            {/* Brand dropdown — dark text */}
            <select
              value={p.brand}
              onChange={e => update(p.slug, "brand", e.target.value)}
              style={rowSelectStyle({ width: "100%", fontSize: 11 })}
            >
              <option value="">— None —</option>
              {brands.map(b => (
                <option key={b.value} value={b.value}>{b.label}</option>
              ))}
            </select>

            {/* Type dropdown — dark text */}
            <select value={p.type}
              onChange={e => update(p.slug, "type", e.target.value as MenuProduct["type"])}
              style={rowSelectStyle({
                background: `${typeColors[p.type]}22`,
                border: `1px solid ${typeColors[p.type]}66`,
                borderRadius: 999, width: "100%",
              })}
            >
              {(["Sativa", "Indica", "Hybrid", "CBD"] as const).map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>

            {/* Status */}
            {(() => {
              const s = (p.status ?? "Available") as ProductStatus;
              const cfg = statusConfig[s];
              return (
                <select value={s}
                  onChange={e => update(p.slug, "status", e.target.value as ProductStatus)}
                  style={{
                    background: `${cfg.bg}22`, border: `1px solid ${cfg.bg}66`,
                    borderRadius: 6, color: cfg.color || "#111",
                    fontSize: 11, fontWeight: 700,
                    padding: "4px 6px", outline: "none",
                    cursor: "pointer", width: "100%",
                  }}
                >
                  {allStatuses.map(st => (
                    <option key={st} value={st} style={{ background: "#fff", color: "#111" }}>
                      {statusConfig[st].label}
                    </option>
                  ))}
                </select>
              );
            })()}

            {/* Price — unit + case stacked */}
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 9, width: 26, flexShrink: 0 }}>unit</span>
                <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 11 }}>$</span>
                <input type="number" step="0.01" min="0" value={p.price}
                  onChange={e => update(p.slug, "price", parseFloat(e.target.value) || 0)}
                  style={{ width: 60, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 5, color: "#fff", fontSize: 12, fontWeight: 600, padding: "3px 6px", outline: "none" }} />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 9, width: 26, flexShrink: 0 }}>case</span>
                <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 11 }}>$</span>
                <span style={{ width: 60, color: "rgba(0,246,255,0.7)", fontSize: 12, fontWeight: 600, padding: "3px 6px" }}>
                  {(p.price * 24).toFixed(2)}
                </span>
                <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 8, marginLeft: 1 }}>×24</span>
              </div>
            </div>

            {/* ── Sizes / SKUs column (right side) ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              {((Array.isArray(p.variants) ? p.variants : [])).length === 0 ? (
                /* No variants — single size block */
                (() => {
                  const inv = p.inventory ?? null;
                  const invColor = inv === null ? "rgba(255,255,255,0.4)" : inv === 0 ? "#f87171" : inv <= 10 ? "#fb923c" : "#4ade80";
                  return (
                    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 7, padding: "8px 10px", display: "flex", flexDirection: "column", gap: 6 }}>
                      {/* Row 1: Size + case label */}
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 9, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.06em", width: 32, flexShrink: 0 }}>Size</span>
                        <input value={p.unit} placeholder="e.g. 3.5g"
                          onChange={e => update(p.slug, "unit", e.target.value)}
                          style={{ width: 56, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 5, color: "#fff", fontSize: 11, fontWeight: 600, padding: "4px 6px", outline: "none", boxSizing: "border-box" as const }} />
                        <span style={{ color: "rgba(0,246,255,0.45)", fontSize: 9, fontWeight: 700 }}>· 24 units / case</span>
                      </div>
                      {/* Row 2: Stock + cases */}
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 9, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.06em", width: 32, flexShrink: 0 }}>Stock</span>
                        <input type="number" min="0" step="1" value={inv ?? ""}
                          onChange={e => update(p.slug, "inventory", parseInt(e.target.value) >= 0 ? parseInt(e.target.value) : undefined)}
                          placeholder="0"
                          style={{ width: 56, background: "rgba(255,255,255,0.06)", border: `1px solid ${inv !== null && inv <= 10 ? invColor + "80" : "rgba(255,255,255,0.15)"}`, borderRadius: 5, color: invColor, fontSize: 11, fontWeight: 700, padding: "4px 6px", outline: "none", boxSizing: "border-box" as const }} />
                        {inv !== null && (
                          <span style={{ color: "rgba(74,222,128,0.5)", fontSize: 9, fontWeight: 700 }}>
                            = {Math.floor(inv / 24)} cases
                          </span>
                        )}
                      </div>
                      {/* Row 3: Max order */}
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 9, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.06em", width: 32, flexShrink: 0 }}>Max</span>
                        <input type="number" min="1" step="1" value={p.maxOrderQty ?? ""}
                          onChange={e => update(p.slug, "maxOrderQty", parseInt(e.target.value) || undefined)}
                          placeholder="—"
                          style={{ width: 56, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 5, color: "rgba(255,255,255,0.6)", fontSize: 11, padding: "4px 6px", outline: "none", boxSizing: "border-box" as const }} />
                        <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 9 }}>units / order</span>
                      </div>
                    </div>
                  );
                })()
              ) : (
                /* Has variants — one card per size */
                ((Array.isArray(p.variants) ? p.variants : [])).map((v, vi) => (
                  <div key={`${p.slug}-variant-${vi}`} style={{ background: "rgba(0,246,255,0.03)", border: "1px solid rgba(0,246,255,0.15)", borderRadius: 7, overflow: "hidden" }}>
                    {/* Card header */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "5px 8px", background: "rgba(0,246,255,0.06)", borderBottom: "1px solid rgba(0,246,255,0.1)" }}>
                      <select
                        value={v.size}
                        onChange={e => updateProductVariant(p.slug, vi, "size", e.target.value)}
                        style={{ ...rowSelectStyle({ fontSize: 11 }), fontWeight: 800, color: "#00f6ff", background: "transparent", border: "none", padding: "0 2px", outline: "none", cursor: "pointer" }}
                      >
                        <option value="3.5g">3.5g</option>
                        <option value="7g">7g</option>
                        <option value="14g">14g</option>
                        <option value="28g">28g</option>
                      </select>
                      <button
                        onClick={() => removeProductVariant(p.slug, vi)}
                        style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.25)", padding: 2, display: "flex", alignItems: "center", lineHeight: 1 }}
                        title="Remove size"
                      >
                        <X size={11} />
                      </button>
                    </div>

                    {/* Card body */}
                    <div style={{ padding: "7px 8px", display: "flex", flexDirection: "column", gap: 5 }}>
                      {/* SKU */}
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 9, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.06em", width: 28, flexShrink: 0 }}>SKU</span>
                        <input
                          value={v.sku}
                          placeholder="Gov. SKU…"
                          onChange={e => updateProductVariant(p.slug, vi, "sku", e.target.value)}
                          style={{ flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 4, color: "rgba(255,255,255,0.55)", fontSize: 10, padding: "3px 6px", outline: "none", boxSizing: "border-box" as const }}
                        />
                      </div>

                      {/* Pricing */}
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 9, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.06em", width: 28, flexShrink: 0 }}>Price</span>
                        <div style={{ display: "flex", alignItems: "center", gap: 3, flex: 1 }}>
                          <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 10 }}>$</span>
                          <input
                            type="number" step="0.01" min="0" value={v.price}
                            onChange={e => updateProductVariant(p.slug, vi, "price", parseFloat(e.target.value) || 0)}
                            style={{ width: 50, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(0,246,255,0.25)", borderRadius: 4, color: "#00f6ff", fontSize: 11, fontWeight: 700, padding: "3px 5px", outline: "none" }}
                          />
                          <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 9 }}>/unit</span>
                        </div>
                        <span style={{ color: "rgba(0,246,255,0.45)", fontSize: 9, fontWeight: 700, whiteSpace: "nowrap" as const }}>
                          ${(v.price * 24).toFixed(2)}/case
                        </span>
                      </div>

                      {/* Stock + Max */}
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 9, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.06em", width: 28, flexShrink: 0 }}>Stock</span>
                        <input
                          type="number" min="0" step="1" value={v.inventory ?? ""}
                          placeholder="0"
                          onChange={e => updateProductVariant(p.slug, vi, "inventory", parseInt(e.target.value) >= 0 ? parseInt(e.target.value) : 0)}
                          style={{ width: 50, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(74,222,128,0.2)", borderRadius: 4, color: "#4ade80", fontSize: 11, fontWeight: 600, padding: "3px 5px", outline: "none" }}
                        />
                        <span style={{ color: "rgba(74,222,128,0.4)", fontSize: 9, fontWeight: 700, whiteSpace: "nowrap" as const }}>
                          = {Math.floor((v.inventory ?? 0) / 24)} cases
                        </span>
                        <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 9, marginLeft: "auto", flexShrink: 0 }}>max</span>
                        <input
                          type="number" min="1" step="1" value={v.maxOrderQty ?? ""}
                          placeholder="—"
                          onChange={e => updateProductVariant(p.slug, vi, "maxOrderQty", parseInt(e.target.value) || undefined)}
                          style={{ width: 40, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 4, color: "rgba(255,255,255,0.5)", fontSize: 10, padding: "3px 5px", outline: "none" }}
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
              {/* Add Size button */}
              <button
                onClick={() => addProductVariant(p.slug, p.price)}
                style={{
                  background: "rgba(0,246,255,0.06)", border: "1px dashed rgba(0,246,255,0.25)",
                  color: "#00f6ff", fontSize: 10, fontWeight: 800, cursor: "pointer",
                  borderRadius: 6, padding: "6px 8px",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
                  width: "100%", transition: "background 0.15s",
                }}
              >
                <Plus size={10} /> Add Size
              </button>
            </div>

            {/* Active toggle */}
            <div style={{ display: "flex", justifyContent: "center", paddingTop: 4 }}>
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
              padding: 4, borderRadius: 4, paddingTop: 8,
            }}>
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Seed prompt (shown when DB table exists but is empty) */}
      {!dbSeeded && !menuLoading && (
        <div style={{ padding: "20px 24px", background: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.2)", borderRadius: 10, display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ flex: 1 }}>
            <p style={{ margin: "0 0 4px", color: "#fbbf24", fontWeight: 700, fontSize: 14 }}>Database table is empty</p>
            <p style={{ margin: 0, color: "rgba(255,255,255,0.4)", fontSize: 13 }}>Click &ldquo;Seed from defaults&rdquo; to import all current strains into the database so changes will sync to the retailer dashboard.</p>
          </div>
          <button onClick={handleSeed} disabled={seeding} style={{
            padding: "10px 24px", borderRadius: 8, border: "none", cursor: "pointer",
            background: "#fbbf24", color: "#000", fontSize: 13, fontWeight: 800, whiteSpace: "nowrap",
          }}>
            {seeding ? "Seeding…" : "Seed from defaults"}
          </button>
        </div>
      )}

      {/* Save */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
        <button onClick={handleSave} disabled={saving} style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "12px 40px", borderRadius: 8, border: "none",
          background: saved ? "#16a34a" : saving ? "rgba(0,246,255,0.5)" : "#00f6ff",
          color: "#000", fontSize: 14, fontWeight: 800,
          textTransform: "uppercase", letterSpacing: "0.08em",
          cursor: saving ? "default" : "pointer", transition: "background 0.2s",
        }}>
          {saved ? <><Check size={16} strokeWidth={3} /> Saved to Database</> : saving ? "Saving…" : "Save Changes to Live Menu"}
        </button>
        {saveError && (
          <p style={{ margin: 0, color: "#f87171", fontSize: 13 }}>{saveError}</p>
        )}
        {!saveError && (
          <p style={{ margin: 0, color: "rgba(255,255,255,0.3)", fontSize: 12 }}>
            {dbSeeded ? "Saves to database — retailer dashboard updates immediately." : "Set up the database table first (see README)."}
          </p>
        )}
      </div>
    </div>
  );
}
