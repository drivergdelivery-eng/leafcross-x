"use client";
import { useState } from "react";
import { CheckCircle, XCircle, Clock, ChevronDown, ChevronUp, AlertTriangle, FileImage, X, Download, KeyRound, Copy, RefreshCw, Loader2 } from "lucide-react";

// ── Password generator ────────────────────────────────────────────────────────
function genPassword() {
  const upper = "ABCDEFGHJKMNPQRSTUVWXYZ";
  const lower = "abcdefghjkmnpqrstuvwxyz";
  const nums  = "23456789";
  const syms  = "!@#$%";
  const all   = upper + lower + nums + syms;
  // guarantee at least one of each category
  return [
    upper[Math.floor(Math.random() * upper.length)],
    lower[Math.floor(Math.random() * lower.length)],
    nums [Math.floor(Math.random() * nums.length)],
    syms [Math.floor(Math.random() * syms.length)],
    ...Array.from({ length: 8 }, () => all[Math.floor(Math.random() * all.length)]),
  ].sort(() => Math.random() - 0.5).join("");
}

// ── Credentials panel ─────────────────────────────────────────────────────────
type CredState = { email: string; password: string; loading: boolean; done: boolean; error: string };

function CredentialsPanel({ app, cred, onChange, onSubmit, onEmail }: {
  app: { email: string; business: string; name: string; type: string };
  cred: CredState;
  onChange: (patch: Partial<CredState>) => void;
  onSubmit: () => void;
  onEmail?: () => void;
}) {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (val: string, key: string) => {
    navigator.clipboard.writeText(val);
    setCopied(key);
    setTimeout(() => setCopied(null), 1800);
  };

  if (cred.done) {
    return (
      <div style={{ background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: 12, padding: "20px 22px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <CheckCircle size={18} color="#22c55e" />
          <p style={{ margin: 0, color: "#22c55e", fontSize: 14, fontWeight: 800 }}>
            You&apos;re all set! Share these credentials with {app.business}.
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
          {[
            { label: "Login URL", val: `${typeof window !== "undefined" ? window.location.origin : ""}/login`, key: "url" },
            { label: "Email",     val: cred.email,    key: "email" },
            { label: "Password",  val: cred.password, key: "pass" },
          ].map(({ label, val, key }) => (
            <div key={key} style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(0,0,0,0.25)", borderRadius: 8, padding: "10px 14px" }}>
              <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", minWidth: 72 }}>{label}</span>
              <span style={{ color: "#fff", fontSize: 13, fontFamily: key === "pass" ? "monospace" : "inherit", flex: 1, letterSpacing: key === "pass" ? "0.05em" : 0 }}>{val}</span>
              <button onClick={() => copy(val, key)} style={{
                display: "flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 6,
                border: "none", cursor: "pointer", fontSize: 11, fontWeight: 700,
                background: copied === key ? "rgba(34,197,94,0.2)" : "rgba(255,255,255,0.08)",
                color: copied === key ? "#22c55e" : "rgba(255,255,255,0.5)",
              }}>
                <Copy size={11} /> {copied === key ? "Copied!" : "Copy"}
              </button>
            </div>
          ))}
        </div>
        {onEmail && (
          <button onClick={onEmail} style={{
            display: "flex", alignItems: "center", gap: 7,
            padding: "10px 22px", borderRadius: 8, border: "1px solid rgba(34,197,94,0.4)",
            background: "rgba(34,197,94,0.1)", color: "#22c55e",
            fontSize: 12, fontWeight: 800, cursor: "pointer",
            textTransform: "uppercase", letterSpacing: "0.06em",
          }}>
            ✉ Send Credentials via Email
          </button>
        )}
        <p style={{ margin: "12px 0 0", color: "rgba(255,255,255,0.3)", fontSize: 11 }}>
          Ask them to change their password after first login.
        </p>
      </div>
    );
  }

  return (
    <div style={{ background: "rgba(0,246,255,0.04)", border: "1px solid rgba(0,246,255,0.2)", borderRadius: 12, padding: "20px 22px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <KeyRound size={16} color="#00f6ff" />
        <p style={{ margin: 0, color: "#00f6ff", fontSize: 14, fontWeight: 800 }}>Create Login Credentials</p>
        <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 12 }}>— account will be live immediately</span>
      </div>

      {cred.error && (
        <div style={{ marginBottom: 14, padding: "9px 14px", borderRadius: 8, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171", fontSize: 13 }}>
          {cred.error}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
        {/* Email */}
        <div>
          <p style={{ margin: "0 0 6px", color: "rgba(255,255,255,0.4)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>Email (login username)</p>
          <input
            type="email"
            value={cred.email}
            onChange={e => onChange({ email: e.target.value })}
            style={{
              width: "100%", boxSizing: "border-box",
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 8, color: "#fff", fontSize: 14, padding: "10px 12px", outline: "none",
            }}
          />
        </div>

        {/* Password */}
        <div>
          <p style={{ margin: "0 0 6px", color: "rgba(255,255,255,0.4)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>Password</p>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              type="text"
              value={cred.password}
              onChange={e => onChange({ password: e.target.value })}
              placeholder="Min 8 characters"
              style={{
                flex: 1, minWidth: 0,
                background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 8, color: "#fff", fontSize: 13, fontFamily: "monospace",
                padding: "10px 12px", outline: "none",
              }}
            />
            <button
              onClick={() => onChange({ password: genPassword() })}
              title="Generate password"
              style={{
                display: "flex", alignItems: "center", gap: 4, padding: "0 12px",
                borderRadius: 8, border: "1px solid rgba(255,255,255,0.15)",
                background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.6)",
                cursor: "pointer", flexShrink: 0, fontSize: 12, fontWeight: 700,
              }}
            >
              <RefreshCw size={13} /> Auto
            </button>
          </div>
        </div>
      </div>

      <button
        onClick={onSubmit}
        disabled={cred.loading || !cred.email || !cred.password}
        style={{
          display: "flex", alignItems: "center", gap: 7,
          padding: "11px 28px", borderRadius: 8, border: "none",
          cursor: cred.loading || !cred.email || !cred.password ? "not-allowed" : "pointer",
          background: cred.loading || !cred.email || !cred.password ? "rgba(0,246,255,0.3)" : "#00f6ff",
          color: "#000", fontSize: 13, fontWeight: 800,
          textTransform: "uppercase", letterSpacing: "0.06em",
        }}
      >
        {cred.loading
          ? <><Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> Creating account...</>
          : <><KeyRound size={14} /> Create Account &amp; Get Credentials</>}
      </button>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

type Status = "pending" | "approved" | "rejected";
type Section = "applications" | "existing";

type Application = {
  id: string;
  name: string;
  business: string;
  email: string;
  phone: string;
  address: string;
  license: string;
  licenseExpiry: string;
  licenseImage: string;
  type: "Retailer" | "B2B";
  submitted: string;
  status: Status;
  notes: string;
};

type ExistingUser = {
  id: string;
  name: string;
  business: string;
  email: string;
  phone: string;
  address: string;
  license: string;
  licenseExpiry: string;
  licenseImage: string;
  type: "Retailer" | "B2B";
  approvedDate: string;
  totalOrders: number;
  accountStatus: "active" | "suspended" | "expired";
};

const mockApplications: Application[] = [
  {
    id: "1", type: "Retailer", status: "pending",
    name: "Jane Smith", business: "Green Leaf Dispensary",
    email: "jane@greenleaf.ca", phone: "250-555-0101",
    address: "123 Main St, Kelowna, BC V1Y 1A1",
    license: "MRS-001234", licenseExpiry: "2027-03-15",
    licenseImage: "https://placehold.co/900x600/1a1a1a/ffffff?text=Cannabis+Retail+License%0AMRS-001234%0AGreen+Leaf+Dispensary",
    submitted: "2026-07-01", notes: "",
  },
  {
    id: "2", type: "B2B", status: "pending",
    name: "Mike Torres", business: "Pacific Distribution Co.",
    email: "mike@pacdist.ca", phone: "604-555-0202",
    address: "456 Industrial Ave, Vancouver, BC V6A 1B2",
    license: "MRS-005678", licenseExpiry: "2026-12-01",
    licenseImage: "https://placehold.co/900x600/1a1a1a/ffffff?text=Cannabis+Retail+License%0AMRS-005678%0APacific+Distribution+Co.",
    submitted: "2026-06-30", notes: "",
  },
];

const mockExisting: ExistingUser[] = [
  {
    id: "e1", type: "Retailer",
    name: "Sarah Chen", business: "Kootenay Cannabis Co.",
    email: "sarah@kootenaycannabis.ca", phone: "250-555-0303",
    address: "789 Baker St, Nelson, BC V1L 4J3",
    license: "MRS-009876", licenseExpiry: "2027-06-30",
    licenseImage: "https://placehold.co/900x600/1a1a1a/ffffff?text=Cannabis+Retail+License%0AMRS-009876%0AKootenay+Cannabis+Co.",
    approvedDate: "2025-11-10", totalOrders: 14,
    accountStatus: "active",
  },
  {
    id: "e2", type: "Retailer",
    name: "Tom Baker", business: "Okanagan Greens",
    email: "tom@okanagangreens.ca", phone: "250-555-0404",
    address: "22 Harvest Ave, Penticton, BC V2A 5E1",
    license: "MRS-003311", licenseExpiry: "2026-08-15",
    licenseImage: "https://placehold.co/900x600/1a1a1a/ffffff?text=Cannabis+Retail+License%0AMRS-003311%0AOkanagan+Greens",
    approvedDate: "2024-08-22", totalOrders: 31,
    accountStatus: "active",
  },
  {
    id: "e3", type: "B2B",
    name: "Diana Ross", business: "Island Wholesale Ltd.",
    email: "diana@islandwholesale.ca", phone: "250-555-0505",
    address: "5 Harbour Rd, Victoria, BC V8V 1A1",
    license: "MRS-007742", licenseExpiry: "2025-12-01",
    licenseImage: "https://placehold.co/900x600/1a1a1a/ffffff?text=Cannabis+Retail+License%0AMRS-007742%0AIsland+Wholesale+Ltd.",
    approvedDate: "2024-03-05", totalOrders: 7,
    accountStatus: "expired",
  },
];

const statusColors: Record<Status, string> = {
  pending: "#fbbf24", approved: "#4ade80", rejected: "#f87171",
};
const statusIcons = {
  pending: <Clock size={14} />, approved: <CheckCircle size={14} />, rejected: <XCircle size={14} />,
};
const accountStatusColors: Record<string, string> = {
  active: "#4ade80", suspended: "#f87171", expired: "#fbbf24",
};

function daysUntil(dateStr: string) {
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000);
}

// ── License Lightbox ─────────────────────────────────────────────────────────
function LicenseLightbox({ src, licenseNo, business, onClose }: {
  src: string; licenseNo: string; business: string; onClose: () => void;
}) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(0,0,0,0.92)", backdropFilter: "blur(8px)",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: 24,
      }}
    >
      {/* Header */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          width: "min(900px, calc(100% - 48px))", marginBottom: 16,
        }}
      >
        <div>
          <p style={{ margin: 0, color: "rgba(255,255,255,0.4)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Cannabis Retail License
          </p>
          <p style={{ margin: "4px 0 0", color: "#fff", fontSize: 17, fontWeight: 700 }}>
            {business} <span style={{ color: "#00f6ff", fontWeight: 500 }}>· {licenseNo}</span>
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <a
            href={src}
            download={`license-${licenseNo}.png`}
            onClick={e => e.stopPropagation()}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "8px 16px", borderRadius: 8,
              border: "1px solid rgba(255,255,255,0.2)",
              background: "rgba(255,255,255,0.06)",
              color: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: 700,
              textDecoration: "none", textTransform: "uppercase", letterSpacing: "0.06em",
            }}
          >
            <Download size={13} /> Download
          </a>
          <button
            onClick={onClose}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              width: 36, height: 36, borderRadius: 8,
              border: "1px solid rgba(255,255,255,0.15)",
              background: "rgba(255,255,255,0.06)",
              color: "rgba(255,255,255,0.7)", cursor: "pointer",
            }}
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Image */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: "min(900px, calc(100% - 48px))",
          borderRadius: 12, overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.8)",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={`License ${licenseNo}`}
          style={{ width: "100%", height: "auto", display: "block" }}
        />
      </div>

      <p style={{ margin: "14px 0 0", color: "rgba(255,255,255,0.25)", fontSize: 12 }}>
        Click anywhere outside to close
      </p>
    </div>
  );
}

// ── License Button ────────────────────────────────────────────────────────────
function ViewLicenseButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", gap: 6,
        padding: "9px 20px", borderRadius: 8, border: "none", cursor: "pointer",
        background: "rgba(0,246,255,0.1)",
        color: "#00f6ff", fontSize: 12, fontWeight: 700,
      }}
    >
      <FileImage size={14} /> View License
    </button>
  );
}

// ── Email draft modal ─────────────────────────────────────────────────────────
function EmailModal({ app, cred, onClose }: {
  app: Application; cred: CredState; onClose: () => void;
}) {
  const loginUrl = typeof window !== "undefined" ? `${window.location.origin}/login` : "https://leafcross.com/login";
  const subject  = `Your Leaf Cross Biomedical Retailer Account is Ready`;
  const body = `Hi ${app.name},

Your retailer account with Leaf Cross Biomedical has been approved and is now active.

Here are your login credentials:

  Login URL : ${loginUrl}
  Email     : ${cred.email}
  Password  : ${cred.password}

Please log in and change your password after your first login.

Once logged in you will have access to:
• Our private product menu with live pricing
• Direct order submission
• Order history and invoice records

If you have any questions, reply to this email or contact us directly.

Welcome aboard!

Leaf Cross Biomedical Team
info@leafcross.com`;

  const mailtoLink = `mailto:${app.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  const [copied, setCopied] = useState(false);
  const copyAll = () => {
    navigator.clipboard.writeText(body);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ position:"fixed", inset:0, zIndex:1000, background:"rgba(0,0,0,0.88)", backdropFilter:"blur(6px)", display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      <div style={{ background:"#111", border:"1px solid rgba(255,255,255,0.1)", borderRadius:20, padding:"36px 40px", maxWidth:600, width:"100%", maxHeight:"90vh", overflow:"auto" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
          <div>
            <p style={{ margin:"0 0 4px", color:"rgba(255,255,255,0.4)", fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em" }}>Email Credentials</p>
            <h3 style={{ margin:0, color:"#fff", fontSize:18, fontWeight:800 }}>To: {app.email}</h3>
          </div>
          <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", color:"rgba(255,255,255,0.4)" }}><X size={20}/></button>
        </div>

        {/* Subject */}
        <div style={{ marginBottom:16 }}>
          <p style={{ margin:"0 0 6px", color:"rgba(255,255,255,0.35)", fontSize:11, fontWeight:700, textTransform:"uppercase" }}>Subject</p>
          <p style={{ margin:0, color:"#fff", fontSize:14, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:8, padding:"10px 14px" }}>{subject}</p>
        </div>

        {/* Body */}
        <div style={{ marginBottom:20 }}>
          <p style={{ margin:"0 0 6px", color:"rgba(255,255,255,0.35)", fontSize:11, fontWeight:700, textTransform:"uppercase" }}>Message</p>
          <pre style={{
            margin:0, color:"rgba(255,255,255,0.85)", fontSize:13, lineHeight:1.75,
            background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)",
            borderRadius:10, padding:"16px 18px", whiteSpace:"pre-wrap", fontFamily:"inherit",
          }}>{body}</pre>
        </div>

        <div style={{ display:"flex", gap:10 }}>
          <a href={mailtoLink} target="_blank" rel="noreferrer" style={{
            display:"flex", alignItems:"center", gap:7, padding:"12px 24px", borderRadius:9,
            border:"none", cursor:"pointer", background:"#00f6ff", color:"#000",
            fontSize:13, fontWeight:800, textTransform:"uppercase", letterSpacing:"0.06em", textDecoration:"none",
          }}>
            Open in Email Client →
          </a>
          <button onClick={copyAll} style={{
            display:"flex", alignItems:"center", gap:6, padding:"12px 20px", borderRadius:9,
            border:"1px solid rgba(255,255,255,0.15)", background:"rgba(255,255,255,0.06)",
            color: copied ? "#22c55e" : "rgba(255,255,255,0.6)", fontSize:13, fontWeight:700, cursor:"pointer",
          }}>
            <Copy size={13}/> {copied ? "Copied!" : "Copy Message"}
          </button>
        </div>
        <p style={{ margin:"14px 0 0", color:"rgba(255,255,255,0.25)", fontSize:12 }}>
          "Open in Email Client" will open your default mail app with everything pre-filled.
        </p>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function RetailerApprovalsClient() {
  const [section, setSection]   = useState<Section>("applications");
  const [apps, setApps]         = useState<Application[]>(mockApplications);
  const [filter, setFilter]     = useState<Status | "all">("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [licenseView, setLicenseView] = useState<{ src: string; licenseNo: string; business: string } | null>(null);
  const [emailModal, setEmailModal]   = useState<string | null>(null); // app id

  // Per-application credentials state
  const [creds, setCreds] = useState<Record<string, CredState>>({});
  const getCred = (app: Application): CredState =>
    creds[app.id] ?? { email: app.email, password: "", loading: false, done: false, error: "" };
  const patchCred = (id: string, patch: Partial<CredState>) => {
    const app = apps.find(a => a.id === id);
    const base: CredState = creds[id] ?? { email: app?.email ?? "", password: "", loading: false, done: false, error: "" };
    setCreds(prev => ({ ...prev, [id]: { ...base, ...patch } }));
  };

  const handleCreateAccount = async (app: Application) => {
    const cred = getCred(app);
    patchCred(app.id, { loading: true, error: "" });
    try {
      const res  = await fetch("/api/admin/create-retailer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cred.email, password: cred.password, business: app.business, name: app.name, type: app.type }),
      });
      const json = await res.json();
      if (!res.ok) patchCred(app.id, { loading: false, error: json.error ?? "Something went wrong." });
      else          patchCred(app.id, { loading: false, done: true });
    } catch {
      patchCred(app.id, { loading: false, error: "Network error. Please try again." });
    }
  };

  const setStatus = (id: string, status: Status) =>
    setApps(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  const setNotes = (id: string, notes: string) =>
    setApps(prev => prev.map(a => a.id === id ? { ...a, notes } : a));

  const counts = { all: apps.length, pending: 0, approved: 0, rejected: 0 };
  apps.forEach(a => counts[a.status]++);
  const visible = filter === "all" ? apps : apps.filter(a => a.status === filter);

  return (
    <div>
      {/* License lightbox */}
      {licenseView && (
        <LicenseLightbox
          src={licenseView.src}
          licenseNo={licenseView.licenseNo}
          business={licenseView.business}
          onClose={() => setLicenseView(null)}
        />
      )}

      {/* Email credentials modal */}
      {emailModal && (() => {
        const app = apps.find(a => a.id === emailModal);
        if (!app) return null;
        const cred = getCred(app);
        return <EmailModal app={app} cred={cred} onClose={() => setEmailModal(null)} />;
      })()}

      {/* Section tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 28, borderBottom: "1px solid rgba(0,0,0,0.1)" }}>
        {[
          { key: "applications", label: "Applications" },
          { key: "existing",     label: "Existing Users" },
        ].map(({ key, label }) => (
          <button key={key} onClick={() => setSection(key as Section)} style={{
            background: "none", border: "none", cursor: "pointer",
            padding: "10px 24px", fontSize: 13, fontWeight: 700,
            textTransform: "uppercase", letterSpacing: "0.08em",
            color: section === key ? "#00b8cc" : "rgba(0,0,0,0.45)",
            borderBottom: `2px solid ${section === key ? "#00b8cc" : "transparent"}`,
            marginBottom: -1,
          }}>{label}</button>
        ))}
      </div>

      {/* ── APPLICATIONS ── */}
      {section === "applications" && (
        <div>
          <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
            {(["all", "pending", "approved", "rejected"] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                padding: "6px 16px", borderRadius: 999, cursor: "pointer",
                fontSize: 12, fontWeight: 700, textTransform: "capitalize",
                background: filter === f ? "#00b8cc" : "rgba(0,0,0,0.07)",
                color: filter === f ? "#000" : "rgba(0,0,0,0.6)",
                border: filter === f ? "none" : "1px solid rgba(0,0,0,0.12)",
              }}>
                {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)} ({counts[f]})
              </button>
            ))}
          </div>

          {visible.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 0", color: "rgba(0,0,0,0.35)", fontSize: 15 }}>
              No applications in this category.
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {visible.map(app => (
              <div key={app.id} style={{ background: "#111", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, overflow: "hidden" }}>
                <div onClick={() => setExpanded(expanded === app.id ? null : app.id)} style={{
                  display: "grid", gridTemplateColumns: "1fr 120px 100px 100px 32px",
                  gap: 16, alignItems: "center", padding: "16px 20px", cursor: "pointer",
                }}>
                  <div>
                    <p style={{ margin: 0, color: "#fff", fontSize: 15, fontWeight: 700 }}>{app.business}</p>
                    <p style={{ margin: "3px 0 0", color: "rgba(255,255,255,0.4)", fontSize: 13 }}>{app.name} · {app.email}</p>
                  </div>
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: 5,
                    background: `${statusColors[app.status]}20`, color: statusColors[app.status],
                    fontSize: 11, fontWeight: 700, textTransform: "uppercase", padding: "4px 10px", borderRadius: 999,
                  }}>{statusIcons[app.status]} {app.status}</span>
                  <span style={{ color: app.type === "B2B" ? "#a78bfa" : "#60a5fa", fontSize: 12, fontWeight: 700 }}>{app.type}</span>
                  <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 12 }}>{app.submitted}</span>
                  {expanded === app.id ? <ChevronUp size={16} color="rgba(255,255,255,0.4)" /> : <ChevronDown size={16} color="rgba(255,255,255,0.4)" />}
                </div>

                {expanded === app.id && (
                  <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", padding: "20px", display: "flex", flexDirection: "column", gap: 16 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                      {[["Phone", app.phone], ["Address", app.address], ["License #", app.license],
                        ["License Expiry", app.licenseExpiry], ["Type", app.type], ["Submitted", app.submitted]
                      ].map(([label, value]) => (
                        <div key={label}>
                          <p style={{ margin: "0 0 4px", color: "rgba(255,255,255,0.35)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</p>
                          <p style={{ margin: 0, color: "#fff", fontSize: 14 }}>{value}</p>
                        </div>
                      ))}
                    </div>

                    {/* License image preview strip */}
                    <div
                      onClick={() => setLicenseView({ src: app.licenseImage, licenseNo: app.license, business: app.business })}
                      style={{
                        display: "flex", alignItems: "center", gap: 14,
                        padding: "12px 16px", borderRadius: 10,
                        border: "1px solid rgba(0,246,255,0.2)",
                        background: "rgba(0,246,255,0.04)",
                        cursor: "pointer",
                      }}
                    >
                      {/* Thumbnail */}
                      <div style={{ width: 80, height: 52, borderRadius: 6, overflow: "hidden", flexShrink: 0, border: "1px solid rgba(255,255,255,0.1)" }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={app.licenseImage} alt="license" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: 0, color: "#00f6ff", fontSize: 13, fontWeight: 700 }}>License Document</p>
                        <p style={{ margin: "2px 0 0", color: "rgba(255,255,255,0.4)", fontSize: 12 }}>{app.license} · Click to view full size</p>
                      </div>
                      <FileImage size={18} color="#00f6ff" style={{ flexShrink: 0 }} />
                    </div>

                    <div>
                      <p style={{ margin: "0 0 8px", color: "rgba(255,255,255,0.35)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em" }}>Admin Notes</p>
                      <textarea value={app.notes} onChange={e => setNotes(app.id, e.target.value)}
                        placeholder="Add notes..." rows={2} style={{
                          width: "100%", background: "rgba(255,255,255,0.06)",
                          border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8,
                          color: "#fff", fontSize: 14, padding: "10px 12px",
                          outline: "none", resize: "vertical", boxSizing: "border-box",
                        }} />
                    </div>

                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                      <button onClick={() => setStatus(app.id, "approved")} style={{
                        display: "flex", alignItems: "center", gap: 6, padding: "10px 24px",
                        borderRadius: 8, border: "none", cursor: "pointer",
                        background: app.status === "approved" ? "#16a34a" : "rgba(74,222,128,0.15)",
                        color: "#4ade80", fontSize: 13, fontWeight: 700,
                      }}><CheckCircle size={15} /> Approve</button>
                      <button onClick={() => setStatus(app.id, "rejected")} style={{
                        display: "flex", alignItems: "center", gap: 6, padding: "10px 24px",
                        borderRadius: 8, border: "none", cursor: "pointer",
                        background: app.status === "rejected" ? "#dc2626" : "rgba(248,113,113,0.15)",
                        color: "#f87171", fontSize: 13, fontWeight: 700,
                      }}><XCircle size={15} /> Reject</button>
                      <button onClick={() => setStatus(app.id, "pending")} style={{
                        padding: "10px 24px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.12)",
                        background: "none", color: "rgba(255,255,255,0.4)", fontSize: 13, fontWeight: 700, cursor: "pointer",
                      }}>Reset to Pending</button>
                      <ViewLicenseButton onClick={() => setLicenseView({ src: app.licenseImage, licenseNo: app.license, business: app.business })} />
                    </div>

                    {/* Credentials panel — only visible for approved applications */}
                    {app.status === "approved" && (
                      <CredentialsPanel
                        app={app}
                        cred={getCred(app)}
                        onChange={patch => patchCred(app.id, patch)}
                        onSubmit={() => handleCreateAccount(app)}
                        onEmail={getCred(app).done ? () => setEmailModal(app.id) : undefined}
                      />
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── EXISTING USERS ── */}
      {section === "existing" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 100px 90px 110px 90px 80px",
            gap: 12, padding: "0 16px",
            color: "rgba(0,0,0,0.45)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em",
          }}>
            <span>Business</span><span>Type</span><span>Status</span><span>License Expiry</span><span>Approved</span><span>Orders</span>
          </div>

          {mockExisting.map(user => {
            const days = daysUntil(user.licenseExpiry);
            const expiringSoon = days > 0 && days <= 60;
            const isExpanded = expanded === user.id;

            return (
              <div key={user.id} style={{ background: "#111", border: `1px solid ${expiringSoon ? "rgba(251,191,36,0.3)" : "rgba(255,255,255,0.07)"}`, borderRadius: 12, overflow: "hidden" }}>
                <div onClick={() => setExpanded(isExpanded ? null : user.id)} style={{
                  display: "grid", gridTemplateColumns: "1fr 100px 90px 110px 90px 80px",
                  gap: 12, alignItems: "center", padding: "16px", cursor: "pointer",
                }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <p style={{ margin: 0, color: "#fff", fontSize: 14, fontWeight: 700 }}>{user.business}</p>
                      {expiringSoon && <AlertTriangle size={14} color="#fbbf24" />}
                    </div>
                    <p style={{ margin: "3px 0 0", color: "rgba(255,255,255,0.4)", fontSize: 12 }}>{user.name} · {user.email}</p>
                  </div>
                  <span style={{ color: user.type === "B2B" ? "#a78bfa" : "#60a5fa", fontSize: 12, fontWeight: 700 }}>{user.type}</span>
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: 4,
                    color: accountStatusColors[user.accountStatus],
                    fontSize: 11, fontWeight: 700, textTransform: "capitalize",
                  }}>{user.accountStatus}</span>
                  <div>
                    <p style={{ margin: 0, color: expiringSoon ? "#fbbf24" : "#fff", fontSize: 13, fontWeight: 600 }}>{user.licenseExpiry}</p>
                    {expiringSoon && <p style={{ margin: "2px 0 0", color: "#fbbf24", fontSize: 11 }}>{days}d remaining</p>}
                    {days <= 0 && <p style={{ margin: "2px 0 0", color: "#f87171", fontSize: 11 }}>Expired</p>}
                  </div>
                  <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>{user.approvedDate}</span>
                  <span style={{ color: "#00f6ff", fontSize: 14, fontWeight: 700 }}>{user.totalOrders}</span>
                </div>

                {isExpanded && (
                  <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", padding: "20px", display: "flex", flexDirection: "column", gap: 16 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                      {[
                        ["Phone",          user.phone],
                        ["Address",        user.address],
                        ["License #",      user.license],
                        ["License Expiry", user.licenseExpiry],
                        ["Approved Date",  user.approvedDate],
                        ["Total Orders",   String(user.totalOrders)],
                      ].map(([label, value]) => (
                        <div key={label}>
                          <p style={{ margin: "0 0 4px", color: "rgba(255,255,255,0.35)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</p>
                          <p style={{ margin: 0, color: "#fff", fontSize: 14 }}>{value}</p>
                        </div>
                      ))}
                    </div>

                    {/* License image preview strip */}
                    <div
                      onClick={() => setLicenseView({ src: user.licenseImage, licenseNo: user.license, business: user.business })}
                      style={{
                        display: "flex", alignItems: "center", gap: 14,
                        padding: "12px 16px", borderRadius: 10,
                        border: "1px solid rgba(0,246,255,0.2)",
                        background: "rgba(0,246,255,0.04)",
                        cursor: "pointer",
                      }}
                    >
                      <div style={{ width: 80, height: 52, borderRadius: 6, overflow: "hidden", flexShrink: 0, border: "1px solid rgba(255,255,255,0.1)" }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={user.licenseImage} alt="license" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: 0, color: "#00f6ff", fontSize: 13, fontWeight: 700 }}>License Document</p>
                        <p style={{ margin: "2px 0 0", color: "rgba(255,255,255,0.4)", fontSize: 12 }}>{user.license} · Click to view full size</p>
                      </div>
                      <FileImage size={18} color="#00f6ff" style={{ flexShrink: 0 }} />
                    </div>

                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                      <button style={{
                        padding: "9px 20px", borderRadius: 8, border: "none", cursor: "pointer",
                        background: "rgba(74,222,128,0.15)", color: "#4ade80", fontSize: 12, fontWeight: 700,
                      }}>Renew License</button>
                      <button style={{
                        padding: "9px 20px", borderRadius: 8, border: "none", cursor: "pointer",
                        background: "rgba(248,113,113,0.15)", color: "#f87171", fontSize: 12, fontWeight: 700,
                      }}>Suspend Account</button>
                      <button style={{
                        padding: "9px 20px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.12)",
                        background: "none", color: "rgba(255,255,255,0.4)", fontSize: 12, fontWeight: 700, cursor: "pointer",
                      }}>View Orders</button>
                      <ViewLicenseButton onClick={() => setLicenseView({ src: user.licenseImage, licenseNo: user.license, business: user.business })} />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
