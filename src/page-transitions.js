/**
 * page-transitions.js
 * ===================
 * PURPOSE: Entry point included by every page. Wires the curtains stagger
 * wipe (curtains.js) into real navigation: reveals the page from behind
 * the boot cover on load, and intercepts internal link clicks so leaving
 * a page plays the covering wipe first.
 *
 * A single delegated click listener on document covers every internal
 * link — the pill nav, the project cards that projects-list.js injects
 * after load, and the back link on the project detail page — without
 * needing to rebind anything when content changes.
 *
 * FUNCTIONS:
 * - findAnchor(eventTarget)   Walks up from a click target to its <a>.
 * - shouldIntercept(anchor, event) Filters clicks the wipe should handle.
 * - handleLinkClick(event)    Delegated listener running the wipe.
 * - initPageTransitions()     Entry point, runs immediately.
 */

import {
  initCurtainReveal,
  navigateWithCurtains,
  resetCurtains,
} from "./curtains.js";

/**
 * Returns the anchor element a click landed on, if any.
 * @param {EventTarget | null} eventTarget
 * @returns {HTMLAnchorElement | null}
 */
const findAnchor = (eventTarget) => {
  if (!(eventTarget instanceof Element)) {
    return null;
  }

  const anchor = eventTarget.closest("a[href]");
  return anchor instanceof HTMLAnchorElement ? anchor : null;
};

/**
 * Decides whether a link click should run the curtain wipe.
 * Plain left-clicks on same-origin page links qualify; new-tab clicks
 * (modifier keys, target="_blank"), downloads, external links, and
 * same-page hash jumps keep their native behavior.
 * @param {HTMLAnchorElement} anchor
 * @param {MouseEvent} event
 * @returns {boolean}
 */
const shouldIntercept = (anchor, event) => {
  if (event.defaultPrevented || event.button !== 0) {
    return false;
  }

  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
    return false;
  }

  if (anchor.target === "_blank" || anchor.hasAttribute("download")) {
    return false;
  }

  const destination = new URL(anchor.href, window.location.href);

  if (destination.origin !== window.location.origin) {
    return false;
  }

  // In-page hash navigation should jump natively, not wipe.
  if (
    destination.pathname === window.location.pathname &&
    destination.hash !== ""
  ) {
    return false;
  }

  return true;
};

/**
 * Delegated click handler that plays the wipe before navigating.
 * @param {MouseEvent} event
 */
const handleLinkClick = (event) => {
  const anchor = findAnchor(event.target);

  if (!anchor || !shouldIntercept(anchor, event)) {
    return;
  }

  event.preventDefault();

  const destination = new URL(anchor.href, window.location.href);
  const isSamePage =
    destination.pathname === window.location.pathname &&
    destination.search === window.location.search;

  // Re-clicking the current page's nav link does nothing (no reload).
  if (isSamePage) {
    return;
  }

  navigateWithCurtains(destination.href);
};

/**
 * Hooks up the reveal, link interception, and bfcache recovery.
 */
const initPageTransitions = () => {
  document.addEventListener("DOMContentLoaded", initCurtainReveal);
  document.addEventListener("click", handleLinkClick);

  // Back/forward restores from bfcache resurrect the page exactly as it
  // was left — often mid-cover after navigateWithCurtains. Reset so the
  // restored page is immediately visible and interactive.
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
      resetCurtains();
    }
  });
};

initPageTransitions();
