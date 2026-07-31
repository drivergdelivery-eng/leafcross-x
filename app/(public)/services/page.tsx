export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { getSiteContent } from "@/lib/data/getSiteContent";
import { PageHero } from "@/components/public/PageHero";

export const metadata: Metadata = {
  title: "Services | Leaf Cross Biomedical",
  description: "Health Canada licensed cannabis processing, co-processing, white label, and direct delivery services from Leaf Cross Biomedical in Nelson, BC.",
};

export default async function ServicesPage() {
  const c = await getSiteContent();
  return (
    <>
      <PageHero
        eyebrow="Services"
        title={c.servicesHeroTitle}
        subtitle={c.servicesHeroSubtitle}
        image={c.servicesHeroImage}
      />
      <section className="section darkSection">
        <div className="container statementGrid">
          {c.servicesCards.map(({ title, body }) => (
            <article className="statementCard" key={title}>
              <h2>{title}</h2>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
