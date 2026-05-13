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

  // toggle the body night class so paper colors invert
  useEffect(() => {
    if (!active) {
      document.body.classList.remove("night-mode");
      return;
    }
    if (isDay) document.body.classList.remove("night-mode");
    else document.body.classList.add("night-mode");
  }, [isDay, active]);

  if (!active) return null;

  return (
    <>
      {isDay ? <DaySky /> : <NightSky />}
      <TimerBar seconds={seconds} isDay={isDay} />
    </>
  );
}

/* ----------- Hand-drawn pencil sky ----------- */
function DaySky() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
      {/* Sun — pencil sketch */}
      <svg viewBox="0 0 200 200" className="absolute top-10 right-16 w-40 h-40 animate-sun sketch-jitter">
        <g fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-foreground">
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
          {/* hatching shading */}
          <path d="M85 110 Q 90 118 100 120" />
          <path d="M88 115 Q 95 122 108 122" opacity="0.6" />
        </g>
      </svg>

      {/* Hand-drawn clouds drifting */}
      {[0, 1, 2, 3].map((i) => (
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

      {/* horizon hill scribble */}
      <svg className="absolute bottom-0 left-0 w-full h-40 pencil-anim-slow" viewBox="0 0 1200 200" preserveAspectRatio="none">
        <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-foreground/70">
          <path d="M0 160 Q 200 100 400 140 T 800 130 T 1200 150 L 1200 200 L 0 200 Z" fill="currentColor" fillOpacity="0.05" />
          <path d="M0 160 Q 200 100 400 140 T 800 130 T 1200 150" />
          {/* hatching */}
          {Array.from({ length: 30 }).map((_, i) => (
            <line key={i} x1={i * 40} y1={170} x2={i * 40 + 12} y2={195} opacity="0.4" />
          ))}
        </g>
      </svg>
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
        {/* shading hatches */}
        <path d="M30 50 Q 50 60 70 55" opacity="0.4" />
        <path d="M75 60 Q 100 70 130 60" opacity="0.4" />
      </g>
    </svg>
  );
}

function NightSky() {
  const stars = Array.from({ length: 60 }, (_, i) => i);
  const [shooters, setShooters] = useState<number[]>([]);
  useEffect(() => {
    const t = setInterval(() => {
      const id = Date.now();
      setShooters((s) => [...s, id]);
      setTimeout(() => setShooters((s) => s.filter((x) => x !== id)), 2000);
    }, 3500);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
      {/* Hand-drawn moon */}
      <svg viewBox="0 0 200 200" className="absolute top-10 right-20 w-36 h-36 pencil-anim-slow sketch-jitter text-foreground">
        <g fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M120 40 Q 80 60 80 100 Q 80 140 120 160 Q 70 155 55 110 Q 60 55 120 40 Z" />
          {/* craters */}
          <circle cx="92" cy="90" r="6" />
          <circle cx="78" cy="115" r="4" />
          <circle cx="95" cy="130" r="3" />
          {/* shading */}
          <path d="M70 80 Q 75 100 70 120" opacity="0.5" />
          <path d="M65 90 Q 70 110 65 130" opacity="0.4" />
        </g>
      </svg>

      {/* Hand-drawn stars */}
      {stars.map((i) => {
        const left = (i * 37) % 100;
        const top = (i * 53) % 80;
        const size = 8 + (i % 3) * 4;
        return (
          <svg
            key={i}
            viewBox="0 0 24 24"
            className="absolute animate-twinkle text-foreground"
            style={{
              left: `${left}%`,
              top: `${top}%`,
              width: size,
              height: size,
              animationDelay: `${(i % 10) * 0.3}s`,
            }}
          >
            <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <line x1="12" y1="3" x2="12" y2="21" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="6" y1="6" x2="18" y2="18" opacity="0.6" />
              <line x1="18" y1="6" x2="6" y2="18" opacity="0.6" />
            </g>
          </svg>
        );
      })}
      {shooters.map((id) => (
        <div
          key={id}
          className="absolute top-0 left-0 w-20 h-0.5 bg-gradient-to-r from-foreground to-transparent animate-shoot"
          style={{ left: `${Math.random() * 50}%`, top: `${Math.random() * 30}%` }}
        />
      ))}
    </div>
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
