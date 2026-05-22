import * as React from "react";
import { BarChart3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BookingTrendChart } from "../components/BookingTrendChart";
import { ReportSummaryCards } from "../components/ReportSummaryCards";
import { useCarwashStore } from "@/lib/carwash-store";
import type {
  BookingTrendPoint,
  PointSummaryRow,
  PromotionEffectivenessRow,
  ReportSummary,
} from "../types/report.types";

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function localDateISO(date: Date) {
  const tzOffsetMs = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - tzOffsetMs).toISOString().slice(0, 10);
}

export function ReportsPage() {
  const { bookings, transactions, ledger, promotions, hydrated } = useCarwashStore();

  const today = React.useMemo(() => localDateISO(new Date()), []);
  const monthStart = React.useMemo(() => today.slice(0, 7), [today]);

  const reportSummary: ReportSummary = React.useMemo(() => {
    const todays = bookings.filter((booking) => booking.dateISO === today);
    const monthly = bookings.filter((booking) => booking.dateISO.startsWith(monthStart));
    const monthlyTransactions = transactions.filter((tx) =>
      tx.date.startsWith(monthStart),
    );
    const todaysTransactions = transactions.filter((tx) => tx.date.startsWith(today));
    const completedMonth = monthly.filter((booking) => booking.status === "Completed");
    const noShowMonth = monthly.filter((booking) => booking.status === "No-show");
    const noShowRate = monthly.length === 0 ? 0 : (noShowMonth.length / monthly.length) * 100;

    const monthlyLedger = ledger.filter((entry) => entry.date.startsWith(monthStart));
    const pointsEarned = monthlyLedger
      .filter((entry) => entry.type === "Earned" && entry.delta > 0)
      .reduce((sum, entry) => sum + entry.delta, 0);
    const pointsRedeemed = monthlyLedger
      .filter((entry) => entry.type === "Spent" || entry.delta < 0)
      .reduce((sum, entry) => sum + Math.abs(entry.delta), 0);

    const promotionUsage = monthlyTransactions.filter((tx) => Boolean(tx.promoCode)).length;

    return {
      dailyBookings: todays.length,
      monthlyBookings: monthly.length,
      dailyRevenue: todaysTransactions.reduce((sum, tx) => sum + tx.finalAmount, 0),
      monthlyRevenue: monthlyTransactions.reduce((sum, tx) => sum + tx.finalAmount, 0),
      noShowRate,
      promotionUsage,
      pointsEarned,
      pointsRedeemed,
    };
  }, [bookings, transactions, ledger, today, monthStart]);

  const bookingTrend: BookingTrendPoint[] = React.useMemo(() => {
    const days: BookingTrendPoint[] = [];
    const now = new Date();
    for (let i = 6; i >= 0; i -= 1) {
      const dayDate = new Date(now);
      dayDate.setDate(now.getDate() - i);
      const iso = localDateISO(dayDate);
      const dayBookings = bookings.filter((booking) => booking.dateISO === iso);
      days.push({
        label: WEEKDAY_LABELS[dayDate.getDay()],
        bookings: dayBookings.length,
        completed: dayBookings.filter((booking) => booking.status === "Completed").length,
      });
    }
    return days;
  }, [bookings]);

  const promotionEffectiveness: PromotionEffectivenessRow[] = React.useMemo(() => {
    return promotions.map((promo) => {
      const matched = transactions.filter((tx) => tx.promoCode === promo.code);
      const usage = matched.length;
      const revenueImpact = matched.reduce((sum, tx) => sum + tx.promoDiscount, 0);
      const conversionRate = transactions.length === 0 ? 0 : (usage / transactions.length) * 100;
      return {
        promotionName: promo.code,
        usage,
        revenueImpact,
        conversionRate,
      };
    });
  }, [promotions, transactions]);

  const pointSummary: PointSummaryRow[] = React.useMemo(() => {
    const buckets: Record<PointSummaryRow["type"], { total: number; count: number }> = {
      EARN: { total: 0, count: 0 },
      REDEEM: { total: 0, count: 0 },
      ADJUST: { total: 0, count: 0 },
      EXPIRE: { total: 0, count: 0 },
      REFUND: { total: 0, count: 0 },
    };
    ledger.forEach((entry) => {
      const key: PointSummaryRow["type"] =
        entry.type === "Earned"
          ? "EARN"
          : entry.type === "Spent"
            ? "REDEEM"
            : "ADJUST";
      buckets[key].total += entry.delta;
      buckets[key].count += 1;
    });
    return (Object.keys(buckets) as PointSummaryRow["type"][])
      .filter((key) => buckets[key].count > 0)
      .map((key) => ({
        type: key,
        total: buckets[key].total,
        transactionCount: buckets[key].count,
      }));
  }, [ledger]);

  return (
    <div className="p-4 md:p-8 lg:p-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-primary shadow-sm backdrop-blur-md">
            <BarChart3 className="h-3.5 w-3.5" /> Reports
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Business reports
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground md:text-base">
            Daily and monthly performance, booking trends, no-show analysis and promotion effectiveness — all derived from the live store.
          </p>
        </div>

        {!hydrated ? (
          <Card className="border-border/50 bg-card/60 p-10 text-center text-sm text-muted-foreground backdrop-blur-xl">
            Loading reports…
          </Card>
        ) : (
          <>
            <ReportSummaryCards summary={reportSummary} />

            <BookingTrendChart data={bookingTrend} />

            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="border-border/50 bg-card/60 shadow-lg backdrop-blur-xl">
                <CardHeader className="border-b border-border/50 bg-accent/20 py-4">
                  <CardTitle className="text-base font-semibold">Promotion effectiveness</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Promotion</TableHead>
                        <TableHead className="text-right">Usage</TableHead>
                        <TableHead className="text-right">Revenue impact</TableHead>
                        <TableHead className="text-right">Conversion</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {promotionEffectiveness.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="py-8 text-center text-sm text-muted-foreground">
                            No promotions yet.
                          </TableCell>
                        </TableRow>
                      ) : (
                        promotionEffectiveness.map((row) => (
                          <TableRow key={row.promotionName}>
                            <TableCell className="font-semibold">{row.promotionName}</TableCell>
                            <TableCell className="text-right">{row.usage.toLocaleString("vi-VN")}</TableCell>
                            <TableCell className="text-right">
                              {(row.revenueImpact / 1_000_000).toFixed(1)}M ₫
                            </TableCell>
                            <TableCell className="text-right font-semibold">{row.conversionRate.toFixed(1)}%</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-card/60 shadow-lg backdrop-blur-xl">
                <CardHeader className="border-b border-border/50 bg-accent/20 py-4">
                  <CardTitle className="text-base font-semibold">Point transaction summary</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead className="text-right">Total points</TableHead>
                        <TableHead className="text-right">Transactions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pointSummary.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={3} className="py-8 text-center text-sm text-muted-foreground">
                            No point movements yet.
                          </TableCell>
                        </TableRow>
                      ) : (
                        pointSummary.map((row) => (
                          <TableRow key={row.type}>
                            <TableCell>
                              <Badge variant="outline" className="border font-semibold">{row.type}</Badge>
                            </TableCell>
                            <TableCell className={`text-right font-semibold ${row.total >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                              {row.total >= 0 ? "+" : ""}
                              {row.total.toLocaleString("vi-VN")}
                            </TableCell>
                            <TableCell className="text-right">{row.transactionCount.toLocaleString("vi-VN")}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>

            <Card className="border-border/50 bg-card/60 shadow-lg backdrop-blur-xl">
              <CardHeader className="border-b border-border/50 bg-accent/20 py-4">
                <CardTitle className="text-base font-semibold">No-show analysis</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 p-5 sm:grid-cols-3">
                <Metric label="No-show rate" value={`${reportSummary.noShowRate.toFixed(1)}%`} hint="This month" />
                <Metric label="Points earned" value={reportSummary.pointsEarned.toLocaleString("vi-VN")} hint="This month" />
                <Metric label="Points redeemed" value={reportSummary.pointsRedeemed.toLocaleString("vi-VN")} hint="This month" />
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}

function Metric({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-xl border border-border/50 bg-background/40 p-4">
      <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1.5 text-2xl font-bold tracking-tight text-foreground">{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">{hint}</div>
    </div>
  );
}
