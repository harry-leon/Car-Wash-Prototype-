import * as React from "react";

export type VehicleType = "Sedan" | "SUV" | "Truck" | "Motorbike";

export interface Vehicle {
  id: string;
  brandModel: string;
  plate: string;
  type: VehicleType;
}

export type Tier = "Bronze" | "Silver" | "Gold" | "Platinum";

export interface Profile {
  name: string;
  phone: string;
  countryCode: string;
  tier: Tier;
  points: number;
}

const TIER_THRESHOLDS: Record<Tier, number> = {
  Bronze: 0,
  Silver: 100,
  Gold: 1000,
  Platinum: 5000,
};

export function nextTierInfo(points: number, tier: Tier) {
  const order: Tier[] = ["Bronze", "Silver", "Gold", "Platinum"];
  const idx = order.indexOf(tier);
  const next = order[idx + 1];
  if (!next) return { next: null as Tier | null, needed: 0, current: points, target: points, pct: 100 };
  const base = TIER_THRESHOLDS[tier];
  const target = TIER_THRESHOLDS[next];
  const pct = Math.min(100, Math.round(((points - base) / (target - base)) * 100));
  return { next, needed: target - points, current: points, target, pct };
}

interface PendingRegistration {
  name: string;
  phone: string;
  countryCode: string;
  vehicle: Omit<Vehicle, "id">;
}

interface Ctx {
  profile: Profile | null;
  vehicles: Vehicle[];
  pending: PendingRegistration | null;
  setPending: (p: PendingRegistration | null) => void;
  completeRegistration: () => void;
  updateProfile: (patch: Partial<Pick<Profile, "name" | "phone" | "countryCode">>) => void;
  addVehicle: (v: Omit<Vehicle, "id">) => void;
  updateVehicle: (id: string, v: Omit<Vehicle, "id">) => void;
  deleteVehicle: (id: string) => void;
}

const PortalCtx = React.createContext<Ctx | null>(null);

const DEFAULT_PROFILE: Profile = {
  name: "Alex Nguyen",
  phone: "987654321",
  countryCode: "+84",
  tier: "Silver",
  points: 150,
};

const DEFAULT_VEHICLES: Vehicle[] = [
  { id: "v1", brandModel: "Toyota Vios", plate: "51G-123.45", type: "Sedan" },
  { id: "v2", brandModel: "Honda CR-V", plate: "51K-678.90", type: "SUV" },
];

export function PortalStoreProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = React.useState<Profile | null>(DEFAULT_PROFILE);
  const [vehicles, setVehicles] = React.useState<Vehicle[]>(DEFAULT_VEHICLES);
  const [pending, setPending] = React.useState<PendingRegistration | null>(null);

  const completeRegistration = () => {
    if (!pending) return;
    setProfile({
      name: pending.name,
      phone: pending.phone,
      countryCode: pending.countryCode,
      tier: "Bronze",
      points: 0,
    });
    setVehicles([{ ...pending.vehicle, id: `v${Date.now()}` }]);
    setPending(null);
  };

  const updateProfile: Ctx["updateProfile"] = (patch) =>
    setProfile((p) => (p ? { ...p, ...patch } : p));

  const addVehicle: Ctx["addVehicle"] = (v) =>
    setVehicles((prev) => [...prev, { ...v, id: `v${Date.now()}` }]);

  const updateVehicle: Ctx["updateVehicle"] = (id, v) =>
    setVehicles((prev) => prev.map((x) => (x.id === id ? { ...v, id } : x)));

  const deleteVehicle: Ctx["deleteVehicle"] = (id) =>
    setVehicles((prev) => prev.filter((x) => x.id !== id));

  return (
    <PortalCtx.Provider
      value={{
        profile,
        vehicles,
        pending,
        setPending,
        completeRegistration,
        updateProfile,
        addVehicle,
        updateVehicle,
        deleteVehicle,
      }}
    >
      {children}
    </PortalCtx.Provider>
  );
}

export function usePortal() {
  const ctx = React.useContext(PortalCtx);
  if (!ctx) throw new Error("usePortal must be inside PortalStoreProvider");
  return ctx;
}

export const VEHICLE_TYPES: VehicleType[] = ["Sedan", "SUV", "Truck", "Motorbike"];