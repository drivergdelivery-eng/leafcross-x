"use client";
import { useState } from "react";
import { ChevronDown, ChevronUp, Check, X, Pencil, FileText } from "lucide-react";
import Link from "next/link";
import { useOrders, calcTotals, type OrderStatus, type OrderItem } from "@/lib/store/ordersContext";

const paymentColors = { pending: "#fbbf24", paid: "#4ade80", declined: "#f87171" };
const statusLabels: Record<OrderStatus, string> = {
  awaiting_payment: "Awaiting Payment",
  processing:       "Processing",
  shipped:          "Shipped",
  completed:        "Completed",
  cancelled:        "Cancelled",
};

const editInput: React.CSSProperties = {
  width: "100%", background: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(255,255,255,0.2)", borderRadius: 6,
  color: "#fff", fontSize: 13, fontWeight: 600,
  padding: "4px 6px", outline: "none",
};

export default function AdminOrdersClient() {
  const { orders, updateOrder, updateItem, removeItem, markPaid, markDeclined } = useOrders();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [editing,  setEditing]  = useState<string | null>(null);

  return (
    <div>
      {/* Header row */}
      <div style={{
        display: "grid", gridTemplateColumns: "130px 1fr 160px 110px 160px 140px 24px",
        gap: 12, padding: "0 16px", marginBottom: 12,
        color: "rgba(0,0,0,0.45)", fontSize: 11, fontWeight: 700,
        textTransform: "uppercase", letterSpacing: "0.08em",
      }}>
        <span>Order #</span><span>Retailer</span><span>Submitted</span>
        <span>Total</span><span>Payment</span><span>Status</span><span />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {orders.map(order => {
          const isExpanded = expanded === order.id;
          const isEditing  = editing  === order.id;
          const { sub, gst, total } = calcTotals(order.items);

          return (
            <div key={order.id} style={{
              background: "#111", borderRadius: 12, overflow: "hidden",
              border: `1px solid ${order.paymentStatus === "pending"
                ? "rgba(251,191,36,0.25)" : "rgba(255,255,255,0.07)"}`,
            }}>
              {/* Summary row */}
              <div
                onClick={() => setExpanded(isExpanded ? null : order.id)}
                style={{
                  display: "grid", gridTemplateColumns: "130px 1fr 160px 110px 160px 140px 24px",
                  gap: 12, alignItems: "center", padding: "14px 16px", cursor: "pointer",
                }}
              >
                <span style={{ color: "#00f6ff", fontSize: 13, fontWeight: 700, fontFamily: "monospace" }}>
                  {order.orderNumber}
                </span>
                <div>
                  <p style={{ margin: 0, color: "#fff", fontSize: 13, fontWeight: 700 }}>{order.retailer}</p>
                  <p style={{ margin: "2px 0 0", color: "rgba(255,255,255,0.35)", fontSize: 11 }}>{order.email}</p>
                </div>
                <span style={{ color: "rgba(255,255,255,0.45)", fontSize: 12 }}>{order.submitted}</span>
                <span style={{ color: "#fff", fontSize: 13, fontWeight: 700 }}>${total.toFixed(2)}</span>
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  color: paymentColors[order.paymentStatus],
                  fontSize: 12, fontWeight: 700, textTransform: "capitalize",
                }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: paymentColors[order.paymentStatus], display: "inline-block" }} />
                  {order.paymentStatus}
                </span>
                <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>{statusLabels[order.orderStatus]}</span>
                {isExpanded
                  ? <ChevronUp  size={15} color="rgba(255,255,255,0.35)" />
                  : <ChevronDown size={15} color="rgba(255,255,255,0.35)" />}
              </div>

              {/* Expanded panel */}
              {isExpanded && (
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "20px", display: "flex", flexDirection: "column", gap: 20 }}>

                  {/* Items header */}
                  <div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                      <p style={{ margin: 0, color: "rgba(255,255,255,0.35)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>Order Items</p>
                      <div style={{ display: "flex", gap: 8 }}>
                        <Link href="/admin/invoices" style={{
                          display: "flex", alignItems: "center", gap: 5,
                          background: "rgba(0,246,255,0.06)", border: "1px solid rgba(0,246,255,0.2)",
                          borderRadius: 6, color: "#00f6ff", fontSize: 11, fontWeight: 700,
                          padding: "5px 12px", textDecoration: "none",
                        }}>
                          <FileText size={11} /> View Invoice
                        </Link>
                        <button
                          onClick={() => setEditing(isEditing ? null : order.id)}
                          style={{
                            display: "flex", alignItems: "center", gap: 5,
                            background: isEditing ? "rgba(0,246,255,0.1)" : "rgba(255,255,255,0.05)",
                            border: `1px solid ${isEditing ? "#00f6ff" : "rgba(255,255,255,0.1)"}`,
                            borderRadius: 6, color: isEditing ? "#00f6ff" : "rgba(255,255,255,0.45)",
                            fontSize: 11, fontWeight: 700, padding: "5px 12px", cursor: "pointer",
                          }}
                        >
                          <Pencil size={11} /> {isEditing ? "Done" : "Edit Order"}
                        </button>
                      </div>
                    </div>

                    {/* Item col header */}
                    <div style={{
                      display: "grid", gridTemplateColumns: "1fr 72px 100px 100px 28px",
                      gap: 10, padding: "0 10px", marginBottom: 6,
                      color: "rgba(255,255,255,0.28)", fontSize: 11, fontWeight: 700, textTransform: "uppercase",
                    }}>
                      <span>Product</span><span>Qty</span><span>Unit Price</span><span>Line Total</span><span />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {order.items.map((item, idx) => (
                        <div key={idx} style={{
                          display: "grid", gridTemplateColumns: "1fr 72px 100px 100px 28px",
                          gap: 10, alignItems: "center",
                          background: "rgba(255,255,255,0.03)", borderRadius: 8, padding: "10px",
                        }}>
                          <div>
                            <span style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>{item.name}</span>
                            <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, marginLeft: 8 }}>{item.type}</span>
                          </div>

                          {isEditing ? (
                            <input type="number" min={0} value={item.qty}
                              onChange={e => updateItem(order.id, idx, "qty", parseInt(e.target.value) || 0)}
                              style={editInput} />
                          ) : (
                            <span style={{ color: "#fff", fontSize: 13 }}>{item.qty}</span>
                          )}

                          {isEditing ? (
                            <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                              <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 12 }}>$</span>
                              <input type="number" step="0.01" min={0} value={item.unitPrice}
                                onChange={e => updateItem(order.id, idx, "unitPrice", parseFloat(e.target.value) || 0)}
                                style={{ ...editInput, width: 70 }} />
                            </div>
                          ) : (
                            <span style={{ color: "#fff", fontSize: 13 }}>${item.unitPrice.toFixed(2)}</span>
                          )}

                          <span style={{ color: "#00f6ff", fontSize: 13, fontWeight: 700 }}>
                            ${(item.qty * item.unitPrice).toFixed(2)}
                          </span>

                          {isEditing ? (
                            <button onClick={() => removeItem(order.id, idx)} style={{
                              background: "none", border: "none", cursor: "pointer", color: "#f87171", padding: 2, display: "flex",
                            }}><X size={13} /></button>
                          ) : <span />}
                        </div>
                      ))}
                    </div>

                    {/* Totals */}
                    <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                      {[
                        ["Subtotal",      `$${sub.toFixed(2)}`],
                        ["GST (5%)",      `$${gst.toFixed(2)}`],
                        ["Flat Shipping", "$28.99"],
                      ].map(([l, v]) => (
                        <div key={l} style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                          <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 13 }}>{l}</span>
                          <span style={{ color: "rgba(255,255,255,0.65)", fontSize: 13 }}>{v}</span>
                        </div>
                      ))}
                      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, paddingTop: 8, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                        <span style={{ color: "#fff", fontSize: 15, fontWeight: 700 }}>Total</span>
                        <span style={{ color: "#00f6ff", fontSize: 16, fontWeight: 800 }}>${total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Admin notes */}
                  <div>
                    <p style={{ margin: "0 0 8px", color: "rgba(255,255,255,0.3)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em" }}>Admin Notes</p>
                    <textarea value={order.notes}
                      onChange={e => updateOrder(order.id, { notes: e.target.value })}
                      placeholder="E-transfer received, tracking number, special instructions..."
                      rows={2} style={{
                        width: "100%", background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8,
                        color: "#fff", fontSize: 14, padding: "10px 12px",
                        outline: "none", resize: "vertical", boxSizing: "border-box",
                      }} />
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                    <button onClick={() => markPaid(order.id)} style={{
                      display: "flex", alignItems: "center", gap: 6, padding: "10px 20px",
                      borderRadius: 8, border: "none", cursor: "pointer",
                      background: order.paymentStatus === "paid" ? "#16a34a" : "rgba(74,222,128,0.12)",
                      color: "#4ade80", fontSize: 13, fontWeight: 700,
                    }}><Check size={14} /> Mark Paid</button>

                    <button onClick={() => markDeclined(order.id)} style={{
                      display: "flex", alignItems: "center", gap: 6, padding: "10px 20px",
                      borderRadius: 8, border: "none", cursor: "pointer",
                      background: order.paymentStatus === "declined" ? "#dc2626" : "rgba(248,113,113,0.12)",
                      color: "#f87171", fontSize: 13, fontWeight: 700,
                    }}><X size={14} /> Decline</button>

                    <div style={{ width: 1, height: 28, background: "rgba(255,255,255,0.1)", margin: "0 4px" }} />

                    {(["awaiting_payment","processing","shipped","completed"] as OrderStatus[]).map(s => (
                      <button key={s} onClick={() => updateOrder(order.id, { orderStatus: s })} style={{
                        padding: "10px 16px", borderRadius: 8, border: "none", cursor: "pointer",
                        background: order.orderStatus === s ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.04)",
                        color: order.orderStatus === s ? "#fff" : "rgba(255,255,255,0.35)",
                        fontSize: 12, fontWeight: 700,
                      }}>{statusLabels[s]}</button>
                    ))}
                  </div>

                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
