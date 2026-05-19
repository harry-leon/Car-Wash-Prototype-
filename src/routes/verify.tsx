import * as React from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { GuestLayout } from "@/components/guest-layout";
import { GuestOnly } from "@/components/route-guards";
import { Button } from "@/components/ui/button";
import { getHomePath } from "@/lib/auth";
import { useCarwashStore } from "@/lib/carwash-store";
import { usePortal } from "@/lib/portal-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/verify")({
  component: VerifyPage,
});

const LENGTH = 6;

export function VerifyPage() {
  const { pending, completeRegistration } = usePortal();
  const navigate = useNavigate();
  const { loginAs } = useCarwashStore();
  const [digits, setDigits] = React.useState<string[]>(Array(LENGTH).fill(""));
  const [seconds, setSeconds] = React.useState(60);
  const [verifying, setVerifying] = React.useState(false);
  const refs = React.useRef<(HTMLInputElement | null)[]>([]);

  React.useEffect(() => {
    if (seconds === 0) return;
    const timer = setInterval(() => setSeconds((value) => (value > 0 ? value - 1 : 0)), 1000);
    return () => clearInterval(timer);
  }, [seconds]);

  const code = digits.join("");
  const ready = code.length === LENGTH && digits.every((digit) => digit !== "");

  const handleChange = (index: number, value: string) => {
    const nextDigit = value.replace(/\D/g, "").slice(-1);
    setDigits((prev) => {
      const next = [...prev];
      next[index] = nextDigit;
      return next;
    });
    if (nextDigit && index < LENGTH - 1) {
      refs.current[index + 1]?.focus();
    }
  };

  const handleKey = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      refs.current[index - 1]?.focus();
    }
    if (event.key === "ArrowLeft" && index > 0) {
      refs.current[index - 1]?.focus();
    }
    if (event.key === "ArrowRight" && index < LENGTH - 1) {
      refs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (event: React.ClipboardEvent) => {
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, LENGTH);
    if (!pasted) return;
    event.preventDefault();
    const next = Array(LENGTH).fill("");
    for (let index = 0; index < pasted.length; index += 1) {
      next[index] = pasted[index];
    }
    setDigits(next);
    refs.current[Math.min(pasted.length, LENGTH - 1)]?.focus();
  };

  const handleVerify = async () => {
    if (!ready) return;

    setVerifying(true);
    await new Promise((resolve) => setTimeout(resolve, 900));

    try {
      if (pending) {
        completeRegistration();
        loginAs("Customer");
        toast.success("Phone verified - welcome aboard!");
      } else {
        toast.success("Phone verified");
      }
      navigate({ to: getHomePath("Customer") });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to complete registration.");
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = () => {
    setSeconds(60);
    setDigits(Array(LENGTH).fill(""));
    refs.current[0]?.focus();
    toast("New verification code sent");
  };

  const masked = pending
    ? `${pending.countryCode} ${pending.phone.replace(/(\d{3})(\d{3})(\d+)/, "$1***$3")}`
    : "your phone";

  return (
    <GuestOnly>
      <GuestLayout
        title="Verify your number"
        description="Confirm the 6-digit OTP to activate the new customer account."
      >
        <div className="mx-auto w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8">
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
            {digits.map((digit, index) => (
              <input
                key={index}
                ref={(element) => {
                  refs.current[index] = element;
                }}
                value={digit}
                onChange={(event) => handleChange(index, event.target.value)}
                onKeyDown={(event) => handleKey(index, event)}
                inputMode="numeric"
                maxLength={1}
                className={cn(
                  "h-12 w-10 rounded-lg border bg-background text-center text-xl font-semibold shadow-sm transition-all sm:h-14 sm:w-12",
                  "focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40",
                  digit ? "border-primary bg-primary/5" : "border-border",
                )}
              />
            ))}
          </div>

          <div className="mt-5 text-center text-sm text-muted-foreground">
            {seconds > 0 ? (
              <>
                Resend code in <span className="font-medium text-foreground">{seconds}s</span>
              </>
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
                Verifying...
              </>
            ) : (
              "Verify & Complete"
            )}
          </Button>

          <div className="mt-4 text-center">
            <Link
              to="/register"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to registration
            </Link>
          </div>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            Tip: any 6-digit code works in this prototype.
          </p>
        </div>
      </GuestLayout>
    </GuestOnly>
  );
}
