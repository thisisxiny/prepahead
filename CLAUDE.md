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

## File ownership (two people vibe-coding in parallel)
| File | Owner |
|---|---|
| `student.js` | Person A — student phone app |
| `vendor.js` | Person B — stall dashboard |
| `data.js`, `style.css`, `index.html` | Shared — change only when asked, and keep both sides working |

When asked to work on one side, **only edit that side's file** unless the user explicitly asks to change a shared file. If a shared change is needed, say so and explain why before making it.

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

See `README.md` for the showcase demo script.
