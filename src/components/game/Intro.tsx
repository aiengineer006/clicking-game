import { useEffect, useState } from "react";
import heartImg from "@/assets/heart.png";

export function Intro({ onDone }: { onDone: () => void }) {
  const [stage, setStage] = useState(0);
  useEffect(() => {
    const timers = [
      setTimeout(() => setStage(1), 3200),
      setTimeout(() => setStage(2), 6400),
      setTimeout(() => onDone(), 11000),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onDone]);

  return (
    <div className="fixed inset-0 z-[200] bg-background flex items-center justify-center overflow-hidden">
      {stage === 0 && (
        <div className="animate-title-slide flex items-center gap-4 text-4xl md:text-6xl display-hand whitespace-nowrap text-foreground">
          a game made with <img src={heartImg} alt="heart" className="pixel-img w-14 h-14 md:w-20 md:h-20 pencil-anim" />
        </div>
      )}
      {stage === 1 && (
        <div className="animate-title-slide text-4xl md:text-6xl display-hand text-foreground">
          by <span className="scribble-underline">Rozmuhammad Baxtiyorov</span>
        </div>
      )}
      {stage === 2 && (
        <div className="text-center px-4 pencil-anim-slow">
          <div className="text-sm uppercase tracking-[0.4em] text-muted-foreground mb-3 handwriting">presents</div>
          <h1 className="text-7xl md:text-[10rem] font-bold display-hand text-foreground leading-none">
            JUST CLICK
          </h1>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground handwriting">
            ~ just start clicking to get started ~
          </p>
        </div>
      )}
    </div>
  );
}
