<script lang="ts">
  type Model = { name: string; years: string[] };
  type Vehicle = { manufacturer?: string; make?: string; model?: string; year?: string; trim?: string; series?: string; body_class?: string; drive_type?: string; engine?: string; plant_country?: string; ankusi_model?: string; ankusi_year?: string };
  type Row = Record<string, any>;
  let method = $state<'vin'|'mmy'>('vin');
  let vin = $state('');
  let vinBusy = $state(false);
  let busy = $state(false);
  let loading = $state(true);
  let models = $state<Model[]>([]);
  let model = $state('');
  let year = $state('');
  let modelOpen = $state(false);
  let yearOpen = $state(false);
  let modelSearch = $state('');
  let vehicle = $state<Vehicle|null>(null);
  let selectedCandidate = $state<Row|null>(null);
  let candidates = $state<Row[]>([]);
  let catalogChoices = $state<Model[]>([]);
  let fitment = $state<Row|null>(null);
  let fitmentVehicle = $state<Vehicle|null>(null);
  let error = $state('');
  let notice = $state('');
  let source = $state('');

  const norm = (v: unknown) => String(v ?? '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const yearMatch = (v: unknown, target: string) => {
    const s = String(v ?? '').trim();
    if (s === target) return true;
    const ys = s.match(/(?:19|20)\d{2}/g) || [];
    return ys.length >= 2 && Number(target) >= Math.min(...ys.map(Number)) && Number(target) <= Math.max(...ys.map(Number));
  };
  const selectedModel = () => models.find(x => x.name === model);
  const filteredModels = () => models.filter(x => x.name.toLowerCase().includes(modelSearch.trim().toLowerCase()));
  const resultSpecs = () => {
    const f = fitment || {};
    const val = (v: unknown, unit = '') => v == null || String(v).trim() === '' ? '未提供' : String(v) + unit;
    const oeEt = (String(f.oe_wheel || '').match(/ET\s*[+-]?\d+/i) || [])[0];
    return [
      { label:'PCD / 螺栓孔距', value:val(f.bolt_pattern || f.pcd || f.PCD), note:'核对孔数与节圆直径' },
      { label:'中心孔', value:val(f.center_bore_mm || f.center_bore || f.hub_bore_mm, ' mm'), note:f.center_bore_rear_mm ? '后轴中心孔：'+f.center_bore_rear_mm+' mm' : '确认前后轴及定位环要求' },
      { label:'原厂轮毂尺寸', value:val(f.oe_wheel), note:'原厂尺寸参考' },
      { label:'原厂 ET', value:val(oeEt), note:'仅显示来源明确提供的 ET' },
      { label:'Flush 参考', value:val(f.flush_wheel), note:'改装参考值，非适配保证' },
      { label:'Maximum 参考', value:val(f.max_wheel), note:'最大参考值，需再次核验' },
      { label:'螺栓数量', value:val(f.lug_count), note:'应与 PCD 孔数一致' },
      { label:'承载 / 制动间隙', value:val(f.load_rating || f.wheel_load_rating || f.max_load_kg)+' / '+val(f.brake_clearance || f.caliper_clearance), note:'缺失时必须单独工程确认' },
      { label:'螺栓规格 / 座型', value:val(f.lug_thread || f.bolt_thread)+' / '+val(f.lug_seat || f.bolt_seat), note:'按具体车辆版本核实' }
    ];
  };
  const identityFields = () => {
    if (!vehicle) return [];
    return [
      { label:'Manufacturer', value:vehicle.manufacturer }, { label:'Model year', value:vehicle.year },
      { label:'Trim', value:vehicle.trim }, { label:'Series', value:vehicle.series },
      { label:'Body', value:vehicle.body_class }, { label:'Drive', value:vehicle.drive_type },
      { label:'Engine', value:vehicle.engine }, { label:'Plant', value:vehicle.plant_country }
    ].filter(x => x.value);
  };

  async function api(path: string, init?: RequestInit) {
    const r = await fetch(path, { ...init, signal:AbortSignal.timeout(20000), headers:{ accept:'application/json', ...(init?.headers || {}) } });
    const d = await r.json();
    if (!r.ok || d.error) throw new Error(d.error || '请求失败，请稍后重试。');
    return d;
  }
  async function loadModels() {
    loading = true;
    try {
      const d = await api('/api/models?make=BMW');
      models = Array.isArray(d.models) ? d.models : [];
      if (!models.length) throw new Error('BMW 车型数据库暂时没有返回车型。');
      error = '';
    } catch(e) { error = e instanceof Error ? e.message : 'BMW 车型数据暂时不可用。'; }
    finally { loading = false; }
  }
  function clearResult() { fitment = null; fitmentVehicle = null; }
  function chooseModel(v: string) { model = v; year = ''; modelOpen = false; modelSearch = ''; clearResult(); error = ''; }
  function chooseYear(v: string) { year = v; yearOpen = false; clearResult(); error = ''; }

  async function fetchFitment(make: string, modelName: string, modelYear: string, identity?: Vehicle, sourceName = 'ANKUSI') {
    const q = new URLSearchParams({ make, model:modelName, year:modelYear });
    const d = await api('/api/fitment?' + q.toString());
    const rows = Array.isArray(d.results) ? d.results : Array.isArray(d.fitments) ? d.fitments : Array.isArray(d.records) ? d.records : Array.isArray(d.data) ? d.data : d.fitment ? [d.fitment] : [];
    if (!rows.length) throw new Error('没有找到该车型年份对应的轮毂参数。请尝试相邻年份或手动选择车型。');
    fitment = rows[0];
    fitmentVehicle = identity || { make, model:modelName, year:modelYear };
    source = sourceName;
    notice = '已取得轮毂参考数据。参数仍需按具体车辆配置进行工程核验。';
  }

  async function manualSearch() {
    error = ''; notice = ''; clearResult();
    if (!model || !year) { error = '请先选择 BMW 车型和年份。'; return; }
    busy = true;
    try { await fetchFitment('BMW', model, year, { make:'BMW', model, year }, 'BMW 手动选型 · ANKUSI'); }
    catch(e) { error = e instanceof Error ? e.message : '轮毂参数查询失败。'; }
    finally { busy = false; }
  }

  function updateVin(v: string) {
    vin = v.replace(/\s+/g, '').toUpperCase().slice(0,17);
    vehicle = null; selectedCandidate = null; candidates = []; catalogChoices = [];
    error = ''; notice = ''; clearResult();
  }
  async function decodeVin() {
    error = ''; notice = ''; clearResult();
    if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(vin)) { error = '请输入有效的 17 位 VIN。字母 I、O、Q 不会出现在 VIN 中。'; return; }
    vinBusy = true;
    try {
      const d = await api('/api/vin-decode', { method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify({vin}) });
      if (!d.vehicle) throw new Error('VIN 解码没有返回车辆信息。');
      if (norm(d.vehicle.make) !== 'bmw') throw new Error('当前 Fitment Finder 仅支持 BMW。该 VIN 识别为 '+(d.vehicle.make || '未知品牌')+'。');
      vehicle = d.vehicle;
      if (d.status === 'ambiguous' && Array.isArray(d.candidates)) {
        candidates = d.candidates;
        notice = 'VIN 已解码，但数据库返回多个可能版本。请选择最匹配的车型记录。';
      } else {
        candidates = [];
        notice = 'VIN 已解码。请核对车辆信息，再确认并查询轮毂参数。';
      }
    } catch(e) { error = e instanceof Error ? e.message : 'VIN 解码失败，请重试。'; }
    finally { vinBusy = false; }
  }

  async function confirmVin() {
    if (!vehicle) return;
    error = ''; notice = ''; busy = true;
    try {
      const decodedModel = String(selectedCandidate?.model || vehicle.model || '').trim();
      const decodedYear = String(selectedCandidate?.year || vehicle.year || '').trim();
      if (!decodedModel || !decodedYear) throw new Error('VIN 未能识别完整车型和年份，请切换到手动选型。');
      const d = await api('/api/models?make=BMW');
      const catalog = (d.models || []) as Model[];
      const key = norm(decodedModel);
      const available = catalog.filter(item => (item.years || []).some(y => yearMatch(y, decodedYear)));
      const exact = available.filter(item => norm(item.name) === key);
      const matches = exact.length ? exact : available.filter(item => norm(item.name).includes(key) || key.includes(norm(item.name)));
      if (matches.length > 1) {
        catalogChoices = matches;
        notice = 'VIN 名称与轮毂数据库的标准车型名称不同。请选择对应的 BMW 标准车型。';
        return;
      }
      if (!matches[0]) throw new Error('VIN 已识别为 '+decodedModel+'，但 BMW 轮毂目录没有找到可对应的标准车型。请切换到手动选型。');
      const canonicalYear = matches[0].years.find(y => yearMatch(y, decodedYear));
      if (!canonicalYear) throw new Error('已找到车型，但无法匹配对应年份。请使用手动选型。');
      await fetchFitment('BMW', matches[0].name, canonicalYear, { ...vehicle, ankusi_model:matches[0].name, ankusi_year:canonicalYear }, 'VIN 解码 · NHTSA vPIC + ANKUSI');
    } catch(e) { error = e instanceof Error ? e.message : '确认车辆后查询轮毂参数失败。'; }
    finally { busy = false; }
  }
  async function chooseCatalogModel(item: Model) {
    if (!vehicle) return;
    catalogChoices = []; busy = true; error = '';
    try {
      const y = item.years.find(v => yearMatch(v, String(vehicle?.year || ''))) || String(vehicle.year || '');
      await fetchFitment('BMW', item.name, y, { ...vehicle, ankusi_model:item.name, ankusi_year:y }, 'VIN 解码 · NHTSA vPIC + ANKUSI');
    } catch(e) { error = e instanceof Error ? e.message : '车型匹配失败。'; }
    finally { busy = false; }
  }
  $effect(() => {
    const close = (event: MouseEvent) => {
      if (!(event.target as HTMLElement).closest('.custom-picker')) { modelOpen = false; yearOpen = false; }
    };
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  });
  loadModels();
</script>

<svelte:head>
  <title>BMW Fitment Finder — Uranus Wheels</title>
  <meta name="description" content="Decode your BMW VIN or select model and year to review wheel fitment reference data." />
</svelte:head>

<div class="fitment-page">
  <div class="topline"></div>
  <header class="header">
    <a class="brand" href="/"><strong>URANUS WHEELS</strong><small>PRECISION FORGED PERFORMANCE</small></a>
    <a class="home-link" href="/">BACK TO HOME ↗</a>
  </header>
  <main class="main">
    <section class="intro"><p class="eyebrow">BMW APPLICATION LOOKUP</p><h1>FIND YOUR<br/><em>FITMENT.</em></h1><p>Identify your BMW by VIN or select your model and year. Review the source data before moving to wheel selection.</p></section>
    <section class="finder">
      <div class="finder-head"><div><p class="eyebrow">01 / VEHICLE IDENTIFICATION</p><h2>Start with your BMW.</h2></div><span class="lock">BMW ONLY</span></div>
      <div class="tabs" role="tablist" aria-label="Vehicle lookup method">
        <button type="button" role="tab" aria-selected={method === 'vin'} class:active={method === 'vin'} onclick={() => { method='vin'; error=''; notice=''; clearResult(); }}>VIN LOOKUP <span>01</span></button>
        <button type="button" role="tab" aria-selected={method === 'mmy'} class:active={method === 'mmy'} onclick={() => { method='mmy'; error=''; notice=''; clearResult(); }}>MANUAL MODEL <span>02</span></button>
      </div>
      {#if method === 'vin'}
        <div class="lookup" role="tabpanel">
          <label class="field-label" for="vin">17-DIGIT VEHICLE IDENTIFICATION NUMBER</label>
          <div class="vin-row"><input id="vin" value={vin} oninput={e => updateVin(e.currentTarget.value)} maxlength="17" autocomplete="off" placeholder="Enter your 17-character VIN"/><button class="primary" type="button" onclick={decodeVin} disabled={vinBusy}>{vinBusy ? 'DECODING…' : 'DECODE VIN ↗'}</button></div>
          <p class="hint">NHTSA vPIC decodes the VIN. The identified BMW model and year are then matched to the ANKUSI fitment catalogue.</p>
          {#if vehicle}
            <div class="vehicle-review">
              <p class="review-label">VEHICLE IDENTITY · NHTSA vPIC</p><h3>{vehicle.make} {vehicle.model} {vehicle.year}</h3>
              <dl class="identity">
                {#each identityFields() as item}<div><dt>{item.label}</dt><dd>{item.value}</dd></div>{/each}
              </dl>
              {#if candidates.length}
                <p class="field-label">SELECT A MATCHING DATABASE RECORD</p>
                {#each candidates as item}
                  <button class="candidate" type="button" onclick={() => { selectedCandidate=item; candidates=[]; notice='已选择 '+(item.model || '车型版本')+'，请确认车辆。'; }}><strong>{item.model || 'Vehicle variant'}</strong><span>{[item.year,item.chassis_code,item.body_style].filter(Boolean).join(' · ')}</span></button>
                {/each}
              {/if}
              {#if catalogChoices.length}
                <p class="field-label">SELECT THE ANKUSI STANDARD MODEL</p>
                {#each catalogChoices as item}
                  <button class="candidate" type="button" onclick={() => chooseCatalogModel(item)} disabled={busy}><strong>{item.name}</strong><span>{item.years.filter(y => yearMatch(y,String(vehicle?.year || ''))).join(' · ')}</span></button>
                {/each}
              {/if}
              <div class="actions"><button class="primary" type="button" onclick={confirmVin} disabled={busy || candidates.length>0}>{busy ? 'RETRIEVING FITMENT…' : 'CONFIRM VEHICLE & FIND WHEEL SPECS ↗'}</button><button class="secondary" type="button" onclick={() => {vehicle=null;selectedCandidate=null;candidates=[];catalogChoices=[];notice='';error='';}}>EDIT VIN</button></div>
              <p class="hint">No vehicle photo is used. Vehicle identification is based on decoded VIN data, not an image.</p>
            </div>
          {/if}
        </div>
      {:else}
        <div class="lookup" role="tabpanel">
          <div class="locked-make"><span>MAKE</span><strong>BMW</strong><small>FIXED VEHICLE BRAND</small></div>
          <div class="fields">
            <div class="field"><label class="field-label">MODEL</label><div class="custom-picker">
              <button class="picker-trigger" type="button" aria-expanded={modelOpen} onclick={() => {modelOpen=!modelOpen;yearOpen=false;}}>{model || (loading ? 'Loading BMW models…' : 'Choose BMW model')}<i></i></button>
              {#if modelOpen}<div class="picker-menu"><input class="picker-search" bind:value={modelSearch} placeholder="Search BMW model"/><div class="picker-options" role="listbox">{#each filteredModels() as item}<button type="button" role="option" aria-selected={model===item.name} onclick={() => chooseModel(item.name)}>{item.name}</button>{/each}</div></div>{/if}
            </div></div>
            <div class="field"><label class="field-label">MODEL YEAR</label><div class="custom-picker">
              <button class="picker-trigger" type="button" disabled={!model} aria-expanded={yearOpen} onclick={() => {yearOpen=!yearOpen;modelOpen=false;}}>{year || 'Choose model year'}<i></i></button>
              {#if yearOpen}<div class="picker-menu"><div class="picker-options" role="listbox">{#each (selectedModel()?.years || []).slice().sort((a,b)=>Number(b.slice(0,4))-Number(a.slice(0,4))) as item}<button type="button" role="option" aria-selected={year===item} onclick={() => chooseYear(item)}>{item}</button>{/each}</div></div>{/if}
            </div></div>
          </div>
          <div class="actions"><button class="primary" type="button" onclick={manualSearch} disabled={busy || loading || !model || !year}>{busy ? 'RETRIEVING FITMENT…' : 'FIND WHEEL SPECS ↗'}</button><span class="hint">Select a BMW model and year to query ANKUSI fitment data.</span></div>
        </div>
      {/if}
      {#if notice}<p class="notice" role="status">{notice}</p>{/if}
      {#if error}<p class="error" role="alert">{error}</p>{/if}
    </section>
    {#if fitment}
      <section class="result">
        <div class="result-head"><div><p class="eyebrow">02 / FITMENT REFERENCE</p><h2>{fitmentVehicle?.make || 'BMW'} {fitmentVehicle?.ankusi_model || fitmentVehicle?.model || fitment.model} {fitmentVehicle?.ankusi_year || fitmentVehicle?.year || fitment.year}</h2></div><span class="source">{source}</span></div>
        <div class="spec-grid">{#each resultSpecs() as item}<article><span>{item.label}</span><strong>{item.value}</strong><small>{item.note}</small></article>{/each}</div>
        <div class="source-line"><span>DATA SOURCE · ANKUSI WHEELS</span><a href="https://ankusiwheels.com/wheel-fitment-api/" target="_blank" rel="noopener">VIEW SOURCE ↗</a></div>
        <p class="disclaimer">Fitment data is a reference, not an engineering approval or guarantee of safe installation. Exact trim, brake package, wheel load rating, tire dimensions, offsets, fasteners and clearance must be verified before ordering or manufacturing.</p>
      </section>
    {/if}
  </main>
  <footer class="footer"><span>© {new Date().getFullYear()} URANUS WHEELS</span><span>PRECISION FORGED PERFORMANCE</span></footer>
</div>

<style>
  :global(body){margin:0;background:#f0f1ef;color:#171a1c;font-family:Inter,"Helvetica Neue",Arial,sans-serif}
  .fitment-page{min-height:100vh;background:#f0f1ef}.topline{height:3px;background:linear-gradient(90deg,#00a3e0,#292b8e,#e31b3d)}
  .header{height:76px;background:#101416;color:white;display:flex;align-items:center;justify-content:space-between;padding:0 max(24px,calc((100vw - 1240px)/2))}
  .brand{display:flex;flex-direction:column;gap:4px;color:white;text-decoration:none}.brand strong{font-size:18px;letter-spacing:.16em}.brand small{font-size:8px;color:#aab1b5;letter-spacing:.22em}.home-link{font-size:10px;letter-spacing:.1em;color:#d3d8da;text-decoration:none}
  .main{max-width:1120px;margin:auto;padding:64px 28px 88px}.intro{max-width:680px;margin-bottom:34px}.eyebrow{font-size:10px;font-weight:650;letter-spacing:.18em;color:#80643a}.intro h1{font-size:clamp(46px,8vw,82px);line-height:.92;letter-spacing:-.065em;font-weight:500;margin:16px 0}.intro h1 em{font-style:normal;color:#777f83}.intro>p:last-child{max-width:560px;color:#626c70;font-size:13px;line-height:1.8}
  .finder,.result{background:#fff;padding:30px 34px;margin-top:20px}.finder-head,.result-head{display:flex;align-items:end;justify-content:space-between;gap:20px}.finder-head h2,.result-head h2{font-size:28px;font-weight:500;letter-spacing:-.04em;margin:8px 0 0}.lock,.source{font-size:9px;letter-spacing:.13em;color:#626c70;background:#eef0ee;padding:9px 11px}
  .tabs{display:grid;grid-template-columns:1fr 1fr;margin-top:28px;border-bottom:1px solid #cdd1ce}.tabs button{display:flex;justify-content:space-between;padding:16px 14px;border:0;border-bottom:3px solid transparent;background:transparent;color:#687176;font-size:11px;font-weight:650;letter-spacing:.1em;cursor:pointer}.tabs button.active{color:#171a1c;border-bottom-color:#b99a68}.tabs button span{font-size:9px;color:#929a9d}
  .lookup{padding:26px 0 8px}.field-label{display:block;margin-bottom:9px;color:#525c60;font-size:9px;font-weight:650;letter-spacing:.12em}.vin-row{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:10px}.vin-row input,.picker-search{height:48px;min-width:0;padding:0 14px;border:0;border-bottom:1px solid #909895;border-radius:0;background:#f3f4f2;color:#171a1c;font:inherit;font-size:13px;outline:none}.vin-row input:focus,.picker-search:focus{outline:2px solid #0f62fe;outline-offset:-2px}
  .primary,.secondary{min-height:46px;padding:0 18px;border:1px solid #101416;background:#101416;color:white;font-size:10px;font-weight:650;letter-spacing:.07em;cursor:pointer}.primary:hover{background:#30383c}.primary:disabled{opacity:.48;cursor:wait}.secondary{background:transparent;color:#202629;border-color:#aab1ae}.secondary:hover{background:#eef0ee}.hint{margin:9px 0 0;color:#737d80;font-size:10px;line-height:1.65}
  .vehicle-review{margin-top:22px;padding:22px;background:#f1f3f0}.review-label{font-size:9px;font-weight:650;letter-spacing:.16em;color:#80643a}.vehicle-review h3{font-size:21px;font-weight:550;margin:9px 0 16px}.identity{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:1px;background:#dce0dc;margin:0}.identity div{background:white;padding:12px;min-width:0}.identity dt{font-size:8px;color:#70797c;letter-spacing:.1em;text-transform:uppercase}.identity dd{margin:6px 0 0;font-size:11px;font-weight:550;overflow-wrap:anywhere}.candidate{display:flex;justify-content:space-between;align-items:center;gap:12px;width:100%;margin:7px 0;padding:14px 15px;border:1px solid #d7dcd8;background:white;text-align:left;cursor:pointer}.candidate:hover{border-color:#80643a}.candidate strong{font-size:12px}.candidate span{font-size:10px;color:#687176}.candidate:disabled{opacity:.5}.actions{display:flex;align-items:center;flex-wrap:wrap;gap:10px;margin-top:18px}
  .locked-make{display:flex;align-items:center;gap:16px;padding:13px 15px;background:#f1f3f0;max-width:260px}.locked-make span,.locked-make small{font-size:8px;color:#717b7e;letter-spacing:.12em}.locked-make strong{font-size:16px;letter-spacing:.12em}.fields{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:20px}.field{min-width:0}.custom-picker{position:relative}.picker-trigger{height:48px;width:100%;display:flex;align-items:center;justify-content:space-between;padding:0 14px;border:0;border-bottom:1px solid #8d9692;background:#f3f4f2;color:#171a1c;text-align:left;font:inherit;font-size:13px;cursor:pointer}.picker-trigger:disabled{opacity:.5;cursor:not-allowed}.picker-trigger i{width:8px;height:8px;border-right:1.5px solid currentColor;border-bottom:1.5px solid currentColor;transform:rotate(45deg) translateY(-2px)}.picker-menu{position:absolute;z-index:20;top:calc(100% + 1px);left:0;right:0;background:white;box-shadow:0 10px 28px #0002;border-top:2px solid #b99a68}.picker-search{width:calc(100% - 16px);margin:8px}.picker-options{max-height:260px;overflow:auto;padding:4px 0}.picker-options button{display:block;width:100%;min-height:40px;padding:9px 14px;border:0;background:white;color:#171a1c;text-align:left;font-size:12px;cursor:pointer}.picker-options button:hover,.picker-options button[aria-selected=true]{background:#e9ece8}
  .notice,.error{padding:12px 14px;margin:16px 0 0;font-size:11px;line-height:1.6}.notice{background:#eef2ed;color:#465c4b}.error{background:#f7eeee;color:#8a3434}
  .result{margin-top:26px}.result-head{margin-bottom:20px}.result-head h2{font-size:24px}.spec-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1px;background:#dce0dc}.spec-grid article{padding:18px;background:#f5f6f4;min-width:0}.spec-grid article span{font-size:9px;color:#687176;letter-spacing:.09em}.spec-grid strong{display:block;margin-top:9px;font-size:16px;font-weight:550;overflow-wrap:anywhere}.spec-grid small{display:block;margin-top:7px;color:#7b8487;font-size:9px;line-height:1.5}.source-line{display:flex;justify-content:space-between;gap:12px;margin-top:18px;color:#7b8487;font-size:9px;letter-spacing:.1em}.source-line a{color:#3e484c;text-decoration:underline;text-underline-offset:3px}.disclaimer{margin:18px 0 0;padding:14px;background:#f3f0e9;color:#655a46;font-size:10px;line-height:1.7}
  .footer{display:flex;justify-content:space-between;gap:16px;padding:26px max(24px,calc((100vw - 1120px)/2));background:#101416;color:#9ba3a6;font-size:9px;letter-spacing:.1em}
  @media(max-width:700px){.header{height:66px;padding:0 18px}.brand strong{font-size:15px}.main{padding:40px 16px 60px}.finder,.result{padding:22px 18px}.finder-head h2,.result-head h2{font-size:23px}.vin-row,.fields{grid-template-columns:1fr}.vin-row .primary{width:100%}.identity{grid-template-columns:repeat(2,minmax(0,1fr))}.result-head{align-items:flex-start;flex-direction:column}.source{align-self:flex-start}.footer{padding:22px 18px;flex-direction:column}.actions{align-items:flex-start}}
  @media(prefers-reduced-motion:reduce){*{scroll-behavior:auto!important;transition:none!important}}
</style>
