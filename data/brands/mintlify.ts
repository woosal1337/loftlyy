import type { Brand } from "@/lib/types"

export const mintlify: Brand = {
  slug: "mintlify",
  name: "Mintlify",
  description:
    "Mintlify is the intelligent knowledge platform that helps teams create, maintain, and optimize documentation for both humans and AI. Built for developer-first companies, Mintlify powers beautiful, AI-native documentation used by over 2 million developers monthly.",
  url: "https://mintlify.com",
  industry: "saas",
  categories: ["saas", "technology", "minimal-logos"],
  tags: ["developer-tools", "documentation", "ai", "open-source"],
  colors: [
    {
      name: "Mint Green",
      hex: "#18E299",
      usage:
        "Primary brand accent color used for highlights, buttons, and the logo icon.",
    },
    {
      name: "Forest Green",
      hex: "#0C8C5E",
      usage:
        "Secondary brand color used in the logo icon and complementary accents.",
    },
    {
      name: "Black",
      hex: "#0D0D0D",
      usage: "Primary text and wordmark color for light backgrounds.",
    },
    {
      name: "White",
      hex: "#FFFFFF",
      usage: "Backgrounds, inverted wordmark, and dark mode surfaces.",
    },
    {
      name: "Gray",
      hex: "#6B7280",
      usage: "Secondary text, descriptions, and subtle UI elements.",
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
      fontUrl: "/brands/mintlify/fonts/inter-variable.woff2",
    },
  ],
  assets: [
    {
      label: "Mintlify Wordmark — Black",
      src: "/brands/mintlify/mintlify-wordmark-black.svg",
      width: 416,
      height: 96,
      format: "svg",
    },
    {
      label: "Mintlify Wordmark — White",
      src: "/brands/mintlify/mintlify-wordmark-white.svg",
      width: 416,
      height: 96,
      format: "svg",
    },
    {
      label: "Mintlify Icon — Color",
      src: "/brands/mintlify/mintlify-icon-color.svg",
      width: 128,
      height: 144,
      format: "svg",
    },
    {
      label: "Mintlify Icon — Black",
      src: "/brands/mintlify/mintlify-icon-black.svg",
      width: 128,
      height: 144,
      format: "svg",
    },
    {
      label: "Mintlify Icon — White",
      src: "/brands/mintlify/mintlify-icon-white.svg",
      width: 128,
      height: 144,
      format: "svg",
    },
  ],
  thumbnail: {
    label: "Mintlify Icon — Color",
    src: "/brands/mintlify/mintlify-icon-color.svg",
    width: 128,
    height: 144,
    format: "svg",
  },
  thumbnailDark: {
    label: "Mintlify Icon — White",
    src: "/brands/mintlify/mintlify-icon-white.svg",
    width: 128,
    height: 144,
    format: "svg",
  },
  dateAdded: "2026-03-16",
  founded: 2022,
  headquarters: "San Francisco, California",
  designer: "Mintlify Design Team",
  philosophy:
    "Mintlify's brand identity embodies the intersection of clarity and intelligence. Its signature mint green palette and clean, modern typography reflect the platform's mission to make documentation effortless and beautiful — transforming a traditionally neglected aspect of software into a competitive advantage.",
  legal: {
    dos: [
      "Use official Mintlify logos from authorized sources",
      "Maintain clear space around the Mintlify logo",
      "Use the brand colors as specified in the guidelines",
      "Reference Mintlify accurately when describing the platform",
    ],
    donts: [
      "Modify or distort the Mintlify logo in any way",
      "Use the Mintlify name to imply endorsement without permission",
      "Combine the Mintlify logo with other marks or icons",
      "Use outdated versions of the Mintlify logo",
    ],
  },
}
