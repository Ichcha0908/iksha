/* =============================================================
   "List your organisation": an IKS organisation (or someone who knows
   it well) asks to be added to the site.

   The request goes to the site's Cloudflare Worker (its address is in
   js/chat-config.js), which keeps it as *pending*. Nothing is published
   until an editor checks it on the Worker's /admin page and approves it;
   approved listings then come back to every visitor through
   js/listings-loader.js and become leaves on the tree, "near me" results
   and chatbot answers. See server/README.md, "Organisation listings".
   ============================================================= */
(function () {
  "use strict";
  const A = window.IKSApp;
  if (!A) return;
  const { animate, tx, EASE, SOFT_SPRING, interactive, esc } = A;
  const I18N = window.IKS_I18N || { hi: false, t: (s, p) => (p ? s.replace(/\{(\w+)\}/g, (m, k) => p[k]) : s), state: n => n, city: n => n };
  const t = I18N.t;

  const ENDPOINT = ((window.IKS_CHAT || {}).endpoint || "").trim().replace(/\/+$/, "");
  const cta = document.getElementById("list-org");
  if (!ENDPOINT) return;          // not connected yet: the invitation stays hidden
  if (cta) cta.hidden = false;
  const URL_ = ENDPOINT + "/listings";

  const KINDS = [
    ["institution", "IKS centre, research centre or institution"],
    ["ori", "Oriental research institute or manuscript library"],
    ["gurukul", "Gurukul or Veda pāṭhaśālā"],
    ["ayush", "Āyurveda or Yoga institute"],
    ["museum", "Museum"],
    ["archive", "Archive"],
    ["heritage", "Heritage site"],
    ["tradition", "Living tradition or community practice"]
  ];
  const STATES = window.INDIA_MAP.states.map(s => s.name)
    .filter(n => n !== "Dadra and Nagar Haveli" && n !== "Daman and Diu")
    .concat(["Dadra and Nagar Haveli and Daman and Diu", "Ladakh"])
    .sort((a, b) => a.localeCompare(b));
  const CITIES = window.IKS_CITIES || [];
  const opt = (v, label) => `<option value="${esc(v)}">${esc(label)}</option>`;
  const optional = `<i>${t("(optional)")}</i>`;
  const req = `<b aria-hidden="true">*</b>`;

  /* ---------- the dialog ---------- */
  const root = document.createElement("div");
  root.className = "fb ls";
  root.innerHTML = `
    <div class="fb-scrim" hidden></div>
    <section class="fb-panel ls-panel" role="dialog" aria-modal="true" aria-labelledby="ls-title" hidden>
      <button type="button" class="fb-close" aria-label="${t("Close")}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
      <p class="fb-kicker" lang="sa">नवं पत्रम्</p>
      <h2 id="ls-title">${t("List your organisation")}</h2>
      <p class="fb-lede">${t("Tell us about an IKS centre, gurukul, institute, museum, heritage site or living tradition that isn't on the site yet. An editor checks every request against its website before it is added, usually within a few days.")}</p>
      <form class="fb-form" novalidate>
        <fieldset class="ls-set">
          <legend>${t("The organisation")}</legend>
          <label class="fb-field"><span>${t("Name")} ${req}</span>
            <input name="name" maxlength="160" required autocomplete="organization">
          </label>
          <div class="fb-row">
            <label class="fb-field"><span>${t("What kind of place is it?")} ${req}</span>
              <select name="kind" required><option value="">${t("Choose…")}</option>${KINDS.map(([v, l]) => opt(v, t(l))).join("")}</select>
            </label>
            <label class="fb-field"><span>${t("Which branch of knowledge?")} ${req}</span>
              <select name="branch" required><option value="">${t("Choose…")}</option>${window.IKS.branches.map(b => opt(b.id, b.name)).join("")}</select>
            </label>
          </div>
          <label class="fb-field"><span>${t("What it does")} ${req}</span>
            <textarea name="about" rows="4" maxlength="1200" required placeholder="${t("Two or three sentences: what it teaches, studies or preserves, and for whom.")}"></textarea>
          </label>
          <div class="fb-row">
            <label class="fb-field"><span>${t("Main areas of work")} ${optional}</span>
              <input name="study" maxlength="300" placeholder="${t("e.g. Nyāya, Jyotiṣa, manuscript conservation")}">
            </label>
            <label class="fb-field"><span>${t("Founded")} ${optional}</span>
              <input name="founded" maxlength="20" inputmode="numeric" placeholder="${t("Year")}">
            </label>
          </div>
          <label class="fb-field"><span>${t("Official website")} ${req}</span>
            <input name="url" type="url" maxlength="300" placeholder="https://">
          </label>
          <label class="fb-field"><span>${t("Other pages that show it exists")} ${optional}</span>
            <textarea name="links" rows="2" maxlength="2600" placeholder="${t("News reports, a government or university page, its social media; one link per line")}"></textarea>
            <small>${t("No website? Give at least one page here instead.")}</small>
          </label>
        </fieldset>

        <fieldset class="ls-set">
          <legend>${t("Where it is")}</legend>
          <div class="fb-row">
            <label class="fb-field"><span>${t("Town or city")} ${req}</span>
              <input name="city" list="ls-cities" maxlength="80" required autocomplete="address-level2">
              <datalist id="ls-cities">${CITIES.map(c => `<option value="${esc(c.name)}">`).join("")}</datalist>
            </label>
            <label class="fb-field"><span>${t("State or union territory")} ${req}</span>
              <select name="state" required><option value="">${t("Choose…")}</option>${STATES.map(s => opt(s, I18N.state(s))).join("")}</select>
            </label>
          </div>
          <label class="fb-field"><span>${t("Office address")} ${optional}</span>
            <input name="address" maxlength="300" autocomplete="street-address">
          </label>
          <label class="fb-field"><span>${t("Google Maps link to the campus")} ${optional}</span>
            <input name="mapLink" type="url" maxlength="500" placeholder="https://maps.app.goo.gl/… or https://www.google.com/maps/…">
            <small>${t("Lets us put it in the right spot for \"near me\". Without it, it is placed at its town.")}</small>
          </label>
        </fieldset>

        <fieldset class="ls-set">
          <legend>${t("Public contact details")} ${optional}</legend>
          <p class="ls-note">${t("These are shown on the site. Give the organisation's own office contacts only, not a personal mobile number.")}</p>
          <div class="fb-row">
            <label class="fb-field"><span>${t("Office phone")}</span>
              <input name="phone" type="tel" maxlength="60">
            </label>
            <label class="fb-field"><span>${t("Office e-mail")}</span>
              <input name="email" type="email" maxlength="120">
            </label>
          </div>
          <div class="fb-row">
            <label class="fb-field"><span>${t("Person in charge")}</span>
              <input name="leadName" maxlength="120">
            </label>
            <label class="fb-field"><span>${t("Their role")}</span>
              <input name="leadRole" maxlength="120" placeholder="${t("e.g. Director, Ācārya, Principal")}">
            </label>
          </div>
        </fieldset>

        <fieldset class="ls-set">
          <legend>${t("About you")}</legend>
          <p class="ls-note">${t("Only the editors see this, to confirm the request with you. It is never published.")}</p>
          <div class="fb-row">
            <label class="fb-field"><span>${t("Your name")} ${req}</span>
              <input name="sName" maxlength="120" required autocomplete="name">
            </label>
            <label class="fb-field"><span>${t("Your role there")} ${optional}</span>
              <input name="sRole" maxlength="120" autocomplete="organization-title">
            </label>
          </div>
          <label class="fb-field"><span>${t("How do you know the organisation?")} ${req}</span>
            <select name="relation">
              ${opt("staff", t("I work there or run it"))}
              ${opt("member", t("I study, volunteer or am a member there"))}
              ${opt("other", t("I know of it, but I'm not part of it"))}
            </select>
          </label>
          <div class="fb-row">
            <label class="fb-field"><span>${t("Your e-mail")} ${req}</span>
              <input name="sEmail" type="email" maxlength="160" required autocomplete="email">
            </label>
            <label class="fb-field"><span>${t("Your phone")} ${optional}</span>
              <input name="sPhone" type="tel" maxlength="60" autocomplete="tel">
            </label>
          </div>
          <label class="fb-field"><span>${t("Anything else for the editors?")} ${optional}</span>
            <textarea name="note" rows="2" maxlength="1000"></textarea>
          </label>
          <small class="ls-tip">${t("Tip: an e-mail address on the organisation's own website domain helps us confirm the request faster.")}</small>
        </fieldset>

        <label class="ls-consent"><input type="checkbox" name="consent" required>
          <span>${t("The details above are correct, and the organisation's name, description, location and public contact details may be published on this site.")}</span>
        </label>
        <label class="fb-hp" aria-hidden="true">Website <input name="website" tabindex="-1" autocomplete="off"></label>
        <p class="fb-status" role="status" aria-live="polite"></p>
        <div class="fb-actions">
          <button type="submit" class="near-btn primary fb-send">${t("Send for review")}</button>
          <button type="button" class="near-btn fb-cancel">${t("Cancel")}</button>
        </div>
      </form>
      <div class="fb-done" hidden>
        <p class="fb-thanks">${t("Thank you")}</p>
        <p>${t("Your request has been sent. An editor will check it, may write to you to confirm, and will add it to the site once it is verified.")}</p>
        <div class="fb-actions">
          <button type="button" class="near-btn primary fb-finish">${t("Close")}</button>
        </div>
      </div>
    </section>`;
  document.body.appendChild(root);

  const panel = root.querySelector(".fb-panel"), scrim = root.querySelector(".fb-scrim");
  const form = root.querySelector(".fb-form"), done = root.querySelector(".fb-done"), status = root.querySelector(".fb-status");
  const send = root.querySelector(".fb-send");
  interactive(root.querySelector(".fb-close"), { lift: 0, rotate: 90, shadow: null, border: false });
  root.querySelectorAll(".fb-actions .near-btn").forEach(b => interactive(b, { lift: -2, shadow: "0px 8px 16px -12px" }));

  // picking a known city fills in its state
  form.city.addEventListener("change", () => {
    const c = CITIES.find(c => c.name.toLowerCase() === form.city.value.trim().toLowerCase());
    if (c && !form.state.value && STATES.includes(c.state)) form.state.value = c.state;
  });

  /* ---------- open / close ---------- */
  let lastFocus = null, openedAt = 0;
  function open() {
    lastFocus = document.activeElement;
    openedAt = Date.now();
    form.hidden = false; done.hidden = true; status.textContent = "";
    panel.hidden = false; scrim.hidden = false;
    animate(scrim, { opacity: [0, 1] }, tx({ duration: 0.3 }));
    animate(panel, { opacity: [0, 1], y: [28, 0], scale: [0.97, 1] }, tx(SOFT_SPRING));
    animate(panel.querySelectorAll(".fb-kicker, h2, .fb-lede, .ls-set"),
      { opacity: [0, 1], y: [10, 0] }, tx({ duration: 0.45, ease: EASE, delay: A.stagger(0.06, { startDelay: 0.08 }) }));
    setTimeout(() => form.name.focus(), 60);
  }
  function close() {
    if (panel.hidden) return;
    animate(scrim, { opacity: 0 }, tx({ duration: 0.25 }));
    animate(panel, { opacity: 0, y: 18 }, tx({ duration: 0.22 })).then(() => { panel.hidden = true; scrim.hidden = true; });
    if (lastFocus && document.contains(lastFocus)) lastFocus.focus({ preventScroll: true });
  }
  document.addEventListener("click", e => { if (e.target.closest("[data-list-org]")) open(); });
  scrim.addEventListener("click", close);
  root.querySelector(".fb-close").addEventListener("click", close);
  root.querySelector(".fb-cancel").addEventListener("click", close);
  root.querySelector(".fb-finish").addEventListener("click", close);
  panel.addEventListener("keydown", e => {
    if (e.key === "Escape") { e.stopPropagation(); close(); }
    if (e.key === "Tab") { // keep focus inside the dialog
      const f = [...panel.querySelectorAll("button, input, select, textarea")].filter(el => !el.disabled && el.offsetParent !== null && el.tabIndex !== -1);
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  });
  if (cta) cta.querySelectorAll("button").forEach(b => interactive(b, { lift: -2, shadow: "0px 10px 22px -12px" }));

  /* ---------- send ---------- */
  const isUrl = v => /^https?:\/\/\S+\.\S+/i.test(v);
  const isEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  function problem() {
    const v = n => form[n].value.trim();
    const links = v("links").split(/\s+/).filter(Boolean);
    if (v("name").length < 3) return ["name", t("Please give the organisation's name.")];
    if (!form.kind.value) return ["kind", t("Please choose what kind of place it is.")];
    if (!form.branch.value) return ["branch", t("Please choose its branch of knowledge.")];
    if (v("about").length < 40) return ["about", t("Please describe what it does in two or three sentences.")];
    if (v("url") && !isUrl(v("url"))) return ["url", t("The website should be a link starting with http:// or https://.")];
    if (links.some(l => !isUrl(l))) return ["links", t("Each page should be a link starting with http:// or https://, one per line.")];
    if (!v("url") && !links.length) return ["url", t("Please give its website, or at least one page that shows it exists.")];
    if (!v("city")) return ["city", t("Please give its town or city.")];
    if (!form.state.value) return ["state", t("Please choose its state.")];
    if (v("mapLink") && !isUrl(v("mapLink"))) return ["mapLink", t("The map link should start with https://.")];
    if (v("email") && !isEmail(v("email"))) return ["email", t("Please check the office e-mail address.")];
    if (!v("sName")) return ["sName", t("Please give your name.")];
    if (!isEmail(v("sEmail"))) return ["sEmail", t("Please give an e-mail address we can reach you at.")];
    if (!form.consent.checked) return ["consent", t("Please confirm the details may be published.")];
    return null;
  }

  form.addEventListener("submit", async e => {
    e.preventDefault();
    const bad = problem();
    if (bad) { status.textContent = bad[1]; form[bad[0]].focus(); return; }
    if (form.website.value) { showDone(); return; } // a bot filled the hidden field
    const v = n => form[n].value.trim();
    // a known city gives an approximate location; an exact map link (read by the Worker) wins
    const city = CITIES.find(c => c.name.toLowerCase() === v("city").toLowerCase() && c.state === form.state.value);
    const place = {
      name: v("name"), kind: form.kind.value, branch: form.branch.value, about: v("about"), study: v("study"),
      founded: v("founded"), url: v("url"), links: v("links"), city: v("city"), state: form.state.value,
      address: v("address"), mapLink: v("mapLink"), phone: v("phone"), email: v("email"),
      leadName: v("leadName"), leadRole: v("leadRole")
    };
    if (city && !place.mapLink) Object.assign(place, { lat: city.lat, lng: city.lng, approx: true });
    send.disabled = true;
    status.textContent = t("Sending…");
    try {
      const res = await fetch(URL_, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          place,
          submitter: { name: v("sName"), role: v("sRole"), relation: form.relation.value, email: v("sEmail"), phone: v("sPhone"), note: v("note") },
          consent: form.consent.checked,
          website: form.website.value,
          elapsed: Date.now() - openedAt,
          lang: I18N.hi ? "hi" : "en"
        })
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 429) throw new Error("busy");
      if (res.status === 400 && data.error) throw new Error("say:" + data.error);
      if (!res.ok) throw new Error("HTTP " + res.status);
      showDone();
    } catch (err) {
      status.textContent = err.message === "busy" ? t("Too many requests from here just now; please try again in a while.")
        : err.message.startsWith("say:") ? err.message.slice(4)
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

  window.IKSListing = { open };
})();
