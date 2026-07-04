/**
 * @typedef {Object} ThemeTokens
 * @property {string} background - CSS background value (gradient or solid color)
 * @property {string} overlay - CSS overlay color
 * @property {string} accent - Comma-separated RGB, e.g. "193, 204, 95"
 * @property {string} [accentHover]
 * @property {string} [tag]
 * @property {string} [navHover]
 * @property {string} [wip]
 * @property {string} [glow]
 * @property {string} [surface]
 * @property {string} [text]
 */

/** @type {Record<keyof ThemeTokens, string>} */
const CSS_VAR_MAP = {
  background: "--theme-bg",
  overlay: "--theme-overlay",
  accent: "--theme-accent",
  accentHover: "--theme-accent-hover",
  tag: "--theme-tag",
  navHover: "--theme-nav-hover",
  wip: "--theme-wip",
  glow: "--theme-glow",
  surface: "--theme-surface",
  text: "--theme-text",
};

/**
 * Applies theme tokens as CSS custom properties on the document root.
 * @param {ThemeTokens} theme
 */
export const applyTheme = (theme) => {
  const root = document.documentElement;

  Object.entries(CSS_VAR_MAP).forEach(([tokenKey, cssVar]) => {
    const value = theme[tokenKey];

    if (value) {
      root.style.setProperty(cssVar, value);
      return;
    }

    root.style.removeProperty(cssVar);
  });
};

/**
 * Resolves a theme reference (preset name or inline object) from the themes config.
 * @param {Record<string, ThemeTokens>} themes
 * @param {string | (ThemeTokens & { preset?: string }) | undefined} themeRef
 * @param {string} [fallbackKey="field"]
 * @returns {ThemeTokens}
 */
export const resolveTheme = (themes, themeRef, fallbackKey = "field") => {
  if (themeRef && typeof themeRef === "object") {
    const { preset, ...overrides } = themeRef;
    const presetKey = typeof preset === "string" ? preset : fallbackKey;
    const base = themes[presetKey] ?? themes[fallbackKey] ?? {};

    return { ...base, ...overrides };
  }

  const key =
    typeof themeRef === "string" && themes[themeRef]
      ? themeRef
      : fallbackKey;

  return themes[key] ?? themes[fallbackKey] ?? {};
};

/**
 * Sets data-theme attribute and applies resolved tokens.
 * @param {Record<string, ThemeTokens>} themes
 * @param {string | (ThemeTokens & { preset?: string }) | undefined} themeRef
 * @param {string} [fallbackKey="field"]
 */
export const initTheme = (themes, themeRef, fallbackKey = "field") => {
  const resolved = resolveTheme(themes, themeRef, fallbackKey);
  const presetName =
    typeof themeRef === "string"
      ? themeRef
      : typeof themeRef?.preset === "string"
        ? themeRef.preset
        : fallbackKey;

  document.documentElement.setAttribute("data-theme", presetName);
  applyTheme(resolved);
};
