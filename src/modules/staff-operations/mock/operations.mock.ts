import * as React from "react";
import type {
  OperationBooking,
  OperationFilters,
  OperationsTimeFilter,
  StaffOption,
} from "../types/operations.types";

const NO_SHOW_GRACE_MINUTES = 20;

export const staffOptions: StaffOption[] = [
  { id: "staff-01", name: "Tran Bao Nam" },
  { id: "staff-02", name: "Nguyen Van Hung" },
  { id: "staff-03", name: "Pham Minh Duc" },
  { id: "staff-04", name: "Hoang Lan" },
];

function minutesFromNow(minutes: number) {
  const date = new Date();
  date.setMinutes(date.getMinutes() + minutes, 0, 0);
  return date.toISOString();
}

function addMinutes(value: string, minutes: number) {
  const date = new Date(value);
  date.setMinutes(date.getMinutes() + minutes);
  return date.toISOString();
}

function makeBooking(
  input: Omit<OperationBooking, "assignedStaff" | "bookingCode"> & { bookingCode?: string },
): OperationBooking {
  const staff = staffOptions.find((item) => item.id === input.assignedStaffId);
  return {
    ...input,
    bookingCode: input.bookingCode ?? input.id,
    assignedStaff: staff?.name ?? "Unassigned",
  };
}

const initialBookings: OperationBooking[] = [
  makeBooking({
    id: "OPS-1001",
    customerName: "Tran Minh Anh",
    customerPhone: "0901234567",
    vehiclePlate: "51G-123.45",
    vehicleModel: "Toyota Vios",
    servicePackage: "Basic Wash + Interior Vacuum",
    packageDurationMinutes: 45,
    assignedStaffId: "staff-01",
    scheduledAt: minutesFromNow(25),
    status: "CONFIRMED",
  }),
  makeBooking({
    id: "OPS-1002",
    customerName: "Le Gia Huy",
    customerPhone: "0912345678",
    vehiclePlate: "60C-889.11",
    vehicleModel: "Ford Ranger",
    servicePackage: "Premium Detail",
    packageDurationMinutes: 70,
    assignedStaffId: "staff-02",
    scheduledAt: minutesFromNow(-12),
    checkinTime: minutesFromNow(-8),
    estimatedFinishTime: minutesFromNow(62),
    status: "CHECKED_IN",
  }),
  makeBooking({
    id: "OPS-1003",
    customerName: "Pham Thu Trang",
    customerPhone: "0987654321",
    vehiclePlate: "30A-998.77",
    vehicleModel: "Mercedes GLC",
    servicePackage: "Ceramic Coating",
    packageDurationMinutes: 95,
    assignedStaffId: "staff-03",
    scheduledAt: minutesFromNow(-50),
    checkinTime: minutesFromNow(-44),
    estimatedFinishTime: minutesFromNow(51),
    status: "IN_PROGRESS",
  }),
  makeBooking({
    id: "OPS-1004",
    customerName: "Nguyen Hoang Son",
    customerPhone: "0934556677",
    vehiclePlate: "85F1-072.22",
    vehicleModel: "Honda SH",
    servicePackage: "Express Motorbike Wash",
    packageDurationMinutes: 25,
    assignedStaffId: "staff-04",
    scheduledAt: minutesFromNow(-120),
    checkinTime: minutesFromNow(-114),
    estimatedFinishTime: minutesFromNow(-89),
    completedTime: minutesFromNow(-82),
    status: "COMPLETED",
    pointTransaction: {
      id: "PT-1004",
      createdAt: minutesFromNow(-82),
      pointsEarned: 18,
      description: "Earned points for completed wash OPS-1004",
    },
  }),
  makeBooking({
    id: "OPS-1005",
    customerName: "Dang Mai Linh",
    customerPhone: "0977001122",
    vehiclePlate: "51K-678.90",
    vehicleModel: "Honda CR-V",
    servicePackage: "Premium Detail",
    packageDurationMinutes: 70,
    assignedStaffId: "staff-01",
    scheduledAt: minutesFromNow(-38),
    status: "CONFIRMED",
  }),
  makeBooking({
    id: "OPS-1006",
    customerName: "Vo Thanh Dat",
    customerPhone: "0944556677",
    vehiclePlate: "59A-224.18",
    vehicleModel: "Mazda CX-5",
    servicePackage: "Basic Wash",
    packageDurationMinutes: 35,
    assignedStaffId: "staff-02",
    scheduledAt: minutesFromNow(110),
    status: "CANCELLED",
  }),
];

let operationBookings = initialBookings;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function applyNoShowPolicy() {
  const now = Date.now();
  let changed = false;
  const next = operationBookings.map((booking) => {
    const expired =
      booking.status === "CONFIRMED" &&
      now - new Date(booking.scheduledAt).getTime() > NO_SHOW_GRACE_MINUTES * 60 * 1000;
    if (!expired) return booking;
    changed = true;
    return { ...booking, status: "NO_SHOW" as const };
  });

  if (changed) {
    operationBookings = next;
  }

  return changed;
}

export function subscribeOperationBookings(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getOperationBookings() {
  applyNoShowPolicy();
  return operationBookings;
}

export function useOperationBookings() {
  const bookings = React.useSyncExternalStore(
    subscribeOperationBookings,
    getOperationBookings,
    getOperationBookings,
  );

  React.useEffect(() => {
    const interval = window.setInterval(() => {
      if (applyNoShowPolicy()) {
        emit();
      }
    }, 60_000);

    return () => window.clearInterval(interval);
  }, []);

  return bookings;
}

function updateBooking(id: string, updater: (booking: OperationBooking) => OperationBooking) {
  let updated: OperationBooking | null = null;

  operationBookings = operationBookings.map((booking) => {
    if (booking.id !== id) return booking;
    updated = updater(booking);
    return updated;
  });

  if (!updated) {
    throw new Error("Booking was not found.");
  }

  emit();
  return updated;
}

export function checkInBooking(id: string) {
  applyNoShowPolicy();
  return updateBooking(id, (booking) => {
    if (booking.status !== "CONFIRMED") {
      throw new Error("Only confirmed bookings can be checked in.");
    }

    const checkinTime = new Date().toISOString();
    return {
      ...booking,
      status: "CHECKED_IN",
      checkinTime,
      estimatedFinishTime: addMinutes(checkinTime, booking.packageDurationMinutes),
    };
  });
}

export function startWashBooking(id: string) {
  return updateBooking(id, (booking) => {
    if (booking.status !== "CHECKED_IN") {
      throw new Error("Only checked-in bookings can start washing.");
    }

    return { ...booking, status: "IN_PROGRESS" };
  });
}

export function completeWashBooking(id: string) {
  return updateBooking(id, (booking) => {
    if (booking.status !== "IN_PROGRESS") {
      throw new Error("Only in-progress bookings can be completed.");
    }

    const completedTime = new Date().toISOString();
    const pointsEarned = Math.max(10, Math.round(booking.packageDurationMinutes * 0.4));

    return {
      ...booking,
      status: "COMPLETED",
      completedTime,
      pointTransaction: {
        id: `PT-${Date.now().toString().slice(-6)}`,
        createdAt: completedTime,
        pointsEarned,
        description: `Earned points for completed wash ${booking.bookingCode}`,
      },
    };
  });
}

export function findOperationBooking(id: string) {
  return getOperationBookings().find((booking) => booking.id === id) ?? null;
}

export function formatOperationTime(value?: string) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function formatOperationDateTime(value?: string) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function filterOperationBookings(bookings: OperationBooking[], filters: OperationFilters) {
  return bookings.filter((booking) => {
    if (filters.status !== "ALL" && booking.status !== filters.status) return false;
    if (filters.staffId !== "ALL" && booking.assignedStaffId !== filters.staffId) return false;
    if (filters.time !== "ALL" && getTimeBucket(booking.scheduledAt) !== filters.time) {
      return false;
    }
    return true;
  });
}

function getTimeBucket(value: string): OperationsTimeFilter {
  const hour = new Date(value).getHours();
  if (hour < 12) return "MORNING";
  if (hour < 17) return "AFTERNOON";
  return "EVENING";
}
