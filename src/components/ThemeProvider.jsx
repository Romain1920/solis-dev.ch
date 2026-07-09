import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";

export const THEME_STORAGE_KEY = "solis-theme";

const SYSTEM_PREFERENCE = "system";
const DARK_THEME = "dark";
const LIGHT_THEME = "light";
const THEME_QUERY = "(prefers-color-scheme: dark)";
const ThemeContext = createContext(null);

const isExplicitTheme = (value) => value === LIGHT_THEME || value === DARK_THEME;

const readStoredPreference = () => {
  if (typeof window === "undefined") {
    return SYSTEM_PREFERENCE;
  }

  try {
    const storedPreference = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isExplicitTheme(storedPreference) ? storedPreference : SYSTEM_PREFERENCE;
  } catch {
    return SYSTEM_PREFERENCE;
  }
};

const readSystemTheme = () => {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return LIGHT_THEME;
  }

  return window.matchMedia(THEME_QUERY).matches ? DARK_THEME : LIGHT_THEME;
};

const applyThemeToDocument = (theme, preference) => {
  if (typeof document === "undefined") {
    return;
  }

  const root = document.documentElement;
  root.dataset.theme = theme;
  root.dataset.themePreference = preference;
  root.dataset.themeSource = preference === SYSTEM_PREFERENCE ? "system" : "manual";
  root.style.colorScheme = theme;

  const themeColor = document.querySelector('meta[name="theme-color"]');
  themeColor?.setAttribute("content", theme === DARK_THEME ? "#0f0f0f" : "#eeeae8");
};

/**
 * Keeps the resolved theme on <html> while preserving the distinction between
 * a manual preference and the operating-system preference.
 */
export function ThemeProvider({ children }) {
  const [preference, setPreferenceState] = useState(readStoredPreference);
  const [systemTheme, setSystemTheme] = useState(readSystemTheme);
  const resolvedTheme = preference === SYSTEM_PREFERENCE ? systemTheme : preference;

  useLayoutEffect(() => {
    applyThemeToDocument(resolvedTheme, preference);
  }, [preference, resolvedTheme]);

  useEffect(() => {
    if (preference !== SYSTEM_PREFERENCE || typeof window.matchMedia !== "function") {
      return undefined;
    }

    const mediaQuery = window.matchMedia(THEME_QUERY);
    const handleSystemThemeChange = (event) => {
      setSystemTheme(event.matches ? DARK_THEME : LIGHT_THEME);
    };

    setSystemTheme(mediaQuery.matches ? DARK_THEME : LIGHT_THEME);

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handleSystemThemeChange);
      return () => mediaQuery.removeEventListener("change", handleSystemThemeChange);
    }

    mediaQuery.addListener(handleSystemThemeChange);
    return () => mediaQuery.removeListener(handleSystemThemeChange);
  }, [preference]);

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key !== null && event.key !== THEME_STORAGE_KEY) {
        return;
      }

      const nextPreference = isExplicitTheme(event.newValue)
        ? event.newValue
        : SYSTEM_PREFERENCE;

      setPreferenceState(nextPreference);

      if (nextPreference === SYSTEM_PREFERENCE) {
        setSystemTheme(readSystemTheme());
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const setThemePreference = useCallback((nextPreference) => {
    const normalizedPreference = isExplicitTheme(nextPreference)
      ? nextPreference
      : SYSTEM_PREFERENCE;

    setPreferenceState(normalizedPreference);

    if (normalizedPreference === SYSTEM_PREFERENCE) {
      setSystemTheme(readSystemTheme());
    }

    try {
      if (normalizedPreference === SYSTEM_PREFERENCE) {
        window.localStorage.removeItem(THEME_STORAGE_KEY);
      } else {
        window.localStorage.setItem(THEME_STORAGE_KEY, normalizedPreference);
      }
    } catch {
      // The in-memory preference still works when storage is unavailable.
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setThemePreference(resolvedTheme === DARK_THEME ? LIGHT_THEME : DARK_THEME);
  }, [resolvedTheme, setThemePreference]);

  const resetToSystem = useCallback(() => {
    setThemePreference(SYSTEM_PREFERENCE);
  }, [setThemePreference]);

  const contextValue = useMemo(
    () => ({
      preference,
      resolvedTheme,
      theme: resolvedTheme,
      isSystem: preference === SYSTEM_PREFERENCE,
      setTheme: setThemePreference,
      setThemePreference,
      toggleTheme,
      resetToSystem,
    }),
    [preference, resetToSystem, resolvedTheme, setThemePreference, toggleTheme]
  );

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used inside a ThemeProvider.");
  }

  return context;
}

export default ThemeProvider;
