import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { SHOP_ITEMS, type ShopItem } from "./shopItems";
import bulbImg from "@/assets/bulb.png";

export function Shop({
  bulbs,
  owned,
  onBuy,
}: {
  bulbs: number;
  owned: Set<string>;
  onBuy: (item: ShopItem) => void;
}) {
  const fmt = (n: number) => n.toLocaleString();

  const renderItems = (tier: "normal" | "legend" | "finish", title: string) => {
    const items = SHOP_ITEMS.filter((i) => i.tier === tier);
    return (
      <div className="space-y-3">
        <h3 className={`text-sm font-bold uppercase tracking-wider ${tier === "legend" ? "text-accent" : tier === "finish" ? "text-primary" : "text-muted-foreground"}`}>
          {title}
        </h3>
        {items.map((item, idx) => {
          const isOwned = owned.has(item.id);
          // unlock sequentially
          const allItems = SHOP_ITEMS;
          const myIdx = allItems.findIndex((x) => x.id === item.id);
          const prevOwned = myIdx === 0 || owned.has(allItems[myIdx - 1].id);
          const locked = !prevOwned;
          const canAfford = bulbs >= item.price;

          return (
            <div key={item.id} className={`p-3 rounded-md border ${isOwned ? "bg-primary/10 border-primary/40" : "bg-card border-border"} ${locked ? "opacity-40" : ""}`}>
              <h4 className="font-bold text-foreground">{item.name}</h4>
              <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
              <p className="text-[10px] text-accent mt-1">+{item.cps}/sec auto-clicks</p>
              <Button
                disabled={isOwned || locked || !canAfford}
                onClick={() => onBuy(item)}
                size="sm"
                className="mt-2 w-full"
                variant={isOwned ? "secondary" : "default"}
              >
                {isOwned ? "OWNED" : locked ? "LOCKED" : (
                  <span className="flex items-center gap-1.5">
                    Buy {fmt(item.price)}
                    <img src={bulbImg} alt="" className="pixel-img w-4 h-4" />
                  </span>
                )}
              </Button>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="fixed top-4 left-4 z-50 gap-2" variant="secondary">
          <ShoppingBag className="w-4 h-4" /> Shop
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[380px] sm:w-[420px] overflow-y-auto bg-sidebar">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <img src={bulbImg} alt="" className="pixel-img w-6 h-6" />
            Idea Shop
          </SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-6 pb-10">
          {renderItems("normal", "Upgrades")}
          {renderItems("legend", "Legend Tier")}
          {renderItems("finish", "Finish It")}
        </div>
      </SheetContent>
    </Sheet>
  );
}
