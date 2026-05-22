import type { Booking } from "../types/booking.types";
import type { ActiveCombo } from "../types/customer.types";
import type { Vehicle } from "../types/vehicle.types";
import { vehicleImageFallbackByType } from "../mock/vehicles.mock";
import styles from "../styles/vehicles.module.css";

interface VehicleCardProps {
  vehicle: Vehicle;
  activeCombo?: ActiveCombo | null;
  latestBooking?: Booking;
  nextBooking?: Booking;
  completedWashCount: number;
  onSetDefault: (vehicleId: string) => void;
  onEdit: (vehicleId: string) => void;
  onDelete: (vehicleId: string) => void;
}

function formatBookingDate(booking?: Booking) {
  if (!booking) {
    return "No booking yet";
  }

  return `${booking.scheduledDate} at ${booking.scheduledTime}`;
}

function getCareRecommendation(vehicle: Vehicle, completedWashCount: number) {
  if (completedWashCount === 0) {
    return "Start with Premium In-Out to create a clean baseline.";
  }

  if (vehicle.vehicleType === "SUV" || vehicle.vehicleType === "Pickup") {
    return "Premium In-Out is recommended for larger cabin and wheel care.";
  }

  return "Express Exterior keeps weekly maintenance quick and cost efficient.";
}

export function VehicleCard({
  activeCombo,
  completedWashCount,
  latestBooking,
  nextBooking,
  onDelete,
  onEdit,
  onSetDefault,
  vehicle,
}: VehicleCardProps) {
  const isComboLinked =
    activeCombo?.linkedVehicleId === vehicle.id && activeCombo.remainingUses > 0;
  const vehicleImageUrl = vehicle.imageUrl ?? vehicleImageFallbackByType[vehicle.vehicleType];

  return (
    <article
      className={`${styles.vehicleCard} ${vehicle.isDefault ? styles.vehicleCardDefault : ""}`}
      onClick={() => onSetDefault(vehicle.id)}
    >
      <div className={styles.vehicleImage} aria-hidden="true">
        <img
          src={vehicleImageUrl}
          alt=""
          onError={(event) => {
            if (event.currentTarget.dataset.fallbackApplied === "true") {
              return;
            }

            event.currentTarget.dataset.fallbackApplied = "true";
            event.currentTarget.src = vehicleImageFallbackByType[vehicle.vehicleType];
          }}
        />
        <span />
      </div>
      <div className={styles.vehicleIdentity}>
        <div className={styles.plateRow}>
          <div>
            <h2 className={styles.licensePlate}>
              <span>VN</span>
              {vehicle.licensePlate}
            </h2>
            <p className={styles.vehicleTitle}>
              {vehicle.brand} {vehicle.model}
            </p>
          </div>
          <div className={styles.vehicleBadges}>
            {vehicle.isDefault ? (
              <span className={styles.defaultBadge}>
                <i aria-hidden="true" />
                Default checkout
              </span>
            ) : null}
            {isComboLinked ? <span className={styles.comboBadge}>Combo linked</span> : null}
          </div>
        </div>

        <dl className={styles.vehicleMeta}>
          <div>
            <dt>Type</dt>
            <dd>{vehicle.vehicleType}</dd>
          </div>
          <div>
            <dt>Color</dt>
            <dd>{vehicle.color}</dd>
          </div>
          <div>
            <dt>Completed washes</dt>
            <dd>{completedWashCount}</dd>
          </div>
          <div>
            <dt>Next booking</dt>
            <dd>
              {nextBooking
                ? `${nextBooking.scheduledDate} ${nextBooking.scheduledTime}`
                : "Not scheduled"}
            </dd>
          </div>
        </dl>

        <section className={styles.vehicleCarePanel}>
          <div>
            <span>Care logic</span>
            <p>{getCareRecommendation(vehicle, completedWashCount)}</p>
          </div>
          <dl>
            <div>
              <dt>Latest activity</dt>
              <dd>{formatBookingDate(latestBooking)}</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>{nextBooking ? nextBooking.status.replaceAll("_", " ") : "Ready to book"}</dd>
            </div>
          </dl>
        </section>
      </div>

      <div className={styles.vehicleActions}>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onEdit(vehicle.id);
          }}
        >
          Edit
        </button>
        <button
          type="button"
          className={styles.dangerButton}
          onClick={(event) => {
            event.stopPropagation();
            onDelete(vehicle.id);
          }}
        >
          Delete
        </button>
      </div>
    </article>
  );
}
