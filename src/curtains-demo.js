/**
 * curtains-demo.js
 * ================
 * PURPOSE: Wires the curtains-demo.html buttons to playCurtainTransition.
 * The "page change" here is a fake one — we swap heading and body text
 * while the screen is covered — but the same call wraps real navigation:
 * pass a function that sets window.location, or your SPA router's
 * navigate(), as the transitionFn.
 *
 * FUNCTIONS:
 * - applyPage(page)     Writes a page's text into the DOM.
 * - handleNavClick(key) Plays the wipe around the fake page swap.
 * - initCurtainsDemo()  Entry point, runs on DOMContentLoaded.
 */

import { playCurtainTransition, setupCurtains } from "./curtains.js";

/** Fake "pages" for the demo — swap for real routes in an app. */
const PAGES = {
  one: {
    title: "Page One",
    copy:
      "Click a button to play the stagger wipe. Panels slide up to cover " +
      "the screen, the content swaps while hidden, then the panels " +
      "continue off the top to reveal it.",
  },
  two: {
    title: "Page Two",
    copy:
      "This content was swapped while the curtains covered the viewport. " +
      "The whole transition is one awaited Promise, so navigation code " +
      "can run at exactly the right moment.",
  },
};

/**
 * Writes a page's content into the demo card.
 * @param {{ title: string, copy: string }} page
 */
const applyPage = (page) => {
  document.getElementById("demo-title").textContent = page.title;
  document.getElementById("demo-copy").textContent = page.copy;
};

/**
 * Plays the curtain wipe around a fake page swap.
 * playCurtainTransition returns a Promise that resolves after the OUT
 * phase, so callers could await it here to chain further work.
 * @param {keyof typeof PAGES} pageKey
 */
const handleNavClick = (pageKey) => {
  playCurtainTransition(() => {
    applyPage(PAGES[pageKey]);
  });
};

/**
 * Hooks up demo buttons and pre-creates the overlay.
 */
const initCurtainsDemo = () => {
  setupCurtains();

  document
    .getElementById("go-page-two")
    .addEventListener("click", () => handleNavClick("two"));
  document
    .getElementById("go-page-one")
    .addEventListener("click", () => handleNavClick("one"));
};

document.addEventListener("DOMContentLoaded", initCurtainsDemo);
