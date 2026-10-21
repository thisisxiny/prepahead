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
};

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

// How the strip's number is worked out, plus tomorrow's recurring orders.
function prepCard(st) {
  const f = prepForecast(st);
  // Recurring orders are known a day ahead, early enough to change what the stall buys
  const tomorrow = nextWeekday(DEMO_DAY);
  return `
  <section class="card">
    <h3>How the number is worked out</h3>
    <dl class="calc num">
      <div><dt>Usual demand (same weekday, 4 wks)</dt><dd>${st.history.demand}</dd></div>
      <div><dt>Pre-ordered so far</dt><dd>${f.pre}</dd></div>
      <div><dt>Usual pre-orders (same weekday)</dt><dd>${st.history.preorders}</dd></div>
      <div><dt>Extra today (pre-ordered above usual)</dt><dd>+${f.spike}</dd></div>
      <div class="sum"><dt>Suggested portions</dt><dd>${f.suggested}</dd></div>
      <div class="final"><dt>Rounded up to whole ${unitWord(st)}s</dt><dd>${f.trays} × ${st.trayPortions} = ${f.cooked}</dd></div>
    </dl>
    <p class="muted small">History sets the baseline. Pre-orders catch today's spikes.</p>
    <p class="note">Recurring orders tomorrow (${tomorrow}): <strong class="num">${standingPortions(st.id, tomorrow)}</strong> portions, so buy ingredients for these.</p>
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
        <p class="v-what"><strong class="num">${o.id}</strong> ${itemsText(o)}</p>
        <div class="v-state">${isOverdue(o) ? `<span class="pill pill-noshow">Uncollected</span>` : vendorStatusPill(o.status)}${progressLine(o, VENDOR_STAGES)}</div>
        ${isOverdue(o) ? `<p class="muted small">Not collected by <span class="num">${fromMin(toMin(o.slot) + RULES.graceMins)}</span>. Resells for <span class="num">${money(resalePrice(o))}</span> as a last-minute deal.</p>` : ""}
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
    <div class="row"><h3>Pre-orders</h3><span class="v-head-sub">${span}${open.length} open${lateCount ? ` · ${lateCount} uncollected` : ""}</span></div>
    ${newCount ? `<div class="row-actions"><button class="btn sm" data-vact="accept-all">Accept all new (${newCount})</button></div>` : ""}
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
        <p class="v-what"><strong class="num">${o.id}</strong> ${itemsText(o)}</p>
        <div class="v-state">${d.sold ? `<span class="pill pill-collected">Sold</span>` : `<span class="pill pill-pending">On offer</span>`}</div>
        <p class="muted small"><span class="num">${money(d.price)}</span> (was <span class="num">${money(orderTotal(o))}</span>) · ${d.sold ? `buyer shows code <strong class="num">${d.code}</strong>` : "students can buy it in the app"}</p>
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
    <p class="muted small">Leftover = prepared − sold: food cooked but not sold, the waste pre-orders aim to shrink. ${!log ? "Log today's leftovers below to add today's bars." : log.counted ? "Today's prepared comes from the trays you tapped in as cooked." : "Today's prepared assumes you cooked the suggested amount (tap +1 when a tray is cooked to use the real count)."}</p>
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
    <div class="row"><h3>End of day: leftovers</h3><span class="muted small">${log ? "Logged for today" : "Not logged yet"}</span></div>
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
    <p class="muted small">Last week averaged <span class="num">${avg}</span> portions left over a day (sample).</p>` : `<p class="muted small">Count what's left when you close and tap it in. Takes a few seconds; it shows on the chart above.</p>`}
  </section>`;
}

function renderVendor() {
  const root = vendorRoot();
  if (!root) return;
  const st = stallById(Vendor.stallId);
  const openEl = root.querySelector("details");
  const wasOpen = openEl && openEl.open;
  root.innerHTML = `
    ${stallHeader(st)}
    ${prepHero(st)}
    ${lunchLine(st)}
    <div class="v-grid">
      <div class="v-col">${prepCard(st)}${controlsCard(st)}${chartCard(st)}${leftoverCard(st)}</div>
      <div class="v-col">${ordersCard(st)}${dealsCard(st)}${lastTrayCard(st)}</div>
    </div>`;
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
