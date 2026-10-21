/* ============================================================
   data.js
   Holds: app settings, the pre-ordering rules, stalls + menus,
   sample history, and the "Store" that both sides talk through.
   All numbers here are SAMPLE data for the prototype.
   ============================================================ */

const APP = {
  name: "PrepAhead",
  canteen: "North Spine Canteen",
};

/* ---- Pre-ordering rules (placeholders — change once the group decides) ---- */
const RULES = {
  batchCutoff: "10:00",       // batch-cooked stalls: lunch pre-orders close at this time (2–4h notice)
  madeToOrderLeadMins: 30,    // made-to-order stalls: order at least this many minutes before your slot
  slotStart: "11:30",         // first collection slot
  slotEnd: "13:30",           // last collection slot
  slotStepMins: 15,           // staggered slots spread the crowd
  noShowFee: 1.0,             // non-refundable fee if the order is not collected
  graceMins: 20,              // how long food is held after the slot before it counts as a no-show
  earlyBirdUntil: "10:00",    // pre-orders placed before this time get the early-bird discount
  earlyBirdDiscount: 0.1,     // early-bird discount (0.1 = 10% off)
  resaleDiscount: 0.5,        // uncollected orders are resold at this discount (0.5 = 50% off)
  lastTrayThreshold: 0.5,     // only cook another tray if we expect to be short by at least half a tray
};

/* ---- Stalls ----
   no:   stall number on the signboard (sample), zh: Chinese name on the signboard
   type: "batch" = cooked in bulk before lunch (benefits most)
         "made"  = cooked when ordered (benefits via ingredient + queue planning)
   cap:  max pre-order portions the stall accepts for lunch
   trayPortions: portions per cooking batch / tray
   history: average over the same weekday, last 4 weeks (sample)
            weeks = that weekday's demand in each of the last 4 weeks (averages to `demand`)
            noShowRate = share of pre-orders not collected (0.04 = 4%)
   week: last 5 weekdays, portions prepared vs sold (sample)
   savedThisWeek: portions not cooked this week thanks to pre-orders (sample, shown to students) */
const STALLS = [
  {
    id: "caipng", no: "01", name: "Mixed Veg Rice", zh: "杂菜饭", type: "batch", cap: 40, trayPortions: 15,
    history: { demand: 121, weeks: [118, 126, 131, 109], preorders: 20, noShowRate: 0.04 },
    week: { prepared: [150, 150, 165, 150, 150], sold: [118, 124, 131, 109, 122] },
    savedThisWeek: 40,
    items: [
      { id: "cp1", name: "1 meat + 2 veg", price: 4.0 },
      { id: "cp2", name: "2 meat + 1 veg", price: 4.8 },
      { id: "cp3", name: "3 veg (vegetarian)", price: 3.5 },
    ],
  },
  {
    id: "chickenrice", no: "02", name: "Chicken Rice", zh: "鸡饭", type: "batch", cap: 35, trayPortions: 12,
    history: { demand: 96, weeks: [92, 101, 99, 92], preorders: 15, noShowRate: 0.06 },
    week: { prepared: [120, 120, 132, 120, 120], sold: [92, 101, 99, 88, 97] },
    savedThisWeek: 28,
    items: [
      { id: "cr1", name: "Roasted chicken rice", price: 4.2 },
      { id: "cr2", name: "Steamed chicken rice", price: 4.2 },
      { id: "cr3", name: "Drumstick set", price: 5.5 },
    ],
  },
  {
    id: "banmian", no: "03", name: "Ban Mian", zh: "板面", type: "made", cap: 30, trayPortions: 10,
    history: { demand: 84, weeks: [80, 88, 86, 82], preorders: 10, noShowRate: 0.03 },
    week: { prepared: [95, 95, 100, 95, 95], sold: [80, 86, 90, 79, 85] },
    savedThisWeek: 15,
    items: [
      { id: "bm1", name: "Ban mian soup", price: 4.5 },
      { id: "bm2", name: "Dry ban mian", price: 4.5 },
      { id: "bm3", name: "Fish slice ban mian", price: 5.5 },
    ],
  },
  {
    id: "western", no: "04", name: "Western", zh: "西餐", type: "made", cap: 25, trayPortions: 10,
    history: { demand: 70, weeks: [66, 74, 72, 68], preorders: 8, noShowRate: 0.05 },
    week: { prepared: [80, 80, 85, 80, 80], sold: [66, 72, 74, 63, 71] },
    savedThisWeek: 12,
    items: [
      { id: "we1", name: "Chicken chop", price: 6.5 },
      { id: "we2", name: "Fish and chips", price: 6.8 },
      { id: "we3", name: "Aglio olio", price: 5.5 },
    ],
  },
];

const WEEK_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const DEMO_DAY = "Wed";       // the demo pretends today is Wednesday (so "tomorrow" is Thursday)

/* ---- When walk-in customers usually arrive (sample, same for every stall) ----
   Share of a day's walk-in demand in each 15-minute block, starting at that time.
   Adds up to 1. Used for the last-tray decision. */
const LUNCH_CURVE = { "11:30": 0.06, "11:45": 0.10, "12:00": 0.15, "12:15": 0.16, "12:30": 0.15, "12:45": 0.13, "13:00": 0.11, "13:15": 0.08, "13:30": 0.06 };
const CURVE_BLOCK_MINS = 15;

/* ---- Sample student timetable: when this student is free for lunch ----
   Used to suggest which days a recurring order should repeat on.
   null = no lunch break that day. */
const SAMPLE_TIMETABLE = {
  Mon: { from: "12:00", to: "13:30" },
  Tue: { from: "11:30", to: "12:30" },
  Wed: { from: "12:00", to: "13:00" },
  Thu: null,
  Fri: { from: "12:30", to: "13:30" },
};

/* ---- Order format (BOTH sides must use exactly this shape) ----
{
  id: "A1023",              // order number
  code: "4821",             // 4-digit collection code (also inside the QR)
  stall: "caipng",          // STALLS[].id
  items: [{ id, name, qty, price }],
  slot: "12:30",            // collection time
  status: "pending",        // pending | accepted | ready | collected | declined | cancelled | noshow | voucher
  placedAt: "09:12",        // demo-clock time the order was placed
  mine: true,               // placed from this device's student view (sample orders are false)
}
*/
const SAMPLE_ORDERS = [
  { id: "A1001", code: "3170", stall: "caipng", items: [{ id: "cp1", name: "1 meat + 2 veg", qty: 2, price: 4.0 }], slot: "12:00", status: "accepted", placedAt: "08:15", mine: false },
  { id: "A1002", code: "5528", stall: "caipng", items: [{ id: "cp2", name: "2 meat + 1 veg", qty: 1, price: 4.8 }], slot: "12:15", status: "accepted", placedAt: "08:40", mine: false },
  { id: "A1003", code: "9041", stall: "caipng", items: [{ id: "cp1", name: "1 meat + 2 veg", qty: 10, price: 4.0 }], slot: "12:30", status: "accepted", placedAt: "08:52", mine: false },
  { id: "A1004", code: "2263", stall: "caipng", items: [{ id: "cp3", name: "3 veg (vegetarian)", qty: 3, price: 3.5 }], slot: "12:45", status: "pending", placedAt: "09:31", mine: false },
  { id: "A1005", code: "7712", stall: "chickenrice", items: [{ id: "cr1", name: "Roasted chicken rice", qty: 4, price: 4.2 }], slot: "12:00", status: "accepted", placedAt: "08:20", mine: false },
  { id: "A1006", code: "6604", stall: "chickenrice", items: [{ id: "cr3", name: "Drumstick set", qty: 2, price: 5.5 }], slot: "13:00", status: "pending", placedAt: "09:25", mine: false },
  { id: "A1007", code: "1185", stall: "banmian", items: [{ id: "bm1", name: "Ban mian soup", qty: 1, price: 4.5 }], slot: "12:30", status: "pending", placedAt: "09:35", mine: false },
];

/* ---- Recurring order format (a separate list; the order format above does not change) ----
{
  id: "R1",
  stall: "caipng",
  items: [{ id, name, qty, price }],
  slot: "12:30",
  days: ["Mon", "Wed"],     // weekdays it repeats on (from the student's timetable)
  mine: true,               // set up from this device's student view (sample ones are false)
}
Stalls see tomorrow's total early enough to buy ingredients. */
const SAMPLE_RECURRING = [
  { id: "R1", stall: "caipng", items: [{ id: "cp1", name: "1 meat + 2 veg", qty: 1, price: 4.0 }], slot: "12:00", days: ["Mon", "Wed", "Fri"], mine: false },
  { id: "R2", stall: "caipng", items: [{ id: "cp2", name: "2 meat + 1 veg", qty: 2, price: 4.8 }], slot: "12:30", days: ["Tue", "Thu"], mine: false },
  { id: "R3", stall: "caipng", items: [{ id: "cp3", name: "3 veg (vegetarian)", qty: 1, price: 3.5 }], slot: "12:15", days: ["Mon", "Tue", "Wed", "Thu", "Fri"], mine: false },
  { id: "R4", stall: "caipng", items: [{ id: "cp1", name: "1 meat + 2 veg", qty: 3, price: 4.0 }], slot: "13:00", days: ["Thu"], mine: false },
  { id: "R5", stall: "chickenrice", items: [{ id: "cr1", name: "Roasted chicken rice", qty: 2, price: 4.2 }], slot: "12:00", days: ["Tue", "Thu"], mine: false },
  { id: "R6", stall: "banmian", items: [{ id: "bm2", name: "Dry ban mian", qty: 1, price: 4.5 }], slot: "12:45", days: ["Mon", "Thu"], mine: false },
  { id: "R7", stall: "western", items: [{ id: "we1", name: "Chicken chop", qty: 1, price: 6.5 }], slot: "12:30", days: ["Wed", "Thu", "Fri"], mine: false },
];

/* ---- Last-minute deal format (an uncollected order resold at a discount) ----
{
  id: "D1",
  orderId: "A1003",         // the uncollected order; read its items from there
  stall: "caipng",
  price: 20.0,              // total resale price
  code: null,               // new collection code, given to whoever buys it
  sold: false,
  mine: false,              // bought from this device's student view
}
*/

/* ---- Helpers ---- */
const toMin = (t) => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };
const fromMin = (n) => `${String(Math.floor(n / 60)).padStart(2, "0")}:${String(n % 60).padStart(2, "0")}`;
const money = (n) => `$${n.toFixed(2)}`;
const stallById = (id) => STALLS.find((s) => s.id === id);
const orderTotal = (o) => o.items.reduce((sum, i) => sum + i.qty * i.price, 0);
const orderQty = (o) => o.items.reduce((sum, i) => sum + i.qty, 0);
const LIVE = ["pending", "accepted", "ready", "collected"];

// Small line icons shared by both sides (24px grid, 2px stroke, colour follows the text).
const ICON = {
  minus: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/></svg>',
  plus: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  back: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>',
};

/* ---- Look helpers shared by both sides (see style.css) ---- */
// Each stall is a stop on the canteen's line: North Spine stall 01 = "NS01" (sample codes).
const stallCode = (stall) => "NS" + stall.no;

// Black flip tiles for the ONE number that matters on a screen (the cut-off, trays to cook,
// your collection time). One tile per character; ":" stays a plain colon.
// The tiles are hidden from screen readers, which read the plain text instead.
function flipTiles(text, cls = "") {
  const tiles = [...String(text)].map((ch) => (ch === ":" ? '<span class="tile-sep">:</span>' : `<span class="tile">${ch}</span>`)).join("");
  return `<span class="tiles ${cls}" aria-hidden="true">${tiles}</span><span class="sr">${text}</span>`;
}

// An order's journey as a line of four stops. Every step reached is filled green (solid line);
// the current step is drawn a little bigger; steps still to come are grey rings on a dashed line. Orders that left the line (declined, cancelled, no-show,
// voucher) get no line; their status word says what happened.
const STAGE_OF = { pending: 0, accepted: 1, ready: 2, collected: 3 };
function progressLine(o, names, showNames = false) {
  const at = STAGE_OF[o.status];
  if (at == null) return "";
  const stops = names.map((n, i) => {
    const cls = i < at ? "done" : i === at ? "here" : "";
    return `<li class="${cls}">${showNames ? `<span class="stop-name">${n}</span>` : `<span class="sr">${n}</span>`}</li>`;
  }).join("");
  return `<ol class="progress ${o.status === "pending" ? "is-new" : ""} ${showNames ? "has-names" : ""}" aria-label="Progress: ${names[at]}">${stops}</ol>`;
}

function allSlots() {
  const out = [];
  for (let t = toMin(RULES.slotStart); t <= toMin(RULES.slotEnd); t += RULES.slotStepMins) out.push(fromMin(t));
  return out;
}

/* ---- Store: the one place orders and settings live ----
   Saved in the browser's localStorage, so a student tab and a
   vendor tab on the same computer stay in sync. */
const Store = (() => {
  const KEY = "prepahead.v1";
  const listeners = [];
  const copy = (x) => JSON.parse(JSON.stringify(x));
  const seed = () => ({
    demoTime: "09:40",
    caps: {},
    soldOut: {},
    orders: copy(SAMPLE_ORDERS),
    recurring: copy(SAMPLE_RECURRING), // recurring orders (see format above)
    deals: [],                         // last-minute deals (see format above)
    leftovers: {},                     // { stallId: portions left over at the end of today }, logged by the stall
    portionsLeft: {},                  // { stallId: portions still on the counter now }, for the last-tray decision
    traysCooked: {},                   // { stallId: trays (or batches) actually cooked so far today }, tapped in by the stall
  });
  const read = () => {
    try { const raw = localStorage.getItem(KEY); return raw ? JSON.parse(raw) : null; } catch (e) { return null; }
  };
  const write = () => {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* storage blocked: still works in memory */ }
  };
  // Data saved by an older version may be missing newer fields,
  // so start from a fresh seed and put the saved data on top.
  const load = () => ({ ...seed(), ...(read() || {}) });
  let state = load();
  const emit = () => listeners.forEach((fn) => fn(state));
  window.addEventListener("storage", (e) => { if (e.key === KEY) { state = load(); emit(); } });
  return {
    get: () => state,
    update(fn) { fn(state); write(); emit(); },
    subscribe(fn) { listeners.push(fn); },
    reset() { state = seed(); write(); emit(); },
  };
})();

/* ---- Shared rule checks (used by both sides) ---- */
function capFor(stall) {
  const s = Store.get();
  return s.caps[stall.id] ?? stall.cap;
}
function preorderedPortions(stallId) {
  return Store.get().orders.filter((o) => o.stall === stallId && LIVE.includes(o.status)).reduce((n, o) => n + orderQty(o), 0);
}
function isPastCutoff(stall, slot) {
  const now = toMin(Store.get().demoTime);
  if (stall.type === "batch") return now >= toMin(RULES.batchCutoff);
  return toMin(slot) - now < RULES.madeToOrderLeadMins;
}
function canOrder(stall, slot, qty = 1) {
  const s = Store.get();
  if (s.soldOut[stall.id]) return { ok: false, reason: "Sold out for pre-orders today" };
  if (preorderedPortions(stall.id) + qty > capFor(stall)) return { ok: false, reason: "Pre-order limit reached" };
  if (slot && isPastCutoff(stall, slot)) {
    return { ok: false, reason: stall.type === "batch" ? `Lunch pre-orders closed at ${RULES.batchCutoff}` : `Order at least ${RULES.madeToOrderLeadMins} min before collection` };
  }
  return { ok: true };
}
function newOrderId() {
  const n = Store.get().orders.length + 1001;
  return "A" + n;
}
const newCode = () => String(Math.floor(1000 + Math.random() * 9000));

/* ---- The prep forecast (vendor dashboard) ----
   Usual demand comes from history; pre-orders above the usual
   pre-order level are treated as an on-the-day spike. */
// Pre-orders the forecast counts. For a batch stall the number is final once pre-orders close,
// so after the cut-off it counts every order placed before it, even ones that later became a
// no-show or a voucher (that food was still cooked). Before the cut-off it follows live orders.
function forecastPortions(stall) {
  const s = Store.get();
  const closed = stall.type === "batch" && toMin(s.demoTime) >= toMin(RULES.batchCutoff);
  if (!closed) return preorderedPortions(stall.id);
  return s.orders
    .filter((o) => o.stall === stall.id && toMin(o.placedAt) < toMin(RULES.batchCutoff) && o.status !== "cancelled" && o.status !== "declined")
    .reduce((n, o) => n + orderQty(o), 0);
}
// How much demand usually varies: the spread (standard deviation) of the last 4 same-weekday
// demands. The forecast shows "likely" as the forecast ± this spread, rounded to whole portions.
function demandSpread(stall) {
  const w = stall.history.weeks;
  const mean = w.reduce((a, b) => a + b, 0) / w.length;
  return Math.round(Math.sqrt(w.reduce((n, x) => n + (x - mean) ** 2, 0) / w.length));
}
function prepForecast(stall) {
  const pre = forecastPortions(stall);
  const spike = Math.max(0, pre - stall.history.preorders);
  const suggested = stall.history.demand + spike;
  const trays = Math.ceil(suggested / stall.trayPortions);
  const usualPrep = Math.round(stall.week.prepared.reduce((a, b) => a + b, 0) / stall.week.prepared.length);
  return { pre, spike, suggested, trays, cooked: trays * stall.trayPortions, usualPrep, saved: Math.max(0, usualPrep - trays * stall.trayPortions) };
}

/* ---- Early bird (P1 + P3: reward ordering before stalls start cooking) ---- */
function isEarlyBird() {
  return toMin(Store.get().demoTime) < toMin(RULES.earlyBirdUntil);
}
// What a student pays for one item right now, rounded to cents.
// Save this as items[].price when placing an order, so the order format stays the same.
function priceNow(item) {
  const p = isEarlyBird() ? item.price * (1 - RULES.earlyBirdDiscount) : item.price;
  return Math.round(p * 100) / 100;
}

/* ---- Recurring orders tied to the timetable ---- */
function nextWeekday(day) {
  const i = WEEK_LABELS.indexOf(day);
  return WEEK_LABELS[(i + 1) % WEEK_LABELS.length]; // Fri → Mon
}
// Weekdays this student is free to collect at this slot, from their timetable.
function timetableDaysFor(slot) {
  return WEEK_LABELS.filter((d) => {
    const free = SAMPLE_TIMETABLE[d];
    return free && toMin(free.from) <= toMin(slot) && toMin(slot) < toMin(free.to);
  });
}
// Portions promised by recurring orders on a given weekday. Same-day pre-orders
// come too late to change what ingredients are bought; this number does not.
function standingPortions(stallId, day) {
  return Store.get().recurring.filter((r) => r.stall === stallId && r.days.includes(day)).reduce((n, r) => n + orderQty(r), 0);
}
function newRecurringId() {
  const nums = Store.get().recurring.map((r) => Number(r.id.slice(1)));
  return "R" + (Math.max(0, ...nums) + 1);
}

/* ---- Uncollected orders: resell at a discount (P5: don't create new waste) ---- */
// Overdue = still not collected after the slot plus the grace period.
function isOverdue(o) {
  const now = toMin(Store.get().demoTime);
  return (o.status === "accepted" || o.status === "ready") && now > toMin(o.slot) + RULES.graceMins;
}
const resalePrice = (o) => Math.round(orderTotal(o) * (1 - RULES.resaleDiscount) * 100) / 100;
const dealOrder = (d) => Store.get().orders.find((o) => o.id === d.orderId);
// Stall side: mark the order as a no-show and list it as a last-minute deal, in one step.
function resellOrder(orderId) {
  Store.update((s) => {
    const o = s.orders.find((x) => x.id === orderId);
    if (!o || s.deals.some((d) => d.orderId === orderId)) return; // already listed
    o.status = "noshow";
    s.deals.push({ id: "D" + (s.deals.length + 1), orderId: o.id, stall: o.stall, price: resalePrice(o), code: null, sold: false, mine: false });
  });
}
// Student side: buy a deal and get a fresh collection code.
function buyDeal(dealId) {
  Store.update((s) => {
    const d = s.deals.find((x) => x.id === dealId);
    if (!d || d.sold) return;
    d.sold = true;
    d.code = newCode();
    d.mine = true;
  });
}

/* ---- Leftover logging (end of day, one number per stall) ---- */
// Last week's leftovers per day = prepared − sold.
const weekLeftovers = (stall) => stall.week.prepared.map((p, i) => p - stall.week.sold[i]);
// Trays (or batches) the stall has tapped in as cooked today.
const traysCooked = (stallId) => Store.get().traysCooked[stallId] || 0;
// Today's numbers once the stall has logged leftovers. Prepared comes from the trays the stall
// tapped in as cooked; if it never used the tray counter, we assume it cooked the suggestion.
function todayLog(stall) {
  const leftover = Store.get().leftovers[stall.id];
  if (leftover == null) return null; // not logged yet
  const counted = traysCooked(stall.id) > 0;
  const prepared = counted ? traysCooked(stall.id) * stall.trayPortions : prepForecast(stall).cooked;
  return { prepared, leftover, sold: Math.max(0, prepared - leftover), counted };
}

/* ---- The lunch line (vendor): pre-ordered portions per collection slot ---- */
function portionsBySlot(stallId) {
  const by = {};
  Store.get().orders.filter((o) => o.stall === stallId && LIVE.includes(o.status)).forEach((o) => { by[o.slot] = (by[o.slot] || 0) + orderQty(o); });
  return by;
}

/* ---- Last-tray decision (late in lunch: cook one more tray or not?) ---- */
// Walk-ins usually still to come after `time`, from LUNCH_CURVE (counts part of the current block).
function usualWalkInsAfter(stall, time) {
  const now = toMin(time);
  let share = 0;
  for (const [start, part] of Object.entries(LUNCH_CURVE)) {
    const minsLeft = Math.min(CURVE_BLOCK_MINS, Math.max(0, toMin(start) + CURVE_BLOCK_MINS - now));
    share += part * (minsLeft / CURVE_BLOCK_MINS);
  }
  return Math.round((stall.history.demand - stall.history.preorders) * share);
}
// Compares food on the counter with what is still needed. Returns null until the stall enters portionsLeft.
function lastTrayAdvice(stall) {
  const s = Store.get();
  const left = s.portionsLeft[stall.id];
  if (left == null) return null;
  // "ready" orders are already packed on the shelf, so only pending + accepted still need counter food
  const toPack = s.orders.filter((o) => o.stall === stall.id && (o.status === "pending" || o.status === "accepted")).reduce((n, o) => n + orderQty(o), 0);
  const walkIns = usualWalkInsAfter(stall, s.demoTime);
  const short = Math.max(0, toPack + walkIns - left); // portions we expect to run short by
  return { left, toPack, walkIns, short, cook: short >= stall.trayPortions * RULES.lastTrayThreshold };
}
