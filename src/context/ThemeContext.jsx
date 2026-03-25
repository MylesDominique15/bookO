import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext(null);

export const THEMES = {
  LIGHT: "light",
  DARK: "dark",
  READING: "reading",
};

export const FONTS = {
  STANDARD: "standard",
  OPEN_DYSLEXIC: "openDyslexic",
};

const THEME_STYLES = {
  [THEMES.LIGHT]: {
    background: "#ffffff",
    surface: "#f3f4f6",
    text: "#111827",
    subtext: "#6b7280",
    border: "#e5e7eb",
    accent: "#4f46e5",
  },
  [THEMES.DARK]: {
    background: "#0f172a",
    surface: "#1e293b",
    text: "#f1f5f9",
    subtext: "#94a3b8",
    border: "#334155",
    accent: "#818cf8",
  },
  [THEMES.READING]: {
    background: "#f5f0e8",
    surface: "#ede8dc",
    text: "#2c2416",
    subtext: "#6b5e45",
    border: "#d6ccb8",
    accent: "#7c6a3f",
  },
};

const FONT_FAMILIES = {
  [FONTS.STANDARD]: "'Inter', 'Segoe UI', sans-serif",
  [FONTS.OPEN_DYSLEXIC]: "'OpenDyslexic', sans-serif",
};

const STORAGE_KEY_THEME = "cogpdf_theme";
const STORAGE_KEY_FONT = "cogpdf_font";

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem(STORAGE_KEY_THEME) || THEMES.LIGHT;
  });

  const [font, setFont] = useState(() => {
    return localStorage.getItem(STORAGE_KEY_FONT) || FONTS.STANDARD;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_THEME, theme);

    const styles = THEME_STYLES[theme];
    const root = document.documentElement;

    root.setAttribute("data-theme", theme);
    root.style.setProperty("--color-bg", styles.background);
    root.style.setProperty("--color-surface", styles.surface);
    root.style.setProperty("--color-text", styles.text);
    root.style.setProperty("--color-subtext", styles.subtext);
    root.style.setProperty("--color-border", styles.border);
    root.style.setProperty("--color-accent", styles.accent);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_FONT, font);
    document.documentElement.style.setProperty(
      "--font-family",
      FONT_FAMILIES[font]
    );
  }, [font]);

  const cycleTheme = () => {
    setTheme((prev) => {
      const order = [THEMES.LIGHT, THEMES.DARK, THEMES.READING];
      const next = order[(order.indexOf(prev) + 1) % order.length];
      return next;
    });
  };

  const toggleFont = () => {
    setFont((prev) =>
      prev === FONTS.STANDARD ? FONTS.OPEN_DYSLEXIC : FONTS.STANDARD
    );
  };

  const currentStyles = THEME_STYLES[theme];

  const value = {
    theme,
    font,
    styles: currentStyles,
    fontFamily: FONT_FAMILIES[font],
    setTheme,
    setFont,
    cycleTheme,
    toggleFont,
    THEMES,
    FONTS,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}