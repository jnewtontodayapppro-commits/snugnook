// Generate upgraded pin design concepts (1000x1500) for review.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "..", "pins-v2");
fs.mkdirSync(OUT, { recursive: true });

const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700;9..144,900&family=Archivo:wght@500;600;700;800&display=swap" rel="stylesheet">`;

// Sample content (the small-room article)
const sample = { kicker: "SMALL-SPACE TRICKS", num: "12", head: "Ways to Make a Small Room Look Bigger" };

/* Variant A — "Big Number Editorial": warm gradient, oversized watermark number, serif headline */
function variantA({ kicker, num, head }) {
  return `<!doctype html><html><head><meta charset="utf-8">${FONTS}<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{width:1000px;height:1500px}
  .pin{width:1000px;height:1500px;position:relative;overflow:hidden;
    background:linear-gradient(150deg,#f7efe4 0%,#efe0cd 55%,#e9d3ba 100%);
    font-family:'Archivo',sans-serif;padding:78px 74px;display:flex;flex-direction:column}
  .blob{position:absolute;border-radius:50%;filter:blur(2px);opacity:.5}
  .b1{width:520px;height:520px;background:#bfe0d5;top:-160px;right:-150px}
  .b2{width:360px;height:360px;background:#f2c79a;bottom:-120px;left:-120px;opacity:.55}
  .top{display:flex;align-items:center;justify-content:space-between;position:relative;z-index:2}
  .brand{font-family:'Fraunces';font-weight:700;font-size:42px;color:#22201d}
  .brand span{color:#2f7d6b}
  .tag{background:#22201d;color:#f7efe4;font-weight:700;font-size:22px;letter-spacing:1px;padding:11px 22px;border-radius:999px}
  .body{position:relative;z-index:2;margin-top:120px;flex:1}
  .kick{display:inline-block;color:#c9772f;font-weight:800;letter-spacing:4px;font-size:27px;margin-bottom:8px}
  .num{font-family:'Fraunces';font-weight:900;font-size:430px;line-height:.8;color:#2f7d6b;letter-spacing:-14px;margin:6px 0 -30px -10px}
  .head{font-family:'Fraunces';font-weight:700;font-size:96px;line-height:1.04;color:#22201d;letter-spacing:-2px;max-width:840px}
  .foot{position:relative;z-index:2;margin-top:auto;display:flex;align-items:center;justify-content:space-between;border-top:3px solid #22201d33;padding-top:26px}
  .cta{font-family:'Archivo';font-weight:700;font-size:33px;color:#2f7d6b}
  .url{font-weight:700;font-size:31px;color:#8a7f6d}
  </style></head><body><div class="pin">
    <div class="blob b1"></div><div class="blob b2"></div>
    <div class="top"><div class="brand">Snug<span>Nook</span></div><div class="tag">SMALL-SPACE LIVING</div></div>
    <div class="body">
      <span class="kick">${kicker}</span>
      <div class="num">${num}</div>
      <div class="head">${head}</div>
    </div>
    <div class="foot"><span class="cta">Read the full guide →</span><span class="url">snugnook.net</span></div>
  </div></body></html>`;
}

/* Variant B — "Terracotta Split": bold color top block + overlapping cream card */
function variantB({ kicker, num, head }) {
  return `<!doctype html><html><head><meta charset="utf-8">${FONTS}<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{width:1000px;height:1500px}
  .pin{width:1000px;height:1500px;position:relative;overflow:hidden;background:#f7efe4;font-family:'Archivo',sans-serif}
  .top{height:760px;background:linear-gradient(160deg,#c9772f 0%,#a85f22 100%);position:relative;padding:70px 74px}
  .brand{font-family:'Fraunces';font-weight:700;font-size:42px;color:#f7efe4}
  .brand span{color:#ffd9a8}
  .kick{position:absolute;top:250px;left:74px;color:#ffe6c9;font-weight:800;letter-spacing:5px;font-size:28px}
  .num{position:absolute;top:270px;left:70px;font-family:'Fraunces';font-weight:900;font-size:360px;line-height:.8;color:#ffffff;opacity:.16;letter-spacing:-10px}
  .kbig{position:absolute;bottom:70px;left:74px;right:74px;font-family:'Fraunces';font-weight:700;font-size:60px;color:#fff;line-height:1.05}
  .card{position:absolute;top:640px;left:60px;right:60px;bottom:70px;background:#fff;border-radius:34px;box-shadow:0 24px 60px rgba(120,70,20,.18);padding:60px 58px;display:flex;flex-direction:column}
  .badge{align-self:flex-start;background:#2f7d6b;color:#fff;font-weight:700;font-size:22px;letter-spacing:1px;padding:10px 20px;border-radius:999px;margin-bottom:24px}
  .head{font-family:'Fraunces';font-weight:700;font-size:82px;line-height:1.05;color:#22201d;letter-spacing:-1.5px}
  .foot{margin-top:auto;display:flex;align-items:center;justify-content:space-between}
  .cta{font-family:'Archivo';font-weight:700;font-size:32px;color:#c9772f}
  .url{font-weight:700;font-size:30px;color:#a99a86}
  </style></head><body><div class="pin">
    <div class="top">
      <div class="brand">Snug<span>Nook</span></div>
      <div class="num">${num}</div>
      <div class="kick">${kicker}</div>
    </div>
    <div class="card">
      <span class="badge">SMALL-SPACE LIVING</span>
      <div class="head">${num} ${head}</div>
      <div class="foot"><span class="cta">Read the full guide →</span><span class="url">snugnook.net</span></div>
    </div>
  </div></body></html>`;
}

fs.writeFileSync(path.join(OUT, "variantA.html"), variantA(sample));
fs.writeFileSync(path.join(OUT, "variantB.html"), variantB(sample));
console.log("Wrote variantA.html and variantB.html to", OUT);
