"use client";
import { useState, useEffect, useRef } from "react";
import { CheckCircle, Clock, XCircle, AlertTriangle, Save, Plus, Trash2, MapPin, Upload, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Retailer = {
  id: string;
  business_name: string;
  contact_name: string;
  email: string;
  phone: string;
  store_address: string;
  billing_address: string;
  shipping_address: string;
  primary_purchasing_contact: string;
  payment_contact: string;
  business_license_number: string;
  license_expiry_date: string;
  status: string;
};

type AccountChange = {
  id: string;
  changes: Record<string, string>;
  old_values: Record<string, string>;
  status: "pending" | "approved" | "rejected";
  submitted_at: string;
  reviewed_at: string | null;
  reviewer_note: string | null;
};

const FIELD_LABEL: Record<string, string> = {
  business_license_number: "Cannabis Retail Licence Number",
  license_expiry_date:     "Licence Expiry Date",
};

const fieldStyle: React.CSSProperties = {
  width: "100%", boxSizing: "border-box",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 8, color: "#fff", fontSize: 14,
  padding: "10px 12px", outline: "none",
};

const labelStyle: React.CSSProperties = {
  display: "block", marginBottom: 6,
  color: "rgba(255,255,255,0.4)",
  fontSize: 11, fontWeight: 700,
  textTransform: "uppercase", letterSpacing: "0.08em",
};

function Field({ label, value, onChange, type = "text", readOnly = false, hint }: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; readOnly?: boolean; hint?: string;
}) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        readOnly={readOnly}
        style={{
          ...fieldStyle,
          ...(readOnly ? { opacity: 0.45, cursor: "not-allowed" } : {}),
        }}
      />
      {hint && <p style={{ margin: "5px 0 0", color: "rgba(255,255,255,0.3)", fontSize: 11 }}>{hint}</p>}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 36 }}>
      <p style={{ margin: "0 0 18px", color: "rgba(255,255,255,0.35)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", borderBottom: "1px solid rgba(255,255,255,0.07)", paddingBottom: 10 }}>
        {title}
      </p>
      <div className="rGrid2">
        {children}
      </div>
    </div>
  );
}

function ChangeHistory({ changes }: { changes: AccountChange[] }) {
  if (!changes.length) return null;

  const statusCfg = {
    pending:  { color: "#fbbf24", Icon: Clock,       label: "Pending Review" },
    approved: { color: "#4ade80", Icon: CheckCircle, label: "Approved" },
    rejected: { color: "#f87171", Icon: XCircle,     label: "Rejected" },
  };

  return (
    <div style={{ marginTop: 40 }}>
      <p style={{ margin: "0 0 16px", color: "rgba(255,255,255,0.35)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", borderBottom: "1px solid rgba(255,255,255,0.07)", paddingBottom: 10 }}>
        Compliance Change History
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {changes.map(change => {
          const cfg = statusCfg[change.status];
          const date = new Date(change.submitted_at).toLocaleDateString("en-CA", { year: "numeric", month: "short", day: "numeric" });
          return (
            <div key={change.id} style={{
              background: "#111",
              border: `1px solid ${cfg.color}30`,
              borderRadius: 10, padding: "14px 18px",
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: cfg.color, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  <cfg.Icon size={13} /> {cfg.label}
                </span>
                <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 12 }}>Submitted {date}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {Object.entries(change.changes).map(([field, newVal]) => (
                  <div key={field} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, minWidth: 200 }}>
                      {FIELD_LABEL[field] ?? field}
                    </span>
                    <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>
                      <span style={{ textDecoration: "line-through" }}>{change.old_values?.[field] || "—"}</span>
                    </span>
                    <span style={{ color: "#fff", fontSize: 12 }}>→ {newVal}</span>
                  </div>
                ))}
              </div>
              {change.reviewer_note && (
                <p style={{ margin: "10px 0 0", color: "rgba(255,255,255,0.5)", fontSize: 12, fontStyle: "italic" }}>
                  Note: {change.reviewer_note}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Location types ───────────────────────────────────────────────────────────

type Location = {
  id: string;
  nickname: string;
  shipping_address: string;
  license_number: string;
  license_expiry_date: string;
  license_photo_url: string | null;
  status?: "pending" | "approved" | "rejected";
  reviewer_note?: string | null;
};

type LocationDraft = Omit<Location, "id">;

const emptyDraft = (): LocationDraft => ({
  nickname: "",
  shipping_address: "",
  license_number: "",
  license_expiry_date: "",
  license_photo_url: null,
});

const MAX_LOCATIONS = 8;

function LocationsSection() {
  const [locations, setLocations]     = useState<Location[]>([]);
  const [loading, setLoading]         = useState(true);
  const [showForm, setShowForm]       = useState(false);
  const [draft, setDraft]             = useState<LocationDraft>(emptyDraft());
  const [saving, setSaving]           = useState(false);
  const [deleting, setDeleting]       = useState<string | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [error, setError]             = useState<string | null>(null);
  const [success, setSuccess]         = useState<string | null>(null);
  const fileInputRef                  = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/retailer/locations");
    const json = await res.json();
    if (json.data) setLocations(json.data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handlePhotoUpload = async (file: File) => {
    setUploadingPhoto(true);
    setError(null);
    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("retailer-licenses")
        .upload(path, file, { upsert: true });
      if (upErr) throw new Error(upErr.message);
      const { data: urlData } = supabase.storage
        .from("retailer-licenses")
        .getPublicUrl(path);
      setDraft(prev => ({ ...prev, license_photo_url: urlData.publicUrl }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Photo upload failed");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleAdd = async () => {
    if (!draft.nickname.trim() || !draft.shipping_address.trim() || !draft.license_number.trim()) {
      setError("Location name, shipping address, and licence number are required.");
      return;
    }
    setSaving(true);
    setError(null);
    const res = await fetch("/api/retailer/locations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });
    const json = await res.json();
    setSaving(false);
    if (!res.ok) { setError(json.error ?? "Failed to save"); return; }
    setLocations(prev => [...prev, json.data]);
    setDraft(emptyDraft());
    setShowForm(false);
    setSuccess("Location submitted for admin approval. It will be active once reviewed.");
    setTimeout(() => setSuccess(null), 6000);
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    await fetch("/api/retailer/locations", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setLocations(prev => prev.filter(l => l.id !== id));
    setDeleting(null);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", boxSizing: "border-box",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 8, color: "#fff", fontSize: 14,
    padding: "10px 12px", outline: "none",
  };

  return (
    <div style={{ marginBottom: 36 }}>
      {/* Section header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18, borderBottom: "1px solid rgba(255,255,255,0.07)", paddingBottom: 10 }}>
        <p style={{ margin: 0, color: "rgba(255,255,255,0.35)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>
          Store Locations ({locations.length}/{MAX_LOCATIONS})
        </p>
        {locations.length < MAX_LOCATIONS && (
          <button
            onClick={() => { setShowForm(v => !v); setError(null); }}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 16px", borderRadius: 8, border: "none", cursor: "pointer", background: showForm ? "rgba(255,255,255,0.08)" : "rgba(0,246,255,0.12)", color: showForm ? "rgba(255,255,255,0.5)" : "#00f6ff", fontSize: 12, fontWeight: 700 }}
          >
            {showForm ? <><X size={12} /> Cancel</> : <><Plus size={12} /> Add Location</>}
          </button>
        )}
      </div>

      {/* Success / error banners */}
      {success && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.25)", borderRadius: 8, marginBottom: 16 }}>
          <CheckCircle size={13} color="#4ade80" />
          <p style={{ margin: 0, color: "#4ade80", fontSize: 13 }}>{success}</p>
        </div>
      )}
      {error && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.25)", borderRadius: 8, marginBottom: 16 }}>
          <AlertTriangle size={13} color="#f87171" />
          <p style={{ margin: 0, color: "#f87171", fontSize: 13 }}>{error}</p>
        </div>
      )}

      {/* Add location form */}
      {showForm && (
        <div style={{ background: "rgba(0,246,255,0.03)", border: "1px solid rgba(0,246,255,0.15)", borderRadius: 12, padding: "20px 22px", marginBottom: 20 }}>
          <p style={{ margin: "0 0 16px", color: "#00f6ff", fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em" }}>New Location</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
            <div>
              <label style={labelStyle}>Location Name / Nickname *</label>
              <input value={draft.nickname} onChange={e => setDraft(p => ({ ...p, nickname: e.target.value }))} placeholder="e.g. Downtown Store" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Shipping Address *</label>
              <input value={draft.shipping_address} onChange={e => setDraft(p => ({ ...p, shipping_address: e.target.value }))} placeholder="123 Main St, City, Province" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Cannabis Retail Licence Number *</label>
              <input value={draft.license_number} onChange={e => setDraft(p => ({ ...p, license_number: e.target.value }))} placeholder="CRL-XXXXXX" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Licence Expiry Date</label>
              <input type="date" value={draft.license_expiry_date} onChange={e => setDraft(p => ({ ...p, license_expiry_date: e.target.value }))} style={inputStyle} />
            </div>
          </div>

          {/* Photo upload */}
          <div style={{ marginBottom: 18 }}>
            <label style={labelStyle}>Licence Photo</label>
            <input ref={fileInputRef} type="file" accept="image/*,application/pdf" style={{ display: "none" }}
              onChange={e => { const f = e.target.files?.[0]; if (f) handlePhotoUpload(f); e.target.value = ""; }} />
            {draft.license_photo_url ? (
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <a href={draft.license_photo_url} target="_blank" rel="noopener noreferrer"
                  style={{ color: "#00f6ff", fontSize: 13, textDecoration: "underline" }}>
                  View uploaded photo
                </a>
                <button onClick={() => setDraft(p => ({ ...p, license_photo_url: null }))}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.35)" }}>
                  <X size={13} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingPhoto}
                style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", borderRadius: 8, border: "1px dashed rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.03)", cursor: "pointer", color: "rgba(255,255,255,0.45)", fontSize: 13 }}
              >
                <Upload size={14} />
                {uploadingPhoto ? "Uploading…" : "Upload licence photo (JPG, PNG, PDF)"}
              </button>
            )}
          </div>

          <button onClick={handleAdd} disabled={saving || uploadingPhoto}
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 28px", borderRadius: 8, border: "none", cursor: saving ? "not-allowed" : "pointer", background: saving ? "rgba(0,246,255,0.4)" : "#00f6ff", color: "#000", fontSize: 13, fontWeight: 800 }}>
            <MapPin size={14} />
            {saving ? "Saving…" : "Save Location"}
          </button>
        </div>
      )}

      {/* Location list */}
      {loading ? (
        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 13 }}>Loading locations…</p>
      ) : locations.length === 0 ? (
        <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 13, fontStyle: "italic" }}>No locations added yet. You can add up to {MAX_LOCATIONS}.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {locations.map((loc, i) => {
            const expired = loc.license_expiry_date && new Date(loc.license_expiry_date) < new Date();
            const expiresSoon = !expired && loc.license_expiry_date && (new Date(loc.license_expiry_date).getTime() - Date.now()) < 30 * 86400_000;
            return (
              <div key={loc.id} style={{
                background: "#111",
                border: `1px solid ${loc.status === "rejected" ? "rgba(248,113,113,0.3)" : loc.status === "pending" ? "rgba(251,191,36,0.3)" : "rgba(255,255,255,0.08)"}`,
                borderRadius: 12, padding: "16px 18px",
              }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                      <p style={{ margin: 0, color: "#fff", fontSize: 15, fontWeight: 700 }}>
                        <span style={{ color: "rgba(0,246,255,0.5)", fontSize: 11, fontWeight: 800, marginRight: 8 }}>#{i + 1}</span>
                        {loc.nickname || "Unnamed Location"}
                      </p>
                      {/* Approval status badge */}
                      {loc.status === "pending" && (
                        <span style={{ padding: "2px 9px", borderRadius: 999, background: "rgba(251,191,36,0.15)", color: "#fbbf24", fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                          Pending Approval
                        </span>
                      )}
                      {loc.status === "approved" && (
                        <span style={{ padding: "2px 9px", borderRadius: 999, background: "rgba(74,222,128,0.12)", color: "#4ade80", fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                          Approved
                        </span>
                      )}
                      {loc.status === "rejected" && (
                        <span style={{ padding: "2px 9px", borderRadius: 999, background: "rgba(248,113,113,0.12)", color: "#f87171", fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                          Rejected
                        </span>
                      )}
                    </div>
                    {loc.status === "rejected" && loc.reviewer_note && (
                      <p style={{ margin: "5px 0 0", color: "#f87171", fontSize: 12, lineHeight: 1.5 }}>
                        Reason: {loc.reviewer_note}
                      </p>
                    )}
                    {loc.status === "pending" && (
                      <p style={{ margin: "4px 0 0", color: "rgba(251,191,36,0.6)", fontSize: 11 }}>
                        Under review — you will be notified by email once approved.
                      </p>
                    )}
                  </div>
                  <button onClick={() => handleDelete(loc.id)} disabled={deleting === loc.id}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(248,113,113,0.5)", padding: 4, borderRadius: 6, display: "flex" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#f87171")}
                    onMouseLeave={e => (e.currentTarget.style.color = "rgba(248,113,113,0.5)")}>
                    <Trash2 size={14} />
                  </button>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  <div>
                    <p style={{ margin: "0 0 2px", color: "rgba(255,255,255,0.3)", fontSize: 10, textTransform: "uppercase", fontWeight: 700 }}>Shipping Address</p>
                    <p style={{ margin: 0, color: "rgba(255,255,255,0.7)", fontSize: 13 }}>{loc.shipping_address || "—"}</p>
                  </div>
                  <div>
                    <p style={{ margin: "0 0 2px", color: "rgba(255,255,255,0.3)", fontSize: 10, textTransform: "uppercase", fontWeight: 700 }}>Licence Number</p>
                    <p style={{ margin: 0, color: "rgba(255,255,255,0.7)", fontSize: 13, fontFamily: "monospace" }}>{loc.license_number || "—"}</p>
                  </div>
                  <div>
                    <p style={{ margin: "0 0 2px", color: "rgba(255,255,255,0.3)", fontSize: 10, textTransform: "uppercase", fontWeight: 700 }}>Expiry Date</p>
                    <p style={{ margin: 0, fontSize: 13, color: expired ? "#f87171" : expiresSoon ? "#fbbf24" : "rgba(255,255,255,0.7)" }}>
                      {loc.license_expiry_date ? new Date(loc.license_expiry_date + "T00:00:00").toLocaleDateString("en-CA", { year: "numeric", month: "short", day: "numeric" }) : "—"}
                      {expired && <span style={{ marginLeft: 8, fontSize: 11, fontWeight: 700 }}>EXPIRED</span>}
                      {expiresSoon && <span style={{ marginLeft: 8, fontSize: 11, fontWeight: 700 }}>EXPIRES SOON</span>}
                    </p>
                  </div>
                  {loc.license_photo_url && (
                    <div>
                      <p style={{ margin: "0 0 2px", color: "rgba(255,255,255,0.3)", fontSize: 10, textTransform: "uppercase", fontWeight: 700 }}>Licence Photo</p>
                      <a href={loc.license_photo_url} target="_blank" rel="noopener noreferrer"
                        style={{ color: "#00f6ff", fontSize: 13, textDecoration: "underline" }}>
                        View document
                      </a>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function AccountClient() {
  const [retailer, setRetailer] = useState<Retailer | null>(null);
  const [changes, setChanges]   = useState<AccountChange[]>([]);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [result, setResult]     = useState<{ type: "success" | "error" | "partial"; msg: string } | null>(null);

  // Form state — self-service
  const [contactName, setContactName]         = useState("");
  const [phone, setPhone]                     = useState("");
  const [email, setEmail]                     = useState("");
  const [storeAddress, setStoreAddress]       = useState("");
  const [billingAddress, setBillingAddress]   = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [primaryContact, setPrimaryContact]   = useState("");
  const [paymentContact, setPaymentContact]   = useState("");

  // Form state — compliance (requires review)
  const [licenseNumber, setLicenseNumber] = useState("");
  const [licenseExpiry, setLicenseExpiry] = useState("");

  const pendingChange = changes.find(c => c.status === "pending");

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/retailer/account");
    const json = await res.json();
    setLoading(false);
    if (!res.ok || !json.data) return;

    const r: Retailer = json.data;
    setRetailer(r);
    setChanges(json.changes ?? []);

    // Populate form
    setContactName(r.contact_name ?? "");
    setPhone(r.phone ?? "");
    setEmail(r.email ?? "");
    setStoreAddress(r.store_address ?? "");
    setBillingAddress(r.billing_address ?? "");
    setShippingAddress(r.shipping_address ?? "");
    setPrimaryContact(r.primary_purchasing_contact ?? "");
    setPaymentContact(r.payment_contact ?? "");
    setLicenseNumber(r.business_license_number ?? "");
    setLicenseExpiry(r.license_expiry_date ?? "");
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    setSaving(true);
    setResult(null);

    const body: Record<string, string> = {
      contact_name:                contactName,
      phone,
      email,
      store_address:               storeAddress,
      billing_address:             billingAddress,
      shipping_address:            shippingAddress,
      primary_purchasing_contact:  primaryContact,
      payment_contact:             paymentContact,
      business_license_number:     licenseNumber,
      license_expiry_date:         licenseExpiry,
    };

    const res  = await fetch("/api/retailer/account", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    setSaving(false);

    if (!res.ok) {
      setResult({ type: "error", msg: json.error || "Failed to save. Please try again." });
      return;
    }

    if (json.complianceQueued && json.selfServiceUpdated) {
      setResult({ type: "partial", msg: "General information saved. Compliance changes submitted for admin review — you will be notified by email." });
    } else if (json.complianceQueued) {
      setResult({ type: "partial", msg: "Compliance changes submitted for admin review. You will be notified by email once reviewed." });
    } else {
      setResult({ type: "success", msg: "Account information updated successfully." });
    }

    await load();
  };

  if (loading) return (
    <div style={{ textAlign: "center", padding: "64px 0", color: "rgba(255,255,255,0.35)" }}>
      Loading account…
    </div>
  );

  if (!retailer) return (
    <div style={{ textAlign: "center", padding: "64px 0", color: "rgba(255,255,255,0.35)" }}>
      Account not found. Please contact support.
    </div>
  );

  return (
    <div style={{ maxWidth: 840 }}>
      {/* Business name header */}
      <div style={{ marginBottom: 32, padding: "18px 22px", background: "#111", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12 }}>
        <p style={{ margin: "0 0 2px", color: "rgba(255,255,255,0.35)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>Business Account</p>
        <p style={{ margin: 0, color: "#fff", fontSize: 20, fontWeight: 800 }}>{retailer.business_name}</p>
        <p style={{ margin: "4px 0 0", color: retailer.status === "active" ? "#4ade80" : "#fbbf24", fontSize: 12, fontWeight: 700, textTransform: "capitalize" }}>
          ● {retailer.status}
        </p>
      </div>

      {/* Result banner */}
      {result && (
        <div style={{
          display: "flex", gap: 10, alignItems: "flex-start",
          padding: "13px 16px", borderRadius: 10, marginBottom: 24,
          background: result.type === "error"
            ? "rgba(248,113,113,0.1)"
            : result.type === "partial"
            ? "rgba(251,191,36,0.1)"
            : "rgba(74,222,128,0.1)",
          border: `1px solid ${result.type === "error" ? "rgba(248,113,113,0.3)" : result.type === "partial" ? "rgba(251,191,36,0.3)" : "rgba(74,222,128,0.3)"}`,
        }}>
          {result.type === "error"
            ? <AlertTriangle size={15} color="#f87171" style={{ flexShrink: 0, marginTop: 1 }} />
            : result.type === "partial"
            ? <Clock size={15} color="#fbbf24" style={{ flexShrink: 0, marginTop: 1 }} />
            : <CheckCircle size={15} color="#4ade80" style={{ flexShrink: 0, marginTop: 1 }} />}
          <p style={{ margin: 0, fontSize: 13, lineHeight: 1.55, color: result.type === "error" ? "#f87171" : result.type === "partial" ? "#fbbf24" : "#4ade80" }}>
            {result.msg}
          </p>
        </div>
      )}

      {/* ── General Information ─────────────────────────────────────────── */}
      <Section title="General Information">
        <Field label="Contact Name"              value={contactName}     onChange={setContactName} />
        <Field label="Phone Number"              value={phone}           onChange={setPhone} type="tel" />
        <Field label="Email Address"             value={email}           onChange={setEmail} type="email" />
        <div /> {/* spacer */}
        <Field label="Store / Primary Address"   value={storeAddress}    onChange={setStoreAddress} />
        <Field label="Billing Address"           value={billingAddress}  onChange={setBillingAddress} />
        <div style={{ gridColumn: "1 / -1" }}>
          <Field label="Shipping Address"        value={shippingAddress} onChange={setShippingAddress} />
        </div>
      </Section>

      {/* ── Purchasing Contacts ─────────────────────────────────────────── */}
      <Section title="Purchasing Contacts">
        <Field
          label="Primary Purchasing Contact"
          value={primaryContact}
          onChange={setPrimaryContact}
          hint="Name and email of the person who places orders"
        />
        <Field
          label="Payment Contact"
          value={paymentContact}
          onChange={setPaymentContact}
          hint="Name and email for invoices and payment correspondence"
        />
      </Section>

      {/* ── Compliance Information ──────────────────────────────────────── */}
      <div style={{ marginBottom: 36 }}>
        <p style={{ margin: "0 0 6px", color: "rgba(255,255,255,0.35)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", borderBottom: "1px solid rgba(255,255,255,0.07)", paddingBottom: 10 }}>
          Compliance Information
        </p>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 16, padding: "11px 14px", background: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.2)", borderRadius: 8 }}>
          <AlertTriangle size={14} color="#fbbf24" style={{ flexShrink: 0, marginTop: 1 }} />
          <p style={{ margin: 0, color: "rgba(255,255,255,0.55)", fontSize: 13, lineHeight: 1.55 }}>
            Changes to your cannabis retail licence number or expiry date require administrator review before becoming active. You will receive an email confirmation once reviewed.
          </p>
        </div>
        {pendingChange && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14, padding: "10px 14px", background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.3)", borderRadius: 8 }}>
            <Clock size={13} color="#fbbf24" />
            <p style={{ margin: 0, color: "#fbbf24", fontSize: 12, fontWeight: 600 }}>
              You have a compliance update pending review. A new submission will replace it.
            </p>
          </div>
        )}
        <div className="rGrid2">
          <Field
            label="Cannabis Retail Licence Number"
            value={licenseNumber}
            onChange={setLicenseNumber}
          />
          <Field
            label="Licence Expiry Date"
            value={licenseExpiry}
            onChange={setLicenseExpiry}
            type="date"
          />
        </div>
      </div>

      {/* ── Store Locations ─────────────────────────────────────────────── */}
      <LocationsSection />

      {/* ── Read-only fields ────────────────────────────────────────────── */}
      <div style={{ marginBottom: 36 }}>
        <p style={{ margin: "0 0 10px", color: "rgba(255,255,255,0.35)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", borderBottom: "1px solid rgba(255,255,255,0.07)", paddingBottom: 10 }}>
          Account Settings (Managed by Leaf Cross)
        </p>
        <p style={{ margin: "0 0 14px", color: "rgba(255,255,255,0.3)", fontSize: 12 }}>
          The following are set by your account manager and cannot be changed here. Contact us at info@leafcross.com if you need to update these.
        </p>
        <div className="rGrid3">
          {[
            ["Account Status", retailer.status],
          ].map(([label, value]) => (
            <div key={label}>
              <p style={{ margin: "0 0 4px", ...labelStyle }}>{label}</p>
              <p style={{ margin: 0, color: "#fff", fontSize: 14, padding: "10px 12px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 8 }}>{value || "—"}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Save button ─────────────────────────────────────────────────── */}
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <button
          onClick={save}
          disabled={saving}
          style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "13px 32px", borderRadius: 9, border: "none",
            background: saving ? "rgba(0,246,255,0.4)" : "#00f6ff",
            color: "#000", fontSize: 13, fontWeight: 800,
            textTransform: "uppercase", letterSpacing: "0.08em",
            cursor: saving ? "not-allowed" : "pointer",
          }}
        >
          {saving
            ? <><Save size={15} style={{ animation: "pulse 1s ease-in-out infinite" }} /> Saving…</>
            : <><Save size={15} /> Save Changes</>}
        </button>
        <p style={{ margin: 0, color: "rgba(255,255,255,0.3)", fontSize: 12 }}>
          General info saves immediately. Compliance changes go to admin review.
        </p>
      </div>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>

      {/* ── Change history ──────────────────────────────────────────────── */}
      <ChangeHistory changes={changes} />
    </div>
  );
}
