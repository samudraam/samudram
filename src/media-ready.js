/**
 * Reveals background videos once the first frame is available.
 * Native `<video>` elements are always `:defined`, so Shoelace's
 * `:not(:defined)` rule does not cover media load flash on its own.
 */

const MEDIA_READY_CLASS = "is-media-ready";
const MIN_READY_STATE = HTMLMediaElement.HAVE_CURRENT_DATA;

/**
 * Marks a video element as ready to display.
 * @param {HTMLVideoElement} video - Target background video.
 */
const markVideoReady = (video) => {
  video.classList.add(MEDIA_READY_CLASS);
};

/**
 * Waits for a video to have frame data, then reveals it.
 * @param {HTMLVideoElement} video - Target background video.
 */
const initVideoReadyState = (video) => {
  if (video.readyState >= MIN_READY_STATE) {
    markVideoReady(video);
    return;
  }

  video.addEventListener("canplay", () => markVideoReady(video), { once: true });
};

/**
 * Initializes visibility handling for all page videos.
 */
const initMediaReady = () => {
  document.querySelectorAll("video").forEach(initVideoReadyState);
};

document.addEventListener("DOMContentLoaded", initMediaReady);
