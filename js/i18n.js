/* ------------------------------------------------------------------
   Language switch: English (default) or Hindi.

   The Hindi text lives in js/i18n-hi.js (window.IKS_HI). This file:
   - picks the language (?lang=hi in the address, else the visitor's last
     choice, else English) and wires the हिन्दी / English button;
   - translates the page's fixed text (elements marked data-i18n…);
   - translates the content data in place (branches, centres, places)
     before the tree and the other features are built;
   - gives the other scripts IKS_I18N.t() for their interface messages.

   Names of centres, people, towns and addresses, and official project
   titles, are kept as the sources give them. Switching language reloads
   the page and returns to the same scroll position.
------------------------------------------------------------------- */
(function () {
  const HI = Object.assign({ ui: {}, html: {}, data: {}, patterns: [], states: {}, cities: {} }, window.IKS_HI || {});

  let lang = "en";
  try {
    const q = new URLSearchParams(location.search).get("lang");
    lang = q || localStorage.getItem("iks-lang") || "en";
  } catch (e) { /* storage blocked: stay on the default */ }
  if (lang !== "hi") lang = "en";
  const hi = lang === "hi";

  const fill = (s, p) => (p ? String(s).replace(/\{(\w+)\}/g, (m, k) => (k in p ? p[k] : m)) : String(s));
  /** an interface message: the English text is the key; {name} placeholders are filled from p */
  const t = (en, p) => fill(hi && HI.ui[en] != null ? HI.ui[en] : en, p);
  /** a piece of content data: exact matches first, then the dictionary's patterns */
  function tr(s) {
    if (!hi || typeof s !== "string" || !s) return s;
    if (HI.data[s] != null) return HI.data[s];
    for (const [re, rep] of HI.patterns) if (re.test(s)) return s.replace(re, rep);
    return s;
  }
  /** a state's display name (the data keeps English names) */
  const state = n => (hi && n && HI.states[n]) || n;
  const city = n => (hi && n && HI.cities[n]) || n;

  function setLang(next) {
    try {
      localStorage.setItem("iks-lang", next);
      sessionStorage.setItem("iks-scroll", String(window.scrollY));
    } catch (e) { /* the address below still carries the choice */ }
    const u = new URL(location.href);
    if (next === "hi") u.searchParams.set("lang", "hi");
    else u.searchParams.delete("lang");
    if (u.href === location.href) location.reload();
    else location.href = u.href;
  }

  window.IKS_I18N = { lang, hi, t, tr, state, city, setLang, HI };

  /* ---------- the button ---------- */
  const btn = document.getElementById("lang-toggle");
  if (btn) {
    btn.innerHTML = hi
      ? `<span class="lt-glyph" aria-hidden="true">A</span><span lang="en">English</span>`
      : `<span class="lt-glyph" aria-hidden="true" lang="hi">अ</span><span lang="hi">हिन्दी</span>`;
    btn.setAttribute("aria-label", hi ? "Read this website in English" : "इस वेबसाइट को हिन्दी में पढ़ें");
    btn.addEventListener("click", () => setLang(hi ? "en" : "hi"));
  }

  // back to where the visitor was before switching
  try {
    const y = sessionStorage.getItem("iks-scroll");
    if (y !== null) {
      sessionStorage.removeItem("iks-scroll");
      if ("scrollRestoration" in history) history.scrollRestoration = "manual";
      window.addEventListener("load", () => window.scrollTo(0, +y));
    }
  } catch (e) { /* nothing to restore */ }

  if (!hi) return;

  /* ---------- fixed page text ---------- */
  document.documentElement.lang = "hi";
  if (HI.title) document.title = HI.title;
  const desc = document.querySelector('meta[name="description"]');
  if (desc && HI.description) desc.setAttribute("content", HI.description);
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const v = HI.html[el.dataset.i18n];
    if (v != null) el.innerHTML = v;
  });
  [["data-i18n-ph", "placeholder"], ["data-i18n-label", "aria-label"]].forEach(([attr, target]) => {
    document.querySelectorAll(`[${attr}]`).forEach(el => {
      const v = HI.html[el.getAttribute(attr)];
      if (v != null) el.setAttribute(target, v);
    });
  });

  /* ---------- content data ---------- */
  const IKS = window.IKS;
  IKS.branches.forEach(b => {
    b.en = { name: b.name, blurb: b.blurb };
    b.name = tr(b.name);
    b.blurb = tr(b.blurb);
    b.centres.forEach(c => {
      // the English text is kept for the chatbot's search
      c.en = { type: c.type, summary: c.summary, activities: (c.activities || []).slice() };
      c.type = tr(c.type);
      c.summary = tr(c.summary);
      c.founded = tr(c.founded);
      c.branchNote = tr(c.branchNote);
      c.activities = (c.activities || []).map(tr);
      (c.people || []).forEach(p => { p.role = tr(p.role); });
      if (c.contact && c.contact.hours) c.contact.hours = tr(c.contact.hours);
    });
  });
  (IKS.placeKinds || []).forEach(k => { k.en = k.label; k.label = tr(k.label); if (k.one) k.one = tr(k.one); });
  (window.IKS_PLACES || []).forEach(p => {
    p.en = { about: p.about, host: p.host, study: p.study };
    p.about = tr(p.about);
    p.host = tr(p.host);
    p.pillars = tr(p.pillars);
    p.status = tr(p.status);
    if (p.lead) p.lead = { ...p.lead, role: tr(p.lead.role) };
  });
})();
