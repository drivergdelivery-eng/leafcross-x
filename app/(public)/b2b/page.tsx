import B2BCarousel from "@/components/public/B2BCarousel";

const reasons = [
  {
    src: "https://leafcross.com/wp-content/uploads/2024/05/file-removebg-preview.png",
    label: "Access to Premium Craft Cannabis",
  },
  {
    src: "https://leafcross.com/wp-content/uploads/2024/05/2-removebg-preview.png",
    label: "Trusted Industry Experience",
  },
  {
    src: "https://leafcross.com/wp-content/uploads/2024/05/3-removebg-preview.png",
    label: "Distribution Network",
  },
  {
    src: "https://leafcross.com/wp-content/uploads/2024/05/4-removebg-preview.png",
    label: "Speed to Market",
  },
];

export default function B2BPage() {
  return (
    <main style={{ background: "#000", minHeight: "100vh" }}>
      {/* Hero */}
      <section style={{ padding: "80px 40px 48px" }}>
        <h1 style={{
          margin: "0 0 20px",
          color: "#fff",
          fontSize: "clamp(56px, 10vw, 130px)",
          fontWeight: 800,
          textTransform: "uppercase",
          letterSpacing: "-0.01em",
          lineHeight: 0.9,
        }}>
          B2B Clients
        </h1>
        <p style={{
          margin: 0,
          color: "#00f6ff",
          fontSize: "clamp(18px, 2vw, 26px)",
          fontWeight: 600,
          fontStyle: "italic",
        }}>
          What We Offer
        </p>
      </section>

      <B2BCarousel />

      {/* Why Work With Us */}
      <section style={{
        background: "#050706",
        padding: "96px 40px 112px",
        textAlign: "center",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}>
        <h2 style={{
          margin: "0 0 80px",
          color: "#fff",
          fontSize: "clamp(32px, 5vw, 72px)",
          fontWeight: 300,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          lineHeight: 1,
        }}>
          Why Work With Us
        </h2>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 40,
          maxWidth: 1100,
          margin: "0 auto",
        }}>
          {reasons.map(({ src, label }) => (
            <div key={label} style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 32,
            }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={label}
                style={{ width: 150, height: 150, objectFit: "contain" }}
              />
              <p style={{
                margin: 0,
                color: "rgba(255,255,255,0.9)",
                fontSize: 17,
                fontWeight: 500,
                lineHeight: 1.45,
                maxWidth: 200,
              }}>
                {label}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
