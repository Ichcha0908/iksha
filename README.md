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

## Credits

- India state outlines: [svg-maps](https://github.com/VictorCazanave/svg-maps)
  by VictorCazanave, CC BY 4.0.
- 3D rendering: [three.js](https://threejs.org), MIT licence.
