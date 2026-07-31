"use client";
import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Package, Clock, CheckCircle, Truck, XCircle } from "lucide-react";

type OrderItem = {
  id: string;
  sku: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  line_total: number;
};

type Order = {
  id: string;
  order_number: string;
  status: string;
  payment_status: string;
  subtotal: number;
  gst_total: number;
  shipping_total: number;
  grand_total: number;
  submitted_at: string;
  notes?: string;
  order_items: OrderItem[];
};

const statusConfig: Record<string, { label: string; color: string; Icon: React.ElementType }> = {
  awaiting_payment: { label: "Awaiting Payment", color: "#fbbf24", Icon: Clock },
  processing:       { label: "Processing",        color: "#60a5fa", Icon: Package },
  shipped:          { label: "Shipped",            color: "#a78bfa", Icon: Truck },
  completed:        { label: "Completed",          color: "#4ade80", Icon: CheckCircle },
  cancelled:        { label: "Cancelled",          color: "#f87171", Icon: XCircle },
};

const paymentColors: Record<string, string> = {
  pending:  "#fbbf24",
  paid:     "#4ade80",
  declined: "#f87171",
};

const SQL_SETUP = `-- Run this in Supabase SQL Editor
CREATE TABLE public.orders (
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

export default function RetailerOrdersClient() {
  const [orders, setOrders]     = useState<Order[]>([]);
  const [loading, setLoading]   = useState(true);
  const [noTable, setNoTable]   = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/retailer/orders")
      .then(r => r.json())
      .then(json => {
        if (json.error === "SETUP_REQUIRED") {
          setNoTable(true);
        } else if (json.error) {
          setApiError(json.error);
        } else if (Array.isArray(json.data)) {
          setOrders(json.data);
        } else {
          setApiError("Unexpected response from server.");
        }
      })
      .catch(e => setApiError(`Network error: ${String(e)}`))
      .finally(() => setLoading(false));
  }, []);

  if (noTable) {
    return (
      <div style={{ background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.3)", borderRadius: 12, padding: "24px 28px" }}>
        <p style={{ margin: "0 0 8px", color: "#fbbf24", fontSize: 15, fontWeight: 700 }}>⚠ Database Setup Required</p>
        <p style={{ margin: "0 0 16px", color: "rgba(255,255,255,0.6)", fontSize: 14, lineHeight: 1.65 }}>
          The <code style={{ color: "#00f6ff" }}>orders</code> table hasn&apos;t been created in Supabase yet.
          An admin needs to run the following SQL in the Supabase SQL Editor:
        </p>
        <pre style={{ margin: 0, padding: "16px 20px", background: "rgba(0,0,0,0.5)", borderRadius: 8, color: "#a3e635", fontSize: 11, lineHeight: 1.7, overflowX: "auto", whiteSpace: "pre-wrap" }}>
          {SQL_SETUP}
        </pre>
      </div>
    );
  }

  if (apiError) return (
    <div style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.3)", borderRadius: 12, padding: "24px 28px" }}>
      <p style={{ margin: "0 0 8px", color: "#f87171", fontSize: 15, fontWeight: 700 }}>⚠ Could not load orders</p>
      <p style={{ margin: 0, color: "rgba(255,255,255,0.5)", fontSize: 13, fontFamily: "monospace" }}>{apiError}</p>
    </div>
  );

  if (loading) return (
    <div style={{ textAlign: "center", padding: "64px 0", color: "rgba(255,255,255,0.35)" }}>
      Loading orders…
    </div>
  );

  if (orders.length === 0) return (
    <div style={{ textAlign: "center", padding: "80px 0" }}>
      <Package size={48} color="rgba(255,255,255,0.15)" style={{ marginBottom: 16 }} />
      <p style={{ margin: "0 0 8px", color: "rgba(255,255,255,0.35)", fontSize: 16 }}>No orders yet.</p>
      <a href="/retailer/products" style={{ color: "#00f6ff", fontSize: 14, fontWeight: 700 }}>Browse the menu →</a>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {orders.map(order => {
        const cfg = statusConfig[order.status] ?? statusConfig.awaiting_payment;
        const isExpanded = expanded === order.id;
        const date = order.submitted_at
          ? new Date(order.submitted_at).toLocaleDateString("en-CA", { year: "numeric", month: "short", day: "numeric" })
          : "—";

        return (
          <div key={order.id} style={{
            background: "#111",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 12, overflow: "hidden",
          }}>
            {/* Row header */}
            <div
              onClick={() => setExpanded(prev => prev === order.id ? null : order.id)}
              className="orderRow"
            >
              <div>
                <p style={{ margin: 0, color: "#fff", fontSize: 14, fontWeight: 700, fontFamily: "monospace", letterSpacing: "0.04em" }}>
                  {order.order_number}
                </p>
                <p style={{ margin: "3px 0 0", color: "rgba(255,255,255,0.35)", fontSize: 12 }}>
                  {order.order_items.length} item{order.order_items.length !== 1 ? "s" : ""} · {date}
                </p>
              </div>

              {/* Order status */}
              <span className="orderRowHide" style={{
                display: "inline-flex", alignItems: "center", gap: 5,
                color: cfg.color, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em",
              }}>
                {cfg.label}
              </span>

              {/* Payment status */}
              <span className="orderRowHide" style={{
                fontSize: 11, fontWeight: 700, textTransform: "uppercase",
                color: paymentColors[order.payment_status] ?? "#fbbf24",
              }}>
                {order.payment_status === "paid" ? "Paid" : order.payment_status === "declined" ? "Declined" : "Payment Pending"}
              </span>

              {/* Grand total */}
              <span style={{ color: "#00f6ff", fontSize: 14, fontWeight: 800, textAlign: "right" }}>
                ${order.grand_total.toFixed(2)}
              </span>

              {isExpanded
                ? <ChevronUp size={16} color="rgba(255,255,255,0.4)" />
                : <ChevronDown size={16} color="rgba(255,255,255,0.4)" />}
            </div>

            {/* Expanded detail */}
            {isExpanded && (
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", padding: "20px" }}>
                {/* Items table */}
                <div style={{ marginBottom: 20 }}>
                  <p style={{ margin: "0 0 10px", color: "rgba(255,255,255,0.35)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>Order Items</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 80px 80px 90px", gap: 0 }}>
                    {["Product", "Qty", "Unit Price", "Line Total"].map(h => (
                      <div key={h} style={{ padding: "6px 10px", background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.35)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", textAlign: h !== "Product" ? "center" : "left" }}>
                        {h}
                      </div>
                    ))}
                    {order.order_items.map(item => (
                      <>
                        <div key={`${item.id}-name`} style={{ padding: "10px", color: "#fff", fontSize: 13, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>{item.product_name}</div>
                        <div key={`${item.id}-qty`} style={{ padding: "10px", color: "rgba(255,255,255,0.7)", fontSize: 13, textAlign: "center", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>{item.quantity}</div>
                        <div key={`${item.id}-price`} style={{ padding: "10px", color: "rgba(255,255,255,0.7)", fontSize: 13, textAlign: "center", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>${item.unit_price.toFixed(2)}</div>
                        <div key={`${item.id}-total`} style={{ padding: "10px", color: "#fff", fontSize: 13, fontWeight: 600, textAlign: "center", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>${item.line_total.toFixed(2)}</div>
                      </>
                    ))}
                  </div>
                </div>

                {/* Totals */}
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <div style={{ minWidth: 260, display: "flex", flexDirection: "column", gap: 6 }}>
                    {[
                      ["Subtotal", `$${order.subtotal.toFixed(2)}`],
                      ["GST (5%)", `$${order.gst_total.toFixed(2)}`],
                      ["Flat Shipping", `$${order.shipping_total.toFixed(2)}`],
                    ].map(([label, val]) => (
                      <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}>
                        <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>{label}</span>
                        <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 13 }}>{val}</span>
                      </div>
                    ))}
                    <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 10, marginTop: 4 }}>
                      <span style={{ color: "#fff", fontSize: 15, fontWeight: 700 }}>Total</span>
                      <span style={{ color: "#00f6ff", fontSize: 16, fontWeight: 800 }}>${order.grand_total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Payment instructions (if still pending) */}
                {order.payment_status === "pending" && (
                  <div style={{ marginTop: 20, padding: "16px 18px", background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.25)", borderRadius: 8 }}>
                    <p style={{ margin: "0 0 10px", color: "#fbbf24", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>Payment Required</p>
                    <p style={{ margin: "0 0 12px", color: "rgba(255,255,255,0.6)", fontSize: 13, lineHeight: 1.6 }}>
                      Payment must be received within <strong style={{ color: "#fff" }}>48 hours</strong>.
                      Reference order <strong style={{ color: "#00f6ff" }}>{order.order_number}</strong> in all payment messages.
                    </p>
                    <div style={{ marginBottom: 8, padding: "10px 12px", background: "rgba(0,246,255,0.06)", border: "1px solid rgba(0,246,255,0.15)", borderRadius: 6 }}>
                      <p style={{ margin: "0 0 3px", color: "#00f6ff", fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em" }}>Option 1 — Interac E-Transfer</p>
                      <p style={{ margin: 0, color: "rgba(255,255,255,0.7)", fontSize: 12 }}>Send to <strong style={{ color: "#fff" }}>payment@leafcross.com</strong></p>
                    </div>
                    <div style={{ padding: "10px 12px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6 }}>
                      <p style={{ margin: "0 0 8px", color: "rgba(255,255,255,0.4)", fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em" }}>Option 2 — Wire / EFT</p>
                      {[
                        ["Bank",             "CIBC — Canadian Imperial Bank of Commerce"],
                        ["Branch Address",   "6204 Fraser St, Vancouver, BC  V5W 3A1"],
                        ["SWIFT",            "CIBCCATT"],
                        ["Branch/Transit #", "00810"],
                        ["Institution #",    "010"],
                        ["Account #",        "9249311"],
                        ["CC Code",          "CC001000810"],
                      ].map(([label, val]) => (
                        <div key={label} style={{ display: "flex", gap: 8, padding: "2px 0" }}>
                          <span style={{ minWidth: 110, color: "rgba(255,255,255,0.3)", fontSize: 11, flexShrink: 0 }}>{label}</span>
                          <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 11 }}>{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {order.notes && (
                  <div style={{ marginTop: 14, padding: "12px 14px", background: "rgba(255,255,255,0.04)", borderRadius: 8 }}>
                    <p style={{ margin: "0 0 4px", color: "rgba(255,255,255,0.35)", fontSize: 11, fontWeight: 700, textTransform: "uppercase" }}>Notes</p>
                    <p style={{ margin: 0, color: "rgba(255,255,255,0.7)", fontSize: 13, lineHeight: 1.6 }}>{order.notes}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
