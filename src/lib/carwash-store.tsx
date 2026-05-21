import * as React from "react";
import {
  getStaffAvailability,
  requireAvailableStaff,
  type StaffAvailability,
} from "@/lib/staff-availability";

export type Role = "Customer" | "Staff" | "Admin";
export type CustomerStatus = "Active" | "Inactive" | "Blocked";
export type StaffStatus = "Active" | "Inactive";
export type VehicleType = "Sedan" | "SUV" | "Truck" | "Motorbike";
export type Tier = "Member" | "Silver" | "Gold" | "Platinum";
export type BookingStatus =
  | "Pending"
  | "Confirmed"
  | "Checked-in"
  | "Completed"
  | "Cancelled"
  | "No-show";
export type WashStatus = "Queued" | "In Progress" | "Ready for Checkout" | "Completed";
export type NotificationType = "Booking" | "Reminder" | "Loyalty" | "Promotion";
export type RewardType = "discount" | "free wash" | "add-on";

export interface Vehicle {
  id: string;
  brandModel: string;
  plate: string;
  type: VehicleType;
  color?: string;
}

export interface CustomerRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  countryCode: string;
  tier: Tier;
  points: number;
  status: CustomerStatus;
  joinedAt: string;
  phoneVerifiedAt: string;
  bookingSuspendedUntil?: string;
}

export interface StaffRecord {
  id: string;
  name: string;
  role: Extract<Role, "Staff" | "Admin">;
  status: StaffStatus;
}

export interface TierRule {
  name: Tier;
  minPoints: number;
  bookingWindowDays: number;
  discountPercent: number;
  multiplier: number;
  perks: string;
}

export interface Service {
  id: string;
  name: string;
  price: number;
  icon: string;
}

export interface Booking {
  id: string;
  customerId: string;
  customerName?: string;
  customerPhone?: string;
  vehicleId?: string;
  vehiclePlate: string;
  vehicleName: string;
  vehicleType: VehicleType;
  services: string[];
  totalPrice: number;
  scheduledAt: string;
  dateISO: string;
  timeSlot: string;
  status: BookingStatus;
  createdAt: string;
  notes?: string;
  isWalkIn?: boolean;
  checkInAt?: string;
  washStatus?: WashStatus;
  completedAt?: string;
  checkoutTransactionId?: string;
  checkoutAmount?: number;
  checkoutPaymentMethod?: string;
  checkoutPointsEarned?: number;
  checkoutPointsRedeemed?: number;
  checkoutPromoCode?: string;
}

export interface SessionDraft {
  sessionId: string;
  bookingId?: string;
  staffId: string;
  staffName: string;
  customerId: string;
  customerName: string;
  customerTier: Tier | "Guest";
  customerPoints: number;
  vehicleType: VehicleType;
  plate: string;
  services: Service[];
  walkIn?: boolean;
}

export interface WashSessionRecord {
  id: string;
  bookingId?: string;
  customerId: string;
  customerName: string;
  staffId: string;
  staffName: string;
  vehicleType: VehicleType;
  plate: string;
  services: Service[];
  subtotal: number;
  status: WashStatus;
  startedAt: string;
  readyForCheckoutAt?: string;
  completedAt?: string;
  checkoutTransactionId?: string;
  walkIn?: boolean;
}

export interface Promotion {
  id: string;
  code: string;
  discountType: "Percentage" | "Flat";
  amount: number;
  tiers: Tier[];
  active: boolean;
  startDate: string;
  endDate: string;
  stackable: boolean;
}

export interface Reward {
  id: string;
  name: string;
  cost: number;
  icon: string;
  type: RewardType;
}

export interface LedgerEntry {
  id: string;
  customerId: string;
  date: string;
  type: "Earned" | "Spent" | "Adjusted";
  delta: number;
  description: string;
  expiresAt?: string;
}

export interface VehicleOwnershipHistoryEntry {
  id: string;
  vehicleId?: string;
  plate: string;
  previousCustomerId?: string;
  newCustomerId?: string;
  previousCustomerName: string;
  newCustomerName: string;
  transferredAt: string;
  note: string;
}

export interface TierHistoryEntry {
  id: string;
  date: string;
  customerName: string;
  previousTier: Tier;
  newTier: Tier;
  trigger: "Monthly Review" | "System Auto-Upgrade" | "System Auto-Downgrade" | "Admin Override";
  authorizedBy: string;
}

export interface Transaction {
  id: string;
  bookingId?: string;
  date: string;
  customer: {
    id: string;
    name: string;
    tier: Tier | "Guest";
    discountPct: number;
    points: number;
  };
  vehicleType: string;
  plate: string;
  services: Service[];
  subtotal: number;
  tierDiscount: number;
  promoDiscount: number;
  promoCode?: string;
  pointsRedeemed: number;
  pointsValue: number;
  finalAmount: number;
  pointsEarned: number;
  paymentMethod: string;
}

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
}

export interface Adjustment {
  id: string;
  timestamp: Date;
  executive: string;
  customerId: string;
  customerName: string;
  delta: number;
  previousBalance: number;
  nextBalance: number;
  reason: string;
}

interface PendingRegistration {
  name: string;
  phone: string;
  countryCode: string;
  vehicle: Omit<Vehicle, "id">;
  otpCode: string;
  otpExpiresAt: string;
  otpSentAt: string;
}

interface PendingPhoneChange {
  customerId: string;
  phone: string;
  countryCode: string;
  otpCode: string;
  otpExpiresAt: string;
  otpSentAt: string;
}

interface PersistedStore {
  role: Role;
  isAuthenticated: boolean;
  tiers: TierRule[];
  promotions: Promotion[];
  currentCustomerId: string;
  customers: CustomerRecord[];
  staffMembers: StaffRecord[];
  currentStaffId: string;
  vehiclesByCustomer: Record<string, Vehicle[]>;
  bookings: Booking[];
  washSessions: WashSessionRecord[];
  selectedBookingId: string | null;
  sessionDraft: SessionDraft | null;
  transactions: Transaction[];
  lastTransaction: Transaction | null;
  ledger: LedgerEntry[];
  tierHistory: TierHistoryEntry[];
  notifications: Array<Omit<NotificationItem, "timestamp"> & { timestamp: string }>;
  adjustments: Array<Omit<Adjustment, "timestamp"> & { timestamp: string }>;
  pendingRegistration: PendingRegistration | null;
  pendingPhoneChange: PendingPhoneChange | null;
  pendingTierRules: TierRule[] | null;
  nextTierReviewDate: string;
  eventKeys: string[];
  vehicleOwnershipHistory: VehicleOwnershipHistoryEntry[];
}

interface Store {
  role: Role;
  isAuthenticated: boolean;
  hydrated: boolean;
  setRole: (role: Role) => void;
  loginAs: (role: Role) => void;
  logout: () => void;
  tiers: TierRule[];
  services: Service[];
  promotions: Promotion[];
  rewards: Reward[];
  currentCustomerId: string;
  customers: CustomerRecord[];
  staffMembers: StaffRecord[];
  currentStaffId: string;
  vehiclesByCustomer: Record<string, Vehicle[]>;
  bookings: Booking[];
  washSessions: WashSessionRecord[];
  staffAvailability: StaffAvailability[];
  selectedBookingId: string | null;
  sessionDraft: SessionDraft | null;
  transactions: Transaction[];
  lastTransaction: Transaction | null;
  ledger: LedgerEntry[];
  tierHistory: TierHistoryEntry[];
  notifications: NotificationItem[];
  adjustments: Adjustment[];
  pendingRegistration: PendingRegistration | null;
  pendingPhoneChange: PendingPhoneChange | null;
  pendingTierRules: TierRule[] | null;
  nextTierReviewDate: string;
  vehicleOwnershipHistory: VehicleOwnershipHistoryEntry[];
  setPendingRegistration: (value: PendingRegistration | null) => void;
  requestRegistrationOtp: (input: {
    name: string;
    phone: string;
    countryCode: string;
    vehicle: Omit<Vehicle, "id">;
  }) => string;
  resendRegistrationOtp: () => string;
  completeRegistration: (otpCode: string) => void;
  requestPhoneChange: (input: { phone: string; countryCode: string }) => string;
  resendPhoneChangeOtp: () => string;
  confirmPhoneChange: (otpCode: string) => void;
  updateCurrentProfile: (patch: Partial<Pick<CustomerRecord, "name" | "email" | "status">>) => void;
  addVehicle: (vehicle: Omit<Vehicle, "id">) => void;
  updateVehicle: (id: string, vehicle: Omit<Vehicle, "id">) => void;
  deleteVehicle: (id: string) => { ok: boolean; error?: string };
  setCurrentCustomerId: (id: string) => void;
  createBookingFromLegacy: (
    input: Omit<Booking, "id" | "customerId" | "createdAt" | "timeSlot">,
  ) => string;
  updateBookingStatus: (id: string, status: BookingStatus) => void;
  setSelectedBookingId: (id: string | null) => void;
  createWalkInBooking: (input: {
    plate: string;
    vehicleType: VehicleType;
    serviceIds: string[];
  }) => { id: string; staffName: string };
  assignStaffToSession: (sessionId: string, staffId: string) => void;
  createOrUpdateSessionDraft: (draft: SessionDraft | null) => void;
  prepareSessionForBooking: (bookingId: string) => string;
  completeCheckout: (input: {
    promoCode?: string | null;
    pointsRedeemed: number;
    paymentMethod: string;
  }) => Transaction | null;
  updateCustomerPoints: (customerId: string, nextPoints: number, reason?: string) => void;
  redeemReward: (customerId: string, reward: Reward) => boolean;
  updateTiers: (tiers: TierRule[]) => void;
  addPromotion: (promotion: Omit<Promotion, "id">) => void;
  togglePromotion: (id: string) => void;
  pushNotification: (notification: Omit<NotificationItem, "id" | "timestamp">) => void;
  addAdjustment: (adjustment: {
    executive: string;
    customerId: string;
    delta: number;
    reason: string;
  }) => void;
  runMonthlyTierReview: () => void;
}

const tierSeed: TierRule[] = [
  {
    name: "Member",
    minPoints: 0,
    bookingWindowDays: 7,
    discountPercent: 0,
    multiplier: 1,
    perks: "Standard booking and loyalty earning.",
  },
  {
    name: "Silver",
    minPoints: 500,
    bookingWindowDays: 10,
    discountPercent: 5,
    multiplier: 1.5,
    perks: "Priority booking window and 5% wash discount.",
  },
  {
    name: "Gold",
    minPoints: 1500,
    bookingWindowDays: 12,
    discountPercent: 10,
    multiplier: 2,
    perks: "Premium promotion eligibility and double points.",
  },
  {
    name: "Platinum",
    minPoints: 4000,
    bookingWindowDays: 14,
    discountPercent: 15,
    multiplier: 3,
    perks: "Highest booking priority and VIP campaigns.",
  },
];

const serviceSeed: Service[] = [
  { id: "basic", name: "Basic Wash", price: 120000, icon: "Droplets" },
  { id: "premium", name: "Premium Detail", price: 280000, icon: "Sparkles" },
  { id: "vacuum", name: "Interior Vacuum", price: 60000, icon: "Wind" },
  { id: "ceramic", name: "Ceramic Coating", price: 450000, icon: "Shield" },
];

const promotionSeed: Promotion[] = [
  {
    id: "p1",
    code: "WELCOME50K",
    discountType: "Flat",
    amount: 50000,
    tiers: ["Member", "Silver", "Gold", "Platinum"],
    active: true,
    startDate: "2026-05-01",
    endDate: "2026-12-31",
    stackable: false,
  },
  {
    id: "p2",
    code: "SILVER10",
    discountType: "Percentage",
    amount: 10,
    tiers: ["Silver", "Gold", "Platinum"],
    active: true,
    startDate: "2026-05-01",
    endDate: "2026-08-31",
    stackable: false,
  },
  {
    id: "p3",
    code: "PLATINUM15",
    discountType: "Percentage",
    amount: 15,
    tiers: ["Platinum"],
    active: true,
    startDate: "2026-05-01",
    endDate: "2026-08-31",
    stackable: false,
  },
];

const rewardSeed: Reward[] = [
  { id: "r1", name: "Free Interior Scent", cost: 80, icon: "Wind", type: "add-on" },
  { id: "r2", name: "Free Tire Shine", cost: 150, icon: "CircleDot", type: "add-on" },
  { id: "r3", name: "50K Wash Voucher", cost: 300, icon: "Ticket", type: "discount" },
];

const customerSeed: CustomerRecord[] = [
  {
    id: "c1",
    name: "Tran Minh Anh",
    email: "minhanh@autowash.vn",
    phone: "0901234567",
    countryCode: "+84",
    tier: "Silver",
    points: 860,
    status: "Active",
    joinedAt: "2025-02-15",
    phoneVerifiedAt: "2025-02-15T09:00:00.000Z",
  },
  {
    id: "c2",
    name: "Le Gia Huy",
    email: "giahuy@autowash.vn",
    phone: "0912345678",
    countryCode: "+84",
    tier: "Gold",
    points: 1820,
    status: "Active",
    joinedAt: "2024-10-03",
    phoneVerifiedAt: "2024-10-03T10:15:00.000Z",
  },
  {
    id: "c3",
    name: "Pham Thu Trang",
    email: "thutrang@autowash.vn",
    phone: "0987654321",
    countryCode: "+84",
    tier: "Platinum",
    points: 4520,
    status: "Active",
    joinedAt: "2024-05-01",
    phoneVerifiedAt: "2024-05-01T08:00:00.000Z",
  },
];

const staffSeed: StaffRecord[] = [
  { id: "s1", name: "Tran Bao Nam", role: "Staff", status: "Active" },
  { id: "s2", name: "Hoang Lan", role: "Staff", status: "Inactive" },
  { id: "s3", name: "Nguyen Van Hung", role: "Staff", status: "Active" },
  { id: "s4", name: "Pham Minh Duc", role: "Staff", status: "Active" },
];

const vehicleSeed: Record<string, Vehicle[]> = {
  c1: [
    { id: "v1", brandModel: "Toyota Vios", plate: "51G-123.45", type: "Sedan" },
    { id: "v2", brandModel: "Honda CR-V", plate: "51K-678.90", type: "SUV" },
  ],
  c2: [{ id: "v3", brandModel: "Ford Ranger", plate: "60C-889.11", type: "Truck" }],
  c3: [{ id: "v4", brandModel: "Mercedes GLC", plate: "30A-998.77", type: "SUV" }],
};

const now = new Date();
const plusDays = (days: number) => {
  const next = new Date(now);
  next.setDate(next.getDate() + days);
  return next;
};
const localDateISO = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
const formatSchedule = (dateISO: string, timeSlot: string) =>
  `${new Date(dateISO).toLocaleDateString("en-US", { month: "short", day: "numeric" })} ${timeSlot}`;

const bookingSeed: Booking[] = [
  {
    id: "B001",
    customerId: "c1",
    vehicleId: "v1",
    vehiclePlate: "51G-123.45",
    vehicleName: "Toyota Vios",
    vehicleType: "Sedan",
    services: ["Basic Wash", "Interior Vacuum"],
    totalPrice: 180000,
    scheduledAt: formatSchedule(localDateISO(plusDays(1)), "09:00 AM"),
    dateISO: localDateISO(plusDays(1)),
    timeSlot: "09:00 AM",
    status: "Confirmed",
    createdAt: now.toISOString(),
  },
  {
    id: "B002",
    customerId: "c1",
    vehicleId: "v2",
    vehiclePlate: "51K-678.90",
    vehicleName: "Honda CR-V",
    vehicleType: "SUV",
    services: ["Premium Detail"],
    totalPrice: 280000,
    scheduledAt: formatSchedule(localDateISO(plusDays(2)), "02:00 PM"),
    dateISO: localDateISO(plusDays(2)),
    timeSlot: "02:00 PM",
    status: "Pending",
    createdAt: now.toISOString(),
  },
];

const ledgerSeed: LedgerEntry[] = [
  {
    id: "l1",
    customerId: "c1",
    date: "2026-05-12",
    type: "Earned",
    delta: 120,
    description: "Premium Detail completed",
    expiresAt: "2027-05-12",
  },
  {
    id: "l2",
    customerId: "c1",
    date: "2026-05-08",
    type: "Spent",
    delta: -80,
    description: "Redeemed Free Interior Scent",
  },
  {
    id: "l3",
    customerId: "c2",
    date: "2025-06-18",
    type: "Earned",
    delta: 90,
    description: "Express wash completed",
    expiresAt: "2026-06-18",
  },
];

const tierHistorySeed: TierHistoryEntry[] = [
  {
    id: "th1",
    date: "2026-05-01 09:00",
    customerName: "Tran Minh Anh",
    previousTier: "Member",
    newTier: "Silver",
    trigger: "Monthly Review",
    authorizedBy: "system",
  },
  {
    id: "th2",
    date: "2026-04-01 09:00",
    customerName: "Le Gia Huy",
    previousTier: "Silver",
    newTier: "Gold",
    trigger: "Monthly Review",
    authorizedBy: "system",
  },
];

const notificationsSeed: NotificationItem[] = [
  {
    id: "n1",
    type: "Booking",
    title: "Booking Confirmed",
    message: "Booking B001 has been confirmed for 09:00 AM tomorrow.",
    timestamp: new Date(Date.now() - 10 * 60 * 1000),
  },
  {
    id: "n2",
    type: "Reminder",
    title: "1-Hour Reminder",
    message: "Vehicle 51G-123.45 is scheduled in 1 hour.",
    timestamp: new Date(Date.now() - 65 * 60 * 1000),
  },
];

const adjustmentSeed: Adjustment[] = [
  {
    id: "a1",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    executive: "Operations Manager",
    customerId: "c1",
    customerName: "Tran Minh Anh",
    delta: 50,
    previousBalance: 810,
    nextBalance: 860,
    reason: "Service recovery goodwill after delayed checkout.",
  },
];

const vehicleOwnershipHistorySeed: VehicleOwnershipHistoryEntry[] = [
  {
    id: "vh1",
    vehicleId: "v3",
    plate: "60C-889.11",
    previousCustomerName: "Nguyen Hoang Son",
    newCustomerName: "Le Gia Huy",
    transferredAt: "2025-12-02T09:10:00.000Z",
    note: "Ownership transfer recorded after customer profile migration.",
  },
];

const transactionSeed: Transaction[] = [
  {
    id: "TX-240501",
    date: "2026-05-14T10:20:00.000Z",
    customer: { id: "c1", name: "Tran Minh Anh", tier: "Silver", discountPct: 5, points: 800 },
    vehicleType: "Sedan",
    plate: "51G-123.45",
    services: [serviceSeed[0], serviceSeed[2]],
    subtotal: 180000,
    tierDiscount: 9000,
    promoDiscount: 0,
    pointsRedeemed: 0,
    pointsValue: 0,
    finalAmount: 171000,
    pointsEarned: 25,
    paymentMethod: "Cash",
  },
];

const washSessionSeed: WashSessionRecord[] = [];

const STORAGE_KEY = "carwash-prototype-state-v3";
const SHOP_CAPACITY = 3;
const OTP_TTL_MS = 60 * 1000;

const Ctx = React.createContext<Store | null>(null);

export function formatMoney(amount: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDateISO(date: Date) {
  return localDateISO(date);
}

function normalizePlate(plate: string) {
  return plate.trim().toUpperCase().replace(/\s+/g, "");
}

function isVietnamesePhone(phone: string) {
  return /^0\d{9}$/.test(phone.trim());
}

function isVietnamesePlate(plate: string) {
  return /^\d{2}[A-Z0-9]{1,2}-\d{3}\.\d{2}$/.test(normalizePlate(plate));
}

function ensureVietnamesePlate(plate: string) {
  if (!isVietnamesePlate(plate)) {
    throw new Error("License plate must follow Vietnamese format, e.g. 51G-123.45 or 85F1-072.22.");
  }
}

function parseBookingDate(booking: Pick<Booking, "dateISO" | "timeSlot">) {
  return new Date(`${booking.dateISO} ${booking.timeSlot}`);
}

function nowLocalDateISO() {
  return localDateISO(new Date());
}

function addDays(dateISO: string, days: number) {
  const date = new Date(`${dateISO}T00:00:00`);
  date.setDate(date.getDate() + days);
  return localDateISO(date);
}

function monthStart(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-01`;
}

function nextMonthStart(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 1).toISOString();
}

function sameDay(a: string, b: string) {
  return a.slice(0, 10) === b.slice(0, 10);
}

interface PointSnapshot {
  available: number;
  expiringIn30Days: number;
  expiringIn7Days: number;
  expiredPendingSweep: number;
  nextExpiryDate: string | null;
}

export function getPointSnapshotForCustomer(
  entries: LedgerEntry[],
  customerId: string,
  asOf = new Date(),
): PointSnapshot {
  const lots: Array<{ amount: number; expiresAt: string }> = [];
  const customerEntries = entries
    .filter((entry) => entry.customerId === customerId)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  for (const entry of customerEntries) {
    if (entry.type === "Earned" && entry.delta > 0) {
      lots.push({
        amount: entry.delta,
        expiresAt: entry.expiresAt ?? addDays(entry.date, 365),
      });
      continue;
    }
    let toConsume = Math.abs(entry.delta);
    for (const lot of lots) {
      if (toConsume <= 0) break;
      if (lot.amount <= 0) continue;
      const consumed = Math.min(lot.amount, toConsume);
      lot.amount -= consumed;
      toConsume -= consumed;
    }
  }

  let available = 0;
  let expiringIn30Days = 0;
  let expiringIn7Days = 0;
  let expiredPendingSweep = 0;
  let nextExpiryDate: string | null = null;
  const today = new Date(`${localDateISO(asOf)}T00:00:00`);

  for (const lot of lots) {
    if (lot.amount <= 0) continue;
    const expiry = new Date(`${lot.expiresAt}T00:00:00`);
    const diffDays = Math.floor((expiry.getTime() - today.getTime()) / 86400000);
    if (diffDays < 0) {
      expiredPendingSweep += lot.amount;
      continue;
    }
    available += lot.amount;
    if (nextExpiryDate === null || lot.expiresAt < nextExpiryDate) {
      nextExpiryDate = lot.expiresAt;
    }
    if (diffDays <= 7) {
      expiringIn7Days += lot.amount;
    }
    if (diffDays <= 30) {
      expiringIn30Days += lot.amount;
    }
  }

  return {
    available,
    expiringIn30Days,
    expiringIn7Days,
    expiredPendingSweep,
    nextExpiryDate,
  };
}

export function getRolling12MonthPoints(
  entries: LedgerEntry[],
  customerId: string,
  asOf = new Date(),
) {
  const windowStart = new Date(asOf);
  windowStart.setFullYear(windowStart.getFullYear() - 1);
  return Math.max(
    0,
    entries
      .filter((entry) => {
        if (entry.customerId !== customerId) return false;
        const entryDate = new Date(`${entry.date}T00:00:00`);
        return entryDate >= windowStart && entryDate <= asOf;
      })
      .reduce((sum, entry) => sum + entry.delta, 0),
  );
}

export function calculateCheckoutPricing(input: {
  subtotal: number;
  tierDiscountPercent: number;
  promo?: Promotion | null;
}) {
  const tierDiscount = Math.round(input.subtotal * (input.tierDiscountPercent / 100));
  const afterTier = Math.max(0, input.subtotal - tierDiscount);
  const rawPromoDiscount = input.promo
    ? input.promo.discountType === "Percentage"
      ? Math.round(afterTier * (input.promo.amount / 100))
      : Math.min(input.promo.amount, afterTier)
    : 0;
  const bestSingleDiscount = Math.max(tierDiscount, rawPromoDiscount);
  const effectiveTierDiscount =
    input.promo?.stackable === false
      ? tierDiscount >= rawPromoDiscount
        ? tierDiscount
        : 0
      : tierDiscount;
  const promoDiscount =
    input.promo?.stackable === false
      ? rawPromoDiscount > tierDiscount
        ? rawPromoDiscount
        : 0
      : rawPromoDiscount;
  const afterPromo =
    input.promo?.stackable === false
      ? Math.max(0, input.subtotal - bestSingleDiscount)
      : Math.max(0, input.subtotal - tierDiscount - rawPromoDiscount);

  return {
    tierDiscount,
    rawPromoDiscount,
    effectiveTierDiscount,
    promoDiscount,
    afterPromo,
  };
}

function loadPersistedState(): PersistedStore | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as PersistedStore;
  } catch {
    return null;
  }
}

function nextBookingSequence(bookings: Booking[]) {
  const maxId = bookings.reduce((max, booking) => {
    const match = booking.id.match(/^B(\d+)$/);
    if (!match) return max;
    return Math.max(max, Number(match[1]));
  }, 0);
  return maxId + 1;
}

function tierFor(points: number, tiers: TierRule[]): Tier {
  return (
    [...tiers].sort((a, b) => b.minPoints - a.minPoints).find((tier) => points >= tier.minPoints)
      ?.name ?? "Member"
  );
}

function tierRank(tier: Tier) {
  return ["Member", "Silver", "Gold", "Platinum"].indexOf(tier);
}

function subtotalForServices(services: Service[]) {
  return services.reduce((sum, service) => sum + service.price, 0);
}

function generateOtpCode() {
  return `${Math.floor(100000 + Math.random() * 900000)}`;
}

function createOtpChallenge() {
  const sentAt = new Date();
  return {
    otpCode: generateOtpCode(),
    otpSentAt: sentAt.toISOString(),
    otpExpiresAt: new Date(sentAt.getTime() + OTP_TTL_MS).toISOString(),
  };
}

function assertValidOtp(inputCode: string, challenge: { otpCode: string; otpExpiresAt: string }) {
  if (challenge.otpCode !== inputCode) {
    throw new Error("Invalid OTP code.");
  }
  if (new Date(challenge.otpExpiresAt).getTime() < Date.now()) {
    throw new Error("OTP code has expired. Please request a new code.");
  }
}

export function CarwashStoreProvider({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = React.useState(false);
  const [role, setRole] = React.useState<Role>("Customer");
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [tiers, setTiers] = React.useState<TierRule[]>(tierSeed);
  const [services] = React.useState<Service[]>(serviceSeed);
  const [promotions, setPromotions] = React.useState<Promotion[]>(promotionSeed);
  const [rewards] = React.useState<Reward[]>(rewardSeed);
  const [currentCustomerId, setCurrentCustomerId] = React.useState("c1");
  const [customers, setCustomers] = React.useState<CustomerRecord[]>(customerSeed);
  const [staffMembers, setStaffMembers] = React.useState<StaffRecord[]>(staffSeed);
  const [currentStaffId, setCurrentStaffId] = React.useState("s1");
  const [vehiclesByCustomer, setVehiclesByCustomer] =
    React.useState<Record<string, Vehicle[]>>(vehicleSeed);
  const [bookings, setBookings] = React.useState<Booking[]>(bookingSeed);
  const [washSessions, setWashSessions] = React.useState<WashSessionRecord[]>(washSessionSeed);
  const [selectedBookingId, setSelectedBookingId] = React.useState<string | null>("B001");
  const [sessionDraft, setSessionDraft] = React.useState<SessionDraft | null>(null);
  const [transactions, setTransactions] = React.useState<Transaction[]>(transactionSeed);
  const [lastTransaction, setLastTransaction] = React.useState<Transaction | null>(
    transactionSeed[0],
  );
  const [ledger, setLedger] = React.useState<LedgerEntry[]>(ledgerSeed);
  const [tierHistory, setTierHistory] = React.useState<TierHistoryEntry[]>(tierHistorySeed);
  const [notifications, setNotifications] = React.useState<NotificationItem[]>(notificationsSeed);
  const [adjustments, setAdjustments] = React.useState<Adjustment[]>(adjustmentSeed);
  const [pendingRegistration, setPendingRegistration] = React.useState<PendingRegistration | null>(
    null,
  );
  const [pendingPhoneChange, setPendingPhoneChange] = React.useState<PendingPhoneChange | null>(
    null,
  );
  const [pendingTierRules, setPendingTierRules] = React.useState<TierRule[] | null>(null);
  const [nextTierReviewDate, setNextTierReviewDate] = React.useState(nextMonthStart(now));
  const [eventKeys, setEventKeys] = React.useState<string[]>([]);
  const [vehicleOwnershipHistory, setVehicleOwnershipHistory] = React.useState<
    VehicleOwnershipHistoryEntry[]
  >(vehicleOwnershipHistorySeed);
  const nextBookingIdRef = React.useRef(nextBookingSequence(bookingSeed));

  React.useEffect(() => {
    const persisted = loadPersistedState();
    if (!persisted) {
      setHydrated(true);
      return;
    }

    setRole(persisted.role);
    setIsAuthenticated(Boolean(persisted.isAuthenticated));
    const restoredBookings = persisted.bookings ?? bookingSeed;
    setTiers(persisted.tiers ?? tierSeed);
    setPromotions(persisted.promotions ?? promotionSeed);
    setCurrentCustomerId(persisted.currentCustomerId ?? "c1");
    setCustomers(persisted.customers ?? customerSeed);
    const restoredStaffMembers = persisted.staffMembers ?? staffSeed;
    const restoredStaffId = persisted.currentStaffId ?? "s1";
    const restoredActiveStaff =
      restoredStaffMembers.find(
        (item) => item.id === restoredStaffId && item.status === "Active",
      ) ??
      restoredStaffMembers.find((item) => item.status === "Active") ??
      staffSeed[0];
    const restoredWashSessions = persisted.washSessions ?? washSessionSeed;
    setStaffMembers(restoredStaffMembers);
    setCurrentStaffId(restoredActiveStaff.id);
    setVehiclesByCustomer(persisted.vehiclesByCustomer ?? vehicleSeed);
    setBookings(restoredBookings);
    setWashSessions(
      restoredWashSessions.length > 0 || !persisted.sessionDraft
        ? restoredWashSessions
        : [
            {
              id: persisted.sessionDraft.sessionId ?? crypto.randomUUID(),
              bookingId: persisted.sessionDraft.bookingId,
              customerId: persisted.sessionDraft.customerId,
              customerName: persisted.sessionDraft.customerName,
              staffId: persisted.sessionDraft.staffId ?? restoredActiveStaff.id,
              staffName: persisted.sessionDraft.staffName ?? restoredActiveStaff.name,
              vehicleType: persisted.sessionDraft.vehicleType,
              plate: persisted.sessionDraft.plate,
              services: persisted.sessionDraft.services,
              subtotal: subtotalForServices(persisted.sessionDraft.services),
              status: "Ready for Checkout",
              startedAt: new Date().toISOString(),
              readyForCheckoutAt: new Date().toISOString(),
              walkIn: persisted.sessionDraft.walkIn,
            },
          ],
    );
    setSelectedBookingId(persisted.selectedBookingId ?? "B001");
    setSessionDraft(
      persisted.sessionDraft
        ? {
            ...persisted.sessionDraft,
            sessionId: persisted.sessionDraft.sessionId ?? crypto.randomUUID(),
            staffId: persisted.sessionDraft.staffId ?? restoredActiveStaff.id,
            staffName: persisted.sessionDraft.staffName ?? restoredActiveStaff.name,
          }
        : null,
    );
    setTransactions(persisted.transactions ?? transactionSeed);
    setLastTransaction(persisted.lastTransaction ?? transactionSeed[0]);
    setLedger(persisted.ledger ?? ledgerSeed);
    setTierHistory(persisted.tierHistory ?? tierHistorySeed);
    setNotifications(
      (persisted.notifications ?? notificationsSeed).map((notification) => ({
        ...notification,
        timestamp: new Date(notification.timestamp ?? new Date()),
      })),
    );
    setAdjustments(
      (persisted.adjustments ?? adjustmentSeed).map((adjustment) => ({
        ...adjustment,
        timestamp: new Date(adjustment.timestamp ?? new Date()),
      })),
    );
    setPendingRegistration(
      persisted.pendingRegistration
        ? {
            ...persisted.pendingRegistration,
            otpSentAt: persisted.pendingRegistration.otpSentAt ?? new Date().toISOString(),
            otpExpiresAt:
              persisted.pendingRegistration.otpExpiresAt ??
              new Date(Date.now() + OTP_TTL_MS).toISOString(),
          }
        : null,
    );
    setPendingPhoneChange(
      persisted.pendingPhoneChange
        ? {
            ...persisted.pendingPhoneChange,
            otpSentAt: persisted.pendingPhoneChange.otpSentAt ?? new Date().toISOString(),
            otpExpiresAt:
              persisted.pendingPhoneChange.otpExpiresAt ??
              new Date(Date.now() + OTP_TTL_MS).toISOString(),
          }
        : null,
    );
    setPendingTierRules(persisted.pendingTierRules);
    setNextTierReviewDate(persisted.nextTierReviewDate ?? nextMonthStart());
    setEventKeys(persisted.eventKeys ?? []);
    setVehicleOwnershipHistory(persisted.vehicleOwnershipHistory ?? vehicleOwnershipHistorySeed);
    nextBookingIdRef.current = nextBookingSequence(restoredBookings);
    setHydrated(true);
  }, []);

  const isActiveBooking = React.useCallback(
    (status: BookingStatus) => ["Pending", "Confirmed", "Checked-in"].includes(status),
    [],
  );

  const pushNotification = React.useCallback(
    (notification: Omit<NotificationItem, "id" | "timestamp">) => {
      setNotifications((prev) => [
        { ...notification, id: crypto.randomUUID(), timestamp: new Date() },
        ...prev,
      ]);
    },
    [],
  );

  const loginAs = React.useCallback((nextRole: Role) => {
    setRole(nextRole);
    setIsAuthenticated(true);
  }, []);

  const logout = React.useCallback(() => {
    setIsAuthenticated(false);
  }, []);

  const resolveActiveStaff = React.useCallback(() => {
    const staff = staffMembers.find(
      (item) => item.id === currentStaffId && item.status === "Active",
    );
    if (!staff) {
      throw new Error("Wash session requires an active staff member.");
    }
    return staff;
  }, [currentStaffId, staffMembers]);

  const resolveFreeStaff = React.useCallback(() => {
    return requireAvailableStaff(staffMembers, washSessions);
  }, [staffMembers, washSessions]);

  const updateCurrentProfile = React.useCallback(
    (patch: Partial<Pick<CustomerRecord, "name" | "email" | "status">>) => {
      setCustomers((prev) =>
        prev.map((customer) =>
          customer.id === currentCustomerId ? { ...customer, ...patch } : customer,
        ),
      );
    },
    [currentCustomerId],
  );

  const requestRegistrationOtp = React.useCallback(
    (input: { name: string; phone: string; countryCode: string; vehicle: Omit<Vehicle, "id"> }) => {
      if (!input.name.trim()) {
        throw new Error("Please enter your full name.");
      }
      if (!isVietnamesePhone(input.phone)) {
        throw new Error("Phone number must follow Vietnamese format.");
      }
      if (!input.vehicle.brandModel.trim()) {
        throw new Error("Please enter your vehicle brand & model.");
      }
      const normalizedPlate = normalizePlate(input.vehicle.plate);
      ensureVietnamesePlate(normalizedPlate);
      const duplicatePhone = customers.some(
        (customer) => customer.status === "Active" && customer.phone === input.phone,
      );
      if (duplicatePhone) {
        throw new Error("Phone number already exists.");
      }
      const challenge = createOtpChallenge();
      setPendingRegistration({
        ...input,
        vehicle: { ...input.vehicle, plate: normalizedPlate },
        ...challenge,
      });
      return challenge.otpCode;
    },
    [customers],
  );

  const resendRegistrationOtp = React.useCallback(() => {
    if (!pendingRegistration) {
      throw new Error("No registration is waiting for verification.");
    }
    const challenge = createOtpChallenge();
    setPendingRegistration((prev) => (prev ? { ...prev, ...challenge } : prev));
    return challenge.otpCode;
  }, [pendingRegistration]);

  const completeRegistration = React.useCallback(
    (otpCode: string) => {
      if (!pendingRegistration) return;
      assertValidOtp(otpCode, pendingRegistration);
      const duplicatePhone = customers.some(
        (customer) => customer.status === "Active" && customer.phone === pendingRegistration.phone,
      );
      if (duplicatePhone) {
        throw new Error("Phone number already exists.");
      }
      if (!isVietnamesePhone(pendingRegistration.phone)) {
        throw new Error("Phone number must follow Vietnamese format.");
      }
      const normalizedPlate = normalizePlate(pendingRegistration.vehicle.plate);
      ensureVietnamesePlate(normalizedPlate);
      const existingOwner = Object.entries(vehiclesByCustomer).find(([, customerVehicles]) =>
        customerVehicles.some((vehicle) => normalizePlate(vehicle.plate) === normalizedPlate),
      );
      let transferredVehicleId: string | undefined;
      let previousCustomerId: string | undefined;
      let previousCustomerName = "Unknown";
      if (existingOwner) {
        const [ownerId, ownerVehicles] = existingOwner;
        const owner = customers.find((customer) => customer.id === ownerId);
        if (owner?.status === "Active") {
          throw new Error("License plate already belongs to another active customer.");
        }
        previousCustomerId = ownerId;
        previousCustomerName = owner?.name ?? "Unknown";
        transferredVehicleId = ownerVehicles.find(
          (vehicle) => normalizePlate(vehicle.plate) === normalizedPlate,
        )?.id;
        setVehiclesByCustomer((prev) => ({
          ...prev,
          [ownerId]: (prev[ownerId] ?? []).filter(
            (vehicle) => normalizePlate(vehicle.plate) !== normalizedPlate,
          ),
        }));
      }
      const id = `c${Date.now()}`;
      setCustomers((prev) => [
        ...prev,
        {
          id,
          name: pendingRegistration.name,
          email: `${pendingRegistration.phone}@autowash.local`,
          phone: pendingRegistration.phone,
          countryCode: pendingRegistration.countryCode,
          tier: "Member",
          points: 0,
          status: "Active",
          joinedAt: nowLocalDateISO(),
          phoneVerifiedAt: new Date().toISOString(),
        },
      ]);
      setVehiclesByCustomer((prev) => ({
        ...prev,
        [id]: [
          {
            ...pendingRegistration.vehicle,
            plate: normalizedPlate,
            id: transferredVehicleId ?? `v-${Date.now()}`,
          },
        ],
      }));
      if (previousCustomerId) {
        setVehicleOwnershipHistory((prev) => [
          {
            id: crypto.randomUUID(),
            vehicleId: transferredVehicleId,
            plate: normalizedPlate,
            previousCustomerId,
            newCustomerId: id,
            previousCustomerName,
            newCustomerName: pendingRegistration.name,
            transferredAt: new Date().toISOString(),
            note: "Vehicle ownership transferred during new customer registration from an inactive record.",
          },
          ...prev,
        ]);
      }
      setCurrentCustomerId(id);
      setPendingRegistration(null);
    },
    [customers, pendingRegistration, vehiclesByCustomer],
  );

  const requestPhoneChange = React.useCallback(
    ({ phone, countryCode }: { phone: string; countryCode: string }) => {
      if (!isVietnamesePhone(phone)) {
        throw new Error("Phone number must follow Vietnamese format.");
      }
      const duplicatePhone = customers.some(
        (customer) =>
          customer.id !== currentCustomerId &&
          customer.status === "Active" &&
          customer.phone === phone,
      );
      if (duplicatePhone) {
        throw new Error("Phone number already exists.");
      }
      const challenge = createOtpChallenge();
      setPendingPhoneChange({
        customerId: currentCustomerId,
        phone,
        countryCode,
        ...challenge,
      });
      return challenge.otpCode;
    },
    [currentCustomerId, customers],
  );

  const resendPhoneChangeOtp = React.useCallback(() => {
    if (!pendingPhoneChange) {
      throw new Error("No phone number change is pending.");
    }
    const challenge = createOtpChallenge();
    setPendingPhoneChange((prev) => (prev ? { ...prev, ...challenge } : prev));
    return challenge.otpCode;
  }, [pendingPhoneChange]);

  const confirmPhoneChange = React.useCallback(
    (otpCode: string) => {
      if (!pendingPhoneChange) {
        throw new Error("No phone number change is pending.");
      }
      assertValidOtp(otpCode, pendingPhoneChange);
      setCustomers((prev) =>
        prev.map((customer) =>
          customer.id === pendingPhoneChange.customerId
            ? {
                ...customer,
                phone: pendingPhoneChange.phone,
                countryCode: pendingPhoneChange.countryCode,
                phoneVerifiedAt: new Date().toISOString(),
              }
            : customer,
        ),
      );
      setPendingPhoneChange(null);
    },
    [pendingPhoneChange],
  );

  const addVehicle = React.useCallback(
    (vehicle: Omit<Vehicle, "id">) => {
      const normalizedPlate = normalizePlate(vehicle.plate);
      ensureVietnamesePlate(normalizedPlate);
      const currentCustomer = customers.find((customer) => customer.id === currentCustomerId);
      const existingOwner = Object.entries(vehiclesByCustomer).find(
        ([customerId, customerVehicles]) =>
          customerId !== currentCustomerId &&
          customerVehicles.some((item) => normalizePlate(item.plate) === normalizedPlate),
      );
      if (existingOwner) {
        const [ownerId] = existingOwner;
        const owner = customers.find((customer) => customer.id === ownerId);
        const ownerVehicle = (vehiclesByCustomer[ownerId] ?? []).find(
          (item) => normalizePlate(item.plate) === normalizedPlate,
        );
        if (owner?.status === "Active") {
          throw new Error("License plate already belongs to another active customer.");
        }
        setVehiclesByCustomer((prev) => ({
          ...prev,
          [ownerId]: (prev[ownerId] ?? []).filter(
            (item) => normalizePlate(item.plate) !== normalizedPlate,
          ),
        }));
        setVehicleOwnershipHistory((prev) => [
          {
            id: crypto.randomUUID(),
            vehicleId: ownerVehicle?.id,
            plate: normalizedPlate,
            previousCustomerId: ownerId,
            newCustomerId: currentCustomerId,
            previousCustomerName: owner?.name ?? "Unknown",
            newCustomerName: currentCustomer?.name ?? "Unknown",
            transferredAt: new Date().toISOString(),
            note: "Vehicle ownership transferred from an inactive customer record to a new active owner.",
          },
          ...prev,
        ]);
        setVehiclesByCustomer((prev) => ({
          ...prev,
          [currentCustomerId]: [
            ...(prev[currentCustomerId] ?? []),
            {
              ...(ownerVehicle ?? vehicle),
              ...vehicle,
              id: ownerVehicle?.id ?? `v-${Date.now()}`,
              plate: normalizedPlate,
            },
          ],
        }));
        return;
      }
      setVehiclesByCustomer((prev) => ({
        ...prev,
        [currentCustomerId]: [
          ...(prev[currentCustomerId] ?? []),
          { ...vehicle, plate: normalizedPlate, id: `v-${Date.now()}` },
        ],
      }));
    },
    [currentCustomerId, customers, vehiclesByCustomer],
  );

  const updateVehicle = React.useCallback(
    (id: string, vehicle: Omit<Vehicle, "id">) => {
      const normalizedPlate = normalizePlate(vehicle.plate);
      ensureVietnamesePlate(normalizedPlate);
      const currentCustomer = customers.find((customer) => customer.id === currentCustomerId);
      const conflictingOwner = Object.entries(vehiclesByCustomer).find(
        ([customerId, customerVehicles]) =>
          customerId !== currentCustomerId &&
          customerVehicles.some((item) => normalizePlate(item.plate) === normalizedPlate),
      );
      if (conflictingOwner) {
        const [ownerId] = conflictingOwner;
        const owner = customers.find((customer) => customer.id === ownerId);
        const ownerVehicle = (vehiclesByCustomer[ownerId] ?? []).find(
          (item) => normalizePlate(item.plate) === normalizedPlate,
        );
        if (owner?.status === "Active") {
          throw new Error("License plate already belongs to another active customer.");
        }
        setVehiclesByCustomer((prev) => ({
          ...prev,
          [ownerId]: (prev[ownerId] ?? []).filter(
            (item) => normalizePlate(item.plate) !== normalizedPlate,
          ),
        }));
        setVehicleOwnershipHistory((prev) => [
          {
            id: crypto.randomUUID(),
            vehicleId: ownerVehicle?.id ?? id,
            plate: normalizedPlate,
            previousCustomerId: ownerId,
            newCustomerId: currentCustomerId,
            previousCustomerName: owner?.name ?? "Unknown",
            newCustomerName: currentCustomer?.name ?? "Unknown",
            transferredAt: new Date().toISOString(),
            note: "Vehicle ownership transferred during plate reassignment from an inactive owner.",
          },
          ...prev,
        ]);
      }
      const previousVehicle = (vehiclesByCustomer[currentCustomerId] ?? []).find(
        (item) => item.id === id,
      );
      setVehiclesByCustomer((prev) => ({
        ...prev,
        [currentCustomerId]: (prev[currentCustomerId] ?? []).map((item) =>
          item.id === id ? { ...vehicle, plate: normalizedPlate, id } : item,
        ),
      }));
      if (previousVehicle && normalizePlate(previousVehicle.plate) !== normalizedPlate) {
        setVehicleOwnershipHistory((prev) => [
          {
            id: crypto.randomUUID(),
            vehicleId: id,
            plate: normalizedPlate,
            previousCustomerId: currentCustomerId,
            newCustomerId: currentCustomerId,
            previousCustomerName: currentCustomer?.name ?? "Unknown",
            newCustomerName: currentCustomer?.name ?? "Unknown",
            transferredAt: new Date().toISOString(),
            note: `Vehicle plate updated from ${normalizePlate(previousVehicle.plate)} to ${normalizedPlate}.`,
          },
          ...prev,
        ]);
      }
    },
    [currentCustomerId, customers, vehiclesByCustomer],
  );

  const deleteVehicle = React.useCallback(
    (id: string) => {
      const currentVehicles = vehiclesByCustomer[currentCustomerId] ?? [];
      if (currentVehicles.length <= 1)
        return { ok: false, error: "Customer must keep at least one vehicle." };
      setVehiclesByCustomer((prev) => ({
        ...prev,
        [currentCustomerId]: currentVehicles.filter((vehicle) => vehicle.id !== id),
      }));
      return { ok: true };
    },
    [currentCustomerId, vehiclesByCustomer],
  );

  const createBookingFromLegacy = React.useCallback(
    (input: Omit<Booking, "id" | "customerId" | "createdAt" | "timeSlot">) => {
      const customer = customers.find((item) => item.id === currentCustomerId);
      if (!customer) throw new Error("No active customer selected.");
      if (customer.status === "Blocked") {
        throw new Error("Blocked customers cannot create bookings.");
      }
      if (
        customer.bookingSuspendedUntil &&
        new Date(customer.bookingSuspendedUntil) >= new Date()
      ) {
        throw new Error(
          `Booking is suspended until ${new Date(customer.bookingSuspendedUntil).toLocaleDateString()}.`,
        );
      }
      ensureVietnamesePlate(input.vehiclePlate);
      const tier = tiers.find((item) => item.name === customer.tier);
      const timeSlot = input.scheduledAt.split(" ").slice(-2).join(" ");
      const date = new Date(`${input.dateISO}T00:00:00`);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const diffDays = Math.floor((date.getTime() - today.getTime()) / 86400000);
      if (!input.isWalkIn) {
        if (diffDays < 0) throw new Error("Cannot book in the past.");
        if (diffDays > (tier?.bookingWindowDays ?? 7)) {
          throw new Error(
            `Booking exceeds ${tier?.bookingWindowDays ?? 7}-day window for ${customer.tier}.`,
          );
        }
        const activeBookings = bookings.filter(
          (booking) => booking.customerId === currentCustomerId && isActiveBooking(booking.status),
        );
        if (activeBookings.length >= 3) {
          throw new Error("Maximum 3 active bookings per customer.");
        }
      }
      const duplicateBooking = bookings.some(
        (booking) =>
          booking.vehiclePlate === input.vehiclePlate &&
          booking.dateISO === input.dateISO &&
          booking.timeSlot === timeSlot &&
          isActiveBooking(booking.status),
      );
      if (duplicateBooking) {
        throw new Error("Duplicate booking time for the same vehicle is not allowed.");
      }
      const slotLoad = bookings.filter(
        (booking) =>
          booking.dateISO === input.dateISO &&
          booking.timeSlot === timeSlot &&
          isActiveBooking(booking.status),
      ).length;
      const platinumAlreadyBooked = bookings.some(
        (booking) =>
          booking.dateISO === input.dateISO &&
          booking.timeSlot === timeSlot &&
          isActiveBooking(booking.status) &&
          customers.find((item) => item.id === booking.customerId)?.tier === "Platinum",
      );
      if (
        !input.isWalkIn &&
        customer.tier !== "Platinum" &&
        slotLoad >= SHOP_CAPACITY - 1 &&
        !platinumAlreadyBooked
      ) {
        throw new Error(
          "The last available bay in this slot is reserved for Platinum priority bookings.",
        );
      }
      if (!input.isWalkIn && slotLoad >= SHOP_CAPACITY) {
        throw new Error("Selected slot has reached shop capacity.");
      }
      const booking = {
        ...input,
        id: `B${String(nextBookingIdRef.current++).padStart(3, "0")}`,
        customerId: currentCustomerId,
        customerName: customer.name,
        customerPhone: customer.phone,
        createdAt: new Date().toISOString(),
        timeSlot,
      };
      setBookings((prev) => [booking, ...prev]);
      setSelectedBookingId(booking.id);
      pushNotification({
        type: "Booking",
        title: "Booking Confirmed",
        message: `${booking.id} for ${booking.vehiclePlate} is confirmed.`,
      });
      return booking.id;
    },
    [bookings, currentCustomerId, customers, isActiveBooking, pushNotification, tiers],
  );

  const updateBookingStatus = React.useCallback(
    (id: string, status: BookingStatus) => {
      const target = bookings.find((booking) => booking.id === id);
      if (!target) throw new Error("Booking not found.");
      if (target.status === "Completed") {
        throw new Error("Completed booking cannot be modified.");
      }
      if (status === "Checked-in" && target.status === "Cancelled") {
        throw new Error("Cancelled booking cannot check in.");
      }
      if (status === "Cancelled") {
        if (!(target.status === "Pending" || target.status === "Confirmed")) {
          throw new Error("Only pending or confirmed bookings can be cancelled.");
        }
        const bookingTime = new Date(`${target.dateISO} ${target.timeSlot}`);
        const diffHours = (bookingTime.getTime() - Date.now()) / 3600000;
        if (diffHours < 2) {
          throw new Error("Cancellation is only allowed at least 2 hours before booking.");
        }
      }
      setBookings((prev) =>
        prev.map((booking) => (booking.id === id ? { ...booking, status } : booking)),
      );
    },
    [bookings],
  );

  const prepareSessionForBooking = React.useCallback(
    (bookingId: string) => {
      const booking = bookings.find((item) => item.id === bookingId);
      const customer = customers.find((item) => item.id === booking?.customerId);
      if (!booking || !customer) {
        throw new Error("Invalid booking or customer details.");
      }
      const staff = resolveFreeStaff();
      if (!booking.isWalkIn) {
        const lateMinutes = (Date.now() - parseBookingDate(booking).getTime()) / 60000;
        if (lateMinutes > 15) {
          setBookings((prev) =>
            prev.map((item) => (item.id === bookingId ? { ...item, status: "No-show" } : item)),
          );
          const noShowsInWindow =
            bookings.filter((item) => {
              if (item.customerId !== booking.customerId || item.status !== "No-show") return false;
              const ageDays = (Date.now() - parseBookingDate(item).getTime()) / 86400000;
              return ageDays <= 30;
            }).length + 1;
          if (noShowsInWindow >= 2) {
            const suspendedUntil = addDays(nowLocalDateISO(), 14);
            setCustomers((prev) =>
              prev.map((item) =>
                item.id === customer.id ? { ...item, bookingSuspendedUntil: suspendedUntil } : item,
              ),
            );
          }
          throw new Error("Customer arrived more than 15 minutes late. Booking marked as No-show.");
        }
      }
      const checkedInAt = booking.checkInAt ?? new Date().toISOString();
      setBookings((prev) =>
        prev.map((item) =>
          item.id === bookingId
            ? { ...item, status: "Checked-in", checkInAt: checkedInAt, washStatus: "In Progress" }
            : item,
        ),
      );
      const selectedServices = services.filter((service) =>
        booking.services.includes(service.name),
      );
      const sessionId = crypto.randomUUID();
      setWashSessions((prev) => [
        {
          id: sessionId,
          bookingId,
          customerId: customer.id,
          customerName: customer.name,
          staffId: staff.id,
          staffName: staff.name,
          vehicleType: booking.vehicleType,
          plate: booking.vehiclePlate,
          services: selectedServices,
          subtotal: subtotalForServices(selectedServices),
          status: "In Progress",
          startedAt: checkedInAt,
          walkIn: booking.isWalkIn,
        },
        ...prev.filter((session) => session.bookingId !== bookingId),
      ]);
      setSelectedBookingId(bookingId);
      setSessionDraft({
        sessionId,
        bookingId,
        staffId: staff.id,
        staffName: staff.name,
        customerId: customer.id,
        customerName: customer.name,
        customerTier: customer.tier,
        customerPoints: customer.points,
        vehicleType: booking.vehicleType,
        plate: booking.vehiclePlate,
        services: selectedServices,
        walkIn: booking.isWalkIn,
      });
      return staff.name;
    },
    [bookings, customers, resolveFreeStaff, services],
  );

  const createWalkInBooking = React.useCallback(
    ({
      plate,
      vehicleType,
      serviceIds,
    }: {
      plate: string;
      vehicleType: VehicleType;
      serviceIds: string[];
    }) => {
      const staff = resolveFreeStaff();
      const selectedServices = services.filter((service) => serviceIds.includes(service.id));
      const totalPrice = selectedServices.reduce((sum, service) => sum + service.price, 0);
      const dateISO = localDateISO(new Date());
      const timeSlot = new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
      const id = createBookingFromLegacy({
        vehiclePlate: plate.toUpperCase(),
        vehicleName: "Walk-in Vehicle",
        vehicleType,
        services: selectedServices.map((service) => service.name),
        totalPrice,
        scheduledAt: `Today ${timeSlot}`,
        dateISO,
        status: "Checked-in",
        isWalkIn: true,
      });
      const customer = customers.find((item) => item.id === currentCustomerId)!;
      const checkedInAt = new Date().toISOString();
      const sessionId = crypto.randomUUID();
      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === id
            ? { ...booking, checkInAt: checkedInAt, washStatus: "In Progress" }
            : booking,
        ),
      );
      setWashSessions((prev) => [
        {
          id: sessionId,
          bookingId: id,
          customerId: customer.id,
          customerName: customer.name,
          staffId: staff.id,
          staffName: staff.name,
          vehicleType,
          plate: plate.toUpperCase(),
          services: selectedServices,
          subtotal: totalPrice,
          status: "In Progress",
          startedAt: checkedInAt,
          walkIn: true,
        },
        ...prev.filter((session) => session.bookingId !== id),
      ]);
      setSessionDraft({
        sessionId,
        bookingId: id,
        staffId: staff.id,
        staffName: staff.name,
        customerId: customer.id,
        customerName: customer.name,
        customerTier: customer.tier,
        customerPoints: customer.points,
        vehicleType,
        plate: plate.toUpperCase(),
        services: selectedServices,
        walkIn: true,
      });
      return { id, staffName: staff.name };
    },
    [createBookingFromLegacy, currentCustomerId, customers, resolveFreeStaff, services],
  );

  const updateCustomerPoints = React.useCallback(
    (customerId: string, nextPoints: number, reason = "Manual adjustment") => {
      const target = customers.find((customer) => customer.id === customerId);
      if (!target) return;
      const resolved = Math.max(0, nextPoints);
      setCustomers((prev) =>
        prev.map((customer) =>
          customer.id === customerId ? { ...customer, points: resolved } : customer,
        ),
      );
      setLedger((prev) => [
        {
          id: crypto.randomUUID(),
          customerId,
          date: localDateISO(new Date()),
          type: "Adjusted",
          delta: resolved - target.points,
          description: reason,
        },
        ...prev,
      ]);
    },
    [customers],
  );

  const assignStaffToSession = React.useCallback(
    (sessionId: string, staffId: string) => {
      const session = washSessions.find((item) => item.id === sessionId);
      if (!session) {
        throw new Error("Wash session record is missing.");
      }
      if (session.status === "Completed") {
        throw new Error("Completed wash session cannot be reassigned.");
      }
      const staff = staffMembers.find((item) => item.id === staffId && item.status === "Active");
      if (!staff) {
        throw new Error("Only active staff can be assigned.");
      }
      const isAlreadyAssigned = session.staffId === staffId;
      const hasOtherActiveSession = washSessions.some(
        (item) => item.id !== sessionId && item.staffId === staffId && item.status !== "Completed",
      );
      if (!isAlreadyAssigned && hasOtherActiveSession) {
        throw new Error("Busy employees cannot be assigned to another vehicle.");
      }

      setWashSessions((prev) =>
        prev.map((item) =>
          item.id === sessionId ? { ...item, staffId: staff.id, staffName: staff.name } : item,
        ),
      );
      setSessionDraft((prev) =>
        prev && prev.sessionId === sessionId
          ? { ...prev, staffId: staff.id, staffName: staff.name }
          : prev,
      );
    },
    [staffMembers, washSessions],
  );

  const completeCheckout = React.useCallback(
    ({
      promoCode,
      pointsRedeemed,
      paymentMethod,
    }: {
      promoCode?: string | null;
      pointsRedeemed: number;
      paymentMethod: string;
    }) => {
      if (!sessionDraft) return null;
      const staff = staffMembers.find(
        (item) => item.id === sessionDraft.staffId && item.status === "Active",
      );
      if (!staff) {
        throw new Error("Assigned wash staff is no longer active.");
      }
      const sessionRecord = washSessions.find((session) => session.id === sessionDraft.sessionId);
      if (!sessionRecord) {
        throw new Error("Wash session record is missing for this checkout.");
      }
      if (sessionRecord.status === "Completed") {
        throw new Error("Completed wash session cannot be checked out again.");
      }
      const customer = customers.find((item) => item.id === sessionDraft.customerId);
      const tierRule = customer ? tiers.find((tier) => tier.name === customer.tier) : undefined;
      const subtotal = sessionDraft.services.reduce((sum, service) => sum + service.price, 0);
      const promo = promotions.find(
        (item) =>
          promoCode &&
          item.code === promoCode &&
          item.active &&
          item.startDate <= nowLocalDateISO() &&
          item.endDate >= nowLocalDateISO() &&
          (!customer || item.tiers.includes(customer.tier)),
      );
      const { effectiveTierDiscount, promoDiscount, afterPromo } = calculateCheckoutPricing({
        subtotal,
        tierDiscountPercent: customer && tierRule ? tierRule.discountPercent : 0,
        promo,
      });
      const requestedPoints = Number.isFinite(pointsRedeemed)
        ? Math.max(0, Math.trunc(pointsRedeemed))
        : 0;
      const safePoints = customer
        ? Math.min(requestedPoints, customer.points, Math.floor(afterPromo / 1000))
        : 0;
      if (requestedPoints > 0 && safePoints <= 0) {
        throw new Error("Point redemption must use more than 0 eligible loyalty points.");
      }
      const pointsValue = safePoints * 1000;
      const finalAmount = Math.max(0, afterPromo - pointsValue);
      const multiplier = tierRule?.multiplier ?? 1;
      const pointsEarned = Math.floor(Math.floor(finalAmount / 10000) * multiplier);
      const tx: Transaction = {
        id: `TX-${Date.now().toString().slice(-6)}`,
        bookingId: sessionDraft.bookingId,
        date: new Date().toISOString(),
        customer: {
          id: customer?.id ?? "guest",
          name: customer?.name ?? sessionDraft.customerName,
          tier: customer?.tier ?? "Guest",
          discountPct: tierRule?.discountPercent ?? 0,
          points: customer?.points ?? 0,
        },
        vehicleType: sessionDraft.vehicleType,
        plate: sessionDraft.plate,
        services: sessionDraft.services,
        subtotal,
        tierDiscount: effectiveTierDiscount,
        promoDiscount,
        promoCode: promo?.code,
        pointsRedeemed: safePoints,
        pointsValue,
        finalAmount,
        pointsEarned,
        paymentMethod,
      };
      setTransactions((prev) => [tx, ...prev]);
      setLastTransaction(tx);
      if (sessionDraft.bookingId) {
        setBookings((prev) =>
          prev.map((booking) =>
            booking.id === sessionDraft.bookingId
              ? {
                  ...booking,
                  status: "Completed",
                  washStatus: "Completed",
                  completedAt: tx.date,
                  checkoutTransactionId: tx.id,
                  checkoutAmount: tx.finalAmount,
                  checkoutPaymentMethod: tx.paymentMethod,
                  checkoutPointsEarned: tx.pointsEarned,
                  checkoutPointsRedeemed: tx.pointsRedeemed,
                  checkoutPromoCode: tx.promoCode,
                }
              : booking,
          ),
        );
      }
      setWashSessions((prev) =>
        prev.map((session) =>
          session.id === sessionDraft.sessionId
            ? {
                ...session,
                services: sessionDraft.services,
                subtotal,
                status: "Completed",
                completedAt: tx.date,
                checkoutTransactionId: tx.id,
              }
            : session,
        ),
      );
      if (customer) {
        setCustomers((prev) =>
          prev.map((item) =>
            item.id === customer.id
              ? { ...item, points: customer.points - safePoints + pointsEarned }
              : item,
          ),
        );
        setLedger((prev) => [
          {
            id: crypto.randomUUID(),
            customerId: customer.id,
            date: localDateISO(new Date()),
            type: "Earned",
            delta: pointsEarned,
            description: `Completed session ${tx.id}`,
            expiresAt: addDays(localDateISO(new Date()), 365),
          },
          ...(safePoints > 0
            ? [
                {
                  id: crypto.randomUUID(),
                  customerId: customer.id,
                  date: localDateISO(new Date()),
                  type: "Spent" as const,
                  delta: -safePoints,
                  description: `Redeemed ${safePoints} points at checkout`,
                },
              ]
            : []),
          ...prev,
        ]);
      }
      pushNotification({
        type: "Loyalty",
        title: "Checkout Completed",
        message: `${tx.id} completed and ${pointsEarned} points were credited.`,
      });
      setSessionDraft(null);
      return tx;
    },
    [
      customers,
      promotions,
      pushNotification,
      resolveActiveStaff,
      sessionDraft,
      tiers,
      washSessions,
    ],
  );

  const redeemReward = React.useCallback(
    (customerId: string, reward: Reward) => {
      if (reward.cost <= 0) return false;
      const customer = customers.find((item) => item.id === customerId);
      if (!customer || customer.points < reward.cost || customer.status === "Blocked") return false;
      setCustomers((prev) =>
        prev.map((item) =>
          item.id === customerId ? { ...item, points: item.points - reward.cost } : item,
        ),
      );
      setLedger((prev) => [
        {
          id: crypto.randomUUID(),
          customerId,
          date: localDateISO(new Date()),
          type: "Spent",
          delta: -reward.cost,
          description: `Redeemed ${reward.name}`,
        },
        ...prev,
      ]);
      return true;
    },
    [customers],
  );

  const runMonthlyTierReview = React.useCallback(() => {
    const today = new Date();
    if (today < new Date(nextTierReviewDate)) return;
    const activeRules = pendingTierRules ?? tiers;
    if (pendingTierRules) {
      setTiers(activeRules);
      setPendingTierRules(null);
    }
    const historyEntries: TierHistoryEntry[] = [];
    setCustomers((prev) =>
      prev.map((customer) => {
        const rollingPoints = getRolling12MonthPoints(ledger, customer.id, today);
        const nextTier = tierFor(rollingPoints, activeRules);
        if (nextTier === customer.tier) return customer;
        historyEntries.push({
          id: crypto.randomUUID(),
          date: today.toISOString(),
          customerName: customer.name,
          previousTier: customer.tier,
          newTier: nextTier,
          trigger:
            tierRank(nextTier) > tierRank(customer.tier)
              ? "System Auto-Upgrade"
              : "System Auto-Downgrade",
          authorizedBy: "system",
        });
        return { ...customer, tier: nextTier };
      }),
    );
    if (historyEntries.length > 0) {
      setTierHistory((history) => [...historyEntries, ...history]);
    }
    setNextTierReviewDate(nextMonthStart(today));
  }, [ledger, nextTierReviewDate, pendingTierRules, tiers]);

  React.useEffect(() => {
    runMonthlyTierReview();
  }, [runMonthlyTierReview]);

  React.useEffect(() => {
    if (!hydrated) return;
    const expirationEvents = new Set(eventKeys);
    let didMutate = false;
    const expiredAdjustments: LedgerEntry[] = [];

    customers.forEach((customer) => {
      const snapshot = getPointSnapshotForCustomer(ledger, customer.id);
      if (snapshot.expiringIn30Days > 0) {
        const key = `expiry30:${customer.id}:${snapshot.nextExpiryDate}`;
        if (!expirationEvents.has(key)) {
          pushNotification({
            type: "Loyalty",
            title: "Points Expiry Warning",
            message: `${snapshot.expiringIn30Days} points for ${customer.name} will expire within 30 days.`,
          });
          expirationEvents.add(key);
          didMutate = true;
        }
      }
      if (snapshot.expiringIn7Days > 0) {
        const key = `expiry7:${customer.id}:${snapshot.nextExpiryDate}`;
        if (!expirationEvents.has(key)) {
          pushNotification({
            type: "Loyalty",
            title: "Points Expiry Warning",
            message: `${snapshot.expiringIn7Days} points for ${customer.name} will expire within 7 days.`,
          });
          expirationEvents.add(key);
          didMutate = true;
        }
      }
      if (snapshot.expiredPendingSweep > 0) {
        const key = `expired:${customer.id}:${nowLocalDateISO()}`;
        if (!expirationEvents.has(key)) {
          expiredAdjustments.push({
            id: crypto.randomUUID(),
            customerId: customer.id,
            date: nowLocalDateISO(),
            type: "Adjusted",
            delta: -snapshot.expiredPendingSweep,
            description: `Expired ${snapshot.expiredPendingSweep} loyalty points after 12 months.`,
          });
          expirationEvents.add(key);
          didMutate = true;
        }
      }
    });

    if (expiredAdjustments.length > 0) {
      setLedger((prev) => [...expiredAdjustments, ...prev]);
      setCustomers((prev) =>
        prev.map((customer) => {
          const adjustment = expiredAdjustments.find((entry) => entry.customerId === customer.id);
          return adjustment
            ? { ...customer, points: Math.max(0, customer.points + adjustment.delta) }
            : customer;
        }),
      );
    }
    if (didMutate) {
      setEventKeys(Array.from(expirationEvents));
    }

    const upcomingReminderKeys: string[] = [];
    bookings.forEach((booking) => {
      if (booking.status !== "Confirmed") return;
      const diffMs = parseBookingDate(booking).getTime() - Date.now();
      if (diffMs > 0 && diffMs <= 3600000) {
        const key = `reminder:${booking.id}:${booking.dateISO}:${booking.timeSlot}`;
        upcomingReminderKeys.push(key);
        if (!eventKeys.includes(key)) {
          pushNotification({
            type: "Reminder",
            title: "1-Hour Reminder",
            message: `${booking.id} for ${booking.vehiclePlate} starts within 1 hour.`,
          });
        }
      }
    });
    if (upcomingReminderKeys.length > 0) {
      setEventKeys((prev) => [...new Set([...prev, ...upcomingReminderKeys])]);
    }
  }, [bookings, eventKeys, hydrated, pushNotification]);

  React.useEffect(() => {
    if (typeof window === "undefined" || !hydrated) return;
    const payload: PersistedStore = {
      role,
      isAuthenticated,
      tiers,
      promotions,
      currentCustomerId,
      customers,
      staffMembers,
      currentStaffId,
      vehiclesByCustomer,
      bookings,
      washSessions,
      selectedBookingId,
      sessionDraft,
      transactions,
      lastTransaction,
      ledger,
      tierHistory,
      notifications: notifications.map((notification) => ({
        ...notification,
        timestamp: notification.timestamp.toISOString(),
      })),
      adjustments: adjustments.map((adjustment) => ({
        ...adjustment,
        timestamp: adjustment.timestamp.toISOString(),
      })),
      pendingRegistration,
      pendingPhoneChange,
      pendingTierRules,
      nextTierReviewDate,
      eventKeys,
      vehicleOwnershipHistory,
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [
    adjustments,
    bookings,
    washSessions,
    currentCustomerId,
    currentStaffId,
    customers,
    staffMembers,
    lastTransaction,
    ledger,
    notifications,
    pendingRegistration,
    pendingPhoneChange,
    pendingTierRules,
    nextTierReviewDate,
    eventKeys,
    vehicleOwnershipHistory,
    role,
    isAuthenticated,
    selectedBookingId,
    sessionDraft,
    tierHistory,
    tiers,
    transactions,
    vehiclesByCustomer,
    washSessions,
    promotions,
    hydrated,
  ]);

  const staffAvailability = React.useMemo(
    () => getStaffAvailability(staffMembers, washSessions),
    [staffMembers, washSessions],
  );

  const value: Store = {
    role,
    isAuthenticated,
    hydrated,
    setRole,
    loginAs,
    logout,
    tiers,
    services,
    promotions,
    rewards,
    currentCustomerId,
    customers,
    staffMembers,
    currentStaffId,
    vehiclesByCustomer,
    bookings,
    washSessions,
    staffAvailability,
    selectedBookingId,
    sessionDraft,
    transactions,
    lastTransaction,
    ledger,
    tierHistory,
    notifications,
    adjustments,
    pendingRegistration,
    pendingPhoneChange,
    pendingTierRules,
    nextTierReviewDate,
    vehicleOwnershipHistory,
    setPendingRegistration,
    requestRegistrationOtp,
    resendRegistrationOtp,
    completeRegistration,
    requestPhoneChange,
    resendPhoneChangeOtp,
    confirmPhoneChange,
    updateCurrentProfile,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    setCurrentCustomerId,
    createBookingFromLegacy,
    updateBookingStatus,
    setSelectedBookingId,
    createWalkInBooking,
    assignStaffToSession,
    createOrUpdateSessionDraft: (draft) => {
      if (!draft) {
        setSessionDraft(null);
        return;
      }
      const staff = resolveActiveStaff();
      const activeSession =
        washSessions.find((session) => session.id === draft.sessionId) ??
        (draft.bookingId
          ? washSessions.find((session) => session.bookingId === draft.bookingId)
          : undefined);
      const assignedStaffId = activeSession?.staffId || staff.id;
      const assignedStaffName = activeSession?.staffName || staff.name;
      if (!activeSession) {
        throw new Error("Wash session record must exist before editing checkout details.");
      }
      if (activeSession.status === "Completed") {
        throw new Error("Completed wash session cannot be modified.");
      }
      const resolvedBookingId = draft.bookingId ?? sessionDraft?.bookingId;
      if (resolvedBookingId) {
        setBookings((prev) =>
          prev.map((booking) =>
            booking.id === resolvedBookingId
              ? { ...booking, washStatus: "Ready for Checkout" }
              : booking,
          ),
        );
      }
      setSessionDraft({
        ...draft,
        sessionId: activeSession.id,
        staffId: draft.staffId || sessionDraft?.staffId || assignedStaffId,
        staffName: draft.staffName || sessionDraft?.staffName || assignedStaffName,
        bookingId: resolvedBookingId,
        walkIn: draft.walkIn ?? sessionDraft?.walkIn,
      });
      setWashSessions((prev) =>
        prev.map((session) =>
          session.id === activeSession.id
            ? {
                ...session,
                staffId: assignedStaffId,
                staffName: assignedStaffName,
                customerId: draft.customerId,
                customerName: draft.customerName,
                vehicleType: draft.vehicleType,
                plate: draft.plate,
                services: draft.services,
                subtotal: subtotalForServices(draft.services),
                status: "Ready for Checkout",
                readyForCheckoutAt: new Date().toISOString(),
                walkIn: draft.walkIn ?? session.walkIn,
              }
            : session,
        ),
      );
    },
    prepareSessionForBooking,
    completeCheckout,
    updateCustomerPoints,
    redeemReward,
    updateTiers: (next) => setPendingTierRules(next),
    addPromotion: (promotion) => {
      if (promotion.startDate > promotion.endDate) {
        throw new Error("Promotion start date cannot be after end date.");
      }
      setPromotions((prev) => [{ ...promotion, id: crypto.randomUUID() }, ...prev]);
    },
    togglePromotion: (id) =>
      setPromotions((prev) =>
        prev.map((promotion) =>
          promotion.id === id ? { ...promotion, active: !promotion.active } : promotion,
        ),
      ),
    pushNotification,
    addAdjustment: (adjustment) => {
      const target = customers.find((customer) => customer.id === adjustment.customerId);
      if (!target) {
        throw new Error("Target customer not found.");
      }
      const previousBalance = target.points;
      const nextBalance = Math.max(0, previousBalance + adjustment.delta);
      const appliedDelta = nextBalance - previousBalance;
      setCustomers((prev) =>
        prev.map((customer) =>
          customer.id === target.id ? { ...customer, points: nextBalance } : customer,
        ),
      );
      setAdjustments((prev) => [
        {
          id: crypto.randomUUID(),
          timestamp: new Date(),
          executive: adjustment.executive,
          customerId: target.id,
          customerName: target.name,
          delta: appliedDelta,
          previousBalance,
          nextBalance,
          reason: adjustment.reason,
        },
        ...prev,
      ]);
      setLedger((prev) => [
        {
          id: crypto.randomUUID(),
          customerId: target.id,
          date: localDateISO(new Date()),
          type: "Adjusted",
          delta: appliedDelta,
          description: `Admin adjustment by ${adjustment.executive}: ${adjustment.reason}`,
        },
        ...prev,
      ]);
    },
    runMonthlyTierReview,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCarwashStore() {
  const ctx = React.useContext(Ctx);
  if (!ctx) throw new Error("useCarwashStore must be used inside CarwashStoreProvider");
  return ctx;
}
