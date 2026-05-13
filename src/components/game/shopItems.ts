export type ShopItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  cps: number;
  tier: "normal" | "legend" | "finish";
  ytId?: string;
};

export const SHOP_ITEMS: ShopItem[] = [
  { id: "daynight", name: "Day & Night Cycle", description: "Hand-drawn sun, moon, scribbled stars. Sky flips every 59s.", price: 50, cps: 1, tier: "normal" },
  { id: "sounds", name: "Classical Music & Click Sounds", description: "Pencil-sharp clicks + classical bg music (keeps playing forever).", price: 200, cps: 2, tier: "normal" },
  { id: "notifs", name: "Notification Flood", description: "Endless little anxiety pings stacking up.", price: 600, cps: 3, tier: "normal" },
  { id: "email", name: "Fake Email Inbox", description: "Spam, scams, fake rewards — refresh forever.", price: 1500, cps: 6, tier: "normal" },
  { id: "social", name: "Social Media Sidebar", description: "Tiny fake OS sidebar — likes, follows, dms.", price: 3500, cps: 10, tier: "normal" },
  { id: "scroll", name: "Infinite Scroll Feed", description: "Doomposts that never end. Scroll = bulbs.", price: 7000, cps: 18, tier: "normal" },
  { id: "achievements", name: "Achievement Spam", description: "Constant fake validation. You earned: Breathing!", price: 14000, cps: 30, tier: "normal" },
  { id: "mystery", name: "Mystery Box Drops", description: "Random dopamine. Open boxes for surprise bulbs.", price: 28000, cps: 55, tier: "normal" },
  { id: "news", name: "Fake Breaking News Alerts", description: "BREAKING: a duck has filed taxes.", price: 55000, cps: 90, tier: "normal" },
  { id: "brainrot", name: "Brain Rot Generator", description: "Skibidi gyatt sigma rizz on loop.", price: 110000, cps: 160, tier: "normal" },
  { id: "chat", name: "Fake Live Chat Chaos", description: "Twitch-style scrolling spam chat.", price: 220000, cps: 240, tier: "normal" },
  { id: "trust", name: '"Trust Me" Button', description: "A red button. Don't click it. Or do.", price: 400000, cps: 320, tier: "normal" },
  { id: "virus", name: "Fake Virus Popups", description: "Your PC has 47 viruses. Click here to panic.", price: 700000, cps: 420, tier: "normal" },
  { id: "dms", name: "Random DM Messages", description: "Hi, can u send me 5 bulbs pls.", price: 1100000, cps: 540, tier: "normal" },
  { id: "cursor", name: "Cursor Evolution", description: "Your cursor grows. And grows. And glows.", price: 1700000, cps: 700, tier: "normal" },
  { id: "chaosmeter", name: "Chaos Meter", description: "Track your descent. The meter never lies.", price: 2500000, cps: 900, tier: "normal" },
  // LEGEND
  { id: "yt1", name: "LEGEND: Barchasiga Qimor Aybdormi?", description: "Embedded autoplay video, drifting around your screen.", price: 4000000, cps: 1200, tier: "legend", ytId: "_RY4nsE6hfg" },
  { id: "yt2", name: "LEGEND: ФРЭН БОЙ ► Creepy Tale #1", description: "Another autoplaying haunting.", price: 6500000, cps: 1700, tier: "legend", ytId: "Zg4OX0WwE9c" },
  { id: "yt3", name: "LEGEND: ЗЛО ВЕРНУЛОСЬ ► Creepy Tale 2", description: "The third autoplaying horror.", price: 10000000, cps: 2400, tier: "legend", ytId: "i16k_x7l8uk" },
  { id: "msg", name: "LEGEND: Message to Streamer", description: "Generates a personal message you can copy.", price: 16000000, cps: 3500, tier: "legend" },
  // FINISH
  { id: "cup", name: "FINISH: The Trophy", description: "Clear all chaos. Win the game.", price: 30000000, cps: 0, tier: "finish" },
];
