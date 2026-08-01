// Generate vertical (1000x1500) Pinterest pin images for each article.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT = path.join(__dirname, "..", "content");
const OUT = path.join(__dirname, "..", "pins");
fs.mkdirSync(OUT, { recursive: true });

// Pin-optimized headlines (punchier than SEO titles) + the search phrase vibe.
const PINS = {
  "make-small-room-look-bigger": { kicker: "SMALL SPACE TRICKS", title: "12 Ways to Make a Small Room Look Bigger", emoji: "🪞" },
  "space-saving-furniture-small-apartments": { kicker: "TINY APARTMENT", title: "15 Space-Saving Furniture Pieces That Actually Work", emoji: "🛋️" },
  "organize-tiny-kitchen-no-counter-space": { kicker: "SMALL KITCHENS", title: "How to Organize a Tiny Kitchen With No Counter Space", emoji: "🍳" },
  "renter-friendly-upgrades-deposit-safe": { kicker: "RENTER-FRIENDLY", title: "23 Renter Upgrades That Won't Cost Your Deposit", emoji: "🔑" },
  "best-over-the-door-organizers-small-apartments": { kicker: "ORGANIZATION", title: "The Best Over-the-Door Organizers for Small Homes", emoji: "🚪" },
  "best-under-bed-storage-containers": { kicker: "STORAGE HACKS", title: "The Best Under-Bed Storage for Small Bedrooms", emoji: "🛏️" },
  "best-closet-organizers-small-apartments": { kicker: "CLOSET GOALS", title: "Double Your Small Closet: The Complete System", emoji: "👔" },
  "small-bathroom-storage-ideas-renters": { kicker: "RENTER-FRIENDLY", title: "Small Bathroom Storage Ideas (No Drilling!)", emoji: "🚿" },
  "home-office-tiny-apartment": { kicker: "WORK FROM HOME", title: "How to Set Up a Home Office in a Tiny Apartment", emoji: "💻" },
  "best-room-dividers-studio-apartments": { kicker: "STUDIO LIVING", title: "The Best Room Dividers for Studio Apartments", emoji: "🚪" },
};

function pinHtml({ kicker, title, emoji }) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Inter:wght@500;600&display=swap');
  * { margin:0; padding:0; box-sizing:border-box; }
  body { width:1000px; height:1500px; font-family:'Inter',sans-serif; }
  .pin { width:1000px; height:1500px; background:linear-gradient(160deg,#fbf9f6 0%,#f3ede3 100%); display:flex; flex-direction:column; padding:70px 68px; position:relative; }
  .top { display:flex; align-items:center; gap:14px; }
  .logo { font-family:'Fraunces',serif; font-weight:700; font-size:40px; color:#22201d; }
  .logo span { color:#2f7d6b; }
  .card { margin-top:44px; background:#fff; border-radius:36px; box-shadow:0 20px 60px rgba(0,0,0,.08); padding:70px 60px; flex:1; display:flex; flex-direction:column; }
  .emoji { font-size:150px; text-align:center; margin:30px 0 44px; }
  .kicker { color:#e08a3c; font-weight:700; letter-spacing:3px; font-size:26px; text-align:center; }
  .title { font-family:'Fraunces',serif; font-weight:700; font-size:74px; line-height:1.12; color:#22201d; text-align:center; margin-top:26px; letter-spacing:-1px; }
  .rule { width:90px; height:6px; background:#2f7d6b; border-radius:3px; margin:44px auto 0; }
  .foot { margin-top:auto; text-align:center; }
  .foot .cta { font-size:34px; font-weight:600; color:#2f7d6b; }
  .foot .url { font-size:30px; color:#8a847b; margin-top:8px; }
  .badge { position:absolute; top:70px; right:68px; background:#2f7d6b; color:#fff; font-weight:600; font-size:24px; padding:12px 22px; border-radius:999px; }
  </style></head><body>
  <div class="pin">
    <div class="top"><div class="logo">Snug<span>Nook</span></div></div>
    <div class="badge">Small-Space Living</div>
    <div class="card">
      <div class="kicker">${kicker}</div>
      <div class="emoji">${emoji}</div>
      <div class="title">${title}</div>
      <div class="rule"></div>
      <div class="foot"><div class="cta">Read the full guide →</div><div class="url">snugnook.net</div></div>
    </div>
  </div></body></html>`;
}

for (const [slug, meta] of Object.entries(PINS)) {
  // sanity: ensure the article exists
  const files = fs.readdirSync(CONTENT).filter((f) => f.endsWith(".md"));
  const found = files.some((f) => {
    const { data } = matter(fs.readFileSync(path.join(CONTENT, f), "utf8"));
    return (data.slug || f.replace(/\.md$/, "")) === slug;
  });
  if (!found) { console.warn("no article for", slug); continue; }
  fs.writeFileSync(path.join(OUT, `${slug}.html`), pinHtml(meta));
}
console.log("Wrote pin HTML for", Object.keys(PINS).length, "articles to", OUT);
