# Issue 2: Frost loader has no visible brand text

**Labels:** `bug`, `loader`, `ui`

## Problem

`.frost-loader::before` in `src/loader.css` has full typography styling but `content: ""`, so the overlay shows only the gradient with no label.

## Expected

Loader displays the site brand (e.g. `samudraam`) centered on the overlay before the dive reveal.

## Fix

Set `content: "samudraam"` on `.frost-loader::before` (lowercase via existing `text-transform`).

## Files

- `src/loader.css`
