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
import {
  bookingTrend,
  pointSummary,
  promotionEffectiveness,
  reportSummary,
} from "../mock/reports.mock";

export function ReportsPage() {
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
            Daily and monthly performance, booking trends, no-show analysis and promotion effectiveness.
          </p>
        </div>

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
                  {promotionEffectiveness.map((row) => (
                    <TableRow key={row.promotionName}>
                      <TableCell className="font-semibold">{row.promotionName}</TableCell>
                      <TableCell className="text-right">{row.usage.toLocaleString("vi-VN")}</TableCell>
                      <TableCell className="text-right">
                        {(row.revenueImpact / 1_000_000).toFixed(1)}M ₫
                      </TableCell>
                      <TableCell className="text-right font-semibold">{row.conversionRate.toFixed(1)}%</TableCell>
                    </TableRow>
                  ))}
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
                  {pointSummary.map((row) => (
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
                  ))}
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
            <Metric label="No-show rate" value={`${reportSummary.noShowRate.toFixed(1)}%`} hint="Last 30 days" />
            <Metric label="Points earned" value={reportSummary.pointsEarned.toLocaleString("vi-VN")} hint="This month" />
            <Metric label="Points redeemed" value={reportSummary.pointsRedeemed.toLocaleString("vi-VN")} hint="This month" />
          </CardContent>
        </Card>
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
