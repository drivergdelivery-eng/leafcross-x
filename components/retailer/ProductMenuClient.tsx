"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ShoppingCart, Check, AlertTriangle, X, Info, Send, ChevronLeft, ChevronRight, Trash2, Package } from "lucide-react";
import {
  alldayProducts, blkProducts, typeColors, statusConfig, allStatuses,
  type MenuProduct, type ProductStatus, type ProductVariant,
} from "@/lib/data/menu";
import { terpeneByName } from "@/lib/data/terpenes";

type CartItem = MenuProduct & { quantity: number; selectedVariant?: ProductVariant; orderMode?: "unit" | "case" };

const staticProducts = [...alldayProducts, ...blkProducts];

const brandLabels: Record<string, string> = {
  allday: "AllDay Cannabis",
  blk:    "AllDay BLK Edition",
};

const blockedStatuses: ProductStatus[] = [
  "Sold Out", "Coming Soon", "Dry/Curing", "Harvesting", "Flowering", "Vegging",
];

function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem("lc-cart") ?? "[]"); } catch { return []; }
}
function saveCart(cart: CartItem[]) {
  localStorage.setItem("lc-cart", JSON.stringify(cart));
}
function qtyAlreadyInCart(slug: string): number {
  return getCart().filter(i => i.slug === slug).reduce((s, i) => s + (i.orderMode === "case" ? i.quantity * 24 : i.quantity), 0);
}
function stockColor(inv: number): string {
  if (inv === 0) return "#f87171";
  if (inv <= 10) return "#fb923c";
  return "#4ade80";
}

const stepperBtn: React.CSSProperties = {
  flexShrink: 0, width: 36, height: 36, borderRadius: 8,
  background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
  color: "#fff", fontSize: 20, cursor: "pointer",
  display: "flex", alignItems: "center", justifyContent: "center",
};

const inquiryInput: React.CSSProperties = {
  padding: "9px 12px", borderRadius: 8, fontSize: 13,
  background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)",
  color: "#fff", outline: "none", width: "100%", boxSizing: "border-box",
};

// ── Product Detail Modal ────────────────────────────────────────────────────
function ProductDetailModal({
  product,
  liveInventory,
  onClose,
  onAddToCart,
}: {
  product: MenuProduct;
  liveInventory: number;
  onClose: () => void;
  onAddToCart: (product: MenuProduct, qty: number, variant?: ProductVariant, mode?: "unit" | "case") => string | null;
}) {
  const hasVariants = (product.variants ?? []).length > 0;
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    hasVariants ? product.variants![0] : undefined
  );
  const [qty, setQty]         = useState(1);
  const [mode, setMode]       = useState<"unit" | "case">("unit");
  const [warning, setWarning] = useState("");
  const [added, setAdded]     = useState(false);
  const images = product.images?.length ? product.images : [product.image];
  const [imgIdx, setImgIdx]   = useState(0);

  // Inquiry form state (for unavailable products)
  const [showInquiry, setShowInquiry] = useState(false);
  const [inquiryName, setInquiryName] = useState("");
  const [inquiryEmail, setInquiryEmail] = useState("");
  const [inquiryMsg, setInquiryMsg] = useState("");
  const [inquirySending, setInquirySending] = useState(false);
  const [inquirySent, setInquirySent] = useState(false);
  const [inquiryError, setInquiryError] = useState("");

  const status      = product.status ?? "Available";
  const cfg         = statusConfig[status];
  const isBlocked   = blockedStatuses.includes(status);
  const isOutOfStock = liveInventory <= 0 && !isBlocked;
  const isUnavailable = isBlocked || isOutOfStock;

  const inCart   = qtyAlreadyInCart(product.slug);
  const effectiveInventory = selectedVariant?.inventory ?? liveInventory;
  const effectiveMaxQty    = selectedVariant?.maxOrderQty ?? product.maxOrderQty ?? Infinity;
  const invLeft  = Math.max(0, effectiveInventory - inCart);
  const unitCap  = Math.min(invLeft, effectiveMaxQty);
  const cap      = mode === "case" ? Math.floor(unitCap / 24) : unitCap;
  const unitPrice = selectedVariant?.price ?? product.price;
  const displayPrice = mode === "case" ? unitPrice * 24 : unitPrice;

  const handleQty = (val: number) => {
    const clamped = Math.max(1, Math.min(val, cap));
    setQty(clamped);
    if (val > cap && cap > 0) {
      if (mode === "case") {
        const reason = invLeft < effectiveMaxQty
          ? `Only ${Math.floor(invLeft / 24)} cases available`
          : `Max order is ${Math.floor(effectiveMaxQty / 24)} cases`;
        setWarning(reason);
      } else {
        const reason = invLeft < (product.maxOrderQty ?? Infinity)
          ? `Only ${invLeft} units available`
          : `Max order is ${product.maxOrderQty} units`;
        setWarning(reason);
      }
    } else {
      setWarning("");
    }
  };

  const handleAdd = () => {
    if (hasVariants && !selectedVariant) { setWarning("Please select a package size."); return; }
    const err = onAddToCart(product, qty, selectedVariant, mode);
    if (err) { setWarning(err); return; }
    setAdded(true);
    setWarning("");
    setQty(1);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setInquirySending(true);
    setInquiryError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: inquiryName,
          email: inquiryEmail,
          message: inquiryMsg || `I am interested in ${product.name} and would like to be notified when it becomes available.`,
          product: product.name,
          partner_type: "retailer",
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to send.");
      setInquirySent(true);
    } catch (err) {
      setInquiryError(err instanceof Error ? err.message : "Failed to send. Please try again.");
    } finally {
      setInquirySending(false);
    }
  };

  // Close on ESC
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const terpenes = [product.terpene1, product.terpene2, product.terpene3]
    .filter(Boolean)
    .map(name => terpeneByName[name!])
    .filter(Boolean);

  const cannabinoids = [
    { label: "THC", value: product.thc, color: "#4ade80" },
    { label: "CBD", value: product.cbd, color: "#60a5fa" },
    { label: "CBG", value: product.cbg, color: "#c4b5fd" },
  ].filter(c => c.value);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(0,0,0,0.88)",
        backdropFilter: "blur(6px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "20px",
        overflowY: "auto",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="productModal"
        style={{
          background: "#0f0f0f",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 20,
          width: "min(860px, 100%)",
          maxHeight: "90vh",
          overflowY: "auto",
          position: "relative",
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: 16, right: 16, zIndex: 10,
            width: 36, height: 36, borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.12)",
            background: "rgba(255,255,255,0.06)",
            color: "rgba(255,255,255,0.5)", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <X size={16} />
        </button>

        {/* ── Left: Image carousel ──────────────────────────── */}
        <div className="productModalLeft" style={{
          position: "relative",
          background: "#1a1a1a",
          overflow: "hidden",
          minHeight: 340,
        }}>
          {/* Main image */}
          {images[imgIdx] && (
            images[imgIdx].startsWith("blob:") || images[imgIdx].startsWith("data:") ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={images[imgIdx]} alt={product.name} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: isUnavailable ? "grayscale(35%)" : "none" }} />
            ) : (
              <Image src={images[imgIdx]} alt={product.name} fill
                style={{ objectFit: "cover", filter: isUnavailable ? "grayscale(35%)" : "none" }}
                sizes="320px" />
            )
          )}
          {/* Gradient overlay */}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)" }} />

          {/* Carousel arrows — only show if multiple images */}
          {images.length > 1 && (
            <>
              <button
                onClick={e => { e.stopPropagation(); setImgIdx(i => (i - 1 + images.length) % images.length); }}
                style={{
                  position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)",
                  width: 32, height: 32, borderRadius: "50%", border: "none",
                  background: "rgba(0,0,0,0.55)", color: "#fff", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  backdropFilter: "blur(4px)",
                }}
              ><ChevronLeft size={16} /></button>
              <button
                onClick={e => { e.stopPropagation(); setImgIdx(i => (i + 1) % images.length); }}
                style={{
                  position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
                  width: 32, height: 32, borderRadius: "50%", border: "none",
                  background: "rgba(0,0,0,0.55)", color: "#fff", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  backdropFilter: "blur(4px)",
                }}
              ><ChevronRight size={16} /></button>
              {/* Dots */}
              <div style={{ position: "absolute", bottom: 80, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 5 }}>
                {images.map((_, i) => (
                  <button key={i} onClick={e => { e.stopPropagation(); setImgIdx(i); }}
                    style={{ width: i === imgIdx ? 18 : 6, height: 6, borderRadius: 999, border: "none", cursor: "pointer", transition: "all 0.2s", background: i === imgIdx ? "#00f6ff" : "rgba(255,255,255,0.4)", padding: 0 }} />
                ))}
              </div>
            </>
          )}

          {/* Type badge */}
          <span style={{
            position: "absolute", top: 14, left: 14,
            background: typeColors[product.type], color: "#000",
            fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em",
            padding: "4px 10px", borderRadius: 999,
          }}>{product.type}</span>
          {/* Brand badge */}
          {product.brand && (
            <span style={{ position: "absolute", bottom: 52, left: 14, right: 14, color: "rgba(255,255,255,0.55)", fontSize: 11, fontWeight: 600 }}>
              {brandLabels[product.brand] ?? product.brand}
            </span>
          )}
          {/* Status banner */}
          <span style={{
            position: "absolute", bottom: 14, left: 14, right: 14,
            background: isOutOfStock ? statusConfig["Sold Out"].bg : cfg.bg,
            color: isOutOfStock ? statusConfig["Sold Out"].color : cfg.color,
            fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.07em",
            padding: "6px 0", borderRadius: 8, textAlign: "center", display: "block",
          }}>
            {isOutOfStock ? "Out of Stock" : cfg.label}
          </span>
        </div>

        {/* ── Right: Detail panel ────────────────────────────── */}
        <div style={{ padding: "32px 28px 32px 28px", display: "flex", flexDirection: "column", gap: 20, overflowY: "auto" }}>

          {/* Name */}
          <div>
            <h2 style={{ margin: 0, color: "#fff", fontSize: "clamp(22px, 3vw, 30px)", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.04em", lineHeight: 1.1 }}>
              {product.name}
            </h2>
          </div>

          {/* Description */}
          {product.description && (
            <p style={{ margin: 0, color: "rgba(255,255,255,0.55)", fontSize: 14, lineHeight: 1.75 }}>
              {product.description}
            </p>
          )}

          {/* Pricing grid */}
          <div>
            <p style={sectionLabel}>Pricing & Packaging</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 16px" }}>
              <InfoRow label="Unit Size"       value={selectedVariant?.size ?? product.unit} />
              <InfoRow label="Units per Case"  value="24" />
              <InfoRow label="Price per Unit"  value={`$${unitPrice.toFixed(2)}`}  accent="#00f6ff" />
              <InfoRow label="Price per Case"  value={`$${(unitPrice * 24).toFixed(2)}`} accent="#00f6ff" />
            </div>
          </div>

          {/* Cannabinoids */}
          {cannabinoids.length > 0 && (
            <div>
              <p style={sectionLabel}>Cannabinoids</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {cannabinoids.map(c => (
                  <div key={c.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{
                      fontSize: 10, fontWeight: 800, padding: "3px 10px",
                      borderRadius: 999, minWidth: 36, textAlign: "center",
                      background: `${c.color}22`, color: c.color, border: `1px solid ${c.color}44`,
                    }}>{c.label}</span>
                    <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 14, fontWeight: 600 }}>{c.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Terpenes */}
          {terpenes.length > 0 && (
            <div>
              <p style={sectionLabel}>Terpenes</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {terpenes.map(t => (
                  <div key={t.name} style={{
                    background: "rgba(255,255,255,0.03)",
                    border: `1px solid ${t.color}33`,
                    borderRadius: 8, padding: "10px 12px",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span style={{
                        fontSize: 10, fontWeight: 800, padding: "2px 8px",
                        borderRadius: 999, background: `${t.color}22`,
                        color: t.color, border: `1px solid ${t.color}44`,
                      }}>{t.name}</span>
                      <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 10 }}>{t.aroma}</span>
                    </div>
                    <p style={{ margin: 0, color: "rgba(255,255,255,0.5)", fontSize: 12, lineHeight: 1.6 }}>
                      {t.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Inventory */}
          <div>
            <p style={sectionLabel}>Availability</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {!isBlocked && (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>In Stock:</span>
                  <span style={{ color: stockColor(effectiveInventory), fontSize: 13, fontWeight: 700 }}>
                    {effectiveInventory === 0 ? "Out of stock" : `${effectiveInventory} units (${Math.floor(effectiveInventory / 24)} cases)`}
                  </span>
                </div>
              )}
              {isFinite(effectiveMaxQty) && !isUnavailable && (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>Max Order:</span>
                  <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, fontWeight: 600 }}>
                    {effectiveMaxQty} units / {Math.floor(effectiveMaxQty / 24)} cases per order
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Order action */}
          <div style={{ marginTop: "auto", paddingTop: 4 }}>
            {isUnavailable ? (
              <div>
                <div style={{
                  padding: "12px 16px", borderRadius: 10, textAlign: "center", marginBottom: 12,
                  background: `${isOutOfStock ? statusConfig["Sold Out"].bg : cfg.bg}18`,
                  border: `1px solid ${isOutOfStock ? statusConfig["Sold Out"].bg : cfg.bg}44`,
                  color: isOutOfStock ? statusConfig["Sold Out"].bg : cfg.bg,
                  fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em",
                }}>
                  {isOutOfStock ? "Currently Out of Stock" : cfg.label}
                </div>

                {inquirySent ? (
                  <div style={{ padding: "14px 16px", borderRadius: 10, background: "rgba(0,246,255,0.08)", border: "1px solid rgba(0,246,255,0.25)", textAlign: "center" }}>
                    <Check size={20} color="#00f6ff" style={{ margin: "0 auto 8px", display: "block" }} />
                    <p style={{ margin: 0, color: "#00f6ff", fontSize: 13, fontWeight: 700 }}>Inquiry Sent!</p>
                    <p style={{ margin: "4px 0 0", color: "rgba(255,255,255,0.45)", fontSize: 12 }}>We&apos;ll follow up at {inquiryEmail}</p>
                  </div>
                ) : !showInquiry ? (
                  <button
                    onClick={() => setShowInquiry(true)}
                    style={{
                      width: "100%", padding: "11px 0", borderRadius: 10, border: "1px solid rgba(0,246,255,0.3)",
                      background: "rgba(0,246,255,0.06)", color: "#00f6ff",
                      fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em",
                      cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                    }}
                  >
                    <Send size={12} /> Request Notification / Inquiry
                  </button>
                ) : (
                  <form onSubmit={handleInquiry} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <p style={{ margin: 0, color: "rgba(255,255,255,0.4)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                      Inquiry — {product.name}
                    </p>
                    <input
                      required placeholder="Your name"
                      value={inquiryName} onChange={e => setInquiryName(e.target.value)}
                      style={inquiryInput}
                    />
                    <input
                      required type="email" placeholder="Your email"
                      value={inquiryEmail} onChange={e => setInquiryEmail(e.target.value)}
                      style={inquiryInput}
                    />
                    <textarea
                      placeholder={`I'm interested in ${product.name} and would like to be notified when available.`}
                      value={inquiryMsg} onChange={e => setInquiryMsg(e.target.value)}
                      rows={3}
                      style={{ ...inquiryInput, resize: "vertical", lineHeight: 1.5 }}
                    />
                    {inquiryError && (
                      <p style={{ margin: 0, color: "#f87171", fontSize: 12 }}>{inquiryError}</p>
                    )}
                    <div style={{ display: "flex", gap: 8 }}>
                      <button type="button" onClick={() => setShowInquiry(false)}
                        style={{ flex: "0 0 auto", padding: "9px 14px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.15)", background: "none", color: "rgba(255,255,255,0.4)", fontSize: 12, cursor: "pointer" }}>
                        Cancel
                      </button>
                      <button type="submit" disabled={inquirySending}
                        style={{ flex: 1, padding: "9px 0", borderRadius: 8, border: "none", background: "#00f6ff", color: "#000", fontSize: 12, fontWeight: 800, cursor: inquirySending ? "not-allowed" : "pointer", opacity: inquirySending ? 0.7 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                        <Send size={12} /> {inquirySending ? "Sending…" : "Send Inquiry"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {/* Unit / Case toggle */}
                <div>
                  <p style={{ ...sectionLabel, marginBottom: 6 }}>Order By</p>
                  <div style={{ display: "flex", gap: 0, background: "rgba(255,255,255,0.05)", borderRadius: 10, padding: 4 }}>
                    {(["unit", "case"] as const).map(m => (
                      <button
                        key={m}
                        onClick={() => { setMode(m); setQty(1); setWarning(""); }}
                        style={{
                          flex: 1, padding: "9px 0", borderRadius: 7, border: "none", cursor: "pointer",
                          background: mode === m ? "rgba(0,246,255,0.15)" : "transparent",
                          color: mode === m ? "#00f6ff" : "rgba(255,255,255,0.35)",
                          fontSize: 12, fontWeight: 800, textTransform: "uppercase" as const, letterSpacing: "0.05em",
                          transition: "all 0.18s",
                        }}
                      >
                        {m === "unit"
                          ? <>Units — <span style={{ fontWeight: 600 }}>${unitPrice.toFixed(2)}/each</span></>
                          : <>Case (24 units) — <span style={{ fontWeight: 600 }}>${(unitPrice * 24).toFixed(2)}</span></>
                        }
                      </button>
                    ))}
                  </div>
                </div>

                {/* Variant size selector */}
                {hasVariants && (
                  <div>
                    <p style={{ ...sectionLabel, marginBottom: 8 }}>Package Size</p>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {product.variants!.map(v => (
                        <button
                          key={v.size}
                          onClick={() => { setSelectedVariant(v); setWarning(""); }}
                          style={{
                            padding: "8px 14px", borderRadius: 8, cursor: "pointer",
                            border: `1px solid ${selectedVariant?.size === v.size ? "#00f6ff" : "rgba(255,255,255,0.15)"}`,
                            background: selectedVariant?.size === v.size ? "rgba(0,246,255,0.12)" : "transparent",
                            color: selectedVariant?.size === v.size ? "#00f6ff" : "rgba(255,255,255,0.6)",
                            fontSize: 13, fontWeight: 700, transition: "all 0.15s",
                            textAlign: "center" as const,
                          }}
                        >
                          {v.size}
                          <span style={{ display: "block", fontSize: 11, fontWeight: 600, marginTop: 1 }}>
                            {mode === "case" ? `$${(v.price * 24).toFixed(2)}/case` : `$${v.price.toFixed(2)}/unit`}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <button onClick={() => handleQty(qty - 1)} style={stepperBtn} disabled={qty <= 1}>−</button>
                  <input
                    type="number" min={1} max={cap || 1} value={qty}
                    onChange={e => handleQty(parseInt(e.target.value) || 1)}
                    style={{
                      flex: 1, textAlign: "center",
                      background: "rgba(255,255,255,0.08)",
                      border: `1px solid ${warning ? "rgba(251,146,60,0.6)" : "rgba(255,255,255,0.15)"}`,
                      borderRadius: 8, color: "#fff",
                      fontSize: 16, fontWeight: 700,
                      padding: "8px 8px", outline: "none", height: 36,
                    }}
                  />
                  <button onClick={() => handleQty(qty + 1)} style={{ ...stepperBtn, opacity: qty >= cap ? 0.35 : 1, cursor: qty >= cap ? "not-allowed" : "pointer" }} disabled={qty >= cap}>+</button>
                </div>
                <p style={{ margin: 0, color: "rgba(255,255,255,0.3)", fontSize: 11, textAlign: "center" }}>
                  Total: <span style={{ color: "#00f6ff", fontWeight: 700 }}>${(displayPrice * qty).toFixed(2)}</span>
                  {mode === "case" && <span style={{ color: "rgba(255,255,255,0.25)" }}> ({qty * 24} units)</span>}
                </p>
                {warning && (
                  <div style={{
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "8px 12px", borderRadius: 8,
                    background: "rgba(251,146,60,0.1)", border: "1px solid rgba(251,146,60,0.3)",
                  }}>
                    <AlertTriangle size={12} color="#fb923c" />
                    <span style={{ color: "#fb923c", fontSize: 12, fontWeight: 600 }}>{warning}</span>
                  </div>
                )}
                <button
                  onClick={handleAdd}
                  disabled={cap === 0}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    padding: "13px 0", borderRadius: 10, border: "none",
                    cursor: cap === 0 ? "not-allowed" : "pointer",
                    fontSize: 13, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em",
                    background: added ? "#16a34a" : cap === 0 ? "rgba(255,255,255,0.08)" : "#00f6ff",
                    color: cap === 0 ? "rgba(255,255,255,0.3)" : "#000",
                    transition: "background 0.2s",
                  }}
                >
                  {added
                    ? <><Check size={15} strokeWidth={3} /> Added to Cart</>
                    : <><ShoppingCart size={15} strokeWidth={2.5} /> Add to Cart</>}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Small helpers
const sectionLabel: React.CSSProperties = {
  margin: "0 0 8px",
  color: "rgba(255,255,255,0.3)",
  fontSize: 9, fontWeight: 800,
  textTransform: "uppercase", letterSpacing: "0.14em",
};

function InfoRow({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div>
      <p style={{ margin: 0, color: "rgba(255,255,255,0.35)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em" }}>{label}</p>
      <p style={{ margin: "2px 0 0", color: accent ?? "#fff", fontSize: 14, fontWeight: 700 }}>{value}</p>
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────
export default function ProductMenuClient() {
  const router = useRouter();
  const [allProducts, setAllProducts]   = useState<MenuProduct[]>(staticProducts);
  const [menuLoading, setMenuLoading]   = useState(true);
  const [brandFilter, setBrandFilter]   = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [quantities, setQuantities]     = useState<Record<string, number>>({});
  const [warnings, setWarnings]         = useState<Record<string, string>>({});
  const [added, setAdded]               = useState<Record<string, boolean>>({});
  const [hoveredCard, setHoveredCard]   = useState<string | null>(null);
  const [detailProduct, setDetailProduct] = useState<MenuProduct | null>(null);
  const [cartItems, setCartItems]       = useState<CartItem[]>([]);
  const [orderMode, setOrderMode]       = useState<Record<string, "unit" | "case">>({});

  // Sync cart state from localStorage
  const syncCart = () => setCartItems([...getCart()]);

  useEffect(() => { syncCart(); }, []);

  // Fetch live menu from DB on mount
  useEffect(() => {
    fetch("/api/menu/products")
      .then(r => r.json())
      .then(j => {
        if (j.data?.length) setAllProducts(j.data);
      })
      .catch(() => {})
      .finally(() => setMenuLoading(false));
  }, []);

  const [liveInventory, setLiveInventory] = useState<Record<string, number>>({});

  // Sync liveInventory whenever allProducts changes
  useEffect(() => {
    setLiveInventory(Object.fromEntries(allProducts.map(p => [p.slug, p.inventory ?? Infinity])));
  }, [allProducts]);

  const uniqueBrands = Array.from(new Set(allProducts.map(p => p.brand).filter(Boolean)));

  const products = allProducts
    .filter(p => (p as MenuProduct & { active?: boolean }).active !== false)
    .filter(p => brandFilter === "all" || p.brand === brandFilter)
    .filter(p => statusFilter === "all" || (p.status ?? "Available") === statusFilter);

  const getQty = (slug: string) => quantities[slug] ?? 1;

  const maxAllowed = useCallback((p: MenuProduct): number => {
    const inCart  = qtyAlreadyInCart(p.slug);
    const invLeft = (liveInventory[p.slug] ?? Infinity) - inCart;
    const cap     = p.maxOrderQty ?? Infinity;
    return Math.max(0, Math.min(invLeft, cap));
  }, [liveInventory]);

  const setQty = (p: MenuProduct, raw: number) => {
    const cap = maxAllowed(p);
    const val = Math.max(1, Math.min(raw, cap));
    setQuantities(prev => ({ ...prev, [p.slug]: val }));
    if (raw > cap && cap > 0) {
      const reason = (liveInventory[p.slug] ?? Infinity) < (p.maxOrderQty ?? Infinity)
        ? `Only ${liveInventory[p.slug]} units in stock`
        : `Max order is ${p.maxOrderQty} units`;
      setWarnings(prev => ({ ...prev, [p.slug]: reason }));
    } else {
      setWarnings(prev => ({ ...prev, [p.slug]: "" }));
    }
  };

  // Shared add-to-cart logic used by both card and modal
  const addToCart = useCallback((product: MenuProduct, qty: number, variant?: ProductVariant, mode: "unit" | "case" = "unit"): string | null => {
    const status = product.status ?? "Available";
    if (blockedStatuses.includes(status)) return null;
    const unitQty = mode === "case" ? qty * 24 : qty;
    const cap = maxAllowed(product);
    if (unitQty > cap) {
      const invUnits = liveInventory[product.slug] ?? Infinity;
      const maxUnits = product.maxOrderQty ?? Infinity;
      if (mode === "case") {
        return invUnits < maxUnits
          ? `Only ${Math.floor(invUnits / 24)} cases available`
          : `Max order is ${Math.floor(maxUnits / 24)} cases`;
      }
      return invUnits < maxUnits
        ? `Only ${invUnits} units available`
        : `Max order is ${maxUnits} units`;
    }
    const cart = getCart();
    const variantSize = variant?.size ?? "";
    const existing = cart.find(i => i.slug === product.slug && (i.selectedVariant?.size ?? "") === variantSize && (i.orderMode ?? "unit") === mode);
    if (existing) {
      existing.quantity += qty;
    } else {
      const unitPrice = variant?.price ?? product.price;
      const price = mode === "case" ? unitPrice * 24 : unitPrice;
      cart.push({ ...product, quantity: qty, selectedVariant: variant, price, orderMode: mode });
    }
    saveCart(cart);
    setCartItems([...cart]);
    setLiveInventory(prev => ({
      ...prev,
      [product.slug]: Math.max(0, (prev[product.slug] ?? 0) - unitQty),
    }));
    return null;
  }, [liveInventory, maxAllowed]);

  // Cart panel: change qty or remove
  const cartChangeQty = (slug: string, variantSize: string, delta: number, mode: "unit" | "case" = "unit") => {
    const cart = getCart();
    const item = cart.find(i => i.slug === slug && (i.selectedVariant?.size ?? "") === variantSize && (i.orderMode ?? "unit") === mode);
    if (!item) return;
    const newQty = item.quantity + delta;
    const unitsEach = mode === "case" ? 24 : 1;
    if (newQty <= 0) {
      const updated = cart.filter(i => !(i.slug === slug && (i.selectedVariant?.size ?? "") === variantSize && (i.orderMode ?? "unit") === mode));
      saveCart(updated);
      setCartItems(updated);
      setLiveInventory(prev => ({ ...prev, [slug]: (prev[slug] ?? 0) + item.quantity * unitsEach }));
    } else {
      item.quantity = newQty;
      saveCart([...cart]);
      setCartItems([...cart]);
      setLiveInventory(prev => ({ ...prev, [slug]: Math.max(0, (prev[slug] ?? 0) - delta * unitsEach) }));
    }
  };
  const cartRemove = (slug: string, variantSize: string, mode: "unit" | "case" = "unit") => {
    const cart = getCart();
    const item = cart.find(i => i.slug === slug && (i.selectedVariant?.size ?? "") === variantSize && (i.orderMode ?? "unit") === mode);
    const updated = cart.filter(i => !(i.slug === slug && (i.selectedVariant?.size ?? "") === variantSize && (i.orderMode ?? "unit") === mode));
    saveCart(updated);
    setCartItems(updated);
    const unitsEach = mode === "case" ? 24 : 1;
    if (item) setLiveInventory(prev => ({ ...prev, [slug]: (prev[slug] ?? 0) + item.quantity * unitsEach }));
  };

  const addToCartFromCard = (product: MenuProduct) => {
    const status = product.status ?? "Available";
    if (blockedStatuses.includes(status)) return;
    const mode = orderMode[product.slug] ?? "unit";
    const qty = getQty(product.slug);
    const err = addToCart(product, qty, undefined, mode);
    if (err) {
      setWarnings(prev => ({ ...prev, [product.slug]: err }));
      return;
    }
    setWarnings(prev => ({ ...prev, [product.slug]: "" }));
    setQuantities(prev => ({ ...prev, [product.slug]: 1 }));
    setAdded(prev => ({ ...prev, [product.slug]: true }));
    setTimeout(() => setAdded(prev => ({ ...prev, [product.slug]: false })), 1800);
  };

  const pillStyle = (active: boolean): React.CSSProperties => ({
    padding: "7px 16px", borderRadius: 999,
    border: active ? "none" : "1px solid rgba(0,0,0,0.15)",
    background: active ? "#00f6ff" : "transparent",
    color: active ? "#000" : "rgba(0,0,0,0.5)",
    fontSize: 12, fontWeight: 700,
    textTransform: "uppercase" as const, letterSpacing: "0.06em",
    cursor: "pointer", transition: "all 0.15s ease", whiteSpace: "nowrap" as const,
  });

  // Cart totals
  const cartSubtotal = cartItems.reduce((s, i) => s + (i.price ?? 0) * i.quantity, 0);
  const cartGST      = cartSubtotal * 0.05;
  const cartTotal    = cartSubtotal + cartGST;

  return (
    <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>

      {/* ── Left: filters + product grid ── */}
      <div style={{ flex: 1, minWidth: 0 }}>

      {/* Brand filter */}
      <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
        <button style={pillStyle(brandFilter === "all")} onClick={() => setBrandFilter("all")}>All Brands</button>
        {uniqueBrands.map(b => (
          <button key={b} style={pillStyle(brandFilter === b)} onClick={() => setBrandFilter(b)}>
            {brandLabels[b] ?? b}
          </button>
        ))}
      </div>

      {/* Status filter */}
      <div style={{ display: "flex", gap: 8, marginBottom: 28, flexWrap: "wrap" }}>
        <button style={pillStyle(statusFilter === "all")} onClick={() => setStatusFilter("all")}>All Status</button>
        {allStatuses.map(s => {
          const cfg = statusConfig[s];
          const isActive = statusFilter === s;
          return (
            <button key={s} onClick={() => setStatusFilter(s)} style={{
              padding: "6px 14px", borderRadius: 999, border: "none",
              background: isActive ? cfg.bg : `${cfg.bg}33`,
              color: isActive ? cfg.color : "rgba(0,0,0,0.55)",
              fontSize: 11, fontWeight: 700,
              textTransform: "uppercase" as const, letterSpacing: "0.06em",
              cursor: "pointer", transition: "all 0.15s ease", whiteSpace: "nowrap" as const,
            }}>
              {cfg.label}
            </button>
          );
        })}
      </div>

      {/* Product grid */}
      {products.length === 0 ? (
        <p style={{ color: "rgba(255,255,255,0.4)", textAlign: "center", padding: "48px 0" }}>
          No products match the selected filters.
        </p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 20 }}>
          {products.map(product => {
            const status      = product.status ?? "Available";
            const cfg         = statusConfig[status];
            const isBlocked   = blockedStatuses.includes(status);
            const invLeft     = liveInventory[product.slug] ?? product.inventory ?? null;
            const isOutOfStock = invLeft !== null && invLeft <= 0 && !isBlocked;
            const isUnavailable = isBlocked || isOutOfStock;
            const isAdded     = added[product.slug];
            const qty         = getQty(product.slug);
            const cap         = maxAllowed(product);
            const warning     = warnings[product.slug];
            const isHovered   = hoveredCard === product.slug;

            return (
              <div
                key={product.slug}
                onMouseEnter={() => setHoveredCard(product.slug)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  background: "#111", borderRadius: 12, overflow: "hidden",
                  display: "flex", flexDirection: "column",
                  border: `1px solid ${isHovered ? "rgba(0,246,255,0.3)" : "rgba(255,255,255,0.07)"}`,
                  opacity: isUnavailable ? 0.75 : 1,
                  transition: "border-color 0.18s, box-shadow 0.18s",
                  boxShadow: isHovered ? "0 0 0 1px rgba(0,246,255,0.2), 0 8px 32px rgba(0,0,0,0.4)" : "none",
                  cursor: "pointer",
                }}
              >
                {/* Image */}
                <div
                  onClick={() => setDetailProduct(product)}
                  style={{ position: "relative", aspectRatio: "1 / 1", background: "#1a1a1a" }}
                >
                  <Image
                    src={product.image} alt={product.name} fill
                    style={{ objectFit: "cover", filter: isUnavailable ? "grayscale(35%)" : "none" }}
                    sizes="240px"
                  />
                  {/* Type badge */}
                  <span style={{
                    position: "absolute", top: 10, left: 10,
                    background: typeColors[product.type], color: "#000",
                    fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em",
                    padding: "3px 8px", borderRadius: 999,
                  }}>{product.type}</span>

                  {/* Status banner */}
                  <span style={{
                    position: "absolute", bottom: 10, left: 10, right: 10,
                    background: isOutOfStock ? statusConfig["Sold Out"].bg : cfg.bg,
                    color: isOutOfStock ? statusConfig["Sold Out"].color : cfg.color,
                    fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.07em",
                    padding: "4px 10px", borderRadius: 999, textAlign: "center",
                  }}>
                    {isOutOfStock ? "Out of Stock" : cfg.label}
                  </span>

                  {/* Hover overlay */}
                  {isHovered && (
                    <div style={{
                      position: "absolute", inset: 0,
                      background: "rgba(0,0,0,0.45)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      gap: 6,
                    }}>
                      <Info size={14} color="#00f6ff" />
                      <span style={{ color: "#00f6ff", fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                        View Details
                      </span>
                    </div>
                  )}
                </div>

                {/* Card info — compact */}
                <div
                  onClick={() => setDetailProduct(product)}
                  style={{ padding: "12px 14px 4px", cursor: "pointer" }}
                >
                  <h3 style={{ margin: 0, color: "#fff", fontSize: 14, fontWeight: 700, lineHeight: 1.3 }}>
                    {product.name}
                  </h3>
                  <p style={{ margin: "2px 0 0", color: "rgba(255,255,255,0.3)", fontSize: 11 }}>
                    {brandLabels[product.brand] ?? product.brand}
                  </p>
                  <p style={{ margin: "6px 0 0", color: "#00f6ff", fontSize: 14, fontWeight: 700 }}>
                    {product.variants && product.variants.length > 0
                      ? <>From ${Math.min(...product.variants.map(v => v.price)).toFixed(2)}</>
                      : (orderMode[product.slug] ?? "unit") === "case"
                        ? <>${(product.price * 24).toFixed(2)} <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, fontWeight: 400 }}>/ case</span></>
                        : <>${product.price.toFixed(2)} <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, fontWeight: 400 }}>/ {product.unit}</span></>
                    }
                  </p>
                  {!isBlocked && invLeft !== null && (
                    <p style={{ margin: "3px 0 0", color: stockColor(invLeft), fontSize: 11, fontWeight: 600 }}>
                      {invLeft === 0 ? "Out of stock" : `${invLeft} in stock`}
                    </p>
                  )}
                </div>

                {/* Card actions */}
                <div style={{ padding: "10px 14px 14px", display: "flex", flexDirection: "column", gap: 7, marginTop: "auto" }}>
                  {!isUnavailable && !(product.variants && product.variants.length > 0) && (() => {
                    const mode = orderMode[product.slug] ?? "unit";
                    const caseCap = Math.floor(cap / 24);
                    const effectiveCap = mode === "case" ? caseCap : cap;
                    return (
                      <>
                        {/* Unit / Case toggle */}
                        <div style={{ display: "flex", gap: 3, background: "rgba(255,255,255,0.05)", borderRadius: 7, padding: 3 }} onClick={e => e.stopPropagation()}>
                          {(["unit", "case"] as const).map(m => (
                            <button
                              key={m}
                              onClick={e => { e.stopPropagation(); setOrderMode(prev => ({ ...prev, [product.slug]: m })); setQuantities(prev => ({ ...prev, [product.slug]: 1 })); }}
                              style={{
                                flex: 1, padding: "4px 0", borderRadius: 5, border: "none", cursor: "pointer",
                                background: mode === m ? "rgba(0,246,255,0.18)" : "transparent",
                                color: mode === m ? "#00f6ff" : "rgba(255,255,255,0.3)",
                                fontSize: 9, fontWeight: 800, textTransform: "uppercase" as const, letterSpacing: "0.05em",
                                transition: "all 0.15s",
                              }}
                            >
                              {m === "unit" ? "Units" : "Case ×24"}
                            </button>
                          ))}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                          <button onClick={(e) => { e.stopPropagation(); setQty(product, qty - 1); }} style={{ ...stepperBtn, width: 28, height: 28, fontSize: 16 }}>−</button>
                          <input
                            type="number" min={1} max={effectiveCap || 1} value={qty}
                            onClick={e => e.stopPropagation()}
                            onChange={e => setQty(product, parseInt(e.target.value) || 1)}
                            style={{
                              flex: 1, textAlign: "center",
                              background: "rgba(255,255,255,0.08)",
                              border: `1px solid ${warning ? "rgba(251,146,60,0.5)" : "rgba(255,255,255,0.15)"}`,
                              borderRadius: 6, color: "#fff",
                              fontSize: 13, fontWeight: 700,
                              padding: "4px", outline: "none",
                              height: 28, boxSizing: "border-box",
                            }}
                          />
                          <button onClick={(e) => { e.stopPropagation(); setQty(product, qty + 1); }} style={{ ...stepperBtn, width: 28, height: 28, fontSize: 16, opacity: qty >= effectiveCap ? 0.35 : 1, cursor: qty >= effectiveCap ? "not-allowed" : "pointer" }} disabled={qty >= effectiveCap}>+</button>
                        </div>
                      </>
                    );
                  })()}
                  {warning && !(product.variants && product.variants.length > 0) && (
                    <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 8px", borderRadius: 6, background: "rgba(251,146,60,0.1)", border: "1px solid rgba(251,146,60,0.25)" }}>
                      <AlertTriangle size={10} color="#fb923c" />
                      <span style={{ color: "#fb923c", fontSize: 10, fontWeight: 600 }}>{warning}</span>
                    </div>
                  )}
                  {isUnavailable ? (
                    <div style={{
                      padding: "8px 0", borderRadius: 8, textAlign: "center",
                      background: `${isOutOfStock ? statusConfig["Sold Out"].bg : cfg.bg}18`,
                      border: `1px solid ${isOutOfStock ? statusConfig["Sold Out"].bg : cfg.bg}44`,
                      color: isOutOfStock ? statusConfig["Sold Out"].bg : cfg.bg,
                      fontSize: 11, fontWeight: 700, textTransform: "uppercase",
                    }}>
                      {isOutOfStock ? "Out of Stock" : cfg.label}
                    </div>
                  ) : (product.variants && product.variants.length > 0) ? (
                    <button
                      onClick={(e) => { e.stopPropagation(); setDetailProduct(product); }}
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
                        padding: "8px 0", borderRadius: 8,
                        border: "1px solid rgba(0,246,255,0.4)",
                        background: "rgba(0,246,255,0.06)", cursor: "pointer",
                        fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em",
                        color: "#00f6ff",
                      }}
                    >
                      Select Size
                    </button>
                  ) : (
                    <button
                      onClick={(e) => { e.stopPropagation(); addToCartFromCard(product); }}
                      disabled={cap === 0}
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
                        padding: "8px 0", borderRadius: 8, border: "none",
                        cursor: cap === 0 ? "not-allowed" : "pointer",
                        fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em",
                        background: isAdded ? "#16a34a" : cap === 0 ? "rgba(255,255,255,0.08)" : "#00f6ff",
                        color: cap === 0 ? "rgba(255,255,255,0.3)" : "#000",
                        transition: "background 0.2s",
                      }}
                    >
                      {isAdded
                        ? <><Check size={12} strokeWidth={3} /> Added</>
                        : <><ShoppingCart size={12} strokeWidth={2.5} /> Add to Cart</>}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail modal */}
      {detailProduct && (
        <ProductDetailModal
          product={detailProduct}
          liveInventory={liveInventory[detailProduct.slug] ?? detailProduct.inventory ?? 0}
          onClose={() => setDetailProduct(null)}
          onAddToCart={(product, qty, variant, mode) => {
            const err = addToCart(product, qty, variant, mode);
            if (!err) {
              setAdded(prev => ({ ...prev, [product.slug]: true }));
              setTimeout(() => setAdded(prev => ({ ...prev, [product.slug]: false })), 1800);
            }
            return err;
          }}
        />
      )}
      </div>{/* end left column */}

      {/* ── Right: Live Cart Panel ── */}
      <div style={{
        width: 300, flexShrink: 0,
        position: "sticky", top: 24, alignSelf: "flex-start",
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.09)",
        borderRadius: 16, overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{
          padding: "16px 18px",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <ShoppingCart size={16} color="#00f6ff" />
          <span style={{ color: "#fff", fontSize: 13, fontWeight: 800, letterSpacing: "0.04em", textTransform: "uppercase" }}>
            Your Cart
          </span>
          {cartItems.length > 0 && (
            <span style={{
              marginLeft: "auto",
              background: "#00f6ff", color: "#000",
              fontSize: 10, fontWeight: 800,
              borderRadius: 999, padding: "2px 8px",
            }}>
              {cartItems.reduce((s, i) => s + i.quantity, 0)} items
            </span>
          )}
        </div>

        {/* Items list */}
        {cartItems.length === 0 ? (
          <div style={{ padding: "32px 18px", textAlign: "center" }}>
            <Package size={32} color="rgba(255,255,255,0.12)" style={{ marginBottom: 12 }} />
            <p style={{ margin: 0, color: "rgba(255,255,255,0.25)", fontSize: 12, fontWeight: 600 }}>
              Your cart is empty
            </p>
            <p style={{ margin: "6px 0 0", color: "rgba(255,255,255,0.14)", fontSize: 11 }}>
              Add products from the menu
            </p>
          </div>
        ) : (
          <>
            <div style={{ maxHeight: 360, overflowY: "auto", padding: "8px 0" }}>
              {cartItems.map(item => {
                const variantSize = item.selectedVariant?.size ?? "";
                const itemMode = item.orderMode ?? "unit";
                const key = `${item.slug}::${variantSize}::${itemMode}`;
                return (
                  <div key={key} style={{
                    padding: "10px 16px",
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                    display: "flex", flexDirection: "column", gap: 6,
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ margin: 0, color: "#fff", fontSize: 12, fontWeight: 700, lineHeight: 1.3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {item.name}
                        </p>
                        <div style={{ display: "flex", gap: 5, marginTop: 2, alignItems: "center" }}>
                          {variantSize && (
                            <span style={{ color: "#00f6ff", fontSize: 10, fontWeight: 600 }}>{variantSize}</span>
                          )}
                          <span style={{
                            background: itemMode === "case" ? "rgba(251,191,36,0.15)" : "rgba(255,255,255,0.07)",
                            color: itemMode === "case" ? "#fbbf24" : "rgba(255,255,255,0.35)",
                            fontSize: 9, fontWeight: 800, textTransform: "uppercase" as const,
                            padding: "1px 5px", borderRadius: 4, letterSpacing: "0.04em",
                          }}>
                            {itemMode === "case" ? "case" : "unit"}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => cartRemove(item.slug, variantSize, itemMode)}
                        style={{ background: "none", border: "none", cursor: "pointer", padding: 2, flexShrink: 0, color: "rgba(255,255,255,0.25)", display: "flex" }}
                      >
                        <X size={13} />
                      </button>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      {/* Qty stepper */}
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <button
                          onClick={() => cartChangeQty(item.slug, variantSize, -1, itemMode)}
                          style={{ width: 24, height: 24, borderRadius: 6, border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.07)", color: "#fff", fontSize: 15, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1 }}
                        >−</button>
                        <span style={{ color: "#fff", fontSize: 12, fontWeight: 700, minWidth: 20, textAlign: "center" }}>
                          {item.quantity}{itemMode === "case" ? "c" : ""}
                        </span>
                        <button
                          onClick={() => cartChangeQty(item.slug, variantSize, 1, itemMode)}
                          style={{ width: 24, height: 24, borderRadius: 6, border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.07)", color: "#fff", fontSize: 15, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1 }}
                        >+</button>
                      </div>
                      <p style={{ margin: 0, color: "#fff", fontSize: 12, fontWeight: 700 }}>
                        ${((item.price ?? 0) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Totals */}
            <div style={{ padding: "14px 16px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ color: "rgba(255,255,255,0.45)", fontSize: 12 }}>Subtotal</span>
                <span style={{ color: "#fff", fontSize: 12, fontWeight: 700 }}>${cartSubtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ color: "rgba(255,255,255,0.45)", fontSize: 12 }}>GST (5%)</span>
                <span style={{ color: "#fff", fontSize: 12, fontWeight: 700 }}>${cartGST.toFixed(2)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14, paddingTop: 10, borderTop: "1px solid rgba(255,255,255,0.09)" }}>
                <span style={{ color: "#fff", fontSize: 14, fontWeight: 800 }}>Total</span>
                <span style={{ color: "#00f6ff", fontSize: 14, fontWeight: 800 }}>${cartTotal.toFixed(2)}</span>
              </div>
              <button
                onClick={() => router.push("/retailer/cart")}
                style={{
                  width: "100%", padding: "12px 0",
                  borderRadius: 10, border: "none", cursor: "pointer",
                  background: "#00f6ff", color: "#000",
                  fontSize: 12, fontWeight: 800,
                  textTransform: "uppercase", letterSpacing: "0.06em",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                }}
              >
                <Send size={13} strokeWidth={2.5} />
                Place Order
              </button>
            </div>
          </>
        )}
      </div>{/* end cart panel */}

    </div>
  );
}
