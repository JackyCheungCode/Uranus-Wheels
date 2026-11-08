<script lang="ts">
  // Vehicle-specific values are sourced and scoped by chassis, trim and model year.
  type Chassis = 'G82' | 'G83' | 'F82' | 'F83';
  type UpgradeKey = 'wheels' | 'suspension' | 'brakes' | 'exterior' | 'performance' | 'interior';
  let chassis = $state<Chassis>('G82');
  let trim = $state('Competition');
  let year = $state('2024');
  let activeSetup = $state('Street Sport');
  let activeUpgrade = $state<UpgradeKey>('wheels');
  let yearPickerOpen = $state(false);
  let trimPickerOpen = $state(false);
  let selectedAxle = $state<'front' | 'rear'>('front');
  let setupMode = $state<'Staggered' | 'Square' | 'Custom'>('Staggered');
  let frontWheelDiameter = $state('19');
  let frontWheelWidth = $state('9.5');
  let frontWheelEt = $state('20');
  let rearWheelDiameter = $state('20');
  let rearWheelWidth = $state('10.5');
  let rearWheelEt = $state('20');
  const wheelDiameter = $derived(selectedAxle === 'front' ? frontWheelDiameter : rearWheelDiameter);
  const wheelWidth = $derived(selectedAxle === 'front' ? frontWheelWidth : rearWheelWidth);
  const wheelEt = $derived(selectedAxle === 'front' ? frontWheelEt : rearWheelEt);
  let selectedFinish = $state('Satin Black');
  const wheelDiameterOptions = ['18', '19', '20', '21', '22'];
  const wheelWidthOptions = ['8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12'];
  const wheelEtOptions = ['0', '5', '8', '10', '12', '15', '18', '20', '22', '25', '28', '30', '32', '35', '40'];
  const finishOptions = [
    { name: 'Gloss Black', group: 'Painted', sheen: 'linear-gradient(135deg,#59636d,#111820 48%,#05080b)' },
    { name: 'Satin Black', group: 'Painted', sheen: 'linear-gradient(135deg,#59616a,#252b31 50%,#101419)' },
    { name: 'Matte Black', group: 'Painted', sheen: 'linear-gradient(135deg,#55595d,#25282b 52%,#111315)' },
    { name: 'Piano Black', group: 'Painted', sheen: 'linear-gradient(135deg,#899097,#080a0c 45%,#020304)' },
    { name: 'Dark Gunmetal', group: 'Painted', sheen: 'linear-gradient(135deg,#7b8389,#3c4248 52%,#20252a)' },
    { name: 'Titanium Grey', group: 'Painted', sheen: 'linear-gradient(135deg,#c3c8ca,#737c82 50%,#4b5359)' },
    { name: 'Hyper Silver', group: 'Painted', sheen: 'linear-gradient(135deg,#fff,#aeb6bb 48%,#e3e7e9)' },
    { name: 'Satin Silver', group: 'Painted', sheen: 'linear-gradient(135deg,#e0e4e6,#9ca5ab 50%,#737d84)' },
    { name: 'Satin Bronze', group: 'Painted', sheen: 'linear-gradient(135deg,#c09a6b,#78563a 52%,#473324)' },
    { name: 'Brushed Bronze', group: 'Brushed', sheen: 'linear-gradient(135deg,#d0b18a,#9a754d 48%,#634a31)' },
    { name: 'Brushed Titanium', group: 'Brushed', sheen: 'linear-gradient(135deg,#e1e4e5,#7c858b 48%,#c3c9cc)' },
    { name: 'Brushed Aluminium', group: 'Brushed', sheen: 'linear-gradient(135deg,#f5f6f6,#9aa4aa 48%,#d7dcdf)' },
    { name: 'Polished Aluminium', group: 'Polished', sheen: 'linear-gradient(135deg,#fff,#929da4 42%,#e8ecee 70%,#7a858d)' },
    { name: 'Mirror Polished', group: 'Polished', sheen: 'linear-gradient(135deg,#fff 0%,#66727b 24%,#f8f9f9 45%,#7b858c 65%,#fff)' },
    { name: 'Champagne Gold', group: 'Special', sheen: 'linear-gradient(135deg,#e3ca91,#b69a68 52%,#79613d)' },
    { name: 'PVD Gold', group: 'Special', sheen: 'linear-gradient(135deg,#f0d18a,#b38a42 52%,#70501f)' },
    { name: 'Candy Red', group: 'Special', sheen: 'linear-gradient(135deg,#ed7478,#8c2028 52%,#450d12)' },
    { name: 'Deep Blue', group: 'Special', sheen: 'linear-gradient(135deg,#6d91c1,#233f69 52%,#101e37)' },
    { name: 'British Green', group: 'Special', sheen: 'linear-gradient(135deg,#6e9a82,#244b3d 52%,#10271f)' },
    { name: 'Custom Colour', group: 'Special', sheen: 'conic-gradient(from 0deg,#e34d4d,#e6bd43,#6ba86b,#4b91c4,#8759a6,#e34d4d)' }
  ];

  const vehicleOptions: Record<Chassis, { years: string[]; trims: string[]; body: string; generation: string }> = {
    G82: { years: ['2021','2022','2023','2024','2025','2026'], trims: ['M4','Competition','Competition xDrive','CS','CSL'], body: 'Coupe', generation: 'Second generation' },
    G83: { years: ['2021','2022','2023','2024','2025','2026'], trims: ['M4','Competition','Competition xDrive'], body: 'Convertible', generation: 'Second generation' },
    F82: { years: ['2015','2016','2017','2018','2019','2020'], trims: ['M4','Competition','CS','GTS'], body: 'Coupe', generation: 'First generation' },
    F83: { years: ['2015','2016','2017','2018','2019','2020'], trims: ['M4','Competition'], body: 'Convertible', generation: 'First generation' }
  };

  type FitmentRecord = { label: string; front: string; rear: string; note: string; source: string; kind: 'OEM' | 'Hardware' };
  const commonHardware: Record<'F' | 'G', FitmentRecord[]> = {
    F: [
      { label: 'PCD / Bolt pattern', front: '5 × 120 mm', rear: '5 × 120 mm', note: 'F82 / F83 wheel mounting pattern.', source: 'UW-M4-F-001', kind: 'Hardware' },
      { label: 'Center bore', front: '72.56 mm', rear: '72.56 mm', note: 'Hub-centric fit; larger aftermarket bores require correctly specified rings.', source: 'UW-M4-F-001', kind: 'Hardware' },
      { label: 'Fastener', front: 'M14 × 1.25 · 60° seat', rear: 'M14 × 1.25 · 60° seat', note: 'Factory lug-bolt interface. Verify seat type and bolt length for each wheel.', source: 'UW-M4-F-001', kind: 'Hardware' },
      { label: 'Reference torque', front: '140 Nm / 103 lb-ft', rear: '140 Nm / 103 lb-ft', note: 'Secondary fitment reference; always follow the vehicle-specific BMW manual.', source: 'UW-M4-F-001', kind: 'Hardware' }
    ],
    G: [
      { label: 'PCD / Bolt pattern', front: '5 × 112 mm', rear: '5 × 112 mm', note: 'G82 / G83 wheel mounting pattern.', source: 'UW-M4-G-001', kind: 'Hardware' },
      { label: 'Center bore', front: '66.6 mm', rear: '66.6 mm', note: 'Hub-centric fit; larger aftermarket bores require correctly specified rings.', source: 'UW-M4-G-001', kind: 'Hardware' },
      { label: 'Fastener', front: 'M14 × 1.25 · 60° seat', rear: 'M14 × 1.25 · 60° seat', note: 'Factory lug-bolt interface. Verify seat type and bolt length for each wheel.', source: 'UW-M4-G-001', kind: 'Hardware' },
      { label: 'Reference torque', front: '140 Nm / 103 lb-ft', rear: '140 Nm / 103 lb-ft', note: 'Secondary fitment reference; always follow the vehicle-specific BMW manual.', source: 'UW-M4-G-001', kind: 'Hardware' }
    ]
  };
  const oemPackages: Record<Chassis, { trim: string; years: string; frontWheel: string; rearWheel: string; frontTyre: string; rearTyre: string; source: string; note: string }[]> = {
    F82: [
      { trim: 'M4', years: '2015–2020', frontWheel: '18 × 9J ET29', rearWheel: '18 × 10J ET40', frontTyre: '255/40 ZR18', rearTyre: '275/40 ZR18', source: 'UW-M4-F-002 + UW-M4-F-005', note: 'Base-model Style 513M reference; steel brakes only.' },
      { trim: 'M4', years: '2015–2020 optional', frontWheel: '19 × 9J ET29', rearWheel: '19 × 10J ET40', frontTyre: '255/35 ZR19', rearTyre: '275/35 ZR19', source: 'UW-M4-F-002 + UW-M4-F-005', note: 'Style 437M optional wheel package.' },
      { trim: 'Competition', years: '2016–2020', frontWheel: '20 × 9J ET29', rearWheel: '20 × 10J ET40', frontTyre: '265/30 ZR20', rearTyre: '285/30 ZR20', source: 'UW-M4-F-002 + UW-M4-F-005', note: 'Competition Package / Style 666M.' },
      { trim: 'CS', years: '2018–2019', frontWheel: '19 × 9J ET29', rearWheel: '20 × 10J ET40', frontTyre: '265/35 ZR19', rearTyre: '285/30 ZR20', source: 'UW-M4-F-002 + UW-M4-F-004', note: 'Style 763M factory reference.' },
      { trim: 'GTS', years: '2016', frontWheel: '19 × 9.5J ET29', rearWheel: '20 × 10.5J ET42', frontTyre: '265/35 ZR19', rearTyre: '285/30 ZR20', source: 'UW-M4-F-002 + UW-M4-F-006', note: 'GTS-specific Style 666M; 681M carbon-barrel option shares these dimensions.' }
    ],
    F83: [
      { trim: 'M4', years: '2015–2020', frontWheel: '18 × 9J ET29', rearWheel: '18 × 10J ET40', frontTyre: '255/40 ZR18', rearTyre: '275/40 ZR18', source: 'UW-M4-F-002', note: 'F83 shares F82 wheel hardware; confirm exact market and brake package.' },
      { trim: 'M4', years: '2015–2020 optional', frontWheel: '19 × 9J ET29', rearWheel: '19 × 10J ET40', frontTyre: '255/35 ZR19', rearTyre: '275/35 ZR19', source: 'UW-M4-F-002', note: 'Style 437M optional wheel package.' },
      { trim: 'Competition', years: '2016–2020', frontWheel: '20 × 9J ET29', rearWheel: '20 × 10J ET40', frontTyre: '265/30 ZR20', rearTyre: '285/30 ZR20', source: 'UW-M4-F-002', note: 'Competition Package / Style 666M.' }
    ],
    G82: [
      { trim: 'M4', years: '2021–2026', frontWheel: '18 × 9.5J ET20', rearWheel: '19 × 10.5J ET20', frontTyre: '275/40 R18', rearTyre: '285/35 R19', source: 'UW-M4-G-001 + UW-M4-G-002', note: 'Manual M4 Coupé standard stagger; confirm market and model-year placard.' },
      { trim: 'Competition', years: '2021–2026', frontWheel: '19 × 9.5J ET20', rearWheel: '20 × 10.5J ET20', frontTyre: '275/35 R19', rearTyre: '285/30 R20', source: 'UW-M4-G-001 + UW-M4-G-002', note: 'Competition factory stagger; also used by CSL / CS with model-specific tyre options.' },
      { trim: 'Competition xDrive', years: '2022–2026', frontWheel: '19 × 9.5J ET20', rearWheel: '20 × 10.5J ET20', frontTyre: '275/35 R19', rearTyre: '285/30 R20', source: 'UW-M4-G-001 + UW-M4-G-002', note: 'Keep front/rear rolling circumference within BMW xDrive requirements.' },
      { trim: 'CS', years: '2025–2026', frontWheel: '19 × 9.5J', rearWheel: '20 × 10.5J', frontTyre: '275/35 ZR19', rearTyre: '285/30 ZR20', source: 'UW-M4-G-003', note: 'BMW published factory wheel and tyre dimensions; offset not stated in this source.' },
      { trim: 'CSL', years: '2023', frontWheel: '19 × 9.5J', rearWheel: '20 × 10.5J', frontTyre: '275/35 ZR19', rearTyre: '285/30 ZR20', source: 'UW-M4-G-004', note: 'BMW published factory wheel and tyre dimensions; offset not stated in this source.' }
    ],
    G83: [
      { trim: 'Competition xDrive', years: '2022–2026', frontWheel: '19 × 9.5J ET20', rearWheel: '20 × 10.5J ET20', frontTyre: '275/35 R19', rearTyre: '285/30 R20', source: 'UW-M4-G-001 + UW-M4-G-002', note: 'Convertible xDrive factory stagger; verify year and market.' }
    ]
  };
  const currentPackage = $derived(oemPackages[chassis].find((item) => item.trim === trim) ?? oemPackages[chassis][0]);
  function parseWheelSpec(value: string) {
    const match = value.match(/(\\d{2})\\s*[×x]\\s*(\\d+(?:\\.\\d+)?)J(?:\\s*ET(\\d+))?/i);
    return match ? { diameter: Number(match[1]), width: Number(match[2]), et: match[3] ? Number(match[3]) : null } : { diameter: 19, width: 9.5, et: null };
  }
  const oemWheelBaseline = $derived(parseWheelSpec(selectedAxle === 'front' ? currentPackage.frontWheel : currentPackage.rearWheel));
  const fitmentDelta = $derived.by(() => {
    if (oemWheelBaseline.et === null) return null;
    const halfWidthChange = (Number(wheelWidth) - oemWheelBaseline.width) * 25.4 / 2;
    const offsetChange = Number(wheelEt) - oemWheelBaseline.et;
    return { outer: halfWidthChange - offsetChange, inner: halfWidthChange + offsetChange };
  });
  const wheelFaceRadius = $derived(66 + (Number(wheelDiameter) - 18) * 5.2);
  const wheelFaceWidth = $derived(92 + (Number(wheelWidth) - 9) * 16);
  const wheelDiagramShift = $derived(fitmentDelta ? ((fitmentDelta.outer - fitmentDelta.inner) / 2) * 1.15 : 0);
  const specs = $derived([
    ...commonHardware[chassis.startsWith('F') ? 'F' : 'G'],
    { label: 'OEM wheel size', front: currentPackage.frontWheel, rear: currentPackage.rearWheel, note: currentPackage.note, source: currentPackage.source, kind: 'OEM' as const },
    { label: 'OEM tyre size', front: currentPackage.frontTyre, rear: currentPackage.rearTyre, note: 'Factory reference only; check the tyre placard and exact vehicle market.', source: currentPackage.source, kind: 'OEM' as const }
  ]);
  const vehiclePhotos: Record<Chassis, string> = {
    F82: 'https://upload.wikimedia.org/wikipedia/commons/2/21/The_frontview_of_BMW_M4_Coup%C3%A9_%28F82%29.JPG',
    F83: 'https://commons.wikimedia.org/wiki/Special:FilePath/2014-2018_BMW_M4_%28F83%29_convertible_%282018-08-06%29_01.jpg?width=1920',
    G82: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/BMW_M4_%28G82%29_1X7A0155.jpg/1920px-BMW_M4_%28G82%29_1X7A0155.jpg',
    G83: 'https://commons.wikimedia.org/wiki/Special:FilePath/BMW_M4_Competition_Cabriolet_%28G83%2C_2022%29_%2853338263511%29.jpg?width=1920'
  };

  const setups = [
    { name: 'OEM+', descriptor: 'Factory-inspired refinement', detail: 'A restrained upgrade that preserves the original character and everyday usability.', tags: ['Factory-led', 'Daily use'], status: 'Template' },
    { name: 'Street Sport', descriptor: 'Balanced road presence', detail: 'A considered wheel and tire package with suspension compatibility reviewed as one system.', tags: ['Road focused', 'Staggered setup'], status: 'Template' },
    { name: 'Track', descriptor: 'Heat, clearance and repeatability', detail: 'A track-oriented package requiring brake, tire, load and operating-clearance validation.', tags: ['Track use', 'Engineering review'], status: 'Template' },
    { name: 'Show', descriptor: 'Individual visual direction', detail: 'A design-led build with explicit clearance, ride-height and bodywork checks.', tags: ['Custom finish', 'Body clearance'], status: 'Template' }
  ];

  const upgradeGroups: { key: UpgradeKey; title: string; intro: string; projects: string[] }[] = [
    { key: 'wheels', title: 'Wheels & Tires', intro: 'The foundation of every M4 build. Review axle-specific fitment, tire pairing, load and brake clearance together.', projects: ['Forged monoblock wheels', '2-piece and 3-piece wheels', 'Staggered wheel & tire packages', 'TPMS and fitment hardware'] },
    { key: 'suspension', title: 'Suspension', intro: 'Coordinate wheel fitment with ride height, suspension travel, alignment and intended use.', projects: ['Coilover systems', 'Lowering springs', 'Adjustable control arms', 'Alignment and corner balance'] },
    { key: 'brakes', title: 'Brakes', intro: 'Brake package is a fitment variable, not an afterthought. Confirm caliper envelope and barrel clearance.', projects: ['Big brake kits', 'Brake rotors and pads', 'Brake lines and fluid', 'Caliper clearance validation'] },
    { key: 'exterior', title: 'Exterior & Aero', intro: 'Build a cohesive exterior with documented chassis and body-style compatibility.', projects: ['Front splitters and lips', 'Side skirts', 'Rear diffusers', 'Spoilers and carbon components'] },
    { key: 'performance', title: 'Performance', intro: 'Powertrain upgrades should be presented with supporting hardware, operating context and regional compliance notes.', projects: ['Intake systems', 'Exhaust systems', 'Cooling upgrades', 'ECU and calibration'] },
    { key: 'interior', title: 'Interior', intro: 'Driver-focused upgrades that complement the intended road, touring or track setup.', projects: ['Steering wheels', 'Seats and restraints', 'Interior trim', 'Driver interface upgrades'] }
  ];

  const currentVehicle = $derived(vehicleOptions[chassis]);
  const validYears: Record<Chassis, Record<string, string[]>> = {
    F82: { M4: ['2015','2016','2017','2018','2019','2020'], Competition: ['2016','2017','2018','2019','2020'], CS: ['2018','2019'], GTS: ['2016'] },
    F83: { M4: ['2015','2016','2017','2018','2019','2020'], Competition: ['2016','2017','2018','2019','2020'] },
    G82: { M4: ['2021','2022','2023','2024','2025','2026'], Competition: ['2021','2022','2023','2024','2025','2026'], 'Competition xDrive': ['2022','2023','2024','2025','2026'], CS: ['2025'], CSL: ['2023'] },
    G83: { 'Competition xDrive': ['2022','2023','2024','2025','2026'] }
  };
  const availableYears = $derived(validYears[chassis][trim] ?? currentVehicle.years);
  const technicalOverview = $derived.by(() => {
    if (chassis.startsWith('F')) {
      const data: Record<string, { power: string; torque: string; transmission: string; brakes: string }> = {
        M4: { power: '431 PS / 425 hp (market rating)', torque: '550 Nm', transmission: '6-speed manual or 7-speed M DCT', brakes: 'M Compound brakes; optional M Carbon Ceramic Brakes on selected markets' },
        Competition: { power: '444 hp (US rating) / 450 PS (regional rating)', torque: '550 Nm', transmission: '6-speed manual or 7-speed M DCT', brakes: 'M Compound brakes; optional M Carbon Ceramic Brakes' },
        CS: { power: '460 PS / 454 hp (US rating)', torque: '600 Nm', transmission: '7-speed M DCT', brakes: 'M Compound brakes; optional M Carbon Ceramic Brakes' },
        GTS: { power: '500 PS / 493 hp (US rating)', torque: '600 Nm', transmission: '7-speed M DCT', brakes: 'M Carbon Ceramic Brakes' }
      };
      return { engine: 'S55B30 · 2,979 cc twin-turbo inline-six', ...(data[trim] ?? data.M4), drive: 'Rear-wheel drive', suspension: 'M-specific suspension; adaptive equipment varies by edition and market', source: 'BMW M technical data · UW-M4-F-003 / UW-M4-F-004 / UW-M4-F-006' };
    }
    const data: Record<string, { power: string; torque: string; transmission: string; brakes: string }> = {
      M4: { power: '473 hp', torque: '406 lb-ft / 550 Nm', transmission: '6-speed manual', brakes: 'M Compound brakes · 6-piston front / single-piston rear' },
      Competition: { power: '503 hp', torque: '479 lb-ft / 650 Nm', transmission: '8-speed M Steptronic', brakes: 'M Compound brakes · 6-piston front / single-piston rear' },
      'Competition xDrive': { power: Number(selectedYear) >= 2025 ? '523 hp (US specification)' : '503 hp (US specification)', torque: '479 lb-ft / 650 Nm', transmission: '8-speed M Steptronic · M xDrive', brakes: 'M Compound brakes · 6-piston front / single-piston rear' },
      CS: { power: '543 hp (US specification)', torque: '479 lb-ft / 650 Nm', transmission: '8-speed M Steptronic', brakes: 'M Compound brakes; optional M Carbon Ceramic Brakes' },
      CSL: { power: '543 hp (US specification)', torque: '479 lb-ft / 650 Nm', transmission: '8-speed M Steptronic', brakes: 'M Carbon Ceramic Brakes · standard equipment' }
    };
    return { engine: 'S58B30 · 2,993 cc twin-turbo inline-six', ...(data[trim] ?? data.Competition), drive: trim.includes('xDrive') ? 'M xDrive all-wheel drive' : 'Rear-wheel drive', suspension: 'Adaptive M suspension · model-specific calibration', source: 'BMW Group technical data · UW-M4-G-002 / UW-M4-G-003 / UW-M4-G-004' };
  });
  const vehicleImageSources: Record<Chassis, string> = {
    F82: 'https://commons.wikimedia.org/wiki/File:The_frontview_of_BMW_M4_Coup%C3%A9_(F82).JPG',
    F83: 'https://commons.wikimedia.org/wiki/File:2014-2018_BMW_M4_(F83)_convertible_(2018-08-06)_01.jpg',
    G82: 'https://commons.wikimedia.org/wiki/File:BMW_M4_(G82)_1X7A0155.jpg',
    G83: 'https://commons.wikimedia.org/wiki/File:BMW_M4_Competition_Cabriolet_(G83,_2022)_(53338263511).jpg'
  };
  const galleryImages: Record<Chassis, { src: string; alt: string; caption: string; credit: string; source: string }[]> = {
    F82: [
      { src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/The_frontview_of_BMW_M4_Coup%C3%A9_%28F82%29.JPG/1280px-The_frontview_of_BMW_M4_Coup%C3%A9_%28F82%29.JPG', alt: 'BMW M4 F82 front three-quarter view', caption: 'F82 · Front profile', credit: 'Tokumeigakarinoaoshima · CC0', source: 'https://commons.wikimedia.org/wiki/File:The_frontview_of_BMW_M4_Coup%C3%A9_(F82).JPG' },
      { src: 'https://commons.wikimedia.org/wiki/Special:FilePath/The_front_tire_wheel_of_BMW_M4_Coup%C3%A9_%28F82%29.JPG?width=1280', alt: 'BMW M4 F82 front wheel and tyre close-up', caption: 'F82 · Front wheel detail', credit: 'Tokumeigakarinoaoshima · CC0', source: 'https://commons.wikimedia.org/wiki/File:The_front_tire_wheel_of_BMW_M4_Coup%C3%A9_(F82).JPG' }
    ],
    F83: [
      { src: 'https://commons.wikimedia.org/wiki/Special:FilePath/2014-2018_BMW_M4_%28F83%29_convertible_%282018-08-06%29_01.jpg?width=1600', alt: 'BMW M4 F83 convertible', caption: 'F83 · Convertible profile', credit: 'EuroVisionNim · CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:2014-2018_BMW_M4_(F83)_convertible_(2018-08-06)_01.jpg' },
      { src: 'https://commons.wikimedia.org/wiki/Special:FilePath/The_front_tire_wheel_of_BMW_M4_Coup%C3%A9_%28F82%29.JPG?width=1280', alt: 'F8X M4 wheel and tyre detail', caption: 'F8X · Wheel detail reference', credit: 'Tokumeigakarinoaoshima · CC0', source: 'https://commons.wikimedia.org/wiki/File:The_front_tire_wheel_of_BMW_M4_Coup%C3%A9_(F82).JPG' }
    ],
    G82: [
      { src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/BMW_M4_%28G82%29_1X7A0155.jpg/1920px-BMW_M4_%28G82%29_1X7A0155.jpg', alt: 'BMW M4 G82 coupe', caption: 'G82 · Coupe profile', credit: 'Alexander Migl · CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:BMW_M4_(G82)_1X7A0155.jpg' },
      { src: 'https://commons.wikimedia.org/wiki/Special:FilePath/BMW_M4_G82.jpg?width=1600', alt: 'BMW M4 G82 at Plaza Athénée', caption: 'G82 · Exterior reference', credit: 'Mathious Ier · CC0', source: 'https://commons.wikimedia.org/wiki/File:BMW_M4_G82.jpg' }
    ],
    G83: [
      { src: 'https://commons.wikimedia.org/wiki/Special:FilePath/BMW_M4_Competition_Cabriolet_%28G83%2C_2022%29_%2853338263511%29.jpg?width=1600', alt: 'BMW M4 G83 Competition convertible', caption: 'G83 · Convertible profile', credit: 'usf1fan2 · CC BY 2.0', source: 'https://commons.wikimedia.org/wiki/File:BMW_M4_Competition_Cabriolet_(G83,_2022)_(53338263511).jpg' },
      { src: 'https://commons.wikimedia.org/wiki/Special:FilePath/BMW_M4_competition_convertible.jpg?width=1600', alt: 'BMW M4 competition convertible', caption: 'G83 · Exterior reference', credit: 'How3010 · CC0', source: 'https://commons.wikimedia.org/wiki/File:BMW_M4_competition_convertible.jpg' }
    ]
  };
  const currentSetup = $derived(setups.find((item) => item.name === activeSetup) ?? setups[1]);
  const buildReferences: Record<'F' | 'G', Record<string, { front: string; rear: string; frontTyre: string; rearTyre: string; note: string; source: string }>> = {
    F: {
      OEM: { front: '19 × 9.5J ET22', rear: '19 × 10.5J ET35', frontTyre: '265/35 R19', rearTyre: '285/30 R19', note: 'Vendor-documented street stagger; front ET22 addresses the F8X inner-clearance constraint.', source: 'FMB Wheels · F82/F83 guide' },
      'Street Sport': { front: '19 × 9.5J ET22', rear: '19 × 10.5J ET35', frontTyre: '265/35 R19', rearTyre: '285/30 R19', note: 'Documented OEM+ daily configuration. Check CCB, coilover perch and exact tyre section width.', source: 'FMB Wheels · F82/F83 guide' },
      Track: { front: '18 × 10J ET25', rear: '18 × 10J ET25', frontTyre: '275/35 R18', rearTyre: '275/35 R18', note: 'Vendor-documented square track example; NOT compatible with factory carbon-ceramic brakes.', source: 'FMB Wheels · F82/F83 guide' },
      Show: { front: '20 × 10J ET20', rear: '20 × 11J ET35', frontTyre: '265/30 R20', rearTyre: '295/30 R20', note: 'Community-reported lowered build; not a universal bolt-on specification.', source: 'FMB Wheels · F82/F83 guide' }
    },
    G: {
      OEM: { front: '19 × 10J ET12', rear: '19 × 10J ET12', frontTyre: '275/35 R19', rearTyre: '275/35 R19', note: 'Vendor-documented square street setup. Confirm full-lock liner and CCB spoke clearance.', source: 'FMB Wheels · G82 guide' },
      'Street Sport': { front: '19 × 10J ET12', rear: '20 × 11J ET18', frontTyre: '285/35 R19', rearTyre: '295/30 R20', note: 'Vendor-documented staggered example; xDrive rolling circumference and front liner clearance must be checked.', source: 'FMB Wheels · G82 guide' },
      Track: { front: '19 × 10J ET9', rear: '19 × 10J ET9', frontTyre: '285/35 R19', rearTyre: '285/35 R19', note: 'Documented track-oriented square example; verify full-lock clearance and wheel-specific CCB spoke profile.', source: 'FMB Wheels · G82 guide' },
      Show: { front: '20 × 10J ET8', rear: '20 × 11J ET18', frontTyre: '285/30 R20', rearTyre: '295/30 R20', note: 'Documented aggressive example; front liner trimming may be required. Not a default recommendation.', source: 'FMB Wheels · G82 guide' }
    }
  };
  const activeBuildReference = $derived(buildReferences[chassis.startsWith('F') ? 'F' : 'G'][activeSetup === 'OEM+' ? 'OEM' : activeSetup]);
  const currentUpgrade = $derived(upgradeGroups.find((item) => item.key === activeUpgrade) ?? upgradeGroups[0]);
  const selectedYear = $derived(currentVehicle.years.includes(year) ? year : currentVehicle.years[currentVehicle.years.length - 1]);

  function setWheelDiameter(value: string) {
    if (selectedAxle === 'front') frontWheelDiameter = value; else rearWheelDiameter = value;
    setupMode = 'Custom';
  }
  function setWheelWidth(value: string) {
    if (selectedAxle === 'front') frontWheelWidth = value; else rearWheelWidth = value;
    setupMode = 'Custom';
  }
  function setWheelEt(value: string) {
    if (selectedAxle === 'front') frontWheelEt = value; else rearWheelEt = value;
    setupMode = 'Custom';
  }
  function applyOemBaselineToAxle(axle: 'front' | 'rear') {
    const spec = parseWheelSpec(axle === 'front' ? currentPackage.frontWheel : currentPackage.rearWheel);
    if (axle === 'front') {
      frontWheelDiameter = String(spec.diameter);
      frontWheelWidth = String(spec.width);
      if (spec.et !== null) frontWheelEt = String(spec.et);
    } else {
      rearWheelDiameter = String(spec.diameter);
      rearWheelWidth = String(spec.width);
      if (spec.et !== null) rearWheelEt = String(spec.et);
    }
  }

  function loadOemBaseline() {
    applyOemBaselineToAxle(selectedAxle);
  }

  function loadBothOemBaselines() {
    applyOemBaselineToAxle('front');
    applyOemBaselineToAxle('rear');
    setupMode = 'Staggered';
  }

  function setSetupMode(mode: 'Staggered' | 'Square' | 'Custom') {
    setupMode = mode;
    if (mode === 'Staggered') {
      loadBothOemBaselines();
    } else if (mode === 'Square') {
      rearWheelDiameter = frontWheelDiameter;
      rearWheelWidth = frontWheelWidth;
      rearWheelEt = frontWheelEt;
    }
  }

  function selectTrim(value: string) {
    trim = value;
    const years = validYears[chassis][value] ?? currentVehicle.years;
    if (!years.includes(year)) year = years[years.length - 1];
    loadBothOemBaselines();
  }

  function selectChassis(value: Chassis) {
    chassis = value;
    trim = vehicleOptions[value].trims[0];
    year = (validYears[value][trim] ?? vehicleOptions[value].years)[(validYears[value][trim] ?? vehicleOptions[value].years).length - 1];
    loadBothOemBaselines();
  }
</script>

<svelte:head>
  <title>BMW M4 Modification Guide | Uranus Wheels</title>
  <meta name="description" content="Explore BMW M4 wheel fitment references, curated build concepts and performance upgrade categories from Uranus Wheels." />
  <meta name="theme-color" content="#f5f6f7" />
</svelte:head>

<div class="m4-page">
  <div class="topline"><span>URANUS WHEELS</span><span>BMW PERFORMANCE & FITMENT GUIDE</span><a href="/fitment-finder">FITMENT FINDER ↗</a></div>
  <header class="page-header">
    <a class="wordmark" href="/" aria-label="Uranus Wheels home">URANUS <span>WHEELS</span></a>
    <nav aria-label="M4 guide navigation">
      <a href="#vehicle">VEHICLE</a><a href="#fitment">FITMENT</a><a href="#builds">BUILDS</a><a href="#finishes">FINISHES</a><a href="#services">SOLUTIONS</a>
    </nav>
    <a class="header-action" href="#fitment-builder">BUILD YOUR SETUP <span>↗</span></a>
  </header>

  <main>
    <section class="hero">
      <div class="hero-image"><img src={vehiclePhotos[chassis]} alt={`BMW M4 ${chassis} reference vehicle`} /></div>
      <a class="image-credit" href={vehicleImageSources[chassis]} target="_blank" rel="noreferrer">{chassis === 'F82' ? 'Photo: Tokumeigakarinoaoshima · CC0' : chassis === 'F83' ? 'Photo: EuroVisionNim · CC BY-SA 4.0' : chassis === 'G82' ? 'Photo: Alexander Migl · CC BY-SA 4.0' : 'Photo: usf1fan2 · CC BY 2.0'}</a>
      <div class="hero-shade"></div>
      <div class="hero-content">
        <p class="eyebrow"><span></span> THE URANUS VEHICLE SERIES / 001</p>
        <h1>BMW <em>M4</em></h1>
        <p class="hero-subtitle">Factory specifications, custom fitment<br />and wheel design solutions.</p>
        <div class="hero-meta"><span>F82 / F83</span><i></i><span>G82 / G83</span><i></i><span>COUPE & CONVERTIBLE</span></div>
        <a class="hero-link" href="#vehicle">EXPLORE YOUR M4 <b>↓</b></a>
      </div>
      <div class="hero-index"><strong>01</strong><span> / 04</span><small>MODEL SPOTLIGHT</small></div>
    </section>

    <section class="vehicle-section section-wrap" id="vehicle">
      <div class="section-heading">
        <div><p class="eyebrow dark">01 / VEHICLE IDENTIFICATION</p><h2>Start with<br /><em>your M4.</em></h2></div>
        <p class="section-intro">Fitment changes with chassis, model year, trim and brake configuration. Select your vehicle to keep every reference tied to the correct specification.</p>
      </div>
      <div class="vehicle-panel">
        <div class="vehicle-panel-top"><span>SELECT YOUR PLATFORM</span><span class="manual-label">MANUALLY CURATED VEHICLE DATA</span></div>
        <div class="chassis-grid" role="group" aria-label="Select M4 chassis">
          {#each (['G82','G83','F82','F83'] as Chassis[]) as code}
            <button class:chosen={chassis === code} class="chassis-option" onclick={() => selectChassis(code)} aria-pressed={chassis === code}>
              <span class="chassis-code">{code}</span><span class="chassis-body">{vehicleOptions[code].body}</span><span class="chassis-years">{vehicleOptions[code].years[0]}—{vehicleOptions[code].years[vehicleOptions[code].years.length - 1]}</span><span class="select-mark">{chassis === code ? 'SELECTED' : 'SELECT'}</span>
            </button>
          {/each}
        </div>
        <div class="vehicle-fields">
          <div class="field-control"><span class="field-label">MODEL YEAR</span>
            <div class="custom-select">
              <button class="select-trigger" aria-expanded={yearPickerOpen} onclick={() => { yearPickerOpen = !yearPickerOpen; trimPickerOpen = false; }}>{year}<span>⌄</span></button>
              {#if yearPickerOpen}<div class="select-menu" role="listbox" aria-label="Model year">{#each availableYears as item}<button role="option" aria-selected={year === item} class:current={year === item} onclick={() => { year = item; yearPickerOpen = false; }}>{item}</button>{/each}</div>{/if}
            </div>
          </div>
          <div class="field-control"><span class="field-label">MODEL / EDITION</span>
            <div class="custom-select">
              <button class="select-trigger" aria-expanded={trimPickerOpen} onclick={() => { trimPickerOpen = !trimPickerOpen; yearPickerOpen = false; }}>{trim}<span>⌄</span></button>
              {#if trimPickerOpen}<div class="select-menu" role="listbox" aria-label="Model edition">{#each currentVehicle.trims as item}<button role="option" aria-selected={trim === item} class:current={trim === item} onclick={() => { selectTrim(item); trimPickerOpen = false; }}>{item}</button>{/each}</div>{/if}
            </div>
          </div>
          <div class="vehicle-identity"><span>{chassis} · {trim}</span><strong>{selectedYear} MODEL YEAR</strong><small>{currentVehicle.generation} / {currentVehicle.body}</small></div>
        </div>
        <p class="panel-footnote">Vehicle selection is a content filter only. Confirm the exact market specification, brake package and installed hardware before ordering parts.</p>
      </div>
    </section>

    <section class="technical-section section-wrap" id="technical">
      <div class="section-heading">
        <div><p class="eyebrow dark">02 / VEHICLE SPECIFICATION</p><h2>Know the<br /><em>machine.</em></h2></div>
        <p class="section-intro">Factory powertrain, drivetrain, braking and suspension references for the selected M4 edition. Output figures are market-specific where noted.</p>
      </div>
      <div class="technical-grid">
        <div class="technical-card"><span>ENGINE</span><strong>{technicalOverview.engine}</strong></div>
        <div class="technical-card"><span>OUTPUT</span><strong>{technicalOverview.power}</strong></div>
        <div class="technical-card"><span>TORQUE</span><strong>{technicalOverview.torque}</strong></div>
        <div class="technical-card"><span>TRANSMISSION</span><strong>{technicalOverview.transmission}</strong></div>
        <div class="technical-card"><span>DRIVETRAIN</span><strong>{technicalOverview.drive}</strong></div>
        <div class="technical-card"><span>BRAKES</span><strong>{technicalOverview.brakes}</strong></div>
        <div class="technical-card wide"><span>SUSPENSION</span><strong>{technicalOverview.suspension}</strong></div>
      </div>
      <p class="technical-source">REFERENCE: {technicalOverview.source} · Verify the exact market specification and vehicle build sheet before parts selection.</p>
      <div class="image-gallery">
        {#each galleryImages[chassis] as photo}
          <figure><img src={photo.src} alt={photo.alt} loading="lazy" /><figcaption><strong>{photo.caption}</strong><a href={photo.source} target="_blank" rel="noreferrer">{photo.credit} ↗</a></figcaption></figure>
        {/each}
      </div>
    </section>

    <section class="fitment-section" id="fitment">
      <div class="section-wrap">
        <div class="section-heading fitment-heading">
          <div><p class="eyebrow">03 / ENGINEERING REFERENCE</p><h2>Wheel fitment.<br /><em>Without guesswork.</em></h2></div>
          <p class="section-intro">Start with the factory baseline, then explore wheel dimensions and offset relationships for your selected {chassis} {trim}.</p>
        </div>
        <div class="fitment-toolbar"><div><span class="live-dot"></span> FACTORY BASELINE & CUSTOM FITMENT</div><span>VEHICLE: {chassis} / {selectedYear} / {trim}</span></div>
        <div class="spec-table">
          <div class="spec-header"><span>SPECIFICATION</span><span>FRONT AXLE</span><span>REAR AXLE</span><span>REFERENCE</span></div>
          {#each specs as spec, index}
            <div class="spec-row">
              <strong>{spec.label}<small class="spec-kind">{spec.kind}</small></strong>
              <span class="spec-value">{spec.front}</span>
              <span class="spec-value">{spec.rear}</span>
              <small>{spec.note}<span class="spec-kind">URANUS VEHICLE REFERENCE</span></small>
            </div>
          {/each}
        </div>
        <div class="engineering-note"><span class="note-icon">i</span><p><strong>Fitment boundary</strong> — OEM dimensions below are reference data, not a blanket aftermarket approval. Brake package, wheel-spoke profile, suspension, tyre construction, alignment and market specification must be checked on the exact car.</p></div>
        <div class="fitment-configurator" id="fitment-builder">
          <div class="config-heading">
            <div><p class="eyebrow">URANUS WHEELS / FITMENT STUDIO</p><h3>Explore your<br /><em>fitment range.</em></h3><p>Change wheel diameter, width and offset. The technical illustration updates with your selection and compares the wheel position against the selected factory baseline.</p></div>
            <div class="config-vehicle"><span>ACTIVE VEHICLE</span><strong>{chassis} · {trim}</strong><small>{selectedYear} MODEL YEAR / {setupMode.toUpperCase()} SETUP</small></div>
          </div>
          <div class="setup-mode-row" aria-label="Wheel setup type">
            <span>SETUP TYPE</span>
            <button class:active={setupMode === 'Staggered'} onclick={() => setSetupMode('Staggered')}>OEM STAGGERED</button>
            <button class:active={setupMode === 'Square'} onclick={() => setSetupMode('Square')}>SQUARE</button>
            <button class:active={setupMode === 'Custom'} onclick={() => setSetupMode('Custom')}>CUSTOM STAGGERED</button>
            <button class="baseline-action" onclick={loadBothOemBaselines}>RESET BOTH AXLES ↺</button>
          </div>
          <div class="axle-summary">
            <button class:active={selectedAxle === 'front'} onclick={() => selectedAxle = 'front'}><small>FRONT WHEEL</small><strong>{frontWheelDiameter} × {frontWheelWidth}J</strong><span>ET{frontWheelEt}</span></button>
            <button class:active={selectedAxle === 'rear'} onclick={() => selectedAxle = 'rear'}><small>REAR WHEEL</small><strong>{rearWheelDiameter} × {rearWheelWidth}J</strong><span>ET{rearWheelEt}</span></button>
          </div>
          <div class="axle-switch"><button class:active={selectedAxle === 'front'} onclick={() => selectedAxle = 'front'}>EDIT FRONT AXLE</button><button class:active={selectedAxle === 'rear'} onclick={() => selectedAxle = 'rear'}>EDIT REAR AXLE</button><button class="baseline-action" onclick={loadOemBaseline}>LOAD THIS AXLE OEM ↺</button></div>
          <div class="fitment-workspace">
            <div class="parameter-panel">
              <div class="parameter-group"><label>WHEEL DIAMETER</label><div class="parameter-options">{#each wheelDiameterOptions as value}<button class:chosen={wheelDiameter === value} onclick={() => setWheelDiameter(value)}>{value}<small>″</small></button>{/each}</div></div>
              <div class="parameter-group"><label>WHEEL WIDTH</label><div class="parameter-options width-options">{#each wheelWidthOptions as value}<button class:chosen={wheelWidth === value} onclick={() => setWheelWidth(value)}>{value}<small>J</small></button>{/each}</div></div>
              <div class="parameter-group"><label>OFFSET / ET</label><div class="parameter-options et-options">{#each wheelEtOptions as value}<button class:chosen={wheelEt === value} onclick={() => setWheelEt(value)}>ET{value}</button>{/each}</div></div>
              <div class="selected-spec"><span>YOUR SELECTED WHEEL</span><strong>{wheelDiameter} × {wheelWidth}J</strong><b>ET{wheelEt}</b></div>
              <p class="parameter-footnote">Illustrative configuration only. The available choices are exploration inputs, not a declaration that every combination is compatible with this vehicle.</p>
            </div>
            <div class="diagram-panel">
              <div class="diagram-title"><span>LIVE FITMENT ILLUSTRATION</span><span>NOT TO SCALE</span></div>
              <svg class="fitment-diagram" viewBox="0 0 720 330" role="img" aria-label="Wheel face and offset position illustration that updates with the selected diameter, width and offset">
                <defs><linearGradient id="rimMetal" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e1e6e9"/><stop offset=".48" stop-color="#697680"/><stop offset="1" stop-color="#c2cbd1"/></linearGradient><linearGradient id="tyreDark" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#47525b"/><stop offset="1" stop-color="#101820"/></linearGradient></defs>
                <text x="160" y="25" text-anchor="middle" class="svg-label">WHEEL FACE</text><circle cx="160" cy="165" r="116" fill="url(#tyreDark)" stroke="#7d8992" stroke-width="2"/><circle cx="160" cy="165" r={wheelFaceRadius + 25} fill="none" stroke="#c4cdd3" stroke-width="2" opacity=".8"/><circle cx="160" cy="165" r={wheelFaceRadius} fill="url(#rimMetal)" stroke="#dfe5e9" stroke-width="2"/><circle cx="160" cy="165" r={wheelFaceRadius - 12} fill="#26333d" stroke="#8f9ba4" stroke-width="5"/>
                {#each Array.from({length: 10}, (_, i) => i) as spoke}<path d="M156 160 L146 75 L174 75 L164 160 Z" fill="#aeb8bf" stroke="#596772" stroke-width="1" transform={'rotate(' + (spoke * 36) + ' 160 165)'}/>{/each}
                <circle cx="160" cy="165" r="24" fill="#8c989f" stroke="#d7dde1" stroke-width="4"/><circle cx="160" cy="165" r="7" fill="#25323c"/><text x="160" y="304" text-anchor="middle" class="svg-sub">{wheelDiameter}″ DIAMETER · {wheelWidth}J WIDTH</text>
                <line x1="350" y1="42" x2="350" y2="286" stroke="#53616c" stroke-dasharray="4 5"/><text x="535" y="25" text-anchor="middle" class="svg-label">OFFSET / INNER CLEARANCE</text><path d="M410 58 Q535 4 660 58" fill="none" stroke="#8fa0ad" stroke-width="8" stroke-linecap="round"/><path d="M410 58 Q535 4 660 58" fill="none" stroke="#263541" stroke-width="3" stroke-linecap="round"/><rect x="430" y="66" width="210" height="210" rx="96" fill="none" stroke="#7d8b96" stroke-width="1.5" stroke-dasharray="5 5"/>
                <rect x={535 - wheelFaceWidth / 2 + wheelDiagramShift} y="76" width={wheelFaceWidth} height="190" rx="12" fill="url(#rimMetal)" stroke="#d9e0e5" stroke-width="2"/><line x1="535" y1="67" x2="535" y2="280" stroke="#7da9d5" stroke-width="1.5" stroke-dasharray="4 4"/><line x1={535 + wheelDiagramShift} y1="67" x2={535 + wheelDiagramShift} y2="280" stroke="#fff" stroke-width="2"/><text x="535" y="304" text-anchor="middle" class="svg-sub">ET{wheelEt} · {wheelWidth}J</text><text x="435" y="293" class="svg-tiny">INBOARD</text><text x="600" y="293" class="svg-tiny">OUTBOARD</text>
              </svg>
              <div class="diagram-legend"><span><i class="legend-oem"></i> OEM reference position</span><span><i class="legend-selected"></i> Selected position</span></div>
              <div class="product-reference">
                <img src="https://vsforged.com/wp-content/uploads/2019/01/VS02-bg5.jpg" alt="Third-party forged wheel reference showing wheel face and deep barrel profile" loading="lazy" />
                <div><strong>REAL-WORLD WHEEL REFERENCE</strong><span>Third-party product example · VS Forged VS02 · Visual reference only, not a Uranus Wheels product</span><a href="https://vsforged.com/vs02/" target="_blank" rel="noreferrer">VIEW SUPPLIER PRODUCT ↗</a></div>
              </div>
              <div class="delta-grid"><div><span>OUTER POSITION CHANGE</span><strong>{fitmentDelta ? (fitmentDelta.outer > 0 ? '+' : '') + fitmentDelta.outer.toFixed(1) + ' mm' : 'OEM ET NOT PUBLISHED'}</strong><small>{fitmentDelta ? (fitmentDelta.outer > 0 ? 'Further outward' : fitmentDelta.outer < 0 ? 'Further inward' : 'Same outer position') : 'Offset comparison unavailable'}</small></div><div><span>INNER CLEARANCE CHANGE</span><strong>{fitmentDelta ? (fitmentDelta.inner > 0 ? '+' : '') + fitmentDelta.inner.toFixed(1) + ' mm' : 'OEM ET NOT PUBLISHED'}</strong><small>{fitmentDelta ? (fitmentDelta.inner > 0 ? 'Uses more inner space' : fitmentDelta.inner < 0 ? 'Gains inner clearance' : 'Same inner position') : 'Offset comparison unavailable'}</small></div></div>
            </div>
          </div>
          <div class="fitment-warning"><b>ENGINEERING CHECK REQUIRED</b><span>Wheel position math is a dimensional comparison, not a clearance simulation. Tyre section width, spoke profile, brake package, suspension, steering lock, ride height and alignment must be checked before confirming fitment.</span></div>
        </div>
        <div class="fitment-actions"><a href="/fitment-finder" class="outline-action">OPEN FITMENT FINDER <span>↗</span></a><span>VIN DECODING IS AN IDENTIFICATION AID, NOT A FITMENT APPROVAL.</span></div>
      </div>
    </section>

    <section class="build-section section-wrap" id="builds">
      <div class="section-heading">
        <div><p class="eyebrow dark">04 / CURATED CONFIGURATIONS</p><h2>Choose your<br /><em>build direction.</em></h2></div>
        <p class="section-intro">Choose a build direction and explore wheel and tyre combinations as a starting point for a vehicle-specific project.</p>
      </div>
      <div class="build-layout">
        <div class="build-list" role="tablist" aria-label="M4 build concepts">
          {#each setups as setup, i}
            <button class:active={activeSetup === setup.name} class="build-choice" role="tab" aria-selected={activeSetup === setup.name} onclick={() => activeSetup = setup.name}>
              <span class="build-number">0{i + 1}</span><span class="build-name">{setup.name}<small>{setup.descriptor}</small></span><span class="build-arrow">↗</span>
            </button>
          {/each}
        </div>
        <div class="build-detail" role="tabpanel">
          <div class="build-visual"><span class="visual-kicker">BUILD CONCEPT / {currentSetup.name.toUpperCase()}</span><div class="wheel-graphic"><div class="wheel-outer"><div class="wheel-inner"><div class="wheel-hub"></div><span></span><i></i><b></b><em></em></div></div></div><span class="visual-caption">{chassis} / {trim} / {selectedYear}</span></div>
          <div class="build-copy"><span class="status-pill">DOCUMENTED REFERENCE · NOT UNIVERSAL APPROVAL</span><h3>{currentSetup.name}<br /><em>{currentSetup.descriptor}</em></h3><p>{currentSetup.detail}</p><div class="reference-specs"><div><span>FRONT</span><strong>{activeBuildReference.front}</strong><small>{activeBuildReference.frontTyre}</small></div><div><span>REAR</span><strong>{activeBuildReference.rear}</strong><small>{activeBuildReference.rearTyre}</small></div></div><p class="reference-note">{activeBuildReference.note}</p><small class="reference-source">{activeBuildReference.source}</small><div class="tag-row">{#each currentSetup.tags as tag}<span>{tag}</span>{/each}</div><div class="build-disclaimer">Aftermarket combinations are published separately as documented examples. They are not a fitment guarantee for every tyre, brake or suspension configuration.</div></div>
        </div>
      </div>
    </section>

    <section class="upgrade-section finish-section" id="finishes">
      <div class="section-wrap">
        <div class="section-heading"><div><p class="eyebrow">05 / SURFACE & CRAFT</p><h2>Make it<br /><em>distinctly yours.</em></h2></div><p class="section-intro">Explore wheel finishes and manufacturing details. Select a finish to preview its character on the wheel illustration. Final colour, texture and process are confirmed against the selected wheel design.</p></div>
        <div class="finish-layout">
          <div class="finish-preview"><div class="finish-preview-head"><span>FINISH PREVIEW</span><span>ILLUSTRATIVE SAMPLE</span></div><div class="finish-wheel" style:background={finishOptions.find((item) => item.name === selectedFinish)?.sheen ?? finishOptions[0].sheen}><div class="finish-wheel-ring"><div class="finish-wheel-face"><div class="finish-wheel-hub"></div>{#each Array.from({length: 10}, (_, i) => i) as spoke}<i style:transform={'rotate(' + (spoke * 36) + 'deg)'}></i>{/each}</div></div></div><strong>{selectedFinish}</strong><small>COLOUR / SHEEN SAMPLE — FINAL FINISH SUBJECT TO APPROVAL</small></div>
          <div class="finish-options"><p class="eyebrow">AVAILABLE FINISH DIRECTIONS</p><div class="finish-grid">{#each finishOptions as finish}<button class:active={selectedFinish === finish.name} class="finish-option" onclick={() => selectedFinish = finish.name}><span class="finish-swatch" style:background={finish.sheen}></span><strong>{finish.name}</strong><small>{finish.name === 'Custom Color' ? 'Colour matching on request' : 'Finish sample'}</small></button>{/each}</div>
            <div class="process-list"><p class="eyebrow">MANUFACTURING & FINISHING PROCESSES</p><div><b>01</b><span><strong>Forging & CNC Machining</strong><small>Wheel blank forming, precision machining and design-specific detailing.</small></span></div><div><b>02</b><span><strong>Brushing & Polishing</strong><small>Directional grain, polished surfaces and machined-face treatments.</small></span></div><div><b>03</b><span><strong>Painting & Powder Coating</strong><small>Gloss, satin, matte and selected custom colour directions.</small></span></div><div><b>04</b><span><strong>Diamond-Cut & Two-Tone</strong><small>Machined highlights, contrast pockets and layered finish effects where the design permits.</small></span></div><div><b>05</b><span><strong>PVD / Special Effects</strong><small>Selected metallic coating and transparent-tint effects, confirmed per wheel substrate and process partner.</small></span></div><div><b>06</b><span><strong>Multi-Piece Assembly</strong><small>Custom face, barrel, hardware and assembly options, subject to project specification.</small></span></div></div>
          </div>
        </div>
      </div>
    </section>
    <section class="services-section" id="services"><div class="section-wrap">
      <div class="section-heading"><div><p class="eyebrow dark">06 / URANUS WHEELS SOLUTIONS</p><h2>More than<br /><em>a wheel.</em></h2></div><p class="section-intro">From the first fitment calculation to the finished custom build, explore the product and project support that can be specified with your M4 wheel programme.</p></div>
      <div class="service-grid">
        <article><span>01 / WHEEL PROGRAMMES</span><h3>Custom Forged Wheels</h3><p>Monoblock, 2-piece and 3-piece design directions with vehicle-specific diameter, width, offset, PCD and centre-bore requirements.</p></article>
        <article><span>02 / DESIGN STUDIO</span><h3>Personalised Design</h3><p>Spoke styles, concavity, centre caps, engraving, logo details and visual direction for an individual build.</p></article>
        <article><span>03 / ENGINEERING</span><h3>Fitment Development</h3><p>Wheel and tyre sizing, brake-envelope review, dimensional drawings and vehicle-specific installation considerations.</p></article>
        <article><span>04 / FINISHING</span><h3>Surface Customisation</h3><p>Colour, sheen, brushing, polishing and machined-face treatments selected for the wheel design.</p></article>
        <article><span>05 / VISUALISATION</span><h3>Build Preview</h3><p>Design references and visual presentation to help align the wheel specification before production.</p></article>
        <article><span>06 / PROJECT SUPPORT</span><h3>Quality & Delivery</h3><p>Specification confirmation, quality documentation, packaging and project communication according to the agreed order scope.</p></article>
      </div><p class="service-disclaimer">Specific manufacturing methods, certifications, testing documents and service availability are confirmed for each product and project. Illustrative finish samples are not production colour guarantees.</p>
    </div></section>

    <section class="closing-section">
      <div class="closing-image"></div><div class="closing-content"><p class="eyebrow">YOUR VEHICLE. YOUR WHEEL DESIGN.</p><h2>Precision starts<br />with the <em>details.</em></h2><p>Have a custom wheel project in mind? Share your vehicle, preferred dimensions and finish direction with Uranus Wheels.</p><a href="/fitment-finder" class="closing-button">START YOUR CUSTOM WHEEL PROJECT <span>↗</span></a></div>
    </section>
  </main>
  <footer class="m4-footer"><a class="wordmark" href="/">URANUS <span>WHEELS</span></a><span>PRECISION FORGED. BMW-FOCUSED.</span><span>© {new Date().getFullYear()} URANUS WHEELS</span></footer>
</div>

<style>
  :global(html){scroll-behavior:smooth}
  :global(body){margin:0;background:#f5f6f7;color:#202428;font-family:Arial,Helvetica,sans-serif}
  .m4-page{--blue:var(--uw-color-blue,#1c69d4);--ink:var(--uw-color-charcoal,#262626);--navy:var(--uw-color-navy,#1a2129);--muted:var(--uw-gray-600,#697176);--paper:var(--uw-gray-050,#f7f7f7);--line:var(--uw-gray-200,#e6e7e8);color:var(--ink);overflow:hidden}
  .topline{height:30px;padding:0 clamp(20px,5.5vw,88px);display:flex;align-items:center;justify-content:space-between;background:#17212b;color:#c4cbd2;font-size:8px;font-weight:700;letter-spacing:.16em}
  .topline a{color:#fff;text-decoration:none}
  .page-header{height:76px;padding:0 clamp(20px,5.5vw,88px);display:flex;align-items:center;justify-content:space-between;background:#fff}
  .wordmark{font-size:15px;font-weight:800;letter-spacing:.16em;text-decoration:none;color:#202428}.wordmark span{font-weight:400;color:#7d858b}
  .page-header nav{display:flex;gap:clamp(18px,3vw,46px)}.page-header nav a,.header-action{font-size:9px;font-weight:700;letter-spacing:.12em;text-decoration:none;color:#535d64}
  .page-header nav a:hover{color:var(--blue)}.header-action{padding:13px 16px;border:1px solid #cfd4d8;color:#202428}.header-action span{color:var(--blue);margin-left:10px}
  .hero{min-height:660px;position:relative;display:flex;align-items:center;background:#111a22;color:#fff;isolation:isolate}
  .hero-image{position:absolute;inset:0;z-index:-2;background:#101820}.hero-image img{width:100%;height:100%;object-fit:cover;object-position:center 52%;filter:saturate(.68) brightness(.62)}.image-credit{position:absolute;z-index:1;right:24px;bottom:18px;color:#dce2e8;font-size:8px;letter-spacing:.08em;text-shadow:0 1px 4px #000;text-decoration:none}.image-credit:hover{text-decoration:underline}
  .hero-shade{position:absolute;inset:0;z-index:-1;background:linear-gradient(90deg,rgba(9,15,21,.94) 0%,rgba(9,15,21,.74) 40%,rgba(9,15,21,.16) 100%),linear-gradient(0deg,rgba(9,15,21,.35),transparent 50%)}
  .hero-content{padding:90px clamp(24px,11vw,176px);max-width:1000px}.eyebrow{font-size:9px;font-weight:700;letter-spacing:.18em;color:#aeb8c1;margin:0 0 22px}.eyebrow span{display:inline-block;width:25px;height:2px;margin:0 10px 3px 0;background:#62a0ef}
  h1{font-size:clamp(68px,11vw,148px);line-height:.84;letter-spacing:-.085em;font-weight:500;margin:0}h1 em,h2 em,h3 em{font-style:normal;color:#8ca9c9}
  .hero-subtitle{font-size:clamp(18px,2vw,25px);line-height:1.5;color:#e1e6eb;margin:34px 0 30px}
  .hero-meta{display:flex;align-items:center;gap:15px;color:#c3cbd2;font-size:9px;font-weight:700;letter-spacing:.14em}.hero-meta i{height:3px;width:3px;border-radius:50%;background:#75a9e8}
  .hero-link{display:inline-flex;gap:26px;align-items:center;margin-top:48px;padding-bottom:12px;border-bottom:1px solid #8093a5;color:#fff;text-decoration:none;font-size:9px;font-weight:700;letter-spacing:.15em}.hero-link b{color:#83b5f4;font-size:15px}
  .hero-index{position:absolute;right:clamp(24px,5.5vw,88px);bottom:38px;display:grid;grid-template-columns:auto auto;align-items:center;column-gap:5px;color:#bac4ce;font-size:10px}.hero-index strong{font-size:19px;color:#fff}.hero-index small{grid-column:1/3;margin-top:5px;font-size:8px;letter-spacing:.14em}
  .section-wrap{width:min(1200px,calc(100% - 48px));margin:0 auto}.vehicle-section,.build-section{padding-block:100px 112px}
  .section-heading{display:grid;grid-template-columns:1fr .72fr;gap:10%;align-items:end;margin-bottom:42px}.eyebrow.dark{color:#717c84}.section-heading h2{font-size:clamp(42px,6vw,74px);line-height:.98;letter-spacing:-.07em;font-weight:500;margin:0}.section-heading h2 em{color:#788fa7}.section-intro{max-width:430px;color:#68737b;font-size:14px;line-height:1.85;margin:0 0 5px}
  .vehicle-panel{background:#fff;padding:30px 34px 25px;box-shadow:0 16px 44px rgba(22,34,45,.055)}
  .vehicle-panel-top{display:flex;justify-content:space-between;gap:16px;color:#59636b;font-size:9px;font-weight:700;letter-spacing:.14em}.manual-label{color:#87929b}
  .chassis-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;margin-top:22px;background:#e5e8eb}
  .chassis-option{min-height:142px;padding:20px 18px;border:0;background:#f4f6f7;text-align:left;color:#202428;cursor:pointer;transition:background .18s ease}
  .chassis-option:hover{background:#eaf0f6}.chassis-option.chosen{background:#e9f0f8;box-shadow:inset 0 -3px #1c69d4}
  .chassis-code{display:block;font-size:29px;font-weight:600;letter-spacing:-.06em}.chassis-body{display:block;margin-top:2px;color:#65717a;font-size:11px}.chassis-years{display:block;margin-top:14px;color:#8b959d;font-size:9px;letter-spacing:.06em}.select-mark{display:block;margin-top:9px;color:#1c69d4;font-size:8px;font-weight:700;letter-spacing:.12em}.chassis-option:not(.chosen) .select-mark{color:#9aa3aa}
  .vehicle-fields{display:grid;grid-template-columns:1fr 1fr 1.1fr;gap:20px;margin-top:25px;align-items:end}
  .field-control{position:relative;min-width:0}.field-label{display:block;margin-bottom:9px;color:#69747d;font-size:9px;font-weight:700;letter-spacing:.13em}.custom-select{position:relative}.select-trigger{height:48px;width:100%;display:flex;align-items:center;justify-content:space-between;padding:0 14px;border:0;border-bottom:1px solid #aab2b9;border-radius:0;background:#f4f6f7;color:#202428;font-size:13px;text-align:left;cursor:pointer}.select-trigger span{color:#1c69d4;font-size:16px}.select-menu{position:absolute;z-index:8;top:calc(100% + 2px);left:0;right:0;max-height:230px;overflow:auto;padding:5px;background:#fff;box-shadow:0 14px 32px rgba(20,31,42,.16)}.select-menu button{display:block;width:100%;padding:11px 10px;border:0;background:#fff;color:#273039;text-align:left;font-size:12px;cursor:pointer}.select-menu button:hover,.select-menu button.current{background:#eaf0f6;color:#1c69d4}
  .vehicle-identity{min-height:48px;padding:5px 12px;border-left:2px solid #1c69d4;display:flex;flex-direction:column;justify-content:center;gap:2px}.vehicle-identity span{font-size:12px;font-weight:700}.vehicle-identity strong{font-size:9px;color:#1c69d4;letter-spacing:.08em}.vehicle-identity small{font-size:9px;color:#87919a}
  .panel-footnote{margin:22px 0 0;padding-top:17px;border-top:1px solid #edf0f2;color:#828c94;font-size:10px;line-height:1.7}
  .technical-section{padding-top:76px;padding-bottom:76px}.technical-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1px;background:#dce1e5}.technical-card{min-height:108px;padding:20px;background:#fff}.technical-card span{display:block;margin-bottom:12px;color:#77828b;font-size:8px;font-weight:700;letter-spacing:.14em}.technical-card strong{display:block;color:#26323c;font-size:13px;font-weight:500;line-height:1.6}.technical-card.wide{grid-column:1/-1;min-height:70px}.technical-source{margin:12px 0 28px;color:#77828b;font-size:9px;letter-spacing:.04em}.image-gallery{display:grid;grid-template-columns:1fr 1fr;gap:14px}.image-gallery figure{position:relative;margin:0;min-height:180px;background:#e9ecef;overflow:hidden}.image-gallery img{display:block;width:100%;height:100%;min-height:180px;max-height:290px;object-fit:cover}.image-gallery figcaption{display:flex;justify-content:space-between;gap:10px;padding:10px 12px;background:#202c36;color:#fff}.image-gallery figcaption strong{font-size:9px;font-weight:600}.image-gallery figcaption a{font-size:8px;color:#b7c2ca;text-align:right;text-decoration:none}.image-gallery figcaption a:hover{text-decoration:underline}.fitment-section{padding:100px 0 104px;background:#19232d;color:#fff}.fitment-heading .eyebrow{color:#a5b1bc}.fitment-heading h2 em{color:#86a9d1}.fitment-heading .section-intro{color:#b3bdc6}
  .fitment-toolbar{display:flex;justify-content:space-between;gap:16px;padding:16px 18px;background:#222f3a;color:#c7d0d8;font-size:8px;font-weight:700;letter-spacing:.13em}.fitment-toolbar>div{display:flex;align-items:center;gap:9px}.live-dot{width:6px;height:6px;border-radius:50%;background:#75a9e8;box-shadow:0 0 0 4px rgba(117,169,232,.13)}
  .spec-table{background:#202c36}.spec-header,.spec-row{display:grid;grid-template-columns:1.05fr 1fr 1fr 1.55fr;gap:16px;align-items:center}.spec-header{min-height:42px;padding:0 20px;color:#91a0ac;font-size:8px;font-weight:700;letter-spacing:.13em;background:#263440}.spec-row{min-height:76px;padding:14px 20px;border-top:1px solid rgba(255,255,255,.055)}.spec-row>strong{font-size:12px;font-weight:600}.spec-value{font-family:Consolas,monospace;font-size:11px;color:#dbe4ec;font-variant-numeric:tabular-nums}.spec-row small{color:#9caab5;font-size:9px;line-height:1.6}
  .engineering-note{display:flex;gap:13px;align-items:flex-start;margin-top:20px;padding:17px 18px;background:#243440;color:#c1ccd5}.note-icon{display:grid;place-items:center;width:18px;height:18px;flex:0 0 18px;border:1px solid #8da4b9;border-radius:50%;font-size:11px}.engineering-note p{margin:0;font-size:10px;line-height:1.8}.engineering-note strong{color:#fff}.spec-kind{display:block;margin-top:5px;color:#8b949c;font-size:8px;font-weight:600;letter-spacing:.1em;text-transform:uppercase}.spec-row small a{display:inline-block;margin-left:6px;color:#6f9bc8;text-decoration:none;font-size:8px;font-weight:700}
  .fitment-actions{display:flex;justify-content:space-between;align-items:center;gap:18px;margin-top:26px}.outline-action{padding:14px 18px;border:1px solid #72818d;color:#fff;text-decoration:none;font-size:9px;font-weight:700;letter-spacing:.12em}.outline-action span{color:#83b5f4;margin-left:12px}.fitment-actions>span{max-width:420px;color:#92a0ab;font-size:8px;letter-spacing:.1em;line-height:1.6;text-align:right}
  .build-layout{display:grid;grid-template-columns:.7fr 1.3fr;gap:30px}.build-list{display:flex;flex-direction:column}.build-choice{display:grid;grid-template-columns:42px 1fr 20px;align-items:center;gap:12px;min-height:91px;padding:15px 17px;border:0;border-bottom:1px solid #dfe3e6;background:transparent;text-align:left;cursor:pointer;color:#273039}.build-choice.active{background:#fff;border-left:3px solid #1c69d4;padding-left:14px}.build-number{font-family:Consolas,monospace;color:#8a959d;font-size:11px}.build-name{font-size:14px;font-weight:700}.build-name small{display:block;margin-top:6px;color:#828c94;font-size:10px;font-weight:400}.build-arrow{color:#7c8a96}.build-detail{display:grid;grid-template-columns:1fr 1fr;min-height:380px;background:#fff}
  .build-visual{position:relative;display:flex;align-items:center;justify-content:center;overflow:hidden;background:radial-gradient(ellipse at center,#344351 0%,#1b2731 65%,#141e27 100%);color:#d8e0e7}.visual-kicker{position:absolute;left:22px;top:20px;font-size:8px;letter-spacing:.13em;color:#aab9c6}.visual-caption{position:absolute;left:22px;bottom:20px;font-size:8px;letter-spacing:.12em;color:#aab9c6}
  .wheel-graphic{width:220px;height:220px;border-radius:50%;display:grid;place-items:center;background:linear-gradient(145deg,#66727c,#111a21 55%,#77838d);box-shadow:0 22px 44px rgba(0,0,0,.35),inset 0 0 0 5px #8b959d}.wheel-outer{width:190px;height:190px;border-radius:50%;display:grid;place-items:center;background:repeating-conic-gradient(from 4deg,#aab3ba 0deg 3deg,#313d47 3deg 8deg,#89949d 8deg 10deg);box-shadow:inset 0 0 0 12px #1a232c}
  .wheel-inner{position:relative;width:118px;height:118px;border-radius:50%;background:radial-gradient(circle,#8e9aa3 0 7%,#27333d 8% 15%,#a8b2ba 16% 20%,#394550 21% 100%);box-shadow:inset 0 0 0 7px #697681}.wheel-hub{position:absolute;inset:43px;border-radius:50%;background:#9aa5ae;z-index:2}.wheel-inner span,.wheel-inner i,.wheel-inner b,.wheel-inner em{position:absolute;left:54px;top:5px;width:9px;height:53px;transform-origin:5px 54px;background:linear-gradient(90deg,#aab4bc,#4c5964);border-radius:5px}.wheel-inner i{transform:rotate(72deg)}.wheel-inner b{transform:rotate(144deg)}.wheel-inner em{transform:rotate(216deg)}
  .build-copy{padding:38px 30px;display:flex;flex-direction:column;align-items:flex-start}.status-pill{padding:6px 9px;background:#edf2f6;color:#55718d;font-size:8px;font-weight:700;letter-spacing:.1em}.build-copy h3{margin:25px 0 13px;font-size:29px;line-height:1.08;letter-spacing:-.05em}.build-copy h3 em{color:#8297aa}.build-copy>p{margin:0;color:#69747d;font-size:12px;line-height:1.8}.tag-row{display:flex;flex-wrap:wrap;gap:7px;margin-top:20px}.tag-row span{padding:7px 9px;background:#f1f3f5;color:#66727b;font-size:8px;letter-spacing:.04em}.reference-specs{display:grid;grid-template-columns:1fr 1fr;gap:1px;margin:18px 0;background:#d9dee2}.reference-specs>div{padding:12px;background:#f5f6f7}.reference-specs span,.reference-specs small{display:block;color:#727c84;font-size:8px;letter-spacing:.12em}.reference-specs strong{display:block;margin:7px 0 4px;color:#202a33;font-size:14px}.reference-note{margin:0 0 7px;color:#68737c;font-size:10px;line-height:1.7}.reference-source{color:#7a8d9d;font-size:8px;letter-spacing:.08em}.build-disclaimer{margin-top:auto;padding-top:22px;color:#8b959d;font-size:9px;line-height:1.7}
  .upgrade-section{padding:100px 0 112px;background:#202b35;color:#fff}.upgrade-section .section-heading .eyebrow{color:#9eabb6}.upgrade-section .section-heading h2 em{color:#86a9d1}.upgrade-section .section-intro{color:#b5c0c9}
  .upgrade-layout{display:grid;grid-template-columns:.75fr 1.25fr;gap:50px}.upgrade-nav{display:flex;flex-direction:column}.upgrade-nav button{display:grid;grid-template-columns:35px 1fr 20px;align-items:center;gap:10px;min-height:63px;padding:12px 13px;border:0;border-bottom:1px solid rgba(255,255,255,.12);background:transparent;color:#d4dce2;text-align:left;font-size:12px;cursor:pointer}.upgrade-nav button.active{background:#2c3a47;border-left:2px solid #6fa8ec;padding-left:11px;color:#fff}.upgrade-nav button span{color:#93a2ae;font-family:Consolas,monospace;font-size:10px}.upgrade-nav button b{color:#82b2ee;font-weight:400}.upgrade-content{padding:30px 34px;background:#293743}.upgrade-content .eyebrow{color:#9eabb6}.upgrade-content h3{margin:0;font-size:32px;font-weight:500;letter-spacing:-.04em}.upgrade-intro{max-width:530px;margin:12px 0 24px;color:#c1cbd3;font-size:12px;line-height:1.8}.project-list{display:grid;grid-template-columns:1fr 1fr;gap:1px;background:#41505d}.project-item{min-height:90px;padding:14px;background:#22303b;display:flex;flex-direction:column;align-items:flex-start}.project-item span{color:#81b1e9;font-family:Consolas,monospace;font-size:9px}.project-item strong{margin-top:9px;color:#fff;font-size:11px}.project-item small{margin-top:6px;color:#91a0ac;font-size:7px;letter-spacing:.1em}
  .closing-section{position:relative;min-height:470px;display:flex;align-items:center;background:#111a22;color:#fff;overflow:hidden}.closing-image{position:absolute;inset:0;background:radial-gradient(ellipse at 78% 48%,rgba(75,111,145,.32),transparent 42%),linear-gradient(115deg,#111a22,#263746 56%,#111a22)}.closing-section:after{content:'';position:absolute;inset:0;background:linear-gradient(90deg,rgba(12,19,26,.96),rgba(12,19,26,.76) 45%,rgba(12,19,26,.12))}.closing-content{position:relative;z-index:1;width:min(1200px,calc(100% - 48px));margin:0 auto;padding:75px 0}.closing-content h2{font-size:clamp(43px,6vw,76px);line-height:.98;letter-spacing:-.07em;font-weight:500;margin:0}.closing-content h2 em{color:#8baaca}.closing-content>p:not(.eyebrow){max-width:460px;color:#c0cad2;font-size:13px;line-height:1.8;margin:23px 0 28px}.closing-button{display:inline-flex;align-items:center;gap:18px;padding:16px 20px;background:#1c69d4;color:#fff;text-decoration:none;font-size:9px;font-weight:700;letter-spacing:.1em}.closing-button span{font-size:13px}
  .m4-footer{min-height:92px;padding:22px clamp(20px,5.5vw,88px);display:flex;align-items:center;justify-content:space-between;gap:16px;background:#121a22;color:#9da8b1;font-size:8px;letter-spacing:.13em}.m4-footer .wordmark{color:#fff}

  .fitment-configurator{margin-top:34px;padding:30px;background:#202c36;color:#fff}.config-heading{display:flex;justify-content:space-between;gap:30px;align-items:flex-end;padding-bottom:24px;border-bottom:1px solid rgba(255,255,255,.1)}.config-heading .eyebrow{color:#8fa7bc;margin-bottom:12px}.config-heading h3{font-size:clamp(32px,4vw,48px);line-height:1;letter-spacing:-.06em;font-weight:500;margin:0}.config-heading h3 em{color:#8ca9c9}.config-heading p:not(.eyebrow){max-width:560px;color:#aebbc5;font-size:11px;line-height:1.8;margin:13px 0 0}.config-vehicle{min-width:190px;padding:15px 17px;background:#293946;display:flex;flex-direction:column;gap:7px}.config-vehicle span,.config-vehicle small{color:#91a2af;font-size:8px;letter-spacing:.13em}.config-vehicle strong{font-size:15px}.config-vehicle small{font-size:7px}
  .setup-mode-row{display:flex;align-items:center;flex-wrap:wrap;gap:6px;margin:22px 0 12px}.setup-mode-row>span{margin-right:8px;color:#9eacb7;font-size:8px;font-weight:700;letter-spacing:.12em}.setup-mode-row button,.axle-switch button{padding:11px 13px;border:1px solid #465764;background:#293743;color:#aab8c3;font-size:8px;font-weight:700;letter-spacing:.1em;cursor:pointer}.setup-mode-row button.active,.axle-switch button.active{border-color:#9bbce0;background:#dce8f3;color:#20303d}.setup-mode-row .baseline-action,.axle-switch .baseline-action{margin-left:auto;background:transparent;color:#9db9d4;border:1px solid #526574}.axle-summary{display:grid;grid-template-columns:1fr 1fr;gap:1px;margin:12px 0;background:#42515d}.axle-summary button{display:grid;grid-template-columns:1fr auto;gap:5px 12px;padding:14px 16px;border:0;background:#24333f;color:#fff;text-align:left;cursor:pointer}.axle-summary button.active{background:#304657;box-shadow:inset 0 -2px #8db8e4}.axle-summary small{grid-column:1/-1;color:#9eacb7;font-size:8px;letter-spacing:.12em}.axle-summary strong{font-size:16px;font-weight:500}.axle-summary span{color:#a9c9e8;font-family:Consolas,monospace;font-size:13px}.fitment-workspace{display:grid;grid-template-columns:.8fr 1.2fr;gap:1px;background:#3d4b57}.parameter-panel{padding:24px;background:#263541}.parameter-group{margin-bottom:23px}.parameter-group label{display:block;margin-bottom:11px;color:#9eacb7;font-size:8px;font-weight:700;letter-spacing:.14em}.parameter-options{display:flex;flex-wrap:wrap;gap:5px}.parameter-options button{min-width:47px;padding:9px 8px;border:1px solid #465764;background:#202d37;color:#c5d0d8;font-family:Consolas,monospace;font-size:11px;cursor:pointer}.parameter-options button small{font-family:Arial,sans-serif;color:#94a5b2;font-size:8px}.parameter-options button.chosen{border-color:#82b1e3;background:#e4eef8;color:#20303c}.parameter-options button.chosen small{color:#536d83}.width-options button{min-width:49px}.et-options button{min-width:49px;font-size:9px}.selected-spec{display:grid;grid-template-columns:1fr auto;align-items:center;gap:5px;padding:17px;background:#192630}.selected-spec span{grid-column:1/-1;color:#94a5b1;font-size:8px;letter-spacing:.13em}.selected-spec strong{font-size:22px;font-weight:500}.selected-spec b{color:#91b8e0;font-family:Consolas,monospace;font-size:16px}.parameter-footnote{margin:14px 0 0;color:#93a2ad;font-size:9px;line-height:1.7}
  .diagram-panel{padding:20px 22px;background:#1b2731}.diagram-title{display:flex;justify-content:space-between;color:#9eacb7;font-size:8px;font-weight:700;letter-spacing:.12em}.diagram-title span:last-child{color:#6f7f8c}.fitment-diagram{display:block;width:100%;height:auto;max-height:330px;overflow:visible}.svg-label{fill:#aab9c5;font-size:12px;letter-spacing:2px}.svg-sub{fill:#9cabb7;font-size:10px;letter-spacing:1px}.svg-tiny{fill:#8293a0;font-size:8px;letter-spacing:1px}.diagram-legend{display:flex;justify-content:center;gap:22px;padding:7px 0 18px;color:#aab7c1;font-size:8px}.diagram-legend span{display:flex;align-items:center;gap:7px}.diagram-legend i{display:inline-block;width:17px;height:3px}.legend-oem{background:#7da9d5}.legend-selected{background:#fff}.product-reference{display:grid;grid-template-columns:112px 1fr;gap:14px;align-items:center;margin-top:14px;padding:12px;background:#263541}.product-reference img{width:112px;height:104px;object-fit:contain;background:#fff}.product-reference div{display:flex;flex-direction:column;gap:7px}.product-reference strong{color:#e5edf3;font-size:8px;letter-spacing:.12em}.product-reference span{color:#aab8c3;font-size:8px;line-height:1.6}.product-reference a{color:#8fb9e7;font-size:8px;font-weight:700;text-decoration:none;letter-spacing:.08em}.delta-grid{display:grid;grid-template-columns:1fr 1fr;gap:1px;background:#3c4a56}.delta-grid>div{padding:14px;background:#263541}.delta-grid span,.delta-grid small{display:block;color:#95a5b1;font-size:7px;letter-spacing:.1em}.delta-grid strong{display:block;margin:8px 0;color:#fff;font-family:Consolas,monospace;font-size:17px}.delta-grid small{font-size:8px;letter-spacing:0}.fitment-warning{display:flex;gap:15px;padding:17px 19px;background:#2b3b47;color:#b7c4ce}.fitment-warning b{flex:0 0 auto;color:#a9c9e8;font-size:8px;letter-spacing:.1em}.fitment-warning span{font-size:9px;line-height:1.7}
  .finish-section{background:#19232d}.finish-layout{display:grid;grid-template-columns:.8fr 1.2fr;gap:1px;background:#46535f}.finish-preview{min-height:460px;padding:28px;background:radial-gradient(ellipse at 50% 48%,#3b4b58,#202c36 68%);display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff}.finish-preview-head{width:100%;display:flex;justify-content:space-between;margin-bottom:28px;color:#aab7c1;font-size:8px;letter-spacing:.12em}.finish-wheel{width:240px;height:240px;border-radius:50%;display:grid;place-items:center;box-shadow:0 22px 50px rgba(0,0,0,.3),inset 0 0 0 9px rgba(255,255,255,.16);transition:background .2s}.finish-wheel-ring{width:208px;height:208px;border-radius:50%;display:grid;place-items:center;background:repeating-conic-gradient(#b6c0c7 0 3deg,#4c5862 3deg 8deg,#d5dce0 8deg 10deg);box-shadow:inset 0 0 0 14px #1b2731}.finish-wheel-face{position:relative;width:126px;height:126px;border-radius:50%;background:radial-gradient(circle,#aeb9c0 0 8%,#25313b 9% 19%,#929da5 20% 26%,#35424d 27% 100%);box-shadow:inset 0 0 0 8px rgba(255,255,255,.2)}.finish-wheel-face i{position:absolute;left:59px;top:4px;width:9px;height:58px;transform-origin:4px 59px;border-radius:5px;background:linear-gradient(90deg,rgba(255,255,255,.8),rgba(20,30,39,.8))}.finish-wheel-hub{position:absolute;inset:47px;border-radius:50%;z-index:2;background:#9ba7ae;border:3px solid #d4dce1}.finish-preview>strong{margin-top:26px;font-size:18px;font-weight:500}.finish-preview>small{margin-top:8px;color:#9eacb7;font-size:7px;letter-spacing:.12em;text-align:center}.finish-options{padding:27px;background:#263541}.finish-options>.eyebrow{color:#a6b5c0}.finish-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:7px}.finish-option{padding:10px;border:1px solid #465764;background:#202d37;color:#fff;text-align:left;cursor:pointer}.finish-option.active{border-color:#9bbce0;background:#2c4050}.finish-swatch{display:block;height:48px;margin-bottom:10px;border:1px solid rgba(255,255,255,.16)}.finish-option strong{display:block;font-size:9px}.finish-option small{display:block;margin-top:5px;color:#9cabb6;font-size:7px}.process-list{margin-top:26px;padding-top:22px;border-top:1px solid rgba(255,255,255,.1)}.process-list>.eyebrow{color:#9fb1bf}.process-list>div{display:flex;gap:13px;padding:12px 0;border-bottom:1px solid rgba(255,255,255,.07)}.process-list>div>b{color:#82b2e6;font-family:Consolas,monospace;font-size:10px}.process-list>div span{display:flex;flex-direction:column;gap:5px}.process-list strong{color:#edf2f5;font-size:10px}.process-list small{color:#9eacb7;font-size:8px;line-height:1.6}
  .services-section{padding:100px 0 108px;background:#f5f6f7}.service-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:#dce1e5}.service-grid article{min-height:190px;padding:25px;background:#fff}.service-grid article>span{color:#788894;font-size:8px;font-weight:700;letter-spacing:.13em}.service-grid h3{margin:23px 0 10px;color:#202a33;font-size:19px;font-weight:500;letter-spacing:-.03em}.service-grid p{margin:0;color:#6e7981;font-size:10px;line-height:1.8}.service-disclaimer{margin:17px 0 0;color:#849099;font-size:8px;line-height:1.7}

  @media(max-width:800px){.topline{padding-inline:18px}.topline span:nth-child(2){display:none}.page-header{height:66px;padding-inline:18px}.page-header nav{gap:14px}.page-header nav a{font-size:8px}.header-action{display:none}.hero{min-height:600px}.hero-content{padding:80px 28px}.section-wrap{width:calc(100% - 36px)}.vehicle-section,.build-section,.fitment-section,.upgrade-section{padding-block:72px}.section-heading{grid-template-columns:1fr;gap:20px;margin-bottom:30px}.section-intro{max-width:600px}.chassis-grid{grid-template-columns:repeat(2,1fr)}.vehicle-fields{grid-template-columns:1fr 1fr}.vehicle-identity{grid-column:1/-1}.spec-header,.spec-row{grid-template-columns:1fr 1fr;gap:8px}.spec-header span:nth-child(4){display:none}.spec-row{padding:15px}.spec-row>strong{grid-column:1/-1}.spec-row small{grid-column:1/-1}.build-layout,.upgrade-layout{grid-template-columns:1fr;gap:20px}.build-choice{min-height:72px}.build-detail{min-height:340px}.upgrade-content{padding:25px}.fitment-actions{align-items:flex-start;flex-direction:column}.fitment-actions>span{text-align:left}.config-heading{align-items:flex-start;flex-direction:column}.config-vehicle{width:100%}.fitment-workspace,.finish-layout{grid-template-columns:1fr}.service-grid{grid-template-columns:repeat(2,1fr)}.m4-footer{flex-wrap:wrap}}
  @media(max-width:520px){.setup-mode-row .baseline-action,.axle-switch .baseline-action{margin-left:0}.axle-summary strong{font-size:13px}.product-reference{grid-template-columns:88px 1fr}.product-reference img{width:88px;height:88px}.topline{height:27px;font-size:7px}.page-header nav{gap:10px}.page-header nav a{font-size:7px;letter-spacing:.07em}.wordmark{font-size:12px}.hero{min-height:560px}.hero-image{background-position:62% center}.hero-content{padding:76px 22px}.hero-meta{gap:9px;flex-wrap:wrap;font-size:8px}.hero-index{right:20px;bottom:24px}.section-wrap{width:calc(100% - 32px)}.vehicle-panel{padding:22px 16px}.vehicle-panel-top{font-size:8px}.manual-label{max-width:125px;text-align:right;line-height:1.5}.chassis-option{min-height:125px;padding:15px}.chassis-code{font-size:25px}.vehicle-fields{grid-template-columns:1fr}.vehicle-identity{grid-column:auto}.service-grid{grid-template-columns:1fr}.finish-grid{grid-template-columns:repeat(2,1fr)}.axle-switch{flex-wrap:wrap}.axle-switch .baseline-action{margin-left:0}.fitment-configurator{padding:18px}.parameter-panel{padding:18px}.diagram-panel{padding:15px 8px}.delta-grid strong{font-size:13px}.fitment-toolbar{flex-direction:column;font-size:7px}.spec-header{padding-inline:13px;font-size:7px}.spec-row{grid-template-columns:1fr 1fr;padding:13px}.spec-row>strong{font-size:11px}.spec-value{font-size:9px}.spec-row small{font-size:8px}.build-detail{grid-template-columns:1fr}.build-visual{min-height:250px}.wheel-graphic{width:185px;height:185px}.wheel-outer{width:160px;height:160px}.wheel-inner{width:100px;height:100px}.wheel-inner span,.wheel-inner i,.wheel-inner b,.wheel-inner em{left:45px;height:45px;transform-origin:5px 46px}.wheel-inner i{transform:rotate(72deg)}.wheel-inner b{transform:rotate(144deg)}.wheel-inner em{transform:rotate(216deg)}.build-copy{min-height:270px;padding:28px 23px}.project-list{grid-template-columns:1fr}.project-item{min-height:74px}.upgrade-content{padding:23px 18px}.closing-section{min-height:450px}.closing-content{width:calc(100% - 42px)}.m4-footer{align-items:flex-start;flex-direction:column;padding:26px 20px}}
  @media(prefers-reduced-motion:reduce){:global(html){scroll-behavior:auto}.chassis-option{transition:none}}
</style>
