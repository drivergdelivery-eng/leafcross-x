export const emailSubjects = {
  applicationSubmitted: "Leaf Cross retailer application received",
  applicationApproved:  "Leaf Cross retailer access approved",
  applicationRejected:  "Leaf Cross retailer application update",
  licenseExpiring:      "Leaf Cross business license expiry reminder",
  orderSubmitted:       "Leaf Cross order submitted",
  orderStatusUpdated:   "Leaf Cross order status updated",
};

export const licenseReminderDays = [30, 14, 7, 0];

// ── Shared layout ─────────────────────────────────────────────────────────────
function layout(body: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Helvetica Neue',Arial,sans-serif;background:#f5f5f3;color:#1a1a1a}
  .wrap{max-width:600px;margin:40px auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e5e5e0}
  .top{background:#0a0a0a;padding:28px 36px;display:flex;align-items:center;gap:14px}
  .logo{color:#fff;font-size:18px;font-weight:900;letter-spacing:-0.02em;text-transform:uppercase}
  .logo span{color:#00d4b8}
  .body{padding:36px}
  .badge{display:inline-block;padding:6px 16px;border-radius:999px;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:24px}
  .badge.processing{background:#dbeafe;color:#1d4ed8}
  .badge.shipped{background:#fef3c7;color:#d97706}
  .badge.completed{background:#dcfce7;color:#16a34a}
  .badge.cancelled{background:#fee2e2;color:#dc2626}
  h1{font-size:22px;font-weight:800;color:#0a0a0a;margin-bottom:8px}
  p{font-size:15px;line-height:1.6;color:#444;margin-bottom:16px}
  .order-box{background:#f9f9f7;border:1px solid #e5e5e0;border-radius:10px;padding:20px 24px;margin:24px 0}
  .order-box h3{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#999;margin-bottom:14px}
  .order-row{display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid #eee;font-size:14px}
  .order-row:last-child{border-bottom:none}
  .order-row .label{color:#666}
  .order-row .val{color:#0a0a0a;font-weight:700}
  table.items{width:100%;border-collapse:collapse;margin:24px 0}
  table.items th{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#999;padding:8px 10px;text-align:left;border-bottom:2px solid #eee}
  table.items td{padding:10px 10px;font-size:14px;color:#333;border-bottom:1px solid #f0f0f0}
  table.items td.right{text-align:right}
  .totals-box{margin-left:auto;width:250px;margin-top:8px}
  .total-row{display:flex;justify-content:space-between;font-size:13px;color:#666;padding:4px 0}
  .total-row.grand{border-top:2px solid #0a0a0a;margin-top:8px;padding-top:10px;font-size:16px;font-weight:900;color:#0a0a0a}
  .cta{display:inline-block;margin-top:8px;padding:13px 28px;background:#0a0a0a;color:#fff;text-decoration:none;border-radius:9px;font-size:14px;font-weight:700}
  .note{background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:14px 18px;margin:20px 0;font-size:14px;color:#92400e;line-height:1.5}
  .footer{background:#f5f5f3;border-top:1px solid #e5e5e0;padding:20px 36px;font-size:12px;color:#999;text-align:center;line-height:1.8}
</style>
</head>
<body>
<div class="wrap">
  <div class="top">
    <div class="logo">Leaf Cross <span>Biomedical</span></div>
  </div>
  <div class="body">${body}</div>
  <div class="footer">
    Leaf Cross Biomedical · Nelson, BC, Canada<br/>
    Health Canada Licensed Cannabis Processor · info@leafcross.com<br/>
    <span style="color:#ccc">This is an automated notification from your B2B portal.</span>
  </div>
</div>
</body>
</html>`;
}

// ── Item rows HTML ─────────────────────────────────────────────────────────────
type Item = { name: string; type: string; qty: number; unitPrice: number };

function itemRows(items: Item[]) {
  return items.map(i =>
    `<tr>
      <td>${i.name}</td>
      <td>${i.type || "—"}</td>
      <td class="right">${i.qty}</td>
      <td class="right">$${i.unitPrice.toFixed(2)}</td>
      <td class="right">$${(i.qty * i.unitPrice).toFixed(2)}</td>
    </tr>`
  ).join("");
}

function itemsTable(items: Item[]) {
  if (!items.length) return "";
  const sub      = items.reduce((s, i) => s + i.qty * i.unitPrice, 0);
  const gst      = sub * 0.05;
  const shipping = 28.99;
  const total    = sub + gst + shipping;
  return `
    <table class="items">
      <thead><tr>
        <th>Product</th><th>SKU / Type</th>
        <th class="right">Qty</th><th class="right">Unit Price</th><th class="right">Total</th>
      </tr></thead>
      <tbody>${itemRows(items)}</tbody>
    </table>
    <div class="totals-box">
      <div class="total-row"><span>Subtotal</span><span>$${sub.toFixed(2)}</span></div>
      <div class="total-row"><span>GST (5%)</span><span>$${gst.toFixed(2)}</span></div>
      <div class="total-row"><span>Flat Shipping</span><span>$${shipping.toFixed(2)}</span></div>
      <div class="total-row grand"><span>Total</span><span>$${total.toFixed(2)}</span></div>
    </div>`;
}

// ── Status email templates ─────────────────────────────────────────────────────
export type OrderEmailData = {
  orderNumber:  string;
  businessName: string;
  items:        Item[];
  trackingCode?: string;
  notes?:        string;
};

const STATUS_CONFIG = {
  processing: {
    subject: (n: string) => `Your order ${n} is being prepared`,
    badge:   "processing",
    headline: "We're preparing your order",
    intro:   (d: OrderEmailData) =>
      `Hi <strong>${d.businessName}</strong>, great news — your order <strong>${d.orderNumber}</strong> has been confirmed and is now being prepared for shipment by our team in Nelson, BC.`,
    detail:  () => `<p>You'll receive another email as soon as your order ships with tracking information.</p>`,
    cta:     "View Order in Portal",
  },
  shipped: {
    subject: (n: string) => `Your order ${n} has shipped`,
    badge:   "shipped",
    headline: "Your order is on its way",
    intro:   (d: OrderEmailData) =>
      `Hi <strong>${d.businessName}</strong>, your order <strong>${d.orderNumber}</strong> has been picked up and is now in transit to you.`,
    detail:  (d: OrderEmailData) => d.trackingCode
      ? `<div class="note">📦 <strong>Tracking Code:</strong> ${d.trackingCode}<br/>Use this code to track your shipment with your carrier.</div>`
      : `<p>Our team will send tracking details via email shortly if not already included.</p>`,
    cta:     "View Order in Portal",
  },
  completed: {
    subject: (n: string) => `Order ${n} completed — thank you!`,
    badge:   "completed",
    headline: "Order complete — thank you!",
    intro:   (d: OrderEmailData) =>
      `Hi <strong>${d.businessName}</strong>, your order <strong>${d.orderNumber}</strong> has been marked as completed. We hope everything arrived in perfect condition.`,
    detail:  () =>
      `<p>If you have any questions about your order or need anything else, don't hesitate to reach out at <a href="mailto:info@leafcross.com">info@leafcross.com</a>.</p>
       <p>We appreciate your business and look forward to serving you again.</p>`,
    cta:     "Place Another Order",
  },
  cancelled: {
    subject: (n: string) => `Order ${n} has been cancelled`,
    badge:   "cancelled",
    headline: "Your order has been cancelled",
    intro:   (d: OrderEmailData) =>
      `Hi <strong>${d.businessName}</strong>, we're writing to let you know that your order <strong>${d.orderNumber}</strong> has been cancelled.`,
    detail:  () =>
      `<p>If you believe this is a mistake or would like to place a new order, please contact us at <a href="mailto:info@leafcross.com">info@leafcross.com</a> or log into your portal.</p>`,
    cta:     "Contact Us",
  },
} as const;

export type StatusEmailKey = keyof typeof STATUS_CONFIG;

export function buildOrderStatusEmail(status: StatusEmailKey, data: OrderEmailData): { subject: string; html: string } {
  const cfg = STATUS_CONFIG[status];
  const subject = cfg.subject(data.orderNumber);

  const body = `
    <span class="badge ${cfg.badge}">${status}</span>
    <h1>${cfg.headline}</h1>
    <p>${cfg.intro(data)}</p>
    ${cfg.detail(data)}
    ${data.notes ? `<div class="note"><strong>Note from Leaf Cross:</strong> ${data.notes}</div>` : ""}
    <div class="order-box">
      <h3>Order Summary</h3>
      <div class="order-row"><span class="label">Order Number</span><span class="val">${data.orderNumber}</span></div>
      <div class="order-row"><span class="label">Items</span><span class="val">${data.items.reduce((s,i)=>s+i.qty,0)} units</span></div>
    </div>
    ${itemsTable(data.items)}
    <a class="cta" href="https://leafcross-biomedical.netlify.app/retailer/orders">${cfg.cta}</a>`;

  return { subject, html: layout(body) };
}
