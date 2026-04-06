import type { Brand } from "@/lib/types"

export const ethereum: Brand = {
  slug: "ethereum",
  name: "Ethereum",
  description:
    "Ethereum is a decentralized, open-source blockchain platform that enables smart contracts and decentralized applications. Co-founded by Vitalik Buterin, Gavin Wood, and others, the network went live in 2015 and powers the second-largest cryptocurrency ecosystem, serving as foundational infrastructure for DeFi, NFTs, and Web3.",
  url: "https://ethereum.org",
  industry: "fintech",
  categories: ["fintech", "technology", "geometric-logos"],
  tags: [
    "blockchain",
    "cryptocurrency",
    "web3",
    "defi",
    "crypto",
    "decentralized",
    "smart-contracts",
    "open-source",
  ],
  colors: [
    {
      name: "Ethereum Purple",
      hex: "#8A92B2",
      usage:
        "Primary brand color used in the diamond logo and key brand materials.",
    },
    {
      name: "Ethereum Dark Purple",
      hex: "#62688F",
      usage: "Secondary facet color in the diamond logo, mid-tone accents.",
    },
    {
      name: "Ethereum Deep Purple",
      hex: "#454A75",
      usage: "Darkest facet of the diamond logo, depth and contrast.",
    },
    {
      name: "Ethereum Violet",
      hex: "#6C24DF",
      usage:
        "Primary UI accent color on ethereum.org, links and interactive elements.",
    },
    {
      name: "Ethereum Black",
      hex: "#343434",
      usage: "Text color, dark logo variant, headings.",
    },
    {
      name: "Ethereum Gray",
      hex: "#8C8C8C",
      usage: "Secondary text, light logo facets, supporting elements.",
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
      fontUrl: "/brands/ethereum/fonts/inter-regular.woff2",
    },
    {
      name: "IBM Plex Mono",
      role: "Code / Monospace",
      weights: ["400", "500", "700"],
      category: "monospace",
      designer: "Mike Abbink",
      foundry: "IBM",
      fontUrl: "/brands/ethereum/fonts/ibm-plex-mono-regular.woff2",
    },
  ],
  assets: [
    {
      label: "Ethereum Diamond — Black",
      src: "/brands/ethereum/ethereum-diamond-black.svg",
      width: 256,
      height: 417,
      format: "svg",
    },
    {
      label: "Ethereum Diamond — White",
      src: "/brands/ethereum/ethereum-diamond-white.svg",
      width: 256,
      height: 417,
      format: "svg",
    },
    {
      label: "Ethereum Diamond — Purple",
      src: "/brands/ethereum/ethereum-diamond-purple.svg",
      width: 256,
      height: 417,
      format: "svg",
    },
    {
      label: "Ethereum Diamond — Color",
      src: "/brands/ethereum/ethereum-diamond-color.svg",
      width: 256,
      height: 417,
      format: "svg",
    },
  ],
  thumbnail: {
    label: "Ethereum Diamond — Purple",
    src: "/brands/ethereum/ethereum-diamond-purple.svg",
    width: 256,
    height: 417,
    format: "svg",
  },
  thumbnailDark: {
    label: "Ethereum Diamond — White",
    src: "/brands/ethereum/ethereum-diamond-white.svg",
    width: 256,
    height: 417,
    format: "svg",
  },
  dateAdded: "2026-04-06",
  founded: 2015,
  headquarters: "Zug, Switzerland",
  designer: "Vitalik Buterin & community contributors",
  lastRebranded: "2022",
  philosophy:
    "Ethereum's identity reflects its mission as an open, decentralized world computer. The iconic diamond logomark — representing strength, clarity, and the multifaceted nature of a global platform — uses layered facets to convey depth and transparency, while the muted purple-blue palette signals trust, stability, and technical sophistication.",
  legal: {
    guidelinesUrl: "https://ethereum.org/assets",
    dos: [
      "Use official Ethereum brand assets from ethereum.org/assets",
      "Maintain adequate clearspace around the diamond logo",
      "Use the logo on clean, uncluttered backgrounds",
      "Refer to the platform as 'Ethereum' (capitalized) in text",
    ],
    donts: [
      "Use the Ethereum logo commercially without permission",
      "Modify, distort, or recolor the official diamond logo",
      "Place the logo on busy or low-contrast backgrounds",
      "Use the logo to imply official Ethereum Foundation endorsement",
      "Create derivative logos based on the diamond mark",
    ],
  },
}
