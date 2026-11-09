# Jñāna Vṛkṣa: Indian Knowledge Systems

An interactive 3D "Tree of Knowledge" for Indian Knowledge Systems (IKS).

- Six branches: Veda & Darshana, Language & Literature, Arts & Aesthetics,
  Health & Wellbeing, Science & Technology, Heritage & Manuscripts.
- Each glowing leaf is a research centre. Clicking it opens a panel with the
  centre's name, type and state, plus a map of India with that state
  highlighted and pinned.
- Drag to turn the tree. The branch buttons under the tree also turn it and
  list each branch's centres (keyboard friendly, and they work without WebGL).

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

## Editing content

All branches and centres live in `js/data.js`. Add a centre by appending
`{ name, type, state }` to a branch's `centres` list. `state` is a two-letter
id such as `ka` (Karnataka) or `dl` (Delhi); the full list is in
`STATE_ANCHORS` in the same file.

## Files

| Path | Purpose |
| --- | --- |
| `index.html` | Page structure and the ornamental frame (SVG symbols) |
| `css/style.css` | Styling, colours, frame and panel |
| `js/app.js` | 3D tree (three.js), interaction, map and panel |
| `js/data.js` | Branches, centres and map pin positions |
| `js/india-map.js` | State outlines of India |
| `vendor/three.min.js` | three.js r160 (MIT) |
| `vendor/motion.js` | Motion 12.23.12, the plain-JS build of Framer Motion (MIT) |

## Credits

- India state outlines: [svg-maps](https://github.com/VictorCazanave/svg-maps)
  by VictorCazanave, CC BY 4.0.
- 3D rendering: [three.js](https://threejs.org), MIT licence.
- Animation: [Motion](https://motion.dev) (formerly Framer Motion), MIT licence.
