export type MembershipTier = "Silver" | "Gold" | "Diamond";

export interface CustomerProfile {
  id: string;
  fullName: string;
  tier: MembershipTier;
  isNewCustomer: boolean;
  availablePoints: number;
  lifetimePoints: number;
}

export type ActiveComboStatus = "ACTIVE" | "EXPIRING_SOON" | "PAUSED";

export interface ActiveCombo {
  id: string;
  comboPackageId: string;
  comboName: string;
  status: ActiveComboStatus;
  remainingUses: number;
  totalUses: number;
  validUntil: string;
  linkedVehicleId: string;
  qrCodeText: string;
}

export interface ServicePackage {
  id: string;
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
  highlights: string[];
  recommendedFor: string;
}

export interface ServiceAddon {
  id: string;
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
}

export interface ComboPackage {
  id: string;
  name: string;
  description: string;
  price: number;
  totalUses: number;
  validityDays: number;
  savingsText: string;
  packageIds: string[];
}

export interface Promotion {
  code: string;
  label: string;
  discountAmount: number;
  eligibleTiers: MembershipTier[];
  newCustomersOnly?: boolean;
}
