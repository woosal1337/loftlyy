import type { Brand } from "@/lib/types"

export const cloudflare: Brand = {
  slug: "cloudflare",
  name: "Cloudflare",
  description:
    "Cloudflare is a global cloud platform that provides a broad range of network services to businesses of all sizes, making them more secure and faster. Founded in 2009 in San Francisco, Cloudflare operates one of the world's largest networks, powering millions of websites and serving trillions of requests per month.",
  url: "https://cloudflare.com",
  industry: "technology",
  categories: ["technology", "saas", "geometric-logos"],
  tags: [
    "cloud-infrastructure",
    "cybersecurity",
    "cdn",
    "dns",
    "developer-tools",
  ],
  colors: [
    {
      name: "Cloudflare Orange",
      hex: "#F38020",
      usage: "Primary brand color, logo cloud icon, CTAs.",
    },
    {
      name: "Cloudflare Yellow Orange",
      hex: "#FAAE40",
      usage: "Secondary brand color, logo accent, gradients.",
    },
    {
      name: "Charcoal",
      hex: "#404041",
      usage: "Primary text, dark backgrounds, headings.",
    },
    {
      name: "Cloudflare Red",
      hex: "#FF6633",
      usage: "Accent highlights, interactive elements, gradients.",
    },
    {
      name: "Cloud Light",
      hex: "#FDD6A0",
      usage: "Tertiary accent, light backgrounds, subtle highlights.",
    },
    {
      name: "White",
      hex: "#FFFFFF",
      usage: "Backgrounds, reversed text on dark surfaces.",
    },
  ],
  typography: [
    {
      name: "Inter",
      role: "Primary / Headings & Body",
      weights: ["400", "500", "600", "700"],
      category: "sans-serif",
      designer: "Rasmus Andersson",
      foundry: "Google Fonts",
      fontUrl: "/brands/cloudflare/fonts/inter-var.woff2",
    },
  ],
  assets: [
    {
      label: "Cloudflare Wordmark — Color",
      src: "/brands/cloudflare/cloudflare-wordmark-color.svg",
      width: 480,
      height: 300,
      format: "svg",
    },
    {
      label: "Cloudflare Wordmark — Black",
      src: "/brands/cloudflare/cloudflare-wordmark-black.svg",
      width: 480,
      height: 300,
      format: "svg",
    },
    {
      label: "Cloudflare Wordmark — White",
      src: "/brands/cloudflare/cloudflare-wordmark-white.svg",
      width: 480,
      height: 300,
      format: "svg",
    },
    {
      label: "Cloudflare Icon — Orange",
      src: "/brands/cloudflare/cloudflare-icon-orange.svg",
      width: 128,
      height: 128,
      format: "svg",
    },
    {
      label: "Cloudflare Icon — Black",
      src: "/brands/cloudflare/cloudflare-icon-black.svg",
      width: 128,
      height: 128,
      format: "svg",
    },
    {
      label: "Cloudflare Icon — White",
      src: "/brands/cloudflare/cloudflare-icon-white.svg",
      width: 128,
      height: 128,
      format: "svg",
    },
  ],
  thumbnail: {
    label: "Cloudflare Icon — Orange",
    src: "/brands/cloudflare/cloudflare-icon-orange.svg",
    width: 128,
    height: 128,
    format: "svg",
  },
  thumbnailDark: {
    label: "Cloudflare Icon — White",
    src: "/brands/cloudflare/cloudflare-icon-white.svg",
    width: 128,
    height: 128,
    format: "svg",
  },
  dateAdded: "2026-04-06",
  founded: 2009,
  headquarters: "San Francisco, California",
  designer: "Cloudflare Design Team",
  lastRebranded: "2025",
  philosophy:
    "Cloudflare's brand identity reflects its mission to help build a better Internet. The iconic cloud-and-flare mark uses warm orange and gold tones to convey energy, reliability, and warmth, while the clean sans-serif wordmark communicates technical precision and approachability.",
  legal: {
    guidelinesUrl: "https://www.cloudflare.com/trademark/",
    dos: [
      "Use official Cloudflare brand assets from the press kit",
      "Refer to the company as 'Cloudflare' with correct capitalization",
      "Properly designate trademarks with ® or ™ on first use",
      "Use trademarks as adjectives followed by generic terms",
    ],
    donts: [
      "Alter Cloudflare web badges in color, size, or appearance",
      "Use Cloudflare trademarks as verbs or in plural/possessive forms",
      "Incorporate Cloudflare marks into your own product or company name",
      "Use the brand in ways implying endorsement without written permission",
    ],
  },
}
