import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import type { Booking, BookingSelection } from "../types/booking.types";
import { getPointDeductionValue, useCustomerBooking } from "../routes";
import { BookingTimePicker } from "./BookingTimePicker";
import { ComboUseOption } from "./ComboUseOption";
import { PointsUseOption } from "./PointsUseOption";
import styles from "../styles/booking.module.css";

function getTomorrowDate() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toISOString().slice(0, 10);
}

const bookingSteps = ["Vehicle", "Package", "Schedule", "Promotion", "Add-ons", "Summary"] as const;

export function BookingForm() {
  const {
    activeCombo,
    bookingDraft,
    bookings,
    clearBookingDraft,
    comboPackages,
    confirmBooking,
    customer,
    promotions,
    serviceAddons,
    servicePackages,
    vehicles,
  } = useCustomerBooking();
  const defaultVehicle = vehicles.find((vehicle) => vehicle.isDefault) ?? vehicles[0];
  const [selection, setSelection] = useState<BookingSelection>({
    vehicleId: bookingDraft.vehicleId ?? defaultVehicle?.id ?? "",
    packageId: bookingDraft.packageId ?? servicePackages[0]?.id ?? "",
    scheduledDate: bookingDraft.scheduledDate ?? getTomorrowDate(),
    scheduledTime: bookingDraft.scheduledTime ?? "10:30",
    promoCode: bookingDraft.promoCode ?? "",
    addonIds: bookingDraft.addonIds ?? [],
    comboUpgradePackageId: bookingDraft.comboUpgradePackageId,
    comboUpgradeAmount: bookingDraft.comboUpgradeAmount,
    pointsToRedeem: bookingDraft.pointsToRedeem ?? 0,
    useActiveCombo: bookingDraft.useActiveCombo ?? false,
  });
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [error, setError] = useState("");

  const selectedVehicle = vehicles.find((vehicle) => vehicle.id === selection.vehicleId);
  const selectedPackage =
    servicePackages.find((servicePackage) => servicePackage.id === selection.packageId) ??
    servicePackages[0];
  const selectedAddons = serviceAddons.filter((addon) => selection.addonIds.includes(addon.id));
  const selectedPromotion = promotions.find((promotion) => promotion.code === selection.promoCode);
  const promoEligible = selectedPromotion
    ? selectedPromotion.eligibleTiers.includes(customer.tier) &&
      (!selectedPromotion.newCustomersOnly || customer.isNewCustomer)
    : false;
  const promoDiscount =
    selectedPromotion && promoEligible && !selection.useActiveCombo
      ? selectedPromotion.discountAmount
      : 0;
  const addOnTotal = selectedAddons.reduce((total, addon) => total + addon.price, 0);
  const addOnDuration = selectedAddons.reduce((total, addon) => total + addon.durationMinutes, 0);
  const comboUpgradeAmount = selection.comboUpgradeAmount ?? 0;
  const comboUpgradeName = selection.comboUpgradePackageId
    ? comboPackages.find((comboPackage) => comboPackage.id === selection.comboUpgradePackageId)
        ?.name
    : undefined;
  const payableBeforeDiscount = (selectedPackage?.price ?? 0) + addOnTotal + comboUpgradeAmount;
  const priceAfterPromo = Math.max(0, payableBeforeDiscount - promoDiscount);
  const maxUsefulPoints = Math.min(customer.availablePoints, Math.floor(priceAfterPromo / 100));
  const clampedPoints = selection.useActiveCombo
    ? 0
    : Math.min(selection.pointsToRedeem, maxUsefulPoints);

  const summary = useMemo(() => {
    if (!selectedVehicle || !selectedPackage) {
      return null;
    }

    const pointDeductionValue = getPointDeductionValue(clampedPoints);
    const comboCoveredAmount = selection.useActiveCombo ? selectedPackage.price : 0;

    return {
      vehicleLabel: `${selectedVehicle.licensePlate} / ${selectedVehicle.brand} ${selectedVehicle.model}`,
      package: selectedPackage,
      scheduledDate: selection.scheduledDate,
      scheduledTime: selection.scheduledTime,
      originalPrice: selectedPackage.price,
      addOns: selectedAddons.map((addon) => ({
        addonId: addon.id,
        name: addon.name,
        price: addon.price,
        durationMinutes: addon.durationMinutes,
      })),
      addOnTotal,
      comboUpgradeAmount,
      comboUpgradeName,
      promoDiscount,
      pointsRedeemed: clampedPoints,
      pointDeductionValue,
      paidViaCombo: selection.useActiveCombo,
      finalAmount: Math.max(
        0,
        selectedPackage.price +
          addOnTotal +
          comboUpgradeAmount -
          comboCoveredAmount -
          promoDiscount -
          pointDeductionValue,
      ),
    };
  }, [
    addOnTotal,
    clampedPoints,
    comboUpgradeAmount,
    comboUpgradeName,
    promoDiscount,
    selectedAddons,
    selectedPackage,
    selectedVehicle,
    selection.scheduledDate,
    selection.scheduledTime,
    selection.useActiveCombo,
  ]);

  const updateSelection = (patch: Partial<BookingSelection>) => {
    setSelection((current) => ({ ...current, ...patch }));
    setError("");
  };

  const toggleAddon = (addonId: string) => {
    setSelection((current) => {
      const selected = current.addonIds.includes(addonId);

      return {
        ...current,
        addonIds: selected
          ? current.addonIds.filter((currentAddonId) => currentAddonId !== addonId)
          : [...current.addonIds, addonId],
      };
    });
    setError("");
  };

  const handleConfirm = () => {
    if (
      !summary ||
      !selection.vehicleId ||
      !selection.packageId ||
      !selection.scheduledDate ||
      !selection.scheduledTime
    ) {
      setError("Please complete vehicle, package, date, and time before confirming.");
      return;
    }

    const result = confirmBooking({ ...selection, pointsToRedeem: clampedPoints }, summary);
    clearBookingDraft();
    setConfirmedBooking(result.booking);
  };

  const completedSteps = [
    Boolean(selection.vehicleId),
    Boolean(selection.packageId),
    Boolean(selection.scheduledDate && selection.scheduledTime),
    true,
    true,
    Boolean(summary),
  ];
  const occupiedSlotKeys = bookings
    .filter((booking) => ["CONFIRMED", "CHECKED_IN", "IN_PROGRESS"].includes(booking.status))
    .map((booking) => `${booking.scheduledDate}|${booking.scheduledTime}`);

  if (confirmedBooking) {
    return (
      <section className={styles.successScreen}>
        <span>Booking confirmed</span>
        <h1>{confirmedBooking.bookingCode}</h1>
        <p>
          {confirmedBooking.vehicle.licensePlate} is booked for {confirmedBooking.scheduledDate} at{" "}
          {confirmedBooking.scheduledTime}.
        </p>
        <div className={styles.successActions}>
          <Link to="/customer/cb/history">View booking history</Link>
          <Link to="/customer/cb/home">Back home</Link>
        </div>
      </section>
    );
  }

  if (vehicles.length === 0) {
    return (
      <section className={styles.emptyState}>
        <h1>No vehicles yet</h1>
        <p>Add a vehicle before creating a booking.</p>
        <Link to="/customer/cb/vehicles">Add vehicle</Link>
      </section>
    );
  }

  return (
    <div className={styles.bookingLayout}>
      <section className={styles.bookingPanel}>
        <div className={styles.stepper} aria-label="Booking progress">
          {bookingSteps.map((step, index) => (
            <span
              key={step}
              className={completedSteps[index] ? styles.stepperDone : styles.stepperItem}
            >
              <b>{index + 1}</b>
              {step}
            </span>
          ))}
        </div>

        <div className={styles.stepBlock}>
          <span className={styles.stepLabel}>Step 1</span>
          <h2>Select vehicle</h2>
          <label className={styles.field}>
            <span>Vehicle</span>
            <select
              value={selection.vehicleId}
              onChange={(event) => updateSelection({ vehicleId: event.target.value })}
            >
              {vehicles.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.licensePlate} - {vehicle.brand} {vehicle.model}
                  {vehicle.isDefault ? " (default)" : ""}
                </option>
              ))}
            </select>
            {selectedVehicle ? (
              <small>
                {selectedVehicle.vehicleType} / {selectedVehicle.color} / ready for booking
              </small>
            ) : null}
          </label>
        </div>

        <div className={styles.stepBlock}>
          <span className={styles.stepLabel}>Step 2</span>
          <h2>Select wash package</h2>
          <label className={styles.field}>
            <span>Wash package</span>
            <select
              value={selection.packageId}
              onChange={(event) => updateSelection({ packageId: event.target.value })}
            >
              {servicePackages.map((servicePackage) => (
                <option key={servicePackage.id} value={servicePackage.id}>
                  {servicePackage.name} - {servicePackage.price.toLocaleString()} VND /{" "}
                  {servicePackage.durationMinutes} min
                </option>
              ))}
            </select>
            {selectedPackage ? (
              <small>
                {selectedPackage.recommendedFor}. {selectedPackage.description}
              </small>
            ) : null}
          </label>
        </div>

        <div className={styles.stepBlock}>
          <span className={styles.stepLabel}>Step 3</span>
          <BookingTimePicker
            date={selection.scheduledDate}
            occupiedSlotKeys={occupiedSlotKeys}
            time={selection.scheduledTime}
            onDateChange={(scheduledDate) => updateSelection({ scheduledDate })}
            onTimeChange={(scheduledTime) => updateSelection({ scheduledTime })}
          />
        </div>

        <div className={styles.stepBlock}>
          <span className={styles.stepLabel}>Step 4</span>
          <h2>Apply one promotion</h2>
          <div className={styles.promoGrid}>
            <button
              type="button"
              className={!selection.promoCode ? styles.promoCardActive : styles.promoCard}
              onClick={() => updateSelection({ promoCode: "" })}
              disabled={selection.useActiveCombo}
            >
              <strong>No promo</strong>
              <span>Pay the clean base price.</span>
            </button>
            {promotions.map((promotion) => {
              const eligible = promotion.eligibleTiers.includes(customer.tier);
              const selected = selection.promoCode === promotion.code;

              return (
                <button
                  key={promotion.code}
                  type="button"
                  className={selected ? styles.promoCardActive : styles.promoCard}
                  onClick={() => updateSelection({ promoCode: promotion.code })}
                  disabled={selection.useActiveCombo}
                >
                  <strong>{promotion.code}</strong>
                  <span>{promotion.label}</span>
                  <small>
                    {eligible && (!promotion.newCustomersOnly || customer.isNewCustomer)
                      ? `-${promotion.discountAmount.toLocaleString()} VND`
                      : promotion.newCustomersOnly && !customer.isNewCustomer
                        ? "New customers only"
                        : `Locked for ${customer.tier}`}
                  </small>
                </button>
              );
            })}
          </div>
          {selectedPromotion && !promoEligible ? (
            <p className={styles.warningText}>
              {selectedPromotion.newCustomersOnly && !customer.isNewCustomer
                ? `${selectedPromotion.code} is only available for new customers.`
                : `${selectedPromotion.code} is not eligible for ${customer.tier} tier.`}
            </p>
          ) : null}
        </div>

        <div className={styles.stepBlock}>
          <span className={styles.stepLabel}>Step 5</span>
          <h2>Add-on services</h2>
          <div className={styles.addonList}>
            {serviceAddons.map((addon) => {
              const checked = selection.addonIds.includes(addon.id);

              return (
                <label
                  key={addon.id}
                  className={checked ? styles.addonOptionSelected : styles.addonOption}
                >
                  <input type="checkbox" checked={checked} onChange={() => toggleAddon(addon.id)} />
                  <span>
                    <b>{addon.name}</b>
                    <small>{addon.description}</small>
                  </span>
                  <em>
                    +{addon.price.toLocaleString()} VND / {addon.durationMinutes}m
                  </em>
                </label>
              );
            })}
          </div>
          <div className={styles.addonTotal}>
            <span>Selected add-ons</span>
            <strong>
              {addOnTotal.toLocaleString()} VND / +{addOnDuration} min
            </strong>
          </div>
          <ComboUseOption
            activeCombo={activeCombo}
            checked={selection.useActiveCombo}
            onChange={(useActiveCombo) =>
              updateSelection({
                useActiveCombo,
                pointsToRedeem: 0,
                promoCode: useActiveCombo ? "" : selection.promoCode,
              })
            }
          />
          <PointsUseOption
            availablePoints={maxUsefulPoints}
            value={clampedPoints}
            disabled={selection.useActiveCombo}
            onChange={(pointsToRedeem) => updateSelection({ pointsToRedeem })}
          />
        </div>
      </section>

      <aside className={styles.summaryPanel}>
        <span className={styles.stepLabel}>Step 6</span>
        <h2>Booking summary</h2>
        {summary ? (
          <dl className={styles.summaryList}>
            <div>
              <dt>Vehicle</dt>
              <dd>{summary.vehicleLabel}</dd>
            </div>
            <div>
              <dt>Package</dt>
              <dd>{summary.package.name}</dd>
            </div>
            <div>
              <dt>Date & time</dt>
              <dd>
                {summary.scheduledDate} {summary.scheduledTime}
              </dd>
            </div>
            <div>
              <dt>Original price</dt>
              <dd>{summary.originalPrice.toLocaleString()} VND</dd>
            </div>
            <div>
              <dt>Add-ons</dt>
              <dd>
                {summary.addOns.length > 0
                  ? `${summary.addOns.length} selected / ${summary.addOnTotal.toLocaleString()} VND`
                  : "None"}
              </dd>
            </div>
            {summary.comboUpgradeAmount > 0 ? (
              <div>
                <dt>Combo upgrade</dt>
                <dd>
                  {summary.comboUpgradeName ?? "Selected combo"} /{" "}
                  {summary.comboUpgradeAmount.toLocaleString()} VND
                </dd>
              </div>
            ) : null}
            <div>
              <dt>Promo discount</dt>
              <dd>-{summary.promoDiscount.toLocaleString()} VND</dd>
            </div>
            <div>
              <dt>Point deduction</dt>
              <dd>-{summary.pointDeductionValue.toLocaleString()} VND</dd>
            </div>
            <div>
              <dt>Combo</dt>
              <dd>{summary.paidViaCombo ? "Paid via combo credit" : "Not used"}</dd>
            </div>
            <div className={styles.finalAmount}>
              <dt>Final Amount</dt>
              <dd>{summary.finalAmount.toLocaleString()} VND</dd>
            </div>
          </dl>
        ) : null}
        {error ? <p className={styles.warningText}>{error}</p> : null}
        <button className={styles.confirmButton} type="button" onClick={handleConfirm}>
          Confirm booking
        </button>
      </aside>
    </div>
  );
}
