# how far — v3 architecture
### familiar body, different soul · premium tier · 2 Oct 2026

---

**Owner decision log (2 Oct 2026, verbatim intent):**
- the sky-as-home was "kinda childish" and too complex — cut as the home, kept
  as the story experience
- "how far should work like other social media apps but the architecture
  would be sooo different and very easy to navigate and less complex"
- "I want to build something premium tier, something that would fastly pull
  gen zs into the app just like tiktok"
- "to open comments section you'll drag and slide your finger towards the
  center of your phone — that's tuff" → **flagship gesture, locked**
- vocabulary: light-language inside stories only; plain words everywhere else
- pictures: stills with no timer, 48h — locked
- **doc first, then build**

---

## 0 · the one design law

**Content is an object you handle.**

Every primary interaction is a physical manipulation of the content itself —
not a button press:

| gesture | action | where |
|---|---|---|
| **drag the post toward the center** | comments open **behind** the card | feed, Now |
| double-tap | flare (the like — private, no count) | feed, Now |
| flick the card away | pass (you curate your own feed) | feed |
| long-press | menu (save · send · mute) | feed, Now |
| pull the story down | it folds back into its avatar circle | stories |
| touch and hold | anchor (freeze) → hold 600ms = flare | stories |
| swipe horizontally | move between people | stories |
| pinch camera thumbnail → post | container-transform publishing | camera |
| edge-swipe right / "<" | expand the rail | anywhere |
| flick the rail down / up | jog to next / previous tab | rail |
| tap a face bubble | reaction plays picture-in-picture over the post | comments |

One rule, learned in ten seconds, applied everywhere. Nobody else has this.

## 1 · navigation — the edge rail (owner, 2 Oct: "tabs by the left side… '>' to close… slide gestures… people are too lazy")

No bottom bar. Content runs full-height.

```
│ ⌂  │
│ ▶  │      (content,
│ ⊕  │       full width)
│ ◯  │
│ ▪  │
│ ›  │   ← collapse chevron
```

- **slim glass rail** on the left: five tabs stacked — icon + small label —
  the active tab wears the how far orbit ring. Semi-transparent; content
  glides under it.
- **">" collapses** the rail to a 20px handle · **edge-swipe right** (or the
  "<" handle) **expands** it. Slide to close, slide to open.
- **flick the rail down/up = jog between tabs**, spring-loaded like a dial —
  the lazy navigation: one thumb drag, no aiming.
- entering **Now** auto-collapses the rail (immersion); leaving expands it.
- rail starts **visible with labels** — familiar body promise holds (anyone
  sees the five places instantly), then gestures are learned by feel.
- why left, not bottom: full-height content (Now, stories), one-hand edge
  reach, and nobody else does it — familiar in purpose, distinct in feel.

**Tabs:** **Home** (stories row + your circle's feed, ordered by time with
receipts) · **Now** (full-screen vertical swipe from near you — "warri ·
4 min ago · 2 km" — with a Near / Far toggle, the For You / Following shape;
Far = what traveled to you, "london · 8h ago · 5,266 km") · **( ⊕ ) Camera**
(still photo · 15s moment; real photo upload in the prototype) · **Alerts**
(flares, replies, "your post reached accra — 2 countries" — no red badges, a
soft dot at most) · **Profile** (your grid, your map, your ground).

## 2 · the story system (where stories show + the full choreography)

**Placement:** the standard stories row at the top of Home — circular
avatars, instantly familiar. Far story circles appear in Now's Far scope.
Nothing to learn; everything to feel.

**The ring:** not Instagram's gradient ring — a **thin single arc orbiting
each avatar** (the how far logo's own orbit). New segments brighten the arc;
the arc depletes as you watch. Familiar shape, ownable detail.

**STORY OPEN — "the orbit handoff" (520ms, 60fps):**
1. **0ms** — tap the avatar. The orbit ring stops breathing and brightens;
   the avatar presses in (scale 1 → .96, 60ms).
2. **60–380ms** — the avatar circle **detaches and expands** toward the center
   of the screen, interpolating position and size until it *becomes* the story
   frame (cubic-bezier(.2,.9,.2,1)). The orbit ring stretches into the frame's
   border. Home dims to black and blurs 8px behind it.
3. **380–520ms** — the first segment **blooms**: scale .9 → 1, blur 24 → 0,
   content fades up.

**STORY VIEW:**
- **the fuse** — one thin halo of light burns down like a fuse. No segmented
  bars, no numbers. Video/voice moments burn their length; **stills have no
  fuse at all** — a photo is a moment kept, hold it as long as you like.
- **the drift** — when the fuse is spent, the segment drifts out (up, blur)
  and the next drifts in from below, 600ms. **Never a hard cut, anywhere.**
- **anchor + flare** — touch freezes the story (the sky obeys your hand);
  holding 600ms ignites a flare at your touch point — warmth that travels,
  no count anywhere.
- **reply** — "reply with light" (the story-side vocabulary): 15s voice, and
  a comet departs across the dimmed background to their avatar. Lands with a
  small flare. No read receipts, it just arrives.

**STORY EXIT — "the fold-back" (420ms):** pull the story down and it
**shrinks back into its avatar circle** — you return the story to its place.
Instagram cuts to black; how far folds the moment away. After the last
segment it folds back on its own.

## 3 · comments — behind the content (the flagship)

Drag any post toward the center of the screen:
- the card **slides and docks** to the top (scale .92, blur 6px, dim to 70%)
- the comments are **already there, behind it** — they cascade in with 40ms
  stagger as the card clears
- release: comments fully open, input at the bottom; text or **voice replies**
- drag the card back down (or swipe down): comments fold away, the post
  springs back to full size
- counts: "12 replies" is shown (it's conversation, not status) — **flare
  counts are never shown, to anyone**

## 3.5 · video comments — reaction bubbles (owner, 2 Oct: "imagine you filmed yourself laughing over the video you watched")

A text comment says "lol." A video comment **shows the moment the laugh hit
them** — the laugh becomes the content.

- comments can be text, voice, or **15s video**
- watching a post, video comments surface as **face bubbles floating up the
  right edge** of the content — the comment section becomes a room of faces,
  not a text wall
- tap a face bubble → it plays **picture-in-picture OVER the post**, synced —
  you watch someone crack up at the exact second you did
- filming a video comment opens the camera **with the post playing above it**
  — the reaction is synced by construction, no editing, pure reflex
- replies can be video → video → video — **reaction chains**, the
  conversation becoming new content (TikTok's deepest-engagement format, in
  our object-handling language)
- creators receive **faces, not numbers** — you open your comments and it's
  people reacting to you. The warmest feedback loop on the internet, only
  possible on a no-counts architecture
- prototype note: webcam capture isn't possible in the sandboxed preview, so
  the recording flow is simulated — but the gesture, the PiP choreography,
  and the bubble playback are fully real and testable

## 4 · the engine — the invisible moat

- **distribution = physics.** Posts expand outward from where they were made;
  you see what reached you, ordered by arrival. Every post carries a receipt:
  "left lagos · 2h ago." Near scope ≈ 50 km; Far = everything beyond, ordered
  by distance traveled. **No engagement signal exists anywhere in ranking.**
- **no public counts.** Flares are private warmth. Follower counts do not
  exist. Your stats are yours alone.
- **decay, not delete.** Posts sink with age; your archive is **the ground** —
  stratified (today / this week / this month / earlier), dig for the deep
  past (the tested v7 strata engine, reborn on Profile).
- **your map.** Profile shows where your posts have reached — cities, km
  traveled, countries touched. Private wonder, not a badge.

## 5 · the Gen Z pull (sober hooks, standard shapes)

1. **Now = your city, live.** "What's happening in warri RIGHT NOW" is a
   daily-open question no algorithm-feed can answer. Immediacy is the
   dopamine; recommendations are replaced by *here*.
2. **Motion is marketing.** Gen Z screen-records buttery interactions. The
   orbit handoff, the fuse, the drag-to-center comments, the fold-back —
   every one is a 10-second TikTok about the app itself.
3. **Receipts + wanderlust.** "This post traveled 5,266 km to reach you" is a
   feeling Instagram structurally cannot copy.
4. **Voice everywhere.** Voice stories, voice comments, voice replies — the
   voice-note generation gets a home that treats voice as first-class.
5. **Calm premium.** Dark, quiet, no red badges, no streak shame. The app
   respects attention while still earning daily opens.

## 6 · premium craft standards (non-negotiable)

- 60fps everywhere; springs, not easings, for anything the user touches
- **no hard cuts, ever** — every transition is motion
- container-transforms: elements carry between screens (avatar → story frame;
  camera thumbnail → published post)
- press-states on everything touchable
- the vocabulary rule: light-language (flare, receipt, reply with light)
  only inside the story experience; plain words (Home, Now, posts, replies)
  everywhere else

## 7 · what was cut, what survives

- **cut:** sky-as-home, the catch minigame, atlas-as-game, meteor showers,
  dusk parade (as spectacle)
- **survives, in standard clothes:** every story animation (bloom, fuse,
  drift, flare, comet reply — built + 64-check-tested in `howfar-sky-v1.html`),
  receipts, the distance engine, strata archive (v7, tested), no-counts
  privacy (all builds), stills (owner-locked)

## 8 · prototype build plan (v3 → `howfar-app-v9.html`)

1. **edge rail shell** — 5 tabs, glass rail, collapse chevron, edge-swipe
   expand, jog-flick between tabs, auto-collapse in Now
2. Home: stories row (orbit rings) + feed cards with receipts, flare,
   pass-flick, long-press menu
3. Story system: orbit handoff, fuse, drift, anchor/flare, comet reply,
   fold-back exit
4. Comments: drag-to-center behind the card, cascade, voice + video reply,
   **reaction bubbles** floating the right edge with PiP playback
5. Now: full-screen vertical feed, Near/Far toggle, receipts, same gestures
6. Camera: photo upload (real) + 15s moment capture, container-transform
   publish
7. Alerts: three kinds, no red
8. Profile: grid + map (dotted) + the ground (strata) + private stats
9. full automated browser suite — rail gestures, drag-to-center comments,
   reaction bubble playback, story choreography states, tab routing, receipt
   ordering, no-counts audit
