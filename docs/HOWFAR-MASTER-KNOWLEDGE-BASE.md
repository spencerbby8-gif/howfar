# HowFar Master Knowledge Base & Project Compendium

> **Project:** HowFar (how far)  
> **Repository:** [spencerbby8-gif/howfar](https://github.com/spencerbby8-gif/howfar)  
> **Core Law:** Content is an object you handle  
> **Brand Identity:** Familiar body, different soul · Premium Tier · Gen Z Pull  
> **Date:** October 2026

---

## Table of Contents
1. [Executive Vision & Core Philosophy](#1-executive-vision--core-philosophy)
2. [Market Research & Gen Z Behavior Analysis](#2-market-research--gen-z-behavior-analysis)
3. [The Complete Interaction & Gesture Matrix](#3-the-complete-interaction--gesture-matrix)
4. [The 5-Tab Architecture & Edge Rail Navigation](#4-the-5-tab-architecture--edge-rail-navigation)
5. [Story System Choreography & Motion Physics](#5-story-system-choreography--motion-physics)
6. [Video Comments, Reaction Bubbles & PiP Playback](#6-video-comments-reaction-bubbles--pip-playback)
7. [The Distance & Physics-Based Distribution Engine](#7-the-distance--physics-based-distribution-engine)
8. [The Ground Strata Archive & Reach Map](#8-the-ground-strata-archive--reach-map)
9. [Design System & ReplyMate Kit Specifications](#9-design-system--replymate-kit-specifications)
10. [Full Iteration & Decision History (v1 through v9)](#10-full-iteration--decision-history-v1-through-v9)
11. [Automated Test Suite Specs & Verification Record](#11-automated-test-suite-specs--verification-record)

---

## 1. Executive Vision & Core Philosophy

### The Problem
Traditional social media platforms (Instagram, TikTok, X, Facebook) suffer from structural rot:
* **The Algorithm Trap:** Feeds are dominated by engagement-maximizing recommendation algorithms that hide posts from real circles and push synthetic/AI content.
* **Status & Anxiety:** Public follower counts, like numbers, and view metrics make posting feel like performance labor rather than authentic expression.
* **Lack of Immediacy:** Users cannot ask "What is happening right where I am right now?" without wading through algorithmic recommendations.

### The HowFar Solution: "Familiar Body, Different Soul"
* **Familiar Body:** Standard social app shapes that require zero cognitive load to understand. Circular stories on top, full-height vertical swipe feeds, 5 recognizable navigation destinations.
* **Different Soul:** Every mechanic underneath is inverted:
  * **Content is an object you handle:** Physics-based gestures (drag post to center for comments behind the card, double-tap flare, pass-flick, fold-back story exit).
  * **Distribution is physics, not engagement:** Posts travel outward based on geographic distance and time. Receipts prove provenance (*"warri · 4 min ago · 2 km"*).
  * **Zero public vanity counts:** Flares are private warmth. Follower counts do not exist. Your reach is yours alone.
  * **Voice & Video First:** First-class support for voice notes, 15s moments, and floating video reaction bubbles.

---

## 2. Market Research & Gen Z Behavior Analysis

### 2.1 Research Insights (October 2026 Data)
* **Social Fatigue:** ~25% of social media users deleted an app in the last 12 months (over 33% among Gen Z).
* **Work Perception:** 60% of Gen Z state that maintaining an online presence "feels like work."
* **Quit Attempts:** 52% of Gen Z attempted a social media detox/quit in 2025–2026.
* **Private Shift:** Over 70% of meaningful Gen Z interactions moved away from public feeds into DMs and small group chats.
* **Voice Note Explosion:** WhatsApp processes over 7 Billion voice notes per day. 84% of Gen Z regularly use voice notes, and 37% of 18–34-year-olds prefer voice notes to phone calls (average length: 15–30s).

### 2.2 Prior Art & Regional Context
* **Nigerian Prior Art:** Touchcore NG released an app named "Howfar" on Google Play between 2014 and 2018 (messaging/utility).
* **Domain Record:** `howfar.app` was registered on 2025-12-13.
* **Regional Dynamics:** Authentic regional geography across Nigeria and West Africa (Port Harcourt, Lagos, Warri, Enugu, Accra) informs the distance and receipt distribution math.

---

## 3. The Complete Interaction & Gesture Matrix

HowFar enforces one non-negotiable rule: **Content is an object you handle.**

| Gesture | Screen / Element | Motion Response | Underlying Architecture |
|---|---|---|---|
| **Drag post toward center** | Feed Card (Home & Now) | Card slides up and docks (`scale(0.92)`, `blur(4px)`), comments cascade from behind (40ms stagger) | Flagship interaction: comments exist physically behind the content |
| **Double-tap** | Feed Card | Expanding warm radial flare burst (`#FF4A1C`) from touch coordinates | Private creator warmth; increments private flare tally with zero public count |
| **Horizontal flick** | Feed Card | Post translates off-screen with spring exit curve | Pass / Curation gesture: dismisses post from session |
| **Long-press** | Feed Card | Contextual glass sheet: Mute circle, share distance receipt, inspect provenance | Direct object inspection |
| **Tap Story circle** | Stories Row | **Orbit Handoff (520ms):** Avatar circle expands to become the full story frame | Container-transform motion, zero hard cuts |
| **Pull story down** | Story Viewer | **Fold-back exit (420ms):** Story shrinks back into its original avatar circle | Moment is folded away into place |
| **Touch & hold on story** | Story Viewer | Freezes timer/story; holding 600ms ignites a flare | Anchor gesture: the content obeys your hand |
| **Swipe Story horizontally** | Story Viewer | Drifts to next friend's story cluster | Fluid horizontal transition |
| **Flick left rail up/down** | Edge Rail | Jogs active selection up/down like a spring-loaded dial | Lazy one-handed navigation without precision aiming |
| **Tap Reaction Bubble** | Feed Card / Right Edge | Opens Picture-in-Picture (PiP) video reaction overlay | Synced reaction playback over post |

---

## 4. The 5-Tab Architecture & Edge Rail Navigation

HowFar replaces the traditional bottom navigation bar with a slim left-edge glass rail:

```
┌──────┬────────────────────────────────────────────────────────────┐
│      │                                                            │
│  ⌂   │  HOME                                                      │
│ Home │  • Orbit-ring stories row on top                           │
│      │  • Circle feed cards with origin & distance receipts       │
│  ▶   │                                                            │
│ Now  │  NOW (Full-screen live city feed)                          │
│      │  • Near (<50km) vs Far (>500km) toggle                     │
│  ⊕   │  • Auto-collapses left rail for full immersion             │
│Camera│                                                            │
│      │  CAMERA & PUBLISH                                          │
│  ◯   │  • Real photo upload picker + 15s moment capture           │
│Alerts│  • Container-transform release into feed                   │
│      │                                                            │
│  ▪   │  ALERTS (3 kinds ever, zero red badges)                    │
│Prof  │  • Flares, replies, distance milestones                    │
│      │                                                            │
│  ›   │  PROFILE & THE GROUND                                      │
│Toggle│  • Private stats (KM, Cities, Flares) · Reach Map · Strata │
└──────┴────────────────────────────────────────────────────────────┘
```

### Rail Mechanics:
* **Collapse Chevron (`>`):** Collapses rail to a 20px handle with `<`.
* **Edge Swipe:** Swiping right from screen edge restores the full rail.
* **Auto-Collapse:** Entering the Now tab automatically collapses the rail for full edge-to-edge vertical immersion.

---

## 5. Story System Choreography & Motion Physics

The story experience translates astronomical light concepts into standard mobile containers:

```
[Tap Avatar] ─────────► [Orbit Handoff (520ms)] ─────────► [Story Bloom]
                                                                │
                                                                ▼
[Comet Reply] ◄──────── [Anchor / Flare] ◄────────────── [The Halo Fuse]
      │                                                         │
      ▼                                                         ▼
[Departure to Avatar]                                     [The Drift (600ms)]
```

* **Orbit Handoff (520ms):**
  * `0ms:` Avatar presses in (`scale(0.96)`, 60ms).
  * `60–380ms:` Avatar circle expands to become the story frame (`cubic-bezier(0.2, 0.9, 0.2, 1)`). Background blurs 8px.
  * `380–520ms:` Segment blooms (`scale(0.9 -> 1.0)`, `blur(24 -> 0)`).
* **The Fuse:** Halo light ring that burns down over the duration of a video/voice moment.
* **Stills Rule (Locked):** **Photo stills have NO fuse timer.** Photos are kept moments with a 48-hour shelf life.
* **The Drift (600ms):** When spent, segment drifts out upward and the next drifts in from below. Never a hard cut.
* **Comet Reply:** Voice note departs across the screen as a shooting comet (`#C6FF3D` volt trail) landing directly in the friend's avatar.

---

## 6. Video Comments, Reaction Bubbles & PiP Playback

Video comments transform the text comment section into a room of living reactions:

* **Floating Reaction Bubbles:** Surface along the right edge of feed posts.
* **Synced Picture-in-Picture (PiP):** Tapping a face bubble launches a synchronized video overlay docked over the original post, letting viewers watch someone crack up at the exact same moment.
* **Reaction Recording:** Opening camera via `+ Video` in the comments composer docks the original post at the top so the creator's reaction is recorded in direct synchronization.

---

## 7. The Distance & Physics-Based Distribution Engine

Distribution in HowFar is governed by physics rather than algorithmic engagement:

### The Mathematical Model:
* **Near Scope ($\le 50\text{ km}$):** Immediate live local pulse (*"📍 port harcourt · 2 min ago · 1.4 km"*).
* **Far Scope ($> 500\text{ km}$):** Moments that traveled across cities and borders, sorted by distance traveled (*"london · 8h ago · 5,266 km"*).
* **Receipts:** Every piece of media carries an immutable origin and travel receipt (*"left lagos · 45 min ago · 38 km"*).
* **Zero Ranking Algorithm:** Content is ordered purely by physical arrival and proximity.

---

## 8. The Ground Strata Archive & Reach Map

* **The Ground (Strata Archive):** Posts sink into geological time layers:
  * Layer 1: **Today (Surface)** — Fresh signals.
  * Layer 2: **This Week (Layer 1)** — Settled moments.
  * Layer 3: **This Month & Earlier (Deep Ground)** — Archived bedrock.
* **Reach Map:** Visual interactive canvas mapping flight paths of your released posts from your home city across the globe.
* **Private Stats:** Only distance traveled, cities reached, and flares kept are tracked—never followers or vanity leaderboards.

---

## 9. Design System & ReplyMate Kit Specifications

All chrome, inputs, cards, and buttons strictly adhere to the authentic **ReplyMate UI Kit**:

```css
:root {
  --bg: #0D1117;          /* ReplyMate background */
  --card: #161B22;        /* ReplyMate card background */
  --accent: #0A84FF;      /* ReplyMate brand blue */
  --accent-press: #0871d8;
  --text: #FFFFFF;        /* Primary high-contrast text */
  --dim: #AAB2BD;         /* ReplyMate secondary text */
  --stroke: #2A3139;      /* ReplyMate 1dp hairline border */
  --field: #11161D;       /* ReplyMate input field */
  --bin: #1C2330;         /* ReplyMate incoming chat bubble */
  --bout: #1E3250;        /* ReplyMate outgoing chat bubble */
  --green: #3FB950;       /* ReplyMate success / sunk */
  --red: #FF6B6B;         /* ReplyMate destructive / error */
  --flare: #FF4A1C;       /* HowFar warm ignition */
  --volt: #C6FF3D;        /* HowFar live signal */
}
```

### Component Hierarchy:
1. **Send Button (`#btn_manual_send`):** 56×48px `btn-primary` pill (`r14`, 18sp bold `➤` arrow).
2. **Action Button (`#btn_video_react`):** ReplyMate `.btn.sm` (`+ Video`).
3. **Fields (`.field`):** `bg_field.xml` with `#11161D`, `r10`, 15sp text.
4. **Chat Bubbles:** `.bubble.in` (`#1C2330`) and `.bubble.out` (`#1E3250`).

---

## 10. Full Iteration & Decision History (v1 through v9)

1. **v1 – v4 (AI-Looking Exploration):** Initial prototypes featuring showcase marquee chips, heavy grain, and tech-demo layouts. **Rejected** by owner as artificial.
2. **v5 (ReplyMate Baseline Chassis):** Pure clone of ReplyMate Android layout. **Approved** as the UI kit baseline.
3. **v6:** Deviation with custom widgets. **Rejected**.
4. **v7 (The Strata Ground):** Passed 66/66 automated tests. Established the strata archive and presence-gated architecture.
5. **v8 (Check-in Pivot):** Passed 103/103 tests. **Rejected** because HowFar is a social media platform, not a messenger.
6. **Sky v1 (Astronomy Prototype):** Passed 64/64 tests. **Rejected as app home** (judged childish/complex), but its story motion physics (bloom, fuse, drift, flare, comet) were extracted and preserved.
7. **v9 / v3 Synthesis (Plan of Record):** "Familiar body, different soul." 5-tab shell + edge rail + drag-to-center comments + reaction bubbles + ReplyMate UI kit. **Passed 45/45 automated browser checks.**

---

## 11. Automated Test Suite Specs & Verification Record

All prototypes are verified via headless Chromium test suites using Puppeteer:

* **`tests/test-v9.js`:** 45 checks verifying edge rail, ReplyMate send arrow `➤`, video comments, PiP playback, story fuse/stills, drag-to-center comments, and viewports (480px, 360px, 320px).
* **`tests/test-sky.js`:** 64 checks verifying sky physics, bloom, halo fuse dashoffset math, comet WAAPI departure, and touch anchors.
* **`tests/test-v8.js`:** 103 checks verifying check-in state machine.
* **`tests/test-v7.js`:** 66 checks verifying strata engine.
