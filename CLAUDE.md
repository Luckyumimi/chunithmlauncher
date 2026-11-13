# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

**Build and publish:**
```powershell
.\publish.ps1
```
Output appears in `artifacts\publish\`. This builds the WPF host application and bundles the WebView2 frontend.

**Set version:**
```powershell
.\set-version.ps1
```

**Run from source:**
The application is a WPF .NET 10 project. Open in Visual Studio or Rider and run `ChunithmLauncher.Bootstrapper` as the startup project.

## Architecture Overview

This is a **CHUNITHM game launcher** with automatic resolution switching capabilities. The architecture uses a hybrid approach that separates system-level operations from UI presentation:

### Layer Structure

```
┌─────────────────────────────────────┐
│   UI Layer (Presentation)           │
│   WebView2 + HTML/CSS/JS            │
│   Location: ui/ directory           │
└──────────────┬──────────────────────┘
               │ JSON message bridge
┌──────────────▼──────────────────────┐
│   Host Service Layer                │
│   WPF / .NET 10                     │
│   - DisplayManager                  │
│   - ProcessWatcher                  │
│   - ConfigStore                     │
└──────────────┬──────────────────────┘
               │ System calls
┌──────────────▼──────────────────────┐
│   System / External                 │
│   EnumDisplayDevices                │
│   ChangeDisplaySettings             │
│   Game process monitoring           │
└─────────────────────────────────────┘
```

### Key Components

**1. DisplayManager (Host Service)**
- Enumerates displays via `EnumDisplayDevices`
- Reads/writes display resolution modes
- Supports 60Hz/120Hz switching
- Restores original resolution after game closes

**2. ProcessWatcher (Host Service)**
- Pre-launch: validates runtime → reads original resolution → switches to target resolution → launches start.bat
- During: monitors game window handle and process
- Post-close: detects window disappearance → waits for stability → restores original resolution

**3. ConfigStore (Host Service)**
- Persists configuration to local storage
- Key settings: start.bat path, display modes, theme, language, launch options
- Frontend writes via `save-settings` message → host persists → `init` message returns config on next launch

**4. Frontend (ui/ directory)**
- Static HTML/CSS/JS hosted in WebView2
- View stack routing with `data-view` and `data-view-panel` attributes
- Current views: Home, Aime, and Settings
- Home retains the event carousel and latest-news panel
- Communicates with host via WebView2 message bridge (JSON)

### Frontend Module Breakdown

| Module | Responsibility | Key Files |
|--------|---------------|-----------|
| Navigation | Sidebar routing, view stack switching | `app.js`, `index.html` |
| Launch Control | Target resolution cards, launch mode selector | `app.js` |
| Home | Event carousel, latest news | `app.js`, `index.html` |
| Aime | Local reader setup guide | `index.html` |
| Settings | Form binding, dropdowns, persistence | `app.js` |
| i18n | Language switching, DOM sync | `app.js`, `i18n-translations.json` |

## Important Context

**This is a graduation project (毕设).** The repository contains both:
- A functional Windows launcher application (primary deliverable)
- Extensive Chinese-language documentation for academic submission
- UI design process documentation (strategy, sketches, specifications)
- Exhibition materials and project reports

**License:** AGPL-3.0 open source

**Target Resolutions:**
- Primary: 1920×1080 (Windows game standard)
- Also supports: 2560×1440, 1280×800

**Dependencies:**
- .NET Desktop Runtime 10 x64 (required)
- WebView2 Runtime (required)
- Windows 10/11 (host application)

## Configuration Persistence Pattern

Settings flow: Frontend form → `save-settings` JSON message → Host writes to config file → Next launch: host sends `init` message with config → Frontend restores state

This ensures consistency across restarts and prevents frontend from directly accessing the filesystem.

## i18n System

- Supports 7 languages plus "follow system"
- All strings defined in `i18n-translations.json`
- Language key stored in config as `chunithm-language`
- DOM updates happen synchronously on language change
- Text references use `UI_TEXT` object in `app.js`

## Theme System

- Light/dark mode stored as `chunithm-theme`
- Custom theme color (default: #fdd500 - CHUNITHM yellow)
- Custom background images supported (local path or URL)
- CSS uses CSS custom properties for dynamic theming

## Working with SVG/Visual Files

**CRITICAL: When editing SVG, image, or any visual/design files, you MUST visually inspect the output after making changes.**

After any modification to SVG files or visual design files:
1. Render the file to a viewable format (PNG, display in browser, etc.)
2. Actually look at the rendered output with your multimodal vision capabilities
3. Verify that shapes, positioning, and layout are correct
4. Compare with the original if available
5. Only report completion after visual verification

Do NOT assume changes are correct based on code syntax alone. Visual files require visual verification.

## Non-Obvious Patterns

**View Switching:**
All views use a unified attribute-based routing system. Navigation buttons have `data-view="viewname"` and corresponding panels have `data-view-panel="viewname"`. The `.active` class controls visibility. This keeps routing logic centralized and declarative.

**Resolution Switching Timing:**
The launcher must switch resolution BEFORE launching the game process, not after. The game reads display settings at startup and won't adapt if changed during runtime. Post-game restoration happens after detecting window closure + stability delay.

**WebView2 Message Bridge:**
All host-frontend communication uses structured JSON messages. The host exposes a message handler to WebView2's `window.chrome.webview.postMessage()`. Messages are bidirectional but asynchronous.

**start.bat Indirection:**
The launcher doesn't directly execute the game EXE. It launches a user-provided `start.bat` script which may include segatools injection, ALL.Net server configuration, or other arcade-specific setup. This abstraction keeps the launcher game-version-agnostic.
