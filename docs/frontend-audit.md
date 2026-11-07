# Uranus Wheels — Frontend Audit & Remediation Register

**Audit baseline:** `feature/homepage`, 2026-11-07  
**Current phase:** Shared design foundation and control convergence  
**Production:** `main` and production Worker are out of scope.

## 1. Audit summary

The storefront has a shared header/footer and several global tokens, but the source still contains legacy page styles and multiple generations of controls. The work is therefore a convergence effort, not a greenfield redesign.

| Area | Audit observation | Action |
|---|---|---|
| Design tokens | Tokens exist, but page CSS still contains many literal colors and local semantic aliases | Route semantic UI colors through shared tokens; keep physical wheel/finish swatch colors literal where they represent real materials |
| Buttons | 116 button elements; multiple class families and page-local button styles | One primary / secondary / tertiary / danger contract; preserve choice controls as a distinct selectable-control family |
| Selects | Three custom selector families plus native selects; Custom Builder was being enhanced twice by its local and global scripts | Added an enhancement guard, fixed label lookup via `select.labels`, added visible required-select errors and reset cleanup |
| Forms | Contact, dealer, RFQ and builder forms have different markup and field classes | Shared labels, field heights, focus, errors, disabled/loading and status semantics |
| AppShell | Shared header/footer exists; several pages also had legacy menu handlers that conflicted with the global handler | Removed duplicate page-level header/language listeners and stale fitment menu hook; one global AppShell handler now owns the shared menu |
| Responsive | CSS includes several local breakpoints and one-off layout overrides | Consolidate common breakpoints after page-by-page viewport tests |
| Accessibility | Some controls use ARIA roles; implementation differs by generation | Keyboard, focus, labels, error association and screen-reader audit |
| Business logic | Fitment flow, product configurator and custom builder are distinct flows; configurator had fallback demo specs that could still populate an RFQ | Product RFQ is now gated on a published product, approved finish and complete matching SKU dimension/offset; fallback values display as TBC / not published. Custom Builder explicitly labels entered values as engineering-review targets only |

## 2. Control inventory

The current source contains these selector implementations:

1. **Vehicle Fitment:** `.select-trigger` / `.select-options` with searchable make/model/year menus.
2. **Wheel Configuration / RFQ:** `.dropdown-trigger` / `.dropdown-menu` / `.dropdown-option` for finish, approved size combinations, destination and commercial terms.
3. **Custom Wheel Builder:** native `select` fields enhanced as `.carbon-select-trigger` / `.carbon-select-menu`.
4. **Contact / Dealer forms:** native `select` fields progressively enhanced by the global `.uw-select` layer.

These must retain their different data sources and dependent-option logic while converging on one appearance and interaction contract.

## 3. Page / flow audit map

| Route / area | Main controls | Key checks |
|---|---|---|
| `/` | Navigation, vehicle selector, AI prompt, example prompts | Mobile nav; make/model/year dependency; AI submission and validation |
| `/wheels` | Search, filter chips, filter panel, product cards | Filter state, keyboard access, empty state, responsive card layout |
| `/wheels/:slug` | Product detail, configuration entry | Published product data, approved variant/finish availability, no fabricated SKU claims |
| `/configure/:slug` | Finish/size dropdowns, buyer details, shipping and RFQ actions | Only approved combinations; country/region/city dependency; RFQ payload integrity |
| `/custom-wheel-builder` | Native-select enhancements, visual choices, swatches, step navigation, preview | Field validation; engineering-review boundaries; responsive preview; no unapproved production claims |
| `/contact` | Contact form, topic select, status | Required fields, select keyboard behavior, anti-spam checks, success/error state |
| `/dealers` | Dealer application, business-type and volume selects | Required fields, select keyboard behavior, submission state |
| `/about-us`, `/engineering-quality`, `/gallery`, `/faq` | Shared navigation/footer and page CTAs | Content hierarchy, links, placeholder disclosure, mobile layout |

## 4. Design convergence rules

- Primary action: Carbon Black fill and white text.
- Secondary action: neutral / transparent with restrained border.
- Tertiary action: quiet text or icon treatment.
- Danger: semantic red, only for destructive actions.
- Champagne: restrained brand accent, not a competing primary button.
- Blue: interaction/focus state, not a general brand button fill.
- Standard action control minimum height: 44px.
- Choice controls, filter chips, material swatches and wheel visual options are not primary buttons. They must communicate selected/unselected state consistently without inheriting primary action fill.
- Select menus use the same layer, typography, option height, selected state, focus and z-index rules.
- Field labels, helper text, validation messages and status messages use shared semantic tokens.
- Literal swatch colors are allowed only when they represent the actual finish/material being selected.

## 5. Implemented in this pass

- Added semantic color, surface, spacing, typography, focus and layout tokens.
- Standardized the global header/footer width and responsive menu behavior.
- Normalized common primary and secondary button styling.
- Aligned the three custom selector visual families and option menus.
- Normalized field label, input, textarea and focus styling.
- Added shared selected-state treatment for filters and choice controls.
- Removed a set of legacy orange action accents that conflicted with the chosen palette.
- Deployed to Preview only.

## 6. Known limitations / next checks

- The source still contains many local literal colors. Some are legitimate wheel artwork/material swatches; remaining semantic UI colors need token migration.
- Existing page-local CSS can still override global rules depending on template order and selector specificity.
- Global select enhancement is progressive enhancement; disabled options, required validation, form reset, dynamic option mutation and dependent selects still need real-browser verification.
- Custom Builder retains its own Carbon selector renderer and is now excluded from the global enhancer; keyboard and screen-reader parity still needs browser testing.
- Global AppShell menu and language controls are now the only shared-header handlers; page-local duplicates were removed to prevent double-toggle behavior.
- The fitment selector and dropdown selector have separate legacy scripts; keyboard parity must be verified and then consolidated.
- Custom Builder remains a free-form engineering enquiry, not a vehicle-verified product configurator. Its dimensions, PCD, center bore, lug count and load inputs are explicitly described as customer-requested targets pending engineering review.
- No browser-based visual acceptance has been completed in this pass. Preview requests from the execution environment returned HTTP 403, so this must not be described as visually verified.

## 7. Acceptance gates

### Gate A — shared foundation
- [x] Token foundation and semantic layer names exist.
- [x] Global AppShell navigation/footer styles are centralized.
- [x] Common button, select, input and textarea visual contracts are applied.
- [ ] No semantic color drift between routes.
- [ ] Keyboard and screen-reader checks pass for all selector families.
- [ ] Desktop, tablet and mobile screenshots reviewed for every route.

### Gate B — business logic
- [ ] Map the full Fitment-to-Product-to-Configuration-to-RFQ journey.
- [ ] Map the Custom Builder steps and submission journey.
- [x] Block product quotation requests unless a published product, approved finish and complete matching SKU dimension/offset exist.
- [x] Remove default demo fitment values from the product configuration summary and RFQ preview when no published product exists.
- [x] Label Custom Builder inputs as customer-requested engineering targets, not fitment or production approval.
- [ ] Reconcile engineering-approved dimensions, offsets, PCD, center bore, lug count, finishes and construction rules.
- [ ] Verify RFQ payloads and dependent location / shipping fields.
- [ ] Verify all validation, loading, success and error states.

### Gate C — release
- [ ] Automated route and interaction checks pass.
- [ ] Browser visual acceptance passes at 1440px, 1024px, 768px and 390px.
- [ ] Preview acceptance approved before any production release.
