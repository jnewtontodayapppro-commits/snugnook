// SnugNook site configuration
export const site = {
  name: "SnugNook",
  tagline: "Big ideas for small spaces",
  description:
    "Practical guides, smart product picks, and clever ideas for making the most of apartments, tiny homes, dorms, and any small space.",
  // Custom domain (registered):
  url: "https://snugnook.net",
  locale: "en_US",
  author: "The SnugNook Team",
  email: "hello@snugnook.net",
  // Amazon Associates tracking ID (US store):
  amazonTag: "wildguns84-20",
  // Pinterest domain-claim verification tag:
  pinterestVerify: "c4a42655d3d62daf30c7051844481c0e",
  // ClickBank affiliate (nickname: pinitwjosh). Paste the real HopLink from the
  // Marketplace "Promote" button into `url` and the callout goes live everywhere.
  // A callout only renders when its `url` is set, so nothing broken ever publishes.
  clickbank: {
    nickname: "pinitwjosh",
    offers: {
      woodworking: {
        url: "https://hop.clickbank.net/?affiliate=pinitwjosh&vendor=tedsplans&tid=snugnook",
        tag: "BUILD IT YOURSELF",
        title: "Want the exact plans to build these?",
        blurb:
          "A library of 16,000+ step-by-step woodworking plans — shelving, storage beds, fold-down desks, and space-savers with cut lists and diagrams for every skill level.",
        cta: "See the plans →",
      },
    },
  },
  nav: [
    { label: "Guides", href: "/guides/" },
    { label: "Organization", href: "/category/organization/" },
    { label: "Furniture", href: "/category/furniture/" },
    { label: "Kitchen", href: "/category/kitchen/" },
    { label: "About", href: "/about/" },
  ],
  categories: {
    organization: {
      title: "Organization & Storage",
      blurb: "Reclaim every square inch with storage that actually works.",
    },
    furniture: {
      title: "Furniture & Layout",
      blurb: "Multi-tasking, space-saving pieces and layouts that breathe.",
    },
    kitchen: {
      title: "Small Kitchens",
      blurb: "Cook, store, and entertain in a compact kitchen.",
    },
    decor: {
      title: "Decor & Lighting",
      blurb: "Make a small space feel bright, warm, and bigger than it is.",
    },
    renting: {
      title: "Renter-Friendly",
      blurb: "Upgrades that won't cost you the security deposit.",
    },
  },
};
