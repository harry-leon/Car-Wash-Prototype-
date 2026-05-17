import * as React from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { ShieldCheck, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { usePortal } from "@/lib/portal-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/verify")({
  component: VerifyPage,
});

const LENGTH = 6;

function VerifyPage() {
  const { pending, completeRegistration } = usePortal();
  const navigate = useNavigate();

  const [digits, setDigits] = React.useState<string[]>(Array(LENGTH).fill(""));
  const [seconds, setSeconds] = React.useState(60);
  const [verifying, setVerifying] = React.useState(false);
  const refs = React.useRef<(HTMLInputElement | null)[]>([]);

  React.useEffect(() => {
    if (seconds === 0) return;
    const t = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [seconds]);

  const code = digits.join("");
  const ready = code.length === LENGTH && digits.every((d) => d !== "");

  const handleChange = (i: number, v: string) => {
    const ch = v.replace(/\D/g, "").slice(-1);
    setDigits((prev) => {
      const n = [...prev];
      n[i] = ch;
      return n;
    });
    if (ch && i < LENGTH - 1) refs.current[i + 1]?.focus();
  };

  const handleKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) refs.current[i - 1]?.focus();
    if (e.key === "ArrowLeft" && i > 0) refs.current[i - 1]?.focus();
    if (e.key === "ArrowRight" && i < LENGTH - 1) refs.current[i + 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, LENGTH);
    if (!text) return;
    e.preventDefault();
    const next = Array(LENGTH).fill("");
    for (let i = 0; i < text.length; i++) next[i] = text[i];
    setDigits(next);
    refs.current[Math.min(text.length, LENGTH - 1)]?.focus();
  };

  const handleVerify = async () => {
    if (!ready) return;
    setVerifying(true);
    await new Promise((r) => setTimeout(r, 900));
    setVerifying(false);
    if (pending) {
      completeRegistration();
      toast.success("Phone verified — welcome aboard!");
      navigate({ to: "/profile" });
    } else {
      toast.success("Phone verified");
      navigate({ to: "/profile" });
    }
  };

  const handleResend = () => {
    setSeconds(60);
    setDigits(Array(LENGTH).fill(""));
    refs.current[0]?.focus();
    toast("New verification code sent");
  };

  const masked = pending ? `${pending.countryCode} ${pending.phone.replace(/(\d{3})(\d{3})(\d+)/, "$1•••$3")}` : "your phone";

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-border bg-card shadow-sm p-6 md:p-8">
          <div className="flex items-center justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <ShieldCheck className="h-6 w-6" />
            </div>
          </div>
          <h1 className="mt-4 text-center text-xl font-semibold tracking-tight">Verify your number</h1>
          <p className="mt-1 text-center text-sm text-muted-foreground">
            We sent a 6-digit code to <span className="font-medium text-foreground">{masked}</span>
          </p>

          <div className="mt-6 flex justify-center gap-2" onPaste={handlePaste}>
            {digits.map((d, i) => (
              <input
                key={i}
                ref={(el) => {
                  refs.current[i] = el;
                }}
                value={d}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKey(i, e)}
                inputMode="numeric"
                maxLength={1}
                className={cn(
                  "h-12 w-10 sm:h-14 sm:w-12 rounded-lg border text-center text-xl font-semibold shadow-sm transition-all",
                  "focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary",
                  d ? "border-primary bg-primary/5" : "border-border bg-background",
                )}
              />
            ))}
          </div>

          <div className="mt-5 text-center text-sm text-muted-foreground">
            {seconds > 0 ? (
              <>Resend code in <span className="font-medium text-foreground">{seconds}s</span></>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                className="font-medium text-primary hover:underline"
              >
                Resend code
              </button>
            )}
          </div>

          <Button
            className="mt-6 w-full"
            size="lg"
            disabled={!ready || verifying}
            onClick={handleVerify}
          >
            {verifying ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Verifying…
              </>
            ) : (
              "Verify & Complete"
            )}
          </Button>

          <div className="mt-4 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to registration
            </Link>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Tip: any 6-digit code works in this prototype.
        </p>
      </div>
    </div>
  );
}