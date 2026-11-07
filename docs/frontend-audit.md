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
| Selects | Three custom selector families plus native selects; Custom Builder was being enhanced twice by its local and global scripts; RFQ dropdowns lacked consistent keyboard semantics | Added an enhancement guard, fixed label lookup via `select.labels`, added visible required-select errors/reset cleanup, and added combobox/listbox roles, label association, Arrow/Home/End/Enter/Space/Escape keyboard handling to RFQ dropdowns |
| Forms | Contact, dealer, RFQ and builder forms have different markup and field classes; several builder labels were not programmatically associated | Added label-to-control association for legacy `.field` and `.form-field` markup, plus shared focus, error, disabled/loading and status semantics |
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
- Product configuration dropdowns now expose combobox/listbox semantics and keyboard navigation, but real screen-reader and touch verification is still pending.
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
- [x] Shared button, filter and selection states use the same semantic color hierarchy across all 10 page templates.
- [ ] Review remaining non-control page-specific color accents and contrast.
- [ ] Keyboard and screen-reader checks pass for all selector families.
- [ ] Desktop, tablet and mobile screenshots reviewed for every route.

### Gate B — business logic
- [x] Map the full Fitment-to-Product-to-Configuration-to-RFQ journey and persist approved-SKU RFQs to the enquiry table (Fitment remains a separate lookup and is not treated as a fitment approval).
- [x] Map the Custom Builder four-step request and submission journey, including engineering-review flags.
- [x] Block product quotation requests unless a published product, approved finish and complete matching SKU dimension/offset exist.
- [x] Remove default demo fitment values from the product configuration summary and RFQ preview when no published product exists.
- [x] Add keyboard-operable semantics and explicit label association to the product configuration dropdown family.
- [x] Label Custom Builder inputs as customer-requested engineering targets, not fitment or production approval.
- [ ] Reconcile engineering-approved dimensions, offsets, PCD, center bore, lug count, finishes and construction rules.
- [x] Verify RFQ payload structure, buyer validation, country/city/address dependencies, sea/air mode and Incoterm named-place logic.
- [ ] Verify end-to-end RFQ submission from a real browser against the live Preview deployment.
- [ ] Verify all validation, loading, success and error states.

### Gate C — release
- [x] Worker and inline page-script syntax checks pass; route HTTP/browser interaction checks remain blocked by the current Preview 403 response.
- [ ] Browser visual acceptance passes at 1440px, 1024px, 768px and 390px.
- [ ] Preview acceptance approved before any production release.

## 8. Latest implementation pass (2026-11-07)

- Shared shell coverage: 10 page templates plus the top-level response shell use the shared global header, footer, token CSS, navigation interaction and active-route script.
- Static inventory at this pass: 115 button elements, 4 forms, 43 inputs, 3 textareas and 8 native selects. The button inventory includes semantic option controls and material swatches; swatch colors are data, not button-theme exceptions.
- Removed the last inline spacing declaration from the Custom Builder submit button and moved it to the shared spacing token.
- Added an accessible name to the Custom Builder optional project-notes input.
- Product configuration RFQ remains locked unless published product, approved finish and complete matching size/offset SKU data are present.
- Cloudflare Preview deployment verified at 100% traffic: Worker version `f1ca5ad9-2d78-44db-bb33-71ca8f99c0bd`, deployment `9b817452-0f8b-4950-9d3d-2643dcb1ed07`.
- Public Preview route smoke requests returned HTTP 403 from the execution environment across all tested routes. Deployment control-plane success is verified; public HTTP delivery and visual interaction are not yet independently verified.

## 9. Business-flow implementation pass (2026-11-07)

### Product catalog → configuration → RFQ
- Product selection reads only published catalog records. RFQ controls remain disabled unless the product has a published finish and a complete matching SKU with finish ID, PCD, center bore, lug count, diameter, width and offset.
- Removed default customer destination assumptions. Country, city and street address must be explicitly supplied; buyer legal/company name, contact, valid email and whole-number quantity (1–5,000 sets) are required before submission.
- RFQ creation now POSTs a `configured` record to `wheel_enquiries` using the public publishable key and existing anonymous INSERT-only policy. The stored configuration includes product/SKU, finish, buyer, shipping mode, Incoterm named place, estimated route window and explicit quotation-only status.
- The printable Quotation Request and email draft are revealed only after the database insert succeeds. The email draft opens without a pre-filled recipient, avoiding the previous behavior of addressing the draft to the buyer's own email.
- Duplicate product RFQ creation is locked after successful save. Database validation limits are mirrored in the form (company name 120 chars; email 254 chars).
- Supabase schema and RLS were inspected. A temporary `configured` insert under the `anon` role succeeded and was rolled back; no test row was retained.

### Transport / Incoterms
- Customer transport modes remain limited to Sea freight and Air freight.
- Sea-only Incoterms FAS, FOB, CFR and CIF are hidden for Air freight. Switching to Air freight while one of those is selected changes the selection to FCA.
- Named place now follows the selected rule: EXW supplier premises (exact premises pending); FCA cargo handover terminal (exact terminal pending); FAS/FOB/CFR/CIF Yantian Port; CPT/CIP destination port or airport to be confirmed; DAP/DPU/DDP customer delivery address.
- The exact cargo terminal, airport and destination routing remain forwarder-confirmation items; the UI does not invent a carrier booking or exact terminal.

### Custom Builder / enquiries
- Custom Builder configured requests now persist explicit `engineering_review_required`, `fitment_verified:false`, `production_specification_approved:false` and `pending_engineering_review` status.
- Successful Custom Builder submission buttons stay locked to prevent accidental duplicate requests.
- Manual region entry now enables the city selector's manual-city path.
- Contact and dealer forms retain their existing INSERT-only submission path; no automatic email notification or staff inbox is configured.

### Remaining release blockers
- Product catalog still has no real published product/SKU records, so live product RFQ creation remains intentionally unavailable until approved data is entered.
- Vehicle fitment and brake-clearance verification are not inferred from customer-entered targets; the Custom Builder remains an engineering enquiry.
- The public Preview endpoint has returned HTTP 403 from the available execution environment. Worker deployment status can be verified, but end-to-end browser delivery, keyboard/screen-reader operation and responsive visual acceptance remain outstanding.
- Real browser tests are still required at 1440px, 1024px, 768px and 390px before production release.

## 10. Shared shell and catalog rendering verification (2026-11-07)

- Injected the shared Design System stylesheet after page-local styles in all 10 HTML page templates (Fitment, Wheels catalog/detail, Product Configurator, About, Engineering, Gallery, Dealers, Contact, FAQ and Custom Builder); the root shell also includes it.
- Added a final shared semantic control layer for primary/secondary buttons, filters, builder choices, selected states, dropdown options and swatches. Swatch fill colors remain product-color data; the selected ring is shared.
- Removed the remaining inline styles from the two conditional region/city input fields. The only remaining inline styles on button/input/select/textarea tags are the five Custom Builder color swatches, where the inline background is the actual color sample.
- Static parser checks pass for the Worker module wrapper and every inline JavaScript page script. The Configurator's external ES module import is retained and reviewed separately.
- Fixed a JavaScript syntax error in the Wheels product-detail renderer that prevented the selected product detail markup from being assembled.
- Static shell inventory confirms all 10 templates include the shared header, footer, global CSS, active-route script and interaction script.

## 11. Product configurator RFQ persistence and logistics consistency (2026-11-07)

- The Product Configurator's "Create Quotation Request" action now writes a `configured` enquiry row to Supabase `wheel_enquiries` before revealing the printable Quotation Request document.
- The RFQ payload records the product, requested finish, exact published SKU dimensions and fitment parameters, buyer legal/contact details, requested quantity, Incoterm and named place, transport mode, origin/destination, estimated delivery window and explicit pending-commercial-quotation values.
- Buyer company, contact, valid email, destination country, city, street address and whole-number set quantity (1–5,000) are required. Country/city are no longer prefilled with a fictional US / Los Angeles destination.
- Successful RFQs are locked against accidental repeat submission. Failed API writes retain the form and explicitly state that the request was not recorded.
- Supabase anon-role INSERT was verified in a transaction and rolled back; no test enquiry was retained. The browser uses only the publishable key and existing INSERT-only RLS policy, never a service-role key.
- Custom Builder configured enquiries now explicitly persist `engineering_review_required=true`, `fitment_verified=false`, `production_specification_approved=false` and `review_status=pending_engineering_review`. A successful submission button is locked to prevent accidental duplicate submissions.
- Incoterm selection is transport-aware: air freight hides sea-only FAS/FOB/CFR/CIF terms and falls back to FCA when necessary. Named-place text now follows the selected term, transport mode and customer delivery address. Manual region entry reloads matching city choices.
- Current Preview deployment: Worker version `b2abd235-d723-4b3b-8ce0-e5bbe1ffaf83`, deployment `eee85623-0c27-4be3-992c-f00ed7660196`, 100% traffic. Source commit deployed: `13e8d01fd71367fde56bbca721b4e96ad0d38404`.
- The Cloudflare control plane confirms the deployed version is serving 100% of Preview traffic. Public HTTP and full browser interaction remain unverified because the available execution environment returns HTTP 403 for Preview requests.
