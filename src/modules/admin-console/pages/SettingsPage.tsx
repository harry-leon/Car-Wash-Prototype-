import * as React from "react";
import {
  Banknote,
  Building2,
  Coins,
  Globe,
  Settings as SettingsIcon,
  ShieldAlert,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { SettingsSection } from "../components/SettingsSection";
import { defaultSettings } from "../mock/settings.mock";
import type { AdminSettingsState } from "../types/settings.types";
import styles from "../styles/settings.module.css";

const AVAILABLE_LANGUAGES = [
  { code: "vi-VN", label: "Tiếng Việt" },
  { code: "en-US", label: "English (US)" },
  { code: "ja-JP", label: "日本語" },
  { code: "ko-KR", label: "한국어" },
];

export function SettingsPage() {
  const [settings, setSettings] = React.useState<AdminSettingsState>(defaultSettings);

  const update = <K extends keyof AdminSettingsState>(
    key: K,
    value: AdminSettingsState[K],
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const toggleLanguage = (code: string) => {
    setSettings((prev) => {
      const exists = prev.localization.supportedLanguages.includes(code);
      const nextList = exists
        ? prev.localization.supportedLanguages.filter((item) => item !== code)
        : [...prev.localization.supportedLanguages, code];
      return {
        ...prev,
        localization: {
          ...prev.localization,
          supportedLanguages: nextList.length > 0 ? nextList : prev.localization.supportedLanguages,
        },
      };
    });
  };

  const handleReset = () => {
    setSettings(defaultSettings);
    toast.success("Settings reset to defaults (mock).");
  };

  const handleSave = () => {
    toast.success("Settings saved locally (mock — nothing persisted).");
  };

  return (
    <div className="p-4 md:p-8 lg:p-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-primary shadow-sm backdrop-blur-md">
              <SettingsIcon className="h-3.5 w-3.5" /> Settings
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Workspace settings
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-muted-foreground md:text-base">
              Tune business identity, loyalty conversion and localization. All changes stay in local state only.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleReset}>Reset defaults</Button>
            <Button onClick={handleSave}>Save changes</Button>
          </div>
        </div>

        <div className={styles.sectionGrid}>
          <SettingsSection
            title="Business information"
            icon={<Building2 className="h-4 w-4 text-primary" />}
            description="Public identity of the carwash network."
          >
            <div className={styles.fieldRow}>
              <Field label="Brand name">
                <Input
                  value={settings.business.brandName}
                  onChange={(event) => update("business", { ...settings.business, brandName: event.target.value })}
                />
              </Field>
              <Field label="Hotline">
                <Input
                  value={settings.business.hotline}
                  onChange={(event) => update("business", { ...settings.business, hotline: event.target.value })}
                />
              </Field>
              <Field label="Email">
                <Input
                  type="email"
                  value={settings.business.email}
                  onChange={(event) => update("business", { ...settings.business, email: event.target.value })}
                />
              </Field>
              <Field label="Operating hours">
                <Input
                  value={settings.business.operatingHours}
                  onChange={(event) => update("business", { ...settings.business, operatingHours: event.target.value })}
                />
              </Field>
            </div>
            <Field label="Headquarter">
              <Textarea
                rows={2}
                value={settings.business.headquarter}
                onChange={(event) => update("business", { ...settings.business, headquarter: event.target.value })}
              />
            </Field>
          </SettingsSection>

          <SettingsSection
            title="Cancellation policy"
            icon={<XCircle className="h-4 w-4 text-rose-500" />}
            description="Rules for free/late cancellation and refunds."
          >
            <div className={styles.fieldRow}>
              <Field label="Free cancel hours-before">
                <Input
                  type="number"
                  min={0}
                  value={settings.cancellation.freeCancelHoursBefore}
                  onChange={(event) =>
                    update("cancellation", {
                      ...settings.cancellation,
                      freeCancelHoursBefore: Number(event.target.value),
                    })
                  }
                />
              </Field>
              <Field label="Late cancel fee %">
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={settings.cancellation.lateCancelFeePercent}
                  onChange={(event) =>
                    update("cancellation", {
                      ...settings.cancellation,
                      lateCancelFeePercent: Number(event.target.value),
                    })
                  }
                />
              </Field>
            </div>
            <Field label="Refund policy">
              <Textarea
                rows={3}
                value={settings.cancellation.refundPolicy}
                onChange={(event) =>
                  update("cancellation", { ...settings.cancellation, refundPolicy: event.target.value })
                }
              />
            </Field>
          </SettingsSection>

          <SettingsSection
            title="Point conversion rate"
            icon={<Coins className="h-4 w-4 text-amber-500" />}
            description="How customers earn and redeem loyalty points."
          >
            <div className={styles.fieldRow}>
              <Field label="VND spent per 1 point">
                <Input
                  type="number"
                  min={1}
                  value={settings.point.spendPerPoint}
                  onChange={(event) =>
                    update("point", { ...settings.point, spendPerPoint: Number(event.target.value) })
                  }
                />
              </Field>
              <Field label="VND value of 1 point">
                <Input
                  type="number"
                  min={1}
                  value={settings.point.pointValueVnd}
                  onChange={(event) =>
                    update("point", { ...settings.point, pointValueVnd: Number(event.target.value) })
                  }
                />
              </Field>
              <Field label="Min redeem points">
                <Input
                  type="number"
                  min={0}
                  value={settings.point.minRedeemPoints}
                  onChange={(event) =>
                    update("point", { ...settings.point, minRedeemPoints: Number(event.target.value) })
                  }
                />
              </Field>
            </div>
          </SettingsSection>

          <SettingsSection
            title="No-show threshold"
            icon={<ShieldAlert className="h-4 w-4 text-orange-500" />}
            description="When customers should be auto-suspended for repeated no-shows."
          >
            <div className={styles.fieldRow}>
              <Field label="Threshold (no-shows)">
                <Input
                  type="number"
                  min={1}
                  value={settings.noShow.thresholdCount}
                  onChange={(event) =>
                    update("noShow", { ...settings.noShow, thresholdCount: Number(event.target.value) })
                  }
                />
              </Field>
              <Field label="Cooldown (days)">
                <Input
                  type="number"
                  min={0}
                  value={settings.noShow.cooldownDays}
                  onChange={(event) =>
                    update("noShow", { ...settings.noShow, cooldownDays: Number(event.target.value) })
                  }
                />
              </Field>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-border/50 bg-background/40 p-3">
              <div>
                <div className="text-sm font-semibold">Auto-suspend after threshold</div>
                <div className="text-xs text-muted-foreground">Suspends the customer until cooldown ends.</div>
              </div>
              <Switch
                checked={settings.noShow.autoSuspend}
                onCheckedChange={(checked) => update("noShow", { ...settings.noShow, autoSuspend: checked })}
              />
            </div>
          </SettingsSection>

          <SettingsSection
            title="Supported languages"
            icon={<Globe className="h-4 w-4 text-sky-500" />}
            description="Languages exposed to the customer-facing app."
          >
            <div className="space-y-2">
              {AVAILABLE_LANGUAGES.map((lang) => (
                <label key={lang.code} className="flex cursor-pointer items-center justify-between rounded-md border border-border/50 bg-background/40 px-3 py-2 text-sm">
                  <span>
                    <span className="font-semibold">{lang.label}</span>
                    <span className="ml-2 font-mono text-xs text-muted-foreground">{lang.code}</span>
                  </span>
                  <Checkbox
                    checked={settings.localization.supportedLanguages.includes(lang.code)}
                    onCheckedChange={() => toggleLanguage(lang.code)}
                  />
                </label>
              ))}
            </div>
            <Field label="Default language">
              <Select
                value={settings.localization.defaultLanguage}
                onValueChange={(next) =>
                  update("localization", { ...settings.localization, defaultLanguage: next })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {settings.localization.supportedLanguages.map((code) => (
                    <SelectItem key={code} value={code}>
                      {AVAILABLE_LANGUAGES.find((item) => item.code === code)?.label ?? code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </SettingsSection>

          <SettingsSection
            title="Currency format"
            icon={<Banknote className="h-4 w-4 text-emerald-500" />}
            description="Locale-aware currency display."
          >
            <div className={styles.fieldRow}>
              <Field label="Currency code">
                <Input
                  value={settings.localization.currencyCode}
                  onChange={(event) =>
                    update("localization", { ...settings.localization, currencyCode: event.target.value })
                  }
                />
              </Field>
              <Field label="Currency symbol">
                <Input
                  value={settings.localization.currencySymbol}
                  onChange={(event) =>
                    update("localization", { ...settings.localization, currencySymbol: event.target.value })
                  }
                />
              </Field>
            </div>
            <Field label="Number format">
              <Select
                value={settings.localization.numberFormat}
                onValueChange={(next) =>
                  update("localization", {
                    ...settings.localization,
                    numberFormat: next as AdminSettingsState["localization"]["numberFormat"],
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vi-VN">vi-VN (e.g. 1.234.567)</SelectItem>
                  <SelectItem value="en-US">en-US (e.g. 1,234,567)</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </SettingsSection>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}
