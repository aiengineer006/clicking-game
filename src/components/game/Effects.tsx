import { useEffect, useRef, useState } from "react";
import bulbImg from "@/assets/bulb.png";

const NOTIFS = [
  "Someone mentioned you",
  "3 people are typing…",
  "Your streak is dying",
  "LIMITED EVENT",
  "You forgot something important",
  "New follower just unfollowed",
  "Your screen time is up 420%",
  "Reply needed: urgent",
];

export function Notifications({ active }: { active: boolean }) {
  const [items, setItems] = useState<{ id: number; text: string }[]>([]);
  useEffect(() => {
    if (!active) return;
    let id = 0;
    let delay = 1500;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      const t = NOTIFS[Math.floor(Math.random() * NOTIFS.length)];
      setItems((s) => [...s.slice(-7), { id: id++, text: t }]);
      delay = Math.max(400, delay * 0.97);
      timer = setTimeout(tick, delay);
    };
    timer = setTimeout(tick, delay);
    return () => clearTimeout(timer);
  }, [active]);
  useEffect(() => {
    if (items.length === 0) return;
    const t = setTimeout(() => setItems((s) => s.slice(1)), 4000);
    return () => clearTimeout(t);
  }, [items]);
  if (!active) return null;
  return (
    <div className="fixed top-24 right-4 z-40 flex flex-col gap-2 pointer-events-none">
      {items.map((i) => (
        <div key={i.id} className="animate-notif bg-card/90 border border-border rounded-md px-3 py-2 text-xs shadow-lg max-w-[220px]">
          🔔 {i.text}
        </div>
      ))}
    </div>
  );
}

const POSTS = [
  "My roommate thinks birds can smell Wi-Fi",
  "BREAKING: Soup discourse escalates",
  "This app ruined my marriage",
  "Just deleted 4000 emails. Felt nothing.",
  "Mercury is in microwave again",
  "Why does my dog file taxes",
  "Local man invents new vowel",
];
export function DramaFeed({ active }: { active: boolean }) {
  const [posts, setPosts] = useState<{ id: number; text: string; likes: number }[]>([]);
  useEffect(() => {
    if (!active) return;
    let id = 0;
    const t = setInterval(() => {
      const p = POSTS[Math.floor(Math.random() * POSTS.length)];
      setPosts((s) => [{ id: id++, text: p, likes: Math.floor(Math.random() * 999) }, ...s].slice(0, 5));
    }, 1500);
    return () => clearInterval(t);
  }, [active]);
  if (!active) return null;
  return (
    <div className="fixed left-4 top-24 z-30 w-64 space-y-2 pointer-events-auto">
      <div className="text-xs text-muted-foreground">🔥 Drama Feed</div>
      {posts.map((p) => (
        <div key={p.id} className="animate-notif bg-card/90 border border-border rounded-md p-2 text-xs">
          <div>{p.text}</div>
          <div className="flex gap-2 mt-1 text-[10px] text-muted-foreground">
            <button className="hover:text-foreground">❤ {p.likes}</button>
            <button className="hover:text-foreground">🔁</button>
            <button className="hover:text-foreground">💢</button>
            <button className="hover:text-destructive">🚫 cancel</button>
          </div>
        </div>
      ))}
    </div>
  );
}

const TASKS = [
  "Optimize your morning routine",
  "Build personal brand",
  "Reply to emails",
  "Read thread",
  "Start side hustle",
  "Manifest abundance",
  "Touch grass (virtually)",
];
export function Tasks({ active }: { active: boolean }) {
  const [list, setList] = useState<string[]>([]);
  useEffect(() => {
    if (!active) return;
    setList(TASKS.slice(0, 3));
  }, [active]);
  if (!active) return null;
  const done = (i: number) => {
    setList((s) => {
      const copy = [...s];
      copy.splice(i, 1);
      copy.push(TASKS[Math.floor(Math.random() * TASKS.length)]);
      copy.push(TASKS[Math.floor(Math.random() * TASKS.length)]);
      return copy.slice(0, 12);
    });
  };
  return (
    <div className="fixed right-4 bottom-24 z-30 w-60 bg-card/90 border border-border rounded-md p-2 text-xs">
      <div className="font-bold mb-1">✅ Productivity</div>
      {list.map((t, i) => (
        <div key={i} className="flex items-center gap-2 py-0.5">
          <input type="checkbox" onChange={() => done(i)} />
          <span>{t}</span>
        </div>
      ))}
    </div>
  );
}

const HEADLINES = [
  "Doctors HATE this bedtime mistake",
  "You're charging your phone wrong",
  "Top 7 foods secretly judging you",
  "This vegetable will end you",
  "Scientists baffled by THIS clicker",
];
export function Ragebait({ active }: { active: boolean }) {
  const [h, setH] = useState<string[]>([]);
  useEffect(() => {
    if (!active) return;
    const t = setInterval(() => {
      setH((s) => [HEADLINES[Math.floor(Math.random() * HEADLINES.length)], ...s].slice(0, 4));
    }, 2200);
    return () => clearInterval(t);
  }, [active]);
  if (!active) return null;
  return (
    <div className="fixed left-4 bottom-4 z-30 w-72 space-y-1">
      {h.map((x, i) => (
        <div key={i} className="animate-notif bg-destructive/20 border border-destructive/50 rounded px-2 py-1 text-xs cursor-pointer hover:bg-destructive/30">
          📰 {x}
        </div>
      ))}
    </div>
  );
}

const CONSPIRACY = [
  "Bananas are linked to lunar banking",
  "Ducks invented daylight savings",
  "Wi-Fi is just bee gossip",
  "The moon is a rental property",
];
export function Conspiracy({ active }: { active: boolean }) {
  const [open, setOpen] = useState<string | null>(null);
  const [depth, setDepth] = useState(0);
  if (!active) return null;
  return (
    <div className="fixed right-4 top-1/2 z-30 w-60 bg-card/90 border border-accent/60 rounded p-2 text-xs">
      <div className="font-bold mb-1">🕳️ Rabbit Holes</div>
      {!open && CONSPIRACY.map((c) => (
        <button key={c} onClick={() => { setOpen(c); setDepth(1); }} className="block text-left text-accent hover:underline py-0.5">
          → {c}
        </button>
      ))}
      {open && (
        <div className="space-y-1">
          <div className="text-muted-foreground">Depth {depth}</div>
          <div>{open}</div>
          <div className="text-[10px] opacity-80">"Experts" confirm: leaked chat #{depth} reveals more...</div>
          <button onClick={() => setDepth((d) => d + 1)} className="text-accent hover:underline">deeper →</button>
          <button onClick={() => { setOpen(null); setDepth(0); }} className="block text-muted-foreground hover:text-foreground">close</button>
        </div>
      )}
    </div>
  );
}

const CHAT_LINES = [
  "FIRST", "PogChamp", "Kappa Kappa", "L + ratio", "W streamer",
  "lol no way", "🔥🔥🔥", "ban this guy", "spam spam spam",
  "the earth is flat actually", "CLIP IT", "modsssss", "/\\_/\\",
];
export function FakeChat({ active }: { active: boolean }) {
  const [lines, setLines] = useState<{ id: number; user: string; text: string }[]>([]);
  useEffect(() => {
    if (!active) return;
    let id = 0;
    let speed = 700;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      setLines((s) => [...s.slice(-12), { id: id++, user: "user" + Math.floor(Math.random() * 999), text: CHAT_LINES[Math.floor(Math.random() * CHAT_LINES.length)] }]);
      speed = Math.max(120, speed * 0.97);
      timer = setTimeout(tick, speed);
    };
    timer = setTimeout(tick, speed);
    return () => clearTimeout(timer);
  }, [active]);
  if (!active) return null;
  return (
    <div className="fixed bottom-4 right-4 z-30 w-64 h-48 bg-card/90 border border-border rounded p-2 text-[10px] overflow-hidden">
      <div className="font-bold mb-1">💬 Live Chat</div>
      <div className="space-y-0.5">
        {lines.map((l) => (
          <div key={l.id}><span className="text-accent">{l.user}:</span> {l.text}</div>
        ))}
      </div>
    </div>
  );
}

const MORAL = ["Ignore friend?", "Donate?", "Respond?", "React?", "Subscribe?", "Forgive?", "Lie?"];
export function Moral({ active }: { active: boolean }) {
  const [q, setQ] = useState<string | null>(null);
  useEffect(() => {
    if (!active) return;
    const t = setInterval(() => setQ(MORAL[Math.floor(Math.random() * MORAL.length)]), 4000);
    return () => clearInterval(t);
  }, [active]);
  if (!active || !q) return null;
  return (
    <div className="fixed top-1/3 left-1/2 -translate-x-1/2 z-40 bg-card border-2 border-accent rounded p-3 text-sm shadow-2xl animate-notif">
      <div className="mb-2">{q}</div>
      <div className="flex gap-2">
        <button onClick={() => setQ(null)} className="px-3 py-1 bg-primary text-primary-foreground rounded text-xs">Yes</button>
        <button onClick={() => setQ(null)} className="px-3 py-1 bg-secondary text-secondary-foreground rounded text-xs">No</button>
      </div>
    </div>
  );
}

const ADS = [
  "BUY ENERGY DRINK NOW",
  "AI tool replaces your friends",
  "Productivity app: be useful or perish",
  "Please click me. I have children.",
  "I remember your last click. Do you?",
  "Why did you scroll past me?",
];
export function Ads({ active }: { active: boolean }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (!active) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % ADS.length), 3500);
    return () => clearInterval(t);
  }, [active]);
  if (!active) return null;
  return (
    <div className="fixed bottom-32 left-1/2 -translate-x-1/2 z-30 bg-gradient-to-r from-accent to-primary text-primary-foreground px-4 py-2 rounded-md text-xs font-bold animate-pulse">
      📢 {ADS[idx]}
    </div>
  );
}

export function FragmentationOverlay({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <div className="fixed inset-0 z-20 pointer-events-none">
      <div className="absolute top-10 left-1/3 text-2xl font-bold animate-vibrate text-accent">CLICK!</div>
      <div className="absolute bottom-1/3 right-10 text-xl animate-wiggle text-primary">⏰ HURRY</div>
      <div className="absolute top-1/2 left-10 text-lg animate-vibrate text-destructive">!!!</div>
    </div>
  );
}

export function FloatingYouTube({ ytId, idx }: { ytId: string; idx: number }) {
  const positions = [
    "top-20 left-20", "bottom-40 right-20", "top-1/3 right-1/4",
  ];
  return (
    <div className={`fixed ${positions[idx % 3]} z-30 w-80 h-48 border-2 border-accent rounded shadow-2xl overflow-hidden animate-wiggle`}>
      <iframe
        width="100%"
        height="100%"
        src={`https://www.youtube.com/embed/${ytId}?autoplay=1&mute=0&controls=1&loop=1&playlist=${ytId}`}
        title="yt"
        allow="autoplay; encrypted-media"
        allowFullScreen
      />
    </div>
  );
}

export function BulbPop({ x, y, id }: { x: number; y: number; id: number }) {
  return (
    <img
      key={id}
      src={bulbImg}
      alt=""
      className="pixel-img animate-bulb-rise pointer-events-none fixed z-50 w-12 h-12"
      style={{ left: x, top: y, opacity: 0.55 }}
    />
  );
}
