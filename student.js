/* ============================================================
   student.js
   The student app: browse stalls → pick food → pick a collection
   slot → pay → QR code → my orders. Each stall is a stop on the
   canteen's green line (see stopRow and .stop in style.css).
   Draws into <div id="student-app"> in index.html.
   ============================================================ */

const Student = {
  screen: "home",        // home | menu | checkout | done | orders | deal
  stallId: null,
  cart: {},              // { itemId: qty }
  slot: null,
  lastOrderId: null,
  agreeFee: false,
  repeat: false,         // checkout: "make this a weekly order" is ticked
  repeatDays: [],        // checkout: weekdays the weekly order repeats on, e.g. ["Mon", "Wed"]
  lastRecurringId: null, // the weekly order set up with the last order, if any
  lastDealId: null,      // the last-minute deal shown on the "deal" screen
};

const studentRoot = () => document.getElementById("student-app");

// Cart lines with today's price (early-bird price before RULES.earlyBirdUntil).
// `usual` keeps the normal price so checkout can show how much was saved.
function cartItems() {
  const stall = stallById(Student.stallId);
  return stall.items.filter((i) => Student.cart[i.id] > 0).map((i) => ({ ...i, qty: Student.cart[i.id], price: priceNow(i), usual: i.price }));
}
const cartQty = () => Object.values(Student.cart).reduce((a, b) => a + b, 0);
const cartTotal = () => cartItems().reduce((n, i) => n + i.qty * i.price, 0);
const cartSaving = () => cartItems().reduce((n, i) => n + i.qty * (i.usual - i.price), 0);

// Early-bird discount as a whole percentage, e.g. 0.1 → 10.
const earlyBirdPct = () => Math.round(RULES.earlyBirdDiscount * 100);

// Banner shown on the stall list and menu while the early-bird discount is on.
function earlyBirdBanner() {
  if (!isEarlyBird()) return "";
  return `<p class="lamp-line"><span class="lamp" aria-hidden="true"></span><span><strong>Early bird:</strong> Order before ${RULES.earlyBirdUntil}, save ${earlyBirdPct()}%.</span></p>`;
}

// Menu price: during early bird, show the usual price crossed out next to today's price.
function priceLabel(item) {
  const now = priceNow(item);
  return now < item.price ? `<s>${money(item.price)}</s> <strong>${money(now)}</strong>` : money(item.price);
}

// "Mon, Wed, Fri" for a list of weekdays.
const dayList = (days) => days.join(", ");
// "2 × Chicken chop, 1 × Aglio olio" for an order, weekly order or deal.
const itemList = (o) => o.items.map((i) => `${i.qty} × ${i.name}`).join(", ");

function stallRule(stall) {
  return stall.type === "batch" ? `Order by ${RULES.batchCutoff} for lunch` : `Order ${RULES.madeToOrderLeadMins} min ahead`;
}
const stallType = (stall) => (stall.type === "batch" ? "Batch-cooked" : "Made to order");

// The names of the four stops on an order's progress line (see progressLine in data.js).
const STUDENT_STAGES = ["Ordered", "Confirmed", "On shelf", "Collected"];

// One stall as a stop on the green line: ring, code tab, name, rule and price.
// `why` is set when the stall can't take orders right now (the stop greys out and says why).
function stopRow(st, why) {
  const from = Math.min(...st.items.map(priceNow)); // cheapest item at today's price
  return `
    <li class="stop ${why ? "is-closed" : ""}">
      <button class="stop-btn" data-act="open-stall" data-id="${st.id}" ${why ? "disabled" : ""}>
        <span class="ring" aria-hidden="true"></span>
        <span>
          <span class="code-tab num">${stallCode(st)}</span><span class="stop-name">${st.name}</span><span class="zh" lang="zh-Hans">${st.zh}</span>
          <span class="stop-meta ${why ? "is-why" : ""}">${why || `${stallType(st)} · ${stallRule(st).toLowerCase()}`}</span>
          <span class="stop-saved">Saved ${st.savedThisWeek} this week (sample)</span>
        </span>
        <span class="stop-price num"><small>from</small>${money(from)}</span>
      </button>
    </li>`;
}

// The top of a stall's own screens: code tab, name (as the screen heading) and its rule.
function stallHead(st, line) {
  return `
    <div class="stall-head">
      <span><span class="code-tab num">${stallCode(st)}</span></span>
      <h2>${st.name}<span class="zh" lang="zh-Hans">${st.zh}</span></h2>
      <p>${line}</p>
    </div>`;
}

// "Batch stalls close" with the cut-off time in flip tiles, and how long is left.
function cutoffPanel() {
  const left = toMin(RULES.batchCutoff) - toMin(Store.get().demoTime);
  // e.g. "2 h left", "1 h 20 min left", "20 min left"
  const hours = Math.floor(left / 60), mins = left % 60;
  const when = hours ? `${hours} h${mins ? ` ${mins} min` : ""} left` : `${mins} min left`;
  return `
    <div class="cutoff ${left > 0 ? "" : "is-closed"}">
      <div><h3>${left > 0 ? "Batch stalls close" : "Batch stalls closed"}</h3>
        <p>${left > 0 ? `<span class="lamp" aria-hidden="true"></span>${when} to pre-order` : "Made-to-order stalls still take orders"}</p></div>
      ${flipTiles(RULES.batchCutoff)}
    </div>`;
}

// When free cancellation ends. It's the same cut-off that closes ordering
// (see isPastCutoff in data.js), so the wording always matches the Cancel button.
function cancelUntil(stall, slot) {
  if (stall.type === "batch") return RULES.batchCutoff;
  if (slot) return fromMin(toMin(slot) - RULES.madeToOrderLeadMins);
  return `${RULES.madeToOrderLeadMins} min before my slot`;
}

function statusPill(status) {
  const label = { pending: "Waiting for stall", accepted: "Confirmed", ready: "Ready to collect", collected: "Collected", declined: "Declined", cancelled: "Cancelled", noshow: "Not collected", voucher: "Voucher issued" }[status];
  return `<span class="pill pill-${status}">${label}</span>`;
}

/* ---------- screens ---------- */

function screenHome() {
  const s = Store.get();
  const mine = s.orders.filter((o) => o.mine && LIVE.includes(o.status) && o.status !== "collected");
  const hasAnything = mine.length || s.recurring.some((r) => r.mine) || s.deals.some((d) => d.mine);
  return `
    <div class="s-head">
      <h2 class="s-title">Skip the lunch queue</h2>
    </div>
    ${cutoffPanel()}
    ${reminderBanner()}
    ${dealsStrip()}
    ${earlyBirdBanner()}
    <div>
      <p class="line-name sign-type">${APP.canteen}</p>
      <ul class="stall-list">
        ${STALLS.map((st) => {
          const check = canOrder(st);
          const closed = st.type === "batch" && toMin(s.demoTime) >= toMin(RULES.batchCutoff);
          return stopRow(st, closed ? `Closed for lunch at ${RULES.batchCutoff}` : check.ok ? "" : check.reason);
        }).join("")}
      </ul>
    </div>
    ${hasAnything ? `<button class="btn btn-ghost wide" data-act="go" data-to="orders">My orders${mine.length ? ` (${mine.length})` : ""}</button>` : ""}
  `;
}

function screenMenu() {
  const st = stallById(Student.stallId);
  return `
    <button class="back" data-act="go" data-to="home">${ICON.back}Stalls</button>
    ${stallHead(st, `${stallType(st)} · ${stallRule(st)}`)}
    ${earlyBirdBanner()}
    <ul class="menu">
      ${st.items.map((i) => `
        <li class="menu-item">
          <div><div class="item-name">${i.name}</div><div class="price">${priceLabel(i)}</div></div>
          <div class="stepper">
            <button aria-label="Remove one ${i.name}" data-act="qty" data-id="${i.id}" data-d="-1" ${!Student.cart[i.id] ? "disabled" : ""}>${ICON.minus}</button>
            <span class="num">${Student.cart[i.id] || 0}</span>
            <button aria-label="Add one ${i.name}" data-act="qty" data-id="${i.id}" data-d="1">${ICON.plus}</button>
          </div>
        </li>`).join("")}
    </ul>
    <button class="btn wide" data-act="go" data-to="checkout" ${cartQty() ? "" : "disabled"}>
      Choose collection time · ${cartQty()} item${cartQty() === 1 ? "" : "s"} · ${money(cartTotal())}
    </button>
  `;
}

function screenCheckout() {
  const st = stallById(Student.stallId);
  const qty = cartQty();
  return `
    <button class="back" data-act="go" data-to="menu">${ICON.back}${st.name}</button>
    <div class="s-head"><h2>Collection time</h2>
      <p>Pick when you'll collect. Slots are spread out, so there's no 12:00 crush at the counter.</p></div>
    <div class="slots">
      ${allSlots().map((t) => {
        const c = canOrder(st, t, qty);
        return `<button class="slot ${Student.slot === t ? "on" : ""}" data-act="slot" data-t="${t}" ${c.ok ? "" : `disabled title="${c.reason}"`}>${t}</button>`;
      }).join("")}
    </div>
    ${repeatPicker()}
    <div class="summary">
      ${cartItems().map((i) => `<div class="row"><span>${i.qty} × ${i.name}</span><span class="num">${money(i.qty * i.price)}</span></div>`).join("")}
      ${cartSaving() > 0 ? `<div class="row"><span>Early-bird saving (${earlyBirdPct()}% off)</span><span class="num">−${money(cartSaving())}</span></div>` : ""}
      <div class="row total"><span>Total</span><span class="num">${money(cartTotal())}</span></div>
    </div>
    <label class="agree">
      <input type="checkbox" id="agree-fee" data-act="agree" ${Student.agreeFee ? "checked" : ""}>
      <span>I understand a ${money(RULES.noShowFee)} fee applies if I don't collect within ${RULES.graceMins} min of my slot. I can cancel free until ${cancelUntil(st, Student.slot)}.</span>
    </label>
    <button class="btn wide" data-act="pay" ${Student.slot && Student.agreeFee ? "" : "disabled"}>
      Pay ${money(cartTotal())}${Student.slot ? ` · collect ${Student.slot}` : ""}
    </button>
  `;
}

// Checkout: "Repeat on…" turns this order into a weekly order.
// The weekdays start ticked from the student's timetable (sample) for the chosen slot.
function repeatPicker() {
  let hint;
  if (!Student.slot) hint = "Pick a collection time first, and we'll tick the days your timetable is free.";
  else if (timetableDaysFor(Student.slot).length) hint = `Ticked: days you're free at ${Student.slot} (sample timetable). You can stop it in My orders.`;
  else hint = `Your timetable has no lunch break at ${Student.slot} (sample timetable). Tick the days you want.`;
  return `
    <label class="agree">
      <input type="checkbox" data-act="repeat" ${Student.repeat ? "checked" : ""}>
      <span>Make this my weekly lunch: same order, same time, no need to order again.</span>
    </label>
    ${Student.repeat ? `
    <div class="s-head">
      <p class="label">Repeat on</p>
      <div class="row-actions" role="group" aria-label="Repeat on">
        ${WEEK_LABELS.map((d) => {
          const on = Student.repeatDays.includes(d);
          return `<button class="btn sm ${on ? "" : "btn-ghost"}" data-act="repeat-day" data-day="${d}" aria-pressed="${on}">${d}</button>`;
        }).join("")}
      </div>
      <p class="muted small">${hint}</p>
    </div>` : ""}
  `;
}

function screenDone() {
  const o = Store.get().orders.find((x) => x.id === Student.lastOrderId);
  if (!o) { Student.screen = "home"; return screenHome(); }
  const st = stallById(o.stall);
  // The weekly order set up with this one, if any (it may have been stopped since).
  const weekly = Store.get().recurring.find((r) => r.id === Student.lastRecurringId);
  // The ticket owns the screen: when (in flip tiles), where, how far along, and the code.
  return `
    <div class="ticket">
      <div class="ticket-when"><h2>Collect at</h2>${flipTiles(o.slot)}</div>
      <p class="ticket-where"><span class="code-tab num">${stallCode(st)}</span> <b>${st.name}</b> · order <span class="num">${o.id}</span>. ${o.status === "collected" ? "Collected. Enjoy your lunch!" : "We'll remind you 10 minutes before."}</p>
      ${progressLine(o, STUDENT_STAGES, true) || statusPill(o.status)}
      <div class="qr-wrap"><div id="qr" data-text="PREPAHEAD:${o.id}:${o.code}"></div></div>
      <p class="code num" aria-label="Collection code">${o.code}</p>
      <p class="muted">${o.status === "collected" ? "Already collected" : "Show this code at the counter"}</p>
      ${weekly ? `<p class="muted small">Also your weekly lunch: every ${dayList(weekly.days)} at ${weekly.slot}.</p>` : ""}
    </div>
    <button class="btn btn-ghost wide" data-act="go" data-to="orders">My orders</button>
    <button class="btn wide" data-act="go" data-to="home">Done</button>
  `;
}

// After buying a last-minute deal: a fresh collection code for food that's ready now.
function screenDeal() {
  const d = Store.get().deals.find((x) => x.id === Student.lastDealId);
  if (!d || !d.mine || !dealOrder(d)) { Student.screen = "home"; return screenHome(); }
  const st = stallById(d.stall);
  return `
    <div class="ticket">
      <div class="ticket-when"><h2>Ready now</h2></div>
      <p class="ticket-where"><span class="code-tab num">${stallCode(st)}</span> <b>${st.name}</b> · last-minute deal <span class="num">${d.id}</span>. Head to the counter and show this code.</p>
      <div class="qr-wrap"><div id="qr" data-text="PREPAHEAD:${d.id}:${d.code}"></div></div>
      <p class="code num" aria-label="Collection code">${d.code}</p>
      <p class="muted">Show this code at the counter</p>
    </div>
    <div class="summary">
      <div class="row"><span>${itemList(dealOrder(d))}</span><span class="num">${money(d.price)}</span></div>
    </div>
    <button class="btn btn-ghost wide" data-act="go" data-to="orders">My orders</button>
    <button class="btn wide" data-act="go" data-to="home">Done</button>
  `;
}

function screenOrders() {
  const s = Store.get();
  const mine = s.orders.filter((o) => o.mine).slice().reverse();
  const deals = s.deals.filter((d) => d.mine && dealOrder(d));
  const weekly = s.recurring.filter((r) => r.mine);
  return `
    <button class="back" data-act="go" data-to="home">${ICON.back}Stalls</button>
    <div class="s-head"><h2>My orders</h2></div>
    ${mine.length || deals.length || weekly.length ? "" : `<p class="muted">No orders yet. Pick a stall to place your first pre-order.</p>`}
    ${deals.length ? `
    <ul class="orders">
      ${deals.map((d) => `
        <li class="order">
          <div class="row"><strong>${stallById(d.stall).name}</strong>${statusPill("ready")}</div>
          <div class="muted">${itemList(dealOrder(d))}</div>
          <div class="row"><span class="num">Last-minute deal · code ${d.code}</span><span class="num">${money(d.price)}</span></div>
          <div class="row-actions"><button class="btn btn-ghost sm" data-act="show-deal" data-id="${d.id}">Show QR</button></div>
        </li>`).join("")}
    </ul>` : ""}
    <ul class="orders">
      ${mine.map((o) => {
        const st = stallById(o.stall);
        const canCancel = (o.status === "pending" || o.status === "accepted") && !isPastCutoff(st, o.slot);
        return `
        <li class="order">
          <div class="row"><span><span class="code-tab num">${stallCode(st)}</span> <strong>${st.name}</strong></span>${statusPill(o.status)}</div>
          <div class="muted">${itemList(o)}</div>
          <div class="row"><span class="num">Collect ${o.slot} · code ${o.code}</span><span class="num">${money(orderTotal(o))}</span></div>
          ${progressLine(o, STUDENT_STAGES)}
          ${o.status === "voucher" ? `<p class="note">The stall couldn't prepare this. A ${money(orderTotal(o))} voucher has been added for another day.</p>` : ""}
          ${o.status === "noshow" ? `<p class="note">Not collected in time. ${money(RULES.noShowFee)} fee charged, rest refunded.</p>` : ""}
          <div class="row-actions">
            ${LIVE.includes(o.status) && o.status !== "collected" ? `<button class="btn btn-ghost sm" data-act="show-qr" data-id="${o.id}">Show QR</button>` : ""}
            ${canCancel ? `<button class="btn btn-ghost sm" data-act="cancel" data-id="${o.id}">Cancel</button>` : ""}
          </div>
        </li>`;
      }).join("")}
    </ul>
    ${weekly.length ? `
    <div class="s-head">
      <h3>Weekly lunches</h3>
      <p class="muted small">Same order, same time, every week. The stall knows to expect you.</p>
    </div>
    <ul class="orders">
      ${weekly.map((r) => `
        <li class="order">
          <div class="row"><strong>${stallById(r.stall).name}</strong><span class="pill pill-accepted">Weekly</span></div>
          <div class="muted">${itemList(r)}</div>
          <div class="row"><span class="num">Every ${dayList(r.days)} · collect ${r.slot}</span><span class="num">${money(orderTotal(r))}</span></div>
          <div class="row-actions"><button class="btn btn-ghost sm" data-act="stop-repeat" data-id="${r.id}">Stop repeating</button></div>
        </li>`).join("")}
    </ul>` : ""}
  `;
}

// Home: uncollected orders that stalls are reselling at a discount. The food is already cooked.
function dealsStrip() {
  const deals = Store.get().deals.filter((d) => !d.sold && dealOrder(d));
  if (!deals.length) return "";
  return `
    <div class="s-head">
      <h3>Last-minute deals</h3>
      <p class="muted small">Ready now at ${Math.round(RULES.resaleDiscount * 100)}% off. First come, first served.</p>
    </div>
    <ul class="orders">
      ${deals.map((d) => {
        const o = dealOrder(d);
        return `
        <li class="order">
          <div class="row"><strong>${stallById(d.stall).name}</strong><span class="num"><s class="muted">${money(orderTotal(o))}</s> ${money(d.price)}</span></div>
          <div class="muted">${itemList(o)}</div>
          <div class="row-actions"><button class="btn sm" data-act="buy-deal" data-id="${d.id}">Buy for ${money(d.price)}</button></div>
        </li>`;
      }).join("")}
    </ul>
  `;
}

function reminderBanner() {
  const s = Store.get();
  const now = toMin(s.demoTime);
  const soon = s.orders.find((o) => o.mine && (o.status === "accepted" || o.status === "ready") && toMin(o.slot) - now <= 10 && toMin(o.slot) - now >= -RULES.graceMins);
  if (!soon) return "";
  return `<div class="banner is-ink" role="status"><strong>Reminder:</strong> collect your ${stallById(soon.stall).name} order at ${soon.slot}. Code ${soon.code}.</div>`;
}

/* ---------- render + actions ---------- */

function renderStudent() {
  const root = studentRoot();
  if (!root) return;
  const screens = { home: screenHome, menu: screenMenu, checkout: screenCheckout, done: screenDone, orders: screenOrders, deal: screenDeal };
  root.innerHTML = screens[Student.screen]();
  drawQR();
}

// Draws the QR code on the "done" and "deal" screens. The text to encode is in the box's data-text.
function drawQR() {
  const el = studentRoot().querySelector("#qr");
  if (!el) return;
  if (window.QRCode) {
    // QR colours come from the CSS variables, so the code matches the page ink.
    const css = getComputedStyle(document.documentElement);
    new QRCode(el, { text: el.dataset.text, width: 150, height: 150, colorDark: css.getPropertyValue("--ink").trim(), colorLight: css.getPropertyValue("--panel").trim() });
  } else {
    el.textContent = "QR unavailable offline. Use the code below.";
  }
}

document.addEventListener("click", (e) => {
  const b = e.target.closest("#student-app [data-act]");
  if (!b) return;
  const act = b.dataset.act;
  if (act === "go") { Student.screen = b.dataset.to; }
  if (act === "open-stall") { Student.stallId = b.dataset.id; Student.cart = {}; Student.slot = null; Student.agreeFee = false; Student.repeat = false; Student.repeatDays = []; Student.screen = "menu"; }
  if (act === "qty") { const id = b.dataset.id; Student.cart[id] = Math.max(0, (Student.cart[id] || 0) + Number(b.dataset.d)); }
  // Picking a slot also re-ticks the weekly days to match the timetable at that time.
  if (act === "slot") { Student.slot = b.dataset.t; Student.repeatDays = timetableDaysFor(Student.slot); }
  if (act === "agree") { Student.agreeFee = b.checked; }
  if (act === "repeat") { Student.repeat = b.checked; }
  if (act === "repeat-day") {
    const day = b.dataset.day;
    const days = Student.repeatDays.includes(day) ? Student.repeatDays.filter((d) => d !== day) : [...Student.repeatDays, day];
    Student.repeatDays = WEEK_LABELS.filter((d) => days.includes(d)); // keep Mon → Fri order
  }
  if (act === "pay") {
    const id = newOrderId();
    // Price is today's price (early-bird price before the cut-off), so the order format stays the same.
    const items = cartItems().map(({ id, name, qty, price }) => ({ id, name, qty, price }));
    const weeklyId = Student.repeat && Student.repeatDays.length ? newRecurringId() : null;
    Store.update((s) => {
      s.orders.push({ id, code: newCode(), stall: Student.stallId, items, slot: Student.slot, status: "pending", placedAt: s.demoTime, mine: true });
      // Weekly order: kept in its own list (recurring), so stalls can plan ingredients ahead.
      if (weeklyId) s.recurring.push({ id: weeklyId, stall: Student.stallId, items: items.map((i) => ({ ...i })), slot: Student.slot, days: [...Student.repeatDays], mine: true });
    });
    Student.lastOrderId = id;
    Student.lastRecurringId = weeklyId;
    Student.screen = "done";
  }
  if (act === "show-qr") { Student.lastOrderId = b.dataset.id; Student.lastRecurringId = null; Student.screen = "done"; }
  if (act === "cancel") { Store.update((s) => { s.orders.find((o) => o.id === b.dataset.id).status = "cancelled"; }); }
  if (act === "stop-repeat") { Store.update((s) => { s.recurring = s.recurring.filter((r) => r.id !== b.dataset.id); }); }
  if (act === "buy-deal") { buyDeal(b.dataset.id); Student.lastDealId = b.dataset.id; Student.screen = "deal"; }
  if (act === "show-deal") { Student.lastDealId = b.dataset.id; Student.screen = "deal"; }
  renderStudent();
});

Store.subscribe(renderStudent);
