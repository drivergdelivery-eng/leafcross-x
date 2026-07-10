"use client";
import { useState } from "react";
import Image from "next/image";
import { ShoppingCart, Check } from "lucide-react";
import { alldayProducts, blkProducts, typeColors, type MenuProduct } from "@/lib/data/menu";

type CartItem = MenuProduct & { quantity: number };

function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem("lc-cart") ?? "[]"); } catch { return []; }
}

function saveCart(cart: CartItem[]) {
  localStorage.setItem("lc-cart", JSON.stringify(cart));
}

const stepperBtn: React.CSSProperties = {
  flexShrink: 0,
  width: 32,
  height: 32,
  borderRadius: 6,
  background: "rgba(255,255,255,0.1)",
  border: "1px solid rgba(255,255,255,0.2)",
  color: "#fff",
  fontSize: 18,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxSizing: "border-box",
};

export default function ProductMenuClient() {
  const [brand, setBrand] = useState<"allday" | "blk">("allday");
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [added, setAdded] = useState<Record<string, boolean>>({});

  const products = brand === "allday" ? alldayProducts : blkProducts;

  const getQty = (slug: string) => quantities[slug] ?? 1;

  const setQty = (slug: string, val: number) =>
    setQuantities(prev => ({ ...prev, [slug]: Math.max(1, val) }));

  const addToCart = (product: MenuProduct) => {
    const qty = getQty(product.slug);
    const cart = getCart();
    const existing = cart.find(i => i.slug === product.slug);
    if (existing) existing.quantity += qty;
    else cart.push({ ...product, quantity: qty });
    saveCart(cart);

    setAdded(prev => ({ ...prev, [product.slug]: true }));
    setTimeout(() => setAdded(prev => ({ ...prev, [product.slug]: false })), 1800);
  };

  return (
    <div>
      {/* Brand tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 32, borderBottom: "1px solid rgba(0,0,0,0.12)", paddingBottom: 0 }}>
        {[
          { key: "allday", label: "AllDay Cannabis" },
          { key: "blk",    label: "AllDay BLK Edition" },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setBrand(key as "allday" | "blk")}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "12px 24px",
              fontSize: 14,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: brand === key ? "#000" : "rgba(0,0,0,0.35)",
              borderBottom: `2px solid ${brand === key ? "#000" : "transparent"}`,
              marginBottom: -1,
              transition: "color 0.2s",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Product grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        gap: 20,
      }}>
        {products.map(product => {
          const isAdded = added[product.slug];
          const qty = getQty(product.slug);

          return (
            <div
              key={product.slug}
              style={{
                background: "#111",
                borderRadius: 12,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              {/* Image */}
              <div style={{ position: "relative", aspectRatio: "1 / 1", background: "#1a1a1a" }}>
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="240px"
                />
                <span style={{
                  position: "absolute", top: 10, left: 10,
                  background: typeColors[product.type],
                  color: "#000",
                  fontSize: 10, fontWeight: 800,
                  textTransform: "uppercase", letterSpacing: "0.08em",
                  padding: "3px 8px", borderRadius: 999,
                }}>
                  {product.type}
                </span>
              </div>

              {/* Info */}
              <div style={{ padding: "14px 16px 16px", display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
                <div>
                  <h3 style={{ margin: 0, color: "#fff", fontSize: 14, fontWeight: 700, lineHeight: 1.3 }}>
                    {product.name}
                  </h3>
                  <p style={{ margin: "4px 0 0", color: "rgba(255,255,255,0.4)", fontSize: 12 }}>
                    ${product.price.toFixed(2)} / {product.unit}
                  </p>
                </div>

                {/* Quantity stepper */}
                <div style={{ display: "flex", alignItems: "center", gap: 6, width: "100%" }}>
                  <button
                    onClick={() => setQty(product.slug, qty - 1)}
                    style={stepperBtn}
                  >−</button>
                  <input
                    type="number"
                    min={1}
                    value={qty}
                    onChange={e => setQty(product.slug, parseInt(e.target.value) || 1)}
                    style={{
                      flex: 1, minWidth: 0, textAlign: "center",
                      background: "rgba(255,255,255,0.08)",
                      border: "1px solid rgba(255,255,255,0.15)",
                      borderRadius: 6, color: "#fff",
                      fontSize: 14, fontWeight: 700,
                      padding: "6px 4px", outline: "none",
                      height: 32, boxSizing: "border-box",
                    }}
                  />
                  <button
                    onClick={() => setQty(product.slug, qty + 1)}
                    style={stepperBtn}
                  >+</button>
                </div>

                {/* Add to Cart button */}
                <button
                  onClick={() => addToCart(product)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    padding: "9px 0",
                    borderRadius: 8,
                    border: "none",
                    cursor: "pointer",
                    fontSize: 12,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    background: isAdded ? "#16a34a" : "#00f6ff",
                    color: "#000",
                    transition: "background 0.2s",
                  }}
                >
                  {isAdded
                    ? <><Check size={13} strokeWidth={3} /> Added</>
                    : <><ShoppingCart size={13} strokeWidth={2.5} /> Add to Cart</>}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
