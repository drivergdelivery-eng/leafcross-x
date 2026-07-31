import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/public/PageHero";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Medical Patients | Leaf Cross Biomedical",
  description: "Leaf Cross Biomedical offers high-quality cannabis products for registered medical patients through licensed retailers across Canada.",
};

const categories = [
  { label: "Dried Cannabis", img: "/assets/wordpress/MedicalPatientsShop_Slider_2-2.png", copy: "Whole flower, small buds, and milled formats. Available in Sativa, Indica, Hybrid, and CBD." },
  { label: "Prerolls", img: "/assets/wordpress/MedicalPatientsShop_Slider_3-2.png", copy: "Ready-to-use prerolled cannabis in single and multi-pack formats across all strain types." },
  { label: "Capsules", img: "/assets/wordpress/MedicalPatientsShop_Slider_4-2.png", copy: "Precise dosing in softgel and capsule formats with various cannabinoid blends." },
  { label: "Tinctures", img: "/assets/wordpress/MedicalPatientsShop_Slider_5-2.png", copy: "Sublingual oil extracts offering consistent, measurable dosing for daily therapeutic use." },
  { label: "Edibles", img: "/assets/wordpress/MedicalPatientsShop_Slider_2-2.png", copy: "Longer-lasting effects of up to 8 hours. Ideal for sustained symptom management." },
  { label: "Topicals", img: "/assets/wordpress/MedicalPatientsShop_Slider_3-2.png", copy: "Localized relief without psychoactive effects. Creams, balms, and patches." },
];

const steps = [
  ["Submit Documentation", "Provide your doctor's referral or qualifying medical documentation during registration."],
  ["Complete Registration", "Fill out the sign-up form with personal details, address, insurance coverage, and documents."],
  ["Receive Approval", "Your account is reviewed and approved by our medical team."],
  ["Place an Order", "Log in to access your product menu and submit your order."],
];

const discountGroups = [
  "Veterans", "Persons with disabilities", "Income assistance recipients",
  "First responders", "Seniors (65+)"
];

export default function MedicalPatientsPage() {
  return (
    <>
      <PageHero
        eyebrow="Medical Patients"
        title="Premium Medical Cannabis"
        subtitle="Health Canada licensed. Lab tested. Designed around your health and budget."
        image="/assets/wordpress/MedicalPatientsShop_Slider_2-2.png"
      />

      <section className="section darkSection">
        <div className="container">
          <p className="eyebrow">Product Categories</p>
          <h2 className="display" style={{ fontSize: "clamp(38px, 6vw, 80px)", marginBottom: 48 }}>
            What We Offer
          </h2>
          <div className="cultivarGrid" style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}>
            {categories.map(({ label, img, copy }) => (
              <article className="cultivarCard" key={label}>
                <Image src={img} alt={label} width={500} height={360} style={{ aspectRatio: "1.4/1", objectFit: "cover" }} />
                <div style={{ padding: "16px 16px 20px" }}>
                  <strong style={{ display: "block", color: "#fff", fontSize: 20, textTransform: "uppercase", marginBottom: 8 }}>{label}</strong>
                  <p style={{ margin: 0, color: "rgba(255,255,255,0.65)", fontSize: 15, lineHeight: 1.5 }}>{copy}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section darkSection" style={{ paddingTop: 0 }}>
        <div className="container">
          <p className="eyebrow">Getting Started</p>
          <h2 className="display" style={{ fontSize: "clamp(38px, 6vw, 78px)", marginBottom: 40 }}>
            How It Works
          </h2>
          <div className="processGrid" style={{ gridTemplateColumns: "repeat(4, minmax(0, 1fr))" }}>
            {steps.map(([title, copy], i) => (
              <article className="processStep" key={title} style={{ textAlign: "left" }}>
                <span style={{ margin: "0 0 14px" }}>{i + 1}</span>
                <strong style={{ display: "block", color: "#fff", fontSize: 18, textTransform: "uppercase", marginBottom: 10 }}>{title}</strong>
                <p style={{ margin: 0, color: "rgba(255,255,255,0.62)", fontSize: 14, lineHeight: 1.5 }}>{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section darkSection" style={{ paddingTop: 0 }}>
        <div className="container split">
          <div>
            <p className="eyebrow">Free Appointments</p>
            <h2 className="display" style={{ fontSize: "clamp(38px, 6vw, 78px)" }}>
              Practitioner Consultations
            </h2>
            <p className="lead">
              Register, schedule an online consultation, and receive clinical guidance
              and approval at no cost. Our practitioners help you select the right
              products and dosing for your needs.
            </p>
            <Link className="button" href="/retailers" style={{ marginTop: 28 }}>
              Register as a patient
            </Link>
          </div>
          <div className="formPanel" style={{ padding: 32 }}>
            <p className="eyebrow" style={{ color: "#00f6ff", marginBottom: 18 }}>15% Discount Program</p>
            <h3 style={{ color: "#fff", fontSize: 22, marginBottom: 16, textTransform: "uppercase" }}>
              Qualifying Categories
            </h3>
            <p style={{ color: "rgba(255,255,255,0.65)", marginBottom: 24, lineHeight: 1.55 }}>
              Submit proof of eligibility during registration and receive a 15% discount
              code applied to every purchase.
            </p>
            <div className="pillGrid" style={{ marginTop: 0 }}>
              {discountGroups.map((g) => (
                <span key={g}>{g}</span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
