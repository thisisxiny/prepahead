# PrepAhead — project context for Claude Code

Clickable prototype for a university group project (NTU, course CC0006, group T058 B10) on reducing canteen food waste with a pre-ordering system. It is shown at a Week 10 in-class Project Showcase. It is a **prototype with sample data**, not a production app.

## The argument the prototype must show
- NTU canteen stalls over-prepare because they guess demand before lunch. Existing apps (Cates, GrabFood self-pickup) skip queues but don't help stalls decide how much to cook.
- Pre-orders with a **hard cut-off** give stalls demand info before they cook. History/forecasting sets the baseline; pre-orders catch on-the-day spikes (complement forecasting, don't replace it — the professor raised this).
- Batch-cooked stalls (mixed veg rice, chicken rice) benefit most and need 2–4h notice. Made-to-order stalls (ban mian, western) benefit via ingredient and queue planning, 30 min–2h notice.
- No-shows handled with a small non-refundable fee, reminders, free cancel before cut-off, QR / 4-digit code collection, vouchers when a stall can't fulfil.

## Tech rules
- Plain HTML, CSS and vanilla JavaScript. **No frameworks, no build step, no npm, no backend.** Open `index.html` directly or with VS Code Live Server.
- Libraries only via CDN `<script>` tags already in `index.html` (Chart.js, qrcodejs).
- Scripts are classic `<script>` files sharing globals (not ES modules) so the page works from `file://`.
- All state goes through `Store` in `data.js` (localStorage). Don't add other storage.
- All figures are sample data. Keep the "sample data" labels visible; never present them as real NTU numbers.
- Style only with the CSS variables in `style.css` so light and dark mode both work.
- The team are students new to web dev (background: Python, Java, SQL). Keep code readable, commented, and simple over clever.

## Order format (must not change without updating both sides)
```js
{ id: "A1023", code: "4821", stall: "caipng",
  items: [{ id, name, qty, price }], slot: "12:30",
  status: "pending",  // pending | accepted | ready | collected | declined | cancelled | noshow | voucher
  placedAt: "09:12", mine: true }
```

## Rules live in `RULES` (data.js)
Cut-off times, lead time, slot spacing, no-show fee and grace period are placeholders the group may change. Always read them from `RULES`; never hard-code them in `student.js` or `vendor.js`.

## Prep forecast (vendor side)
`suggested = usual demand + max(0, today's pre-orders − usual pre-orders)`, rounded up to whole trays. See `prepForecast()` in `data.js`.

## Checking changes
- `node --check data.js student.js vendor.js` catches syntax errors.
- Then open `index.html` and click through: order on the student side → it appears on the stall side → Accept → Put on shelf → Check code → Collected. Drag Demo time past 10:00 to check cut-offs. Use "Reset demo" between tests.


## Solution details: 
Overview
Main objective: Reduce food waste from over-prep at NTU canteen stalls by giving vendors reliable demand information before they decide how much to cook. 
For vendors: Help stalls match the amount they need to prepare to actual demand, by combining historical sale trends with actual pre-orders received before cut-off time.
For students: Make pre-ordering early worthwhile through shorter queues, discounts, and a chosen collection time, so students need not care about waste for our solution to work

Solution Brief: Our solution is a waste-reduction extension to Cates. Part 1 should briefly explain Cates
Why: Since Cates already handles ordering, payment and collection, and is being used by many students and faculty members within NTU.
Pre-orders help signal d-day demand for vendors before they cook, with historical order trends increasing reliability in our system.
We also want to make sure that our solution does not lead to further wastage ie. from uncollected orders.
Design principles

Principle
P1. Demand info must reach stalls before they cook
Batch-cooked stalls such as mixed veg rice need 2–4 hours’ notice to adjust how much they cook, but most students only pre-order about 30 minutes ahead. We want to encourage earlier ordering so that stalls can obtain demand information before their main preparation begins
P2. Accurate and reliable system
Vendors estimate preparation portions based on experience. We want to make use of historical sales data to give vendors a more reliable baseline for what to prepare, and also use pre-orders to account for same-day changes in demand that history cannot predict alone
P3. Students shouldn’t need to care about waste to use it
Most students surveyed (Add final number here) are unsure whether pre-ordering would reduce waste, but were strongly incentivised by shorter queues and discounts. We want our system to appeal to the everyday benefits so students/staff will be willing to use it. 
P4. Little effort for vendors
Vendors may find new technology intimidating and already struggle to balance walk-in customers with app orders. We want to make the system as simplistic as possible so that the system complements their existing routine rather than increasing their workload.


P5. Don’t create new waste
Pre-ordering introduces a risk of uncollected orders. We want to prevent this through our design as much as possible so we do not cause waste by side effects.


User features
- Early bird window
- Recurring orders tied to timetables 
- Staggered collection slots
- QR collection

Vendor features
- Dashboard for preparation (forecasting)
- Daily sales and leftover logging
- Pre-order cap and sold out switch
- Easy accept/decline system
- Last-tray decision

Managing risk of uncollected orders
Prevent: reminders before slot, collection time chosen by student, free cancel before cutoff
Deter: small non-refundable fee
Recover: after grace period, uncollected orders resold at discount
Monitor: track no show rate per stall and adjust fees accordingly

Building consumer confidence
Get consumers to sign up/ make use of our system by appealing to their benefits: discounts,shorter queues and collection times
Waste reduction should be the side effect 
over time can also inform users the positive impact our platform does to reduce waste to further incentivise usage: ie. show under stall “pre-orders saved 40 portions this week!”
Pilot with some stalls first before expanding campus-wide


Forecasting 
AI/history sets baseline, preorder catch same day spikes
Same day pre-orders can't change ingredients bought, so recurring orders matter

Evaluation
Prepped vs sold
Kg wasted per day
No show rate
Uptake by users and vendors: how usable, easy is it 

Limitations
Uptake needs to be large enough to impact food preparation portions
Purchasing of food items (usually fresh produce) occur before stall opens ie. before preorders start coming in

See `README.md` for the showcase demo script.
