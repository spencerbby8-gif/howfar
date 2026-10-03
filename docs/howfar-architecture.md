# how far — app architecture · v6 plan

**Premise:** the UI chassis is **locked** = the ReplyMate kit exactly as it runs in
`howfar-app-v5.html` (colors, buttons, fields, rows, toggles, dialogs, bubbles, splash).
The **architecture** underneath it is how far's own, from `how-far-spec.txt` — not
ReplyMate's. This document maps one onto the other. Nothing here changes a single
ReplyMate token.

> **v7 build note (owner, 2 Oct 2026):** "always use ReplyMate UI" is a standing rule.
> v7 (`howfar-app-v7.html`) renders this architecture with **kit components only** —
> no pools-of-light canvas, no strata color coding, no custom ring: the ground is the
> standing status line + near-you rows; strata are plain dim band labels; the drop is a
> card + primary button you hold. The only non-kit visual is the how far logo.
> Verified by a 66-check browser test suite (`.testenv/test.js`) + a computed-style
> audit confirming every token matches the ReplyMate repo values.

> **v8 REPLAN (owner, 2 Oct 2026):** owner judged the place-memory product "boring and
> totally unuseful" and asked for a replan around what people hate about IG/TikTok/FB/X.
> Research (cited in chat, 2 Oct): users hate feeds/algorithms, ads, performative
> pressure, addiction mechanics, metrics and toxicity; behavior is moving to small
> private circles and voice notes (7B/day on WhatsApp, 84% of Gen Z). **Decision (owner,
> via ask_user): Direction A — the check-in app.** v8 (`howfar-app-v8.html`) flips the
> loop from places→strangers to people→check-ins:
> - the circle (≤12, small on purpose) replaces near-you places
> - tap = bare ping ("how far?"), hold = 15s voice, release = sent, no retakes
> - **one how-far at a time** — while yours waits, the composer is gated (no piles)
> - no read receipts, no last seen, no typing, no online status — **it waits**
> - answers-not-likes survives: answer links to the check-in it answers; the only push
>   is "X answered your how far" (silent under ghost mode)
> - strata survives as relationship depth: today / this week / this month free,
>   earlier / last year / way back behind hold-to-dig, bedrock = "Two years back.
>   Then you drifted — the ground kept it anyway."
> - around = a count, never a location; my-circle stats, no follower counts ever
> - sim: responsive people (tunde, kelechi, spencer) answer your pending check-in
>   ~9s later — the app feels alive without a feed; amara/ifeoma/chidi answer when
>   they answer
> Verified: 103-check browser suite (`.testenv/test-v8.js`) + style audit
> (`.testenv/audit-v8.js`) — all green, 100% ReplyMate tokens.
> v7 (place-memory) remains in the workspace as a complete, tested reference build.

---

## 0 · ground rules (spec §02, §06, §08 — structural, not style)

The five primitives. If a screen violates one, the screen is wrong, not the rule.

| # | Primitive | Architectural consequence |
|---|-----------|---------------------------|
| P1 | **Place is the atom** | No profiles, no people lists, no DMs. You carry **places**. Every list in the app is a list of places. |
| P2 | **Presence-gated write** | You can only drop **while standing in the place**. Every write path checks standing. Location never leaves the device. |
| P3 | **Depth, not recency** | Content is ordered by **age-strata**. Older = deeper = deliberate friction (dig). No feeds, no ranking. |
| P4 | **A count, never a coordinate** | Liveness is an integer. "6 here right now." Never who, never where. |
| P5 | **Local-first** | A drop always succeeds on device. (Prototype: in-memory; production: SQLite source of truth.) |

And the hard refusals (spec §08): follower counts · infinite scroll (every place has a
bottom — bedrock) · algorithmic feed · live location · red badges · likes · editing or
filters · sharing out.

**There is no feed, no tabs, no profile grid. Every screen is a view of ground.
The only primary action in the entire app is HOLD TO DROP.**

---

## 1 · navigation model

Single stack, no tabs, no drawer (spec §06 — and the ReplyMate chassis is a single
activity stack, so they agree for free).

```
splash
  └── 01 the ground  ..................... home
        ├── tap a pool / a "near you" row ──▶ 02 a place
        │      ├── Live  ──▶ 05 live
        │      ├── Info  ──▶ place dialog
        │      ├── tap a voice ──▶ play · answer dialog
        │      ├── dig ──▶ deeper strata (in-screen, deliberate friction)
        │      └── [standing here] hold-to-drop ──▶ 03 drop
        ├── hold-to-drop bar (drops at the place you're standing in) ──▶ 03 drop
        ├── ⚙ ──▶ 06 settings
        │       └── My ground ──▶ 04 my ground ──▶ 02 a place
        └── "near you" rows (below the fold — secondary access to the same places)

03 drop:  hold ring ≤ 15 s → release = it sinks → back to the place, thread top,
          chip "✓ sunk · it waits for whoever stands next"
```

Only one thing in the whole app pushes a notification: **"Someone answered you at
⟨place⟩"** (plus "one year ago, you stood here" anniversaries) — and only for places
you've seeded yourself.

---

## 2 · the screens

### 00 · splash — keep v5 exactly
ReplyMate's splash glow + ring, how far logo, "the ground remembers", auto-enter.

### 01 · the ground — REPLACES v5's inbox-list home
v5's home was ReplyMate's contact inbox. The spec's home is a **surface**: *"A living
topographic surface, not a map with pins. Places are pools of light. … Bottom: one
'hold to drop' bar. Nothing else."*

Chrome (100% ReplyMate kit):
- Header: logo + **how far** 24sp bold + sub 12sp dim + ⚙ (unchanged from v5)
- Status line (12sp, accent): **"● you're standing in rumuokoro junction"** —
  the presence engine readout. Green = GPS on; amber = "location is off — tap to
  enable" (v5's honest status behavior, kept)
- Bottom: **one** full-width button — the **hold-to-drop bar**. `btn_primary` anatomy
  (52dp accent pill), but it *holds*: filling as you hold, and only a full hold
  commits. The single primary action of the entire app lives here.

Content (the only non-ReplyMate zone — content, not chrome):
- **Pools of light**, not pins. Size = moment volume. Pulse = how alive the surface
  is right now (place being dropped into → faster pulse). No labels until tapped;
  tap a pool → its place.
- Your position = one halo point (flare). Never shared, never drawn for anyone else.
- **Return hook:** a place you've seeded carries a thin flare ring — "your mark grew"
  when someone answered.
- Empty state (spec §03): a quiet surface and **"You're the first."** — an invitation,
  not an error.

Below the fold (recommended, see decision D1): a plain **"near you"** section using
the ReplyMate row anatomy — place · "● 6 here now · a voice 4 min ago · 0:12" · › —
the linear, screen-reader-friendly mirror of the same pools. Same data, second door.

### 02 · a place — REPLACES v5's chat thread
The conversation chassis stays (it's the best screen in the kit); the *thread model*
changes from chat to **strata** — *"a vertical cross-section of time."*

Chrome (ReplyMate conversation anatomy, unchanged):
- ‹ back (accent 28sp) · place name 18sp bold · sub = **"6 here right now · a count,
  never a coordinate"** · accent actions: **Live** (→ screen 05) and **Info** (dialog:
  moments, deepest, "your position never leaves this phone")
- **No search field.** Voices aren't text (D3) — digging is the discovery.

Content — the strata thread:
- Voices render as v5's voice bubbles (in = a voice, left `#1C2330`; out = you, right
  `#1E3250` + 48px margin; ▶ + waveform + 0:12; 11sp meta). **They already look right.**
- Bubbles are grouped under **band headers** — the kit's dim-label pattern:
  `SURFACE · 0–1 H`, `FRESH · 1–24 H`, `RECENT · 1–7 D`, `SETTLING · 7–30 D` …
  A thin stratum-colored rail on the header is the only place strata color appears.
- **Surface → settling load on open.** At the sediment boundary the free scrolling
  **stops** and a friction bar appears: *"how far down? · sediment is months deep"*
  — **hold (or pull, with resistance) to dig.** One band loads at a time. Friction is
  the product (spec §05): finding something old must feel like discovery.
- **Echo finds:** a voice first revealed by digging carries the volt chip
  `◈ echo · found 3 months down`. Found is a *state*, not a type.
- Deeper bands render progressively quieter — dimmer, sparser — until:
- **Bedrock is the floor.** "Two years down. Four voices." + anniversary chip
  "one year ago, you stood here." No infinite scroll. The bottom is the point.

The composer area (bottom card) is **conditional** — this is the biggest change:
- **Standing in this place** → the card holds ONE control: the hold-to-drop bar
  (48–52dp, `btn_primary` anatomy, hold-to-commit). No text input, no ＋, no ✨.
- **Not standing here** (browsing from the ground / my ground) → no control at all,
  just the honest accent status line: *"you're not standing here — it only works
  where you are."* Presence-gated write, said out loud.

**Answering** (likes are refused; answers are the currency): tap a voice → the kit's
dialog: **▶ Play · ↳ Answer · Cancel**. Answer (standing here only) → the drop ring
with the tapped voice as parent → sunk → both voices carry the chip `an answer`.
This is the only push in the app.

### 03 · drop — REPLACES v5's start/stop record screen
The spec is stricter than v5 was: *"Hold anywhere on the ring; it fills over 15
seconds. Release and the moment physically sinks."* One gesture, capture is final.

- Full-screen: place name + green "● you're standing in rumuokoro junction"
- The ring (content): hold anywhere; fills over 15 s; timer counts; release =
  **it sinks** — sink animation, ripple, done. Chip `✓ sunk · it waits for whoever
  stands next` lands in the thread. The copy underneath never changes:
  *"let go and it sinks. it waits for whoever stands next."*
- **No review step, no discard, no retakes** (D2). Mistouch guard only: a release
  under 1 s drops nothing — that's not a retake, it's an accident.
- The moment is written locally (P5), the place's count + pool grow, band = surface.

### 04 · my ground — v5's my-places, upgraded to spec
ReplyMate rows are exactly right here; add the spec's shape around them:
- Header: "‹ my ground" + sub "everywhere you've left something"
- Stats trio (spec §06): **places / moments / deepest** — no follower number exists
  anywhere, for anyone
- Rows: place · "9 moments · deepest 2 y · someone answered you" · ›
- (Later/production: the terrain-of-contours view — Phase 3 in the spec's build
  order. Rows first; they're the kit and they scan perfectly.)

### 05 · live — NEW screen (v5 only had a toast)
Pushed from a place's **Live** action:
- The number, huge: **"6"** — *"here right now"* — and the chip "a count, never a
  coordinate"
- Below: the place's own history ticking — kit rows, each with a stratum dot,
  aging as they cool: "someone just dropped 12 seconds · now" → … → "a voice settled
  into sediment · 1 d". New rows arrive in surface-white and dim as they age.
- Deliberately absent: who, typing indicators, read receipts, "X is online."

### 06 · settings — v5's screen, trimmed to what's spec-legal
The row/toggle/picker architecture stays (it's generic and it's the kit). Content:
- **My ground** → screen 04
- **Place sensing:** Location precision (block · street · exact — the ✓ picker) ·
  Standing alerts toggle
- **Privacy:** Ghost mode ("invisible in the live count") · Live counts ·
  Data & storage ("voices stay on this device") · Notifications: *"only places
  you've seeded — answers and anniversaries. that's all there will ever be."*
- **About**

---

## 3 · objects (prototype data model)

```
place    { id, name | null ("unnamed place" until crowd-confirmed), pool {x, y, size,
          pulse}, moment_count, live (int), seeded (bool) }

moment   { id, place_id, dir: in|out, dur ≤ 15 s, created_at,
           band (DERIVED from age — never stored; spec §05),
           parent_id | null (an answer), found (bool — revealed by digging) }

standing { place_id | null, precision: block|street|exact }
```

Depth is a pure function of age with configurable thresholds — the spec's exact
design: when the thresholds tune, nothing migrates. Band recompute is a sweep, not
a scan.

---

## 4 · the seven core flows

1. **Arrival** — geofence fires → ground status line "you're standing in X" → the
   pool brightens → tap → place opens at the surface band.
2. **Drop** — standing → hold bar → ring fills ≤ 15 s → release → sink → moment at
   surface, pool grows, thread tops with `✓ sunk`.
3. **Dig** — place → free scroll ends at sediment → friction bar → hold/pull → band
   loads with a downward sweep → its voices are echo-found (volt) on first reveal →
   bedrock is the floor.
4. **Answer** — standing → tap a voice → dialog → answer → ring → sink → both voices
   linked `an answer` → the parent's author gets the only push: "Someone answered
   you at ⟨place⟩."
5. **Return hook** — you pass a place you seeded → its pool wears a flare ring; if
   someone answered, the row says so.
6. **Anniversary** — "one year ago, you stood here" surfaces in bedrock + as the
   second (and last) notification type.
7. **First** — anywhere empty: "You're the first." Never an error state.

---

## 5 · color discipline — chassis vs content

| Layer | Tokens | Where |
|---|---|---|
| **Chrome (locked)** | ReplyMate's: `#0D1117` bg · `#161B22` card · `#0A84FF` accent · `#AAB2BD` dim · `#1C2330`/`#1E3250` bubbles · fields, strokes, radii | Every header, button, field, row, toggle, dialog, status line |
| **Content — strata** | The spec's 7-band spectrum `#FFF3D0 → #3E4E60` | Band-header rails, stratum dots, play buttons by age, live ticker aging. Content semantics — never chrome |
| **Brand — flare** | `#FF4A1C` | The logo, the you-are-here point, the seeded-place ring. "Alive, right now" — nothing else |
| **Brand — volt** | `#C6FF3D` | Echo finds, `✓ sunk`. "Found / committed" |

The rule that keeps it from drifting back to "AI soup": **chrome is never strata-colored,
and content is never chrome-colored.** ReplyMate's blue stays the only interactive color.

---

## 6 · what gets deleted from v5 (the ReplyMate-isms)

| v5 (ReplyMate architecture) | Verdict | Replaced by |
|---|---|---|
| Home = contacts-inbox list of places | **replaced** | The ground: pools of light + standing status + one hold-to-drop bar (near-you rows below the fold, secondary) |
| Place = chronological chat thread | **replaced** | Strata bands with a dig boundary at sediment and bedrock as the floor |
| Text composer + ➤ send note | **deleted** (spec: voices, sounds, 15 s) | The single hold-to-drop bar, presence-gated |
| "＋ Heard" manual incoming log | **deleted** | Nothing is logged by hand — presence-gated writes only |
| Start/stop recording + review + discard | **replaced** | Hold the ring; release = it sinks. Capture is final |
| Search fields (home + place) | **deleted** (D3) | Digging is the discovery; voices aren't text |
| Draft chips "waiting to sink" | **kept, renamed** | The honest-chip pattern is pure ReplyMate — `✓ sunk` is its how far meaning |
| Live as a toast | **replaced** | Screen 05, pushed from the place header |

---

## 7 · prototype build order (v6)

Per the spec's own sequencing (§13: place-loop before map):

1. **A place** — strata bands, voice bubbles, dig boundary, echo finds, bedrock
2. **Drop** — hold ring, release = sink, mistouch guard, thread chip
3. **The ground** — pools, standing status, hold bar, near-you rows, "you're the first"
4. **My ground** — stats trio + rows + seeded markers
5. **Live** — the count + aging ticker
6. **Settings** — trim to spec-legal rows
7. **Answers** — voice dialog, parent links, the one push (simulated)

All of it on the v5 chassis — zero visual tokens change.

---

## 8 · decisions — LOCKED (owner, 2 Oct 2026)

- **D1 · the ground:** ✅ pools of light + "near you" rows below the fold
- **D2 · drop finality:** ✅ release = sunk — no review, no retakes (mistouch guard < 1 s only)
- **D3 · search:** ✅ removed everywhere — digging is the discovery
- **D4 · text notes:** ✅ audio-only — voices and sounds, 15 seconds each
