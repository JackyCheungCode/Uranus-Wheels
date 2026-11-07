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
:root{--ink:#101214;--graphite:#252a2e;--metal:#8f989e;--silver:#d9dddf;--paper:#f2f3f2;--surface:#fff;--surface2:#e9ebea;--text:#171a1c;--muted:#697176;--line:rgba(16,18,20,.1);--gold:#b99a68;--gold-dark:#80643a;--content:1280px;--font:"IBM Plex Sans","Helvetica Neue",Arial,sans-serif;font-family:var(--font);font-synthesis:none;text-rendering:optimizeLegibility}
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--paper);color:var(--text)}button,input,select,textarea{font:inherit}a{color:inherit;text-decoration:none}.topline{height:3px;background:linear-gradient(90deg,var(--gold),#e1d2b5 48%,var(--gold-dark))}
.header{background:var(--ink);color:#f7f8f8}.header-inner{max-width:var(--content);min-height:78px;margin:auto;padding:0 32px;display:flex;align-items:center;justify-content:space-between;gap:24px}.brand{display:flex;flex-direction:column;gap:2px}.brand strong{font-size:20px;font-weight:650;letter-spacing:.16em}.brand small{font-size:9px;color:#9ba2a6;letter-spacing:.29em;text-transform:uppercase}.nav{display:flex;align-items:center;gap:28px}.nav a{font-size:11px;color:#b9c0c4;letter-spacing:.1em;text-transform:uppercase}.nav a.active,.nav a:hover{color:#fff}.header-right{display:flex;align-items:center;gap:12px}.lang{border:1px solid #495055;background:transparent;color:#e1e4e5;padding:8px 10px;font-size:10px;letter-spacing:.1em}.menu{display:none;background:transparent;color:#fff;border:1px solid #495055;padding:8px 12px}
.hero{background:var(--ink);color:white;overflow:hidden}.hero-inner{max-width:var(--content);margin:auto;padding:60px 32px 66px;display:grid;grid-template-columns:1.2fr .8fr;gap:40px;align-items:center}.eyebrow{color:var(--gold);font-size:10px;font-weight:600;letter-spacing:.22em;text-transform:uppercase}.hero h1{font-size:clamp(42px,5.8vw,72px);font-weight:500;line-height:.98;letter-spacing:-.055em;margin:17px 0 18px;max-width:680px}.hero-copy{font-size:14px;line-height:1.75;color:#aeb5b9;max-width:590px}.hero-wheel{position:relative;width:min(100%,300px);aspect-ratio:1;margin:auto;border-radius:50%;background:radial-gradient(circle at 50% 50%,#141719 0 15%,#454e53 16% 18%,#111416 19% 26%,#aab1b5 27% 28%,#252a2e 29% 34%,#778188 35% 36%,#1a1e21 37% 47%,#555e63 48% 49%,#171a1c 50% 58%,#899197 59% 60%,#262b2f 61% 70%,#a4aaad 71% 72%,#1b1e20 73% 100%);box-shadow:0 25px 65px #0008,inset 0 0 0 1px #ffffff30}.hero-wheel:before{content:"";position:absolute;inset:19%;border-radius:50%;background:repeating-conic-gradient(from 8deg,transparent 0 8deg,#d3daddbb 8.5deg 10deg,transparent 10.5deg 18deg);mask:radial-gradient(circle,transparent 0 21%,#000 22% 100%)}.hero-wheel:after{content:"";position:absolute;inset:43%;border-radius:50%;border:2px solid #aab1b5;background:radial-gradient(circle,#4c555a,#101214 72%);box-shadow:0 0 0 7px #242a2e,0 0 0 9px #8c959a}
main{max-width:var(--content);margin:auto;padding:0 32px 80px}.finder-wrap{margin-top:-1px;padding-top:34px}.intro{display:flex;justify-content:space-between;align-items:end;gap:20px;margin-bottom:20px}.kicker{font-size:10px;color:var(--gold-dark);font-weight:600;letter-spacing:.18em;text-transform:uppercase}.intro h2{font-size:clamp(26px,3vw,36px);font-weight:500;letter-spacing:-.04em;margin:7px 0 0}.intro p{max-width:420px;font-size:12px;color:var(--muted);line-height:1.65;margin:0}
.methods{display:grid;grid-template-columns:1fr 1fr;gap:16px;align-items:stretch}.method{background:var(--surface);padding:26px 28px 28px;min-width:0}.method.ai{background:#e9e9e6}.method-head{display:flex;justify-content:space-between;align-items:start;gap:14px;margin-bottom:22px}.method-number{font-size:10px;color:var(--gold-dark);letter-spacing:.15em}.method h3{font-size:22px;font-weight:500;letter-spacing:-.035em;margin:5px 0 5px}.method-sub{font-size:11px;color:var(--muted);line-height:1.6}.method-icon{width:42px;height:42px;display:grid;place-items:center;background:#f0f1ef;color:#333a3e;font-size:18px}.ai .method-icon{background:#dcded9}
.form-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}.field-group{display:grid;gap:7px;min-width:0}.field-group.full{grid-column:1/-1}.label{font-size:10px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#4f585d}.control{height:46px;width:100%;border:1px solid rgba(16,18,20,.16);border-radius:2px;background:#f8f9f8;color:var(--text);padding:0 13px;outline:none}.control:focus,.prompt:focus{border-color:var(--gold-dark);box-shadow:0 0 0 2px #b99a682e}.control:disabled{opacity:.5;cursor:not-allowed}.select-wrap{position:relative}.select-wrap:after{content:"";position:absolute;right:15px;top:18px;width:7px;height:7px;border-right:1px solid #596166;border-bottom:1px solid #596166;transform:rotate(45deg);pointer-events:none}.control.select{appearance:none;padding-right:34px}
.btn{min-height:46px;display:inline-flex;align-items:center;justify-content:center;padding:0 18px;border:1px solid transparent;border-radius:2px;cursor:pointer;font-size:10px;font-weight:600;letter-spacing:.11em;text-transform:uppercase;transition:background .16s ease,transform .16s ease}.btn:hover{transform:translateY(-1px)}.btn-primary{background:var(--ink);color:white}.btn-primary:hover{background:#333a3e}.btn-gold{background:var(--gold);color:#171717}.btn-gold:hover{background:#cbb184}.btn:disabled{opacity:.5;cursor:wait;transform:none}.submit-row{display:flex;align-items:center;justify-content:space-between;gap:14px;margin-top:20px}.micro{font-size:10px;color:var(--muted);line-height:1.5}
.prompt{width:100%;min-height:140px;resize:vertical;border:1px solid rgba(16,18,20,.16);border-radius:2px;background:#f7f8f5;padding:14px;outline:none;font-size:13px;line-height:1.6;color:var(--text)}.examples{display:flex;flex-wrap:wrap;gap:7px;margin-top:11px}.example{border:1px solid #c9ccc6;background:transparent;color:#50585b;padding:7px 9px;font-size:10px;cursor:pointer}.example:hover{border-color:var(--gold-dark);color:#302a20}.ai-footer{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:18px}.ai-note{font-size:10px;color:#68716d;line-height:1.5}
.results{display:none;margin-top:28px}.results.visible{display:block}.results-head{display:flex;align-items:end;justify-content:space-between;gap:18px;margin-bottom:14px}.results-head h2{margin:6px 0 0;font-size:26px;font-weight:500;letter-spacing:-.035em}.results-meta{font-size:10px;color:var(--muted)}.result-card{background:var(--surface);padding:24px 26px}.vehicle-line{display:flex;justify-content:space-between;gap:16px;align-items:start;padding-bottom:18px;margin-bottom:18px;background:linear-gradient(90deg,#f2f3f2,#fff);padding:16px}.vehicle-line strong{font-size:17px;font-weight:600}.vehicle-line span{font-size:10px;color:var(--muted)}.specs{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}.spec{background:#f1f2f1;padding:16px 14px;min-width:0}.spec label{display:block;color:var(--muted);font-size:9px;letter-spacing:.12em;text-transform:uppercase}.spec strong{display:block;margin-top:8px;font-size:22px;font-weight:500;letter-spacing:-.03em;overflow-wrap:anywhere}.spec small{display:block;margin-top:5px;color:var(--muted);font-size:9px;line-height:1.45}.fitment-details{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:10px}.fitment-detail{padding:16px;background:#f8f9f8}.fitment-detail label{display:block;font-size:9px;color:var(--muted);text-transform:uppercase;letter-spacing:.1em}.fitment-detail strong{display:block;margin-top:8px;font-size:14px;font-weight:500;line-height:1.45}.advice{margin-top:16px;padding:18px 20px;background:#f1eee8}.advice h4{margin:0 0 8px;font-size:12px;font-weight:600}.advice p{margin:0;color:#4f5555;font-size:12px;line-height:1.7;white-space:pre-wrap}.warning{margin-top:14px;padding:12px 14px;background:#f7f3eb;color:#62553f;font-size:10px;line-height:1.6}.source-line{display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px;margin-top:16px;color:var(--muted);font-size:9px}.source-line a{text-decoration:underline;text-underline-offset:3px}.message{display:none;margin-top:15px;padding:13px 15px;background:#f7f3eb;color:#66573f;font-size:11px;line-height:1.6}.message.visible{display:block}.loader{display:inline-block;width:13px;height:13px;border:2px solid #ffffff55;border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite;margin-right:8px;vertical-align:-2px}@keyframes spin{to{transform:rotate(360deg)}}
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
<div class="field-group full"><label class="label" for="make">Vehicle make</label><div class="select-wrap"><select class="control select" id="make" required><option value="">Loading makes…</option></select></div></div>
<div class="field-group"><label class="label" for="model">Model</label><div class="select-wrap"><select class="control select" id="model" required disabled><option value="">Choose make first</option></select></div></div>
<div class="field-group"><label class="label" for="year">Model year</label><div class="select-wrap"><select class="control select" id="year" required disabled><option value="">Choose model first</option></select></div></div>
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
const makeEl=document.getElementById("make"),modelEl=document.getElementById("model"),yearEl=document.getElementById("year");
const vehicleForm=document.getElementById("vehicleForm"),aiForm=document.getElementById("aiForm");
const vehicleMsg=document.getElementById("vehicleMessage"),aiMsg=document.getElementById("aiMessage");
const results=document.getElementById("results"),resultCard=document.getElementById("resultCard");
const vehicleSubmit=document.getElementById("vehicleSubmit"),aiSubmit=document.getElementById("aiSubmit");
let models=[];
function message(el,text){el.textContent=text;el.classList.add("visible")}
function clearMessage(el){el.textContent="";el.classList.remove("visible")}
function setLoading(btn,on,label){btn.disabled=on;btn.innerHTML=on?'<span class="loader"></span>Working…':label}
function option(text,value){const o=document.createElement("option");o.value=value;o.textContent=text;return o}
function escapeHtml(s){return String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
async function api(path){const r=await fetch(path);const j=await r.json();if(!r.ok||j.error)throw new Error(j.error||"Request failed");return j}
async function loadMakes(){try{const d=await api("/api/makes");makeEl.innerHTML="";makeEl.append(option("Select vehicle make",""));(d.makes||[]).forEach(x=>makeEl.append(option(x.name||x.make,x.name||x.make)));}catch(e){makeEl.innerHTML="";makeEl.append(option("Could not load makes",""));message(vehicleMsg,"Vehicle list could not be loaded. Please try again shortly.")}}
makeEl.addEventListener("change",async()=>{modelEl.disabled=true;yearEl.disabled=true;modelEl.innerHTML="";yearEl.innerHTML="";modelEl.append(option("Loading models…",""));yearEl.append(option("Choose model first",""));if(!makeEl.value)return;try{const d=await api("/api/models?make="+encodeURIComponent(makeEl.value));models=d.models||[];modelEl.innerHTML="";modelEl.append(option("Select model",""));models.forEach(m=>modelEl.append(option(m.name,m.name)));modelEl.disabled=false;}catch(e){modelEl.innerHTML="";modelEl.append(option("Could not load models",""));message(vehicleMsg,e.message)}});
modelEl.addEventListener("change",()=>{yearEl.innerHTML="";yearEl.append(option("Select year",""));const m=models.find(x=>x.name===modelEl.value);(m&&m.years||[]).forEach(y=>yearEl.append(option(y,y)));yearEl.disabled=!modelEl.value});
function showResult(payload,advice,mode){const f=payload.results&&payload.results[0]?payload.results[0]:payload.fitment||payload;const title=[f.make||"",f.model||"",f.year||""].filter(Boolean).join(" ");document.getElementById("resultTitle").textContent=title||"Fitment result";document.getElementById("resultMeta").textContent=mode==="ai"?"AI-assisted lookup · ANKUSI MCP":"Vehicle lookup · ANKUSI API";const pcd=f.bolt_pattern||"Not listed";const bore=f.center_bore_mm?f.center_bore_mm+" mm":"Not listed";const rear=f.center_bore_rear_mm?(" · Rear "+f.center_bore_rear_mm+" mm"):"";const oe=f.oe_wheel||"Not listed";const flush=f.flush_wheel||"Not published";const max=f.max_wheel||"Not published";let adviceHtml=advice?'<div class="advice"><h4>Uranus AI guidance</h4><p>'+escapeHtml(advice)+'</p></div>':"";resultCard.innerHTML='<div class="vehicle-line"><div><strong>'+escapeHtml(title||"Vehicle match")+'</strong><br><span>Fitment record returned by ANKUSI Wheels</span></div><span>DATA VERIFIED AT SOURCE</span></div><div class="specs"><div class="spec"><label>Bolt pattern / PCD</label><strong>'+escapeHtml(pcd)+'</strong><small>Number of lugs × pitch circle diameter</small></div><div class="spec"><label>Center bore</label><strong>'+escapeHtml(bore)+'</strong><small>Hub bore'+escapeHtml(rear)+'</small></div><div class="spec"><label>Lug count</label><strong>'+escapeHtml(f.lug_count||"—")+'</strong><small>Factory hub specification</small></div><div class="spec"><label>Vehicle year</label><strong>'+escapeHtml(f.year||"—")+'</strong><small>Model year in source record</small></div></div><div class="fitment-details"><div class="fitment-detail"><label>Original equipment wheel</label><strong>'+escapeHtml(oe)+'</strong></div><div class="fitment-detail"><label>Flush reference</label><strong>'+escapeHtml(flush)+'</strong></div><div class="fitment-detail"><label>Maximum reference</label><strong>'+escapeHtml(max)+'</strong></div></div>'+adviceHtml+'<div class="warning">Important: flush and maximum sizes are aftermarket reference points, not guaranteed fitment. Exact brake clearance, tire dimensions, suspension, trim and regional variant must be checked before ordering or manufacturing.</div><div class="source-line"><span>Dataset '+escapeHtml(payload.dataset_version||f.dataset_version||"ANKUSI current release")+' · CC BY 4.0</span><a href="'+escapeHtml(f.source_url||"https://ankusiwheels.com/wheel-fitment-api/")+'" target="_blank" rel="noopener">View ANKUSI source ↗</a></div>';results.classList.add("visible");results.scrollIntoView({behavior:"smooth",block:"start"})}
vehicleForm.addEventListener("submit",async e=>{e.preventDefault();clearMessage(vehicleMsg);clearMessage(aiMsg);setLoading(vehicleSubmit,true,"Find wheel specs ↗");try{const q=new URLSearchParams({make:makeEl.value,model:modelEl.value,year:yearEl.value});const d=await api("/api/fitment?"+q.toString());if(!d.results||!d.results.length){message(vehicleMsg,"No exact record was found for this combination. Try another model year or use the AI assistant to clarify the vehicle variant.");return}showResult(d,null,"vehicle")}catch(err){message(vehicleMsg,err.message||"Could not retrieve fitment data.")}finally{setLoading(vehicleSubmit,false,"Find wheel specs ↗")}});
aiForm.addEventListener("submit",async e=>{e.preventDefault();clearMessage(aiMsg);clearMessage(vehicleMsg);setLoading(aiSubmit,true,"Get AI recommendation ↗");try{const r=await fetch("/api/ai-advice",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({prompt:document.getElementById("prompt").value})});const d=await r.json();if(!r.ok)throw new Error(d.error||"AI service is temporarily unavailable.");if(d.type==="clarification"){message(aiMsg,d.message||"Please add your vehicle make, model and year.");return}if(!d.fitment)throw new Error("No verified fitment record was returned. Please provide a more specific vehicle description.");showResult({results:[d.fitment],dataset_version:d.dataset_version},d.advice,"ai")}catch(err){message(aiMsg,err.message||"AI could not complete the lookup.")}finally{setLoading(aiSubmit,false,"Get AI recommendation ↗")}});
document.querySelectorAll("[data-prompt]").forEach(b=>b.addEventListener("click",()=>{document.getElementById("prompt").value=b.dataset.prompt;document.getElementById("prompt").focus()}));
document.getElementById("menuBtn").addEventListener("click",()=>{const nav=document.querySelector(".nav");nav.style.display=nav.style.display==="flex"?"none":"flex";nav.style.position="absolute";nav.style.top="68px";nav.style.left="0";nav.style.right="0";nav.style.padding="18px";nav.style.background="#191d20";nav.style.flexDirection="column";nav.style.alignItems="stretch";nav.style.zIndex="9"});
loadMakes();
})();
</script>
</body></html>`;

function json(data, status) {
  return new Response(JSON.stringify(data), { status: status || 200, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", "access-control-allow-origin": "*" } });
}
async function fetchJson(url) {
  const response = await fetch(url, { headers: { "accept": "application/json" }, signal: AbortSignal.timeout(12000) });
  if (!response.ok) throw new Error("ANKUSI returned HTTP " + response.status);
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
    const distinctModels = new Set(filtered.map(row => String(row.model || "").toLowerCase()));
    if (distinctModels.size === 1) fitment = filtered[0];
    else return json({ type: "clarification", message: "I found more than one vehicle variant. Could you confirm the body style or chassis code (for example, Coupe G82 or Convertible G83)?" });
  } else if (!chassisMatch && !requestedBody && candidates.length === 1) {
    fitment = candidates[0];
  } else if (!candidates.length && mcpFitment) {
    const mcpChassis = String(mcpFitment.chassis_code || "").toLowerCase();
    if (!chassisMatch || !mcpChassis || mcpChassis === chassisMatch[1].toLowerCase()) fitment = mcpFitment;
  }
  if (!fitment) return json({ type: "clarification", message: "I could not confirm one exact vehicle variant in ANKUSI. Please provide the body style or chassis code so I can avoid giving you the wrong wheel specifications." });

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
      if (url.pathname === "/api/ai-advice" && request.method === "POST") return handleAi(request, env);
      if (url.pathname === "/") return new Response(html, { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store", "x-content-type-options": "nosniff" } });
      return new Response("Not found", { status: 404 });
    } catch (error) {
      return json({ error: error && error.message ? error.message : "Unexpected server error." }, 502);
    }
  }
};