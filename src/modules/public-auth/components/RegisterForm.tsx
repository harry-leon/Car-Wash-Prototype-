import * as React from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, LockKeyhole, Mail, User } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCarwashStore } from "@/lib/carwash-store";
import { useLanguage } from "./LanguageSwitcher";

export function RegisterForm() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { loginAs } = useCarwashStore();

  const [fullName, setFullName] = React.useState("");
  const [emailOrPhone, setEmailOrPhone] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return toast.error(t("Full name is required.", "Vui lòng nhập họ và tên."));
    if (!emailOrPhone.trim()) return toast.error(t("Email or phone is required.", "Vui lòng nhập email hoặc số điện thoại."));
    if (password.length < 6) return toast.error(t("Password must be at least 6 characters.", "Mật khẩu phải có ít nhất 6 ký tự."));
    if (password !== confirmPassword) return toast.error(t("Passwords do not match.", "Mật khẩu xác nhận không khớp."));

    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));

    // Mock register: log in as Customer with default values
    // membershipTier = Member, availablePoints = 0, lifetimePoints = 0
    loginAs("Customer");
    toast.success(t("Account created! Welcome to AURA CAR CARE.", "Tạo tài khoản thành công! Chào mừng đến AURA CAR CARE."));
    navigate({ to: "/customer/overview" });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="fullName">{t("Full Name", "Họ và Tên")}</Label>
        <div className="relative group">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder={t("Nguyen Van A", "Nguyễn Văn A")}
            className="pl-10 h-12 bg-background/50 border-border/60 focus:bg-background transition-all"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="emailOrPhone">{t("Email / Phone", "Email / Số điện thoại")}</Label>
        <div className="relative group">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            id="emailOrPhone"
            value={emailOrPhone}
            onChange={(e) => setEmailOrPhone(e.target.value)}
            placeholder="example@email.com"
            className="pl-10 h-12 bg-background/50 border-border/60 focus:bg-background transition-all"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">{t("Password", "Mật khẩu")}</Label>
        <div className="relative group">
          <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="pl-10 h-12 bg-background/50 border-border/60 focus:bg-background transition-all"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">{t("Confirm Password", "Xác nhận mật khẩu")}</Label>
        <div className="relative group">
          <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            className="pl-10 h-12 bg-background/50 border-border/60 focus:bg-background transition-all"
          />
        </div>
      </div>

      {/* Default tier info */}
      <div className="rounded-xl bg-primary/5 border border-primary/20 p-3 text-xs space-y-1 text-muted-foreground">
        <div className="font-semibold text-foreground">
          {t("New account defaults:", "Thông tin tài khoản mới:")}
        </div>
        <div>🏅 {t("Membership Tier: Member", "Hạng thành viên: Member")}</div>
        <div>⭐ {t("Available Points: 0", "Điểm hiện có: 0")}</div>
        <div>🏆 {t("Lifetime Points: 0", "Tổng điểm tích lũy: 0")}</div>
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full h-12 text-base font-semibold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all"
        disabled={submitting}
      >
        {submitting ? (
          <span className="flex items-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            {t("Creating account...", "Đang tạo tài khoản...")}
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            {t("Create Account", "Tạo Tài Khoản")} <ArrowRight className="h-4 w-4" />
          </span>
        )}
      </Button>
    </form>
  );
}
