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
  const PLACES = window.IKS_PLACES || [];
  const STATE_ID = Object.fromEntries(window.INDIA_MAP.states.map(s => [s.name, s.id]));
  const branchById = Object.fromEntries(IKS.branches.map(b => [b.id, b]));

  /* twigs: the kinds of leaf a branch can carry (the featured IKS centres are "centres") */
  IKS.leafGroups = [
    { id: "centres", label: "IKS & research centres", color: "#d97b29" },
    { id: "gurukuls", label: "Gurukuls & pāṭhaśālās", color: "#8a5a2b" },
    { id: "ori", label: "Oriental institutes & libraries", color: "#7d5a9c" },
    { id: "institutions", label: "Institutions", color: "#b0652a" },
    { id: "heritage", label: "Heritage sites", color: "#4b5aa8" },
    { id: "traditions", label: "Living traditions", color: "#c4517f" },
    { id: "ayush", label: "Āyurveda & Yoga", color: "#4f8a4a" }
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
    if (BRANCH_OF[p.name]) return BRANCH_OF[p.name];
    if (p.kind === "gurukul") return "veda";
    if (p.kind === "ayush") return "health";
    if (p.source === "hindupedia" || p.source === "hmml") return "heritage";
    return null;
  };
  const groupFor = p => {
    if (p.kind === "gurukul") return "gurukuls";
    if (p.kind === "heritage") return "heritage";
    if (p.kind === "tradition") return "traditions";
    if (p.kind === "ayush") return "ayush";
    if (p.source === "hindupedia" || p.source === "hmml") return "ori";
    return "institutions";
  };

  /* gurukuls are many: on the tree they sit on six regional twigs */
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
    hmml: [{ label: "HMML (Hill Museum & Manuscript Library): repositories in India", url: "https://hmml.org/collections/repositories/india/" }]
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
      type: p.kind === "gurukul" ? "Gurukul / Veda pāṭhaśālā"
        : p.kind === "heritage" ? `Heritage site · ${p.host}`
        : p.kind === "tradition" ? "Living tradition"
        : p.kind === "ayush" ? "Āyurveda & Yoga institute"
        : p.source === "hindupedia" ? "Oriental research institute"
        : p.source === "hmml" ? "Manuscript collection"
        : "Institution",
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
    if (p.host && !/^(Gurukul|Living tradition|Oriental research institute|Manuscript collection|Ancient seat|Observatory|Temple|Living centre)/.test(p.host)
        && squash(p.host) !== squash(p.name)) {
      leaf.activities.push(`${p.kind === "ayush" ? "Campus" : "Host / campus"}: ${p.host}`);
    }
    if (p.kind === "gurukul") {
      leaf.region = regionOf(p.state);
      leaf.activities.push("Listed in the gurukul directories as a gurukul or Veda pāṭhaśālā.");
      if (p.noMap) leaf.activities.push("The directories give no town for it, so it is shown by state.");
    }
    if (p.approx && !p.noMap) leaf.activities.push("The source gives no street address; the map and directions point to the town.");
    if (p.kind === "heritage") leaf.peopleNote = "A public heritage site, not an institution, so no single person is in charge.";
    if (p.kind === "tradition") leaf.peopleNote = "A living tradition carried by a community, not an institution, so no single person is in charge.";
    if (listed) leaf.listedNote = `Contact details as listed by ${contact.listedBy}. Directory listings can be out of date, so confirm before visiting.`;
    leaf.contactNote = p.source === "gurukul" ? "The gurukul directories don't list a phone number for it."
      : p.kind === "heritage" || p.kind === "tradition" ? "A public place: no office contact is listed."
      : "The source doesn't list a phone number or e-mail.";
    return leaf;
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

  // where each leaf sits (branch index, leaf index), for links from other features
  IKS.branches.forEach((b, bi) => b.centres.forEach((c, ci) => { c.bi = bi; c.ci = ci; }));
})();
