import * as React from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, LockKeyhole, Mail } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { mockLogin, ROLE_REDIRECT } from "../mock/auth.mock";
import { useCarwashStore } from "@/lib/carwash-store";
import type { Role as StoreRole } from "@/lib/carwash-store";
import { useLanguage } from "./LanguageSwitcher";
import { ForgotPasswordModal } from "./ForgotPasswordModal";

const ROLE_MAP: Record<string, StoreRole> = {
  customer: "Customer",
  admin: "Admin",
  staff: "Staff",
};

export function LoginForm() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { loginAs } = useCarwashStore();
  const [emailOrPhone, setEmailOrPhone] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [forgotOpen, setForgotOpen] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrPhone.trim()) return toast.error(t("Email or phone is required.", "Vui lòng nhập email hoặc số điện thoại."));
    if (!password.trim()) return toast.error(t("Password is required.", "Vui lòng nhập mật khẩu."));

    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 700));

    const user = mockLogin(emailOrPhone.trim(), password.trim());
    if (!user) {
      toast.error(t("Incorrect credentials. Try customer@aura.vn / password123", "Sai thông tin. Thử customer@aura.vn / password123"));
      setSubmitting(false);
      return;
    }

    const storeRole = ROLE_MAP[user.role];
    loginAs(storeRole);
    toast.success(t(`Welcome, ${user.fullName}!`, `Chào mừng, ${user.fullName}!`));
    navigate({ to: ROLE_REDIRECT[user.role] });
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="emailOrPhone">{t("Email / Phone", "Email / Số điện thoại")}</Label>
          <div className="relative group">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              id="emailOrPhone"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              placeholder="customer@aura.vn"
              className="pl-10 h-12 bg-background/50 border-border/60 focus:bg-background transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">{t("Password", "Mật khẩu")}</Label>
            <button
              type="button"
              onClick={() => setForgotOpen(true)}
              className="text-xs font-medium text-primary hover:underline"
            >
              {t("Forgot password?", "Quên mật khẩu?")}
            </button>
          </div>
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

        {/* Demo hint */}
        <div className="rounded-xl bg-accent/50 p-3 text-xs text-muted-foreground space-y-1">
          <div className="font-semibold text-foreground">{t("Demo Accounts:", "Tài Khoản Demo:")}</div>
          <div>👤 customer@aura.vn / password123</div>
          <div>🔧 staff@aura.vn / staff123</div>
          <div>🛡️ admin@aura.vn / admin123</div>
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
              {t("Signing in...", "Đang đăng nhập...")}
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              {t("Sign In", "Đăng Nhập")} <ArrowRight className="h-4 w-4" />
            </span>
          )}
        </Button>
      </form>

      <ForgotPasswordModal open={forgotOpen} onClose={() => setForgotOpen(false)} />
    </>
  );
}
