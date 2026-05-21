import { Link } from "@tanstack/react-router";
import { Star, ArrowRight } from "lucide-react";
import { PublicHeader } from "../components/PublicHeader";
import { PublicFooter } from "../components/PublicFooter";
import { HeroSection } from "../components/HeroSection";
import { PackagePreviewCard } from "../components/PackagePreviewCard";
import { ComboPreviewCard } from "../components/ComboPreviewCard";
import { LanguageProvider, useLanguage } from "../components/LanguageSwitcher";
import { HOMEPAGE_DATA } from "../mock/homepage.mock";

function HomepageContent() {
  const { t } = useLanguage();
  const { services, combos, testimonials } = HOMEPAGE_DATA;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PublicHeader />
      <HeroSection />

      {/* Services Section */}
      <section id="services" className="py-24 px-4 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary mb-4">
              ✨ {t("Our Services", "Dịch Vụ Của Chúng Tôi")}
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              {t("Professional Car Care", "Chăm Sóc Xe Chuyên Nghiệp")}
            </h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              {t(
                "From quick express washes to full detailing — we cover everything your car needs.",
                "Từ rửa nhanh đến chi tiết toàn diện — chúng tôi có tất cả những gì xe bạn cần.",
              )}
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => (
              <PackagePreviewCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>

      {/* Before/After Social Proof */}
      <section className="py-16 px-4 md:px-8 bg-accent/30">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-extrabold">
              {t("See The Difference", "Thấy Sự Khác Biệt")}
            </h2>
            <p className="text-muted-foreground mt-2">
              {t("Real results from real customers", "Kết quả thực tế từ khách hàng thực tế")}
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { label: t("Interior Deep Clean", "Vệ Sinh Nội Thất Sâu"), before: "🪣", after: "✨" },
              { label: t("Engine Bay Wash", "Rửa Khoang Máy"), before: "⚫", after: "🔩" },
              { label: t("Paint Protection", "Bảo Vệ Sơn Xe"), before: "😐", after: "😍" },
            ].map((item, i) => (
              <div key={i} className="rounded-2xl border border-border/50 bg-card/60 p-6 text-center space-y-3">
                <div className="font-semibold text-sm">{item.label}</div>
                <div className="flex items-center justify-center gap-4 text-4xl">
                  <div className="rounded-xl bg-accent p-3">{item.before}</div>
                  <ArrowRight className="h-5 w-5 text-primary" />
                  <div className="rounded-xl bg-primary/10 p-3">{item.after}</div>
                </div>
                <div className="text-xs text-muted-foreground">{t("Before → After", "Trước → Sau")}</div>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-primary/20 bg-primary/5 p-6 text-center">
            <div className="text-lg font-bold">
              🛡️ {t("100% Money Back Guarantee", "Cam Kết Hoàn Tiền 100%")}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              {t(
                "Not satisfied with the quality? We'll refund every penny.",
                "Không hài lòng với chất lượng? Chúng tôi hoàn lại toàn bộ tiền.",
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Monthly Combos */}
      <section id="combos" className="py-24 px-4 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary mb-4">
              💎 {t("Monthly Packages", "Gói Tháng")}
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              {t("Save More With Combos", "Tiết Kiệm Hơn Với Gói Tháng")}
            </h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              {t(
                "Subscribe monthly and save up to 35% compared to single bookings.",
                "Đăng ký theo tháng và tiết kiệm đến 35% so với đặt lịch từng lần.",
              )}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {combos.map((combo) => (
              <ComboPreviewCard key={combo.id} combo={combo} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="reviews" className="py-24 px-4 md:px-8 bg-accent/20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary mb-4">
              ⭐ {t("Customer Reviews", "Đánh Giá Khách Hàng")}
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              {t("What Our Customers Say", "Khách Hàng Nói Gì Về Chúng Tôi")}
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((review) => (
              <div key={review.id} className="rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm p-6 space-y-4">
                <div className="flex gap-1">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  "{t(review.content, review.contentVi)}"
                </p>
                <div>
                  <div className="font-semibold text-sm">{review.name}</div>
                  <div className="text-xs text-muted-foreground">{review.vehicle}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 px-4 md:px-8">
        <div className="mx-auto max-w-4xl text-center space-y-6 rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-blue-500/10 p-12 shadow-xl">
          <h2 className="text-3xl md:text-4xl font-extrabold">
            {t("Ready to Book Your First Wash?", "Sẵn Sàng Đặt Lịch Rửa Xe?")}
          </h2>
          <p className="text-muted-foreground">
            {t("Join thousands of happy car owners in HCMC.", "Hàng nghìn chủ xe tại TP.HCM đã tin tưởng chúng tôi.")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-8 py-4 text-base font-bold text-primary-foreground shadow-lg shadow-primary/30 hover:bg-primary/90 hover:-translate-y-1 transition-all"
            >
              {t("Create Free Account", "Tạo Tài Khoản Miễn Phí")} <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border/60 bg-background/60 px-8 py-4 text-base font-semibold hover:bg-accent transition-all"
            >
              {t("Sign In", "Đăng Nhập")}
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}

export function PublicHomePage() {
  return (
    <LanguageProvider>
      <HomepageContent />
    </LanguageProvider>
  );
}
