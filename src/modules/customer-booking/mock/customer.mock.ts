import type {
  ActiveCombo,
  ComboPackage,
  CustomerProfile,
  Promotion,
  ServiceAddon,
  ServicePackage,
} from "../types/customer.types";

export const mockCustomer: CustomerProfile = {
  id: "cus-001",
  fullName: "Nguyen Minh Anh",
  tier: "Gold",
  isNewCustomer: false,
  availablePoints: 1280,
  lifetimePoints: 8450,
};

export const mockActiveCombo: ActiveCombo = {
  id: "active-combo-001",
  comboPackageId: "combo-family-plus",
  comboName: "Family Plus Monthly",
  status: "ACTIVE",
  remainingUses: 4,
  totalUses: 6,
  validUntil: "2026-06-18",
  linkedVehicleId: "veh-001",
  qrCodeText: "CW-COMBO-001-9X7K2",
};

export const mockServicePackages: ServicePackage[] = [
  {
    id: "pkg-express",
    name: "Express Exterior",
    description: "Fast foam wash, rinse, dry, tire shine, and glass finish.",
    price: 90000,
    durationMinutes: 25,
    highlights: ["Foam wash", "Tire shine", "Quick dry"],
    recommendedFor: "Weekly maintenance",
  },
  {
    id: "pkg-premium",
    name: "Premium In-Out",
    description: "Exterior wash plus vacuuming, dashboard wipe, and interior fragrance.",
    price: 160000,
    durationMinutes: 45,
    highlights: ["Exterior wash", "Interior vacuum", "Fragrance"],
    recommendedFor: "Family cars",
  },
  {
    id: "pkg-detail",
    name: "Detail Refresh",
    description: "Careful exterior wash, wax boost, rim care, cabin vacuum, and leather wipe.",
    price: 260000,
    durationMinutes: 75,
    highlights: ["Wax boost", "Rim care", "Leather wipe"],
    recommendedFor: "Before trips or events",
  },
];

export const mockServiceAddons: ServiceAddon[] = [
  {
    id: "addon-super-clean",
    name: "Super Clean Finish",
    description: "Enhanced foam wash, detail rinse, wheel face wipe, and quick gloss finish.",
    price: 55000,
    durationMinutes: 10,
  },
  {
    id: "addon-extra-cabin-vacuum",
    name: "Extra Cabin Vacuum",
    description: "Additional vacuum pass for carpets, seats, mats, trunk, and tight cabin corners.",
    price: 45000,
    durationMinutes: 10,
  },
  {
    id: "addon-interior-deep-clean",
    name: "Interior Deep Clean",
    description:
      "Deep cleaning for dashboard, door trims, cup holders, seats, and interior plastics.",
    price: 140000,
    durationMinutes: 30,
  },
  {
    id: "addon-exterior-deep-clean",
    name: "Exterior Deep Clean",
    description: "Focused exterior decontamination for lower panels, wheels, glass, and bug marks.",
    price: 120000,
    durationMinutes: 25,
  },
  {
    id: "addon-ppf",
    name: "Paint Protection Film",
    description: "Transparent protective film for high-impact exterior paint areas.",
    price: 280000,
    durationMinutes: 45,
  },
  {
    id: "addon-door-edge-film",
    name: "Door Edge & Handle Cup Film",
    description:
      "Clear film for door edges and handle cups to reduce daily scuffs and fingernail marks.",
    price: 65000,
    durationMinutes: 15,
  },
  {
    id: "addon-windshield-film",
    name: "Windshield Protection Film",
    description:
      "Protective windshield film demo option for chips, light scratches, and road debris.",
    price: 320000,
    durationMinutes: 45,
  },
  {
    id: "addon-scratch-touch-up",
    name: "Exterior Scratch Touch-Up Paint",
    description: "Small-area touch-up paint service for visible exterior scratches and chips.",
    price: 180000,
    durationMinutes: 35,
  },
];

export const mockComboPackages: ComboPackage[] = [
  {
    id: "combo-city",
    name: "City Driver 4",
    description: "Four express washes for commuters who need a clean car every week.",
    price: 320000,
    totalUses: 4,
    validityDays: 30,
    savingsText: "Save 40,000 VND",
    packageIds: ["pkg-express"],
  },
  {
    id: "combo-family-plus",
    name: "Family Plus Monthly",
    description: "Six flexible washes for one linked vehicle, valid for the whole month.",
    price: 760000,
    totalUses: 6,
    validityDays: 30,
    savingsText: "Save up to 200,000 VND",
    packageIds: ["pkg-express", "pkg-premium"],
  },
  {
    id: "combo-diamond-care",
    name: "Diamond Care Monthly",
    description:
      "Eight premium washes with detail refresh access, priority booking, and better value for frequent users.",
    price: 1120000,
    totalUses: 8,
    validityDays: 45,
    savingsText: "Save up to 360,000 VND",
    packageIds: ["pkg-express", "pkg-premium", "pkg-detail"],
  },
  {
    id: "combo-detail-care",
    name: "Detail Care Trio",
    description: "Three premium detail refreshes for drivers who want a sharper finish.",
    price: 690000,
    totalUses: 3,
    validityDays: 45,
    savingsText: "Save 90,000 VND",
    packageIds: ["pkg-detail"],
  },
];

export const mockPromotions: Promotion[] = [
  {
    code: "GOLD25",
    label: "Gold member benefit",
    discountAmount: 25000,
    eligibleTiers: ["Gold", "Diamond"],
  },
  {
    code: "DIAMOND50",
    label: "Diamond priority reward",
    discountAmount: 50000,
    eligibleTiers: ["Diamond"],
  },
  {
    code: "WELCOME15",
    label: "New customer welcome offer",
    discountAmount: 15000,
    eligibleTiers: ["Silver", "Gold", "Diamond"],
    newCustomersOnly: true,
  },
];
