import * as React from "react";
import { Plus, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PromotionForm } from "../components/PromotionForm";
import { PromotionTable } from "../components/PromotionTable";
import { promotions as promotionsMock } from "../mock/promotions.mock";
import type {
  Promotion,
  PromotionDraft,
} from "../types/promotion.types";

export function PromotionsPage() {
  const [items, setItems] = React.useState<Promotion[]>(promotionsMock);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editTarget, setEditTarget] = React.useState<Promotion | null>(null);

  const handleOpenCreate = () => {
    setEditTarget(null);
    setDialogOpen(true);
  };

  const handleOpenEdit = (promotion: Promotion) => {
    setEditTarget(promotion);
    setDialogOpen(true);
  };

  const handleSubmit = (draft: PromotionDraft, id?: string) => {
    if (id) {
      setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...draft } : item)));
      toast.success(`Updated promotion: ${draft.name}`);
    } else {
      const newPromotion: Promotion = {
        ...draft,
        id: `p-${Date.now()}`,
        usageCount: 0,
      };
      setItems((prev) => [newPromotion, ...prev]);
      toast.success(`Created promotion: ${draft.name}`);
    }
    setDialogOpen(false);
  };

  const handleToggleActive = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, active: !item.active } : item)),
    );
    const target = items.find((item) => item.id === id);
    if (target) {
      toast.success(`${target.active ? "Deactivated" : "Activated"} ${target.name}`);
    }
  };

  return (
    <div className="p-4 md:p-8 lg:p-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-primary shadow-sm backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5" /> Promotions
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Promotions catalog
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-muted-foreground md:text-base">
              Create, edit and deactivate promotions targeting specific tiers or audiences.
            </p>
          </div>
          <Button onClick={handleOpenCreate} className="gap-2">
            <Plus className="h-4 w-4" /> New promotion
          </Button>
        </div>

        <PromotionTable
          promotions={items}
          onEdit={handleOpenEdit}
          onToggleActive={handleToggleActive}
        />

        <PromotionForm
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          initialPromotion={editTarget}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
