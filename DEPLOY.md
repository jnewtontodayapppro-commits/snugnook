# Deploying SnugNook (free, ~5 minutes)

SnugNook is a static site. It builds with one command and hosts free anywhere.

## Build

```bash
npm install        # first time only
node build.mjs     # outputs the finished site to ./dist
```

## Option A — Cloudflare Pages (recommended, free, custom domains free)

1. Create a free account at cloudflare.com.
2. Workers & Pages → Create → Pages → Connect to Git (or Direct Upload).
3. If connecting Git: build command `node build.mjs`, output directory `dist`.
4. Deploy. You get a free `*.pages.dev` URL instantly.

## Option B — GitHub Pages (free)

1. Push this repo to a new GitHub repository.
2. Run `node build.mjs`, then publish the `dist/` folder to the `gh-pages` branch.
3. Settings → Pages → set source to `gh-pages`.

## Option C — Vercel or Netlify (free)

Connect the repo; framework preset "Other"; build `node build.mjs`; output `dist`.

## Adding content later

Drop a new `.md` file into `content/` with front matter (see any existing file for the format), then rerun `node build.mjs`. Categories, sitemap, and RSS update automatically.

## Before monetizing

- Set `amazonTag` in `config.mjs` once your Amazon Associates account is approved.
- Update `url` in `config.mjs` if you buy a custom domain.
- Submit `sitemap.xml` to Google Search Console.
