<script lang="ts">
  type Chassis = 'G82' | 'G83' | 'F82' | 'F83';
  type UpgradeKey = 'wheels' | 'suspension' | 'brakes' | 'exterior' | 'performance' | 'interior';
  let chassis = $state<Chassis>('G82');
  let trim = $state('Competition');
  let year = $state('2024');
  let activeSetup = $state('Street Sport');
  let activeUpgrade = $state<UpgradeKey>('wheels');
  let yearPickerOpen = $state(false);
  let trimPickerOpen = $state(false);

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

  function selectTrim(value: string) {
    trim = value;
    const years = validYears[chassis][value] ?? currentVehicle.years;
    if (!years.includes(year)) year = years[years.length - 1];
  }

  function selectChassis(value: Chassis) {
    chassis = value;
    trim = vehicleOptions[value].trims[0];
    year = (validYears[value][trim] ?? vehicleOptions[value].years)[(validYears[value][trim] ?? vehicleOptions[value].years).length - 1];
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
      <a href="#vehicle">VEHICLE</a><a href="#fitment">FITMENT</a><a href="#builds">BUILDS</a><a href="#upgrades">UPGRADES</a>
    </nav>
    <a class="header-action" href="#fitment">EXPLORE FITMENT <span>↗</span></a>
  </header>

  <main>
    <section class="hero">
      <div class="hero-image"><img src={vehiclePhotos[chassis]} alt={`BMW M4 ${chassis} reference vehicle`} /><a class="image-credit" href={vehicleImageSources[chassis]} target="_blank" rel="noreferrer">{chassis === 'F82' ? 'Photo: Tokumeigakarinoaoshima · CC0' : chassis === 'F83' ? 'Photo: EuroVisionNim · CC BY-SA 4.0' : chassis === 'G82' ? 'Photo: Alexander Migl · CC BY-SA 4.0' : 'Photo: usf1fan2 · CC BY 2.0'}</a></div>
      <div class="hero-shade"></div>
      <div class="hero-content">
        <p class="eyebrow"><span></span> THE URANUS VEHICLE SERIES / 001</p>
        <h1>BMW <em>M4</em></h1>
        <p class="hero-subtitle">A considered guide to fitment, form<br />and performance upgrades.</p>
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
          <p class="section-intro">A sourced factory baseline for {chassis} {trim}. Front and rear values are maintained independently, with aftermarket references clearly separated from OEM specifications.</p>
        </div>
        <div class="fitment-toolbar"><div><span class="live-dot"></span> CURATED FITMENT DATABASE</div><span>VEHICLE: {chassis} / {selectedYear} / {trim}</span></div>
        <div class="spec-table">
          <div class="spec-header"><span>SPECIFICATION</span><span>FRONT AXLE</span><span>REAR AXLE</span><span>REFERENCE</span></div>
          {#each specs as spec, index}
            <div class="spec-row">
              <strong>{spec.label}<small class="spec-kind">{spec.kind}</small></strong>
              <span class="spec-value">{spec.front}</span>
              <span class="spec-value">{spec.rear}</span>
              <small>{spec.note}<a href="#sources">{spec.source}</a></small>
            </div>
          {/each}
        </div>
        <div class="engineering-note"><span class="note-icon">i</span><p><strong>Fitment boundary</strong> — OEM dimensions below are reference data, not a blanket aftermarket approval. Brake package, wheel-spoke profile, suspension, tyre construction, alignment and market specification must be checked on the exact car.</p></div>
        <div class="source-standard" id="sources">
          <div><p class="eyebrow">SOURCE REGISTER</p><h3>Traceable vehicle data.</h3><p>Factory figures are prioritised from BMW technical publications. Secondary fitment databases are used to cross-check hardware and documented owner/vendor builds, not to certify every aftermarket combination.</p></div>
          <div class="source-fields">
            <span>UW-M4-F-001 <b>F82/F83 hardware · FMB Wheels</b><a href="https://fmbwheels.com/bmw-f82-m4-2015-2020-wheel-fitment-guide/" target="_blank" rel="noreferrer">Open source ↗</a></span>
            <span>UW-M4-F-002 <b>F82/F83 OEM packages · FMB Wheels</b><a href="https://fmbwheels.com/bmw-f82-m4-2015-2020-wheel-fitment-guide/" target="_blank" rel="noreferrer">Open source ↗</a></span>
            <span>UW-M4-F-003 <b>F82 engine / edition data · BMW</b><a href="https://www.bmw-m.com/en/topics/magazine-article-pool/bmw-m3-f80-and-bmw-m4-f82.html" target="_blank" rel="noreferrer">BMW M technical overview ↗</a></span>
            <span>UW-M4-F-004 <b>F82 CS technical data · BMW</b><a href="https://www.press.bmwgroup.com/global/article/detail/T0269820EN/the-new-bmw-m4-cs?language=en" target="_blank" rel="noreferrer">BMW press kit ↗</a></span>
            <span>UW-M4-F-005 <b>F82 factory wheel / tyre cross-check</b><a href="https://www.press.bmwgroup.com/usa/article/attachment/T0160684EN_US/391903" target="_blank" rel="noreferrer">2015 BMW technical data ↗</a></span>\n            <span>UW-M4-F-006 <b>F82 M4 GTS engine and performance · BMW</b><a href="https://www.press.bmwgroup.com/global/article/detail/T0236962EN/the-new-bmw-m4-gts" target="_blank" rel="noreferrer">BMW press release ↗</a></span>
            <span>UW-M4-G-001 <b>G82/G83 hardware · PG Wheels / FMB</b><a href="https://fmbwheels.com/bmw-g82-m4-wheel-fitment-guide/" target="_blank" rel="noreferrer">Open source ↗</a></span>\n            <span>UW-M4-G-008 <b>G82/G83 hub and fastener cross-check · PG Wheels</b><a href="https://pgwheels.com/fitment/bmw-m4-g82-g83-2021-2026-wheel-fitment-guide/" target="_blank" rel="noreferrer">Open source ↗</a></span>
            <span>UW-M4-G-002 <b>G82 OEM tyre / wheel sizes · BMW</b><a href="https://www.press.bmwgroup.com/usa/article/detail/T0439244EN_US/the-new-2025-bmw-m4-coupe-and-m4-convertible?language=en_US" target="_blank" rel="noreferrer">BMW technical data ↗</a></span>
            <span>UW-M4-G-003 <b>2025 M4 CS · BMW</b><a href="https://www.press.bmwgroup.com/usa/article/detail/T0441789EN_US/the-new-2025-bmw-m4-cs" target="_blank" rel="noreferrer">BMW technical data ↗</a></span>
            <span>UW-M4-G-004 <b>2023 M4 CSL · BMW</b><a href="https://www.press.bmwgroup.com/usa/article/detail/T0392153EN_US/the-bmw-m4-csl" target="_blank" rel="noreferrer">BMW technical data ↗</a></span>
            <span>UW-M4-G-005 <b>2021 M4 factory wheel package · BMW</b><a href="https://www.press.bmwgroup.com/usa/article/detail/T0317577EN_US/the-new-2021-bmw-m3-sedan-and-m4-coupe" target="_blank" rel="noreferrer">BMW technical data ↗</a></span>
            <span>UW-M4-G-006 <b>Wheel size cross-check · Wheelssize</b><a href="https://wheelssize.com/wheels/bmw/m4/" target="_blank" rel="noreferrer">Open database ↗</a></span>
            <span>UW-M4-G-007 <b>Wheel size cross-check · 4Wheels</b><a href="https://4wheels.com.tw/fitment/bmw/m4" target="_blank" rel="noreferrer">Open database ↗</a></span>
          </div>
        </div>
        <div class="source-standard">
          <div><p class="eyebrow">DATA GOVERNANCE</p><h3>Every specification needs a source.</h3><p>Published values will carry a traceable reference and a review status. No anonymous forum figure or unverified owner report will be presented as an approved fitment.</p></div>
          <div class="source-fields"><span>SOURCE ID <b>e.g. UW-M4-G82-001</b></span><span>REFERENCE <b>Document / page / URL</b></span><span>VEHICLE SCOPE <b>Chassis · year · trim · brakes</b></span><span>REVIEW <b>Evidence type · reviewer · date</b></span></div>
        </div>
        <div class="fitment-actions"><a href="/fitment-finder" class="outline-action">OPEN FITMENT FINDER <span>↗</span></a><span>VIN DECODING IS AN IDENTIFICATION AID, NOT A FITMENT APPROVAL.</span></div>
      </div>
    </section>

    <section class="build-section section-wrap" id="builds">
      <div class="section-heading">
        <div><p class="eyebrow dark">04 / CURATED CONFIGURATIONS</p><h2>Choose your<br /><em>build direction.</em></h2></div>
        <p class="section-intro">A build is more than a wheel size. Explore distinct directions, each designed to connect fitment, tires, suspension and intended use.</p>
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

    <section class="upgrade-section" id="upgrades">
      <div class="section-wrap">
        <div class="section-heading">
          <div><p class="eyebrow">05 / MODIFICATION ECOSYSTEM</p><h2>Build beyond<br /><em>the wheels.</em></h2></div>
          <p class="section-intro">Explore the wider M4 modification landscape. Each category can grow into a dedicated guide with compatible products, technical notes and real vehicle builds.</p>
        </div>
        <div class="upgrade-layout">
          <div class="upgrade-nav" role="tablist" aria-label="Modification categories">
            {#each upgradeGroups as group, i}
              <button class:active={activeUpgrade === group.key} role="tab" aria-selected={activeUpgrade === group.key} onclick={() => activeUpgrade = group.key}><span>0{i + 1}</span>{group.title}<b>↗</b></button>
            {/each}
          </div>
          <div class="upgrade-content" role="tabpanel">
            <p class="eyebrow">{chassis} / MODIFICATION AREA</p><h3>{currentUpgrade.title}</h3><p class="upgrade-intro">{currentUpgrade.intro}</p>
            <div class="project-list">
              {#each currentUpgrade.projects as project, i}
                <div class="project-item"><span>0{i + 1}</span><strong>{project}</strong><small>PLANNED CATEGORY</small></div>
              {/each}
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="closing-section">
      <div class="closing-image"></div><div class="closing-content"><p class="eyebrow">YOUR M4. YOUR SPECIFICATION.</p><h2>Precision starts<br />with the <em>details.</em></h2><p>Have a wheel setup in mind? Start with your vehicle, then review the fitment reference before selecting a design.</p><a href="/fitment-finder" class="closing-button">FIND WHEELS FOR YOUR BMW <span>↗</span></a></div>
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
  .hero-image{position:absolute;inset:0;z-index:-2;background:#101820}.hero-image img{width:100%;height:100%;object-fit:cover;object-position:center 52%;filter:saturate(.68) brightness(.62)}.image-credit{position:absolute;right:24px;bottom:18px;color:#dce2e8;font-size:8px;letter-spacing:.08em;text-shadow:0 1px 4px #000;text-decoration:none}.image-credit:hover{text-decoration:underline}
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
  .engineering-note{display:flex;gap:13px;align-items:flex-start;margin-top:20px;padding:17px 18px;background:#243440;color:#c1ccd5}.note-icon{display:grid;place-items:center;width:18px;height:18px;flex:0 0 18px;border:1px solid #8da4b9;border-radius:50%;font-size:11px}.engineering-note p{margin:0;font-size:10px;line-height:1.8}.engineering-note strong{color:#fff}.spec-kind{display:block;margin-top:5px;color:#8b949c;font-size:8px;font-weight:600;letter-spacing:.1em;text-transform:uppercase}.spec-row small a{display:inline-block;margin-left:6px;color:#6f9bc8;text-decoration:none;font-size:8px;font-weight:700}.source-standard{display:grid;grid-template-columns:1fr 1fr;gap:30px;margin-top:24px;padding:24px;background:#202c36}.source-standard .eyebrow{margin-bottom:10px}.source-standard h3{margin:0 0 9px;font-size:19px;font-weight:500;letter-spacing:-.03em}.source-standard>div:first-child>p:last-child{max-width:500px;margin:0;color:#aebbc5;font-size:10px;line-height:1.8}.source-fields{display:grid;grid-template-columns:1fr 1fr;gap:1px;background:#3b4a56}.source-fields span{padding:13px;background:#25333e;color:#8fa0ad;font-size:7px;font-weight:700;letter-spacing:.12em}.source-fields a{display:inline-block;margin-top:7px;color:#a8c9e8;font-size:8px;text-decoration:none}.source-fields b{display:block;margin-top:7px;color:#e2e8ed;font-size:9px;font-weight:500;letter-spacing:0}
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
  @media(max-width:800px){.topline{padding-inline:18px}.topline span:nth-child(2){display:none}.page-header{height:66px;padding-inline:18px}.page-header nav{gap:14px}.page-header nav a{font-size:8px}.header-action{display:none}.hero{min-height:600px}.hero-content{padding:80px 28px}.section-wrap{width:calc(100% - 36px)}.vehicle-section,.build-section,.fitment-section,.upgrade-section{padding-block:72px}.section-heading{grid-template-columns:1fr;gap:20px;margin-bottom:30px}.section-intro{max-width:600px}.chassis-grid{grid-template-columns:repeat(2,1fr)}.vehicle-fields{grid-template-columns:1fr 1fr}.vehicle-identity{grid-column:1/-1}.spec-header,.spec-row{grid-template-columns:1fr 1fr;gap:8px}.spec-header span:nth-child(4){display:none}.spec-row{padding:15px}.spec-row>strong{grid-column:1/-1}.spec-row small{grid-column:1/-1}.build-layout,.upgrade-layout{grid-template-columns:1fr;gap:20px}.build-choice{min-height:72px}.build-detail{min-height:340px}.upgrade-content{padding:25px}.fitment-actions{align-items:flex-start;flex-direction:column}.fitment-actions>span{text-align:left}.source-standard{grid-template-columns:1fr}.source-fields{grid-template-columns:1fr 1fr}.m4-footer{flex-wrap:wrap}}
  @media(max-width:520px){.topline{height:27px;font-size:7px}.page-header nav{gap:10px}.page-header nav a{font-size:7px;letter-spacing:.07em}.wordmark{font-size:12px}.hero{min-height:560px}.hero-image{background-position:62% center}.hero-content{padding:76px 22px}.hero-meta{gap:9px;flex-wrap:wrap;font-size:8px}.hero-index{right:20px;bottom:24px}.section-wrap{width:calc(100% - 32px)}.vehicle-panel{padding:22px 16px}.vehicle-panel-top{font-size:8px}.manual-label{max-width:125px;text-align:right;line-height:1.5}.chassis-option{min-height:125px;padding:15px}.chassis-code{font-size:25px}.vehicle-fields{grid-template-columns:1fr}.vehicle-identity{grid-column:auto}.source-fields{grid-template-columns:1fr}.fitment-toolbar{flex-direction:column;font-size:7px}.spec-header{padding-inline:13px;font-size:7px}.spec-row{grid-template-columns:1fr 1fr;padding:13px}.spec-row>strong{font-size:11px}.spec-value{font-size:9px}.spec-row small{font-size:8px}.build-detail{grid-template-columns:1fr}.build-visual{min-height:250px}.wheel-graphic{width:185px;height:185px}.wheel-outer{width:160px;height:160px}.wheel-inner{width:100px;height:100px}.wheel-inner span,.wheel-inner i,.wheel-inner b,.wheel-inner em{left:45px;height:45px;transform-origin:5px 46px}.wheel-inner i{transform:rotate(72deg)}.wheel-inner b{transform:rotate(144deg)}.wheel-inner em{transform:rotate(216deg)}.build-copy{min-height:270px;padding:28px 23px}.project-list{grid-template-columns:1fr}.project-item{min-height:74px}.upgrade-content{padding:23px 18px}.closing-section{min-height:450px}.closing-content{width:calc(100% - 42px)}.m4-footer{align-items:flex-start;flex-direction:column;padding:26px 20px}}
  @media(prefers-reduced-motion:reduce){:global(html){scroll-behavior:auto}.chassis-option{transition:none}}
</style>
