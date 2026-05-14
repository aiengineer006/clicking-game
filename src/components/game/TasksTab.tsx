import { useEffect, useRef, useState } from "react";
import starImg from "@/assets/star.png";
import bulbImg from "@/assets/bulb.png";
import { TASKS } from "./shopItems";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function TasksTab({
  stars,
  setStars,
  tasksOwned,
  buyTask,
  onBulbReward,
}: {
  stars: number;
  setStars: (fn: (s: number) => number) => void;
  tasksOwned: Set<string>;
  buyTask: (id: string, cost: number) => boolean;
  onBulbReward: (n: number) => void;
}) {
  const [pops, setPops] = useState<{ id: number; x: number; y: number }[]>([]);
  const popId = useRef(0);
  const [activeTask, setActiveTask] = useState<typeof TASKS[number] | null>(null);
  const [answer, setAnswer] = useState("");
  const [bulbsFlying, setBulbsFlying] = useState<{ id: number; x: number; y: number }[]>([]);
  const flyId = useRef(0);

  const handleClick = (e: React.MouseEvent) => {
    if (activeTask) return;
    setStars((s) => s + 1);
    setPops((p) => [...p, { id: popId.current++, x: e.clientX, y: e.clientY }]);
    setTimeout(() => setPops((p) => p.slice(1)), 1200);
  };

  const buy = (t: typeof TASKS[number]) => {
    if (tasksOwned.has(t.id)) return;
    if (!buyTask(t.id, t.cost)) return;
    setActiveTask(t);
    setAnswer("");
  };

  const completeTask = (e: React.MouseEvent) => {
    if (!activeTask) return;
    const reward = activeTask.reward;
    onBulbReward(reward);
    // burst of bulb sprites flying toward HUD
    const x = e.clientX, y = e.clientY;
    const burst = Array.from({ length: 8 }, () => ({
      id: flyId.current++,
      x: x + (Math.random() - 0.5) * 60,
      y: y + (Math.random() - 0.5) * 60,
    }));
    setBulbsFlying((b) => [...b, ...burst]);
    setTimeout(() => setBulbsFlying((b) => b.slice(burst.length)), 1700);
    setActiveTask(null);
  };

  return (
    <div
      className="relative min-h-screen w-full select-none cursor-pointer overflow-hidden"
      onClick={handleClick}
    >
      <SpaceBackground />

      {/* HUD: stars */}
      <div className="fixed top-4 right-4 z-40 flex items-center gap-2 pencil-border-thick pencil-card px-4 py-2 pencil-anim-slow">
        <span className="text-3xl display-hand tabular-nums">{Math.floor(stars).toLocaleString()}</span>
        <img src={starImg} alt="stars" className="pixel-img w-8 h-8" />
      </div>

      {/* center click area */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4 pointer-events-none">
        <h1 className="text-6xl md:text-8xl display-hand text-foreground leading-none drop-shadow-sm">
          TASKS
        </h1>
        <p className="text-base md:text-lg handwriting text-foreground/80 mt-3">
          ~ click to collect stars · spend them on tasks · earn bulbs ~
        </p>
        <div className="mt-8 pencil-anim">
          <img src={starImg} alt="" className="pixel-img w-32 h-32 drop-shadow-2xl" />
        </div>
      </div>

      {/* Tasks list (left side, scrollable) */}
      <div className="fixed top-24 left-4 z-30 w-72 pencil-border-thick pencil-card p-3 max-h-[70vh] overflow-y-auto pencil-anim-slow">
        <h3 className="display-hand text-2xl scribble-underline w-fit mb-2">Available Tasks</h3>
        <div className="space-y-2">
          {TASKS.map((t) => {
            const owned = tasksOwned.has(t.id);
            const canAfford = stars >= t.cost;
            return (
              <div key={t.id} className={`p-2 pencil-border ${owned ? "bg-primary/10" : "pencil-card"}`}>
                <div className="display-hand text-lg">{t.title}</div>
                <div className="text-xs handwriting text-muted-foreground">+{t.reward} bulbs</div>
                <Button
                  size="sm"
                  className="w-full mt-1 pencil-border handwriting"
                  disabled={owned || !canAfford}
                  onClick={(e) => { e.stopPropagation(); buy(t); }}
                >
                  {owned ? "DONE ✓" : (
                    <span className="flex items-center gap-1.5">
                      {t.cost}
                      <img src={starImg} alt="" className="pixel-img w-4 h-4" />
                    </span>
                  )}
                </Button>
              </div>
            );
          })}
        </div>
      </div>

      {/* star pops */}
      {pops.map((p) => (
        <img
          key={p.id}
          src={starImg}
          alt=""
          className="pixel-img animate-bulb-rise pointer-events-none fixed z-50 w-12 h-12"
          style={{ left: p.x, top: p.y, opacity: 0.85 }}
        />
      ))}

      {/* bulbs flying away */}
      {bulbsFlying.map((b) => (
        <img
          key={b.id}
          src={bulbImg}
          alt=""
          className="pixel-img animate-star-fly pointer-events-none fixed z-50 w-10 h-10"
          style={{ left: b.x, top: b.y }}
        />
      ))}

      {/* active task card */}
      {activeTask && (
        <div className="fixed inset-0 z-[80] bg-black/40 flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
          <div className="absolute left-1/2 top-1/2 animate-card-pop pencil-border-thick pencil-card p-6 w-[min(90vw,460px)]">
            <h2 className="display-hand text-3xl mb-1">{activeTask.title}</h2>
            <p className="handwriting text-foreground/80 mb-3">{activeTask.question}</p>
            <Input
              autoFocus
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your answer..."
              className="mb-3"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="flex gap-2">
              <Button
                className="flex-1 pencil-border handwriting"
                disabled={answer.trim().length === 0}
                onClick={completeTask}
              >
                Submit & Receive {activeTask.reward}
                <img src={bulbImg} alt="" className="pixel-img w-4 h-4 ml-1" />
              </Button>
              <Button
                variant="secondary"
                className="pencil-border handwriting"
                onClick={(e) => { e.stopPropagation(); setActiveTask(null); }}
              >
                Skip
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------- PIXEL UNIVERSE ------------------------- */
function SpaceBackground() {
  const stars = Array.from({ length: 80 });
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
         style={{ background: "radial-gradient(ellipse at center, oklch(0.18 0.05 280) 0%, oklch(0.10 0.04 270) 70%, oklch(0.06 0.03 260) 100%)" }}>
      {/* twinkling stars */}
      {stars.map((_, i) => (
        <div
          key={i}
          className="absolute animate-twinkle"
          style={{
            left: `${(i * 37) % 100}%`,
            top: `${(i * 53) % 100}%`,
            width: 2 + (i % 3),
            height: 2 + (i % 3),
            background: "white",
            imageRendering: "pixelated",
            animationDelay: `${(i % 10) * 0.3}s`,
            boxShadow: "0 0 4px white",
          }}
        />
      ))}

      {/* central sun */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
           style={{
             width: 60, height: 60, borderRadius: "50%",
             background: "radial-gradient(circle, #ffe680, #ff8a3d 60%, transparent 80%)",
             boxShadow: "0 0 60px #ff8a3d, 0 0 120px #ffd166",
             imageRendering: "pixelated",
           }} />

      {/* orbiting planets — pixel style */}
      <div className="absolute left-1/2 top-1/2" style={{ transform: "translate(-50%,-50%)" }}>
        <PixelPlanet size={20} color="#6cb6ff" orbit={140} duration={22} />
        <PixelPlanet size={14} color="#ff7b54" orbit={210} duration={34} ring />
        <PixelPlanet size={26} color="#a78bfa" orbit={290} duration={48} />
        <PixelPlanet size={10} color="#3dd9b3" orbit={360} duration={60} />
      </div>

      {/* Black holes */}
      <BlackHole left="12%" top="20%" size={70} />
      <BlackHole left="82%" top="68%" size={90} />

      {/* meteors */}
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="absolute animate-meteor"
          style={{
            top: `${10 + i * 25}%`,
            right: `-10vw`,
            width: 120, height: 3,
            background: "linear-gradient(90deg, transparent, white, transparent)",
            boxShadow: "0 0 8px white",
            animationDelay: `${i * 1.4}s`,
          }}
        />
      ))}
    </div>
  );
}

function PixelPlanet({ size, color, orbit, duration, ring }: { size: number; color: string; orbit: number; duration: number; ring?: boolean }) {
  return (
    <div className="absolute animate-orbit" style={{ ['--orb' as never]: `${orbit}px`, animationDuration: `${duration}s`, left: 0, top: 0 } as React.CSSProperties}>
      <div style={{
        width: size, height: size, borderRadius: "50%",
        background: color, imageRendering: "pixelated",
        boxShadow: `0 0 ${size}px ${color}55, inset -${size / 4}px -${size / 4}px 0 rgba(0,0,0,0.35)`,
        position: "relative",
      }}>
        {ring && (
          <div style={{
            position: "absolute", left: "-40%", top: "40%",
            width: "180%", height: 4,
            background: "rgba(255,255,255,0.6)",
            transform: "rotate(-18deg)", borderRadius: 4,
          }} />
        )}
      </div>
    </div>
  );
}

function BlackHole({ left, top, size }: { left: string; top: string; size: number }) {
  return (
    <div className="absolute animate-blackhole" style={{ left, top, width: size, height: size }}>
      <div style={{
        width: "100%", height: "100%", borderRadius: "50%",
        background: "radial-gradient(circle, #000 30%, #6b21a8 50%, #ec4899 70%, transparent 85%)",
        boxShadow: "0 0 30px #ec4899, inset 0 0 20px black",
        imageRendering: "pixelated",
      }} />
    </div>
  );
}
