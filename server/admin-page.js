/* =============================================================
   The editors' page for "List your organisation" (served at /admin).
   Sign in with ADMIN_KEY, check each pending submission, correct it if
   needed, then approve (it appears on the site within about 5 minutes)
   or reject it. Everything visitors typed is shown as plain text.
   ============================================================= */

export const ADMIN_HTML = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Listings · editors</title>
<link rel="stylesheet" href="/admin.css">
</head>
<body>
<main>
  <header>
    <p class="kicker">Jñāna Vṛkṣa · editors</p>
    <h1>Organisation listings</h1>
    <p class="lede">Organisations that asked to be listed. Nothing appears on the site until you approve it; approved listings show up within about five minutes.</p>
  </header>

  <form id="signin" class="card signin" autocomplete="on">
    <label for="key">Editors' password</label>
    <div class="row">
      <input id="key" name="password" type="password" autocomplete="current-password" required>
      <button type="submit" class="primary">Sign in</button>
    </div>
    <p class="status" id="signin-status" role="status"></p>
  </form>

  <section id="board" hidden>
    <nav class="tabs" role="tablist">
      <button type="button" role="tab" data-status="pending" aria-selected="true">Pending <span></span></button>
      <button type="button" role="tab" data-status="approved" aria-selected="false">Approved <span></span></button>
      <button type="button" role="tab" data-status="rejected" aria-selected="false">Rejected <span></span></button>
      <button type="button" class="link" id="refresh">Refresh</button>
      <button type="button" class="link" id="signout">Sign out</button>
    </nav>
    <details class="card checklist">
      <summary>How to check a listing</summary>
      <ol>
        <li>Open its website and the pages it gives: is it a real organisation working in Indian Knowledge Systems?</li>
        <li>Does the person's e-mail belong to the organisation (same domain as the website), or is their role shown on its site? If not, write to them or the organisation's listed contact first.</li>
        <li>Is it already on the site under another name? Search the site before approving.</li>
        <li>Phone and e-mail must be the organisation's own office contacts, not someone's personal number.</li>
        <li>Set its location: paste a Google Maps link for its campus, or tick "approximate" if it is placed at its town.</li>
      </ol>
    </details>
    <p class="status" id="board-status" role="status"></p>
    <div id="list"></div>
  </section>
</main>
<script src="/admin.js"></script>
</body>
</html>`;

export const ADMIN_CSS = `
:root { --paper:#ffefd4; --card:#fff7e8; --ink:#3f2414; --ink-soft:#6e4c33; --ink-faint:#7f6247; --gold:#c09452; --line:rgba(176,132,70,.45); --accent:#b0652a; --ok:#3f7a3a; --bad:#9a3d12; }
* { box-sizing: border-box; }
body { margin: 0; background: var(--paper); color: var(--ink); font: 16px/1.5 system-ui, -apple-system, "Segoe UI", sans-serif; }
main { max-width: 980px; margin: 0 auto; padding: 32px 16px 80px; }
.kicker { margin: 0; text-transform: uppercase; letter-spacing: .12em; font-size: .78rem; color: var(--accent); }
h1 { margin: 4px 0 6px; font: 400 2rem Georgia, serif; }
.lede { margin: 0 0 20px; color: var(--ink-soft); max-width: 680px; }
.card { background: var(--card); border: 1px solid var(--line); border-radius: 12px; padding: 16px 18px; margin: 0 0 14px; }
.signin { max-width: 460px; }
.signin label { display: block; font-weight: 600; margin-bottom: 6px; }
.row { display: flex; gap: 8px; flex-wrap: wrap; }
.row input { flex: 1 1 200px; }
input, select, textarea { width: 100%; padding: 8px 10px; border: 1px solid var(--line); border-radius: 8px; background: #fffaf0; color: var(--ink); font: inherit; }
textarea { min-height: 90px; resize: vertical; }
input:focus-visible, select:focus-visible, textarea:focus-visible, button:focus-visible, a:focus-visible, summary:focus-visible { outline: 2px solid var(--ink-soft); outline-offset: 1px; }
button { padding: 8px 14px; border: 1px solid var(--line); border-radius: 999px; background: var(--card); color: var(--ink); font: 500 .92rem inherit; cursor: pointer; }
button.primary { background: var(--ok); border-color: var(--ok); color: #fff; }
button.danger { color: var(--bad); border-color: rgba(154,61,18,.45); }
button.link { border: 0; background: none; text-decoration: underline; color: var(--ink-soft); padding: 8px 6px; }
button:disabled { opacity: .5; cursor: progress; }
.status { min-height: 1.3em; margin: 8px 0 0; color: var(--bad); font-size: .92rem; }
.status.ok { color: var(--ok); }
.tabs { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 14px; align-items: center; }
.tabs [role=tab][aria-selected=true] { background: var(--ink); color: var(--card); border-color: var(--ink); }
.tabs span { opacity: .8; }
.checklist summary { cursor: pointer; font-weight: 600; }
.checklist ol { margin: 10px 0 0; padding-left: 20px; color: var(--ink-soft); }
.item h2 { margin: 0; font: 400 1.35rem Georgia, serif; }
.meta { margin: 2px 0 10px; color: var(--ink-faint); font-size: .9rem; }
.badges { display: flex; flex-wrap: wrap; gap: 6px; margin: 0 0 10px; }
.badge { padding: 2px 10px; border-radius: 999px; font-size: .8rem; border: 1px solid var(--line); }
.badge.good { color: var(--ok); border-color: rgba(63,122,58,.5); }
.badge.warn { color: var(--bad); border-color: rgba(154,61,18,.45); }
.cols { display: grid; grid-template-columns: 1.4fr 1fr; gap: 18px; }
.who { background: #fffaf0; border: 1px dashed var(--line); border-radius: 10px; padding: 10px 12px; font-size: .92rem; }
.who h3, .item h3 { margin: 0 0 6px; font-size: .8rem; text-transform: uppercase; letter-spacing: .1em; color: var(--ink-faint); }
.who p { margin: 2px 0; overflow-wrap: anywhere; }
.who ul { margin: 6px 0 0; padding-left: 18px; }
.who a { color: var(--ink); overflow-wrap: anywhere; }
.fields { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 12px; }
.fields label { display: flex; flex-direction: column; gap: 3px; font-size: .84rem; color: var(--ink-soft); }
.fields .wide { grid-column: 1 / -1; }
.fields .check { flex-direction: row; align-items: center; gap: 8px; }
.fields .check input { width: auto; }
.actions { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 14px; align-items: center; }
.empty { color: var(--ink-faint); }
@media (max-width: 720px) { .cols, .fields { grid-template-columns: 1fr; } }
`;

export const ADMIN_JS = `(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var KEY = "iks-admin-key";
  var key = "";
  try { key = sessionStorage.getItem(KEY) || ""; } catch (e) {}
  var all = [], tab = "pending";

  var BRANCHES = [["veda","Veda & Darśana"],["language","Language & Literature"],["arts","Arts & Aesthetics"],["health","Health & Wellbeing"],["science","Science & Technology"],["heritage","Heritage & Manuscripts"]];
  var KINDS = [["institution","IKS centre / institution"],["ori","Oriental institute / manuscript library"],["gurukul","Gurukul / Veda pāṭhaśālā"],["ayush","Āyurveda & Yoga institute"],["museum","Museum"],["archive","Archive"],["heritage","Heritage site"],["tradition","Living tradition"]];
  var STATES = ${JSON.stringify(["Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka", "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"])};
  var RELATION = { staff: "Works at the organisation", member: "Member / student / volunteer", other: "Someone else who knows it" };

  function el(tag, attrs, kids) {
    var e = document.createElement(tag);
    if (attrs) for (var k in attrs) {
      if (k === "text") e.textContent = attrs[k];
      else if (k === "class") e.className = attrs[k];
      else if (attrs[k] !== null && attrs[k] !== undefined && attrs[k] !== false) e.setAttribute(k, attrs[k] === true ? "" : attrs[k]);
    }
    (kids || []).forEach(function (c) { if (c) e.appendChild(typeof c === "string" ? document.createTextNode(c) : c); });
    return e;
  }
  // only real web links become links
  function link(url, text) {
    if (!/^https?:\\/\\//i.test(url || "")) return document.createTextNode(text || url || "");
    return el("a", { href: url, target: "_blank", rel: "noopener noreferrer", text: text || url });
  }
  function host(u) { try { return new URL(u).hostname.replace(/^www\\./, ""); } catch (e) { return ""; } }

  function api(path, body) {
    return fetch(path, {
      method: body ? "POST" : "GET",
      headers: Object.assign({ "Authorization": "Bearer " + key }, body ? { "Content-Type": "application/json" } : {}),
      body: body ? JSON.stringify(body) : undefined
    }).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (d) {
        if (r.status === 401) { signOut("Wrong password, or too many attempts: wait 15 minutes."); throw new Error("auth"); }
        if (!r.ok) throw new Error(d.error || ("Error " + r.status));
        return d;
      });
    });
  }

  function signOut(msg) {
    key = "";
    try { sessionStorage.removeItem(KEY); } catch (e) {}
    $("#board").hidden = true; $("#signin").hidden = false;
    $("#signin-status").textContent = msg || "";
  }
  $("#signin").addEventListener("submit", function (e) {
    e.preventDefault();
    key = $("#key").value;
    $("#signin-status").textContent = "Checking…";
    load().then(function () {
      try { sessionStorage.setItem(KEY, key); } catch (e) {}
      $("#key").value = "";
    });
  });
  $("#signout").addEventListener("click", function () { signOut(""); });
  $("#refresh").addEventListener("click", function () { load(); });
  Array.prototype.forEach.call(document.querySelectorAll("[role=tab]"), function (b) {
    b.addEventListener("click", function () { tab = b.dataset.status; render(); });
  });

  function load() {
    return api("/admin/api/listings").then(function (d) {
      all = d.listings || [];
      $("#signin").hidden = true; $("#board").hidden = false;
      $("#signin-status").textContent = "";
      render();
    }).catch(function (err) {
      if (err.message !== "auth") ($("#board").hidden ? $("#signin-status") : $("#board-status")).textContent = err.message;
    });
  }

  function render() {
    ["pending", "approved", "rejected"].forEach(function (s) {
      var b = $("[data-status=" + s + "]");
      b.setAttribute("aria-selected", String(s === tab));
      $("span", b).textContent = "(" + all.filter(function (r) { return r.status === s; }).length + ")";
    });
    var list = $("#list");
    list.textContent = "";
    var rows = all.filter(function (r) { return r.status === tab; });
    if (!rows.length) list.appendChild(el("p", { class: "empty", text: tab === "pending" ? "Nothing waiting for a check." : "None yet." }));
    rows.forEach(function (r) { list.appendChild(card(r)); });
  }

  function select(name, options, value) {
    var s = el("select", { name: name });
    options.forEach(function (o) {
      var v = Array.isArray(o) ? o[0] : o, t = Array.isArray(o) ? o[1] : o;
      var opt = el("option", { value: v, text: t });
      if (v === value) opt.selected = true;
      s.appendChild(opt);
    });
    return s;
  }
  function field(label, input, wide) { return el("label", { class: wide ? "wide" : null }, [label, input]); }

  function card(r) {
    var p = r.place, s = r.submitter || {};
    var site = host(p.url), mailDomain = (s.email || "").split("@")[1] || "";
    var badges = [];
    if (site && mailDomain && (mailDomain.toLowerCase() === site || mailDomain.toLowerCase().endsWith("." + site) || site.endsWith("." + mailDomain.toLowerCase())))
      badges.push(["good", "E-mail is on the organisation's own domain"]);
    else if (/gmail|yahoo|outlook|hotmail|rediff|proton|icloud/i.test(mailDomain)) badges.push(["warn", "Personal e-mail address: confirm with the organisation"]);
    else badges.push(["warn", "E-mail domain differs from the website"]);
    if (p.lat == null) badges.push(["warn", "No map location yet"]);
    else if (p.approx) badges.push(["", "Placed at its town (approximate)"]);
    var dup = all.filter(function (o) { return o.id !== r.id && o.status !== "rejected" && o.place.name.toLowerCase() === p.name.toLowerCase(); });
    if (dup.length) badges.push(["warn", "Same name as another submission"]);

    var q = encodeURIComponent(p.name + " " + p.city + " " + p.state);
    var who = el("div", { class: "who" }, [
      el("h3", { text: "Submitted by (private)" }),
      el("p", {}, [el("b", { text: s.name || "" }), s.role ? " · " + s.role : ""]),
      el("p", { text: RELATION[s.relation] || "" }),
      el("p", {}, [s.email ? link("mailto:" + s.email, s.email) : ""]),
      s.phone ? el("p", { text: "Phone: " + s.phone }) : null,
      s.note ? el("p", { text: "Note: " + s.note }) : null,
      el("h3", { text: "Check it" }),
      el("ul", {}, [
        p.url ? el("li", {}, [link(p.url, "Website: " + (site || p.url))]) : null,
        el("li", {}, [link("https://www.google.com/search?q=" + q, "Search the web for it")]),
        el("li", {}, [link("https://www.google.com/maps/search/?api=1&query=" + q, "Find it on Google Maps")]),
        p.mapLink ? el("li", {}, [link(p.mapLink, "Map link they gave")]) : null
      ].concat((p.links || []).map(function (u) { return el("li", {}, [link(u, "Page they gave: " + host(u))]); })))
    ]);

    var f = el("div", { class: "fields" });
    var inputs = {};
    function add(name, label, node, wide) { inputs[name] = node; f.appendChild(field(label, node, wide)); }
    add("name", "Name", el("input", { value: p.name, maxlength: 160 }), true);
    add("kind", "Kind", select("kind", KINDS, p.kind));
    add("branch", "Branch", select("branch", BRANCHES, p.branch));
    add("host", "Host / campus (optional)", el("input", { value: p.host || "", maxlength: 160 }));
    add("founded", "Founded (optional)", el("input", { value: p.founded || "", maxlength: 20 }));
    var about = el("textarea", { maxlength: 1200 }); about.value = p.about;
    add("about", "Description", about, true);
    add("study", "Main areas of work (optional)", el("input", { value: p.study || "", maxlength: 300 }), true);
    add("city", "Town / city", el("input", { value: p.city, maxlength: 80 }));
    add("state", "State", select("state", STATES, p.state));
    add("url", "Website", el("input", { value: p.url || "", type: "url", maxlength: 300 }), true);
    add("address", "Office address", el("input", { value: (p.contact || {}).address || "", maxlength: 300 }), true);
    add("phone", "Office phone", el("input", { value: (p.contact || {}).phone || "", maxlength: 60 }));
    add("email", "Office e-mail", el("input", { value: (p.contact || {}).email || "", maxlength: 120 }));
    add("leadName", "Person in charge", el("input", { value: (p.lead || {}).name || "", maxlength: 120 }));
    add("leadRole", "Their role", el("input", { value: (p.lead || {}).role || "", maxlength: 120 }));
    var links = el("textarea", { maxlength: 2600 }); links.value = (p.links || []).join("\\n");
    add("links", "Pages that show it exists (one per line)", links, true);
    add("mapLink", "Map link (Google Maps / OpenStreetMap; sets the location)", el("input", { value: p.mapLink || "", maxlength: 500 }), true);
    add("lat", "Latitude", el("input", { value: p.lat == null ? "" : p.lat, inputmode: "decimal" }));
    add("lng", "Longitude", el("input", { value: p.lng == null ? "" : p.lng, inputmode: "decimal" }));
    var approx = el("input", { type: "checkbox" }); approx.checked = !!p.approx; inputs.approx = approx;
    f.appendChild(el("label", { class: "check wide" }, [approx, "Approximate: placed at its town, not its campus"]));
    var note = el("textarea", { maxlength: 1000, placeholder: "For the editors only: what you checked, who you contacted" }); note.value = r.editorNote || "";
    f.appendChild(field("Editors' note (private)", note, true));

    function edited() {
      var o = {};
      for (var k in inputs) o[k] = inputs[k].type === "checkbox" ? inputs[k].checked : inputs[k].value;
      // a new map link replaces the old coordinates
      if (o.mapLink !== (p.mapLink || "") && o.lat === String(p.lat == null ? "" : p.lat)) { o.lat = ""; o.lng = ""; }
      if (o.lat === "" || o.lng === "") { o.lat = null; o.lng = null; }
      return o;
    }
    var status = el("p", { class: "status", role: "status" });
    function act(action, confirmText) {
      if (confirmText && !confirm(confirmText)) return;
      var btns = actions.querySelectorAll("button");
      Array.prototype.forEach.call(btns, function (b) { b.disabled = true; });
      status.className = "status"; status.textContent = "Saving…";
      api("/admin/api/decide", { id: r.id, action: action, place: action === "delete" ? undefined : edited(), editorNote: note.value })
        .then(function (d) {
          if (action === "delete") all = all.filter(function (o) { return o.id !== r.id; });
          else all = all.map(function (o) { return o.id === r.id ? d.record : o; });
          $("#board-status").className = "status ok";
          $("#board-status").textContent = ({ approve: "Approved: it will appear on the site within about 5 minutes.", reject: "Rejected.", pending: "Moved back to pending.", save: "Changes saved.", delete: "Deleted." })[action] + " " + d.published + " listing(s) are live.";
          render();
        })
        .catch(function (err) {
          Array.prototype.forEach.call(btns, function (b) { b.disabled = false; });
          status.textContent = err.message === "auth" ? "" : err.message;
        });
    }
    var actions = el("div", { class: "actions" });
    function btn(text, cls, fn) { var b = el("button", { type: "button", class: cls, text: text }); b.addEventListener("click", fn); actions.appendChild(b); }
    if (r.status !== "approved") btn("Approve and publish", "primary", function () { act("approve"); });
    if (r.status === "approved") btn("Save and update on the site", "primary", function () { act("approve"); });
    else btn("Save changes", "", function () { act("save"); });
    if (r.status !== "rejected") btn(r.status === "approved" ? "Unpublish (reject)" : "Reject", "danger", function () { act("reject", r.status === "approved" ? "Take this listing off the site?" : null); });
    if (r.status !== "pending") btn("Move back to pending", "", function () { act("pending"); });
    btn("Delete for good", "danger", function () { act("delete", "Delete this submission permanently? This can't be undone."); });

    var kindLabel = (KINDS.find(function (k) { return k[0] === p.kind; }) || [0, p.kind])[1];
    return el("article", { class: "card item" }, [
      el("h2", { text: p.name }),
      el("p", { class: "meta", text: kindLabel + " · " + p.city + ", " + p.state + " · sent " + new Date(r.at).toLocaleString() + (r.decidedAt ? " · decided " + new Date(r.decidedAt).toLocaleDateString() : "") }),
      el("div", { class: "badges" }, badges.map(function (b) { return el("span", { class: "badge " + b[0], text: b[1] }); })),
      el("div", { class: "cols" }, [el("div", {}, [el("h3", { text: "What will be published (edit before approving)" }), f]), who]),
      actions, status
    ]);
  }

  if (key) load(); else $("#key").focus();
})();`;
