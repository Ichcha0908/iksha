---
name: iks-design
description: Design rules for the Jñāna Vṛkṣa (Indian Knowledge Systems) website. Use whenever adding or changing anything visual on this site, including pages, sections, components, colours, fonts, ornaments, animations, the 3D tree, the India map or branch/centre content.
---

# Jñāna Vṛkṣa design rules

The site is a calm, parchment-and-gold space inspired by Vedic manuscripts and
vintage Indian frames. Every change should feel like it belongs in the same
hand-bound book: **clean, warm, ornamental at the edges, quiet in the middle.**

Before changing anything, read `css/style.css` (tokens), `js/app.js` (Motion
helpers, 3D tree) and `js/data.js` (content). Reuse what is there before adding
anything new.

## 1. Stack (do not change without being asked)

- Static site with no build step. It must keep working when `index.html` is
  opened straight from disk (`file://`).
- Plain HTML, CSS and JavaScript. **No React, no bundler, no ES module
  imports.** Scripts are classic `<script>` tags that load in order:
  `vendor/three.min.js` → `vendor/motion.js` → `js/india-map.js` →
  `js/data.js` → `js/places.js` → `js/cities.js` → `js/app.js`.
- New libraries go into `vendor/` with their licence file, never a CDN link.
  Google Fonts is the only allowed remote resource.

## 2. Colour

Use the CSS custom properties; never hard-code a new brown, gold or cream.

| Token | Value | Use |
| --- | --- | --- |
| `--paper` | `#ffefd4` | Page background. **Fixed; never change.** |
| `--card` | `#fff7e8` | Panels, buttons, cards |
| `--ink` | `#3f2414` | Headings, primary text |
| `--ink-soft` | `#6e4c33` | Body copy, secondary text |
| `--ink-faint` | `#7f6247` | Hints, captions, counts (lightest text colour allowed) |
| `--gold` | `#c09452` | Ornaments, frame strokes, focus accents |
| `--gold-soft` | `#dcc08e` | Soft fills inside ornaments |
| `--gold-line` | `rgba(176,132,70,.55)` | Hairline borders |

Branch colours live in `js/data.js` and are exposed to CSS as `--c` on the
element. Any branch-specific accent must read `var(--c)`; never repeat the
hex in CSS.

| Branch | Colour |
| --- | --- |
| Veda & Darshana | saffron `#d97b29` |
| Language & Literature | sindoor `#b8463a` |
| Arts & Aesthetics | lotus pink `#c4517f` |
| Health & Wellbeing | tulsi green `#4f8a4a` |
| Science & Technology | peacock teal `#2f7f8f` |
| Heritage & Manuscripts | indigo ink `#4b5aa8` |

Rules:
- Branch colours are for accents only (dots, borders, pins, leaves, pressed
  states). Large surfaces stay paper/card.
- Tints use `color-mix(in srgb, var(--c) N%, transparent)`, about 9–22%.
- No pure black, pure white text on paper, grey UI or neon. White is allowed
  only as text on a filled branch-coloured element.
- A new branch needs a new earthy, mid-saturation colour that is clearly
  distinct from the six above and keeps body-text contrast (≥ 4.5:1 for text
  set in it).

## 3. Typography

| Role | Font | Notes |
| --- | --- | --- |
| Headings, names, labels on the tree | `var(--serif)` Marcellus | weight 400 only, never bold |
| Body, buttons, meta | `var(--sans)` Jost | 400 / 500 / 600 |
| Sanskrit / Hindi | `var(--deva)` Tiro Devanagari Sanskrit | always add `lang="sa"` (or `lang="hi"`) |

- Sizes scale with `clamp()`. H1 is about 2.2–3.9rem, section H2 about
  1.6–2.1rem, body 17px (16px on mobile).
- Use correct IAST diacritics in English text (Jñāna, Vṛkṣa, Nāṭyaśāstra).
  Centre names stay exactly as the user supplied them.
- Small caps style (uppercase, `letter-spacing: .12em`, ~.82rem) only for
  kickers.
- Text is sentence case. Avoid exclamation marks and marketing tone.

## 4. Ornament and layout

- The fixed **frame** (`.frame`) wraps every page: double hairline border,
  scroll **corners** (`#corner`), a **lotus crest** with dotted rays and
  chevrons top and bottom (`#crest`), and diamond **side flourishes**
  (`#side`). Reuse these SVG `<symbol>`s; mirror them with `scaleX(-1)` /
  `scaleY(-1)` rather than drawing new variants.
- Ornaments are stroke-first: `stroke: var(--gold)`, 1.5px, round caps and
  joins; fills use `.fill` (gold) or `.fill.soft` (translucent gold).
- Behind the content: the paper texture (`.paper`) and the slowly rotating
  **mandala** (`#mandala`, opacity ≤ .5, strokes ≤ .35 alpha). Background
  motifs must stay faint enough that text never competes with them.
- Mythological and Vedic motifs come from this vocabulary: lotus, mandala and
  yantra (interlocking triangles, bhupura gateways), the peepal/Ashvattha leaf,
  the bindu (glowing dot), Devanagari verses. Don't add deities, religious
  icons, swastikas, clip-art or emoji.
- Content keeps clear of the frame: page padding is at least
  `var(--frame-inset) + 56px` at the top and `clamp(28px, 6vw, 72px)` at the
  sides.
- Centre everything on a single column (max ~1240px; text blocks ~600–760px).
  Generous whitespace beats more decoration.
- Shapes: pills (`border-radius: 999px`) for chips and labels, 12–14px for cards
  and buttons, 6px for the parchment panel. Shadows are soft, warm and
  negative-spread (`rgba(70,40,10,…) 0 30px 60px -30px`). Write box-shadows
  **colour first** (`rgba(…) 0 8px 20px -10px`) so Motion can interpolate them.

## 5. Motion (all animation goes through Motion)

The site uses [Motion](https://motion.dev), the plain-JS build of Framer
Motion, exposed as `window.Motion`.

- **No CSS `transition`, `animation` or `@keyframes`.** The only CSS for motion
  is the hidden starting state under `.motion` at the end of `style.css`.
- Use the helpers in `js/app.js` rather than calling `animate` ad hoc:
  - `interactive(el, opts)`: hover lift + colour/shadow fade to `--c` + press
    squish. Every new clickable element gets it.
  - `reveal(els, opts)`: staggered fade-and-rise (opacity 0→1, y 16→0).
  - `tx(opts)`: wrap **every** transition so reduced-motion users get
    `{ duration: 0 }`.
  - Constants: `EASE = [0.22, 1, 0.36, 1]`, `SPRING` (320/24) for hover,
    `SOFT_SPRING` (170/26) for panels.
- Scroll-triggered content: add the selector to the `.motion …{opacity:0}`
  rule **and** register it in `setupReveals()` with `inView` (amount 0.1–0.5).
  Forgetting either leaves content invisible or popping in.
- Staggers are 0.06–0.14s; entrances are 0.5–0.9s; nothing on the page takes
  longer than ~1.2s except ambient loops (mandala 240s, glows ~2s).
- Elements whose `transform` is set elsewhere (tree labels, mirrored
  ornaments) must only animate opacity, colour or shadow; call
  `interactive(el, { lift: 0 })`.
- Looping animations (map glow, pin rings) must be stored and `.stop()`ped
  before being replaced.
- 3D values (growth, leaf `appear` / `hover` / `dim`, rotation, view shift) are
  tweened by Motion on plain objects and read in the render loop. Only
  continuous ambient motion (sway, pollen, bindu pulse) is computed per frame,
  and it is skipped under reduced motion.

## 6. The 3D tree (three.js)

- One trunk, roots into a rotating yantra, a glowing bindu at the crown, one
  branch per entry in `IKS.branches`, spiralling up the trunk.
- **One clickable peepal leaf per centre**, coloured with its branch colour,
  with a soft halo. Decorative foliage stays small and in muted sage/olive/gold
  (`decoPalette`). Never make decorative leaves look clickable.
- New branches and centres come from `js/data.js` only; the geometry adapts.
  Keep the tree readable: if a branch would exceed ~5 leaves, discuss with
  the user before adding.
- Lighting stays warm (hemisphere `0xfff4e2`/`0xc9a26b` + white key + amber
  rim). Background is transparent so the paper shows through; no skyboxes or
  post-processing.
- Interaction: drag to rotate (horizontal only, inertia), click or tap a leaf to
  open the panel, branch labels and chips rotate the tree to face that branch.
  Keep `touch-action: pan-y` on the stage so phones can still scroll.

## 7. Centre panel and map

- Panel order: kicker (branch dot + name + "Leaf n of m") → name (serif) →
  type badge + place → India map → other leaves on this branch.
- The map uses `js/india-map.js` (CC BY 4.0, credit kept in the README and the
  file header). The state fill animates to the branch colour; the pin goes
  at `STATE_ANCHORS[state]`. Pins mark the **state**. If exact locations are
  ever supplied, add coordinates to the data rather than guessing.
- Desktop: right-hand drawer, and the tree shifts left. ≤720px: bottom sheet
  with a scrim.

## 7b. Find IKS places near me

- Place data lives in `js/places.js` (`{ name, kind, host, city, state, lat,
  lng, approx, about, url?, source }`). Every entry needs a real source; set
  `approx: true` when it is placed at a city rather than its campus. Never
  invent a location: leave a place out if its town can't be verified.
- Kind colours come from `IKS.placeKinds` in `js/data.js` and reuse the branch
  palette. A new kind gets an entry there, not a new hex in CSS.
- Result cards are `.spot` (`.place` is taken by the panel's place line).
- Location is used only in the browser. "Directions" sends no origin when the
  visitor used their location; only a typed city is sent as the origin.

## 8. Accessibility and responsiveness (non-negotiable)

- Everything reachable on the tree must also be reachable through the HTML
  chips and buttons (keyboard and no-WebGL fallback).
- Visible `:focus-visible` outline; Esc closes the panel and focus returns to
  where it was.
- Honour `prefers-reduced-motion` through `tx()` and the reduced-motion
  branches in the render loop.
- Check every change at **1440×900, 1280×800 and 390×844**. No horizontal
  scroll, no text under the frame ornaments, and the tree must be fully visible
  in the stage.
- Text contrast must be ≥ 4.5:1 against paper/card. `--ink` (12.6:1),
  `--ink-soft` (6.8:1) and `--ink-faint` (5.0:1 on paper, 4.8:1 on the map
  background) all pass. `--ink-faint` is the lightest text colour allowed:
  never lighten it or set text in a lighter brown or gold.

## 9. Content

- Branches and centres live only in `js/data.js`:
  `{ name, type, state }`, where `state` is a key of `STATE_ANCHORS`.
- Keep the user's spelling of centre names and types. Flag obvious duplicates
  or typos to the user instead of silently changing them.
- Branch blurbs are one sentence, factual, with IAST terms where natural.

## 10. Before you finish

1. Open the page in a headless browser (Playwright is preinstalled) at the
   three sizes above and look at the screenshots.
2. Exercise: hover a leaf, click a leaf, switch centres in the panel, close
   it, scroll to the footer, reload with reduced motion.
3. The console must show no errors.
4. Update the README if you added files, libraries or behaviour.
