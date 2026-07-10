"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { typeColors, type MenuProduct } from "@/lib/data/menu";

type CartItem = MenuProduct & { quantity: number };

const GST = 0.05;
const SHIPPING = 28.99;

export default function CartClient() {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    try { setCart(JSON.parse(localStorage.getItem("lc-cart") ?? "[]")); } catch { setCart([]); }
  }, []);

  const update = (updated: CartItem[]) => {
    setCart(updated);
    localStorage.setItem("lc-cart", JSON.stringify(updated));
  };

  const changeQty = (slug: string, delta: number) => {
    const next = cart.map(i => i.slug === slug ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i);
    update(next);
  };

  const remove = (slug: string) => update(cart.filter(i => i.slug !== slug));

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const gst = subtotal * GST;
  const total = subtotal + gst + SHIPPING;

  if (cart.length === 0) return (
    <div style={{ textAlign: "center", padding: "80px 0", color: "rgba(255,255,255,0.3)" }}>
      <p style={{ fontSize: 18 }}>Your cart is empty.</p>
      <a href="/retailer/products" style={{ color: "#00f6ff", fontSize: 14, fontWeight: 700 }}>Browse the menu →</a>
    </div>
  );

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 32, alignItems: "start" }}>
      {/* Items */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {cart.map(item => (
          <div key={item.slug} style={{
            background: "#111",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 12,
            padding: "16px",
            display: "flex",
            gap: 16,
            alignItems: "center",
          }}>
            <div style={{ width: 64, height: 64, borderRadius: 8, overflow: "hidden", flexShrink: 0, position: "relative" }}>
              <Image src={item.image} alt={item.name} fill style={{ objectFit: "cover" }} sizes="64px" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span style={{
                  background: typeColors[item.type], color: "#000",
                  fontSize: 9, fontWeight: 800, textTransform: "uppercase",
                  letterSpacing: "0.08em", padding: "2px 6px", borderRadius: 999,
                }}>{item.type}</span>
                <span style={{ color: "#fff", fontSize: 14, fontWeight: 700 }}>{item.name}</span>
              </div>
              <p style={{ margin: 0, color: "rgba(255,255,255,0.4)", fontSize: 12 }}>
                ${item.price.toFixed(2)} / {item.unit}
              </p>
            </div>

            {/* Qty controls */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button onClick={() => changeQty(item.slug, -1)} style={qtyBtn}>−</button>
              <span style={{ color: "#fff", fontSize: 14, fontWeight: 700, minWidth: 24, textAlign: "center" }}>{item.quantity}</span>
              <button onClick={() => changeQty(item.slug, +1)} style={qtyBtn}>+</button>
            </div>

            <p style={{ margin: 0, color: "#fff", fontSize: 14, fontWeight: 700, minWidth: 60, textAlign: "right" }}>
              ${(item.price * item.quantity).toFixed(2)}
            </p>

            <button onClick={() => remove(item.slug)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.3)", padding: 4 }}>
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div style={{
        background: "#111",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 12,
        padding: 24,
        position: "sticky",
        top: 24,
      }}>
        <h2 style={{ margin: "0 0 20px", color: "#fff", fontSize: 18, fontWeight: 700 }}>Order Summary</h2>

        {[
          ["Subtotal",     `$${subtotal.toFixed(2)}`],
          ["GST (5%)",     `$${gst.toFixed(2)}`],
          ["Flat Shipping",`$${SHIPPING.toFixed(2)}`],
        ].map(([label, value]) => (
          <div key={label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
            <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 14 }}>{label}</span>
            <span style={{ color: "#fff", fontSize: 14 }}>{value}</span>
          </div>
        ))}

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 16, marginTop: 4, display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
          <span style={{ color: "#fff", fontSize: 16, fontWeight: 700 }}>Total</span>
          <span style={{ color: "#00f6ff", fontSize: 18, fontWeight: 800 }}>${total.toFixed(2)}</span>
        </div>

        <button style={{
          width: "100%", padding: "14px",
          background: "#00f6ff", border: "none", borderRadius: 8,
          color: "#000", fontSize: 13, fontWeight: 800,
          textTransform: "uppercase", letterSpacing: "0.08em", cursor: "pointer",
        }}>
          Submit Order
        </button>

        <p style={{ margin: "12px 0 0", color: "rgba(255,255,255,0.3)", fontSize: 11, textAlign: "center", lineHeight: 1.5 }}>
          Payment required within 48 hrs of order. All sales final.
        </p>
      </div>
    </div>
  );
}

const qtyBtn: React.CSSProperties = {
  width: 28, height: 28, borderRadius: 6,
  background: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(255,255,255,0.12)",
  color: "#fff", fontSize: 16, cursor: "pointer",
  display: "flex", alignItems: "center", justifyContent: "center",
};
