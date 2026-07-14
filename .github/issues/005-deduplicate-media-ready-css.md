# Issue 5: Deduplicate is-media-ready CSS rules

**Labels:** `cleanup`, `loader`, `css`

## Problem

These rules are duplicated in both `src/style.css` and `src/theme.css`:

```css
:not(:defined) { visibility: hidden; }
video:not(.is-media-ready) { visibility: hidden; }
```

Both files already `@import "./loader.css"`, so the rules can live in one place.

## Expected

Single source of truth for media-ready visibility rules in `loader.css`.

## Fix

Move shared rules to `loader.css` and remove duplicates from `style.css` and `theme.css`. Keep `.is-media-ready { position: relative; z-index: 10; }` in `loader.css` (currently only in `theme.css`).

## Files

- `src/loader.css`
- `src/style.css`
- `src/theme.css`
