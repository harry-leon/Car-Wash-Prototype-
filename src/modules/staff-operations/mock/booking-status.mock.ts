import {
  STAFF_BOOKING_STATUSES,
  STAFF_BOOKING_STATUS_LABELS,
  type StaffBookingStatus,
} from "../types/status.types";

export const bookingStatusOptions = STAFF_BOOKING_STATUSES.map((status) => ({
  value: status,
  label: STAFF_BOOKING_STATUS_LABELS[status],
}));

export const actionableStatuses: StaffBookingStatus[] = ["CONFIRMED", "CHECKED_IN", "IN_PROGRESS"];
