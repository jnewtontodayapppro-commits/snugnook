# SnugNook Pinterest Pin & Article Hero Standard

The durable spec for every Pinterest pin and article hero image. This file exists so the
standard survives across sessions (memory is not reliable). **Read this before making any
pin or hero.**

## The one rule that matters most

**Pins and article heroes ALWAYS use real, lifelike photography.** Never ship flat
color-block graphics with just an emoji or a big number and no photo. The graphic-only
style does not earn saves or bring in views. If you cannot get a real photo, stop and get
one before publishing.

> Deprecated — do NOT use: `scripts/gen-pin.mjs`, `scripts/make-pins.mjs`,
> `scripts/pin-designs.mjs`. These produce the old flat color-block pins and are kept only
> for reference. Use the photo pipeline below.

## Sizes

- **Pins:** 2:3 ratio. Target 1000×1500; 800×1200 is acceptable and sharp.
- **Article heroes:** 16:9-ish landscape, ~1440×809 (≈933×525 from the browser-render path is fine).
- Produce **2+ pins per article**, and make them different **creative families** (below), not just recolors.

## Creative families (rotate — don't just change the accent color)
If every pin has the same layout with a different color, audiences develop banner blindness. Rotate the *type* of pin, all still clearly branded SnugNook:
- **Photo-first:** full-bleed room photo + a huge 5–8 word promise. (Our current default.)
- **List-first:** a number hook — "7 Places You're Wasting Storage" — with 3–4 short visual callouts.
- **Mistake-first:** "5 Layout Mistakes Making Your Apartment Feel Smaller."
- **Diagram-first:** a simple floorplan / clearance diagram with arrows, dimensions, labels (reuses the article's original-evidence asset — high performer, and it doubles as image-search + AI-citation bait).
- **Transformation:** a before/after concept.
Test at least two different families per article. For your best existing ~30 URLs, making 2–3 fresh creatives each is higher-leverage than writing new articles.

## CTA + description specifics
- **Make the pin CTA specific**, not "Read more": "See what fits", "Get the measurements", "Find the renter-safe options", "See all 9 ideas", "See the layouts." The reader should know exactly what they'll get on click.
- **Descriptions:** write naturally keyword-rich sentences (Pinterest uses them to judge relevance; they're usually not shown in-feed). Put the important keywords in the **pin title, description, board name, and topic tags**. Hashtags are low-value — a few relevant ones are fine, but don't stuff a row of them unless your own analytics show they help.

## Photo sourcing

Use free-license lifestyle photography. **Pexels** (free for commercial use, no attribution
required) is the default source. Find candidates with the VidIQ b-roll tool
(`vidiq_generate_broll`, landscape) — it returns Pexels clips with a `previewImage` URL.
Take the still URL and request a larger size, e.g.
`https://images.pexels.com/videos/<ID>/pexels-photo-<ID>.jpeg?auto=compress&cs=tinysrgb&w=1600`
(some IDs use a descriptive filename instead of `pexels-photo-<ID>` — use the exact filename
from the tool result). Pick clean, bright, on-topic shots; avoid distracting people, foreign
text on packaging, and dark/moody frames that clash with the warm brand.

## Why the render runs in the browser (important)

This cloud sandbox has **no network route to Pexels or most of the internet** — `curl`,
Playwright, and image fetches all fail with a proxy/tunnel error. Only package registries are
reachable. So the photo must be loaded and composited in the **user's browser**
(Claude-in-Chrome), which has normal internet, then captured with a to-disk screenshot and
cropped in the container. Raw image bytes cannot be pulled into the container (the JS bridge
blocks base64 exfiltration), which is why the screenshot-and-crop path exists.

## Procedure (reproducible)

1. **Pick photos** (see above): 1 per hero, 2 per pin (distinct).
2. **Open a page the browser can render into** — navigate the user's tab to `https://snugnook.net/`
   (real page; `about:blank` is blocked), then inject the render harness with `javascript_tool`.
   The harness = Google Fonts (Fraunces + Archivo) + the CSS/markup in `scripts/make-photo-pins.mjs`,
   exposing `window.mkPin({...})` and `window.mkHero({...})`. Each renders a `#cap` element wrapped
   in a fixed-size box on a **magenta (`#ff00ff`) background** for reliable cropping.
3. **Size the window** so the whole asset is visible: pins ~900×1780 (pin scaled to 800×1200),
   heroes ~1120×1500 (hero scaled to ~1000×562). Wait for the photo to load (`img.complete`).
4. **Screenshot to disk** (`computer` action `screenshot`, `save_to_disk: true`). The file lands in
   the container's `/tmp/claude-chrome-screenshots-*/`.
5. **Crop** with `scripts/crop_clean.py <screenshot> <out>` — it finds the non-magenta bounding box
   and trims any residual magenta edge (the plain bbox crop can leave a 1px magenta sliver, which
   showed up on a live hero once — `crop_clean.py` fixes that).
6. **Verify** 0 residual magenta and correct dimensions before publishing.

## Design spec (baked into `scripts/make-photo-pins.mjs`)

- **Pin:** photo fills the top ~61% with a subtle dark bottom-gradient; a white rounded card
  overlaps the photo carrying a colored badge, a Fraunces headline, an Archivo sub-line, and a
  footer `Read the full guide →   snugnook.net`. A `SnugNook` chip sits top-left on the photo,
  with a category eyebrow above the card.
- **Hero:** full-bleed photo with a left-to-right dark gradient; `SnugNook` wordmark, category
  eyebrow, and a Fraunces title bottom-left.
- **Accent colors** (rotate so a batch isn't monotone): teal `#2f7d6b`, clay `#c9772f`,
  plum `#7d5a86`. Keep one accent per article across its hero + pins where it reads well.
- Fonts: **Fraunces** (headlines/serif) + **Archivo** (labels/sans).

## Publishing

- **Heroes:** commit `images/<slug>.jpg` to the repo (via the GitHub web UI — `git push` is blocked
  in the sandbox). The build wires `hero: "/images/<slug>.jpg"` from each article's front matter.
- **Pins:** publish via the Pinterest pin builder (`pinterest.com/pin-creation-tool/`) on the
  SnugNook business account. For each: upload the PNG, set an SEO title + keyword-rich description
  with hashtags, set the destination **Link** to `https://snugnook.net/guides/<slug>/`, choose the
  board (e.g. "Small Space Living Ideas"), then Publish.
