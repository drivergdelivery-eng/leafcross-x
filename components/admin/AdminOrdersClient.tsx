"use client";
import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Check, X, Pencil, Save, Plus, Trash2 } from "lucide-react";

type PaymentStatus = "pending" | "paid" | "declined";
type OrderStatus   = "awaiting_payment" | "processing" | "shipped" | "completed" | "cancelled";

type OrderItem = { id?: string; name: string; type: string; qty: number; unitPrice: number };
type MenuProduct = { slug: string; name: string; price: number };

const UNITS = ["3.5g", "7g", "14g", "28g"];

type Order = {
  id: string;
  orderNumber: string;
  retailer: string;
  email: string;
  phone?: string;
  address?: string;
  submitted: string;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  items: OrderItem[];
  notes: string;
};

const SHIPPING = 28.99;
const GST_RATE = 0.05;

function calcTotals(items: OrderItem[]) {
  const sub = items.reduce((s, i) => s + i.qty * i.unitPrice, 0);
  const gst = +(sub * GST_RATE).toFixed(2);
  return { sub: +sub.toFixed(2), gst, total: +(sub + gst + SHIPPING).toFixed(2) };
}

const paymentConfig: Record<PaymentStatus, { color: string; label: string }> = {
  pending:  { color: "#fbbf24", label: "Pending"  },
  paid:     { color: "#4ade80", label: "Paid"     },
  declined: { color: "#f87171", label: "Declined" },
};

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

function mapRow(row: Record<string, unknown>): Order {
  const retailer = row.retailers as Record<string, unknown> | null;
  const items = ((row.order_items as Record<string, unknown>[]) || []).map(i => ({
    id:        i.id as string,
    name:      (i.product_name as string) || "",
    type:      (i.sku as string) || "",
    qty:       (i.quantity as number) || 0,
    unitPrice: (i.unit_price as number) || 0,
  }));
  return {
    id:            row.id as string,
    orderNumber:   (row.order_number as string) || "",
    retailer:      (retailer?.business_name as string) || "Unknown",
    email:         (retailer?.email as string) || "",
    phone:         (retailer?.phone as string) || undefined,
    address:       (retailer?.shipping_address as string) || undefined,
    submitted:     ((row.submitted_at as string) || "").replace("T", " ").slice(0, 16),
    paymentStatus: (row.payment_status as PaymentStatus) || "pending",
    orderStatus:   (row.status as OrderStatus) || "awaiting_payment",
    items,
    notes:         (row.admin_notes as string) || "",
  };
}

type AddForm = { slug: string; unit: string; qty: number; price: number };

export default function AdminOrdersClient() {
  const [orders, setOrders]   = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [editing,  setEditing]  = useState<string | null>(null);
  const [editItems, setEditItems] = useState<Record<string, OrderItem[]>>({});
  const [saving, setSaving]   = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [menuProducts, setMenuProducts] = useState<MenuProduct[]>([]);
  const [addForms, setAddForms] = useState<Record<string, AddForm>>({});

  const loadOrders = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const res  = await fetch("/api/admin/orders");
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? `Server error ${res.status}`);
      if (json.data) setOrders(json.data.map(mapRow));
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadOrders(); }, []);

  const patchOrder = async (id: string, patch: Record<string, unknown>) => {
    await fetch("/api/admin/orders", {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ id, ...patch }),
    });
    setOrders(prev => prev.map(o => {
      if (o.id !== id) return o;
      const updates: Partial<Order> = {};
      if ("payment_status" in patch) updates.paymentStatus = patch.payment_status as PaymentStatus;
      if ("status"         in patch) updates.orderStatus   = patch.status         as OrderStatus;
      if ("admin_notes"    in patch) updates.notes         = patch.admin_notes    as string;
      return { ...o, ...updates };
    }));
  };

  const setPaymentStatus = (id: string, status: PaymentStatus) =>
    patchOrder(id, {
      payment_status: status,
      ...(status === "paid"     ? { status: "processing"       } : {}),
      ...(status === "declined" ? { status: "cancelled"        } : {}),
      ...(status === "pending"  ? { status: "awaiting_payment" } : {}),
    });

  const updateStatus = (id: string, status: OrderStatus) => patchOrder(id, { status });
  const updateNotes  = (id: string, notes: string) =>
    setOrders(prev => prev.map(o => o.id === id ? { ...o, notes } : o));
  const saveNotes    = (id: string, notes: string) => patchOrder(id, { admin_notes: notes });

  const deleteOrder = async (id: string) => {
    setDeleting(id);
    try {
      await fetch("/api/admin/orders", {
        method:  "DELETE",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ id }),
      });
      setOrders(prev => prev.filter(o => o.id !== id));
      setConfirmDelete(null);
    } finally {
      setDeleting(null);
    }
  };

  const startEditing = (order: Order) => {
    setEditing(order.id);
    setEditItems(prev => ({ ...prev, [order.id]: order.items.map(i => ({ ...i })) }));
    setAddForms(prev => ({ ...prev, [order.id]: { slug: "", unit: "3.5g", qty: 1, price: 0 } }));
    if (menuProducts.length === 0) {
      fetch("/api/menu/products")
        .then(r => r.json())
        .then(json => {
          if (Array.isArray(json.data)) {
            setMenuProducts(json.data.map((p: Record<string, unknown>) => ({
              slug:  p.slug as string,
              name:  p.name as string,
              price: p.price as number,
            })));
          }
        })
        .catch(() => {});
    }
  };

  const updateAddForm = (orderId: string, field: keyof AddForm, value: string | number) => {
    setAddForms(prev => {
      const form = { ...(prev[orderId] ?? { slug: "", unit: "3.5g", qty: 1, price: 0 }), [field]: value };
      // Auto-fill price when product changes
      if (field === "slug") {
        const product = menuProducts.find(p => p.slug === value);
        if (product) form.price = product.price;
      }
      return { ...prev, [orderId]: form };
    });
  };

  const addProduct = (orderId: string) => {
    const form = addForms[orderId];
    if (!form?.slug) return;
    const product = menuProducts.find(p => p.slug === form.slug);
    if (!product) return;
    const newItem: OrderItem = {
      name:      `${product.name} — ${form.unit}`,
      type:      product.slug,
      qty:       Math.max(1, form.qty),
      unitPrice: form.price,
    };
    setEditItems(prev => ({
      ...prev,
      [orderId]: [...(prev[orderId] ?? []), newItem],
    }));
    setAddForms(prev => ({ ...prev, [orderId]: { slug: "", unit: "3.5g", qty: 1, price: 0 } }));
  };

  const updateItem = (orderId: string, idx: number, field: "qty" | "unitPrice", value: number) =>
    setEditItems(prev => ({
      ...prev,
      [orderId]: (prev[orderId] || []).map((it, i) =>
        i === idx ? { ...it, [field]: value } : it
      ),
    }));

  const removeItem = (orderId: string, idx: number) =>
    setEditItems(prev => ({
      ...prev,
      [orderId]: (prev[orderId] || []).filter((_, i) => i !== idx),
    }));

  const saveItems = async (orderId: string) => {
    const items = editItems[orderId] || [];
    setSaving(orderId);
    await fetch("/api/admin/orders", {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ id: orderId, items }),
    });
    setOrders(prev => prev.map(o =>
      o.id === orderId ? { ...o, items } : o
    ));
    setEditing(null);
    setSaving(null);
  };

  const activeItems = (order: Order) =>
    editing === order.id ? (editItems[order.id] || order.items) : order.items;

  if (loading) return <p style={{ textAlign: "center", color: "rgba(255,255,255,0.4)", padding: "40px 0" }}>Loading orders…</p>;
  if (loadError) return (
    <div style={{ textAlign: "center", padding: "60px 0" }}>
      <p style={{ color: "#f87171", fontSize: 15, fontWeight: 700, marginBottom: 8 }}>Failed to load orders</p>
      <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginBottom: 20 }}>{loadError}</p>
      <button onClick={loadOrders} style={{ padding: "8px 20px", borderRadius: 8, background: "#00f6ff", border: "none", color: "#000", fontWeight: 700, cursor: "pointer" }}>Try Again</button>
    </div>
  );

  if (orders.length === 0) return (
    <div style={{ textAlign: "center", padding: "60px 0", color: "rgba(255,255,255,0.35)" }}>
      <p style={{ fontSize: 16 }}>No orders yet.</p>
      <p style={{ fontSize: 13 }}>Orders placed by retailers will appear here.</p>
    </div>
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <button onClick={loadOrders} style={{ padding: "6px 14px", borderRadius: 999, cursor: "pointer", fontSize: 12, fontWeight: 700, background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.15)" }}>
          ↻ Refresh
        </button>
      </div>

      {/* Header row */}
      <div style={{
        display: "grid", gridTemplateColumns: "130px 1fr 160px 110px 170px 150px 24px 32px",
        gap: 12, padding: "0 16px", marginBottom: 12,
        color: "rgba(255,255,255,0.45)", fontSize: 11, fontWeight: 700,
        textTransform: "uppercase", letterSpacing: "0.08em",
      }}>
        <span>Order #</span><span>Retailer</span><span>Submitted</span>
        <span>Total</span><span>Payment</span><span>Status</span><span /><span />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {orders.map(order => {
          const isExpanded = expanded === order.id;
          const isEditing  = editing  === order.id;
          const items      = activeItems(order);
          const { sub, gst, total } = calcTotals(items);
          const pc = paymentConfig[order.paymentStatus] ?? paymentConfig.pending;

          return (
            <div key={order.id} style={{
              background: "#111", borderRadius: 12, overflow: "hidden",
              border: `1px solid ${order.paymentStatus === "pending" ? "rgba(251,191,36,0.25)" : "rgba(255,255,255,0.07)"}`,
            }}>
              {/* Summary row */}
              <div onClick={() => setExpanded(isExpanded ? null : order.id)} style={{
                display: "grid", gridTemplateColumns: "130px 1fr 160px 110px 170px 150px 24px 32px",
                gap: 12, alignItems: "center", padding: "14px 16px", cursor: "pointer",
              }}>
                <span style={{ color: "#00f6ff", fontSize: 13, fontWeight: 700, fontFamily: "monospace" }}>
                  {order.orderNumber}
                </span>
                <div>
                  <p style={{ margin: 0, color: "#fff", fontSize: 13, fontWeight: 700 }}>{order.retailer}</p>
                  <p style={{ margin: "2px 0 0", color: "rgba(255,255,255,0.35)", fontSize: 11 }}>{order.email}</p>
                </div>
                <span style={{ color: "rgba(255,255,255,0.45)", fontSize: 12 }}>{order.submitted}</span>
                <span style={{ color: "#fff", fontSize: 13, fontWeight: 700 }}>${total.toFixed(2)}</span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: pc.color, fontSize: 12, fontWeight: 700 }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: pc.color, display: "inline-block" }} />
                  {pc.label}
                </span>
                <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>{statusLabels[order.orderStatus] ?? order.orderStatus}</span>
                {isExpanded ? <ChevronUp size={15} color="rgba(255,255,255,0.35)" /> : <ChevronDown size={15} color="rgba(255,255,255,0.35)" />}
                {/* Delete button */}
                <button
                  onClick={e => { e.stopPropagation(); setConfirmDelete(order.id); }}
                  title="Delete order"
                  style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(248,113,113,0.5)", padding: 4, display: "flex", alignItems: "center", borderRadius: 6, transition: "color 0.15s" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#f87171")}
                  onMouseLeave={e => (e.currentTarget.style.color = "rgba(248,113,113,0.5)")}
                >
                  <Trash2 size={14} />
                </button>
              </div>

              {/* Delete confirmation banner */}
              {confirmDelete === order.id && (
                <div style={{ background: "rgba(248,113,113,0.1)", borderTop: "1px solid rgba(248,113,113,0.25)", padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ color: "#f87171", fontSize: 13, fontWeight: 600 }}>
                    Delete order {order.orderNumber}? This cannot be undone.
                  </span>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={() => deleteOrder(order.id)}
                      disabled={deleting === order.id}
                      style={{ padding: "6px 16px", borderRadius: 6, border: "none", cursor: "pointer", background: "#f87171", color: "#fff", fontSize: 12, fontWeight: 700 }}
                    >
                      {deleting === order.id ? "Deleting…" : "Yes, Delete"}
                    </button>
                    <button
                      onClick={() => setConfirmDelete(null)}
                      style={{ padding: "6px 14px", borderRadius: 6, border: "1px solid rgba(255,255,255,0.15)", cursor: "pointer", background: "none", color: "rgba(255,255,255,0.5)", fontSize: 12, fontWeight: 700 }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Expanded detail */}
              {isExpanded && (
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "20px", display: "flex", flexDirection: "column", gap: 20 }}>

                  {/* Items section */}
                  <div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                      <p style={{ margin: 0, color: "rgba(255,255,255,0.35)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                        Order Items
                        {isEditing && <span style={{ color: "#fbbf24", marginLeft: 8 }}>— Editing</span>}
                      </p>
                      <div style={{ display: "flex", gap: 8 }}>
                        {isEditing ? (
                          <>
                            <button
                              onClick={() => saveItems(order.id)}
                              disabled={saving === order.id}
                              style={{ display: "flex", alignItems: "center", gap: 5, background: saving === order.id ? "rgba(255,255,255,0.05)" : "rgba(74,222,128,0.12)", border: "1px solid rgba(74,222,128,0.3)", borderRadius: 6, color: "#4ade80", fontSize: 11, fontWeight: 700, padding: "5px 12px", cursor: "pointer" }}>
                              <Save size={11} /> {saving === order.id ? "Saving…" : "Save Changes"}
                            </button>
                            <button
                              onClick={() => setEditing(null)}
                              style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, color: "rgba(255,255,255,0.45)", fontSize: 11, fontWeight: 700, padding: "5px 12px", cursor: "pointer" }}>
                              <X size={11} /> Discard
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => startEditing(order)}
                            style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, color: "rgba(255,255,255,0.45)", fontSize: 11, fontWeight: 700, padding: "5px 12px", cursor: "pointer" }}>
                            <Pencil size={11} /> Edit Order
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Item header */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 72px 100px 100px 28px", gap: 10, padding: "0 10px", marginBottom: 6, color: "rgba(255,255,255,0.28)", fontSize: 11, fontWeight: 700, textTransform: "uppercase" }}>
                      <span>Product</span><span>Qty</span><span>Unit Price</span><span>Line Total</span><span />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {items.map((item, idx) => (
                        <div key={idx} style={{ display: "grid", gridTemplateColumns: "1fr 72px 100px 100px 28px", gap: 10, alignItems: "center", background: "rgba(255,255,255,0.03)", borderRadius: 8, padding: "10px" }}>
                          <div>
                            <span style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>{item.name}</span>
                            {item.type && <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, marginLeft: 8 }}>{item.type}</span>}
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
                          <span style={{ color: "#00f6ff", fontSize: 13, fontWeight: 700 }}>${(item.qty * item.unitPrice).toFixed(2)}</span>
                          {isEditing ? (
                            <button onClick={() => removeItem(order.id, idx)} style={{ background: "none", border: "none", cursor: "pointer", color: "#f87171", padding: 2, display: "flex" }}><X size={13} /></button>
                          ) : <span />}
                        </div>
                      ))}
                    </div>

                    {/* Add Product — only in edit mode */}
                    {isEditing && (() => {
                      const form = addForms[order.id] ?? { slug: "", unit: "3.5g", qty: 1, price: 0 };
                      const sel: React.CSSProperties = { background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 6, color: "#fff", fontSize: 12, padding: "6px 8px", outline: "none", appearance: "none" as React.CSSProperties["appearance"] };
                      return (
                        <div style={{ marginTop: 10, padding: "12px", background: "rgba(0,246,255,0.04)", border: "1px dashed rgba(0,246,255,0.2)", borderRadius: 8 }}>
                          <p style={{ margin: "0 0 8px", color: "#00f6ff", fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em" }}>Add Product to Order</p>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 90px 60px 90px auto", gap: 8, alignItems: "center" }}>
                            <select value={form.slug} onChange={e => updateAddForm(order.id, "slug", e.target.value)} style={sel}>
                              <option value="">— Select product —</option>
                              {menuProducts.map(p => <option key={p.slug} value={p.slug}>{p.name}</option>)}
                            </select>
                            <select value={form.unit} onChange={e => updateAddForm(order.id, "unit", e.target.value)} style={sel}>
                              {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                            </select>
                            <input type="number" min={1} value={form.qty} onChange={e => updateAddForm(order.id, "qty", parseInt(e.target.value) || 1)}
                              placeholder="Qty" style={{ ...editInput, fontSize: 12, padding: "6px 8px" }} />
                            <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                              <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 12 }}>$</span>
                              <input type="number" step="0.01" min={0} value={form.price || ""} onChange={e => updateAddForm(order.id, "price", parseFloat(e.target.value) || 0)}
                                placeholder="Price" style={{ ...editInput, fontSize: 12, padding: "6px 8px", width: 64 }} />
                            </div>
                            <button onClick={() => addProduct(order.id)} disabled={!form.slug}
                              style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 14px", borderRadius: 6, border: "none", cursor: form.slug ? "pointer" : "not-allowed", background: form.slug ? "#00f6ff" : "rgba(255,255,255,0.06)", color: form.slug ? "#000" : "rgba(255,255,255,0.2)", fontSize: 12, fontWeight: 800, whiteSpace: "nowrap" }}>
                              <Plus size={12} /> Add
                            </button>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Totals */}
                    <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                      {[["Subtotal", `$${sub.toFixed(2)}`], ["GST (5%)", `$${gst.toFixed(2)}`], ["Flat Shipping", `$${SHIPPING.toFixed(2)}`]].map(([l, v]) => (
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

                  {/* Retailer details */}
                  {(order.phone || order.address) && (
                    <div style={{ display: "flex", gap: 32, padding: "12px 0", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                      {order.phone   && <div><p style={{ margin: "0 0 2px", color: "rgba(255,255,255,0.3)", fontSize: 10, textTransform: "uppercase" }}>Phone</p><p style={{ margin: 0, color: "#fff", fontSize: 13 }}>{order.phone}</p></div>}
                      {order.address && <div><p style={{ margin: "0 0 2px", color: "rgba(255,255,255,0.3)", fontSize: 10, textTransform: "uppercase" }}>Ship To</p><p style={{ margin: 0, color: "#fff", fontSize: 13 }}>{order.address}</p></div>}
                    </div>
                  )}

                  {/* Admin Notes */}
                  <div>
                    <p style={{ margin: "0 0 8px", color: "rgba(255,255,255,0.3)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em" }}>Admin Notes</p>
                    <textarea
                      value={order.notes}
                      onChange={e => updateNotes(order.id, e.target.value)}
                      onBlur={e => saveNotes(order.id, e.target.value)}
                      placeholder="E-transfer received, tracking number, special instructions..."
                      rows={2}
                      style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#fff", fontSize: 14, padding: "10px 12px", outline: "none", resize: "vertical", boxSizing: "border-box" }}
                    />
                  </div>

                  {/* Payment status + order status controls */}
                  <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 16 }}>
                    <p style={{ margin: "0 0 10px", color: "rgba(255,255,255,0.3)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em" }}>Payment Status</p>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
                      {(["pending", "paid", "declined"] as PaymentStatus[]).map(s => {
                        const cfg = paymentConfig[s];
                        const isActive = order.paymentStatus === s;
                        return (
                          <button key={s} onClick={() => setPaymentStatus(order.id, s)} style={{
                            display: "flex", alignItems: "center", gap: 6,
                            padding: "10px 20px", borderRadius: 8, border: "none", cursor: "pointer",
                            background: isActive ? `${cfg.color}22` : "rgba(255,255,255,0.04)",
                            color: isActive ? cfg.color : "rgba(255,255,255,0.35)",
                            fontSize: 13, fontWeight: 700,
                            outline: isActive ? `1px solid ${cfg.color}66` : "none",
                            transition: "all 0.15s",
                          }}>
                            {isActive && <Check size={13} strokeWidth={3} />}
                            {s === "pending" ? "Awaiting Payment" : s.charAt(0).toUpperCase() + s.slice(1)}
                          </button>
                        );
                      })}
                    </div>

                    <p style={{ margin: "0 0 10px", color: "rgba(255,255,255,0.3)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em" }}>Order Status</p>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {(["awaiting_payment","processing","shipped","completed","cancelled"] as OrderStatus[]).map(s => (
                        <button key={s} onClick={() => updateStatus(order.id, s)} style={{
                          padding: "10px 16px", borderRadius: 8, border: "none", cursor: "pointer",
                          background: order.orderStatus === s ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.04)",
                          color: order.orderStatus === s ? "#fff" : "rgba(255,255,255,0.35)",
                          fontSize: 12, fontWeight: 700,
                          outline: order.orderStatus === s ? "1px solid rgba(255,255,255,0.2)" : "none",
                        }}>
                          {statusLabels[s]}
                        </button>
                      ))}
                    </div>
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
