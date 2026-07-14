/**
 * curtains.js
 * ===========
 * PURPOSE: The app-wide "stagger wipe" transition, recreating Motion+'s
 * "Curtains: Stagger wipe" example using ONLY free Motion.js APIs from
 * motion.dev — `animate()` and `stagger()`. No Motion+ helpers are used.
 *
 * This is a multi-page site, so a navigation transition spans two
 * documents: navigateWithCurtains plays the IN phase (panels cover the
 * screen) on the page being left, the browser navigates, and the next
 * page — pre-covered by the static #curtains boot element in its HTML —
 * plays the OUT phase via initCurtainReveal once its content and videos
 * are ready. Same-document transitions (playCurtainTransition) are also
 * supported for demos and SPA-style content swaps.
 *
 * PANEL COLORS: Panels paint from the --curtain-bg CSS variable (see
 * curtains.css), so themed pages automatically wipe in their theme
 * gradient. Each panel shows its slice of ONE viewport-wide gradient via
 * per-panel background-size/position set in createPanels.
 *
 * DIRECTION: y: 100% -> 0 -> -100% wipes bottom-to-top. Swap the axis or
 * signs to change the wipe direction.
 *
 * FUNCTIONS:
 * - getPanelCountForViewport()          Responsive panel count from width.
 * - ensureOverlay()                     Finds or creates #curtains.
 * - createPanels(overlay, count, covering) Builds sliced .curtain columns.
 * - animateIn(panels)                   Slides panels up to cover screen.
 * - animateOut(panels)                  Slides panels off the top.
 * - resetCurtains()                     Clears overlay state (bfcache).
 * - navigateWithCurtains(href)          Cover, then location.href = href.
 * - initCurtainReveal()                 Reveal flow for a fresh page load.
 * - playCurtainTransition(transitionFn) Same-document in/swap/out flow.
 */

import { animate, stagger } from "motion";
import { waitForHeavyAssets } from "./video-ready.js";

/* ------------------------------------------------------------------ */
/* Tweakable constants — durations, easing, stagger, and breakpoints. */
/* ------------------------------------------------------------------ */

/** Duration of each panel's slide, in seconds. */
const PANEL_DURATION_S = 0.55;

/** Delay between consecutive panels, in seconds. Smaller = tighter wave. */
const STAGGER_STEP_S = 0.07;

/** Brief hold at full opaque cover so IN and OUT do not butt together. */
const COVER_HOLD_S = 0.22;

/**
 * Ease-in-out for panel slides — smooth acceleration and deceleration.
 * @type {[number, number, number, number]}
 */
const PANEL_EASE = [0.45, 0, 0.55, 1];

/**
 * Responsive breakpoints (viewport width in px) and their panel counts.
 * - Mobile  (< 640px):        3 panels — wide columns read better small.
 * - Tablet  (640px–1024px):   4 panels.
 * - Desktop (> 1024px):       8 panels for a denser wipe.
 * MAX_PANELS caps the count if you raise DESKTOP_PANELS later.
 */
const TABLET_MIN_WIDTH_PX = 640;
const DESKTOP_MIN_WIDTH_PX = 1024;
const MOBILE_PANELS = 3;
const TABLET_PANELS = 4;
const DESKTOP_PANELS = 8;
const MAX_PANELS = 10;

/** id/class hooks that match curtains.css. */
const OVERLAY_ID = "curtains";
const PANEL_CLASS = "curtain";
const OVERLAY_ACTIVE_CLASS = "curtains--active";
const OVERLAY_BOOT_CLASS = "curtains--boot";

/** Prevents overlapping transitions from fighting over the same panels. */
let isTransitionRunning = false;

/**
 * Returns true when the user prefers reduced motion. They skip the wipe
 * animations and get instant covers/reveals instead.
 * @returns {boolean}
 */
const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Picks the panel count for the CURRENT viewport width.
 *
 * RESIZE BEHAVIOR: Evaluated once at the start of each transition and
 * locked for its duration. Resizing mid-animation does not rebuild panels
 * — flexbox keeps the existing panels covering the full width. The next
 * transition simply picks up the new count.
 * @returns {number}
 */
const getPanelCountForViewport = () => {
  const width = window.innerWidth;

  if (width < TABLET_MIN_WIDTH_PX) {
    return MOBILE_PANELS;
  }

  if (width < DESKTOP_MIN_WIDTH_PX) {
    return TABLET_PANELS;
  }

  return Math.min(DESKTOP_PANELS, MAX_PANELS);
};

/**
 * Finds the overlay (pre-rendered in each page's HTML as the boot cover)
 * or creates it when missing (demo pages).
 * @returns {HTMLElement}
 */
const ensureOverlay = () => {
  const existing = document.getElementById(OVERLAY_ID);

  if (existing instanceof HTMLElement) {
    return existing;
  }

  const overlay = document.createElement("div");
  overlay.id = OVERLAY_ID;
  overlay.setAttribute("aria-hidden", "true");
  document.body.appendChild(overlay);
  return overlay;
};

/**
 * Rebuilds the overlay's panels for the requested count.
 *
 * Gradient slicing: each panel's background image is stretched to
 * (count * 100%) of the panel's width — i.e. the full viewport — and
 * offset so panel i shows slice i. Percentage background positions align
 * fractions of the oversized image with the container, which lands each
 * slice exactly when the offset is i / (count - 1).
 *
 * @param {HTMLElement} overlay
 * @param {number} count
 * @param {boolean} covering - true builds panels already at y: 0
 *   (page starts hidden); false leaves them off-screen below.
 * @returns {HTMLElement[]}
 */
const createPanels = (overlay, count, covering = false) => {
  overlay.replaceChildren();

  return Array.from({ length: count }, (_, index) => {
    const panel = document.createElement("div");
    panel.className = PANEL_CLASS;
    panel.style.backgroundSize = `${count * 100}% 100%`;
    panel.style.backgroundPosition = `${
      count > 1 ? (index / (count - 1)) * 100 : 0
    }% 0%`;

    if (covering) {
      panel.style.transform = "translateY(0%)";
    }

    overlay.appendChild(panel);
    return panel;
  });
};

/**
 * Phase 1 — slides panels up from below to cover the viewport.
 * Motion.js specifics: animate() accepts an element array and applies the
 * same keyframes to each; stagger(step) offsets each element's delay by
 * its index. The returned playback controls are awaitable, which lets the
 * flows below sequence phases with plain async/await.
 * @param {HTMLElement[]} panels
 * @returns {Promise<void>}
 */
const animateIn = async (panels) => {
  await animate(
    panels,
    { y: ["100%", "0%"] },
    {
      duration: PANEL_DURATION_S,
      ease: PANEL_EASE,
      delay: stagger(STAGGER_STEP_S),
    },
  );
};

/**
 * Phase 2 — continues panels upward off the top of the viewport.
 * The stagger starts from the LAST panel (from: "last") so the exit wave
 * sweeps back across the screen in the opposite direction.
 * @param {HTMLElement[]} panels
 * @returns {Promise<void>}
 */
const animateOut = async (panels) => {
  await animate(
    panels,
    { y: ["0%", "-100%"] },
    {
      duration: PANEL_DURATION_S,
      ease: PANEL_EASE,
      delay: stagger(STAGGER_STEP_S, { from: "last" }),
    },
  );
};

/**
 * @param {number} ms
 * @returns {Promise<void>}
 */
const delay = (ms) =>
  new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });

/**
 * Pause at full opaque cover between IN and OUT. No opacity animation —
 * panels and the solid backing stay at 100% so grain, scanlines, and page
 * texture never bleed through during the handoff.
 * @param {() => (Promise<void> | void)} [transitionFn]
 * @returns {Promise<void>}
 */
const holdCoveredBeat = async (transitionFn) => {
  if (transitionFn) {
    await transitionFn();
  }

  await delay(COVER_HOLD_S * 1000);
};

/**
 * Returns the overlay to its idle state: no boot cover, no active state,
 * no panels, scroll unlocked. Used after reveals and for bfcache restores
 * (back/forward navigation resurrects pages exactly as they were left —
 * possibly mid-cover — so page-transitions.js calls this on pageshow).
 */
export const resetCurtains = () => {
  const overlay = document.getElementById(OVERLAY_ID);

  if (overlay instanceof HTMLElement) {
    overlay.classList.remove(OVERLAY_BOOT_CLASS, OVERLAY_ACTIVE_CLASS);
    overlay.replaceChildren();
  }

  document.body.classList.remove("is-loading");
  isTransitionRunning = false;
};

/**
 * Plays the IN phase over the current page, then performs a full
 * cross-document navigation. The destination page loads pre-covered (its
 * static boot element) and reveals itself via initCurtainReveal.
 * @param {string} href - Destination URL.
 * @returns {Promise<void>}
 */
export const navigateWithCurtains = async (href) => {
  if (isTransitionRunning) {
    return;
  }

  if (prefersReducedMotion()) {
    window.location.href = href;
    return;
  }

  isTransitionRunning = true;
  const overlay = ensureOverlay();

  // Panel count is decided HERE, once per transition — never mid-flight.
  const panels = createPanels(overlay, getPanelCountForViewport());
  overlay.classList.add(OVERLAY_ACTIVE_CLASS);

  await animateIn(panels);
  window.location.href = href;
  // No cleanup: the page is unloading, and the cover must persist until
  // the browser swaps documents.
};

/**
 * Reveal flow for a fresh page load. The page starts hidden behind the
 * static boot cover; this swaps it for real panels, waits for rendering
 * and heavy assets, then wipes the panels away.
 *
 * The two animation frames let other DOMContentLoaded work (project list,
 * project detail rendering) inject its DOM and videos before the asset
 * scan — the same trick the old frost loader used. waitForHeavyAssets is
 * capped (4.2s) so a stalled video can never trap users behind curtains,
 * and it also adds is-media-ready to every video, which is why the
 * separate media-ready.js entry point could be deleted.
 * @returns {Promise<void>}
 */
export const initCurtainReveal = async () => {
  const overlay = ensureOverlay();
  const panels = createPanels(overlay, getPanelCountForViewport(), true);

  // Real panels are in place at y: 0; the solid boot cover can go.
  overlay.classList.remove(OVERLAY_BOOT_CLASS);
  overlay.classList.add(OVERLAY_ACTIVE_CLASS);

  await new Promise((resolve) => {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(resolve);
    });
  });
  await waitForHeavyAssets();

  if (!prefersReducedMotion()) {
    await holdCoveredBeat();
    await animateOut(panels);
  }

  resetCurtains();
};

/**
 * Same-document transition: cover, run the swap, reveal. Kept for the
 * demo page and any future SPA-style content changes.
 *
 * The returned Promise resolves after the OUT phase, so callers can
 * `await playCurtainTransition(...)` to sequence follow-up work.
 * @param {() => (Promise<void> | void)} transitionFn - The page change.
 * @returns {Promise<void>}
 */
export const playCurtainTransition = async (transitionFn) => {
  if (isTransitionRunning) {
    return;
  }

  if (prefersReducedMotion()) {
    await transitionFn();
    return;
  }

  isTransitionRunning = true;
  const overlay = ensureOverlay();

  try {
    const panels = createPanels(overlay, getPanelCountForViewport());

    overlay.classList.add(OVERLAY_ACTIVE_CLASS);

    await animateIn(panels);
    await holdCoveredBeat(transitionFn);
    await animateOut(panels);
  } finally {
    overlay.classList.remove(OVERLAY_ACTIVE_CLASS);
    isTransitionRunning = false;
  }
};

/**
 * Optional eager setup — creates the overlay ahead of the first transition
 * so the first play doesn't pay the DOM-creation cost. Safe to skip;
 * every entry point creates the overlay lazily either way.
 */
export const setupCurtains = () => {
  ensureOverlay();
};
