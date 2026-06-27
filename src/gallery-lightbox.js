/** @type {HTMLElement | null} */
let lightboxEl = null;

/** @type {number} */
let activeIndex = 0;

/** @type {Array<{ src: string, alt?: string, caption?: string }>} */
let galleryImages = [];

/** @type {HTMLElement | null} */
let lastFocusedEl = null;

/** @type {boolean} */
let keydownBound = false;

/**
 * Returns the lightbox element, creating it on first use.
 * @returns {HTMLElement}
 */
const getLightboxEl = () => {
  if (lightboxEl instanceof HTMLElement) {
    return lightboxEl;
  }

  lightboxEl = document.createElement("div");
  lightboxEl.className = "gallery-lightbox";
  lightboxEl.id = "gallery-lightbox";
  lightboxEl.setAttribute("role", "dialog");
  lightboxEl.setAttribute("aria-modal", "true");
  lightboxEl.setAttribute("aria-label", "Image gallery");
  lightboxEl.setAttribute("aria-hidden", "true");
  lightboxEl.hidden = true;
  lightboxEl.innerHTML = `
    <div class="gallery-lightbox__backdrop" data-action="close"></div>
    <div class="gallery-lightbox__panel glass-surface">
      <button
        type="button"
        class="gallery-lightbox__close glass-surface"
        data-action="close"
        aria-label="Close gallery"
      >
        <span aria-hidden="true">×</span>
      </button>
      <button
        type="button"
        class="gallery-lightbox__nav gallery-lightbox__nav--prev glass-surface"
        data-action="prev"
        aria-label="Previous image"
      >
        <span aria-hidden="true">←</span>
      </button>
      <figure class="gallery-lightbox__figure">
        <img class="gallery-lightbox__img" src="" alt="" />
        <figcaption class="gallery-lightbox__caption"></figcaption>
      </figure>
      <button
        type="button"
        class="gallery-lightbox__nav gallery-lightbox__nav--next glass-surface"
        data-action="next"
        aria-label="Next image"
      >
        <span aria-hidden="true">→</span>
      </button>
      <p class="gallery-lightbox__counter glass-surface" aria-live="polite"></p>
    </div>
  `;

  document.body.appendChild(lightboxEl);
  lightboxEl.addEventListener("click", handleLightboxClick);

  return lightboxEl;
};

/**
 * Updates the lightbox image, caption, and counter for the active index.
 */
const renderActiveSlide = () => {
  const el = getLightboxEl();
  const image = galleryImages[activeIndex];

  if (!image) {
    return;
  }

  const img = el.querySelector(".gallery-lightbox__img");
  const caption = el.querySelector(".gallery-lightbox__caption");
  const counter = el.querySelector(".gallery-lightbox__counter");
  const prevBtn = el.querySelector('[data-action="prev"]');
  const nextBtn = el.querySelector('[data-action="next"]');

  if (!(img instanceof HTMLImageElement)) {
    return;
  }

  img.src = image.src;
  img.alt = image.alt ?? "";

  if (caption instanceof HTMLElement) {
    caption.textContent = image.caption ?? "";
    caption.hidden = !image.caption;
  }

  if (counter instanceof HTMLElement) {
    counter.textContent = `${activeIndex + 1} / ${galleryImages.length}`;
  }

  const hasMultiple = galleryImages.length > 1;

  if (prevBtn instanceof HTMLButtonElement) {
    prevBtn.hidden = !hasMultiple;
  }

  if (nextBtn instanceof HTMLButtonElement) {
    nextBtn.hidden = !hasMultiple;
  }
};

/**
 * Opens the lightbox at the given gallery index.
 * @param {number} index
 */
const openLightbox = (index) => {
  if (!galleryImages.length) {
    return;
  }

  activeIndex = index;
  renderActiveSlide();

  const el = getLightboxEl();
  el.hidden = false;
  el.setAttribute("aria-hidden", "false");
  el.classList.add("is-open");
  document.body.classList.add("gallery-lightbox-open");

  const closeBtn = el.querySelector(".gallery-lightbox__close");

  if (closeBtn instanceof HTMLElement) {
    closeBtn.focus();
  }
};

/**
 * Closes the lightbox and restores focus to the trigger element.
 */
const closeLightbox = () => {
  const el = getLightboxEl();
  el.hidden = true;
  el.setAttribute("aria-hidden", "true");
  el.classList.remove("is-open");
  document.body.classList.remove("gallery-lightbox-open");

  if (lastFocusedEl instanceof HTMLElement) {
    lastFocusedEl.focus();
    lastFocusedEl = null;
  }
};

/**
 * Advances or rewinds the active slide.
 * @param {number} delta
 */
const stepSlide = (delta) => {
  if (galleryImages.length <= 1) {
    return;
  }

  activeIndex =
    (activeIndex + delta + galleryImages.length) % galleryImages.length;
  renderActiveSlide();
};

/**
 * Handles click events inside the lightbox.
 * @param {MouseEvent} event
 */
const handleLightboxClick = (event) => {
  const target = event.target;

  if (!(target instanceof Element)) {
    return;
  }

  const actionEl = target.closest("[data-action]");

  if (!(actionEl instanceof HTMLElement)) {
    return;
  }

  const action = actionEl.getAttribute("data-action");

  if (action === "close") {
    closeLightbox();
    return;
  }

  if (action === "prev") {
    stepSlide(-1);
    return;
  }

  if (action === "next") {
    stepSlide(1);
  }
};

/**
 * Handles keyboard navigation while the lightbox is open.
 * @param {KeyboardEvent} event
 */
const handleLightboxKeydown = (event) => {
  const el = getLightboxEl();

  if (el.hidden) {
    return;
  }

  if (event.key === "Escape") {
    event.preventDefault();
    closeLightbox();
    return;
  }

  if (event.key === "ArrowLeft") {
    event.preventDefault();
    stepSlide(-1);
    return;
  }

  if (event.key === "ArrowRight") {
    event.preventDefault();
    stepSlide(1);
  }
};

/**
 * Wires gallery thumbnails to open the lightbox.
 * @param {HTMLElement} container
 * @param {Array<{ src: string, alt?: string, caption?: string }>} images
 */
export const initGalleryLightbox = (container, images) => {
  if (!images?.length) {
    return;
  }

  galleryImages = images;
  getLightboxEl();

  if (!keydownBound) {
    document.addEventListener("keydown", handleLightboxKeydown);
    keydownBound = true;
  }

  container.querySelectorAll("[data-gallery-index]").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const index = Number(trigger.getAttribute("data-gallery-index"));

      if (Number.isNaN(index)) {
        return;
      }

      lastFocusedEl = trigger instanceof HTMLElement ? trigger : null;
      openLightbox(index);
    });

    trigger.addEventListener("keydown", (event) => {
      if (!(event instanceof KeyboardEvent)) {
        return;
      }

      if (event.key !== "Enter" && event.key !== " ") {
        return;
      }

      event.preventDefault();
      trigger.dispatchEvent(new Event("click"));
    });
  });
};
