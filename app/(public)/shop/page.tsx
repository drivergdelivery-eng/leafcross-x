import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/public/PageHero";

const categories = [
  { label: "Dried Cannabis", img: "/assets/wordpress/MedicalPatientsShop_Slider_2-2.png" },
  { label: "Prerolls", img: "/assets/wordpress/MedicalPatientsShop_Slider_3-2.png" },
  { label: "Capsules", img: "/assets/wordpress/MedicalPatientsShop_Slider_4-2.png" },
  { label: "Tinctures", img: "/assets/wordpress/MedicalPatientsShop_Slider_5-2.png" },
  { label: "Edibles", img: "/assets/wordpress/MedicalPatientsShop_Slider_2-2.png" },
  { label: "Topicals", img: "/assets/wordpress/MedicalPatientsShop_Slider_3-2.png" },
];

export default function ShopPage() {
  return (
    <>
      <PageHero
        eyebrow="Shop"
        title="Medical Cannabis"
        subtitle="Health Canada licensed products across dried flower, prerolls, capsules, tinctures, edibles, and topicals."
        image="/assets/wordpress/MedicalPatientsShop_Slider_4-2.png"
      />

      <section className="section darkSection">
        <div className="container">
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, marginBottom: 40 }}>
            <div>
              <p className="eyebrow">Product Catalogue</p>
              <h2 className="display" style={{ fontSize: "clamp(38px, 6vw, 80px)", margin: "10px 0 0" }}>
                Browse by Category
              </h2>
            </div>
            <div className="formPanel" style={{ maxWidth: 360, padding: "20px 24px" }}>
              <p style={{ margin: "0 0 6px", color: "#00f6ff", fontWeight: 700, fontSize: 13, textTransform: "uppercase" }}>
                Access Required
              </p>
              <p style={{ margin: "0 0 16px", color: "rgba(255,255,255,0.7)", fontSize: 15, lineHeight: 1.5 }}>
                Full product menus and pricing are available to registered medical patients and approved retailers.
              </p>
              <div style={{ display: "flex", gap: 10 }}>
                <Link className="button" href="/medical-patients">Register</Link>
                <Link className="button secondary" href="/login">Log in</Link>
              </div>
            </div>
          </div>

          <div className="cultivarGrid" style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}>
            {categories.map(({ label, img }) => (
              <article className="cultivarCard" key={label} style={{ position: "relative", overflow: "hidden" }}>
                <Image src={img} alt={label} width={500} height={340} style={{ width: "100%", aspectRatio: "1.4/1", objectFit: "cover" }} />
                <div style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(0deg, rgba(0,0,0,0.78) 0%, transparent 55%)",
                  display: "flex",
                  alignItems: "flex-end",
                  padding: 20
                }}>
                  <strong style={{ color: "#fff", fontSize: 22, textTransform: "uppercase" }}>{label}</strong>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section darkSection" style={{ paddingTop: 0 }}>
        <div className="container statementGrid">
          {[
            ["Lab Tested", "All products are third-party lab tested for potency, contaminants, and compliance with Health Canada standards."],
            ["Licensed Processor", "Leaf Cross Biomedical holds a Health Canada Standard Processing licence based in Nelson, BC."],
            ["Flat Rate Shipping", "$28.99 flat shipping across Canada. Same-day dispatch when payment is received before 11 AM."],
            ["Affordable Access", "15% discount codes available for veterans, seniors, first responders, and low-income patients."],
          ].map(([title, copy]) => (
            <article className="statementCard" key={title}>
              <h2>{title}</h2>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section darkSection" style={{ paddingTop: 0 }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, maxWidth: 640 }}>
            <div className="formPanel" style={{ padding: 28 }}>
              <strong style={{ display: "block", color: "#fff", fontSize: 20, textTransform: "uppercase", marginBottom: 10 }}>
                Medical Patient
              </strong>
              <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 15, lineHeight: 1.5, marginBottom: 20 }}>
                Register with your medical documentation to access the full product catalogue and pricing.
              </p>
              <Link className="button" href="/medical-patients">Get started</Link>
            </div>
            <div className="formPanel" style={{ padding: 28 }}>
              <strong style={{ display: "block", color: "#fff", fontSize: 20, textTransform: "uppercase", marginBottom: 10 }}>
                Retailer / B2B
              </strong>
              <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 15, lineHeight: 1.5, marginBottom: 20 }}>
                Apply for a retailer account to access the B2B product menu, cart, and order management portal.
              </p>
              <Link className="button" href="/retailers">Apply now</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
