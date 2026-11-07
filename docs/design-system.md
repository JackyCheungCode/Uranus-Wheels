# Uranus Wheels — Design System

**Status:** Phase 1 — shared foundation implementation in progress  
**Direction:** Carbon Foundation × Premium Automotive  
**Scope:** Global design tokens, AppShell, button hierarchy, form controls and accessible select behavior.

## Design principles

1. Use background layers to establish hierarchy; use borders only where they clarify a relationship.
2. Product imagery and material details lead brand-facing pages.
3. Use Carbon's grid, spacing discipline, typography clarity, accessibility and interaction patterns.
4. Apply Uranus brand tokens rather than treating Carbon's default theme as the brand identity.
5. Keep the storefront editorial and premium; reserve denser Carbon patterns for Fitment, Custom Studio and Admin.
6. Key product and vehicle selectors must not rely on browser-default dropdown presentation.
7. Respect reduced-motion preferences and provide visible keyboard focus.
8. Shared components are the source of truth. Page-level exceptions require a documented reason.

## Color tokens

| Token | Value | Role |
|---|---|---|
| `--uw-carbon-black` | `#101214` | Primary dark surface and primary action |
| `--uw-graphite` | `#252A2E` | Secondary dark surface |
| `--uw-titanium` | `#8F989E` | Metallic neutral |
| `--uw-silver` | `#D9DDDF` | Secondary neutral |
| `--uw-cool-white` | `#F2F3F2` | Main canvas |
| `--uw-champagne` | `#B99A68` | Restrained brand accent |
| `--uw-interactive` | `#0F62FE` | Keyboard focus and interactive state |
| `--uw-success` | `#198038` | Success state |
| `--uw-warning` | `#B28600` | Warning state |
| `--uw-danger` | `#DA1E28` | Error / destructive state |

### Semantic surface and text tokens

- `--uw-layer-0`: page canvas.
- `--uw-layer-1`: primary content surface.
- `--uw-layer-2`: secondary / grouped surface.
- `--uw-layer-inverse`: dark inverse surface.
- `--uw-text`, `--uw-text-secondary`, `--uw-text-muted`: text hierarchy.
- `--uw-border-subtle`, `--uw-border-strong`: restrained structural borders.

Champagne is a brand accent, not a second competing primary action color. Carbon Black is the default primary action color. Interactive blue is reserved for focus and interaction feedback, not general brand decoration.

## Layout and spacing

- Base spacing: 4px.
- Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64px.
- Content maximum width: 1280px.
- Grid: 12 columns on desktop; responsive collapse on smaller screens.
- Shared shell gutters: 32px desktop, 20px tablet, 16px mobile.
- Breakpoints: desktop above 900px; tablet 681–900px; mobile at 680px and below.
- Default control radius: 2px.
- Typeface: IBM Plex Sans.

## AppShell

- Shared dark brand header and footer.
- One responsive navigation behavior, with expanded state announced by `aria-expanded`.
- Active navigation supports nested product and configuration routes.
- Escape and outside click close the mobile menu.
- Header/footer content width uses the same 1280px token.
- Reduced-motion preferences are respected.
- Global focus-visible treatment uses the interactive focus token.

## Button hierarchy

| Variant | Rule |
|---|---|
| Primary | Carbon Black background, white text; one dominant action per region |
| Secondary | Transparent / neutral surface with a restrained border |
| Tertiary | Quiet text or icon action; no competing fill |
| Accent | Champagne may be used for small brand accents, not as a competing primary button |
| Danger | Semantic danger color, reserved for destructive actions |
| Disabled / loading | Reduced emphasis, no hover lift, state communicated clearly |

All buttons share 44px minimum height, 2px radius, IBM Plex Sans typography and consistent focus/disabled states.

## Select and form controls

- Selects use a shared custom listbox presentation while retaining the native select as the form value source.
- Select supports pointer and keyboard interaction: Arrow keys, Home, End, Enter/Space and Escape.
- Required select values are checked before form submission and focus is returned to the visible trigger.
- Labels remain explicit; errors must be visible and programmatically associated.
- Text inputs and textareas share consistent height, typography, focus and border treatment.
- Dynamic option lists must remain synchronized with the underlying select element.

## Acceptance checklist

- [x] Shared color, semantic surface, spacing, layout and focus tokens are defined in the global stylesheet.
- [x] Shared header/footer use the 1280px content width.
- [x] Nested route active-state mapping is implemented.
- [x] Mobile menu has accessible expanded state, Escape and outside-click close behavior.
- [x] Native select elements are progressively enhanced into a shared keyboard-operable custom selector.
- [x] Shared button and form-control baseline styles are applied after page styles.
- [ ] Remove remaining page-specific color overrides and legacy component exceptions.
- [ ] Confirm every page uses the same primary / secondary / tertiary button mapping.
- [ ] Browser-test select keyboard behavior, required validation, dynamic options and form reset.
- [ ] Test header, footer and controls at desktop, tablet and mobile widths.
- [ ] Verify contrast, focus visibility and reduced-motion behavior on all templates.
- [ ] Complete end-to-end business flow and responsive acceptance.

## Implementation note

This phase centralizes the foundation without yet rewriting the legacy custom-wheel business flow. Existing old Builder dimension and fitment options remain scheduled for the later business-logic consolidation phase; do not treat those options as engineering-approved production specifications.
