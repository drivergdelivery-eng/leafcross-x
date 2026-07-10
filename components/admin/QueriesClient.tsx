"use client";
import React, { useState } from "react";
import { Mail, FileText, ChevronDown, ChevronUp, Circle } from "lucide-react";

type QueryType = "contact" | "retailer";
type Query = {
  id: string;
  type: QueryType;
  name: string;
  email: string;
  phone?: string;
  business?: string;
  subject?: string;
  message: string;
  received: string;
  read: boolean;
};

const mockQueries: Query[] = [
  {
    id: "q1", type: "contact", read: false,
    name: "Alex Johnson", email: "alex@example.com",
    subject: "Wholesale pricing inquiry",
    message: "Hi, I run a small dispensary in Kamloops and I'm interested in your wholesale pricing. Could you send me more information about becoming a retailer partner?",
    received: "2026-07-02 14:32",
  },
  {
    id: "q2", type: "retailer", read: false,
    name: "Priya Patel", email: "priya@sunrisecannabis.ca",
    business: "Sunrise Cannabis", phone: "778-555-0606",
    message: "New retailer signup form submitted. Store: Sunrise Cannabis, Kamloops, BC. License: MRS-112233, expiry 2028-01-01.",
    received: "2026-07-02 10:15",
  },
  {
    id: "q3", type: "contact", read: true,
    name: "Carlos Rivera", email: "carlos@riveraproductions.ca",
    subject: "B2B partnership",
    message: "We are a licensed cannabis extractor in Vancouver looking for toll processing partnerships. Please reach out at your earliest convenience.",
    received: "2026-07-01 16:55",
  },
];

const typeLabel: Record<QueryType, { label: string; color: string; Icon: React.ElementType }> = {
  contact:  { label: "Contact Form",  color: "#60a5fa", Icon: Mail },
  retailer: { label: "Retailer Form", color: "#4ade80", Icon: FileText },
};

export default function QueriesClient() {
  const [filter, setFilter] = useState<QueryType | "all">("all");
  const [queries, setQueries] = useState<Query[]>(mockQueries);
  const [expanded, setExpanded] = useState<string | null>(null);

  const markRead = (id: string) =>
    setQueries(prev => prev.map(q => q.id === id ? { ...q, read: true } : q));

  const toggle = (id: string) => {
    setExpanded(prev => prev === id ? null : id);
    markRead(id);
  };

  const visible = filter === "all" ? queries : queries.filter(q => q.type === filter);
  const unread = queries.filter(q => !q.read).length;

  return (
    <div>
      {/* Filter + unread badge */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
        {[
          { key: "all",      label: "All" },
          { key: "contact",  label: "Contact Form" },
          { key: "retailer", label: "Retailer Form" },
        ].map(({ key, label }) => (
          <button key={key} onClick={() => setFilter(key as QueryType | "all")} style={{
            padding: "6px 16px", borderRadius: 999, cursor: "pointer",
            fontSize: 12, fontWeight: 700,
            background: filter === key ? "#00f6ff" : "rgba(0,0,0,0.07)",
            color: filter === key ? "#000" : "rgba(0,0,0,0.6)",
            border: filter === key ? "none" : "1px solid rgba(0,0,0,0.12)",
          }}>{label}</button>
        ))}
        {unread > 0 && (
          <span style={{
            marginLeft: "auto", background: "#f87171", color: "#fff",
            fontSize: 11, fontWeight: 800, padding: "4px 10px", borderRadius: 999,
          }}>
            {unread} unread
          </span>
        )}
      </div>

      {visible.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 0", color: "rgba(0,0,0,0.35)", fontSize: 15 }}>
          No messages here yet.
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {visible.map(q => {
          const { label, color, Icon } = typeLabel[q.type] as { label: string; color: string; Icon: React.ElementType };
          const isExpanded = expanded === q.id;

          return (
            <div key={q.id} style={{
              background: "#111",
              border: `1px solid ${!q.read ? "rgba(0,246,255,0.2)" : "rgba(255,255,255,0.07)"}`,
              borderRadius: 12, overflow: "hidden",
            }}>
              <div onClick={() => toggle(q.id)} style={{
                display: "grid", gridTemplateColumns: "20px 1fr 140px 160px 32px",
                gap: 12, alignItems: "center", padding: "14px 18px", cursor: "pointer",
              }}>
                {/* Unread dot */}
                <div style={{ display: "flex", justifyContent: "center" }}>
                  {!q.read
                    ? <Circle size={8} fill="#00f6ff" color="#00f6ff" />
                    : <Circle size={8} fill="transparent" color="rgba(255,255,255,0.15)" />}
                </div>

                <div>
                  <p style={{ margin: 0, color: "#fff", fontSize: 14, fontWeight: q.read ? 500 : 700 }}>
                    {q.business ?? q.name}
                  </p>
                  <p style={{ margin: "3px 0 0", color: "rgba(255,255,255,0.4)", fontSize: 12 }}>
                    {q.subject ?? q.email}
                  </p>
                </div>

                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 5,
                  color, fontSize: 11, fontWeight: 700,
                }}>
                  {React.createElement(Icon, { size: 12 })} {label}
                </span>

                <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 12 }}>{q.received}</span>

                {isExpanded
                  ? <ChevronUp size={16} color="rgba(255,255,255,0.4)" />
                  : <ChevronDown size={16} color="rgba(255,255,255,0.4)" />}
              </div>

              {isExpanded && (
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", padding: "20px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 16 }}>
                    {[
                      ["Name",     q.name],
                      ["Email",    q.email],
                      ...(q.phone    ? [["Phone",    q.phone]]    : []),
                      ...(q.business ? [["Business", q.business]] : []),
                      ...(q.subject  ? [["Subject",  q.subject]]  : []),
                      ["Received", q.received],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <p style={{ margin: "0 0 4px", color: "rgba(255,255,255,0.35)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</p>
                        <p style={{ margin: 0, color: "#fff", fontSize: 14 }}>{value}</p>
                      </div>
                    ))}
                  </div>

                  <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: "14px 16px", marginBottom: 16 }}>
                    <p style={{ margin: "0 0 6px", color: "rgba(255,255,255,0.35)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em" }}>Message</p>
                    <p style={{ margin: 0, color: "rgba(255,255,255,0.85)", fontSize: 14, lineHeight: 1.65 }}>{q.message}</p>
                  </div>

                  <a
                    href={`mailto:${q.email}`}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 6,
                      padding: "9px 20px", borderRadius: 8,
                      background: "#00f6ff", color: "#000",
                      fontSize: 12, fontWeight: 800, textDecoration: "none",
                      textTransform: "uppercase", letterSpacing: "0.06em",
                    }}
                  >
                    <Mail size={13} /> Reply via Email
                  </a>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
