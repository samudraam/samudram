# Issue 4: Consolidate duplicated video-ready logic

**Labels:** `refactor`, `loader`

## Problem

Video readiness is implemented three times with slightly different thresholds:

| File | Logic |
|------|-------|
| `src/loader.js` | `markVideoReady`, `waitForVideoReady`, `waitForHeavyAssets` |
| `src/media-ready.js` | `markVideoReady`, `initVideoReadyState` + debug logging |
| `src/project-detail.js` | `initProjectVideoReadyState` (uses `HAVE_METADATA` instead of `HAVE_CURRENT_DATA`) |

On `index.html` and `contact.html`, both `loader.js` and `media-ready.js` scan the same videos.

## Expected

Single shared module (`src/video-ready.js`) exported and used by all three consumers.

## Fix

- Create `src/video-ready.js` with shared exports
- Slim `media-ready.js` to a DOMContentLoaded entry point
- Import `waitForHeavyAssets` in `loader.js`
- Import `initVideoReadyState` in `project-detail.js`

## Files

- `src/video-ready.js` (new)
- `src/media-ready.js`
- `src/loader.js`
- `src/project-detail.js`
