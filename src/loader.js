/**
 * Automatic frost overlay that smoothly clears on page load.
 */

const UNFROST_DURATION_MS = 2100;

/**
 * Returns true when the user prefers reduced motion.
 * @returns {boolean}
 */
const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Removes the frost overlay and restores normal page interaction.
 * @param {HTMLElement} loader - Frost overlay element.
 */
const dismissLoader = (loader) => {
  loader.setAttribute("aria-hidden", "true");
  loader.remove();
  document.body.classList.remove("is-loading");
};

/**
 * Initializes the automatic frost reveal on pages that include it.
 */
const initFrostLoader = () => {
  const loader = document.getElementById("frost-loader");

  if (!(loader instanceof HTMLElement)) {
    document.body.classList.remove("is-loading");
    return;
  }

  if (prefersReducedMotion()) {
    dismissLoader(loader);
    return;
  }

  loader.addEventListener("animationend", () => dismissLoader(loader), { once: true });

  window.setTimeout(() => {
    if (document.body.contains(loader)) {
      dismissLoader(loader);
    }
  }, UNFROST_DURATION_MS + 120);
};

document.addEventListener("DOMContentLoaded", initFrostLoader);
