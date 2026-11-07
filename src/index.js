const html = String.raw`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#101214">
  <meta name="description" content="Uranus Wheels design system foundation preview.">
  <title>Uranus Wheels — Design System Foundation</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;450;500;600;650;700&display=swap" rel="stylesheet">
  <style>
    :root {
      color-scheme: light;
      --uw-ink: #101214;
      --uw-graphite: #252a2e;
      --uw-metal: #8f989e;
      --uw-silver: #d9dddf;
      --uw-paper: #f2f3f2;
      --uw-surface: #ffffff;
      --uw-surface-2: #e9ebea;
      --uw-text: #171a1c;
      --uw-muted: #697176;
      --uw-line: rgba(16,18,20,.10);
      --uw-accent: #b99a68;
      --uw-accent-dark: #80643a;
      --uw-radius-sm: 2px;
      --uw-radius-md: 5px;
      --uw-radius-lg: 10px;
      --uw-content: 1280px;
      --uw-space-1: 4px;
      --uw-space-2: 8px;
      --uw-space-3: 12px;
      --uw-space-4: 16px;
      --uw-space-5: 24px;
      --uw-space-6: 32px;
      --uw-space-7: 48px;
      --uw-space-8: 64px;
      --uw-space-9: 88px;
      --uw-font: "IBM Plex Sans", "Helvetica Neue", Arial, sans-serif;
      font-family: var(--uw-font);
      font-synthesis: none;
      text-rendering: optimizeLegibility;
    }
    * { box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body { margin: 0; background: var(--uw-paper); color: var(--uw-text); }
    a { color: inherit; text-decoration: none; }
    button, input, select { font: inherit; }
    .topline { height: 3px; background: linear-gradient(90deg, var(--uw-accent), #e1d2b5 48%, var(--uw-accent-dark)); }
    .site-header { position: relative; z-index: 5; background: var(--uw-ink); color: #f7f8f8; }
    .header-inner { max-width: var(--uw-content); min-height: 82px; margin: auto; padding: 0 32px; display: flex; align-items: center; justify-content: space-between; gap: 28px; }
    .brand { display: flex; flex-direction: column; gap: 1px; min-width: 178px; }
    .brand-name { font-size: 20px; font-weight: 650; letter-spacing: .16em; line-height: 1.05; }
    .brand-sub { color: #9ba2a6; font-size: 9px; letter-spacing: .29em; text-transform: uppercase; }
    .nav { display: flex; align-items: center; gap: 28px; }
    .nav a { color: #b9c0c4; font-size: 12px; letter-spacing: .1em; text-transform: uppercase; transition: color .18s ease; }
    .nav a:hover, .nav a[aria-current="page"] { color: #fff; }
    .header-meta { display: flex; align-items: center; gap: 12px; }
    .status { border: 1px solid rgba(255,255,255,.22); padding: 7px 10px; color: #c8cdd0; font-size: 9px; letter-spacing: .13em; text-transform: uppercase; }
    .menu-toggle { display: none; border: 1px solid rgba(255,255,255,.24); background: transparent; color: white; padding: 9px 12px; cursor: pointer; }
    .hero { background: var(--uw-ink); color: white; overflow: hidden; }
    .hero-inner { max-width: var(--uw-content); margin: auto; padding: 72px 32px 78px; display: grid; grid-template-columns: minmax(0,1.25fr) minmax(260px,.75fr); align-items: center; gap: 56px; }
    .eyebrow { color: var(--uw-accent); font-size: 10px; font-weight: 600; letter-spacing: .22em; text-transform: uppercase; }
    h1 { max-width: 720px; margin: 18px 0 18px; font-size: clamp(42px,6vw,76px); font-weight: 500; line-height: .99; letter-spacing: -.055em; }
    .hero-copy { max-width: 590px; color: #aeb5b9; font-size: 15px; line-height: 1.75; }
    .hero-actions { display: flex; gap: 12px; margin-top: 30px; flex-wrap: wrap; }
    .button { min-height: 44px; display: inline-flex; align-items: center; justify-content: center; padding: 0 18px; border: 1px solid transparent; border-radius: var(--uw-radius-sm); cursor: pointer; font-size: 11px; font-weight: 600; letter-spacing: .11em; text-transform: uppercase; transition: transform .18s ease, background .18s ease, border-color .18s ease; }
    .button:hover { transform: translateY(-1px); }
    .button-primary { background: var(--uw-accent); color: #171717; }
    .button-primary:hover { background: #cbb184; }
    .button-quiet { border-color: rgba(255,255,255,.28); color: white; background: transparent; }
    .button-dark { background: var(--uw-ink); color: white; }
    .button-outline { background: transparent; border-color: rgba(16,18,20,.24); color: var(--uw-text); }
    .wheel-mark { position: relative; width: min(100%,340px); aspect-ratio: 1; margin: 0 auto; border-radius: 50%; background: radial-gradient(circle at 50% 50%, #141719 0 16%, #3d454a 17% 18%, #111416 19% 26%, #9ca4a8 27% 28%, #252a2e 29% 34%, #778188 35% 36%, #1a1e21 37% 47%, #555e63 48% 49%, #171a1c 50% 58%, #899197 59% 60%, #262b2f 61% 70%, #a4aaad 71% 72%, #1b1e20 73% 100%); box-shadow: 0 28px 70px rgba(0,0,0,.45), inset 0 0 0 1px rgba(255,255,255,.2); }
    .wheel-mark:before { content: ""; position: absolute; inset: 20%; border-radius: 50%; background: repeating-conic-gradient(from 8deg, transparent 0deg 8deg, rgba(211,218,221,.72) 8.5deg 10deg, transparent 10.5deg 18deg); mask: radial-gradient(circle, transparent 0 21%, #000 22% 100%); }
    .wheel-mark:after { content: ""; position: absolute; inset: 43%; border-radius: 50%; border: 2px solid #aab1b5; background: radial-gradient(circle, #4c555a, #101214 72%); box-shadow: 0 0 0 7px #242a2e, 0 0 0 9px #8c959a; }
    .wheel-caption { position: absolute; right: -8px; bottom: 6px; color: #9ea7ab; font-size: 9px; letter-spacing: .2em; text-transform: uppercase; }
    main { max-width: var(--uw-content); margin: auto; padding: 0 32px 88px; }
    .section { padding-top: 68px; }
    .section-head { display: flex; justify-content: space-between; align-items: end; gap: 24px; margin-bottom: 24px; }
    .section-kicker { color: var(--uw-accent-dark); font-size: 10px; font-weight: 600; letter-spacing: .18em; text-transform: uppercase; }
    h2 { margin: 7px 0 0; font-size: clamp(25px,3vw,36px); line-height: 1.1; font-weight: 500; letter-spacing: -.035em; }
    .section-note { max-width: 430px; color: var(--uw-muted); font-size: 12px; line-height: 1.65; }
    .token-grid { display: grid; grid-template-columns: repeat(6,1fr); gap: 12px; }
    .token { min-width: 0; background: var(--uw-surface); }
    .swatch { height: 92px; }
    .token-info { padding: 13px 13px 15px; }
    .token-name { display: block; font-size: 11px; font-weight: 600; }
    .token-value { display: block; margin-top: 4px; color: var(--uw-muted); font-size: 10px; font-variant-numeric: tabular-nums; }
    .demo-grid { display: grid; grid-template-columns: 1.1fr .9fr; gap: 16px; }
    .panel { background: var(--uw-surface); padding: 28px; }
    .panel-dark { background: var(--uw-graphite); color: white; }
    .panel-label { color: var(--uw-accent-dark); font-size: 9px; font-weight: 600; letter-spacing: .18em; text-transform: uppercase; }
    .panel-dark .panel-label { color: var(--uw-accent); }
    .type-display { margin: 22px 0 12px; font-size: clamp(34px,4vw,52px); font-weight: 500; line-height: 1.02; letter-spacing: -.05em; }
    .type-body { max-width: 560px; color: var(--uw-muted); font-size: 13px; line-height: 1.75; }
    .panel-dark .type-body { color: #b5bdc1; }
    .type-meta { display: flex; gap: 18px; margin-top: 26px; color: #8c959a; font-size: 9px; letter-spacing: .12em; text-transform: uppercase; }
    .scale-list { display: grid; gap: 13px; margin-top: 22px; }
    .scale-row { display: grid; grid-template-columns: 44px 1fr 44px; align-items: center; gap: 12px; color: var(--uw-muted); font-size: 10px; }
    .scale-bar { height: 5px; background: var(--uw-surface-2); }
    .scale-bar span { display: block; height: 100%; background: var(--uw-metal); }
    .controls-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 22px; }
    .control-stack { display: grid; gap: 10px; }
    .control-title { margin-bottom: 4px; font-size: 11px; font-weight: 600; }
    .field-label { color: #555e63; font-size: 10px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; }
    .field, .select { width: 100%; height: 46px; padding: 0 13px; border: 1px solid rgba(16,18,20,.18); border-radius: var(--uw-radius-sm); background: #f8f9f8; color: var(--uw-text); outline: none; }
    .field:focus, .select:focus { border-color: var(--uw-accent-dark); box-shadow: 0 0 0 2px rgba(185,154,104,.18); }
    .select-wrap { position: relative; }
    .select { appearance: none; padding-right: 38px; }
    .select-wrap:after { content: ""; position: absolute; right: 16px; top: 18px; width: 7px; height: 7px; border-right: 1px solid #555e63; border-bottom: 1px solid #555e63; transform: rotate(45deg); pointer-events: none; }
    .button-row { display: flex; flex-wrap: wrap; gap: 9px; }
    .component-card { background: var(--uw-surface); padding: 24px; }
    .component-card p { color: var(--uw-muted); font-size: 12px; line-height: 1.6; }
    .component-meta { display: flex; align-items: center; justify-content: space-between; margin-top: 24px; padding-top: 15px; border-top: 1px solid var(--uw-line); color: var(--uw-muted); font-size: 9px; letter-spacing: .1em; text-transform: uppercase; }
    .layout-demo { display: grid; grid-template-columns: repeat(12,1fr); gap: 8px; margin-top: 20px; }
    .layout-demo span { height: 38px; background: #dce0df; }
    .layout-demo span:nth-child(4n+1) { background: #b7c0c2; }
    .footer { background: var(--uw-ink); color: #aeb5b9; }
    .footer-inner { max-width: var(--uw-content); margin: auto; padding: 28px 32px; display: flex; justify-content: space-between; gap: 20px; font-size: 10px; letter-spacing: .08em; }
    .footer strong { color: white; font-weight: 600; letter-spacing: .14em; }
    @media (max-width: 900px) {
      .nav { gap: 16px; }
      .nav a { font-size: 10px; }
      .header-inner { padding: 0 24px; }
      .hero-inner { gap: 28px; padding: 58px 24px 64px; }
      main { padding-left: 24px; padding-right: 24px; }
      .token-grid { grid-template-columns: repeat(3,1fr); }
    }
    @media (max-width: 680px) {
      .header-inner { min-height: 70px; padding: 0 18px; }
      .brand { min-width: auto; }
      .brand-name { font-size: 17px; }
      .status { display: none; }
      .menu-toggle { display: inline-flex; }
      .nav { display: none; position: absolute; top: 70px; left: 0; right: 0; padding: 18px; background: #191d20; flex-direction: column; align-items: stretch; gap: 0; }
      .nav.is-open { display: flex; }
      .nav a { padding: 13px 4px; border-bottom: 1px solid rgba(255,255,255,.08); font-size: 11px; }
      .hero-inner { grid-template-columns: 1fr; padding: 52px 20px 58px; }
      .wheel-mark { width: min(70vw,260px); margin-top: 10px; }
      main { padding: 0 18px 64px; }
      .section { padding-top: 52px; }
      .section-head { align-items: start; flex-direction: column; gap: 10px; }
      .demo-grid, .controls-grid { grid-template-columns: 1fr; }
      .panel { padding: 22px; }
      .token-grid { grid-template-columns: repeat(2,1fr); }
      .swatch { height: 72px; }
      .footer-inner { padding: 24px 18px; flex-direction: column; }
    }
    @media (prefers-reduced-motion: reduce) {
      *, *:before, *:after { scroll-behavior: auto !important; transition-duration: .01ms !important; }
    }
  </style>
</head>
<body>
  <div class="topline"></div>
  <header class="site-header">
    <div class="header-inner">
      <a class="brand" href="/" aria-label="Uranus Wheels home">
        <span class="brand-name">URANUS</span>
        <span class="brand-sub">Forged Wheels</span>
      </a>
      <nav class="nav" id="primary-nav" aria-label="Primary navigation">
        <a href="#foundation" aria-current="page">Foundation</a>
        <a href="#tokens">Tokens</a>
        <a href="#type">Typography</a>
        <a href="#components">Components</a>
        <a href="#layout">Grid</a>
      </nav>
      <div class="header-meta">
        <span class="status">Design system preview</span>
        <button class="menu-toggle" id="menu-toggle" type="button" aria-expanded="false" aria-controls="primary-nav">Menu</button>
      </div>
    </div>
  </header>
  <section class="hero" id="foundation">
    <div class="hero-inner">
      <div>
        <div class="eyebrow">Uranus Wheels / Foundation 01</div>
        <h1>A system built<br>around precision.</h1>
        <p class="hero-copy">Carbon discipline meets premium automotive character. This foundation defines the visual language, layout rhythm and interaction principles that will guide every Uranus Wheels experience.</p>
        <div class="hero-actions">
          <a class="button button-primary" href="#tokens">Explore design tokens</a>
          <a class="button button-quiet" href="#components">View components</a>
        </div>
      </div>
      <div style="position:relative">
        <div class="wheel-mark" role="img" aria-label="Abstract forged wheel geometry"></div>
        <div class="wheel-caption">Machined precision / 001</div>
      </div>
    </div>
  </section>
  <main>
    <section class="section" id="tokens">
      <div class="section-head">
        <div><div class="section-kicker">01 / Color system</div><h2>Quiet confidence. Metallic precision.</h2></div>
        <p class="section-note">A restrained palette built from graphite, cool neutrals and a controlled champagne-metal accent. Background layers carry the structure; borders are used only when they clarify relationships.</p>
      </div>
      <div class="token-grid">
        <div class="token"><div class="swatch" style="background:#101214"></div><div class="token-info"><span class="token-name">Carbon Black</span><span class="token-value">#101214 · Brand anchor</span></div></div>
        <div class="token"><div class="swatch" style="background:#252a2e"></div><div class="token-info"><span class="token-name">Graphite</span><span class="token-value">#252A2E · Dark surface</span></div></div>
        <div class="token"><div class="swatch" style="background:#8f989e"></div><div class="token-info"><span class="token-name">Titanium</span><span class="token-value">#8F989E · Metal tone</span></div></div>
        <div class="token"><div class="swatch" style="background:#d9dddf"></div><div class="token-info"><span class="token-name">Cool Silver</span><span class="token-value">#D9DDDF · Neutral</span></div></div>
        <div class="token"><div class="swatch" style="background:#f2f3f2"></div><div class="token-info"><span class="token-name">Cool White</span><span class="token-value">#F2F3F2 · Canvas</span></div></div>
        <div class="token"><div class="swatch" style="background:#b99a68"></div><div class="token-info"><span class="token-name">Champagne</span><span class="token-value">#B99A68 · Accent</span></div></div>
      </div>
    </section>
    <section class="section" id="type">
      <div class="section-head">
        <div><div class="section-kicker">02 / Typography & rhythm</div><h2>Clarity at every scale.</h2></div>
        <p class="section-note">IBM Plex Sans provides a precise, contemporary foundation. Display typography is editorial and restrained; product specifications remain highly legible and consistent.</p>
      </div>
      <div class="demo-grid">
        <div class="panel panel-dark">
          <div class="panel-label">Display / IBM Plex Sans Medium</div>
          <div class="type-display">FORGED<br>WITH INTENT.</div>
          <p class="type-body">Every line, surface and proportion has a purpose. The design system gives the brand room to express performance without sacrificing clarity.</p>
          <div class="type-meta"><span>Display 52 / 1.02</span><span>Tracking -5%</span></div>
        </div>
        <div class="panel">
          <div class="panel-label">Spacing scale / 4px base unit</div>
          <div class="scale-list">
            <div class="scale-row"><span>Space 1</span><div class="scale-bar"><span style="width:5%"></span></div><span>4 px</span></div>
            <div class="scale-row"><span>Space 2</span><div class="scale-bar"><span style="width:10%"></span></div><span>8 px</span></div>
            <div class="scale-row"><span>Space 3</span><div class="scale-bar"><span style="width:15%"></span></div><span>12 px</span></div>
            <div class="scale-row"><span>Space 4</span><div class="scale-bar"><span style="width:20%"></span></div><span>16 px</span></div>
            <div class="scale-row"><span>Space 5</span><div class="scale-bar"><span style="width:30%"></span></div><span>24 px</span></div>
            <div class="scale-row"><span>Space 6</span><div class="scale-bar"><span style="width:40%"></span></div><span>32 px</span></div>
            <div class="scale-row"><span>Space 7</span><div class="scale-bar"><span style="width:60%"></span></div><span>48 px</span></div>
            <div class="scale-row"><span>Space 8</span><div class="scale-bar"><span style="width:80%"></span></div><span>64 px</span></div>
          </div>
        </div>
      </div>
    </section>
    <section class="section" id="components">
      <div class="section-head">
        <div><div class="section-kicker">03 / Core components</div><h2>Functional by design.</h2></div>
        <p class="section-note">Controls inherit Carbon interaction discipline, then receive Uranus-specific visual treatment. Inputs use clear focus states and custom select styling rather than browser-default appearance.</p>
      </div>
      <div class="demo-grid">
        <div class="panel">
          <div class="control-stack">
            <div class="control-title">Button hierarchy</div>
            <div class="button-row"><button class="button button-dark" type="button">Primary action</button><button class="button button-outline" type="button">Secondary</button></div>
            <div style="height:10px"></div>
            <label class="field-label" for="sample-field">Text input</label>
            <input class="field" id="sample-field" type="text" placeholder="Enter a vehicle or keyword">
            <label class="field-label" for="sample-select">Custom select</label>
            <div class="select-wrap"><select class="select" id="sample-select"><option>Select a wheel category</option><option>Monoblock Forged</option><option>2-Piece Forged</option><option>3-Piece Forged</option></select></div>
          </div>
        </div>
        <div class="component-card">
          <div class="panel-label">Information surface</div>
          <h3 style="font-size:22px;font-weight:500;letter-spacing:-.03em;margin:17px 0 8px">Product specification</h3>
          <p>Use surface contrast and spacing to group related information. Reserve dividers for data rows or boundaries that genuinely need separation.</p>
          <div class="component-meta"><span>Forged construction</span><span>Specimen 01</span></div>
        </div>
      </div>
    </section>
    <section class="section" id="layout">
      <div class="section-head">
        <div><div class="section-kicker">04 / Layout foundation</div><h2>One grid. Every experience.</h2></div>
        <p class="section-note">A responsive 12-column grid, consistent content width and predictable breakpoints provide the foundation for editorial storytelling, product discovery and data-dense fitment workflows.</p>
      </div>
      <div class="panel">
        <div class="panel-label">12-column grid / illustrative</div>
        <div class="layout-demo" aria-label="Twelve column layout grid"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div>
        <div class="component-meta"><span>Max content width / 1280 px</span><span>Desktop · Tablet · Mobile</span></div>
      </div>
    </section>
  </main>
  <footer class="footer">
    <div class="footer-inner"><strong>URANUS WHEELS</strong><span>Design system foundation preview · Not a production storefront</span><span>Carbon foundation × Premium automotive</span></div>
  </footer>
  <script>
    const toggle = document.getElementById("menu-toggle");
    const nav = document.getElementById("primary-nav");
    toggle?.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.textContent = open ? "Close" : "Menu";
    });
    nav?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle?.setAttribute("aria-expanded", "false");
      if (toggle) toggle.textContent = "Menu";
    }));
  </script>
</body>
</html>`;

export default {
  async fetch(request) {
    const url = new URL(request.url);
    if (url.pathname === "/health") {
      return Response.json({ ok: true, app: "uranus-wheels-preview", phase: "design-system" });
    }
    return new Response(html, {
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "no-store",
        "x-content-type-options": "nosniff"
      }
    });
  }
};