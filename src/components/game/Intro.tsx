import { useEffect, useState } from "react";
import heartImg from "@/assets/heart.png";

export function Intro({ onDone }: { onDone: () => void }) {
  const [stage, setStage] = useState(0);
  useEffect(() => {
    const timers = [
      setTimeout(() => setStage(1), 3200),
      setTimeout(() => setStage(2), 6400),
      setTimeout(() => onDone(), 10500),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onDone]);

  return (
    <div className="fixed inset-0 z-[200] bg-background flex items-center justify-center overflow-hidden">
      {stage === 0 && (
        <div className="animate-title-slide flex items-center gap-3 text-3xl md:text-5xl font-bold whitespace-nowrap">
          Made by <img src={heartImg} alt="heart" className="pixel-img w-12 h-12 md:w-16 md:h-16" />
        </div>
      )}
      {stage === 1 && (
        <div className="animate-title-slide text-3xl md:text-5xl font-bold">by rozmuhammad</div>
      )}
      {stage === 2 && (
        <div className="text-center px-4">
          <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">presents</div>
          <h1 className="text-5xl md:text-8xl font-black bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">
            Idea Storm
          </h1>
          <p className="mt-4 text-sm md:text-base text-muted-foreground">Just start clicking to get started</p>
        </div>
      )}
    </div>
  );
}
