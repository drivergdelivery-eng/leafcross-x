"use client";
import { useState, useEffect, useRef } from "react";
import { Check, X, ChevronDown, Printer, FileText, RefreshCw } from "lucide-react";

type PaymentStatus = "pending" | "paid" | "declined";
type OrderItem = { name: string; type: string; qty: number; unitPrice: number };

type InvoiceData = {
  id: string;
  invoiceNumber: string;
  orderId: string;
  orderNumber: string;
  retailer: string;
  email: string;
  issuedDate: string;
  items: OrderItem[];
  sub: number;
  gst: number;
  shipping: number;
  total: number;
  status: PaymentStatus;
  paidDate?: string;
};

const SHIPPING = 28.99;
const GST_RATE = 0.05;

function calcTotals(items: OrderItem[]) {
  const sub = items.reduce((s, i) => s + i.qty * i.unitPrice, 0);
  const gst = +(sub * GST_RATE).toFixed(2);
  return { sub: +sub.toFixed(2), gst, total: +(sub + gst + SHIPPING).toFixed(2) };
}

function mapOrderToInvoice(row: Record<string, unknown>, seq: number): InvoiceData {
  const retailer = row.retailers as Record<string, unknown> | null;
  const rawItems = (row.order_items as Record<string, unknown>[]) || [];
  const items: OrderItem[] = rawItems.map(i => ({
    name:      (i.product_name as string) || "",
    type:      (i.sku as string) || "",
    qty:       (i.quantity as number) || 0,
    unitPrice: (i.unit_price as number) || 0,
  }));
  const { sub, gst, total } = calcTotals(items);
  const paymentStatus = (row.payment_status as PaymentStatus) || "pending";
  const submittedAt = ((row.submitted_at as string) || "").replace("T", " ").slice(0, 10);

  return {
    id:            `inv-${row.id as string}`,
    invoiceNumber: `INV-${new Date(row.submitted_at as string || Date.now()).getFullYear()}-${String(seq).padStart(6, "0")}`,
    orderId:       row.id as string,
    orderNumber:   (row.order_number as string) || "",
    retailer:      (retailer?.business_name as string) || "Unknown",
    email:         (retailer?.email as string) || "",
    issuedDate:    submittedAt,
    items,
    sub, gst, shipping: SHIPPING, total,
    status:    paymentStatus,
    paidDate:  paymentStatus === "paid" ? submittedAt : undefined,
  };
}

const statusColors = { pending: "#fbbf24", paid: "#4ade80", declined: "#f87171" };
const statusLabels = { pending: "Pending Payment", paid: "Paid", declined: "Declined" };

// ── Invoice print view ────────────────────────────────────────────────────────
function InvoicePrint({ inv }: { inv: InvoiceData }) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const content = printRef.current?.innerHTML ?? "";
    const win = window.open("", "_blank", "width=900,height=700");
    if (!win) return;
    win.document.write(`
      <html><head><title>${inv.invoiceNumber}</title>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #111; background: #fff; padding: 48px; }
        .inv-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 48px; }
        .inv-logo { font-size: 22px; font-weight: 900; letter-spacing: -0.02em; text-transform: uppercase; }
        .inv-meta { text-align: right; }
        .inv-meta h1 { font-size: 28px; font-weight: 900; letter-spacing: 0.04em; text-transform: uppercase; color: #111; }
        .inv-meta p { font-size: 13px; color: #666; margin-top: 4px; }
        .inv-parties { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 40px; }
        .inv-parties h3 { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #999; margin-bottom: 8px; }
        .inv-parties p { font-size: 14px; line-height: 1.6; color: #333; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
        thead tr { border-bottom: 2px solid #111; }
        th { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; padding: 10px 12px; text-align: left; color: #999; }
        tbody tr { border-bottom: 1px solid #eee; }
        td { padding: 12px 12px; font-size: 14px; color: #333; }
        td.right { text-align: right; }
        .totals { margin-left: auto; width: 280px; }
        .totals-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 14px; color: #555; }
        .totals-row.total { border-top: 2px solid #111; margin-top: 8px; padding-top: 12px; font-size: 18px; font-weight: 900; color: #111; }
        .status-badge { display: inline-block; padding: 6px 18px; border-radius: 999px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; margin-top: 32px; }
        .paid { background: #dcfce7; color: #16a34a; }
        .pending { background: #fef3c7; color: #d97706; }
        .declined { background: #fee2e2; color: #dc2626; }
        .footer { margin-top: 48px; padding-top: 24px; border-top: 1px solid #eee; font-size: 12px; color: #999; text-align: center; }
      </style>
      </head><body>${content}</body></html>
    `);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); }, 400);
  };

  return (
    <div>
      <button onClick={handlePrint} style={{
        display: "flex", alignItems: "center", gap: 6, marginBottom: 20,
        padding: "9px 20px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.15)",
        background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.7)",
        fontSize: 13, fontWeight: 700, cursor: "pointer",
      }}>
        <Printer size={14} /> Print / Download PDF
      </button>

      <div ref={printRef} style={{ background: "#fff", borderRadius: 12, padding: 48, color: "#111" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 48 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 900, textTransform: "uppercase" as const, letterSpacing: "-0.02em" }}>
              Leaf Cross Biomedical
            </div>
            <p style={{ fontSize: 13, color: "#666", marginTop: 6, lineHeight: 1.5 }}>
              Nelson, BC, Canada<br/>
              info@leafcross.com<br/>
              Health Canada Licensed Cannabis Processor
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <h1 style={{ fontSize: 26, fontWeight: 900, textTransform: "uppercase" as const, letterSpacing: "0.06em", color: "#111", margin: 0 }}>Invoice</h1>
            <p style={{ fontSize: 14, color: "#555", marginTop: 6 }}>{inv.invoiceNumber}</p>
            <p style={{ fontSize: 13, color: "#888", marginTop: 4 }}>Issued: {inv.issuedDate}</p>
            <p style={{ fontSize: 13, color: "#888" }}>Order: {inv.orderNumber}</p>
          </div>
        </div>

        {/* Bill to */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, marginBottom: 40 }}>
          <div>
            <h3 style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.1em", color: "#999", marginBottom: 8 }}>Bill To</h3>
            <p style={{ fontSize: 15, fontWeight: 700, color: "#111" }}>{inv.retailer}</p>
            <p style={{ fontSize: 13, color: "#555", marginTop: 4 }}>{inv.email}</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <h3 style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.1em", color: "#999", marginBottom: 8 }}>Payment Status</h3>
            <span style={{
              display: "inline-block", padding: "5px 16px", borderRadius: 999,
              fontSize: 12, fontWeight: 800, textTransform: "uppercase" as const, letterSpacing: "0.08em",
              background: inv.status === "paid" ? "#dcfce7" : inv.status === "declined" ? "#fee2e2" : "#fef3c7",
              color:      inv.status === "paid" ? "#16a34a" : inv.status === "declined" ? "#dc2626" : "#d97706",
            }}>{statusLabels[inv.status]}</span>
            {inv.paidDate && <p style={{ fontSize: 12, color: "#888", marginTop: 6 }}>Paid on {inv.paidDate}</p>}
          </div>
        </div>

        {/* Items table */}
        <table style={{ width: "100%", borderCollapse: "collapse" as const, marginBottom: 24 }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #111" }}>
              {["Product", "SKU", "Qty", "Unit Price", "Line Total"].map(h => (
                <th key={h} style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.1em", padding: "10px 12px", textAlign: h === "Qty" || h === "Unit Price" || h === "Line Total" ? "right" as const : "left" as const, color: "#999" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {inv.items.map((item, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "12px", fontSize: 14, color: "#111", fontWeight: 600 }}>{item.name}</td>
                <td style={{ padding: "12px", fontSize: 13, color: "#888" }}>{item.type}</td>
                <td style={{ padding: "12px", fontSize: 14, color: "#333", textAlign: "right" }}>{item.qty}</td>
                <td style={{ padding: "12px", fontSize: 14, color: "#333", textAlign: "right" }}>${item.unitPrice.toFixed(2)}</td>
                <td style={{ padding: "12px", fontSize: 14, color: "#111", fontWeight: 700, textAlign: "right" }}>${(item.qty * item.unitPrice).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div style={{ marginLeft: "auto", width: 280 }}>
          {[
            ["Subtotal",      `$${inv.sub.toFixed(2)}`],
            ["GST (5%)",      `$${inv.gst.toFixed(2)}`],
            ["Flat Shipping", `$${inv.shipping.toFixed(2)}`],
          ].map(([l, v]) => (
            <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 14, color: "#555" }}>
              <span>{l}</span><span>{v}</span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", borderTop: "2px solid #111", marginTop: 8, paddingTop: 12, fontSize: 18, fontWeight: 900, color: "#111" }}>
            <span>Total</span><span>${inv.total.toFixed(2)}</span>
          </div>
        </div>

        {/* Payment instructions */}
        <div style={{ marginTop: 40, padding: "22px 24px", background: "#f9f9f7", borderRadius: 10, border: "1px solid #eee" }}>
          <p style={{ margin: "0 0 10px", fontSize: 11, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.1em", color: "#999" }}>Payment Instructions</p>
          <p style={{ margin: "0 0 16px", fontSize: 13, color: "#555", lineHeight: 1.65 }}>
            Payment must be received within <strong>48 hours</strong> of order submission to guarantee same-day shipment.
            Reference order number <strong>{inv.orderNumber}</strong> in all payment communications.
          </p>

          {/* E-Transfer */}
          <div style={{ marginBottom: 12, padding: "12px 16px", background: "#fff", borderRadius: 8, border: "1px solid #ddd", borderLeft: "4px solid #00b8c8" }}>
            <p style={{ margin: "0 0 4px", fontSize: 11, fontWeight: 700, color: "#00909a", textTransform: "uppercase" as const, letterSpacing: "0.08em" }}>Option 1 — Interac E-Transfer</p>
            <p style={{ margin: 0, fontSize: 13, color: "#444" }}>Send to <strong>payment@leafcross.com</strong></p>
          </div>

          {/* Wire Transfer */}
          <div style={{ padding: "14px 16px", background: "#fff", borderRadius: 8, border: "1px solid #ddd" }}>
            <p style={{ margin: "0 0 10px", fontSize: 11, fontWeight: 700, color: "#666", textTransform: "uppercase" as const, letterSpacing: "0.08em" }}>Option 2 — Wire / EFT Transfer</p>
            <table style={{ width: "100%", borderCollapse: "collapse" as const, fontSize: 13 }}>
              <tbody>
                {[
                  ["Bank",              "CIBC — Canadian Imperial Bank of Commerce"],
                  ["Branch Address",    "6204 Fraser St, Vancouver, BC, Canada V5W 3A1"],
                  ["SWIFT Code",        "CIBCCATT"],
                  ["Branch / Transit #","00810"],
                  ["Institution #",     "010"],
                  ["Account #",         "9249311"],
                  ["CC Code",           "CC001000810"],
                ].map(([label, val]) => (
                  <tr key={label} style={{ borderBottom: "1px solid #f0f0f0" }}>
                    <td style={{ padding: "5px 12px 5px 0", color: "#999", whiteSpace: "nowrap" as const, width: 160, verticalAlign: "top" }}>{label}</td>
                    <td style={{ padding: "5px 0", color: "#333", fontWeight: 600 }}>{val}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: 40, paddingTop: 20, borderTop: "1px solid #eee", fontSize: 12, color: "#aaa", textAlign: "center" }}>
          Leaf Cross Biomedical · Nelson, BC · info@leafcross.com · Health Canada Licensed Cannabis Processor
        </div>
      </div>
    </div>
  );
}

// ── Main invoices list ────────────────────────────────────────────────────────
export default function InvoicesClient() {
  const [invoices, setInvoices]     = useState<InvoiceData[]>([]);
  const [loading, setLoading]       = useState(true);
  const [storeFilter, setStoreFilter]   = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [openInv, setOpenInv]       = useState<string | null>(null);

  const loadInvoices = async () => {
    setLoading(true);
    const res  = await fetch("/api/admin/orders");
    const json = await res.json();
    if (json.data) {
      const mapped = (json.data as Record<string, unknown>[])
        .map((row, i) => mapOrderToInvoice(row, i + 1));
      setInvoices(mapped);
    }
    setLoading(false);
  };

  useEffect(() => { loadInvoices(); }, []);

  const patchPayment = async (orderId: string, status: PaymentStatus) => {
    await fetch("/api/admin/orders", {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({
        id:             orderId,
        payment_status: status,
        ...(status === "paid"     ? { status: "processing"       } : {}),
        ...(status === "declined" ? { status: "cancelled"        } : {}),
        ...(status === "pending"  ? { status: "awaiting_payment" } : {}),
      }),
    });
    setInvoices(prev => prev.map(inv => {
      if (inv.orderId !== orderId) return inv;
      const today = new Date().toISOString().slice(0, 10);
      return { ...inv, status, paidDate: status === "paid" ? today : undefined };
    }));
  };

  const stores = Array.from(new Set(invoices.map(i => i.retailer))).sort();

  const visible = invoices.filter(inv => {
    if (storeFilter !== "all" && inv.retailer !== storeFilter) return false;
    if (statusFilter !== "all" && inv.status !== statusFilter) return false;
    return true;
  });

  const grouped: Record<string, InvoiceData[]> = {};
  for (const inv of visible) {
    if (!grouped[inv.retailer]) grouped[inv.retailer] = [];
    grouped[inv.retailer].push(inv);
  }

  const selStyle = (active: boolean): React.CSSProperties => ({
    padding: "6px 14px", borderRadius: 7, border: `1px solid ${active ? "rgba(0,246,255,0.4)" : "rgba(255,255,255,0.15)"}`, cursor: "pointer",
    background: active ? "rgba(0,246,255,0.15)" : "rgba(255,255,255,0.06)",
    color: active ? "#00f6ff" : "rgba(255,255,255,0.6)",
    fontSize: 12, fontWeight: 700, textTransform: "uppercase",
  });

  if (loading) return <p style={{ textAlign: "center", color: "rgba(255,255,255,0.4)", padding: "40px 0" }}>Loading invoices…</p>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>

      {/* Filters */}
      <div style={{ display: "flex", gap: 24, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>Store</span>
          <div style={{ position: "relative" }}>
            <select value={storeFilter} onChange={e => setStoreFilter(e.target.value)} style={{
              background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: 8, color: "#fff", fontSize: 13, fontWeight: 700,
              padding: "8px 32px 8px 12px", outline: "none", cursor: "pointer", appearance: "none",
            }}>
              <option value="all">All Stores</option>
              {stores.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <ChevronDown size={13} color="rgba(255,255,255,0.4)" style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
          </div>
        </div>

        <div style={{ display: "flex", gap: 6 }}>
          {[["all","All"],["pending","Pending"],["paid","Paid"],["declined","Declined"]].map(([v, l]) => (
            <button key={v} onClick={() => setStatusFilter(v)} style={selStyle(statusFilter === v)}>{l}</button>
          ))}
        </div>

        <button onClick={loadInvoices} style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.6)", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
          <RefreshCw size={12} /> Refresh
        </button>

        <div style={{ marginLeft: "auto", display: "flex", gap: 20 }}>
          {[
            { label: "Total",    val: invoices.length,                                   color: "#fff" },
            { label: "Pending",  val: invoices.filter(i=>i.status==="pending").length,    color: "#d97706" },
            { label: "Paid",     val: invoices.filter(i=>i.status==="paid").length,       color: "#16a34a" },
            { label: "Declined", val: invoices.filter(i=>i.status==="declined").length,   color: "#dc2626" },
          ].map(({ label, val, color }) => (
            <div key={label} style={{ textAlign: "right" }}>
              <p style={{ margin: 0, color, fontSize: 20, fontWeight: 800 }}>{val}</p>
              <p style={{ margin: 0, color: "rgba(255,255,255,0.4)", fontSize: 11, fontWeight: 700, textTransform: "uppercase" }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Grouped by store */}
      {Object.keys(grouped).length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "rgba(255,255,255,0.35)", fontSize: 14 }}>
          No invoices match the selected filters.
        </div>
      ) : Object.entries(grouped).map(([retailer, invList]) => {
        const storeTotal   = invList.filter(i=>i.status==="paid").reduce((s,i)=>s+i.total, 0);
        const storePending = invList.filter(i=>i.status==="pending").reduce((s,i)=>s+i.total, 0);

        return (
          <div key={retailer}>
            {/* Store header */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "14px 20px", background: "#1a1a1a", borderRadius: "12px 12px 0 0",
              border: "1px solid rgba(255,255,255,0.08)", borderBottom: "none",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(0,246,255,0.08)", border: "1px solid rgba(0,246,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <FileText size={16} color="#00f6ff" />
                </div>
                <div>
                  <p style={{ margin: 0, color: "#fff", fontSize: 15, fontWeight: 700 }}>{retailer}</p>
                  <p style={{ margin: 0, color: "rgba(255,255,255,0.35)", fontSize: 12 }}>{invList.length} invoice{invList.length !== 1 ? "s" : ""}</p>
                </div>
              </div>
              <div style={{ display: "flex", gap: 24 }}>
                {storePending > 0 && (
                  <div style={{ textAlign: "right" }}>
                    <p style={{ margin: 0, color: "#fbbf24", fontSize: 16, fontWeight: 800 }}>${storePending.toFixed(2)}</p>
                    <p style={{ margin: 0, color: "rgba(255,255,255,0.35)", fontSize: 11, textTransform: "uppercase" }}>Pending</p>
                  </div>
                )}
                <div style={{ textAlign: "right" }}>
                  <p style={{ margin: 0, color: "#4ade80", fontSize: 16, fontWeight: 800 }}>${storeTotal.toFixed(2)}</p>
                  <p style={{ margin: 0, color: "rgba(255,255,255,0.35)", fontSize: 11, textTransform: "uppercase" }}>Paid</p>
                </div>
              </div>
            </div>

            {/* Invoice rows */}
            <div style={{ border: "1px solid rgba(255,255,255,0.08)", borderRadius: "0 0 12px 12px", overflow: "hidden" }}>
              {invList.map((inv, idx) => {
                const isOpen = openInv === inv.id;
                return (
                  <div key={inv.id} style={{ borderTop: idx === 0 ? "none" : "1px solid rgba(255,255,255,0.05)" }}>
                    <div onClick={() => setOpenInv(isOpen ? null : inv.id)} style={{
                      display: "grid", gridTemplateColumns: "160px 1fr 120px 130px 140px 110px",
                      gap: 12, alignItems: "center", padding: "14px 20px", cursor: "pointer",
                      background: isOpen ? "rgba(0,246,255,0.03)" : "#111",
                      transition: "background 0.15s",
                    }}>
                      <span style={{ color: "#00f6ff", fontSize: 13, fontWeight: 700, fontFamily: "monospace" }}>
                        {inv.invoiceNumber}
                      </span>
                      <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>Order {inv.orderNumber}</span>
                      <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>{inv.issuedDate}</span>
                      <span style={{ color: "#fff", fontSize: 14, fontWeight: 700 }}>${inv.total.toFixed(2)}</span>
                      <span style={{
                        display: "inline-flex", alignItems: "center", gap: 5,
                        color: statusColors[inv.status], fontSize: 11, fontWeight: 800,
                        textTransform: "uppercase", letterSpacing: "0.06em",
                      }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: statusColors[inv.status] }}/>
                        {statusLabels[inv.status]}
                      </span>

                      {/* Quick payment status buttons — show all 3, hide current */}
                      <div style={{ display: "flex", gap: 5 }} onClick={e => e.stopPropagation()}>
                        {inv.status !== "paid" && (
                          <button onClick={() => patchPayment(inv.orderId, "paid")} style={{
                            display: "flex", alignItems: "center", gap: 4, padding: "5px 10px", borderRadius: 6,
                            border: "none", cursor: "pointer", background: "rgba(74,222,128,0.1)", color: "#4ade80",
                            fontSize: 11, fontWeight: 700,
                          }}><Check size={11}/> Paid</button>
                        )}
                        {inv.status !== "pending" && (
                          <button onClick={() => patchPayment(inv.orderId, "pending")} style={{
                            display: "flex", alignItems: "center", gap: 4, padding: "5px 10px", borderRadius: 6,
                            border: "none", cursor: "pointer", background: "rgba(251,191,36,0.1)", color: "#fbbf24",
                            fontSize: 11, fontWeight: 700,
                          }}>Pending</button>
                        )}
                        {inv.status !== "declined" && (
                          <button onClick={() => patchPayment(inv.orderId, "declined")} style={{
                            display: "flex", alignItems: "center", gap: 4, padding: "5px 10px", borderRadius: 6,
                            border: "none", cursor: "pointer", background: "rgba(248,113,113,0.08)", color: "#f87171",
                            fontSize: 11, fontWeight: 700,
                          }}><X size={11}/> Decline</button>
                        )}
                      </div>
                    </div>

                    {isOpen && (
                      <div style={{ padding: "24px 24px 28px", background: "#0d0d0d", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                        <InvoicePrint inv={inv} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
