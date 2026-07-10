/**
 * media-ready.js
 * ==============
 * PURPOSE: Prevents background videos from flashing while they load.
 * style.css hides every <video> until it has the "is-media-ready" class;
 * this script watches each video on the page and adds that class once the
 * first frame of data is available. Also contains temporary debug logging
 * (the "agent log" regions) used during local development.
 *
 * Native <video> elements are always `:defined`, so Shoelace's
 * `:not(:defined)` rule does not cover media load flash on its own.
 *
 * FUNCTIONS:
 * - postAgentDebugLog(hypothesisId, message, data) Sends debug info to a
 *                              local log collector (localhost only).
 * - getVideoDebugState(video)  Captures a video's playback state for logs.
 * - markVideoReady(video)      Adds the class that makes the video visible.
 * - initVideoReadyState(video) Reveals the video now, or waits for its
 *                              loadeddata/canplay events.
 * - initMediaReady()           Entry point: finds all page videos and wires
 *                              them up, runs on DOMContentLoaded.
 */

const MEDIA_READY_CLASS = "is-media-ready";
const MIN_READY_STATE = HTMLMediaElement.HAVE_CURRENT_DATA;
const DEBUG_ENDPOINT =
  "http://127.0.0.1:7547/ingest/96b32e8d-a64f-4e20-aa21-99c92673c97b";
const DEBUG_SESSION_ID = "32ef22";
const DEBUG_RUN_ID = "shared-video-pre-fix";
const DEBUG_HOSTS = new Set(["localhost", "127.0.0.1"]);

/**
 * Sends temporary shared video diagnostics to the debug log collector.
 * @param {string} hypothesisId - Hypothesis being tested.
 * @param {string} message - Short diagnostic message.
 * @param {Record<string, unknown>} data - Safe runtime details.
 */
const postAgentDebugLog = (hypothesisId, message, data) => {
  if (!DEBUG_HOSTS.has(window.location.hostname)) {
    return;
  }

  fetch(DEBUG_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Debug-Session-Id": DEBUG_SESSION_ID,
    },
    body: JSON.stringify({
      sessionId: DEBUG_SESSION_ID,
      runId: DEBUG_RUN_ID,
      hypothesisId,
      location: "src/media-ready.js",
      message,
      data,
      timestamp: Date.now(),
    }),
  }).catch(() => {});
};

/**
 * Returns the current state of a video element.
 * @param {HTMLVideoElement} video - Target video.
 * @returns {Record<string, unknown>}
 */
const getVideoDebugState = (video) => ({
  src: video.getAttribute("src") ?? "",
  currentSrc: video.currentSrc,
  resolvedSrc: video.src,
  readyState: video.readyState,
  networkState: video.networkState,
  paused: video.paused,
  muted: video.muted,
  autoplay: video.autoplay,
  loop: video.loop,
  playsInline: video.playsInline,
  controls: video.controls,
  className: video.className,
  visibility: getComputedStyle(video).visibility,
  display: getComputedStyle(video).display,
  error: video.error
    ? { code: video.error.code, message: video.error.message }
    : null,
});

/**
 * Marks a video element as ready to display.
 * @param {HTMLVideoElement} video - Target background video.
 */
const markVideoReady = (video) => {
  video.classList.add(MEDIA_READY_CLASS);
  // #region agent log
  postAgentDebugLog("H2", "shared video marked visible", {
    video: getVideoDebugState(video),
  });
  // #endregion
};

/**
 * Waits for a video to have frame data, then reveals it.
 * @param {HTMLVideoElement} video - Target background video.
 */
const initVideoReadyState = (video) => {
  // #region agent log
  postAgentDebugLog("H1,H2,H3,H5", "shared video init state", {
    pageUrl: window.location.href,
    baseUri: document.baseURI,
    video: getVideoDebugState(video),
  });
  // #endregion

  if (video.readyState >= MIN_READY_STATE) {
    markVideoReady(video);
    return;
  }

  ["loadstart", "loadeddata", "canplay", "playing", "pause", "stalled", "suspend", "error"].forEach(
    (eventName) => {
      video.addEventListener(eventName, () => {
        // #region agent log
        postAgentDebugLog("H1,H2,H3", `shared video ${eventName}`, {
          video: getVideoDebugState(video),
        });
        // #endregion
      });
    },
  );

  video.addEventListener("loadeddata", () => markVideoReady(video), { once: true });
  video.addEventListener("canplay", () => markVideoReady(video), { once: true });
};

/**
 * Initializes visibility handling for all page videos.
 */
const initMediaReady = () => {
  const videos = [...document.querySelectorAll("video")].filter(
    (video) => video instanceof HTMLVideoElement,
  );

  // #region agent log
  postAgentDebugLog("H4,H5", "shared media scan complete", {
    pageUrl: window.location.href,
    videoCount: videos.length,
  });
  // #endregion

  videos.forEach(initVideoReadyState);
};

document.addEventListener("DOMContentLoaded", initMediaReady);
