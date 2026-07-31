"use client";
import { useState, useEffect, useCallback } from "react";
import { Bell, X, FileText, ShoppingCart, MessageSquare } from "lucide-react";

type NotifItem = {
  id: string;
  type: "order" | "application" | "query";
  title: string;
  subtitle: string;
  time: string;
  href: string;
};

type Toast = { id: string; message: string; icon: React.ReactNode };

const POLL_MS = 30_000;
const LS_KEY  = "lc-admin-last-seen";

function getLastSeen(): Record<string, string> {
  try { return JSON.parse(localStorage.getItem(LS_KEY) ?? "{}"); } catch { return {}; }
}
function setLastSeen(key: string, iso: string) {
  const d = getLastSeen();
  localStorage.setItem(LS_KEY, JSON.stringify({ ...d, [key]: iso }));
}

export default function AdminNotifications() {
  const [toasts, setToasts]     = useState<Toast[]>([]);
  const [panel, setPanel]       = useState(false);
  const [items, setItems]       = useState<NotifItem[]>([]);
  const [unread, setUnread]     = useState(0);

  const addToast = useCallback((msg: string, icon: React.ReactNode) => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev, { id, message: msg, icon }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000);
  }, []);

  const poll = useCallback(async () => {
    const seen = getLastSeen();
    const now  = new Date().toISOString();
    const newItems: NotifItem[] = [];
    let newCount = 0;

    // Check orders
    try {
      const r = await fetch("/api/admin/orders");
      const j = await r.json();
      if (j.data) {
        const since = seen.orders || new Date(Date.now() - 86400_000).toISOString();
        const fresh = (j.data as Record<string, unknown>[]).filter(
          o => (o.submitted_at as string) > since
        );
        fresh.forEach(o => {
          const retailer = (o.retailers as Record<string, unknown>);
          newItems.push({
            id:       `order-${o.id}`,
            type:     "order",
            title:    `New Order — ${(retailer?.business_name as string) || "Retailer"}`,
            subtitle: `${o.order_number}`,
            time:     ((o.submitted_at as string) || "").replace("T", " ").slice(0, 16),
            href:     "/admin/orders",
          });
        });
        if (fresh.length) {
          newCount += fresh.length;
          addToast(`${fresh.length} new order${fresh.length > 1 ? "s" : ""} received`, <ShoppingCart size={16} />);
        }
      }
    } catch { /* ignore */ }

    // Check applications
    try {
      const r = await fetch("/api/admin/applications");
      const j = await r.json();
      if (j.data) {
        const since = seen.applications || new Date(Date.now() - 86400_000).toISOString();
        const fresh = (j.data as Record<string, unknown>[]).filter(
          a => (a.created_at as string) > since
        );
        fresh.forEach(a => {
          newItems.push({
            id:       `app-${a.id}`,
            type:     "application",
            title:    `New Application — ${(a.business_name as string) || "Applicant"}`,
            subtitle: (a.contact_name as string) || "",
            time:     ((a.created_at as string) || "").replace("T", " ").slice(0, 16),
            href:     "/admin/applications",
          });
        });
        if (fresh.length) {
          newCount += fresh.length;
          addToast(`${fresh.length} new application${fresh.length > 1 ? "s" : ""}`, <FileText size={16} />);
        }
      }
    } catch { /* ignore */ }

    // Check queries
    try {
      const r = await fetch("/api/admin/queries");
      const j = await r.json();
      if (j.data) {
        const since = seen.queries || new Date(Date.now() - 86400_000).toISOString();
        const fresh = (j.data as Record<string, unknown>[]).filter(
          q => (q.created_at as string) > since
        );
        fresh.forEach(q => {
          newItems.push({
            id:       `query-${q.id}`,
            type:     "query",
            title:    `New Message — ${(q.name as string) || "Visitor"}`,
            subtitle: (q.email as string) || "",
            time:     ((q.created_at as string) || "").replace("T", " ").slice(0, 16),
            href:     "/admin/queries",
          });
        });
        if (fresh.length) {
          newCount += fresh.length;
          addToast(`${fresh.length} new message${fresh.length > 1 ? "s" : ""}`, <MessageSquare size={16} />);
        }
      }
    } catch { /* ignore */ }

    if (newItems.length) {
      setItems(prev => [...newItems, ...prev].slice(0, 20));
      setUnread(prev => prev + newCount);
    }

    // Update seen timestamps to now
    setLastSeen("orders",       now);
    setLastSeen("applications", now);
    setLastSeen("queries",      now);
  }, [addToast]);

  useEffect(() => {
    poll();
    const id = setInterval(poll, POLL_MS);
    return () => clearInterval(id);
  }, [poll]);

  const typeIcon = (type: NotifItem["type"]) => {
    if (type === "order")       return <ShoppingCart size={14} color="#00f6ff" />;
    if (type === "application") return <FileText size={14} color="#4ade80" />;
    return <MessageSquare size={14} color="#a78bfa" />;
  };

  return (
    <>
      {/* Bell button */}
      <div style={{ position: "relative" }}>
        <button
          onClick={() => { setPanel(v => !v); setUnread(0); }}
          style={{
            position: "relative", width: 36, height: 36,
            borderRadius: 8, border: "1px solid rgba(255,255,255,0.12)",
            background: "rgba(255,255,255,0.06)", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "rgba(255,255,255,0.7)",
          }}
        >
          <Bell size={16} />
          {unread > 0 && (
            <span style={{
              position: "absolute", top: -5, right: -5,
              background: "#f87171", color: "#fff",
              fontSize: 10, fontWeight: 800, lineHeight: 1,
              padding: "2px 5px", borderRadius: 999,
              minWidth: 16, textAlign: "center",
            }}>
              {unread}
            </span>
          )}
        </button>

        {/* Dropdown panel */}
        {panel && (
          <div style={{
            position: "absolute", top: "calc(100% + 8px)", right: 0,
            width: 320, maxHeight: 420, overflow: "auto",
            background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 12, boxShadow: "0 16px 48px rgba(0,0,0,0.6)",
            zIndex: 200,
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              <p style={{ margin: 0, color: "#fff", fontSize: 13, fontWeight: 800 }}>Today&apos;s Activity</p>
              <button onClick={() => setPanel(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.4)" }}>
                <X size={14} />
              </button>
            </div>

            {items.length === 0 ? (
              <p style={{ margin: 0, padding: "24px 16px", color: "rgba(255,255,255,0.35)", fontSize: 13, textAlign: "center" }}>
                No new activity yet today.
              </p>
            ) : (
              <div>
                {items.map(item => (
                  <a key={item.id} href={item.href} onClick={() => setPanel(false)} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 16px", textDecoration: "none", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    <div style={{ marginTop: 2, flexShrink: 0 }}>{typeIcon(item.type)}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: "0 0 2px", color: "#fff", fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.title}</p>
                      <p style={{ margin: 0, color: "rgba(255,255,255,0.4)", fontSize: 11 }}>{item.subtitle}</p>
                    </div>
                    <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 11, flexShrink: 0 }}>{item.time.slice(11)}</span>
                  </a>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Toast stack */}
      <div style={{ position: "fixed", bottom: 24, right: 24, display: "flex", flexDirection: "column", gap: 10, zIndex: 9999 }}>
        {toasts.map(t => (
          <div key={t.id} style={{
            display: "flex", alignItems: "center", gap: 12,
            background: "#1a1a1a", border: "1px solid rgba(0,246,255,0.3)",
            borderRadius: 10, padding: "14px 18px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
            color: "#fff", fontSize: 14, fontWeight: 600,
            animation: "slideIn 0.25s ease",
          }}>
            <span style={{ color: "#00f6ff" }}>{t.icon}</span>
            {t.message}
            <button onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))} style={{ marginLeft: 8, background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.4)" }}>
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
      <style>{`@keyframes slideIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </>
  );
}
