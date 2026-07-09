import projectsData from "./data/projects.json";
import { initTheme } from "./apply-theme.js";
import { initGalleryLightbox } from "./gallery-lightbox.js";

const DEBUG_ENDPOINT =
  "http://127.0.0.1:7547/ingest/96b32e8d-a64f-4e20-aa21-99c92673c97b";
const DEBUG_SESSION_ID = "32ef22";
const DEBUG_RUN_ID = "pre-fix";
const DEBUG_HOSTS = new Set(["localhost", "127.0.0.1"]);

/**
 * Sends portfolio media diagnostics to the Cursor debug log.
 * @param {string} hypothesisId
 * @param {string} message
 * @param {Record<string, unknown>} data
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
      location: "src/project-detail.js",
      message,
      data,
      timestamp: Date.now(),
    }),
  }).catch(() => {});
};

/**
 * Returns the browser media state needed to debug playback.
 * @param {HTMLVideoElement} video
 * @returns {Record<string, unknown>}
 */
const getProjectVideoDebugState = (video) => ({
  currentSrc: video.currentSrc,
  sourceSrc: video.querySelector("source")?.getAttribute("src") ?? "",
  resolvedSourceUrl: video.querySelector("source")?.src ?? "",
  poster: video.poster,
  readyState: video.readyState,
  networkState: video.networkState,
  paused: video.paused,
  ended: video.ended,
  muted: video.muted,
  controls: video.controls,
  preload: video.preload,
  display: getComputedStyle(video).display,
  visibility: getComputedStyle(video).visibility,
  pointerEvents: getComputedStyle(video).pointerEvents,
  className: video.className,
  error: video.error
    ? { code: video.error.code, message: video.error.message }
    : null,
});

/**
 * Reads the project slug from the URL query string.
 * @returns {string | null}
 */
const getSlugFromUrl = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get("slug");
};

/**
 * Finds a project record by slug.
 * @param {string} slug
 * @returns {typeof projectsData.projects[number] | undefined}
 */
const findProjectBySlug = (slug) =>
  projectsData.projects.find((project) => project.slug === slug);

/**
 * Marks a project video as display-ready when its poster or frame data exists.
 * @param {HTMLVideoElement} video
 */
const initProjectVideoReadyState = (video) => {
  // #region agent log
  postAgentDebugLog("H2,H3,H4", "project video init state", {
    video: getProjectVideoDebugState(video),
  });
  // #endregion

  if (video.poster || video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
    video.classList.add("is-media-ready");
    // #region agent log
    postAgentDebugLog("H3", "project video marked ready immediately", {
      video: getProjectVideoDebugState(video),
    });
    // #endregion
    return;
  }

  video.addEventListener(
    "loadeddata",
    () => {
      video.classList.add("is-media-ready");
      // #region agent log
      postAgentDebugLog("H3", "project video marked ready after loadeddata", {
        video: getProjectVideoDebugState(video),
      });
      // #endregion
    },
    { once: true },
  );
};

/**
 * Wires media diagnostics to each project video.
 * @param {HTMLVideoElement} video
 * @param {number} index
 */
const initProjectVideoDebugLogging = (video, index) => {
  ["loadstart", "loadedmetadata", "canplay", "play", "playing", "pause", "waiting", "stalled", "error"].forEach(
    (eventName) => {
      video.addEventListener(eventName, () => {
        // #region agent log
        postAgentDebugLog("H1,H2,H4,H5", `project video ${eventName}`, {
          index,
          video: getProjectVideoDebugState(video),
        });
        // #endregion
      });
    },
  );
};

/**
 * Builds HTML for video media blocks.
 * @param {typeof projectsData.projects[number]["media"]["videos"]} videos
 * @returns {string}
 */
const createVideosHtml = (videos) => {
  if (!videos?.length) {
    return "";
  }

  const items = videos
    .map(
      (video) => {
        const fallbackSrc = video.src.startsWith("public/")
          ? video.src
          : `public/${video.src}`;

        return `
        <figure class="media-video glass-surface">
          <video
            controls
            muted
            playsinline
            preload="metadata"
            poster="${video.poster || ""}"
          >
            <source src="${video.src}" type="video/mp4" />
            <source src="${fallbackSrc}" type="video/mp4" />
          </video>
          ${
            video.caption
              ? `<figcaption class="media-video__caption">${video.caption}</figcaption>`
              : ""
          }
        </figure>
      `;
      }
    )
    .join("");

  return `
    <section class="media-section" aria-label="Project videos">
      <p class="media-section__label">Video</p>
      <div class="media-videos">${items}</div>
    </section>
  `;
};

/**
 * Builds HTML for image gallery blocks.
 * @param {typeof projectsData.projects[number]["media"]["images"]} images
 * @returns {string}
 */
const createImagesHtml = (images) => {
  if (!images?.length) {
    return "";
  }

  const items = images
    .map(
      (image, index) => `
        <button
          type="button"
          class="media-image__trigger"
          data-gallery-index="${index}"
          aria-label="View full size: ${image.alt || `Image ${index + 1}`}"
        >
          <figure class="media-image glass-surface">
            <img src="${image.src}" alt="${image.alt ?? ""}" loading="lazy" />
            ${
              image.caption
                ? `<figcaption class="media-image__caption">${image.caption}</figcaption>`
                : ""
            }
          </figure>
        </button>
      `
    )
    .join("");

  return `
    <section class="media-section" aria-label="Project images">
      <p class="media-section__label">Gallery</p>
      <div class="media-gallery">${items}</div>
    </section>
  `;
};

/**
 * Builds HTML for written note sections.
 * @param {typeof projectsData.projects[number]["notes"]} notes
 * @returns {string}
 */
const createNotesHtml = (notes) => {
  if (!notes?.length) {
    return "";
  }

  const blocks = notes
    .map(
      (note) => `
        <article class="note-block">
          <h2 class="note-block__heading">${note.heading}</h2>
          <p class="note-block__body">${note.body}</p>
        </article>
      `
    )
    .join("");

  return `
    <section class="notes-section" aria-label="Project notes">
      <p class="notes-section__label">Field Notes</p>
      ${blocks}
    </section>
  `;
};

/**
 * Renders a not-found state when the slug is missing or invalid.
 * @param {HTMLElement} container
 */
const renderNotFound = (container) => {
  container.innerHTML = `
    <p class="project-detail__error">
      Entry not found in the archive.
      <a href="projects.html" class="project-detail__back">Return to projects</a>
    </p>
  `;
  document.title = "Not Found — Projects";
};

/**
 * Renders the full project detail view from JSON data.
 * @param {HTMLElement} container
 * @param {typeof projectsData.projects[number]} project
 */
const renderProjectDetail = (container, project) => {
  document.title = `${project.title} — Projects`;

  const statusClass =
    project.status === "WIP" ? " project-detail__status--wip" : "";
  const tagsHtml = project.tags.map((tag) => `<li>${tag}</li>`).join("");
  const externalLink = project.externalUrl
    ? `<a
        class="project-detail__external glass-surface"
        href="${project.externalUrl}"
        target="_blank"
        rel="noopener noreferrer"
      >
        View live project
        <span aria-hidden="true">↗</span>
      </a>`
    : "";

  const media = project.media ?? {};

  // #region agent log
  postAgentDebugLog("H1,H2,H5", "project detail render media", {
    slug: project.slug,
    pageUrl: window.location.href,
    baseUri: document.baseURI,
    videos: media.videos?.map((video) => ({
      src: video.src,
      resolvedSrc: new URL(video.src, document.baseURI).href,
      poster: video.poster,
      resolvedPoster: video.poster
        ? new URL(video.poster, document.baseURI).href
        : "",
    })),
  });
  // #endregion

  container.innerHTML = `
    <a href="projects.html" class="project-detail__back">
      <span aria-hidden="true">←</span> Field Log / Archive
    </a>

    <div class="project-detail__meta-row">
      <span class="project-detail__date">${project.date}</span>
      <span class="project-detail__status${statusClass}">${project.status}</span>
      <span class="project-detail__category glass-surface">${project.category}</span>
    </div>

    <h1 class="project-detail__title">${project.title}</h1>
    <p class="project-detail__desc">${project.description}</p>

    <ul class="project-detail__tags">${tagsHtml}</ul>

    ${externalLink}

    ${createVideosHtml(media.videos)}
    ${createImagesHtml(media.images)}
    ${createNotesHtml(project.notes)}
  `;

  container.querySelectorAll("video").forEach((video, index) => {
    initProjectVideoDebugLogging(video, index);
    initProjectVideoReadyState(video);
  });

  if (media.images?.length) {
    initGalleryLightbox(container, media.images);
  }
};

/**
 * Initializes the project detail template page.
 */
const initProjectDetail = () => {
  const container = document.getElementById("project-detail");
  const slug = getSlugFromUrl();

  if (!(container instanceof HTMLElement)) {
    return;
  }

  const project = slug ? findProjectBySlug(slug) : undefined;
  const themeRef = project?.theme ?? projectsData.defaultTheme;

  initTheme(projectsData.themes, themeRef, projectsData.defaultTheme);

  if (!slug) {
    renderNotFound(container);
    return;
  }

  if (!project) {
    renderNotFound(container);
    return;
  }

  renderProjectDetail(container, project);
};

document.addEventListener("DOMContentLoaded", initProjectDetail);
