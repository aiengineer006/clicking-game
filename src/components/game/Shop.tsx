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

  const renderItems = (tier: "normal" | "tasks" | "legend" | "finish", title: string) => {
    const items = SHOP_ITEMS.filter((i) => i.tier === tier);
    return (
      <div className="space-y-3">
        <h3 className="display-hand text-2xl scribble-underline w-fit">
          {title}
        </h3>
        {items.map((item) => {
          const isOwned = owned.has(item.id);
          const allItems = SHOP_ITEMS;
          const myIdx = allItems.findIndex((x) => x.id === item.id);
          const prevOwned = myIdx === 0 || owned.has(allItems[myIdx - 1].id);
          const locked = !prevOwned;
          const canAfford = bulbs >= item.price;

          return (
            <div
              key={item.id}
              className={`p-3 pencil-border ${isOwned ? "bg-primary/10" : "pencil-card"} ${locked ? "opacity-40" : ""}`}
            >
              <h4 className="display-hand text-xl">{item.name}</h4>
              <p className="text-sm handwriting text-muted-foreground mt-1">{item.description}</p>
              <p className="text-xs handwriting text-accent mt-1">+{item.cps}/sec auto-clicks</p>
              <Button
                disabled={isOwned || locked || !canAfford}
                onClick={() => onBuy(item)}
                size="sm"
                className="mt-2 w-full pencil-border handwriting"
                variant={isOwned ? "secondary" : "default"}
              >
                {isOwned ? "OWNED ✓" : locked ? "LOCKED 🔒" : (
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
        <Button className="fixed top-4 left-4 z-50 gap-2 pencil-border-thick handwriting text-base" variant="secondary">
          <ShoppingBag className="w-4 h-4" /> Shop
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[380px] sm:w-[440px] overflow-y-auto bg-sidebar">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 display-hand text-3xl">
            <img src={bulbImg} alt="" className="pixel-img w-8 h-8" />
            Click Shop
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
