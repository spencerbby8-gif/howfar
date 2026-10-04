# HowFar — Architecture, System Specs & Codebase

> **"Familiar body, different soul."**  
> A premium social media platform engineered with immediate, tactile interactions and a physics-based distance engine. Built to capture Gen Z engagement without algorithmic feeds, vanity counters, or toxic mechanics.

---

## 1. Executive Summary & Design Law

HowFar is built around one fundamental interaction principle:

### **"Content is an object you handle."**

Instead of static button tapping, every core action is a physical manipulation of the content itself:

| Gesture | Action | Destination / Behavior |
|---|---|---|
| **Drag post toward center** | Opens comments **behind** the card | Post docks (`scale(0.92)`, `blur(4px)`), comments cascade with 40ms stagger |
| **Double-tap** | Fires private **Flare** | Warm radial ignition burst; records creator warmth without public counts |
| **Flick horizontally** | Pass / Curate feed | Dismisses card with spring physics |
| **Long-press** | Content Menu | Mute circle, share distance receipt, inspect provenance |
| **Pull story down** | Fold-back exit | Story frame smoothly collapses back into the avatar circle (420ms) |
| **Touch & hold on story** | Anchor (Freeze) | Freezes story progression; holding 600ms ignites a flare |
| **Flick left rail up/down** | Jog between tabs | Spring-loaded dial navigation without precision aiming |
| **Tap reaction bubble** | Picture-in-Picture (PiP) | User's video reaction plays synced over the post |

---

## 2. Navigation — The Left Edge Rail

No bottom navigation bar. Content runs full-screen, edge-to-edge.

```
│ ⌂  │ Home
│ ▶  │ Now (Live distance feed)
│ ⊕  │ Camera (Photo still / 15s moment)
│ ◯  │ Alerts (Calm milestones, soft dot)
│ ▪  │ Profile (The Ground & Reach Map)
│ ›  │ Collapse Chevron
```

* **Glass Rail on Left:** 5 primary tabs housed in a translucent glassmorphic bar (`#121820EB`, `backdrop-filter: blur(16px)`).
* **Orbit Ring:** Active tab wears the animated HowFar orbit ring.
* **`>` Collapse Button:** Collapses the rail to a slim 20px edge handle with `<`. Edge-swiping or tapping the handle restores the rail.
* **Jog Dial:** Swiping up/down on the rail jogs between tabs.
* **Auto-Immersion:** Entering the **Now** feed automatically collapses the rail for full-screen focus.

---

## 3. Flagship Features

### 3.1 Drag-to-Center Comments (Behind the Content)
* Dragging a feed post up or toward the center docks the card to the top with `scale(0.92)` and `blur(4px)`.
* The comments panel is revealed **behind the card**, cascading in with 40ms stagger.
* Swiping back down smoothly restores the card to full size.

### 3.2 Video Comments & Floating Reaction Bubbles
* **Floating Reaction Bubbles:** Face bubbles float up along the right edge of posts (e.g. `@tunde` laughing 😂, `@kelechi` 🔥).
* **Picture-in-Picture (PiP) Playback:** Tapping any bubble launches a synced PiP video overlay directly on top of the post.
* **Record Reactions:** Tapping `+ Video` in the comments composer launches a camera mode with the original post docked above it for synchronized reaction capture.

### 3.3 The Story System (Bloom, Fuse, Drift, Comet)
* **Orbit Handoff (520ms):** Tapping an avatar circle expands it smoothly into the full story frame.
* **The Fuse:** Thin halo circle timer for moments. **Photo stills have NO fuse** (48-hour kept moments).
* **The Drift (600ms):** Story segments drift seamlessly into one another without hard cuts.
* **Shooting Comet Reply:** Voice replies depart across the screen as glowing shooting comets landing directly at the creator's avatar.

### 3.4 Now Tab — The Distance Engine & Live City Feed
* Immediate answers to *"What is happening near me right now?"*
* **Near (< 50 km):** Hyperlocal live moments (*"📍 port harcourt · 2 min ago · 1.4 km"*).
* **Far (> 500 km):** Global moments ordered by distance traveled (*"london · 8h ago · 5,266 km"*).
* **Zero algorithmic ranking:** Distribution follows pure geographical and temporal physics.

### 3.5 Profile, The Ground & Reach Map
* **Reach Map:** Visual arc canvas mapping everywhere your posts have traveled (e.g. Port Harcourt → Lagos → Accra → London).
* **The Ground (Strata Archive):** Geological layers of past posts (*Today / This Week / This Month / Deep Ground*).
* **Private Stats:** Total KM Traveled, Cities Reached, Flares Kept — strictly **NO follower counts, NO public like counts**.

---

## 4. Design System & ReplyMate UI Kit Tokens

The UI strictly adheres to the authentic ReplyMate kit:

* **Background:** `--bg: #0D1117`
* **Cards:** `--card: #161B22` (`r12` / `r14`)
* **Stroke / Borders:** `--stroke: #2A3139` (1dp hairline)
* **Input Fields:** `--field: #11161D` (`r10` / `r14`)
* **Accent Brand:** `--accent: #0A84FF`, `--accent-press: #0871d8`
* **Motion Accents:** `--flare: #FF4A1C` (ignitions), `--volt: #C6FF3D` (live signals)
* **Chat Bubbles:** Incoming `--bin: #1C2330`, Outgoing `--bout: #1E3250`
* **Send Button:** Exact ReplyMate `56x48px` pill button with bold `➤` arrow (`btn_manual` from `activity_conversation.xml`).

---

## 5. Repository Structure

```
├── README.md                          # Comprehensive specification & guide
├── docs/
│   ├── howfar-v3-architecture.md      # Plan of Record for v3
│   ├── how-far-spec.txt               # Product spec, ethics & copy
│   ├── howfar-architecture.md         # Architecture history (v1-v8)
│   ├── howfar-sky-concept.md          # Sky prototype & animation design
│   ├── howfar-spec-audit.md           # Product audit
│   └── howfar-ui-plan.md              # UI interaction map
├── prototypes/
│   ├── howfar-app-v10.html            # Latest v10 deck prototype (passing test suite)
│   ├── howfar-app-v9.html             # Current v3 flagship prototype (45/45 Green)
│   ├── howfar-sky-v1.html             # Sky animation prototype (64/64 Green)
│   ├── howfar-app-v8.html             # v8 check-in archive
│   ├── howfar-app-v7.html             # v7 strata archive
│   └── howfar-app-v5.html             # Approved ReplyMate chassis baseline
├── tests/
│   ├── test-v10.js                    # Automated test suite for v10
│   ├── test-v9.js                     # Full automated Puppeteer suite for v9 (45 checks)
│   ├── test-sky.js                    # Automated test suite for Sky animations (64 checks)
│   ├── test-v8.js                     # Test suite for v8
│   └── test-v7.js                     # Test suite for v7
└── brand/                             # Brand assets, React app & SVG components
```

---

## 6. Running Automated Tests

To run the automated browser test suite with Puppeteer:

```bash
cd tests
node test-v9.js
```

All 45 automated checks test:
- Left edge rail collapse, expand, and auto-immersion.
- Stories row orbit arcs and Photo Still (no-fuse) vs Moment (halo fuse).
- Feed cards, receipt formatting, and double-tap flare bursts.
- Drag-to-center comments overlay and card docking physics.
- Floating reaction bubbles and PiP video playback.
- ReplyMate `➤` send arrow and `+ Video` reaction composer.
- Responsive layout across 480px, 360px, and 320px viewports.
