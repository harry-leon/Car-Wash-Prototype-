import { Link } from "@tanstack/react-router";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useLanguage } from "./LanguageSwitcher";

export function PublicHeader() {
  const { t } = useLanguage();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white shadow-md overflow-hidden p-0.5">
            <img src="/logo.png" alt="AURA CAR CARE" className="h-full w-full rounded-[10px] object-cover" />
          </div>
          <span className="font-bold text-base tracking-tight group-hover:text-primary transition-colors">
            AURA CAR CARE
          </span>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <a href="#services" className="hover:text-foreground transition-colors">
            {t("Services", "Dịch Vụ")}
          </a>
          <a href="#combos" className="hover:text-foreground transition-colors">
            {t("Packages", "Gói Tháng")}
          </a>
          <a href="#reviews" className="hover:text-foreground transition-colors">
            {t("Reviews", "Đánh Giá")}
          </a>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <Link
            to="/login"
            className="rounded-full border border-border/60 px-4 py-1.5 text-sm font-semibold hover:bg-accent transition-colors"
          >
            {t("Sign In", "Đăng Nhập")}
          </Link>
          <Link
            to="/register"
            className="rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
          >
            {t("Register", "Đăng Ký")}
          </Link>
        </div>
      </div>
    </header>
  );
}
