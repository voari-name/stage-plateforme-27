
import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";
type Language = "fr" | "en" | "mg";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  defaultLanguage?: Language;
  storageKey?: string;
  languageStorageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  language: Language;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  setLanguage: (language: Language) => void;
  brightness: number;
  setBrightness: (value: number) => void;
};

const initialState: ThemeProviderState = {
  theme: "light",
  language: "fr",
  setTheme: () => null,
  toggleTheme: () => null,
  setLanguage: () => null,
  brightness: 100,
  setBrightness: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "light",
  defaultLanguage = "fr",
  storageKey = "mtefop-ui-theme",
  languageStorageKey = "mtefop-ui-language",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );
  
  const [language, setLanguage] = useState<Language>(
    () => (localStorage.getItem(languageStorageKey) as Language) || defaultLanguage
  );
  
  const [brightness, setBrightness] = useState<number>(
    () => Number(localStorage.getItem("mtefop-ui-brightness")) || 100
  );

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem(storageKey, theme);
  }, [theme, storageKey]);
  
  useEffect(() => {
    localStorage.setItem(languageStorageKey, language);
    document.documentElement.setAttribute('lang', language);
  }, [language, languageStorageKey]);
  
  useEffect(() => {
    document.documentElement.style.filter = `brightness(${brightness}%)`;
    localStorage.setItem("mtefop-ui-brightness", brightness.toString());
  }, [brightness]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const value = {
    theme,
    language,
    setTheme,
    toggleTheme,
    setLanguage,
    brightness,
    setBrightness,
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
