import type { ServicePackage } from "../types/customer.types";
import styles from "../styles/booking.module.css";

interface PackageCardProps {
  servicePackage: ServicePackage;
  selected?: boolean;
  onSelect?: (packageId: string) => void;
  actionLabel?: string;
}

export function PackageCard({
  actionLabel,
  servicePackage,
  selected = false,
  onSelect,
}: PackageCardProps) {
  return (
    <button
      className={`${styles.packageCard} ${selected ? styles.packageCardSelected : ""}`}
      type="button"
      onClick={() => onSelect?.(servicePackage.id)}
      aria-pressed={selected}
    >
      <span>{servicePackage.recommendedFor}</span>
      <strong>{servicePackage.name}</strong>
      <p>{servicePackage.description}</p>
      <ul className={styles.featureList}>
        {servicePackage.highlights.map((highlight) => (
          <li key={highlight}>{highlight}</li>
        ))}
      </ul>
      <div className={styles.cardFooter}>
        <b>{servicePackage.price.toLocaleString()} VND</b>
        <small>{servicePackage.durationMinutes} min</small>
      </div>
      {actionLabel ? <em>{actionLabel}</em> : null}
    </button>
  );
}
