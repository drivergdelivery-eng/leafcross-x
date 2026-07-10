import Link from "next/link";
import { PageHero } from "@/components/public/PageHero";

const steps = [
  ["Enroll as Medical Patient", "Obtain medical documentation and register as a Leaf Cross medical patient."],
  ["Submit to VAC", "Submit your Medavie Blue Cross Card, Summary of Assessment (SOA), or Disability Benefit Decision Letter to VAC. Allow 3–4 weeks for a decision."],
  ["Place Your Order", "Once Medavie Blue Cross approves your application, place your order. Leaf Cross handles direct billing with VAC on your behalf."],
  ["VAC Coverage Applied", "Leaf Cross applies for VAC coverage through Medavie Blue Cross. Allow several weeks for the coverage decision notification."],
  ["Account Updated", "Your account is updated upon coverage approval and your monthly allotment resets every 30 days from your first order date."],
];

export default function VeteransPage() {
  return (
    <>
      <PageHero
        eyebrow="Veterans"
        title="Serving Those Who Served"
        subtitle="Leaf Cross Biomedical honours Canadian veterans with dedicated VAC support and exclusive discounts."
        image="/assets/wordpress/SiteBanner_LCB_Banners_1.png"
      />

      <section className="section darkSection">
        <div className="container split">
          <div>
            <p className="eyebrow">Veterans &amp; Spouses</p>
            <h2 className="display" style={{ fontSize: "clamp(38px, 6vw, 82px)" }}>
              15% Discount on Every Purchase
            </h2>
            <p className="lead">
              All veterans and their spouses receive a 15% discount code applied
              to every order. Submit proof of eligibility during your medical patient
              registration to activate your discount.
            </p>
            <Link className="button" href="/medical-patients" style={{ marginTop: 28 }}>
              Register as a patient
            </Link>
          </div>
          <div className="statementGrid" style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))", alignContent: "start" }}>
            {[
              ["VAC Coverage", "We handle direct billing with Veterans Affairs Canada through Medavie Blue Cross on your behalf."],
              ["Blue Cross Reimbursement", "Integration with the Medavie Blue Cross reimbursement program for eligible veterans."],
              ["Monthly Allotments", "Coverage resets every 30 days from your first order date under your current medical documentation."],
              ["Dedicated Support", "Contact us directly at info@leafcross.com or +1 (877) 532-3246 for veteran-specific assistance."],
            ].map(([title, copy]) => (
              <article className="statementCard" key={title}>
                <h2>{title}</h2>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section darkSection" style={{ paddingTop: 0 }}>
        <div className="container">
          <p className="eyebrow">VAC Process</p>
          <h2 className="display" style={{ fontSize: "clamp(38px, 6vw, 78px)", marginBottom: 40 }}>
            How It Works
          </h2>
          <div className="processGrid">
            {steps.map(([title, copy], i) => (
              <article className="processStep" key={title} style={{ textAlign: "left" }}>
                <span style={{ margin: "0 0 14px" }}>{i + 1}</span>
                <strong style={{ display: "block", color: "#fff", fontSize: 16, textTransform: "uppercase", marginBottom: 10 }}>{title}</strong>
                <p style={{ margin: 0, color: "rgba(255,255,255,0.62)", fontSize: 13, lineHeight: 1.5 }}>{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section darkSection" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="formPanel" style={{ maxWidth: 680, padding: 36 }}>
            <p className="eyebrow" style={{ color: "#00f6ff" }}>Get in Touch</p>
            <h3 style={{ color: "#fff", fontSize: 28, textTransform: "uppercase", margin: "12px 0 16px" }}>
              Questions About VAC Coverage?
            </h3>
            <p style={{ color: "rgba(255,255,255,0.65)", marginBottom: 28, lineHeight: 1.6 }}>
              Our team can walk you through the enrollment and VAC billing process.
              Reach us by email or phone and we will get back to you as soon as possible.
            </p>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <a className="button" href="mailto:info@leafcross.com">
                info@leafcross.com
              </a>
              <a className="button secondary" href="tel:+18775323246" style={{ borderColor: "#00f6ff", color: "#00f6ff" }}>
                +1 (877) 532-3246
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
