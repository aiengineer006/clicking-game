import { useEffect, useRef, useState } from "react";
import bulbImg from "@/assets/bulb.png";

/* ---------------- NOTIFICATION FLOOD ---------------- */
const NOTIFS = [
  "Someone mentioned you",
  "3 people are typing…",
  "Your streak is dying",
  "LIMITED EVENT — only 4 hours left!",
  "You forgot something important",
  "New follower just unfollowed",
  "Your screen time is up 420%",
  "Reply needed: urgent",
  "Mom liked your post from 2014",
  "Your plant misses you",
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
    <div className="fixed top-56 right-4 z-40 flex flex-col gap-2 pointer-events-none">
      {items.map((i) => (
        <div key={i.id} className="animate-notif pencil-border pencil-card px-3 py-2 text-sm handwriting max-w-[240px] pencil-anim-slow">
          🔔 {i.text}
        </div>
      ))}
    </div>
  );
}

/* ---------------- FAKE EMAIL INBOX ---------------- */
const EMAILS = [
  { from: "Nigerian Prince", subj: "URGENT: $40,000,000 awaiting" },
  { from: "Amazn.com", subj: "Your order #4839 was canceled" },
  { from: "PayPaI", subj: "Verify your account NOW" },
  { from: "Crypto Bro", subj: "Last chance to invest in $POOP" },
  { from: "Mom", subj: "Are u eating?" },
  { from: "LinkedIn", subj: "12 people viewed your profile" },
  { from: "IRS", subj: "Tax refund pending" },
  { from: "Your Boss", subj: "quick question (it's not quick)" },
];
export function EmailInbox({ active }: { active: boolean }) {
  const [list, setList] = useState<{ id: number; from: string; subj: string }[]>([]);
  useEffect(() => {
    if (!active) return;
    let id = 0;
    const t = setInterval(() => {
      const e = EMAILS[Math.floor(Math.random() * EMAILS.length)];
      setList((s) => [{ id: id++, ...e }, ...s].slice(0, 6));
    }, 2200);
    return () => clearInterval(t);
  }, [active]);
  if (!active) return null;
  return (
    <div className="fixed left-4 top-32 z-30 w-72 pencil-border pencil-card p-2 pencil-anim-slow">
      <div className="display-hand text-lg mb-1">📧 Inbox ({list.length})</div>
      <div className="space-y-1">
        {list.map((e) => (
          <div key={e.id} className="animate-notif border-b border-foreground/30 pb-1 text-sm handwriting">
            <div className="font-bold">{e.from}</div>
            <div className="text-xs text-muted-foreground">{e.subj}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- SOCIAL MEDIA SIDEBAR ---------------- */
export function SocialSidebar({ active }: { active: boolean }) {
  const [stats, setStats] = useState({ followers: 12, likes: 0, dms: 0, mentions: 0 });
  useEffect(() => {
    if (!active) return;
    const t = setInterval(() => {
      setStats((s) => ({
        followers: s.followers + Math.floor(Math.random() * 3) - 1,
        likes: s.likes + Math.floor(Math.random() * 5),
        dms: s.dms + (Math.random() > 0.6 ? 1 : 0),
        mentions: s.mentions + (Math.random() > 0.7 ? 1 : 0),
      }));
    }, 800);
    return () => clearInterval(t);
  }, [active]);
  if (!active) return null;
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-3 pencil-border pencil-card p-2 text-center handwriting pencil-anim-slow">
      <div className="text-xs">👥 {stats.followers}</div>
      <div className="text-xs">❤ {stats.likes}</div>
      <div className="text-xs">✉ {stats.dms}</div>
      <div className="text-xs">@ {stats.mentions}</div>
    </div>
  );
}

/* ---------------- INFINITE SCROLL FEED ---------------- */
const POSTS = [
  "My roommate thinks birds can smell Wi-Fi",
  "BREAKING: Soup discourse escalates",
  "This app ruined my marriage",
  "Just deleted 4000 emails. Felt nothing.",
  "Mercury is in microwave again",
  "Why does my dog file taxes",
  "Local man invents new vowel",
  "Drinking water is for cops",
  "I am the bone of my microwave",
];
export function ScrollFeed({ active, onScrollBulb }: { active: boolean; onScrollBulb: () => void }) {
  const [posts, setPosts] = useState<{ id: number; text: string; likes: number }[]>([]);
  useEffect(() => {
    if (!active) return;
    let id = 0;
    const t = setInterval(() => {
      const p = POSTS[Math.floor(Math.random() * POSTS.length)];
      setPosts((s) => [{ id: id++, text: p, likes: Math.floor(Math.random() * 999) }, ...s].slice(0, 6));
    }, 1300);
    return () => clearInterval(t);
  }, [active]);
  if (!active) return null;
  return (
    <div
      className="fixed left-4 bottom-28 z-30 w-64 max-h-72 overflow-y-auto pencil-border pencil-card p-2 pencil-anim-slow"
      onScroll={onScrollBulb}
    >
      <div className="display-hand text-lg mb-1">∞ Scroll</div>
      {posts.map((p) => (
        <div key={p.id} className="animate-notif border-b border-foreground/30 pb-1 mb-1 text-sm handwriting">
          <div>{p.text}</div>
          <div className="text-[11px] text-muted-foreground">❤ {p.likes} 🔁 💬</div>
        </div>
      ))}
      {/* fake long scroll content */}
      <div style={{ height: 600 }} />
    </div>
  );
}

/* ---------------- ACHIEVEMENT SPAM ---------------- */
const ACHIEVES = [
  "Achievement: Breathed today",
  "Achievement: Blinked 3 times",
  "Achievement: Existed for 4 seconds",
  "Achievement: Clicked a thing",
  "Achievement: Opened your eyes",
  "Achievement: Touched a screen",
  "Achievement: Unlocked Achievement",
];
export function Achievements({ active }: { active: boolean }) {
  const [pop, setPop] = useState<string | null>(null);
  useEffect(() => {
    if (!active) return;
    const t = setInterval(() => {
      setPop(ACHIEVES[Math.floor(Math.random() * ACHIEVES.length)]);
      setTimeout(() => setPop(null), 2500);
    }, 3000);
    return () => clearInterval(t);
  }, [active]);
  if (!active || !pop) return null;
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 pencil-border-thick pencil-card px-5 py-3 animate-notif pencil-anim text-center">
      <div className="display-hand text-2xl">🏆 {pop}</div>
      <div className="handwriting text-xs text-muted-foreground">+0 XP — meaningless!</div>
    </div>
  );
}

/* ---------------- MYSTERY BOX DROPS ---------------- */
export function MysteryBox({ active, onReward }: { active: boolean; onReward: (n: number) => void }) {
  const [boxes, setBoxes] = useState<{ id: number; x: number; y: number }[]>([]);
  useEffect(() => {
    if (!active) return;
    let id = 0;
    const t = setInterval(() => {
      setBoxes((b) => [...b, { id: id++, x: 10 + Math.random() * 80, y: 15 + Math.random() * 70 }].slice(-4));
    }, 5000);
    return () => clearInterval(t);
  }, [active]);
  if (!active) return null;
  return (
    <>
      {boxes.map((b) => (
        <button
          key={b.id}
          className="fixed z-40 text-4xl pencil-anim hover:scale-125 transition-transform"
          style={{ left: `${b.x}%`, top: `${b.y}%` }}
          onClick={(e) => {
            e.stopPropagation();
            onReward(Math.floor(Math.random() * 500) + 50);
            setBoxes((s) => s.filter((x) => x.id !== b.id));
          }}
        >
          🎁
        </button>
      ))}
    </>
  );
}

/* ---------------- FAKE BREAKING NEWS ---------------- */
const NEWS = [
  "🚨 BREAKING: Local duck files for divorce",
  "🚨 BREAKING: Moon spotted being sus",
  "🚨 BREAKING: Bread is up 400% (vs gravity)",
  "🚨 BREAKING: Scientists confirm: clicking IS thinking",
  "🚨 BREAKING: This headline self-aware",
];
export function BreakingNews({ active }: { active: boolean }) {
  const [n, setN] = useState<string[]>([]);
  useEffect(() => {
    if (!active) return;
    const t = setInterval(() => {
      setN((s) => [NEWS[Math.floor(Math.random() * NEWS.length)], ...s].slice(0, 3));
    }, 2200);
    return () => clearInterval(t);
  }, [active]);
  if (!active) return null;
  return (
    <div className="fixed top-2 left-1/2 -translate-x-1/2 z-40 w-[min(90vw,700px)] space-y-1">
      {n.map((x, i) => (
        <div key={i} className="animate-notif pencil-border bg-destructive/15 px-3 py-1 handwriting text-center text-sm pencil-anim-slow">
          {x}
        </div>
      ))}
    </div>
  );
}

/* ---------------- BRAIN ROT GENERATOR ---------------- */
const BRAINROT = [
  "skibidi gyatt rizz",
  "ohio sigma fanum tax",
  "no cap fr fr ong",
  "L + ratio + you fell off",
  "the rizzler from ohio",
  "mewing while gooning",
  "skibidi toilet 47",
  "delulu is the solulu",
];
export function BrainRot({ active }: { active: boolean }) {
  const [text, setText] = useState("");
  useEffect(() => {
    if (!active) return;
    const t = setInterval(() => setText(BRAINROT[Math.floor(Math.random() * BRAINROT.length)]), 1200);
    return () => clearInterval(t);
  }, [active]);
  if (!active || !text) return null;
  return (
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none max-w-[260px] display-hand text-3xl text-accent animate-vibrate">
      {text}
    </div>
  );
}

/* ---------------- FAKE LIVE CHAT ---------------- */
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
    <div className="fixed bottom-4 right-4 z-30 w-64 h-48 pencil-border pencil-card p-2 text-xs overflow-hidden handwriting pencil-anim-slow">
      <div className="display-hand text-base mb-1">💬 Live Chat</div>
      <div className="space-y-0.5">
        {lines.map((l) => (
          <div key={l.id}><span className="text-accent">{l.user}:</span> {l.text}</div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- TRUST ME BUTTON ---------------- */
export function TrustButton({ active, onClick }: { active: boolean; onClick: () => void }) {
  const [pos, setPos] = useState({ x: 30, y: 60 });
  useEffect(() => {
    if (!active) return;
    const t = setInterval(() => setPos({ x: 5 + Math.random() * 80, y: 15 + Math.random() * 70 }), 4000);
    return () => clearInterval(t);
  }, [active]);
  if (!active) return null;
  return (
    <button
      className="fixed z-40 pencil-border-thick bg-destructive text-destructive-foreground px-4 py-2 display-hand text-xl pencil-anim"
      style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
    >
      Trust me 🤝
    </button>
  );
}

/* ---------------- FAKE VIRUS POPUPS ---------------- */
export function VirusPopups({ active }: { active: boolean }) {
  const [popups, setPopups] = useState<{ id: number; x: number; y: number }[]>([]);
  useEffect(() => {
    if (!active) return;
    let id = 0;
    const t = setInterval(() => {
      setPopups((s) => [...s, { id: id++, x: Math.random() * 70, y: Math.random() * 70 }].slice(-3));
    }, 4500);
    return () => clearInterval(t);
  }, [active]);
  if (!active) return null;
  return (
    <>
      {popups.map((p) => (
        <div
          key={p.id}
          className="fixed z-40 pencil-border-thick bg-card pencil-anim w-64"
          style={{ left: `${p.x}%`, top: `${p.y}%` }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-destructive text-destructive-foreground px-2 py-1 flex justify-between handwriting">
            ⚠ WINDOWS DEFENDER
            <button onClick={() => setPopups((s) => s.filter((x) => x.id !== p.id))}>✕</button>
          </div>
          <div className="p-3 handwriting text-sm">
            Your PC has <b>{Math.floor(Math.random() * 99) + 1}</b> viruses!<br />
            Click HERE to remove (probably more)
          </div>
        </div>
      ))}
    </>
  );
}

/* ---------------- RANDOM DM MESSAGES ---------------- */
const DMS = [
  { user: "stranger_42", msg: "hi can u send me 5 bulbs pls" },
  { user: "ur_ex", msg: "u up?" },
  { user: "spam_bot", msg: "hot singles in your taskbar" },
  { user: "boss_99", msg: "where r u???" },
  { user: "mom", msg: "did u eat" },
  { user: "scammer", msg: "ur grandson is in jail send btc" },
];
export function RandomDMs({ active }: { active: boolean }) {
  const [dms, setDms] = useState<{ id: number; user: string; msg: string }[]>([]);
  useEffect(() => {
    if (!active) return;
    let id = 0;
    const t = setInterval(() => {
      const d = DMS[Math.floor(Math.random() * DMS.length)];
      setDms((s) => [...s, { id: id++, ...d }].slice(-4));
    }, 3500);
    return () => clearInterval(t);
  }, [active]);
  if (!active) return null;
  return (
    <div className="fixed top-1/2 right-4 -translate-y-1/2 z-30 w-64 space-y-2">
      {dms.map((d) => (
        <div key={d.id} className="animate-notif pencil-border pencil-card p-2 handwriting text-sm pencil-anim-slow">
          <div className="font-bold">@{d.user}</div>
          <div className="text-muted-foreground">{d.msg}</div>
        </div>
      ))}
    </div>
  );
}

/* ---------------- CURSOR EVOLUTION ---------------- */
export function CursorEvolution({ active, level }: { active: boolean; level: number }) {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  useEffect(() => {
    if (!active) return;
    const h = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, [active]);
  if (!active) return null;
  const size = Math.min(200, 24 + level * 4);
  return (
    <div
      className="fixed pointer-events-none z-50 pencil-anim"
      style={{
        left: pos.x,
        top: pos.y,
        width: size,
        height: size,
        transform: `translate(-50%, -50%)`,
        borderRadius: "50%",
        background: `radial-gradient(circle, oklch(0.85 0.16 90 / 0.5), transparent 70%)`,
        boxShadow: `0 0 ${size}px oklch(0.85 0.16 90 / 0.6)`,
      }}
    />
  );
}

/* ---------------- CHAOS METER ---------------- */
export function ChaosMeter({ active, value }: { active: boolean; value: number }) {
  if (!active) return null;
  const pct = Math.min(100, value);
  return (
    <div className="fixed top-40 right-4 z-40 w-56">
      <div className="display-hand text-base mb-1">⚡ Chaos Level</div>
      <div className="h-4 pencil-border bg-card overflow-hidden">
        <div
          className="h-full transition-all duration-500"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, oklch(0.7 0.18 80), oklch(0.55 0.22 25))`,
          }}
        />
      </div>
      <div className="text-xs handwriting text-muted-foreground">{Math.floor(pct)}% unhinged</div>
    </div>
  );
}

/* ---------------- FLOATING YOUTUBE ---------------- */
export function FloatingYouTube({ ytId, idx }: { ytId: string; idx: number }) {
  const positions = ["top-32 left-24", "bottom-48 right-24", "top-1/3 right-1/4"];
  return (
    <div className={`fixed ${positions[idx % 3]} z-30 w-80 h-48 pencil-border-thick overflow-hidden animate-wiggle`}>
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

/* ---------------- BULB POP ---------------- */
export function BulbPop({ x, y, id }: { x: number; y: number; id: number }) {
  return (
    <img
      key={id}
      src={bulbImg}
      alt=""
      className="pixel-img animate-bulb-rise pointer-events-none fixed z-50 w-12 h-12"
      style={{ left: x, top: y, opacity: 0.7 }}
    />
  );
}
