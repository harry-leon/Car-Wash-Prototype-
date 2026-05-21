import { LayoutDashboard } from "lucide-react";
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
import { KpiCard } from "../components/KpiCard";
import { dashboardKpis, recentBookings } from "../mock/dashboard.mock";
import type { BookingStatus } from "../types/dashboard.types";
import styles from "../styles/admin-dashboard.module.css";

const STATUS_TONE: Record<BookingStatus, string> = {
  CONFIRMED: "bg-sky-500/10 text-sky-600 border-sky-500/30",
  CHECKED_IN: "bg-violet-500/10 text-violet-600 border-violet-500/30",
  IN_PROGRESS: "bg-amber-500/10 text-amber-600 border-amber-500/30",
  COMPLETED: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
  CANCELLED: "bg-zinc-500/10 text-zinc-600 border-zinc-500/30",
  NO_SHOW: "bg-rose-500/10 text-rose-600 border-rose-500/30",
};

export function AdminDashboardPage() {
  return (
    <div className={`p-4 md:p-8 lg:p-10 ${styles.page}`}>
      <div className="mx-auto max-w-7xl space-y-8">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-primary shadow-sm backdrop-blur-md">
            <LayoutDashboard className="h-3.5 w-3.5" /> Admin Workspace
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Operations dashboard
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground md:text-base">
            Snapshot of today's bookings, completion rate, loyalty issuance and active campaigns.
          </p>
        </div>

        <div className={styles.kpiGrid}>
          {dashboardKpis.map((metric) => (
            <KpiCard key={metric.id} metric={metric} />
          ))}
        </div>

        <Card className="overflow-hidden border-border/50 bg-card/60 shadow-xl backdrop-blur-xl">
          <CardHeader className="flex-row items-center justify-between border-b border-border/50 bg-accent/20 py-4">
            <CardTitle className="text-base font-semibold">Recent bookings</CardTitle>
            <span className="text-xs font-medium text-muted-foreground">
              Showing latest {recentBookings.length} of all
            </span>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Scheduled</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentBookings.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-semibold">{row.code}</TableCell>
                    <TableCell>{row.customerName}</TableCell>
                    <TableCell className="font-mono text-xs">{row.vehiclePlate}</TableCell>
                    <TableCell>{row.servicePackage}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {row.scheduledTime}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant="outline"
                        className={`border ${STATUS_TONE[row.status]} font-semibold`}
                      >
                        {row.status.replace("_", " ")}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
