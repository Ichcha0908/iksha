/* =============================================================
   Jñāna Sahāyaka: a chatbot that answers questions about IKS using
   only the data on this site (js/data.js, js/places.js, js/cities.js).

   Built-in mode (default): runs in the browser. It recognises common
   question shapes (near a city, in a state, who runs X, contact for X,
   how many, what is a branch) and otherwise searches the data.

   AI mode: if window.IKS_CHAT.endpoint is set, the same search picks the
   most relevant records and sends them with the question to the server
   function in /server, which asks Claude to answer from those records
   only. If that call fails, the built-in answer is shown instead.
   ============================================================= */
(function () {
  "use strict";
  const A = window.IKSApp;
  if (!A) return;
  const { animate, tx, EASE, SPRING, interactive, esc, telLink, mailLink, STATE_NAMES } = A;
  const BRANCHES = window.IKS.branches;
  const PLACES = window.IKS_PLACES || [];
  const CITIES = window.IKS_CITIES || [];
  const KINDS = window.IKS.placeKinds;
  const ENDPOINT = ((window.IKS_CHAT || {}).endpoint || "").trim();
  const $ = s => document.querySelector(s);

  /* ---------------------------------------------------------
     text helpers
  --------------------------------------------------------- */
  const fold = s => String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const STOP = new Set(("a an the of in on at to for and or is are was were be by with from about me my i you your " +
    "what which who whom whose where when how many much tell show list give find any some there here near nearby around " +
    "do does did can could would should please centre centres center centers place places institute institutes " +
    "india indian iks know information info details detail this that these those it its").split(" "));
  const words = s => fold(s).replace(/[^a-z0-9ऀ-෿ ]+/g, " ").split(/\s+/).filter(Boolean);
  const terms = s => words(s).filter(w => !STOP.has(w) && w.length > 1);

  /* ---------------------------------------------------------
     knowledge base: tree centres, places, branches
  --------------------------------------------------------- */
  const DOCS = [];
  BRANCHES.forEach((b, bi) => b.centres.forEach((c, ci) => {
    DOCS.push({
      type: "leaf", bi, ci, b, c, name: c.name, city: c.city, state: STATE_NAMES[c.state] || "",
      text: [c.name, c.type, c.summary, (c.activities || []).join(" "), c.city, STATE_NAMES[c.state], b.name,
        (c.people || []).map(p => p.name + " " + p.role).join(" ")].join(" ")
    });
  }));
  const leafNames = new Set(DOCS.map(d => fold(d.name)));
  PLACES.forEach(p => {
    if (p.ref && leafNames.has(fold(p.ref))) return; // the leaf already covers it
    DOCS.push({
      type: "place", p, name: p.name, city: p.city, state: p.state,
      text: [p.name, p.host, p.city, p.state, p.study, p.about, (A.kindOf(p.kind) || {}).label, p.kind,
        p.lead ? p.lead.name : "", p.founded ? "founded " + p.founded : ""].join(" ")
    });
  });
  const DF = new Map();
  DOCS.forEach(d => {
    d.nameT = new Set(terms(d.name));
    d.textT = new Set(terms(d.text));
    d.textT.forEach(t => DF.set(t, (DF.get(t) || 0) + 1));
  });
  const idf = t => Math.log(1 + DOCS.length / (1 + (DF.get(t) || 0)));

  function score(d, qt) {
    let s = 0, nameHits = 0;
    qt.forEach(t => {
      if (d.nameT.has(t)) { s += 3 * idf(t); nameHits++; }
      else if (d.textT.has(t)) s += idf(t);
      else if (t.length > 4) { // light prefix match for inflections and partial words
        for (const w of d.nameT) if (w.startsWith(t) || t.startsWith(w) && w.length > 4) { s += 1.5 * idf(t); nameHits++; break; }
      }
    });
    return { s, nameHits };
  }
  function search(q, { limit = 6, filter = null, needName = false } = {}) {
    const qt = terms(q);
    if (!qt.length) return [];
    return DOCS.filter(d => !filter || filter(d))
      .map(d => ({ d, ...score(d, qt) }))
      .filter(r => r.s > 0 && (!needName || r.nameHits > 0))
      .sort((a, b) => b.s - a.s)
      .slice(0, limit);
  }

  /* ---------------------------------------------------------
     recognising places, states and kinds in a question
  --------------------------------------------------------- */
  const STATES = [...new Set(Object.values(STATE_NAMES).concat(PLACES.map(p => p.state)).filter(Boolean))];
  const STATE_ALIAS = { "up": "Uttar Pradesh", "mp": "Madhya Pradesh", "tn": "Tamil Nadu", "ap": "Andhra Pradesh", "wb": "West Bengal",
    "orissa": "Odisha", "j&k": "Jammu and Kashmir", "kashmir": "Jammu and Kashmir", "bengal": "West Bengal" };
  function findState(q) {
    const f = " " + fold(q).replace(/[^a-z& ]/g, " ") + " ";
    const hit = STATES.filter(s => f.includes(" " + fold(s) + " ")).sort((a, b) => b.length - a.length)[0];
    if (hit) return hit;
    for (const [k, v] of Object.entries(STATE_ALIAS)) if (f.includes(" " + k + " ")) return v;
    return null;
  }
  function findCityIn(q) {
    const f = " " + fold(q).replace(/[^a-z ]/g, " ") + " ";
    let best = null;
    CITIES.forEach(c => [c.name, ...(c.aka || [])].forEach(n => {
      const k = " " + fold(n) + " ";
      if (f.includes(k) && (!best || n.length > best.len)) best = { city: c, len: n.length };
    }));
    // a city that is also a state name (e.g. Delhi) counts as a city only when asked "near"
    return best ? best.city : null;
  }
  const KIND_WORDS = [
    { re: /gurukul|gurukula|pathashala|patashala|pathasala|veda school|vedic school|vidyalaya/, kinds: ["gurukul"], label: "gurukuls" },
    { re: /ayurved|ayush|unani|siddha|medicine|health|wellbeing|wellness|yoga/, kinds: ["ayush"], branch: "health", label: "Āyurveda, Yoga and health places",
      alsoKinds: ["centre", "institution"], alsoText: /ayurved|yoga|unani|siddha|medic|health|wellbeing|ayush|rasayana|vrikshayurved/ },
    { re: /manuscript|library|libraries|archive|oriental/, kinds: ["institution"], text: /manuscript|library|oriental/, branch: "heritage", label: "manuscript libraries and oriental institutes" },
    { re: /temple|heritage site|observatory|monument|ancient universit|nalanda/, kinds: ["heritage"], label: "heritage sites" },
    { re: /tradition|craft|tribal|stepwell/, kinds: ["tradition"], label: "living traditions" },
    { re: /iks cent|iks division|research cent|iit|universit/, kinds: ["centre", "institution"], label: "IKS centres and institutions" }
  ];
  const kindIn = q => KIND_WORDS.find(k => k.re.test(fold(q))) || null;
  const matchesKind = (d, k) => {
    if (!k) return true;
    if (d.type === "leaf") return !!k.branch && d.b.id === k.branch;
    if (k.alsoKinds && k.alsoKinds.includes(d.p.kind) && k.alsoText.test(fold(d.text))) return true;
    if (!k.kinds.includes(d.p.kind)) return false;
    return !k.text || k.text.test(fold(d.text));
  };

  const BRANCH_WORDS = {
    veda: /\bveda|vedic|darshan|darsana|philosoph|upanishad|vedanta|nyaya|mimamsa|samkhya|sankhya/,
    language: /language|literature|sanskrit|tamil|grammar|vyakarana|poetry|kavya|sahitya/,
    arts: /\bart|aesthetic|dance|music|natya|kathakali|craft|sculpture|rasa/,
    health: /ayurved|yoga|health|wellbeing|medicine/,
    science: /science|technolog|mathemat|ganita|astronom|jyotis|metallurg|vastu/,
    heritage: /heritage|manuscript|library|archive|palm.?leaf/
  };

  /* ---------------------------------------------------------
     answer building blocks (HTML strings + action buttons)
  --------------------------------------------------------- */
  const loc = d => [d.city, d.state].filter((v, i, a) => v && a.indexOf(v) === i).join(", ");
  function leadOf(d) {
    if (d.type === "leaf") return (d.c.people || [])[0] || null;
    if (d.p.ref && A.CENTRE_BY_NAME[d.p.ref]) return (A.CENTRE_BY_NAME[d.p.ref].people || [])[0] || null;
    return d.p.lead || null;
  }
  function contactOf(d) {
    if (d.type === "leaf") return d.c.contact || {};
    if (d.p.ref && A.CENTRE_BY_NAME[d.p.ref]) return A.CENTRE_BY_NAME[d.p.ref].contact || {};
    return d.p.contact || {};
  }
  function aboutOf(d) {
    if (d.type === "leaf") return (d.c.founded ? `Founded ${d.c.founded}. ` : "") + d.c.summary;
    if (d.p.ref && A.CENTRE_BY_NAME[d.p.ref]) return A.CENTRE_BY_NAME[d.p.ref].summary;
    const squash = v => fold(v).replace(/[^a-z0-9]/g, "");
    const study = d.p.study && squash(d.p.study) !== squash(d.p.name) ? d.p.study : "";
    return (d.p.founded ? `Founded ${d.p.founded}. ` : "") + [study, d.p.about, d.p.pillars].filter(Boolean).join(" ");
  }
  function actionsFor(d) {
    const acts = [];
    if (d.type === "leaf") acts.push({ label: "Open on the tree", run: () => A.openCentre(d.bi, d.ci) });
    else {
      if (!d.p.noMap) acts.push({ label: "Directions", href: A.directionsUrl(d.p) });
      if (d.p.url) acts.push({ label: "Website", href: d.p.url });
    }
    return acts;
  }
  function itemLine(d, extra = "") {
    const kind = d.type === "leaf" ? d.b.name
      : d.p.kind === "institution" && d.p.host && d.p.host.length < 40 ? d.p.host
      : ((A.kindOf(d.p.kind) || {}).label || "").replace(/s$/, "");
    return `<b>${esc(d.name)}</b> <span class="cb-dim">· ${esc(kind)} · ${esc(loc(d))}${extra}</span>`;
  }
  function listAnswer(intro, docs, more = "") {
    return {
      html: `<p>${intro}</p><ul class="cb-list">${docs.map(x => `<li>${itemLine(x.d || x, x.dist != null ? ` · ${Math.round(x.dist)} km` : "")}</li>`).join("")}</ul>${more}`,
      picks: docs.map(x => x.d || x)
    };
  }
  function describe(d, { focus = "all" } = {}) {
    const lead = leadOf(d), k = contactOf(d);
    const parts = [`<p><b>${esc(d.name)}</b> <span class="cb-dim">· ${esc(loc(d))}</span></p>`];
    if (focus === "all") parts.push(`<p>${esc(aboutOf(d))}</p>`);
    if (lead) parts.push(`<p><span class="cb-label">Person in charge</span> ${esc(lead.name)}, ${esc(lead.role)}${lead.asOf ? ` <span class="cb-dim">(as listed in ${esc(lead.asOf)})</span>` : ""}</p>`);
    else if (focus !== "all") parts.push(`<p class="cb-dim">The site's sources don't name a person in charge here.</p>`);
    const rows = [];
    if (k.phone) rows.push(`Phone: ${telLink(k.phone)}`);
    if (k.email) rows.push(`Email: ${mailLink(k.email)}`);
    if (k.address && focus !== "person") rows.push(`Address: ${esc(k.address)}`);
    if (rows.length) parts.push(`<p>${rows.join("<br>")}${k.listedBy ? ` <span class="cb-dim">(listed by ${esc(k.listedBy)})</span>` : ""}</p>`);
    else if (focus === "contact") parts.push(`<p class="cb-dim">${d.type === "place" && d.p.source === "iksindia"
      ? "The IKS Division doesn't publish phone numbers or e-mails for its centres."
      : "The site's sources don't list a phone number or e-mail for it."}</p>`);
    return { html: parts.join(""), picks: [d], actions: actionsFor(d) };
  }

  /* ---------------------------------------------------------
     the built-in answerer
  --------------------------------------------------------- */
  const SUGGEST = [
    "Gurukuls near Varanasi",
    "Who heads Sahitya Akademi?",
    "Āyurveda centres in Kerala",
    "How many gurukuls are in Haryana?",
    "Manuscript libraries in Tamil Nadu",
    "What is Veda & Darshana about?"
  ];
  const HELP = `<p>Namaste. I answer from the information on this website: the centres on the tree, ${PLACES.length} IKS places and gurukuls, their people, contacts and sources.</p>
    <p>Try asking about a place near a city, centres in a state, who runs a centre, how to contact one, or what a branch of knowledge covers.</p>`;

  function builtIn(q) {
    const f = fold(q).trim();
    if (!f || /^(hi|hello|hey|namaste|namaskar|pranam)\b|what can you do|^help\b|how do you work/.test(f)) {
      return { html: HELP, suggest: SUGGEST };
    }
    const kind = kindIn(q);
    const city = findCityIn(q);
    const state = findState(q);
    const radius = +((f.match(/(\d{2,3})\s*km/) || [])[1] || 0);

    const wantsContact = /contact|phone|number|call|email|e-mail|mail|address|reach|visit|timing|hours/.test(f);
    // 1. how many
    if (/how many|\bcount\b/.test(f) || (/number of/.test(f) && !/phone|contact|mobile/.test(f))) {
      const pool = DOCS.filter(d => matchesKind(d, kind) && (!state || d.state === state));
      const what = kind ? kind.label : "IKS places, centres and gurukuls";
      return { html: `<p>The site lists <b>${pool.length}</b> ${esc(what)}${state ? ` in ${esc(state)}` : ""}.</p>` +
        (pool.length ? `<p class="cb-dim">Ask "${esc(kind ? kind.label : "places")} in ${esc(state || "a state")}" to see them.</p>` : "") };
    }

    // 2. near a city
    if (city && (/near|around|close to|within|nearby|km/.test(f) || !state || fold(city.name) !== fold(state))) {
      const r = radius || 60;
      const hits = DOCS.filter(d => d.type === "place" && !d.p.noMap && matchesKind(d, kind))
        .map(d => ({ d, dist: A.km(city, d.p) })).filter(x => x.dist <= r).sort((a, b) => a.dist - b.dist);
      // leaves in that city too
      const leaves = DOCS.filter(d => d.type === "leaf" && matchesKind(d, kind) && fold(d.city).includes(fold(city.name)));
      const all = leaves.map(d => ({ d, dist: 0 })).concat(hits);
      if (!all.length) {
        return { html: `<p>I don't have any ${esc(kind ? kind.label : "IKS places")} within ${r} km of ${esc(city.name)}.</p>`,
          actions: [{ label: `Show nearest to ${city.name}`, run: () => A.nearCity(city.name) }] };
      }
      const top = all.slice(0, 6);
      const res = listAnswer(`${all.length} ${esc(kind ? kind.label : "IKS places")} within ${r} km of <b>${esc(city.name)}</b>${all.length > 6 ? ", nearest first" : ""}:`, top);
      res.actions = [{ label: `See all near ${city.name}`, run: () => A.nearCity(city.name) }];
      return res;
    }

    // 3. who runs / contact for a named centre
    const wantsPerson = /\bwho\b|head|in charge|incharge|director|principal|vice.?chancellor|secretary|president|acharya|run(s|ning)?\b|lead/.test(f);
    if (wantsPerson || wantsContact) {
      const hit = search(q, { limit: 1, needName: true })[0];
      if (hit && hit.nameHits >= Math.min(2, terms(hit.d.name).length)) {
        return describe(hit.d, { focus: wantsContact ? "contact" : "person" });
      }
    }

    // 4. listing by state (and kind)
    if (state && (kind || /list|which|what|show|in /.test(f))) {
      const pool = DOCS.filter(d => d.state === state && matchesKind(d, kind));
      if (!pool.length) return { html: `<p>I don't have any ${esc(kind ? kind.label : "IKS places")} in ${esc(state)} on this site.</p>` };
      pool.sort((a, b) => (a.type === "leaf" ? -1 : 0) - (b.type === "leaf" ? -1 : 0) || (a.p && a.p.kind === "gurukul") - (b.p && b.p.kind === "gurukul"));
      const top = pool.slice(0, 8);
      return listAnswer(`${pool.length} ${esc(kind ? kind.label : "IKS places and centres")} in <b>${esc(state)}</b>${pool.length > 8 ? " (first 8)" : ""}:`, top,
        pool.length > 8 ? `<p class="cb-dim">Ask about one by name for details, or narrow it down, e.g. "gurukuls near ${esc((CITIES.find(c => c.state === state) || {}).name || "a city")}".</p>` : "");
    }

    // 5. a branch of knowledge
    const bid = Object.keys(BRANCH_WORDS).find(id => BRANCH_WORDS[id].test(f));
    if (bid && !search(q, { limit: 1, needName: true }).some(r => r.nameHits >= 2)) {
      const b = BRANCHES.find(x => x.id === bid), bi = BRANCHES.indexOf(b);
      const leaves = DOCS.filter(d => d.type === "leaf" && d.bi === bi);
      return {
        html: `<p><b>${esc(b.name)}</b> <span class="cb-dim">(${esc(b.sanskrit)})</span>: ${esc(b.blurb)}</p>
               <p>Centres on this branch of the tree:</p><ul class="cb-list">${leaves.map(d => `<li>${itemLine(d)}</li>`).join("")}</ul>`,
        picks: leaves, actions: [{ label: `Show the ${b.name} branch`, run: () => { A.focusBranch(bi); $("#stage").scrollIntoView({ behavior: "smooth" }); } }]
      };
    }

    // 6. a named centre or place
    const hits = search(q, { limit: 5 });
    const qn = terms(q).length;
    if (hits.length && hits[0].nameHits >= Math.max(1, Math.min(2, qn)) && (hits.length === 1 || hits[0].s > hits[1].s * 1.15)) {
      return describe(hits[0].d);
    }
    if (hits.length) {
      return listAnswer("Here's what I found on the site that best matches your question:", hits.slice(0, 5),
        `<p class="cb-dim">Ask about one of them by name for its details and contacts.</p>`);
    }
    return { html: `<p>I couldn't find that in this site's information. I only know the IKS centres, institutes, gurukuls and heritage places listed here.</p>`, suggest: SUGGEST };
  }

  /* ---------------------------------------------------------
     AI mode: send the question and the most relevant records
  --------------------------------------------------------- */
  function recordOf(d) {
    const lead = leadOf(d), k = contactOf(d);
    const src = d.type === "leaf" ? (d.c.sources || []).map(s => s.url).slice(0, 2).join(" ")
      : ({ iksindia: "iksindia.org", uem: "iks.uem.edu.in", iksguru: "iksguru.in", tree: "this site", gurukul: k.listedBy, hindupedia: "hindupedia.com", hmml: "hmml.org" })[d.p.source] || "";
    return {
      name: d.name, kind: d.type === "leaf" ? `${d.b.name} centre` : d.p.kind, location: loc(d),
      about: aboutOf(d), person_in_charge: lead ? `${lead.name}, ${lead.role}` : undefined,
      phone: k.phone, email: k.email, address: k.address, website: d.type === "leaf" ? k.website : d.p.url, source: src
    };
  }
  function contextFor(q, local) {
    const picked = new Map();
    (local.picks || []).forEach(d => picked.set(d, true));
    search(q, { limit: 12 }).forEach(r => picked.set(r.d, true));
    const city = findCityIn(q);
    if (city) DOCS.filter(d => d.type === "place" && !d.p.noMap).map(d => ({ d, x: A.km(city, d.p) }))
      .sort((a, b) => a.x - b.x).slice(0, 8).forEach(r => picked.set(r.d, true));
    const records = [...picked.keys()].slice(0, 24).map(recordOf);
    const branches = BRANCHES.map(b => ({ branch: b.name, about: b.blurb, centres: b.centres.map(c => c.name) }));
    return { records, branches, counts: { places: PLACES.length, gurukuls: PLACES.filter(p => p.kind === "gurukul").length } };
  }
  const history = [];
  async function askAI(q, local) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 45000);
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST", signal: ctrl.signal,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q, history: history.slice(-6), context: contextFor(q, local) })
      });
      if (!res.ok) throw new Error("HTTP " + res.status);
      const data = await res.json();
      if (!data.answer) throw new Error("empty answer");
      return data.answer;
    } finally { clearTimeout(timer); }
  }
  // the server returns plain text with light markdown: paragraphs, "- " bullets, **bold**
  function renderAI(text) {
    const inline = s => esc(s).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>")
      .replace(/(https?:\/\/[^\s<)]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>');
    return text.trim().split(/\n{2,}/).map(block => {
      const lines = block.split("\n");
      if (lines.every(l => /^\s*[-*•]\s+/.test(l))) return `<ul class="cb-list">${lines.map(l => `<li>${inline(l.replace(/^\s*[-*•]\s+/, ""))}</li>`).join("")}</ul>`;
      return `<p>${lines.map(inline).join("<br>")}</p>`;
    }).join("");
  }

  /* ---------------------------------------------------------
     the chat window
  --------------------------------------------------------- */
  const root = document.createElement("div");
  root.className = "cb";
  root.innerHTML = `
    <button type="button" class="cb-fab" aria-expanded="false" aria-controls="cb-panel">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v11H9l-5 4z"/><path d="M8 9h8M8 12h5"/></svg>
      <span>Ask about IKS</span>
    </button>
    <section class="cb-panel" id="cb-panel" role="dialog" aria-label="Ask about Indian Knowledge Systems" hidden>
      <header class="cb-head">
        <div>
          <p class="cb-title">Jñāna Sahāyaka</p>
          <p class="cb-sub">${ENDPOINT ? "AI answers from this site's data" : "Answers from this site's data"}</p>
        </div>
        <button type="button" class="cb-close" aria-label="Close chat"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
      </header>
      <div class="cb-log" role="log" aria-live="polite"></div>
      <form class="cb-form">
        <label class="sr-only" for="cb-input">Your question</label>
        <input id="cb-input" autocomplete="off" maxlength="400" placeholder="Ask about centres, gurukuls, people…">
        <button type="submit" class="cb-send" aria-label="Send"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12l16-8-6 16-2-6z"/></svg></button>
      </form>
      <p class="cb-note">${ENDPOINT ? "AI can make mistakes; check the linked sources." : "Built-in assistant; it only knows what is on this site."}</p>
    </section>`;
  document.body.appendChild(root);
  const fab = root.querySelector(".cb-fab"), panel = root.querySelector(".cb-panel"), log = root.querySelector(".cb-log");
  const form = root.querySelector(".cb-form"), input = root.querySelector("#cb-input");
  interactive(fab, { shadow: "0px 14px 28px -14px" });
  interactive(root.querySelector(".cb-close"), { lift: 0, rotate: 90, shadow: null, border: false });
  interactive(root.querySelector(".cb-send"), { lift: -1, shadow: "0px 8px 16px -10px", border: false });

  function addMsg(who, html, { suggest, actions } = {}) {
    const m = document.createElement("div");
    m.className = "cb-msg " + (who === "me" ? "cb-me" : "cb-bot");
    m.innerHTML = `<div class="cb-bubble">${html}</div>`;
    if (actions && actions.length) {
      const row = document.createElement("div"); row.className = "cb-actions";
      actions.forEach(a => {
        const el = a.href ? document.createElement("a") : document.createElement("button");
        el.className = "cb-act"; el.textContent = a.label;
        if (a.href) { el.href = a.href; el.target = "_blank"; el.rel = "noopener"; }
        else { el.type = "button"; el.addEventListener("click", a.run); }
        interactive(el, { lift: -2, shadow: "0px 8px 16px -12px" });
        row.appendChild(el);
      });
      m.appendChild(row);
    }
    if (suggest && suggest.length) {
      const row = document.createElement("div"); row.className = "cb-suggest";
      suggest.forEach(s => {
        const b = document.createElement("button"); b.type = "button"; b.className = "cb-chip"; b.textContent = s;
        b.addEventListener("click", () => send(s));
        interactive(b, { lift: -2, shadow: "0px 8px 16px -12px" });
        row.appendChild(b);
      });
      m.appendChild(row);
    }
    log.appendChild(m);
    animate(m, { opacity: [0, 1], y: [10, 0] }, tx({ duration: 0.35, ease: EASE }));
    log.scrollTop = log.scrollHeight;
    return m;
  }

  let busy = false;
  async function send(text) {
    const q = String(text || "").trim().slice(0, 400);
    if (!q || busy) return;
    busy = true;
    input.value = "";
    addMsg("me", esc(q));
    const local = builtIn(q);
    if (ENDPOINT) {
      const wait = addMsg("bot", `<span class="cb-typing"><i></i><i></i><i></i></span>`);
      const dots = A.reduceMotion ? null : animate(wait.querySelectorAll(".cb-typing i"), { opacity: [0.3, 1, 0.3], y: [0, -3, 0] },
        { duration: 0.9, repeat: Infinity, delay: A.stagger(0.15) });
      try {
        const answer = await askAI(q, local);
        dots?.stop(); wait.remove();
        addMsg("bot", renderAI(answer), { actions: local.actions || (local.picks && local.picks.length === 1 ? actionsFor(local.picks[0]) : []) });
        history.push({ role: "user", content: q }, { role: "assistant", content: answer });
      } catch (err) {
        dots?.stop(); wait.remove();
        addMsg("bot", local.html + `<p class="cb-dim">(The AI service didn't respond, so this is the built-in answer.)</p>`, local);
      }
    } else {
      addMsg("bot", local.html, local);
    }
    busy = false;
  }
  form.addEventListener("submit", e => { e.preventDefault(); send(input.value); });

  let opened = false;
  function openChat() {
    panel.hidden = false;
    fab.setAttribute("aria-expanded", "true");
    animate(panel, { opacity: [0, 1], y: [24, 0], scale: [0.97, 1] }, tx({ type: "spring", stiffness: 260, damping: 24 }));
    if (!opened) { opened = true; addMsg("bot", HELP, { suggest: SUGGEST }); }
    setTimeout(() => input.focus(), 50);
  }
  function closeChat() {
    fab.setAttribute("aria-expanded", "false");
    animate(panel, { opacity: 0, y: 16 }, tx({ duration: 0.2 })).then(() => { if (fab.getAttribute("aria-expanded") === "false") panel.hidden = true; });
    fab.focus();
  }
  fab.addEventListener("click", () => (panel.hidden ? openChat() : closeChat()));
  root.querySelector(".cb-close").addEventListener("click", closeChat);
  panel.addEventListener("keydown", e => { if (e.key === "Escape") { e.stopPropagation(); closeChat(); } });

  // entrance for the floating button
  animate(fab, { opacity: [0, 1], y: [20, 0] }, tx({ ...SPRING, delay: 1.2 }));

  // for testing in the console: IKSChat.ask("...") returns the built-in answer
  window.IKSChat = { ask: q => builtIn(q), open: openChat };
})();
