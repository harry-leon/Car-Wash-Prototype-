import React, { createContext, useContext, useMemo, useSyncExternalStore } from "react";
import { Outlet } from "@tanstack/react-router";
import { mockBookings } from "./mock/booking.mock";
import {
  mockActiveCombo,
  mockComboPackages,
  mockCustomer,
  mockPromotions,
  mockServiceAddons,
  mockServicePackages,
} from "./mock/customer.mock";
import { mockPointTransactions } from "./mock/history.mock";
import { mockVehicles } from "./mock/vehicles.mock";
import type { Booking, BookingSelection, BookingSummary } from "./types/booking.types";
import type {
  ActiveCombo,
  ComboPackage,
  CustomerProfile,
  Promotion,
  ServiceAddon,
  ServicePackage,
} from "./types/customer.types";
import type { PointTransaction } from "./types/history.types";
import type { Vehicle, VehicleFormValues } from "./types/vehicle.types";

export const customerBookingRoutes = {
  home: "/customer/cb/home",
  vehicles: "/customer/cb/vehicles",
  vehiclesNew: "/customer/cb/vehicles",
  vehiclesEdit: "/customer/cb/vehicles",
  booking: "/customer/cb/booking",
  historyBookings: "/customer/cb/history",
  historyWashes: "/customer/cb/history",
  historyPoints: "/customer/cb/history",
} as const;

export type CustomerRouteKey = keyof typeof customerBookingRoutes;

interface CustomerBookingState {
  customer: CustomerProfile;
  activeCombo: ActiveCombo | null;
  bookingDraft: Partial<BookingSelection>;
  servicePackages: ServicePackage[];
  serviceAddons: ServiceAddon[];
  comboPackages: ComboPackage[];
  promotions: Promotion[];
  vehicles: Vehicle[];
  bookings: Booking[];
  pointTransactions: PointTransaction[];
}

interface ConfirmBookingResult {
  booking: Booking;
  pointTransaction?: PointTransaction;
}

export interface CustomerBookingStore extends CustomerBookingState {
  addVehicle: (values: VehicleFormValues) => Vehicle;
  updateVehicle: (id: string, values: VehicleFormValues) => Vehicle;
  deleteVehicle: (id: string) => void;
  setDefaultVehicle: (id: string) => void;
  setBookingDraft: (draft: Partial<BookingSelection>) => void;
  clearBookingDraft: () => void;
  upgradeActiveCombo: (comboPackageId: string) => ActiveCombo;
  confirmBooking: (selection: BookingSelection, summary: BookingSummary) => ConfirmBookingResult;
}

type Listener = () => void;

const pointValueVnd = 100;

let state: CustomerBookingState = {
  customer: { ...mockCustomer },
  activeCombo: { ...mockActiveCombo },
  bookingDraft: {},
  servicePackages: [...mockServicePackages],
  serviceAddons: [...mockServiceAddons],
  comboPackages: [...mockComboPackages],
  promotions: [...mockPromotions],
  vehicles: [...mockVehicles],
  bookings: [...mockBookings],
  pointTransactions: [...mockPointTransactions],
};

const listeners = new Set<Listener>();

function emitChange() {
  listeners.forEach((listener) => listener());
}

function setState(updater: (current: CustomerBookingState) => CustomerBookingState) {
  state = updater(state);
  emitChange();
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return state;
}

function buildVehicle(values: VehicleFormValues, id = `veh-${Date.now()}`): Vehicle {
  return {
    id,
    licensePlate: values.licensePlate.trim().toUpperCase(),
    brand: values.brand,
    model: values.model,
    vehicleType: values.vehicleType,
    color: values.color.trim(),
    imageUrl: values.imageUrl,
    isDefault: values.isDefault,
  };
}

function createBookingCode() {
  const datePart = new Date().toISOString().slice(2, 10).replaceAll("-", "");
  const nextNumber = String(state.bookings.length + 1).padStart(3, "0");
  return `CW-${datePart}-${nextNumber}`;
}

function addDays(date: Date, days: number) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate.toISOString().slice(0, 10);
}

const actions = {
  addVehicle(values: VehicleFormValues) {
    const vehicle = buildVehicle(values);
    setState((current) => {
      const shouldDefault = vehicle.isDefault || current.vehicles.length === 0;
      const nextVehicle = { ...vehicle, isDefault: shouldDefault };
      return {
        ...current,
        vehicles: shouldDefault
          ? [...current.vehicles.map((item) => ({ ...item, isDefault: false })), nextVehicle]
          : [...current.vehicles, nextVehicle],
      };
    });
    return vehicle;
  },
  updateVehicle(id: string, values: VehicleFormValues) {
    const vehicle = buildVehicle(values, id);
    setState((current) => ({
      ...current,
      vehicles: current.vehicles.map((item) => {
        if (item.id === id) {
          return vehicle;
        }

        if (vehicle.isDefault) {
          return { ...item, isDefault: false };
        }

        return item;
      }),
    }));
    return vehicle;
  },
  deleteVehicle(id: string) {
    setState((current) => {
      const removedVehicle = current.vehicles.find((vehicle) => vehicle.id === id);
      const remainingVehicles = current.vehicles.filter((vehicle) => vehicle.id !== id);
      const vehicles =
        removedVehicle?.isDefault && remainingVehicles.length > 0
          ? remainingVehicles.map((vehicle, index) => ({ ...vehicle, isDefault: index === 0 }))
          : remainingVehicles;

      return { ...current, vehicles };
    });
  },
  setDefaultVehicle(id: string) {
    setState((current) => ({
      ...current,
      vehicles: current.vehicles.map((vehicle) => ({
        ...vehicle,
        isDefault: vehicle.id === id,
      })),
    }));
  },
  setBookingDraft(draft: Partial<BookingSelection>) {
    setState((current) => ({
      ...current,
      bookingDraft: {
        ...current.bookingDraft,
        ...draft,
      },
    }));
  },
  clearBookingDraft() {
    setState((current) => ({
      ...current,
      bookingDraft: {},
    }));
  },
  upgradeActiveCombo(comboPackageId: string) {
    const targetPackage = state.comboPackages.find(
      (comboPackage) => comboPackage.id === comboPackageId,
    );

    if (!targetPackage) {
      throw new Error("Selected combo package does not exist.");
    }

    const linkedVehicleId =
      state.activeCombo?.linkedVehicleId ??
      state.vehicles.find((vehicle) => vehicle.isDefault)?.id ??
      state.vehicles[0]?.id;

    if (!linkedVehicleId) {
      throw new Error("A vehicle is required before upgrading a combo package.");
    }

    const currentUses = state.activeCombo?.remainingUses ?? 0;
    const currentTotalUses = state.activeCombo?.totalUses ?? 0;
    const addedUses = Math.max(0, targetPackage.totalUses - currentTotalUses);
    const upgradedCombo: ActiveCombo = {
      id: state.activeCombo?.id ?? `active-combo-${Date.now()}`,
      comboPackageId: targetPackage.id,
      comboName: targetPackage.name,
      status: "ACTIVE",
      remainingUses: Math.min(targetPackage.totalUses, currentUses + addedUses),
      totalUses: targetPackage.totalUses,
      validUntil: addDays(new Date(), targetPackage.validityDays),
      linkedVehicleId,
      qrCodeText: `CW-UPGRADE-${String(Date.now()).slice(-6)}`,
    };

    const pointTransaction: PointTransaction = {
      id: `pt-upgrade-${Date.now()}`,
      type: "BONUS",
      points: 250,
      description: `Upgrade bonus for ${targetPackage.name}`,
      createdAt: new Date().toISOString(),
    };

    setState((current) => ({
      ...current,
      activeCombo: upgradedCombo,
      customer: {
        ...current.customer,
        availablePoints: current.customer.availablePoints + pointTransaction.points,
        lifetimePoints: current.customer.lifetimePoints + pointTransaction.points,
      },
      pointTransactions: [pointTransaction, ...current.pointTransactions],
    }));

    return upgradedCombo;
  },
  confirmBooking(selection: BookingSelection, summary: BookingSummary) {
    const vehicle = state.vehicles.find((item) => item.id === selection.vehicleId);

    if (!vehicle) {
      throw new Error("Selected vehicle no longer exists.");
    }

    const booking: Booking = {
      id: `bk-${Date.now()}`,
      bookingCode: createBookingCode(),
      vehicle: {
        vehicleId: vehicle.id,
        licensePlate: vehicle.licensePlate,
        brand: vehicle.brand,
        model: vehicle.model,
        vehicleType: vehicle.vehicleType,
      },
      package: {
        packageId: summary.package.id,
        name: summary.package.name,
        price: summary.package.price,
        durationMinutes: summary.package.durationMinutes,
      },
      addOns: summary.addOns,
      scheduledDate: selection.scheduledDate,
      scheduledTime: selection.scheduledTime,
      status: "CONFIRMED",
      payment: {
        originalPrice: summary.originalPrice,
        addOnTotal: summary.addOnTotal,
        comboUpgradeAmount: summary.comboUpgradeAmount || undefined,
        comboUpgradeName: summary.comboUpgradeName,
        promoCode: selection.promoCode || undefined,
        promoDiscount: summary.promoDiscount,
        pointsRedeemed: summary.pointsRedeemed,
        pointDeductionValue: summary.pointDeductionValue,
        paidViaCombo: summary.paidViaCombo,
        finalAmount: summary.finalAmount,
      },
      createdAt: new Date().toISOString(),
    };

    const pointTransaction: PointTransaction | undefined =
      summary.pointsRedeemed > 0
        ? {
            id: `pt-${Date.now()}`,
            type: "REDEEM",
            points: -summary.pointsRedeemed,
            description: `Redeemed points for ${summary.package.name}`,
            bookingCode: booking.bookingCode,
            createdAt: booking.createdAt,
          }
        : undefined;

    const upgradedComboPackage = selection.comboUpgradePackageId
      ? state.comboPackages.find(
          (comboPackage) => comboPackage.id === selection.comboUpgradePackageId,
        )
      : undefined;

    setState((current) => ({
      ...current,
      customer: {
        ...current.customer,
        availablePoints: Math.max(0, current.customer.availablePoints - summary.pointsRedeemed),
      },
      activeCombo: upgradedComboPackage
        ? {
            id: current.activeCombo?.id ?? `active-combo-${Date.now()}`,
            comboPackageId: upgradedComboPackage.id,
            comboName: upgradedComboPackage.name,
            status: "ACTIVE",
            remainingUses: upgradedComboPackage.totalUses,
            totalUses: upgradedComboPackage.totalUses,
            validUntil: addDays(new Date(), upgradedComboPackage.validityDays),
            linkedVehicleId: current.activeCombo?.linkedVehicleId ?? vehicle.id,
            qrCodeText: `CW-UPGRADE-${String(Date.now()).slice(-6)}`,
          }
        : current.activeCombo,
      bookings: [booking, ...current.bookings],
      pointTransactions: pointTransaction
        ? [pointTransaction, ...current.pointTransactions]
        : current.pointTransactions,
    }));

    return { booking, pointTransaction };
  },
};

const CustomerBookingContext = createContext<CustomerBookingStore | null>(null);

export function CustomerBookingProvider({ children }: { children: React.ReactNode }) {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  const value = useMemo<CustomerBookingStore>(() => ({ ...snapshot, ...actions }), [snapshot]);

  return (
    <CustomerBookingContext.Provider value={value}>{children}</CustomerBookingContext.Provider>
  );
}

export function useCustomerBooking(): CustomerBookingStore {
  const context = useContext(CustomerBookingContext);
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  return useMemo<CustomerBookingStore>(
    () => context ?? { ...snapshot, ...actions },
    [context, snapshot],
  );
}

export function CustomerBookingModuleLayout() {
  return (
    <CustomerBookingProvider>
      <Outlet />
    </CustomerBookingProvider>
  );
}

export function getPointDeductionValue(points: number) {
  return points * pointValueVnd;
}

export const customerBookingRouteManifest = [
  { path: customerBookingRoutes.home, label: "Home" },
  { path: customerBookingRoutes.vehicles, label: "Vehicles" },
  { path: customerBookingRoutes.vehiclesNew, label: "Add Vehicle" },
  { path: customerBookingRoutes.vehiclesEdit, label: "Edit Vehicle" },
  { path: customerBookingRoutes.booking, label: "Booking" },
  { path: customerBookingRoutes.historyBookings, label: "Booking History" },
  { path: customerBookingRoutes.historyWashes, label: "Wash History" },
  { path: customerBookingRoutes.historyPoints, label: "Point Transactions" },
] as const;
