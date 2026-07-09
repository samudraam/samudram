const EMAIL = "r.samudrala234@gmail.com";
const COPIED_LABEL = "copied!";
const COPY_LABEL = "email";

// #region agent log
const AGENT_DEBUG_ENDPOINT =
  "http://127.0.0.1:7547/ingest/96b32e8d-a64f-4e20-aa21-99c92673c97b";
const AGENT_DEBUG_SESSION_ID = "800fcf";

/**
 * Sends temporary contact-page diagnostics to the debug log collector.
 * @param {string} hypothesisId - Hypothesis being tested.
 * @param {string} message - Short diagnostic message.
 * @param {Record<string, unknown>} data - Safe runtime details.
 */
const postAgentDebugLog = (hypothesisId, message, data) => {
  fetch(AGENT_DEBUG_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Debug-Session-Id": AGENT_DEBUG_SESSION_ID,
    },
    body: JSON.stringify({
      sessionId: AGENT_DEBUG_SESSION_ID,
      runId: "initial",
      hypothesisId,
      location: "src/contact.js:postAgentDebugLog",
      message,
      data,
      timestamp: Date.now(),
    }),
  }).catch(() => {});
};

/**
 * Returns contact button measurements that reveal viewport overflow.
 * @returns {Record<string, unknown>}
 */
const getContactLayoutMetrics = () => {
  const actions = document.querySelector(".contact-actions");
  const buttons = [...document.querySelectorAll(".contact-btn")];

  return {
    viewportWidth: window.innerWidth,
    documentScrollWidth: document.documentElement.scrollWidth,
    bodyScrollWidth: document.body.scrollWidth,
    actions: actions instanceof HTMLElement
      ? {
          clientWidth: actions.clientWidth,
          scrollWidth: actions.scrollWidth,
          rect: actions.getBoundingClientRect().toJSON(),
          flexDirection: getComputedStyle(actions).flexDirection,
          gap: getComputedStyle(actions).gap,
        }
      : null,
    buttons: buttons.map((button) => {
      const element = button instanceof HTMLElement ? button : null;
      return {
        text: element?.textContent?.trim(),
        clientWidth: element?.clientWidth,
        scrollWidth: element?.scrollWidth,
        rect: element?.getBoundingClientRect().toJSON(),
        flex: element ? getComputedStyle(element).flex : null,
        fontFamily: element ? getComputedStyle(element).fontFamily : null,
        fontSize: element ? getComputedStyle(element).fontSize : null,
        fontWeight: element ? getComputedStyle(element).fontWeight : null,
        minWidth: element ? getComputedStyle(element).minWidth : null,
        width: element ? getComputedStyle(element).width : null,
      };
    }),
  };
};

/**
 * Returns the background video state relevant to mobile autoplay.
 * @returns {Record<string, unknown>}
 */
const getContactVideoMetrics = () => {
  const video = document.querySelector(".background video");

  if (!(video instanceof HTMLVideoElement)) {
    return { hasVideo: false };
  }

  return {
    hasVideo: true,
    paused: video.paused,
    ended: video.ended,
    muted: video.muted,
    loop: video.loop,
    autoplay: video.autoplay,
    playsInline: video.playsInline,
    readyState: video.readyState,
    networkState: video.networkState,
    currentTime: video.currentTime,
    visibility: getComputedStyle(video).visibility,
    display: getComputedStyle(video).display,
    className: video.className,
    error: video.error
      ? { code: video.error.code, message: video.error.message }
      : null,
  };
};

/**
 * Wires temporary runtime diagnostics for the contact page.
 */
const initContactDiagnostics = () => {
  postAgentDebugLog("H1,H2", "contact layout snapshot", getContactLayoutMetrics());
  postAgentDebugLog("H3,H4,H5", "contact video snapshot", getContactVideoMetrics());

  window.addEventListener("resize", () => {
    postAgentDebugLog("H1,H2", "contact layout resize", getContactLayoutMetrics());
  });

  document.addEventListener("visibilitychange", () => {
    postAgentDebugLog("H4", "document visibility changed", {
      visibilityState: document.visibilityState,
      video: getContactVideoMetrics(),
    });
  });

  const video = document.querySelector(".background video");
  if (video instanceof HTMLVideoElement) {
    ["playing", "pause", "stalled", "suspend", "error"].forEach((eventName) => {
      video.addEventListener(eventName, () => {
        postAgentDebugLog("H3,H4,H5", `contact video ${eventName}`, getContactVideoMetrics());
      });
    });
  }
};
// #endregion

/**
 * Copies text to the clipboard using the modern API with a legacy fallback.
 * @param {string} text - Text to copy.
 * @returns {Promise<boolean>} Whether the copy succeeded.
 */
const copyToClipboard = async (text) => {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();

  let copied = false;
  try {
    copied = document.execCommand("copy");
  } catch {
    copied = false;
  }

  document.body.removeChild(textarea);
  return copied;
};

/**
 * Shows temporary feedback on the email copy button.
 * @param {HTMLButtonElement} button - The copy button element.
 * @param {HTMLElement} feedback - Screen-reader live region.
 */
const showCopyFeedback = (button, feedback) => {
  const label = button.querySelector(".contact-btn__label");
  if (!label) return;

  const originalText = label.textContent;
  label.textContent = COPIED_LABEL;
  button.classList.add("contact-btn--copied");
  feedback.textContent = `Email ${EMAIL} copied to clipboard`;

  window.setTimeout(() => {
    label.textContent = originalText ?? COPY_LABEL;
    button.classList.remove("contact-btn--copied");
    feedback.textContent = "";
  }, 2000);
};

/**
 * Wires up the email copy-to-clipboard button on the contact page.
 */
const initContactPage = () => {
  const copyButton = document.getElementById("contact-copy-email");
  const feedback = document.getElementById("contact-copy-feedback");
  if (!copyButton || !feedback) return;

  const handleCopyEmail = async () => {
    const copied = await copyToClipboard(EMAIL);
    if (copied) {
      showCopyFeedback(copyButton, feedback);
    }
  };

  copyButton.addEventListener("click", handleCopyEmail);
};

initContactPage();
initContactDiagnostics();
