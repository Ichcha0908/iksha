# Jñāna Vṛkṣa: Indian Knowledge Systems

An interactive 3D "Tree of Knowledge" for Indian Knowledge Systems (IKS).

- Six branches: Veda & Darshana, Language & Literature, Arts & Aesthetics,
  Health & Wellbeing, Science & Technology, Heritage & Manuscripts.
- Each glowing leaf is a research centre. Clicking it opens a panel with the
  centre's name, type and state, plus a map of India with that state
  highlighted and pinned.
- Drag to turn the tree. The branch buttons under the tree also turn it and
  list each branch's centres (keyboard friendly, and they work without WebGL).

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
| [iksindia.org](https://iksindia.org/) | The IKS Division's list of IKS centres (89 after removing duplicates). The list gives institute and state but no address, so each centre is placed at its campus, or at its city when marked *approx.* Seven centres whose town couldn't be verified are left out. |
| [iks.uem.edu.in](https://iks.uem.edu.in/iks-centres/) | "IKS Centres across the World": the six with a physical site in India. |
| [iksguru.in](https://iksguru.in/) | Heritage map (ancient universities, observatories, temples, seats of learning), regional living traditions and AYUSH institutes, with the site's coordinates. Places outside India are left out. |
| [sanskritdocuments.org](https://sanskritdocuments.org/sites/) | Not used: the site blocks automated access. |

None of the sources lists dated, located events (the IKS Division's
"Upcoming events" page was empty), so the section lists places rather than
activities.

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

## The centres on the tree

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
| `js/places.js` | Places for "Find IKS places near me" (with sources) |
| `js/cities.js` | Cities a visitor can search from |
| `js/india-map.js` | State outlines of India |
| `vendor/three.min.js` | three.js r160 (MIT) |
| `vendor/motion.js` | Motion 12.23.12, the plain-JS build of Framer Motion (MIT) |

## Credits

- India state outlines: [svg-maps](https://github.com/VictorCazanave/svg-maps)
  by VictorCazanave, CC BY 4.0.
- 3D rendering: [three.js](https://threejs.org), MIT licence.
- Animation: [Motion](https://motion.dev) (formerly Framer Motion), MIT licence.
