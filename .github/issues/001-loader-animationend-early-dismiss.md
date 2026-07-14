# Issue 1: Loader dismisses on wrong animationend event

**Labels:** `bug`, `loader`

## Problem

`revealPage()` in `src/loader.js` listens for `animationend` with `{ once: true }` but three animations run on `.frost-loader`:

- `diveReveal` (1.8s) on the element
- `diveLogoFade` (0.7s) on `::before`
- `diveSurfacePull` (1.8s) on `::after`

Pseudo-element animations bubble to the parent. `diveLogoFade` finishes first at 0.7s and triggers `dismissLoader()`, cutting the circular reveal short.

## Expected

Loader should only dismiss after `diveReveal` completes (~1.8s).

## Fix

Filter `animationend` by `event.animationName === "diveReveal"` before calling `dismissLoader()`.

## Files

- `src/loader.js`
