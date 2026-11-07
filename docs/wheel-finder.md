# Wheel Finder — First Business Page

**Branch:** feature/wheel-finder  
**Page:** Customer Wheel Finder  
**Architecture:** Uranus UI → Cloudflare Worker API → ANKUSI REST API / ANKUSI MCP → Workers AI

## User journeys

### 1. Vehicle lookup
- Load makes, models and years from the ANKUSI dataset and cache it at the Worker edge for one hour.
- Submit make/model/year to ANKUSI REST `/fitment`.
- Render PCD, center bore, lug count, OE wheel size, and published flush/max references.
- Load a reference vehicle image from Wikimedia Commons where a sufficiently close make/model title match is available.
- Ask the customer to confirm the displayed vehicle before revealing product concepts.

### 2. Natural-language AI
- Customer describes vehicle and intent in their own language.
- Cloudflare Workers AI model `@cf/google/gemma-4-26b-a4b-it` (thinking disabled for concise customer-facing responses) identifies make/model/year or asks a clarification.
- Model tool call invokes ANKUSI MCP `lookup_wheel_fitment`.
- MCP result is cross-checked against ANKUSI REST `/fitment`.
- If multiple body/chassis variants remain, return selectable variant cards instead of a generic error. The customer chooses the exact version and the AI lookup is repeated with that confirmation.
- Once one record is verified, render a fitment result card, load the vehicle reference image and ask for customer confirmation.

### 3. Simulated forged-wheel recommendations
- After the customer confirms the vehicle, show three illustrative Uranus wheel concepts (monoblock, split 5-spoke, multi-spoke).
- Product data includes concept code, finish, descriptive style, illustrative per-wheel price and a fitment basis derived from the vehicle's OE reference.
- Product artwork is CSS-rendered concept art, not a photograph of a production SKU.
- All products and prices are explicitly labelled simulated / indicative. They are not inventory, quotations or final fitment specifications.

## Data and safety rules

- ANKUSI API is the source for structured vehicle selection.
- ANKUSI MCP is the source for AI-assisted lookups.
- Wikimedia Commons is used for vehicle reference imagery when a make/model title match is found; the UI falls back to a clear no-image message when none is found.
- No AI-invented PCD, center bore, OE size, offset or wheel width.
- Flush and maximum sizes are reference estimates, not fitment guarantees.
- Brake clearance, exact trim, regional specification, tires and suspension require confirmation.
- Display ANKUSI attribution and CC BY 4.0 license; image attribution is shown with the reference image.

## Cloudflare

The isolated preview Worker requires an AI binding named `AI`. No API key is embedded in browser code. The preview Worker remains separate from production.
