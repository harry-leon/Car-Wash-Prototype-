import * as React from "react";

export type Lang = "en" | "vi";
export type Theme = "light" | "dark";

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  t: (en: string, vi: string) => string;
  formatPrice: (price: number) => string;
}

const LanguageContext = React.createContext<LanguageContextValue>({
  lang: "en",
  setLang: () => {},
  theme: "light",
  setTheme: () => {},
  t: (en) => en,
  formatPrice: (p) => `${p.toLocaleString()} VND`,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = React.useState<Lang>("en");
  const [theme, setThemeState] = React.useState<Theme>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("aura-theme") as Theme) || "light";
    }
    return "light";
  });

  const setTheme = React.useCallback((next: Theme) => {
    setThemeState(next);
    if (typeof window !== "undefined") {
      localStorage.setItem("aura-theme", next);
      document.documentElement.classList.toggle("dark", next === "dark");
    }
  }, []);

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const t = React.useCallback(
    (en: string, vi: string) => (lang === "vi" ? vi : en),
    [lang],
  );

  const formatPrice = React.useCallback(
    (price: number) =>
      lang === "vi"
        ? `${price.toLocaleString("vi-VN")} ₫`
        : `${price.toLocaleString("en-US")} VND`,
    [lang],
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, theme, setTheme, t, formatPrice }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return React.useContext(LanguageContext);
}

export function LanguageSwitcher({ className }: { className?: string }) {
  const { lang, setLang } = useLanguage();
  return (
    <div className={`inline-flex items-center rounded-full border border-border/60 bg-background/60 p-0.5 backdrop-blur-sm ${className ?? ""}`}>
      <button
        onClick={() => setLang("en")}
        className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${lang === "en" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
      >
        EN
      </button>
      <button
        onClick={() => setLang("vi")}
        className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${lang === "vi" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
      >
        VI
      </button>
    </div>
  );
}

export function ThemeSwitcher({ className }: { className?: string }) {
  const { theme, setTheme } = useLanguage();
  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
      className={`flex h-8 w-8 items-center justify-center rounded-full border border-border/60 bg-background/60 backdrop-blur-sm text-sm transition-all hover:bg-accent hover:scale-110 ${className ?? ""}`}
    >
      {theme === "dark" ? "☀️" : "🌙"}
    </button>
  );
}
