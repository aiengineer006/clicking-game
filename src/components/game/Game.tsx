import { useEffect, useRef, useState } from "react";
import bulbImg from "@/assets/bulb.png";
import heartImg from "@/assets/heart.png";
import cupImg from "@/assets/cup.png";
import { Shop } from "./Shop";
import { DayNightCycle } from "./DayNight";
import {
  Notifications, DramaFeed, Tasks, Ragebait, Conspiracy,
  FakeChat, Moral, Ads, FragmentationOverlay, FloatingYouTube, BulbPop,
} from "./Effects";
import { SHOP_ITEMS, type ShopItem } from "./shopItems";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const MUSIC = [
  "/audio/gymnopedie.mp3",
  "/audio/moonlight.mp3",
  "/audio/danse-macabre.mp3",
  "/audio/shadows-bride.mp3",
];

export function Game({ onIntroDone }: { onIntroDone: boolean }) {
  const [bulbs, setBulbs] = useState(0);
  const [clickPower] = useState(1);
  const [owned, setOwned] = useState<Set<string>>(new Set());
  const [pops, setPops] = useState<{ id: number; x: number; y: number }[]>([]);
  const [streamerDlg, setStreamerDlg] = useState(false);
  const [streamerName, setStreamerName] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [winning, setWinning] = useState(false);
  const [won, setWon] = useState(false);
  const popId = useRef(0);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const musicRef = useRef<HTMLAudioElement | null>(null);
  const winRef = useRef<HTMLAudioElement | null>(null);

  const cps = Array.from(owned).reduce((sum, id) => {
    const it = SHOP_ITEMS.find((x) => x.id === id);
    return sum + (it?.cps ?? 0);
  }, 0);

  // Auto-clicks
  useEffect(() => {
    if (cps <= 0) return;
    const t = setInterval(() => setBulbs((b) => b + cps / 10), 100);
    return () => clearInterval(t);
  }, [cps]);

  // Background music when sounds owned
  useEffect(() => {
    if (!owned.has("sounds") || winning) {
      if (musicRef.current) { musicRef.current.pause(); musicRef.current = null; }
      return;
    }
    let idx = 0;
    const play = () => {
      const a = new Audio(MUSIC[idx % MUSIC.length]);
      a.volume = 0.35;
      a.play().catch(() => {});
      a.onended = () => { idx++; play(); };
      musicRef.current = a;
    };
    play();
    return () => { if (musicRef.current) musicRef.current.pause(); };
  }, [owned, winning]);

  const playClickSound = () => {
    if (!owned.has("sounds")) return;
    try {
      if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = 600 + Math.random() * 400;
      osc.type = "triangle";
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch {}
  };

  const handleClick = (e: React.MouseEvent) => {
    if (winning || won) return;
    setBulbs((b) => b + clickPower);
    setPops((p) => [...p, { id: popId.current++, x: e.clientX, y: e.clientY }]);
    playClickSound();
    setTimeout(() => setPops((p) => p.slice(1)), 1200);
  };

  const buy = (item: ShopItem) => {
    if (bulbs < item.price || owned.has(item.id)) return;
    setBulbs((b) => b - item.price);
    setOwned((o) => new Set(o).add(item.id));
    if (item.id === "msg") setStreamerDlg(true);
    if (item.id === "cup") triggerWin();
  };

  const triggerWin = () => {
    setWinning(true);
    if (musicRef.current) musicRef.current.pause();
    const a = new Audio("/audio/immortal.m4a");
    a.volume = 0.7;
    a.play().catch(() => {});
    winRef.current = a;
    setTimeout(() => setWon(true), 4500);
  };

  const ytItems = SHOP_ITEMS.filter((i) => i.tier === "legend" && i.ytId && owned.has(i.id));

  return (
    <div
      className={`relative min-h-screen w-full select-none cursor-pointer ${owned.has("fragment") ? "" : ""}`}
      onClick={handleClick}
    >
      <DayNightCycle active={owned.has("daynight") && !winning} />

      {/* Pre-daynight darkness already handled */}
      {!winning && onIntroDone && <Shop bulbs={Math.floor(bulbs)} owned={owned} onBuy={buy} />}

      {/* Score */}
      {!winning && onIntroDone && (
        <div className="fixed top-4 right-4 z-40 flex items-center gap-2 bg-card/80 backdrop-blur border border-border rounded-md px-4 py-2 shadow-lg">
          <span className="text-2xl font-bold tabular-nums">{Math.floor(bulbs).toLocaleString()}</span>
          <img src={bulbImg} alt="bulbs" className="pixel-img w-8 h-8" />
          {cps > 0 && <span className="text-xs text-muted-foreground ml-2">+{cps}/s</span>}
        </div>
      )}

      {/* Center clickable area */}
      {onIntroDone && !winning && (
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4 pointer-events-none">
          <h1 className="text-5xl md:text-7xl font-black tracking-tight drop-shadow-lg">Idea Storm</h1>
          <p className="text-sm md:text-base text-foreground/80 mt-3 drop-shadow">Just start clicking to get started</p>
          <div className="mt-8 pointer-events-none">
            <img src={bulbImg} alt="" className="pixel-img w-32 h-32 drop-shadow-2xl animate-pulse" />
          </div>
        </div>
      )}

      {/* Effects layered */}
      {!winning && (
        <>
          <Notifications active={owned.has("notifs")} />
          <DramaFeed active={owned.has("drama")} />
          <Tasks active={owned.has("tasks")} />
          <Ragebait active={owned.has("ragebait")} />
          <Conspiracy active={owned.has("conspiracy")} />
          <FakeChat active={owned.has("chat")} />
          <Moral active={owned.has("moral")} />
          <Ads active={owned.has("ads")} />
          <FragmentationOverlay active={owned.has("fragment")} />
          {ytItems.map((y, i) => <FloatingYouTube key={y.id} ytId={y.ytId!} idx={i} />)}
        </>
      )}

      {/* Bulb pops */}
      {pops.map((p) => <BulbPop key={p.id} id={p.id} x={p.x} y={p.y} />)}

      {/* Winning trophy */}
      {winning && (
        <div className="fixed inset-0 z-[100] bg-gradient-to-b from-yellow-300 via-amber-400 to-orange-500 flex items-center justify-center overflow-hidden">
          <img src={cupImg} alt="trophy" className="pixel-img absolute left-1/2 top-1/2 w-64 h-64 animate-cup-zoom" />
          {won && (
            <div className="absolute inset-0 flex items-center justify-center p-6">
              <div className="bg-card/95 border-2 border-primary rounded-lg p-8 max-w-lg text-center shadow-2xl animate-notif">
                <img src={heartImg} alt="" className="pixel-img w-12 h-12 mx-auto mb-2" />
                <h2 className="text-3xl font-black mb-3">You Beat Idea Storm!</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  You survived the chaos. You collected every idea. You silenced every notification.
                  You are now officially the #1 Streamer of the void. Thank you for playing.
                </p>
                <div className="flex flex-col gap-2 text-sm">
                  <a href="https://github.com" target="_blank" rel="noreferrer" className="text-accent hover:underline">→ GitHub</a>
                  <a href="https://x.com" target="_blank" rel="noreferrer" className="text-accent hover:underline">→ Twitter / X</a>
                  <a href="https://youtube.com" target="_blank" rel="noreferrer" className="text-accent hover:underline">→ YouTube</a>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Streamer name dialog */}
      <Dialog open={streamerDlg} onOpenChange={setStreamerDlg}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Who is your favorite streamer?</DialogTitle>
            <DialogDescription>We'll generate a polite request you can send them.</DialogDescription>
          </DialogHeader>
          <Input value={streamerName} onChange={(e) => setStreamerName(e.target.value)} placeholder="Streamer name" />
          <Button onClick={() => { setStreamerDlg(false); setShowMessage(true); }} disabled={!streamerName}>Generate Message</Button>
        </DialogContent>
      </Dialog>

      <Dialog open={showMessage} onOpenChange={setShowMessage}>
        <DialogContent className="max-w-xl">
          <DialogHeader><DialogTitle>Message for {streamerName}</DialogTitle></DialogHeader>
          <div className="text-sm whitespace-pre-wrap bg-muted p-4 rounded-md max-h-80 overflow-y-auto">
{`Dear streamer ${streamerName},

Thank you so much for playing my game — it genuinely means the world to me to see someone like you take the time to click through every chaotic upgrade and survive the stimulation. Your reactions made the whole thing come alive.

I would be over the moon if you considered making a video on Creepy Tale 1 and Creepy Tale 2. I think your sense of timing and humor would pair perfectly with the eerie atmosphere of those games, and your audience would absolutely love the mix of dread and discovery.

Thanks again for everything you do for indie creators like me.

Sincerely,
A grateful fan`}
          </div>
          <Button onClick={() => navigator.clipboard.writeText(document.querySelector(".whitespace-pre-wrap")?.textContent ?? "")}>
            Copy to clipboard
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
