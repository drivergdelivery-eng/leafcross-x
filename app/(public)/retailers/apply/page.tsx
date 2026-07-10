"use client";
import { useState, useRef } from "react";
import { extractedAssets } from "@/lib/data/assets";
import Image from "next/image";
import { UploadCloud } from "lucide-react";

export default function RetailersApplyPage() {
  const [agreed, setAgreed]     = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File | null | undefined) => {
    if (file) setFileName(file.name);
  };

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
        <form className="formPanel" onSubmit={e => e.preventDefault()} style={{ display: "flex", flexDirection: "column", gap: 0 }}>

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
            <div className="field">
              <label htmlFor="gst">Company GST Number</label>
              <input id="gst" name="gst" placeholder="e.g. 123456789RT0001" />
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
            <label style={{ display: "flex", alignItems: "flex-start", gap: 14, cursor: "pointer" }}>
              <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} style={{ position: "absolute", opacity: 0, width: 0, height: 0 }} />
              <div
                onClick={() => setAgreed(v => !v)}
                style={{
                  flexShrink: 0, marginTop: 2,
                  width: 20, height: 20, borderRadius: 5,
                  border: `2px solid ${agreed ? "#00f6ff" : "rgba(255,255,255,0.25)"}`,
                  background: agreed ? "#00f6ff" : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 160ms ease", cursor: "pointer",
                }}
              >
                {agreed && (
                  <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                    <path d="M1 4.5L4 7.5L10 1" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span style={{ color: "rgba(255,255,255,0.75)", fontSize: 14, lineHeight: 1.55, userSelect: "none" }}>
                I have read and understood the above terms and consent to the review of this application by Leaf Cross Biomedical.
              </span>
            </label>
          </div>

          {/* Submit */}
          <button
            className="button"
            type="submit"
            disabled={!agreed}
            style={{
              width: "100%",
              opacity: agreed ? 1 : 0.4,
              cursor: agreed ? "pointer" : "not-allowed",
              transition: "opacity 200ms ease",
            }}
          >
            Submit Application
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
