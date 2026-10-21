/* ============================================================
   vendor.js
   The stall's side: today's prep number (and tomorrow's recurring
   orders), trays cooked so far, the lunch line, pre-order limit,
   incoming orders (accept / decline / ready / collected, resell
   uncollected ones), last-minute deals, the last-tray decision,
   end-of-day leftovers, and the prepared / sold / leftover chart.
   The black header names the stall; under it, today's number
   (trays to cook) sits in flip tiles.
   Draws into <div id="vendor-app"> in index.html.
   ============================================================ */

const Vendor = {
  stallId: "caipng", chart: null, verifyFor: null, verifyMsg: "",
  seen: null,       // orders already drawn once, so only brand-new ones get the arrival flash
  lastTrays: {},    // { stallId: trays } from the last draw, so the tiles flip when the number changes
  lastBySlot: {},   // { stallId: { slot: portions } } from the last draw, so a stop grows when an order lands
  tab: "orders",    // which tab is open under the trays number: orders | plan | stock | close
  lastNew: null,    // new-order count at the last draw, so the Orders tab can flash when one arrives
};

// The tabs under the trays number: one job each, so everything fits on one screen.
// Stock = decisions about food on hand: the pre-order limit, the sold-out switch, the last tray.
const TABS = [
  { id: "orders", label: "Orders" },
  { id: "plan", label: "Plan" },
  { id: "stock", label: "Stock" },
  { id: "close", label: "End of day" },
];

// The names of the four stops on an order's progress line (see progressLine in data.js).
const VENDOR_STAGES = ["Placed", "Accepted", "On shelf", "Collected"];

const vendorRoot = () => document.getElementById("vendor-app");
const pct = (x) => Math.round(x * 100); // 0.04 → 4 (rounded, so 0.3 never shows as 30.000000000000004)
const unitWord = (st) => (st.type === "batch" ? "tray" : "batch"); // what the stall cooks in
const itemsText = (o) => o.items.map((i) => `${i.qty} × ${i.name}`).join(", ");
const orderKey = (o) => `${o.id}:${o.code}`; // the code is random, so a reused id after Reset still counts as new

// A stepper for counting portions: −5, −1, the number, +1, +5 (fewer taps than ±1 only).
// `act` is the data-vact the buttons send. A null value shows "Not counted" (nothing entered yet).
function countStepper(act, value, labelId) {
  const btn = (d) => `<button aria-label="${d < 0 ? "Minus" : "Plus"} ${Math.abs(d)}" data-vact="${act}" data-d="${d}">${d < 0 ? "−" : "+"}${Math.abs(d)}</button>`;
  return `<div class="stepper" role="group" aria-labelledby="${labelId}">${btn(-5)}${btn(-1)}${value == null ? '<span class="is-empty">Not counted</span>' : `<span class="num">${value}</span>`}${btn(1)}${btn(5)}</div>`;
}

function vendorStatusPill(status) {
  const label = { pending: "New", accepted: "Accepted", ready: "On shelf", collected: "Collected", declined: "Declined", cancelled: "Cancelled by student", noshow: "No-show", voucher: "Voucher issued" }[status];
  return `<span class="pill pill-${status}">${label}</span>`;
}

// The black header: this stall's code tab, the stall picker as its name, Chinese name, stall type.
function stallHeader(st) {
  return `
  <header class="v-head">
    <span class="code-tab num">${stallCode(st)}</span>
    <div class="v-head-name">
      <label class="sr" for="stall-pick">Stall</label>
      <select id="stall-pick" data-vact="stall">
        ${STALLS.map((s) => `<option value="${s.id}" ${s.id === st.id ? "selected" : ""}>${s.name}</option>`).join("")}
      </select>
      <span class="zh" lang="zh-Hans">${st.zh}</span>
    </div>
    <span class="type-tag">${st.type === "batch" ? "Batch-cooked" : "Made to order"}</span>
  </header>`;
}

// Today's number in flip tiles, big enough to read over a shoulder, and the trays cooked so far.
function prepHero(st) {
  const f = prepForecast(st);
  const unit = unitWord(st);
  const locked = st.type === "batch" && toMin(Store.get().demoTime) >= toMin(RULES.batchCutoff);
  const when = locked ? `<span class="lock">Final</span> locked at ${RULES.batchCutoff}` : st.type === "batch" ? `updates until ${RULES.batchCutoff}` : "updates live";
  // Flip the tiles when the number changed since the last draw (e.g. a pre-order just pushed it up a tray)
  const changed = Vendor.lastTrays[st.id] != null && Vendor.lastTrays[st.id] !== f.trays;
  Vendor.lastTrays[st.id] = f.trays;
  // Trays cooked so far: one stop per tray to cook, filled as the stall taps them in.
  // Cooking more than suggested shows the extra stops in red.
  const cooked = traysCooked(st.id);
  const stops = Array.from({ length: Math.max(f.trays, cooked) }, (_, i) => `<li class="${i < cooked ? (i < f.trays ? "done" : "extra") : ""}"></li>`).join("");
  return `
  <div class="v-hero">
    ${flipTiles(String(f.trays).padStart(2, "0"), changed ? "is-flipping" : "")}
    <div class="v-hero-what">
      <h3>${st.type === "batch" ? "Trays to cook" : "Batches to prep"}</h3>
      <p class="num"><b>${f.cooked} portions</b> (${f.trays} × ${st.trayPortions}) · ${when}</p>
      <p class="num">${f.saved ? `${f.saved} fewer portions than the usual prep of ${f.usualPrep}` : `No fewer than the usual prep of ${f.usualPrep}`}</p>
      <p><button class="link-act" data-vact="tab" data-tab="plan">How is ${f.trays} worked out?</button></p>
    </div>
    <div class="cooked">
      <p class="cooked-label">Cooked so far</p>
      <p class="cooked-count num">${cooked} of ${f.trays}</p>
      <ol class="tray-stops" aria-label="${cooked} of ${f.trays} ${unit}s cooked">${stops}</ol>
      <div class="row-actions">
        ${cooked ? `<button class="link-act" data-vact="cooked" data-d="-1">Undo</button>` : ""}
        <button class="btn sm" data-vact="cooked" data-d="1">+1 ${unit} cooked</button>
      </div>
    </div>
  </div>`;
}

// The lunch line: one stop per collection slot, growing with the portions pre-ordered for it.
// A stop that just grew (an order landed) gets a short grow animation.
function lunchLine(st) {
  const by = portionsBySlot(st.id);
  const before = Vendor.lastBySlot[st.id];
  Vendor.lastBySlot[st.id] = by;
  const max = Math.max(1, ...Object.values(by));
  const now = toMin(Store.get().demoTime);
  const slots = allSlots();
  return `
  <section class="lunch" aria-label="Pre-ordered portions per collection slot">
    <h3>Lunch line: portions pre-ordered per slot</h3>
    <ol class="lunch-line" style="--n:${slots.length + (st.type === "batch" ? 1 : 0)}">
      ${st.type === "batch" ? `<li class="is-cutoff ${now >= toMin(RULES.batchCutoff) ? "is-past" : ""}"><span class="ring"></span><span class="t num">${now >= toMin(RULES.batchCutoff) ? "Closed" : "Close"} ${RULES.batchCutoff}</span></li>` : ""}
      ${slots.map((t) => {
        const n = by[t] || 0;
        const size = n ? 20 + Math.round(24 * (n / max)) : 12;
        const grew = before && n > (before[t] || 0);
        const isNow = now >= toMin(t) && now < toMin(t) + RULES.slotStepMins;
        return `<li class="${grew ? "is-growing" : ""} ${isNow ? "now" : ""}" style="--s:${size}px"><span class="ring num">${n || ""}</span><span class="t num">${isNow ? '<span class="lamp" aria-hidden="true"></span>' : ""}${t}<span class="sr">: ${n} portions</span></span></li>`;
      }).join("")}
    </ol>
  </section>`;
}

// How the number is worked out, laid out like a forecast model's output: the expected demand with
// a likely range, then a waterfall of what moved the number (weekday history, today's pre-orders,
// rounding up to whole trays), ending at what to cook. The shaded band is the likely range.
function prepCard(st) {
  const f = prepForecast(st);
  const unit = unitWord(st);
  const spread = demandSpread(st);
  const low = f.suggested - spread, high = f.suggested + spread;
  const end = Math.ceil((Math.max(f.cooked, high) + 10) / 20) * 20; // right end of the scale
  const at = (n) => `${((n / end) * 100).toFixed(1)}%`;
  // One waterfall row: a bar from `from` to `to` on the shared 0..end scale
  const row = (cls, label, sub, from, to, value) => `
    <div class="wf-row ${cls}">
      <span class="wf-label">${label}<small>${sub}</small></span>
      <span class="wf-track"><i style="left:${at(from)};width:${at(to - from)}"></i></span>
      <span class="wf-val num">${value}</span>
    </div>`;
  // The last 4 same-weekday demands as tiny bars, scaled between their own min and max
  const w = st.history.weeks, lo = Math.min(...w), hi = Math.max(...w);
  const spark = `<span class="spark" aria-label="Last 4 ${DEMO_DAY}s: ${w.join(", ")}">${w.map((x) => `<i style="height:${30 + Math.round(((x - lo) / Math.max(1, hi - lo)) * 70)}%"></i>`).join("")}</span>`;
  return `
  <section class="card">
    <div class="row"><h3>How the number is worked out</h3><span class="model-chip">Forecast model · sample</span></div>
    <p class="fc-head"><b class="num">${f.suggested}</b> portions expected <span class="num">likely ${low}–${high}</span></p>
    <div class="waterfall" style="--lo:${at(low)};--hi:${at(high)}">
      ${row("is-base", `Weekday history ${spark}`, `average of the last 4 ${DEMO_DAY}s`, 0, st.history.demand, st.history.demand)}
      ${row("is-signal", "Pre-orders vs usual", `${f.pre} so far · ${st.history.preorders} usual`, st.history.demand, f.suggested, `+${f.spike}`)}
      ${row("is-round", `Round up to ${unit}s`, `${unit}s of ${st.trayPortions}`, f.suggested, f.cooked, `+${f.cooked - f.suggested}`)}
      ${row("is-total", "Cook", `${f.trays} × ${st.trayPortions}`, 0, f.cooked, f.cooked)}
      <p class="wf-legend"><span class="wf-swatch" aria-hidden="true"></span>Likely range: expected ± ${spread}, how much the last 4 ${DEMO_DAY}s varied</p>
    </div>
    <p class="muted small">History sets the baseline; pre-orders catch today's spikes. In a real system an AI model trained on sales history would set the baseline. Here it's a 4-week average of sample data.</p>
  </section>`;
}

// Tomorrow's ingredient buying, as a timeline of when each piece of information arrives.
// Stalls buy fresh ingredients every morning, before that day's pre-orders come in, so
// tomorrow's shopping can only use history and the weekly orders already booked.
// Same rule as today's forecast: regular weekly orders were already buying last week, so they're
// inside last week's sales; only weekly orders set up since then (on this phone) add to it.
function tomorrowCard(st) {
  const tomorrow = nextWeekday(DEMO_DAY);
  const usual = st.week.sold[WEEK_LABELS.indexOf(tomorrow)]; // portions sold that weekday last week (sample)
  const onDay = Store.get().recurring.filter((r) => r.stall === st.id && r.days.includes(tomorrow));
  const regular = onDay.filter((r) => !r.mine).reduce((n, r) => n + orderQty(r), 0); // already in `usual`
  const added = onDay.filter((r) => r.mine).reduce((n, r) => n + orderQty(r), 0);    // new: on top
  const forecast = usual + added;
  const preorders = st.type === "batch" ? `Until ${RULES.batchCutoff}` : "Through lunch";
  const cook = st.type === "batch" ? `Cut-off: cook the ${unitWord(st)}s` : "Cook to order through lunch";
  return `
  <section class="card">
    <h3>Tomorrow (${tomorrow}): morning shopping</h3>
    <p class="small">Ingredients are bought fresh each morning, before that day's pre-orders arrive. So tomorrow's shopping can only use history and weekly orders.</p>
    <ol class="day-line">
      <li class="done"><b>Tonight</b><span>Last ${tomorrow} sold <strong class="num">${usual}</strong>, including <strong class="num">${regular}</strong> from regular weekly orders, so those are already counted.${added ? ` New weekly orders since then: <strong class="num">+${added}</strong>.` : ""} Forecast: about <strong class="num">${forecast}</strong>.</span></li>
      <li class="here"><b>Early morning</b><span>Buy ingredients for about <strong class="num">${forecast}</strong> portions</span></li>
      <li><b>${preorders}</b><span>Tomorrow's pre-orders come in</span></li>
      <li><b>${st.type === "batch" ? RULES.batchCutoff : "Lunch"}</b><span>${cook}</span></li>
    </ol>
  </section>`;
}

function controlsCard(st) {
  const s = Store.get();
  const cap = capFor(st);
  const used = preorderedPortions(st.id);
  return `
  <section class="card controls">
    <h3>Pre-order limits</h3>
    <div class="ctrl">
      <label for="cap-input">Pre-order limit</label>
      <div class="stepper">
        <button aria-label="Lower limit by 5" data-vact="cap" data-d="-5">−5</button>
        <span class="num" id="cap-input">${cap}</span>
        <button aria-label="Raise limit by 5" data-vact="cap" data-d="5">+5</button>
      </div>
      <div class="meter" aria-hidden="true"><span style="width:${Math.min(100, (used / cap) * 100)}%"></span></div>
      <p class="muted small num">${used} of ${cap} portions taken. Set it by stock and how fast the kitchen can cook.</p>
    </div>
    <div class="ctrl">
      <label for="soldout-toggle">Stop pre-orders</label>
      <button id="soldout-toggle" class="switch ${s.soldOut[st.id] ? "on" : ""}" role="switch" aria-checked="${!!s.soldOut[st.id]}" data-vact="soldout"><span></span></button>
      <p class="muted small">Ran out of an ingredient? Students see "Sold out" straight away.</p>
    </div>
  </section>`;
}

function ordersCard(st) {
  const orders = Store.get().orders.filter((o) => o.stall === st.id).slice().sort((a, b) => toMin(a.slot) - toMin(b.slot));
  const order = ["pending", "accepted", "ready"];
  // New (pending) orders go first, so an order placed on the phone lands at the top, in view.
  // The rest stay in slot order (the sort keeps their order).
  const open = orders.filter((o) => order.includes(o.status)).sort((a, b) => (b.status === "pending") - (a.status === "pending"));
  const closed = orders.filter((o) => !order.includes(o.status));
  const newCount = orders.filter((o) => o.status === "pending").length;
  const lateCount = open.filter(isOverdue).length;
  // The buttons under each order. Overdue orders (slot + grace period passed, see isOverdue
  // in data.js) get Resell instead of Mark no-show, so the packed food still gets eaten (P5).
  // Check code stays in case the student turns up late before someone buys it.
  const actions = (o) => {
    if (isOverdue(o)) return `<button class="btn sm" data-vact="resell" data-id="${o.id}">Resell at ${pct(RULES.resaleDiscount)}% off</button><button class="link-act" data-vact="verify" data-id="${o.id}">Check code</button>`;
    if (o.status === "pending") return `<button class="btn sm" data-vact="set" data-id="${o.id}" data-s="accepted">Accept</button><button class="btn btn-ghost sm" data-vact="set" data-id="${o.id}" data-s="declined">Decline</button>`;
    if (o.status === "accepted") return `<button class="btn sm" data-vact="set" data-id="${o.id}" data-s="ready">Put on shelf</button><button class="link-act" data-vact="set" data-id="${o.id}" data-s="voucher" aria-label="Can't make it: give the student a voucher">Can't make it</button>`;
    if (o.status === "ready") return `<button class="btn sm" data-vact="verify" data-id="${o.id}">Check code</button><button class="link-act" data-vact="set" data-id="${o.id}" data-s="noshow">Mark no-show</button>`;
    return "";
  };
  // Orders not drawn before (just placed on the phone) get the arrival flash, once
  const arriving = (o) => Vendor.seen !== null && !Vendor.seen.has(orderKey(o));
  // Each row: slot time on the left; what to make, its status and progress line, and what to do on the right.
  // Orders placed from this device's phone ("mine") get a yellow lamp line under their slot time.
  const row = (o) => `
    <li class="v-order ${o.mine ? "is-mine" : ""} ${arriving(o) ? "is-arriving" : ""}">
      <span class="v-slot num">${o.slot}</span>
      <div class="v-body">
        <div class="v-main">
          <p class="v-what"><strong class="num">${o.id}</strong> ${itemsText(o)}</p>
          <div class="v-state">${isOverdue(o) ? `<span class="pill pill-noshow">Uncollected</span>` : vendorStatusPill(o.status)}${progressLine(o, VENDOR_STAGES)}</div>
          ${isOverdue(o) ? `<p class="muted small">Not collected by <span class="num">${fromMin(toMin(o.slot) + RULES.graceMins)}</span>. Resells for <span class="num">${money(resalePrice(o))}</span> as a last-minute deal.</p>` : ""}
        </div>
        ${Vendor.verifyFor === o.id ? `
          <form class="verify" data-id="${o.id}">
            <label for="code-${o.id}">Student's 4-digit code</label>
            <input id="code-${o.id}" inputmode="numeric" maxlength="4" autocomplete="off" placeholder="0000">
            <button class="btn sm" type="submit">Confirm</button>
            <button class="btn btn-ghost sm" type="button" data-vact="verify-cancel">Back</button>
            ${Vendor.verifyMsg ? `<p class="err small">${Vendor.verifyMsg}</p>` : ""}
          </form>` : `
        <div class="row-actions">${actions(o)}</div>`}
      </div>
    </li>`;
  // The list head names the span of slots in view, e.g. "12:00 – 12:45" (open orders are sorted by slot)
  const slotsOpen = open.map((o) => o.slot).sort((a, b) => toMin(a) - toMin(b));
  const span = slotsOpen.length ? (slotsOpen[0] === slotsOpen[slotsOpen.length - 1] ? slotsOpen[0] : `${slotsOpen[0]} – ${slotsOpen[slotsOpen.length - 1]}`) + " · " : "";
  return `
  <section class="card">
    <div class="row"><h3>Pre-orders</h3><span class="v-head-sub">${span}${open.length} open${lateCount ? ` · ${lateCount} uncollected` : ""}</span>${newCount ? `<button class="btn sm" data-vact="accept-all">Accept all new (${newCount})</button>` : ""}</div>
    ${open.length ? `<ul class="v-orders">${open.map(row).join("")}</ul>` : `<p class="muted">No open pre-orders. New ones appear here as students order.</p>`}
    ${closed.length ? `<details><summary class="small">Finished (${closed.length})</summary><ul class="v-orders">${closed.map(row).join("")}</ul></details>` : ""}
    <p class="muted small">No-show rate: <span class="num">${pct(st.history.noShowRate)}%</span> (sample, last 4 weeks). Students who don't collect pay a <span class="num">${money(RULES.noShowFee)}</span> fee.</p>
  </section>`;
}

// Uncollected orders this stall has resold. Only shown once there is at least one.
function dealsCard(st) {
  const deals = Store.get().deals.filter((d) => d.stall === st.id);
  if (!deals.length) return "";
  const sold = deals.filter((d) => d.sold).length;
  const row = (d) => {
    const o = dealOrder(d); // the original order holds the items
    return `
    <li class="v-order">
      <span class="v-slot num">${d.id}</span>
      <div class="v-body">
        <div class="v-main">
          <p class="v-what"><strong class="num">${o.id}</strong> ${itemsText(o)}</p>
          <div class="v-state">${d.sold ? `<span class="pill pill-collected">Sold</span>` : `<span class="pill pill-pending">On offer</span>`}</div>
          <p class="muted small"><span class="num">${money(d.price)}</span> (was <span class="num">${money(orderTotal(o))}</span>) · ${d.sold ? `buyer shows code <strong class="num">${d.code}</strong>` : "students can buy it in the app"}</p>
        </div>
      </div>
    </li>`;
  };
  return `
  <section class="card">
    <div class="row"><h3>Last-minute deals</h3><span class="muted small num">${sold} of ${deals.length} sold</span></div>
    <ul class="v-orders">${deals.map(row).join("")}</ul>
    <p class="muted small">Uncollected orders resold at ${pct(RULES.resaleDiscount)}% off, so packed food still gets eaten.</p>
  </section>`;
}

function chartCard(st) {
  const log = todayLog(st); // null until today's leftovers are logged
  return `
  <section class="card">
    <div class="row"><h3>${log ? "Last week + today" : "Last week"}: prepared vs sold</h3><span class="muted small">Sample data</span></div>
    <div class="chart-box"><canvas id="week-chart" aria-label="Portions prepared, sold and left over, last five weekdays${log ? " and today" : ""}"></canvas></div>
    <p class="muted small">Leftover = prepared − sold: food cooked but not sold, the waste pre-orders aim to shrink. ${!log ? "Log today's leftovers to add today's bars." : log.counted ? "Today's prepared comes from the trays you tapped in as cooked." : "Today's prepared assumes you cooked the suggested amount (tap +1 when a tray is cooked to use the real count)."}</p>
  </section>`;
}

// Late in lunch: is it worth cooking one more tray? lastTrayAdvice (data.js) does the maths.
function lastTrayCard(st) {
  const s = Store.get();
  const a = lastTrayAdvice(st); // null until portions left are entered
  const unit = unitWord(st);
  const minShort = Math.ceil(st.trayPortions * RULES.lastTrayThreshold); // smallest shortfall worth cooking for
  let why = "Count what's on the counter and tap it in. Walk-ins still to come follow the usual lunch pattern (sample).";
  if (a && a.cook) why = `You'd run about ${a.short} portions short: at least ${pct(RULES.lastTrayThreshold)}% of a ${unit} (${minShort}), so it's worth cooking.`;
  else if (a && a.short) why = `Only ${a.short} short, under ${minShort}: selling out a little early wastes less than a half-sold ${unit}.`;
  else if (a) why = "Enough on the counter for the rest of lunch.";
  // Before lunch there's nothing to count yet, so just say when this opens.
  if (toMin(s.demoTime) < toMin(RULES.slotStart)) return `
  <section class="card">
    <h3>Last ${unit}: cook one more?</h3>
    <p class="muted small">Opens when lunch starts at ${RULES.slotStart}. Then count what's left on the counter and tap it in.</p>
  </section>`;
  return `
  <section class="card">
    <div class="row"><h3>Last ${unit}: cook one more?</h3><span class="muted small num">at ${s.demoTime}</span></div>
    <div class="ctrl">
      <label id="left-label">Portions left on the counter</label>
      ${countStepper("left", s.portionsLeft[st.id], "left-label")}
    </div>
    ${a ? `<p class="${a.cook ? "banner" : "note"}">To pack <b class="num">${a.toPack}</b> + usual walk-ins <b class="num">${a.walkIns}</b> vs <b class="num">${a.left}</b> left: <strong>${a.cook ? "cook" : "don't cook"} another ${unit}</strong></p>` : ""}
    <p class="muted small">${why}</p>
  </section>`;
}

// End of day: one number (portions left over). It goes on the chart next to last week.
function leftoverCard(st) {
  const log = todayLog(st); // { prepared, sold, leftover } or null
  const lastWeek = weekLeftovers(st);
  const avg = Math.round(lastWeek.reduce((a, b) => a + b, 0) / lastWeek.length);
  return `
  <section class="card">
    <div class="row"><h3>Leftovers</h3><span class="muted small">${log ? "Logged for today" : "Not logged yet"}</span></div>
    <div class="ctrl">
      <label id="leftover-label">Portions left over after lunch</label>
      ${countStepper("leftover", Store.get().leftovers[st.id], "leftover-label")}
    </div>
    ${log ? `
    <dl class="calc num">
      <div><dt>${log.counted ? `Prepared (${traysCooked(st.id)} ${unitWord(st)}s cooked)` : "Prepared (if you cooked the suggestion)"}</dt><dd>${log.prepared}</dd></div>
      <div><dt>Sold</dt><dd>${log.sold}</dd></div>
      <div class="sum"><dt>Left over</dt><dd>${log.leftover}</dd></div>
    </dl>
    <p class="muted small">Last week averaged <span class="num">${avg}</span> portions left over a day (sample).</p>` : `<p class="muted small">Count what's left when you close and tap it in. Takes a few seconds; today's bars then appear on the chart.</p>`}
  </section>`;
}

// The tab bar. Orders shows how many new orders are waiting, and flashes when one arrives
// while another tab is open, so a new pre-order is never missed.
function tabBar(st) {
  const newCount = Store.get().orders.filter((o) => o.stall === st.id && o.status === "pending").length;
  const pinged = Vendor.lastNew != null && newCount > Vendor.lastNew && Vendor.tab !== "orders";
  Vendor.lastNew = newCount;
  return `
  <div class="v-tabs" role="tablist" aria-label="Stall tools">
    ${TABS.map((t) => {
      const on = t.id === Vendor.tab;
      const badge = t.id === "orders" && newCount ? `<span class="tab-badge num">${newCount} new</span>` : "";
      return `<button type="button" role="tab" id="tab-${t.id}" class="v-tab ${t.id === "orders" && pinged ? "is-pinged" : ""}" aria-selected="${on}" aria-controls="v-panel" tabindex="${on ? 0 : -1}" data-vact="tab" data-tab="${t.id}">${t.label}${badge}</button>`;
    }).join("")}
  </div>`;
}

function renderVendor() {
  const root = vendorRoot();
  if (!root) return;
  const st = stallById(Vendor.stallId);
  const openEl = root.querySelector("details");
  const wasOpen = openEl && openEl.open;
  // What each tab shows. Only the open tab is drawn.
  const panels = {
    orders: () => `${lunchLine(st)}<div class="v-stack">${ordersCard(st)}${dealsCard(st)}</div>`,
    plan: () => `<div class="v-grid is-plan"><div class="v-col">${prepCard(st)}</div><div class="v-col">${tomorrowCard(st)}</div></div>`,
    stock: () => `<div class="v-grid"><div class="v-col">${controlsCard(st)}</div><div class="v-col">${lastTrayCard(st)}</div></div>`,
    close: () => `<div class="v-grid"><div class="v-col">${leftoverCard(st)}</div><div class="v-col">${chartCard(st)}</div></div>`,
  };
  root.innerHTML = `
    ${stallHeader(st)}
    ${prepHero(st)}
    ${tabBar(st)}
    <div class="v-panel" role="tabpanel" id="v-panel" aria-labelledby="tab-${Vendor.tab}">${panels[Vendor.tab]()}</div>`;
  if (wasOpen) { const d = root.querySelector("details"); if (d) d.open = true; }
  Vendor.seen = new Set(Store.get().orders.map(orderKey)); // everything on screen now counts as seen
  drawChart(st);
}

function drawChart(st) {
  const canvas = document.getElementById("week-chart");
  if (!canvas || !window.Chart) return;
  if (Vendor.chart) Vendor.chart.destroy();
  const css = getComputedStyle(document.documentElement);
  const c = (v) => css.getPropertyValue(v).trim();
  Chart.defaults.font.family = c("--f-ui");
  Chart.defaults.font.size = 13;
  // Last week's sample bars, plus a "Today" group once the stall has logged leftovers
  const log = todayLog(st);
  const withToday = (week, key) => (log ? [...week, log[key]] : week);
  Vendor.chart = new Chart(canvas, {
    type: "bar",
    data: {
      labels: log ? [...WEEK_LABELS, "Today"] : WEEK_LABELS,
      datasets: [
        { label: "Prepared", data: withToday(st.week.prepared, "prepared"), backgroundColor: c("--chart-prepared"), borderRadius: 3 },
        { label: "Sold", data: withToday(st.week.sold, "sold"), backgroundColor: c("--chart-sold"), borderRadius: 3 },
        { label: "Leftover", data: withToday(weekLeftovers(st), "leftover"), backgroundColor: c("--chart-leftover"), borderRadius: 3 },
      ],
    },
    options: {
      responsive: true, maintainAspectRatio: false, animation: false,
      plugins: { legend: { labels: { color: c("--muted"), boxWidth: 10 } } },
      scales: {
        x: { ticks: { color: c("--muted") }, grid: { display: false } },
        y: { beginAtZero: true, ticks: { color: c("--muted") }, grid: { color: c("--line") } },
      },
    },
  });
}

document.addEventListener("click", (e) => {
  const b = e.target.closest("#vendor-app [data-vact]");
  if (!b || b.tagName === "SELECT") return;
  const act = b.dataset.vact;
  const st = stallById(Vendor.stallId);
  // Switching tabs only changes what's on screen, not the stall's data.
  if (act === "tab") { Vendor.tab = b.dataset.tab; Vendor.verifyFor = null; renderVendor(); document.getElementById(`tab-${Vendor.tab}`)?.focus(); return; }
  if (act === "set") Store.update((s) => { s.orders.find((o) => o.id === b.dataset.id).status = b.dataset.s; });
  // One tap accepts every new order for this stall (less tapping at lunch rush)
  if (act === "accept-all") Store.update((s) => { s.orders.forEach((o) => { if (o.stall === st.id && o.status === "pending") o.status = "accepted"; }); });
  if (act === "cap") Store.update((s) => { s.caps[st.id] = Math.max(0, capFor(st) + Number(b.dataset.d)); });
  if (act === "soldout") Store.update((s) => { s.soldOut[st.id] = !s.soldOut[st.id]; });
  // Overdue order → mark it no-show and list it as a last-minute deal, in one tap (resellOrder in data.js)
  if (act === "resell") resellOrder(b.dataset.id);
  // Count steppers. Nothing entered yet ("?") counts as 0; never below 0.
  if (act === "left") Store.update((s) => { s.portionsLeft[st.id] = Math.max(0, (s.portionsLeft[st.id] ?? 0) + Number(b.dataset.d)); });
  // Trays cooked so far: +1 each time a tray comes off the stove; Undo takes one back. Never below 0.
  if (act === "cooked") Store.update((s) => { s.traysCooked[st.id] = Math.max(0, (s.traysCooked[st.id] || 0) + Number(b.dataset.d)); });
  if (act === "leftover") Store.update((s) => { s.leftovers[st.id] = Math.max(0, (s.leftovers[st.id] ?? 0) + Number(b.dataset.d)); });
  if (act === "verify") { Vendor.verifyFor = b.dataset.id; Vendor.verifyMsg = ""; renderVendor(); document.getElementById(`code-${b.dataset.id}`)?.focus(); }
  if (act === "verify-cancel") { Vendor.verifyFor = null; renderVendor(); }
});

document.addEventListener("change", (e) => {
  if (e.target.id === "stall-pick") { Vendor.stallId = e.target.value; Vendor.verifyFor = null; renderVendor(); }
});

document.addEventListener("submit", (e) => {
  const f = e.target.closest("#vendor-app form.verify");
  if (!f) return;
  e.preventDefault();
  const id = f.dataset.id;
  const entered = f.querySelector("input").value.trim();
  const o = Store.get().orders.find((x) => x.id === id);
  if (entered === o.code) {
    Vendor.verifyFor = null;
    Store.update((s) => { s.orders.find((x) => x.id === id).status = "collected"; });
  } else {
    Vendor.verifyMsg = "That code doesn't match. Ask the student to show their QR again.";
    renderVendor();
  }
});

Store.subscribe(renderVendor);

// Left / right arrow keys move between the tabs.
document.addEventListener("keydown", (e) => {
  if (!e.target.closest || !e.target.closest("#vendor-app .v-tab") || !["ArrowLeft", "ArrowRight"].includes(e.key)) return;
  const i = TABS.findIndex((t) => t.id === Vendor.tab);
  const next = TABS[(i + (e.key === "ArrowRight" ? 1 : TABS.length - 1)) % TABS.length];
  Vendor.tab = next.id;
  renderVendor();
  document.getElementById(`tab-${next.id}`)?.focus();
  e.preventDefault();
});
