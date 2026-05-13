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

  if (!active) {
    return <div className="fixed inset-0 -z-10 bg-background" />;
  }

  return (
    <>
      <div
        className="fixed inset-0 -z-10 transition-colors duration-[2000ms]"
        style={{
          background: isDay
            ? "linear-gradient(to bottom, #87ceeb, #b8e0f0)"
            : "linear-gradient(to bottom, #050816, #1a1340)",
        }}
      />
      {isDay ? <DaySky /> : <NightSky />}
      <TimerBar seconds={seconds} isDay={isDay} />
    </>
  );
}

function DaySky() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
      <div className="absolute top-12 right-20 w-24 h-24 rounded-full bg-yellow-300 shadow-[0_0_60px_30px_rgba(255,220,100,0.6)]" />
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="absolute animate-cloud opacity-90"
          style={{
            top: `${10 + i * 18}%`,
            animationDuration: `${40 + i * 10}s`,
            animationDelay: `${-i * 12}s`,
          }}
        >
          <div className="bg-white rounded-full w-32 h-12 shadow-md" />
        </div>
      ))}
    </div>
  );
}

function NightSky() {
  const stars = Array.from({ length: 80 }, (_, i) => i);
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
      {/* half moon */}
      <div className="absolute top-12 right-24 w-20 h-20 rounded-full bg-gray-100 shadow-[0_0_40px_15px_rgba(255,255,255,0.3)]">
        <div className="absolute top-0 right-0 w-14 h-20 rounded-full bg-[#1a1340]" />
      </div>
      {stars.map((i) => (
        <div
          key={i}
          className="absolute w-0.5 h-0.5 bg-white rounded-full animate-pulse"
          style={{
            left: `${(i * 37) % 100}%`,
            top: `${(i * 53) % 80}%`,
            animationDelay: `${(i % 10) * 0.3}s`,
          }}
        />
      ))}
      {shooters.map((id) => (
        <div
          key={id}
          className="absolute top-0 left-0 w-16 h-0.5 bg-gradient-to-r from-white to-transparent animate-shoot"
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
      <div className="text-xs mb-1 text-foreground/90 drop-shadow">{isDay ? "☀ Day" : "🌙 Night"} — {seconds}s</div>
      <div className="h-2 bg-black/40 rounded-full overflow-hidden border border-white/20">
        <div className="h-full bg-primary transition-all duration-1000 ease-linear" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
