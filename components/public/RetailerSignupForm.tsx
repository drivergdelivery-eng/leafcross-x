"use client";
import { useRef, useState } from "react";
import { UploadCloud } from "lucide-react";

const labelStyle: React.CSSProperties = {
  display: "block",
  color: "rgba(255,255,255,0.5)",
  fontSize: 11,
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  marginBottom: 8,
};

const inputStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  background: "transparent",
  border: "none",
  borderBottom: "1px solid rgba(255,255,255,0.2)",
  color: "#fff",
  fontSize: 15,
  padding: "8px 0 10px",
  outline: "none",
  boxSizing: "border-box",
};

const sectionHeadingStyle: React.CSSProperties = {
  margin: "56px 0 32px",
  color: "#fff",
  fontSize: "clamp(20px, 2.5vw, 28px)",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
};

export default function RetailerSignupForm() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = (file: File | null | undefined) => {
    if (file) setFileName(file.name);
  };

  return (
    <section style={{
      background: "#050706",
      padding: "96px 20px 120px",
      borderTop: "1px solid rgba(255,255,255,0.08)",
    }}>
      <div style={{ width: "min(900px, 100%)", margin: "0 auto" }}>

        <h2 style={{
          margin: "0 0 48px",
          color: "#fff",
          fontSize: "clamp(40px, 7vw, 90px)",
          fontWeight: 800,
          textTransform: "uppercase",
          letterSpacing: "-0.01em",
          lineHeight: 0.95,
        }}>
          Signup
        </h2>

        <form onSubmit={e => e.preventDefault()}>

          {/* Store Name */}
          <div style={{ marginBottom: 8 }}>
            <label style={labelStyle}>Store Name</label>
            <input style={inputStyle} placeholder="Name here" />
          </div>

          {/* Contact Information */}
          <p style={sectionHeadingStyle}>Contact Information</p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "28px 48px" }}>
            <div>
              <label style={labelStyle}>Store Owner / Manager</label>
              <input style={inputStyle} placeholder="Name here" />
            </div>
            <div>
              <label style={labelStyle}>Email <span style={{ color: "#00f6ff" }}>*</span></label>
              <input style={inputStyle} type="email" placeholder="Email here" required />
            </div>
            <div>
              <label style={labelStyle}>Contact</label>
              <input style={inputStyle} placeholder="Phone number" />
            </div>
            <div>
              <label style={labelStyle}>Website</label>
              <input style={inputStyle} placeholder="www.xyz.com" />
            </div>
          </div>

          {/* Shipping Information */}
          <p style={sectionHeadingStyle}>Shipping Information</p>

          <div style={{ marginBottom: 28 }}>
            <label style={labelStyle}>Address</label>
            <input style={inputStyle} placeholder="Address..." />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "28px 48px" }}>
            <div>
              <label style={labelStyle}>City</label>
              <input style={inputStyle} placeholder="..." />
            </div>
            <div>
              <label style={labelStyle}>Postcode</label>
              <input style={inputStyle} placeholder="..." />
            </div>
            <div>
              <label style={labelStyle}>Province</label>
              <input style={inputStyle} placeholder="..." />
            </div>
            <div>
              <label style={labelStyle}>Country</label>
              <select style={{
                ...inputStyle,
                color: "#fff",
                appearance: "none",
                cursor: "pointer",
              }}
                defaultValue="Canada"
              >
                <option value="Canada">Canada</option>
                <option value="United States">United States</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* License Information */}
          <p style={sectionHeadingStyle}>License Information</p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "28px 48px", marginBottom: 28 }}>
            <div>
              <label style={labelStyle}>Retail Customer License #</label>
              <input style={inputStyle} placeholder="..." />
            </div>
            <div>
              <label style={labelStyle}>License Expiry Date <span style={{ color: "#00f6ff" }}>*</span></label>
              <input style={{ ...inputStyle, colorScheme: "dark" }} type="date" required />
            </div>
          </div>

          <p style={{
            margin: "0 0 32px",
            color: "rgba(255,255,255,0.55)",
            fontSize: 12,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            lineHeight: 1.6,
          }}>
            Do you have multiple license numbers? You can add them in the &lsquo;Account Details&rsquo; section, accessible once you log in.
          </p>

          <div style={{ marginBottom: 28 }}>
            <label style={labelStyle}>Company GST Number</label>
            <input style={inputStyle} placeholder="..." />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "28px 48px", marginBottom: 40 }}>
            <div>
              <label style={labelStyle}>Password <span style={{ color: "#00f6ff" }}>*</span></label>
              <input style={inputStyle} type="password" required placeholder="..." />
            </div>
            <div>
              <label style={labelStyle}>Confirm Password <span style={{ color: "#00f6ff" }}>*</span></label>
              <input style={inputStyle} type="password" required placeholder="..." />
            </div>
          </div>

          {/* File Upload */}
          <div style={{ marginBottom: 36 }}>
            <label style={{ ...labelStyle, marginBottom: 16 }}>Copy of License Upload</label>
            <div
              onClick={() => fileRef.current?.click()}
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={e => {
                e.preventDefault();
                setDragging(false);
                handleFile(e.dataTransfer.files[0]);
              }}
              style={{
                border: `1px dashed ${dragging ? "#00f6ff" : "rgba(255,255,255,0.25)"}`,
                borderRadius: 4,
                padding: "48px 24px",
                textAlign: "center",
                cursor: "pointer",
                background: dragging ? "rgba(0,246,255,0.04)" : "transparent",
                transition: "border-color 0.2s, background 0.2s",
              }}
            >
              <UploadCloud size={36} color="rgba(255,255,255,0.35)" strokeWidth={1.5} style={{ marginBottom: 12 }} />
              <p style={{ margin: 0, color: "rgba(255,255,255,0.4)", fontSize: 14 }}>
                {fileName ?? "You can upload up to 1 file"}
              </p>
              <input
                ref={fileRef}
                type="file"
                style={{ display: "none" }}
                onChange={e => handleFile(e.target.files?.[0])}
              />
            </div>
          </div>

          {/* reCAPTCHA placeholder */}
          <div style={{ marginBottom: 32 }}>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: 4,
              padding: "14px 20px 14px 16px",
              background: "rgba(255,255,255,0.03)",
            }}>
              <input type="checkbox" style={{ width: 18, height: 18, cursor: "pointer", accentColor: "#00f6ff" }} />
              <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 14 }}>I&apos;m not a robot</span>
              <div style={{ marginLeft: 24, textAlign: "center" }}>
                <div style={{ width: 32, height: 32, background: "rgba(255,255,255,0.08)", borderRadius: 4, margin: "0 auto 2px" }} />
                <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 8, letterSpacing: "0.05em" }}>reCAPTCHA</span>
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            style={{
              display: "block",
              width: "100%",
              padding: "20px",
              background: "#00f6ff",
              border: "none",
              borderRadius: 4,
              color: "#000",
              fontSize: 15,
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              cursor: "pointer",
              marginBottom: 20,
            }}
          >
            Submit Registration
          </button>

          <div style={{ textAlign: "right" }}>
            <button
              type="reset"
              style={{
                background: "none",
                border: "none",
                color: "rgba(255,255,255,0.4)",
                fontSize: 14,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              ↺ Reset
            </button>
          </div>

        </form>
      </div>
    </section>
  );
}
