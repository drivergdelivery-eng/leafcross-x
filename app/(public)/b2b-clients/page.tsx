import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/public/PageHero";

export default function B2BClientsPage() {
  return (
    <>
      <PageHero
        eyebrow="B2B Clients"
        title="What We Offer"
        subtitle="Premium craft cannabis access, industry experience, distribution support, and speed to market."
        image="/assets/wordpress/B2B_Hero.png"
      />
      <section className="section darkSection">
        <div className="container statementGrid">
          {[
            ["/assets/wordpress/B2B_Icon_2.png", "Access to Premium Craft Cannabis"],
            ["/assets/wordpress/B2B_Icon_3.png", "Trusted Industry Experience"],
            ["/assets/wordpress/B2B_Icon_4.png", "Distribution Network"],
            ["/assets/wordpress/B2B_Icon_file.png", "Speed to Market"]
          ].map(([image, title]) => (
            <article className="statementCard" key={title}>
              <Image src={image} alt="" width={92} height={92} />
              <h2>{title}</h2>
            </article>
          ))}
        </div>
      </section>
      <section className="section darkSection" style={{ paddingTop: 0 }}>
        <div className="container split">
          <div>
            <p className="eyebrow">Existing clients</p>
            <h2 className="display" style={{ fontSize: "clamp(42px, 6vw, 82px)" }}>
              Manual import, no stale accounts
            </h2>
          </div>
          <div>
            <p className="lead">
              Existing accounts will not be blindly migrated from WordPress.
              Admin or manager users can manually create only active retailer
              accounts in the new system.
            </p>
            <Link className="button" href="/retailers" style={{ marginTop: 24 }}>
              Apply or reapply
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
