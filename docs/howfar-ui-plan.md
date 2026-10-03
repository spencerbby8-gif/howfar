# how far × ReplyMate — the UI fusion plan

> **v4 revision (owner direction, 2026-10-02):** the ratio is inverted. ReplyMate's UI is the **base** —
> kept exactly: bg #0D1117, card #161B22, field #11161D, bubble-in #1C2330, stroke #2A3139, text #fff,
> dim #AAB2BD, radii 14/12/10/14, rows, composer card, state chips, ghost buttons. how far is the **touch**:
> flare #FF4A1C where ReplyMate was blue, volt #C6FF3D where it was green, out-bubble re-tinted
> #1E3250 → #2B170D, the orbit mark, Unbounded for display (lowercase always), Plex Mono for all
> labels/status/timestamps, strata only as small chips/dots, and the brand-site opening animation
> (pulse rings + parallax volt echo + wordmark) as the app's boot. Visualized in `howfar-app-v4.html`.
> The fusion plan below is kept for reference but superseded where it conflicts.

**Date:** 2 Oct 2026 · **Inputs:** `spencerbby8-gif/ReplyMate` (cloned at HEAD, UI read
from `res/layout/*`, `res/values/colors.xml`, `res/drawable/*`, `ui/Ui.java`,
`ConversationActivity.java`) · `how far spec` (Drive) · Spencer's brand zip · mockups v1/v2.

**One line:** ReplyMate is the *skeleton* — its layout anatomy, spacing, radii, row
patterns, state chips. how far is the *body* — identity, palette, type, strata, motion.
Nothing of ReplyMate's blue, its buttons, or its AI-draft machinery survives.

---

## 1. The token map (ReplyMate → how far, exact)

| ReplyMate token | Value | how far token | Value |
|---|---|---|---|
| `bg` | `#0D1117` cool | `void` | `#0A0908` warm-black |
| `card` | `#161B22` | `ink` | `#141210` (sheets) · `stone #221E1A` (rows) |
| field fill / stroke | `#11161D` / `1dp #2A3139` | field | `#171310` / `1dp rgba(bone,.09)` |
| bubble in | `#1C2330` | **a voice** (left) | `#1A1713` + `rgba(bone,.08)` hairline |
| bubble out | `#1E3250` blue-tint | **your moment** (right) | `#251109` + `rgba(flare,.22)` hairline |
| `accent` | `#0A84FF` | `flare` | `#FF4A1C` — alive, now, surface |
| — | — | `volt` | `#C6FF3D` — the echo, found, deep |
| `text_primary` | `#FFFFFF` | `bone` | `#F1EBE0` |
| `text_dim` | `#AAB2BD` | `dust` | `#8A8076` |
| green `#3FB950` | success | `volt` | "sunk" ✓, echo found ◈ |
| red `#FF6B6B` | error | kept | off-product failures only, never social |

**Adopted verbatim:** bubble radius **14dp** · cards **12dp** · fields **10dp** ·
buttons **14dp** · message text **15sp** · row anatomy **16sp title / 13sp sub / ›
chevron / 14dp vertical pad / 1px hairline divider** · title+sub header (24sp bold +
12sp dim) · primary pill (solid accent) + ghost (transparent, hairline) · centered dim
empty state · status line above the composer card · 48dp opposite margin on outgoing
bubbles.

**Typography swap:** system sans everywhere → Unbounded (display, lowercase, headers) ·
Manrope (body, bubbles) · IBM Plex Mono (chips, depth, time, hex — everything ReplyMate
used its dim grey for, how far says in mono).

---

## 2. Screen-by-screen fusion

### 00 · boot — from ReplyMate's splash
ReplyMate: radial `splash_glow` + thin `splash_ring` around a hero icon.
how far: **the orbit mark** inside a flare glow, volt echo drifting, one settling ring,
wordmark, and the onboarding line: *"how far back does your city go?"* — one primary
pill: **enter the ground**. Ghost link: *why it only works where you are.*

### 01 · the ground — from ReplyMate's home
ReplyMate home anatomy: title + dim sub, one full-width primary action, list, centered
empty state.
how far: header (*how far / the ground · around you*), the map of pools of light, and
**one full-width primary action: HOLD TO DROP** (a pill you press-and-hold — the button
fills volt as you hold, sinks when you let go). Empty-state variant when nothing is
nearby: *"nothing here yet. you're the first."*
**Refused from ReplyMate home:** the search field (nothing to search — the ground is
spatial), the "＋ new" create button (you don't create places, you stand in them).

### 02 · a place — from ReplyMate's conversation ← the heart of the fusion
ReplyMate conversation anatomy: header (‹ back, **name bold + dim sub**, accent
actions) → scrollable thread of in/out bubbles → accent status line → **bottom composer
card**.
how far: header = ‹ + **place name + "6 here right now"** (dim, mono) → the thread IS
THE STRATA — but as bubbles:
- **left = a voice** (stone bubble, play button in the stratum colour of its age,
  waveform, `0:15` mono) — never a name, just *"a voice, four minutes ago"*
- **right = you** (flare-tinted bubble, `48dp` opposite margin, exactly ReplyMate's
  outgoing alignment) — *"you · yesterday"*
- **state chips** (ReplyMate's ✓ copied / ✓ edited honesty pattern) become strata
  chips: `surface · 4m` → `settling · 3w` → **`◈ echo found · 3 months down`** (volt,
  glowing) → `bedrock`
- the accent **status line above the composer** becomes the depth line: *`−3 months ·
  quieter down here`* in mono, changing as you scroll
- the **composer card** keeps its exact ReplyMate anatomy (card bg, 12dp pad, 52dp
  control height) but holds ONE control: **hold to drop** — the app's only primary
  action. No text input. No "＋ them". No send arrow.
- dig handle sits at the card's top edge ("how far down?") — the deliberate-mode fix so
  digging never collides with pull-to-refresh.

### 03 · drop — from ReplyMate's voice + draft honesty
The hold-to-fill ring (0:15). ReplyMate's honest state chips drive the copy:
`recording · it only works where you are` → `sunk · it waits for whoever stands next`.
Ghost-hairline **cancel** only — no retakes (capture is final), no ✨, no filters.

### 04 · my ground — from ReplyMate's rows
Exactly `Ui.row()`: title / sub / ›, hairline dividers, 14dp pads — one row per place
you've seeded: **rumuokoro junction** / *9 moments · 6 here now* / ›. Recency dot in
stratum colour on the left. Stats bar in Unbounded. Bottom line stays:
*no follower counts. not anywhere. ever.*
**Refused:** Edit actions (moments are final), any people rows.

### 05 · live — from ReplyMate's status philosophy
The breathing count. The ticking ground = ReplyMate's honest status lines, aged in
stratum colours. The only push: *"someone answered you at rumuokoro."*

---

## 3. What ReplyMate patterns are refused outright

| Refused | Why |
|---|---|
| search fields | the ground is spatial, not textual |
| Edit / Audit header actions | capture is final; nothing is rankable or auditable by users |
| ✨ Generate / ＋ intentional draft / approve-first flow | there is no AI layer and no sending — you drop, the ground holds |
| "＋ New contact" pattern | no people creation; places emerge from standing there |
| multi-button composer | one action. hold to drop. |
| read receipts / delivery states on people | presence is a count, never a person's state |
| blue `#0A84FF`, cool greys | the identity is warm: soil, not terminal |

## 4. What how far adds that ReplyMate has no equivalent for

The strata spectrum (load-bearing colour = age) · the depth gauge in mono · the dig
gesture and its friction · the sink animation (weight, gravity, finality — the one
place motion is allowed to *feel* like something) · pools of light instead of a list ·
the orbit mark with its drifting volt echo · the "you're the first" empty ground.

## 5. Build note

The visual language is now fully specified: **v3 mockup** (`howfar-app-v3.html`) shows
the fusion on six screens. When we build the real app (React Native/Expo per the spec),
these tokens become the theme file 1:1 — every ReplyMate dimension above is already in
dp/sp, so the translation from plan to code is mechanical.
