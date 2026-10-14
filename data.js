/* ============================================================
   data.js  —  SHARED FILE (both people read it; change carefully)
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
};

/* ---- Stalls ----
   type: "batch" = cooked in bulk before lunch (benefits most)
         "made"  = cooked when ordered (benefits via ingredient + queue planning)
   cap:  max pre-order portions the stall accepts for lunch
   trayPortions: portions per cooking batch / tray
   history: average over the same weekday, last 4 weeks (sample)
   week: last 5 weekdays, portions prepared vs sold (sample) */
const STALLS = [
  {
    id: "caipng", name: "Mixed Veg Rice", type: "batch", cap: 40, trayPortions: 15,
    history: { demand: 121, preorders: 20 },
    week: { prepared: [150, 150, 165, 150, 150], sold: [118, 124, 131, 109, 122] },
    items: [
      { id: "cp1", name: "1 meat + 2 veg", price: 4.0 },
      { id: "cp2", name: "2 meat + 1 veg", price: 4.8 },
      { id: "cp3", name: "3 veg (vegetarian)", price: 3.5 },
    ],
  },
  {
    id: "chickenrice", name: "Chicken Rice", type: "batch", cap: 35, trayPortions: 12,
    history: { demand: 96, preorders: 15 },
    week: { prepared: [120, 120, 132, 120, 120], sold: [92, 101, 99, 88, 97] },
    items: [
      { id: "cr1", name: "Roasted chicken rice", price: 4.2 },
      { id: "cr2", name: "Steamed chicken rice", price: 4.2 },
      { id: "cr3", name: "Drumstick set", price: 5.5 },
    ],
  },
  {
    id: "banmian", name: "Ban Mian", type: "made", cap: 30, trayPortions: 10,
    history: { demand: 84, preorders: 10 },
    week: { prepared: [95, 95, 100, 95, 95], sold: [80, 86, 90, 79, 85] },
    items: [
      { id: "bm1", name: "Ban mian soup", price: 4.5 },
      { id: "bm2", name: "Dry ban mian", price: 4.5 },
      { id: "bm3", name: "Fish slice ban mian", price: 5.5 },
    ],
  },
  {
    id: "western", name: "Western", type: "made", cap: 25, trayPortions: 10,
    history: { demand: 70, preorders: 8 },
    week: { prepared: [80, 80, 85, 80, 80], sold: [66, 72, 74, 63, 71] },
    items: [
      { id: "we1", name: "Chicken chop", price: 6.5 },
      { id: "we2", name: "Fish and chips", price: 6.8 },
      { id: "we3", name: "Aglio olio", price: 5.5 },
    ],
  },
];

const WEEK_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri"];

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

/* ---- Helpers ---- */
const toMin = (t) => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };
const fromMin = (n) => `${String(Math.floor(n / 60)).padStart(2, "0")}:${String(n % 60).padStart(2, "0")}`;
const money = (n) => `$${n.toFixed(2)}`;
const stallById = (id) => STALLS.find((s) => s.id === id);
const orderTotal = (o) => o.items.reduce((sum, i) => sum + i.qty * i.price, 0);
const orderQty = (o) => o.items.reduce((sum, i) => sum + i.qty, 0);
const LIVE = ["pending", "accepted", "ready", "collected"];

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
  const seed = () => ({
    demoTime: "09:40",
    caps: {},
    soldOut: {},
    orders: SAMPLE_ORDERS.map((o) => JSON.parse(JSON.stringify(o))),
  });
  const read = () => {
    try { const raw = localStorage.getItem(KEY); return raw ? JSON.parse(raw) : null; } catch (e) { return null; }
  };
  const write = () => {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* storage blocked: still works in memory */ }
  };
  let state = read() || seed();
  const emit = () => listeners.forEach((fn) => fn(state));
  window.addEventListener("storage", (e) => { if (e.key === KEY) { state = read() || seed(); emit(); } });
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
function prepForecast(stall) {
  const pre = preorderedPortions(stall.id);
  const spike = Math.max(0, pre - stall.history.preorders);
  const suggested = stall.history.demand + spike;
  const trays = Math.ceil(suggested / stall.trayPortions);
  const usualPrep = Math.round(stall.week.prepared.reduce((a, b) => a + b, 0) / stall.week.prepared.length);
  return { pre, spike, suggested, trays, cooked: trays * stall.trayPortions, usualPrep, saved: Math.max(0, usualPrep - trays * stall.trayPortions) };
}
