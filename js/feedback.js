/* =============================================================
   "Suggest an update": visitors send corrections and new information
   (a new phone number, a changed head of a centre, a missing place).

   Each submission is posted to the site's Cloudflare Worker (the same one
   that gives the chatbot AI answers; its address is in js/chat-config.js),
   which stores it. The editors download them all as a CSV
   (see server/README.md, "Feedback").
   It opens from the button at the bottom left, or from "Suggest an
   update" in a leaf's panel, which fills in the entry's name.
   ============================================================= */
(function () {
  "use strict";
  const A = window.IKSApp;
  if (!A) return;
  const { animate, tx, EASE, SOFT_SPRING, interactive, esc } = A;
  const I18N = window.IKS_I18N || { hi: false, t: (s, p) => (p ? s.replace(/\{(\w+)\}/g, (m, k) => p[k]) : s) };
  const t = I18N.t;

  const ENDPOINT = ((window.IKS_CHAT || {}).endpoint || "").trim().replace(/\/+$/, "");
  const FEEDBACK_URL = ENDPOINT ? ENDPOINT + "/feedback" : "";

  // the kinds of update; the English value is what gets stored
  const KINDS = [
    "New or changed contact (phone, e-mail, address)",
    "The person in charge has changed",
    "A detail is wrong or out of date",
    "A missing IKS place, centre or gurukul",
    "Something else"
  ];
  const names = [...new Set(window.IKS.branches.flatMap(b => b.centres.map(c => c.name)))].sort((a, b) => a.localeCompare(b));

  /* ---------- the button and the dialog ---------- */
  const root = document.createElement("div");
  root.className = "fb";
  root.innerHTML = `
    <button type="button" class="fb-fab" aria-haspopup="dialog">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13 7l4 4"/></svg>
      <span>${t("Suggest an update")}</span>
    </button>
    <div class="fb-scrim" hidden></div>
    <section class="fb-panel" role="dialog" aria-modal="true" aria-labelledby="fb-title" hidden>
      <button type="button" class="fb-close" aria-label="${t("Close")}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
      <p class="fb-kicker" lang="sa">संशोधनम्</p>
      <h2 id="fb-title">${t("Suggest an update")}</h2>
      <p class="fb-lede">${t("Know a newer phone number, a new head of a centre, or a place we've missed? Tell us, with a source if you can, and we'll check it and update the site.")}</p>
      <form class="fb-form" novalidate>
        <label class="fb-field"><span>${t("Which entry is it about?")} <i>${t("(optional)")}</i></span>
          <input name="entry" list="fb-entries" autocomplete="off" maxlength="200" placeholder="${t("Start typing a name, or leave empty")}">
          <datalist id="fb-entries">${names.map(n => `<option value="${esc(n)}">`).join("")}</datalist>
        </label>
        <label class="fb-field"><span>${t("What kind of update?")}</span>
          <select name="kind">${KINDS.map(k => `<option value="${esc(k)}">${esc(t(k))}</option>`).join("")}</select>
        </label>
        <label class="fb-field"><span>${t("The update")} <b aria-hidden="true">*</b></span>
          <textarea name="details" rows="5" maxlength="3000" required placeholder="${t("For example: the new Director is …, since …; the office number is now …")}"></textarea>
        </label>
        <label class="fb-field"><span>${t("Where can we check it?")} <i>${t("(optional)")}</i></span>
          <input name="source" type="url" maxlength="500" placeholder="${t("A link to an official page, notice or news report")}">
        </label>
        <div class="fb-row">
          <label class="fb-field"><span>${t("Your name")} <i>${t("(optional)")}</i></span>
            <input name="name" autocomplete="name" maxlength="120">
          </label>
          <label class="fb-field"><span>${t("E-mail or phone, if we may ask you about it")} <i>${t("(optional)")}</i></span>
            <input name="contact" autocomplete="email" maxlength="200">
          </label>
        </div>
        <label class="fb-hp" aria-hidden="true">Website <input name="website" tabindex="-1" autocomplete="off"></label>
        <p class="fb-privacy">${t("Only the site's editors see your answers. Your name and contact details are never published.")}</p>
        <p class="fb-status" role="status" aria-live="polite"></p>
        <div class="fb-actions">
          <button type="submit" class="near-btn primary fb-send">${t("Send update")}</button>
          <button type="button" class="near-btn fb-cancel">${t("Cancel")}</button>
        </div>
      </form>
      <div class="fb-done" hidden>
        <p class="fb-thanks">${t("Thank you!")}</p>
        <p>${t("Your update has been sent. The editors will check it against the sources before changing the site.")}</p>
        <div class="fb-actions">
          <button type="button" class="near-btn fb-again">${t("Send another")}</button>
          <button type="button" class="near-btn primary fb-finish">${t("Close")}</button>
        </div>
      </div>
    </section>`;
  document.body.appendChild(root);

  const fab = root.querySelector(".fb-fab"), panel = root.querySelector(".fb-panel"), scrim = root.querySelector(".fb-scrim");
  const form = root.querySelector(".fb-form"), done = root.querySelector(".fb-done"), status = root.querySelector(".fb-status");
  const send = root.querySelector(".fb-send");
  interactive(fab, { shadow: "0px 14px 28px -14px", bg: "#fffaf0" });
  interactive(root.querySelector(".fb-close"), { lift: 0, rotate: 90, shadow: null, border: false });
  root.querySelectorAll(".fb-actions .near-btn").forEach(b => interactive(b, { lift: -2, shadow: "0px 8px 16px -12px" }));

  if (!FEEDBACK_URL) {
    status.textContent = t("The feedback form isn't connected yet, so updates can't be sent from here at the moment.");
    send.disabled = true;
  }

  /* ---------- open / close ---------- */
  let lastFocus = null;
  function open({ entry = "" } = {}) {
    lastFocus = document.activeElement;
    form.hidden = false; done.hidden = true;
    if (entry) form.entry.value = entry;
    if (FEEDBACK_URL) status.textContent = "";
    panel.hidden = false; scrim.hidden = false;
    animate(scrim, { opacity: [0, 1] }, tx({ duration: 0.3 }));
    animate(panel, { opacity: [0, 1], y: [28, 0], scale: [0.97, 1] }, tx(SOFT_SPRING));
    animate(panel.querySelectorAll(".fb-kicker, h2, .fb-lede, .fb-field, .fb-privacy, .fb-actions"),
      { opacity: [0, 1], y: [10, 0] }, tx({ duration: 0.45, ease: EASE, delay: A.stagger(0.04, { startDelay: 0.08 }) }));
    setTimeout(() => (entry ? form.details : form.entry).focus(), 60);
  }
  function close() {
    if (panel.hidden) return;
    animate(scrim, { opacity: 0 }, tx({ duration: 0.25 }));
    animate(panel, { opacity: 0, y: 18 }, tx({ duration: 0.22 })).then(() => { panel.hidden = true; scrim.hidden = true; });
    if (lastFocus && document.contains(lastFocus)) lastFocus.focus({ preventScroll: true });
  }
  fab.addEventListener("click", () => open());
  scrim.addEventListener("click", close);
  root.querySelector(".fb-close").addEventListener("click", close);
  root.querySelector(".fb-cancel").addEventListener("click", close);
  root.querySelector(".fb-finish").addEventListener("click", close);
  root.querySelector(".fb-again").addEventListener("click", () => {
    form.reset(); done.hidden = true; form.hidden = false; form.entry.focus();
  });
  panel.addEventListener("keydown", e => {
    if (e.key === "Escape") { e.stopPropagation(); close(); }
    if (e.key === "Tab") { // keep focus inside the dialog
      const f = [...panel.querySelectorAll("button, input, select, textarea")].filter(el => !el.disabled && el.offsetParent !== null && el.tabIndex !== -1);
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  });
  // "Suggest an update" buttons elsewhere on the page (e.g. in a leaf's panel)
  document.addEventListener("click", e => {
    const b = e.target.closest("[data-feedback]");
    if (b) open({ entry: b.dataset.feedback });
  });

  /* ---------- send ---------- */
  form.addEventListener("submit", async e => {
    e.preventDefault();
    if (!FEEDBACK_URL) return;
    const details = form.details.value.trim();
    if (details.length < 10) {
      status.textContent = t("Please describe the update in a few words.");
      form.details.focus();
      return;
    }
    const src = form.source.value.trim();
    if (src && !/^https?:\/\/\S+\.\S+/.test(src)) {
      status.textContent = t("The source should be a web link starting with http:// or https://.");
      form.source.focus();
      return;
    }
    if (form.website.value) { showDone(); return; } // a bot filled the hidden field
    send.disabled = true;
    status.textContent = t("Sending…");
    try {
      const res = await fetch(FEEDBACK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entry: form.entry.value.trim(), kind: form.kind.value, message: details, source: src,
          name: form.name.value.trim(), contact: form.contact.value.trim(),
          page: location.origin === "null" ? "file" : location.origin + location.pathname,
          lang: I18N.hi ? "hi" : "en"
        })
      });
      if (res.status === 429) throw new Error("busy");
      if (!res.ok) throw new Error("HTTP " + res.status);
      showDone();
    } catch (err) {
      status.textContent = err.message === "busy"
        ? t("Too many updates from here just now; please try again in a while.")
        : t("It couldn't be sent just now. Please try again in a few minutes.");
    } finally {
      send.disabled = false;
    }
  });
  function showDone() {
    form.reset();
    status.textContent = "";
    form.hidden = true; done.hidden = false;
    animate(done.children, { opacity: [0, 1], y: [10, 0] }, tx({ duration: 0.4, ease: EASE, delay: A.stagger(0.06) }));
    root.querySelector(".fb-finish").focus();
  }

  // entrance for the floating button
  animate(fab, { opacity: [0, 1], y: [20, 0] }, tx({ type: "spring", stiffness: 320, damping: 24, delay: 1.35 }));

  window.IKSFeedback = { open };
})();
