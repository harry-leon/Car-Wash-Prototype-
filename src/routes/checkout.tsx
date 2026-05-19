import * as React from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Banknote,
  CheckCircle2,
  CreditCard,
  QrCode,
  Tag,
  XCircle,
} from "lucide-react";
import { AccessDenied } from "@/components/access-denied";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { canAccess } from "@/lib/access-control";
import { useCarwashStore } from "@/lib/carwash-store";
import { cn } from "@/lib/utils";
import { fmtMoney, useWashStore } from "@/lib/wash-store";
import { toast } from "sonner";
import { PageHeader, TierBadge } from "@/components/shared";

export const Route = createFileRoute("/checkout")({
  component: CheckoutPage,
});

const PAYMENT_METHODS = [
  { id: "cash", label: "Cash", icon: Banknote },
  { id: "card", label: "Credit Card", icon: CreditCard },
  { id: "qr", label: "Bank Transfer QR", icon: QrCode },
];

function CheckoutPage() {
  const { role } = useCarwashStore();
  const { draft, promotions, completeCheckout, setDraft } = useWashStore();
  const navigate = useNavigate();

  const [promoInput, setPromoInput] = React.useState("");
  const [appliedPromo, setAppliedPromo] = React.useState<string | null>(null);
  const [promoError, setPromoError] = React.useState<string | null>(null);
  const [pointsToRedeem, setPointsToRedeem] = React.useState(0);
  const [payment, setPayment] = React.useState("card");
  const [processing, setProcessing] = React.useState(false);

  if (!canAccess(role, ["Staff", "Admin"])) {
    return (
      <div className="mx-auto max-w-7xl p-6 md:p-10">
        <AccessDenied
          title="Checkout access is restricted"
          description="Only Staff and Admin roles can complete payment and checkout."
          role={role}
        />
      </div>
    );
  }

  if (!draft) {
    return (
      <div className="mx-auto max-w-xl p-10 text-center">
        <PageHeader title="No active session" subtitle="Start a wash session first." />
        <Button asChild className="mt-6">
          <Link to="/wash-session">
            <ArrowLeft className="h-4 w-4" /> Start a new wash
          </Link>
        </Button>
      </div>
    );
  }

  const subtotal = draft.services.reduce((sum, service) => sum + service.price, 0);
  const tierDiscount = Math.round(subtotal * (draft.customer.discountPct / 100));
  const promo = promotions.find((item) => item.code === appliedPromo && item.active) ?? null;
  const afterTier = subtotal - tierDiscount;
  const promoDiscount = promo
    ? promo.discountType === "Percentage"
      ? Math.round(afterTier * (promo.amount / 100))
      : Math.min(promo.amount, afterTier)
    : 0;
  const afterPromo = Math.max(0, afterTier - promoDiscount);
  const maxRedeemableByPoints = draft.customer.points;
  const maxRedeemableByPrice = Math.floor(afterPromo / 1000);
  const maxRedeem = Math.min(maxRedeemableByPoints, maxRedeemableByPrice);
  const safePoints = Math.min(pointsToRedeem, maxRedeem);
  const pointsValue = safePoints * 1000;
  const finalAmount = Math.max(0, afterPromo - pointsValue);
  const pointsEarned = Math.floor(Math.floor(finalAmount / 10000) * (draft.customer.multiplier ?? 1));

  const applyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    if (!code) return;
    const matched = promotions.find(
      (item) =>
        item.code === code &&
        item.active &&
        item.tiers.includes(draft.customer.tier === "Guest" ? "Member" : draft.customer.tier),
    );
    if (!matched) {
      setAppliedPromo(null);
      setPromoError("Invalid or unavailable promo code for current tier");
      toast.error("Invalid or unavailable promo code");
      return;
    }
    setAppliedPromo(code);
    setPromoError(null);
    toast.success(`Promo "${code}" applied`);
  };

  const removePromo = () => {
    setAppliedPromo(null);
    setPromoInput("");
    setPromoError(null);
  };

  const processPayment = () => {
    if (processing) return;
    setProcessing(true);
    const tx = completeCheckout({
      promoCode: appliedPromo,
      pointsRedeemed: safePoints,
      paymentMethod: PAYMENT_METHODS.find((item) => item.id === payment)?.label ?? payment,
    });
    if (!tx) {
      setProcessing(false);
      toast.error("No active wash session available for checkout.");
      return;
    }
    toast.success(`Payment processed for ${tx.id}`);
    setDraft(null);
    navigate({ to: "/confirmation" });
  };

  return (
    <div className="mx-auto max-w-6xl p-6 md:p-10">
      <PageHeader
        step="Step 3 of 3"
        title="Checkout"
        subtitle="Apply discounts, redeem points, and collect payment."
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Section title="Order Summary">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium">{draft.customer.name}</span>
              <TierBadge tier={draft.customer.tier} />
              <span className="text-xs text-muted-foreground">
                {draft.vehicleType} / <span className="font-mono">{draft.plate}</span>
              </span>
            </div>
            <div className="overflow-hidden rounded-lg border border-border">
              {draft.services.map((service) => (
                <div
                  key={service.id}
                  className="flex justify-between border-b border-border px-4 py-3 text-sm last:border-b-0"
                >
                  <span>{service.name}</span>
                  <span className="font-medium">{fmtMoney(service.price)}</span>
                </div>
              ))}
              <div className="flex justify-between bg-accent/30 px-4 py-3 text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold">{fmtMoney(subtotal)}</span>
              </div>
            </div>
          </Section>

          <Section title="Tier Discount">
            {draft.customer.tier === "Guest" ? (
              <p className="text-sm text-muted-foreground">
                Guest checkout - no member discount applied.
              </p>
            ) : (
              <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>
                    <strong>{draft.customer.tier} Membership</strong> applied -{" "}
                    {draft.customer.discountPct}%
                  </span>
                </div>
                <span className="text-sm font-semibold text-emerald-700">
                  -{fmtMoney(tierDiscount)}
                </span>
              </div>
            )}
          </Section>

          <Section title="Promo Code">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Enter promotion code"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  className="pl-9 uppercase"
                  disabled={!!appliedPromo}
                />
              </div>
              {appliedPromo ? (
                <Button variant="outline" onClick={removePromo}>
                  Remove
                </Button>
              ) : (
                <Button onClick={applyPromo}>Apply</Button>
              )}
            </div>
            {appliedPromo && (
              <div className="mt-3 flex items-center gap-2 text-sm text-emerald-700">
                <CheckCircle2 className="h-4 w-4" />
                Code <strong>{appliedPromo}</strong> active
              </div>
            )}
            {promoError && (
              <div className="mt-3 flex items-center gap-2 text-sm text-destructive">
                <XCircle className="h-4 w-4" />
                {promoError}
              </div>
            )}
          </Section>

          <Section title="Loyalty Points">
            {draft.customer.tier === "Guest" ? (
              <p className="text-sm text-muted-foreground">
                Guests cannot redeem loyalty points.
              </p>
            ) : (
              <>
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Available: <strong className="text-foreground">{draft.customer.points} pts</strong>
                  </span>
                  <span className="text-xs text-muted-foreground">1 pt = 1.000 VND</span>
                </div>
                <Slider
                  value={[safePoints]}
                  max={Math.max(maxRedeem, 1)}
                  step={1}
                  onValueChange={(value) => setPointsToRedeem(value[0])}
                  disabled={maxRedeem === 0}
                />
                <div className="mt-3 flex items-center gap-3">
                  <Label htmlFor="pts" className="text-sm">
                    Redeem
                  </Label>
                  <Input
                    id="pts"
                    type="number"
                    min={0}
                    max={maxRedeem}
                    step={1}
                    value={safePoints}
                    onChange={(e) => setPointsToRedeem(Number(e.target.value) || 0)}
                    className="w-28"
                  />
                  <span className="text-sm text-muted-foreground">
                    pts {"->"} <strong className="text-emerald-700">-{fmtMoney(pointsValue)}</strong>
                  </span>
                </div>
              </>
            )}
          </Section>

          <Section title="Payment Method">
            <div className="grid grid-cols-3 gap-3">
              {PAYMENT_METHODS.map((method) => {
                const active = payment === method.id;
                const Icon = method.icon;
                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setPayment(method.id)}
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-xl border p-4 transition-all",
                      active
                        ? "border-primary bg-primary/5 ring-2 ring-primary/30"
                        : "border-border hover:border-primary/40 hover:bg-accent/40",
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-6 w-6",
                        active ? "text-primary" : "text-muted-foreground",
                      )}
                    />
                    <span className="text-sm font-medium">{method.label}</span>
                  </button>
                );
              })}
            </div>
          </Section>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-6 rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Final Bill</div>
            <div className="mt-4 space-y-2 text-sm">
              <Row label="Subtotal" value={fmtMoney(subtotal)} />
              {tierDiscount > 0 && (
                <Row
                  label={`Tier (-${draft.customer.discountPct}%)`}
                  value={`-${fmtMoney(tierDiscount)}`}
                  emerald
                />
              )}
              {promoDiscount > 0 && (
                <Row label={`Promo ${appliedPromo}`} value={`-${fmtMoney(promoDiscount)}`} emerald />
              )}
              {pointsValue > 0 && (
                <Row label={`Points (${safePoints} pts)`} value={`-${fmtMoney(pointsValue)}`} emerald />
              )}
            </div>
            <div className="mt-4 flex items-end justify-between border-t border-border pt-4">
              <span className="text-sm text-muted-foreground">Payable</span>
              <span className="text-3xl font-bold tracking-tight">{fmtMoney(finalAmount)}</span>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">Estimated points earned: +{pointsEarned}</div>
            <Button className="mt-5 w-full" size="lg" onClick={processPayment} disabled={processing}>
              {processing ? "Processing..." : "Process Payment"}
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button asChild variant="ghost" className="mt-2 w-full">
              <Link to="/wash-session">
                <ArrowLeft className="h-4 w-4" /> Back
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <h3 className="mb-4 text-sm font-semibold tracking-tight">{title}</h3>
      {children}
    </section>
  );
}

function Row({
  label,
  value,
  emerald,
}: {
  label: string;
  value: string;
  emerald?: boolean;
}) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={cn("font-medium", emerald && "text-emerald-700")}>{value}</span>
    </div>
  );
}
