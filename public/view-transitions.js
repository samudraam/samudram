/**
 * Cross-document view transition helpers.
 * Pauses background video before page swap and absorbs expected AbortError
 * rejections when the browser skips a transition.
 */
(function initViewTransitions() {
  if (window.__viewTransitionsReady) {
    return;
  }

  window.__viewTransitionsReady = true;

  var prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReducedMotion) {
    return;
  }

  /**
   * Prevents skipped transitions from surfacing as unhandled promise rejections.
   * @param {ViewTransition | null | undefined} viewTransition
   */
  var silenceSkippedTransition = function (viewTransition) {
    if (!viewTransition) {
      return;
    }

    viewTransition.finished.catch(function () {});
    viewTransition.ready?.catch?.(function () {});
    viewTransition.updateCallbackDone?.catch?.(function () {});
  };

  window.addEventListener("pageswap", function (event) {
    document.querySelectorAll(".background video").forEach(function (video) {
      if (video instanceof HTMLVideoElement) {
        video.pause();
      }
    });

    silenceSkippedTransition(event.viewTransition);
  });

  window.addEventListener("pagereveal", function (event) {
    silenceSkippedTransition(event.viewTransition);
  });
})();
