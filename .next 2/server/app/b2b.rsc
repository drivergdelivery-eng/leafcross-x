1:"$Sreact.fragment"
2:I[39756,["/_next/static/chunks/05-c3ty_6dwfk.js","/_next/static/chunks/14mrh2-p_w84d.js"],"default"]
3:I[37457,["/_next/static/chunks/05-c3ty_6dwfk.js","/_next/static/chunks/14mrh2-p_w84d.js"],"default"]
d:I[68027,["/_next/static/chunks/05-c3ty_6dwfk.js","/_next/static/chunks/14mrh2-p_w84d.js"],"default",1]
:HL["/_next/static/chunks/1o27bay9d9g8n.css","style"]
4:T49c7,
      .publicHeader {
        position: sticky;
        top: 0;
        z-index: 40;
        display: grid;
        grid-template-columns: 220px 1fr 220px;
        align-items: center;
        gap: 28px;
        min-height: 148px;
        padding: 20px max(38px, 10vw);
        border-bottom: 0;
        background: #000;
      }

      .brandMark {
        display: inline-flex;
        align-items: center;
      }

      .brandMark img {
        width: 86px;
        height: auto;
        filter: brightness(0) invert(1);
      }

      .publicNav {
        display: flex;
        justify-content: center;
        gap: 38px;
        color: rgba(255,255,255,0.75);
        font-size: 20px;
        font-weight: 400;
      }

      .publicNav a {
        color: rgba(255,255,255,0.75);
        transition: color 0.15s ease;
      }

      .publicNav a:hover {
        color: #00f6ff;
      }

      .headerActions {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
      }

      .contactButton {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 168px;
        min-height: 48px;
        border-radius: 999px;
        background: #00f6ff;
        color: #000;
        font-size: 16px;
        font-weight: 500;
        text-transform: uppercase;
      }

      .iconButton {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        border: 1px solid var(--line);
        border-radius: 4px;
        background: var(--white);
        color: var(--leaf-dark);
      }

      .hero {
        position: relative;
        min-height: 650px;
        display: grid;
        align-items: center;
        overflow: hidden;
        background: #000;
      }

      .heroVideo {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
        opacity: 0.56;
      }

      .heroShade {
        position: absolute;
        inset: 0;
        background:
          linear-gradient(90deg, rgba(0,0,0,0.96) 0%, rgba(0,0,0,0.72) 42%, rgba(0,0,0,0.28) 100%),
          linear-gradient(0deg, rgba(0,0,0,0.15), rgba(0,0,0,0.2));
      }

      .heroInner {
        position: relative;
        z-index: 2;
        display: flex;
        align-items: center;
        align-items: center;
        min-height: 650px;
      }

      .heroCopy {
        max-width: 800px;
      }

      .welcome {
        margin: 0 0 8px;
        color: #00f6ff;
        font-size: clamp(32px, 4vw, 50px);
        font-weight: 300;
        text-transform: uppercase;
      }

      .heroWordmark {
        display: block;
        width: min(780px, 58vw);
        height: auto;
        margin-left: -12px;
      }

      .heroLicense {
        max-width: 720px;
        margin: 34px 0 0;
        color: #00f6ff;
        font-size: clamp(18px, 2vw, 23px);
        line-height: 1.35;
        text-align: center;
      }

      .heroActions {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        margin-top: 30px;
      }

      .heroMeta {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 14px;
        margin-top: 42px;
        max-width: 660px;
      }

      .homeBrandsSection {
        position: relative;
        overflow: hidden;
        background:
          radial-gradient(circle at 18% 12%, rgba(0,246,255,0.16), transparent 30%),
          linear-gradient(180deg, #000 0%, #050706 58%, #000 100%);
        padding: 88px 0 104px;
        color: #fff;
      }

      .brandsIntro {
        display: flex;
        align-items: end;
        justify-content: space-between;
        gap: 28px;
        margin-bottom: 30px;
      }

      .brandsIntro h2 {
        max-width: 760px;
        margin: 0;
        font-size: clamp(34px, 5vw, 68px);
        line-height: 0.94;
        text-transform: uppercase;
      }

      .homeBrandGrid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 22px;
      }

      .homeBrandCard {
        position: relative;
        overflow: hidden;
        border: 1px solid rgba(0, 246, 255, 0.28);
        border-radius: 0;
        background: #050505;
        color: #fff;
        box-shadow: 0 24px 70px rgba(0,0,0,0.38);
      }

      .brandArt {
        position: relative;
        aspect-ratio: 1.12 / 1;
        overflow: hidden;
        background: #000;
      }

      .brandArt img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        opacity: 0.78;
        filter: saturate(0.9) contrast(1.08);
        transition: transform 700ms ease, opacity 700ms ease, filter 700ms ease;
      }

      .brandArt::after {
        content: "";
        position: absolute;
        inset: 0;
        background:
          linear-gradient(0deg, rgba(0,0,0,0.82) 0%, transparent 45%),
          radial-gradient(circle at 20% 12%, rgba(0,246,255,0.24), transparent 28%);
      }

      .homeBrandCard::after {
        content: "";
        position: absolute;
        inset: auto 0 0;
        height: 3px;
        background: #00f6ff;
        transform: scaleX(0);
        transform-origin: left;
        transition: transform 450ms ease;
      }

      .homeBrandCard:hover .brandArt img {
        opacity: 0.96;
        filter: saturate(1.08) contrast(1.12);
        transform: scale(1.08);
      }

      .homeBrandCard:hover::after {
        transform: scaleX(1);
      }

      .brandInfo {
        display: grid;
        gap: 18px;
        min-height: 210px;
        padding: 26px;
        background: linear-gradient(180deg, #050505, #000);
      }

      .brandInfo img {
        max-width: 210px;
        max-height: 84px;
        width: auto;
        height: auto;
        object-fit: contain;
      }

      .brandInfo p {
        margin: 0;
        color: rgba(255,255,255,0.72);
        font-size: 17px;
        line-height: 1.45;
      }

      .heroMeta div {
        border-top: 1px solid rgba(47,77,38,0.25);
        padding-top: 14px;
        color: var(--muted);
        font-size: 14px;
        line-height: 1.45;
      }

      .heroMeta strong {
        display: block;
        color: var(--ink);
        font-size: 18px;
        margin-bottom: 5px;
      }

      .nugScene {
        height: min(62vh, 560px);
        min-height: 370px;
        width: 100%;
      }

      .videoBand {
        background: var(--black);
        color: var(--white);
        padding: 0;
      }

      .videoBand video {
        display: block;
        width: 100%;
        max-height: 560px;
        object-fit: cover;
      }

      .split {
        display: grid;
        grid-template-columns: 0.95fr 1.05fr;
        gap: 52px;
        align-items: center;
      }

      .pageHero {
        position: relative;
        min-height: 520px;
        display: grid;
        align-items: center;
        overflow: hidden;
        background: #000;
        color: #fff;
      }

      .pageHero > img {
        object-fit: cover;
        opacity: 0.58;
        filter: saturate(0.9) contrast(1.08);
      }

      .pageHeroOverlay {
        position: absolute;
        inset: 0;
        background:
          linear-gradient(90deg, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.58) 52%, rgba(0,0,0,0.28) 100%),
          radial-gradient(circle at 28% 42%, rgba(0,246,255,0.24), transparent 28%);
      }

      .pageHeroInner {
        position: relative;
        z-index: 1;
      }

      .pageHeroInner p,
      .cyan {
        color: #00f6ff;
      }

      .pageHeroInner p {
        margin: 0 0 14px;
        font-size: clamp(22px, 3vw, 42px);
        text-transform: uppercase;
      }

      .pageHeroInner h1 {
        max-width: 980px;
        margin: 0;
        color: #fff;
        font-size: clamp(58px, 11vw, 150px);
        line-height: 0.84;
        text-transform: uppercase;
      }

      .pageHeroInner span {
        display: block;
        max-width: 760px;
        margin-top: 26px;
        color: #00f6ff;
        font-size: clamp(18px, 2.2vw, 28px);
        line-height: 1.35;
      }

      .darkSection {
        background: #050706;
        color: #fff;
      }

      .darkSection .lead,
      .darkSection p {
        color: rgba(255,255,255,0.72);
      }

      .darkSection .field label {
        color: rgba(255,255,255,0.65);
      }

      .darkSection .field input,
      .darkSection .field textarea,
      .darkSection .field select {
        background: rgba(255,255,255,0.06);
        border: 1px solid rgba(255,255,255,0.15);
        border-radius: 6px;
        color: #fff;
      }

      .darkSection .field input:focus,
      .darkSection .field textarea:focus,
      .darkSection .field select:focus {
        outline: none;
        border-color: rgba(0,246,255,0.5);
        background: rgba(255,255,255,0.09);
      }

      .darkSection .field input::placeholder,
      .darkSection .field textarea::placeholder {
        color: rgba(255,255,255,0.25);
      }

      .statementGrid {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 18px;
      }

      .statementCard {
        min-height: 240px;
        border: 1px solid rgba(0,246,255,0.22);
        border-radius: 8px;
        background: linear-gradient(180deg, rgba(0,246,255,0.08), rgba(255,255,255,0.03));
        padding: 24px;
      }

      .statementCard h2 {
        margin: 0 0 12px;
        color: #fff;
        font-size: 28px;
        text-transform: uppercase;
      }

      .imageMosaic {
        display: grid;
        grid-template-columns: 1fr 0.8fr;
        gap: 18px;
      }

      .imageMosaic img,
      .brandFeatureImage {
        width: 100%;
        height: 100%;
        min-height: 260px;
        border-radius: 8px;
        object-fit: cover;
      }

      .brandStory {
        display: grid;
        grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
        gap: 44px;
        align-items: center;
      }

      .brandStoryLogo {
        max-width: 320px;
        max-height: 130px;
        width: 100%;
        height: auto;
        object-fit: contain;
      }

      .pillGrid {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-top: 24px;
      }

      .pillGrid span {
        border: 1px solid rgba(0,246,255,0.34);
        border-radius: 999px;
        padding: 9px 14px;
        color: #00f6ff;
        font-weight: 700;
        text-transform: uppercase;
      }

      .cultivarGrid {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 18px;
      }

      .cultivarCard {
        border: 1px solid rgba(255,255,255,0.12);
        border-radius: 8px;
        overflow: hidden;
        background: #0b0d0b;
      }

      .cultivarCard img {
        width: 100%;
        aspect-ratio: 1 / 1;
        object-fit: cover;
      }

      .cultivarCard strong {
        display: block;
        padding: 16px;
        color: #fff;
        font-size: 18px;
        text-transform: uppercase;
      }

      .processGrid {
        display: grid;
        grid-template-columns: repeat(5, minmax(0, 1fr));
        gap: 14px;
      }

      .processStep {
        border: 1px solid rgba(0,246,255,0.24);
        border-radius: 8px;
        background: rgba(0,0,0,0.36);
        padding: 18px;
        text-align: center;
      }

      .processStep span {
        display: grid;
        place-items: center;
        width: 48px;
        height: 48px;
        margin: 0 auto 12px;
        border-radius: 50%;
        background: #00f6ff;
        color: #000;
        font-weight: 800;
      }

      .formPanel {
        border: 1px solid rgba(0,246,255,0.28);
        border-radius: 8px;
        background: #070907;
        padding: 28px;
      }

      .featureList {
        display: grid;
        gap: 16px;
      }

      .featureList article {
        border-left: 3px solid var(--gold);
        padding: 4px 0 4px 18px;
      }

      .featureList h3,
      .brandPanel h3 {
        margin: 0 0 8px;
        font-size: 22px;
      }

      .featureList p,
      .brandPanel p {
        margin: 0;
        color: var(--muted);
        line-height: 1.6;
      }

      .brandGrid {
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }

      .productGrid {
        grid-template-columns: repeat(4, minmax(0, 1fr));
      }

      .productCard {
        display: grid;
        gap: 14px;
      }

      .productImage {
        width: 100%;
        aspect-ratio: 1 / 1;
        border-radius: 6px;
        background: #eef2e6;
        object-fit: contain;
      }

      .statusPill {
        display: inline-flex;
        width: fit-content;
        border: 1px solid var(--line);
        border-radius: 999px;
        padding: 5px 9px;
        color: var(--leaf-dark);
        font-size: 12px;
        font-weight: 700;
        text-transform: uppercase;
      }

      .brandPanel {
        min-height: 280px;
        display: grid;
        align-content: space-between;
      }

      .brandLogoWrap {
        height: 96px;
        display: flex;
        align-items: center;
      }

      .brandLogoWrap img {
        max-width: 210px;
        max-height: 80px;
      }

      .retailerBand {
        background: var(--leaf-dark);
        color: var(--white);
      }

      .retailerBand .lead {
        color: rgba(255,255,255,0.78);
      }

      .applicationForm {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .applicationForm .full {
        grid-column: 1 / -1;
      }

      .dashboardShell {
        min-height: 100vh;
        display: grid;
        grid-template-columns: 260px 1fr;
        background: #0d0d0d;
        color: #fff;
      }

      .dashboardNav {
        border-right: 1px solid rgba(255,255,255,0.08);
        background: #000;
        padding: 26px;
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        position: sticky;
        top: 0;
      }

      .dashboardNav img {
        width: 145px;
        height: auto;
        margin-bottom: 28px;
        filter: brightness(0) invert(1);
      }

      .dashboardNav a {
        display: block;
        border-radius: 6px;
        padding: 11px 12px;
        color: rgba(255,255,255,0.6);
        font-size: 14px;
        font-weight: 600;
        transition: background 0.15s ease, color 0.15s ease;
      }

      .dashboardNav a:hover {
        background: rgba(255,255,255,0.08);
        color: #00f6ff;
      }

      .dashboardMain {
        padding: 34px;
        background: #0d0d0d;
        color: #fff;
      }

      .statGrid {
        grid-template-columns: repeat(4, minmax(0, 1fr));
      }

      .ageGate {
        position: fixed;
        inset: 0;
        z-index: 100;
        display: grid;
        place-items: center;
        padding: 20px;
        background: rgba(9, 10, 8, 0.82);
      }

      .ageGatePanel {
        width: min(520px, 100%);
        border-radius: 8px;
        background: var(--cream);
        padding: 34px;
        text-align: center;
        box-shadow: 0 30px 80px rgba(0,0,0,0.3);
      }

      .ageGatePanel h2 {
        margin: 6px 0 22px;
        font-size: clamp(28px, 4vw, 44px);
        line-height: 1;
        text-transform: uppercase;
      }

      .underage {
        display: block;
        margin-top: 16px;
        color: var(--muted);
        font-size: 14px;
      }

      .publicFooter {
        border-top: 1px solid rgba(255,255,255,0.08);
        background: #000;
        padding: 48px 0;
      }

      .footerGrid {
        display: grid;
        grid-template-columns: 1.7fr 1fr 1fr 1fr;
        gap: 28px;
      }

      .footerGrid p {
        max-width: 340px;
        color: rgba(255,255,255,0.45);
        line-height: 1.6;
      }

      .footerGrid strong,
      .footerGrid a {
        display: block;
      }

      .footerGrid strong {
        margin-bottom: 10px;
        color: #fff;
      }

      .footerGrid a {
        color: rgba(255,255,255,0.45);
        margin: 8px 0;
        transition: color 0.15s ease;
      }

      .footerGrid a:hover {
        color: #00f6ff;
      }

      @media (max-width: 980px) {
        .publicHeader {
          grid-template-columns: auto 1fr;
          min-height: auto;
          padding: 18px 20px;
        }

        .publicNav {
          grid-column: 1 / -1;
          order: 3;
          justify-content: flex-start;
          overflow-x: auto;
          padding-bottom: 4px;
          font-size: 16px;
          gap: 22px;
        }

        .heroInner,
        .split,
        .dashboardShell {
          grid-template-columns: 1fr;
        }

        .nugScene {
          min-height: 300px;
          height: 42vh;
        }

        .brandGrid,
        .productGrid,
        .statGrid,
        .footerGrid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .dashboardNav {
          border-right: 0;
          border-bottom: 1px solid var(--line);
        }
      }

      @media (max-width: 640px) {
        .publicHeader {
          padding: 12px 14px;
        }

        .hero {
          min-height: auto;
          padding: 44px 0 36px;
        }

        .heroInner {
          min-height: 520px;
        }

        .heroWordmark {
          width: min(100%, 620px);
        }

        .heroLicense {
          text-align: left;
        }

        .heroInner,
        .applicationForm,
        .brandGrid,
        .productGrid,
        .statGrid,
        .footerGrid,
        .heroMeta,
        .homeBrandGrid {
          grid-template-columns: 1fr;
        }
      }

      /* ── Responsive helpers used by dashboard/retailer pages ─────────── */
      .rGrid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px 24px; }
      .rGrid3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px 24px; }
      .cartLayout { display: grid; grid-template-columns: 1fr 320px; gap: 32px; align-items: start; }
      .productModal { display: grid; grid-template-columns: 320px 1fr; }
      .productModalLeft { border-radius: 20px 0 0 20px; }
      .orderRow { display: grid; grid-template-columns: 1fr 160px 120px 110px 28px; gap: 12px; align-items: center; padding: 16px 20px; cursor: pointer; }

      @media (max-width: 768px) {
        .cartLayout { grid-template-columns: 1fr; }
      }

      @media (max-width: 640px) {
        .rGrid2, .rGrid3 { grid-template-columns: 1fr; }

        .productModal { grid-template-columns: 1fr; }
        .productModalLeft { border-radius: 20px 20px 0 0; min-height: 220px !important; }

        .orderRow {
          grid-template-columns: 1fr auto 28px;
        }
        .orderRowHide { display: none; }
      }
    0:{"P":null,"c":["","b2b"],"q":"","i":false,"f":[[["",{"children":["(public)",{"children":["b2b",{"children":["__PAGE__",{}]}]}]},"$undefined","$undefined",16],[["$","$1","c",{"children":[[["$","link","0",{"rel":"stylesheet","href":"/_next/static/chunks/1o27bay9d9g8n.css","precedence":"next","crossOrigin":"$undefined","nonce":"$undefined"}],["$","script","script-0",{"src":"/_next/static/chunks/05-c3ty_6dwfk.js","async":true,"nonce":"$undefined"}],["$","script","script-1",{"src":"/_next/static/chunks/14mrh2-p_w84d.js","async":true,"nonce":"$undefined"}]],["$","html",null,{"lang":"en","children":["$","body",null,{"children":["$","div",null,{"className":"site-shell","children":["$","$L2",null,{"parallelRouterKey":"children","error":"$undefined","errorStyles":"$undefined","errorScripts":"$undefined","template":["$","$L3",null,{}],"templateStyles":"$undefined","templateScripts":"$undefined","notFound":[[["$","title",null,{"children":"404: This page could not be found."}],["$","div",null,{"style":{"fontFamily":"system-ui,\"Segoe UI\",Roboto,Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\"","height":"100vh","textAlign":"center","display":"flex","flexDirection":"column","alignItems":"center","justifyContent":"center"},"children":["$","div",null,{"children":[["$","style",null,{"dangerouslySetInnerHTML":{"__html":"body{color:#000;background:#fff;margin:0}.next-error-h1{border-right:1px solid rgba(0,0,0,.3)}@media (prefers-color-scheme:dark){body{color:#fff;background:#000}.next-error-h1{border-right:1px solid rgba(255,255,255,.3)}}"}}],["$","h1",null,{"className":"next-error-h1","style":{"display":"inline-block","margin":"0 20px 0 0","padding":"0 23px 0 0","fontSize":24,"fontWeight":500,"verticalAlign":"top","lineHeight":"49px"},"children":404}],["$","div",null,{"style":{"display":"inline-block"},"children":["$","h2",null,{"style":{"fontSize":14,"fontWeight":400,"lineHeight":"49px","margin":0},"children":"This page could not be found."}]}]]}]}]],[]],"forbidden":"$undefined","unauthorized":"$undefined"}]}]}]}]]}],{"children":[["$","$1","c",{"children":[[["$","script","script-0",{"src":"/_next/static/chunks/0squ_1ebhb26_.js","async":true,"nonce":"$undefined"}]],[["$","style",null,{"children":"$4"}],"$L5","$L6","$L7","$L8"]]}],{"children":["$L9",{"children":["$La",{},null,false,null]},null,false,"$@b"]},null,false,null]},null,false,null],"$Lc",false]],"m":"$undefined","G":["$d",["$Le"]],"S":true,"h":null,"s":"$undefined","l":"$undefined","p":"$undefined","d":"$undefined","b":"oD-4z61MrfOjc7ZMZ6cM2"}
f:I[32845,["/_next/static/chunks/05-c3ty_6dwfk.js","/_next/static/chunks/14mrh2-p_w84d.js","/_next/static/chunks/0squ_1ebhb26_.js"],"AgeGate"]
10:I[22016,["/_next/static/chunks/05-c3ty_6dwfk.js","/_next/static/chunks/14mrh2-p_w84d.js","/_next/static/chunks/0squ_1ebhb26_.js"],""]
11:I[5500,["/_next/static/chunks/05-c3ty_6dwfk.js","/_next/static/chunks/14mrh2-p_w84d.js","/_next/static/chunks/0squ_1ebhb26_.js"],"Image"]
12:I[97008,["/_next/static/chunks/05-c3ty_6dwfk.js","/_next/static/chunks/14mrh2-p_w84d.js","/_next/static/chunks/0squ_1ebhb26_.js","/_next/static/chunks/0ezkw5dc9ykn9.js"],"default"]
13:I[97367,["/_next/static/chunks/05-c3ty_6dwfk.js","/_next/static/chunks/14mrh2-p_w84d.js"],"OutletBoundary"]
14:"$Sreact.suspense"
17:I[97367,["/_next/static/chunks/05-c3ty_6dwfk.js","/_next/static/chunks/14mrh2-p_w84d.js"],"ViewportBoundary"]
19:I[97367,["/_next/static/chunks/05-c3ty_6dwfk.js","/_next/static/chunks/14mrh2-p_w84d.js"],"MetadataBoundary"]
:HL["https://leafcross.com/wp-content/uploads/2024/05/file-removebg-preview.png","image"]
:HL["https://leafcross.com/wp-content/uploads/2024/05/2-removebg-preview.png","image"]
:HL["https://leafcross.com/wp-content/uploads/2024/05/3-removebg-preview.png","image"]
:HL["https://leafcross.com/wp-content/uploads/2024/05/4-removebg-preview.png","image"]
5:["$","$Lf",null,{}]
6:["$","header",null,{"className":"publicHeader","children":[["$","$L10",null,{"href":"/","className":"brandMark","aria-label":"Leaf Cross Biomedical home","children":["$","$L11",null,{"src":"/logos/lc-bio-logo.png","alt":"","width":138,"height":46,"priority":true,"style":{"filter":"brightness(0) invert(1)"}}]}],["$","nav",null,{"className":"publicNav","aria-label":"Main navigation","children":[["$","$L10",null,{"href":"/login","children":"Retail Partner Login"}],["$","$L10",null,{"href":"/about","children":"About"}],["$","$L10",null,{"href":"/contact-us","children":"Contact"}]]}],["$","div",null,{"className":"headerActions"}]]}]
7:["$","main",null,{"children":["$","$L2",null,{"parallelRouterKey":"children","error":"$undefined","errorStyles":"$undefined","errorScripts":"$undefined","template":["$","$L3",null,{}],"templateStyles":"$undefined","templateScripts":"$undefined","notFound":[[["$","title",null,{"children":"404: This page could not be found."}],["$","div",null,{"style":"$0:f:0:1:0:props:children:1:props:children:props:children:props:children:props:notFound:0:1:props:style","children":["$","div",null,{"children":[["$","style",null,{"dangerouslySetInnerHTML":{"__html":"body{color:#000;background:#fff;margin:0}.next-error-h1{border-right:1px solid rgba(0,0,0,.3)}@media (prefers-color-scheme:dark){body{color:#fff;background:#000}.next-error-h1{border-right:1px solid rgba(255,255,255,.3)}}"}}],["$","h1",null,{"className":"next-error-h1","style":"$0:f:0:1:0:props:children:1:props:children:props:children:props:children:props:notFound:0:1:props:children:props:children:1:props:style","children":404}],["$","div",null,{"style":"$0:f:0:1:0:props:children:1:props:children:props:children:props:children:props:notFound:0:1:props:children:props:children:2:props:style","children":["$","h2",null,{"style":"$0:f:0:1:0:props:children:1:props:children:props:children:props:children:props:notFound:0:1:props:children:props:children:2:props:children:props:style","children":"This page could not be found."}]}]]}]}]],[]],"forbidden":"$undefined","unauthorized":"$undefined"}]}]
8:["$","footer",null,{"className":"publicFooter","children":["$","div",null,{"className":"container footerGrid","children":[["$","div",null,{"children":[["$","$L11",null,{"src":"/logos/lc-bio-logo.png","alt":"Leaf Cross Biomedical","width":154,"height":52,"style":{"filter":"brightness(0) invert(1)"}}],["$","p",null,{"children":"Health Canada licensed cannabis processor and retailer-only ordering partner in Nelson, BC."}]]}],["$","div",null,{"children":[["$","strong",null,{"children":"Company"}],["$","$L10",null,{"href":"/about","children":"About"}],["$","$L10",null,{"href":"/brands","children":"Brands"}],["$","$L10",null,{"href":"/services","children":"Services"}]]}],["$","div",null,{"children":[["$","strong",null,{"children":"Partners"}],["$","$L10",null,{"href":"/retailers","children":"Retailers"}],["$","$L10",null,{"href":"/b2b","children":"B2B"}],["$","$L10",null,{"href":"/login","children":"Retail Partner Login"}],["$","$L10",null,{"href":"/contact-us","children":"Contact"}]]}],["$","div",null,{"children":[["$","strong",null,{"children":"Legal"}],["$","$L10",null,{"href":"/privacy-policy","children":"Privacy Policy"}],["$","$L10",null,{"href":"/terms-of-use","children":"Terms of Use"}]]}]]}]}]
9:["$","$1","c",{"children":[null,["$","$L2",null,{"parallelRouterKey":"children","error":"$undefined","errorStyles":"$undefined","errorScripts":"$undefined","template":["$","$L3",null,{}],"templateStyles":"$undefined","templateScripts":"$undefined","notFound":"$undefined","forbidden":"$undefined","unauthorized":"$undefined"}]]}]
a:["$","$1","c",{"children":[["$","main",null,{"style":{"background":"#000","minHeight":"100vh"},"children":[["$","section",null,{"style":{"padding":"80px 40px 48px"},"children":[["$","h1",null,{"style":{"margin":"0 0 20px","color":"#fff","fontSize":"clamp(56px, 10vw, 130px)","fontWeight":800,"textTransform":"uppercase","letterSpacing":"-0.01em","lineHeight":0.9},"children":"B2B Clients"}],["$","p",null,{"style":{"margin":0,"color":"#00f6ff","fontSize":"clamp(18px, 2vw, 26px)","fontWeight":600,"fontStyle":"italic"},"children":"What We Offer"}]]}],["$","$L12",null,{}],["$","section",null,{"style":{"background":"#050706","padding":"96px 40px 112px","textAlign":"center","borderTop":"1px solid rgba(255,255,255,0.06)"},"children":[["$","h2",null,{"style":{"margin":"0 0 80px","color":"#fff","fontSize":"clamp(32px, 5vw, 72px)","fontWeight":300,"textTransform":"uppercase","letterSpacing":"0.05em","lineHeight":1},"children":"Why Work With Us"}],["$","div",null,{"style":{"display":"grid","gridTemplateColumns":"repeat(4, 1fr)","gap":40,"maxWidth":1100,"margin":"0 auto"},"children":[["$","div","Access to Premium Craft Cannabis",{"style":{"display":"flex","flexDirection":"column","alignItems":"center","gap":32},"children":[["$","img",null,{"src":"https://leafcross.com/wp-content/uploads/2024/05/file-removebg-preview.png","alt":"Access to Premium Craft Cannabis","style":{"width":150,"height":150,"objectFit":"contain"}}],["$","p",null,{"style":{"margin":0,"color":"rgba(255,255,255,0.9)","fontSize":17,"fontWeight":500,"lineHeight":1.45,"maxWidth":200},"children":"Access to Premium Craft Cannabis"}]]}],["$","div","Trusted Industry Experience",{"style":{"display":"flex","flexDirection":"column","alignItems":"center","gap":32},"children":[["$","img",null,{"src":"https://leafcross.com/wp-content/uploads/2024/05/2-removebg-preview.png","alt":"Trusted Industry Experience","style":{"width":150,"height":150,"objectFit":"contain"}}],["$","p",null,{"style":{"margin":0,"color":"rgba(255,255,255,0.9)","fontSize":17,"fontWeight":500,"lineHeight":1.45,"maxWidth":200},"children":"Trusted Industry Experience"}]]}],["$","div","Distribution Network",{"style":{"display":"flex","flexDirection":"column","alignItems":"center","gap":32},"children":[["$","img",null,{"src":"https://leafcross.com/wp-content/uploads/2024/05/3-removebg-preview.png","alt":"Distribution Network","style":{"width":150,"height":150,"objectFit":"contain"}}],["$","p",null,{"style":{"margin":0,"color":"rgba(255,255,255,0.9)","fontSize":17,"fontWeight":500,"lineHeight":1.45,"maxWidth":200},"children":"Distribution Network"}]]}],["$","div","Speed to Market",{"style":{"display":"flex","flexDirection":"column","alignItems":"center","gap":32},"children":[["$","img",null,{"src":"https://leafcross.com/wp-content/uploads/2024/05/4-removebg-preview.png","alt":"Speed to Market","style":{"width":150,"height":150,"objectFit":"contain"}}],["$","p",null,{"style":{"margin":0,"color":"rgba(255,255,255,0.9)","fontSize":17,"fontWeight":500,"lineHeight":1.45,"maxWidth":200},"children":"Speed to Market"}]]}]]}]]}]]}],[["$","script","script-0",{"src":"/_next/static/chunks/0ezkw5dc9ykn9.js","async":true,"nonce":"$undefined"}]],["$","$L13",null,{"children":["$","$14",null,{"name":"Next.MetadataOutlet","children":"$@15"}]}]]}]
16:[]
b:"$W16"
c:["$","$1","h",{"children":[null,["$","$L17",null,{"children":"$L18"}],["$","div",null,{"hidden":true,"children":["$","$L19",null,{"children":["$","$14",null,{"name":"Next.Metadata","children":"$L1a"}]}]}],null]}]
e:["$","link","0",{"rel":"stylesheet","href":"/_next/static/chunks/1o27bay9d9g8n.css","precedence":"next","crossOrigin":"$undefined","nonce":"$undefined"}]
18:[["$","meta","0",{"charSet":"utf-8"}],["$","meta","1",{"name":"viewport","content":"width=device-width, initial-scale=1"}]]
15:null
1a:[["$","title","0",{"children":"B2B Wholesale | Leaf Cross Biomedical"}],["$","meta","1",{"name":"description","content":"Partner with Leaf Cross Biomedical for B2B cannabis wholesale. Licensed Canadian retailers can apply for private menu access and direct ordering."}]]
