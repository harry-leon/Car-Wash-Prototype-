import * as React from "react";

export type Lang = "en" | "vi";

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (en: string, vi: string) => string;
  formatPrice: (price: number) => string;
}

const LanguageContext = React.createContext<LanguageContextValue>({
  lang: "en",
  setLang: () => {},
  t: (en) => en,
  formatPrice: (p) => `${p.toLocaleString()} VND`,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = React.useState<Lang>("en");

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
    <LanguageContext.Provider value={{ lang, setLang, t, formatPrice }}>
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
        className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
          lang === "en"
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLang("vi")}
        className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
          lang === "vi"
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        VI
      </button>
    </div>
  );
}
