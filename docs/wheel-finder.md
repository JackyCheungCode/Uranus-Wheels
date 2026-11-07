# Wheel Finder — First Business Page

**Branch:** feature/wheel-finder  
**Page:** Customer Wheel Finder  
**Architecture:** Uranus UI → Cloudflare Worker API → ANKUSI REST API / ANKUSI MCP → Workers AI

## User journeys

### 1. Vehicle lookup
- Fetch vehicle makes from ANKUSI `/makes`.
- Fetch the ANKUSI dataset and cache it at the Worker edge for one hour.
- Filter the complete dataset by make to build model and year selectors.
- Submit make/model/year to ANKUSI `/fitment`.
- Render PCD, center bore, lug count, OE wheel size, and published flush/max references.

### 2. Natural-language AI
- Customer describes vehicle and intent in their own language.
- Cloudflare Workers AI model `@cf/google/gemma-4-26b-a4b-it` (thinking disabled for concise customer-facing responses) identifies make/model/year or asks a clarification.
- Model tool call invokes ANKUSI MCP `lookup_wheel_fitment`.
- The MCP result is cross-checked against ANKUSI REST `/fitment` to catch similar trims/body styles.
- If body style/chassis remains ambiguous, ask the customer to clarify instead of selecting a nearby variant.
- Workers AI produces a cautious recommendation grounded in the cross-checked record.

## Data and safety rules

- ANKUSI API is the source for structured vehicle selection.
- ANKUSI MCP is the source for AI-assisted lookups.
- No AI-invented PCD, center bore, OE size, offset or wheel width.
- Flush and maximum sizes are reference estimates, not fitment guarantees.
- Brake clearance, exact trim, regional specification, tires and suspension require confirmation.
- Display ANKUSI attribution and CC BY 4.0 license.

## Cloudflare

The preview Worker requires an AI binding named `AI`. No API key is embedded in browser code. The current Worker preview remains separate from production.
