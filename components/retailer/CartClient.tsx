"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Trash2, CheckCircle, AlertTriangle, MapPin } from "lucide-react";
import { typeColors, type MenuProduct, type ProductVariant } from "@/lib/data/menu";

type RetailerLocation = {
  id: string;
  nickname: string;
  shipping_address: string;
  license_number: string;
};

type CartItem = MenuProduct & { quantity: number; selectedVariant?: ProductVariant; orderMode?: "unit" | "case" };

const GST      = 0.05;
const SHIPPING = 28.99;

const SQL_SETUP = `CREATE TABLE public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  retailer_id UUID REFERENCES retailers(id),
  order_number TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'awaiting_payment',
  payment_status TEXT NOT NULL DEFAULT 'pending',
  subtotal NUMERIC(10,2) NOT NULL,
  gst_rate NUMERIC(5,4) DEFAULT 0.05,
  gst_total NUMERIC(10,2) NOT NULL,
  shipping_total NUMERIC(10,2) NOT NULL,
  grand_total NUMERIC(10,2) NOT NULL,
  shipping_address TEXT,
  notes TEXT,
  submitted_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  sku TEXT NOT NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC(10,2) NOT NULL,
  line_total NUMERIC(10,2) NOT NULL
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Retailers insert own orders" ON public.orders
  FOR INSERT TO authenticated WITH CHECK (
    retailer_id IN (SELECT id FROM retailers WHERE user_id = auth.uid())
  );
CREATE POLICY "Retailers read own orders" ON public.orders
  FOR SELECT TO authenticated USING (
    retailer_id IN (SELECT id FROM retailers WHERE user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','manager'))
  );
CREATE POLICY "Admins update orders" ON public.orders
  FOR UPDATE TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','manager'))
  );
CREATE POLICY "Authenticated insert order items" ON public.order_items
  FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users read own order items" ON public.order_items
  FOR SELECT TO authenticated USING (
    order_id IN (
      SELECT id FROM orders WHERE retailer_id IN (
        SELECT id FROM retailers WHERE user_id = auth.uid()
      )
    )
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','manager'))
  );`;

export default function CartClient() {
  const [cart, setCart]           = useState<CartItem[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [orderError, setOrderError]   = useState("");
  const [setupRequired, setSetupRequired] = useState(false);
  const [setupSql, setSetupSql]     = useState("");

  // Location selector
  const [locations, setLocations]             = useState<RetailerLocation[]>([]);
  const [selectedLocationId, setSelectedLocationId] = useState<string>("");

  useEffect(() => {
    try { setCart(JSON.parse(localStorage.getItem("lc-cart") ?? "[]")); } catch { setCart([]); }
  }, []);

  useEffect(() => {
    fetch("/api/retailer/locations")
      .then(r => r.json())
      .then(j => {
        if (Array.isArray(j.data)) {
          const approved = j.data.filter((l: RetailerLocation & { status?: string }) => l.status === "approved");
          setLocations(approved);
          if (approved.length) setSelectedLocationId(approved[0].id);
        }
      })
      .catch(() => {});
  }, []);

  const update = (updated: CartItem[]) => {
    setCart(updated);
    localStorage.setItem("lc-cart", JSON.stringify(updated));
  };

  const changeQty = (slug: string, variantSize: string | undefined, delta: number, mode: "unit" | "case" = "unit") => {
    const next = cart.map(item => {
      const matches = item.slug === slug && (item.selectedVariant?.size ?? "") === (variantSize ?? "") && (item.orderMode ?? "unit") === mode;
      if (!matches) return item;
      const nextQty = Math.max(1, item.quantity + delta);
      return { ...item, quantity: nextQty };
    });
    update(next);
  };

  const remove = (slug: string, variantSize: string | undefined, mode: "unit" | "case" = "unit") =>
    update(cart.filter(i => !(i.slug === slug && (i.selectedVariant?.size ?? "") === (variantSize ?? "") && (i.orderMode ?? "unit") === mode)));

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const gst      = subtotal * GST;
  const total    = subtotal + gst + SHIPPING;

  const submitOrder = async () => {
    setSubmitting(true);
    setOrderError("");
    setSetupRequired(false);

    const selectedLocation = locations.find(l => l.id === selectedLocationId);
    const res = await fetch("/api/retailer/submit-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: cart,
        locationId: selectedLocation?.id ?? null,
        shippingAddress: selectedLocation?.shipping_address ?? null,
      }),
    });

    const json = await res.json();
    setSubmitting(false);

    if (!res.ok) {
      if (json.error === "SETUP_REQUIRED") {
        setSetupRequired(true);
        setSetupSql(json.sql ?? SQL_SETUP);
        return;
      }
      setOrderError(json.error || "Failed to submit order. Please try again.");
      return;
    }

    localStorage.removeItem("lc-cart");
    setCart([]);
    setOrderNumber(json.orderNumber);
  };

  // ── Success screen ──────────────────────────────────────────────────────
  if (orderNumber) {
    return (
      <div style={{
        maxWidth: 560, margin: "0 auto",
        background: "#111", border: "1px solid rgba(0,246,255,0.2)",
        borderRadius: 16, padding: "48px 40px", textAlign: "center",
      }}>
        <CheckCircle size={64} color="#00f6ff" style={{ marginBottom: 20 }} />
        <h2 style={{ margin: "0 0 8px", color: "#fff", fontSize: 28, fontWeight: 800 }}>Order Placed!</h2>
        <p style={{ margin: "0 0 4px", color: "rgba(255,255,255,0.4)", fontSize: 15 }}>Your order number is</p>
        <p style={{ margin: "0 0 28px", color: "#00f6ff", fontSize: 24, fontWeight: 800, fontFamily: "monospace", letterSpacing: "0.05em" }}>
          {orderNumber}
        </p>

        <div style={{ textAlign: "left", background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.25)", borderRadius: 10, padding: "20px 20px 18px", marginBottom: 16 }}>
          <p style={{ margin: "0 0 10px", color: "#fbbf24", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>Payment Required</p>
          <p style={{ margin: "0 0 14px", color: "rgba(255,255,255,0.65)", fontSize: 13, lineHeight: 1.65 }}>
            Payment must be received within <strong style={{ color: "#fff" }}>48 hours</strong> of placing your order to guarantee shipment.
            Please include your order number <strong style={{ color: "#00f6ff" }}>{orderNumber}</strong> in all payment references.
          </p>

          {/* E-Transfer */}
          <div style={{ marginBottom: 14, padding: "12px 14px", background: "rgba(0,246,255,0.06)", border: "1px solid rgba(0,246,255,0.18)", borderRadius: 8 }}>
            <p style={{ margin: "0 0 4px", color: "#00f6ff", fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em" }}>Option 1 — Interac E-Transfer</p>
            <p style={{ margin: 0, color: "rgba(255,255,255,0.7)", fontSize: 13, lineHeight: 1.6 }}>
              Send to <strong style={{ color: "#fff" }}>payment@leafcross.com</strong>
            </p>
          </div>

          {/* Wire Transfer */}
          <div style={{ padding: "12px 14px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }}>
            <p style={{ margin: "0 0 10px", color: "rgba(255,255,255,0.5)", fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em" }}>Option 2 — Wire / EFT Transfer</p>
            {[
              ["Bank",             "CIBC — Canadian Imperial Bank of Commerce"],
              ["Branch Address",   "6204 Fraser St, Vancouver, BC, Canada V5W 3A1"],
              ["SWIFT Code",       "CIBCCATT"],
              ["Branch/Transit #", "00810"],
              ["Institution #",    "010"],
              ["Account #",        "9249311"],
              ["CC Code",          "CC001000810"],
            ].map(([label, val]) => (
              <div key={label} style={{ display: "flex", gap: 10, padding: "3px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <span style={{ minWidth: 120, color: "rgba(255,255,255,0.35)", fontSize: 12, fontWeight: 600, flexShrink: 0 }}>{label}</span>
                <span style={{ color: "rgba(255,255,255,0.85)", fontSize: 12, fontWeight: 500 }}>{val}</span>
              </div>
            ))}
          </div>
        </div>

        <p style={{ margin: "0 0 24px", color: "rgba(255,255,255,0.4)", fontSize: 13, lineHeight: 1.6 }}>
          A confirmation has been sent to your email. You can also view this order in your Orders page.
        </p>

        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <a href="/retailer/orders" style={{
            display: "inline-flex", alignItems: "center", padding: "12px 28px", borderRadius: 8,
            background: "#00f6ff", color: "#000", fontSize: 13, fontWeight: 800,
            textTransform: "uppercase", letterSpacing: "0.08em", textDecoration: "none",
          }}>
            View My Orders
          </a>
          <a href="/retailer/products" style={{
            display: "inline-flex", alignItems: "center", padding: "12px 28px", borderRadius: 8,
            border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.6)",
            fontSize: 13, fontWeight: 600, textDecoration: "none",
          }}>
            Browse Menu
          </a>
        </div>
      </div>
    );
  }

  // ── Setup required screen ───────────────────────────────────────────────
  if (setupRequired) {
    return (
      <div style={{ background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.3)", borderRadius: 12, padding: "24px 28px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <AlertTriangle size={18} color="#fbbf24" />
          <p style={{ margin: 0, color: "#fbbf24", fontSize: 15, fontWeight: 700 }}>Database Setup Required</p>
        </div>
        <p style={{ margin: "0 0 16px", color: "rgba(255,255,255,0.6)", fontSize: 14, lineHeight: 1.65 }}>
          The <code style={{ color: "#00f6ff" }}>orders</code> table doesn&apos;t exist in Supabase yet.
          Please ask your admin to run the following SQL in the Supabase SQL Editor, then try again.
        </p>
        <pre style={{ margin: "0 0 16px", padding: "16px 20px", background: "rgba(0,0,0,0.5)", borderRadius: 8, color: "#a3e635", fontSize: 11, lineHeight: 1.7, overflowX: "auto", whiteSpace: "pre-wrap" }}>
          {setupSql}
        </pre>
        <button onClick={() => { setSetupRequired(false); }} style={{ padding: "8px 20px", borderRadius: 8, border: "none", background: "#00f6ff", color: "#000", fontSize: 12, fontWeight: 800, cursor: "pointer" }}>
          Try Again
        </button>
      </div>
    );
  }

  // ── Empty cart ──────────────────────────────────────────────────────────
  if (cart.length === 0) return (
    <div style={{ textAlign: "center", padding: "80px 0", color: "rgba(255,255,255,0.3)" }}>
      <p style={{ fontSize: 18, marginBottom: 12 }}>Your cart is empty.</p>
      <a href="/retailer/products" style={{ color: "#00f6ff", fontSize: 14, fontWeight: 700 }}>Browse the menu →</a>
    </div>
  );

  // ── Cart ────────────────────────────────────────────────────────────────
  return (
    <div className="cartLayout">
      {/* Items */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {cart.map(item => {
          const itemMode = item.orderMode ?? "unit";
          const isCase = itemMode === "case";
          return (
            <div key={`${item.slug}::${item.selectedVariant?.size ?? ""}::${itemMode}`} style={{
              background: "#111", border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 12, padding: "16px", display: "flex", gap: 16, alignItems: "center",
            }}>
              <div style={{ width: 64, height: 64, borderRadius: 8, overflow: "hidden", flexShrink: 0, position: "relative" }}>
                <Image src={item.image} alt={item.name} fill style={{ objectFit: "cover" }} sizes="64px" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                  <span style={{
                    background: typeColors[item.type], color: "#000",
                    fontSize: 9, fontWeight: 800, textTransform: "uppercase",
                    letterSpacing: "0.08em", padding: "2px 6px", borderRadius: 999,
                  }}>{item.type}</span>
                  <span style={{ color: "#fff", fontSize: 14, fontWeight: 700 }}>{item.name}</span>
                  {item.selectedVariant && (
                    <span style={{
                      background: "rgba(0,246,255,0.12)", color: "#00f6ff",
                      fontSize: 10, fontWeight: 700, padding: "2px 7px",
                      borderRadius: 4, letterSpacing: "0.06em",
                    }}>{item.selectedVariant.size}</span>
                  )}
                  <span style={{
                    background: isCase ? "rgba(251,191,36,0.12)" : "rgba(255,255,255,0.07)",
                    color: isCase ? "#fbbf24" : "rgba(255,255,255,0.4)",
                    fontSize: 9, fontWeight: 800, textTransform: "uppercase" as const,
                    padding: "2px 7px", borderRadius: 4, letterSpacing: "0.06em",
                  }}>{isCase ? "Case" : "Units"}</span>
                </div>
                <p style={{ margin: 0, color: "rgba(255,255,255,0.4)", fontSize: 12 }}>
                  ${item.price.toFixed(2)} / {isCase ? "case (24 units)" : (item.selectedVariant?.size ?? item.unit)}
                  {isCase && (
                    <span style={{ marginLeft: 8, color: "rgba(255,255,255,0.25)" }}>
                      · {item.quantity * 24} units total
                    </span>
                  )}
                </p>
              </div>

              {/* Qty controls */}
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button onClick={() => changeQty(item.slug, item.selectedVariant?.size, -1, itemMode)} style={qtyBtn}>−</button>
                <span style={{ color: "#fff", fontSize: 14, fontWeight: 700, minWidth: 24, textAlign: "center" }}>
                  {item.quantity}
                </span>
                <button
                  onClick={() => changeQty(item.slug, item.selectedVariant?.size, +1, itemMode)}
                  style={qtyBtn}
                >+</button>
              </div>

              <p style={{ margin: 0, color: "#fff", fontSize: 14, fontWeight: 700, minWidth: 60, textAlign: "right" }}>
                ${(item.price * item.quantity).toFixed(2)}
              </p>

              <button onClick={() => remove(item.slug, item.selectedVariant?.size, itemMode)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.3)", padding: 4 }}>
                <Trash2 size={16} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div style={{
        background: "#111", border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 12, padding: 24, position: "sticky", top: 24,
      }}>
        <h2 style={{ margin: "0 0 20px", color: "#fff", fontSize: 18, fontWeight: 700 }}>Order Summary</h2>

        {[
          ["Subtotal",      `$${subtotal.toFixed(2)}`],
          ["GST (5%)",      `$${gst.toFixed(2)}`],
          ["Flat Shipping", `$${SHIPPING.toFixed(2)}`],
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

        {/* Ship-to location selector */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
            <MapPin size={13} color="#00f6ff" />
            <span style={{ color: "rgba(255,255,255,0.55)", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Ship To
            </span>
          </div>
          {locations.length === 0 ? (
            <div style={{ padding: "10px 12px", borderRadius: 8, background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.25)" }}>
              <p style={{ margin: 0, color: "#fbbf24", fontSize: 12, lineHeight: 1.5 }}>
                No approved locations yet.{" "}
                <a href="/retailer/account" style={{ color: "#00f6ff", fontWeight: 700 }}>Add one in My Account →</a>
                {" "}Locations require admin approval before use.
              </p>
            </div>
          ) : (
            <select
              value={selectedLocationId}
              onChange={e => setSelectedLocationId(e.target.value)}
              style={{
                width: "100%", padding: "10px 12px", borderRadius: 8,
                background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)",
                color: "#fff", fontSize: 13, outline: "none", cursor: "pointer",
              }}
            >
              {locations.map(loc => (
                <option key={loc.id} value={loc.id} style={{ background: "#111" }}>
                  {loc.nickname || loc.shipping_address}
                </option>
              ))}
            </select>
          )}
          {selectedLocationId && locations.length > 0 && (() => {
            const loc = locations.find(l => l.id === selectedLocationId);
            return loc ? (
              <p style={{ margin: "6px 0 0", color: "rgba(255,255,255,0.35)", fontSize: 11, lineHeight: 1.5 }}>
                {loc.shipping_address}
              </p>
            ) : null;
          })()}
        </div>

        {orderError && (
          <div style={{ display: "flex", gap: 8, alignItems: "flex-start", padding: "10px 12px", borderRadius: 8, background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)", marginBottom: 12 }}>
            <AlertTriangle size={14} color="#f87171" style={{ flexShrink: 0, marginTop: 1 }} />
            <p style={{ margin: 0, color: "#f87171", fontSize: 13, lineHeight: 1.5 }}>{orderError}</p>
          </div>
        )}

        <button
          onClick={submitOrder}
          disabled={submitting}
          style={{
            width: "100%", padding: "14px",
            background: submitting ? "rgba(0,246,255,0.4)" : "#00f6ff",
            border: "none", borderRadius: 8,
            color: "#000", fontSize: 13, fontWeight: 800,
            textTransform: "uppercase", letterSpacing: "0.08em",
            cursor: submitting ? "not-allowed" : "pointer",
            transition: "background 0.15s",
          }}
        >
          {submitting ? "Placing Order…" : "Submit Order"}
        </button>

        <p style={{ margin: "12px 0 0", color: "rgba(255,255,255,0.3)", fontSize: 11, textAlign: "center", lineHeight: 1.5 }}>
          E-Transfer to payment@leafcross.com within 48 hrs. All sales final.
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
