import { useEffect, useRef, useState } from "react";
import bulbImg from "@/assets/bulb.png";
import heartImg from "@/assets/heart.png";
import cupImg from "@/assets/cup.png";
import { Shop } from "./Shop";
import { DayNightCycle } from "./DayNight";
import { PencilFilter } from "./PencilFilter";
import {
  Notifications, EmailInbox, SocialSidebar, ScrollFeed, Achievements,
  MysteryBox, BreakingNews, BrainRot, FakeChat, TrustButton, VirusPopups,
  RandomDMs, CursorEvolution, ChaosMeter, FloatingYouTube, BulbPop,
} from "./Effects";
import { SHOP_ITEMS, type ShopItem } from "./shopItems";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TasksTab } from "./TasksTab";
import { ArrowLeftRight } from "lucide-react";

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
  const [chaos, setChaos] = useState(0);
  const popId = useRef(0);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const musicRef = useRef<HTMLAudioElement | null>(null);
  const musicStartedRef = useRef(false);

  // tasks tab state
  const [view, setView] = useState<"main" | "tasks">("main");
  void 0;
  const [stars, setStars] = useState(0);
  const [tasksOwned, setTasksOwned] = useState<Set<string>>(new Set());
  const [pendingBulbs, setPendingBulbs] = useState(0);
  const [pendingNote, setPendingNote] = useState<number | null>(null);
  const tasksUnlocked = owned.has("tasksUnlock");

  const switchView = (target: "main" | "tasks") => {
    if (target === view) return;
    void (target === "tasks" ? "right" : "left");
    if (target === "main" && pendingBulbs > 0) {
      setPendingNote(pendingBulbs);
      setPendingBulbs(0);
    }
    setView(target);
  };

  // keyboard shortcut: Cmd/Ctrl + Arrow
  useEffect(() => {
    if (!tasksUnlocked) return;
    const h = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey)) return;
      if (e.key === "ArrowRight") switchView("tasks");
      if (e.key === "ArrowLeft") switchView("main");
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [tasksUnlocked, view, pendingBulbs]);

  const cps = Array.from(owned).reduce((sum, id) => {
    const it = SHOP_ITEMS.find((x) => x.id === id);
    return sum + (it?.cps ?? 0);
  }, 0);

  // chaos meter grows with owned items
  useEffect(() => {
    setChaos(Math.min(100, owned.size * 6));
  }, [owned]);

  // Auto-clicks
  useEffect(() => {
    if (cps <= 0) return;
    const t = setInterval(() => setBulbs((b) => b + cps / 10), 100);
    return () => clearInterval(t);
  }, [cps]);

  // Background music — start ONCE when sounds purchased; never stop on later purchases.
  const hasSounds = owned.has("sounds");
  useEffect(() => {
    if (!hasSounds || winning || musicStartedRef.current) return;
    musicStartedRef.current = true;
    let idx = 0;
    const play = () => {
      const a = new Audio(MUSIC[idx % MUSIC.length]);
      a.volume = 0.35;
      a.play().catch(() => {});
      a.onended = () => { idx++; play(); };
      musicRef.current = a;
    };
    play();
  }, [hasSounds, winning]);

  // Pause music only on win
  useEffect(() => {
    if (winning && musicRef.current) {
      musicRef.current.pause();
    }
  }, [winning]);

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
    if (item.id === "tasksUnlock") {
      setTimeout(() => switchView("tasks"), 350);
    }
  };

  const buyTask = (id: string, cost: number) => {
    if (stars < cost || tasksOwned.has(id)) return false;
    setStars((s) => s - cost);
    setTasksOwned((o) => new Set(o).add(id));
    return true;
  };

  const triggerWin = () => {
    setWinning(true);
    if (musicRef.current) musicRef.current.pause();
    const a = new Audio("/audio/immortal.m4a");
    a.volume = 0.7;
    a.play().catch(() => {});
    setTimeout(() => setWon(true), 4500);
  };

  const ytItems = SHOP_ITEMS.filter((i) => i.tier === "legend" && i.ytId && owned.has(i.id));
  const cursorLevel = owned.has("cursor") ? owned.size : 0;

  return (
    <div className="relative min-h-screen w-full select-none overflow-hidden">
      <PencilFilter />

      {/* Sliding view container */}
      {!winning && onIntroDone && (
        <div
          key={view}
          className={view === "tasks" ? "animate-mac-right" : "animate-mac-left"}
        >
          {view === "main" ? (
            <div className="relative min-h-screen cursor-pointer" onClick={handleClick}>
              <DayNightCycle active={owned.has("daynight") && !winning} />

              <Shop bulbs={Math.floor(bulbs)} owned={owned} onBuy={buy} />

              {/* Score */}
              <div className="fixed top-4 right-4 z-40 flex items-center gap-2 pencil-border-thick pencil-card px-4 py-2 pencil-anim-slow">
                <span className="text-3xl display-hand tabular-nums">{Math.floor(bulbs).toLocaleString()}</span>
                <img src={bulbImg} alt="bulbs" className="pixel-img w-8 h-8" />
                {cps > 0 && <span className="text-sm handwriting text-muted-foreground ml-2">+{cps}/s</span>}
              </div>

              {/* Center clickable area */}
              <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4 pointer-events-none">
                <h1 className="text-6xl md:text-9xl display-hand text-foreground leading-none drop-shadow-sm">
                  JUST CLICK
                </h1>
                <p className="text-base md:text-lg handwriting text-foreground/80 mt-3">~ just start clicking to get started ~</p>
                <div className="mt-8 pointer-events-none pencil-anim">
                  <img src={bulbImg} alt="" className="pixel-img w-32 h-32 drop-shadow-2xl" />
                </div>
              </div>

              {/* Effects layered */}
              <Notifications active={owned.has("notifs")} />
              <EmailInbox active={owned.has("email")} />
              <SocialSidebar active={owned.has("social")} />
              <ScrollFeed active={owned.has("scroll")} onScrollBulb={() => setBulbs((b) => b + 0.1)} />
              <Achievements active={owned.has("achievements")} />
              <MysteryBox active={owned.has("mystery")} onReward={(n) => setBulbs((b) => b + n)} />
              <BreakingNews active={owned.has("news")} />
              <BrainRot active={owned.has("brainrot")} />
              <FakeChat active={owned.has("chat")} />
              <TrustButton active={owned.has("trust")} onClick={() => setBulbs((b) => b + 100)} />
              <VirusPopups active={owned.has("virus")} />
              <RandomDMs active={owned.has("dms")} />
              <CursorEvolution active={owned.has("cursor")} level={cursorLevel} />
              <ChaosMeter active={owned.has("chaosmeter")} value={chaos} />
              {ytItems.map((y, i) => <FloatingYouTube key={y.id} ytId={y.ytId!} idx={i} />)}

              {/* Bulb pops */}
              {pops.map((p) => <BulbPop key={p.id} id={p.id} x={p.x} y={p.y} />)}
            </div>
          ) : (
            <TasksTab
              stars={stars}
              setStars={setStars}
              tasksOwned={tasksOwned}
              buyTask={buyTask}
              onBulbReward={(n) => { setBulbs((b) => b + n); setPendingBulbs((p) => p + n); }}
            />
          )}
        </div>
      )}

      {/* Floating drawn-arrow tab switcher */}
      {tasksUnlocked && !winning && onIntroDone && (
        <button
          onClick={() => switchView(view === "main" ? "tasks" : "main")}
          className="fixed bottom-6 right-6 z-[60] pencil-border-thick pencil-card px-3 py-2 pencil-anim flex items-center gap-2 handwriting text-base"
          title="Cmd/Ctrl + ← → to switch"
        >
          <ArrowLeftRight className="w-4 h-4" />
          <span className="display-hand text-lg">
            {view === "main" ? "→ Tasks" : "← Main"}
          </span>
        </button>
      )}

      {/* Pending bulb note when returning to main */}
      <Dialog open={pendingNote !== null} onOpenChange={(o) => !o && setPendingNote(null)}>
        <DialogContent className="pencil-border-thick max-w-sm">
          <DialogHeader>
            <DialogTitle className="display-hand text-2xl">You earned bulbs!</DialogTitle>
            <DialogDescription className="handwriting">
              You completed tasks and gathered{" "}
              <b>{pendingNote?.toLocaleString()}</b> bulbs while you were away.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2">
            <Button className="flex-1 pencil-border" onClick={() => setPendingNote(null)}>Accept</Button>
            <Button variant="secondary" className="pencil-border" onClick={() => {
              setBulbs((b) => Math.max(0, b - (pendingNote ?? 0)));
              setPendingNote(null);
            }}>Deny</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Winning trophy */}
      {winning && (
        <div className="fixed inset-0 z-[100] bg-gradient-to-b from-yellow-200 via-amber-300 to-orange-400 flex items-center justify-center overflow-hidden">
          <img src={cupImg} alt="trophy" className="pixel-img absolute left-1/2 top-1/2 w-64 h-64 animate-cup-zoom" />
          {won && (
            <div className="absolute inset-0 flex items-center justify-center p-6">
              <div className="pencil-border-thick pencil-card p-8 max-w-lg text-center animate-notif">
                <img src={heartImg} alt="" className="pixel-img w-12 h-12 mx-auto mb-2" />
                <h2 className="text-4xl display-hand mb-3">You Beat JUST CLICK!</h2>
                <p className="handwriting text-foreground/80 mb-4">
                  You survived the chaos. You collected every idea. You silenced every notification.
                  You are now officially the #1 Clicker of the void. Thank you for playing.
                </p>
                <div className="flex flex-col gap-2 handwriting">
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
        <DialogContent className="pencil-border-thick">
          <DialogHeader>
            <DialogTitle className="display-hand text-2xl">Who is your favorite streamer?</DialogTitle>
            <DialogDescription className="handwriting">We'll generate a polite request you can send them.</DialogDescription>
          </DialogHeader>
          <Input value={streamerName} onChange={(e) => setStreamerName(e.target.value)} placeholder="Streamer name" />
          <Button onClick={() => { setStreamerDlg(false); setShowMessage(true); }} disabled={!streamerName}>Generate Message</Button>
        </DialogContent>
      </Dialog>

      <Dialog open={showMessage} onOpenChange={setShowMessage}>
        <DialogContent className="max-w-xl pencil-border-thick">
          <DialogHeader><DialogTitle className="display-hand text-2xl">Message for {streamerName}</DialogTitle></DialogHeader>
          <div className="text-sm whitespace-pre-wrap handwriting bg-muted p-4 rounded-md max-h-80 overflow-y-auto">
{`Dear streamer ${streamerName},

Thank you so much for playing JUST CLICK — it genuinely means the world to me to see someone like you take the time to click through every chaotic upgrade and survive the stimulation. Your reactions made the whole thing come alive.

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
