# Issue 3: Remove debug logging from media-ready.js

**Labels:** `cleanup`, `loader`

## Problem

`src/media-ready.js` still contains temporary agent debug code that POSTs to `localhost:7547` on every video lifecycle event. This should not ship in production.

## Expected

Clean video-ready module with no debug endpoints or agent log regions.

## Fix

Remove `postAgentDebugLog`, `getVideoDebugState`, debug constants, and all `#region agent log` blocks.

## Files

- `src/media-ready.js` (consolidated into `src/video-ready.js`)
