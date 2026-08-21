# SnugNook Content Standard

The writing standard for every article. Goal: genuinely useful, specific, human — content that ranks *and* doesn't read like it came out of a generator.

Methodology adapted from the open-source [superseo-skills](https://github.com/inhouseseo/superseo-skills) (Apache 2.0) — anti-AI-slop ruleset, Information Gain, and E-E-A-T signal embedding.

## Voice
- Write practitioner-to-peer. Take positions. Say what works and what backfires.
- Use "you" and "we." Contractions. Occasional short aside.
- Specific numbers, measurements, and scenarios beat vague claims. ("Mount the rod 4–6 inches below the ceiling" > "hang curtains high.")
- Show, don't state: a quick scenario lands harder than a flat fact.

## Rhythm
- Vary sentence length hard — 5 words to 30+. Fragments are fine.
- Vary paragraph length. No uniform topic-sentence-then-support blocks.
- No section summaries ("In this section we covered…"). Just move on.

## Never use
delve, leverage, utilize, robust, seamless, furthermore, moreover, additionally, pivotal, multifaceted, harness, embark, navigate (metaphorical), showcase, streamline, paramount, comprehensive (as adjective), "it's worth noting", "in today's world", "let's dive in", "in conclusion", "plays a crucial role", "it goes without saying". Avoid rule-of-three groupings and em-dash chains (max 1–2 per 1,000 words).

## SEO structure
These are guidelines, not a rigid template. Google says there is no ideal page length and its systems understand synonyms — do NOT pad to hit a word count or mechanically wedge the keyword into headings. Force nothing.
- Primary keyword in the H1/title and naturally in the first 100 words. Let the H2s **describe the real problem** ("Fix the deep-shelf black hole", "Protect the walking paths") rather than repeat the keyword. Descriptive headings beat keyword-stuffed ones.
- Keep the answer-first block, but **vary the format by intent** so it reads natural, not templated:
  - "how" query → a tight 3-step answer.
  - "best" query → name the winner + who it's for.
  - measurement query → lead with the number.
  - comparison query → a mini comparison table.
  - "ideas" query → lead with the strongest 5 ideas.
- Length is whatever the topic deserves — some guides warrant 2,500 words, some 900. Never pad.
- 3–5 internal links per 1,000 words to related guides (see Topic clusters below — link within the cluster).
- Front-load the value; don't bury the useful part.

## FAQ / Common questions
Google **deprecated FAQ rich results (May 2026)** — an FAQ section no longer earns a rich snippet, and FAQPage schema is no longer worth engineering for. So:
- Include a "Common questions" section ONLY when it genuinely answers real remaining questions (it still helps readers and AI answer engines). Skip it when it would just restate the body.
- Do not manufacture a Q&A block merely because People Also Ask lists four questions.

## E-E-A-T / Information Gain / original evidence
- Add something the top-ranking pages *don't* have: exact measurements, a "mistakes" section, renter-specific notes, honest trade-offs.
- "So what?" test each section: could this have been written by anyone, for any site? If yes, inject specific knowledge.
- **Ship at least one piece of ORIGINAL evidence per guide** — this is the single biggest lever for both Google and AI answer engines, which now reward first-hand, non-commodity content. Good SnugNook assets: a small-space clearance/measurement chart (e.g. "sofa ↔ coffee-table gap: 14–18 in; primary walking lane: 30+ in; shelf depth by use"), an original diagram/floorplan, or a scoring framework (a repeatable "SnugNook Space Score"). One such asset can rank in image search, get cited by AI, become a Pinterest pin, and earn backlinks — worth more than another 700 words of prose.
- There is no special AEO/GEO markup, AI schema, or `llms.txt` that helps — normal SEO + original evidence is the mechanism. Don't waste time on those.

## Topic research & clusters
- **Think in problem ecosystems, not one-off articles.** Build clusters where one reader travels from a problem → a solution → a product decision. Example *Small Kitchen Hub*: "no counter space" (problem) → "how to create more counter space" (solution) → "best narrow kitchen carts for apartments" (product decision) → "best kitchen carts under 18 inches wide" (high-intent constraint) → "rolling cart vs kitchen island" (comparison) → "how much clearance around a cart" (measurement). Interlink the whole cluster; it compounds authority far more than six unrelated keywords.
- **Chase buying-intent modifiers**, not just "best X": `under <N> inches`, `<A> vs <B>`, `what size <X> for a small room`, `how much clearance for <X>`, `<problem> without drilling / without a closet / without a pantry`. These queries have a built-in reason for SnugNook to exist and convert better.
- **Score each idea on six factors**: demand + commercial intent + ranking weakness (do the current top pages actually answer the renter/no-drill/measurement problem?) + SnugNook relevance + Pinterest visual potential + information-gain opportunity. Weight **commercial intent and information gain** highest.
- Once Search Console has data, mine it monthly: queries with high impressions at positions 5–20 tell you what to improve, extend, or link — often better than a brand-new page. Don't spin up a separate page for every long-tail variation.

## Product picks — finish the decision (biggest revenue lever)
The picks are where the money is. Do NOT dump the reader onto an Amazon search page — that asks a buying-ready visitor to restart their research. Finish the decision for them.
- **Recommend SPECIFIC, named products.** Use `AMZP:<ASIN>` (links straight to the product page, tagged) — e.g. `href="AMZP:B0XXXXXXXX"`. Give each pick a real product name, one honest reason, and the key spec/measurement that matters for a small space.
- `AMZ:<search term>` (search-results link) is a **fallback only**, used when a specific product hasn't been chosen yet. Replace these with `AMZP:` ASINs as soon as products are picked.
- Prefer a short **comparison** framing: "best all-rounder / most compact / cheapest that's still good," each a named product. A tiny comparison table (size, weight rating, best-for) beats six vague cards.
- To find ASINs: pick a genuinely well-reviewed, in-stock product on Amazon and use the 10-char ASIN from its URL (`/dp/<ASIN>`). Never invent ASINs.
- Keep `[[cb:woodworking]]` callout on build/DIY-relevant pieces.

## SnugNook specifics
- Target audience: renters and small-space dwellers. Flag renter-safe / no-drill options.
- Keep the `## Heading {#id}` anchors so the table of contents works.
- Every guide gets a real-photo hero and 1–2 real-photo pins — see `docs/PIN-STYLE.md`.
- Length target: ~1,500–2,200 words is typical, but let the topic decide (see SEO structure).
