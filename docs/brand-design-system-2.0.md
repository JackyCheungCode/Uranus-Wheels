# Uranus Wheels — Brand Design System 2.0
Status: Approved direction / implementation baseline
Branch: brand/bmw-inspired-design-system

## Brand position
Uranus Wheels is an independent premium forged-wheel brand focused initially on BMW fitment and customization. BMW is the initial vehicle specialization, not an ownership, sponsorship, or affiliation claim. The brand must never imply that Uranus Wheels is BMW or an officially endorsed BMW product.

Brand promise: precision-engineered forged wheels, designed around the vehicle and the driver's intent.

Primary descriptor: BMW-focused forged wheels & performance upgrades.
Tagline direction: PRECISION FORGED.

## Visual principles
1. Premium automotive editorial, not a generic ecommerce template.
2. Large, art-directed vehicle and wheel photography; generous whitespace.
3. Restrained palette: white, charcoal, cool gray, deep navy, and a limited performance blue accent.
4. Strong typographic hierarchy; short headlines; precise technical metadata.
5. Background layers organize content; borders are rare and functional.
6. Motion is restrained and purposeful; never obstructs browsing or fitment tasks.
7. Mobile-first layouts; no desktop layout merely scaled down.

## Color tokens
- --uw-color-white: #FFFFFF
- --uw-color-charcoal: #262626
- --uw-color-gray-050: #F7F7F7
- --uw-color-gray-100: #F1F1F1
- --uw-color-gray-300: #D8DADD
- --uw-color-gray-600: #697176
- --uw-color-navy: #1A2129
- --uw-color-performance-blue: #1C69D4
- --uw-color-focus: #0F62FE (accessible focus treatment)

Suggested visual balance: 65% white, 20% light gray, 10% dark surfaces, 5% blue accent. These are Uranus Wheels design tokens inspired by premium automotive visual language, not BMW's official brand specification. Verify contrast for every text/control combination.

## Typography
Use a modern neutral sans-serif system stack with clear weights. Use compact uppercase eyebrow labels sparingly. Headlines should be editorial and confident; technical values should use tabular numerals. Avoid imitating proprietary BMW typography or wordmarks.

## Layout and components
- Header: clean light surface, restrained wordmark, concise navigation, clear primary action.
- Hero: full-bleed or wide cinematic automotive image with concise brand statement and one primary CTA.
- Content sections: alternating white / cool-gray surfaces; consistent max-width and spacing scale.
- Cards: image-led, minimal chrome, no heavy shadows; use subtle surface contrast.
- Buttons: square or minimally rounded; primary blue, secondary neutral/outline; visible hover, focus, disabled and loading states.
- Inputs: custom accessible controls; never rely on browser-native dropdown appearance where a designed selector is required.
- Icons: consistent line icon family; avoid decorative icon overload.
- Footer: deep navy/charcoal, compact navigation and clear contact pathways.

## Information architecture
1. Home
2. Forged Wheels
   - Monoblock
   - 2-Piece
   - 3-Piece
3. BMW Fitment
   - Series / model / chassis / year / trim
   - VIN lookup as an alternate route
   - Fitment evidence and engineering review
4. Wheel Configurator
   - Diameter, width, offset, PCD, center bore, finish, construction
5. Engineering
   - Forging process, materials, load testing, quality controls (publish only substantiated claims)
6. Performance Solutions (future phase)
   - Suspension, brakes, tires, aero and installation partners
7. About / Contact / Dealer & Installer Network

## Home page content order
1. Brand-led hero (BMW vehicle imagery only where rights are secured)
2. Forged wheel collection
3. Find wheels for your BMW
4. Craft / engineering story
5. Customization and finishes
6. Customer builds / gallery (with permission)
7. Dealer and global enquiry CTA

## BMW fitment experience
- Initial scope is BMW only. Do not show unrelated makes in the primary selector.
- Identify Series, model, chassis code, model year, trim/engine, brake package and axle configuration where data supports it.
- VIN decoding is an identification aid, not a fitment approval.
- Show one canonical set of vehicle/fitment values once. Do not repeat PCD, center bore, lug count or year in both an audit list and a second summary card.
- Separate source facts, aftermarket reference values, calculated values and unknown values.
- Never infer OE offset from Flush/Max aftermarket references.
- Missing brake clearance, load rating, thread/seat or other critical data must be disclosed and block any unqualified "confirmed fitment" claim.
- Fitment status vocabulary: Verified against documented vehicle/wheel evidence; Review required; Insufficient data. Never label a fitment safe solely because a database row exists.

## Product presentation
- Large product image / detail imagery first.
- Clearly identify wheel construction and design.
- Display specifications in one canonical technical-specification area.
- Distinguish indicative concepts from actual inventory, approved configurations and live pricing.
- Avoid presenting synthetic/demo wheel concepts as purchasable inventory.

## Accessibility and responsive behavior
- Meet WCAG AA contrast for text and controls.
- Keyboard-operable navigation and selectors; clear focus rings.
- Touch targets at least 44px where practical.
- On mobile, stack editorial content naturally; product rows may use image left and specs/actions right when legible.
- Respect reduced-motion preferences.

## Implementation sequence
1. Establish tokens, typography, spacing, radii, shadows, breakpoints and base components.
2. Refactor global AppShell/header/footer/navigation using tokens.
3. Redesign home page hero and content hierarchy.
4. Redesign forged-wheel collection and product detail.
5. Redesign BMW fitment flow and canonical single-display fitment report.
6. Build wheel configurator.
7. Add performance-upgrade modules only after wheel and fitment experience is reliable.

## Acceptance criteria
- No page-specific color hacks for shared components.
- No duplicate display of the same fitment datum within one result view.
- No native-looking select controls where custom selectors are required.
- No unverified BMW affiliation, product claims, engineering certifications or fitment guarantees.
- Mobile and desktop layouts both reviewed.
- Visual regression and functional checks pass before production deployment.
