# Apollo Editor

> Desktop video & audio editor — React 19 + TypeScript + Vite + Electron

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Interface](#interface)
- [Asset Panel](#asset-panel)
- [Preview Window](#preview-window)
- [Timeline](#timeline)
- [Tracks](#tracks)
- [Clips](#clips)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [Architecture](#architecture)

---

## Overview

Apollo is a desktop non-linear media editor. It lets you import video, audio, and image files, arrange them across multiple timeline tracks, and preview the result in real time — all running natively via Electron.

<!-- SCREENSHOT: Full app window — asset panel on the left, preview on the right -->
> 📸 _Screenshot: main application window_

---

## Tech Stack

| Layer | Library / Tool |
|---|---|
| UI | React 19 + TypeScript |
| Bundler | Vite 8 |
| Desktop shell | Electron 41 |
| File import | react-dropzone |
| Icons | react-icons |
| Styles | SCSS |

---

## Installation

Requires **Node.js 18+**.

```bash
# Clone the repository
git clone https://github.com/your-org/apollo.git
cd apollo

# Install dependencies
npm install

# Start in browser mode (Vite dev server only)
npm run dev

# Start as Electron desktop app
npm run start

# Production build
npm run build
```

> `npm run start` runs Vite and Electron concurrently via `concurrently`. Electron connects to `http://localhost:5173` automatically.

<!-- SCREENSHOT: Terminal output after npm run start -->
> 📸 _Screenshot: terminal showing Vite + Electron startup_

---

## Interface

The layout is divided into two vertical zones:

```
┌─────────────────────────────────────────┐
│  Asset Panel         │  Preview Window  │
│  (ViewPortAssets)    │  (Preview)       │
├─────────────────────────────────────────┤
│           Timeline (TimeLine)           │
│  [Sidebar] [Tracks + Clips + Playhead]  │
└─────────────────────────────────────────┘
```

| Zone | Component | Description |
|---|---|---|
| Asset Panel | `ViewPortAssets` | Browse, search, and filter imported media |
| Preview Window | `Preview_Window` | Renders the current frame at playhead position |
| Timeline | `TimeLine` | Multi-track clip editor |
| Track Sidebar | `TrackSidebar` | Track names and delete buttons |

<!-- SCREENSHOT: Annotated interface with numbered callouts -->
> 📸 _Screenshot: annotated layout showing each panel_

---

## Asset Panel

The asset panel is your project's media library.

### Importing files

Drag files directly into the drop zone, or click the file button (`AddAssets`) to open a picker.  
Accepted types: `image/*`, `video/*`, `audio/*`.

<!-- SCREENSHOT: Asset panel with files loaded and search bar visible -->
> 📸 _Screenshot: populated asset panel_

### Search & filter

Once assets are loaded, a filter bar appears:
- **Search input** — filter by name or asset ID (debounced, 500 ms)
- **Type dropdown** — show all / video / audio / image

### Renaming an asset

Double-click the asset name → edit in place → `Enter` or ✔ to save, `Esc` or ✖ to cancel.

### Dragging to timeline

Grab any asset and drop it onto a track in the timeline. A clip is created at the drop position.

---

## Preview Window

The preview area composites all active layers at `currentTime` and renders them.

- Media synchronization: `useMediaSync` hook watches `currentTime` from `CurrentTimeContext` and seeks all media elements.
- Layers are managed by the `Layers` component inside `Preview`.

<!-- SCREENSHOT: Preview canvas during video playback -->
> 📸 _Screenshot: preview window during playback_

### Playback

Toggle play/pause from the `Options` toolbar or press `Space` while the timeline is focused.

---

## Timeline

The timeline is the main editing surface.

<!-- SCREENSHOT: Timeline with multiple tracks and clips -->
> 📸 _Screenshot: timeline with video, audio, and image clips across multiple tracks_

### Time ruler

Click anywhere on the ruler (`TimeRuler`) to jump the playhead to that position. The preview updates immediately.

### Zoom

Scroll the mouse wheel while the timeline is focused to zoom in/out.  
The `useZoomEffect` hook controls `scale` (pixels per second) and `STEP` (ruler tick interval).

### Adding tracks

Click **+ add Tracks** in the sidebar header to append a new empty track.

---

## Tracks

Tracks are horizontal lanes that hold clips. Apollo starts with **6 default tracks**.

Each track has: `id`, `name`, `clips[]`.

### Color coding by media type

| Type | Color | Hex |
|---|---|---|
| Video | Blue-grey | `#5E7A8C` |
| Audio | Warm brown | `#8C6D5E` |
| Image | Olive green | `#718E5E` |
| Text | Dark brown | `#4F3626` |

### Managing tracks

| Action | How |
|---|---|
| Rename | Double-click track name → `Enter` to save, `Esc` to cancel |
| Delete | Click the **−** button next to the track name |
| Add | Click **+ add Tracks** button |

---

## Clips

A clip (`ClipItem`) is a placed piece of media on the timeline.

**Clip properties:** `id`, `assetId`, `start` (seconds), `duration` (seconds), `type`, `sourceOffset`.

<!-- SCREENSHOT: Selected clip with blue border and resize handles -->
> 📸 _Screenshot: selected clip showing resize handles_

### Actions

| Action | How |
|---|---|
| Select | Click the clip block (blue `#4FC3F7` border appears) |
| Move | Select first, then drag to new position (same or different track) |
| Resize | Drag left or right handle to trim in/out points |
| Rename | Use the edit icon on the clip block |
| Audio fade | Drag the fade handle on audio clips (`FadeClip`) |

> Moving uses `useDragClip`, resizing uses `useResizeClip`.

---

## Keyboard Shortcuts

| Action | Shortcut |
|---|---|
| Play / Pause | `Space` |
| Confirm rename | `Enter` |
| Cancel rename | `Esc` |
| Deselect clip | Click on empty timeline area |

---

## Architecture

State is managed entirely via React Context — no external state library.

```
main.tsx
└── ClipProvider          (ClipContext)
    └── CurrentTimeProvider  (CurrentTimeContext)
        └── PreviewProvider  (PreviewContext)
            └── App
                ├── VIewPort
                │   ├── ViewPortAssets
                │   └── Preview_Window → Preview
                └── TimeLine
                    ├── Options
                    ├── TrackSidebar[]
                    ├── TimeRuler
                    ├── Tracks → TrackRow → ClipItem[]
                    └── Playhead
```

### Contexts

| Context | Responsibility |
|---|---|
| `ClipContext` | Assets, timeline clips, tracks, selected clip ID |
| `CurrentTimeContext` | Playhead position (`currentTime` in seconds) |
| `PreviewContext` | Playback state (`isPlay`), `handlePlay`, `handlePause` |

### Electron

`electron/main.ts` creates a `BrowserWindow` (1200 × 800) and loads `http://localhost:5173` in development.
