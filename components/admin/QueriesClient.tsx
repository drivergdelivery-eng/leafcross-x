"use client";
import React, { useState, useEffect } from "react";
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

const typeLabel: Record<QueryType, { label: string; color: string; Icon: React.ElementType }> = {
  contact:  { label: "Contact Form",  color: "#60a5fa", Icon: Mail },
  retailer: { label: "Retailer Form", color: "#4ade80", Icon: FileText },
};

function mapRow(row: Record<string, unknown>): Query {
  return {
    id:       row.id as string,
    type:     "contact",
    name:     (row.name as string) || "",
    email:    (row.email as string) || "",
    message:  (row.message as string) || "",
    subject:  (row.partner_type as string) ? `${row.partner_type} inquiry` : undefined,
    received: ((row.created_at as string) || "").replace("T", " ").slice(0, 16),
    read:     (row.read as boolean) || false,
  };
}

export default function QueriesClient() {
  const [queries, setQueries] = useState<Query[]>([]);
  const [loading, setLoading] = useState(true);
  const [noTable, setNoTable] = useState(false);
  const [filter, setFilter]   = useState<QueryType | "all">("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const loadQueries = async () => {
    setLoading(true);
    const res  = await fetch("/api/admin/queries");
    const json = await res.json();
    if (json.error?.includes("contact_queries")) {
      setNoTable(true);
    } else if (json.data) {
      setQueries(json.data.map(mapRow));
    }
    setLoading(false);
  };

  useEffect(() => { loadQueries(); }, []);

  const markRead = async (id: string) => {
    await fetch("/api/admin/queries", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, read: true }),
    });
    setQueries(prev => prev.map(q => q.id === id ? { ...q, read: true } : q));
  };

  const toggle = (id: string) => {
    setExpanded(prev => prev === id ? null : id);
    markRead(id);
  };

  const visible = filter === "all" ? queries : queries.filter(q => q.type === filter);
  const unread = queries.filter(q => !q.read).length;

  if (noTable) {
    return (
      <div style={{ background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.3)", borderRadius: 12, padding: "24px 28px" }}>
        <p style={{ margin: "0 0 12px", color: "#fbbf24", fontSize: 15, fontWeight: 700 }}>⚠ Setup Required</p>
        <p style={{ margin: "0 0 16px", color: "rgba(255,255,255,0.6)", fontSize: 14, lineHeight: 1.65 }}>
          The <code style={{ color: "#00f6ff" }}>contact_queries</code> table doesn&apos;t exist yet in Supabase.
          Run the following SQL in your Supabase SQL Editor to enable this feature:
        </p>
        <pre style={{ margin: 0, padding: "16px 20px", background: "rgba(0,0,0,0.5)", borderRadius: 8, color: "#a3e635", fontSize: 12, lineHeight: 1.7, overflowX: "auto", whiteSpace: "pre-wrap" }}>
{`CREATE TABLE public.contact_queries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  partner_type TEXT,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.contact_queries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert" ON public.contact_queries
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can read" ON public.contact_queries
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','manager'))
  );
CREATE POLICY "Admins can update" ON public.contact_queries
  FOR UPDATE TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','manager'))
  );`}
        </pre>
        <button onClick={loadQueries} style={{ marginTop: 16, padding: "8px 20px", borderRadius: 8, border: "none", background: "#00f6ff", color: "#000", fontSize: 12, fontWeight: 800, cursor: "pointer" }}>
          Retry after running SQL
        </button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
        {[{ key: "all", label: "All" }, { key: "contact", label: "Contact Form" }, { key: "retailer", label: "Retailer Form" }].map(({ key, label }) => (
          <button key={key} onClick={() => setFilter(key as QueryType | "all")} style={{
            padding: "6px 16px", borderRadius: 999, cursor: "pointer",
            fontSize: 12, fontWeight: 700,
            background: filter === key ? "#00f6ff" : "rgba(255,255,255,0.08)",
            color: filter === key ? "#000" : "rgba(255,255,255,0.7)",
            border: filter === key ? "none" : "1px solid rgba(255,255,255,0.15)",
          }}>{label}</button>
        ))}
        {unread > 0 && (
          <span style={{ marginLeft: "auto", background: "#f87171", color: "#fff", fontSize: 11, fontWeight: 800, padding: "4px 10px", borderRadius: 999 }}>
            {unread} unread
          </span>
        )}
        <button onClick={loadQueries} style={{ padding: "6px 14px", borderRadius: 999, cursor: "pointer", fontSize: 12, fontWeight: 700, background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.15)" }}>
          ↻ Refresh
        </button>
      </div>

      {loading && <p style={{ textAlign: "center", color: "rgba(255,255,255,0.4)", padding: "40px 0" }}>Loading messages…</p>}

      {!loading && visible.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 0", color: "rgba(255,255,255,0.35)", fontSize: 15 }}>
          No messages here yet.
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {visible.map(q => {
          const { label, color, Icon } = typeLabel[q.type] as { label: string; color: string; Icon: React.ElementType };
          const isExpanded = expanded === q.id;

          return (
            <div key={q.id} style={{ background: "#111", border: `1px solid ${!q.read ? "rgba(0,246,255,0.2)" : "rgba(255,255,255,0.07)"}`, borderRadius: 12, overflow: "hidden" }}>
              <div onClick={() => toggle(q.id)} style={{ display: "grid", gridTemplateColumns: "20px 1fr 140px 160px 32px", gap: 12, alignItems: "center", padding: "14px 18px", cursor: "pointer" }}>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  {!q.read ? <Circle size={8} fill="#00f6ff" color="#00f6ff" /> : <Circle size={8} fill="transparent" color="rgba(255,255,255,0.15)" />}
                </div>
                <div>
                  <p style={{ margin: 0, color: "#fff", fontSize: 14, fontWeight: q.read ? 500 : 700 }}>{q.business ?? q.name}</p>
                  <p style={{ margin: "3px 0 0", color: "rgba(255,255,255,0.4)", fontSize: 12 }}>{q.subject ?? q.email}</p>
                </div>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 5, color, fontSize: 11, fontWeight: 700 }}>
                  {React.createElement(Icon, { size: 12 })} {label}
                </span>
                <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 12 }}>{q.received}</span>
                {isExpanded ? <ChevronUp size={16} color="rgba(255,255,255,0.4)" /> : <ChevronDown size={16} color="rgba(255,255,255,0.4)" />}
              </div>

              {isExpanded && (
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", padding: "20px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 16 }}>
                    {[
                      ["Name", q.name], ["Email", q.email],
                      ...(q.phone    ? [["Phone", q.phone]]       : []),
                      ...(q.business ? [["Business", q.business]] : []),
                      ...(q.subject  ? [["Subject", q.subject]]   : []),
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
                  <a href={`mailto:${q.email}`} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 20px", borderRadius: 8, background: "#00f6ff", color: "#000", fontSize: 12, fontWeight: 800, textDecoration: "none", textTransform: "uppercase", letterSpacing: "0.06em" }}>
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
