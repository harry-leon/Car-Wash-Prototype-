import { Link } from "@tanstack/react-router";
import { ArrowRight, Star, Clock, Shield } from "lucide-react";
import { useLanguage } from "./LanguageSwitcher";

export function HeroSection() {
  const { t, lang } = useLanguage();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-primary/5 pt-20">
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-1/3 right-0 h-[700px] w-[700px] rounded-full bg-primary/10 blur-[120px] opacity-60" />
        <div className="absolute bottom-0 -left-1/4 h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-[100px] opacity-50" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 md:px-8 grid gap-12 lg:grid-cols-2 items-center">
        {/* Left: Text */}
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
            <Star className="h-4 w-4 fill-primary" />
            {t("Next-Gen Car Care Platform", "Nền Tảng Chăm Sóc Xe Thế Hệ Mới")}
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.05]">
            {lang === "vi" ? (
              <><span className="text-primary">Rửa Xe & Chăm Sóc</span><br />Chuyên Nghiệp<br />Công Nghệ Đức tại TP.HCM.</>
            ) : (
              <>Professional Car Wash &<br /><span className="text-primary">German Technology</span><br />in HCMC.</>
            )}
          </h1>

          <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
            {t(
              "Book in 30 seconds. No waiting in line. Premium finish guaranteed or 100% money back.",
              "Đặt lịch 30 giây. Không lo xếp hàng. Hoàn tiền 100% nếu bạn không hài lòng.",
            )}
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-8 py-4 text-base font-bold text-primary-foreground shadow-lg shadow-primary/30 hover:bg-primary/90 hover:-translate-y-1 transition-all"
            >
              {t("Book Now", "Đặt Lịch Ngay")}
              <ArrowRight className="h-5 w-5" />
            </Link>
            <a
              href="#services"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border/60 bg-background/60 px-8 py-4 text-base font-semibold hover:bg-accent transition-all"
            >
              {t("View Services", "Xem Dịch Vụ")}
            </a>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-6 pt-2">
            <TrustBadge icon={<Clock className="h-4 w-4 text-primary" />} label={t("Book in 30s", "Đặt lịch 30 giây")} />
            <TrustBadge icon={<Shield className="h-4 w-4 text-primary" />} label={t("100% Money Back", "Hoàn tiền 100%")} />
            <TrustBadge icon={<Star className="h-4 w-4 text-primary fill-primary" />} label={t("5-Star Lounge", "Phòng chờ 5 sao")} />
          </div>
        </div>

        {/* Right: Stats card */}
        <div className="hidden lg:flex flex-col gap-6">
          <div className="rounded-3xl border border-border/50 bg-card/70 backdrop-blur-xl shadow-2xl p-8 space-y-6">
            <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              {t("Why AURA CAR CARE?", "Tại Sao Chọn AURA CAR CARE?")}
            </div>
            {[
              { emoji: "🚗", title: t("Touchless Wash", "Rửa Không Chạm"), desc: t("Protects your paint with premium solution", "Bảo vệ sơn xe bằng dung dịch cao cấp") },
              { emoji: "🏆", title: t("5-Star Waiting Lounge", "Phòng Chờ 5 Sao"), desc: t("AC, complimentary drinks & high-speed Wi-Fi", "Máy lạnh, nước miễn phí & Wi-Fi tốc độ cao") },
              { emoji: "⚡", title: t("Real-time Booking", "Đặt Lịch Thời Gian Thực"), desc: t("No queue, no waiting — guaranteed slot", "Không xếp hàng, có chỗ được đảm bảo") },
              { emoji: "💎", title: t("Loyalty Rewards", "Tích Điểm Thưởng"), desc: t("Earn points every wash, unlock premium perks", "Tích điểm mỗi lần rửa, mở khóa ưu đãi") },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="text-2xl">{item.emoji}</div>
                <div>
                  <div className="text-sm font-semibold text-foreground">{item.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustBadge({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
      {icon}
      {label}
    </div>
  );
}
