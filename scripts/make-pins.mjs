// Generate upgraded "Bold Split" (Concept B) Pinterest pins (1000x1500) for each article.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "..", "pins");
fs.mkdirSync(OUT, { recursive: true });

const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700;9..144,900&family=Archivo:wght@500;600;700;800&display=swap" rel="stylesheet">`;

// Per-article pin content. `num` drives the hero number for listicles; otherwise `emoji` shows in a badge.
// `accent` swaps the top color block so the batch isn't monotone.
const PINS = {
  "make-small-room-look-bigger":                 { kicker: "SMALL-SPACE TRICKS", num: "12", head: "Ways to Make a Small Room Look Bigger", sub: "Designer tricks using light, mirrors, and layout.", accent: "teal" },
  "space-saving-furniture-small-apartments":     { kicker: "TINY APARTMENT",     num: "15", head: "Space-Saving Furniture Pieces That Actually Work", sub: "Multi-tasking picks worth your square footage.", accent: "clay" },
  "organize-tiny-kitchen-no-counter-space":      { kicker: "SMALL KITCHENS",     emoji: "🍳", head: "Organize a Tiny Kitchen With No Counter Space", sub: "A room-by-room system that frees up space.", accent: "plum" },
  "renter-friendly-upgrades-deposit-safe":       { kicker: "RENTER-FRIENDLY",    num: "23", head: "Renter Upgrades That Won't Cost Your Deposit", sub: "Damage-free ways to upgrade any rental.", accent: "teal" },
  "best-over-the-door-organizers-small-apartments": { kicker: "ORGANIZATION",   emoji: "🚪", head: "The Best Over-the-Door Organizers", sub: "Turn every door into hidden storage — no tools.", accent: "clay" },
  "best-under-bed-storage-containers":           { kicker: "STORAGE HACKS",      emoji: "🛏️", head: "The Best Under-Bed Storage for Small Bedrooms", sub: "Reclaim the biggest wasted space in the room.", accent: "teal" },
  "best-closet-organizers-small-apartments":     { kicker: "CLOSET GOALS",       emoji: "👔", head: "Double Your Small Closet", sub: "A complete, no-install system for renters.", accent: "plum" },
  "small-bathroom-storage-ideas-renters":        { kicker: "RENTER-FRIENDLY",    emoji: "🚿", head: "Small Bathroom Storage Ideas (No Drilling)", sub: "Add shelves and order without a single hole.", accent: "clay" },
  "home-office-tiny-apartment":                  { kicker: "WORK FROM HOME",     emoji: "💻", head: "Set Up a Home Office in a Tiny Apartment", sub: "A real workspace that folds away after 5.", accent: "teal" },
  "best-room-dividers-studio-apartments":        { kicker: "STUDIO LIVING",      emoji: "🚪", head: "The Best Room Dividers for Studio Apartments", sub: "Zone one room without building a single wall.", accent: "plum" },
};

const ACCENTS = {
  teal: { top: "linear-gradient(160deg,#2f7d6b 0%,#245e51 100%)", badge: "#c9772f", eyebrow: "#bfe4da", cta: "#2f7d6b" },
  clay: { top: "linear-gradient(160deg,#c9772f 0%,#a85f22 100%)", badge: "#2f7d6b", eyebrow: "#ffe6c9", cta: "#c9772f" },
  plum: { top: "linear-gradient(160deg,#7d5a86 0%,#5d4064 100%)", badge: "#c9772f", eyebrow: "#e4d3ea", cta: "#7d5a86" },
};

function pinHtml({ kicker, num, emoji, head, sub, accent }) {
  const a = ACCENTS[accent] || ACCENTS.teal;
  const hero = num
    ? `<div class="num">${num}</div>`
    : `<div class="emojibadge">${emoji}</div>`;
  const headline = num ? `${num} ${head}` : head;
  return `<!doctype html><html><head><meta charset="utf-8">${FONTS}<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{width:1000px;height:1500px}
  .pin{width:1000px;height:1500px;position:relative;overflow:hidden;background:#f7efe4;font-family:'Archivo',sans-serif}
  .top{height:730px;background:${a.top};position:relative;padding:70px 74px}
  .brand{font-family:'Fraunces';font-weight:700;font-size:44px;color:#f7efe4}
  .brand span{opacity:.75}
  .eyebrow{position:absolute;top:250px;left:74px;color:${a.eyebrow};font-weight:800;letter-spacing:5px;font-size:29px}
  .num{position:absolute;top:250px;left:68px;font-family:'Fraunces';font-weight:900;font-size:400px;line-height:.78;color:#ffffff;opacity:.15;letter-spacing:-12px}
  .emojibadge{position:absolute;top:330px;left:74px;width:230px;height:230px;background:rgba(255,255,255,.14);border:3px solid rgba(255,255,255,.35);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:120px}
  .card{position:absolute;top:600px;left:58px;right:58px;bottom:64px;background:#fff;border-radius:36px;box-shadow:0 26px 64px rgba(60,40,15,.20);padding:62px 58px;display:flex;flex-direction:column}
  .badge{align-self:flex-start;background:${a.badge};color:#fff;font-weight:700;font-size:23px;letter-spacing:1.5px;padding:11px 22px;border-radius:999px;margin-bottom:28px}
  .head{font-family:'Fraunces';font-weight:700;font-size:78px;line-height:1.06;color:#22201d;letter-spacing:-1.5px}
  .sub{font-size:36px;line-height:1.35;color:#6c6459;margin-top:26px;font-weight:500}
  .foot{margin-top:auto;display:flex;align-items:center;justify-content:space-between;border-top:2px solid #eee5d7;padding-top:26px}
  .cta{font-family:'Archivo';font-weight:700;font-size:33px;color:${a.cta}}
  .url{font-weight:700;font-size:30px;color:#a99a86}
  </style></head><body><div class="pin">
    <div class="top">
      <div class="brand">Snug<span>Nook</span></div>
      ${hero}
      <div class="eyebrow">${kicker}</div>
    </div>
    <div class="card">
      <span class="badge">SMALL-SPACE LIVING</span>
      <div class="head">${headline}</div>
      <div class="sub">${sub}</div>
      <div class="foot"><span class="cta">Read the full guide →</span><span class="url">snugnook.net</span></div>
    </div>
  </div></body></html>`;
}

for (const [slug, meta] of Object.entries(PINS)) {
  fs.writeFileSync(path.join(OUT, `${slug}.html`), pinHtml(meta));
}
console.log("Wrote", Object.keys(PINS).length, "Bold-Split pin HTML files to", OUT);
