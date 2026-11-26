/* =============================================================
   "List your organisation": IKS organisations ask to be listed on the
   site (form: js/listing.js). Every submission waits for an editor, who
   checks it on /admin (admin-page.js) and approves or rejects it. Only
   approved listings are served to the site, by /listings.js.
   ============================================================= */
import { ADMIN_HTML, ADMIN_JS, ADMIN_CSS } from "./admin-page.js";

const clip = (v, n) => (typeof v === "string" ? v.trim().slice(0, n) : "");
const json = (body, status, cors) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", ...cors } });

// KV keys in LISTINGS:
//   sub:<id>    one submission: { id, status, at, place, submitter, ... },
//               status "pending", "approved" or "rejected"
//   published   the approved places as one JSON array, which /listings.js
//               serves to the site (one read per visit)
const BRANCHES = ["veda", "language", "arts", "health", "science", "heritage"];
const KINDS = ["institution", "ori", "gurukul", "ayush", "heritage", "tradition", "museum", "archive"];
const STATES = ["Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chandigarh",
  "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh",
  "Jammu and Kashmir", "Jharkhand", "Karnataka", "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra",
  "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"];

const isUrl = v => /^https?:\/\/[^\s/]+\.[^\s]+$/i.test(v);
const isEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const urlOrEmpty = (v, n) => { const s = clip(v, n); return s && isUrl(s) ? s : ""; };
const num = (v, lo, hi) => { const n = Number(v); return Number.isFinite(n) && n >= lo && n <= hi ? Math.round(n * 1e5) / 1e5 : null; };
// links: several web addresses, one per line
const links = (v, max) => String(typeof v === "string" ? v : "").split(/\s+/).map(s => s.trim()).filter(isUrl).slice(0, max).map(s => s.slice(0, 500));

/** coordinates from a pasted Google Maps / OpenStreetMap link, if it has them */
function coordsFromMapLink(link) {
  const m = /@(-?\d+\.\d+),(-?\d+\.\d+)/.exec(link) || /[?&](?:q|ll|query|destination)=(-?\d+\.\d+),\s*(-?\d+\.\d+)/.exec(link)
    || /[#&]map=\d+\/(-?\d+\.\d+)\/(-?\d+\.\d+)/.exec(link) || /!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/.exec(link);
  if (!m) return null;
  const lat = num(m[1], 6, 38), lng = num(m[2], 67, 98);   // India's bounding box
  return lat != null && lng != null ? { lat, lng } : null;
}

/** a shared Google Maps short link (maps.app.goo.gl/…) has no coordinates in it:
    follow its redirect once to the full link, which usually has them */
async function expandMapLink(link) {
  if (!/^https:\/\/(maps\.app\.goo\.gl|goo\.gl\/maps)\//i.test(link || "")) return link;
  try {
    const r = await fetch(link, { redirect: "manual", signal: AbortSignal.timeout(4000) });
    const to = r.headers.get("Location");
    return to && /^https:\/\/(www\.)?google\.[a-z.]+\/maps/i.test(to) ? to.slice(0, 500) : link;
  } catch { return link; }
}

/** the public part of a listing: what the site shows once it is approved */
function cleanPlace(b) {
  const p = {
    name: clip(b?.name, 160),
    kind: KINDS.includes(b?.kind) ? b.kind : "",
    branch: BRANCHES.includes(b?.branch) ? b.branch : "",
    host: clip(b?.host, 160),
    about: clip(b?.about, 1200),
    study: clip(b?.study, 300),
    founded: clip(b?.founded, 20),
    city: clip(b?.city, 80),
    state: STATES.includes(b?.state) ? b.state : "",
    url: urlOrEmpty(b?.url, 300),
    lead: null,
    contact: {
      address: clip(b?.address, 300),
      phone: clip(b?.phone, 60).replace(/[^\d+\-() ,/]/g, ""),
      email: isEmail(clip(b?.email, 120)) ? clip(b?.email, 120) : ""
    },
    links: links(b?.links, 5),
    mapLink: urlOrEmpty(b?.mapLink, 500),
    lat: num(b?.lat, 6, 38),
    lng: num(b?.lng, 67, 98),
    approx: !!b?.approx
  };
  const leadName = clip(b?.leadName, 120), leadRole = clip(b?.leadRole, 120);
  if (leadName) p.lead = { name: leadName, role: leadRole };
  // a map link with coordinates sets the exact spot; otherwise the given
  // coordinates (an editor's, or the town's from the form) stay
  const c = p.mapLink && coordsFromMapLink(p.mapLink);
  if (c) { p.lat = c.lat; p.lng = c.lng; p.approx = false; }
  else if (p.lat == null || p.lng == null) { p.lat = p.lng = null; }
  return p;
}
function placeProblems(p) {
  const out = [];
  if (p.name.length < 3) out.push("the organisation's name");
  if (!p.kind) out.push("what kind of organisation it is");
  if (!p.branch) out.push("its branch of knowledge");
  if (p.about.length < 40) out.push("a short description (at least a couple of sentences)");
  if (!p.city) out.push("its town or city");
  if (!p.state) out.push("its state");
  if (!p.url && !p.links.length) out.push("its website or a page that mentions it");
  return out;
}

// best-effort per-isolate limit: 3 stored listings per IP per hour
// (only requests that are stored count, so a person fixing a mistake isn't locked out)
const lsHits = new Map();
const lsRecent = ip => (lsHits.get(ip) || []).filter(t => Date.now() - t < 60 * 60 * 1000);
const lsLimited = ip => lsRecent(ip).length >= 3;
const lsCount = ip => lsHits.set(ip, lsRecent(ip).concat(Date.now()));

export async function saveListing(request, env, cors) {
  if (!env.LISTINGS) return json({ error: "Listings storage is not set up yet." }, 503, cors);
  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  if (lsLimited(ip)) return json({ error: "Too many submissions; please try again later." }, 429, cors);
  let body;
  try { body = await request.json(); } catch { return json({ error: "Invalid JSON." }, 400, cors); }
  // spam checks: the hidden field, and forms sent faster than a person can fill them in
  if (clip(body?.website, 200)) return json({ ok: true }, 200, cors);
  if (!(Number(body?.elapsed) >= 8000)) return json({ ok: true }, 200, cors);

  if (body?.place) body.place.mapLink = await expandMapLink(clip(body.place.mapLink, 500));
  const place = cleanPlace(body?.place);
  const missing = placeProblems(place);
  const submitter = {
    name: clip(body?.submitter?.name, 120),
    role: clip(body?.submitter?.role, 120),
    email: clip(body?.submitter?.email, 160),
    phone: clip(body?.submitter?.phone, 60),
    relation: ["staff", "member", "other"].includes(body?.submitter?.relation) ? body.submitter.relation : "other",
    note: clip(body?.submitter?.note, 1000)
  };
  if (!submitter.name) missing.push("your name");
  if (!isEmail(submitter.email)) missing.push("an e-mail address we can reach you at");
  if (body?.consent !== true) missing.push("your agreement to publish the details");
  if (missing.length) return json({ error: "Please add " + missing.join(", ") + "." }, 400, cors);
  // most spam is link-stuffed: refuse descriptions full of links
  if ((place.about.match(/https?:\/\//g) || []).length > 2) return json({ error: "Please keep links out of the description." }, 400, cors);

  const at = new Date().toISOString();
  const id = `${at.replace(/[-:.TZ]/g, "").slice(0, 14)}-${crypto.randomUUID().slice(0, 8)}`;
  const rec = { id, status: "pending", at, lang: body?.lang === "hi" ? "hi" : "en", place, submitter };
  await env.LISTINGS.put(`sub:${id}`, JSON.stringify(rec), { metadata: { status: "pending", name: place.name.slice(0, 100) } });
  lsCount(ip);
  return json({ ok: true }, 200, cors);
}

/** the approved listings as a script the site loads before it builds the tree */
export async function listingsScript(env) {
  const list = env.LISTINGS ? (await env.LISTINGS.get("published", "json")) || [] : [];
  // "<" escaped so nothing in the data can close the script
  const data = JSON.stringify(list).replace(/</g, "\\u003c").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
  return new Response(`window.IKS_PLACES=(window.IKS_PLACES||[]).concat(${data});window.IKS_COMMUNITY_COUNT=${list.length};`, {
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      "Cache-Control": "public, max-age=300",
      "Access-Control-Allow-Origin": "*",
      "X-Content-Type-Options": "nosniff"
    }
  });
}

/** what the site gets for one approved listing */
function publicPlace(rec) {
  const p = rec.place;
  const out = {
    name: p.name,
    kind: p.kind === "ori" ? "institution" : p.kind,
    branch: p.branch,
    host: p.host || p.name,
    city: p.city,
    state: p.state,
    about: p.about,
    source: "community",
    community: { id: rec.id, approved: (rec.decidedAt || "").slice(0, 10), links: p.links }
  };
  if (p.kind === "ori") out.group = "ori";
  if (p.study) out.study = p.study;
  if (p.founded) out.founded = p.founded;
  if (p.url) out.url = p.url;
  if (p.lead) out.lead = { name: p.lead.name, role: p.lead.role, asOf: `the organisation's own listing, ${(rec.decidedAt || "").slice(0, 7)}` };
  const c = {};
  if (p.contact.address) c.address = p.contact.address;
  if (p.contact.phone) c.phone = p.contact.phone;
  if (p.contact.email) c.email = p.contact.email;
  if (Object.keys(c).length) out.contact = c;
  if (p.lat != null && p.lng != null) { out.lat = p.lat; out.lng = p.lng; if (p.approx) out.approx = true; }
  else out.noMap = true;
  return out;
}

async function allListings(env) {
  const keys = [];
  let cursor;
  do {
    const page = await env.LISTINGS.list({ prefix: "sub:", cursor });
    keys.push(...page.keys.map(k => k.name));
    cursor = page.list_complete ? null : page.cursor;
  } while (cursor);
  const recs = await Promise.all(keys.map(k => env.LISTINGS.get(k, "json")));
  return recs.filter(Boolean).sort((a, b) => (a.at < b.at ? 1 : -1));
}
/** rebuild the public list. KV doesn't promise that a write is visible to an
    immediate re-read, so the record just changed (or removed) is applied on top. */
async function republish(env, changed, removedId) {
  const approved = (await allListings(env))
    .filter(r => r.id !== removedId && (!changed || r.id !== changed.id))
    .concat(changed ? [changed] : [])
    .filter(r => r.status === "approved")
    .sort((a, b) => (a.at < b.at ? 1 : -1));
  await env.LISTINGS.put("published", JSON.stringify(approved.map(publicPlace)));
  return approved.length;
}

/* ---------- the editors' side: /admin ---------- */

// failed sign-ins per IP, to slow down password guessing
const authFails = new Map();
async function isAdmin(request, env) {
  if (!env.ADMIN_KEY) return false;
  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  const now = Date.now();
  const fails = (authFails.get(ip) || []).filter(t => now - t < 15 * 60 * 1000);
  if (fails.length >= 10) return false;
  const given = (request.headers.get("Authorization") || "").replace(/^Bearer\s+/i, "");
  // compare digests, so the time taken doesn't depend on how much of the key matched
  const enc = new TextEncoder();
  const [a, b] = await Promise.all([given, env.ADMIN_KEY].map(s => crypto.subtle.digest("SHA-256", enc.encode(s))));
  const x = new Uint8Array(a), y = new Uint8Array(b);
  let diff = 0;
  for (let i = 0; i < x.length; i++) diff |= x[i] ^ y[i];
  if (diff !== 0 || !given) { fails.push(now); authFails.set(ip, fails); return false; }
  return true;
}

const adminJson = (body, status = 200) => new Response(JSON.stringify(body), {
  status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" }
});

export async function adminApi(request, url, env) {
  if (!env.LISTINGS) return adminJson({ error: "The LISTINGS store is not set up (see server/README.md)." }, 503);
  if (!(await isAdmin(request, env))) return adminJson({ error: "Wrong password." }, 401);
  // only this page may call the admin API from a browser
  const origin = request.headers.get("Origin");
  if (origin && origin !== url.origin) return adminJson({ error: "Not allowed." }, 403);

  // visitors' "Suggest an update" messages (stored by worker.js)
  const fbStore = env.FEEDBACK || env.LISTINGS;
  if (request.method === "GET" && url.pathname === "/admin/api/feedback") {
    const keys = [];
    let cursor;
    do {
      const page = await fbStore.list({ prefix: "fb:", cursor });
      keys.push(...page.keys.map(k => k.name));
      cursor = page.list_complete ? null : page.cursor;
    } while (cursor);
    const recs = (await Promise.all(keys.map(k => fbStore.get(k, "json")))).filter(Boolean)
      .map((r, i) => ({ ...r, id: keys[i].slice(3), status: r.status || "open" }))
      .sort((a, b) => (a.at < b.at ? 1 : -1));
    return adminJson({ feedback: recs });
  }
  if (request.method === "POST" && url.pathname === "/admin/api/feedback") {
    let body;
    try { body = await request.json(); } catch { return adminJson({ error: "Invalid JSON." }, 400); }
    const key = `fb:${clip(body?.id, 60)}`;
    const rec = await fbStore.get(key, "json");
    if (!rec) return adminJson({ error: "No such message." }, 404);
    if (body?.action === "delete") { await fbStore.delete(key); return adminJson({ ok: true }); }
    if (!["done", "open"].includes(body?.action)) return adminJson({ error: "Unknown action." }, 400);
    rec.status = body.action;
    rec.editorNote = clip(body?.editorNote ?? rec.editorNote, 1000);
    await fbStore.put(key, JSON.stringify(rec), { metadata: { entry: (rec.entry || "").slice(0, 100), kind: rec.kind } });
    return adminJson({ ok: true, record: { ...rec, id: key.slice(3) } });
  }

  if (request.method === "GET" && url.pathname === "/admin/api/listings") {
    return adminJson({ listings: await allListings(env) });
  }
  if (request.method === "POST" && url.pathname === "/admin/api/decide") {
    let body;
    try { body = await request.json(); } catch { return adminJson({ error: "Invalid JSON." }, 400); }
    const id = clip(body?.id, 40);
    const rec = id && await env.LISTINGS.get(`sub:${id}`, "json");
    if (!rec) return adminJson({ error: "No such submission." }, 404);
    const action = body?.action;
    if (action === "delete") {
      await env.LISTINGS.delete(`sub:${id}`);
      return adminJson({ ok: true, published: await republish(env, null, id) });
    }
    if (!["approve", "reject", "pending", "save"].includes(action)) return adminJson({ error: "Unknown action." }, 400);
    if (body?.place) {
      // the editor's corrections
      body.place.mapLink = await expandMapLink(clip(body.place.mapLink, 500));
      const p = cleanPlace(body.place);
      if (action === "approve") {
        const missing = placeProblems(p);
        if (missing.length) return adminJson({ error: "Before approving, add " + missing.join(", ") + "." }, 400);
      }
      rec.place = p;
    }
    if (action !== "save") {
      rec.status = action === "approve" ? "approved" : action === "reject" ? "rejected" : "pending";
      rec.decidedAt = new Date().toISOString();
    }
    rec.editorNote = clip(body?.editorNote ?? rec.editorNote, 1000);
    await env.LISTINGS.put(`sub:${id}`, JSON.stringify(rec), { metadata: { status: rec.status, name: rec.place.name.slice(0, 100) } });
    return adminJson({ ok: true, record: rec, published: await republish(env, rec) });
  }
  return adminJson({ error: "Not found." }, 404);
}

const ADMIN_CSP = "default-src 'none'; script-src 'self'; style-src 'self'; connect-src 'self'; img-src 'self' data:; base-uri 'none'; form-action 'none'; frame-ancestors 'none'";
export function adminAsset(path) {
  const types = { "/admin": ["text/html", ADMIN_HTML], "/admin.js": ["application/javascript", ADMIN_JS], "/admin.css": ["text/css", ADMIN_CSS] };
  const [type, body] = types[path];
  return new Response(body, {
    headers: {
      "Content-Type": type + "; charset=utf-8",
      "Content-Security-Policy": ADMIN_CSP,
      "X-Frame-Options": "DENY",
      "Referrer-Policy": "no-referrer",
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex"
    }
  });
}
