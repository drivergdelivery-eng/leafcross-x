import Image from "next/image";

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  image?: string;
};

export function PageHero({ eyebrow, title, subtitle, image }: PageHeroProps) {
  return (
    <section className="pageHero">
      {image ? <Image src={image} alt="" fill priority /> : null}
      <div className="pageHeroOverlay" />
      <div className="container pageHeroInner">
        {eyebrow ? <p>{eyebrow}</p> : null}
        <h1>{title}</h1>
        {subtitle ? <span>{subtitle}</span> : null}
      </div>
    </section>
  );
}
