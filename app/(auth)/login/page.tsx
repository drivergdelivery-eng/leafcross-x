import Link from "next/link";
import Image from "next/image";
import { PublicStyles } from "@/components/public/PublicStyles";
import { extractedAssets } from "@/lib/data/assets";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <>
      <PublicStyles />
      <main style={{ minHeight: "100vh", background: "#050706", display: "grid", placeItems: "center", padding: "40px 20px" }}>
        <div style={{ width: "min(480px, 100%)" }}>
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <Image
              src={extractedAssets.logo}
              alt="Leaf Cross Biomedical"
              width={110}
              height={38}
              style={{ filter: "brightness(0) invert(1)", marginBottom: 28 }}
            />
            <p style={{ margin: "0 0 10px", color: "#00f6ff", fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>
              Retailer / Partner Login
            </p>
          </div>

          <LoginForm />

          <div style={{ marginTop: 32, borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 32, textAlign: "center" }}>
            <p style={{ margin: "0 0 14px", color: "rgba(255,255,255,0.5)", fontSize: 15 }}>
              Not a partner yet?
            </p>
            <Link
              href="/retailers"
              className="button secondary"
              style={{ borderColor: "#00f6ff", color: "#00f6ff", width: "100%", justifyContent: "center" }}
            >
              Become a Partner
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
