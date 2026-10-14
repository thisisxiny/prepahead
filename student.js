/* ============================================================
   student.js  —  PERSON A's FILE
   The student app: browse stalls → pick food → pick a collection
   slot → pay → QR code → my orders.
   Draws into <div id="student-app"> in index.html.
   ============================================================ */

const Student = {
  screen: "home",        // home | menu | checkout | done | orders
  stallId: null,
  cart: {},              // { itemId: qty }
  slot: null,
  lastOrderId: null,
  agreeFee: false,
};

const studentRoot = () => document.getElementById("student-app");

function cartItems() {
  const stall = stallById(Student.stallId);
  return stall.items.filter((i) => Student.cart[i.id] > 0).map((i) => ({ ...i, qty: Student.cart[i.id] }));
}
const cartQty = () => Object.values(Student.cart).reduce((a, b) => a + b, 0);
const cartTotal = () => cartItems().reduce((n, i) => n + i.qty * i.price, 0);

function stallRule(stall) {
  return stall.type === "batch" ? `Order by ${RULES.batchCutoff} for lunch` : `Order ${RULES.madeToOrderLeadMins} min ahead`;
}

function statusPill(status) {
  const label = { pending: "Waiting for stall", accepted: "Confirmed", ready: "Ready to collect", collected: "Collected", declined: "Declined", cancelled: "Cancelled", noshow: "Not collected", voucher: "Voucher issued" }[status];
  return `<span class="pill pill-${status}">${label}</span>`;
}

/* ---------- screens ---------- */

function screenHome() {
  const s = Store.get();
  const mine = s.orders.filter((o) => o.mine && LIVE.includes(o.status) && o.status !== "collected");
  return `
    <div class="s-head">
      <p class="eyebrow">${APP.canteen}</p>
      <h2>What's for lunch?</h2>
      <p class="muted">Pick a stall and a collection time. Your order tells the stall how much to cook.</p>
    </div>
    ${reminderBanner()}
    <ul class="stall-list">
      ${STALLS.map((st) => {
        const check = canOrder(st);
        const closed = st.type === "batch" && toMin(s.demoTime) >= toMin(RULES.batchCutoff);
        const blocked = !check.ok || closed;
        return `
        <li>
          <button class="stall" data-act="open-stall" data-id="${st.id}" ${blocked ? "disabled" : ""}>
            <span class="stall-name">${st.name}</span>
            <span class="stall-meta">
              <span class="tag tag-${st.type}">${st.type === "batch" ? "Batch-cooked" : "Made to order"}</span>
              <span>${blocked ? (closed ? `Closed at ${RULES.batchCutoff}` : check.reason) : stallRule(st)}</span>
            </span>
          </button>
        </li>`;
      }).join("")}
    </ul>
    ${mine.length ? `<button class="btn btn-ghost wide" data-act="go" data-to="orders">My orders (${mine.length})</button>` : ""}
  `;
}

function screenMenu() {
  const st = stallById(Student.stallId);
  return `
    <button class="back" data-act="go" data-to="home">← Stalls</button>
    <div class="s-head">
      <p class="eyebrow">${st.type === "batch" ? "Batch-cooked" : "Made to order"} · ${stallRule(st)}</p>
      <h2>${st.name}</h2>
    </div>
    <ul class="menu">
      ${st.items.map((i) => `
        <li class="menu-item">
          <div><div class="item-name">${i.name}</div><div class="muted num">${money(i.price)}</div></div>
          <div class="stepper">
            <button aria-label="Remove one ${i.name}" data-act="qty" data-id="${i.id}" data-d="-1" ${!Student.cart[i.id] ? "disabled" : ""}>−</button>
            <span class="num">${Student.cart[i.id] || 0}</span>
            <button aria-label="Add one ${i.name}" data-act="qty" data-id="${i.id}" data-d="1">+</button>
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
    <button class="back" data-act="go" data-to="menu">← ${st.name}</button>
    <div class="s-head"><h2>Collection time</h2>
      <p class="muted">Times are staggered so everyone doesn't arrive at 12:00.</p></div>
    <div class="slots">
      ${allSlots().map((t) => {
        const c = canOrder(st, t, qty);
        return `<button class="slot ${Student.slot === t ? "on" : ""}" data-act="slot" data-t="${t}" ${c.ok ? "" : `disabled title="${c.reason}"`}>${t}</button>`;
      }).join("")}
    </div>
    <div class="summary">
      ${cartItems().map((i) => `<div class="row"><span>${i.qty} × ${i.name}</span><span class="num">${money(i.qty * i.price)}</span></div>`).join("")}
      <div class="row total"><span>Total</span><span class="num">${money(cartTotal())}</span></div>
    </div>
    <label class="agree">
      <input type="checkbox" id="agree-fee" data-act="agree" ${Student.agreeFee ? "checked" : ""}>
      <span>I understand a ${money(RULES.noShowFee)} fee applies if I don't collect within ${RULES.graceMins} min of my slot. I can cancel free until the stall starts cooking.</span>
    </label>
    <button class="btn wide" data-act="pay" ${Student.slot && Student.agreeFee ? "" : "disabled"}>
      Pay ${money(cartTotal())}${Student.slot ? ` · collect ${Student.slot}` : ""}
    </button>
  `;
}

function screenDone() {
  const o = Store.get().orders.find((x) => x.id === Student.lastOrderId);
  if (!o) { Student.screen = "home"; return screenHome(); }
  const st = stallById(o.stall);
  return `
    <div class="s-head center">
      <p class="eyebrow">Order ${o.id}</p>
      <h2>Show this at ${st.name}</h2>
      <p class="muted">Collect at <strong>${o.slot}</strong>. We'll remind you 10 minutes before.</p>
    </div>
    <div class="qr-wrap"><div id="qr"></div></div>
    <p class="code num" aria-label="Collection code">${o.code}</p>
    <p class="muted center">Collection code</p>
    <div class="center">${statusPill(o.status)}</div>
    <button class="btn btn-ghost wide" data-act="go" data-to="orders">My orders</button>
    <button class="btn wide" data-act="go" data-to="home">Done</button>
  `;
}

function screenOrders() {
  const mine = Store.get().orders.filter((o) => o.mine).slice().reverse();
  return `
    <button class="back" data-act="go" data-to="home">← Stalls</button>
    <div class="s-head"><h2>My orders</h2></div>
    ${mine.length ? "" : `<p class="muted">No orders yet. Pick a stall to place your first pre-order.</p>`}
    <ul class="orders">
      ${mine.map((o) => {
        const st = stallById(o.stall);
        const canCancel = (o.status === "pending" || o.status === "accepted") && !isPastCutoff(st, o.slot);
        return `
        <li class="order">
          <div class="row"><strong>${st.name}</strong>${statusPill(o.status)}</div>
          <div class="muted">${o.items.map((i) => `${i.qty} × ${i.name}`).join(", ")}</div>
          <div class="row"><span class="num">Collect ${o.slot} · code ${o.code}</span><span class="num">${money(orderTotal(o))}</span></div>
          ${o.status === "voucher" ? `<p class="note">The stall couldn't prepare this. A ${money(orderTotal(o))} voucher has been added for another day.</p>` : ""}
          ${o.status === "noshow" ? `<p class="note">Not collected in time. ${money(RULES.noShowFee)} fee charged, rest refunded.</p>` : ""}
          <div class="row-actions">
            ${LIVE.includes(o.status) && o.status !== "collected" ? `<button class="btn btn-ghost sm" data-act="show-qr" data-id="${o.id}">Show QR</button>` : ""}
            ${canCancel ? `<button class="btn btn-ghost sm" data-act="cancel" data-id="${o.id}">Cancel</button>` : ""}
          </div>
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
  return `<div class="banner" role="status"><strong>Reminder:</strong> collect your ${stallById(soon.stall).name} order at ${soon.slot}. Code ${soon.code}.</div>`;
}

/* ---------- render + actions ---------- */

function renderStudent() {
  const root = studentRoot();
  if (!root) return;
  const screens = { home: screenHome, menu: screenMenu, checkout: screenCheckout, done: screenDone, orders: screenOrders };
  root.innerHTML = screens[Student.screen]();
  if (Student.screen === "done") drawQR();
}

function drawQR() {
  const el = document.getElementById("qr");
  const o = Store.get().orders.find((x) => x.id === Student.lastOrderId);
  if (!el || !o) return;
  if (window.QRCode) {
    new QRCode(el, { text: `PREPAHEAD:${o.id}:${o.code}`, width: 150, height: 150, colorDark: "#14302b", colorLight: "#ffffff" });
  } else {
    el.textContent = "QR unavailable offline. Use the code below.";
  }
}

document.addEventListener("click", (e) => {
  const b = e.target.closest("#student-app [data-act]");
  if (!b) return;
  const act = b.dataset.act;
  if (act === "go") { Student.screen = b.dataset.to; }
  if (act === "open-stall") { Student.stallId = b.dataset.id; Student.cart = {}; Student.slot = null; Student.agreeFee = false; Student.screen = "menu"; }
  if (act === "qty") { const id = b.dataset.id; Student.cart[id] = Math.max(0, (Student.cart[id] || 0) + Number(b.dataset.d)); }
  if (act === "slot") { Student.slot = b.dataset.t; }
  if (act === "agree") { Student.agreeFee = b.checked; }
  if (act === "pay") {
    const id = newOrderId();
    Store.update((s) => {
      s.orders.push({ id, code: newCode(), stall: Student.stallId, items: cartItems().map(({ id, name, qty, price }) => ({ id, name, qty, price })), slot: Student.slot, status: "pending", placedAt: s.demoTime, mine: true });
    });
    Student.lastOrderId = id;
    Student.screen = "done";
  }
  if (act === "show-qr") { Student.lastOrderId = b.dataset.id; Student.screen = "done"; }
  if (act === "cancel") { Store.update((s) => { s.orders.find((o) => o.id === b.dataset.id).status = "cancelled"; }); }
  renderStudent();
});

Store.subscribe(renderStudent);
