# HowFar — Native Android Implementation Specification

> **Engineering Blueprint for Native Android Implementation**  
> Targets Android 14+ (API 34), backward compatible to Android 8.0 (API 26).  
> Built with Kotlin, Jetpack Compose / Custom Views, AndroidX, and Room SQLite.

---

## 1. Native UI & Motion Engine Architecture

### 1.1 Gesture Handling Physics
* **Drag-to-Center Comments:** Implemented via `Modifier.pointerInput` with `detectDragGestures` in Jetpack Compose or `ViewDragHelper` in traditional XML ViewGroups.
  * Card dock transition: `Animatable(1f)` scaling down to `0.92f` while interpolating `RenderEffect.createBlurEffect(12f, 12f, Shader.TileMode.CLAMP)`.
  * Comments container: `LazyColumn` cascading items with a `staggered` entrance animation (`spring(dampingRatio = Spring.DampingRatioLowBouncy, stiffness = Spring.StiffnessMedium)`).
* **Double-Tap Flare:** `detectTapGestures(onDoubleTap = { offset -> triggerFlare(offset) })`.
  * Renders a custom hardware-accelerated Canvas particle ignition effect with radial gradient shader `#FF4A1C` to transparent.
* **Left Edge Rail Navigation:**
  * Fixed left `NavigationRail` or custom horizontal translate container (`68dp` width).
  * Collapse chevron toggles horizontal translation `translateX(-48dp)` leaving a `20dp` drag handle.
  * Vertical scroll velocity listener on the rail translates flick gestures into `currentIndex.inc()` / `currentIndex.dec()`.

---

## 2. Media & Story Choreography Architecture

### 2.1 Video Reactions & Picture-in-Picture (PiP)
* **Media3 / ExoPlayer Integration:**
  * Post video player running on background texture view.
  * PiP Reaction Player: secondary ExoPlayer instance bound to a floating overlay `130dp x 190dp` with corner radius `16dp` and border stroke `2dp #0A84FF`.
  * Synchronization: `exoPlayerReaction.seekTo(exoPlayerPost.currentPosition)` ensuring millisecond-level sync between viewer laughter and post playback.
* **CameraX Reaction Recording:**
  * `CameraController` bound to front-facing camera in split-screen / docked preview mode.
  * Encodes 15s MP4 (H.264 / AAC) at 1080x1920 or 720x1280.

### 2.2 Story System Mechanics
* **The Orbit Handoff:**
  * `SharedTransitionScope` in Compose or `ChangeBounds` + `ChangeTransform` in View system expanding the circular avatar into the fullscreen 9:16 story frame in 520ms.
* **The Halo Fuse:**
  * Custom `Canvas` drawing `drawArc()` with `strokeCap = StrokeCap.Round` and `SweepGradient` or `#0A84FF` brush.
  * Stills rule: When `mediaType == MediaType.STILL`, arc timer is omitted.

---

## 3. Local Data Architecture (Room SQLite)

```kotlin
@Entity(tableName = "posts")
data class PostEntity(
    @PrimaryKey val id: String,
    val authorId: String,
    val authorName: String,
    val originCity: String,
    val originLat: Double,
    val originLng: Double,
    val distanceKm: Double,
    val timestamp: Long,
    val mediaUrl: String,
    val mediaType: String, // STILL, MOMENT, TEXT
    val caption: String,
    val replyCount: Int,
    val isFlaredByMe: Boolean
)

@Entity(tableName = "video_reactions")
data class VideoReactionEntity(
    @PrimaryKey val id: String,
    val postId: String,
    val authorId: String,
    val authorName: String,
    val emoji: String,
    val videoUrl: String,
    val durationMs: Long,
    val timestamp: Long
)
```

---

## 4. Background Distance Sync & Geofencing

* **Android WorkManager:**
  * Periodic `DistanceSyncWorker` running every 15 minutes to calculate post decay and distance radii.
  * Formula for post arrival sorting:
    $$\Delta d = 2R \arcsin\left(\sqrt{\sin^2\left(\frac{\Delta\phi}{2}\right) + \cos(\phi_1)\cos(\phi_2)\sin^2\left(\frac{\Delta\lambda}{2}\right)}\right)$$
  * Content in Now feed is partitioned into:
    * `NEAR`: $\Delta d \le 50\text{ km}$
    * `FAR`: $\Delta d > 50\text{ km}$ (ordered by descending distance traveled).
