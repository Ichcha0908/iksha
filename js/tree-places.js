/* ------------------------------------------------------------------
   Every other IKS place as a leaf on the tree.

   js/data.js and js/tree-centres.js hold the IKS centres (the large,
   glowing "featured" leaves). This file adds every remaining entry of
   js/places.js (gurukuls, oriental research institutes and manuscript
   libraries, heritage sites, living traditions, Āyurveda & Yoga
   institutes) to the branch it belongs to, as a smaller leaf on a twig of
   its own kind. Places that already have a leaf (`ref`) are skipped, so
   nothing appears twice.

   Each leaf keeps a link to its place record (`place`), and the place a
   link back (`leaf`), so "near me", the chatbot and the tree share one
   entry. Only facts from places.js are used; nothing is added.

   Branch placement is this site's own classification:
   - gurukuls and Veda pāṭhaśālās → Veda & Darśana
   - seats of Nyāya / Vedānta (Navadvīpa, Mithilā, Śṛṅgeri) and Kerala's
     Vedic / Tantric manuscript maṭhas → Veda & Darśana
   - Sanskrit colleges, Sanskrit bodies and the IKS Division → Language
   - temples, bronze casting, IGNCA, Majuli → Arts & Aesthetics
   - Āyurveda & Yoga institutes, Adivasi healing traditions → Health
   - observatories, the Kerala School, water and ecology traditions →
     Science & Technology
   - ancient universities, Kāśī, Kāñcīpuram, oriental research
     institutes and manuscript libraries → Heritage & Manuscripts
------------------------------------------------------------------- */
(function () {
  const IKS = window.IKS;
  const I = window.IKS_I18N || { t: (s, p) => (p ? s.replace(/\{(\w+)\}/g, (m, k) => p[k]) : s) };
  const t = I.t;
  const PLACES = window.IKS_PLACES || [];
  const STATE_ID = Object.fromEntries(window.INDIA_MAP.states.map(s => [s.name, s.id]));
  // newer names for areas the (older) map outline draws inside another shape
  Object.assign(STATE_ID, { "Ladakh": "jk", "Dadra and Nagar Haveli and Daman and Diu": "dn" });
  const branchById = Object.fromEntries(IKS.branches.map(b => [b.id, b]));

  /* twigs: the kinds of leaf a branch can carry (the featured IKS centres are "centres") */
  IKS.leafGroups = [
    { id: "centres", label: t("IKS & research centres"), color: "#d97b29" },
    { id: "gurukuls", label: t("Gurukuls & pāṭhaśālās"), color: "#8a5a2b" },
    { id: "ori", label: t("Oriental institutes & libraries"), color: "#7d5a9c" },
    { id: "institutions", label: t("Institutions"), color: "#b0652a" },
    { id: "heritage", label: t("Heritage sites"), color: "#4b5aa8" },
    { id: "traditions", label: t("Living traditions"), color: "#c4517f" },
    { id: "ayush", label: t("Āyurveda & Yoga"), color: "#4f8a4a" },
    { id: "museums", label: t("Museums & archives"), color: "#6f7d2f" },
    { id: "texts", label: t("Classical texts"), color: "#9a6b2f" }
  ];

  // the existing leaves are the featured IKS centres
  IKS.branches.forEach(b => b.centres.forEach(c => { c.group = "centres"; }));

  /* branch for each named (non-gurukul) place */
  const BRANCH_OF = {
    // Veda & Darśana
    "Navadvīpa — Nyāya School": "veda", "Mithilā — Nyāya & Dharma": "veda", "Śṛṅgeri Śāradā Pīṭha": "veda",
    "Tantra Vidyā Pīṭham": "veda", "Vaṭakke Maṭham Brahmasvam (Vedic Research Centre)": "veda", "Tekkē Maṭham": "veda",
    // Language & Literature
    "Bharatiya Vidya Bhavan": "language", "Samskrita Bharati": "language", "Indian Knowledge Systems Division": "language",
    "Ganganath Jha Kendriya Sanskrit Vidyapeeth": "language", "Madras Sanskrit College": "language",
    "Sanskrita Academy": "language", "Sanskrita Sahitya Parishat": "language", "Sanskrit College, Kolkata": "language",
    "Government Sanskrit College, Tripunithura": "language",
    // Arts & Aesthetics
    "IGNCA (Indira Gandhi National Centre for the Arts)": "arts", "Konark Sun Temple": "arts", "Bṛhadīśvara Temple": "arts",
    "Kailāsa Temple, Ellora": "arts", "Modhera Sun Temple": "arts", "Mīnākṣī Temple": "arts", "Khajuraho Temples": "arts",
    "Somnātha Temple": "arts", "Swamimalai bronze casting": "arts", "Majuli": "arts",
    // Health & Wellbeing
    "Bastar": "health", "Santhal Parganas": "health",
    // Science & Technology
    "Ujjain — Prime Meridian": "science", "Jantar Mantar, Jaipur": "science", "Jantar Mantar, Delhi": "science",
    "Man Mandir Observatory": "science", "Kerala School of Astronomy": "science", "Chand Baori stepwell": "science",
    "Jaisalmer": "science", "Jodhpur": "science", "Bikaner": "science", "Barmer": "science", "Khejarli": "science",
    "Ziro": "science", "Toda communities of the Nilgiris": "science", "Kerala backwaters": "science",
    "Sundarbans": "science", "Pichavaram mangroves": "science",
    // Heritage & Manuscripts
    "Nālandā Mahāvihāra": "heritage", "Vikramaśīla Mahāvihāra": "heritage", "Vallabhī University": "heritage",
    "Odantapurī Mahāvihāra": "heritage", "Kāśī — Seat of Learning": "heritage", "Kāñcīpuram — City of Learning": "heritage",
    "Kohima": "heritage"
  };
  const branchFor = p => {
    if (p.branch) return p.branch;   // js/places-atlas.js gives each entry its branch
    if (BRANCH_OF[p.name]) return BRANCH_OF[p.name];
    if (p.kind === "gurukul") return "veda";
    if (p.kind === "ayush") return "health";
    if (p.source === "hindupedia" || p.source === "hmml") return "heritage";
    return null;
  };
  const groupFor = p => {
    if (p.group) return p.group;     // listings set it ("ori" for oriental institutes)
    if (p.kind === "gurukul") return "gurukuls";
    if (p.kind === "heritage") return "heritage";
    if (p.kind === "tradition") return "traditions";
    if (p.kind === "ayush") return "ayush";
    if (p.kind === "museum" || p.kind === "archive") return "museums";
    if (p.kind === "text") return "texts";
    if (p.source === "hindupedia" || p.source === "hmml") return "ori";
    return "institutions";
  };

  /* gurukuls are many: on the tree they grow on six regional sub-branches */
  const REGIONS = [
    ["North", ["Uttar Pradesh", "Uttarakhand"]],
    ["North-west", ["Haryana", "Delhi", "Punjab", "Himachal Pradesh", "Jammu and Kashmir", "Chandigarh"]],
    ["West", ["Gujarat", "Rajasthan", "Maharashtra", "Goa"]],
    ["South", ["Karnataka", "Kerala", "Tamil Nadu", "Puducherry"]],
    ["Deccan & Central", ["Andhra Pradesh", "Telangana", "Madhya Pradesh", "Chhattisgarh"]],
    ["East & North-east", ["Odisha", "West Bengal", "Jharkhand", "Bihar", "Assam", "Tripura", "Sikkim",
      "Meghalaya", "Manipur", "Mizoram", "Nagaland", "Arunachal Pradesh"]]
  ];
  const regionOf = state => {
    const r = REGIONS.find(([, states]) => states.includes(state));
    return r ? r[0] : "East & North-east";
  };

  const SOURCES = {
    iksindia: [{ label: "Indian Knowledge Systems Division, Ministry of Education (iksindia.org)", url: "https://iksindia.org/" }],
    uem: [{ label: "IKS Centres across the World (iks.uem.edu.in)", url: "https://iks.uem.edu.in/iks-centres/" }],
    iksguru: [{ label: "iksguru.in: IKS resources and heritage map", url: "https://iksguru.in/resources" }],
    hindupedia: [{ label: "Hindupedia: Oriental Research Institutes of India", url: "https://www.hindupedia.com/en/Oriental_Research_Institutes_of_India" }],
    hmml: [{ label: "HMML (Hill Museum & Manuscript Library): repositories in India", url: "https://hmml.org/collections/repositories/india/" }],
    iish: [
      { label: "IISH: About IISH", url: "https://www.iish.org/about-iish/" },
      { label: "IISH: Contact (its list of office-holders is out of date)", url: "https://www.iish.org/contact/" },
      { label: "Organiser: Dr N Gopalakrishnan passes away (May 2023)", url: "https://organiser.org/2023/05/01/171869/bharat/scientist-dr-n-gopalakrishnan-a-dedicated-proponent-of-sanatan-dharma-passes-away" }
    ]
  };
  const GURUKUL_SOURCES = [
    ["aaryasamaj.com", { label: "aaryasamaj.com: Gurukuls list", url: "https://www.aaryasamaj.com/gurukuls-list" }],
    ["vediconcepts.org", { label: "vediconcepts.org: Gurukul list", url: "https://vediconcepts.org/gurukul-list/" }]
  ];

  const squash = v => String(v || "").toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");

  function leafFrom(p) {
    const contact = p.contact || {};
    const listed = !!contact.listedBy;
    const leaf = {
      name: p.name,
      type: p.kind === "gurukul" ? t("Gurukul / Veda pāṭhaśālā")
        : p.kind === "heritage" ? t("Heritage site · {host}", { host: p.host })
        : p.kind === "tradition" ? t("Living tradition")
        : p.kind === "ayush" ? t("Āyurveda & Yoga institute")
        : p.source === "hindupedia" ? t("Oriental research institute")
        : p.source === "hmml" ? t("Manuscript collection")
        : t("Institution"),
      state: STATE_ID[p.state] || null,
      stateName: p.state,
      city: p.noMap || p.city === p.state ? "" : p.city,
      founded: p.founded || "",
      summary: [p.study && squash(p.study) !== squash(p.name) ? p.study : "", p.about].filter(Boolean).join(" "),
      activities: [],
      people: p.lead ? [p.lead] : [],
      contact: {
        address: contact.address || "",
        phone: contact.phone || "",
        email: contact.email || "",
        website: p.url || "",
        listedBy: contact.listedBy || ""
      },
      sources: p.source === "gurukul"
        ? GURUKUL_SOURCES.filter(([n]) => (contact.listedBy || "").includes(n)).map(([, s]) => s)
        : (SOURCES[p.source] || []),
      group: groupFor(p),
      minor: true,
      place: p
    };
    const hostEn = (p.en && p.en.host) || p.host;   // the English host, before any translation
    if (hostEn && !/^(Gurukul|Living tradition|Oriental research institute|Manuscript collection|Ancient seat|Observatory|Temple|Living centre)/.test(hostEn)
        && squash(hostEn) !== squash(p.name)) {
      leaf.activities.push(p.kind === "ayush" ? t("Campus: {host}", { host: p.host }) : t("Host / campus: {host}", { host: p.host }));
    }
    if (p.peopleNote) leaf.peopleNote = t(p.peopleNote);
    if (p.source === "atlas") atlasLeaf(leaf, p);
    if (p.source === "community") communityLeaf(leaf, p);
    if (p.kind === "gurukul") {
      leaf.region = regionOf(p.state);
      if (p.source !== "community") leaf.activities.push(t("Listed in the gurukul directories as a gurukul or Veda pāṭhaśālā."));
      if (p.noMap) leaf.activities.push(t("The directories give no town for it, so it is shown by state."));
    }
    if (p.approx && !p.noMap && !contact.address) leaf.activities.push(t("The source gives no street address; the map and directions point to the town."));
    if (p.kind === "heritage") leaf.peopleNote = t("A public heritage site, not an institution, so no single person is in charge.");
    if (p.kind === "tradition") leaf.peopleNote = t("A living tradition carried by a community, not an institution, so no single person is in charge.");
    if (listed) leaf.listedNote = t("Contact details as listed by {who}. Directory listings can be out of date, so confirm before visiting.", { who: contact.listedBy });
    leaf.contactNote = p.source === "gurukul" ? t("The gurukul directories don't list a phone number for it.")
      : p.kind === "heritage" || p.kind === "tradition" ? t("A public place: no office contact is listed.")
      : t("The source doesn't list a phone number or e-mail.");
    return leaf;
  }

  /* organisations listed through "List your organisation" (js/listing.js):
     they gave the details themselves and an editor checked them */
  const webLink = u => typeof u === "string" && /^https?:\/\//i.test(u);
  function communityLeaf(leaf, p) {
    const k = p.community || {};
    leaf.type = p.group === "ori" ? t("Oriental research institute")
      : p.kind === "museum" ? t("Museum") : p.kind === "archive" ? t("Archive")
      : p.kind === "heritage" ? t("Heritage site") : leaf.type;
    leaf.community = true;
    leaf.activities.unshift(t("Listed at the organisation's request; its details were checked by the site's editors{when}.",
      { when: k.approved ? t(" on {date}", { date: k.approved }) : "" }));
    leaf.sources = [];
    if (webLink(p.url)) leaf.sources.push({ label: t("{name}: official website", { name: p.name }), url: p.url });
    (k.links || []).filter(webLink).forEach(u => {
      if (u !== p.url) leaf.sources.push({ label: t("Page given by the organisation: {host}", { host: u.replace(/^https?:\/\/(www\.)?/i, "").split("/")[0] }), url: u });
    });
    if (leaf.contact.phone || leaf.contact.email) leaf.listedNote = t("Contact details as given by the organisation.");
    leaf.contactNote = t("The organisation didn't give a phone number or e-mail.");
  }

  /* IKS Atlas entries: the Atlas's own text and links, marked as a draft */
  const atlasSources = a => [
    { label: t("IKS Atlas record {id} (draft, in review)", { id: a.id }), url: a.url },
    { label: t("Source listed by the IKS Atlas (not yet checked by the Atlas)"), url: a.src }
  ];
  function atlasLeaf(leaf, p) {
    const a = p.atlas;
    leaf.type = t(a.group);
    leaf.summary = p.full || p.about;
    leaf.draft = true;
    leaf.activities = [t("From the IKS Atlas, record {id}. The Atlas lists it as a draft in review.", { id: a.id })];
    if (p.noMap) leaf.activities.push(p.kind === "text" ? t("A text, not a place, so it has no map location.")
      : t("Its location couldn't be matched on OpenStreetMap, so it is shown by state."));
    else if (p.approx) leaf.activities.push(t("Located at its town from OpenStreetMap; check the exact spot before visiting."));
    if (p.kind === "museum" || p.kind === "archive" || p.kind === "institution") leaf.peopleNote = t("The IKS Atlas doesn't name the people who run it.");
    if (p.kind === "text") leaf.peopleNote = t("A text, not an institution.");
    leaf.contactNote = t("The IKS Atlas doesn't list contact details.");
    leaf.sources = atlasSources(a);
    // long Atlas lists: Kerala and the rest of India on separate twigs
    leaf.region = a.id.startsWith("KER") ? "Kerala" : "Across India";
  }

  // the tree's existing leaves, by name, so no place is added twice
  // (places are only matched against these: different gurukuls can share a name)
  const onTree = new Map();
  IKS.branches.forEach(b => b.centres.forEach(c => onTree.set(squash(c.name), c)));

  PLACES.forEach(p => {
    const existing = (p.ref && onTree.get(squash(p.ref))) || onTree.get(squash(p.name));
    if (existing) {
      if (!existing.place) { existing.place = p; p.leaf = existing; }
      return;
    }
    const bid = branchFor(p);
    const b = bid && branchById[bid];
    if (!b) return;
    const leaf = leafFrom(p);
    b.centres.push(leaf);
    p.leaf = leaf;
  });

  // Atlas records that are already on the site: add the Atlas link to that entry
  const placeByName = new Map(PLACES.map(p => [squash(p.name), p]));
  (window.IKS_ATLAS_SAME || []).forEach(({ name, atlas }) => {
    const c = onTree.get(squash(name)) || (placeByName.get(squash(name)) || {}).leaf;
    if (!c) return;
    c.sources = (c.sources || []).concat(atlasSources(atlas));
    c.atlas = atlas;
  });

  // where each leaf sits (branch index, leaf index), for links from other features
  IKS.branches.forEach((b, bi) => b.centres.forEach((c, ci) => { c.bi = bi; c.ci = ci; }));
})();
