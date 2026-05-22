import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ActiveComboCard } from "../components/ActiveComboCard";
import { CustomerHomeHeader } from "../components/CustomerHomeHeader";
import { PackageCard } from "../components/PackageCard";
import { useCustomerBooking } from "../routes";
import type { BookingStatus } from "../types/booking.types";
import type { CustomerProfile, MembershipTier } from "../types/customer.types";
import styles from "../styles/customer-home.module.css";

const tierThresholds: Record<MembershipTier, number> = {
  Silver: 0,
  Gold: 5000,
  Diamond: 12000,
};

const activeBookingStatuses: BookingStatus[] = ["CONFIRMED", "CHECKED_IN", "IN_PROGRESS"];

function getTierProgress(customer: CustomerProfile) {
  if (customer.tier === "Diamond") {
    return {
      currentTier: customer.tier,
      nextTier: "Max" as const,
      currentThreshold: tierThresholds.Diamond,
      nextThreshold: tierThresholds.Diamond,
      progressPercent: 100,
      pointsToNextTier: 0,
    };
  }

  const nextTier: MembershipTier = customer.tier === "Silver" ? "Gold" : "Diamond";
  const currentThreshold = tierThresholds[customer.tier];
  const nextThreshold = tierThresholds[nextTier];
  const earnedTowardTier = customer.lifetimePoints - currentThreshold;
  const tierRange = nextThreshold - currentThreshold;

  return {
    currentTier: customer.tier,
    nextTier,
    currentThreshold,
    nextThreshold,
    progressPercent: Math.min(100, Math.max(0, (earnedTowardTier / tierRange) * 100)),
    pointsToNextTier: Math.max(0, nextThreshold - customer.lifetimePoints),
  };
}

export function CustomerHomePage() {
  const navigate = useNavigate();
  const {
    activeCombo,
    bookings,
    comboPackages,
    customer,
    servicePackages,
    setBookingDraft,
    vehicles,
  } = useCustomerBooking();
  const [activeTab, setActiveTab] = useState<"packages" | "combos">("packages");
  
  const linkedVehicle = activeCombo
    ? vehicles.find((vehicle) => vehicle.id === activeCombo.linkedVehicleId)
    : undefined;
  const defaultVehicle = vehicles.find((vehicle) => vehicle.isDefault) ?? vehicles[0];
  const activeBookings = bookings.filter((booking) =>
    activeBookingStatuses.includes(booking.status),
  );
  const tierProgress = getTierProgress(customer);
  const currentComboPackage = activeCombo
    ? comboPackages.find((comboPackage) => comboPackage.id === activeCombo.comboPackageId)
    : undefined;
  const inProgressBooking = bookings.find((booking) => booking.status === "IN_PROGRESS");

  const goToBooking = () => {
    navigate({ to: "/customer/cb/booking" });
  };

  const handlePackageBooking = (packageId: string) => {
    setBookingDraft({
      packageId,
      useActiveCombo: false,
      vehicleId: defaultVehicle?.id,
    });
    goToBooking();
  };

  const handleComboUpgrade = (comboPackageId: string) => {
    const selectedCombo = comboPackages.find((comboPackage) => comboPackage.id === comboPackageId);

    if (
      !selectedCombo ||
      !currentComboPackage ||
      selectedCombo.price <= currentComboPackage.price
    ) {
      return;
    }

    const upgradeAmount = Math.max(0, selectedCombo.price - currentComboPackage.price);

    setBookingDraft({
      packageId: selectedCombo.packageIds[0] ?? servicePackages[0]?.id,
      comboUpgradePackageId: selectedCombo.id,
      comboUpgradeAmount: upgradeAmount,
      useActiveCombo: false,
      vehicleId: defaultVehicle?.id,
    });
    goToBooking();
  };

  return (
    <main className={styles.page}>
      <CustomerHomeHeader
        customer={customer}
        tierProgress={tierProgress}
        activeBookingsCount={activeBookings.length}
        defaultVehiclePlate={defaultVehicle?.licensePlate}
      />

      {inProgressBooking ? (
        <section className={styles.washTracker} aria-label="Current wash status">
          <div className={styles.progressRingWrapper}>
            <svg className={styles.progressRingSvg} viewBox="0 0 100 100">
              <defs>
                <linearGradient id="washProgressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--cb-primary)" />
                  <stop offset="100%" stopColor="var(--cb-emerald)" />
                </linearGradient>
              </defs>
              <circle
                className={styles.progressRingTrack}
                cx="50"
                cy="50"
                r="42"
                strokeWidth="7"
                fill="transparent"
              />
              <circle
                className={styles.progressRingIndicator}
                cx="50"
                cy="50"
                r="42"
                strokeWidth="7"
                fill="transparent"
                strokeDasharray="263.89"
                strokeDashoffset={263.89 - (263.89 * 60) / 100}
                strokeLinecap="round"
              />
            </svg>
            <div className={styles.progressTextContainer}>
              <strong>60%</strong>
              <span>In wash</span>
            </div>
          </div>
          <div className={styles.washTrackerInfo}>
            <span className={styles.sectionEyebrow}>Vehicle in service</span>
            <h2>{inProgressBooking.vehicle.licensePlate}</h2>
            <p>
              {inProgressBooking.package.name} is currently in progress. Estimated remaining time:
              12 minutes.
            </p>
          </div>
          <Link className={styles.trackCta} to="/customer/cb/history">
            Track wash
            <svg
              className={styles.ctaArrow}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </section>
      ) : null}

      {activeCombo ? <ActiveComboCard combo={activeCombo} linkedVehicle={linkedVehicle} /> : null}

      <section className={styles.tabSection}>
        <div className={styles.tabHeaderRow}>
          <div className={styles.tabButtonsContainer}>
            <button
              type="button"
              className={`${styles.tabBtn} ${activeTab === "packages" ? styles.tabBtnActive : ""}`}
              onClick={() => setActiveTab("packages")}
            >
              One-time Wash
            </button>
            <button
              type="button"
              className={`${styles.tabBtn} ${activeTab === "combos" ? styles.tabBtnActive : ""}`}
              onClick={() => setActiveTab("combos")}
            >
              Combos & Subscriptions
            </button>
          </div>
          <Link className={styles.mainCta} to="/customer/cb/booking">
            Book a Wash
          </Link>
        </div>

        <div className={styles.tabDescription}>
          {activeTab === "packages" ? (
            <div>
              <span className={styles.sectionEyebrow}>Wash plan</span>
              <h2>Packages for your next visit</h2>
              <p>Choose a one-time wash when you want to pay by cash, card, points, or promo.</p>
            </div>
          ) : (
            <div>
              <span className={styles.sectionEyebrow}>Combo upgrade</span>
              <h2>Upgrade your active combo</h2>
              <p>
                Current plan: {currentComboPackage?.name ?? "No active combo"}. Lower-tier combos are
                locked; upgrades charge only the price difference at checkout.
              </p>
            </div>
          )}
        </div>

        <div className={styles.tabContent}>
          {activeTab === "packages" ? (
            <div className={styles.packageGrid}>
              {servicePackages.map((servicePackage) => (
                <PackageCard
                  key={servicePackage.id}
                  actionLabel="Select and book"
                  servicePackage={servicePackage}
                  onSelect={handlePackageBooking}
                />
              ))}
            </div>
          ) : (
            <div className={styles.comboGrid}>
              {comboPackages.map((comboPackage) => {
                const isActive = comboPackage.id === activeCombo?.comboPackageId;
                const isUpgrade =
                  Boolean(currentComboPackage) && comboPackage.price > (currentComboPackage?.price ?? 0);
                const upgradeAmount = currentComboPackage
                  ? Math.max(0, comboPackage.price - currentComboPackage.price)
                  : 0;

                return (
                  <article
                    key={comboPackage.id}
                    className={`${styles.comboCard} ${isActive ? styles.comboCardActive : ""} ${
                      !isActive && !isUpgrade ? styles.comboCardLocked : ""
                    }`}
                  >
                    <div className={styles.comboCardTopline}>
                      <span>
                        {comboPackage.totalUses} washes / {comboPackage.validityDays} days
                      </span>
                      {isActive ? <em>Current combo</em> : null}
                    </div>
                    <h3>{comboPackage.name}</h3>
                    <p>{comboPackage.description}</p>
                    <div className={styles.comboPrice}>
                      <strong>{comboPackage.price.toLocaleString()} VND</strong>
                      <small>{comboPackage.savingsText}</small>
                    </div>
                    {isUpgrade ? (
                      <button type="button" onClick={() => handleComboUpgrade(comboPackage.id)}>
                        Upgrade +{upgradeAmount.toLocaleString()} VND
                      </button>
                    ) : (
                      <b>{isActive ? "Active plan" : "Downgrade locked"}</b>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

