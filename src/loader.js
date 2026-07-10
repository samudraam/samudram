/**
 * loader.js
 * =========
 * PURPOSE: Controls the full-screen "dive" loading overlay (#frost-loader).
 * On pages that include it, the overlay covers the screen until the page
 * has rendered and its videos have loaded (or a timeout passes), then plays
 * a circular reveal animation and removes itself. Users who prefer reduced
 * motion skip the animation and get an instant reveal.
 *
 * FUNCTIONS:
 * - prefersReducedMotion()      Checks the reduced-motion preference.
 * - markVideoReady(video)       Adds the class that makes a video visible.
 * - shouldWaitForVideo(video)   Decides if a video must load before reveal.
 * - waitForVideoReady(video)    Resolves once a video can show its first
 *                               frame.
 * - waitForHeavyAssets()        Waits for all page videos, capped by a
 *                               timeout so users are never stuck.
 * - waitForPageRender()         Waits two animation frames so dynamically
 *                               injected media is included in the scan.
 * - dismissLoader(loader)       Removes the overlay and unlocks scrolling.
 * - revealPage(loader)          Plays the circular dive-reveal animation.
 * - initDiveLoader()            Entry point, runs on DOMContentLoaded.
 */

const DIVE_REVEAL_DURATION_MS = 1800;
const MEDIA_READY_TIMEOUT_MS = 4200;
const MEDIA_READY_CLASS = "is-media-ready";
const MIN_READY_STATE = HTMLMediaElement.HAVE_CURRENT_DATA;

/**
 * Returns true when the user prefers reduced motion.
 * @returns {boolean}
 */
const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Marks video as ready for display.
 * @param {HTMLVideoElement} video
 */
const markVideoReady = (video) => {
  video.classList.add(MEDIA_READY_CLASS);
};

/**
 * Returns true when a video needs frame data before the page reveal.
 * @param {HTMLVideoElement} video
 * @returns {boolean}
 */
const shouldWaitForVideo = (video) => video.autoplay || !video.poster;

/**
 * Resolves once a video has enough data to display its first frame.
 * @param {HTMLVideoElement} video
 * @returns {Promise<void>}
 */
const waitForVideoReady = (video) =>
  new Promise((resolve) => {
    if (!shouldWaitForVideo(video)) {
      markVideoReady(video);
      resolve();
      return;
    }

    if (video.readyState >= MIN_READY_STATE) {
      markVideoReady(video);
      resolve();
      return;
    }

    const handleReady = () => {
      markVideoReady(video);
      resolve();
    };

    video.addEventListener("loadeddata", handleReady, { once: true });
    video.addEventListener("canplay", handleReady, { once: true });
  });

/**
 * Waits for page video assets without trapping users on the loader.
 * @returns {Promise<void>}
 */
const waitForHeavyAssets = () => {
  const videos = [...document.querySelectorAll("video")].filter(
    (video) => video instanceof HTMLVideoElement,
  );

  if (videos.length === 0) {
    return Promise.resolve();
  }

  const timeout = new Promise((resolve) => {
    window.setTimeout(resolve, MEDIA_READY_TIMEOUT_MS);
  });

  return Promise.race([
    Promise.allSettled(videos.map(waitForVideoReady)),
    timeout,
  ]).then(() => undefined);
};

/**
 * Lets earlier DOMContentLoaded work inject dynamic media before scanning.
 * @returns {Promise<void>}
 */
const waitForPageRender = () =>
  new Promise((resolve) => {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(resolve);
    });
  });

/**
 * Removes the dive overlay and restores normal page interaction.
 * @param {HTMLElement} loader - Dive overlay element.
 */
const dismissLoader = (loader) => {
  loader.setAttribute("aria-hidden", "true");
  loader.remove();
  document.body.classList.remove("is-loading");
};

/**
 * Starts the circular dive reveal.
 * @param {HTMLElement} loader
 */
const revealPage = (loader) => {
  document.body.classList.add("is-dive-revealing");
  loader.classList.add("frost-loader--revealing");

  loader.addEventListener(
    "animationend",
    () => {
      document.body.classList.remove("is-dive-revealing");
      dismissLoader(loader);
    },
    { once: true },
  );

  window.setTimeout(() => {
    if (document.body.contains(loader)) {
      document.body.classList.remove("is-dive-revealing");
      dismissLoader(loader);
    }
  }, DIVE_REVEAL_DURATION_MS + 180);
};

/**
 * Initializes the automatic dive reveal on pages that include it.
 */
const initDiveLoader = async () => {
  const loader = document.getElementById("frost-loader");

  if (!(loader instanceof HTMLElement)) {
    document.body.classList.remove("is-loading");
    return;
  }

  if (prefersReducedMotion()) {
    await waitForPageRender();
    await waitForHeavyAssets();
    dismissLoader(loader);
    return;
  }

  await waitForPageRender();
  await waitForHeavyAssets();
  revealPage(loader);
};

document.addEventListener("DOMContentLoaded", initDiveLoader);
