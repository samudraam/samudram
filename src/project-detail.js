/**
 * project-detail.js
 * =================
 * PURPOSE: Renders the single-project detail page (project.html?slug=...).
 * Reads the "slug" from the URL, looks up the matching project in
 * data/projects.json, applies that project's color theme, and builds the
 * full page HTML: title, tags, external link, videos, image gallery, and notes.
 *
 * FUNCTIONS:
 * - resolveMediaUrl(path)            Converts a media path from projects.json
 *                                    into a URL that works after deployment.
 * - getSlugFromUrl()                 Reads ?slug=... from the address bar.
 * - findProjectBySlug(slug)          Finds the matching project record.
 * - initProjectVideoReadyState(video) Un-hides a video once it can display.
 * - createVideosHtml(videos)         Builds the "Video" section HTML.
 * - createImagesHtml(images)         Builds the "Gallery" section HTML.
 * - createNotesHtml(notes)           Builds the "Field Notes" section HTML.
 * - renderNotFound(container)        Shows an error state for bad slugs.
 * - renderProjectDetail(container, project) Renders the whole detail view.
 * - initProjectDetail()              Entry point, runs on DOMContentLoaded.
 */

import projectsData from "./data/projects.json";
import { initTheme } from "./apply-theme.js";
import { initGalleryLightbox } from "./gallery-lightbox.js";

/**
 * Resolves a media path from projects.json to a deployable URL.
 * Vite copies the contents of /public into the site root at build time,
 * so URLs must never include a "public/" segment.
 * @param {string} path
 * @returns {string}
 */
const resolveMediaUrl = (path) =>
  `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;

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
 * Marks a project video as display-ready when its poster or metadata exists.
 * @param {HTMLVideoElement} video
 */
const initProjectVideoReadyState = (video) => {
  if (video.poster || video.readyState >= HTMLMediaElement.HAVE_METADATA) {
    video.classList.add("is-media-ready");
    return;
  }

  video.addEventListener(
    "loadedmetadata",
    () => {
      video.classList.add("is-media-ready");
    },
    { once: true },
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
      (video) => `
        <figure class="media-video glass-surface">
          <video
            controls
            muted
            playsinline
            preload="metadata"
            ${video.poster ? `poster="${resolveMediaUrl(video.poster)}"` : ""}
          >
            <source src="${resolveMediaUrl(video.src)}" type="video/mp4" />
          </video>
          ${
            video.caption
              ? `<figcaption class="media-video__caption">${video.caption}</figcaption>`
              : ""
          }
        </figure>
      `
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

  container.querySelectorAll("video").forEach((video) => {
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
