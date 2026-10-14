# PrepAhead — pre-ordering prototype (T058 Group B10)

Clickable prototype for the Week 10 Project Showcase. A student pre-orders lunch; the stall sees the order and a data-backed "how much to cook" number.
**All numbers are sample data.**

## Run it
Open `index.html` in a browser (VS Code: right-click → *Open with Live Server*). No install, no backend.

## Who edits what
| File | Owner | What's in it |
|---|---|---|
| `student.js` | Person A | Student phone app: stalls → menu → collection slot → pay → QR → my orders |
| `vendor.js` | Person B | Stall dashboard: prep number, pre-order limit, sold-out switch, order list, chart |
| `data.js` | **Shared** | Rules, stalls, menus, sample history, order format, the Store |
| `style.css` | **Shared** | Colours, fonts, all styling |
| `index.html` | Shared | Page shell + top bar (demo clock, view switch, reset) |

Agree before changing a shared file. When asking an AI for help, paste this README and say "only edit `student.js`" (or `vendor.js`).

## How the two sides talk
Both sides read and write orders through `Store` in `data.js`, saved in the browser's localStorage.
- Same page: place an order on the left, it appears on the right instantly.
- Two tabs on the same computer also stay in sync.
- Phone → laptop does **not** sync (would need a backend like Firebase).

Order format (both sides must use exactly this):
```js
{ id: "A1023", code: "4821", stall: "caipng",
  items: [{ id, name, qty, price }], slot: "12:30",
  status: "pending",  // pending | accepted | ready | collected | declined | cancelled | noshow | voucher
  placedAt: "09:12", mine: true }
```

## Rules (placeholders in `RULES`, data.js — change once the group decides)
- Batch-cooked stalls (Mixed Veg Rice, Chicken Rice): lunch pre-orders close at **10:00** (2–4h notice).
- Made-to-order stalls (Ban Mian, Western): order **30 min** before your slot.
- Collection slots every **15 min**, 11:30–13:30 (staggered to spread the crowd).
- **$1.00 non-refundable fee** if not collected within **20 min** of the slot. Free cancel until cut-off.
- Stall can't make it → student gets a **voucher** for another day.
- Collection: student shows QR / 4-digit code; stall checks the code.

## The prep forecast (vendor side)
```
suggested = usual demand (same weekday, last 4 weeks)
          + max(0, pre-orders today − usual pre-orders)   ← on-the-day spike
trays     = ceil(suggested / portions per tray)
saved     = usual prep − trays × portions per tray
```
History sets the baseline; pre-orders catch spikes (Prof's point: complement forecasting, don't replace it).
Rounding to whole trays shows member 2's point: small changes in demand may not change the batch size.

## Demo script for the showcase
1. Demo time 09:40. Student orders 10 × Mixed Veg Rice → suggested portions rise, but it's still 9 trays (a small spike doesn't change the batch). Order 10 more → it becomes 10 trays.
2. Stall: Accept → Put on shelf → Check code (type the student's code) → Collected.
3. Drag Demo time past 10:00 → batch stalls close, the prep number locks.
4. Toggle **Stop pre-orders** → students see Sold out.
5. **Reset demo** before the next visitor.

## Ideas for next steps
- Person A: group orders, reminder notification styling, cancellation flow polish.
- Person B: log leftovers each day, dinner forecast, per-dish breakdown.
