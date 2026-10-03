# HowFar — Native Android (v0 scaffold)

First native build of the v3 Plan of Record (see `docs/ANDROID-NATIVE-SPEC.md`).

## What's implemented

- **Left edge rail** — glass rail, 68dp → 20dp handle collapse, jog-dial vertical
  flicks, animated orbit ring on the active tab, edge-swipe restore
- **Auto-immersion** — entering **Now** collapses the rail
- **Drag-to-center comments** — card docks at `scale(0.92)` + `blur(12dp)`,
  comments cascade from behind with stagger; drag down folds it back
- **Flare engine** — double-tap radial `#FF4A1C` ignition burst, private tally only
- **Reaction bubbles + PiP overlay stub** — right-edge bubbles, 130×190dp accent-stroked overlay
- **Story rings** — halo fuse arc for moments, quiet no-fuse ring for 48h stills
- **Distance engine** — Haversine (§4 formula), NEAR/FAR partitioning at 50 km,
  lowercase receipts (`📍 port harcourt · 2 min ago · 1.4 km`)
- **Room schema** — posts / video_reactions / comments / flares, exact spec fields
- **Design tokens** — ReplyMate kit colors 1:1 from `howfar-app-v9.html`

## Not wired yet (next milestones)

- CameraX capture + Media3 PiP playback sync
- `DistanceSyncWorker` (WorkManager, 15-min sweep)
- Supabase sync (posts/flares/comments up; R2 media)
- Unbounded/Manrope font resources in `res/font`
- App icon from `brand/public/images/app-icon.png`
- Gradle wrapper jar — run `gradle wrapper` once, or open in Android Studio which handles it

## Build

Open `android/` in Android Studio (Hedgehog+), sync, run on API 26+.
Target: Android 14 (API 34). Dark-only, edge-to-edge.
