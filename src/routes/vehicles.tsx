import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Car, CarFront, Truck, Bike, Pencil, Trash2, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { usePortal, VEHICLE_TYPES, Vehicle, VehicleType } from "@/lib/portal-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/vehicles")({
  component: VehiclesPage,
});

const TYPE_ICONS: Record<VehicleType, React.ComponentType<{ className?: string }>> = {
  Sedan: Car,
  SUV: CarFront,
  Truck: Truck,
  Motorbike: Bike,
};

function VehiclesPage() {
  const { vehicles, addVehicle, updateVehicle, deleteVehicle } = usePortal();
  const [editing, setEditing] = React.useState<Vehicle | "new" | null>(null);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);

  return (
    <div className="px-4 py-8 md:p-10">
      <div className="mx-auto w-full max-w-4xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">My vehicles</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Save your vehicles for faster check-in at every wash.
            </p>
          </div>
          <Button onClick={() => setEditing("new")}>
            <Plus className="h-4 w-4" />
            Add vehicle
          </Button>
        </div>

        {vehicles.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-border p-10 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent/40 text-muted-foreground">
              <Car className="h-6 w-6" />
            </div>
            <p className="mt-3 text-sm text-muted-foreground">No vehicles yet — add your first one.</p>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {vehicles.map((v) => {
              const Icon = TYPE_ICONS[v.type];
              return (
                <div
                  key={v.id}
                  className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md hover:border-primary/40"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs uppercase tracking-wider text-muted-foreground">{v.type}</div>
                      <div className="mt-0.5 truncate font-semibold">{v.brandModel}</div>
                      <div className="mt-2 inline-flex items-center rounded-md border border-border bg-accent/40 px-2 py-1 font-mono text-xs font-semibold tracking-wider">
                        {v.plate}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end gap-1 border-t border-border pt-3">
                    <Button size="sm" variant="ghost" onClick={() => setEditing(v)}>
                      <Pencil className="h-3.5 w-3.5" /> Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                      onClick={() => setDeleteId(v.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <VehicleDialog
        editing={editing}
        onClose={() => setEditing(null)}
        onSave={(data) => {
          if (editing === "new") {
            addVehicle(data);
            toast.success("Vehicle added");
          } else if (editing) {
            updateVehicle(editing.id, data);
            toast.success("Vehicle updated");
          }
          setEditing(null);
        }}
      />

      <AlertDialog open={deleteId !== null} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove this vehicle?</AlertDialogTitle>
            <AlertDialogDescription>
              This vehicle will be removed from your account. You can re-add it anytime.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteId) {
                  deleteVehicle(deleteId);
                  toast.success("Vehicle removed");
                }
                setDeleteId(null);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function VehicleDialog({
  editing,
  onClose,
  onSave,
}: {
  editing: Vehicle | "new" | null;
  onClose: () => void;
  onSave: (data: Omit<Vehicle, "id">) => void;
}) {
  const isEditing = editing && editing !== "new";
  const v = isEditing ? (editing as Vehicle) : null;

  const [brandModel, setBrandModel] = React.useState("");
  const [plate, setPlate] = React.useState("");
  const [type, setType] = React.useState<VehicleType>("Sedan");

  React.useEffect(() => {
    if (editing && editing !== "new") {
      setBrandModel(editing.brandModel);
      setPlate(editing.plate);
      setType(editing.type);
    } else if (editing === "new") {
      setBrandModel("");
      setPlate("");
      setType("Sedan");
    }
  }, [editing]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandModel.trim()) return toast.error("Enter brand & model");
    if (plate.trim().length < 4) return toast.error("Plate looks too short");
    onSave({ brandModel: brandModel.trim(), plate: plate.trim().toUpperCase(), type });
  };

  return (
    <Dialog open={editing !== null} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{v ? "Edit vehicle" : "Add vehicle"}</DialogTitle>
          <DialogDescription>
            {v ? "Update the details for this vehicle." : "Register a new vehicle on your account."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label htmlFor="vbrand" className="mb-1.5 block">Brand & model</Label>
            <Input
              id="vbrand"
              value={brandModel}
              onChange={(e) => setBrandModel(e.target.value)}
              placeholder="Honda CR-V"
            />
          </div>
          <div>
            <Label htmlFor="vplate" className="mb-1.5 block">License plate</Label>
            <Input
              id="vplate"
              value={plate}
              onChange={(e) => setPlate(e.target.value)}
              placeholder="51K-678.90"
              className="font-mono uppercase tracking-wider"
            />
          </div>
          <div>
            <Label className="mb-2 block">Vehicle type</Label>
            <div className="grid grid-cols-4 gap-2">
              {VEHICLE_TYPES.map((t) => {
                const Icon = TYPE_ICONS[t];
                const active = type === t;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className={cn(
                      "flex flex-col items-center gap-1 rounded-lg border p-3 transition-all",
                      active
                        ? "border-primary bg-primary/5 ring-2 ring-primary/30"
                        : "border-border hover:border-primary/40 hover:bg-accent/40",
                    )}
                  >
                    <Icon className={cn("h-5 w-5", active ? "text-primary" : "text-muted-foreground")} />
                    <span className="text-xs font-medium">{t}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              <X className="h-4 w-4" /> Cancel
            </Button>
            <Button type="submit">{v ? "Save changes" : "Add vehicle"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}