const MODEL = "@cf/google/gemma-4-26b-a4b-it";
const ANKUSI = "https://ankusiwheels.com/wp-json/ankusi/v1";
const DATASET_URL = ANKUSI + "/dataset/json";
const MCP_URL = ANKUSI + "/mcp";

const html = String.raw`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="theme-color" content="#101214">
<meta name="description" content="Find forged wheels for your vehicle with precise fitment data and AI-powered guidance.">
<title>Wheel Finder — Uranus Wheels</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;450;500;600;650;700&display=swap" rel="stylesheet">
<style>

/* Automotive aftermarket visual direction: asphalt, titanium and performance orange */
:root{--ink:#171a1d;--graphite:#2b3035;--metal:#8b969d;--silver:#d7dde0;--paper:#eef0f1;--surface:#fbfcfc;--surface2:#e2e6e8;--text:#1b2024;--muted:#667178;--line:rgba(23,26,29,.12);--gold:#e56b35;--gold-dark:#a9431c}
.topline{background:linear-gradient(90deg,#e56b35,#f19a5e 48%,#9d3f1c)}
.method-icon{background:#252b30;color:#f07b43}
.btn-gold,.btn-primary{background:#e56b35;border-color:#e56b35;color:#171a1d}
.btn-gold:hover,.btn-primary:hover{background:#f1844f;border-color:#f1844f}
.kicker,.method-number,.product-card .product-code{color:#bb5127}
.select-option{display:flex;align-items:center;gap:12px}
.select-option{display:flex;align-items:center;gap:12px;min-height:48px}
.make-logo{width:32px;height:32px;flex:0 0 32px;display:grid;place-items:center;border-radius:50%;background:#fff;border:1px solid #d9dfe2;overflow:hidden;color:#39434a;font-size:9px;font-weight:700;letter-spacing:-.04em}
.make-logo img{width:27px;height:27px;object-fit:contain}
.make-logo-fallback{font-size:9px;font-weight:700}
.make-label{display:block;line-height:1.35}
.maker-logo-corner{display:flex;justify-content:flex-end;margin-top:14px}.vehicle-maker-mark{width:76px;height:76px;flex:0 0 76px;display:grid;place-items:center;border-radius:50%;background:#fff;border:1px solid #d9dfe2;box-shadow:0 4px 16px #00000012;overflow:hidden}
.vehicle-maker-mark img{width:62px;height:62px;object-fit:contain}
.vehicle-maker-mark .make-logo-fallback{font-size:19px;color:#30383d}
.vehicle-line{display:flex;justify-content:space-between;align-items:center;gap:18px}
.vehicle-line-main{min-width:0}
.vehicle-line-brand{display:flex;align-items:center;gap:18px}
.spec{position:relative;padding:16px 14px 14px 48px}
.spec-icon{position:absolute;left:14px;top:17px;width:24px;height:24px;color:#b95730;display:grid;place-items:center}
.spec-icon svg{width:22px;height:22px;stroke:currentColor;fill:none;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}
.spec label{letter-spacing:.09em}.fitment-detail{position:relative;padding-left:48px}.fitment-detail .spec-icon{top:16px}
.vehicle-photo{background:#30363b}
.vehicle-confirm{border-left:3px solid #e56b35}
.product-card{border-top:2px solid #d86a39}
.demo-label{color:#a54a26}

:root{--ink:#101214;--graphite:#252a2e;--metal:#8f989e;--silver:#d9dddf;--paper:#f2f3f2;--surface:#fff;--surface2:#e9ebea;--text:#171a1c;--muted:#697176;--line:rgba(16,18,20,.1);--gold:#b99a68;--gold-dark:#80643a;--content:1280px;--font:"IBM Plex Sans","Helvetica Neue",Arial,sans-serif;font-family:var(--font);font-synthesis:none;text-rendering:optimizeLegibility}
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--paper);color:var(--text)}button,input,select,textarea{font:inherit}a{color:inherit;text-decoration:none}.topline{height:3px;background:linear-gradient(90deg,var(--gold),#e1d2b5 48%,var(--gold-dark))}
.header{background:var(--ink);color:#f7f8f8}.header-inner{max-width:var(--content);min-height:78px;margin:auto;padding:0 32px;display:flex;align-items:center;justify-content:space-between;gap:24px}.brand{display:flex;flex-direction:column;gap:2px}.brand strong{font-size:20px;font-weight:650;letter-spacing:.16em}.brand small{font-size:9px;color:#9ba2a6;letter-spacing:.29em;text-transform:uppercase}.nav{display:flex;align-items:center;gap:28px}.nav a{font-size:11px;color:#b9c0c4;letter-spacing:.1em;text-transform:uppercase}.nav a.active,.nav a:hover{color:#fff}.header-right{display:flex;align-items:center;gap:12px}.lang{border:1px solid #495055;background:transparent;color:#e1e4e5;padding:8px 10px;font-size:10px;letter-spacing:.1em}.menu{display:none;background:transparent;color:#fff;border:1px solid #495055;padding:8px 12px}
.hero{background:var(--ink);color:white;overflow:hidden}.hero-inner{max-width:var(--content);margin:auto;padding:60px 32px 66px;display:grid;grid-template-columns:1.2fr .8fr;gap:40px;align-items:center}.eyebrow{color:var(--gold);font-size:10px;font-weight:600;letter-spacing:.22em;text-transform:uppercase}.hero h1{font-size:clamp(42px,5.8vw,72px);font-weight:500;line-height:.98;letter-spacing:-.055em;margin:17px 0 18px;max-width:680px}.hero-copy{font-size:14px;line-height:1.75;color:#aeb5b9;max-width:590px}.hero-wheel{position:relative;width:min(100%,300px);aspect-ratio:1;margin:auto;border-radius:50%;background:radial-gradient(circle at 50% 50%,#141719 0 15%,#454e53 16% 18%,#111416 19% 26%,#aab1b5 27% 28%,#252a2e 29% 34%,#778188 35% 36%,#1a1e21 37% 47%,#555e63 48% 49%,#171a1c 50% 58%,#899197 59% 60%,#262b2f 61% 70%,#a4aaad 71% 72%,#1b1e20 73% 100%);box-shadow:0 25px 65px #0008,inset 0 0 0 1px #ffffff30}.hero-wheel:before{content:"";position:absolute;inset:19%;border-radius:50%;background:repeating-conic-gradient(from 8deg,transparent 0 8deg,#d3daddbb 8.5deg 10deg,transparent 10.5deg 18deg);mask:radial-gradient(circle,transparent 0 21%,#000 22% 100%)}.hero-wheel:after{content:"";position:absolute;inset:43%;border-radius:50%;border:2px solid #aab1b5;background:radial-gradient(circle,#4c555a,#101214 72%);box-shadow:0 0 0 7px #242a2e,0 0 0 9px #8c959a}
main{max-width:var(--content);margin:auto;padding:0 32px 80px}.finder-wrap{margin-top:-1px;padding-top:34px}.intro{display:flex;justify-content:space-between;align-items:end;gap:20px;margin-bottom:20px}.kicker{font-size:10px;color:var(--gold-dark);font-weight:600;letter-spacing:.18em;text-transform:uppercase}.intro h2{font-size:clamp(26px,3vw,36px);font-weight:500;letter-spacing:-.04em;margin:7px 0 0}.intro p{max-width:420px;font-size:12px;color:var(--muted);line-height:1.65;margin:0}
.methods{display:grid;grid-template-columns:1fr 1fr;gap:16px;align-items:stretch}.method{background:var(--surface);padding:26px 28px 28px;min-width:0}.method.ai{background:#e9e9e6}.method-head{display:flex;justify-content:space-between;align-items:start;gap:14px;margin-bottom:22px}.method-number{font-size:10px;color:var(--gold-dark);letter-spacing:.15em}.method h3{font-size:22px;font-weight:500;letter-spacing:-.035em;margin:5px 0 5px}.method-sub{font-size:11px;color:var(--muted);line-height:1.6}.method-icon{width:42px;height:42px;display:grid;place-items:center;background:#f0f1ef;color:#333a3e;font-size:18px}.ai .method-icon{background:#dcded9}
.form-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}.field-group{display:grid;gap:7px;min-width:0}.field-group.full{grid-column:1/-1}.label{font-size:10px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#4f585d}.control{height:46px;width:100%;border:1px solid rgba(16,18,20,.16);border-radius:2px;background:#f8f9f8;color:var(--text);padding:0 13px;outline:none}.control:focus,.prompt:focus{border-color:var(--gold-dark);box-shadow:0 0 0 2px #b99a682e}.control:disabled{opacity:.5;cursor:not-allowed}.custom-select{position:relative}.select-trigger{height:46px;width:100%;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:0 13px;border:1px solid rgba(16,18,20,.16);border-radius:2px;background:#f8f9f8;color:var(--text);text-align:left;cursor:pointer}.select-trigger:focus{outline:none;border-color:var(--gold-dark);box-shadow:0 0 0 2px #b99a682e}.select-trigger:disabled{opacity:.5;cursor:not-allowed}.select-trigger .chevron{width:8px;height:8px;flex:0 0 8px;border-right:1px solid #596166;border-bottom:1px solid #596166;transform:rotate(45deg) translateY(-2px)}.select-menu{position:absolute;z-index:30;top:calc(100% + 6px);left:0;right:0;padding:8px;background:#fff;box-shadow:0 14px 32px rgba(16,18,20,.18);border-radius:2px}.select-menu[hidden]{display:none}.select-search{height:38px;width:100%;padding:0 10px;border:1px solid rgba(16,18,20,.16);background:#f8f9f8;outline:none;font-size:12px}.select-search:focus{border-color:var(--gold-dark)}.select-options{max-height:240px;overflow:auto;margin-top:6px}.select-option{display:flex;align-items:center;gap:12px;width:100%;min-height:48px;padding:8px 10px;text-align:left;border:0;background:transparent;color:var(--text);font-size:12px;cursor:pointer}.select-option:hover,.select-option:focus{outline:none;background:#f0f1ef}.select-option[aria-selected="true"]{background:#f1eee8;color:#4e3d20;font-weight:600}.select-empty{padding:12px 10px;color:var(--muted);font-size:11px}
.btn{min-height:46px;display:inline-flex;align-items:center;justify-content:center;padding:0 18px;border:1px solid transparent;border-radius:2px;cursor:pointer;font-size:10px;font-weight:600;letter-spacing:.11em;text-transform:uppercase;transition:background .16s ease,transform .16s ease}.btn:hover{transform:translateY(-1px)}.btn-primary{background:var(--ink);color:white}.btn-primary:hover{background:#333a3e}.btn-gold{background:var(--gold);color:#171717}.btn-gold:hover{background:#cbb184}.btn:disabled{opacity:.5;cursor:wait;transform:none}.submit-row{display:flex;align-items:center;justify-content:space-between;gap:14px;margin-top:20px}.micro{font-size:10px;color:var(--muted);line-height:1.5}
.prompt{width:100%;min-height:140px;resize:vertical;border:1px solid rgba(16,18,20,.16);border-radius:2px;background:#f7f8f5;padding:14px;outline:none;font-size:13px;line-height:1.6;color:var(--text)}.examples{display:flex;flex-wrap:wrap;gap:7px;margin-top:11px}.example{border:1px solid #c9ccc6;background:transparent;color:#50585b;padding:7px 9px;font-size:10px;cursor:pointer}.example:hover{border-color:var(--gold-dark);color:#302a20}.ai-footer{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:18px}.ai-note{font-size:10px;color:#68716d;line-height:1.5}
.results{display:none;margin-top:28px}.results.visible{display:block}.results-head{display:flex;align-items:end;justify-content:space-between;gap:18px;margin-bottom:14px}.results-head h2{margin:6px 0 0;font-size:26px;font-weight:500;letter-spacing:-.035em}.results-meta{font-size:10px;color:var(--muted)}.result-card{background:var(--surface);padding:24px 26px}.vehicle-line{display:flex;justify-content:space-between;gap:16px;align-items:start;padding-bottom:18px;margin-bottom:18px;background:linear-gradient(90deg,#f2f3f2,#fff);padding:16px}.vehicle-line strong{font-size:17px;font-weight:600}.vehicle-line span{font-size:10px;color:var(--muted)}.specs{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}.spec{background:#f1f2f1;padding:16px 14px;min-width:0}.spec label{display:block;color:var(--muted);font-size:9px;letter-spacing:.12em;text-transform:uppercase}.spec strong{display:block;margin-top:8px;font-size:22px;font-weight:500;letter-spacing:-.03em;overflow-wrap:anywhere}.spec small{display:block;margin-top:5px;color:var(--muted);font-size:9px;line-height:1.45}.fitment-details{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:10px}.fitment-detail{padding:16px;background:#f8f9f8}.fitment-detail label{display:block;font-size:9px;color:var(--muted);text-transform:uppercase;letter-spacing:.1em}.fitment-detail strong{display:block;margin-top:8px;font-size:14px;font-weight:500;line-height:1.45}.advice{margin-top:16px;padding:18px 20px;background:#f1eee8}.advice h4{margin:0 0 8px;font-size:12px;font-weight:600}.advice p{margin:0;color:#4f5555;font-size:12px;line-height:1.7;white-space:pre-wrap}.warning{margin-top:14px;padding:12px 14px;background:#f7f3eb;color:#62553f;font-size:10px;line-height:1.6}.source-line{display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px;margin-top:16px;color:var(--muted);font-size:9px}.source-line a{text-decoration:underline;text-underline-offset:3px}.message{display:none;margin-top:15px;padding:13px 15px;background:#f7f3eb;color:#66573f;font-size:11px;line-height:1.6}.message.visible{display:block}.loader{display:inline-block;width:13px;height:13px;border:2px solid #ffffff55;border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite;margin-right:8px;vertical-align:-2px}@keyframes spin{to{transform:rotate(360deg)}}

.variant-options{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-top:16px}.variant-option{display:flex;flex-direction:column;gap:7px;padding:16px;background:#f4f5f3;border:1px solid #d8dbd7;text-align:left;cursor:pointer}.variant-option:hover{border-color:var(--gold-dark);background:#f1eee8}.variant-option strong{font-size:14px;font-weight:600}.variant-option span{font-size:10px;color:var(--muted);line-height:1.5}.vehicle-confirm{display:grid;grid-template-columns:minmax(220px,.8fr) 1.2fr;gap:20px;padding:18px;background:#171b1e;color:#fff;margin-bottom:16px}.vehicle-photo{width:100%;height:210px;object-fit:cover;background:#2c3236}.vehicle-photo-placeholder{height:210px;display:grid;place-items:center;background:linear-gradient(135deg,#30373b,#171b1e);color:#b8c0c3;font-size:11px;text-align:center;padding:20px}.vehicle-confirm-copy{display:flex;flex-direction:column;justify-content:center;align-items:flex-start;gap:10px}.vehicle-confirm-copy .eyebrow{font-size:9px}.vehicle-confirm-copy h3{font-size:20px;font-weight:500;margin:0}.vehicle-confirm-copy p{font-size:11px;color:#bbc1c3;line-height:1.6;margin:0}.vehicle-confirm-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:4px}.vehicle-confirm .btn{min-height:40px}.vehicle-confirm .btn-outline{border-color:#687176;background:transparent;color:#fff}.vehicle-confirm .image-credit{font-size:9px;color:#aeb5b9}.recommendations{margin-top:22px}.recommendations-head{display:flex;justify-content:space-between;align-items:end;gap:12px;margin-bottom:12px}.recommendations-head h3{font-size:20px;font-weight:500;margin:4px 0}.recommendations-head p{font-size:10px;color:var(--muted);margin:0}.product-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}.product-card{background:#f2f3f1;padding:14px;min-width:0}.wheel-art{height:160px;display:grid;place-items:center;background:linear-gradient(145deg,#e4e6e3,#f7f8f6);margin-bottom:12px;overflow:hidden}.wheel-face{position:relative;width:126px;height:126px;border-radius:50%;background:radial-gradient(circle,#171a1c 0 10%,#9ca4a7 10.5% 13%,#272d30 13.5% 21%,transparent 21.5%),repeating-conic-gradient(from 5deg,#30373a 0 5deg,#b9c0c2 5.5deg 8deg,#3c4448 8.5deg 14deg);box-shadow:inset 0 0 0 7px #737d81,0 8px 18px #0003}.wheel-face:before{content:"";position:absolute;inset:17px;border-radius:50%;border:5px solid #899195;box-shadow:inset 0 0 0 5px #262c30}.wheel-face:after{content:"";position:absolute;inset:43px;border-radius:50%;background:radial-gradient(circle,#aeb5b7 0 22%,#262d31 24% 42%,#858e92 45% 50%,#1c2023 54%);border:2px solid #d1d5d6}.wheel-face.design-two{transform:rotate(18deg);background:radial-gradient(circle,#171a1c 0 10%,#aeb5b7 10.5% 13%,#272d30 13.5% 21%,transparent 21.5%),repeating-conic-gradient(from 0deg,#252b2f 0 3deg,#c2c8ca 3.5deg 10deg,#394145 10.5deg 13deg)}.wheel-face.design-three{background:radial-gradient(circle,#171a1c 0 10%,#aeb5b7 10.5% 13%,#272d30 13.5% 21%,transparent 21.5%),repeating-conic-gradient(from 0deg,#343b3f 0 2deg,#d0d4d5 2.5deg 5deg,#343b3f 5.5deg 9deg)}.product-card .product-code{font-size:9px;color:var(--gold-dark);letter-spacing:.14em}.product-card h4{font-size:15px;font-weight:600;margin:5px 0}.product-card .product-desc{font-size:10px;line-height:1.5;color:var(--muted);min-height:30px}.product-spec{display:flex;justify-content:space-between;gap:8px;padding:8px 0;border-top:1px solid #d9ddda;font-size:10px}.product-spec span{color:var(--muted)}.product-price{font-size:16px;font-weight:600;margin:10px 0 4px}.demo-label{font-size:9px;color:#80643a;letter-spacing:.08em;text-transform:uppercase}.product-card .btn{width:100%;margin-top:10px;min-height:38px;font-size:9px}
@media(max-width:680px){.variant-options,.product-grid{grid-template-columns:1fr}.vehicle-confirm{grid-template-columns:1fr}.vehicle-photo,.vehicle-photo-placeholder{height:190px}.product-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.wheel-art{height:130px}.wheel-face{width:108px;height:108px}.wheel-face:after{inset:36px}}

.footnote{margin-top:24px;padding:16px 0;border-top:1px solid var(--line);font-size:10px;color:var(--muted);line-height:1.7}.footer{background:var(--ink);color:#aeb5b9}.footer-inner{max-width:var(--content);margin:auto;padding:27px 32px;display:flex;justify-content:space-between;gap:18px;font-size:9px;letter-spacing:.08em}.footer strong{color:white;letter-spacing:.14em}
@media(max-width:900px){.header-inner{padding:0 24px}.nav{gap:16px}.nav a{font-size:10px}.hero-inner{padding:54px 24px 60px;gap:25px}main{padding-left:24px;padding-right:24px}.method{padding:22px}.specs{grid-template-columns:repeat(2,1fr)}}
@media(max-width:680px){.header-inner{min-height:68px;padding:0 18px}.brand strong{font-size:17px}.nav{display:none}.menu{display:block}.header-right .lang{display:none}.hero-inner{grid-template-columns:1fr;padding:48px 20px 52px}.hero-wheel{width:min(58vw,220px);margin-top:10px}.hero h1{font-size:clamp(42px,12vw,58px)}main{padding:0 16px 58px}.finder-wrap{padding-top:28px}.intro{display:block}.intro p{margin-top:10px}.methods{grid-template-columns:1fr;gap:12px}.method{padding:22px 18px}.form-grid{gap:12px}.submit-row,.ai-footer{align-items:stretch;flex-direction:column}.submit-row .btn,.ai-footer .btn{width:100%}.results-head{align-items:start;flex-direction:column}.result-card{padding:16px}.vehicle-line{flex-direction:column}.specs{grid-template-columns:repeat(2,1fr)}.fitment-details{grid-template-columns:1fr}.footer-inner{padding:24px 18px;flex-direction:column}}
@media(prefers-reduced-motion:reduce){*,*:before,*:after{scroll-behavior:auto!important;animation-duration:.01ms!important;transition-duration:.01ms!important}}
</style>
</head>
<body>
<div class="topline"></div>
<header class="header"><div class="header-inner">
<a class="brand" href="/" aria-label="Uranus Wheels home"><strong>URANUS</strong><small>Forged Wheels</small></a>
<nav class="nav" aria-label="Main navigation"><a class="active" href="/">Wheel Finder</a><a href="#vehicle-search">Find by Vehicle</a><a href="#ai-search">Ask AI</a></nav>
<div class="header-right"><span class="lang" aria-label="Current language">EN / GLOBAL</span><button class="menu" id="menuBtn" type="button">Menu</button></div>
</div></header>
<section class="hero"><div class="hero-inner">
<div><div class="eyebrow">Uranus Wheels / Fitment Intelligence</div><h1>Find the right fit.<br>Make it yours.</h1><p class="hero-copy">Start with your vehicle, or simply tell us what you drive and what you want. Discover wheel specifications and a considered direction for your next forged set.</p></div>
<div class="hero-wheel" role="img" aria-label="Abstract forged wheel illustration"></div>
</div></section>
<main>
<section class="finder-wrap">
<div class="intro"><div><div class="kicker">Wheel Finder / 01</div><h2>How would you like to find your wheels?</h2></div><p>Two ways to get started. Use vehicle details for a direct specification lookup, or describe your goals and let our AI guide the search.</p></div>
<div class="methods">
<section class="method" id="vehicle-search">
<div class="method-head"><div><div class="method-number">METHOD 01 / VEHICLE LOOKUP</div><h3>Choose your vehicle</h3><div class="method-sub">Select your make, model and year to retrieve available fitment data.</div></div><div class="method-icon" aria-hidden="true">⌖</div></div>
<form id="vehicleForm">
<div class="form-grid">
<div class="field-group full"><label class="label" id="makeLabel">Vehicle make</label><div class="custom-select" id="makeSelect"><button class="select-trigger" type="button" role="combobox" aria-labelledby="makeLabel" aria-haspopup="listbox" aria-expanded="false" aria-controls="makeOptions"><span class="select-value">Loading makes…</span><span class="chevron" aria-hidden="true"></span></button><div class="select-menu" hidden><input class="select-search" type="search" placeholder="Search vehicle make…" aria-label="Search vehicle make"><div class="select-options" id="makeOptions" role="listbox"></div></div></div></div>
<div class="field-group"><label class="label" id="modelLabel">Model</label><div class="custom-select" id="modelSelect"><button class="select-trigger" type="button" role="combobox" aria-labelledby="modelLabel" aria-haspopup="listbox" aria-expanded="false" aria-controls="modelOptions" disabled><span class="select-value">Choose make first</span><span class="chevron" aria-hidden="true"></span></button><div class="select-menu" hidden><input class="select-search" type="search" placeholder="Search vehicle model…" aria-label="Search vehicle model"><div class="select-options" id="modelOptions" role="listbox"></div></div></div></div>
<div class="field-group"><label class="label" id="yearLabel">Model year</label><div class="custom-select" id="yearSelect"><button class="select-trigger" type="button" role="combobox" aria-labelledby="yearLabel" aria-haspopup="listbox" aria-expanded="false" aria-controls="yearOptions" disabled><span class="select-value">Choose model first</span><span class="chevron" aria-hidden="true"></span></button><div class="select-menu" hidden><input class="select-search" type="search" placeholder="Search model year…" aria-label="Search model year"><div class="select-options" id="yearOptions" role="listbox"></div></div></div></div>
</div>
<div class="submit-row"><span class="micro">Factory and reference fitment data from ANKUSI.</span><button class="btn btn-primary" id="vehicleSubmit" type="submit">Find wheel specs <span aria-hidden="true">↗</span></button></div>
</form>
<div class="message" id="vehicleMessage" role="status"></div>
</section>
<section class="method ai" id="ai-search">
<div class="method-head"><div><div class="method-number">METHOD 02 / AI ASSISTANT</div><h3>Ask in your own words</h3><div class="method-sub">Tell us your vehicle, style and driving preferences. No technical terms required.</div></div><div class="method-icon" aria-hidden="true">✳</div></div>
<form id="aiForm">
<div class="field-group"><label class="label" for="prompt">Describe your vehicle and what you have in mind</label><textarea class="prompt" id="prompt" required maxlength="1200" placeholder="Example: I drive a 2022 BMW M4 Competition. I want a 20-inch forged wheel setup with a deep concave look for daily driving. What specs should I consider?"></textarea></div>
<div class="examples"><button class="example" type="button" data-prompt="I drive a 2021 Porsche 911 Carrera. I want a lightweight 20-inch forged wheel setup for street use.">Porsche 911 / street setup</button><button class="example" type="button" data-prompt="I have a 2024 BMW M3 G80 and prefer a flush, aggressive stance without rubbing.">BMW M3 / flush stance</button><button class="example" type="button" data-prompt="I drive a 2023 Mercedes-Benz G-Class. Recommend a forged wheel direction for daily use.">Mercedes G-Class / daily</button></div>
<div class="ai-footer"><span class="ai-note">AI suggestions are based on ANKUSI fitment data where available. Final clearance must be confirmed for your exact vehicle.</span><button class="btn btn-gold" id="aiSubmit" type="submit">Get AI recommendation <span aria-hidden="true">↗</span></button></div>
</form>
<div class="message" id="aiMessage" role="status"></div>
</section>
</div>
<section class="results" id="results" aria-live="polite">
<div class="results-head"><div><div class="kicker">Fitment report / 02</div><h2 id="resultTitle">Your vehicle specifications</h2></div><div class="results-meta" id="resultMeta"></div></div>
<div class="result-card" id="resultCard"></div>
</section>
<div class="footnote">Fitment data is provided by ANKUSI Wheels under the Creative Commons Attribution 4.0 International license. Factory specifications are reference data. Flush and maximum aftermarket sizes are guidance only, not guaranteed fitment. Brake clearance, suspension, tire size, vehicle trim and market specification must be verified before ordering or production.</div>
</section>
</main>
<footer class="footer"><div class="footer-inner"><strong>URANUS WHEELS</strong><span>Precision forged for your individual fit.</span><span>Fitment data: ANKUSI Wheels · CC BY 4.0</span></div></footer>
<script>
(function(){
const vehicleForm=document.getElementById("vehicleForm"),aiForm=document.getElementById("aiForm");
const vehicleMsg=document.getElementById("vehicleMessage"),aiMsg=document.getElementById("aiMessage");
const results=document.getElementById("results"),resultCard=document.getElementById("resultCard");
const vehicleSubmit=document.getElementById("vehicleSubmit"),aiSubmit=document.getElementById("aiSubmit");
let models=[];
function message(el,text){el.textContent=text;el.classList.add("visible")}
function clearMessage(el){el.textContent="";el.classList.remove("visible")}
function setLoading(btn,on,label){btn.disabled=on;btn.innerHTML=on?'<span class="loader"></span>Working…':label}
function escapeHtml(s){return String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
async function api(path){const r=await fetch(path);const j=await r.json();if(!r.ok||j.error)throw new Error(j.error||"Request failed");return j}
function createCustomSelect(rootId,placeholder){
  const root=document.getElementById(rootId),trigger=root.querySelector(".select-trigger"),valueNode=root.querySelector(".select-value"),menu=root.querySelector(".select-menu"),search=root.querySelector(".select-search"),list=root.querySelector(".select-options");
  let options=[],value="",changeHandler=()=>{};
  function close(){menu.hidden=true;trigger.setAttribute("aria-expanded","false")}
  function render(){
    const term=search.value.trim().toLowerCase();
    const matches=options.filter(item=>item.label.toLowerCase().includes(term));
    list.innerHTML="";
    if(!matches.length){const empty=document.createElement("div");empty.className="select-empty";empty.textContent="No matching options";list.append(empty);return}
    matches.forEach(item=>{
      const button=document.createElement("button");button.type="button";button.className="select-option";button.setAttribute("role","option");button.setAttribute("aria-selected",String(item.value===value));
      const logo=document.createElement("span");logo.className="make-logo";const img=document.createElement("img");img.src="https://www.google.com/s2/favicons?domain="+encodeURIComponent(item.logoDomain||"")+"&sz=128";img.alt="";img.loading="lazy";img.referrerPolicy="no-referrer";img.onerror=()=>{logo.innerHTML='<span class="make-logo-fallback">'+escapeHtml(item.initials||item.label.slice(0,2).toUpperCase())+'</span>'};logo.append(img);button.append(logo);
      const label=document.createElement("span");label.className="make-label";label.textContent=item.label;button.append(label);
      button.addEventListener("click",()=>{value=item.value;valueNode.textContent=item.label;close();search.value="";render();trigger.focus();changeHandler(value)});
      button.addEventListener("keydown",event=>{
        const buttons=Array.from(list.querySelectorAll(".select-option"));const index=buttons.indexOf(button);
        if(event.key==="ArrowDown"){event.preventDefault();buttons[Math.min(index+1,buttons.length-1)]?.focus()}
        if(event.key==="ArrowUp"){event.preventDefault();if(index===0)trigger.focus();else buttons[index-1]?.focus()}
        if(event.key==="Escape"){event.preventDefault();close();trigger.focus()}
      });
      list.append(button);
    });
  }
  function open(){if(trigger.disabled)return;menu.hidden=false;trigger.setAttribute("aria-expanded","true");render();search.focus()}
  trigger.addEventListener("click",()=>menu.hidden?open():close());
  trigger.addEventListener("keydown",event=>{
    if(event.key==="ArrowDown"||event.key==="Enter"||event.key===" "){event.preventDefault();open();list.querySelector(".select-option")?.focus()}
    if(event.key==="Escape")close();
  });
  search.addEventListener("input",render);
  search.addEventListener("keydown",event=>{
    if(event.key==="ArrowDown"){event.preventDefault();list.querySelector(".select-option")?.focus()}
    if(event.key==="Escape"){event.preventDefault();close();trigger.focus()}
  });
  document.addEventListener("click",event=>{if(!root.contains(event.target))close()});
  return {
    get value(){return value},
    setOptions(items){options=items||[];value="";valueNode.textContent=placeholder;search.value="";render()},
    setDisabled(disabled){trigger.disabled=!!disabled;if(disabled)close()},
    onChange(handler){changeHandler=handler}
  };
}
const makeEl=createCustomSelect("makeSelect","Select vehicle make");
const modelEl=createCustomSelect("modelSelect","Choose make first");
const yearEl=createCustomSelect("yearSelect","Choose model first");
const MAKE_DOMAINS={"acura":"acura.com","alfa romeo":"alfaromeo.com","aston martin":"astonmartin.com","audi":"audi.com","bentley":"bentleymotors.com","bmw":"bmw.com","buick":"buick.com","byd":"byd.com","cadillac":"cadillac.com","changan":"globalchangan.com","chery":"cheryinternational.com","chevrolet":"chevrolet.com","chrysler":"chrysler.com","citroen":"citroen.com","cupra":"cupraofficial.com","dacia":"dacia.com","daihatsu":"daihatsu.com","dodge":"dodge.com","ferrari":"ferrari.com","fiat":"fiat.com","ford":"ford.com","genesis":"genesis.com","geely":"global.geely.com","gmc":"gmc.com","great wall":"gwm-global.com","haval":"haval-global.com","honda":"honda.com","hongqi":"hongqi-auto.com","hyundai":"hyundai.com","infiniti":"infiniti.com","isuzu":"isuzu.com","jaguar":"jaguar.com","jeep":"jeep.com","kia":"kia.com","lamborghini":"lamborghini.com","land rover":"landrover.com","lexus":"lexus.com","lincoln":"lincoln.com","lotus":"lotuscars.com","lucid":"lucidmotors.com","maserati":"maserati.com","mazda":"mazda.com","mclaren":"mclaren.com","mercedes-benz":"mercedes-benz.com","mg":"mgmotor.com","mini":"mini.com","mitsubishi":"mitsubishi-motors.com","nio":"nio.com","nissan":"nissan-global.com","opel":"opel.com","peugeot":"peugeot.com","polestar":"polestar.com","porsche":"porsche.com","proton":"proton.com","ram":"ramtrucks.com","renault":"renault.com","rivian":"rivian.com","saab":"saab.com","seat":"seat.com","skoda":"skoda-auto.com","smart":"smart.com","subaru":"subaru.com","suzuki":"suzuki.com","tesla":"tesla.com","toyota":"toyota.com","volkswagen":"volkswagen.com","volvo":"volvocars.com","xpeng":"xpeng.com","zeekr":"zeekr.com","perodua":"perodua.com.my","holden":"holden.com.au","pontiac":"pontiac.com","datsun":"datsun.com","scion":"scion.com","ram trucks":"ramtrucks.com"}; 
async function loadMakes(){try{const d=await api("/api/makes");makeEl.setOptions((d.makes||[]).map(x=>{const name=x.name||x.make;const key=String(name).toLowerCase().replace(/\\s+/g," ").trim();const domain=MAKE_DOMAINS[key]||MAKE_DOMAINS[key.replace(/\\s+/g,"")]||((key.replace(/[^a-z0-9]/g,"")||"")+".com");return {label:name,value:name,logoDomain:domain,initials:name.split(/\\s+/).map(w=>w[0]).slice(0,2).join("").toUpperCase()}}));}catch(e){makeEl.setOptions([]);message(vehicleMsg,"Vehicle list could not be loaded. Please try again shortly.")}}
makeEl.onChange(async value=>{
  modelEl.setDisabled(true);yearEl.setDisabled(true);modelEl.setOptions([]);yearEl.setOptions([]);models=[];
  if(!value)return;
  try{const d=await api("/api/models?make="+encodeURIComponent(value));models=d.models||[];modelEl.setOptions(models.map(m=>({label:m.name,value:m.name})));modelEl.setDisabled(false);}
  catch(e){message(vehicleMsg,e.message)}
});
modelEl.onChange(value=>{
  const m=models.find(x=>x.name===value);yearEl.setOptions((m&&m.years||[]).map(y=>({label:y,value:y})));yearEl.setDisabled(!value);
});
function showResult(payload,advice,mode){const f=payload.results&&payload.results[0]?payload.results[0]:payload.fitment||payload;const modelLabel=String(f.model||"").trim();const makeLabel=String(f.make||"").trim();const vehicleLabel=makeLabel&&modelLabel.toLowerCase().startsWith(makeLabel.toLowerCase())?modelLabel:[makeLabel,modelLabel].filter(Boolean).join(" ");const title=[vehicleLabel,f.year||""].filter(Boolean).join(" ");document.getElementById("resultTitle").textContent=title||"Fitment result";document.getElementById("resultMeta").textContent=mode==="ai"?"AI-assisted lookup · ANKUSI MCP":"Vehicle lookup · ANKUSI API";const pcd=f.bolt_pattern||"Not listed";const bore=f.center_bore_mm?f.center_bore_mm+" mm":"Not listed";const rear=f.center_bore_rear_mm?(" · Rear "+f.center_bore_rear_mm+" mm"):"";const oe=f.oe_wheel||"Not listed";const flush=f.flush_wheel||"Not published";const max=f.max_wheel||"Not published";let safeAdvice=advice?escapeHtml(advice).replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>").replace(/^\s*\*\s+/gm,"• ").replace(/\n/g,"<br>"):"";let adviceHtml=advice?'<div class="advice"><h4>Uranus AI guidance</h4><p>'+safeAdvice+'</p></div>':"";const makerDomain=MAKE_DOMAINS[String(makeLabel).toLowerCase().replace(/\\s+/g," ").trim()]||((String(makeLabel).toLowerCase().replace(/[^a-z0-9]/g,"")||"")+".com");const makerInitials=makeLabel.split(/\\s+/).map(w=>w[0]).slice(0,2).join("").toUpperCase();const makerLogo='<span class="vehicle-maker-mark"><img src="https://www.google.com/s2/favicons?domain='+encodeURIComponent(makerDomain)+'&sz=128" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.parentNode.innerHTML=\'<span class=&quot;make-logo-fallback&quot;>'+escapeHtml(makerInitials)+'</span>\'"></span>';const specIcon=(paths)=>'<span class="spec-icon" aria-hidden="true"><svg viewBox="0 0 24 24">'+paths+'</svg></span>';const icons={pcd:'<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="2.2"/><path d="M12 3.5v3M20.5 12h-3M12 20.5v-3M3.5 12h3"/>',bore:'<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.2"/>',lug:'<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="5.5" r="1.1"/><circle cx="18.2" cy="10" r="1.1"/><circle cx="15.8" cy="17.2" r="1.1"/><circle cx="8.2" cy="17.2" r="1.1"/><circle cx="5.8" cy="10" r="1.1"/>',year:'<rect x="3.5" y="5" width="17" height="15" rx="1.5"/><path d="M7.5 3v4M16.5 3v4M3.5 9h17M8 13h2M14 13h2M8 16.5h2"/>',oe:'<path d="M3 15.5h18l-2-6H6l-3 6Z"/><path d="M6 15.5v2M18 15.5v2M7 9.5l1.5-3h7l2.5 3"/>',flush:'<circle cx="12" cy="12" r="8.5"/><path d="M4 12h16M12 4v16M7 7l10 10M17 7 7 17"/>',max:'<path d="M4 19 12 4l8 15H4Z"/><path d="M12 9v5M12 17h.01"/>'};resultCard.innerHTML='<div class="vehicle-line"><div class="vehicle-line-main"><strong>'+escapeHtml(title||"Vehicle match")+'</strong><br><span>Fitment record returned by ANKUSI Wheels</span></div></div><span>DATA VERIFIED AT SOURCE</span></div><div class="specs"><div class="spec">'+specIcon(icons.pcd)+'<label>Bolt pattern / PCD</label><strong>'+escapeHtml(pcd)+'</strong><small>Number of lugs × pitch circle diameter</small></div><div class="spec">'+specIcon(icons.bore)+'<label>Center bore</label><strong>'+escapeHtml(bore)+'</strong><small>Hub bore'+escapeHtml(rear)+'</small></div><div class="spec">'+specIcon(icons.lug)+'<label>Lug count</label><strong>'+escapeHtml(f.lug_count||"—")+'</strong><small>Factory hub specification</small></div><div class="spec">'+specIcon(icons.year)+'<label>Vehicle year</label><strong>'+escapeHtml(f.year||"—")+'</strong><small>Model year in source record</small></div></div><div class="fitment-details"><div class="fitment-detail">'+specIcon(icons.oe)+'<label>Original equipment wheel</label><strong>'+escapeHtml(oe)+'</strong></div><div class="fitment-detail">'+specIcon(icons.flush)+'<label>Flush reference</label><strong>'+escapeHtml(flush)+'</strong></div><div class="fitment-detail">'+specIcon(icons.max)+'<label>Maximum reference</label><strong>'+escapeHtml(max)+'</strong></div></div>'+adviceHtml+'<div class="warning">Important: flush and maximum sizes are aftermarket reference points, not guaranteed fitment. Exact brake clearance, tire dimensions, suspension, trim and regional variant must be checked before ordering or manufacturing.</div><div class="source-line"><span>Dataset '+escapeHtml(payload.dataset_version||f.dataset_version||"ANKUSI current release")+' · CC BY 4.0</span><a href="'+escapeHtml(f.source_url||"https://ankusiwheels.com/wheel-fitment-api/")+'" target="_blank" rel="noopener">View ANKUSI source ↗</a></div>';results.classList.add("visible");renderVehicleImage(f);results.scrollIntoView({behavior:"smooth",block:"start"})}

function renderVariantOptions(data){
  document.getElementById("resultTitle").textContent="Confirm your vehicle";
  document.getElementById("resultMeta").textContent="AI vehicle identification";
  const options=(data.options||[]).slice(0,8);
  resultCard.innerHTML='<div class="advice"><h4>One more detail</h4><p>'+escapeHtml(data.message||"I found several matching vehicles. Choose the exact version below so I can show the correct wheel specifications.")+'</p></div><div class="variant-options">'+options.map((v,i)=>'<button class="variant-option" type="button" data-variant="'+i+'"><strong>'+escapeHtml([v.make,v.model].filter(Boolean).join(" "))+'</strong><span>'+escapeHtml([v.year,v.chassis_code,v.body_style].filter(Boolean).join(" · ")||"Vehicle variant")+'</span><span>Confirm this vehicle →</span></button>').join("")+'</div>';
  options.forEach((v,i)=>{const b=resultCard.querySelector('[data-variant="'+i+'"]');b.addEventListener("click",()=>{const p=document.getElementById("prompt");p.value=p.value+"\nConfirmed vehicle version: "+[v.make,v.model,v.chassis_code,v.body_style,v.year].filter(Boolean).join(" ");aiForm.requestSubmit()})});
  results.classList.add("visible");results.scrollIntoView({behavior:"smooth",block:"start"});
}
async function renderVehicleImage(f){
  const make=String(f.make||"").trim(),model=String(f.model||"").trim(),year=String(f.year||"").trim();
  const title=[make,model,year].filter(Boolean).join(" ");
  const box=document.createElement("section");box.className="vehicle-confirm";
  box.innerHTML='<div class="vehicle-photo-placeholder">Finding a reference image for this vehicle…</div><div class="vehicle-confirm-copy"><div class="eyebrow">STEP 1 / VEHICLE CONFIRMATION</div><h3>Is this your vehicle?</h3><p>Before we recommend a wheel design, please confirm the exact body style and generation shown here.</p><div class="vehicle-confirm-actions"><button type="button" class="btn btn-gold" id="confirmVehicle">Yes, this is my vehicle</button><button type="button" class="btn btn-outline" id="rejectVehicle">Not my vehicle</button></div><div class="image-credit">Reference vehicle image · Wikimedia Commons</div></div>';
  resultCard.prepend(box);
  const yes=box.querySelector("#confirmVehicle"),no=box.querySelector("#rejectVehicle");
  yes.addEventListener("click",()=>{yes.disabled=true;yes.textContent="Vehicle confirmed";no.disabled=true;renderProducts(f)});
  no.addEventListener("click",()=>{box.querySelector(".vehicle-confirm-copy p").textContent="Please refine the body style or chassis code in your vehicle description, then run the AI search again.";yes.disabled=true;no.disabled=true;document.getElementById("prompt").focus()});
  try{
    const q=new URLSearchParams({make,model,year});
    const d=await api("/api/vehicle-image?"+q.toString());
    const holder=box.querySelector(".vehicle-photo-placeholder");
    if(d.image_url){const img=document.createElement("img");img.className="vehicle-photo";img.src=d.image_url;img.alt=title+" reference vehicle";img.loading="lazy";img.onerror=()=>{holder.textContent="A verified reference image could not be loaded. Please confirm using the vehicle details.";};holder.replaceWith(img);const credit=box.querySelector(".image-credit");credit.textContent=(d.title||"Vehicle reference image")+" · Wikimedia Commons";}
    else holder.textContent="No sufficiently matched reference image was found. Please verify the vehicle details before continuing.";
  }catch(e){box.querySelector(".vehicle-photo-placeholder").textContent="Vehicle image unavailable. Please verify the exact vehicle details."}
}
function renderProducts(f){
  if(resultCard.querySelector(".recommendations"))return;
  const products=[
    {code:"UW-M01",name:"MONOBLOCK / 5 SPOKE",desc:"A clean performance profile with a strong, purposeful stance.",finish:"Satin Titanium",price:"US$ 980",design:""},
    {code:"UW-S02",name:"SPORT / SPLIT 5 SPOKE",desc:"A more technical multi-spoke look with a lighter visual character.",finish:"Brushed Graphite",price:"US$ 1,080",design:"design-two"},
    {code:"UW-C03",name:"CONCAVE / MULTI SPOKE",desc:"A deeper visual profile for a more assertive custom build.",finish:"Gloss Black",price:"US$ 1,180",design:"design-three"}
  ];
  const size=f.oe_wheel||"Custom sizing after clearance review";
  const section=document.createElement("section");section.className="recommendations";
  section.innerHTML='<div class="recommendations-head"><div><div class="kicker">STEP 2 / WHEEL SELECTION</div><h3>Explore your forged wheel direction</h3><p>Concept recommendations based on your vehicle reference.</p></div></div><div class="product-grid">'+products.map(p=>'<article class="product-card"><div class="wheel-art"><div class="wheel-face '+p.design+'"></div></div><div class="product-code">'+p.code+'</div><h4>'+p.name+'</h4><div class="product-desc">'+p.desc+'</div><div class="product-spec"><span>Finish</span><strong>'+p.finish+'</strong></div><div class="product-spec"><span>Fitment basis</span><strong>'+escapeHtml(size)+'</strong></div><div class="product-price">'+p.price+' <span style="font-size:9px;font-weight:400;color:#697176">/ wheel</span></div><div class="demo-label">Simulated product · Indicative price</div><button class="btn btn-primary" type="button" data-product="'+p.code+'">Select this design ↗</button></article>').join("")+'</div><div class="warning">These are simulated product concepts and illustrative prices for preview only. They are not live inventory, confirmed quotations or final wheel specifications. Final diameter, width, offset, brake clearance and load rating must be approved for your exact vehicle before production.</div>';
  resultCard.append(section);
  section.querySelectorAll("[data-product]").forEach(btn=>btn.addEventListener("click",()=>{btn.textContent="Added to your selection";btn.disabled=true;const note=document.createElement("p");note.className="micro";note.textContent=btn.dataset.product+" saved as your demo selection. A real product configurator and enquiry flow can be connected in the next stage.";btn.after(note)}));
}

vehicleForm.addEventListener("submit",async e=>{e.preventDefault();clearMessage(vehicleMsg);clearMessage(aiMsg);if(!makeEl.value||!modelEl.value||!yearEl.value){message(vehicleMsg,"Please select your vehicle make, model and year.");return}setLoading(vehicleSubmit,true,"Find wheel specs ↗");try{const q=new URLSearchParams({make:makeEl.value,model:modelEl.value,year:yearEl.value});const d=await api("/api/fitment?"+q.toString());if(!d.results||!d.results.length){message(vehicleMsg,"No exact record was found for this combination. Try another model year or use the AI assistant to clarify the vehicle variant.");return}showResult(d,null,"vehicle")}catch(err){message(vehicleMsg,err.message||"Could not retrieve fitment data.")}finally{setLoading(vehicleSubmit,false,"Find wheel specs ↗")}});
aiForm.addEventListener("submit",async e=>{e.preventDefault();clearMessage(aiMsg);clearMessage(vehicleMsg);setLoading(aiSubmit,true,"Get AI recommendation ↗");try{const r=await fetch("/api/ai-advice",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({prompt:document.getElementById("prompt").value})});const d=await r.json();if(!r.ok)throw new Error(d.error||"AI service is temporarily unavailable.");if(d.type==="variant_options"){renderVariantOptions(d);return}if(d.type==="clarification"){message(aiMsg,d.message||"Please add your vehicle make, model and year.");return}if(!d.fitment)throw new Error("No verified fitment record was returned. Please provide a more specific vehicle description.");showResult({results:[d.fitment],dataset_version:d.dataset_version},d.advice,"ai")}catch(err){message(aiMsg,err.message||"AI could not complete the lookup.")}finally{setLoading(aiSubmit,false,"Get AI recommendation ↗")}});
document.querySelectorAll("[data-prompt]").forEach(b=>b.addEventListener("click",()=>{document.getElementById("prompt").value=b.dataset.prompt;document.getElementById("prompt").focus()}));
document.getElementById("menuBtn").addEventListener("click",()=>{const nav=document.querySelector(".nav");nav.style.display=nav.style.display==="flex"?"none":"flex";nav.style.position="absolute";nav.style.top="68px";nav.style.left="0";nav.style.right="0";nav.style.padding="18px";nav.style.background="#191d20";nav.style.flexDirection="column";nav.style.alignItems="stretch";nav.style.zIndex="9"});
loadMakes();
})();
</script>
</body></html>`;

function json(data, status) {
  return new Response(JSON.stringify(data), { status: status || 200, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", "access-control-allow-origin": "*" } });
}
async function fetchJson(url, init = {}) {
  const response = await fetch(url, { ...init, headers: { "accept": "application/json", ...(init.headers || {}) }, signal: AbortSignal.timeout(12000) });
  if (!response.ok) throw new Error("Remote data source returned HTTP " + response.status);
  return response.json();
}
function datasetRows(data) {
  const rows = Array.isArray(data) ? data : Array.isArray(data.data) ? data.data : Array.isArray(data.records) ? data.records : [];
  if (!rows.length || !Array.isArray(rows[0])) return rows;
  const columns = Array.isArray(data.columns) ? data.columns : [];
  return rows.map(row => Object.fromEntries(columns.map((column, index) => [String(column), row[index]])));
}
async function getDataset() {
  const cache = caches.default;
  const key = new Request("https://uranus-internal.invalid/ankusi-dataset-v1");
  const cached = await cache.match(key);
  if (cached) return cached.json();
  const data = await fetchJson(DATASET_URL);
  const response = new Response(JSON.stringify(data), { headers: { "content-type": "application/json", "cache-control": "public, max-age=3600" } });
  await cache.put(key, response);
  return data;
}
async function mcpRequest(body, sessionId) {
  const headers = { "content-type": "application/json", "accept": "application/json, text/event-stream" };
  if (sessionId) headers["mcp-session-id"] = sessionId;
  const response = await fetch(MCP_URL, { method: "POST", headers, body: JSON.stringify(body), signal: AbortSignal.timeout(15000) });
  const sid = response.headers.get("mcp-session-id") || sessionId;
  const raw = await response.text();
  if (!response.ok && response.status !== 202) throw new Error("ANKUSI MCP HTTP " + response.status + ": " + raw.slice(0, 250));
  if (!raw.trim()) return { sessionId: sid, result: null };
  let payload;
  try { payload = JSON.parse(raw); }
  catch (_) {
    const lines = raw.split(/\r?\n/).filter(line => line.startsWith("data:"));
    if (!lines.length) throw new Error("ANKUSI MCP returned an unreadable response.");
    payload = JSON.parse(lines[lines.length - 1].slice(5).trim());
  }
  return { sessionId: sid, result: payload };
}
async function callAnkusiTool(args) {
  const init = await mcpRequest({
    jsonrpc: "2.0", id: 1, method: "initialize",
    params: { protocolVersion: "2025-03-26", capabilities: {}, clientInfo: { name: "uranus-wheels", version: "0.1.0" } }
  });
  if (init.sessionId) {
    await mcpRequest({ jsonrpc: "2.0", method: "notifications/initialized", params: {} }, init.sessionId);
  }
  const called = await mcpRequest({
    jsonrpc: "2.0", id: 2, method: "tools/call",
    params: { name: "lookup_wheel_fitment", arguments: args }
  }, init.sessionId);
  const result = called.result && called.result.result ? called.result.result : called.result;
  if (result && result.isError) throw new Error("ANKUSI MCP tool reported an error.");
  let textContent = "";
  if (result && Array.isArray(result.content)) textContent = result.content.filter(x => x.type === "text").map(x => x.text).join("\n");
  if (!textContent && result) textContent = JSON.stringify(result.structuredContent || result);
  let parsed;
  try { parsed = JSON.parse(textContent); }
  catch (_) {
    const match = textContent.match(/\{[\s\S]*\}/);
    if (match) { try { parsed = JSON.parse(match[0]); } catch (_) {} }
  }
  if (!parsed) throw new Error("ANKUSI MCP returned data in an unsupported format.");
  return parsed;
}
function extractFitment(data) {
  if (Array.isArray(data.results) && data.results.length) return data.results[0];
  if (Array.isArray(data.content)) {
    for (const item of data.content) {
      if (item.text) {
        try { const parsed = JSON.parse(item.text); if (parsed.results && parsed.results[0]) return parsed.results[0]; } catch (_) {}
      }
    }
  }
  if (data.fitment) return data.fitment;
  return null;
}

async function handleVehicleImage(url) {
  const make=String(url.searchParams.get("make")||"").trim();
  const model=String(url.searchParams.get("model")||"").trim();
  const year=String(url.searchParams.get("year")||"").trim();
  if(!make||!model)return json({error:"Vehicle make and model are required."},400);
  const coreTokens=model.toLowerCase().match(/[a-z0-9]+/g)||[];
  const core=coreTokens.filter(t=>t.length>=2&&!["competition","coupe","convertible","sedan","hatchback","wagon","sport","edition","xdrive","quattro","series"].includes(t)).slice(0,2);
  const searches=[year+" "+make+" "+core.join(" ")+" car",make+" "+core.join(" ")+" automobile"].filter(Boolean);
  for(const search of searches){
    const params=new URLSearchParams({action:"query",list:"search",srsearch:search,srnamespace:"6",srlimit:"15",format:"json"});
    const data=await fetchJson("https://commons.wikimedia.org/w/api.php?"+params.toString(),{headers:{"User-Agent":"UranusWheels/1.0 (vehicle reference image lookup)"}});
    const hits=data.query&&data.query.search?data.query.search:[];
    const makeToken=make.toLowerCase().replace(/[^a-z0-9]/g,"");
    const scored=hits.map(hit=>{
      const title=String(hit.title||"").toLowerCase();
      const normalized=title.replace(/[^a-z0-9]/g,"");
      const brandMatch=normalized.includes(makeToken)||title.includes(make.toLowerCase());
      const modelMatch=core.length===0||core.some(t=>normalized.includes(t));
      const score=(brandMatch?4:0)+(modelMatch?3:0)+(year&&title.includes(year)?1:0);
      return {...hit,score,brandMatch,modelMatch};
    }).filter(hit=>hit.brandMatch&&hit.modelMatch).sort((a,b)=>b.score-a.score);
    if(!scored.length)continue;
    const ids=scored.slice(0,5).map(hit=>hit.title);
    const infoParams=new URLSearchParams({action:"query",titles:ids.join("|"),prop:"imageinfo",iiprop:"url|extmetadata",iiurlwidth:"1400",format:"json"});
    const detail=await fetchJson("https://commons.wikimedia.org/w/api.php?"+infoParams.toString(),{headers:{"User-Agent":"UranusWheels/1.0 (vehicle reference image lookup)"}});
    const pages=detail.query&&detail.query.pages?Object.values(detail.query.pages):[];
    const pick=pages.find(page=>page.imageinfo&&page.imageinfo[0]&&(page.imageinfo[0].thumburl||page.imageinfo[0].url));
    if(pick){
      const info=pick.imageinfo[0],meta=info.extmetadata||{};
      return json({image_url:info.thumburl||info.url,title:pick.title,matched:true,license:meta.LicenseShortName&&meta.LicenseShortName.value||"Wikimedia Commons",artist:meta.Artist&&meta.Artist.value||"",source_url:info.descriptionurl||"https://commons.wikimedia.org"});
    }
  }
  return json({image_url:null,title:null,matched:false,year,source:"Wikimedia Commons"});
}

async function handleAi(request, env) {
  if (!env.AI || typeof env.AI.run !== "function") return json({ error: "Workers AI binding is not enabled for this preview." }, 503);
  const body = await request.json();
  const prompt = String(body.prompt || "").trim();
  if (!prompt || prompt.length > 1200) return json({ error: "Please enter a vehicle description (maximum 1,200 characters)." }, 400);
  const system = "You are the Uranus Wheels vehicle fitment extraction assistant. Understand the customer's language. Never guess make, model or year. If make, model and year are clear, you MUST call lookup_wheel_fitment. If a required field is missing or the vehicle variant is ambiguous, ask one concise clarification question in the same language and do not call a tool. Never greet or ask what the customer needs. Do not invent trim or chassis data.";
  const tools = [{
    type: "function",
    function: {
      name: "lookup_wheel_fitment",
      description: "Look up wheel fitment from ANKUSI Wheels MCP. Call only when make, model and year are sufficiently clear.",
      parameters: {
        type: "object",
        properties: {
          make: { type: "string", description: "Vehicle manufacturer, e.g. BMW" },
          model: { type: "string", description: "Vehicle model and body/chassis variant when provided" },
          year: { type: "string", description: "Model year, four digits" },
          limit: { type: "integer", description: "Maximum matching records", minimum: 1, maximum: 5 }
        },
        required: ["make", "model", "year"]
      }
    }
  }];
  const first = await env.AI.run(MODEL, {
    messages: [{ role: "system", content: system }, { role: "user", content: prompt }],
    tools,
    tool_choice: "auto",
    chat_template_kwargs: { enable_thinking: false },
    max_completion_tokens: 500
  });
  const choice = first && first.choices && first.choices[0] && first.choices[0].message;
  if (!choice) return json({ error: "Workers AI returned an unexpected response." }, 502);
  const toolCall = choice.tool_calls && choice.tool_calls[0];
  if (!toolCall) return json({ type: "clarification", message: choice.content || "Please tell me the vehicle make, model and year so I can look up the correct fitment data." });
  let args;
  try { args = JSON.parse(toolCall.function.arguments); } catch (_) { return json({ type: "clarification", message: "Please confirm the vehicle make, model and year." }); }
  if (!args.make || !args.model || !args.year) return json({ type: "clarification", message: "Please confirm the vehicle make, model and year." });

  const make = String(args.make).trim();
  const model = String(args.model).trim();
  const year = String(args.year).trim();
  const mcpData = await callAnkusiTool({ make, model, year, limit: 5 });
  const mcpFitment = extractFitment(mcpData);

  // Cross-check the MCP match against ANKUSI REST API to prevent nearby trims/body styles being mixed.
  const verifyQuery = new URLSearchParams({ make, model, year, limit: "10" });
  const apiData = await fetchJson(ANKUSI + "/fitment?" + verifyQuery.toString());
  const candidates = Array.isArray(apiData.results) ? apiData.results : [];
  const normalizedQuery = model.toLowerCase();
  const chassisMatch = normalizedQuery.match(/\b([a-z]\d{2,3})\b/i);
  const bodyStyles = ["coupe", "convertible", "cabriolet", "cabrio", "sedan", "saloon", "touring", "wagon", "hatchback"];
  const requestedBody = bodyStyles.find(style => normalizedQuery.includes(style));
  let filtered = candidates;
  if (chassisMatch) {
    const chassis = chassisMatch[1].toLowerCase();
    filtered = filtered.filter(row => String(row.chassis_code || "").toLowerCase() === chassis || String(row.model || "").toLowerCase().includes(chassis));
  }
  if (requestedBody) filtered = filtered.filter(row => String(row.model || "").toLowerCase().includes(requestedBody));

  let fitment = null;
  if (filtered.length === 1) {
    fitment = filtered[0];
  } else if (filtered.length > 1) {
    const distinctModels = new Set(filtered.map(row => [row.model,row.chassis_code,row.body_style||row.body].map(x=>String(x||"").toLowerCase()).join("|")));
    if (distinctModels.size === 1) fitment = filtered[0];
    else return json({ type: "variant_options", message: "I found several matching vehicle versions. Choose the one that matches your car so I can use the correct fitment record.", options: filtered.slice(0,8).map(row => ({ make: row.make || make, model: row.model, year: row.year || year, chassis_code: row.chassis_code || "", body_style: row.body_style || row.body || "" })) });
  } else if (!chassisMatch && !requestedBody && candidates.length === 1) {
    fitment = candidates[0];
  } else if (!candidates.length && mcpFitment) {
    const mcpChassis = String(mcpFitment.chassis_code || "").toLowerCase();
    if (!chassisMatch || !mcpChassis || mcpChassis === chassisMatch[1].toLowerCase()) fitment = mcpFitment;
  }
  if (!fitment && candidates.length > 1) return json({ type: "variant_options", message: "I found multiple ANKUSI records for this vehicle. Please select the matching body style or chassis code.", options: candidates.slice(0,8).map(row => ({ make: row.make || make, model: row.model, year: row.year || year, chassis_code: row.chassis_code || "", body_style: row.body_style || row.body || "" })) });
  if (!fitment) return json({ type: "clarification", message: "I could not verify an exact ANKUSI record yet. Please add the model year and, if available, the body style or chassis code. I will not guess the fitment." });

  const second = await env.AI.run(MODEL, {
    messages: [
      { role: "system", content: "You are Uranus Wheels' premium forged-wheel advisor. Reply strictly in the same language as the customer's original message: English stays English, Simplified Chinese stays Simplified Chinese, Traditional Chinese stays Traditional Chinese, Japanese stays Japanese. Never switch to German or another language. Use only the supplied ANKUSI source data and preserve every numeric value exactly. Explain PCD, center bore and OE wheel size. Separate factory specifications from flush/max aftermarket references. If the requested wheel diameter is not fully covered by the reference data, say so and do not invent a size or offset. Ask for confirmation of trim, brakes, tires and suspension where needed. Never guarantee fitment. Keep the answer concise." },
      { role: "user", content: "Customer request: " + prompt + "\n\nANKUSI MCP result cross-checked against ANKUSI REST API (source data; do not alter numeric values):\n" + JSON.stringify(fitment) + "\nDataset version: " + (apiData.dataset_version || mcpData.dataset_version || "ANKUSI current release") + "\nProvide a careful recommendation based only on this record." }
    ],
    chat_template_kwargs: { enable_thinking: false },
    max_completion_tokens: 700
  });
  const advice = second && second.choices && second.choices[0] && second.choices[0].message && second.choices[0].message.content;
  return json({
    type: "result",
    fitment,
    advice: advice || "The ANKUSI fitment record is available. Please confirm the exact trim, brakes, tires and suspension before choosing final wheel dimensions.",
    dataset_version: apiData.dataset_version || mcpData.dataset_version || "ANKUSI current release",
    source: "ANKUSI Wheels MCP + REST API cross-check"
  });
}
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === "OPTIONS") return new Response(null, { headers: { "access-control-allow-origin": "*", "access-control-allow-methods": "GET,POST,OPTIONS", "access-control-allow-headers": "content-type" } });
    try {
      if (url.pathname === "/health") return json({ ok: true, app: "uranus-wheels-wheel-finder", phase: "wheel-finder", ai_model: MODEL, ankusi_api: ANKUSI + "/fitment", ankusi_mcp: MCP_URL });
      if (url.pathname === "/api/makes" && request.method === "GET") {
        const data = await getDataset();
        const names = Array.from(new Set(datasetRows(data).map(row => String(row.make || "").trim()).filter(Boolean))).sort((a, b) => a.localeCompare(b));
        return json({ makes: names.map(name => ({ name })), count: names.length, dataset_version: data.version || data.name || "ANKUSI current release", source: "ANKUSI Wheels Dataset API" });
      }
      if (url.pathname === "/api/models" && request.method === "GET") {
        const make = String(url.searchParams.get("make") || "").trim();
        if (!make) return json({ error: "A vehicle make is required." }, 400);
        const data = await getDataset();
        const rows = datasetRows(data).filter(row => String(row.make || "").toLowerCase() === make.toLowerCase());
        const grouped = new Map();
        for (const row of rows) {
          const name = String(row.model || "").trim();
          if (!name) continue;
          if (!grouped.has(name)) grouped.set(name, new Set());
          String(row.year || "").split(/[;,]/).forEach(y => { const value = y.trim(); if (value) grouped.get(name).add(value); });
        }
        const models = Array.from(grouped.entries()).map(([name, years]) => ({ name, years: Array.from(years).sort((a,b) => Number(b.slice(0,4)) - Number(a.slice(0,4))) })).sort((a,b) => a.name.localeCompare(b.name));
        return json({ make, models, dataset_version: data.version || data.name || "ANKUSI current release", count: models.length, source: "ANKUSI Wheels Dataset" });
      }
      if (url.pathname === "/api/fitment" && request.method === "GET") {
        const make = String(url.searchParams.get("make") || "").trim();
        const model = String(url.searchParams.get("model") || "").trim();
        const year = String(url.searchParams.get("year") || "").trim();
        if (!make || !model || !year) return json({ error: "Make, model and year are required." }, 400);
        const query = new URLSearchParams({ make, model, year, limit: "10" });
        const data = await fetchJson(ANKUSI + "/fitment?" + query.toString());
        return json({ ...data, source: "ANKUSI Wheels API" });
      }
      if (url.pathname === "/api/vehicle-image" && request.method === "GET") return handleVehicleImage(url);
      if (url.pathname === "/api/ai-advice" && request.method === "POST") return handleAi(request, env);
      if (url.pathname === "/") return new Response(html, { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store", "x-content-type-options": "nosniff" } });
      return new Response("Not found", { status: 404 });
    } catch (error) {
      return json({ error: error && error.message ? error.message : "Unexpected server error." }, 502);
    }
  }
};