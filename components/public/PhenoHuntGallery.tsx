import type { StrainItem } from "@/lib/data/siteContent";

const CARD_W = 300;
const CARD_H = 380;
const GAP    = 14;

type Props = { eyebrow: string; title: string; desc: string; strains: StrainItem[] };

export function PhenoHuntGallery({ eyebrow, title, desc, strains }: Props) {
  const TRACK_W  = strains.length * (CARD_W + GAP);
  const DURATION = Math.round(TRACK_W / 72);
  const doubled  = [...strains, ...strains];

  return (
    <section style={{ background: "#050505", padding: "88px 0 0", overflow: "hidden" }}>
      <style>{`
        @keyframes pheno-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-${TRACK_W}px); }
        }
        .pheno-track {
          display: flex;
          gap: ${GAP}px;
          width: max-content;
          animation: pheno-scroll ${DURATION}s linear infinite;
          will-change: transform;
        }
        .pheno-track:hover {
          animation-play-state: paused;
        }
        .pheno-card {
          position: relative;
          flex-shrink: 0;
          width: ${CARD_W}px;
          height: ${CARD_H}px;
          border-radius: 14px;
          overflow: hidden;
          cursor: default;
        }
        .pheno-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 600ms ease;
        }
        .pheno-track:hover .pheno-card img {
          transform: scale(1.04);
        }
        .pheno-card-label {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 40px 18px 16px;
          background: linear-gradient(transparent, rgba(0,0,0,0.82));
        }
      `}</style>

      {/* Header */}
      <div className="container" style={{ marginBottom: 44 }}>
        <p style={{
          margin: "0 0 8px",
          color: "#00f6ff",
          fontSize: 11,
          fontWeight: 800,
          textTransform: "uppercase",
          letterSpacing: "0.18em",
        }}>
          {eyebrow}
        </p>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
          <h2 style={{
            margin: 0,
            color: "#fff",
            fontSize: "clamp(28px, 4vw, 48px)",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            lineHeight: 1.05,
          }}>
            {title}
          </h2>
          <p style={{
            margin: 0,
            color: "rgba(255,255,255,0.45)",
            fontSize: 15,
            maxWidth: 400,
            lineHeight: 1.6,
          }}>
            {desc}
          </p>
        </div>
      </div>

      {/* Scrolling strip */}
      <div style={{ overflow: "hidden", width: "100%", paddingBottom: 88 }}>
        <div className="pheno-track">
          {doubled.map((strain, i) => (
            <div key={i} className="pheno-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={strain.src} alt={strain.name || "Pheno hunt cultivar"} />
              {strain.name && (
                <div className="pheno-card-label">
                  <p style={{
                    margin: 0,
                    color: "#fff",
                    fontSize: 12,
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                  }}>
                    {strain.name}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
