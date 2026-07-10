"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Package, Globe, Users, MessageSquare, ClipboardList, BarChart2, FileText, RotateCcw, ShieldCheck, X, Check } from "lucide-react";

const sections = [
  {
    href: "/admin/menu",
    Icon: Package,
    title: "Update Menu",
    description: "Edit product prices, toggle availability, add or remove strains from the retailer menu.",
    color: "#00f6ff",
  },
  {
    href: "/admin/website",
    Icon: Globe,
    title: "Update Website",
    description: "Edit homepage content, brand descriptions, page text, and public-facing information.",
    color: "#a78bfa",
  },
  {
    href: "/admin/retailers",
    Icon: Users,
    title: "Retailers / B2B",
    description: "Review and approve or reject retailer and B2B partner applications. View existing users.",
    color: "#4ade80",
  },
  {
    href: "/admin/orders",
    Icon: ClipboardList,
    title: "Orders",
    description: "View all orders, mark payments received or declined, adjust order quantities.",
    color: "#fb923c",
  },
  {
    href: "/admin/invoices",
    Icon: FileText,
    title: "Invoices",
    description: "Auto-generated invoices per order, grouped by store. Status syncs with payments automatically.",
    color: "#34d399",
  },
  {
    href: "/admin/queries",
    Icon: MessageSquare,
    title: "Queries",
    description: "View messages from the Contact Us page and new retailer registration forms.",
    color: "#fbbf24",
  },
  {
    href: "/admin/sales",
    Icon: BarChart2,
    title: "Track Sales",
    description: "Revenue trends, top products, brand comparison, type breakdown, and recent order history.",
    color: "#f472b6",
  },
];

export default function AdminDashboardCards() {
  const router = useRouter();
  const [killModal, setKillModal]     = useState(false);
  const [snapshotLabel, setSnapshotLabel] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("leafcross-site-baseline");
      if (raw) {
        const parsed = JSON.parse(raw);
        setSnapshotLabel(parsed.label ?? null);
      }
    } catch { /* ignore */ }
  }, []);

  const handleKillSwitch = () => {
    localStorage.setItem("leafcross-kill-triggered", "1");
    setKillModal(false);
    router.push("/admin/website");
  };

  return (
    <div>
      {/* ── Nav cards grid ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20, marginTop: 8 }}>
        {sections.map(({ href, Icon, title, description, color }) => (
          <Link key={href} href={href} style={{ textDecoration: "none" }}>
            <div
              style={{
                background: "#111", border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 16, padding: "32px 28px", cursor: "pointer",
                display: "flex", flexDirection: "column", gap: 16,
                height: "100%", boxSizing: "border-box", transition: "border-color 0.2s, transform 0.15s",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = color;
                (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)";
                (e.currentTarget as HTMLElement).style.transform = "none";
              }}
            >
              <div style={{
                width: 52, height: 52, borderRadius: 12,
                background: `${color}18`, border: `1px solid ${color}40`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Icon size={24} color={color} strokeWidth={1.75} />
              </div>
              <div>
                <h2 style={{ margin: "0 0 8px", color: "#fff", fontSize: 20, fontWeight: 700 }}>{title}</h2>
                <p style={{ margin: 0, color: "rgba(255,255,255,0.45)", fontSize: 14, lineHeight: 1.6 }}>{description}</p>
              </div>
              <span style={{ color, fontSize: 13, fontWeight: 700, marginTop: "auto" }}>Open →</span>
            </div>
          </Link>
        ))}
      </div>

      {/* ── Website Safety Zone ── */}
      <div style={{
        marginTop: 32,
        background: "#0d0d0d",
        border: "1px solid rgba(239,68,68,0.25)",
        borderRadius: 16,
        padding: "28px 32px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ef4444", boxShadow: "0 0 6px #ef4444" }}/>
          <p style={{ margin: 0, color: "#ef4444", fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em" }}>
            Website Safety Zone
          </p>
        </div>
        <p style={{ margin: "0 0 24px", color: "rgba(255,255,255,0.4)", fontSize: 13, lineHeight: 1.6 }}>
          Lock in a known-good state of the website, or trigger the kill switch to instantly revert all editor changes back to the last locked state.
        </p>

        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          {/* Lock In State */}
          <Link href="/admin/website?action=snapshot" style={{ textDecoration: "none" }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "13px 22px", borderRadius: 10,
              border: "1px solid rgba(34,197,94,0.4)",
              background: "rgba(34,197,94,0.07)",
              cursor: "pointer",
            }}>
              <ShieldCheck size={16} color="#22c55e"/>
              <div>
                <p style={{ margin: 0, color: "#22c55e", fontSize: 13, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Lock In Current State
                </p>
                <p style={{ margin: "2px 0 0", color: "rgba(255,255,255,0.35)", fontSize: 11 }}>
                  {snapshotLabel ? `Last locked: ${snapshotLabel}` : "No snapshot saved yet"}
                </p>
              </div>
            </div>
          </Link>

          {/* Kill Switch */}
          <button
            onClick={() => setKillModal(true)}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "13px 22px", borderRadius: 10,
              border: "1px solid rgba(239,68,68,0.4)",
              background: "rgba(239,68,68,0.08)",
              cursor: "pointer",
            }}
          >
            <RotateCcw size={16} color="#ef4444"/>
            <div style={{ textAlign: "left" }}>
              <p style={{ margin: 0, color: "#ef4444", fontSize: 13, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Kill Switch
              </p>
              <p style={{ margin: "2px 0 0", color: "rgba(255,255,255,0.35)", fontSize: 11 }}>
                Revert website to {snapshotLabel ? `snapshot of ${snapshotLabel}` : "original default"}
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* ── Kill switch confirmation modal ── */}
      {killModal && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 1000,
          background: "rgba(0,0,0,0.85)", backdropFilter: "blur(6px)",
          display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
        }}>
          <div style={{
            background: "#111", border: "2px solid #ef4444",
            borderRadius: 20, padding: "52px 44px", maxWidth: 480, width: "100%", textAlign: "center",
          }}>
            <div style={{
              width: 68, height: 68, borderRadius: "50%",
              background: "rgba(239,68,68,0.12)", border: "2px solid rgba(239,68,68,0.4)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 24px",
            }}>
              <RotateCcw size={28} color="#ef4444"/>
            </div>
            <p style={{ margin: "0 0 6px", color: "#ef4444", fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.15em" }}>
              Kill Switch
            </p>
            <h2 style={{ margin: "0 0 16px", color: "#fff", fontSize: "clamp(20px,3vw,28px)", fontWeight: 800, lineHeight: 1.2 }}>
              Revert All Website Changes?
            </h2>

            {snapshotLabel && (
              <div style={{ margin: "0 0 16px", background: "rgba(34,197,94,0.07)", border: "1px solid rgba(34,197,94,0.25)", borderRadius: 10, padding: "10px 16px" }}>
                <p style={{ margin: 0, color: "#22c55e", fontSize: 12, fontWeight: 700 }}>
                  <ShieldCheck size={12} style={{ verticalAlign: "middle", marginRight: 6 }}/>
                  Reverting to snapshot locked on: <strong>{snapshotLabel}</strong>
                </p>
              </div>
            )}

            <p style={{ margin: "0 0 32px", color: "rgba(255,255,255,0.5)", fontSize: 14, lineHeight: 1.7 }}>
              {snapshotLabel
                ? <>The website editor will be opened and <strong style={{ color: "#fff" }}>automatically reverted</strong> to your snapshot from <strong style={{ color: "#fff" }}>{snapshotLabel}</strong>. All unsaved changes will be wiped.</>
                : <>The website editor will be opened and <strong style={{ color: "#fff" }}>reset to the original default</strong> content. All unsaved edits will be wiped.</>
              }
            </p>

            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button
                onClick={() => setKillModal(false)}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "11px 24px", borderRadius: 10,
                  border: "1px solid rgba(255,255,255,0.15)", background: "none",
                  color: "rgba(255,255,255,0.5)", fontSize: 14, fontWeight: 700, cursor: "pointer",
                }}
              >
                <X size={14}/> Cancel
              </button>
              <button
                onClick={handleKillSwitch}
                style={{
                  display: "flex", alignItems: "center", gap: 7,
                  padding: "11px 24px", borderRadius: 10,
                  border: "none", cursor: "pointer",
                  background: "#ef4444", color: "#fff",
                  fontSize: 14, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em",
                }}
              >
                <RotateCcw size={14}/> Yes, Revert Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
