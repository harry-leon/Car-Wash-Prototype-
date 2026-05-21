import * as React from "react";
import { ArrowLeft, UserCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CustomerProfilePanel } from "../components/CustomerProfilePanel";
import { CustomerVehiclesTab } from "../components/CustomerVehiclesTab";
import { CustomerBookingsTab } from "../components/CustomerBookingsTab";
import { CustomerWashHistoryTab } from "../components/CustomerWashHistoryTab";
import { CustomerPointsTab } from "../components/CustomerPointsTab";
import { CustomerTierHistoryTab } from "../components/CustomerTierHistoryTab";
import {
  customers,
  customerBookings,
  customerVehicles,
  pointTransactionsByCustomer,
  tierHistoryByCustomer,
  washHistory,
} from "../mock/customers.mock";
import type {
  CustomerRole,
  CustomerRow,
  CustomerStatus,
} from "../types/customer.types";
import styles from "../styles/customers.module.css";

interface Props {
  customerId: string;
  onBack?: () => void;
}

export function CustomerDetailPage({ customerId, onBack }: Props) {
  const customer: CustomerRow | undefined = customers.find((row) => row.id === customerId);

  const [draftRole, setDraftRole] = React.useState<CustomerRole>(customer?.role ?? "CUSTOMER");
  const [draftStatus, setDraftStatus] = React.useState<CustomerStatus>(customer?.status ?? "ACTIVE");

  React.useEffect(() => {
    if (customer) {
      setDraftRole(customer.role);
      setDraftStatus(customer.status);
    }
  }, [customer]);

  if (!customer) {
    return (
      <div className="p-6 md:p-10">
        <div className="rounded-2xl border border-border/50 bg-card/60 p-8 text-center backdrop-blur-xl">
          <p className="text-sm text-muted-foreground">Customer not found.</p>
          {onBack ? (
            <Button variant="outline" className="mt-4 gap-2" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" /> Back to list
            </Button>
          ) : null}
        </div>
      </div>
    );
  }

  const vehicles = customerVehicles[customer.id] ?? [];
  const bookings = customerBookings[customer.id] ?? [];
  const history = washHistory[customer.id] ?? [];
  const points = pointTransactionsByCustomer[customer.id] ?? [];
  const tierHistory = tierHistoryByCustomer[customer.id] ?? [];

  const handleRoleChange = (next: CustomerRole) => {
    setDraftRole(next);
    toast.success(`Mock: role set to ${next}`);
  };

  const handleStatusChange = (next: CustomerStatus) => {
    setDraftStatus(next);
    toast.success(`Mock: status set to ${next}`);
  };

  return (
    <div className="p-4 md:p-8 lg:p-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-primary shadow-sm backdrop-blur-md">
              <UserCircle2 className="h-3.5 w-3.5" /> Customer detail
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              {customer.name}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              ID: <span className="font-mono">{customer.id}</span>
            </p>
          </div>
          {onBack ? (
            <Button variant="outline" className="gap-2" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" /> Back to list
            </Button>
          ) : null}
        </div>

        <div className={styles.profileGrid}>
          <CustomerProfilePanel
            customer={customer}
            draftRole={draftRole}
            draftStatus={draftStatus}
            onRoleChange={handleRoleChange}
            onStatusChange={handleStatusChange}
          />

          <Tabs defaultValue="profile">
            <TabsList className="flex w-full flex-wrap justify-start gap-1 bg-card/60 p-1 backdrop-blur-xl">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
              <TabsTrigger value="wash-history">Wash History</TabsTrigger>
              <TabsTrigger value="points">Point Transactions</TabsTrigger>
              <TabsTrigger value="tiers">Tier History</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="mt-4">
              <div className="rounded-2xl border border-border/50 bg-card/60 p-6 backdrop-blur-xl">
                <div className="grid gap-4 sm:grid-cols-2">
                  <ProfileField label="Full name" value={customer.name} />
                  <ProfileField label="Email" value={customer.email} />
                  <ProfileField label="Phone" value={customer.phone} mono />
                  <ProfileField label="Joined" value={customer.joinedAt} />
                  <ProfileField label="Tier" value={customer.tier} />
                  <ProfileField
                    label="Available points"
                    value={customer.availablePoints.toLocaleString("vi-VN")}
                  />
                  <ProfileField
                    label="Lifetime points"
                    value={customer.lifetimePoints.toLocaleString("vi-VN")}
                  />
                  <ProfileField label="Current role (draft)" value={draftRole} />
                  <ProfileField label="Current status (draft)" value={draftStatus} />
                </div>
                <p className="mt-6 text-xs text-muted-foreground">
                  Role &amp; status edits live in the left panel and are kept in local state only — nothing is persisted.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="vehicles" className="mt-4">
              <CustomerVehiclesTab vehicles={vehicles} />
            </TabsContent>

            <TabsContent value="bookings" className="mt-4">
              <CustomerBookingsTab bookings={bookings} />
            </TabsContent>

            <TabsContent value="wash-history" className="mt-4">
              <CustomerWashHistoryTab history={history} />
            </TabsContent>

            <TabsContent value="points" className="mt-4">
              <CustomerPointsTab transactions={points} />
            </TabsContent>

            <TabsContent value="tiers" className="mt-4">
              <CustomerTierHistoryTab history={tierHistory} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

function ProfileField({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="rounded-xl border border-border/50 bg-background/40 p-4">
      <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`mt-1.5 text-sm font-semibold text-foreground ${mono ? "font-mono" : ""}`}>{value}</div>
    </div>
  );
}
