# Jñāna Vṛkṣa: Indian Knowledge Systems

An interactive 3D "Tree of Knowledge" for Indian Knowledge Systems (IKS).

- Six branches: Veda & Darshana, Language & Literature, Arts & Aesthetics,
  Health & Wellbeing, Science & Technology, Heritage & Manuscripts.
- **Every IKS place on the site is a leaf (728 leaves).** The large glowing
  leaves are IKS centres; gurukuls, oriental institutes and libraries,
  heritage sites, living traditions and Āyurveda & Yoga institutes are
  smaller leaves clustered on twigs by kind (the 555 gurukuls on six regional
  twigs). Clicking any leaf opens a panel with its details, contacts, sources
  and a map of India with its state highlighted and pinned.
- Drag to turn the tree. The branch buttons under the tree also turn it,
  zoom in on that branch, and open its **leaf finder**: search by name, town
  or person, filter by kind and state, 24 at a time. Hovering an entry lights
  its leaf up on the tree. With no branch chosen, the finder searches all 728
  leaves. It is keyboard friendly and works without WebGL.

## Acknowledgments

The **Acknowledgments** section at the bottom of the page lists the main
sources (the IKS Division, the IKS Atlas, IISH, UEM Kolkata's IKS list,
iksguru.in, Hindupedia, HMML, the two gurukul directories, the centres'
official sites, OpenStreetMap and the svg-maps outline of India), each with a
line on what was taken from it. Every leaf also lists its own sources.

## Suggest an update (feedback)

The **Suggest an update** button (bottom left, and in every leaf's panel and
"near me" card) opens a short form for corrections and new information:
which entry, what kind of update, the details, a source link, and an
optional name and contact. Submissions go to the Cloudflare Worker in
`server/` and are stored there; the editors read them in the **Feedback** tab
of the Worker's `/admin` page (or download them as a CSV) and check each one
against its source before changing the data. Setup:
[`server/README.md`](server/README.md) → Feedback. The form is in
`js/feedback.js`.

## List your organisation

The **Grow the tree with us** section (above the Acknowledgments) invites IKS
centres, gurukuls, institutes, museums, heritage sites and living traditions
that aren't on the site yet to ask to be listed. The form (`js/listing.js`)
asks for the organisation's name, kind, branch, description, website or
other pages that show it exists, town and state, an optional map link and
public office contacts, and, privately, who is sending it.

Requests go to the Cloudflare Worker in `server/` and wait there until an
editor checks and approves them on the Worker's password-protected `/admin`
page. Approved listings come back to every visitor through
`js/listings-loader.js` and become leaves on the tree, "near me" results and
chatbot answers, marked as listed at the organisation's request and checked
by the editors. The section stays hidden until the Worker's address is in
`js/chat-config.js`. Setup and the spam protections:
[`server/README.md`](server/README.md) → Organisation listings.

## Hindi / English

The **हिन्दी** button at the top right shows the whole site in Hindi (the
**English** button switches back). The choice is remembered in the browser,
and a link with `?lang=hi` opens the Hindi version directly. Translated: all
page and interface text, the branches, the centres' descriptions, activities
and roles, place descriptions, state and city names, the leaf finder, "near
me" and the chatbot's built-in answers. The chatbot also understands simple
Hindi questions ("वाराणसी के पास गुरुकुल", "हरियाणा में कितने गुरुकुल हैं?"),
and in AI mode it answers in Hindi. Names of centres, people, towns and
addresses, official project titles and source titles stay as the sources
give them. The Hindi text is in `js/i18n-hi.js`; `js/i18n.js` applies it.

## Find IKS places near me

The **Find IKS places near me** button (top of the page) and the *IKS places
near you* section list IKS centres, heritage sites, living traditions and
Āyurveda/Yoga institutes near the visitor:

- **Use my location** asks the browser for the visitor's position. It stays in
  the browser and is only used to measure distances.
- **Type a city** (for example "Chandigarh") to see what is near a place you
  are visiting. The city list is in `js/cities.js`.
- Choose a distance (50, 100, 200 or 300 km; 100 km by default) and which kinds
  of place to show. If nothing is in range, the nearest places are shown.
- **Directions** opens Google Maps. From a typed city the route starts there;
  from "my location" Google uses the device's own location.

Each result card shows **What they study** (for IKS Division centres, the
full official project title) and three buttons: **Directions**, **Contact**
and **Learn more**/**Website**. **Contact** opens:

- **Person in charge** and their designation, with the source and its date.
  For IKS Division centres this is the Principal Investigator named in the
  official list; for the tree's centres, the head named in `js/data.js`.
- **Office phone, office email and address**, only where an official source
  lists them. The IKS Division doesn't publish PIs' phone numbers or e-mails,
  so those cards say so and offer a web search for the PI instead. No
  personal numbers are ever listed.
- The centre's status and programme details, or the tree centre's activities.

Location only works on `https://` (for example GitHub Pages) or `localhost`;
some browsers block it for pages opened straight from disk, where typing a
city still works.

Places live in `js/places.js`, generated from:

| Source | What was used |
| --- | --- |
| [aaryasamaj.com](https://www.aaryasamaj.com/gurukuls-list) and [vediconcepts.org](https://vediconcepts.org/gurukul-list/) | 556 gurukuls and Veda pāṭhaśālās, merged and de-duplicated: map positions from aaryasamaj.com, websites and contact persons from vediconcepts.org, and the phone numbers each directory lists. 99 have no location in either directory; they appear in the chatbot (by state) but not in "near me". |
| [Hindupedia](https://www.hindupedia.com/en/Oriental_Research_Institutes_of_India) | 14 Oriental Research Institutes (e.g. BORI, Sarasvati Mahal Library, Adyar Library), with descriptions from the article. |
| [HMML](https://hmml.org/collections/repositories/india/) | 9 institutional manuscript repositories in India. Private, family and church collections are left out. |
| [iksindia.org](https://iksindia.org/) | The IKS Division's list of IKS centres (89 after removing duplicates). The list gives institute and state but no address, so each centre is placed at its campus, or at its city when marked *approx.* Seven centres whose town couldn't be verified are left out. |
| [iks.uem.edu.in](https://iks.uem.edu.in/iks-centres/) | "IKS Centres across the World": the six with a physical site in India. |
| [iksguru.in](https://iksguru.in/) | Heritage map (ancient universities, observatories, temples, seats of learning), regional living traditions and AYUSH institutes, with the site's coordinates. Places outside India are left out. |
| [IKS Atlas](https://iks-atlas.vercel.app/) | 477 heritage places, living traditions, museums, archives, research institutions and texts (Kerala and across India). The Atlas marks every record as a draft in review whose source it hasn't checked, so the site labels them "From the IKS Atlas (draft)" and links each to its Atlas record and the source the Atlas lists; descriptions are the Atlas's own (English only). 23 records already on the site add their Atlas link to that entry instead. Locations from [OpenStreetMap](https://www.openstreetmap.org/copyright) (Nominatim), kept only when the matched place agrees with the record's own name (264 located, some only to their town and marked *approx.*). The other 213, and the 3 texts, are on the tree and in the chatbot by state but not in "near me". |
| [IISH](https://www.iish.org/) | The Indian Institute of Scientific Heritage, Thrissur, from its About and Contact pages. Its listed Director and founder, Dr. N. Gopalakrishnan, died in April 2023 ([Organiser](https://organiser.org/2023/05/01/171869/bharat/scientist-dr-n-gopalakrishnan-a-dedicated-proponent-of-sanatan-dharma-passes-away)), so no person in charge is named. |
| [sanskritdocuments.org](https://sanskritdocuments.org/sites/), [Scribd](https://www.scribd.com/) lists | Not used: these sites block automated access (Scribd requires a signed-in browser). |

None of the sources lists dated, located events (the IKS Division's
"Upcoming events" page was empty), so the section lists places rather than
activities.

## Chatbot: Jñāna Sahāyaka

The **Ask about IKS** button (bottom right) opens a chatbot that answers from
the site's own data: the tree's centres, and the places, institutes and
gurukuls in "near me". It answers questions like:

- "Gurukuls near Varanasi" or "IKS places near Chandigarh within 150 km"
- "Who heads Sahitya Akademi?" or "Phone number of Arya Vaidya Sala"
- "Āyurveda centres in Kerala" or "Manuscript libraries in Tamil Nadu"
- "How many gurukuls are in Haryana?"
- "What is Veda & Darshana about?" or "Tell me about BORI"

Answers carry buttons to open the leaf on the tree, get directions, visit the
website, or show everything nearby. If something isn't in the site's data,
the chatbot says so rather than guessing.

There are two modes:

- **Built-in (default):** runs in the browser, free and offline
  (`js/chat.js`). It also explains "What is IKS?" and "What is a gurukul?"
  (quoting iksindia.org and vediconcepts.org), and for anything else it
  can't answer it offers a **Search Google** button for that question.
- **AI (optional):** deploy the Cloudflare Worker in `server/` (Claude through OpenRouter) and put its
  address in `js/chat-config.js`. Claude then answers any question: from the
  site's records for its centres, people and contacts; from its own knowledge
  for general questions; and with web search for current facts, listing its
  sources. See [`server/README.md`](server/README.md) for setup and costs.

## Run it

It is a static site with no build step. Open `index.html` in a browser, or
serve the folder:

```bash
python3 -m http.server 8000
```

## Animation

Animations use [Motion](https://motion.dev) (`animate`, `inView`, `stagger`,
`hover`, `press`). Framer Motion's React API needs React, so the site uses
Motion's plain-JavaScript build instead. The stylesheet has no CSS animations or
transitions.

- Page load: frame ornaments fade in; the title, subtitle and intro rise in one
  after another.
- On scroll: the tree, branch buttons, branch details and footer fade in when
  they come into view.
- Hover and press: buttons lift with a spring, their borders and shadows fade to
  the branch colour, and they shrink slightly when pressed. The close button
  turns as well.
- Panel and map: the panel slides in on a spring and its contents appear one
  after another. The state's colour fades in, the pin drops with a bounce and
  rings pulse out from it.
- 3D tree: Motion tweens the branches growing, leaves popping in, leaf
  hover/dimming, turning to a branch and shifting the view when the panel opens.
  The continuous sway, drifting pollen and glow are worked out in the
  three.js render loop.
- Visitors who turn on "reduce motion" in their system settings get every
  change instantly.

## Every IKS place is a leaf

`js/tree-places.js` adds every entry of `js/places.js` that isn't already an
IKS-centre leaf to its branch as a small leaf (623 leaves), so nothing has to
be found through "near me" alone. Gurukuls, the Kerala Vedic and Tantric
maṭhas and the seats of Nyāya and Vedānta (Navadvīpa, Mithilā, Śṛṅgeri) go on
Veda & Darshana; Sanskrit colleges and bodies and the IKS Division on
Language; temples, bronze casting, IGNCA and Majuli on Arts; Āyurveda & Yoga
institutes and Adivasi healing traditions on Health; observatories, the Kerala
School and the water and ecology traditions on Science; ancient universities,
Kāśī, Kāñcīpuram and the oriental research institutes and manuscript
libraries on Heritage. This is the site's own classification. Places are
matched to existing leaves by name only against the IKS centres (different
gurukuls can share a name), so nothing appears twice: the one gurukul-list
entry for Maharshi Sandipani Rashtriya Veda Vidya Pratishthan is part of its
centre leaf.

How the many leaves stay easy to use:

- Small leaves are drawn as one instanced mesh per branch, around a foliage
  core at the end of each twig, so the page stays fast.
- They're picked by screen distance (13 px with a mouse, 22 px with a finger),
  front-facing leaves and the focused branch first, so they're easy to hit.
- Choosing a branch turns it to the front and zooms in. On touch screens, the
  first tap on another branch's small leaf brings that branch forward; the
  next tap opens a leaf.
- The leaf finder lists every leaf. "Near me" cards and chatbot answers have
  an **On the tree** button that opens the place's leaf.
- The panel lists the other leaves on the same twig, nearest first (same
  state), with "Show more" and a link to search the whole branch.

| Branch | IKS centres | Other leaves | All leaves |
| --- | --- | --- | --- |
| Veda & Darshana | 23 | 564 | 587 |
| Language & Literature | 19 | 12 | 31 |
| Arts & Aesthetics | 7 | 280 | 287 |
| Health & Wellbeing | 19 | 9 | 28 |
| Science & Technology | 25 | 39 | 64 |
| Heritage & Manuscripts | 12 | 197 | 209 |
| **Total** | **105** | **1,101** | **1,206** |

The IKS Atlas added 477 leaves (temples, churches and other sacred sites and
the performing arts and crafts mostly on Arts & Aesthetics; archaeological
sites, forts, palaces, museums and archives on Heritage & Manuscripts;
farming, water and boat-building traditions on Science & Technology), and
IISH one (Science & Technology). Atlas entries from Kerala and from the rest
of India sit on separate twigs.

## Every IKS centre is a leaf

The tree has **105 IKS-centre leaves**: the 15 curated centres below, plus every IKS
centre in the database (`js/tree-centres.js`, generated with `js/places.js`):

- all the IKS Division's centres from its official list
  ([iksindia.org](https://iksindia.org/search_site_centers/index.php); the
  older copy at old.iksindia.org has the same 124 entries), including 7 whose
  town couldn't be verified (their leaf shows the state from the list);
- UEM Kolkata's Centre of Excellence for IKS.

No centre appears twice. Entries in the official list for the same centre
(same institution and the same Principal Investigator or title) are merged
into one leaf that keeps all their titles and PIs, and the Sanskrit centre at
Maharshi Panini University is part of that university's leaf. Each centre sits
on the branch that fits its official title; this is the site's own
classification, and the leaf panel says so. Every IKS centre in "near me"
links to its leaf, so the chatbot never lists one twice.

| Branch | Leaves |
| --- | --- |
| Veda & Darshana | 23 |
| Language & Literature | 19 |
| Arts & Aesthetics | 7 |
| Health & Wellbeing | 19 |
| Science & Technology | 25 |
| Heritage & Manuscripts | 12 |

## The curated centres on the tree

Each leaf is a real organisation. Its panel shows a summary, the India map,
*What happens here*, *People*, *Visit & contact* (address opens Google Maps;
phone and e-mail are tappable) and *Sources*. Facts were checked in
November 2026 against official pages wherever those could be read
(prospectuses, annual reports, RTI handbooks, university and institute
websites), otherwise against government or news sources, all linked in the
panel. People are named only where a source names them, with that source's
date; only institutional contacts are listed.

The original 15 leaf names (for example "Darshana Research Centre" or
"Pandulipi Bhandar") could not be found as real organisations, so each was
replaced with a real centre in the same branch, keeping the state wherever
a real counterpart existed:

| Placeholder | Real centre |
| --- | --- |
| Darshana Research Centre (KA) | Karnataka Samskrit University, Bengaluru |
| Vedavidya Pratishthan (UP) | Maharshi Sandipani Rashtriya Veda Vidya Pratishthan, Ujjain (MP) |
| Himalaya Jnana Peeth (UK) | Gurukula Kangri (Deemed to be University), Haridwar |
| Bhasha Bharati Institute (TN) | Central Institute of Classical Tamil, Chennai |
| Sampreshana Studio (DL) | Sahitya Akademi, New Delhi |
| Sambhashana Sangha (MP) | Maharshi Panini Sanskrit Evam Vedic Vishwavidyalaya, Ujjain |
| Kavya Sadan (WB) | The Asiatic Society, Kolkata |
| Natyashala Trust (KL) | Kerala Kalamandalam, Cheruthuruthy |
| Shilpa Kala Mandir (OR) | Kala Bhoomi – Odisha Crafts Museum, Bhubaneswar |
| Ayu Sutra Foundation (KL) | Arya Vaidya Sala, Kottakkal |
| Yoga Vidya Kendra (MH) | Kaivalyadhama Yoga Institute, Lonavala |
| Ganita Jyotisha Parishad (RJ) | Central Sanskrit University, Jaipur Campus (Jyotiṣa) |
| Vastu Shilpa Sansthan (TG) | Centre of Excellence for IKS, IIT Kharagpur (WB) |
| Pandulipi Bhandar (AS) | Krishna Kanta Handiqui Library, Gauhati University |
| Granthalaya Trust (AP) | Oriental Research Institute, Sri Venkateswara University, Tirupati |

Each entry in `js/data.js` keeps the placeholder it replaced in `was`.

## Editing content

All branches and centres live in `js/data.js`. Add a centre by appending an
object to a branch's `centres` list: at least `{ name, type, state, city,
summary, sources }`, plus optional `founded`, `activities`, `people`
(`{ name, role, asOf }`) and `contact` (`address`, `phone`, `email`,
`hours`, `website`). `state` is a two-letter
id such as `ka` (Karnataka) or `dl` (Delhi); the full list is in
`STATE_ANCHORS` in the same file.

## Files

| Path | Purpose |
| --- | --- |
| `index.html` | Page structure and the ornamental frame (SVG symbols) |
| `css/style.css` | Styling, colours, frame and panel |
| `js/app.js` | 3D tree (three.js), interaction, map and panel |
| `js/data.js` | Branches, centres, map pin positions and place-kind colours |
| `js/places-atlas.js` | IKS Atlas and IISH entries (generated) |
| `js/places.js` | Places for "Find IKS places near me" (with sources) |
| `js/tree-centres.js` | Leaves for every IKS centre in the database (generated) |
| `js/tree-places.js` | Adds every other place as a small leaf on its branch |
| `js/i18n.js`, `js/i18n-hi.js` | Language switch and the Hindi text |
| `js/feedback.js` | The "Suggest an update" form |
| `js/cities.js` | Cities a visitor can search from |
| `js/chat.js` | The chatbot (built-in answers; optional AI mode) |
| `js/chat-config.js` | Chatbot setting: the AI Worker's address, if any |
| `server/` | Optional Cloudflare Worker that adds Claude answers |
| `js/india-map.js` | State outlines of India |
| `vendor/three.min.js` | three.js r160 (MIT) |
| `vendor/motion.js` | Motion 12.23.12, the plain-JS build of Framer Motion (MIT) |

## Credits

- India state outlines: [svg-maps](https://github.com/VictorCazanave/svg-maps)
  by VictorCazanave, CC BY 4.0.
- 3D rendering: [three.js](https://threejs.org), MIT licence.
- Animation: [Motion](https://motion.dev) (formerly Framer Motion), MIT licence.
