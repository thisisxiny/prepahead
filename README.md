# PrepAhead — pre-ordering prototype (T058 Group B10)

Clickable prototype for the Week 10 Project Showcase. A student pre-orders lunch; the stall sees the order and a data-backed "how much to cook" number.
**All numbers are sample data.**

## Run it
Open `index.html` in a browser (VS Code: right-click → *Open with Live Server*). No install, no backend.

## Files
| File | What's in it |
|---|---|
| `student.js` | Student phone app: stalls → menu → collection slot → pay → QR → my orders |
| `vendor.js` | Stall tablet: trays to cook + tray counter, then tabs: Orders (lunch line, pre-orders, deals), Plan (forecast, tomorrow's shopping), Stock (limit, sold-out switch, last tray), End of day (leftovers, chart) |
| `data.js` | Rules, stalls, menus, sample history, order format, the Store |
| `style.css` | Colours, fonts, all styling |
| `index.html` | Page shell + top bar (demo clock, view switch, reset) |

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
Rounding to whole trays shows that small changes in demand may not change the batch size.

## Demo script for the showcase
Same order as the demo video (`demo/prepahead-demo.mp4`, kept out of git). Press **Reset demo** first; the clock starts at 09:40.

**Part 1: one order, student to stall** (top bar: **Both**, phone and tablet side by side)
1. **Skip the lunch queue.** Point at "Batch stalls close 10:00" and the early-bird line.
2. **A group pre-orders 20 portions.** Tap Mixed Veg Rice (NS01), add 20 × "1 meat + 2 veg".
3. **Choose a collection time.** Pick 12:30; tick "Make this my weekly lunch" (days come from the timetable).
4. **Pay, with a fair no-show rule.** Tick the $1 fee line, then Pay.
5. **The collection ticket.** Collection time, QR, 4-digit code, progress line.
6. **The stall knows before it cooks.** On the tablet the trays flip 09 → 10 and the 12:30 stop on the lunch line grows.
7. **Accept and pack.** Accept, then Put on shelf: the phone's progress line turns green at the same time.
8. **Collect with the code.** Drag the clock to 12:30. The student shows the code; on the tablet tap Check code, type it, Confirm.

**Part 2: the stall's side** (top bar: **Stall**, full-width tablet)

9. **The number is final.** After the 10:00 cut-off it says "Final, locked at 10:00".
10. **History + pre-orders = the number.** Tap "How is 10 worked out?" (Plan tab): expected demand with a likely range, then the waterfall: weekday history 121, pre-orders vs usual +16 (the group order), round up to trays, cook 150.
11. **Tomorrow's morning shopping.** Ingredients are bought before pre-orders arrive, so tomorrow uses history and weekly orders.
12. **Count trays as they're cooked.** Tap "+1 tray cooked" up to 10.
13. **No-shows don't become waste.** Orders tab, drag the clock to 12:45, tap "Resell at 50% off" on the uncollected order.
14. **Stock.** Pre-order limit and Stop pre-orders; in Last tray, count 45 left: "don't cook another tray".
15. **End of day.** Drag to 13:55, End of day tab, log 12 leftovers: today's bars appear next to last week's.

**Short version for visitors passing by (45 s):** steps 2, 6 and 10: a student pre-orders, the trays flip, and the waterfall shows why.

## Ideas for next steps
- Student side: group orders, reminder notification styling, cancellation flow polish.
- Stall side: log leftovers each day, dinner forecast, per-dish breakdown.
