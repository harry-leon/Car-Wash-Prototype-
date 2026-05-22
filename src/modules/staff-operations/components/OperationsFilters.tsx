import type { OperationFilters, OperationHourOption, StaffOption } from "../types/operations.types";
import { bookingStatusOptions } from "../mock/booking-status.mock";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface OperationsFiltersProps {
  filters: OperationFilters;
  hourOptions: OperationHourOption[];
  staffOptions: StaffOption[];
  onChange: (filters: OperationFilters) => void;
}

export function OperationsFilters({
  filters,
  hourOptions,
  staffOptions,
  onChange,
}: OperationsFiltersProps) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <FilterField label="Status">
        <Select
          value={filters.status}
          onValueChange={(status) =>
            onChange({ ...filters, status: status as OperationFilters["status"] })
          }
        >
          <SelectTrigger className="h-11 rounded-lg bg-background/70">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="ALL">All statuses</SelectItem>
              {bookingStatusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </FilterField>

      <FilterField label="Time">
        <Select
          value={filters.time}
          onValueChange={(time) => onChange({ ...filters, time: time as OperationFilters["time"] })}
        >
          <SelectTrigger className="h-11 rounded-lg bg-background/70">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="ALL">All day</SelectItem>
              <SelectItem value="MORNING">Morning</SelectItem>
              <SelectItem value="AFTERNOON">Afternoon</SelectItem>
              <SelectItem value="EVENING">Evening</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </FilterField>

      <FilterField label="Hour">
        <Select value={filters.hour} onValueChange={(hour) => onChange({ ...filters, hour })}>
          <SelectTrigger className="h-11 rounded-lg bg-background/70">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="ALL">All hours</SelectItem>
              {hourOptions.map((hour) => (
                <SelectItem key={hour.value} value={hour.value}>
                  {hour.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </FilterField>

      <FilterField label="Staff">
        <Select
          value={filters.staffId}
          onValueChange={(staffId) => onChange({ ...filters, staffId })}
        >
          <SelectTrigger className="h-11 rounded-lg bg-background/70">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="ALL">All staff</SelectItem>
              {staffOptions.map((staff) => (
                <SelectItem key={staff.id} value={staff.id}>
                  {staff.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </FilterField>
    </div>
  );
}

function FilterField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}
