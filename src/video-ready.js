/**
 * video-ready.js
 * ==============
 * PURPOSE: Shared helpers that prevent videos from flashing before their
 * first frame is available. CSS hides <video> until the is-media-ready class
 * is applied; these functions add that class at the right time.
 *
 * EXPORTS:
 * - MEDIA_READY_CLASS              Class name applied when a video can display.
 * - DEFAULT_MEDIA_READY_TIMEOUT_MS Max wait before the loader gives up.
 * - markVideoReady(video)          Adds the visibility class immediately.
 * - shouldWaitForVideo(video)      True when frame data must load first.
 * - getPageVideos()                All HTMLVideoElement nodes on the page.
 * - initVideoReadyState(video)     Reveals a video now or on loadeddata.
 * - waitForVideoReady(video)       Promise that resolves when a video is ready.
 * - waitForHeavyAssets(timeoutMs)  Waits for all page videos, capped by timeout.
 */

export const MEDIA_READY_CLASS = "is-media-ready";
export const MIN_READY_STATE = HTMLMediaElement.HAVE_CURRENT_DATA;
export const DEFAULT_MEDIA_READY_TIMEOUT_MS = 4200;

/**
 * Adds the class that makes a video visible in CSS.
 * @param {HTMLVideoElement} video
 */
export const markVideoReady = (video) => {
  video.classList.add(MEDIA_READY_CLASS);
};

/**
 * Returns true when a video needs frame data before it should be shown.
 * @param {HTMLVideoElement} video
 * @returns {boolean}
 */
export const shouldWaitForVideo = (video) => video.autoplay || !video.poster;

/**
 * Returns every video element on the current page.
 * @returns {HTMLVideoElement[]}
 */
export const getPageVideos = () =>
  [...document.querySelectorAll("video")].filter(
    (video) => video instanceof HTMLVideoElement,
  );

/**
 * Reveals a video immediately or once loadeddata/canplay fires.
 * @param {HTMLVideoElement} video
 */
export const initVideoReadyState = (video) => {
  if (video.readyState >= MIN_READY_STATE) {
    markVideoReady(video);
    return;
  }

  const handleReady = () => {
    markVideoReady(video);
  };

  video.addEventListener("loadeddata", handleReady, { once: true });
  video.addEventListener("canplay", handleReady, { once: true });
};

/**
 * Resolves once a video has enough data to display its first frame.
 * @param {HTMLVideoElement} video
 * @returns {Promise<void>}
 */
export const waitForVideoReady = (video) =>
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
 * Waits for all page videos without trapping users on the loader forever.
 * @param {number} [timeoutMs]
 * @returns {Promise<void>}
 */
export const waitForHeavyAssets = (
  timeoutMs = DEFAULT_MEDIA_READY_TIMEOUT_MS,
) => {
  const videos = getPageVideos();

  if (videos.length === 0) {
    return Promise.resolve();
  }

  const timeout = new Promise((resolve) => {
    window.setTimeout(resolve, timeoutMs);
  });

  return Promise.race([
    Promise.allSettled(videos.map(waitForVideoReady)),
    timeout,
  ]).then(() => undefined);
};
