# Uranus Wheels — Design System Foundation

**Status:** Phase 0 / initial implementation  
**Direction:** Carbon Foundation × Premium Automotive  
**Scope:** Design tokens, responsive AppShell, core component conventions. This is not the production storefront.

## Design principles

1. Use background layers to establish hierarchy; use borders only where they clarify a relationship.
2. Product imagery and material details should lead brand-facing pages.
3. Use Carbon's grid, spacing discipline, typography clarity, accessibility and interaction patterns.
4. Apply Uranus brand tokens rather than treating Carbon's default theme as the brand identity.
5. Keep the storefront editorial and premium; reserve denser Carbon patterns for Fitment, Custom Studio and Admin.
6. Never rely on browser-default select styling for key product or vehicle workflows.
7. Respect reduced-motion preferences and provide visible keyboard focus.

## Initial tokens

| Token | Value | Role |
|---|---|---|
| Carbon Black | #101214 | Primary dark surface |
| Graphite | #252A2E | Secondary dark surface |
| Titanium | #8F989E | Metallic neutral |
| Cool Silver | #D9DDDF | Secondary neutral |
| Cool White | #F2F3F2 | Main canvas |
| Champagne | #B99A68 | Restrained premium accent |
| Base spacing | 4px | Spacing scale |
| Content max width | 1280px | Desktop layout |
| Grid | 12 columns | Responsive page layout |
| Typeface | IBM Plex Sans | Primary typography |

## Initial AppShell

- Dark brand header with wordmark and compact navigation.
- Mobile navigation collapses into an accessible menu control.
- Shared content width and responsive gutters.
- Footer reserved for brand/legal/navigation content.
- Preview-only foundation route; business pages are intentionally not implemented yet.

## Component rules

- Buttons: primary, secondary and quiet hierarchy.
- Fields: explicit labels, visible focus ring, accessible contrast.
- Selectors: custom visual treatment, keyboard-native semantics.
- Surfaces: use tonal background contrast before adding borders.
- Navigation: clear active state; no tab bar as a substitute for primary navigation.

## Responsive breakpoints

- Desktop: above 900px.
- Tablet: 681–900px.
- Mobile: 680px and below.

These are initial implementation breakpoints and may be refined after device testing.

## Acceptance checklist

- [ ] Header and footer remain consistent across page templates.
- [ ] Layout works at desktop, tablet and mobile widths.
- [ ] Mobile navigation is keyboard-operable and announces expanded state.
- [ ] Reduced-motion preference is respected.
- [ ] Text and controls have visible focus states.
- [ ] No browser-default select appearance in key UI.
- [ ] Background hierarchy is clear without excessive borders.
- [ ] No business page is added before the foundation is accepted.
