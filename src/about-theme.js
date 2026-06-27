import projectsData from "./data/projects.json";
import { initTheme, resolveTheme } from "./apply-theme.js";

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

const randomTheme = pickRandomThemeKey(projectsData.themes);

initTheme(projectsData.themes, randomTheme, projectsData.defaultTheme);

const resolvedTheme = resolveTheme(
  projectsData.themes,
  randomTheme,
  projectsData.defaultTheme,
);

document.documentElement.style.setProperty(
  "--theme-highlight",
  resolveHighlight(resolvedTheme),
);
