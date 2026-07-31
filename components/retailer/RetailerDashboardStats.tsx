"use client";
import { useState, useEffect } from "react";

const OPEN_STATUSES = new Set(["awaiting_payment", "processing", "shipped"]);

export default function RetailerDashboardStats() {
  const [openOrders, setOpenOrders] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/retailer/orders")
      .then(r => r.json())
      .then(json => {
        if (Array.isArray(json.data)) {
          setOpenOrders(json.data.filter((o: { status: string }) => OPEN_STATUSES.has(o.status)).length);
        }
      })
      .catch(() => {});
  }, []);

  const stats: [string, string][] = [
    ["Menu access",     "Requires valid license"],
    ["Open orders",     openOrders === null ? "…" : String(openOrders)],
    ["Payment status",  "Before shipment"],
    ["Cancellation",    "Allowed while unpaid"],
  ];

  return (
    <div className="grid statGrid">
      {stats.map(([label, value]) => (
        <article className="card" key={label}>
          <p className="eyebrow">{label}</p>
          <h2>{value}</h2>
        </article>
      ))}
    </div>
  );
}
