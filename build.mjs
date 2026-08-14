import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { marked } from "marked";
import matter from "gray-matter";
import { site } from "./config.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT = path.join(__dirname, "content");
const DIST = path.join(__dirname, "dist");
const NOW = process.env.BUILD_DATE || "2026-08-01"; // pass BUILD_DATE to override

// Per-category hero accent gradients (keeps articles visually varied + on-brand).
const CAT_ACCENT = {
  organization: ["#2f7d6b", "#245e51"], // teal
  furniture: ["#c9772f", "#a85f22"], // clay
  kitchen: ["#7d5a86", "#5d4064"], // plum
  decor: ["#3f6f8f", "#2c526b"], // blue
  renting: ["#6b8e4e", "#4f6c39"], // olive
};

/* ---------- helpers ---------- */
const esc = (s = "") =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const rmDir = (d) => fs.existsSync(d) && fs.rmSync(d, { recursive: true, force: true });
const ensure = (d) => fs.mkdirSync(d, { recursive: true });
const writeFile = (rel, html) => {
  const full = path.join(DIST, rel);
  ensure(path.dirname(full));
  fs.writeFileSync(full, html);
};
const fmtDate = (d) =>
  new Date(d + "T00:00:00Z").toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

/* ---------- affiliate links ---------- */
// Builds an Amazon affiliate link from a search term. Uses site.amazonTag when
// set (monetized); until then the link still works, just untagged. Swap the tag
// once in config.mjs and every button across every article becomes monetized.
function amazonLink(term) {
  const base = `https://www.amazon.com/s?k=${encodeURIComponent(term.trim())}`;
  return site.amazonTag ? `${base}&tag=${encodeURIComponent(site.amazonTag)}` : base;
}

// Renders a ClickBank "build it yourself" callout — but ONLY if the offer's
// HopLink is configured. Until then it renders nothing (no dead links ship).
function cbCallout(key) {
  const o = site.clickbank?.offers?.[key];
  if (!o || !o.url) return "";
  return `<div class="cbbox"><span class="cbtag">${esc(o.tag)}</span><h4>${esc(o.title)}</h4><p>${esc(o.blurb)}</p><a class="cbbtn" href="${o.url}" target="_blank" rel="nofollow sponsored">${esc(o.cta)}</a></div>`;
}

/* ---------- load content ---------- */
function loadPosts() {
  if (!fs.existsSync(CONTENT)) return [];
  return fs
    .readdirSync(CONTENT)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const raw = fs.readFileSync(path.join(CONTENT, f), "utf8");
      const { data, content } = matter(raw);
      const slug = data.slug || f.replace(/\.md$/, "");
      // Convert "## Heading {#id}" into real heading anchors for the TOC links,
      // then turn AMZ:search-term links into tagged Amazon affiliate links.
      const body = marked
        .parse(content)
        .replace(/<h([2-6])>([^<]*?)\s*\{#([\w-]+)\}<\/h\1>/g, '<h$1 id="$3">$2</h$1>')
        .replace(/href="AMZ:([^"]+)"(\s+rel="[^"]*")?/g, (_m, term) => `href="${amazonLink(term)}" target="_blank" rel="nofollow sponsored"`)
        .replace(/<p>\s*\[\[cb:([\w-]+)\]\]\s*<\/p>/g, (_m, key) => cbCallout(key));
      const words = content.split(/\s+/).filter(Boolean).length;
      return {
        ...data,
        slug,
        body,
        readTime: Math.max(1, Math.round(words / 220)),
        url: `/guides/${slug}/`,
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

/* ---------- shared chrome ---------- */
function head({ title, description, url, image, type = "website", jsonld }) {
  const canonical = site.url + url;
  return `<!doctype html><html lang="en"><head>
<script>(function(){try{var t=localStorage.getItem('snug-theme');document.documentElement.setAttribute('data-theme',t==='light'?'light':'dark');}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();</script>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${canonical}">
<meta property="og:type" content="${type}">
<meta property="og:site_name" content="${esc(site.name)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${canonical}">
<meta name="twitter:card" content="summary_large_image">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,600&family=Inter:wght@400;500;600;700&display=swap">
<link rel="stylesheet" href="/styles.css">
<link rel="alternate" type="application/rss+xml" title="${esc(site.name)}" href="/rss.xml">
<link rel="icon" href="/favicon.svg">
${site.pinterestVerify ? `<meta name="p:domain_verify" content="${site.pinterestVerify}">` : ""}
${site.analytics?.cloudflareToken ? `<script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token": "${site.analytics.cloudflareToken}"}'></script>` : ""}
${site.analytics?.ga4Id ? `<script async src="https://www.googletagmanager.com/gtag/js?id=${site.analytics.ga4Id}"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${site.analytics.ga4Id}');</script>` : ""}
${jsonld ? `<script type="application/ld+json">${JSON.stringify(jsonld)}</script>` : ""}
</head><body>`;
}

const ICON_SEARCH = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>`;
const ICON_THEME = `<svg class="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z"/></svg><svg class="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4.2"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>`;

const header = () => `<header class="site-header"><div class="wrap">
<a class="brand" href="/">Snug<span>Nook</span></a>
<nav class="nav" id="nav">${site.nav.map((n) => `<a href="${n.href}">${n.label}</a>`).join("")}</nav>
<div class="head-actions">
<a class="icon-btn" href="/guides/" aria-label="Browse all guides">${ICON_SEARCH}</a>
<button class="icon-btn theme-toggle" type="button" aria-label="Toggle dark mode" onclick="__snugTheme()">${ICON_THEME}</button>
<a class="btn btn-sm" href="/#subscribe">Subscribe</a>
<button class="menu-toggle icon-btn" aria-label="Menu" onclick="document.getElementById('nav').classList.toggle('open')">☰</button>
</div>
</div></header>
<script>function __snugTheme(){try{var h=document.documentElement,t=h.getAttribute('data-theme')==='dark'?'light':'dark';h.setAttribute('data-theme',t);localStorage.setItem('snug-theme',t);}catch(e){}}</script>`;

const footer = () => `<footer class="site-footer"><div class="wrap">
<div class="cols">
<div style="max-width:300px"><div class="brand">Snug<span style="color:var(--accent)">Nook</span></div>
<p style="margin-top:8px;opacity:.85">${esc(site.tagline)}. ${esc(site.description)}</p></div>
<div><h4>Explore</h4><ul>${Object.entries(site.categories).map(([k, c]) => `<li><a href="/category/${k}/">${c.title}</a></li>`).join("")}</ul></div>
<div><h4>Site</h4><ul>
<li><a href="/about/">About</a></li>
<li><a href="/affiliate-disclosure/">Affiliate Disclosure</a></li>
<li><a href="/privacy/">Privacy Policy</a></li>
<li><a href="/rss.xml">RSS Feed</a></li>
</ul></div>
</div>
<div class="fine">© 2026 ${esc(site.name)}. As an Amazon Associate we earn from qualifying purchases. ${esc(site.name)} is reader-supported.</div>
</div></footer></body></html>`;

/* ---------- pages ---------- */
function renderCard(p) {
  const cat = site.categories[p.category]?.title || p.category || "Guide";
  const thumb = p.hero
    ? `<img src="${p.hero}" alt="" loading="lazy">`
    : `<span class="ph">${p.emoji || "🏠"}</span>`;
  return `<article class="card"><a href="${p.url}">
  <div class="thumb">${thumb}</div>
  <div class="body">
    <span class="cat">${esc(cat)}</span>
    <h3>${esc(p.title)}</h3>
    <p>${esc(p.excerpt || "")}</p>
    <div class="byline"><span class="avatar"></span><span class="who">SnugNook</span><span class="sep">·</span><span>${fmtDate(p.date)}</span><span class="rt">${p.readTime} min read</span></div>
  </div></a></article>`;
}

function renderPills(active) {
  const all = `<a class="pill${active === "all" ? " active" : ""}" href="/guides/">All</a>`;
  const cats = Object.entries(site.categories)
    .map(([k, c]) => `<a class="pill${active === k ? " active" : ""}" href="/category/${k}/">${esc(c.title)}</a>`)
    .join("");
  return `<div class="filter-pills">${all}${cats}</div>`;
}

const ICON_MAIL = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>`;
const subscribeBar = () => `<section class="subscribe-bar" id="subscribe">
  <div class="sb-label">${ICON_MAIL}<span>Get one good small-space idea in your inbox each week.</span></div>
  <script async src="https://f.convertkit.com/ckjs/ck.5.js"></script>
  <form action="https://app.kit.com/forms/9802030/subscriptions" method="post" class="sb-form seva-form formkit-form" data-sv-form="9802030" data-uid="57f66802bc" data-format="inline" data-version="5" style="flex-wrap:wrap">
    <div data-element="fields" style="display:flex;gap:10px;flex:1 1 100%">
      <input class="formkit-input" type="email" name="email_address" placeholder="Your email address" aria-label="Email" required>
      <button data-element="submit" class="btn" type="submit">Subscribe</button>
    </div>
    <div data-element="success" style="display:none;flex-basis:100%;margin-top:9px;color:var(--accent);font-weight:600;font-size:14px">Thanks — please check your inbox to confirm your subscription.</div>
    <div data-element="errors" style="display:none;flex-basis:100%;margin-top:9px;color:#d9895f;font-weight:600;font-size:14px"></div>
  </form>
</section>`;

function homePage(posts) {
  const jsonld = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: site.url,
    description: site.description,
  };
  const lead = posts.find((p) => p.hero) || posts[0];
  const rest = posts.filter((p) => p !== lead).slice(0, 6);
  const leadCat = lead ? (site.categories[lead.category]?.title || "Guide") : "";
  const leadMedia = lead && lead.hero
    ? `<img src="${lead.hero}" alt="" loading="lazy">`
    : `<span class="ph">${(lead && lead.emoji) || "🏠"}</span>`;
  const heroSplit = lead ? `<section class="hero-split">
      <div class="hero-text">
        <span class="eyebrow">New guide</span>
        <h1><a href="${lead.url}">${esc(lead.title)}</a></h1>
        <p>${esc(lead.excerpt || "")}</p>
        <div class="hero-cta"><a class="btn" href="${lead.url}">Read the guide</a><a class="btn btn-outline" href="/guides/">Browse topics</a></div>
      </div>
      <a class="hero-media" href="${lead.url}">${leadMedia}</a>
    </section>` : "";
  return (
    head({ title: `${site.name} — ${site.tagline}`, description: site.description, url: "/", jsonld }) +
    header() +
    `<main class="wrap">
    ${heroSplit}
    ${subscribeBar()}
    <div class="section-head"><h2>Latest guides</h2><a class="view-all" href="/guides/">View all articles →</a></div>
    ${renderPills("all")}
    <div class="grid">${rest.map(renderCard).join("")}</div>
    </main>` +
    footer()
  );
}

function articlePage(p, posts) {
  const cat = site.categories[p.category]?.title || "Guide";
  const jsonld = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: p.title,
    description: p.excerpt,
    datePublished: p.date,
    dateModified: p.updated || p.date,
    author: { "@type": "Organization", name: site.author },
    publisher: { "@type": "Organization", name: site.name },
    mainEntityOfPage: site.url + p.url,
  };
  const related = posts.filter((x) => x.slug !== p.slug && x.category === p.category).slice(0, 3);
  const relBlock = related.length
    ? `<h2 class="section-title">Keep reading</h2><div class="grid">${related.map(renderCard).join("")}</div>`
    : "";
  return (
    head({ title: `${p.title} | ${site.name}`, description: p.excerpt, url: p.url, type: "article", jsonld }) +
    header() +
    `<main class="wrap">
    <article class="article">
      <nav class="breadcrumb"><a href="/">Home</a> › <a href="/category/${p.category}/">${esc(cat)}</a></nav>
      <header class="article-head">
        <span class="eyebrow"><a href="/category/${p.category}/">${esc(cat)}</a></span>
        <h1>${esc(p.title)}</h1>
        <p class="standfirst">${esc(p.excerpt)}</p>
        <div class="byline">By ${esc(site.author)} · Updated ${fmtDate(p.updated || p.date)} · ${p.readTime} min read</div>
      </header>
      ${p.hero ? `<figure class="article-hero"><img src="${p.hero}" alt="${esc(p.heroAlt || p.title)}">${p.heroCredit ? `<figcaption>${esc(p.heroCredit)}</figcaption>` : ""}</figure>` : ""}
      <p class="disclosure">As an Amazon Associate, SnugNook earns from qualifying purchases. When you buy through links on this page, we may earn a commission, at no extra cost to you. We only recommend items we believe earn their place in a small space.</p>
      <div class="article-body">${p.body}</div>
    </article>
    ${relBlock}
    </main>` +
    footer()
  );
}

function listPage({ title, blurb, url, posts, active }) {
  return (
    head({ title: `${title} | ${site.name}`, description: blurb || site.description, url }) +
    header() +
    `<main class="wrap">
    <div class="section-head" style="margin:44px 0 6px"><h2 style="font-size:clamp(30px,4vw,46px)">${esc(title)}</h2></div>
    ${blurb ? `<p style="color:var(--ink-soft);font-size:18px;margin:0 0 26px;max-width:660px">${esc(blurb)}</p>` : `<div style="height:20px"></div>`}
    ${renderPills(active || "all")}
    <div class="grid">${posts.map(renderCard).join("")}</div>
    </main>` +
    footer()
  );
}

function simplePage({ title, url, html }) {
  return (
    head({ title: `${title} | ${site.name}`, description: `${title} — ${site.name}`, url }) +
    header() +
    `<main class="wrap"><article class="article"><h1>${esc(title)}</h1>${html}</article></main>` +
    footer()
  );
}

/* ---------- feeds & meta files ---------- */
function sitemap(urls) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `<url><loc>${site.url}${u.loc}</loc><lastmod>${u.lastmod || NOW}</lastmod></url>`).join("\n")}
</urlset>`;
}
function rss(posts) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
<title>${esc(site.name)}</title>
<link>${site.url}</link>
<description>${esc(site.description)}</description>
${posts
    .map(
      (p) => `<item><title>${esc(p.title)}</title><link>${site.url}${p.url}</link>
<guid>${site.url}${p.url}</guid><pubDate>${new Date(p.date + "T00:00:00Z").toUTCString()}</pubDate>
<description>${esc(p.excerpt || "")}</description></item>`
    )
    .join("\n")}
</channel></rss>`;
}
const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#33625a"/><path d="M16 34 L32 20 L48 34 V48 H38 V38 H26 V48 H16 Z" fill="#f5efe4"/></svg>`;

/* ---------- build ---------- */
function build() {
  rmDir(DIST);
  ensure(DIST);
  const posts = loadPosts();

  // static assets
  fs.copyFileSync(path.join(__dirname, "src/styles.css"), path.join(DIST, "styles.css"));
  const imgDir = path.join(__dirname, "images");
  if (fs.existsSync(imgDir)) fs.cpSync(imgDir, path.join(DIST, "images"), { recursive: true });
  writeFile("favicon.svg", favicon);
  writeFile("robots.txt", `User-agent: *\nAllow: /\nSitemap: ${site.url}/sitemap.xml\n`);

  // home
  writeFile("index.html", homePage(posts));

  // articles
  posts.forEach((p) => writeFile(`guides/${p.slug}/index.html`, articlePage(p, posts)));

  // guides index
  writeFile(
    "guides/index.html",
    listPage({ title: "All Guides", blurb: "Every SnugNook guide, newest first.", url: "/guides/", posts, active: "all" })
  );

  // categories
  Object.entries(site.categories).forEach(([key, c]) => {
    const cp = posts.filter((p) => p.category === key);
    writeFile(
      `category/${key}/index.html`,
      listPage({ title: c.title, blurb: c.blurb, url: `/category/${key}/`, posts: cp, active: key })
    );
  });

  // static pages
  const pages = staticPages();
  pages.forEach((pg) => writeFile(`${pg.path}/index.html`, simplePage(pg)));

  // 404
  writeFile("404.html", simplePage({ title: "Page not found", url: "/404", html: "<p>That page slipped behind the couch. Try the <a href='/'>homepage</a> or browse our <a href='/guides/'>guides</a>.</p>" }));

  // feeds
  const urls = [
    { loc: "/" },
    { loc: "/guides/" },
    ...posts.map((p) => ({ loc: p.url, lastmod: p.updated || p.date })),
    ...Object.keys(site.categories).map((k) => ({ loc: `/category/${k}/` })),
    ...pages.map((p) => ({ loc: `/${p.path}/` })),
  ];
  writeFile("sitemap.xml", sitemap(urls));
  writeFile("rss.xml", rss(posts));

  console.log(`Built ${posts.length} posts + ${pages.length} pages + home, categories, feeds → dist/`);
}

function staticPages() {
  return [
    {
      path: "about",
      title: "About SnugNook",
      url: "/about/",
      html: `<p>SnugNook exists for everyone who has ever looked around a small apartment, a first studio, a dorm room, or a tiny home and thought: <em>there has to be a smarter way to use this space.</em></p>
<p>We test ideas, dig through thousands of products, and publish clear, honest guides that help you live bigger in less square footage — without expensive renovations or landlord headaches. Every recommendation is chosen to earn its place, because in a small space, everything has to.</p>
<p>Have a small-space problem you'd like us to solve? We'd love to hear it.</p>`,
    },
    {
      path: "affiliate-disclosure",
      title: "Affiliate Disclosure",
      url: "/affiliate-disclosure/",
      html: `<p>SnugNook is a reader-supported publication. To keep our guides free, we participate in affiliate programs, including the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.com and affiliated sites.</p>
<p>When you click a link to a product on our site and make a purchase, we may earn a small commission. This comes at <strong>no additional cost to you</strong> and never changes which products we recommend. We only suggest items we believe genuinely help you make the most of a small space.</p>`,
    },
    {
      path: "privacy",
      title: "Privacy Policy",
      url: "/privacy/",
      html: `<p>SnugNook respects your privacy. We collect only the information needed to operate this website and its newsletter.</p>
<h2>Information we collect</h2><p>If you subscribe to our newsletter, we store the email address you provide. We use standard, privacy-respecting analytics to understand which guides are helpful.</p>
<h2>Cookies & advertising</h2><p>Third-party vendors, including ad and affiliate partners, may use cookies to serve content based on your visits to this and other sites. You can opt out of personalized advertising through your browser or ad-settings pages.</p>
<h2>Contact</h2><p>Questions about this policy? Reach us any time through our contact channels.</p>`,
    },
  ];
}

build();
