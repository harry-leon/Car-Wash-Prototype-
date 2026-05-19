import * as React from "react";

export type Role = "Customer" | "Staff" | "Admin";
export type CustomerStatus = "Active" | "Inactive" | "Blocked";
export type VehicleType = "Sedan" | "SUV" | "Truck" | "Motorbike";
export type Tier = "Member" | "Silver" | "Gold" | "Platinum";
export type BookingStatus =
  | "Pending"
  | "Confirmed"
  | "Checked-in"
  | "Completed"
  | "Cancelled"
  | "No-show";
export type WashStatus = "Queued" | "Ready for Checkout" | "Completed";
export type NotificationType = "Booking" | "Reminder" | "Loyalty" | "Promotion";
export type RewardType = "discount" | "free wash" | "add-on";

export interface Vehicle {
  id: string;
  brandModel: string;
  plate: string;
  type: VehicleType;
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
  bookingId?: string;
  customerId: string;
  customerName: string;
  customerTier: Tier | "Guest";
  customerPoints: number;
  vehicleType: VehicleType;
  plate: string;
  services: Service[];
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
}

export interface TierHistoryEntry {
  id: string;
  date: string;
  customerName: string;
  previousTier: Tier;
  newTier: Tier;
  trigger:
    | "Monthly Review"
    | "System Auto-Upgrade"
    | "System Auto-Downgrade"
    | "Admin Override";
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
  customer: string;
  delta: number;
  reason: string;
}

interface PendingRegistration {
  name: string;
  phone: string;
  countryCode: string;
  vehicle: Omit<Vehicle, "id">;
}

interface PersistedStore {
  role: Role;
  tiers: TierRule[];
  promotions: Promotion[];
  currentCustomerId: string;
  customers: CustomerRecord[];
  vehiclesByCustomer: Record<string, Vehicle[]>;
  bookings: Booking[];
  selectedBookingId: string | null;
  sessionDraft: SessionDraft | null;
  transactions: Transaction[];
  lastTransaction: Transaction | null;
  ledger: LedgerEntry[];
  tierHistory: TierHistoryEntry[];
  notifications: Array<Omit<NotificationItem, "timestamp"> & { timestamp: string }>;
  adjustments: Array<Omit<Adjustment, "timestamp"> & { timestamp: string }>;
  pendingRegistration: PendingRegistration | null;
}

interface Store {
  role: Role;
  setRole: (role: Role) => void;
  tiers: TierRule[];
  services: Service[];
  promotions: Promotion[];
  rewards: Reward[];
  currentCustomerId: string;
  customers: CustomerRecord[];
  vehiclesByCustomer: Record<string, Vehicle[]>;
  bookings: Booking[];
  selectedBookingId: string | null;
  sessionDraft: SessionDraft | null;
  transactions: Transaction[];
  lastTransaction: Transaction | null;
  ledger: LedgerEntry[];
  tierHistory: TierHistoryEntry[];
  notifications: NotificationItem[];
  adjustments: Adjustment[];
  pendingRegistration: PendingRegistration | null;
  setPendingRegistration: (value: PendingRegistration | null) => void;
  completeRegistration: () => void;
  updateCurrentProfile: (patch: Partial<Pick<CustomerRecord, "name" | "phone" | "countryCode">>) => void;
  addVehicle: (vehicle: Omit<Vehicle, "id">) => void;
  updateVehicle: (id: string, vehicle: Omit<Vehicle, "id">) => void;
  deleteVehicle: (id: string) => { ok: boolean; error?: string };
  setCurrentCustomerId: (id: string) => void;
  createBookingFromLegacy: (input: Omit<Booking, "id" | "customerId" | "createdAt" | "timeSlot">) => string;
  updateBookingStatus: (id: string, status: BookingStatus) => void;
  setSelectedBookingId: (id: string | null) => void;
  createWalkInBooking: (input: { plate: string; vehicleType: VehicleType; serviceIds: string[] }) => string;
  createOrUpdateSessionDraft: (draft: SessionDraft | null) => void;
  prepareSessionForBooking: (bookingId: string) => void;
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
  addAdjustment: (adjustment: Omit<Adjustment, "id" | "timestamp">) => void;
}

const tierSeed: TierRule[] = [
  { name: "Member", minPoints: 0, bookingWindowDays: 7, discountPercent: 0, multiplier: 1, perks: "Standard booking and loyalty earning." },
  { name: "Silver", minPoints: 500, bookingWindowDays: 10, discountPercent: 5, multiplier: 1.5, perks: "Priority booking window and 5% wash discount." },
  { name: "Gold", minPoints: 1500, bookingWindowDays: 12, discountPercent: 10, multiplier: 2, perks: "Premium promotion eligibility and double points." },
  { name: "Platinum", minPoints: 4000, bookingWindowDays: 14, discountPercent: 15, multiplier: 3, perks: "Highest booking priority and VIP campaigns." },
];

const serviceSeed: Service[] = [
  { id: "basic", name: "Basic Wash", price: 120000, icon: "Droplets" },
  { id: "premium", name: "Premium Detail", price: 280000, icon: "Sparkles" },
  { id: "vacuum", name: "Interior Vacuum", price: 60000, icon: "Wind" },
  { id: "ceramic", name: "Ceramic Coating", price: 450000, icon: "Shield" },
];

const promotionSeed: Promotion[] = [
  { id: "p1", code: "WELCOME50K", discountType: "Flat", amount: 50000, tiers: ["Member", "Silver", "Gold", "Platinum"], active: true, startDate: "2026-05-01", endDate: "2026-12-31", stackable: false },
  { id: "p2", code: "SILVER10", discountType: "Percentage", amount: 10, tiers: ["Silver", "Gold", "Platinum"], active: true, startDate: "2026-05-01", endDate: "2026-08-31", stackable: false },
  { id: "p3", code: "PLATINUM15", discountType: "Percentage", amount: 15, tiers: ["Platinum"], active: true, startDate: "2026-05-01", endDate: "2026-08-31", stackable: false },
];

const rewardSeed: Reward[] = [
  { id: "r1", name: "Free Interior Scent", cost: 80, icon: "Wind", type: "add-on" },
  { id: "r2", name: "Free Tire Shine", cost: 150, icon: "CircleDot", type: "add-on" },
  { id: "r3", name: "50K Wash Voucher", cost: 300, icon: "Ticket", type: "discount" },
];

const customerSeed: CustomerRecord[] = [
  { id: "c1", name: "Tran Minh Anh", email: "minhanh@autowash.vn", phone: "0901234567", countryCode: "+84", tier: "Silver", points: 860, status: "Active" },
  { id: "c2", name: "Le Gia Huy", email: "giahuy@autowash.vn", phone: "0912345678", countryCode: "+84", tier: "Gold", points: 1820, status: "Active" },
  { id: "c3", name: "Pham Thu Trang", email: "thutrang@autowash.vn", phone: "0987654321", countryCode: "+84", tier: "Platinum", points: 4520, status: "Active" },
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
  { id: "l1", customerId: "c1", date: "2026-05-12", type: "Earned", delta: 120, description: "Premium Detail completed" },
  { id: "l2", customerId: "c1", date: "2026-05-08", type: "Spent", delta: -80, description: "Redeemed Free Interior Scent" },
];

const tierHistorySeed: TierHistoryEntry[] = [
  { id: "th1", date: "2026-05-01 09:00", customerName: "Tran Minh Anh", previousTier: "Member", newTier: "Silver", trigger: "Monthly Review", authorizedBy: "system" },
  { id: "th2", date: "2026-04-01 09:00", customerName: "Le Gia Huy", previousTier: "Silver", newTier: "Gold", trigger: "Monthly Review", authorizedBy: "system" },
];

const notificationsSeed: NotificationItem[] = [
  { id: "n1", type: "Booking", title: "Booking Confirmed", message: "Booking B001 has been confirmed for 09:00 AM tomorrow.", timestamp: new Date(Date.now() - 10 * 60 * 1000) },
  { id: "n2", type: "Reminder", title: "1-Hour Reminder", message: "Vehicle 51G-123.45 is scheduled in 1 hour.", timestamp: new Date(Date.now() - 65 * 60 * 1000) },
];

const adjustmentSeed: Adjustment[] = [
  { id: "a1", timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), executive: "Operations Manager", customer: "Tran Minh Anh", delta: 50, reason: "Service recovery goodwill after delayed checkout." },
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

const STORAGE_KEY = "carwash-prototype-state-v3";

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
  return [...tiers].sort((a, b) => b.minPoints - a.minPoints).find((tier) => points >= tier.minPoints)?.name ?? "Member";
}

export function CarwashStoreProvider({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = React.useState(false);
  const [role, setRole] = React.useState<Role>("Customer");
  const [tiers, setTiers] = React.useState<TierRule[]>(tierSeed);
  const [services] = React.useState<Service[]>(serviceSeed);
  const [promotions, setPromotions] = React.useState<Promotion[]>(promotionSeed);
  const [rewards] = React.useState<Reward[]>(rewardSeed);
  const [currentCustomerId, setCurrentCustomerId] = React.useState("c1");
  const [customers, setCustomers] = React.useState<CustomerRecord[]>(customerSeed);
  const [vehiclesByCustomer, setVehiclesByCustomer] = React.useState<Record<string, Vehicle[]>>(vehicleSeed);
  const [bookings, setBookings] = React.useState<Booking[]>(bookingSeed);
  const [selectedBookingId, setSelectedBookingId] = React.useState<string | null>("B001");
  const [sessionDraft, setSessionDraft] = React.useState<SessionDraft | null>(null);
  const [transactions, setTransactions] = React.useState<Transaction[]>(transactionSeed);
  const [lastTransaction, setLastTransaction] = React.useState<Transaction | null>(transactionSeed[0]);
  const [ledger, setLedger] = React.useState<LedgerEntry[]>(ledgerSeed);
  const [tierHistory] = React.useState<TierHistoryEntry[]>(tierHistorySeed);
  const [notifications, setNotifications] = React.useState<NotificationItem[]>(notificationsSeed);
  const [adjustments, setAdjustments] = React.useState<Adjustment[]>(adjustmentSeed);
  const [pendingRegistration, setPendingRegistration] = React.useState<PendingRegistration | null>(null);
  const nextBookingIdRef = React.useRef(nextBookingSequence(bookingSeed));

  React.useEffect(() => {
    const persisted = loadPersistedState();
    if (!persisted) {
      setHydrated(true);
      return;
    }

    setRole(persisted.role);
    setTiers(persisted.tiers);
    setPromotions(persisted.promotions);
    setCurrentCustomerId(persisted.currentCustomerId);
    setCustomers(persisted.customers);
    setVehiclesByCustomer(persisted.vehiclesByCustomer);
    setBookings(persisted.bookings);
    setSelectedBookingId(persisted.selectedBookingId);
    setSessionDraft(persisted.sessionDraft);
    setTransactions(persisted.transactions);
    setLastTransaction(persisted.lastTransaction);
    setLedger(persisted.ledger);
    setNotifications(
      persisted.notifications.map((notification) => ({
        ...notification,
        timestamp: new Date(notification.timestamp),
      })),
    );
    setAdjustments(
      persisted.adjustments.map((adjustment) => ({
        ...adjustment,
        timestamp: new Date(adjustment.timestamp),
      })),
    );
    setPendingRegistration(persisted.pendingRegistration);
    nextBookingIdRef.current = nextBookingSequence(persisted.bookings);
    setHydrated(true);
  }, []);

  const isActiveBooking = React.useCallback(
    (status: BookingStatus) => ["Pending", "Confirmed", "Checked-in"].includes(status),
    [],
  );

  const pushNotification = React.useCallback((notification: Omit<NotificationItem, "id" | "timestamp">) => {
    setNotifications((prev) => [{ ...notification, id: crypto.randomUUID(), timestamp: new Date() }, ...prev]);
  }, []);

  const updateCurrentProfile = React.useCallback(
    (patch: Partial<Pick<CustomerRecord, "name" | "phone" | "countryCode">>) => {
      setCustomers((prev) => prev.map((customer) => (customer.id === currentCustomerId ? { ...customer, ...patch } : customer)));
    },
    [currentCustomerId],
  );

  const completeRegistration = React.useCallback(() => {
    if (!pendingRegistration) return;
    const duplicatePhone = customers.some(
      (customer) =>
        customer.status === "Active" && customer.phone === pendingRegistration.phone,
    );
    if (duplicatePhone) {
      throw new Error("Phone number already exists.");
    }
    const normalizedPlate = normalizePlate(pendingRegistration.vehicle.plate);
    const plateTaken = Object.values(vehiclesByCustomer)
      .flat()
      .some((vehicle) => normalizePlate(vehicle.plate) === normalizedPlate);
    if (plateTaken) {
      throw new Error("License plate already belongs to another active customer.");
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
      },
    ]);
    setVehiclesByCustomer((prev) => ({
      ...prev,
      [id]: [
        {
          ...pendingRegistration.vehicle,
          plate: normalizedPlate,
          id: `v-${Date.now()}`,
        },
      ],
    }));
    setCurrentCustomerId(id);
    setPendingRegistration(null);
  }, [customers, pendingRegistration, vehiclesByCustomer]);

  const addVehicle = React.useCallback(
    (vehicle: Omit<Vehicle, "id">) => {
      const normalizedPlate = normalizePlate(vehicle.plate);
      const plateTaken = Object.entries(vehiclesByCustomer).some(([customerId, customerVehicles]) =>
        customerId !== currentCustomerId &&
        customerVehicles.some((item) => normalizePlate(item.plate) === normalizedPlate),
      );
      if (plateTaken) {
        throw new Error("License plate already belongs to another active customer.");
      }
      setVehiclesByCustomer((prev) => ({
        ...prev,
        [currentCustomerId]: [
          ...(prev[currentCustomerId] ?? []),
          { ...vehicle, plate: normalizedPlate, id: `v-${Date.now()}` },
        ],
      }));
    },
    [currentCustomerId, vehiclesByCustomer],
  );

  const updateVehicle = React.useCallback(
    (id: string, vehicle: Omit<Vehicle, "id">) => {
      const normalizedPlate = normalizePlate(vehicle.plate);
      const plateTaken = Object.entries(vehiclesByCustomer).some(([customerId, customerVehicles]) =>
        customerVehicles.some(
          (item) =>
            item.id !== id &&
            normalizePlate(item.plate) === normalizedPlate &&
            customerId !== currentCustomerId,
        ),
      );
      if (plateTaken) {
        throw new Error("License plate already belongs to another active customer.");
      }
      setVehiclesByCustomer((prev) => ({
        ...prev,
        [currentCustomerId]: (prev[currentCustomerId] ?? []).map((item) =>
          item.id === id ? { ...vehicle, plate: normalizedPlate, id } : item,
        ),
      }));
    },
    [currentCustomerId, vehiclesByCustomer],
  );

  const deleteVehicle = React.useCallback(
    (id: string) => {
      const currentVehicles = vehiclesByCustomer[currentCustomerId] ?? [];
      if (currentVehicles.length <= 1) return { ok: false, error: "Customer must keep at least one vehicle." };
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
      const tier = tiers.find((item) => item.name === customer.tier);
      const timeSlot = input.scheduledAt.split(" ").slice(-2).join(" ");
      const date = new Date(`${input.dateISO}T00:00:00`);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const diffDays = Math.floor((date.getTime() - today.getTime()) / 86400000);
      if (!input.isWalkIn) {
        if (diffDays < 0) throw new Error("Cannot book in the past.");
        if (diffDays > (tier?.bookingWindowDays ?? 7)) {
          throw new Error(`Booking exceeds ${tier?.bookingWindowDays ?? 7}-day window for ${customer.tier}.`);
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
      if (!input.isWalkIn && slotLoad >= 3) {
        throw new Error("Selected slot has reached shop capacity.");
      }
      const booking = {
        ...input,
        id: `B${String(nextBookingIdRef.current++).padStart(3, "0")}`,
        customerId: currentCustomerId,
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
      setBookings((prev) => prev.map((booking) => (booking.id === id ? { ...booking, status } : booking)));
    },
    [bookings],
  );

  const prepareSessionForBooking = React.useCallback(
    (bookingId: string) => {
      const booking = bookings.find((item) => item.id === bookingId);
      const customer = customers.find((item) => item.id === booking?.customerId);
      if (!booking || !customer) return;
      const checkedInAt = booking.checkInAt ?? new Date().toISOString();
      setBookings((prev) =>
        prev.map((item) =>
          item.id === bookingId
            ? { ...item, status: "Checked-in", checkInAt: checkedInAt, washStatus: "Queued" }
            : item,
        ),
      );
      setSelectedBookingId(bookingId);
      setSessionDraft({
        bookingId,
        customerId: customer.id,
        customerName: customer.name,
        customerTier: customer.tier,
        customerPoints: customer.points,
        vehicleType: booking.vehicleType,
        plate: booking.vehiclePlate,
        services: services.filter((service) => booking.services.includes(service.name)),
        walkIn: booking.isWalkIn,
      });
    },
    [bookings, customers, services],
  );

  const createWalkInBooking = React.useCallback(
    ({ plate, vehicleType, serviceIds }: { plate: string; vehicleType: VehicleType; serviceIds: string[] }) => {
      const selectedServices = services.filter((service) => serviceIds.includes(service.id));
      const totalPrice = selectedServices.reduce((sum, service) => sum + service.price, 0);
      const dateISO = localDateISO(new Date());
      const timeSlot = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
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
      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === id
            ? { ...booking, checkInAt: checkedInAt, washStatus: "Queued" }
            : booking,
        ),
      );
      setSessionDraft({
        bookingId: id,
        customerId: customer.id,
        customerName: customer.name,
        customerTier: customer.tier,
        customerPoints: customer.points,
        vehicleType,
        plate: plate.toUpperCase(),
        services: selectedServices,
        walkIn: true,
      });
      return id;
    },
    [createBookingFromLegacy, currentCustomerId, customers, services],
  );

  const updateCustomerPoints = React.useCallback(
    (customerId: string, nextPoints: number, reason = "Manual adjustment") => {
      const target = customers.find((customer) => customer.id === customerId);
      if (!target) return;
      const resolved = Math.max(0, nextPoints);
      const nextTier = tierFor(resolved, tiers);
      setCustomers((prev) => prev.map((customer) => (customer.id === customerId ? { ...customer, points: resolved, tier: nextTier } : customer)));
      setLedger((prev) => [
        { id: crypto.randomUUID(), customerId, date: localDateISO(new Date()), type: "Adjusted", delta: nextPoints, description: reason },
        ...prev,
      ]);
    },
    [customers, tiers],
  );

  const completeCheckout = React.useCallback(
    ({ promoCode, pointsRedeemed, paymentMethod }: { promoCode?: string | null; pointsRedeemed: number; paymentMethod: string }) => {
      if (!sessionDraft) return null;
      const customer = customers.find((item) => item.id === sessionDraft.customerId);
      const tierRule = customer ? tiers.find((tier) => tier.name === customer.tier) : undefined;
      const subtotal = sessionDraft.services.reduce((sum, service) => sum + service.price, 0);
      const tierDiscount = customer && tierRule ? Math.round(subtotal * (tierRule.discountPercent / 100)) : 0;
      const promo = promotions.find((item) => promoCode && item.code === promoCode && item.active && (!customer || item.tiers.includes(customer.tier)));
      const afterTier = subtotal - tierDiscount;
      const promoDiscount = promo ? (promo.discountType === "Percentage" ? Math.round(afterTier * (promo.amount / 100)) : Math.min(promo.amount, afterTier)) : 0;
      const afterPromo = Math.max(0, afterTier - promoDiscount);
      const safePoints = customer ? Math.min(pointsRedeemed, customer.points, Math.floor(afterPromo / 1000)) : 0;
      const pointsValue = safePoints * 1000;
      const finalAmount = Math.max(0, afterPromo - pointsValue);
      const multiplier = tierRule?.multiplier ?? 1;
      const pointsEarned = Math.floor(Math.floor(finalAmount / 10000) * multiplier);
      const tx: Transaction = {
        id: `TX-${Date.now().toString().slice(-6)}`,
        bookingId: sessionDraft.bookingId,
        date: new Date().toISOString(),
        customer: { id: customer?.id ?? "guest", name: customer?.name ?? sessionDraft.customerName, tier: customer?.tier ?? "Guest", discountPct: tierRule?.discountPercent ?? 0, points: customer?.points ?? 0 },
        vehicleType: sessionDraft.vehicleType,
        plate: sessionDraft.plate,
        services: sessionDraft.services,
        subtotal,
        tierDiscount,
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
      if (customer) {
        setCustomers((prev) =>
          prev.map((item) =>
            item.id === customer.id ? { ...item, points: customer.points - safePoints + pointsEarned, tier: tierFor(customer.points - safePoints + pointsEarned, tiers) } : item,
          ),
        );
        setLedger((prev) => [
          { id: crypto.randomUUID(), customerId: customer.id, date: localDateISO(new Date()), type: "Earned", delta: pointsEarned, description: `Completed session ${tx.id}` },
          ...(safePoints > 0 ? [{ id: crypto.randomUUID(), customerId: customer.id, date: localDateISO(new Date()), type: "Spent" as const, delta: -safePoints, description: `Redeemed ${safePoints} points at checkout` }] : []),
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
    [customers, promotions, pushNotification, sessionDraft, tiers],
  );

  const redeemReward = React.useCallback(
    (customerId: string, reward: Reward) => {
      const customer = customers.find((item) => item.id === customerId);
      if (!customer || customer.points < reward.cost || customer.status === "Blocked") return false;
      setCustomers((prev) =>
        prev.map((item) =>
          item.id === customerId
            ? { ...item, points: item.points - reward.cost, tier: tierFor(item.points - reward.cost, tiers) }
            : item,
        ),
      );
      setLedger((prev) => [
        { id: crypto.randomUUID(), customerId, date: localDateISO(new Date()), type: "Spent", delta: -reward.cost, description: `Redeemed ${reward.name}` },
        ...prev,
      ]);
      return true;
    },
    [customers, tiers],
  );

  React.useEffect(() => {
    if (typeof window === "undefined" || !hydrated) return;
    const payload: PersistedStore = {
      role,
      tiers,
      promotions,
      currentCustomerId,
      customers,
      vehiclesByCustomer,
      bookings,
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
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [
    adjustments,
    bookings,
    currentCustomerId,
    customers,
    lastTransaction,
    ledger,
    notifications,
    pendingRegistration,
    role,
    selectedBookingId,
    sessionDraft,
    tierHistory,
    tiers,
    transactions,
    vehiclesByCustomer,
    promotions,
    hydrated,
  ]);

  const value: Store = {
    role,
    setRole,
    tiers,
    services,
    promotions,
    rewards,
    currentCustomerId,
    customers,
    vehiclesByCustomer,
    bookings,
    selectedBookingId,
    sessionDraft,
    transactions,
    lastTransaction,
    ledger,
    tierHistory,
    notifications,
    adjustments,
    pendingRegistration,
    setPendingRegistration,
    completeRegistration,
    updateCurrentProfile,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    setCurrentCustomerId,
    createBookingFromLegacy,
    updateBookingStatus,
    setSelectedBookingId,
    createWalkInBooking,
    createOrUpdateSessionDraft: (draft) => {
      if (!draft) {
        setSessionDraft(null);
        return;
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
        bookingId: resolvedBookingId,
        walkIn: draft.walkIn ?? sessionDraft?.walkIn,
      });
    },
    prepareSessionForBooking,
    completeCheckout,
    updateCustomerPoints,
    redeemReward,
    updateTiers: setTiers,
    addPromotion: (promotion) => setPromotions((prev) => [{ ...promotion, id: crypto.randomUUID() }, ...prev]),
    togglePromotion: (id) => setPromotions((prev) => prev.map((promotion) => (promotion.id === id ? { ...promotion, active: !promotion.active } : promotion))),
    pushNotification,
    addAdjustment: (adjustment) => {
      setAdjustments((prev) => [{ ...adjustment, id: crypto.randomUUID(), timestamp: new Date() }, ...prev]);
      const target = customers.find((customer) => customer.name === adjustment.customer);
      if (target) updateCustomerPoints(target.id, target.points + adjustment.delta, adjustment.reason);
    },
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCarwashStore() {
  const ctx = React.useContext(Ctx);
  if (!ctx) throw new Error("useCarwashStore must be used inside CarwashStoreProvider");
  return ctx;
}
