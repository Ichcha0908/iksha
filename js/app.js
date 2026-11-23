/* =============================================================
   Jñāna Vṛkṣa — interactive 3D tree of Indian Knowledge Systems
   ============================================================= */
(function () {
  "use strict";

  const BRANCHES = window.IKS.branches;
  const ANCHORS = window.STATE_ANCHORS;
  const STATE_NAMES = Object.fromEntries(window.INDIA_MAP.states.map(s => [s.id, s.name]));
  // language (js/i18n.js): t() for interface messages, stateName() for display
  const I18N = window.IKS_I18N || { lang: "en", hi: false, t: (s, p) => (p ? s.replace(/\{(\w+)\}/g, (m, k) => p[k]) : s), state: n => n, city: n => n };
  const t = I18N.t;
  const stateName = n => I18N.state(n);
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = sel => document.querySelector(sel);
  const SVGNS = "http://www.w3.org/2000/svg";

  /* ---------------------------------------------------------
     Motion (the framework-agnostic build of Framer Motion)
     drives every DOM, SVG and tweened 3D animation on the page.
  --------------------------------------------------------- */
  if (!window.Motion) {
    // vendor/motion.js is missing: un-hide the content and stop here
    document.documentElement.classList.remove("motion");
    throw new Error("vendor/motion.js did not load");
  }
  const { animate, inView, stagger, hover, press } = window.Motion;
  const EASE = [0.22, 1, 0.36, 1];
  const INSTANT = { duration: 0 };
  /** returns the given transition, or an instant one for reduced-motion users */
  const tx = opts => (reduceMotion ? INSTANT : opts);
  const SPRING = { type: "spring", stiffness: 320, damping: 24 };
  const SOFT_SPRING = { type: "spring", stiffness: 170, damping: 26 };

  /** the value a CSS property has when no inline style is applied */
  function restingValue(el, prop) {
    const cur = el.style[prop];
    el.style[prop] = "";
    const v = getComputedStyle(el)[prop];
    el.style[prop] = cur;
    return v;
  }

  /**
   * Smooth hover + press feedback for an interactive element.
   * opts.lift   – pixels to raise on hover (0 to skip transforms)
   * opts.shadow – hover shadow geometry, coloured with the element's --c
   * opts.border – animate the border towards --c
   * opts.bg     – background to fade to on hover
   * opts.press  – false to skip the press squish (e.g. cards that contain links)
   */
  function interactive(el, opts = {}) {
    const { lift = -3, shadow = "0px 12px 24px -14px", border = true, bg = null, rotate = 0, press: squish = true } = opts;
    const accent = () => getComputedStyle(el).getPropertyValue("--c").trim() || "#c09452";
    const skipTransform = lift === 0 && rotate === 0;
    let hovering = false;
    // colours for the hovered look; a pressed (selected) element keeps its stylesheet colours
    const hoverColours = () => {
      const pressed = el.getAttribute("aria-pressed") === "true";
      const to = {};
      if (border) to.borderColor = pressed ? restingValue(el, "borderColor") : accent();
      if (bg) to.backgroundColor = pressed ? restingValue(el, "backgroundColor") : bg;
      return to;
    };
    // clicking can toggle aria-pressed while the pointer is still over the element:
    // move straight to the right colours instead of keeping the stale hover ones
    if (el.hasAttribute("aria-pressed")) {
      el.addEventListener("click", () => {
        if (el.matches(":hover")) {
          animate(el, hoverColours(), tx({ duration: 0.25, ease: EASE }));
        } else {
          // keyboard / touch: drop any leftover hover colours and use the stylesheet's
          ["borderColor", "backgroundColor"].forEach(p => { el.style[p] = ""; });
        }
      });
    }
    hover(el, () => {
      hovering = true;
      const to = hoverColours();
      if (!skipTransform) { to.y = lift; if (rotate) to.rotate = rotate; }
      if (shadow) to.boxShadow = `${accent()} ${shadow}`;
      animate(el, to, tx(SPRING));
      return () => {
        hovering = false;
        const back = {};
        if (!skipTransform) { back.y = 0; if (rotate) back.rotate = 0; }
        if (shadow) back.boxShadow = restingValue(el, "boxShadow");
        if (border) back.borderColor = restingValue(el, "borderColor");
        if (bg) back.backgroundColor = restingValue(el, "backgroundColor");
        animate(el, back, tx({ duration: 0.35, ease: EASE })).then(() => {
          // hand the resting look back to the stylesheet (it changes with aria-pressed)
          if (!hovering) ["boxShadow", "borderColor", "backgroundColor"].forEach(p => { el.style[p] = ""; });
        });
      };
    });
    if (!skipTransform && squish) {
      press(el, () => {
        animate(el, { scale: 0.96 }, tx({ duration: 0.12 }));
        return () => animate(el, { scale: 1 }, tx(SPRING));
      });
    }
  }

  /** staggered fade-and-rise for a group of elements */
  function reveal(els, { delay = 0, gap = 0.07, y = 16, duration = 0.7 } = {}) {
    return animate(els, { opacity: [0, 1], y: [y, 0] },
      tx({ duration, ease: EASE, delay: stagger(gap, { startDelay: delay }) }));
  }

  const state = {
    focused: null,        // focused branch index
    selected: null,       // { b, c } of the open centre
    panelOpen: false
  };

  /* ---------------------------------------------------------
     Background mandala (built once, rotates slowly via CSS)
  --------------------------------------------------------- */
  function buildMandala() {
    const svg = $("#mandala");
    const parts = [];
    const ring = (r, cls = "m-line") => parts.push(`<circle r="${r}" class="${cls}"/>`);
    const petals = (n, r0, r1, w, cls = "m-line", rot = 0) => {
      for (let i = 0; i < n; i++) {
        const a = (i / n) * 360 + rot;
        parts.push(`<path class="${cls}" transform="rotate(${a})" d="M0 ${-r0} C${w} ${-(r0 + (r1 - r0) * 0.35)} ${w * 0.7} ${-(r0 + (r1 - r0) * 0.8)} 0 ${-r1} C${-w * 0.7} ${-(r0 + (r1 - r0) * 0.8)} ${-w} ${-(r0 + (r1 - r0) * 0.35)} 0 ${-r0} Z"/>`);
      }
    };
    const dots = (n, r, size) => {
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2;
        parts.push(`<circle class="m-dot" cx="${(Math.cos(a) * r).toFixed(1)}" cy="${(Math.sin(a) * r).toFixed(1)}" r="${size}"/>`);
      }
    };
    // inner yantra: interlocking triangles
    const tri = (r, flip) => {
      const pts = [0, 1, 2].map(k => {
        const a = (k / 3) * Math.PI * 2 + (flip ? Math.PI / 2 : -Math.PI / 2);
        return `${(Math.cos(a) * r).toFixed(1)},${(Math.sin(a) * r).toFixed(1)}`;
      });
      parts.push(`<polygon class="m-fine" points="${pts.join(" ")}"/>`);
    };
    ring(40); tri(110, false); tri(110, true); tri(80, false); tri(80, true);
    ring(118); petals(8, 118, 175, 34);
    ring(180, "m-fine"); dots(48, 192, 1.8);
    petals(16, 200, 262, 24, "m-line", 11.25);
    ring(268); ring(276, "m-fine");
    // a ring of Sanskrit text
    parts.push(`<defs><path id="m-text-path" d="M0 -300 A300 300 0 1 1 -0.1 -300"/></defs>`);
    parts.push(`<text class="m-text"><textPath href="#m-text-path">ॐ असतो मा सद्गमय · तमसो मा ज्योतिर्गमय · मृत्योर्मा अमृतं गमय · ॐ शान्तिः शान्तिः शान्तिः ·</textPath></text>`);
    ring(326, "m-fine");
    petals(32, 334, 392, 16, "m-fine");
    dots(32, 404, 2.4);
    ring(416, "m-fine");
    // outer square gateways (bhupura)
    const g = 452, d = 30;
    parts.push(`<path class="m-fine" d="M${-g} ${-g} H${-d} V${-g - 18} H${d} V${-g} H${g} V${-d} H${g + 18} V${d} H${g} V${g} H${d} V${g + 18} H${-d} V${g} H${-g} V${d} H${-g - 18} V${-d} H${-g} Z"/>`);
    svg.innerHTML = parts.join("");
    if (!reduceMotion) animate(svg, { rotate: 360 }, { duration: 240, ease: "linear", repeat: Infinity });
  }

  /* ---------------------------------------------------------
     Branch chips + branch info
  --------------------------------------------------------- */
  function buildChips() {
    const nav = $("#branches");
    BRANCHES.forEach((b, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "chip";
      btn.style.setProperty("--c", b.color);
      btn.setAttribute("aria-pressed", "false");
      btn.innerHTML = `<span class="dot"></span>${b.name}<span class="count">${b.centres.length}</span>`;
      btn.addEventListener("click", () => focusBranch(state.focused === i ? null : i, { reveal: true }));
      nav.appendChild(btn);
      interactive(btn, { shadow: "0px 10px 22px -12px", bg: "#fffaf0" });
    });
  }

  /* ---------------------------------------------------------
     Leaf finder: every leaf of a branch (or of the whole tree), searchable
     and filterable by kind and state, a page at a time. With hundreds of
     small leaves this is the quick way to any of them; hovering an entry
     lights its leaf up on the tree.
  --------------------------------------------------------- */
  const GROUPS = window.IKS.leafGroups;
  const groupById = Object.fromEntries(GROUPS.map(g => [g.id, g]));
  const FIND_PAGE = 24;
  const finder = { q: "", group: "all", state: "all", shown: FIND_PAGE };
  const fold = v => String(v || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const ALL_LEAVES = BRANCHES.flatMap((b, bi) => b.centres.map((c, ci) => ({ b, bi, c, ci })));
  ALL_LEAVES.forEach(x => {
    const st = STATE_NAMES[x.c.state] || x.c.stateName;
    x.hay = fold([x.c.name, x.c.type, x.c.en && x.c.en.type, x.c.city, st, stateName(st), x.c.place && x.c.place.host,
      (x.c.people || []).map(p => p.name).join(" ")].join(" "));
  });

  function setFinder(patch) {
    Object.assign(finder, { shown: FIND_PAGE }, patch);
  }

  function leafButton(x, showBranch) {
    const g = groupById[x.c.group] || GROUPS[0];
    return `<li><button type="button" class="leaf-btn${x.c.minor ? " small" : ""}" data-b="${x.bi}" data-c="${x.ci}" style="--c:${x.b.color};--g:${g.color}">
      <svg aria-hidden="true"><use href="#leaf-icon"/></svg>
      <span><b>${esc(x.c.name)}</b><small>${showBranch ? `${esc(x.b.name)} · ` : ""}${esc(x.c.type)} · ${esc(placeLine(x.c))}</small></span>
    </button></li>`;
  }

  /* the finder's HTML for a pool of leaves (one branch, or the whole tree) */
  function finderHTML(pool, wholeTree) {
    const counts = {};
    pool.forEach(x => { counts[x.c.group] = (counts[x.c.group] || 0) + 1; });
    const groups = GROUPS.filter(g => counts[g.id]);
    const states = {};
    pool.forEach(x => { const n = STATE_NAMES[x.c.state] || x.c.stateName; if (n) states[n] = (states[n] || 0) + 1; });
    const stateOpts = Object.keys(states).sort((a, b) => stateName(a).localeCompare(stateName(b), I18N.lang))
      .map(n => `<option value="${esc(n)}"${finder.state === n ? " selected" : ""}>${esc(stateName(n))} (${states[n]})</option>`).join("");
    return `
      <div class="finder" role="search">
        <div class="lf-row">
          <label class="lf-search"><span class="sr-only">${t("Search leaves")}</span>
            <svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5 21 21"/></svg>
            <input type="search" class="lf-q" value="${esc(finder.q)}" autocomplete="off"
              placeholder="${wholeTree ? t("Search all {n} leaves: a name, town or state", { n: pool.length }) : t("Search this branch's {n} leaves", { n: pool.length })}">
          </label>
          <label class="lf-state"><span class="sr-only">${t("State")}</span>
            <select class="lf-st"><option value="all">${t("All states")}</option>${stateOpts}</select>
          </label>
        </div>
        ${groups.length > 1 ? `<div class="lf-groups" role="group" aria-label="${t("Kind of leaf")}">
          <button type="button" class="chip lf-g" data-g="all" aria-pressed="${finder.group === "all"}" style="--c:#8b6a3e"><span class="dot"></span>${t("All")}<span class="count">${pool.length}</span></button>
          ${groups.map(g => `<button type="button" class="chip lf-g" data-g="${g.id}" aria-pressed="${finder.group === g.id}" style="--c:${g.color}"><span class="dot"></span>${esc(g.label)}<span class="count">${counts[g.id]}</span></button>`).join("")}
        </div>` : ""}
        <p class="lf-count" aria-live="polite"></p>
        <ul class="leaf-list lf-list"></ul>
        <button type="button" class="near-btn lf-more" hidden></button>
      </div>`;
  }

  /* wire up a rendered finder: filtering, paging, hover-preview */
  function bindFinder(box, pool, { wholeTree = false } = {}) {
    const list = box.querySelector(".lf-list");
    const count = box.querySelector(".lf-count");
    const more = box.querySelector(".lf-more");
    const input = box.querySelector(".lf-q");
    const matches = () => {
      const words = fold(finder.q).split(/\s+/).filter(Boolean);
      return pool.filter(x =>
        (finder.group === "all" || x.c.group === finder.group) &&
        (finder.state === "all" || (STATE_NAMES[x.c.state] || x.c.stateName) === finder.state) &&
        words.every(w => x.hay.includes(w)));
    };
    function draw(fresh) {
      // the whole tree is only listed once there's something to look for
      const idle = wholeTree && !finder.q.trim() && finder.group === "all" && finder.state === "all";
      const found = idle ? [] : matches();
      const before = list.children.length;
      const shown = found.slice(0, finder.shown);
      if (fresh) list.innerHTML = shown.map(x => leafButton(x, wholeTree)).join("");
      else list.insertAdjacentHTML("beforeend", shown.slice(before).map(x => leafButton(x, wholeTree)).join(""));
      const added = Array.from(list.children).slice(fresh ? 0 : before);
      added.forEach(li => {
        const btn = li.firstElementChild;
        const b = +btn.dataset.b, c = +btn.dataset.c;
        btn.addEventListener("click", () => openCentre(b, c));
        const on = () => tree && tree.preview(b, c), off = () => tree && tree.preview(null);
        btn.addEventListener("pointerenter", on); btn.addEventListener("pointerleave", off);
        btn.addEventListener("focus", on); btn.addEventListener("blur", off);
        interactive(btn, { shadow: "0px 12px 24px -14px" });
      });
      reveal(added, { gap: 0.025, y: 10, duration: 0.4 });
      count.textContent = idle ? ""
        : found.length ? t(found.length === 1 ? "Showing {a} of {b} leaf" : "Showing {a} of {b} leaves", { a: shown.length, b: found.length })
        : t("No leaf matches. Try another word, kind or state.");
      const rest = found.length - shown.length;
      more.hidden = rest <= 0;
      more.textContent = t("Show {n} more", { n: Math.min(rest, FIND_PAGE) });
    }
    let timer = 0;
    input.addEventListener("input", () => {
      clearTimeout(timer);
      timer = setTimeout(() => { setFinder({ q: input.value }); draw(true); }, 120);
    });
    box.querySelector(".lf-st").addEventListener("change", e => { setFinder({ state: e.target.value }); draw(true); });
    box.querySelectorAll(".lf-g").forEach(btn => {
      btn.addEventListener("click", () => {
        setFinder({ group: btn.dataset.g });
        box.querySelectorAll(".lf-g").forEach(x => x.setAttribute("aria-pressed", String(x === btn)));
        draw(true);
      });
      interactive(btn, { lift: -2, shadow: "0px 8px 18px -12px", bg: "#fffaf0" });
    });
    more.addEventListener("click", () => { finder.shown += FIND_PAGE; draw(false); });
    interactive(more, { lift: -2, shadow: "0px 8px 16px -12px" });
    list.addEventListener("pointerleave", () => tree && tree.preview(null));
    draw(true);
  }

  function renderBranchInfo() {
    const box = $("#branch-info");
    const i = state.focused;
    if (tree) tree.preview(null);
    if (i === null) {
      box.innerHTML = `
        <div class="bi-inner bi-all">
          <p class="empty">${t("Choose a branch to see its leaves, or click any leaf on the tree. Every IKS place on this site is a leaf: search them all here.")}</p>
          ${finderHTML(ALL_LEAVES, true)}
        </div>`;
      bindFinder(box, ALL_LEAVES, { wholeTree: true });
      reveal(box.querySelectorAll(".empty, .finder > *:not([hidden])"), { duration: 0.5, gap: 0.05 });
      return;
    }
    const b = BRANCHES[i];
    const pool = ALL_LEAVES.filter(x => x.bi === i);
    const small = pool.filter(x => x.c.minor).length;
    box.innerHTML = `
      <div class="bi-inner" style="--c:${b.color}">
        <p class="bi-sa" lang="sa">${b.sanskrit}</p>
        <h2>${b.name}</h2>
        <p class="blurb">${b.blurb}</p>
        <p class="bi-stats">${small
          ? t("{a} IKS centres and {b} more places (gurukuls, institutes, heritage sites, traditions) grow on this branch. Large glowing leaves are IKS centres; the small leaves cluster on twigs by kind.", { a: pool.length - small, b: small })
          : t("{a} IKS centres grow on this branch.", { a: pool.length })}</p>
        ${finderHTML(pool, false)}
      </div>`;
    bindFinder(box, pool);
    reveal(box.querySelectorAll(".bi-sa, h2, .blurb, .bi-stats, .finder > *:not(.lf-list):not([hidden])"), { gap: 0.06 });
  }

  /* open a branch's finder on one kind of leaf (from the panel's "browse all" button) */
  function browseBranch(bi, group) {
    setFinder({ q: "", group, state: "all" });
    if (state.focused !== bi) { state.focused = bi; syncChips(); if (tree) tree.focus(bi); }
    renderBranchInfo();
    closePanel();
    $("#branch-info").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  }

  function syncChips() {
    document.querySelectorAll(".chip").forEach((c, i) =>
      c.setAttribute("aria-pressed", String(state.focused === i)));
    document.querySelectorAll(".blabel").forEach((l, i) =>
      l.classList.toggle("active", state.focused === i));
  }

  const mqMobile = window.matchMedia("(max-width: 720px)");

  function focusBranch(i, { reveal = false } = {}) {
    if (i !== state.focused) setFinder({ q: "", group: "all", state: "all" });
    state.focused = i;
    syncChips();
    renderBranchInfo();
    if (tree) tree.focus(i);
    // On phones the branch details sit below the tree, out of sight: bring them into view
    // so it's clear new content appeared (a short pause lets the tree start turning first).
    if (reveal && i !== null && mqMobile.matches) {
      setTimeout(() => {
        const box = $("#branch-info");
        const r = box.getBoundingClientRect();
        if (r.top > window.innerHeight * 0.6 || r.top < 0) {
          box.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
        }
      }, reduceMotion ? 0 : 350);
    }
  }

  /* ---------------------------------------------------------
     India map inside the panel
  --------------------------------------------------------- */
  const map = { svg: null, paths: {}, pinLayer: null, current: null, loops: [] };
  const STATE_FILL = "#f6e2bf";

  function buildMap() {
    const svg = $("#india");
    svg.setAttribute("viewBox", "-10 -10 632 716");
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
    const g = document.createElementNS(SVGNS, "g");
    window.INDIA_MAP.states.forEach(s => {
      const p = document.createElementNS(SVGNS, "path");
      p.setAttribute("d", s.d);
      p.setAttribute("class", "st");
      p.setAttribute("fill", STATE_FILL);
      p.dataset.id = s.id;
      g.appendChild(p);
      map.paths[s.id] = p;
    });
    svg.appendChild(g);
    map.pinLayer = document.createElementNS(SVGNS, "g");
    svg.appendChild(map.pinLayer);
    map.svg = svg;
  }

  function showOnMap(stateId, color) {
    // stop the looping glow / ripple animations of the previous pin
    map.loops.forEach(a => a.stop());
    map.loops = [];
    const prev = map.current;
    const path = map.paths[stateId];
    if (prev && prev !== path) {
      prev.classList.remove("on");
      animate(prev, { fill: STATE_FILL, opacity: 1 }, tx({ duration: 0.5 }));
    }
    if (path) {
      path.classList.add("on");
      path.parentNode.appendChild(path); // bring the outline to the top
      animate(path, { fill: color, opacity: 1 }, tx({ duration: 0.6, ease: EASE }));
      if (!reduceMotion) {
        map.loops.push(animate(path, { opacity: [1, 0.74, 1] },
          { duration: 2.4, ease: "easeInOut", repeat: Infinity, delay: 0.6 }));
      }
    }
    map.current = path;
    // no state on record (e.g. a classical text): no pin
    if (!ANCHORS[stateId]) { map.pinLayer.innerHTML = ""; return; }
    const [x, y] = ANCHORS[stateId];
    const name = stateName(STATE_NAMES[stateId] || "");
    const right = x < 430;
    map.pinLayer.innerHTML = `
      <g transform="translate(${x} ${y})">
        <circle class="pin-ring" r="9"/>
        <circle class="pin-ring r2" r="9"/>
        <g class="pin-drop"><g transform="scale(1.45)">
          <path class="pin-body" d="M0 0 C-4 -10 -13 -16 -13 -26 A13 13 0 1 1 13 -26 C13 -16 4 -10 0 0 Z"/>
          <circle class="pin-eye" cy="-26" r="5"/>
          </g><text class="pin-label" x="${right ? 26 : -26}" y="-30" text-anchor="${right ? "start" : "end"}">${name}</text>
        </g>
      </g>`;
    // the pin drops in on a bouncy spring, then ripples keep pulsing out
    animate(map.pinLayer.querySelector(".pin-drop"), { y: [-70, 0], opacity: [0, 1] },
      tx({ type: "spring", stiffness: 260, damping: 13, delay: 0.25 }));
    map.pinLayer.querySelectorAll(".pin-ring").forEach((ring, k) => {
      if (reduceMotion) return;
      map.loops.push(animate(ring, { scale: [0.3, 2.6], opacity: [0.9, 0] },
        { duration: 2, ease: "easeOut", repeat: Infinity, delay: 0.6 + k }));
    });
  }

  /* ---------------------------------------------------------
     Detail panel
  --------------------------------------------------------- */
  let lastFocus = null;

  const esc = v => String(v).replace(/[&<>"']/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));

  /** "City, State" for a leaf (small leaves without a town show the state only) */
  const placeLine = c => [c.city, stateName(STATE_NAMES[c.state] || c.stateName)].filter((v, i, a) => v && a.indexOf(v) === i).join(", ");

  /** tel: link for the first number in a phone string such as "080 2670 1303 (University) · …" */
  function telLink(phone) {
    const first = String(phone).split(/[·/(]/)[0].replace(/[^\d+]/g, "");
    if (first.length < 8) return esc(phone);
    const href = first.startsWith("+") ? first : "+91" + first.replace(/^0/, "");
    return `<a href="tel:${href}">${esc(phone)}</a>`;
  }
  /** mailto: link for the first address in an e-mail string such as "x@y.in (Registrar)" */
  function mailLink(email) {
    const addr = String(email).split(" ")[0];
    const rest = String(email).slice(addr.length).trim();
    return `<a href="mailto:${esc(addr)}">${esc(addr)}</a>${rest ? " " + esc(rest) : ""}`;
  }
  /** the tree's centres by name, so other features can reuse their sourced details */
  const CENTRE_BY_NAME = Object.fromEntries(BRANCHES.flatMap(b => b.centres.map(c => [c.name, c])));

  /** structured detail sections for a centre's panel */
  function centreDetails(c) {
    const out = [];
    // entries from the IKS Atlas are drafts there: say so first
    if (c.draft) {
      out.push(`<p class="pd-draft"><b>${t("From the IKS Atlas (draft)")}</b> ${t("This entry's description comes from the IKS Atlas, a collection still in review that hasn't checked its sources yet. Check before relying on it.")}${I18N.hi ? " " + t("(The description is in English.)") : ""}</p>`);
    }
    if (c.activities && c.activities.length) {
      out.push(`<section class="pd-section"><h3>${t("What happens here")}</h3>
        <ul class="pd-list">${c.activities.map(a => `<li>${esc(a)}</li>`).join("")}</ul></section>`);
    }
    out.push(`<section class="pd-section"><h3>${t("People")}</h3>${
      c.people && c.people.length
        ? `<ul class="pd-people">${c.people.map(p => `<li><b>${esc(p.name)}</b><span>${esc(p.role)}</span>${p.asOf ? `<small>${t("As listed in: {src}", { src: esc(p.asOf) })}</small>` : ""}</li>`).join("")}</ul>`
        : `<p class="pd-empty">${esc(c.peopleNote || t("The sources don't name the people who run it. Contact the institution below."))}</p>`
    }</section>`);
    const k = c.contact || {};
    const rows = [];
    if (k.address) rows.push([t("Address"), `<a href="https://www.google.com/maps/search/?${new URLSearchParams({ api: "1", query: `${c.name}, ${k.address}` })}" target="_blank" rel="noopener">${esc(k.address)}</a>`]);
    if (k.phone) rows.push([k.listedBy ? t("Listed phone") : t("Phone"), telLink(k.phone)]);
    if (k.email) rows.push([k.listedBy ? t("Listed email") : t("Email"), mailLink(k.email)]);
    if (k.hours) rows.push([t("Hours"), esc(k.hours)]);
    if (k.website) rows.push([t("Website"), `<a href="${esc(k.website)}" target="_blank" rel="noopener">${esc(k.website.replace(/^https?:\/\//, "").replace(/\/$/, ""))}</a>`]);
    if (c.minor && !c.place.noMap) {
      rows.push([t("Directions"), `<a href="${esc(nearby.directionsUrl(c.place))}" target="_blank" rel="noopener">${t("Open in Google Maps")}</a>`]);
    }
    if (c.minor) {
      // small leaves: what the source lists, and a search when it lists no phone or e-mail
      let note = c.listedNote ? `<p class="pd-checked">${esc(c.listedNote)}</p>` : "";
      if (!k.phone && !k.email) {
        const q = new URLSearchParams({ q: `${c.name} ${c.place.city || ""} ${c.stateName || ""} contact` }).toString();
        note += `<p class="pd-empty">${esc(c.contactNote)}${c.place.kind === "heritage" || c.place.kind === "tradition" ? ""
          : ` <a href="https://www.google.com/search?${q}" target="_blank" rel="noopener">${t("Search for its contact details")}</a>.`}</p>`;
      }
      out.push(`<section class="pd-section"><h3>${t("Visit & contact")}</h3>
        ${rows.length ? `<dl class="pd-contact">${rows.map(([t, d]) => `<dt>${t}</dt><dd>${d}</dd>`).join("")}</dl>` : ""}${note}</section>`);
    } else if (rows.length) {
      out.push(`<section class="pd-section"><h3>${t("Visit & contact")}</h3>
        <dl class="pd-contact">${rows.map(([t, d]) => `<dt>${t}</dt><dd>${d}</dd>`).join("")}</dl></section>`);
    } else {
      // e.g. IKS Division centres: the official list gives no address, phone or e-mail
      const host = (((c.en && c.en.activities) || c.activities || []).find(a => a.startsWith("Host institution: ")) || "").replace("Host institution: ", "");
      const q = new URLSearchParams({ q: `${c.name} ${host.startsWith("not named") ? "" : host} ${c.city || ""} contact` }).toString();
      out.push(`<section class="pd-section"><h3>${t("Visit & contact")}</h3>
        <p class="pd-empty">${t("The official list doesn't give an address, phone or e-mail for this centre.")}
        <a href="https://www.google.com/search?${q}" target="_blank" rel="noopener">${t("Search for its contact details")}</a>.</p></section>`);
    }
    if (c.sources && c.sources.length) {
      out.push(`<section class="pd-section"><h3>${t("Sources")}</h3>
        <ol class="pd-sources">${c.sources.map(s => `<li><a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.label)}</a></li>`).join("")}</ol>
        <p class="pd-checked">${c.minor ? t("Fetched November 2026. Office-holders change, so confirm with the institution before visiting.") : t("Checked November 2026. Office-holders change, so confirm with the institution before visiting.")}</p></section>`);
    }
    // corrections and new information from visitors (js/feedback.js)
    out.push(`<p class="pd-feedback">${t("Something here out of date?")}
      <button type="button" class="near-btn pd-suggest" data-feedback="${esc(c.name)}">
        <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13 7l4 4"/></svg>${t("Suggest an update")}</button></p>`);
    return out.join("");
  }

  function openCentre(bi, ci) {
    const b = BRANCHES[bi];
    const c = b.centres[ci];
    const panel = $("#panel");
    const firstOpen = !state.panelOpen;
    if (firstOpen) lastFocus = document.activeElement;
    if (state.focused !== bi) focusBranch(bi);
    state.selected = { b: bi, c: ci };
    state.panelOpen = true;

    panel.style.setProperty("--c", b.color);
    const grp = (GROUPS.find(g => g.id === c.group) || GROUPS[0]);
    $("#panel-kicker").innerHTML = `<span class="dot"></span>${b.name} · ${esc(grp.label)}`;
    $("#panel-title").textContent = c.name;
    $("#panel-type").textContent = c.type;
    $("#panel-place").textContent = placeLine(c);
    $("#panel-summary").innerHTML = (c.founded ? `<span class="founded">${t("Founded {year}.", { year: esc(c.founded) })}</span> ` : "") + esc(c.summary || "");
    $("#map-caption").textContent = t("{name} is in {place}.", { name: c.name, place: placeLine(c) });
    showOnMap(c.state, b.color);
    $("#panel-details").innerHTML = centreDetails(c);

    // siblings: the other leaves of the same kind on this branch (gurukuls: on the
    // same regional twig), nearest first: same state, then the rest
    const list = $("#panel-siblings");
    const twig = x => x.group + (x.region ? ":" + x.region : "");
    const same = b.centres.map((s2, k) => ({ s: s2, k }))
      .filter(x => twig(x.s) === twig(c))
      .sort((x, y) => (x.k === ci ? -1 : y.k === ci ? 1 : 0) || (y.s.state === c.state) - (x.s.state === c.state));
    $("#panel-sib-title").textContent = c.minor
      ? (c.region ? t("More {kind} ({region} twig)", { kind: I18N.hi ? grp.label : grp.label.toLowerCase(), region: t(c.region) })
        : t("More {kind}", { kind: I18N.hi ? grp.label : grp.label.toLowerCase() }))
      : t("Other IKS centres on this branch");
    const SHOW = 6;
    let shownSib = Math.min(same.length, SHOW + 1);
    const sibItem = x => `
      <li><button type="button" class="leaf-btn${x.s.minor ? " small" : ""}" data-c="${x.k}" style="--c:${b.color};--g:${grp.color}" ${x.k === ci ? 'aria-current="true"' : ""}>
        <svg aria-hidden="true"><use href="#leaf-icon"/></svg>
        <span><b>${esc(x.s.name)}</b><small>${esc(x.s.type)} · ${esc(placeLine(x.s))}</small></span>
      </button></li>`;
    const bindSibs = items => items.forEach(li => {
      const btn = li.querySelector(".leaf-btn");
      if (!btn) return;
      btn.addEventListener("click", () => openCentre(bi, +btn.dataset.c));
      interactive(btn, { lift: -2, shadow: "0px 10px 20px -14px" });
    });
    const moreRow = () => {
      const rest = same.length - shownSib;
      return (rest > 0 ? `<li class="sib-more"><button type="button" class="near-btn sib-show">${t("Show {n} more of {total}", { n: Math.min(rest, 30), total: same.length })}</button></li>` : "")
        + (b.centres.length > SHOW + 1 ? `<li class="sib-more"><button type="button" class="near-btn sib-browse">${t("Search all {n} leaves of this branch", { n: b.centres.length })}</button></li>` : "");
    };
    function drawSibs(from) {
      list.querySelectorAll(".sib-more").forEach(li => li.remove());
      const html = same.slice(from, shownSib).map(sibItem).join("");
      list.insertAdjacentHTML("beforeend", html + moreRow());
      const items = Array.from(list.children).slice(from);
      bindSibs(items);
      const show = list.querySelector(".sib-show");
      if (show) {
        show.addEventListener("click", () => {
          const at = shownSib;
          shownSib = Math.min(same.length, shownSib + 30);
          drawSibs(at);
        });
        interactive(show, { lift: -2, shadow: "0px 8px 16px -12px" });
      }
      const browse = list.querySelector(".sib-browse");
      if (browse) {
        browse.addEventListener("click", () => browseBranch(bi, "all"));
        interactive(browse, { lift: -2, shadow: "0px 8px 16px -12px" });
      }
      if (from > 0) reveal(items, { gap: 0.03, y: 10, duration: 0.4 });
    }
    list.innerHTML = "";
    drawSibs(0);
    list.parentElement.hidden = b.centres.length < 2;

    if (firstOpen) {
      // slide in from the right (desktop) or up from the bottom (phones)
      panel.style.visibility = "visible";
      const slide = mqMobile.matches ? { y: ["105%", "0%"], x: 0 } : { x: ["110%", "0%"], y: 0 };
      panel.anim?.stop();
      panel.anim = animate(panel, { ...slide, opacity: [0, 1] }, tx(SOFT_SPRING));
      const scrim = $("#scrim");
      if (mqMobile.matches) {
        scrim.hidden = false;
        animate(scrim, { opacity: [0, 1] }, tx({ duration: 0.3 }));
      }
    }
    // staggered reveal of the panel contents (also when switching centres)
    reveal(panel.querySelectorAll(".panel-kicker, h2, .panel-meta, .panel-summary, .map, .pd-section, .siblings"),
      { delay: firstOpen ? 0.12 : 0, gap: 0.06, duration: 0.55 });
    panel.setAttribute("aria-hidden", "false");
    panel.scrollTop = 0;
    $("#panel-title").focus({ preventScroll: true });
    if (tree) tree.select(bi, ci);
  }

  function closePanel() {
    if (!state.panelOpen) return;
    state.panelOpen = false;
    state.selected = null;
    const panel = $("#panel");
    const slide = mqMobile.matches ? { y: "105%" } : { x: "110%" };
    panel.anim?.stop();
    panel.anim = animate(panel, { ...slide, opacity: 0 }, tx({ duration: 0.35, ease: [0.4, 0, 1, 1] }));
    panel.anim.then(() => { if (!state.panelOpen) panel.style.visibility = "hidden"; });
    panel.setAttribute("aria-hidden", "true");
    const scrim = $("#scrim");
    if (!scrim.hidden) animate(scrim, { opacity: 0 }, tx({ duration: 0.3 })).then(() => { scrim.hidden = true; });
    if (tree) tree.select(null);
    if (lastFocus && document.contains(lastFocus)) lastFocus.focus({ preventScroll: true });
  }

  $("#panel-close").addEventListener("click", closePanel);
  interactive($("#panel-close"), { lift: 0, rotate: 90, shadow: null, border: false, bg: "#ffffff" });
  $("#scrim").addEventListener("click", closePanel);
  document.addEventListener("keydown", e => { if (e.key === "Escape") closePanel(); });

  /* =========================================================
     THE 3D TREE
  ========================================================= */
  let tree = null;

  function createTree() {
    const stage = $("#stage");
    const canvas = $("#tree");
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    } catch (err) {
      $("#no-webgl").hidden = false;
      $("#hint").hidden = true;
      return null;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
    const lookAt = new THREE.Vector3(0, 3.1, 0);

    scene.add(new THREE.HemisphereLight(0xfff4e2, 0xc9a26b, 2.2));
    const sun = new THREE.DirectionalLight(0xffffff, 2.2);
    sun.position.set(4, 9, 7);
    scene.add(sun);
    const rim = new THREE.DirectionalLight(0xffd9a0, 1.2);
    rim.position.set(-6, 4, -6);
    scene.add(rim);

    const world = new THREE.Group();   // rotates with drag
    const sway = new THREE.Group();    // gentle breathing sway
    world.add(sway);
    scene.add(world);

    const UP = new THREE.Vector3(0, 1, 0);

    /* ---------- textures drawn on canvas ---------- */
    function canvasTexture(w, h, draw) {
      const c = document.createElement("canvas");
      c.width = w; c.height = h;
      draw(c.getContext("2d"), w, h);
      const t = new THREE.CanvasTexture(c);
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 4;
      return t;
    }

    const glowTex = canvasTexture(128, 128, (g, w) => {
      const r = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2);
      r.addColorStop(0, "rgba(255,255,255,1)");
      r.addColorStop(0.35, "rgba(255,255,255,.45)");
      r.addColorStop(1, "rgba(255,255,255,0)");
      g.fillStyle = r; g.fillRect(0, 0, w, w);
    });

    const LEAF_W = 1.24, LEAF_H = 1.5;
    const veinTex = canvasTexture(256, 320, (g, w, h) => {
      g.fillStyle = "#d9d9d9"; g.fillRect(0, 0, w, h);
      const sh = g.createRadialGradient(w / 2, h * 0.62, 10, w / 2, h * 0.62, w * 0.7);
      sh.addColorStop(0, "rgba(255,255,255,.35)"); sh.addColorStop(1, "rgba(0,0,0,.08)");
      g.fillStyle = sh; g.fillRect(0, 0, w, h);
      const X = x => (x / LEAF_W + 0.5) * w;
      const Y = y => (1 - y / LEAF_H) * h;
      g.strokeStyle = "rgba(255,255,255,.9)"; g.lineCap = "round";
      g.lineWidth = 4;
      g.beginPath(); g.moveTo(X(0), Y(0.06)); g.lineTo(X(0), Y(1.46)); g.stroke();
      g.lineWidth = 2;
      for (let k = 0; k < 7; k++) {
        const y0 = 0.14 + k * 0.15;
        const reach = Math.sin(Math.PI * (0.25 + k * 0.1)) * 0.5;
        [-1, 1].forEach(s => {
          g.beginPath();
          g.moveTo(X(0), Y(y0));
          g.quadraticCurveTo(X(s * reach * 0.5), Y(y0 + 0.08), X(s * reach), Y(y0 + 0.26));
          g.stroke();
        });
      }
    });
    veinTex.repeat.set(1 / LEAF_W, 1 / LEAF_H);
    veinTex.offset.set(0.5, 0);

    const yantraTex = canvasTexture(1024, 1024, (g, w) => {
      const c = w / 2;
      g.translate(c, c);
      g.strokeStyle = "rgba(170,120,60,.55)";
      g.lineWidth = 2;
      const circ = r => { g.beginPath(); g.arc(0, 0, r, 0, Math.PI * 2); g.stroke(); };
      circ(150); circ(330); circ(345); circ(480);
      g.lineWidth = 1.5;
      for (let i = 0; i < 16; i++) {           // lotus petals
        g.save(); g.rotate((i / 16) * Math.PI * 2);
        g.beginPath(); g.moveTo(0, -345);
        g.bezierCurveTo(40, -380, 34, -440, 0, -470);
        g.bezierCurveTo(-34, -440, -40, -380, 0, -345); g.stroke();
        g.restore();
      }
      for (let i = 0; i < 8; i++) {
        g.save(); g.rotate((i / 8) * Math.PI * 2 + Math.PI / 8);
        g.beginPath(); g.moveTo(0, -150);
        g.bezierCurveTo(70, -200, 60, -290, 0, -325);
        g.bezierCurveTo(-60, -290, -70, -200, 0, -150); g.stroke();
        g.restore();
      }
      const tri = (r, rot) => {
        g.beginPath();
        for (let k = 0; k < 3; k++) {
          const a = rot + (k / 3) * Math.PI * 2;
          g[k ? "lineTo" : "moveTo"](Math.cos(a) * r, Math.sin(a) * r);
        }
        g.closePath(); g.stroke();
      };
      tri(140, -Math.PI / 2); tri(140, Math.PI / 2);
      g.fillStyle = "rgba(170,120,60,.5)";
      for (let i = 0; i < 48; i++) {
        const a = (i / 48) * Math.PI * 2;
        g.beginPath(); g.arc(Math.cos(a) * 495, Math.sin(a) * 495, 4, 0, Math.PI * 2); g.fill();
      }
    });

    /* ---------- geometry helpers ---------- */
    function taperedTube(curve, segs, radial, r0, r1, mat) {
      const geo = new THREE.TubeGeometry(curve, segs, 1, radial, false);
      const pos = geo.attributes.position;
      const p = new THREE.Vector3(), v = new THREE.Vector3();
      for (let i = 0; i <= segs; i++) {
        const t = i / segs;
        curve.getPointAt(t, p);
        const r = r0 + (r1 - r0) * Math.pow(t, 0.8);
        for (let j = 0; j <= radial; j++) {
          const idx = i * (radial + 1) + j;
          v.fromBufferAttribute(pos, idx).sub(p).multiplyScalar(r).add(p);
          pos.setXYZ(idx, v.x, v.y, v.z);
        }
      }
      geo.computeVertexNormals();
      const mesh = new THREE.Mesh(geo, mat);
      mesh.userData.indexCount = geo.index.count;
      return mesh;
    }

    function leafGeometry() {
      const s = new THREE.Shape();
      s.moveTo(0, 0.08);
      s.bezierCurveTo(0.12, -0.04, 0.42, -0.02, 0.52, 0.22);
      s.bezierCurveTo(0.62, 0.48, 0.5, 0.78, 0.3, 0.98);
      s.bezierCurveTo(0.18, 1.1, 0.06, 1.18, 0.025, 1.3);
      s.lineTo(0, 1.48);
      s.lineTo(-0.025, 1.3);
      s.bezierCurveTo(-0.06, 1.18, -0.18, 1.1, -0.3, 0.98);
      s.bezierCurveTo(-0.5, 0.78, -0.62, 0.48, -0.52, 0.22);
      s.bezierCurveTo(-0.42, -0.02, -0.12, -0.04, 0, 0.08);
      const geo = new THREE.ShapeGeometry(s, 18);
      const pos = geo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i), y = pos.getY(i);
        pos.setZ(i, 0.22 * x * x - 0.1 * y * y);   // cupped and gently drooping
      }
      geo.computeVertexNormals();
      return geo;
    }
    const LEAF_GEO = leafGeometry();

    /* ---------- materials ---------- */
    const barkMat = new THREE.MeshStandardMaterial({ color: 0x7a5232, roughness: 0.85, metalness: 0.0 });
    const twigMat = new THREE.MeshStandardMaterial({ color: 0x8c6440, roughness: 0.85 });

    /* ---------- ground: rotating yantra ---------- */
    const yantra = new THREE.Mesh(
      new THREE.PlaneGeometry(9, 9),
      new THREE.MeshBasicMaterial({ map: yantraTex, transparent: true, opacity: 0.85, depthWrite: false })
    );
    yantra.rotation.x = -Math.PI / 2;
    yantra.position.y = 0.01;
    scene.add(yantra);

    const shadow = new THREE.Mesh(
      new THREE.PlaneGeometry(4.2, 4.2),
      new THREE.MeshBasicMaterial({ map: glowTex, color: 0x6b4520, transparent: true, opacity: 0.28, depthWrite: false })
    );
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = 0.02;
    scene.add(shadow);

    /* ---------- trunk and roots ---------- */
    const growables = [];   // meshes that "grow" via drawRange on load
    const trunkCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, -0.2, 0),
      new THREE.Vector3(0.12, 1.2, 0.05),
      new THREE.Vector3(-0.1, 2.6, -0.06),
      new THREE.Vector3(0.06, 4.0, 0.02),
      new THREE.Vector3(0, 5.0, 0)
    ]);
    const trunk = taperedTube(trunkCurve, 48, 14, 0.46, 0.06, barkMat);
    sway.add(trunk);
    growables.push({ mesh: trunk, start: 0, dur: 0.9 });

    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2 + 0.4;
      const len = 1.1 + (i % 2) * 0.45;
      const c = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0.55, 0),
        new THREE.Vector3(Math.sin(a) * 0.45, 0.18, Math.cos(a) * 0.45),
        new THREE.Vector3(Math.sin(a) * len, 0.02, Math.cos(a) * len)
      ]);
      const root = taperedTube(c, 16, 8, 0.2, 0.025, barkMat);
      sway.add(root);
      growables.push({ mesh: root, start: 0.1, dur: 0.6 });
    }

    /* ---------- crown jewel: a glowing bindu at the top ---------- */
    const bindu = new THREE.Group();
    bindu.position.set(0, 5.25, 0);
    const binduCore = new THREE.Mesh(
      new THREE.SphereGeometry(0.13, 24, 16),
      new THREE.MeshStandardMaterial({ color: 0xf2b84b, emissive: 0xe89a2c, emissiveIntensity: 0.9, roughness: 0.4 })
    );
    const binduGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: 0xf3b04a, transparent: true, opacity: 0.55, depthWrite: false }));
    binduGlow.scale.setScalar(1.3);
    bindu.add(binduCore, binduGlow);
    sway.add(bindu);

    /* ---------- the many smaller leaves ----------
       Every other IKS place (gurukuls, institutes, heritage sites…) is a small leaf.
       They grow in clusters at the end of twigs, one twig per kind of place (the many
       gurukuls on one twig per region), and are drawn as one instanced mesh per branch
       so hundreds of leaves stay cheap. They're picked by screen distance (see pick()),
       which makes small leaves easy to hit with a mouse or a finger. */
    const minorBranches = [];     // per branch: { mesh, recs, appear, dim, … }
    const minorRecs = [];         // every small leaf, for picking
    const WHITE = new THREE.Color(0xffffff);
    const PALE = new THREE.Color(0xeadbc0);
    const groupColor = Object.fromEntries((window.IKS.leafGroups || []).map(g => [g.id, new THREE.Color(g.color)]));
    const MINOR_SCALE = 0.15;
    const tmpM = new THREE.Matrix4(), tmpS = new THREE.Vector3();

    function buildMinorTwigs(b, bi, curve, D, P, color, start) {
      const cores = [];
      const items = b.centres.map((c, ci) => ({ c, ci })).filter(x => x.c.minor);
      if (!items.length) return;
      const twigs = new Map();
      items.forEach(x => {
        const key = x.c.group + (x.c.region ? ":" + x.c.region : "");
        if (!twigs.has(key)) twigs.set(key, []);
        twigs.get(key).push(x);
      });
      const keys = [...twigs.keys()];
      const recs = [];
      keys.forEach((key, k) => {
        const list = twigs.get(key);
        const m = list.length;
        const t = keys.length === 1 ? 0.6 : 0.32 + (0.62 * k) / (keys.length - 1);
        const at = curve.getPointAt(t);
        const T = curve.getTangentAt(t);
        const N2 = new THREE.Vector3().crossVectors(T, P).normalize();
        if (N2.y < 0) N2.negate();
        // twigs fan round the branch (golden angle), leaning up and out
        const th = 0.9 + k * 2.39996;
        // (clusters rise above the branch so the big IKS-centre leaves stay in view)
        const dir = P.clone().multiplyScalar(Math.cos(th) * 0.85).addScaledVector(N2, 1.05 + Math.sin(th) * 0.3)
          .addScaledVector(D, 0.2).normalize();
        // the leaves cover a sphere's surface around the twig's end: radius from leaf count
        const R = Math.max(0.15, 0.175 * Math.sqrt(m / (4 * Math.PI)));
        const twigLen = 0.42 + R * 1.15;
        const end = at.clone().addScaledVector(dir, twigLen);
        const tw = taperedTube(new THREE.CatmullRomCurve3([at, at.clone().lerp(end, 0.5).addScaledVector(UP, 0.06), end]),
          10, 6, Math.min(0.06, 0.03 + R * 0.04), 0.016, twigMat);
        sway.add(tw);
        growables.push({ mesh: tw, start: start + 0.45, dur: 0.5 });
        const tint = color.clone().lerp(groupColor[list[0].c.group] || color, 0.4);
        // a soft foliage core, so a cluster reads as a crown of leaves, not a hollow shell
        const coreCol = tint.clone().lerp(new THREE.Color(0x4a2f17), 0.45);
        const core = new THREE.Mesh(new THREE.SphereGeometry(R * 0.9, 18, 12),
          new THREE.MeshStandardMaterial({ color: coreCol.clone(), roughness: 1 }));
        core.position.copy(end).addScaledVector(dir, R * 0.25);
        core.scale.setScalar(0.001);
        core.userData = { base: coreCol, dimColor: coreCol.clone().lerp(PALE, 0.72) };
        sway.add(core);
        cores.push(core);
        list.forEach((x, j) => {
          // Fibonacci sphere, squashed a little so clusters read as foliage
          const yy = 1 - (2 * (j + 0.5)) / m;
          const rr = Math.sqrt(1 - yy * yy);
          const phi = j * 2.39996 + k;
          const normal = new THREE.Vector3(Math.cos(phi) * rr, yy * 0.85 + 0.15, Math.sin(phi) * rr).normalize();
          const pos = end.clone().addScaledVector(normal, R).addScaledVector(dir, R * 0.25);
          // the leaf lies on the cluster's surface, its face looking outward, tip upward
          const zAxis = normal.clone();
          let yAxis = UP.clone().addScaledVector(zAxis, -UP.dot(zAxis));
          if (yAxis.lengthSq() < 1e-4) yAxis = dir.clone().addScaledVector(zAxis, -dir.dot(zAxis));
          yAxis.normalize().applyAxisAngle(zAxis, (rand() - 0.5) * 0.9);
          const xAxis = new THREE.Vector3().crossVectors(yAxis, zAxis);
          const quat = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(xAxis, yAxis, zAxis));
          // lift the tip away from the surface a little, for a feathery crown
          quat.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), -0.45 - rand() * 0.25));
          const shade = tint.clone().offsetHSL((rand() - 0.5) * 0.03, 0, (rand() - 0.5) * 0.12);
          const rec = {
            b: bi, c: x.ci, pos, center: end, normal, quat, idx: recs.length,
            base: shade, dimColor: shade.clone().lerp(PALE, 0.72),
            s: MINOR_SCALE * (0.9 + rand() * 0.2), emph: 1,
            delay: (j / Math.max(m - 1, 1)) * 0.55 + k * 0.04
          };
          recs.push(rec);
          minorRecs.push(rec);
        });
      });
      const mesh = new THREE.InstancedMesh(LEAF_GEO,
        new THREE.MeshStandardMaterial({ map: veinTex, side: THREE.DoubleSide, roughness: 0.6, metalness: 0.04 }), recs.length);
      mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      recs.forEach(r => { mesh.setColorAt(r.idx, r.base); r.mesh = mesh; });
      mesh.frustumCulled = false;
      sway.add(mesh);
      const info = { mesh, recs, cores, appear: 0, dim: 0, tDim: 0, appliedDim: -1, done: false };
      minorBranches[bi] = info;
      animate(info, { appear: 1 }, tx({ duration: 1.3, delay: start + 0.9, ease: EASE }));
    }

    function setMinorMatrix(r, k) {
      tmpS.setScalar(Math.max(r.s * r.emph * k, 1e-4));
      tmpM.compose(r.pos, r.quat, tmpS);
      r.mesh.setMatrixAt(r.idx, tmpM);
    }
    const minorOf = (b, c) => {
      const info = minorBranches[b];
      return info ? info.recs.find(r => r.c === c) || null : null;
    };

    // glows that mark the hovered and the selected small leaf
    const markGlow = color => {
      const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color, transparent: true, opacity: 0, depthWrite: false, depthTest: false }));
      s.visible = false;
      s.renderOrder = 5;
      sway.add(s);
      return s;
    };
    const hoverGlow = markGlow(0xffe2a8), selGlow = markGlow(0xffd27a);
    let emphasised = [];

    /* ---------- the six branches ---------- */
    const branchData = [];
    const leaves = [];         // clickable leaves
    const hitTargets = [];
    const decoMatrices = [];   // small decorative leaves
    const decoColors = [];
    const decoPalette = [0x8fa86a, 0xa7b878, 0x7d9a5c, 0xc4ad66, 0x9bb07a].map(c => new THREE.Color(c));
    const rand = mulberry32(7);

    const N = BRANCHES.length;
    BRANCHES.forEach((b, bi) => {
      const a = (bi / N) * Math.PI * 2;                  // azimuth
      const h = 1.95 + bi * 0.42;                        // spiral up the trunk
      const L = 3.25 - bi * 0.13;                        // upper branches are shorter
      const D = new THREE.Vector3(Math.sin(a), 0, Math.cos(a));
      const P = new THREE.Vector3(Math.cos(a), 0, -Math.sin(a));   // sideways
      const base = trunkCurve.getPointAt(Math.min(h / 5.2, 0.98));
      const wob = (bi % 2 ? 1 : -1) * 0.25;
      const curve = new THREE.CatmullRomCurve3([
        base.clone(),
        base.clone().addScaledVector(D, L * 0.32).addScaledVector(UP, 0.55),
        base.clone().addScaledVector(D, L * 0.68).addScaledVector(UP, 1.0).addScaledVector(P, wob),
        base.clone().addScaledVector(D, L).addScaledVector(UP, 1.25).addScaledVector(P, wob * 0.4)
      ]);
      const mesh = taperedTube(curve, 36, 10, 0.2 - bi * 0.012, 0.035, barkMat);
      sway.add(mesh);
      const start = 0.55 + bi * 0.12;
      growables.push({ mesh, start, dur: 0.8 });

      const color = new THREE.Color(b.color);
      const tip = curve.getPointAt(1);
      branchData.push({ angle: a, curve, tip, color, D, P });

      // clickable leaves along the branch
      // Branches can carry many leaves: they spiral round the branch (golden angle)
      // and get smaller as the branch fills up, so they don't pile on each other.
      // the featured IKS centres come first in b.centres; the many smaller leaves follow
      const featured = b.centres.filter(c => !c.minor);
      const n = featured.length;
      const size = n <= 4 ? 1 : Math.max(0.42, Math.sqrt(4 / n));
      featured.forEach((centre, ci) => {
        const isTip = ci === n - 1;
        const t = isTip ? 1 : (n <= 4 ? 0.42 + (0.5 * (ci + 0.5)) / Math.max(n - 1, 1) : 0.26 + (0.7 * (ci + 0.5)) / (n - 1));
        const at = curve.getPointAt(t);
        let dir;
        if (isTip) dir = D.clone().multiplyScalar(0.75).addScaledVector(UP, 0.65);
        else if (n <= 4) dir = P.clone().multiplyScalar((ci % 2 ? 1 : -1) * 0.85).addScaledVector(D, 0.35).addScaledVector(UP, 0.7);
        else {
          const T = curve.getTangentAt(t);
          const N2 = new THREE.Vector3().crossVectors(T, P).normalize();
          const th = ci * 2.39996;
          dir = P.clone().multiplyScalar(Math.cos(th)).addScaledVector(N2, Math.sin(th));
          if (dir.y < 0) dir.y *= 0.3; // keep leaves from hanging straight down
          dir.addScaledVector(UP, 0.5).addScaledVector(D, 0.2);
        }
        dir.normalize();
        const twigLen = isTip ? 0.22 : n <= 4 ? 0.42 : 0.2 + 0.2 * size + rand() * 0.08;
        const end = at.clone().addScaledVector(dir, twigLen);
        if (!isTip) {
          const tw = taperedTube(new THREE.CatmullRomCurve3([at, at.clone().lerp(end, 0.5).addScaledVector(UP, 0.05), end]), 8, 6, 0.045, 0.02, twigMat);
          sway.add(tw);
          growables.push({ mesh: tw, start: start + 0.5, dur: 0.4 });
        }

        const group = new THREE.Group();
        group.position.copy(end);
        // orient: leaf's +Y along the twig, its face looking outward from the trunk
        const yAxis = dir.clone();
        const out = end.clone().setY(0).normalize();
        const zAxis = out.clone().addScaledVector(yAxis, -out.dot(yAxis)).normalize();
        const xAxis = new THREE.Vector3().crossVectors(yAxis, zAxis);
        group.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(xAxis, yAxis, zAxis));
        group.userData.baseQuat = group.quaternion.clone();

        const mat = new THREE.MeshStandardMaterial({
          color: color.clone(), map: veinTex, side: THREE.DoubleSide,
          roughness: 0.55, metalness: 0.05, emissive: color.clone(), emissiveIntensity: 0.08
        });
        const leaf = new THREE.Mesh(LEAF_GEO, mat);
        leaf.scale.setScalar(0.66 * size);
        group.add(leaf);

        const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: color.clone().lerp(new THREE.Color(0xffe2a8), 0.35), transparent: true, opacity: 0.45, depthWrite: false }));
        halo.position.set(0, 0.5 * size, 0.05);
        halo.scale.setScalar(1.35 * size);
        halo.userData.size = size;
        halo.renderOrder = -1;
        group.add(halo);

        const hit = new THREE.Mesh(new THREE.SphereGeometry(Math.max(0.26, 0.48 * size), 10, 8), new THREE.MeshBasicMaterial({ visible: false }));
        hit.position.set(0, 0.5 * size, 0);
        hit.userData = { b: bi, c: ci };
        group.add(hit);
        hitTargets.push(hit);

        sway.add(group);
        const rec = {
          group, leaf, mat, halo, b: bi, c: ci,
          base: color.clone(), dimColor: color.clone().lerp(new THREE.Color(0xeadbc0), 0.72),
          phase: rand() * Math.PI * 2, appearDelay: start + 0.75 + ci * Math.min(0.12, 1.2 / n), size,
          appear: 0, hover: 0, dim: 0, tHover: 0, tDim: 0
        };
        group.scale.setScalar(0);
        leaves.push(rec);
      });

      buildMinorTwigs(b, bi, curve, D, P, color, start);

      // decorative foliage along the branch
      for (let k = 0, deco = Math.max(6, 16 - Math.round(n / 2)); k < deco; k++) {
        const t = 0.3 + rand() * 0.72;
        const p = curve.getPointAt(Math.min(t, 1));
        const dir = new THREE.Vector3(rand() - 0.5, rand() * 0.9 + 0.2, rand() - 0.5).addScaledVector(D, 0.4).normalize();
        decoMatrices.push(decoMatrix(p.addScaledVector(dir, 0.08), dir, 0.2 + rand() * 0.14, rand() * Math.PI * 2));
        decoColors.push(decoPalette[Math.floor(rand() * decoPalette.length)]);
      }
    });

    // a soft crown of small leaves near the top of the trunk
    for (let k = 0; k < 34; k++) {
      const t = 0.72 + rand() * 0.27;
      const p = trunkCurve.getPointAt(t);
      const ang = rand() * Math.PI * 2;
      const dir = new THREE.Vector3(Math.sin(ang), 0.6 + rand() * 0.8, Math.cos(ang)).normalize();
      decoMatrices.push(decoMatrix(p.addScaledVector(dir, 0.12), dir, 0.2 + rand() * 0.16, rand() * Math.PI));
      decoColors.push(decoPalette[Math.floor(rand() * decoPalette.length)]);
    }

    const decoMesh = new THREE.InstancedMesh(
      LEAF_GEO,
      new THREE.MeshStandardMaterial({ map: veinTex, side: THREE.DoubleSide, roughness: 0.7 }),
      decoMatrices.length
    );
    decoMatrices.forEach((m, i) => { decoMesh.setMatrixAt(i, m); decoMesh.setColorAt(i, decoColors[i]); });
    decoMesh.scale.setScalar(0.001);
    sway.add(decoMesh);
    const deco = { k: 0 };

    function decoMatrix(pos, dir, s, spin) {
      const q = new THREE.Quaternion().setFromUnitVectors(UP, dir);
      q.multiply(new THREE.Quaternion().setFromAxisAngle(UP, spin));
      return new THREE.Matrix4().compose(pos, q, new THREE.Vector3(s, s, s));
    }

    /* ---------- drifting pollen / sparks ---------- */
    const PCOUNT = reduceMotion ? 40 : 130;
    const pPos = new Float32Array(PCOUNT * 3);
    const pSpeed = new Float32Array(PCOUNT);
    for (let i = 0; i < PCOUNT; i++) {
      const r = 1 + rand() * 5.5, a = rand() * Math.PI * 2;
      pPos[i * 3] = Math.sin(a) * r;
      pPos[i * 3 + 1] = rand() * 7.5;
      pPos[i * 3 + 2] = Math.cos(a) * r;
      pSpeed[i] = 0.12 + rand() * 0.25;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    const pollen = new THREE.Points(pGeo, new THREE.PointsMaterial({
      map: glowTex, color: 0xd99a3c, size: 0.13, transparent: true, opacity: 0.75, depthWrite: false
    }));
    world.add(pollen);

    /* ---------- HTML branch labels ---------- */
    const labelEls = BRANCHES.map((b, i) => {
      const el = document.createElement("button");
      el.type = "button";
      el.className = "blabel";
      el.style.setProperty("--c", b.color);
      el.innerHTML = `<span class="dot"></span>${b.name}`;
      el.addEventListener("click", () => focusBranch(state.focused === i ? null : i, { reveal: true }));
      $("#labels").appendChild(el);
      // the label's transform is driven by the 3D projection, so hover animates colour + shadow only
      interactive(el, { lift: 0, shadow: "0px 6px 18px -8px", bg: "#fffaf0" });
      return el;
    });

    const labelGrow = BRANCHES.map(() => ({ k: 0 }));

    /* ---------- intro: Motion tweens the growth values the render loop reads ---------- */
    growables.forEach(g => {
      g.k = 0;
      animate(g, { k: 1 }, tx({ duration: g.dur, delay: g.start, ease: EASE }));
    });
    animate(deco, { k: 1 }, tx({ duration: 1, delay: 1.6, ease: EASE }));
    leaves.forEach(L => animate(L, { appear: 1 }, tx({ type: "spring", stiffness: 210, damping: 11, delay: L.appearDelay })));
    labelGrow.forEach((lg, i) => animate(lg, { k: 1 }, tx({ duration: 0.6, delay: 1.6 + i * 0.12, ease: EASE })));

    /* hover / selection / focus targets for the leaves, eased by Motion springs */
    function refreshLeaves() {
      const sel = state.selected;
      leaves.forEach(L => {
        const isHover = (hovered && hovered.b === L.b && hovered.c === L.c) ||
          (preview && preview.b === L.b && preview.c === L.c);
        const isSel = sel && sel.b === L.b && sel.c === L.c;
        const h = isHover || isSel ? 1 : 0;
        const d = state.focused !== null && state.focused !== L.b ? 1 : 0;
        if (h !== L.tHover) { L.tHover = h; animate(L, { hover: h }, tx({ type: "spring", stiffness: 300, damping: 18 })); }
        if (d !== L.tDim) { L.tDim = d; animate(L, { dim: d }, tx({ duration: 0.5, ease: EASE })); }
      });
      minorBranches.forEach((info, bi) => {
        if (!info) return;
        const d = state.focused !== null && state.focused !== bi ? 1 : 0;
        if (d !== info.tDim) { info.tDim = d; animate(info, { dim: d }, tx({ duration: 0.5, ease: EASE })); }
      });
      // small leaves: the hovered / selected / previewed one grows and gets a glow
      const hovRec = hovered && hovered.minor ? minorOf(hovered.b, hovered.c) : null;
      const pv = preview && minorOf(preview.b, preview.c);
      const selRec = sel ? minorOf(sel.b, sel.c) : null;
      emphasised.forEach(r => { r.emph = 1; setMinorMatrix(r, 1); r.mesh.instanceMatrix.needsUpdate = true; });
      emphasised = [hovRec, pv, selRec].filter(Boolean);
      emphasised.forEach(r => {
        r.emph = 2.1;
        if (minorBranches[r.b].done) { setMinorMatrix(r, 1); r.mesh.instanceMatrix.needsUpdate = true; }
      });
      const place = (glow, r) => {
        glow.visible = !!r;
        if (r) { glow.position.copy(r.pos).addScaledVector(r.normal, 0.06); glow.userData.rec = r; }
      };
      place(hoverGlow, hovRec || pv);
      place(selGlow, selRec);
    }
    let preview = null;   // a leaf highlighted from the branch's leaf list

    /* ---------- sizing ---------- */
    let W = 1, H = 1;
    const view = { shift: 0, zoom: 0 };
    const camOffset = new THREE.Vector3();
    function resize() {
      const r = stage.getBoundingClientRect();
      W = Math.max(1, r.width); H = Math.max(1, r.height);
      renderer.setSize(W, H, false);
      camera.aspect = W / H;
      const tanH = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
      const needW = camera.aspect < 0.8 ? 8.4 : 10.4, needH = 7.2;
      const dist = Math.max(needH / (2 * tanH), needW / (2 * tanH * camera.aspect));
      camOffset.set(0, dist * 0.2, dist);
      camera.position.copy(lookAt).add(camOffset);
      camera.lookAt(lookAt);
      camera.updateProjectionMatrix();
    }
    new ResizeObserver(resize).observe(stage);
    resize();

    /* ---------- interaction ---------- */
    const raycaster = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    const tooltip = $("#tooltip");
    let rot = 0.35, vel = 0, rotAnim = null, tweening = false, hintShown = true;
    let dragging = false, downX = 0, downY = 0, lastX = 0, moved = 0;
    let lastInteract = -1e9, hovered = null, pointerInside = false;
    const hint = $("#hint");

    function pick(clientX, clientY) {
      const r = canvas.getBoundingClientRect();
      ndc.set(((clientX - r.left) / r.width) * 2 - 1, -((clientY - r.top) / r.height) * 2 + 1);
      raycaster.setFromCamera(ndc, camera);
      const hits = raycaster.intersectObjects(hitTargets, false);
      if (hits.length) return hits[0].object.userData;
      return pickMinor(clientX - r.left, clientY - r.top, touchPick ? 22 : 13);
    }
    let touchPick = false;

    /* nearest small leaf on screen within `radius` px: front-facing ones only,
       the focused branch first, and nearer leaves win over ones behind them */
    const pv3 = new THREE.Vector3(), pc3 = new THREE.Vector3(), camW = new THREE.Vector3();
    function pickMinor(px, py, radius) {
      camera.getWorldPosition(camW);
      let best = null, bestScore = Infinity;
      for (const rec of minorRecs) {
        const info = minorBranches[rec.b];
        if (!info || info.appear < 0.6) continue;
        pv3.copy(rec.pos).applyMatrix4(sway.matrixWorld);
        pc3.copy(rec.center).applyMatrix4(sway.matrixWorld);
        // skip leaves on the far side of their cluster
        const out = pv3.clone().sub(pc3), toCam = camW.clone().sub(pv3);
        if (out.dot(toCam) < -0.15 * out.length() * toCam.length()) continue;
        const dist = toCam.length();
        pv3.project(camera);
        const x = (pv3.x * 0.5 + 0.5) * W, y = (-pv3.y * 0.5 + 0.5) * H;
        const d = Math.hypot(x - px, y - py);
        if (d > radius) continue;
        const other = state.focused !== null && state.focused !== rec.b ? radius * 2 : 0;
        const score = d + other + dist * 1.5;
        if (score < bestScore) { bestScore = score; best = rec; }
      }
      return best ? { b: best.b, c: best.c, minor: true } : null;
    }

    function hideTooltip() {
      if (tooltip.hidden || tooltip.dataset.leaving) return;
      tooltip.dataset.leaving = "1";
      animate(tooltip, { opacity: 0, scale: 0.94 }, tx({ duration: 0.15 })).then(() => {
        if (tooltip.dataset.leaving) { tooltip.hidden = true; delete tooltip.dataset.leaving; }
      });
    }

    function setHover(h, clientX, clientY) {
      const changed = (h && h.b) !== (hovered && hovered.b) || (h && h.c) !== (hovered && hovered.c);
      hovered = h;
      if (changed) refreshLeaves();
      canvas.classList.toggle("pointing", !!h && !dragging);
      if (!h) { hideTooltip(); return; }
      const b = BRANCHES[h.b], c = b.centres[h.c];
      tooltip.innerHTML = `<strong>${esc(c.name)}</strong><span>${esc(c.type)} · ${esc(placeLine(c))}</span>`;
      tooltip.style.borderLeft = `4px solid ${b.color}`;
      const r = stage.getBoundingClientRect();
      let x = clientX - r.left + 14, y = clientY - r.top + 14;
      if (x > r.width - 280) x -= 320;
      tooltip.style.left = x + "px";
      tooltip.style.top = y + "px";
      if (tooltip.hidden || tooltip.dataset.leaving || changed) {
        delete tooltip.dataset.leaving;
        tooltip.hidden = false;
        animate(tooltip, { opacity: [0, 1], scale: [0.92, 1] }, tx({ type: "spring", stiffness: 420, damping: 28 }));
      }
    }

    function noteInteraction() {
      lastInteract = performance.now();
      if (hintShown) {
        hintShown = false;
        animate(hint, { opacity: 0 }, tx({ duration: 0.8 }));
      }
    }
    if (!reduceMotion) {
      animate(hint.querySelector(".hint-dot"), { scale: [1, 1.7, 1], opacity: [0.9, 0.3, 0.9] },
        { duration: 2, ease: "easeInOut", repeat: Infinity });
    }

    mqMobile.addEventListener("change", updateShift);

    canvas.addEventListener("pointerdown", e => {
      touchPick = e.pointerType !== "mouse";
      dragging = true; moved = 0;
      downX = lastX = e.clientX; downY = e.clientY;
      vel = 0;
      rotAnim?.stop(); tweening = false;
      canvas.setPointerCapture(e.pointerId);
      noteInteraction();
    });
    canvas.addEventListener("pointermove", e => {
      pointerInside = true;
      if (dragging) {
        const dx = e.clientX - lastX;
        lastX = e.clientX;
        moved = Math.max(moved, Math.hypot(e.clientX - downX, e.clientY - downY));
        if (moved > 4) {
          canvas.classList.add("dragging");
          rot += dx * 0.0085;
          vel = dx * 0.0085;
          hideTooltip();
        }
        noteInteraction();
      } else if (e.pointerType === "mouse") {
        setHover(pick(e.clientX, e.clientY), e.clientX, e.clientY);
      }
    });
    const endDrag = e => {
      if (!dragging) return;
      dragging = false;
      canvas.classList.remove("dragging");
      if (moved <= 6 && e.type === "pointerup") {
        const h = pick(e.clientX, e.clientY);
        // small leaves are tiny on a touch screen: the first tap on another branch's
        // small leaf brings that branch forward and zooms in; the next tap opens a leaf
        if (h && h.minor && touchPick && state.focused !== h.b) focusBranch(h.b);
        else if (h) openCentre(h.b, h.c);
        vel = 0;
      }
      noteInteraction();
    };
    canvas.addEventListener("pointerup", endDrag);
    canvas.addEventListener("pointercancel", endDrag);
    canvas.addEventListener("pointerleave", () => { pointerInside = false; setHover(null); });

    /* rotate so a branch faces the viewer */
    function faceBranch(i) {
      const want = -branchData[i].angle;
      let delta = want - rot;
      delta = Math.atan2(Math.sin(delta), Math.cos(delta));
      vel = 0;
      rotAnim?.stop();
      tweening = true;
      rotAnim = animate(rot, rot + delta, {
        ...tx({ type: "spring", stiffness: 55, damping: 15 }),
        onUpdate: v => { rot = v; }
      });
      rotAnim.then(() => { tweening = false; });
    }

    /* slide the tree left when the side panel covers the right of the stage */
    function updateZoom() {
      const want = state.focused === null ? 0 : 1;
      animate(view, { zoom: want }, tx({ type: "spring", stiffness: 60, damping: 18 }));
    }
    function updateShift() {
      const want = state.panelOpen && !mqMobile.matches ? Math.min(W * 0.22, 230) : 0;
      animate(view, { shift: want }, tx({ type: "spring", stiffness: 90, damping: 20 }));
    }

    /* ---------- animation loop ---------- */
    const clock = new THREE.Clock();
    const tmpQ = new THREE.Quaternion();
    const tmpV = new THREE.Vector3();
    const XAXIS = new THREE.Vector3(1, 0, 0);
    const zoomLook = new THREE.Vector3().copy(lookAt);
    const ZOOM = 0.34;   // how far the camera moves in on a focused branch
    const tmpC = new THREE.Color();
    let elapsed = 0;

    let visible = true;
    new IntersectionObserver(([en]) => { visible = en.isIntersecting; }, { threshold: 0 }).observe(stage);

    function frame() {
      requestAnimationFrame(frame);
      const dt = Math.min(clock.getDelta(), 0.05);
      if (!visible) return;
      elapsed += dt;
      const t = elapsed;

      // growth on load (values tweened by Motion)
      growables.forEach(g => {
        if (g.done) return;
        const count = g.mesh.userData.indexCount;
        g.mesh.geometry.setDrawRange(0, Math.max(0, Math.floor((count * g.k) / 3) * 3));
        if (g.k >= 1) g.done = true;
      });
      decoMesh.scale.setScalar(Math.max(0.001, deco.k));

      // rotation: Motion spring > drag inertia > idle auto-rotation
      const idle = performance.now() - lastInteract > 3500;
      if (!tweening && !dragging) {
        rot += vel;
        vel *= Math.pow(0.04, dt);
        if (idle && !state.panelOpen && !reduceMotion && state.focused === null) rot += dt * 0.12;
      }
      world.rotation.y = rot;

      // gentle sway of the whole tree
      if (!reduceMotion) {
        sway.rotation.z = Math.sin(t * 0.6) * 0.012;
        sway.rotation.x = Math.sin(t * 0.45 + 1) * 0.008;
        yantra.rotation.z = t * 0.03;
      }

      // bindu glow
      binduGlow.material.opacity = 0.45 + Math.sin(t * 2) * 0.15;
      binduGlow.scale.setScalar(1.2 + Math.sin(t * 2) * 0.12);

      // leaves: appear / hover / dim are Motion-tweened values
      leaves.forEach(L => {
        const s = L.appear * (1 + L.hover * 0.28 - L.dim * 0.12);
        L.group.scale.setScalar(Math.max(s, 0.0001));

        const swing = reduceMotion ? 0 : Math.sin(t * 1.4 + L.phase) * 0.12 + Math.sin(t * 2.3 + L.phase * 2) * 0.04;
        L.group.quaternion.copy(L.group.userData.baseQuat).multiply(tmpQ.setFromAxisAngle(XAXIS, swing));

        L.mat.color.copy(L.base).lerp(L.dimColor, L.dim);
        L.mat.emissiveIntensity = 0.08 + L.hover * 0.45;
        const pulse = 0.5 + 0.5 * Math.sin(t * 2.2 + L.phase);
        const lit = 0.28 + pulse * 0.22 + L.hover * 0.35;
        L.halo.material.opacity = lit + (0.08 - lit) * L.dim;
        L.halo.scale.setScalar((1.25 + pulse * 0.2 + L.hover * 0.4) * L.size);
      });

      // pollen drift
      if (!reduceMotion) {
        const arr = pGeo.attributes.position.array;
        for (let i = 0; i < PCOUNT; i++) {
          arr[i * 3 + 1] += pSpeed[i] * dt;
          arr[i * 3] += Math.sin(t * 0.7 + i) * 0.002;
          if (arr[i * 3 + 1] > 7.5) arr[i * 3 + 1] = 0;
        }
        pGeo.attributes.position.needsUpdate = true;
      }

      // shift the view left when the side panel covers the right of the stage
      if (Math.abs(view.shift) > 0.5) camera.setViewOffset(W, H, view.shift, 0, W, H);
      else camera.clearViewOffset();

      world.updateMatrixWorld(true);

      // zoom towards the focused branch so its leaves are large enough to pick
      if (view.zoom > 0.001 && state.focused !== null) {
        const bd = branchData[state.focused];
        tmpV.copy(bd.curve.getPointAt(0.66)).applyMatrix4(sway.matrixWorld);
        zoomLook.copy(lookAt).lerp(tmpV, 0.5 * view.zoom);
        camera.position.copy(zoomLook).addScaledVector(camOffset, 1 - ZOOM * view.zoom);
        camera.lookAt(zoomLook);
      } else if (view.zoom <= 0.001) {
        camera.position.copy(lookAt).add(camOffset);
        camera.lookAt(lookAt);
      } else {
        // zooming back out after the branch was cleared: ease from the last zoomed view
        zoomLook.lerp(lookAt, 1 - view.zoom);
        camera.position.copy(zoomLook).addScaledVector(camOffset, 1 - ZOOM * view.zoom);
        camera.lookAt(zoomLook);
      }

      // small leaves: grow in on load, fade back when another branch is focused
      minorBranches.forEach(info => {
        if (!info) return;
        if (!info.done) {
          info.recs.forEach(r => {
            const k = THREE.MathUtils.clamp((info.appear * 1.6 - r.delay) / 0.45, 0, 1);
            setMinorMatrix(r, 1 - Math.pow(1 - k, 3));
          });
          info.mesh.instanceMatrix.needsUpdate = true;
          info.cores.forEach(c => c.scale.setScalar(Math.max(0.001, Math.min(1, info.appear * 1.4))));
          if (info.appear >= 1) info.done = true;
        }
        if (Math.abs(info.dim - info.appliedDim) > 0.002) {
          info.appliedDim = info.dim;
          info.recs.forEach(r => info.mesh.setColorAt(r.idx, tmpC.copy(r.base).lerp(r.dimColor, info.dim)));
          info.mesh.instanceColor.needsUpdate = true;
          info.cores.forEach(c => c.material.color.copy(c.userData.base).lerp(c.userData.dimColor, info.dim));
        }
      });
      [hoverGlow, selGlow].forEach((g, k) => {
        if (!g.visible) return;
        const pulse = 0.5 + 0.5 * Math.sin(t * 3 + k);
        g.material.opacity = 0.55 + pulse * 0.3;
        g.scale.setScalar(0.55 + pulse * 0.12);
      });

      renderer.render(scene, camera);

      // place HTML labels at branch tips
      const R = 4;
      branchData.forEach((bd, i) => {
        tmpV.copy(bd.tip).add(new THREE.Vector3(0, 0.55, 0)).applyMatrix4(sway.matrixWorld);
        const depth = THREE.MathUtils.clamp((tmpV.z + R) / (2 * R), 0, 1);
        tmpV.project(camera);
        const x = (tmpV.x * 0.5 + 0.5) * W;
        const y = (-tmpV.y * 0.5 + 0.5) * H;
        const grown = labelGrow[i].k;
        const el = labelEls[i];
        const focusBoost = state.focused === i ? 1 : 0;
        const vis = THREE.MathUtils.smoothstep(Math.max(depth, focusBoost), 0.28, 0.5);
        const op = grown * vis;
        const sc = 0.82 + 0.18 * depth;
        el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) translate(-50%, -100%) scale(${sc.toFixed(3)})`;
        el.style.opacity = op.toFixed(3);
        el.style.zIndex = String(Math.round(depth * 100));
        el.tabIndex = op > 0.5 ? 0 : -1;
        el.style.pointerEvents = op > 0.3 ? "auto" : "none";
      });
    }
    requestAnimationFrame(frame);

    return {
      focus(i) { if (i !== null) faceBranch(i); refreshLeaves(); updateZoom(); noteInteraction(); },
      /* light up a leaf while its entry in the list is hovered */
      preview(b, c) {
        preview = b === null || b === undefined ? null : { b, c, minor: !!BRANCHES[b].centres[c].minor };
        refreshLeaves();
      },
      select(b) {
        if (b !== null && b !== undefined) faceBranch(b);
        refreshLeaves(); updateShift(); noteInteraction();
      }
    };
  }

  // small deterministic PRNG so the foliage looks the same every visit
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* ---------------------------------------------------------
     Find IKS places near me
  --------------------------------------------------------- */
  function setupNearby() {
    const PLACES = window.IKS_PLACES || [];
    const CITIES = window.IKS_CITIES || [];
    const KINDS = window.IKS.placeKinds;
    // Hindi: city names typed in Devanagari find their city too
    if (I18N.hi) CITIES.forEach(c => { const h = I18N.city(c.name); if (h !== c.name) c.aka = [...(c.aka || []), h]; });
    const RADII = [50, 100, 200, 300];
    const PAGE = 12;
    const kindOf = k => KINDS.find(g => g.kinds.includes(k)) || KINDS[0];
    const near = {
      origin: null,          // { lat, lng, label, city? } – city is set when typed, not geolocated
      radius: 100,
      kinds: new Set(KINDS.map(k => k.id)),
      shown: PAGE
    };
    const status = $("#near-status");
    const list = $("#near-results");
    const more = $("#near-more");
    const locateBtn = $("#near-locate");
    const input = $("#near-city");
    const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

    // straight-line distance in km (haversine)
    function km(a, b) {
      const r = Math.PI / 180;
      const dLat = (b.lat - a.lat) * r, dLng = (b.lng - a.lng) * r;
      const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dLng / 2) ** 2;
      return 2 * 6371 * Math.asin(Math.sqrt(h));
    }
    const fmtKm = d => t("{n} km", { n: d < 10 ? d.toFixed(1) : Math.round(d) });

    // Google Maps: with a typed city the route starts there; with "my location"
    // no origin is sent, so Google uses the device's own location.
    function directionsUrl(p) {
      const dest = p.kind === "centre" || p.kind === "institution" || p.kind === "ayush"
        ? `${p.host}, ${p.city}, ${p.state}`
        : `${p.name}, ${p.city}, ${p.state}`;
      const q = new URLSearchParams({ api: "1", destination: dest });
      if (near.origin && near.origin.city) q.set("origin", `${near.origin.city}, India`);
      return "https://www.google.com/maps/dir/?" + q.toString();
    }
    function infoUrl(p) {
      if (p.atlas) return p.atlas.url;
      if (p.url) return p.url;
      return "https://www.google.com/search?" + new URLSearchParams({ q: `${p.name} ${p.host || ""} ${p.city}` }).toString();
    }

    /* ---- controls: radius + kind filter chips ---- */
    function chip(label, pressed, color) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "chip";
      b.style.setProperty("--c", color);
      b.setAttribute("aria-pressed", String(pressed));
      b.innerHTML = `<span class="dot"></span>${label}`;
      return b;
    }
    const radiusChips = RADII.map(r => {
      const b = chip(t("{n} km", { n: r }), r === near.radius, "#8b6a3e");
      b.addEventListener("click", () => {
        near.radius = r;
        radiusChips.forEach((c, i) => c.setAttribute("aria-pressed", String(RADII[i] === r)));
        near.shown = PAGE;
        render(true);
      });
      $("#near-radius").appendChild(b);
      interactive(b, { lift: -2, shadow: "0px 8px 18px -12px", bg: "#fffaf0" });
      return b;
    });
    KINDS.forEach(k => {
      const b = chip(k.label, true, k.color);
      b.addEventListener("click", () => {
        if (near.kinds.has(k.id) && near.kinds.size > 1) near.kinds.delete(k.id);
        else near.kinds.add(k.id);
        b.setAttribute("aria-pressed", String(near.kinds.has(k.id)));
        near.shown = PAGE;
        render(true);
      });
      $("#near-kinds").appendChild(b);
      interactive(b, { lift: -2, shadow: "0px 8px 18px -12px", bg: "#fffaf0" });
    });

    // city suggestions
    $("#near-cities").innerHTML = CITIES.map(c => `<option value="${esc(c.name)}">${esc(I18N.hi ? `${I18N.city(c.name)} · ${stateName(c.state)}` : c.state)}</option>`).join("");

    /* ---- rendering ---- */
    /* what the place studies or does, shown on the card */
    function studyText(p) {
      const c = p.ref && CENTRE_BY_NAME[p.ref];
      if (c) return c.summary;
      if (p.study) return p.study;
      return (p.founded ? `Founded ${p.founded}. ` : "") + (p.about || "");
    }

    /* the expandable "Contact" component: person in charge, phone, e-mail, address, details */
    function contactBlock(p, id) {
      const c = p.ref && CENTRE_BY_NAME[p.ref];
      const rows = [];
      const lead = c ? (c.people || [])[0] : p.lead;
      const contact = c ? (c.contact || {}) : (p.contact || {});
      let html = "";

      // person in charge
      if (lead) {
        html += `<div class="sc-person"><span class="sc-label">${t("Person in charge")}</span>
          <b>${esc(lead.name)}</b><span>${esc(lead.role)}</span>
          ${lead.asOf ? `<small>${t("As listed in: {src}", { src: esc(lead.asOf) })}</small>` : ""}</div>`;
      } else if (p.kind === "heritage" || p.kind === "tradition") {
        html += `<p class="sc-none">${p.kind === "heritage"
          ? t("A public heritage site, not an institution, so no single person is in charge. Visitor details are on the site's official page.")
          : t("A living tradition carried by a community, not an institution, so no single person is in charge.")}</p>`;
      } else {
        html += `<p class="sc-none">${t("The source doesn't name a person in charge.")}</p>`;
      }

      // phone / e-mail / address (only what a source lists)
      // institutional contacts are labelled as office lines; directory listings say who listed them
      const listed = !!contact.listedBy;
      if (contact.phone) rows.push([listed ? t("Listed phone") : t("Office phone"), telLink(contact.phone)]);
      if (contact.email) rows.push([listed ? t("Listed email") : t("Office email"), mailLink(contact.email)]);
      if (contact.address) rows.push([t("Address"), esc(contact.address)]);
      if (contact.hours) rows.push([t("Hours"), esc(contact.hours)]);
      if (rows.length) {
        html += `<dl class="pd-contact">${rows.map(([dt, d]) => `<dt>${dt}</dt><dd>${d}</dd>`).join("")}</dl>`;
      }
      if (!contact.phone && !contact.email && p.kind !== "heritage" && p.kind !== "tradition") {
        const who = lead ? lead.name.replace(/^(Dr|Prof)\.?\s*/i, "") : p.name;
        const q = new URLSearchParams({ q: `${who} ${(p.en && p.en.host) || p.host || p.name} contact email` }).toString();
        html += `<p class="sc-none">${p.source === "iksindia"
          ? t("The IKS Division doesn't publish phone numbers or e-mails for its centres.")
          : p.source === "gurukul" ? t("The gurukul directories don't list a phone number for it.")
          : p.source === "atlas" ? t("The IKS Atlas doesn't list contact details.")
          : t("The source doesn't list a phone number or e-mail.")}
          <a href="https://www.google.com/search?${q}" target="_blank" rel="noopener">${lead ? t("Search for {name}'s contact", { name: esc(lead.name) }) : t("Search for their contact")}</a>.</p>`;
      }

      // more about the work
      if (c && c.activities && c.activities.length) {
        html += `<div class="sc-more"><span class="sc-label">${t("What happens here")}</span>
          <ul class="pd-list">${c.activities.map(a => `<li>${esc(a)}</li>`).join("")}</ul></div>`;
      } else if (p.source === "iksindia" && p.status) {
        html += `<div class="sc-more"><span class="sc-label">${t("About this centre")}</span>
          <ul class="pd-list"><li>${t("Status: {s}", { s: esc(I18N.hi ? p.status : p.status.toLowerCase()) })}</li><li>${esc(p.pillars || "")}</li><li>${t("Funded by the IKS Division, Ministry of Education")}</li></ul></div>`;
      }

      const src = c ? (c.sources || [])[0] : null;
      const srcLine = src ? `<a href="${esc(src.url)}" target="_blank" rel="noopener">${esc(src.label)}</a> ${t("and the leaf's full source list")}`
        : p.source === "iksindia" ? `<a href="https://iksindia.org/search_site_centers/index.php" target="_blank" rel="noopener">${t("IKS Division list of centres")}</a>`
        : p.source === "uem" ? `<a href="https://iks.uem.edu.in/iks-centres/" target="_blank" rel="noopener">iks.uem.edu.in</a>`
        : p.source === "gurukul" ? [["aaryasamaj.com", "https://www.aaryasamaj.com/gurukuls-list"], ["vediconcepts.org", "https://vediconcepts.org/gurukul-list/"]]
            .filter(([n]) => (contact.listedBy || "").includes(n))
            .map(([n, u]) => `<a href="${u}" target="_blank" rel="noopener">${n}</a>`).join(t(" and ")) + t(" (directory listings may be out of date; confirm before visiting)")
        : p.source === "hindupedia" ? `<a href="https://www.hindupedia.com/en/Oriental_Research_Institutes_of_India" target="_blank" rel="noopener">Hindupedia: Oriental Research Institutes of India</a>`
        : p.source === "hmml" ? `<a href="https://hmml.org/collections/repositories/india/" target="_blank" rel="noopener">${t("HMML repository list")}</a>`
        : p.source === "atlas" ? `<a href="${esc(p.atlas.url)}" target="_blank" rel="noopener">${t("IKS Atlas record {id}", { id: esc(p.atlas.id) })}</a> ${t("(a draft in review; its descriptions and sources aren't verified yet)")}`
        : p.source === "iish" ? `<a href="https://www.iish.org/contact/" target="_blank" rel="noopener">iish.org</a>`
        : `<a href="https://iksguru.in/" target="_blank" rel="noopener">iksguru.in</a>`;
      html += `<p class="sc-source">${t("Source: {src}.", { src: srcLine })}</p>`;
      html += `<p class="sc-source"><button type="button" class="sc-suggest" data-feedback="${esc(p.name)}">${t("Suggest an update")}</button></p>`;
      return `<div class="spot-contact" id="${id}" hidden>${html}</div>`;
    }

    let cardSeq = 0;
    function card(p) {
      const k = kindOf(p.kind);
      const where = [p.host && p.kind !== "tradition" ? esc(p.host) : null,
        [p.city !== p.state ? esc(p.city) : null, esc(stateName(p.state))].filter(Boolean).join(", ")]
        .filter(Boolean).join(" · ");
      const info = p.atlas ? t("IKS Atlas") : p.url ? t("Website") : t("Learn more");
      const study = studyText(p);
      const id = `spot-contact-${++cardSeq}`;
      return `
        <li class="spot" style="--c:${k.color}">
          <div class="place-top">
            <span class="place-kind"><span class="dot"></span>${esc(k.one || k.label.replace(/s$/, ""))}</span>
            <span class="place-dist">${fmtKm(p.d)}</span>
          </div>
          <h3>${esc(p.name)}</h3>
          <p class="place-host">${where}${p.approx ? `<span class="approx" title="${t("Shown at the city centre: the source gives no street address")}">${t("approx.")}</span>` : ""}</p>
          ${study ? `<p class="place-about"><span class="spot-label">${["heritage", "tradition", "museum", "archive", "text"].includes(p.kind) ? t("What it is") : t("What they study")}</span>${esc(study)}</p>` : ""}
          ${contactBlock(p, id)}
          <div class="place-actions">
            <a class="near-btn primary" style="--c:${k.color}" href="${esc(directionsUrl(p))}" target="_blank" rel="noopener">
              <svg aria-hidden="true"><use href="#pin-icon"/></svg>${t("Directions")}
            </a>
            <button type="button" class="near-btn spot-toggle" style="--c:${k.color}" aria-expanded="false" aria-controls="${id}">${t("Contact")}</button>
            <a class="near-btn" style="--c:${k.color}" href="${esc(infoUrl(p))}" target="_blank" rel="noopener">${info}</a>
            ${p.leaf ? `<button type="button" class="near-btn spot-tree" style="--c:${k.color}" data-b="${p.leaf.bi}" data-c="${p.leaf.ci}">
              <svg aria-hidden="true"><use href="#leaf-icon"/></svg>${t("On the tree")}</button>` : ""}
          </div>
        </li>`;
    }

    // open / close a card's contact section (one listener for the whole list)
    list.addEventListener("click", e => {
      const leafBtn = e.target.closest(".spot-tree");
      if (leafBtn) {
        openCentre(+leafBtn.dataset.b, +leafBtn.dataset.c);
        $("#stage").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
        return;
      }
      const btn = e.target.closest(".spot-toggle");
      if (!btn) return;
      const panel = document.getElementById(btn.getAttribute("aria-controls"));
      const open = btn.getAttribute("aria-expanded") !== "true";
      btn.setAttribute("aria-expanded", String(open));
      btn.textContent = open ? t("Hide contact") : t("Contact");
      panel.anim?.stop();
      if (open) {
        panel.hidden = false;
        const h = panel.scrollHeight;
        panel.anim = animate(panel, { height: [0, h], opacity: [0, 1] }, tx({ duration: 0.35, ease: EASE }));
        panel.anim.then(() => { panel.style.height = ""; });
      } else {
        panel.anim = animate(panel, { height: [panel.offsetHeight, 0], opacity: [1, 0] }, tx({ duration: 0.25, ease: EASE }));
        panel.anim.then(() => { if (btn.getAttribute("aria-expanded") === "false") { panel.hidden = true; panel.style.height = ""; } });
      }
    });

    function render(animateIn) {
      if (!near.origin) return;
      const pool = PLACES
        .filter(p => !p.noMap && near.kinds.has(kindOf(p.kind).id))
        .map(p => ({ ...p, d: km(near.origin, p) }))
        .sort((a, b) => a.d - b.d);
      const inside = pool.filter(p => p.d <= near.radius);
      const where = `<strong>${esc(near.origin.label)}</strong>`;
      let items;
      if (inside.length) {
        status.innerHTML = t(inside.length === 1 ? "{n} IKS place within {r} km of {where}." : "{n} IKS places within {r} km of {where}.", { n: inside.length, r: near.radius, where });
        items = inside;
      } else {
        const next = pool.slice(0, 3);
        status.innerHTML = t("Nothing within {r} km of {where}.", { r: near.radius, where }) + " " +
          (next.length ? t(next.length === 1 ? "The nearest place is below; try a wider distance." : "The nearest places are below; try a wider distance.") : "");
        items = next;
      }
      const visible = items.slice(0, near.shown);
      list.innerHTML = visible.map(card).join("");
      list.querySelectorAll(".near-btn").forEach(a => interactive(a, { lift: -2, shadow: "0px 8px 18px -12px" }));
      list.querySelectorAll(".spot").forEach(li => interactive(li, { lift: -3, shadow: "0px 18px 30px -22px", border: false, press: false }));
      const rest = items.length - visible.length;
      more.hidden = rest <= 0;
      more.textContent = t("Show {n} more", { n: rest });
      if (animateIn) reveal(Array.from(list.children), { gap: 0.05, y: 14, duration: 0.55 });
      else if (visible.length) {
        const fresh = Array.from(list.children).slice(near.shown - PAGE);
        reveal(fresh, { gap: 0.05, y: 14, duration: 0.55 });
      }
    }
    more.addEventListener("click", () => { near.shown += PAGE; render(false); });
    interactive(more, { lift: -2, shadow: "0px 8px 18px -12px" });

    let scrollAfterResults = false;
    const scrollToSection = () =>
      $("#nearby").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });

    function setOrigin(origin) {
      near.origin = origin;
      near.shown = PAGE;
      render(true);
      // the hero button scrolls before the results exist; settle on the section once they do
      if (scrollAfterResults) { scrollAfterResults = false; scrollToSection(); }
    }

    /* ---- typed city ---- */
    function findCity(q) {
      const s = q.trim().toLowerCase();
      if (!s) return null;
      const names = c => [c.name, ...(c.aka || [])].map(n => n.toLowerCase());
      return CITIES.find(c => names(c).includes(s)) ||
             CITIES.find(c => names(c).some(n => n.startsWith(s))) || null;
    }
    $("#near-city-form").addEventListener("submit", e => {
      e.preventDefault();
      const c = findCity(input.value);
      if (!c) {
        status.innerHTML = input.value.trim()
          ? t("“{q}” isn't in the city list yet. Try a nearby larger city, or use your location.", { q: esc(input.value.trim()) })
          : t("Type a city name, or use your location.");
        list.innerHTML = ""; more.hidden = true;
        return;
      }
      input.value = I18N.city(c.name);
      setOrigin({ lat: c.lat, lng: c.lng, label: I18N.city(c.name), city: c.name });
    });
    input.addEventListener("change", () => { if (findCity(input.value)) $("#near-city-form").requestSubmit(); });

    /* ---- browser location ---- */
    function locate() {
      if (!("geolocation" in navigator)) {
        status.textContent = t("This browser can't share its location. Type a city instead.");
        input.focus();
        return;
      }
      locateBtn.disabled = true;
      status.textContent = t("Finding your location…");
      navigator.geolocation.getCurrentPosition(pos => {
        locateBtn.disabled = false;
        const here = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        const closest = CITIES.reduce((best, c) => (km(here, c) < km(here, best) ? c : best), CITIES[0]);
        const label = closest && km(here, closest) < 40 ? t("your location (near {city})", { city: I18N.city(closest.name) }) : t("your location");
        setOrigin({ ...here, label });
      }, err => {
        locateBtn.disabled = false;
        scrollAfterResults = false;
        status.textContent = err.code === err.PERMISSION_DENIED
          ? t("Location access was blocked. Type a city instead, or allow location for this site in your browser.")
          : t("Couldn't get your location just now. Type a city instead.");
        input.focus();
      }, { enableHighAccuracy: false, timeout: 12000, maximumAge: 10 * 60 * 1000 });
    }
    locateBtn.addEventListener("click", locate);
    interactive(locateBtn, { shadow: "0px 10px 22px -12px" });

    const heroBtn = $("#hero-near");
    heroBtn.addEventListener("click", () => {
      scrollAfterResults = true;
      scrollToSection();
      locate();
    });
    interactive(heroBtn, { shadow: "0px 10px 22px -12px" });

    status.textContent = t("Use your location or type a city to see what's nearby.");

    // let other features (the chatbot) show "near me" results for a city
    return {
      nearCity(cityName) {
        const c = findCity(cityName);
        if (!c) return false;
        input.value = I18N.city(c.name);
        scrollAfterResults = true;
        setOrigin({ lat: c.lat, lng: c.lng, label: I18N.city(c.name), city: c.name });
        return true;
      },
      km, kindOf, findCity, directionsUrl
    };
  }

  /* ---------------------------------------------------------
     boot
  --------------------------------------------------------- */
  /* page-level entrance + scroll-triggered reveals */
  function setupReveals() {
    // frame ornaments fade in on load (opacity only: their transforms mirror them)
    animate(".frame .orn", { opacity: [0, 1] }, tx({ duration: 1.2, delay: stagger(0.06, { startDelay: 0.1 }) }));
    // hero: kicker, title, lede rise in one after another
    reveal(".hero > *", { delay: 0.15, gap: 0.12, y: 22, duration: 0.9 });
    animate("#lang-toggle", { opacity: [0, 1], y: [-10, 0] }, tx({ duration: 0.6, delay: 0.5, ease: EASE }));

    const once = { amount: 0.2 };
    inView(".stage", el => { animate(el, { opacity: [0, 1] }, tx({ duration: 1.2, ease: EASE })); }, { amount: 0.1 });
    inView(".branches", el => {
      animate(el.querySelectorAll(".chip"), { opacity: [0, 1], y: [18, 0], scale: [0.94, 1] },
        tx({ type: "spring", stiffness: 260, damping: 22, delay: stagger(0.06, { startDelay: 0.1 }) }));
    }, once);
    inView(".branch-info", el => { reveal([el], { y: 24, duration: 0.8 }); }, once);
    inView(".nearby", el => { reveal([el], { y: 24, duration: 0.8 }); }, { amount: 0.1 });
    inView(".acks", el => {
      reveal([el], { y: 24, duration: 0.8 });
      reveal(el.querySelectorAll(".ack"), { delay: 0.25, gap: 0.04, y: 12, duration: 0.5 });
    }, { amount: 0.1 });
    inView(".foot", el => { reveal(Array.from(el.children), { gap: 0.14, y: 14, duration: 0.9 }); }, { amount: 0.5 });
  }

  buildMandala();
  buildChips();
  renderBranchInfo();
  buildMap();
  const nearby = setupNearby();
  setupReveals();
  if ($("#lang-toggle")) interactive($("#lang-toggle"), { lift: -2, shadow: "0px 10px 22px -12px", bg: "#fffaf0" });
  tree = createTree();

  /* shared with js/chat.js */
  window.IKSApp = {
    animate, inView, stagger, tx, EASE, SPRING, SOFT_SPRING, reduceMotion,
    interactive, reveal, esc, telLink, mailLink,
    CENTRE_BY_NAME, STATE_NAMES,
    openCentre, focusBranch,
    nearCity: name => nearby.nearCity(name),
    km: nearby.km, kindOf: nearby.kindOf, findCity: nearby.findCity, directionsUrl: nearby.directionsUrl
  };
})();
