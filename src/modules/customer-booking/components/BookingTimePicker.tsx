import { useEffect, useMemo, useState } from "react";
import styles from "../styles/booking.module.css";

const availableTimes = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
];

function toIsoDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getMonthValue(date: string) {
  return date.slice(0, 7);
}

function getMonthOptions() {
  const current = new Date();

  return Array.from({ length: 12 }, (_, index) => {
    const date = new Date(current.getFullYear(), current.getMonth() + index, 1);
    const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

    return {
      value,
      label: date.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
      shortLabel: date.toLocaleDateString("en-US", { month: "2-digit", year: "numeric" }),
    };
  });
}

function getMonthDates(monthValue: string) {
  const [year, month] = monthValue.split("-").map(Number);
  const firstDay = new Date(year, month - 1, 1);
  const daysInMonth = new Date(year, month, 0).getDate();

  return Array.from({ length: daysInMonth }, (_, index) => {
    const date = new Date(firstDay);
    date.setDate(index + 1);

    return {
      iso: toIsoDate(date),
      day: date.toLocaleDateString("en-US", { weekday: "short" }),
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    };
  });
}

function isPastDate(isoDate: string) {
  return isoDate < toIsoDate(new Date());
}

function isSlotAvailableFor(isoDate: string, slot: string, occupiedSlots: Set<string>) {
  return (
    !isPastDate(isoDate) &&
    !occupiedSlots.has(`${isoDate}|${slot}`) &&
    !getMockUnavailableSlots(isoDate).has(slot)
  );
}

function getMockUnavailableSlots(isoDate: string) {
  const date = new Date(`${isoDate}T00:00:00`);
  const dayOfWeek = date.getDay();
  const dayOfMonth = date.getDate();
  const blocked = new Set<string>(["11:00", "13:00"]);

  if (dayOfWeek === 0 || dayOfWeek === 6) {
    ["09:30", "10:00", "14:30", "16:00"].forEach((slot) => blocked.add(slot));
  }

  if (dayOfMonth % 2 === 0) {
    ["08:30", "15:30"].forEach((slot) => blocked.add(slot));
  }

  if (dayOfMonth % 3 === 0) {
    ["10:30", "17:30"].forEach((slot) => blocked.add(slot));
  }

  return blocked;
}

interface BookingTimePickerProps {
  date: string;
  time: string;
  occupiedSlotKeys: string[];
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
}

export function BookingTimePicker({
  date,
  occupiedSlotKeys,
  time,
  onDateChange,
  onTimeChange,
}: BookingTimePickerProps) {
  const [monthPickerOpen, setMonthPickerOpen] = useState(false);
  const selectedMonth = getMonthValue(date);
  const monthDates = useMemo(() => getMonthDates(selectedMonth), [selectedMonth]);
  const monthOptions = useMemo(() => getMonthOptions(), []);
  const occupiedSlots = useMemo(() => new Set(occupiedSlotKeys), [occupiedSlotKeys]);
  const selectedMonthOption =
    monthOptions.find((option) => option.value === selectedMonth) ?? monthOptions[0];

  const isSlotAvailable = (isoDate: string, slot: string) => {
    return isSlotAvailableFor(isoDate, slot, occupiedSlots);
  };

  const getFirstAvailableSlot = (isoDate: string) => {
    return availableTimes.find((slot) => isSlotAvailable(isoDate, slot));
  };

  const selectedDateAvailableSlots = useMemo(
    () => availableTimes.filter((slot) => isSlotAvailableFor(date, slot, occupiedSlots)),
    [date, occupiedSlots],
  );
  const availableSlotCount = selectedDateAvailableSlots.length;

  useEffect(() => {
    const nextSlot = selectedDateAvailableSlots[0];

    if (nextSlot && !selectedDateAvailableSlots.includes(time)) {
      onTimeChange(nextSlot);
    }
  }, [onTimeChange, selectedDateAvailableSlots, time]);

  const handleMonthChange = (monthValue: string) => {
    const firstDateInMonth = getMonthDates(monthValue).find((option) => !isPastDate(option.iso));
    const nextDate = firstDateInMonth?.iso ?? `${monthValue}-01`;
    const nextSlot = getFirstAvailableSlot(nextDate);

    onDateChange(nextDate);
    if (nextSlot) {
      onTimeChange(nextSlot);
    }
    setMonthPickerOpen(false);
  };

  const handleDateChange = (isoDate: string) => {
    const nextSlot = isSlotAvailable(isoDate, time) ? time : getFirstAvailableSlot(isoDate);

    onDateChange(isoDate);
    if (nextSlot) {
      onTimeChange(nextSlot);
    }
  };

  return (
    <div className={styles.timePicker}>
      <div
        className={styles.monthPickerRow}
        onClick={() => setMonthPickerOpen((current) => !current)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setMonthPickerOpen((current) => !current);
          }
        }}
        role="button"
        aria-expanded={monthPickerOpen}
        tabIndex={0}
      >
        <div className={styles.monthPicker}>
          <span>Booking month</span>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setMonthPickerOpen((current) => !current);
            }}
          >
            {selectedMonthOption.shortLabel}
            <i aria-hidden="true" />
          </button>
          {monthPickerOpen ? (
            <div className={styles.monthMenu} onClick={(event) => event.stopPropagation()}>
              {monthOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={option.value === selectedMonth ? styles.monthMenuItemActive : ""}
                  onClick={() => handleMonthChange(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          ) : null}
        </div>
        <p>
          {availableSlotCount} slots available on the selected date. Gray slots are already booked
          or reserved for operations.
        </p>
      </div>
      <div className={styles.dateGrid} role="radiogroup" aria-label="Booking date">
        {monthDates.map((option) => {
          const availableCount = availableTimes.filter((slot) =>
            isSlotAvailable(option.iso, slot),
          ).length;
          const disabled = isPastDate(option.iso) || availableCount === 0;

          return (
            <button
              key={option.iso}
              type="button"
              className={option.iso === date ? styles.dateCardSelected : styles.dateCard}
              onClick={() => handleDateChange(option.iso)}
              aria-pressed={option.iso === date}
              disabled={disabled}
            >
              <span>{option.day}</span>
              <strong>{option.date}</strong>
              <small>{availableCount} open</small>
            </button>
          );
        })}
      </div>
      <div className={styles.slotLegend} aria-hidden="true">
        <span>
          <i className={styles.legendAvailable} /> Available
        </span>
        <span>
          <i className={styles.legendUnavailable} /> Unavailable
        </span>
      </div>
      <div className={styles.timeSlots} role="radiogroup" aria-label="Booking time">
        {availableTimes.map((slot) => {
          const available = isSlotAvailable(date, slot);
          const selected = slot === time && available;

          return (
            <button
              key={slot}
              type="button"
              className={selected ? styles.timeSlotSelected : styles.timeSlot}
              onClick={() => onTimeChange(slot)}
              aria-pressed={selected}
              disabled={!available}
              title={available ? "Available" : "Unavailable"}
            >
              {slot}
              <small>{available ? "Open" : "Unavailable"}</small>
            </button>
          );
        })}
      </div>
    </div>
  );
}
