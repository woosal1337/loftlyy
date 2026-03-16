import type { Brand } from "@/lib/types"

export const notra: Brand = {
  slug: "notra",
  name: "Notra",
  description:
    "Notra is an AI-powered content automation platform that connects to developer tools like GitHub, Linear, and Slack to automatically generate publish-ready content from shipped work. It transforms merged PRs, features, and milestones into changelogs, blog posts, and social updates while matching your team's brand voice.",
  url: "https://usenotra.com",
  industry: "saas",
  categories: ["saas", "ai", "technology"],
  tags: ["developer-tools", "productivity", "content-automation"],
  colors: [
    {
      name: "Notra Cream",
      hex: "#F7F5F3",
      usage: "Primary background color, content surfaces, and light mode base.",
    },
    {
      name: "Notra Ink",
      hex: "#1F1A17",
      usage: "Primary text, logo strokes, dark UI elements, and headings.",
    },
    {
      name: "Notra Lavender",
      hex: "#C8B2EE",
      usage:
        "Brand accent color, logo fill, highlights, and interactive elements.",
    },
  ],
  typography: [
    {
      name: "Instrument Serif",
      role: "Display / Headings",
      weights: ["400"],
      category: "serif",
      designer: "Rodrigo Fuenzalida",
      foundry: "Google Fonts",
      fontUrl: "/brands/notra/fonts/instrument-serif.woff2",
    },
    {
      name: "Inter",
      role: "Body / UI",
      weights: ["400", "500", "600", "700"],
      category: "sans-serif",
      designer: "Rasmus Andersson",
      foundry: "Google Fonts",
      fontUrl: "/brands/notra/fonts/inter.woff2",
    },
  ],
  assets: [
    {
      label: "Notra Mark — Black",
      src: "/brands/notra/notra-mark-black.svg",
      width: 800,
      height: 800,
      format: "svg",
    },
    {
      label: "Notra Mark — White",
      src: "/brands/notra/notra-mark-white.svg",
      width: 800,
      height: 800,
      format: "svg",
    },
    {
      label: "Notra Mark — Brand",
      src: "/brands/notra/notra-mark-brand.svg",
      width: 800,
      height: 800,
      format: "svg",
    },
  ],
  thumbnail: {
    label: "Notra Mark — Brand",
    src: "/brands/notra/notra-mark-brand.svg",
    width: 800,
    height: 800,
    format: "svg",
  },
  thumbnailDark: {
    label: "Notra Mark — White",
    src: "/brands/notra/notra-mark-white.svg",
    width: 800,
    height: 800,
    format: "svg",
  },
  dateAdded: "2026-03-16",
  founded: 2025,
  headquarters: "Stuttgart, Germany",
  designer: "Dominik Koch",
  philosophy:
    "Notra's identity blends editorial warmth with technical precision. The hand-drawn quill mark evokes creative authorship, while the soft lavender accent and serif-meets-sans typography pairing signal a product that bridges the gap between engineering workflow and polished content output.",
  legal: {
    dos: [
      "Use official Notra brand assets from the brand guidelines",
      "Maintain clear space around the Notra logo mark",
      "Use the brand color variant on light backgrounds",
    ],
    donts: [
      "Alter or distort the Notra quill mark",
      "Use Notra branding to imply endorsement without permission",
      "Recreate the logo using text elements or substitute fonts",
    ],
  },
}
