export const dynamic = "force-dynamic";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { extractedAssets } from "@/lib/data/assets";
import { getSiteContent } from "@/lib/data/getSiteContent";
import { GrowSlideshow } from "@/components/public/GrowSlideshow";
import { PhenoHuntGallery } from "@/components/public/PhenoHuntGallery";
import { PhilosophySection } from "@/components/public/PhilosophySection";
import { ExclusiveBrands } from "@/components/public/ExclusiveBrands";

export default async function HomePage() {
  const c = await getSiteContent();
  return (
    <>
      <section className="hero">
        <video className="heroVideo" src={extractedAssets.homeClip} autoPlay muted loop playsInline />
        <div className="heroShade" />
        <div className="container heroInner">
          <div className="heroCopy">
            <Image className="heroWordmark" src={extractedAssets.heroFrame} alt="Leaf Cross Biomedical" width={1516} height={700} priority />
            <p className="heroLicense">{c.heroLicense}</p>
            <div className="heroActions">
              <Link className="button" href="/retailers">{c.heroCtaPrimary} <ArrowRight size={18} /></Link>
            </div>
          </div>
        </div>
      </section>

      <section style={{ background: "#0a0a0a", padding: "80px 0 72px" }}>
        <div className="container">
          <p style={{ textAlign:"center", margin:"0 0 8px", color:"#00f6ff", fontSize:11, fontWeight:800, textTransform:"uppercase", letterSpacing:"0.18em" }}>
            {c.craftEyebrow}
          </p>
          <h2 style={{ textAlign:"center", margin:"0 0 56px", color:"#fff", fontSize:"clamp(26px,3.5vw,40px)", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.06em" }}>
            {c.craftTitle}
          </h2>
          <div style={{ display:"flex", justifyContent:"center", alignItems:"flex-start", gap:"clamp(8px,2vw,32px)", flexWrap:"wrap" }}>
            {c.craftIcons.map(({ src, alt }) => (
              <Image key={src} src={src} alt={alt} width={180} height={180} style={{ display:"block" }} />
            ))}
          </div>
        </div>
      </section>

      <PhenoHuntGallery
        eyebrow={c.phenoGalleryEyebrow}
        title={c.phenoGalleryTitle}
        desc={c.phenoGalleryDesc}
        strains={c.phenoStrains}
      />

      <PhilosophySection
        phenoTitle={c.phenoHuntTitle}
        phenoBody={c.phenoHuntBody}
        phenoCta={c.phenoHuntCta}
        partnerTitle={c.partnerTitle}
        partnerBody={c.partnerBody}
        partnerCta={c.partnerCta}
      />

      <ExclusiveBrands
        eyebrow={c.brandsEyebrow}
        title={c.brandsTitle}
        brands={c.homeBrands}
      />

      <GrowSlideshow
        eyebrow={c.growEyebrow}
        title={c.growTitle}
        desc={c.growDesc}
        slides={c.growSlides}
      />
    </>
  );
}
