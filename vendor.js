/* ============================================================
   vendor.js  —  PERSON B's FILE
   The stall's side: today's prep number, pre-order limit,
   incoming orders (accept / decline / ready / collected),
   and last week's prepared-vs-sold chart.
   Draws into <div id="vendor-app"> in index.html.
   ============================================================ */

const Vendor = { stallId: "caipng", chart: null, verifyFor: null, verifyMsg: "" };

const vendorRoot = () => document.getElementById("vendor-app");

function vendorStatusPill(status) {
  const label = { pending: "New", accepted: "Accepted", ready: "On shelf", collected: "Collected", declined: "Declined", cancelled: "Cancelled by student", noshow: "No-show", voucher: "Voucher issued" }[status];
  return `<span class="pill pill-${status}">${label}</span>`;
}

function prepCard(st) {
  const f = prepForecast(st);
  const s = Store.get();
  const locked = st.type === "batch" && toMin(s.demoTime) >= toMin(RULES.batchCutoff);
  const unit = st.type === "batch" ? "trays" : "batches of ingredients";
  return `
  <section class="card prep">
    <div class="prep-top">
      <div>
        <p class="eyebrow">Today's lunch · ${locked ? `final, locked at ${RULES.batchCutoff}` : st.type === "batch" ? `updates until ${RULES.batchCutoff}` : "updates live"}</p>
        <p class="big num">${f.trays} <span>${unit}</span></p>
        <p class="muted num">${f.cooked} portions (${f.trays} × ${st.trayPortions})</p>
      </div>
      <div class="saved ${f.saved ? "" : "zero"}">
        <p class="num big-sm">${f.saved ? `−${f.saved}` : "0"}</p>
        <p class="muted">portions vs usual prep of ${f.usualPrep}</p>
      </div>
    </div>
    <dl class="calc num">
      <div><dt>Usual demand (same weekday, 4 wks)</dt><dd>${st.history.demand}</dd></div>
      <div><dt>Pre-ordered so far</dt><dd>${f.pre}</dd></div>
      <div><dt>Extra above usual pre-orders (${st.history.preorders})</dt><dd>+${f.spike}</dd></div>
      <div class="sum"><dt>Suggested portions</dt><dd>${f.suggested}</dd></div>
    </dl>
    <p class="muted small">History sets the baseline. Pre-orders catch today's spikes. Rounded up to whole ${st.type === "batch" ? "trays" : "batches"}.</p>
  </section>`;
}

function controlsCard(st) {
  const s = Store.get();
  const cap = capFor(st);
  const used = preorderedPortions(st.id);
  return `
  <section class="card controls">
    <div class="ctrl">
      <label for="cap-input">Pre-order limit</label>
      <div class="stepper">
        <button aria-label="Lower limit" data-vact="cap" data-d="-5">−</button>
        <span class="num" id="cap-input">${cap}</span>
        <button aria-label="Raise limit" data-vact="cap" data-d="5">+</button>
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
  const open = orders.filter((o) => order.includes(o.status));
  const closed = orders.filter((o) => !order.includes(o.status));
  const row = (o) => `
    <li class="v-order ${o.mine ? "is-new" : ""}">
      <div class="v-slot num">${o.slot}</div>
      <div class="v-body">
        <div class="row"><span><strong class="num">${o.id}</strong> ${o.items.map((i) => `${i.qty} × ${i.name}`).join(", ")}</span>${vendorStatusPill(o.status)}</div>
        ${Vendor.verifyFor === o.id ? `
          <form class="verify" data-id="${o.id}">
            <label for="code-${o.id}">Student's 4-digit code</label>
            <input id="code-${o.id}" inputmode="numeric" maxlength="4" autocomplete="off" placeholder="0000">
            <button class="btn sm" type="submit">Confirm</button>
            <button class="btn btn-ghost sm" type="button" data-vact="verify-cancel">Back</button>
            ${Vendor.verifyMsg ? `<p class="err small">${Vendor.verifyMsg}</p>` : ""}
          </form>` : `
        <div class="row-actions">
          ${o.status === "pending" ? `<button class="btn sm" data-vact="set" data-id="${o.id}" data-s="accepted">Accept</button><button class="btn btn-ghost sm" data-vact="set" data-id="${o.id}" data-s="declined">Decline</button>` : ""}
          ${o.status === "accepted" ? `<button class="btn sm" data-vact="set" data-id="${o.id}" data-s="ready">Put on shelf</button><button class="btn btn-ghost sm" data-vact="set" data-id="${o.id}" data-s="voucher">Can't make it (voucher)</button>` : ""}
          ${o.status === "ready" ? `<button class="btn sm" data-vact="verify" data-id="${o.id}">Check code</button><button class="btn btn-ghost sm" data-vact="set" data-id="${o.id}" data-s="noshow">Mark no-show</button>` : ""}
        </div>`}
      </div>
    </li>`;
  return `
  <section class="card">
    <div class="row"><h3>Pre-orders</h3><span class="muted small num">${open.length} open</span></div>
    ${open.length ? `<ul class="v-orders">${open.map(row).join("")}</ul>` : `<p class="muted">No open pre-orders. New ones appear here as students order.</p>`}
    ${closed.length ? `<details><summary class="small">Finished (${closed.length})</summary><ul class="v-orders">${closed.map(row).join("")}</ul></details>` : ""}
  </section>`;
}

function chartCard() {
  return `
  <section class="card">
    <div class="row"><h3>Last week: prepared vs sold</h3><span class="muted small">Sample data</span></div>
    <div class="chart-box"><canvas id="week-chart" aria-label="Portions prepared and sold, last five weekdays"></canvas></div>
    <p class="muted small">The gap is food cooked but not sold. Logging it each day improves the next forecast.</p>
  </section>`;
}

function renderVendor() {
  const root = vendorRoot();
  if (!root) return;
  const st = stallById(Vendor.stallId);
  const openEl = root.querySelector("details");
  const wasOpen = openEl && openEl.open;
  root.innerHTML = `
    <div class="v-head">
      <div>
        <p class="eyebrow">Stall dashboard</p>
        <label class="sr" for="stall-pick">Stall</label>
        <select id="stall-pick" data-vact="stall">
          ${STALLS.map((s) => `<option value="${s.id}" ${s.id === st.id ? "selected" : ""}>${s.name}</option>`).join("")}
        </select>
      </div>
      <span class="tag tag-${st.type}">${st.type === "batch" ? "Batch-cooked" : "Made to order"}</span>
    </div>
    <div class="v-grid">
      <div class="v-col">${prepCard(st)}${controlsCard(st)}${chartCard()}</div>
      <div class="v-col">${ordersCard(st)}</div>
    </div>`;
  if (wasOpen) { const d = root.querySelector("details"); if (d) d.open = true; }
  drawChart(st);
}

function drawChart(st) {
  const canvas = document.getElementById("week-chart");
  if (!canvas || !window.Chart) return;
  if (Vendor.chart) Vendor.chart.destroy();
  const css = getComputedStyle(document.documentElement);
  const c = (v) => css.getPropertyValue(v).trim();
  Vendor.chart = new Chart(canvas, {
    type: "bar",
    data: {
      labels: WEEK_LABELS,
      datasets: [
        { label: "Prepared", data: st.week.prepared, backgroundColor: c("--line-strong"), borderRadius: 3 },
        { label: "Sold", data: st.week.sold, backgroundColor: c("--accent"), borderRadius: 3 },
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
  if (act === "cap") Store.update((s) => { s.caps[st.id] = Math.max(0, capFor(st) + Number(b.dataset.d)); });
  if (act === "soldout") Store.update((s) => { s.soldOut[st.id] = !s.soldOut[st.id]; });
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
