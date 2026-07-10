import { PageHero } from "@/components/public/PageHero";

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="What We Do"
        subtitle="Retailer support, processing coordination, wholesale ordering, and shipment workflows."
        image="/assets/wordpress/Home_Card_Services.png"
      />
      <section className="section darkSection">
        <div className="container statementGrid">
          {[
            ["Product Management", "Admin and manager users can safely manage products, brands, prices, and availability."],
            ["Retailer Access", "Retailers apply, get reviewed, and access private menu content only after approval."],
            ["Order Review", "Orders are submitted as B2B requests, then reviewed before payment and shipment."],
            ["Sales Support", "Payment instructions, invoices, and order status updates are handled in one portal."]
          ].map(([title, copy]) => (
            <article className="statementCard" key={title}>
              <h2>{title}</h2>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
