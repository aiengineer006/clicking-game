import { useEffect, useState } from "react";

export function DayNightCycle({ active }: { active: boolean }) {
  const [isDay, setIsDay] = useState(true);
  const [seconds, setSeconds] = useState(59);

  useEffect(() => {
    if (!active) return;
    const t = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          setIsDay((d) => !d);
          return 59;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [active]);

  // never invert UI colors anymore
  useEffect(() => {
    document.body.classList.remove("night-mode");
  }, [isDay, active]);

  if (!active) return null;

  return (
    <>
      <SkyScene isDay={isDay} />
      <TimerBar seconds={seconds} isDay={isDay} />
    </>
  );
}

function SkyScene({ isDay }: { isDay: boolean }) {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
      {/* Sun OR Moon */}
      {isDay ? (
        <svg viewBox="0 0 200 200" className="absolute top-10 right-16 w-40 h-40 animate-sun sketch-jitter text-foreground">
          <g fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <circle cx="100" cy="100" r="38" />
            <circle cx="100" cy="100" r="44" strokeDasharray="3 5" opacity="0.5" />
            {Array.from({ length: 12 }).map((_, i) => {
              const a = (i * Math.PI * 2) / 12;
              const x1 = 100 + Math.cos(a) * 55;
              const y1 = 100 + Math.sin(a) * 55;
              const x2 = 100 + Math.cos(a) * (75 + (i % 2) * 8);
              const y2 = 100 + Math.sin(a) * (75 + (i % 2) * 8);
              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
            })}
          </g>
        </svg>
      ) : (
        <svg viewBox="0 0 200 200" className="absolute top-10 right-20 w-36 h-36 pencil-anim-slow sketch-jitter text-foreground">
          <g fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M120 40 Q 80 60 80 100 Q 80 140 120 160 Q 70 155 55 110 Q 60 55 120 40 Z" />
            <circle cx="92" cy="90" r="6" />
            <circle cx="78" cy="115" r="4" />
            <circle cx="95" cy="130" r="3" />
            <path d="M70 80 Q 75 100 70 120" opacity="0.5" />
          </g>
        </svg>
      )}

      {/* DAY: clouds */}
      {isDay &&
        [0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="absolute animate-cloud opacity-90"
            style={{
              top: `${8 + i * 16}%`,
              animationDuration: `${50 + i * 15}s`,
              animationDelay: `${-i * 12}s`,
            }}
          >
            <PencilCloud scale={0.7 + (i % 3) * 0.25} />
          </div>
        ))}

      {/* NIGHT: sheep jumping the barrier */}
      {!isDay && (
        <>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="absolute animate-sheep"
              style={{
                bottom: `120px`,
                animationDuration: `${14 + i * 6}s`,
                animationDelay: `${-i * 5}s`,
              }}
            >
              <PencilSheep />
            </div>
          ))}
          {/* a few twinkly stars */}
          {Array.from({ length: 25 }).map((_, i) => (
            <svg
              key={i}
              viewBox="0 0 24 24"
              className="absolute animate-twinkle text-foreground"
              style={{
                left: `${(i * 41) % 100}%`,
                top: `${(i * 23) % 60}%`,
                width: 8 + (i % 3) * 4,
                height: 8 + (i % 3) * 4,
                animationDelay: `${(i % 10) * 0.3}s`,
              }}
            >
              <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <line x1="12" y1="3" x2="12" y2="21" />
                <line x1="3" y1="12" x2="21" y2="12" />
              </g>
            </svg>
          ))}
        </>
      )}

      {/* Horizon hill (always) */}
      <svg className="absolute bottom-0 left-0 w-full h-40 pencil-anim-slow" viewBox="0 0 1200 200" preserveAspectRatio="none">
        <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-foreground/70">
          <path d="M0 160 Q 200 100 400 140 T 800 130 T 1200 150 L 1200 200 L 0 200 Z" fill="currentColor" fillOpacity="0.05" />
          <path d="M0 160 Q 200 100 400 140 T 800 130 T 1200 150" />
        </g>
      </svg>

      {/* Night barrier (fence) on the ground */}
      {!isDay && <PencilBarrier />}
    </div>
  );
}

function PencilCloud({ scale = 1 }: { scale?: number }) {
  return (
    <svg
      viewBox="0 0 160 80"
      style={{ width: 160 * scale, height: 80 * scale }}
      className="pencil-anim-slow sketch-jitter text-foreground/80"
    >
      <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M20 55 Q 10 40 25 32 Q 30 18 50 22 Q 60 8 80 18 Q 100 8 115 22 Q 140 18 142 38 Q 155 45 140 58 Q 130 70 95 65 Q 70 75 45 65 Q 25 70 20 55 Z" />
        <path d="M30 50 Q 50 60 70 55" opacity="0.4" />
      </g>
    </svg>
  );
}

function PencilSheep() {
  return (
    <svg viewBox="0 0 160 100" className="w-32 h-20 pencil-anim sketch-jitter text-foreground">
      <g fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
        {/* fluffy body */}
        <path d="M30 60 Q 18 50 28 42 Q 28 30 42 32 Q 50 22 65 28 Q 78 18 92 28 Q 108 22 115 34 Q 130 34 128 50 Q 138 58 122 64 Q 118 76 100 72 Q 80 80 60 72 Q 40 76 30 60 Z" />
        <path d="M40 58 Q 60 66 80 60" opacity="0.4" />
        <path d="M85 60 Q 100 68 118 60" opacity="0.4" />
        {/* head */}
        <ellipse cx="125" cy="55" rx="12" ry="10" />
        <circle cx="129" cy="53" r="1.5" fill="currentColor" />
        <path d="M118 58 Q 116 64 120 65" />
        {/* ears */}
        <path d="M119 47 Q 115 42 117 39" />
        <path d="M132 47 Q 136 42 134 39" />
        {/* legs */}
        <line x1="50" y1="72" x2="50" y2="86" />
        <line x1="70" y1="74" x2="70" y2="88" />
        <line x1="92" y1="74" x2="92" y2="88" />
        <line x1="110" y1="72" x2="110" y2="86" />
      </g>
    </svg>
  );
}

function PencilBarrier() {
  return (
    <svg className="absolute left-1/2 -translate-x-1/2 bottom-24 w-72 h-24 sketch-jitter text-foreground" viewBox="0 0 300 100">
      <g fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        {/* horizontal rails */}
        <path d="M10 35 Q 150 30 290 35" />
        <path d="M10 65 Q 150 60 290 65" />
        {/* posts */}
        {[20, 70, 120, 170, 220, 270].map((x) => (
          <g key={x}>
            <line x1={x} y1={15} x2={x} y2={90} />
            <path d={`M${x - 6} 18 L ${x} 8 L ${x + 6} 18 Z`} />
          </g>
        ))}
        {/* hatching shadow */}
        {Array.from({ length: 14 }).map((_, i) => (
          <line key={i} x1={20 + i * 20} y1={92} x2={26 + i * 20} y2={100} opacity="0.5" />
        ))}
      </g>
    </svg>
  );
}

function TimerBar({ seconds, isDay }: { seconds: number; isDay: boolean }) {
  const pct = (seconds / 59) * 100;
  return (
    <div className="fixed top-20 right-4 z-40 w-56">
      <div className="text-sm mb-1 text-foreground display-hand">{isDay ? "☀ Day" : "🌙 Night"} — {seconds}s</div>
      <div className="h-3 pencil-border overflow-hidden bg-card">
        <div className="h-full bg-foreground/70 transition-all duration-1000 ease-linear" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
