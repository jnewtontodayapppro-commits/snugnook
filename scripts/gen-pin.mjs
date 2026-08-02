// Generate ONE "Bold Split" Pinterest pin (1000x1500) — HTML + rendered PNG — from CLI args.
// Usage:
//   node scripts/gen-pin.mjs --slug best-storage-ottomans --kicker "SMALL LIVING ROOMS" \
//     --head "The Best Storage Ottomans for Small Living Rooms" \
//     --sub "Hidden storage, a footrest, and a coffee table in one." --accent clay [--num 12]
// Writes pins/<slug>.html and pins/png/<slug>.png. Chromium is pre-installed in the
// build container (PLAYWRIGHT_BROWSERS_PATH); playwright is a devDependency (npm install).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "..", "pins");
const PNG = path.join(OUT, "png");
fs.mkdirSync(PNG, { recursive: true });

// --- arg parsing ---
const args = {};
for (let i = 2; i < process.argv.length; i += 2) {
  const k = process.argv[i].replace(/^--/, "");
  args[k] = process.argv[i + 1];
}
for (const req of ["slug", "kicker", "head", "sub"]) {
  if (!args[req]) { console.error(`Missing --${req}`); process.exit(1); }
}
const accent = args.accent || "teal";

const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700;9..144,900&family=Archivo:wght@500;600;700;800&display=swap" rel="stylesheet">`;

const ACCENTS = {
  teal: { top: "linear-gradient(160deg,#2f7d6b 0%,#245e51 100%)", badge: "#c9772f", eyebrow: "#bfe4da", cta: "#2f7d6b" },
  clay: { top: "linear-gradient(160deg,#c9772f 0%,#a85f22 100%)", badge: "#2f7d6b", eyebrow: "#ffe6c9", cta: "#c9772f" },
  plum: { top: "linear-gradient(160deg,#7d5a86 0%,#5d4064 100%)", badge: "#c9772f", eyebrow: "#e4d3ea", cta: "#7d5a86" },
};

function pinHtml({ kicker, num, head, sub, accent }) {
  const a = ACCENTS[accent] || ACCENTS.teal;
  const hero = num ? `<div class="num">${num}</div>` : "";
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
  .emojibadge{position:absolute;top:330px;left:74px;width:230px;height:230px}
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

const htmlPath = path.join(OUT, `${args.slug}.html`);
fs.writeFileSync(htmlPath, pinHtml({ kicker: args.kicker, num: args.num, head: args.head, sub: args.sub, accent }));

const execPath = process.env.PLAYWRIGHT_CHROMIUM_PATH || "/opt/pw-browsers/chromium";
const browser = await chromium.launch(fs.existsSync(execPath) ? { executablePath: execPath } : {});
const page = await browser.newPage({ viewport: { width: 1000, height: 1500 }, deviceScaleFactor: 2 });
await page.goto("file://" + htmlPath);
await page.waitForTimeout(600);
const pngPath = path.join(PNG, `${args.slug}.png`);
await page.screenshot({ path: pngPath, clip: { x: 0, y: 0, width: 1000, height: 1500 } });
await browser.close();
console.log("Wrote pin:", pngPath);
