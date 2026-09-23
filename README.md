# KARM

> Karm ek din laut ke aata hai.

![KARM: a brick wall landing in the dark, under the line कर्म एक दिन लौट के आता है](docs/screenshots/01-hero.jpg)

A lane at three in the morning. A wall that builds itself one brick at a time. Ten accounts that settled themselves, six short films, four questions nobody scores, and a wall you take apart with your own hands.

**KARM** is an immersive, scroll-driven web experience about the one law nobody escapes:

<p align="center"><strong>ACTION → CONSEQUENCE → RETURN</strong></p>

> एक मोहल्ले में ईंट लगी सोने की,<br>
> एक मोहल्ले से आवाज़ आए रोने की।
>
> <sub><i>In one mohalla, a brick of gold was laid. From another came the sound of weeping.</i></sub>

Written in Hindi. Built by hand in HTML, CSS and JavaScript, with no framework, no image assets and no audio files.

---

## About

KARM treats every act as a brick. What you lay down stays in the wall, and sooner or later the wall comes back to you.

The piece unfolds in eight movements, read by scrolling. Every story inside it moves in the same three beats: **कर्म** (the act), **नतीजा** (the consequence), **वापसी** (the return).

Everything on screen is drawn with CSS and assembled at runtime. The walls are laid in running bond by JavaScript, the skylines are built from data, and the ambience is synthesised live in the browser.

## Experience Design

```
ACTION  →  CONSEQUENCE  →  RETURN
 कर्म         नतीजा          वापसी
```

Every movement is built on that line, and the design follows from it.

- **Three beats, three lights.** The act is shown plainly. The consequence arrives cold. The return is warm and set in gold, wherever it appears: in the story player, in the ईंट का हिसाब panel, and in the couplet.
- **Light has a source.** A street lamp, a lit window, the kiln brick, the room behind a wall. Nothing on the page glows by itself, so light always means something is there.
- **Bricks are physical.** They fall with weight and land with a jolt. They slide out of their courses, swing on an edge, drop away, and go back up course by course. No two are fired the same.
- **Rooms, not pages.** Some movements change everything around them. The mirror is quieter: less grain, lower sound. The final room takes away the navigation, the grain and the ambience, and leaves only the last lines, with black between them.
- **Restraint.** Every motion carries part of the story. None of it is there for decoration.

## Experience

### 000 — The Return

Black first, then the title, then the bricks. The first three land alone, each with a thud the camera feels, and the rest become a wall. Two lines surface: *हर काम एक ईंट है। तुम क्या बना रहे हो?* (Every act is a brick. What are you building?) Scroll, and the camera pushes in. Light leaks through the mortar, the bricks at the centre give way, and you pass through the gap into the lane.

### 001 — Mohalla

A night lane in layered depth. An electric pole and a broken wall in the foreground; water tanks and antennas on the roofs; a street lamp and a chai stall lighting the walls nearest them; someone crossing a lit room now and then. Six places (दुकान, घर, निर्माण, दीवार, गली, चाय) each open their own account in three beats.

![Mohalla: a lane of brick buildings at night, the chai stall hotspot lit](docs/screenshots/02-mohalla.jpg)

### 002 — ईंट का हिसाब

A wall with ten words in it: झूठ, प्यार, धोखा, मदद, सच… Each brick gives a little under the hand. Choose one and it comes out of its course, swings open on its edge, and finds the light in the cavity behind. Then the account: the act, the consequence, the return.

![ईंट का हिसाब: the brick सच swung open, with its three beats beside the wall](docs/screenshots/03-eent-ka-hisaab.jpg)

### 003 — दो मोहल्ले

A scroll-scrubbed split screen. In one mohalla a new floor rises every month; in the other an old wall leans a little further. A single golden brick lifts from one lane's floor, turns once through the air, and lands in the other lane. Both came from the same kiln. Where it lands, the last few lights go out. Then the screen goes dark on the couplet.

![दो मोहल्ले: a warm skyline and a grey one, split down the middle](docs/screenshots/04-do-mohalle.jpg)

### 004 — कहानियाँ

An index rather than a card grid. Six short films (The Thief, The Stranger, The Wall, The Promise, The Silence, The Help), each played as three beats: the act in plain light, the consequence cold, the return warm. Films you have watched keep their mark in the index.

![कहानियाँ: the story चोर open on its final beat, वापसी](docs/screenshots/05-kahaniyan.jpg)

### 005 — आईना

Four questions, asked slowly. Answer, and the question leaves; after a moment of silence, the mirror answers back. It is an old mirror, gone grey at the edges, and its reflection follows you a little late. Nothing is scored and nothing is saved. It ends on *हिसाब किसी और का नहीं।*, then a long pause, then *तुम्हारा है।* (The account is no one else's. It's yours.), alone.

![आईना: the first question in the mirror, with three answers](docs/screenshots/06-aaina.jpg)

### 006 — दीवार

A wall of up to twenty-four words. Pull one out and it comes toward you, then drops away; light comes through the gap, with a fragment of someone's story. The more you remove, the brighter the room behind gets, until it lights the floor in front of you. The last brick leaves one line: *ये दीवार तुमने ही बनाई थी।* (You built this wall yourself.) Then you can build it again, course by course.

![दीवार: ten bricks removed, light through the gaps, fragments listed beside the wall](docs/screenshots/07-deewar.jpg)

### 007 — The Return

Everything else falls away: the navigation, the grain, the sound of the lane. The last lines arrive one at a time with black between them, and the couplet's second line answers its first. KARM returns to where it began.

![The Return: the word KARM alone on black](docs/screenshots/08-the-return.jpg)

## Features

- **Cinematic scroll experience.** Sticky, scroll-scrubbed scenes driven by one shared animation loop, including a camera that passes through the hero wall.
- **Interactive Mohalla.** Six hotspots in a five-layer lane, from the sky to a foreground pole. On small screens it becomes a full-width index.
- **Interactive brick walls.** Procedural running bond with per-brick clay, texture and the occasional chipped corner. Bricks swing open in ईंट का हिसाब, and in दीवार they come out and go back up course by course.
- **A signature crossing.** In दो मोहल्ले, one golden brick travels between the two lanes, and its landing changes the other side.
- **Action → Consequence → Return.** One storytelling rule across every movement.
- **Three-beat story system.** A single sequence player serves both the Mohalla places and the Kahaniyan films, with its own light for each beat. All writing lives in `data/`.
- **Rooms.** The mirror and the final section quiet the whole page: grain, navigation and sound respond to where you are.
- **Hindi Devanagari typography.** Noto Serif and Noto Sans Devanagari paired with Cormorant Garamond, Inter and IBM Plex Mono, plus a dedicated layer that removes synthetic italics and Latin tracking and re-measures leading for Devanagari.
- **Web Audio soundscape.** Synthesised live, off until you turn it on, and quieter in the rooms that ask for it.
- **Keyboard navigation.** Every interaction is reachable from the keyboard. Arrow keys move through the story index and step through a story, and Escape closes.
- **Accessible interactive elements.** Native buttons, a labelled modal dialog, live regions and state attributes.
- **Reduced-motion support.** The same story, without the choreography.
- **Responsive mobile experience.** Layouts rebuilt for phones, not just scaled down.
- **GPU-friendly animation.** Transforms and opacity driven by CSS custom properties.
- **Vanilla JavaScript architecture.** ES modules, no framework, zero runtime dependencies.

## Tech Stack

| Technology | Role |
|---|---|
| **HTML5** | Semantic sections, native `<button>`s, a modal dialog built on `inert` |
| **CSS3** | Custom properties (some registered with `@property`), individual `translate` / `rotate` / `scale`, sticky positioning, `clamp()` type scale, keyframes, `svh` units, `text-wrap` |
| **JavaScript** | ES modules, no framework, no runtime dependencies |
| **Web Audio API** | Synthesised ambience and brick sounds |
| **Browser APIs** | `requestAnimationFrame`, `IntersectionObserver`, `matchMedia` |
| **Fonts** | Cormorant Garamond, Inter, IBM Plex Mono, Noto Serif Devanagari, Noto Sans Devanagari (Google Fonts) |
| **Vite** | Dev server and production build only; the single dev dependency |
| **GitHub Actions** | Build and deploy to GitHub Pages |

## Architecture

```
karm/
├── index.html           application shell: every movement's markup, in order
├── favicon.svg
├── vite.config.js       relative base for Pages; absolute og:image at deploy time
├── assets/images/       social preview image
├── data/                the writing, as plain ES modules
│   ├── places.js          001 · six places in the Mohalla
│   ├── actions.js         002 · ten bricks of ईंट का हिसाब
│   ├── scene.js           skyline geometry for 001 and 003
│   ├── stories.js         004 · six films
│   ├── questions.js       005 · four questions and their echoes
│   └── fragments.js       006 · words, fragments and marks
├── scripts/
│   ├── main.js            boots each movement in isolation
│   ├── components/        one module per movement, plus Navigation, StoryOverlay and Atmosphere (rooms)
│   └── lib/               dom helpers · motion (rAF loop, reveals) · wall geometry · sound
├── styles/              base.css for tokens, one sheet per movement, devanagari.css last
└── docs/screenshots/
```

- **Movements are independent.** Each exports an `init*()` function, and `main.js` runs them one at a time inside `try/catch`, so a failure in one section cannot take down the rest.
- **Scroll is read once and written once per frame.** Scenes register with `onScene()`. A single `requestAnimationFrame` loop measures every scene first, then writes one custom property per scene (`--p`, `--sp`, `--tp`); CSS does the choreography.
- **Rooms are one attribute.** `Atmosphere.js` watches for `[data-room]` sections crossing the middle of the screen and sets `html[data-room]`. The CSS and the sound respond to it; no section needs to know about any other.
- **Every wall comes from `lib/wall.js`,** which holds the running-bond geometry, per-brick clay tones and the interactive slots.
- **Content is data.** Rewriting a story means editing `data/`, not the components.

## Local Development

Requires Node.js 20.19+ or 22.12+.

```bash
git clone https://github.com/tanmaytyagii/karm.git
cd karm
npm install
npm run dev        # http://localhost:5173
```

```bash
npm run build      # production build → dist/
npm run preview    # serve dist/ at http://localhost:4173
```

## Deployment

[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) builds the site and publishes `dist/` to GitHub Pages on every push to `main`. It can also be run by hand from the Actions tab.

One-time setup: **Settings → Pages → Build and deployment → Source: GitHub Actions**.

The build uses relative asset paths, so it works under any repository name. The workflow passes the Pages URL to the build, which uses it for the absolute social-preview image URL, `og:url` and the canonical link. Local builds leave the canonical out rather than guess an address.

## Accessibility

- **Semantic controls.** Hotspots, bricks, places, stories and answers are native `<button>`s with Hindi labels. A skip link leads straight to the main content.
- **Keyboard.** Tab reaches every interactive element, and Enter or Space activates it. In the story player, ← and → step between beats. In the कहानियाँ index, ↑ and ↓ move between films, and Home and End jump to the first and last.
- **Escape** closes the story player, closes the mobile menu, and shuts an open brick in ईंट का हिसाब, in every browser, including Safari, which does not focus a clicked button.
- **Focus handling.** Opening a story moves focus to its close button and keeps Tab inside the dialog. The page behind becomes `inert` and stops scrolling, and on close, focus returns to whatever opened the dialog. The same return happens for the mobile menu and for bricks. When a control disappears because you used it (a दीवार brick, an आईना answer), keyboard focus moves to the next brick or stays inside the mirror; a mouse click never moves focus or the page. Focus rings appear for keyboard users only, via `:focus-visible`.
- **Accessible overlays.** The story player is a `role="dialog"` with `aria-modal` and a labelled title. Changing content (story beats, the ईंट का हिसाब panel, the mirror, the दीवार fragments) is announced through `aria-live`, and toggles report their state with `aria-pressed` and `aria-expanded`. Purely decorative layers are hidden from assistive technology.
- **Language.** The document is `lang="hi"`. The few Latin words (KARM, the section numbers) are marked `lang="en"`, so each script is pronounced correctly and typeset by the right rules.
- **Contrast and targets.** Text that instructs or reports progress meets WCAG AA contrast at 4.7:1 on the page ground; only decorative numbering stays faint. On touch screens every control in the navigation is at least 44px.
- **Reduced motion.** With `prefers-reduced-motion`, the wall arrives already built and the hero simply dims instead of pushing the camera through it. Both hero lines appear together. Dust, drift, parallax, mist, the tumbling brick and smooth scrolling are off. The long scroll scenes are shorter, the rebuilt wall appears at once, and overlays and pauses resolve without transitions.
- **Mobile.** The Mohalla hotspots become a list of full-width buttons, and the menu is a full-screen panel that closes with Escape.

## Performance

- **No framework runtime.** The entire experience ships as about 13 KB of JavaScript and 13 KB of CSS, gzipped.
- **No image or audio assets in the experience.** Every building, brick, lamp and window is CSS. The film grain is a tiny inline SVG, and sound is synthesised.
- **One animation loop.** Scroll listeners are passive and only schedule a frame. Scenes that are off screen are skipped, and a scene writes only when its progress actually changes. All scenes are measured before any is written, so a frame never forces a second layout.
- **Styles scoped to what moves.** The hero's camera progress is a registered, non-inheriting property, written only onto the few elements that move with it, so scrolling never restyles the wall's hundred bricks.
- **Compositor-friendly motion.** The movement itself is `transform`, `translate`, `scale`, `rotate` and `opacity`, never layout properties, with `will-change` limited to the layers that move constantly.
- **Measured.** Over the same full-page scroll in Chrome, this version performs about 30% fewer layouts, spends about 11% less time recalculating style and 17% less time in script than the previous release, while drawing more.
- **Observers, not polling.** Reveals, the current-section indicator and the navigation's final fade all use `IntersectionObserver`.
- **Rebuilds only when needed.** Walls re-lay on a debounced resize and once after web fonts load. The hero re-lays only when the width changes meaningfully, so a mobile browser's collapsing address bar never rebuilds it.
- **Fonts.** The font server is preconnected, fonts use `display=swap`, and only the nine faces actually used are requested.
- **Sound is cheap.** Short sounds play from one shared bed of noise at a random offset instead of generating a new buffer each time.

## Sound

The soundscape is **generated programmatically** with the Web Audio API and needs **no audio files**:

- wind through the lane: looped, filtered noise with a slow sweep
- a distant city floor: a low 47 Hz sine
- now and then, something far away: a knock, a low bell-like tone, or a shutter rolled down two lanes over
- a scrape when a brick is drawn out of its course, a thud when one lands or falls, and a soft tick for interface moments

Sound is **muted by default** and entirely **user-controlled**. The audio context is created only when you first press **आवाज़**, so nothing ever autoplays. The level fades in and out rather than cutting, drops in the mirror, and falls almost silent in the final room, where the distant sounds stop. The button reports its state to assistive technology. Nothing in KARM depends on hearing it.

## Screenshots

![KARM on a phone: the hero, the Mohalla index, and a story open](docs/screenshots/09-mobile.jpg)

Every image in this README is captured from the production build and lives in [`docs/screenshots/`](docs/screenshots). Replace a file in place to update it.

## License

[MIT](LICENSE) © 2026 Tanmay Tyagi
