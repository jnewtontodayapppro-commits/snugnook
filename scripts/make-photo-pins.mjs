// SnugNook REAL-PHOTO pin + hero pipeline.  See docs/PIN-STYLE.md for the full procedure.
//
// The sandbox cannot reach Pexels, so assets are composited in the USER'S browser and
// screenshotted. This module emits (a) the render harness to inject via javascript_tool,
// and (b) the per-asset params. Flow: navigate the browser to https://snugnook.net/ ->
// inject HARNESS -> call mkPin()/mkHero() per asset -> screenshot save_to_disk ->
// crop with scripts/crop_clean.py. Fonts + Pexels photos load in the browser.
//
// NEVER ship flat color-block pins. Real photography only.

export const ACCENT = { teal: "#2f7d6b", clay: "#c9772f", plum: "#7d5a86" };

// Larger still from a Pexels b-roll clip id (some ids use a descriptive filename instead).
export const pexels = (idOrFile) =>
  `https://images.pexels.com/videos/${String(idOrFile).split("/")[0]}/` +
  `${String(idOrFile).includes("/") ? String(idOrFile).split("/")[1] : "pexels-photo-" + idOrFile}` +
  `.jpeg?auto=compress&cs=tinysrgb&w=1600`;

// Inject this once (document.head + window.mkPin/mkHero). Renders a #cap on a #ff00ff
// background so crop_clean.py can find the asset by its non-magenta bounding box.
export const HARNESS = String.raw`
const FONTS='<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700;9..144,900&family=Archivo:wght@500;600;700;800&display=swap" rel="stylesheet">';
const CSS=` + "`" + String.raw`*{margin:0;padding:0;box-sizing:border-box}html,body{background:#ff00ff;margin:0}
.pinc{width:1000px;height:1500px;position:relative;background:#f7efe4;overflow:hidden;font-family:'Archivo',sans-serif}
.heroc{width:1440px;height:809px;position:relative;overflow:hidden;font-family:'Archivo',sans-serif}
.photo{position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover}
.pinc .photo{height:920px}
.pgrad{position:absolute;top:0;left:0;width:1000px;height:920px;background:linear-gradient(to bottom,rgba(0,0,0,.30) 0%,rgba(0,0,0,0) 24%,rgba(0,0,0,0) 58%,rgba(15,8,0,.52) 100%)}
.chip{position:absolute;top:34px;left:34px;background:rgba(255,255,255,.94);color:#22201d;font-family:'Fraunces';font-weight:700;font-size:34px;padding:9px 22px;border-radius:999px}
.chip span{color:var(--a)}
.eyebrow{position:absolute;left:42px;bottom:130px;color:#fff;font-weight:800;letter-spacing:4px;font-size:31px;text-shadow:0 2px 14px rgba(0,0,0,.55)}
.card{position:absolute;top:820px;left:44px;right:44px;bottom:54px;background:#fff;border-radius:34px;box-shadow:0 -12px 44px rgba(60,40,15,.14);padding:56px 54px;display:flex;flex-direction:column}
.badge{align-self:flex-start;background:var(--a);color:#fff;font-weight:700;font-size:23px;letter-spacing:1.2px;padding:11px 22px;border-radius:999px;margin-bottom:24px}
.head{font-family:'Fraunces';font-weight:700;font-size:74px;line-height:1.05;color:#22201d;letter-spacing:-1.5px}
.sub{font-size:34px;line-height:1.34;color:#6c6459;margin-top:20px;font-weight:500}
.foot{margin-top:auto;display:flex;justify-content:space-between;align-items:center;border-top:2px solid #eee5d7;padding-top:24px}
.cta{font-weight:700;font-size:32px;color:var(--a)}.url{font-weight:700;font-size:30px;color:#a99a86}
.hgrad{position:absolute;inset:0;background:linear-gradient(105deg,rgba(10,6,2,.72) 0%,rgba(10,6,2,.45) 38%,rgba(10,6,2,.08) 62%,rgba(10,6,2,0) 100%)}
.hwrap{position:absolute;left:70px;bottom:66px;max-width:860px}
.hchip{font-family:'Fraunces';font-weight:700;font-size:34px;color:#fff}.hchip span{color:#ffd9a8}
.heyebrow{color:#ffdca8;font-weight:800;letter-spacing:4px;font-size:22px;margin:26px 0 12px}
.htitle{font-family:'Fraunces';font-weight:700;font-size:70px;line-height:1.04;color:#fff;letter-spacing:-1.5px;text-shadow:0 3px 20px rgba(0,0,0,.4)}` + "`" + String.raw`;
document.head.innerHTML=FONTS+'<style>'+CSS+'</style>';
window.ACC={teal:'#2f7d6b',clay:'#c9772f',plum:'#7d5a86'};
// Pin scaled 0.8 -> capture 800x1200. Window ~900x1780.
window.mkPin=function(p){document.documentElement.style.setProperty('--a',ACC[p.accent]);document.body.innerHTML='<div style="width:800px;height:1200px;overflow:hidden;background:#ff00ff"><div class="pinc" style="transform:scale(0.8);transform-origin:top left"><img class="photo" src="'+p.photo+'" crossorigin="anonymous"><div class="pgrad"></div><div class="chip">Snug<span>Nook</span></div><div class="eyebrow">'+p.eyebrow+'</div><div class="card"><span class="badge">'+p.badge+'</span><div class="head">'+p.head+'</div><div class="sub">'+p.sub+'</div><div class="foot"><span class="cta">Read the full guide →</span><span class="url">snugnook.net</span></div></div></div>';};
// Hero scaled ~0.694 -> capture ~1000x562. Window ~1120x1500.
window.mkHero=function(p){document.documentElement.style.setProperty('--a',ACC[p.accent]);document.body.innerHTML='<div style="width:1000px;height:562px;overflow:hidden;background:#ff00ff"><div class="heroc" style="transform:scale(0.69444);transform-origin:top left"><img class="photo" src="'+p.photo+'" crossorigin="anonymous"><div class="hgrad"></div><div class="hwrap"><div class="hchip">Snug<span>Nook</span></div><div class="heyebrow">'+p.eyebrow+'</div><div class="htitle">'+p.title+'</div></div></div></div>';};
'harness-ready';
`;

// Example asset config (edit per batch). photo = pexels(<id or id/filename>).
export const EXAMPLE = {
  pins: [
    { accent: "teal", photo: pexels("9583810"), eyebrow: "DORM STORAGE", badge: "SMALL-SPACE LIVING", head: "18 Dorm Room Storage Ideas", sub: "Space-savers for a tiny shared room — no tools, no holes." },
  ],
  heroes: [
    { accent: "clay", photo: pexels("8580869"), eyebrow: "SMALL KITCHENS", title: "A Whole Pantry in One Cabinet" },
  ],
};
