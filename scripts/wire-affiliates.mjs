// One-off: rewrite existing articles' placeholder buttons into AMZ: affiliate links.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT = path.join(__dirname, "..", "content");

// Map: file -> [ [h4 substring, amazon search term], ... ] in document order.
const MAP = {
  "small-room-look-bigger.md": [
    ["Full-length leaning floor mirror", "full length floor mirror"],
    ["Extra-long curtain rod + sheer panels", "extra long curtain rod sheer curtains"],
    ["Tall, narrow 5-tier bookcase", "tall narrow bookcase 5 tier"],
  ],
  "space-saving-furniture.md": [
    ["Upholstered storage ottoman", "storage ottoman with storage"],
    ["Wall-mounted drop-leaf table", "wall mounted drop leaf table"],
    ["Platform bed with under-drawers", "platform bed frame with storage drawers"],
  ],
  "tiny-kitchen-no-counter-space.md": [
    ["Over-the-sink roll-up drying rack", "over the sink roll up dish drying rack"],
    ["Slim rolling storage cart", "slim rolling storage cart kitchen"],
    ["Pull-out under-shelf drawers (set)", "pull out cabinet organizer under shelf"],
  ],
  "renter-friendly-upgrades.md": [
    ["Peel-and-stick wallpaper (accent roll)", "peel and stick wallpaper"],
    ["Plug-in pendant light", "plug in pendant light"],
    ["Damage-free hanging strip variety pack", "command picture hanging strips"],
  ],
  "over-door-organizers.md": [
    ["Clear-pocket over-the-door organizer", "over the door clear pocket organizer"],
    ["Adjustable wire basket door rack", "over the door pantry basket organizer"],
    ["Over-the-door rack with adjustable brackets", "over the door organizer adjustable hooks"],
  ],
};

let total = 0;
for (const [file, picks] of Object.entries(MAP)) {
  const fp = path.join(CONTENT, file);
  let text = fs.readFileSync(fp, "utf8");
  for (const [h4, term] of picks) {
    const at = text.indexOf(h4);
    if (at === -1) {
      console.warn(`  ! h4 not found in ${file}: "${h4}"`);
      continue;
    }
    const hrefIdx = text.indexOf('href="#"', at);
    if (hrefIdx === -1) {
      console.warn(`  ! button not found after h4 in ${file}: "${h4}"`);
      continue;
    }
    text = text.slice(0, hrefIdx) + `href="AMZ:${term}"` + text.slice(hrefIdx + 'href="#"'.length);
    total++;
  }
  // friendlier button label
  text = text.replaceAll(">Check price →<", ">Check price on Amazon →<");
  fs.writeFileSync(fp, text);
  console.log(`  ${file}: wired`);
}
console.log(`Done. ${total} buttons wired to Amazon.`);
