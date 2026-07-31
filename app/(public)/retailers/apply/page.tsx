"use client";
import { useState, useRef } from "react";
import { extractedAssets } from "@/lib/data/assets";
import Image from "next/image";
import { UploadCloud, CheckCircle } from "lucide-react";

export default function RetailersApplyPage() {
  const [agreed, setAgreed]         = useState(false);
  const [fileName, setFileName]     = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragging, setDragging]     = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted]   = useState(false);
  const [submitError, setSubmitError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File | null | undefined) => {
    if (file) { setFileName(file.name); setSelectedFile(file); }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!agreed) return;
    setSubmitting(true);
    setSubmitError("");

    const raw = new FormData(e.currentTarget);
    const fd  = new FormData();
    fd.append("business_name",           (raw.get("storeName")      as string) || "");
    fd.append("contact_name",            (raw.get("contactName")    as string) || "");
    fd.append("email",                   (raw.get("email")          as string) || "");
    fd.append("phone",                   (raw.get("phone")          as string) || "");
    fd.append("website",                 (raw.get("website")        as string) || "");
    fd.append("business_address",        (raw.get("address")        as string) || "");
    fd.append("city",                    (raw.get("city")           as string) || "");
    fd.append("province",                (raw.get("province")       as string) || "");
    fd.append("postal_code",             (raw.get("postcode")       as string) || "");
    fd.append("country",                 (raw.get("country")        as string) || "Canada");
    fd.append("business_license_number", (raw.get("licenseNumber")  as string) || "");
    fd.append("license_expiry_date",     (raw.get("licenseExpiry")  as string) || "");
    fd.append("notes",                   (raw.get("notes")          as string) || "");
    if (selectedFile) fd.append("license", selectedFile);

    const res = await fetch("/api/retailers/apply", {
      method: "POST",
      body: fd,
    });

    const json = await res.json();
    setSubmitting(false);

    if (!res.ok) {
      setSubmitError(json.error || "Something went wrong. Please try again.");
    } else {
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <main style={{ minHeight: "100vh", background: "#050706", display: "flex", alignItems: "center", justifyContent: "center", padding: "64px 20px" }}>
        <div style={{ textAlign: "center", maxWidth: 520 }}>
          <CheckCircle size={64} color="#00f6ff" style={{ marginBottom: 24 }} />
          <h1 style={{ margin: "0 0 16px", color: "#fff", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 800, textTransform: "uppercase" }}>
            Application Submitted
          </h1>
          <p style={{ margin: "0 0 32px", color: "rgba(255,255,255,0.6)", fontSize: 17, lineHeight: 1.7 }}>
            Thank you! We&apos;ve received your application and will review it shortly. You&apos;ll hear from us at the email you provided.
          </p>
          <a href="/" style={{
            display: "inline-flex", alignItems: "center", padding: "14px 36px", borderRadius: 999,
            background: "#00f6ff", color: "#000", fontSize: 13, fontWeight: 800,
            textTransform: "uppercase", letterSpacing: "0.1em", textDecoration: "none",
          }}>
            Back to Home
          </a>
        </div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100vh", background: "#050706", padding: "64px 20px 100px" }}>
      <div style={{ width: "min(800px, 100%)", margin: "0 auto" }}>

        {/* ── Header ── */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <Image
            src={extractedAssets.logo}
            alt="Leaf Cross Biomedical"
            width={110} height={38}
            style={{ filter: "brightness(0) invert(1)", marginBottom: 28 }}
          />
          <p style={{ margin: "0 0 10px", color: "#00f6ff", fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>
            Become a Partner
          </p>
          <h1 style={{ margin: "0 0 12px", color: "#fff", fontSize: "clamp(32px, 5vw, 52px)", textTransform: "uppercase", lineHeight: 1 }}>
            Partner Application
          </h1>
          <p style={{ margin: "0 0 44px", color: "rgba(255,255,255,0.5)", fontSize: 16, lineHeight: 1.55 }}>
            Approved partners receive private menu access, cart, invoices, and order history.
          </p>

          {/* ── Process flow ── */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0, flexWrap: "nowrap", overflowX: "auto", paddingBottom: 4 }}>
            {[
              { num: "01", label: "Submit\nApplication", active: true  },
              { num: "02", label: "Application\nReview",  active: false },
              { num: "03", label: "Activate\nAccount",    active: false },
              { num: "04", label: "Portal\nAccess",       active: false },
            ].map(({ num, label, active }, i) => (
              <div key={num} style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: "50%",
                    background: active ? "#00f6ff" : "rgba(255,255,255,0.06)",
                    border: `2px solid ${active ? "#00f6ff" : "rgba(255,255,255,0.15)"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: active ? "#000" : "rgba(255,255,255,0.35)",
                    fontSize: 13, fontWeight: 900, letterSpacing: "0.04em", flexShrink: 0,
                  }}>
                    {num}
                  </div>
                  <p style={{
                    margin: 0,
                    color: active ? "#fff" : "rgba(255,255,255,0.35)",
                    fontSize: 11, fontWeight: active ? 800 : 500,
                    textTransform: "uppercase", letterSpacing: "0.08em",
                    lineHeight: 1.4, whiteSpace: "pre-line", textAlign: "center", maxWidth: 88,
                  }}>
                    {label}
                  </p>
                </div>
                {i < 3 && (
                  <div style={{ display: "flex", alignItems: "center", padding: "0 8px", marginBottom: 28, flexShrink: 0 }}>
                    <div style={{ width: 32, height: 1, background: "rgba(255,255,255,0.12)" }} />
                    <svg width="7" height="11" viewBox="0 0 7 11" fill="none">
                      <path d="M1 1L6 5.5L1 10" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Form ── */}
        <form className="formPanel applyForm" onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 0 }}>

          {/* Business Info */}
          <p style={{ margin: "0 0 24px", color: "#fff", fontSize: 13, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: 12 }}>
            Business Information
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
            <div className="field">
              <label htmlFor="storeName">Store / Business Name</label>
              <input id="storeName" name="storeName" placeholder="e.g. Green Leaf Dispensary" required />
            </div>
            <div className="field">
              <label htmlFor="contactName">Owner / Manager Name</label>
              <input id="contactName" name="contactName" required />
            </div>
            <div className="field">
              <label htmlFor="email">Email Address</label>
              <input id="email" name="email" type="email" required />
            </div>
            <div className="field">
              <label htmlFor="phone">Phone Number</label>
              <input id="phone" name="phone" required />
            </div>
            <div className="field">
              <label htmlFor="website">Website (optional)</label>
              <input id="website" name="website" placeholder="www.yourstore.com" />
            </div>
          </div>

          {/* Shipping Address */}
          <p style={{ margin: "12px 0 24px", color: "#fff", fontSize: 13, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: 12 }}>
            Shipping Address
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
            <div className="field" style={{ gridColumn: "1 / -1" }}>
              <label htmlFor="address">Street Address</label>
              <input id="address" name="address" required />
            </div>
            <div className="field">
              <label htmlFor="city">City</label>
              <input id="city" name="city" required />
            </div>
            <div className="field">
              <label htmlFor="province">Province</label>
              <input id="province" name="province" placeholder="e.g. BC" required />
            </div>
            <div className="field">
              <label htmlFor="postcode">Postal Code</label>
              <input id="postcode" name="postcode" required />
            </div>
            <div className="field">
              <label htmlFor="country">Country</label>
              <select id="country" name="country" defaultValue="Canada" style={{ width: "100%", boxSizing: "border-box" }}>
                <option value="Canada">Canada</option>
                <option value="United States">United States</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* License Info */}
          <p style={{ margin: "12px 0 24px", color: "#fff", fontSize: 13, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: 12 }}>
            License Information
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 8 }}>
            <div className="field">
              <label htmlFor="licenseNumber">Retail License Number</label>
              <input id="licenseNumber" name="licenseNumber" placeholder="e.g. MRS-001234" required />
            </div>
            <div className="field">
              <label htmlFor="licenseExpiry">License Expiry Date</label>
              <input id="licenseExpiry" name="licenseExpiry" type="date" required />
            </div>
          </div>
          <p style={{ margin: "4px 0 20px", color: "rgba(255,255,255,0.35)", fontSize: 12, lineHeight: 1.6 }}>
            Have multiple license numbers? You can add them in Account Details after your first login.
          </p>

          {/* License Upload */}
          <div style={{ marginBottom: 20 }}>
            <p style={{ margin: "0 0 10px", color: "rgba(255,255,255,0.5)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Upload Copy of License
            </p>
            <div
              onClick={() => fileRef.current?.click()}
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
              style={{
                border: `1.5px dashed ${dragging ? "#00f6ff" : "rgba(255,255,255,0.18)"}`,
                borderRadius: 10,
                padding: "36px 24px",
                textAlign: "center",
                cursor: "pointer",
                background: dragging ? "rgba(0,246,255,0.04)" : "rgba(255,255,255,0.02)",
                transition: "all 200ms ease",
              }}
            >
              <UploadCloud size={32} color={dragging ? "#00f6ff" : "rgba(255,255,255,0.3)"} strokeWidth={1.5} style={{ marginBottom: 10 }} />
              <p style={{ margin: 0, color: fileName ? "#fff" : "rgba(255,255,255,0.35)", fontSize: 14 }}>
                {fileName ?? "Drag & drop or click to upload — PDF, JPG, PNG"}
              </p>
              <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png" style={{ display: "none" }} onChange={e => handleFile(e.target.files?.[0])} />
            </div>
          </div>

          {/* Notes */}
          <div className="field" style={{ marginBottom: 20 }}>
            <label htmlFor="notes">Additional Notes (optional)</label>
            <textarea id="notes" name="notes" rows={3} />
          </div>

          {/* Disclaimer + checkbox */}
          <div style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 10,
            padding: "20px 22px",
            marginBottom: 20,
          }}>
            <p style={{ margin: "0 0 18px", color: "rgba(255,255,255,0.55)", fontSize: 13, lineHeight: 1.7 }}>
              All Direct Delivery account applications are subject to review. Leaf Cross reserves the right to approve or decline applications, and to limit product availability or purchasing access, at its sole discretion and in accordance with applicable laws and regulations.
            </p>
            <div
              onClick={() => setAgreed(v => !v)}
              style={{ display: "flex", alignItems: "flex-start", gap: 14, cursor: "pointer" }}
            >
              <div style={{
                flexShrink: 0, marginTop: 2,
                width: 20, height: 20, borderRadius: 5,
                border: `2px solid ${agreed ? "#00f6ff" : "rgba(255,255,255,0.25)"}`,
                background: agreed ? "#00f6ff" : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 160ms ease",
              }}>
                {agreed && (
                  <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                    <path d="M1 4.5L4 7.5L10 1" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span style={{ color: "rgba(255,255,255,0.75)", fontSize: 14, lineHeight: 1.55, userSelect: "none" }}>
                I have read and understood the above terms and consent to the review of this application by Leaf Cross Biomedical.
              </span>
            </div>
          </div>

          {submitError && (
            <div style={{ marginBottom: 16, padding: "12px 16px", borderRadius: 8, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171", fontSize: 14 }}>
              {submitError}
            </div>
          )}

          {/* Submit */}
          <button
            className="button"
            type="submit"
            disabled={!agreed || submitting}
            style={{
              width: "100%",
              opacity: agreed && !submitting ? 1 : 0.4,
              cursor: agreed && !submitting ? "pointer" : "not-allowed",
              transition: "opacity 200ms ease",
            }}
          >
            {submitting ? "Submitting…" : "Submit Application"}
          </button>
          {!agreed && (
            <p style={{ margin: "10px 0 0", textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: 12 }}>
              Please accept the terms above to continue.
            </p>
          )}
        </form>

        <p style={{ marginTop: 28, textAlign: "center", color: "rgba(255,255,255,0.4)", fontSize: 14 }}>
          Already a partner?{" "}
          <a href="/login" style={{ color: "#00f6ff" }}>Log in here</a>
        </p>
      </div>
    </main>
  );
}
