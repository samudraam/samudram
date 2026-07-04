import projectsData from "./data/projects.json";
import { initTheme, resolveTheme } from "./apply-theme.js";

const THEME_MORPH_DURATION_MS = 1400;
let themeMorphTimeoutId;
const HOME_THEME_SOURCE = {
  id: "home",
  title: "Home page",
  theme: "ocean",
  href: "index.html",
  linkLabel: "View source page",
};

/**
 * Returns a random theme key from the themes config.
 * @param {Record<string, unknown>} themes
 * @returns {string}
 */
const pickRandomThemeKey = (themes) => {
  const keys = Object.keys(themes);

  if (keys.length === 0) {
    return projectsData.defaultTheme;
  }

  return keys[Math.floor(Math.random() * keys.length)];
};

/**
 * Returns theme sources for pages and projects that have valid theme tokens.
 * @param {typeof projectsData.projects} projects
 * @returns {{ id: string, title: string, theme: string, href: string, linkLabel: string }[]}
 */
const getThemeSources = (projects) => {
  const projectThemeSources = projects
    .filter(
      (project) =>
        typeof project.theme === "string" && projectsData.themes[project.theme],
    )
    .map((project) => ({
      id: project.slug,
      title: project.title,
      theme: project.theme,
      href: `project.html?slug=${project.slug}`,
      linkLabel: "View source project",
    }));

  if (!projectsData.themes[HOME_THEME_SOURCE.theme]) {
    return projectThemeSources;
  }

  return [HOME_THEME_SOURCE, ...projectThemeSources];
};

/**
 * Returns a random source that has a valid theme token.
 * @param {typeof projectsData.projects} projects
 * @returns {{ id: string, title: string, theme: string, href: string, linkLabel: string } | undefined}
 */
const pickRandomThemeSource = (projects) => {
  const themeSources = getThemeSources(projects);

  if (themeSources.length === 0) {
    return undefined;
  }

  return themeSources[Math.floor(Math.random() * themeSources.length)];
};

/**
 * Parses a comma-separated RGB string into numeric channels.
 * @param {string} rgb
 * @returns {[number, number, number]}
 */
const parseRgb = (rgb) => rgb.split(",").map((part) => parseInt(part.trim(), 10));

/**
 * Returns sRGB relative luminance for a color.
 * @param {number} red
 * @param {number} green
 * @param {number} blue
 * @returns {number}
 */
const getLuminance = (red, green, blue) => {
  const channel = (value) => {
    const normalized = value / 255;

    return normalized <= 0.03928
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4;
  };

  return (
    0.2126 * channel(red) + 0.7152 * channel(green) + 0.0722 * channel(blue)
  );
};

/**
 * Returns WCAG contrast ratio between two luminance values.
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
const getContrastRatio = (a, b) => {
  const lighter = Math.max(a, b);
  const darker = Math.min(a, b);

  return (lighter + 0.05) / (darker + 0.05);
};

/**
 * Picks the accent token with the strongest contrast against the theme surface.
 * Avoids glow, which often matches the page background gradient.
 * @param {import("./apply-theme.js").ThemeTokens} theme
 * @returns {string}
 */
const resolveHighlight = (theme) => {
  const surface = parseRgb(theme.surface ?? "0, 5, 15");
  const surfaceLum = getLuminance(...surface);
  const fallbackText = surfaceLum > 0.5 ? "22, 30, 26" : "255, 255, 255";

  const candidates = [
    theme.accent,
    theme.accentHover,
    theme.navHover,
    theme.tag,
    theme.text ?? fallbackText,
  ].filter(Boolean);

  let bestRgb = theme.accent ?? fallbackText;
  let bestRatio = 0;

  for (const candidate of candidates) {
    const channels = parseRgb(candidate);
    const ratio = getContrastRatio(getLuminance(...channels), surfaceLum);

    if (ratio > bestRatio) {
      bestRatio = ratio;
      bestRgb = candidate;
    }
  }

  return bestRgb;
};

/**
 * Returns whether the visitor has requested reduced motion.
 * @returns {boolean}
 */
const shouldReduceMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Creates a temporary layer using the old theme so the new theme can fade in.
 * @returns {HTMLDivElement | undefined}
 */
const createThemeMorphLayer = () => {
  if (!document.body || shouldReduceMotion()) {
    return undefined;
  }

  window.clearTimeout(themeMorphTimeoutId);

  const rootStyle = getComputedStyle(document.documentElement);
  const previousBackground = rootStyle.getPropertyValue("--theme-bg").trim();
  const previousOverlay = rootStyle.getPropertyValue("--theme-overlay").trim();
  const existingLayer = document.querySelector(".theme-morph-layer");
  const layer =
    existingLayer instanceof HTMLDivElement
      ? existingLayer
      : document.createElement("div");

  layer.className = "theme-morph-layer";
  layer.style.background = `${previousOverlay}, ${previousBackground}`;
  layer.style.setProperty("--theme-morph-duration", `${THEME_MORPH_DURATION_MS}ms`);

  if (!existingLayer) {
    document.body.append(layer);
  }

  return layer;
};

/**
 * Fades out the previous-theme layer after the new theme is applied.
 * @param {HTMLDivElement | undefined} layer
 */
const fadeThemeMorphLayer = (layer) => {
  if (!layer) {
    return;
  }

  requestAnimationFrame(() => {
    layer.classList.add("theme-morph-layer--fade");
  });

  themeMorphTimeoutId = window.setTimeout(() => {
    layer.remove();
  }, THEME_MORPH_DURATION_MS);
};

/**
 * Applies a theme and keeps the highlighted accent readable.
 * @param {string} themeKey
 * @param {boolean} [animate=false]
 */
const updatePageTheme = (themeKey, animate = false) => {
  const morphLayer = animate ? createThemeMorphLayer() : undefined;

  initTheme(projectsData.themes, themeKey, projectsData.defaultTheme);

  const resolvedTheme = resolveTheme(
    projectsData.themes,
    themeKey,
    projectsData.defaultTheme,
  );

  document.documentElement.style.setProperty(
    "--theme-highlight",
    resolveHighlight(resolvedTheme),
  );

  fadeThemeMorphLayer(morphLayer);
};

/**
 * Updates the callout copy and source project link.
 * @param {{ title: string, theme: string, href: string, linkLabel: string } | undefined} source
 */
const updateThemeDialog = (source) => {
  const themeProjectLink = document.getElementById("theme-project-link");
  const themeSelectionStatus = document.getElementById("theme-selection-status");

  if (themeSelectionStatus instanceof HTMLElement && source) {
    themeSelectionStatus.textContent = `Source theme: ${source.title} (${source.theme}).`;
  }

  if (themeProjectLink instanceof HTMLAnchorElement && source) {
    themeProjectLink.href = source.href;
    themeProjectLink.textContent = `${source.linkLabel}: ${source.title} →`;
  }
};

/**
 * Builds the theme dropdown and connects it to instant theme updates.
 * @param {HTMLSelectElement} select
 * @param {{ id: string, title: string, theme: string, href: string, linkLabel: string }[]} themeSources
 * @param {{ id: string } | undefined} activeSource
 */
const initThemeSelect = (select, themeSources, activeSource) => {
  select.innerHTML = themeSources
    .map(
      (source) =>
        `<option value="${source.id}">${source.title} (${source.theme})</option>`,
    )
    .join("");

  if (activeSource) {
    select.value = activeSource.id;
  }

  select.addEventListener("change", () => {
    const selectedSource = themeSources.find(
      (source) => source.id === select.value,
    );

    if (!selectedSource) {
      return;
    }

    updatePageTheme(selectedSource.theme, true);
    updateThemeDialog(selectedSource);
  });
};

const themeSources = getThemeSources(projectsData.projects);
const randomSource = pickRandomThemeSource(projectsData.projects);
const randomTheme = randomSource?.theme ?? pickRandomThemeKey(projectsData.themes);

updatePageTheme(randomTheme);

updateThemeDialog(randomSource);

const themeProjectSelect = document.getElementById("theme-project-select");

if (themeProjectSelect instanceof HTMLSelectElement) {
  initThemeSelect(themeProjectSelect, themeSources, randomSource);
}
