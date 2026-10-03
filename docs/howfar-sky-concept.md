# how far — the sky
### concept v3 · stories-first social · 2 Oct 2026

> **SUPERSEDED as the app's direction (2 Oct 2026, later same day):** the
> owner judged sky-as-home "kinda childish" and too complex. The full plan now
> lives in **`howfar-v3-architecture.md`** — familiar body (standard tabs,
> stories row, camera), different soul (drag-to-center comments, distance
> engine, no counts). This doc survives as the record of the sky concept and
> the source of the tested story animations (bloom / fuse / drift / flare /
> comet) that v3 reuses inside its story viewer.

**Owner directive:** this is social media with story posting — but the story
surface, its tab, and its animations must be nothing like Instagram, Facebook,
or TikTok. v8 (check-in messenger) direction dropped. This is the replacement
concept, pitched in chat and recorded here as the plan of record.

---

## 1 · one line

**Stories are light. Posting is release. Distance is the feed.**

A sky full of your people's moments. You zoom to choose how far you're looking.

## 2 · the metaphor (why it's honest, not decoration)

Starlight is old light. When you look at a star you see it *as it was* — the
light left it years ago. A story is exactly that: a moment that already passed,
arriving to you now. "How far" stops being a name and becomes the physics of
the product:

- light **travels** — nothing is instant, near arrives first
- light **dims** — nothing needs a delete button
- **distance** is effort — far friends sit at the edge of your sky
- no algorithm ever decides what you see — **geography and time do**

## 3 · vocabulary (the product's language)

| term | meaning |
|---|---|
| **light** | a story. 15s of video, photo, or voice |
| **release** | to post. you let a light go, you don't broadcast |
| **the sky** | home. no feed beneath it — the sky IS the app |
| **near lights** | your circle, inner sky, constellation lines between them |
| **the horizon** | far lights. discovery. strangers' light arriving |
| **flare** | the like-replacement. a burst of warmth that travels back |
| **shooting star** | a reply. your voice arcing across the sky to them |
| **the ground** | your archive. lights settle there after they fade |
| **fuse** | the story timer — a halo of light that burns down |
| **receipt** | "left warri · 2h ago · traveled 312 km to reach you" |

## 4 · the five rules that make it different

1. **no avatar row, no segmented progress bars, no tap-to-skip** — banned shapes
2. **zoom is the feed** — pinch = near circle → city → country → world
3. **never cut, only move** — every transition is motion (drift/warp/bloom)
4. **no public counts anywhere** — no like lists, no follower numbers, ever
5. **discovery by distance, not algorithm** — the horizon, with receipts

## 5 · screens

| screen | what it is | unique vs IG/FB/TikTok |
|---|---|---|
| **sky** (home) | zoomable night-sky canvas; near lights breathe; drift shows neglect | there is no feed at all |
| **bloom** (story viewer) | the light blooms open into full-screen media; fuse halo; drift/throw navigation | no bars, no cuts, physics nav |
| **release** (capture) | 15s capture; light forms in your hand; swipe up to launch | posting = letting go |
| **ground** (you) | your settled lights per person; strata/dig possible here later | archive as archaeology |
| **horizon strip** | arriving far lights + "arriving in 38 min" anticipation | arrival times, not rankings |

## 6 · mechanics

**Travel model (tunable in prototype)**
- release → light departs your position, expands outward
- near lights (your circle) receive in seconds
- horizon travel speed ~1 km per second (lagos→warri ≈ 5 min; london→warri ≈ 80 min)
- while traveling to you: "a light from london arrives in 38 minutes" — one
  quiet push per session, max. anticipation, not spam
- on arrival: the light docks at your horizon edge, dim, with its receipt

**Fade model**
- 0–24h: bright, breathing
- 24–48h: dimming (visibly — the sky shows time passing)
- 48h: settles into the ground (author's archive + viewers' memory of it)

**Interactions**
- **flare (like):** press-and-hold anywhere on the story → touch point ignites →
  burst travels back to their sky. they receive "a flare arrived from you".
  no count, no list, no social debt
- **shooting star (reply):** tap the light's core → 15s voice → release → your
  reply departs as a comet arcing across the sky to their position, lands,
  their light flares. the arc is visible in both skies
- **co-presence:** "3 of your circle caught this light" — who else is near it,
  never who liked it
- **constellations:** lines auto-connect your circle's lights when 2+ people
  you know also know each other — your social graph drawn as astronomy

**Ground (archive/profile)**
- per person: your settled lights, oldest at the bottom
- strata bands from the v7 engine can port here (today/this week/…/bedrock)
  — digging your own history with someone

## 7 · animation spec (trigger · duration · feel)

| # | name | trigger | spec |
|---|---|---|---|
| 1 | **breathe** | idle sky | each light pulses ±6% scale/2.4s, staggered phase; fresh lights breathe faster (1.6s) |
| 2 | **tilt parallax** | device gyro / mouse move | 3 depth layers shift ±8px at different rates — the sky has depth |
| 3 | **warp-in** | tap a light | 400ms: stars streak radially (scale 1→1.4 + motion blur), target light grows to a ring, ease-in-cubic |
| 4 | **bloom** | warp completes | 350ms: ring scales to full screen, blur 20→0, opacity 0→1, spring (overshoot ~8%) — the media opens like a nebula |
| 5 | **fuse** | story playing | halo arc depletes over segment length, ember glow at the burn point, no numbers |
| 6 | **drift-out / drift-in** | segment ends | current light drifts off with slight rotation (600ms, ease-out), next drifts in from off-screen — never a hard cut |
| 7 | **anchor** | touch anywhere | everything eases to a stop in 150ms — the sky obeys your hand |
| 8 | **throw** | flick gesture | velocity-based: light sails off with particle trail, drag decays 0.92/frame |
| 9 | **pull-back** | drag down | the thrown light returns along its own trajectory (reverse 300ms) |
| 10 | **flare** | press-and-hold ≥600ms | ignition bloom at touch point → shockwave ring → streak departs screen edge (600ms) |
| 11 | **shooting star** | reply released | 1.4s bezier arc across the sky, comet head + fading trail (8 particles), lands with a small flash on their light |
| 12 | **release launch** | swipe up in capture | the formed light ascends, decelerating, shrinks to a point, leaves a vertical glow trail (900ms) |
| 13 | **horizon arrival** | far light docks | slides in at horizon edge, dim, receipt text fades up line by line |
| 14 | **settle** | 48h fade ends | light descends slowly below the skyline into the ground (1.2s) |

## 8 · what it refuses (from the hates research, 2 Oct)

no algorithmic ranking · no ads in the sky · no public counts · no comment
threads (replies are private shooting stars) · no infinite scroll (the sky is
finite: your circle + what arrives) · no repost · no "seen" lists · nothing
orange-hot demanding attention — the sky is calm by nature

## 9 · differentiation

| dimension | IG / FB / TikTok | how far — the sky |
|---|---|---|
| stories home | avatar row over a feed | a zoomable sky, no feed |
| progress | segmented bars | burning fuse halo |
| advance | tap tap tap, hard cuts | drift, throw, pull-back |
| like | ❤️ + visible count | flare that travels, no count |
| reply | text box | shooting star |
| discovery | algorithm | distance + time, with receipts |
| archive | highlights grid | the ground — lights settle and stratify |
| feeling | channel-surfing | stargazing |

## 10 · prototype plan (pending owner's 3 answers)

HTML/CSS/canvas interactive prototype:
1. **sky** — canvas starfield, 6-8 seeded people with lights, breathe + parallax, pinch/zoom levels (circle → city → horizon), constellation lines
2. **bloom viewer** — warp-in + bloom + fuse + drift advance + throw + pull-back
3. **flare + shooting star** — full interaction loops with return animation
4. **release** — capture placeholder → launch animation → light appears in sky
5. **ground** — settled archive screen
6. headless-browser test suite like v7/v8 (interaction + animation state checks)

## 11 · open questions (asked 2 Oct 2026)

1. concept: sky-of-lights (recommended) vs orbit-rings (logo-true: friends
   orbit you, spin to browse) vs a blend
2. visuals: does the sky + viewer get its own visual language (starfield, glow,
   particles) with ReplyMate kit kept for ground/settings — or strict kit-only
   again like v7?
3. build the prototype immediately, or refine this plan first?

## 12 · decisions + build log (2 Oct 2026)

Owner answered: **concept A (the sky) · visuals A (hybrid: story surface free,
ground/settings stay ReplyMate kit) · build now.**

Built: **`howfar-sky-v1.html`** — the complete interactive prototype.
- the sky: canvas starfield (3 depth layers), breathing lights, you at center,
  constellation lines, zoom scopes near → city → world (pinch, wheel, or the
  zoom label), far lights with distance receipts, one incoming light with a
  live countdown ("a light from london arrives in 38 min")
- the bloom: warp-in → bloom open → **fuse halo** (SVG arc, no bars) → drift
  advance → anchor (touch freezes the fuse) → **flick to throw** (velocity
  physics) → **pull down to rewind** → hold 600ms = **flare** (no count)
- reply = **shooting star**: hold-to-speak (1s min, 15s cap, mistouch guard),
  comet arcs across the sky from your light to theirs and lands with a flare
- release: hold to capture → the light forms → let it go → launch trail →
  your light burns bright
- the ground + settings: 100% ReplyMate kit (stats, bandheads, rows, toggles,
  dialog); horizon + arrival toggles actually gate discovery
- verified: **64-check browser suite (`​.testenv/test-sky.js`) — all passing**,
  fits 480/360/320px, zero page errors. Two real bugs found and fixed by the
  suite: null-crash on the "you" light at boot; reply recorder auto-sending at
  1s instead of 15s.

## 13 · THE HOOK SYSTEM (owner: "it has no hook 🪝" — 2 Oct 2026)

v1 was a window, not a trap: beautiful, passive, no return loop. The hook
system layers five retention loops onto the sky — each native to the metaphor,
none from the toxic playbook:

1. **CATCH** — far lights *pass*: a light drifts across your sky for ~15 min,
   then it's gone. Tap to catch before it slips out. Every catch is a
   variable-reward box (a stranger's 15s or photo — you never know what or
   from where). Rare types: storm, aurora, twin lights. Geography is the slot
   machine — TikTok's variable reward with zero algorithm.
2. **TRACK** — your released light has a journey: watch it cross the world
   scope ("now over the sahara"), arrival notices ("your light reached accra —
   someone caught it there"). Parcel-tracking psychology; every post creates a
   2–3 day return arc. Ground keeps a private total: km your light has ever
   traveled.
3. **THE ATLAS** — a dark dotted world map in the ground; every place you've
   caught a light from glows. Rare places glow rare colors. Fully private,
   zero comparison — completionist grind without social pressure. Caught far
   *photo* lights sit in their place's slot like **postcards from strangers**.
4. **THE DUSK PARADE** — daily at local dusk, the day's farthest-traveled
   lights cross everyone's sky in a slow two-minute parade. Same sky, same
   moment, all users. Witness + catch (parade lights catchable). The habit
   anchor: BeReal's daily moment without its obligation.
5. **SHOWERS** — many releases from one place in a short window arrive
   together as a meteor shower over that city for ~15 min: "a shower is
   passing over lagos." Live, ephemeral FOMO — the world feeling alive.

**TEND** (already built) underpins all of it: constellations fade, friends
drift, flares and shooting stars keep lines bright. Reciprocity is the
deepest hook.

**Refused, still:** public counts (atlas/km/catches are private), streaks
(nothing breaks, nothing shames), algorithmic ordering (parade = distance
traveled), ads, infinite anything.

## 14 · STILL LIGHTS — pictures (owner: "people should be able to post
pictures too" — 2 Oct 2026)

- release flow gains a second form: **moment** (15s video/voice, fuse, 24h) or
  **still** (photo)
- **stills have no fuse** — a photo isn't a moment passing, it's a moment
  kept. Hold as long as you like; the anchor is the natural state
- stills stay bright **48h**, then settle into the ground
- stills travel like all light; caught far away, they become postcards in a
  stranger's atlas
- prototype wires **real photo upload** (file input → preview → release →
  blooms in your sky) so picture posting is literally true

### hook-system build scope (pending owner answer)
- v2 of the prototype: passing/catchable far lights + catch states; tracked
  journey of your released light (waypoints + arrival events); atlas screen in
  the ground (dotted world map, glowing pins, postcard slots); dusk parade
  (triggerable + scheduled hint); shower event (triggerable + sim); still
  lights with real photo upload, no fuse, 48h

