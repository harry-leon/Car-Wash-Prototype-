import type { Booking } from "../types/booking.types";
import styles from "../styles/history.module.css";

interface BookingTableProps {
  bookings: Booking[];
}

export function BookingTable({ bookings }: BookingTableProps) {
  return (
    <div className={styles.tableWrap}>
      <table className={styles.historyTable}>
        <thead>
          <tr>
            <th>Booking</th>
            <th>Vehicle</th>
            <th>Package</th>
            <th>Schedule</th>
            <th>Status</th>
            <th>Final Amount</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id}>
              <td>{booking.bookingCode}</td>
              <td>{booking.vehicle.licensePlate}</td>
              <td>{booking.package.name}</td>
              <td>
                {booking.scheduledDate} {booking.scheduledTime}
              </td>
              <td>
                <span className={`${styles.statusBadge} ${styles[`status${booking.status}`]}`}>
                  {booking.status.replaceAll("_", " ")}
                </span>
              </td>
              <td>{booking.payment.finalAmount.toLocaleString()} VND</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
