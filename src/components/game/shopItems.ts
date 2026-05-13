export type ShopItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  cps: number; // bulbs per second auto-click
  tier: "normal" | "legend" | "finish";
  ytId?: string;
};

export const SHOP_ITEMS: ShopItem[] = [
  { id: "daynight", name: "Day & Night Cycle", description: "Bring light and stars to your void. Sky shifts every 59s.", price: 50, cps: 1, tier: "normal" },
  { id: "sounds", name: "Sound Effects & Music", description: "Click sounds + classical background music.", price: 200, cps: 2, tier: "normal" },
  { id: "notifs", name: "Infinite Fake Notifications", description: "Tiny anxiety-inducing alerts stack up.", price: 600, cps: 3, tier: "normal" },
  { id: "drama", name: "AI Drama Feed", description: "Unhinged social posts, refreshing forever.", price: 1500, cps: 6, tier: "normal" },
  { id: "tasks", name: "Fake Productivity System", description: "Useless tasks unlock more useless tasks.", price: 3500, cps: 10, tier: "normal" },
  { id: "ragebait", name: "Ragebait Headlines", description: "Doctors HATE this clicker game.", price: 7000, cps: 18, tier: "normal" },
  { id: "conspiracy", name: "Conspiracy Rabbit Holes", description: "Bananas linked to lunar banking.", price: 14000, cps: 30, tier: "normal" },
  { id: "chat", name: "Fake Live Chat Chaos", description: "Twitch-style scrolling spam chat.", price: 28000, cps: 55, tier: "normal" },
  { id: "moral", name: "Moral Choice Spam", description: "Ignore friend? Donate? React?", price: 55000, cps: 90, tier: "normal" },
  { id: "ads", name: "Sentient Fake Ads", description: "Please click me. I have children.", price: 110000, cps: 160, tier: "normal" },
  { id: "fragment", name: "Attention Fragmentation UI", description: "Bouncing, vibrating, overlapping mayhem.", price: 220000, cps: 280, tier: "normal" },
  // LEGEND
  { id: "yt1", name: "LEGEND: Barchasiga Qimor Aybdormi?", description: "Embedded autoplay video, drifting around your screen.", price: 500000, cps: 500, tier: "legend", ytId: "_RY4nsE6hfg" },
  { id: "yt2", name: "LEGEND: ФРЭН БОЙ ► Creepy Tale #1", description: "Another autoplaying haunting.", price: 900000, cps: 800, tier: "legend", ytId: "Zg4OX0WwE9c" },
  { id: "yt3", name: "LEGEND: ЗЛО ВЕРНУЛОСЬ ► Creepy Tale 2", description: "The third autoplaying horror.", price: 1500000, cps: 1300, tier: "legend", ytId: "i16k_x7l8uk" },
  { id: "msg", name: "LEGEND: Message to Streamer", description: "Generates a personal message you can copy.", price: 2500000, cps: 2000, tier: "legend" },
  // FINISH
  { id: "cup", name: "FINISH: The Trophy", description: "Clear all chaos. Win the game.", price: 5000000, cps: 0, tier: "finish" },
];
