import { PageHero } from "@/components/public/PageHero";

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact Us"
        title="Get in Touch"
        subtitle="Retailer inquiries, account questions, and payment confirmation support."
        image="/assets/wordpress/About_DSCF0726_LEAF.jpg"
      />
      <section className="section darkSection">
        <div className="container split">
          <div>
            <p className="eyebrow">Contact</p>
            <h2 className="display" style={{ fontSize: "clamp(42px, 6vw, 82px)" }}>
              Leaf Cross Biomedical
            </h2>
          <p className="lead">
            Retailer inquiries, payment confirmation, and account questions can
            be routed through the new admin dashboard.
          </p>
        </div>
        <form className="grid formPanel">
          <div className="field">
            <label htmlFor="name">Name</label>
            <input id="name" />
          </div>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" />
          </div>
          <div className="field">
            <label style={{ marginBottom: 4 }}>I am a</label>
            <div style={{ display: "flex", gap: 24 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 10, color: "rgba(255,255,255,0.75)", fontSize: 15, fontWeight: 400, cursor: "pointer" }}>
                <input type="radio" name="partnerType" value="retailer" style={{ accentColor: "#00f6ff", width: 18, height: 18 }} />
                Retailer
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: 10, color: "rgba(255,255,255,0.75)", fontSize: 15, fontWeight: 400, cursor: "pointer" }}>
                <input type="radio" name="partnerType" value="b2b" style={{ accentColor: "#00f6ff", width: 18, height: 18 }} />
                B2B / Wholesaler
              </label>
            </div>
          </div>
          <div className="field">
            <label htmlFor="message">Message</label>
            <textarea id="message" />
          </div>
          <button className="button" type="button">Send message</button>
        </form>
      </div>
    </section>
    </>
  );
}
