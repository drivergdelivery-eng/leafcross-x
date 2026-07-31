1:"$Sreact.fragment"
2:I[39756,["/_next/static/chunks/05-c3ty_6dwfk.js","/_next/static/chunks/14mrh2-p_w84d.js"],"default"]
3:I[37457,["/_next/static/chunks/05-c3ty_6dwfk.js","/_next/static/chunks/14mrh2-p_w84d.js"],"default"]
4:I[22075,["/_next/static/chunks/05-c3ty_6dwfk.js","/_next/static/chunks/14mrh2-p_w84d.js","/_next/static/chunks/2hknf1kfsng_5.js"],"default"]
c:I[68027,["/_next/static/chunks/05-c3ty_6dwfk.js","/_next/static/chunks/14mrh2-p_w84d.js"],"default",1]
:HL["/_next/static/chunks/1o27bay9d9g8n.css","style"]
5:T49c7,
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
    0:{"P":null,"c":["","admin","queries"],"q":"","i":false,"f":[[["",{"children":["admin",{"children":["queries",{"children":["__PAGE__",{}]}]}]},"$undefined","$undefined",16],[["$","$1","c",{"children":[[["$","link","0",{"rel":"stylesheet","href":"/_next/static/chunks/1o27bay9d9g8n.css","precedence":"next","crossOrigin":"$undefined","nonce":"$undefined"}],["$","script","script-0",{"src":"/_next/static/chunks/05-c3ty_6dwfk.js","async":true,"nonce":"$undefined"}],["$","script","script-1",{"src":"/_next/static/chunks/14mrh2-p_w84d.js","async":true,"nonce":"$undefined"}]],["$","html",null,{"lang":"en","children":["$","body",null,{"children":["$","div",null,{"className":"site-shell","children":["$","$L2",null,{"parallelRouterKey":"children","error":"$undefined","errorStyles":"$undefined","errorScripts":"$undefined","template":["$","$L3",null,{}],"templateStyles":"$undefined","templateScripts":"$undefined","notFound":[[["$","title",null,{"children":"404: This page could not be found."}],["$","div",null,{"style":{"fontFamily":"system-ui,\"Segoe UI\",Roboto,Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\"","height":"100vh","textAlign":"center","display":"flex","flexDirection":"column","alignItems":"center","justifyContent":"center"},"children":["$","div",null,{"children":[["$","style",null,{"dangerouslySetInnerHTML":{"__html":"body{color:#000;background:#fff;margin:0}.next-error-h1{border-right:1px solid rgba(0,0,0,.3)}@media (prefers-color-scheme:dark){body{color:#fff;background:#000}.next-error-h1{border-right:1px solid rgba(255,255,255,.3)}}"}}],["$","h1",null,{"className":"next-error-h1","style":{"display":"inline-block","margin":"0 20px 0 0","padding":"0 23px 0 0","fontSize":24,"fontWeight":500,"verticalAlign":"top","lineHeight":"49px"},"children":404}],["$","div",null,{"style":{"display":"inline-block"},"children":["$","h2",null,{"style":{"fontSize":14,"fontWeight":400,"lineHeight":"49px","margin":0},"children":"This page could not be found."}]}]]}]}]],[]],"forbidden":"$undefined","unauthorized":"$undefined"}]}]}]}]]}],{"children":[["$","$1","c",{"children":[[["$","script","script-0",{"src":"/_next/static/chunks/2hknf1kfsng_5.js","async":true,"nonce":"$undefined"}]],[["$","div",null,{"style":{"position":"fixed","top":16,"right":16,"zIndex":100},"children":["$","$L4",null,{}]}],["$","$L2",null,{"parallelRouterKey":"children","error":"$undefined","errorStyles":"$undefined","errorScripts":"$undefined","template":["$","$L3",null,{}],"templateStyles":"$undefined","templateScripts":"$undefined","notFound":"$undefined","forbidden":"$undefined","unauthorized":"$undefined"}]]]}],{"children":[["$","$1","c",{"children":[null,["$","$L2",null,{"parallelRouterKey":"children","error":"$undefined","errorStyles":"$undefined","errorScripts":"$undefined","template":["$","$L3",null,{}],"templateStyles":"$undefined","templateScripts":"$undefined","notFound":"$undefined","forbidden":"$undefined","unauthorized":"$undefined"}]]}],{"children":[["$","$1","c",{"children":[[["$","style",null,{"children":"$5"}],"$L6"],["$L7","$L8"],"$L9"]}],{},null,false,null]},null,false,"$@a"]},null,false,null]},null,false,null],"$Lb",false]],"m":"$undefined","G":["$c",["$Ld"]],"S":true,"h":null,"s":"$undefined","l":"$undefined","p":"$undefined","d":"$undefined","b":"oD-4z61MrfOjc7ZMZ6cM2"}
e:I[5500,["/_next/static/chunks/05-c3ty_6dwfk.js","/_next/static/chunks/14mrh2-p_w84d.js","/_next/static/chunks/2hknf1kfsng_5.js","/_next/static/chunks/0x6zjdut7o4ve.js","/_next/static/chunks/0cpbef86r_auy.js"],"Image"]
f:I[22016,["/_next/static/chunks/05-c3ty_6dwfk.js","/_next/static/chunks/14mrh2-p_w84d.js","/_next/static/chunks/2hknf1kfsng_5.js","/_next/static/chunks/0x6zjdut7o4ve.js","/_next/static/chunks/0cpbef86r_auy.js"],""]
10:I[5209,["/_next/static/chunks/05-c3ty_6dwfk.js","/_next/static/chunks/14mrh2-p_w84d.js","/_next/static/chunks/2hknf1kfsng_5.js","/_next/static/chunks/0x6zjdut7o4ve.js","/_next/static/chunks/0cpbef86r_auy.js"],"default"]
11:I[71783,["/_next/static/chunks/05-c3ty_6dwfk.js","/_next/static/chunks/14mrh2-p_w84d.js","/_next/static/chunks/2hknf1kfsng_5.js","/_next/static/chunks/0x6zjdut7o4ve.js","/_next/static/chunks/0cpbef86r_auy.js"],"default"]
12:I[97367,["/_next/static/chunks/05-c3ty_6dwfk.js","/_next/static/chunks/14mrh2-p_w84d.js"],"OutletBoundary"]
13:"$Sreact.suspense"
16:I[97367,["/_next/static/chunks/05-c3ty_6dwfk.js","/_next/static/chunks/14mrh2-p_w84d.js"],"ViewportBoundary"]
18:I[97367,["/_next/static/chunks/05-c3ty_6dwfk.js","/_next/static/chunks/14mrh2-p_w84d.js"],"MetadataBoundary"]
6:["$","div",null,{"className":"dashboardShell","children":[["$","aside",null,{"className":"dashboardNav","children":[["$","$Le",null,{"src":"/logos/lc-bio-logo.png","alt":"Leaf Cross Biomedical","width":150,"height":52,"style":{"filter":"brightness(0) invert(1)"}}],[["$","$Lf","/admin",{"href":"/admin","children":"Dashboard"}],["$","$Lf","/admin/menu",{"href":"/admin/menu","children":"Update Menu"}],["$","$Lf","/admin/website",{"href":"/admin/website","children":"Update Website"}],["$","$Lf","/admin/retailers",{"href":"/admin/retailers","children":"Retailers / B2B"}],["$","$Lf","/admin/orders",{"href":"/admin/orders","children":"Orders"}],["$","$Lf","/admin/invoices",{"href":"/admin/invoices","children":"Invoices"}],["$","$Lf","/admin/queries",{"href":"/admin/queries","children":"Queries"}],["$","$Lf","/admin/sales",{"href":"/admin/sales","children":"Track Sales"}]],["$","$L10",null,{}]]}],["$","main",null,{"className":"dashboardMain","children":[["$","p",null,{"className":"eyebrow","children":["admin"," portal"]}],["$","h1",null,{"className":"display","style":{"fontSize":"clamp(34px, 5vw, 62px)"},"children":"Queries"}],["$","$L11",null,{}]]}]]}]
7:["$","script","script-0",{"src":"/_next/static/chunks/0x6zjdut7o4ve.js","async":true,"nonce":"$undefined"}]
8:["$","script","script-1",{"src":"/_next/static/chunks/0cpbef86r_auy.js","async":true,"nonce":"$undefined"}]
9:["$","$L12",null,{"children":["$","$13",null,{"name":"Next.MetadataOutlet","children":"$@14"}]}]
15:[]
a:"$W15"
b:["$","$1","h",{"children":[null,["$","$L16",null,{"children":"$L17"}],["$","div",null,{"hidden":true,"children":["$","$L18",null,{"children":["$","$13",null,{"name":"Next.Metadata","children":"$L19"}]}]}],null]}]
d:["$","link","0",{"rel":"stylesheet","href":"/_next/static/chunks/1o27bay9d9g8n.css","precedence":"next","crossOrigin":"$undefined","nonce":"$undefined"}]
17:[["$","meta","0",{"charSet":"utf-8"}],["$","meta","1",{"name":"viewport","content":"width=device-width, initial-scale=1"}]]
14:null
19:[["$","title","0",{"children":"Leaf Cross Biomedical"}],["$","meta","1",{"name":"description","content":"Retailer-only portal for Leaf Cross Biomedical products, applications, ordering, invoices, and payment instructions."}]]
