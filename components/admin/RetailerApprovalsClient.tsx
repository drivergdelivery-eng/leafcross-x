"use client";
import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Clock, ChevronDown, ChevronUp, AlertTriangle, FileImage, X, Download, KeyRound, Copy, RefreshCw, Loader2 } from "lucide-react";

// ── Password generator ────────────────────────────────────────────────────────
function genPassword() {
  const upper = "ABCDEFGHJKMNPQRSTUVWXYZ";
  const lower = "abcdefghjkmnpqrstuvwxyz";
  const nums  = "23456789";
  const syms  = "!@#$%";
  const all   = upper + lower + nums + syms;
  return [
    upper[Math.floor(Math.random() * upper.length)],
    lower[Math.floor(Math.random() * lower.length)],
    nums [Math.floor(Math.random() * nums.length)],
    syms [Math.floor(Math.random() * syms.length)],
    ...Array.from({ length: 8 }, () => all[Math.floor(Math.random() * all.length)]),
  ].sort(() => Math.random() - 0.5).join("");
}

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
        <div>
          <p style={{ margin: "0 0 6px", color: "rgba(255,255,255,0.4)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>Email (login username)</p>
          <input type="email" value={cred.email} onChange={e => onChange({ email: e.target.value })} style={{
            width: "100%", boxSizing: "border-box",
            background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 8, color: "#fff", fontSize: 14, padding: "10px 12px", outline: "none",
          }} />
        </div>
        <div>
          <p style={{ margin: "0 0 6px", color: "rgba(255,255,255,0.4)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>Password</p>
          <div style={{ display: "flex", gap: 8 }}>
            <input type="text" value={cred.password} onChange={e => onChange({ password: e.target.value })} placeholder="Min 8 characters" style={{
              flex: 1, minWidth: 0,
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 8, color: "#fff", fontSize: 13, fontFamily: "monospace",
              padding: "10px 12px", outline: "none",
            }} />
            <button onClick={() => onChange({ password: genPassword() })} title="Generate password" style={{
              display: "flex", alignItems: "center", gap: 4, padding: "0 12px",
              borderRadius: 8, border: "1px solid rgba(255,255,255,0.15)",
              background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.6)",
              cursor: "pointer", flexShrink: 0, fontSize: 12, fontWeight: 700,
            }}>
              <RefreshCw size={13} /> Auto
            </button>
          </div>
        </div>
      </div>
      <button onClick={onSubmit} disabled={cred.loading || !cred.email || !cred.password} style={{
        display: "flex", alignItems: "center", gap: 7,
        padding: "11px 28px", borderRadius: 8, border: "none",
        cursor: cred.loading || !cred.email || !cred.password ? "not-allowed" : "pointer",
        background: cred.loading || !cred.email || !cred.password ? "rgba(0,246,255,0.3)" : "#00f6ff",
        color: "#000", fontSize: 13, fontWeight: 800,
        textTransform: "uppercase", letterSpacing: "0.06em",
      }}>
        {cred.loading
          ? <><Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> Creating account...</>
          : <><KeyRound size={14} /> Create Account &amp; Get Credentials</>}
      </button>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

type Status = "pending" | "approved" | "rejected";
type Section = "applications" | "existing" | "account-changes" | "location-requests";

type LocationRequest = {
  id: string;
  nickname: string;
  shipping_address: string;
  license_number: string;
  license_expiry_date: string | null;
  license_photo_url: string | null;
  status: "pending" | "approved" | "rejected";
  reviewer_note: string | null;
  created_at: string;
  retailers: { id: string; business_name: string; contact_name: string; email: string } | null;
};

type AccountChange = {
  id: string;
  changes: Record<string, string>;
  old_values: Record<string, string>;
  status: "pending" | "approved" | "rejected";
  submitted_at: string;
  reviewed_at: string | null;
  reviewer_note: string | null;
  retailers: { id: string; business_name: string; contact_name: string; email: string } | null;
};

const FIELD_LABEL: Record<string, string> = {
  business_license_number: "Cannabis Retail Licence Number",
  license_expiry_date:     "Licence Expiry Date",
};

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
  type: "Retailer";
  approvedDate: string;
  totalOrders: number;
  accountStatus: "active" | "suspended";
};

const statusColors: Record<Status, string> = {
  pending: "#fbbf24", approved: "#4ade80", rejected: "#f87171",
};
const statusIcons = {
  pending: <Clock size={14} />, approved: <CheckCircle size={14} />, rejected: <XCircle size={14} />,
};

function daysUntil(dateStr: string) {
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000);
}

function LicenseLightbox({ src, licenseNo, business, onClose }: { src: string; licenseNo: string; business: string; onClose: () => void }) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.92)", backdropFilter: "blur(8px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div onClick={e => e.stopPropagation()} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "min(900px, calc(100% - 48px))", marginBottom: 16 }}>
        <div>
          <p style={{ margin: 0, color: "rgba(255,255,255,0.4)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>Cannabis Retail License</p>
          <p style={{ margin: "4px 0 0", color: "#fff", fontSize: 17, fontWeight: 700 }}>{business} <span style={{ color: "#00f6ff", fontWeight: 500 }}>· {licenseNo}</span></p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <a href={src} download={`license-${licenseNo}.png`} onClick={e => e.stopPropagation()} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: 700, textDecoration: "none", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            <Download size={13} /> Download
          </a>
          <button onClick={onClose} style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, borderRadius: 8, border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.7)", cursor: "pointer" }}>
            <X size={16} />
          </button>
        </div>
      </div>
      <div onClick={e => e.stopPropagation()} style={{ width: "min(900px, calc(100% - 48px))", borderRadius: 12, overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 32px 80px rgba(0,0,0,0.8)" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={`License ${licenseNo}`} style={{ width: "100%", height: "auto", display: "block" }} />
      </div>
      <p style={{ margin: "14px 0 0", color: "rgba(255,255,255,0.25)", fontSize: 12 }}>Click anywhere outside to close</p>
    </div>
  );
}

function EmailModal({ app, cred, onClose }: { app: Application; cred: CredState; onClose: () => void }) {
  const loginUrl = typeof window !== "undefined" ? `${window.location.origin}/login` : "https://leafcross.com/login";
  const subject  = `Your Leaf Cross Biomedical Retailer Account is Ready`;
  const body = `Hi ${app.name},\n\nYour retailer account with Leaf Cross Biomedical has been approved and is now active.\n\nHere are your login credentials:\n\n  Login URL : ${loginUrl}\n  Email     : ${cred.email}\n  Password  : ${cred.password}\n\nPlease log in and change your password after your first login.\n\nOnce logged in you will have access to:\n• Our private product menu with live pricing\n• Direct order submission\n• Order history and invoice records\n\nIf you have any questions, reply to this email or contact us directly.\n\nWelcome aboard!\n\nLeaf Cross Biomedical Team\ninfo@leafcross.com`;

  const [copied, setCopied] = useState(false);
  const copyAll = () => { navigator.clipboard.writeText(body); setCopied(true); setTimeout(() => setCopied(false), 2000); };

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
        <div style={{ marginBottom:16 }}>
          <p style={{ margin:"0 0 6px", color:"rgba(255,255,255,0.35)", fontSize:11, fontWeight:700, textTransform:"uppercase" }}>Subject</p>
          <p style={{ margin:0, color:"#fff", fontSize:14, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:8, padding:"10px 14px" }}>{subject}</p>
        </div>
        <div style={{ marginBottom:20 }}>
          <p style={{ margin:"0 0 6px", color:"rgba(255,255,255,0.35)", fontSize:11, fontWeight:700, textTransform:"uppercase" }}>Message</p>
          <pre style={{ margin:0, color:"rgba(255,255,255,0.85)", fontSize:13, lineHeight:1.75, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:10, padding:"16px 18px", whiteSpace:"pre-wrap", fontFamily:"inherit" }}>{body}</pre>
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <a href={`mailto:${app.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`} target="_blank" rel="noreferrer" style={{ display:"flex", alignItems:"center", gap:7, padding:"12px 24px", borderRadius:9, border:"none", cursor:"pointer", background:"#00f6ff", color:"#000", fontSize:13, fontWeight:800, textTransform:"uppercase", letterSpacing:"0.06em", textDecoration:"none" }}>
            Open in Email Client →
          </a>
          <button onClick={copyAll} style={{ display:"flex", alignItems:"center", gap:6, padding:"12px 20px", borderRadius:9, border:"1px solid rgba(255,255,255,0.15)", background:"rgba(255,255,255,0.06)", color: copied ? "#22c55e" : "rgba(255,255,255,0.6)", fontSize:13, fontWeight:700, cursor:"pointer" }}>
            <Copy size={13}/> {copied ? "Copied!" : "Copy Message"}
          </button>
        </div>
      </div>
    </div>
  );
}

type RetailerNote = { id: string; note: string; admin_email: string; created_at: string };

// ── Retailer detail / edit panel ─────────────────────────────────────────────
function RetailerDetailPanel({ user, onSaved }: {
  user: ExistingUser;
  onSaved: (patch: Partial<ExistingUser>) => void;
}) {
  const [form, setForm] = useState({
    business_name:           user.business,
    contact_name:            user.name,
    email:                   user.email,
    phone:                   user.phone,
    shipping_address:        user.address,
    business_license_number: user.license,
    license_expiry_date:     user.licenseExpiry,
    status:                  user.accountStatus,
  });
  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);
  const [error,  setError]  = useState("");
  const [notes,     setNotes]     = useState<RetailerNote[]>([]);
  const [notesLoaded, setNotesLoaded] = useState(false);
  const [newNote,   setNewNote]   = useState("");
  const [addingNote, setAddingNote] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/retailer-notes?retailer_id=${user.id}`)
      .then(r => r.json())
      .then(j => { if (j.data) setNotes(j.data); })
      .finally(() => setNotesLoaded(true));
  }, [user.id]);

  const field = (label: string, key: keyof typeof form, type = "text") => (
    <div key={key}>
      <p style={{ margin: "0 0 5px", color: "rgba(255,255,255,0.35)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</p>
      <input
        type={type}
        value={form[key]}
        onChange={e => { setForm(f => ({ ...f, [key]: e.target.value })); setSaved(false); }}
        style={{ width: "100%", boxSizing: "border-box", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, color: "#fff", fontSize: 13, padding: "9px 12px", outline: "none" }}
      />
    </div>
  );

  const save = async () => {
    setSaving(true); setError("");
    const res = await fetch("/api/admin/retailers", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: user.id, ...form }),
    });
    setSaving(false);
    if (res.ok) {
      setSaved(true);
      onSaved({
        business: form.business_name,
        name:     form.contact_name,
        email:    form.email,
        phone:    form.phone,
        address:  form.shipping_address,
        license:  form.business_license_number,
        licenseExpiry: form.license_expiry_date,
        accountStatus: form.status as "active" | "suspended",
      });
    } else {
      const j = await res.json();
      setError(j.error ?? "Save failed.");
    }
  };

  const toggleStatus = () => {
    const next = form.status === "active" ? "suspended" : "active";
    setForm(f => ({ ...f, status: next }));
    setSaved(false);
  };

  const addNote = async () => {
    if (!newNote.trim()) return;
    setAddingNote(true);
    const res = await fetch("/api/admin/retailer-notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ retailer_id: user.id, note: newNote.trim() }),
    });
    const j = await res.json();
    setAddingNote(false);
    if (j.data) {
      setNotes(prev => [j.data, ...prev]);
      setNewNote("");
    }
  };

  return (
    <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", padding: "22px 20px", display: "flex", flexDirection: "column", gap: 18 }}>
      {/* Status toggle */}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <p style={{ margin: 0, color: "rgba(255,255,255,0.35)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>Account Status</p>
        <button
          onClick={toggleStatus}
          style={{
            display: "flex", alignItems: "center", gap: 7,
            padding: "7px 18px", borderRadius: 999, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 800,
            background: form.status === "active" ? "rgba(74,222,128,0.15)" : "rgba(248,113,113,0.15)",
            color: form.status === "active" ? "#4ade80" : "#f87171",
          }}
        >
          {form.status === "active" ? <CheckCircle size={13} /> : <XCircle size={13} />}
          {form.status === "active" ? "Active — click to suspend" : "Suspended — click to reactivate"}
        </button>
      </div>

      {/* Fields grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
        {field("Business Name",    "business_name")}
        {field("Contact Name",     "contact_name")}
        {field("Email",            "email", "email")}
        {field("Phone",            "phone", "tel")}
        {field("Shipping Address", "shipping_address")}
        {field("License #",        "business_license_number")}
        {field("License Expiry",   "license_expiry_date", "date")}
      </div>

      {/* Save row */}
      {error && (
        <p style={{ margin: 0, color: "#f87171", fontSize: 13 }}>{error}</p>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button
          onClick={save}
          disabled={saving}
          style={{
            padding: "10px 28px", borderRadius: 8, border: "none", cursor: saving ? "not-allowed" : "pointer",
            background: saving ? "rgba(0,246,255,0.3)" : "#00f6ff",
            color: "#000", fontSize: 13, fontWeight: 800,
            textTransform: "uppercase", letterSpacing: "0.08em",
          }}
        >
          {saving ? "Saving…" : "Save Changes"}
        </button>
        {saved && <span style={{ color: "#4ade80", fontSize: 13, fontWeight: 700 }}>✓ Saved</span>}
        <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 12, marginLeft: "auto" }}>
          {user.totalOrders} total order{user.totalOrders !== 1 ? "s" : ""} · joined {user.approvedDate}
        </span>
      </div>

      {/* ── CRM Notes Log ── */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 18 }}>
        <p style={{ margin: "0 0 12px", color: "rgba(255,255,255,0.35)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
          Notes Log
        </p>

        {/* Add new note */}
        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          <textarea
            value={newNote}
            onChange={e => setNewNote(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) addNote(); }}
            placeholder="Add a note… (⌘Enter to save)"
            rows={2}
            style={{
              flex: 1, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: 8, color: "#fff", fontSize: 13, padding: "9px 12px",
              outline: "none", resize: "vertical", boxSizing: "border-box",
            }}
          />
          <button
            onClick={addNote}
            disabled={addingNote || !newNote.trim()}
            style={{
              alignSelf: "flex-end", padding: "9px 18px", borderRadius: 8, border: "none",
              cursor: addingNote || !newNote.trim() ? "not-allowed" : "pointer",
              background: addingNote || !newNote.trim() ? "rgba(0,246,255,0.2)" : "#00f6ff",
              color: "#000", fontSize: 12, fontWeight: 800,
              textTransform: "uppercase", letterSpacing: "0.06em",
            }}
          >
            {addingNote ? "…" : "Add"}
          </button>
        </div>

        {/* Notes list */}
        {!notesLoaded && (
          <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 13 }}>Loading notes…</p>
        )}
        {notesLoaded && notes.length === 0 && (
          <p style={{ color: "rgba(255,255,255,0.2)", fontSize: 13 }}>No notes yet.</p>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {notes.map(n => {
            const ts = new Date(n.created_at);
            const dateStr = ts.toLocaleDateString("en-CA", { year: "numeric", month: "short", day: "numeric" });
            const timeStr = ts.toLocaleTimeString("en-CA", { hour: "2-digit", minute: "2-digit" });
            return (
              <div key={n.id} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 8, padding: "12px 14px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <span style={{ color: "#00f6ff", fontSize: 11, fontWeight: 700 }}>{n.admin_email}</span>
                  <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 11 }}>·</span>
                  <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 11 }}>{dateStr} at {timeStr}</span>
                </div>
                <p style={{ margin: 0, color: "rgba(255,255,255,0.85)", fontSize: 13, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{n.note}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function RetailerApprovalsClient() {
  const [section, setSection]   = useState<Section>("applications");
  const [apps, setApps]         = useState<Application[]>([]);
  const [existing, setExisting] = useState<ExistingUser[]>([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState<Status | "all">("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [licenseView, setLicenseView] = useState<{ src: string; licenseNo: string; business: string } | null>(null);
  const [emailModal, setEmailModal]   = useState<string | null>(null);
  const [creds, setCreds] = useState<Record<string, CredState>>({});

  // Account changes state
  const [accountChanges, setAccountChanges]   = useState<AccountChange[]>([]);
  const [changesLoading, setChangesLoading]   = useState(false);
  const [reviewNote, setReviewNote]           = useState<Record<string, string>>({});
  const [reviewLoading, setReviewLoading]     = useState<string | null>(null);
  const [reviewResult, setReviewResult]       = useState<Record<string, "approved" | "rejected" | null>>({});

  // Location requests state
  const [locationRequests, setLocationRequests] = useState<LocationRequest[]>([]);
  const [locLoading, setLocLoading]             = useState(false);
  const [locNote, setLocNote]                   = useState<Record<string, string>>({});
  const [locReviewLoading, setLocReviewLoading] = useState<string | null>(null);
  const [locResult, setLocResult]               = useState<Record<string, "approved" | "rejected" | null>>({});
  const [locLicenseView, setLocLicenseView]     = useState<{ src: string; licenseNo: string; business: string } | null>(null);

  const loadApplications = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/applications");
    const json = await res.json();
    if (json.data) {
      setApps(json.data.map((row: Record<string, unknown>) => ({
        id:           row.id as string,
        name:         (row.contact_name as string) || "",
        business:     (row.business_name as string) || "",
        email:        (row.email as string) || "",
        phone:        (row.phone as string) || "",
        address:      [row.business_address, row.city, row.province, row.postal_code, row.country].filter(Boolean).join(", "),
        license:      (row.business_license_number as string) || "",
        licenseExpiry:(row.license_expiry_date as string) || "",
        licenseImage: (row.license_document_path as string) || "https://placehold.co/900x600/1a1a1a/ffffff?text=No+License+Uploaded",
        type:         "Retailer" as const,
        submitted:    ((row.created_at as string) || "").split("T")[0],
        status:       (row.status as Status) || "pending",
        notes:        (row.admin_notes as string) || (row.rejection_reason as string) || "",
      })));
    }
    // Load existing users from retailers table
    const r2 = await fetch("/api/admin/orders"); // reuse admin auth check
    // Actually load retailers separately
    try {
      const retailersRes = await fetch("/api/admin/retailers");
      const retailersJson = await retailersRes.json();
      if (retailersJson.data) {
        setExisting(retailersJson.data.map((row: Record<string, unknown>) => ({
          id:            row.id as string,
          name:          (row.contact_name as string) || "",
          business:      (row.business_name as string) || "",
          email:         (row.email as string) || "",
          phone:         (row.phone as string) || "",
          address:       (row.shipping_address as string) || (row.billing_address as string) || "",
          license:       (row.business_license_number as string) || "",
          licenseExpiry: (row.license_expiry_date as string) || "",
          type:          "Retailer" as const,
          approvedDate:  ((row.approved_at as string) || (row.created_at as string) || "").split("T")[0],
          totalOrders:   (row.order_count as number) || 0,
          accountStatus: (row.status as "active" | "suspended") || "active",
        })));
      }
    } catch { /* retailers API may not exist yet */ }
    setLoading(false);
  };

  const loadAccountChanges = async () => {
    setChangesLoading(true);
    try {
      const res  = await fetch("/api/admin/account-changes");
      const json = await res.json();
      if (json.data) setAccountChanges(json.data);
    } finally {
      setChangesLoading(false);
    }
  };

  const loadLocationRequests = async () => {
    setLocLoading(true);
    try {
      const res  = await fetch("/api/admin/locations");
      const json = await res.json();
      if (json.data) setLocationRequests(json.data);
    } finally {
      setLocLoading(false);
    }
  };

  const reviewLocation = async (id: string, action: "approve" | "reject") => {
    setLocReviewLoading(id);
    const res = await fetch("/api/admin/locations", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action, reviewer_note: locNote[id] || "" }),
    });
    setLocReviewLoading(null);
    if (res.ok) {
      setLocResult(prev => ({ ...prev, [id]: action === "approve" ? "approved" : "rejected" }));
      setLocationRequests(prev => prev.map(l => l.id === id ? { ...l, status: action === "approve" ? "approved" : "rejected" } : l));
    }
  };

  const reviewChange = async (id: string, action: "approve" | "reject") => {
    setReviewLoading(id);
    const res = await fetch("/api/admin/account-changes", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action, reviewer_note: reviewNote[id] || "" }),
    });
    setReviewLoading(null);
    if (res.ok) {
      setReviewResult(prev => ({ ...prev, [id]: action === "approve" ? "approved" : "rejected" }));
      setAccountChanges(prev => prev.map(c => c.id === id ? { ...c, status: action === "approve" ? "approved" : "rejected" } : c));
    }
  };

  useEffect(() => { loadApplications(); }, []);

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
        body: JSON.stringify({ email: cred.email, password: cred.password, business: app.business, name: app.name, type: app.type, applicationId: app.id }),
      });
      const json = await res.json();
      if (!res.ok) patchCred(app.id, { loading: false, error: json.error ?? "Something went wrong." });
      else          patchCred(app.id, { loading: false, done: true });
    } catch {
      patchCred(app.id, { loading: false, error: "Network error. Please try again." });
    }
  };

  const setStatus = async (id: string, status: Status) => {
    await fetch("/api/admin/applications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    setApps(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  const setNotes = (id: string, notes: string) =>
    setApps(prev => prev.map(a => a.id === id ? { ...a, notes } : a));

  const saveNotes = async (id: string, notes: string) => {
    await fetch("/api/admin/applications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, admin_notes: notes }),
    });
  };

  const counts = { all: apps.length, pending: 0, approved: 0, rejected: 0 };
  apps.forEach(a => counts[a.status]++);
  const visible = filter === "all" ? apps : apps.filter(a => a.status === filter);

  return (
    <div>
      {licenseView && (
        <LicenseLightbox src={licenseView.src} licenseNo={licenseView.licenseNo} business={licenseView.business} onClose={() => setLicenseView(null)} />
      )}
      {emailModal && (() => {
        const app = apps.find(a => a.id === emailModal);
        if (!app) return null;
        return <EmailModal app={app} cred={getCred(app)} onClose={() => setEmailModal(null)} />;
      })()}

      {/* Section tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 28, borderBottom: "1px solid rgba(255,255,255,0.1)", flexWrap: "wrap" }}>
        {[
          { key: "applications",      label: "Applications" },
          { key: "existing",          label: "Existing Users" },
          { key: "account-changes",   label: `Account Changes${accountChanges.filter(c => c.status === "pending").length > 0 ? ` (${accountChanges.filter(c => c.status === "pending").length})` : ""}` },
          { key: "location-requests", label: `Location Requests${locationRequests.filter(l => l.status === "pending").length > 0 ? ` (${locationRequests.filter(l => l.status === "pending").length})` : ""}` },
        ].map(({ key, label }) => (
          <button key={key} onClick={() => {
            setSection(key as Section);
            if (key === "account-changes") loadAccountChanges();
            if (key === "location-requests") loadLocationRequests();
          }} style={{
            background: "none", border: "none", cursor: "pointer",
            padding: "10px 24px", fontSize: 13, fontWeight: 700,
            textTransform: "uppercase", letterSpacing: "0.08em",
            color: section === key ? "#00b8cc" : "rgba(255,255,255,0.5)",
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
                background: filter === f ? "#00b8cc" : "rgba(255,255,255,0.08)",
                color: filter === f ? "#000" : "rgba(255,255,255,0.7)",
                border: filter === f ? "none" : "1px solid rgba(255,255,255,0.15)",
              }}>
                {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)} ({counts[f]})
              </button>
            ))}
            <button onClick={loadApplications} style={{ marginLeft: "auto", padding: "6px 14px", borderRadius: 999, cursor: "pointer", fontSize: 12, fontWeight: 700, background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.15)" }}>
              ↻ Refresh
            </button>
          </div>

          {loading && <p style={{ textAlign: "center", color: "rgba(255,255,255,0.4)", padding: "40px 0" }}>Loading applications…</p>}

          {!loading && visible.length === 0 && (
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
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: `${statusColors[app.status]}20`, color: statusColors[app.status], fontSize: 11, fontWeight: 700, textTransform: "uppercase", padding: "4px 10px", borderRadius: 999 }}>
                    {statusIcons[app.status]} {app.status}
                  </span>
                  <span style={{ color: "#60a5fa", fontSize: 12, fontWeight: 700 }}>{app.type}</span>
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

                    {app.licenseImage && !app.licenseImage.includes("No+License") && (
                      <div onClick={() => setLicenseView({ src: app.licenseImage, licenseNo: app.license, business: app.business })} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 16px", borderRadius: 10, border: "1px solid rgba(0,246,255,0.2)", background: "rgba(0,246,255,0.04)", cursor: "pointer" }}>
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
                    )}

                    <div>
                      <p style={{ margin: "0 0 8px", color: "rgba(255,255,255,0.35)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em" }}>Admin Notes</p>
                      <textarea value={app.notes} onChange={e => setNotes(app.id, e.target.value)} placeholder="Add notes about this application..." rows={3} style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, color: "#fff", fontSize: 14, padding: "10px 12px", outline: "none", resize: "vertical", boxSizing: "border-box", marginBottom: 8 }} />
                      <button
                        onClick={() => saveNotes(app.id, app.notes)}
                        style={{ padding: "7px 18px", borderRadius: 7, border: "none", cursor: "pointer", background: "rgba(0,246,255,0.15)", color: "#00f6ff", fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em" }}
                      >
                        Save Note
                      </button>
                    </div>

                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                      <button onClick={() => setStatus(app.id, "approved")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 24px", borderRadius: 8, border: "none", cursor: "pointer", background: app.status === "approved" ? "#16a34a" : "rgba(74,222,128,0.15)", color: "#4ade80", fontSize: 13, fontWeight: 700 }}>
                        <CheckCircle size={15} /> Approve
                      </button>
                      <button onClick={() => setStatus(app.id, "rejected")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 24px", borderRadius: 8, border: "none", cursor: "pointer", background: app.status === "rejected" ? "#dc2626" : "rgba(248,113,113,0.15)", color: "#f87171", fontSize: 13, fontWeight: 700 }}>
                        <XCircle size={15} /> Reject
                      </button>
                      <button onClick={() => setStatus(app.id, "pending")} style={{ padding: "10px 24px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.12)", background: "none", color: "rgba(255,255,255,0.4)", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                        Reset to Pending
                      </button>
                    </div>

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
          <div style={{ display: "grid", gridTemplateColumns: "1fr 90px 110px 90px 60px 28px", gap: 12, padding: "0 16px", color: "rgba(255,255,255,0.45)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            <span>Business</span><span>Status</span><span>License Expiry</span><span>Approved</span><span>Orders</span><span/>
          </div>

          {existing.length === 0 && !loading && (
            <div style={{ textAlign: "center", padding: "60px 0", color: "rgba(255,255,255,0.3)", fontSize: 15 }}>
              No existing users yet.
            </div>
          )}

          {existing.map(user => {
            const days = daysUntil(user.licenseExpiry);
            const expiringSoon = days > 0 && days <= 60;
            const isExpanded = expanded === user.id;

            return (
              <div key={user.id} style={{ background: "#111", border: `1px solid ${expiringSoon ? "rgba(251,191,36,0.3)" : "rgba(255,255,255,0.07)"}`, borderRadius: 12, overflow: "hidden" }}>
                {/* Row */}
                <div onClick={() => setExpanded(isExpanded ? null : user.id)} style={{ display: "grid", gridTemplateColumns: "1fr 90px 110px 90px 60px 28px", gap: 12, alignItems: "center", padding: "16px", cursor: "pointer" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <p style={{ margin: 0, color: "#fff", fontSize: 14, fontWeight: 700 }}>{user.business}</p>
                      {expiringSoon && <AlertTriangle size={14} color="#fbbf24" />}
                    </div>
                    <p style={{ margin: "3px 0 0", color: "rgba(255,255,255,0.4)", fontSize: 12 }}>{user.name} · {user.email}</p>
                  </div>
                  <span style={{ color: user.accountStatus === "active" ? "#4ade80" : "#f87171", fontSize: 11, fontWeight: 700, textTransform: "capitalize" }}>{user.accountStatus}</span>
                  <div>
                    <p style={{ margin: 0, color: expiringSoon ? "#fbbf24" : "#fff", fontSize: 13, fontWeight: 600 }}>{user.licenseExpiry || "—"}</p>
                    {expiringSoon && <p style={{ margin: "2px 0 0", color: "#fbbf24", fontSize: 11 }}>{days}d remaining</p>}
                  </div>
                  <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>{user.approvedDate}</span>
                  <span style={{ color: "#00f6ff", fontSize: 14, fontWeight: 700 }}>{user.totalOrders}</span>
                  {isExpanded ? <ChevronUp size={16} color="rgba(255,255,255,0.4)" /> : <ChevronDown size={16} color="rgba(255,255,255,0.4)" />}
                </div>

                {/* Expanded detail / edit panel */}
                {isExpanded && (
                  <RetailerDetailPanel
                    user={user}
                    onSaved={(patch) => setExisting(prev => prev.map(u => u.id === user.id ? { ...u, ...patch } : u))}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── LOCATION REQUESTS ── */}
      {section === "location-requests" && (
        <div>
          {locLicenseView && (
            <LicenseLightbox src={locLicenseView.src} licenseNo={locLicenseView.licenseNo} business={locLicenseView.business} onClose={() => setLocLicenseView(null)} />
          )}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <p style={{ margin: 0, color: "rgba(255,255,255,0.5)", fontSize: 13 }}>
              New and updated shipping locations submitted by retailers, requiring admin approval.
            </p>
            <button onClick={loadLocationRequests} style={{ padding: "6px 14px", borderRadius: 999, cursor: "pointer", fontSize: 12, fontWeight: 700, background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.15)" }}>
              ↻ Refresh
            </button>
          </div>

          {locLoading && <div style={{ textAlign: "center", padding: "48px 0", color: "rgba(255,255,255,0.35)" }}>Loading…</div>}

          {!locLoading && locationRequests.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 0", color: "rgba(0,0,0,0.35)", fontSize: 15 }}>No location requests.</div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {locationRequests.map(loc => {
              const isPending  = loc.status === "pending";
              const wasDone    = locResult[loc.id];
              const statusColor = loc.status === "pending" ? "#fbbf24" : loc.status === "approved" ? "#4ade80" : "#f87171";
              const date = new Date(loc.created_at).toLocaleDateString("en-CA", { year: "numeric", month: "short", day: "numeric" });
              const r = loc.retailers;

              return (
                <div key={loc.id} style={{
                  background: "#111",
                  border: `1px solid ${isPending ? "rgba(251,191,36,0.3)" : "rgba(255,255,255,0.07)"}`,
                  borderRadius: 12, padding: "20px 22px",
                }}>
                  {/* Header */}
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
                    <div>
                      <p style={{ margin: "0 0 3px", color: "#fff", fontSize: 15, fontWeight: 700 }}>
                        {r?.business_name ?? "—"}
                        {loc.nickname && <span style={{ color: "rgba(255,255,255,0.4)", fontWeight: 400, fontSize: 13 }}> · {loc.nickname}</span>}
                      </p>
                      <p style={{ margin: 0, color: "rgba(255,255,255,0.4)", fontSize: 12 }}>{r?.contact_name} · {r?.email}</p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: 999, background: `${statusColor}20`, color: statusColor, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                        {loc.status}
                      </span>
                      <p style={{ margin: "4px 0 0", color: "rgba(255,255,255,0.3)", fontSize: 11 }}>{date}</p>
                    </div>
                  </div>

                  {/* Location details */}
                  <div style={{ marginBottom: 16, padding: "12px 16px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 8 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
                      {[
                        ["Nickname",         loc.nickname || "—"],
                        ["Shipping Address", loc.shipping_address || "—"],
                        ["Licence Number",   loc.license_number || "—"],
                        ["Licence Expiry",   loc.license_expiry_date ? new Date(loc.license_expiry_date + "T00:00:00").toLocaleDateString("en-CA", { year: "numeric", month: "short", day: "numeric" }) : "—"],
                      ].map(([label, value]) => (
                        <div key={label}>
                          <p style={{ margin: "0 0 3px", color: "rgba(255,255,255,0.35)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</p>
                          <p style={{ margin: 0, color: "#fff", fontSize: 13 }}>{value}</p>
                        </div>
                      ))}
                    </div>

                    {/* License photo */}
                    {loc.license_photo_url && (
                      <div
                        onClick={() => setLocLicenseView({ src: loc.license_photo_url!, licenseNo: loc.license_number, business: r?.business_name ?? "" })}
                        style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 14, padding: "12px 16px", borderRadius: 10, border: "1px solid rgba(0,246,255,0.2)", background: "rgba(0,246,255,0.04)", cursor: "pointer" }}
                      >
                        <div style={{ width: 80, height: 52, borderRadius: 6, overflow: "hidden", flexShrink: 0, border: "1px solid rgba(255,255,255,0.1)" }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={loc.license_photo_url} alt="license" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </div>
                        <div>
                          <p style={{ margin: 0, color: "#00f6ff", fontSize: 13, fontWeight: 700 }}>Licence Document</p>
                          <p style={{ margin: "2px 0 0", color: "rgba(255,255,255,0.4)", fontSize: 12 }}>Click to view full size</p>
                        </div>
                        <FileImage size={18} color="#00f6ff" style={{ flexShrink: 0, marginLeft: "auto" }} />
                      </div>
                    )}
                  </div>

                  {/* Actions (only for pending) */}
                  {isPending && !wasDone && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      <div>
                        <p style={{ margin: "0 0 6px", color: "rgba(255,255,255,0.35)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>Note to Retailer (optional)</p>
                        <input
                          type="text"
                          placeholder="Reason for rejection, or approval note…"
                          value={locNote[loc.id] ?? ""}
                          onChange={e => setLocNote(prev => ({ ...prev, [loc.id]: e.target.value }))}
                          style={{ width: "100%", boxSizing: "border-box", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, color: "#fff", fontSize: 13, padding: "9px 12px", outline: "none" }}
                        />
                      </div>
                      <div style={{ display: "flex", gap: 10 }}>
                        <button
                          onClick={() => reviewLocation(loc.id, "approve")}
                          disabled={locReviewLoading === loc.id}
                          style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 24px", borderRadius: 8, border: "none", cursor: "pointer", background: "rgba(74,222,128,0.15)", color: "#4ade80", fontSize: 13, fontWeight: 700, opacity: locReviewLoading === loc.id ? 0.5 : 1 }}
                        >
                          <CheckCircle size={14} /> {locReviewLoading === loc.id ? "Processing…" : "Approve"}
                        </button>
                        <button
                          onClick={() => reviewLocation(loc.id, "reject")}
                          disabled={locReviewLoading === loc.id}
                          style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 24px", borderRadius: 8, border: "none", cursor: "pointer", background: "rgba(248,113,113,0.15)", color: "#f87171", fontSize: 13, fontWeight: 700, opacity: locReviewLoading === loc.id ? 0.5 : 1 }}
                        >
                          <XCircle size={14} /> Reject
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Post-review confirmation */}
                  {wasDone && (
                    <p style={{ margin: 0, color: wasDone === "approved" ? "#4ade80" : "#f87171", fontSize: 13, fontWeight: 700 }}>
                      {wasDone === "approved" ? "✓ Approved — retailer notified." : "✗ Rejected — retailer notified."}
                    </p>
                  )}

                  {/* Previously reviewed note */}
                  {!isPending && loc.reviewer_note && (
                    <p style={{ margin: "12px 0 0", color: "rgba(255,255,255,0.4)", fontSize: 12, fontStyle: "italic" }}>
                      Note: {loc.reviewer_note}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── ACCOUNT CHANGES ── */}
      {section === "account-changes" && (
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <p style={{ margin: 0, color: "rgba(255,255,255,0.5)", fontSize: 13 }}>
              Compliance update requests submitted by retailer account holders requiring admin review.
            </p>
            <button onClick={loadAccountChanges} style={{ padding: "6px 14px", borderRadius: 999, cursor: "pointer", fontSize: 12, fontWeight: 700, background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.15)" }}>
              ↻ Refresh
            </button>
          </div>

          {changesLoading && (
            <div style={{ textAlign: "center", padding: "48px 0", color: "rgba(255,255,255,0.35)" }}>Loading…</div>
          )}

          {!changesLoading && accountChanges.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 0", color: "rgba(0,0,0,0.35)", fontSize: 15 }}>
              No account change requests.
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {accountChanges.map(change => {
              const isPending  = change.status === "pending";
              const wasApproved = reviewResult[change.id] === "approved";
              const wasRejected = reviewResult[change.id] === "rejected";
              const statusColor = change.status === "pending" ? "#fbbf24" : change.status === "approved" ? "#4ade80" : "#f87171";
              const date = new Date(change.submitted_at).toLocaleDateString("en-CA", { year: "numeric", month: "short", day: "numeric" });
              const r = change.retailers;

              return (
                <div key={change.id} style={{ background: "#111", border: `1px solid ${isPending ? "rgba(251,191,36,0.3)" : "rgba(255,255,255,0.07)"}`, borderRadius: 12, padding: "20px 22px" }}>
                  {/* Header */}
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
                    <div>
                      <p style={{ margin: "0 0 3px", color: "#fff", fontSize: 15, fontWeight: 700 }}>{r?.business_name ?? "—"}</p>
                      <p style={{ margin: 0, color: "rgba(255,255,255,0.4)", fontSize: 12 }}>{r?.contact_name} · {r?.email}</p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: 999, background: `${statusColor}20`, color: statusColor, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                        {change.status}
                      </span>
                      <p style={{ margin: "4px 0 0", color: "rgba(255,255,255,0.3)", fontSize: 11 }}>{date}</p>
                    </div>
                  </div>

                  {/* Change details */}
                  <div style={{ marginBottom: 16, padding: "12px 16px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 8 }}>
                    <p style={{ margin: "0 0 10px", color: "rgba(255,255,255,0.35)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>Proposed Changes</p>
                    {Object.entries(change.changes).map(([field, newVal]) => (
                      <div key={field} style={{ display: "grid", gridTemplateColumns: "200px 1fr 1fr", gap: 12, alignItems: "center", padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                        <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>{FIELD_LABEL[field] ?? field}</span>
                        <div>
                          <p style={{ margin: "0 0 2px", color: "rgba(255,255,255,0.25)", fontSize: 10, textTransform: "uppercase" }}>Current</p>
                          <p style={{ margin: 0, color: "rgba(255,255,255,0.5)", fontSize: 13 }}>{change.old_values?.[field] || "—"}</p>
                        </div>
                        <div>
                          <p style={{ margin: "0 0 2px", color: "rgba(0,246,255,0.5)", fontSize: 10, textTransform: "uppercase" }}>Proposed</p>
                          <p style={{ margin: 0, color: "#fff", fontSize: 13, fontWeight: 700 }}>{newVal}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Reviewer note + actions (only for pending) */}
                  {isPending && !wasApproved && !wasRejected && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      <div>
                        <p style={{ margin: "0 0 6px", color: "rgba(255,255,255,0.35)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>Note to Retailer (optional)</p>
                        <input
                          type="text"
                          placeholder="Reason for rejection, or approval note…"
                          value={reviewNote[change.id] ?? ""}
                          onChange={e => setReviewNote(prev => ({ ...prev, [change.id]: e.target.value }))}
                          style={{ width: "100%", boxSizing: "border-box", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, color: "#fff", fontSize: 13, padding: "9px 12px", outline: "none" }}
                        />
                      </div>
                      <div style={{ display: "flex", gap: 10 }}>
                        <button
                          onClick={() => reviewChange(change.id, "approve")}
                          disabled={reviewLoading === change.id}
                          style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 24px", borderRadius: 8, border: "none", cursor: "pointer", background: "rgba(74,222,128,0.15)", color: "#4ade80", fontSize: 13, fontWeight: 700, opacity: reviewLoading === change.id ? 0.5 : 1 }}
                        >
                          <CheckCircle size={14} /> {reviewLoading === change.id ? "Processing…" : "Approve"}
                        </button>
                        <button
                          onClick={() => reviewChange(change.id, "reject")}
                          disabled={reviewLoading === change.id}
                          style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 24px", borderRadius: 8, border: "none", cursor: "pointer", background: "rgba(248,113,113,0.15)", color: "#f87171", fontSize: 13, fontWeight: 700, opacity: reviewLoading === change.id ? 0.5 : 1 }}
                        >
                          <XCircle size={14} /> Reject
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Post-review confirmation */}
                  {(wasApproved || wasRejected) && (
                    <p style={{ margin: 0, color: wasApproved ? "#4ade80" : "#f87171", fontSize: 13, fontWeight: 700 }}>
                      {wasApproved ? "✓ Approved — retailer notified." : "✗ Rejected — retailer notified."}
                    </p>
                  )}

                  {/* Already-reviewed note */}
                  {!isPending && change.reviewer_note && (
                    <p style={{ margin: "12px 0 0", color: "rgba(255,255,255,0.4)", fontSize: 12, fontStyle: "italic" }}>
                      Note: {change.reviewer_note}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
