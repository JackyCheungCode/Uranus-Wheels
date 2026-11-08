# Uranus Wheels — Bimmerz UI / Svelte migration

## Decision
Replace the legacy Worker-rendered HTML/CSS presentation with a Svelte 5 + Vite frontend. Remove Carbon/IBM Carbon components, styles, naming, layout patterns, and dependencies from the new frontend. Do not carry Carbon tabs, Carbon dropdowns, Carbon tokens, or Carbon component wrappers forward.

## Correct use of `@emdzej/bimmerz-ui`
The package is a small shared brand/lifecycle package, not a general-purpose component library. Its current public exports are `Brand`, `MStripe`, and `useEmbeddedAutoConnect`. The storefront uses `Brand` and `MStripe` for brand expression. Build Uranus Wheels-specific accessible Svelte components for navigation, buttons, fields, selects, dialogs, cards, and fitment workflow. Do not pretend these components are supplied by bimmerz-ui.

## Frontend stack
- Svelte 5 + Vite + TypeScript.
- `@emdzej/bimmerz-ui` source-only package compiled by Vite; include it in `optimizeDeps`.
- Local CSS design tokens and components; no Carbon dependency and no mandatory Tailwind/theme dependency.
- API calls retain the existing same-origin `/api/*` contract. Vite proxies `/api` to the current Worker during local development.

## Migration safety
- Existing Cloudflare Worker remains the production backend until the new app passes parity checks.
- Preserve NHTSA VIN decode, BMW canonicalization, ANKUSI model/year lookup, fitment endpoints, staff/admin access, and existing product data.
- BMW is the only vehicle make shown in the primary fitment selector. VIN and manual BMW MMY paths converge on the same fitment review state.
- Never deploy the new SPA over production until the routes and API parity tests pass.

## Phases
1. Svelte app scaffold and Bimmerz brand primitives.
2. App shell, responsive navigation, footer, and custom accessible controls.
3. BMW Fitment Finder migration, including VIN + MMY flows and regression tests.
4. Home, wheel collection, product detail, and engineering pages.
5. Cloudflare preview deployment, mobile/desktop browser QA, then explicit production rollout.

## Current state
The initial Vite/Svelte scaffold and a first editorial homepage shell are committed on `ui/bimmerz-svelte-rebuild`. This is a development scaffold, not a production-ready replacement. The legacy Worker remains untouched.
