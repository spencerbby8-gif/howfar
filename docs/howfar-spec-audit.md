# how far — spec audit & deeper thinking

**Date:** 2 October 2026
**Input:** `how far spec` (Drive, 706 lines, dated 30 Sep 2026) · `Document from Spencer` (brand zip, 2 Oct) · the mockup built yesterday (`howfar/howfar-app-mockup.html`)
**Method:** full read, live re-verification of every checkable claim, cross-document reconciliation.

---

## 1. What the spec is (so we're sure I understand it)

A **place-memory social app**. The atom is a *place*, not a person. You stand somewhere,
hold for 15 seconds, and drop a voice moment into "the ground." It sinks. Older moments
sink deeper. You dig down — literally drag — to reach them. You can only write where you
physically are (presence-gated). Nobody ever sees where anyone is: presence is a count
("6 here right now"), never a coordinate. No feed, no profiles, no likes, no DMs, no
sharing out, no editing. Local-first: a drop always succeeds, sync is opportunistic.
Android-first, audio-native, built for Port Harcourt / Lagos data economics (45 KB drops,
zero-egress storage, self-hosted map tiles, ~$310/mo at 100k MAU).

Five primitives: **P1** place is the atom · **P2** presence-gated write · **P3** depth not
recency · **P4** presence is a count, never a coordinate · **P5** local-first.

Seven strata: surface (0–1h, hot) → bedrock (1y+, cold). Depth is *derived* from age,
never stored. Build order: prototype → prove presence-gating → one real place → the map →
liveness → mesh → moderation. And before any of it: **the Rumuokoro Junction test** —
a printed sign and a WhatsApp number, one week, zero code. The spec's own words:
*test the human behaviour before you test the engineering.*

That is a correct and unusually disciplined summary of a genuinely strong document. Now
the audit.

---

## 2. What verifies (re-checked live today, 2 Oct)

| Claim in spec | Live check today | Verdict |
|---|---|---|
| howfar.io / .earth / .co / .xyz available (RDAP, 29 Sep) | RDAP queried today | ✅ all four still free |
| howfar.com taken | Registered **1999-03-28** | ✅ |
| howfar.app taken | Registered **2025-12-13** (recently!) | ✅ — someone took it 10 months ago; worth knowing who |
| Cost math (Opus 24 kbps 15 s ≈ 45 KB; ~$310/mo at 100k MAU) | Arithmetic + current R2/Redis/Postgres pricing | ✅ roughly holds |
| Failure research (BeReal decline, Yik Yak $73.5M→$1M, Zenly killed, etc.) | Consistent with the record | ✅ |

The spec's facts are honest. The problems below are about what it *doesn't* say, and
about a contradiction it cannot see from inside itself.

---

## 3. Strengths worth keeping (short — they're real)

1. **The moat is accumulation, not mechanics.** Year three of a place is uncatchable.
   Mechanics are copyable; three years of Rumuokoro's voices are not. (The spec knows
   this but also slightly forgets it — see §4.10.)
2. **P4 is a product decision disguised as a privacy policy.** "Presence is a count,
   never a coordinate" is the brightest line in the document and the real differentiation
   from Zenly/Snap Map.
3. **Derived depth** (age→depth as a pure function, materialised) — right engineering:
   threshold changes become config, not migrations.
4. **Attestation honesty.** "The goal is not cryptographic certainty, it is making faking
   ANNOYING" is the correct epistemics. Tiered pragmatism beats security theatre.
5. **BLE double-duty** (co-presence attestation + offline mesh gossip) — one primitive,
   two payoffs. Genuinely clever.
6. **The Rumuokoro test.** The single best page in the document.
7. **Rejected-names log with reasons.** Kills relitigation forever.

---

## 4. Holes in the spec itself

**4.1 Moderation is scheduled at Phase 6 — after five phases of building.** The spec's own
research says Yik Yak died of moderation failure, then sequences moderation *last*. For a
product whose content is (a) voice — no keyword filters, ASR is expensive and **Pidgin
ASR is weak**, (b) geo-anchored — harassment lands *at* a school gate, a mosque, a rival's
shop, (c) pseudonymous and profile-less. "Natural friction" (you must physically return
to harass a place) is not a defence — the whole product is that people return to places.
Voice + minors + pseudonymity needs a day-one answer, not a Phase 6 one. And **NDPR is
never mentioned**: under the Nigeria Data Protection Regulation, voice is personal data;
a 15-second voice note may even be biometric-adjacent. This is a Nigerian product — the
Nigerian framework is the primary one, not GDPR, not USPTO.

**4.2 The business model contradicts the privacy architecture.** "High-intent local
advertising" — the most valuable local-intent signal is *where you are*, and the
architecture's core promise is that location never leaves the device. As written, the two
halves do not compose. Two coherent fixes: (a) **on-device ad matching** — download a
venue corpus per region, match against the local geofence on-device, server never learns
anything; or better (b) drop ads entirely at launch and monetise **venue subscriptions**
(a club pays monthly for its owned timeline + Tier-4 QR verification). Venue subs are cash
from day one, require zero user location, and align exactly with "a club's Saturday night
IS its marketing."

**4.3 The permission copy overpromises.** Onboarding says *"It only works where you are.
Nothing stored, nothing tracked."* But every moment persists `author_id + place_id +
created_at` forever in Postgres — that **is** a pseudonymous location history, and
pseudonym ≠ anonymous (one slip — "amara, I left you something at the spot" — de-anonymises
the author). The architecture is fine; the copy is false. Honest version: *"The ground
remembers what you left, not where you stand."*

**4.4 Presence counts leak a side channel.** "6 here right now" updates <2 s. In a small
place: the count goes 1→2 when *you* walk in — the person already there learns *someone*
arrived, and timing correlation over repeat visits can bind an identity to a presence
pattern. Mitigations: bucket counts ("3+"), update lag, or hide counts below a threshold.
P4 needs this corollary or the bright line has a crack in it.

**4.5 The attestation trust model is hand-waved.** The server "verifies internal
consistency" of tokens derived from daily keys "held only on-device" — it cannot verify
anything about keys it never sees. The GAEN comparison overclaims: GAEN's privacy works
because a *trusted* diagnosis server with health-authority keys processes matches; that's
a different trust shape than an anonymous pubsub. Also: sybil devices can co-sign each
other's co-presence (two phones in a drawer "attest" a whole fake crowd). The honest
design: device keypairs at install, peer counter-signatures accumulate *tier*, not truth,
and the server checks signature-chain *shape*, never identity. Say that, and §4.1's
"annoying, not impossible" framing stays honest.

**4.6 Cold start is under-solved.** "A place with nothing is an invitation" is a line,
not a mechanism. The return hook needs a three-way coincidence (you dropped → someone
else dropped later → you walked past again). The real mitigation in the risk table —
seed via venues — quietly contradicts "places are discovered, not defined," and venue
seeding is a **sales operation** (humans onboarding clubs one by one), which the spec
never prices or staffs.

**4.7 The strata bet contradicts the spec's own failure library.** Every failure studied
(BeReal, Poparazzi, Lapse) died of ritual-without-compounding; the fix here is *friction*
(digging) on top of a ritual. "Older = harder to reach = more precious" is beautiful and
may be true — but it is the single most testable hypothesis in the product, and Phase 0
must test the **20th dig**, not the first. Novelty carries the first dig; nothing carries
the twentieth unless discovery stays genuinely rewarding.

**4.8 The core gesture collides with the OS.** Drag-down-to-dig is also
pull-to-refresh. Accidental refresh while digging, accidental dig while scrolling. Needs
a deliberate mode (a visible "dig handle" at the bottom, or long-press to enter the
strata). Unaddressed.

**4.9 The companions are missing.** The spec declares itself the single source of truth
and points to `sediment-architecture.md`, `howfar-brand.html`, `howfar-icons.html` for
detail — none are in the Drive. Can't audit what isn't there; if they exist, upload them.

**4.10 The moat is misattributed to colour.** "Nobody can copy the look without copying
the product" — false; anyone can ship a hue ramp. What nobody can copy is the accumulated
strata (the data). The moat sentence should be about depth-of-archive, not colour.

**4.11 Market research misses the closest living ancestor: Jodel.** Hyperlocal,
anonymous, place-scoped, still alive across European campus towns after a decade. It is
both the existence proof (this general shape *can* retain) and the cautionary tale (it
only works where density is extreme — it is a university-town product). how far's
equivalent density unit needs naming: campuses? markets? motor parks? churches? The
spec skips this.

**4.12 The name has Nigerian prior art the spec never found.** "Howfar" by **Touchcore NG**
was a social/chat app on Google Play from Sept 2014 to May 2018, 10,000+ downloads — same
name, same category, same market. It's dead (abandoned ~8 years), so risk is low — but
trademark clearance must start at the **Trademarks Registry in Abuja**, not USPTO, and
this prior art must be on the file. (Checked live today; also note `howfar.app` was
registered by someone in Dec 2025 — worth identifying.)

---

## 5. The big finding — one name, two different products

The spec (30 Sep) and Spencer's brand zip (2 Oct) — and therefore the mockup I built
yesterday from the zip — describe **different products**:

| | **Spec (30 Sep)** | **Zip + my mockup (2 Oct)** |
|---|---|---|
| Atom | a **place** | **people** (your contacts) |
| Core action | drop 15s voice *into the ground where you stand* | send a ping (voice/photo/text) *to your people* |
| What "how far" means | **down** (depth) / **back** (age) | **away** (km between humans) |
| Location privacy | presence = count; "nobody can ever see where you are" (P4) | radar plotting people **by distance** — and in my mockup by bearing too |
| Threads | none exist — the only "reply" is dropping your own moment there | chat thread, typing indicator, DM energy |
| Lists | no people-lists, no profiles anywhere | "who answered" people list |
| Identity | basalt + halo amber, system sans, Buried Bubble icon | void + flare + volt, Unbounded, orbit mark |
| Voice | "Nothing here yet. You're the first." | "the greeting that outran distance" |

The zip's product concept — *a pulse you throw, and a map of the people who ping back,
plotted by how far they really are* — is the **Zenly / Snap Map / Corner lane**. The spec
names that lane as the one line it refuses to cross (P4, "this is the line Zenly crossed
and the line we do not cross"). And my mockup faithfully implements the zip's concept:
the radar shows *bearing + distance* (that's a coordinate with extra steps — "noura · 4 m"
tells a stalker she's in the room), the thread is a chat, "who answered" is a people feed.
It's a beautiful UI for a product the spec explicitly refuses to be.

This isn't a detail — the core loop, the privacy model, the data model, and the business
model all fork on it. **Both documents cannot be the product.** The fork has to be chosen
on purpose, and the earlier it's chosen, the less gets rebuilt.

---

## 6. Thinking it through — the fork

**Path A — the zip is the new skin; the spec is still the product.** *(my recommendation)*
Keep Spencer's identity (it's the fresher, owner-chosen one — and it's gorgeous), keep
the spec's place-memory product. The semantic remap is almost eerily natural, because the
zip's own colour notes already say it:

- **flare** — "the beacon. Heat, greeting, **now**" → the surface layer, the alive, the
  you-are-here dot, HOLD TO DROP.
- **volt** — "the echo. Distance, afterimage, **far**" → the sediment, the found, the
  deep. Older strata cool from flare toward volt. *The echo is literally a voice that
  comes back to you from far away in time.*
- **the orbit mark** — a ping and its echo — reads perfectly as *a moment dropped and
  what waits under it.* Nothing about the mark needs to change.

What survives from ReplyMate/the mockup: the craft, not the screens. The Place screen is
naturally a vertical strata scroll — header with dim subtitle, cards, bottom action bar
(ReplyMate bones fit it exactly). The Ground / Drop / My Ground / Live screens replace
radar / chat / who-answered. Same fonts, same palette, same orbit, same voice.

**Path B — pivot to the zip's people-ping product; the spec is obsolete.** Then the
privacy line must be consciously redrawn (distance-buckets only? no bearing? ephemeral?),
and you're competing head-on with Snap Map and Zenly's ghost with none of the
accumulation moat. It's the least differentiated thing in either document. I'd argue
against it hard, but it's a legitimate choice if the owner's conviction is "the greeting
between people" — just do it with eyes open: it re-imports every failure mode §3 of the
spec diagnosed.

**Path C — both: ping layer on top of the ground.** A "how far" ping asks *who's close
enough to pull up*; the answer writes itself into the ground. Tempting, but two atoms =
two products = the classic social-app death. If the ping layer ever happens, it's a
**year-two feature** after places have memory, not a day-one feature.

---

## 7. New thinking the spec doesn't have (my additions)

1. **The honest permission line** — rewrite onboarding copy per §4.3. One sentence,
   kills a future trust scandal.
2. **Presence bucketing** — per §4.4; tiny change, closes a real hole.
3. **Venue subscriptions before ads** — per §4.2; revenue that never touches user
   location and doesn't need a privacy contortion.
4. **Moderation as Phase 0 thinking, not Phase 6 building** — even with no app: decide
   the policy (report → quarantine → steward review), price ASR, and accept that Pidgin
   moderation will be human-first for years. Budget it like a real cost line.
5. **Name the density unit** (per §4.11) — campuses, markets, motor parks, churches.
   Jodel's lesson: this product shape lives or dies on the density of its seed places.
   Pick the Rumuokoro test site accordingly (a junction is good; a campus or a big market
   might be better).
6. **Nigeria-first IP** — trademark search at the Abuja registry (prior art exists:
   Touchcore NG's Howfar, 2014–2018), then file HOWFAR as a word mark in Nigeria first;
   Madrid Protocol later if it grows. USPTO is not the first registry a PH-first product
   needs.
7. **Register the domains today** — they were still free at my check this morning;
   `.app` going in Dec 2025 shows the clock is running on this name.

---

## 8. What I'd do this week

1. **Decide the fork** (Path A / B / C) — everything downstream hangs on it.
2. Register howfar.io + howfar.earth (~$60) — verified free today.
3. Abuja trademark search incl. the Touchcore prior art.
4. Run the Rumuokoro test exactly as the spec writes it — it remains the only test that
   matters, whichever fork is chosen (Path B needs a *different* sign: "leave 15 seconds
   for a friend" — the test design itself reveals which product you're building).
5. If Path A: I rebuild the mockup as **how far v2** — the spec's five screens in
   Spencer's skin (Ground / Place with strata / Drop ring / My Ground / Live), ReplyMate
   bones where they fit. The orbit mark, flare-surface/volt-sediment remap, and the sink
   animation carry over.

---

*Sources: `how far spec` + `Document from Spencer` (both in Drive); RDAP lookups for six
domains performed live 2 Oct 2026; Touchcore NG "Howfar" prior art via live search
(appbrain.com/app/howfar/com.howfar).*
