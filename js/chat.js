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
  // ai: false uses the Worker only for listings and feedback, not for chat answers
  const ENDPOINT = (window.IKS_CHAT || {}).ai === false ? "" : ((window.IKS_CHAT || {}).endpoint || "").trim();
  const $ = s => document.querySelector(s);
  // language (js/i18n.js): t() for messages; the data keeps English state names, shown via stateName()
  const I18N = window.IKS_I18N || { hi: false, t: (s, p) => (p ? s.replace(/\{(\w+)\}/g, (m, k) => p[k]) : s), state: n => n, city: n => n, HI: { states: {}, cities: {} } };
  const t = I18N.t, HIN = I18N.hi;
  const stateName = n => I18N.state(n);

  /* ---------------------------------------------------------
     text helpers
  --------------------------------------------------------- */
  const fold = s => String(s || "").normalize("NFD").replace(/[̀-ͯ\u093c]/g, "").toLowerCase();
  const STOP = new Set(("a an the of in on at to for and or is are was were be by with from about me my i you your " +
    "what which who whom whose where when how many much tell show list give find any some there here near nearby around " +
    "do does did can could would should please centre centres center centers place places institute institutes " +
    "india indian iks know information info details detail this that these those it its " +
    // common Hindi question words
    "क्या है हैं था थे में के की का को से पर और या कौन कौनसा कौनसे कौनसी कहाँ कहां कैसे कितने कितनी कितना पास निकट आसपास " +
    "बताइए बताओ बताएं बताये बताए दिखाइए दिखाओ सूची चाहिए जानकारी बारे मुझे हमें कोई कुछ यह वह ये वो एक भारत भारतीय केंद्र केन्द्र संस्थान स्थान").split(" ").map(w => w.normalize("NFD").replace(/\u093c/g, "")));
  const words = s => fold(s).replace(/[^a-z0-9ऀ-෿ ]+/g, " ").split(/\s+/).filter(Boolean);
  const terms = s => words(s).filter(w => !STOP.has(w) && w.length > 1);

  /* ---------------------------------------------------------
     knowledge base: tree centres, places, branches
  --------------------------------------------------------- */
  const DOCS = [];
  BRANCHES.forEach((b, bi) => b.centres.forEach((c, ci) => {
    if (c.minor) return; // small leaves are their place records, indexed below
    DOCS.push({
      type: "leaf", bi, ci, b, c, name: c.name, city: c.city, state: STATE_NAMES[c.state] || "",
      text: [c.name, c.type, c.summary, (c.activities || []).join(" "), c.city, STATE_NAMES[c.state], stateName(STATE_NAMES[c.state]), b.name,
        b.en ? b.en.name : "", c.en ? [c.en.type, c.en.summary, c.en.activities.join(" ")].join(" ") : "",
        (c.people || []).map(p => p.name + " " + p.role).join(" ")].join(" ")
    });
  }));
  const leafNames = new Set(DOCS.map(d => fold(d.name)));
  PLACES.forEach(p => {
    if (p.ref && leafNames.has(fold(p.ref))) return; // the leaf already covers it
    DOCS.push({
      type: "place", p, name: p.name, city: p.city, state: p.state,
      text: [p.name, p.host, p.city, p.state, stateName(p.state), p.study, p.about, p.full, p.en ? p.en.about : "", (A.kindOf(p.kind) || {}).label, p.kind,
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
  // Hindi state and city names (from js/i18n-hi.js) point at the English ones the data uses
  const HI_STATES = Object.entries((I18N.HI || {}).states || {}).map(([en, hi]) => [fold(hi), en]).sort((a, b) => b[0].length - a[0].length);
  const HI_CITIES = Object.entries((I18N.HI || {}).cities || {}).map(([en, hi]) => [fold(hi), en]).sort((a, b) => b[0].length - a[0].length);
  function findState(q) {
    const fq = fold(q);
    const hiHit = HI_STATES.find(([h]) => fq.includes(h));
    if (hiHit) return hiHit[1];
    const f = " " + fold(q).replace(/[^a-z& ]/g, " ") + " ";
    const hit = STATES.filter(s => f.includes(" " + fold(s) + " ")).sort((a, b) => b.length - a.length)[0];
    if (hit) return hit;
    for (const [k, v] of Object.entries(STATE_ALIAS)) if (f.includes(" " + k + " ")) return v;
    return null;
  }
  function findCityIn(q) {
    const fq = fold(q);
    const hiHit = HI_CITIES.find(([h]) => fq.includes(h));
    if (hiHit) { const c = CITIES.find(x => x.name === hiHit[1]); if (c) return c; }
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
    { re: /gurukul|gurukula|pathashala|patashala|pathasala|veda school|vedic school|vidyalaya|गुरुकुल|पाठशाला|विद्यालय/, kinds: ["gurukul"], label: "gurukuls" },
    { re: /ayurved|ayush|unani|siddha|medicine|health|wellbeing|wellness|yoga|आयुर्वेद|योग|स्वास्थ्य|यूनानी|चिकित्सा|आयुष/, kinds: ["ayush"], branch: "health", label: "Āyurveda, Yoga and health places",
      alsoKinds: ["centre", "institution"], alsoText: /ayurved|yoga|unani|siddha|medic|health|wellbeing|ayush|rasayana|vrikshayurved/ },
    { re: /museum|gallery|संग्रहालय|वीथिका/, kinds: ["museum", "archive"], label: "museums and archives" },
    { re: /manuscript|library|libraries|archive|oriental|पांडुलिपि|पाण्डुलिपि|पुस्तकालय|प्राच्य|अभिलेखागार/, kinds: ["institution", "archive"], text: /manuscript|library|oriental|archive/, branch: "heritage", label: "manuscript libraries and oriental institutes" },
    { re: /temple|heritage site|observatory|monument|ancient universit|nalanda|fort|palace|cave|stupa|monaster|church|mosque|synagogue|archaeolog|excavat|मंदिर|मन्दिर|धरोहर|विरासत|वेधशाला|स्मारक|नालंदा|किला|किले|महल|गुफा|स्तूप|मठ/, kinds: ["heritage"], label: "heritage sites" },
    { re: /tradition|craft|tribal|stepwell|dance|music|theatre|theater|weaving|painting|puppet|farming|परंपरा|परम्परा|शिल्प|जनजाति|आदिवासी|बावड़ी|बावडी|नृत्य|संगीत|बुनाई|चित्रकला|खेती/, kinds: ["tradition"], label: "living traditions" },
    { re: /iks cent|iks division|research cent|iit|universit|iks केंद्र|iks केन्द्र|शोध केंद्र|अनुसंधान केंद्र|विश्वविद्यालय/, kinds: ["centre", "institution"], leaves: true, label: "IKS centres and institutions" }
  ];
  KIND_WORDS.forEach(k => { k.re = new RegExp(k.re.source.split("|").map(fold).join("|")); });
  const kindIn = q => KIND_WORDS.find(k => k.re.test(fold(q))) || null;
  const matchesKind = (d, k) => {
    if (!k) return true;
    if (d.type === "leaf") return !!k.leaves || (!!k.branch && d.b.id === k.branch) || (!!k.alsoText && k.alsoText.test(fold(d.text)));
    if (k.alsoKinds && k.alsoKinds.includes(d.p.kind) && k.alsoText.test(fold(d.text))) return true;
    if (!k.kinds.includes(d.p.kind)) return false;
    return !k.text || k.text.test(fold(d.text));
  };

  const BRANCH_WORDS = {
    veda: /\bveda|vedic|darshan|darsana|philosoph|upanishad|vedanta|nyaya|mimamsa|samkhya|sankhya|वेद|दर्शन|उपनिषद|न्याय|मीमांसा/,
    language: /language|literature|sanskrit|tamil|grammar|vyakarana|poetry|kavya|sahitya|भाषा|साहित्य|संस्कृत|व्याकरण|काव्य/,
    arts: /\bart|aesthetic|dance|music|natya|kathakali|craft|sculpture|rasa|कला|सौंदर्य|नृत्य|संगीत|नाट्य|मूर्ति/,
    health: /ayurved|yoga|health|wellbeing|medicine|आयुर्वेद|योग|स्वास्थ्य|कल्याण/,
    science: /science|technolog|mathemat|ganita|astronom|jyotis|metallurg|vastu|विज्ञान|प्रौद्योगिकी|गणित|खगोल|ज्योतिष|वास्तु/,
    heritage: /heritage|manuscript|library|archive|palm.?leaf|धरोहर|विरासत|पांडुलिपि|पुस्तकालय|अभिलेख/
  };

  /* ---------------------------------------------------------
     answer building blocks (HTML strings + action buttons)
  --------------------------------------------------------- */
  const loc = d => [d.city && d.city !== d.state ? d.city : "", stateName(d.state)].filter((v, i, a) => v && a.indexOf(v) === i).join(", ");
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
    if (d.type === "leaf") return (d.c.founded ? t("Founded {year}.", { year: d.c.founded }) + " " : "") + d.c.summary;
    if (d.p.ref && A.CENTRE_BY_NAME[d.p.ref]) return A.CENTRE_BY_NAME[d.p.ref].summary;
    const squash = v => fold(v).replace(/[^a-z0-9]/g, "");
    const study = d.p.study && squash(d.p.study) !== squash(d.p.name) ? d.p.study : "";
    if (d.p.source === "atlas") return `${d.p.full || d.p.about} ${t("(From the IKS Atlas, a draft in review.)")}`;
    return (d.p.founded ? t("Founded {year}.", { year: d.p.founded }) + " " : "") + [study, d.p.full || d.p.about, d.p.pillars].filter(Boolean).join(" ");
  }
  function actionsFor(d) {
    const acts = [];
    if (d.type === "leaf") acts.push({ label: t("Open on the tree"), run: () => A.openCentre(d.bi, d.ci) });
    else {
      if (d.p.leaf) acts.push({ label: t("Open on the tree"), run: () => A.openCentre(d.p.leaf.bi, d.p.leaf.ci) });
      if (!d.p.noMap) acts.push({ label: t("Directions"), href: A.directionsUrl(d.p) });
      if (d.p.url) acts.push({ label: t("Website"), href: d.p.url });
    }
    return acts;
  }
  function itemLine(d, extra = "") {
    const kind = d.type === "leaf" ? d.b.name
      : d.p.kind === "institution" && d.p.host && d.p.host.length < 40 ? d.p.host
      : (A.kindOf(d.p.kind) || {}).one || ((A.kindOf(d.p.kind) || {}).label || "").replace(/s$/, "");
    return `<b>${esc(d.name)}</b> <span class="cb-dim">· ${esc(kind)} · ${esc(loc(d))}${extra}</span>`;
  }
  function listAnswer(intro, docs, more = "") {
    return {
      html: `<p>${intro}</p><ul class="cb-list">${docs.map(x => `<li>${itemLine(x.d || x, x.dist != null && !(x.d.p.approx && (x.dist < 3 || (A.stateOnly && A.stateOnly(x.d.p)))) ? " · " + esc(A.distInfo ? A.distInfo(x.d.p, x.dist).main : t("{n} km", { n: Math.round(x.dist) })) : "")}</li>`).join("")}</ul>${more}`,
      picks: docs.map(x => x.d || x)
    };
  }
  function describe(d, { focus = "all" } = {}) {
    const lead = leadOf(d), k = contactOf(d);
    const parts = [`<p><b>${esc(d.name)}</b> <span class="cb-dim">· ${esc(loc(d))}</span></p>`];
    if (focus === "all") parts.push(`<p>${esc(aboutOf(d))}</p>`);
    if (lead) parts.push(`<p><span class="cb-label">${t("Person in charge")}</span> ${esc(lead.name)}, ${esc(lead.role)}${lead.asOf ? ` <span class="cb-dim">${t("(as listed in {src})", { src: esc(lead.asOf) })}</span>` : ""}</p>`);
    else if (focus !== "all") parts.push(`<p class="cb-dim">${t("The site's sources don't name a person in charge here.")}</p>`);
    const rows = [];
    if (k.phone) rows.push(`${t("Phone")}: ${telLink(k.phone)}`);
    if (k.email) rows.push(`${t("Email")}: ${mailLink(k.email)}`);
    if (k.address && focus !== "person") rows.push(`${t("Address")}: ${esc(k.address)}`);
    if (rows.length) parts.push(`<p>${rows.join("<br>")}${k.listedBy ? ` <span class="cb-dim">${t("(listed by {who})", { who: esc(k.listedBy) })}</span>` : ""}</p>`);
    else if (focus === "contact") parts.push(`<p class="cb-dim">${d.type === "place" && d.p.source === "iksindia"
      ? t("The IKS Division doesn't publish phone numbers or e-mails for its centres.")
      : t("The site's sources don't list a phone number or e-mail for it.")}</p>`);
    return { html: parts.join(""), picks: [d], actions: actionsFor(d) };
  }

  /* ---------------------------------------------------------
     the built-in answerer
  --------------------------------------------------------- */
  const SUGGEST = HIN ? [
    "IKS क्या है?",
    "वाराणसी के पास गुरुकुल",
    "Sahitya Akademi के प्रमुख कौन हैं?",
    "केरल में आयुर्वेद केंद्र",
    "हरियाणा में कितने गुरुकुल हैं?",
    "तमिलनाडु में पांडुलिपि पुस्तकालय",
    "वेद और दर्शन शाखा किस बारे में है?"
  ] : [
    "What is IKS?",
    "Gurukuls near Varanasi",
    "Who heads Sahitya Akademi?",
    "Āyurveda centres in Kerala",
    "How many gurukuls are in Haryana?",
    "Manuscript libraries in Tamil Nadu",
    "What is Veda & Darshana about?"
  ];
  const HELP = ENDPOINT
    ? `<p>${t("Namaste. Ask me anything about Indian Knowledge Systems. I use this website's information on {n} centres, institutes and gurukuls first, and search the web when I need to, showing my sources.", { n: PLACES.length })}</p>`
    : `<p>${t("Namaste. I answer from the information on this website: the centres on the tree, {n} IKS places and gurukuls, their people, contacts and sources.", { n: PLACES.length })}</p>
    <p>${t("Try asking what IKS is, about a place near a city, centres in a state, who runs a centre, or how to contact one.")}</p>`;

  /* short explainers for common general questions, quoted from the site's sources */
  const EXPLAIN = [
    {
      re: /what (is|are) (the )?(iks|indian knowledge system)|meaning of (iks|indian knowledge)|define (iks|indian knowledge)|about iks\b|(iks|भारतीय ज्ञान (प्रणाली|परंपरा|परम्परा)).{0,12}(क्या|मतलब|अर्थ|परिचय)/,
      html: HIN ? I18N.HI.ui.EXPLAIN_IKS : `<p><b>Indian Knowledge Systems (IKS)</b> are the knowledge traditions developed in India over thousands of years, in philosophy, language and literature, the arts, health, mathematics, astronomy, architecture, agriculture and more. In the IKS Division's words, they "are nurtured in all languages of India such as Tamil, Sanskrit, Pali, Prakrit, Arabic, Persian, Kannada, Malayalam, Telugu, Odia, Bengali" and "have been preserved in many textual, oral traditions and kula paramparas that are practiced."</p>
        <p>The Ministry of Education's <b>IKS Division</b> (set up in 2020) aims "to rejuvenate and mainstream Indian Knowledge Systems for the contemporary world", funding IKS centres, research projects, internships and textbooks.</p>
        <p class="cb-dim">Sources: iksindia.org (About; IKS Centres).</p>`,
      actions: [{ label: "iksindia.org", href: "https://iksindia.org/" }]
    },
    {
      re: /what (is|are) (a |the )?(gurukul|gurukula|gurukulam|pathashala|veda pathashala)|(गुरुकुल|पाठशाला).{0,8}(क्या|मतलब|अर्थ)/,
      html: HIN ? t(I18N.HI.ui.EXPLAIN_GURUKUL, { n: PLACES.filter(p => p.kind === "gurukul").length }) : `<p>A <b>gurukula</b> (gurukulam) is "a type of residential educational institution, in which a student lives with the acharya or guru." Traditional gurukuls teach the Vedas, Vedāṅgas, Darśanas, Sanskrit grammar and, in some, Āyurveda and Yoga; many today follow a hybrid pattern alongside a school board.</p>
        <p>This site lists ${PLACES.filter(p => p.kind === "gurukul").length} gurukuls and Veda pāṭhaśālās. Ask "gurukuls near <i>your city</i>" to find one.</p>
        <p class="cb-dim">Source: vediconcepts.org (Gurukul list).</p>`,
      actions: [{ label: "vediconcepts.org", href: "https://vediconcepts.org/gurukul-list/" }]
    }
  ];
  const webSearch = q => ({ label: t("Search Google"), google: true, href: "https://www.google.com/search?" + new URLSearchParams({ q }).toString() });

  // words that say what is wanted, not which place: ignored when judging a name match
  const ASK_WORDS = new Set(("contact phone number numbers call email mail address reach visit timing timings hours " +
    "who runs run running head heads headed lead leads charge incharge director principal chancellor vice secretary president acharya get " +
    "संपर्क सम्पर्क फोन नंबर नम्बर ईमेल मेल पता प्रमुख प्रभारी निदेशक कुलपति सचिव अध्यक्ष आचार्य चलाता चलाते").split(" ").map(fold));
  const coreTerms = q => terms(q).filter(t => !ASK_WORDS.has(t));

  function builtIn(q) {
    const f = fold(q).trim();
    const ex = EXPLAIN.find(e => e.re.test(f));
    if (ex) return { html: ex.html, actions: ex.actions };
    if (!f || /^(hi|hello|hey|namaste|namaskar|pranam)\b|what can you do|^help\b|how do you work|^(नमस्ते|नमस्कार|प्रणाम|मदद)|क्या कर सकते/.test(f)) {
      return { html: HELP, suggest: SUGGEST };
    }
    const kind = kindIn(q);
    const city = findCityIn(q);
    const state = findState(q);
    const radius = +((f.match(/(\d{2,3})\s*(km|किमी|किलोमीटर)/) || [])[1] || 0);

    const wantsContact = /contact|phone|number|call|email|e-mail|mail|address|reach|visit|timing|hours|संपर्क|सम्पर्क|फोन|नंबर|नम्बर|ईमेल|पता|समय/.test(f);
    const NEAR = /near|around|close to|within|nearby|km|के पास|पास में|निकट|नजदीक|आसपास|किमी/;
    // 1. how many
    if (/how many|\bcount\b|कितने|कितनी|कितना|संख्या/.test(f) || (/number of/.test(f) && !/phone|contact|mobile/.test(f))) {
      const pool = DOCS.filter(d => matchesKind(d, kind) && (!state || d.state === state));
      const what = t(kind ? kind.label : "IKS places, centres and gurukuls");
      return { html: `<p>${state ? t("The site lists <b>{n}</b> {what} in {state}.", { n: pool.length, what: esc(what), state: esc(stateName(state)) })
          : t("The site lists <b>{n}</b> {what}.", { n: pool.length, what: esc(what) })}</p>` +
        (pool.length ? `<p class="cb-dim">${t("Ask \"{what} in {state}\" to see them.", { what: esc(t(kind ? kind.label : "places")), state: esc(state ? stateName(state) : t("a state")) })}</p>` : "") };
    }

    // 2a. who runs / contact for a named centre (before "near a city": "IIT Madras" is a centre, not a city question)
    const wantsPerson = /\bwho\b|head|in charge|incharge|director|principal|vice.?chancellor|secretary|president|acharya|run(s|ning)?\b|lead|कौन|प्रमुख|प्रभारी|निदेशक|कुलपति|सचिव|अध्यक्ष|आचार्य/.test(f);
    if ((wantsPerson || wantsContact) && !/\bnear|around|close to|within|\bkm\b|के पास|निकट|नजदीक|आसपास|किमी/.test(f)) {
      const hit = search(q, { limit: 1, needName: true })[0];
      if (hit && hit.nameHits >= Math.max(1, Math.min(2, coreTerms(q).length, terms(hit.d.name).length))) {
        return describe(hit.d, { focus: wantsContact ? "contact" : "person" });
      }
    }

    // 2. near a city
    if (city && (NEAR.test(f) || !state || fold(city.name) !== fold(state))) {
      const r = radius || 60;
      const hits = DOCS.filter(d => d.type === "place" && !d.p.noMap && matchesKind(d, kind))
        .map(d => ({ d, dist: A.km(city, d.p) })).filter(x => x.dist <= r)
        .sort((a, b) => (A.stateOnly ? A.stateOnly(a.d.p) - A.stateOnly(b.d.p) : 0) || a.dist - b.dist);
      // leaves in that city too
      const leaves = DOCS.filter(d => d.type === "leaf" && matchesKind(d, kind) && fold(d.city).includes(fold(city.name)));
      const all = leaves.map(d => ({ d, dist: 0 })).concat(hits);
      if (!all.length) {
        return { html: `<p>${t("I don't have any {what} within {r} km of {city}.", { what: esc(t(kind ? kind.label : "IKS places")), r, city: esc(I18N.city(city.name)) })}</p>`,
          actions: [{ label: t("Show nearest to {city}", { city: I18N.city(city.name) }), run: () => A.nearCity(city.name) }] };
      }
      const top = all.slice(0, 6);
      const res = listAnswer(t(all.length > 6 ? "{n} {what} within {r} km of <b>{city}</b>, nearest first:" : "{n} {what} within {r} km of <b>{city}</b>:",
        { n: all.length, what: esc(t(kind ? kind.label : "IKS places")), r, city: esc(I18N.city(city.name)) }), top);
      res.actions = [{ label: t("See all near {city}", { city: I18N.city(city.name) }), run: () => A.nearCity(city.name) }];
      return res;
    }

    // 4. listing by state (and kind)
    if (state && (kind || /list|which|what|show|in |सूची|कौन|क्या|दिखा|में/.test(f))) {
      const pool = DOCS.filter(d => d.state === state && matchesKind(d, kind));
      if (!pool.length) return { html: `<p>${t("I don't have any {what} in {state} on this site.", { what: esc(t(kind ? kind.label : "IKS places")), state: esc(stateName(state)) })}</p>` };
      pool.sort((a, b) => (a.type === "leaf" ? -1 : 0) - (b.type === "leaf" ? -1 : 0) || (a.p && a.p.kind === "gurukul") - (b.p && b.p.kind === "gurukul"));
      const top = pool.slice(0, 8);
      return listAnswer(t(pool.length > 8 ? "{n} {what} in <b>{state}</b> (first 8):" : "{n} {what} in <b>{state}</b>:",
        { n: pool.length, what: esc(t(kind ? kind.label : "IKS places and centres")), state: esc(stateName(state)) }), top,
        pool.length > 8 ? `<p class="cb-dim">${t("Ask about one by name for details, or narrow it down, e.g. \"gurukuls near {city}\".", { city: esc(I18N.city((CITIES.find(c => c.state === state) || {}).name) || t("a city")) })}</p>` : "");
    }

    // 5. a branch of knowledge
    const bid = Object.keys(BRANCH_WORDS).find(id => BRANCH_WORDS[id].test(f));
    if (bid && !search(q, { limit: 1, needName: true }).some(r => r.nameHits >= 2)) {
      const b = BRANCHES.find(x => x.id === bid), bi = BRANCHES.indexOf(b);
      const leaves = DOCS.filter(d => d.type === "leaf" && d.bi === bi);
      const others = b.centres.length - leaves.length;
      return {
        html: `<p><b>${esc(b.name)}</b> <span class="cb-dim">(${esc(b.sanskrit)})</span>: ${esc(b.blurb)}</p>
               <p>${t(leaves.length > 10 ? "{n} IKS centres on this branch of the tree, including:" : "{n} IKS centres on this branch of the tree:", { n: leaves.length })}</p><ul class="cb-list">${leaves.slice(0, 10).map(d => `<li>${itemLine(d)}</li>`).join("")}</ul>
               ${leaves.length > 10 ? `<p class="cb-dim">${t("…and {n} more.", { n: leaves.length - 10 })}</p>` : ""}
               ${others ? `<p class="cb-dim">${t("The branch also has {n} smaller leaves (gurukuls, institutes, heritage sites and traditions). Open the branch to search them all.", { n: others })}</p>` : ""}`,
        picks: leaves, actions: [{ label: t("Show the {name} branch", { name: b.name }), run: () => { A.focusBranch(bi); $("#stage").scrollIntoView({ behavior: "smooth" }); } }]
      };
    }

    // 6. a named centre or place
    const hits = search(q, { limit: 5 });
    const qn = coreTerms(q).length;
    if (hits.length && hits[0].nameHits >= Math.max(1, Math.min(2, qn)) && (hits.length === 1 || hits[0].s > hits[1].s * 1.15)) {
      return describe(hits[0].d);
    }
    if (hits.length && hits[0].nameHits > 0) {
      const res = listAnswer(t("Here's what I found on the site that best matches your question:"), hits.slice(0, 5),
        `<p class="cb-dim">${t("Ask about one of them by name for its details and contacts, or search the web for more.")}</p>`);
      res.actions = [webSearch(q)];
      return res;
    }
    return {
      html: `<p>${t("That isn't in this site's information. I can tell you about IKS centres, institutes, gurukuls, manuscript libraries and heritage places listed here, or you can search the web for it.")}</p>`,
      actions: [webSearch(q)], suggest: SUGGEST.slice(0, 3)
    };
  }

  /* ---------------------------------------------------------
     AI mode: send the question and the most relevant records
  --------------------------------------------------------- */
  function recordOf(d) {
    const lead = leadOf(d), k = contactOf(d);
    const src = d.type === "leaf" ? (d.c.sources || []).map(s => s.url).slice(0, 2).join(" ")
      : ({ iksindia: "iksindia.org", uem: "iks.uem.edu.in", iksguru: "iksguru.in", tree: "this site", gurukul: k.listedBy, hindupedia: "hindupedia.com", hmml: "hmml.org", iish: "iish.org", community: "details given by the organisation itself, checked by the site's editors", atlas: d.p.atlas ? `IKS Atlas ${d.p.atlas.id} (draft, unverified); its listed source: ${d.p.atlas.src}` : "" })[d.p.source] || "";
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
        body: JSON.stringify({ question: q, history: history.slice(-6), context: contextFor(q, local), lang: HIN ? "hi" : "en" })
      });
      if (!res.ok) throw new Error("HTTP " + res.status);
      const data = await res.json();
      if (!data.answer) throw new Error("empty answer");
      return data;
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
      <span>${t("Ask about IKS")}</span>
    </button>
    <section class="cb-panel" id="cb-panel" role="dialog" aria-label="${t("Ask about Indian Knowledge Systems")}" hidden>
      <header class="cb-head">
        <div>
          <p class="cb-title">Jñāna Sahāyaka</p>
          <p class="cb-sub">${ENDPOINT ? t("AI answers from this site and the web") : t("Answers from this site's data")}</p>
        </div>
        <button type="button" class="cb-close" aria-label="${t("Close chat")}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
      </header>
      <div class="cb-log" role="log" aria-live="polite"></div>
      <form class="cb-form">
        <label class="sr-only" for="cb-input">${t("Your question")}</label>
        <input id="cb-input" autocomplete="off" maxlength="400" placeholder="${t("Ask about centres, gurukuls, people…")}">
        <button type="submit" class="cb-send" aria-label="${t("Send")}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12l16-8-6 16-2-6z"/></svg></button>
      </form>
      <p class="cb-note">${ENDPOINT ? t("AI can make mistakes; check the linked sources.") : t("Built-in assistant: it knows this site's data and can send you to a web search.")}</p>
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
        const { answer, sources } = await askAI(q, local);
        dots?.stop(); wait.remove();
        const srcHtml = Array.isArray(sources) && sources.length
          ? `<p class="cb-sources"><span class="cb-label">${t("Sources")}</span>${sources.map(s => `<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.title)}</a>`).join("")}</p>` : "";
        // site buttons only when the answer is about one record from the site
        const acts = local.picks && local.picks.length === 1 ? actionsFor(local.picks[0]) : (local.actions || []).filter(a => !a.google);
        addMsg("bot", renderAI(answer) + srcHtml, { actions: acts });
        history.push({ role: "user", content: q }, { role: "assistant", content: answer });
      } catch (err) {
        dots?.stop(); wait.remove();
        addMsg("bot", local.html + `<p class="cb-dim">${t("(The AI service didn't respond, so this is the built-in answer.)")}</p>`, local);
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
