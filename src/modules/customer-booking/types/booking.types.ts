import type { ServicePackage } from "./customer.types";

export type BookingStatus =
  | "CONFIRMED"
  | "CHECKED_IN"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
  | "NO_SHOW";

export interface BookingVehicleSnapshot {
  vehicleId: string;
  licensePlate: string;
  brand: string;
  model: string;
  vehicleType: string;
}

export interface BookingPackageSnapshot {
  packageId: string;
  name: string;
  price: number;
  durationMinutes: number;
}

export interface BookingAddonSnapshot {
  addonId: string;
  name: string;
  price: number;
  durationMinutes: number;
}

export interface BookingPaymentSnapshot {
  originalPrice: number;
  addOnTotal: number;
  comboUpgradeAmount?: number;
  comboUpgradeName?: string;
  promoCode?: string;
  promoDiscount: number;
  pointsRedeemed: number;
  pointDeductionValue: number;
  paidViaCombo: boolean;
  finalAmount: number;
}

export interface Booking {
  id: string;
  bookingCode: string;
  vehicle: BookingVehicleSnapshot;
  package: BookingPackageSnapshot;
  addOns: BookingAddonSnapshot[];
  scheduledDate: string;
  scheduledTime: string;
  status: BookingStatus;
  payment: BookingPaymentSnapshot;
  createdAt: string;
}

export interface BookingSelection {
  vehicleId: string;
  packageId: string;
  scheduledDate: string;
  scheduledTime: string;
  promoCode: string;
  addonIds: string[];
  comboUpgradePackageId?: string;
  comboUpgradeAmount?: number;
  pointsToRedeem: number;
  useActiveCombo: boolean;
}

export interface BookingSummary {
  vehicleLabel: string;
  package: ServicePackage;
  scheduledDate: string;
  scheduledTime: string;
  originalPrice: number;
  addOns: BookingAddonSnapshot[];
  addOnTotal: number;
  comboUpgradeAmount: number;
  comboUpgradeName?: string;
  promoDiscount: number;
  pointsRedeemed: number;
  pointDeductionValue: number;
  paidViaCombo: boolean;
  finalAmount: number;
}
