import Link from "next/link";
import { CalendarClock, FileText, PackageCheck } from "lucide-react";
import { PageHero } from "@/components/public/PageHero";
import { monthlySubscription, paymentInstructions } from "@/lib/data/site";

export default function SubscriptionPage() {
  return (
    <>
      <PageHero
        eyebrow="Monthly Subscription"
        title="Recurring Retailer Orders"
        subtitle="Keep the subscription concept from the current site, implemented as a manual B2B recurring-order workflow."
        image="/assets/wordpress/SiteBanner_Free_Shipping_GIF.gif"
      />
      <section className="section darkSection">
        <div className="container split">
          <div>
            <p className="eyebrow">Monthly subscription</p>
            <h2 className="display" style={{ fontSize: "clamp(42px, 6vw, 82px)" }}>{monthlySubscription.title}</h2>
          <p className="lead">{monthlySubscription.summary}</p>
          <Link className="button" href="/retailers" style={{ marginTop: 28 }}>
            Apply for access
          </Link>
        </div>
        <div className="featureList">
          <article>
            <h3><CalendarClock size={22} /> Monthly review</h3>
            <p>
              Retailer subscriptions are modeled as recurring order intent that
              admin or manager users can review before invoicing.
            </p>
          </article>
          <article>
            <h3><FileText size={22} /> Invoice first</h3>
            <p>
              Each monthly order can generate an invoice using the continuous
              invoice format and current GST/shipping rules.
            </p>
          </article>
          <article>
            <h3><PackageCheck size={22} /> Payment before shipment</h3>
            <p>{paymentInstructions.policy}</p>
          </article>
        </div>
      </div>
    </section>
    </>
  );
}
