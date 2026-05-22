import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { VehicleCard } from "../components/VehicleCard";
import { VehicleFormPage } from "./VehicleFormPage";
import { useCustomerBooking } from "../routes";
import { vehicleImageFallbackByType } from "../mock/vehicles.mock";
import type { BookingStatus } from "../types/booking.types";
import type { Vehicle } from "../types/vehicle.types";
import styles from "../styles/vehicles.module.css";

const activeBookingStatuses: BookingStatus[] = ["CONFIRMED", "CHECKED_IN", "IN_PROGRESS"];

export function VehiclesPage() {
  const { activeCombo, bookings, deleteVehicle, setDefaultVehicle, vehicles } =
    useCustomerBooking();
  const navigate = useNavigate();
  const [isAdding, setIsAdding] = useState(false);

  const handleEdit = (vehicleId: string) => {
    navigate({ to: "/customer/cb/vehicles", search: { editId: vehicleId } });
  };

  if (isAdding) {
    return <VehicleFormPage onDone={() => setIsAdding(false)} />;
  }

  const defaultVehicle = vehicles.find((vehicle) => vehicle.isDefault);
  const vehiclesWithBooking = vehicles.filter((vehicle) =>
    bookings.some(
      (booking) =>
        booking.vehicle.vehicleId === vehicle.id && activeBookingStatuses.includes(booking.status),
    ),
  );

  const getVehicleBookings = (vehicle: Vehicle) =>
    bookings.filter((booking) => booking.vehicle.vehicleId === vehicle.id);

  return (
    <main className={styles.page}>
      <header className={styles.pageHeader}>
        <div>
          <span>Customer garage</span>
          <h1>Vehicles ready for booking</h1>
          <p>
            Keep plate, model, default checkout vehicle, and combo linkage accurate so every wash
            booking starts with the right service logic.
          </p>
        </div>
        <button className={styles.primaryButton} type="button" onClick={() => setIsAdding(true)}>
          Add vehicle
        </button>
      </header>

      <section className={styles.garageSummary} aria-label="Garage summary">
        <div className={styles.defaultVehiclePanel}>
          <div>
            <span>Default checkout vehicle</span>
            <strong>{defaultVehicle ? defaultVehicle.licensePlate : "Not selected"}</strong>
            <p>
              {defaultVehicle
                ? `${defaultVehicle.brand} ${defaultVehicle.model} is preselected in the booking flow.`
                : "Set a default vehicle to shorten the booking flow."}
            </p>
          </div>
          <div className={styles.defaultVehicleVisual} aria-hidden="true">
            {defaultVehicle ? (
              <img
                src={
                  defaultVehicle.imageUrl ?? vehicleImageFallbackByType[defaultVehicle.vehicleType]
                }
                alt=""
                onError={(event) => {
                  if (event.currentTarget.dataset.fallbackApplied === "true") {
                    return;
                  }

                  event.currentTarget.dataset.fallbackApplied = "true";
                  event.currentTarget.src = vehicleImageFallbackByType[defaultVehicle.vehicleType];
                }}
              />
            ) : null}
            <span />
          </div>
        </div>

        <dl className={styles.garageStats}>
          <div>
            <dt>Total vehicles</dt>
            <dd>{vehicles.length}</dd>
          </div>
          <div>
            <dt>With active booking</dt>
            <dd>{vehiclesWithBooking.length}</dd>
          </div>
          <div>
            <dt>Combo linked</dt>
            <dd>{activeCombo ? "1" : "0"}</dd>
          </div>
        </dl>
      </section>

      <section className={styles.vehicleList}>
        {vehicles.map((vehicle) => {
          const vehicleBookings = getVehicleBookings(vehicle);
          const nextBooking = vehicleBookings.find((booking) =>
            activeBookingStatuses.includes(booking.status),
          );
          const latestBooking = vehicleBookings[0];
          const completedWashCount = vehicleBookings.filter(
            (booking) => booking.status === "COMPLETED",
          ).length;

          return (
            <VehicleCard
              key={vehicle.id}
              activeCombo={activeCombo}
              completedWashCount={completedWashCount}
              latestBooking={latestBooking}
              nextBooking={nextBooking}
              vehicle={vehicle}
              onSetDefault={setDefaultVehicle}
              onEdit={handleEdit}
              onDelete={deleteVehicle}
            />
          );
        })}
      </section>
    </main>
  );
}
