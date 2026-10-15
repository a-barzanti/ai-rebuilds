# Architecture, game loop and rendering

Target: Zombie Lane for Android, `com.dchoc` 1.0.33 (versionCode 10330, minSdk 9), APK SHA-256
`39b93f6f…0ad6`. Evidence IDs are listed in [evidence.md](evidence.md).

Tags: **[obs]** observed in REA output · **[inf]** inferred from observations · **[?]** unknown

## Layers

The app has four layers, from the bottom up:

| Layer | Packages | Role |
| ----- | -------- | ---- |
| J2ME compatibility layer | `javax.microedition.{lcdui,lcdui.game,m3g,media,rms,io,sensor,midlet}` | Digital Chocolate's own MIDP 2 / M3G API on top of Android. The game is written against J2ME. |
| Engine "toolkit" | `com.dchoc.toolkit`, `amagicbox`, `spriteobject`, `opengl`, `parser`, `collection`, `iphonewrappers` | Resources, text, sound, records, HTTP, payments, Facebook, sprite animations, XML parser, data structures |
| Game ("iDead") | `com.dchoc.idead.*`, `com.dchoc.hud`, `com.dchoc.windows` | Game logic, isometric scene, items, missions, UI windows |
| Android host + SDKs | `com.dchoc.DCiDead`, billing, Fortumo, PayPal, Tapjoy, Flurry, Facebook, AllJoyn | Activity, payments, ads, analytics, local multiplayer |

- **[obs]** Package classes: 2,137 in total, 428 under `com.dchoc` (`E-classes`). Game sub-packages include
  `isometric`, `pathfinding`, `spawning`, `tuner`, `missions`, `items`, `objects`, `characters`, `actions`,
  `player`, `places`, `social`, `servlets` and `tutorial`.
- **[obs]** `iphonewrappers` (Activity/Device/File/Movie/Settings/Sounds wrappers) is present. **[inf]** The
  code was shared with an iOS build.
- **[obs]** The only launcher activity is `com.dchoc.DCiDead`, forced to landscape (`E-package`).

## Main loop

**[obs]** One thread (`DChocMIDlet.run`, `E-run`) repeats this until the app exits:

1. If a call interrupted the app, stop all audio and skip the frame.
2. On the first pass: create an 8-slot frame-time table, reset the timer, initialize the toolkit, then send the
   *start* app event.
3. On resume: send the *resume* app event and request a repaint.
4. When the app is not paused and the previous frame has been painted (or textures are still loading):
   - compute `dt` (see below),
   - process buffered key/touch events,
   - call `logicUpdate(dt)` on the active controller (unless that step is skipped),
   - then request a repaint.
5. Sleep 1 ms.

**[obs]** The renderer clears the "ok to paint" flag at the end of every drawn frame (`E-onDrawFrame`).
**[inf]** So the game runs **one logic update per rendered frame**, with a **variable time step**. It does not
use a fixed tick rate.

### Time step (`dt`), in milliseconds

**[obs]** (`E-updateTimer`, `E-realDelta`)

- `raw` = milliseconds since the previous update, from the wall clock.
- `dt` = **average of the last 8 `raw` values, each capped at 500 ms**. A running sum is kept, and the oldest
  sample is swapped out each frame.
- The uncapped latest sample is also kept ("real delta time") for code that needs it.

**For the rebuild:** call `update(dt)` once per `requestAnimationFrame` and compute `dt` exactly this way. The
game's simulation timing then matches the original at any frame rate.

### Who receives `logicUpdate`

**[obs]** `GameEngine.logicUpdate` has one static caller, `idead.Game.logicUpdate` (`E-refs-ge`).
`Game.logicUpdate` has no static callers (`E-refs-game`). **[inf]** It is called through the
`toolkit.IController` interface, which declares `logicUpdate`, `doDraw`, `keyEventOccurred` and
`pointerEventOccurred` (`E-IController`).

## Game engine states

**[obs]** `GameEngine.logicUpdate(dt)` first updates an FPS counter, then runs a state machine (`E-ge-logic`):

| State | Behavior observed |
| ----- | ----------------- |
| 0 | Loading. Runs one numbered load step per frame (`load(step++)`). See *Startup* below. |
| 1 | Load the **home scene** from the local saved record `SceneLoader.RMS_GAMEFIELD`, refresh neighbors, then go to 2. |
| 2 | **[inf]** Playing at home (not yet traced). |
| 3 | Loading a neighbor. Neighbor type **2514** is the built-in neighbor "Rob" (`RobsPlace`), loaded locally. Other neighbors wait for the `VisitNeighbor` server response. |
| 4 | Visiting a neighbor. |
| 6 | Fatal "home scene corruption" error. |
| 8 | Confirmation dialog for the "AZL237" scene-replacement fix. |
| 10 | Scene reset: grants 250 in-app cash, overwrites the saved scene and mission records with defaults, then goes to 11. |
| 11 | Exit/restart pending. |

Other per-frame work in states other than 6/10/11 **[obs]**: if a save was requested, the game state is saved
first. Saves go through named records (`Toolkit.writeRecordByteArray`, stored in an SQLite table on Android):
`RMS_PROFILE`, `RMS_GAMEFIELD` for the scene and `RMS_MISSIONS` for missions. Nothing is saved before the
tutorial is completed. Formats and storage: [scenes-and-saves.md](scenes-and-saves.md).

### Startup (state 0)

**[obs]** `GameEngine.load(step)` runs once per frame with the step increasing by 1. Only these steps do anything
(`E-ge-load`):

| Step | Work |
| ---- | ---- |
| 0 | Show the activity spinner. `Tuner.init`: reads GAMESETUP, DEFAULTGIFTITEMS, LEVELS and COMBOMETER. |
| 10 | Create the Facebook, Game Center and Twitter wrappers |
| 20 | Animations manager |
| 30 | Item manager |
| 50 | Player profile. **Sends `CreateNewSession` without waiting for the reply.** Scene init. |
| 60 | Events, spawning, missions |
| 70 | HUD |
| 80 | Load the home scene from the saved record `RMS_GAMEFIELD`. If there is none (first launch), load the default layout `RID_CSV_BINARY_GAMEFIELDSETUP` (`r1` entry 18723). Flag the "AZL237" fix if needed. |
| 85 | Load missions. Set up payments. |
| 90 | Tutorial flow. If mission 5 is completed (or its mission state is 2), add Rob. |
| 99 | Loading done: analytics events, then go to state 5 (intro) or 2 (playing), wait for textures, start the background music `sound_file_bg`. |

**[inf]** Loading therefore takes about 100 frames whatever the device speed.

### Offline behavior

**[obs]** The game **starts and plays without the server**:

- `CreateNewSession` is sent asynchronously and loading carries on (`E-sr-execute`, `E-ge-load`). If the reply isn't
  HTTP 200, the request only sets an "offline mode" flag (`E-cns-response`).
- That flag is used in exactly one place (`E-refs-offline`, `E-hud-callback`): the first time the player opens the
  neighbors window from the HUD, an NPC dialog (#3) is shown first, then the window opens. The flag is cleared
  after it has been shown once (`E-cns-offline`).
- A session ID, and with it account information and timers, only arrives in a successful reply
  (`E-cns-endElement`). Without it, `isConnected()` stays false.
- The home scene and missions come from local records. Rob's place is local.

**For the rebuild:** treat the game as permanently offline and show the same NPC message where social features
would be.

## Rendering

**[obs]** (`E-onDrawFrame`, `E-DCRenderer`)

- An OpenGL ES 1.1 `GLSurfaceView` renderer. Each frame sets a **2D orthographic projection** from (0, 0) to
  (width, height), then calls the current J2ME `Displayable.paint(Graphics)`. That `Graphics` is a GL-backed
  implementation (`lcdui.GLGraphics`).
- Textures are loaded and unloaded lazily on the GL thread from queues. A texture is identified by its filename.
- While paused, or during the first 5 frames, the screen is cleared to white.

**For the rebuild:** all game drawing goes through a J2ME-style 2D `Graphics` API (images, regions, text,
fills). This maps directly onto **HTML Canvas 2D**. Implement a small `Graphics` adapter instead of porting the GL
layer.

## Unknowns and next probes

- **[?]** What happens in state 2 per frame: scene update order, spawning, missions. Trace
  `IsometricScene.logicUpdate`, `SpawningManager` and `MissionManager` updates. Scene layout, projection and draw
  order are in [scenes-and-saves.md](scenes-and-saves.md).
- **[?]** Screen size and scaling: the reference resolution and letterboxing (`DChocMIDlet` has `LETTERBOX_*`
  constants and `drawLetterBox`).
- **[?]** Input mapping: touch, drag and pinch gestures (`GESTURE_INDEX_*`).
