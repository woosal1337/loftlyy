import type { Brand } from "@/lib/types"

export const uniswap: Brand = {
  slug: "uniswap",
  name: "Uniswap",
  description:
    "Uniswap is the largest decentralized exchange (DEX) built on Ethereum, enabling trustless token swaps through an automated market maker protocol. Founded in 2018 by Hayden Adams in New York City, Uniswap pioneered the AMM model and has facilitated over $3 trillion in trading volume across multiple blockchain networks.",
  url: "https://uniswap.org",
  industry: "fintech",
  categories: ["fintech", "technology", "minimal-logos"],
  tags: [
    "blockchain",
    "cryptocurrency",
    "web3",
    "defi",
    "crypto",
    "decentralized",
    "exchange",
  ],
  colors: [
    {
      name: "Uniswap Pink",
      hex: "#FF007A",
      usage:
        "Primary brand color, CTAs, interactive elements, and key accents.",
    },
    {
      name: "Uniswap Magenta",
      hex: "#F50DB4",
      usage: "Logo fill, secondary accents, gradients.",
    },
    {
      name: "Deep Pink",
      hex: "#FC72FF",
      usage: "Lighter accent, hover states, highlights.",
    },
    {
      name: "Interface Dark",
      hex: "#131313",
      usage: "Dark mode backgrounds, primary surfaces.",
    },
    {
      name: "Uniswap White",
      hex: "#FFFFFF",
      usage: "Light mode backgrounds, text on dark surfaces.",
    },
  ],
  typography: [
    {
      name: "Basel Grotesk",
      role: "Primary / Headings",
      weights: ["535"],
      category: "sans-serif",
      designer: "Optimo",
      foundry: "Optimo Type Foundry",
      fontUrl: "/brands/uniswap/fonts/Basel-Grotesk-Medium.woff2",
    },
    {
      name: "Basel Grotesk",
      role: "Body / UI",
      weights: ["485"],
      category: "sans-serif",
      designer: "Optimo",
      foundry: "Optimo Type Foundry",
      fontUrl: "/brands/uniswap/fonts/Basel-Grotesk-Book.woff2",
    },
  ],
  assets: [
    {
      label: "Uniswap Logo — Pink",
      src: "/brands/uniswap/uniswap-logo-pink.svg",
      width: 1001,
      height: 251,
      format: "svg",
    },
    {
      label: "Uniswap Logo — Black",
      src: "/brands/uniswap/uniswap-logo-black.svg",
      width: 1001,
      height: 251,
      format: "svg",
    },
    {
      label: "Uniswap Logo — White",
      src: "/brands/uniswap/uniswap-logo-white.svg",
      width: 1001,
      height: 251,
      format: "svg",
    },
    {
      label: "Uniswap Icon — Pink",
      src: "/brands/uniswap/uniswap-icon-pink.svg",
      width: 400,
      height: 434,
      format: "svg",
    },
    {
      label: "Uniswap Icon — Black",
      src: "/brands/uniswap/uniswap-icon-black.svg",
      width: 400,
      height: 434,
      format: "svg",
    },
    {
      label: "Uniswap Icon — White",
      src: "/brands/uniswap/uniswap-icon-white.svg",
      width: 400,
      height: 434,
      format: "svg",
    },
  ],
  thumbnail: {
    label: "Uniswap Icon — Pink",
    src: "/brands/uniswap/uniswap-icon-pink.svg",
    width: 400,
    height: 434,
    format: "svg",
  },
  thumbnailDark: {
    label: "Uniswap Icon — White",
    src: "/brands/uniswap/uniswap-icon-white.svg",
    width: 400,
    height: 434,
    format: "svg",
  },
  dateAdded: "2026-04-06",
  founded: 2018,
  headquarters: "New York City, New York",
  designer: "Timothy Luke & Uniswap Labs Design Team",
  lastRebranded: "2022",
  philosophy:
    "Uniswap's identity is built around its iconic unicorn mascot and vibrant pink palette, symbolizing the magical, frictionless nature of decentralized token exchange. The playful yet sophisticated branding reflects the protocol's mission to make financial markets open, transparent, and accessible to everyone without intermediaries.",
  legal: {
    guidelinesUrl: "https://github.com/Uniswap/brand-assets",
    dos: [
      "Use official Uniswap brand assets from the GitHub repository",
      "Maintain proper clearspace around the logo and icon",
      "Use approved color variants on appropriate backgrounds",
      "Refer to the platform as 'Uniswap' (capitalized) in text",
    ],
    donts: [
      "Modify or distort the unicorn logomark",
      "Use the Uniswap name or logo to imply endorsement",
      "Alter the brand colors of the logo",
      "Place the logo on low-contrast or busy backgrounds",
      "Use the Uniswap marks in a way that suggests affiliation without permission",
    ],
  },
}
