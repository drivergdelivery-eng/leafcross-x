"use client";
import React, { createContext, useContext, useState, useMemo } from "react";

// ── types ──────────────────────────────────────────────────────────────────────
export type PaymentStatus = "pending" | "paid" | "declined";
export type OrderStatus   = "awaiting_payment" | "processing" | "shipped" | "completed" | "cancelled";

export type OrderItem = { name: string; type: string; qty: number; unitPrice: number };

export type Order = {
  id: string;
  orderNumber: string;
  retailer: string;
  email: string;
  phone?: string;
  address?: string;
  submitted: string;          // "YYYY-MM-DD HH:mm"
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  items: OrderItem[];
  notes: string;
};

export type Invoice = {
  id: string;
  invoiceNumber: string;      // INV-2026-000001
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

// ── constants ─────────────────────────────────────────────────────────────────
export const GST      = 0.05;
export const SHIPPING = 28.99;

export function calcTotals(items: OrderItem[]) {
  const sub = items.reduce((s, i) => s + i.qty * i.unitPrice, 0);
  const gst = +(sub * GST).toFixed(2);
  return { sub: +sub.toFixed(2), gst, total: +(sub + gst + SHIPPING).toFixed(2) };
}

function makeInvoice(order: Order, seq: number): Invoice {
  const { sub, gst, total } = calcTotals(order.items);
  return {
    id:            `inv-${order.id}`,
    invoiceNumber: `INV-2026-${String(seq).padStart(6, "0")}`,
    orderId:       order.id,
    orderNumber:   order.orderNumber,
    retailer:      order.retailer,
    email:         order.email,
    issuedDate:    order.submitted.split(" ")[0],
    items:         order.items,
    sub, gst, shipping: SHIPPING, total,
    status:        order.paymentStatus,
    paidDate:      order.paymentStatus === "paid" ? order.submitted.split(" ")[0] : undefined,
  };
}

// ── seed data ──────────────────────────────────────────────────────────────────
const SEED_ORDERS: Order[] = [
  {
    id: "o1", orderNumber: "LC-2026-001",
    retailer: "Green Leaf Dispensary", email: "jane@greenleaf.ca",
    phone: "250-555-0101", address: "204 Baker St, Nelson, BC",
    submitted: "2026-07-02 09:15", paymentStatus: "pending", orderStatus: "awaiting_payment",
    notes: "",
    items: [
      { name: "Jelly Bean",    type: "Indica", qty: 4,  unitPrice: 12.59 },
      { name: "Dream Catcher", type: "Sativa", qty: 2,  unitPrice: 13.34 },
      { name: "Gas Daddy",     type: "Indica", qty: 3,  unitPrice: 16.00 },
    ],
  },
  {
    id: "o2", orderNumber: "LC-2026-002",
    retailer: "Kootenay Cannabis Co.", email: "sarah@kootenaycannabis.ca",
    phone: "250-555-0202", address: "567 Vernon St, Nelson, BC",
    submitted: "2026-07-01 14:40", paymentStatus: "paid", orderStatus: "processing",
    notes: "E-transfer received July 1.",
    items: [
      { name: "Sweet Gas",    type: "Hybrid", qty: 6,  unitPrice: 12.24 },
      { name: "Hippie Vibes", type: "Sativa", qty: 4,  unitPrice: 13.57 },
    ],
  },
  {
    id: "o3", orderNumber: "LC-2026-003",
    retailer: "Peak Cannabis Co.", email: "mike@peakcannabis.ca",
    phone: "250-555-0303", address: "89 Hall St, Nelson, BC",
    submitted: "2026-06-28 11:20", paymentStatus: "paid", orderStatus: "completed",
    notes: "Shipped via Purolator — tracking #PRL774839.",
    items: [
      { name: "Joker",            type: "Hybrid", qty: 5, unitPrice: 17.50 },
      { name: "Flawless Victory", type: "Indica", qty: 3, unitPrice: 14.00 },
      { name: "Lemon Haze",       type: "CBD",    qty: 4, unitPrice: 11.50 },
    ],
  },
  {
    id: "o4", orderNumber: "LC-2026-004",
    retailer: "Green Leaf Dispensary", email: "jane@greenleaf.ca",
    phone: "250-555-0101", address: "204 Baker St, Nelson, BC",
    submitted: "2026-06-20 10:05", paymentStatus: "paid", orderStatus: "completed",
    notes: "Delivered.",
    items: [
      { name: "Slumber Party", type: "Indica", qty: 4, unitPrice: 16.50 },
      { name: "Grape Soda",    type: "Indica", qty: 3, unitPrice: 12.75 },
    ],
  },
];

// ── context ────────────────────────────────────────────────────────────────────
type Ctx = {
  orders:   Order[];
  invoices: Invoice[];
  updateOrder: (id: string, patch: Partial<Order>) => void;
  updateItem:  (orderId: string, idx: number, field: keyof OrderItem, value: string | number) => void;
  removeItem:  (orderId: string, idx: number) => void;
  markPaid:    (id: string) => void;
  markDeclined:(id: string) => void;
};

const OrdersCtx = createContext<Ctx | null>(null);

export function OrdersProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(SEED_ORDERS);

  const invoices = useMemo<Invoice[]>(
    () => orders.map((o, i) => makeInvoice(o, i + 1)),
    [orders]
  );

  const updateOrder = (id: string, patch: Partial<Order>) =>
    setOrders(prev => prev.map(o => o.id === id ? { ...o, ...patch } : o));

  const updateItem = (orderId: string, idx: number, field: keyof OrderItem, value: string | number) =>
    setOrders(prev => prev.map(o =>
      o.id === orderId
        ? { ...o, items: o.items.map((it, i) => i === idx ? { ...it, [field]: value } : it) }
        : o
    ));

  const removeItem = (orderId: string, idx: number) =>
    setOrders(prev => prev.map(o =>
      o.id === orderId ? { ...o, items: o.items.filter((_, i) => i !== idx) } : o
    ));

  const markPaid = (id: string) =>
    updateOrder(id, {
      paymentStatus: "paid",
      orderStatus:   "processing",
      notes: orders.find(o => o.id === id)?.notes ?? "",
    });

  const markDeclined = (id: string) =>
    updateOrder(id, { paymentStatus: "declined", orderStatus: "cancelled" });

  return (
    <OrdersCtx.Provider value={{ orders, invoices, updateOrder, updateItem, removeItem, markPaid, markDeclined }}>
      {children}
    </OrdersCtx.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrdersCtx);
  if (!ctx) throw new Error("useOrders must be inside OrdersProvider");
  return ctx;
}
