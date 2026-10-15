# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Who the prototype must convince:** the professor and graders, and classmates walking past, at the Week 10 in-class Project Showcase for NTU course CC0006 (group T058 B10). Both matter equally: it has to catch attention quickly, then hold up to close questioning about the mechanism.
- **Who it depicts:**
  - NTU students and staff ordering lunch at North Spine Canteen on their phones. They want to skip the queue and pick a collection time; most are not motivated by waste.
  - Canteen stall vendors on a tablet dashboard at the counter, busy with walk-ins at lunch. Two kinds: batch-cooked stalls (Mixed Veg Rice, Chicken Rice) that cook in bulk 2–4 hours ahead, and made-to-order stalls (Ban Mian, Western) that cook per order.

## Product Purpose

PrepAhead reduces food waste from over-preparation at NTU canteen stalls by giving vendors reliable demand information before they decide how much to cook. Success at the showcase means a viewer understands that mechanism in one walk-through and believes both students and vendors would actually use it.

## Positioning

A waste-reduction extension to Cates, the ordering app already used at NTU (concept, not affiliated). Cates and GrabFood self-pickup already let students skip queues, but they don't help stalls decide how much to cook. PrepAhead's difference: pre-orders with a hard cut-off reach the stall before cooking starts, history sets the baseline, and pre-orders catch same-day spikes. It complements forecasting rather than replacing it.

## Operating Context

- A team member drives the prototype on a laptop while visitors stand around and watch. The default "Both" view shows the student phone and the stall dashboard side by side, so an order placed on one side appears on the other.
- Demo controls in the top bar: a demo clock (08:00–14:00) to move past cut-offs and into lunch, a Both / Student / Stall view switch, and Reset demo between visitors. README.md holds the showcase demo script.
- The depicted vendor uses the dashboard mid-service with little time and low comfort with new technology. The depicted student orders in a few taps between classes.

## Capabilities and Constraints

- **Student side:** browse stalls, menu, staggered collection slots, early-bird discount before the cut-off, weekly recurring orders tied to a sample timetable, pay, QR code plus 4-digit collection code, My orders with free cancel before the cut-off, collection reminders, and last-minute deals for uncollected food.
- **Stall side:** prep forecast (suggested = usual demand + max(0, today's pre-orders − usual pre-orders), rounded up to whole trays), tomorrow's recurring portions for ingredient buying, pre-order limit and sold-out switch, accept / accept all / decline / put on shelf / check code / no-show / voucher, resell uncollected orders at a discount, no-show rate, last-tray decision, end-of-day leftover logging, and a prepared / sold / leftover chart.
- **Rules** (cut-offs, lead time, slot spacing, fees, grace period, discounts, thresholds) are placeholders the group may change. They live in `RULES` in data.js and are never hard-coded.
- **Tech:** plain HTML, CSS and vanilla JavaScript. No frameworks, build step, npm or backend. Must work when index.html is opened directly from `file://`, so scripts are classic scripts sharing globals, and libraries load only by CDN script tags (Chart.js, qrcodejs). All state goes through `Store` in data.js (localStorage). The order format is fixed across both sides.
- **Team:** students new to web development (Python, Java, SQL). Code must stay readable, commented and simple. Ownership: student.js is Person A's, vendor.js is Person B's, data.js / style.css / index.html are shared.

## Brand Commitments

- The product name **PrepAhead** is binding.
- PrepAhead is presented as a concept add-on to Cates and is not affiliated with it, so it never uses Cates' logo or styling.
- No existing logo, poster or slide style the UI must match.

## Evidence on Hand

- Every figure in the prototype is **sample data** (data.js) and must stay visibly labelled as such, never presented as real NTU numbers.
- The team ran a student survey; its final numbers are not in the project yet. Don't quote survey figures until the team supplies them.
- No real sales data, testimonials, vendor quotes or press exist. Don't invent any.

## Product Principles

1. **Demand info must reach stalls before they cook.** Earlier ordering (cut-offs, early bird, recurring orders) is the point, not a side feature.
2. **History plus pre-orders, not either alone.** Forecasting sets the baseline and pre-orders catch the day's spikes; show both and how they combine.
3. **Students shouldn't need to care about waste.** Lead with shorter queues, discounts and a chosen time; waste reduction is the bonus.
4. **Little effort for vendors.** One-tap actions, few decisions, fits the existing lunch routine.
5. **Don't create new waste.** Uncollected orders are prevented (reminders, chosen times, free cancel), deterred (small fee) and recovered (discounted resale).
