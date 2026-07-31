export const metadata = {
  title: "Updates | Leaf Cross Biomedical",
  description: "Company news, industry updates, and announcements from Leaf Cross Biomedical.",
};

export default function BlogPage() {
  return (
    <main style={{ minHeight: "60vh", background: "#050706", display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 20px" }}>
      <div style={{ textAlign: "center", maxWidth: 480 }}>
        <p style={{ margin: "0 0 16px", color: "#00f6ff", fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.14em" }}>
          Updates
        </p>
        <h1 style={{ margin: "0 0 20px", color: "#fff", fontSize: "clamp(28px, 5vw, 46px)", fontWeight: 800, textTransform: "uppercase", lineHeight: 1.05 }}>
          News &amp; Announcements
        </h1>
        <p style={{ margin: 0, color: "rgba(255,255,255,0.45)", fontSize: 16, lineHeight: 1.7 }}>
          Company updates, industry news, and announcements will be published here. Check back soon.
        </p>
      </div>
    </main>
  );
}
