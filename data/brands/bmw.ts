import type { Brand } from "@/lib/types"

export const bmw: Brand = {
  slug: "bmw",
  name: "BMW",
  description:
    "BMW (Bayerische Motoren Werke) is a German multinational manufacturer of luxury vehicles and motorcycles, founded in 1916 and headquartered in Munich, Germany. Originally an aircraft engine manufacturer, BMW has evolved into one of the world's leading premium automotive brands, celebrated for engineering excellence, driving dynamics, and innovation.",
  url: "https://www.bmw.com",
  industry: "automotive",
  categories: ["automotive", "geometric-logos", "minimal-logos"],
  tags: [
    "automotive",
    "luxury",
    "performance",
    "innovation",
    "electric-vehicles",
    "hardware",
  ],
  colors: [
    {
      name: "BMW Blue",
      hex: "#0166B1",
      usage: "Primary brand color, logo roundel quadrants, key brand elements.",
    },
    {
      name: "BMW Black",
      hex: "#000000",
      usage: "Logo ring, wordmark, text, dark mode branding.",
    },
    {
      name: "BMW White",
      hex: "#FFFFFF",
      usage:
        "Logo roundel quadrants, light backgrounds, reversed applications.",
    },
    {
      name: "BMW Dark Blue",
      hex: "#031E49",
      usage: "Deep accent, corporate and digital contexts.",
    },
    {
      name: "BMW Gray",
      hex: "#6F6F6F",
      usage: "Secondary neutral, supporting text, UI elements.",
    },
  ],
  typography: [
    {
      name: "BMW Type Next",
      role: "Primary / Headings & Body",
      weights: ["400", "700"],
      category: "sans-serif",
      designer: "BMW Group Design",
      foundry: "BMW Group",
      fontUrl: "/brands/bmw/fonts/BMWGroupTNProTT-Regular.woff2",
    },
  ],
  assets: [
    {
      label: "BMW Roundel — Color",
      src: "/brands/bmw/bmw-logo-color.svg",
      width: 256,
      height: 256,
      format: "svg",
    },
    {
      label: "BMW Roundel — Black",
      src: "/brands/bmw/bmw-logo-black.svg",
      width: 256,
      height: 256,
      format: "svg",
    },
    {
      label: "BMW Roundel — White",
      src: "/brands/bmw/bmw-logo-white.svg",
      width: 256,
      height: 256,
      format: "svg",
    },
  ],
  thumbnail: {
    label: "BMW Roundel — Color",
    src: "/brands/bmw/bmw-logo-color.svg",
    width: 256,
    height: 256,
    format: "svg",
  },
  thumbnailDark: {
    label: "BMW Roundel — White",
    src: "/brands/bmw/bmw-logo-white.svg",
    width: 256,
    height: 256,
    format: "svg",
  },
  dateAdded: "2026-03-21",
  founded: 1916,
  headquarters: "Munich, Germany",
  designer: "BECC Agency",
  lastRebranded: "2025",
  philosophy:
    "Through engineering precision and a relentless pursuit of driving pleasure, BMW's identity is anchored by the iconic roundel — a symbol inspired by the Bavarian flag that has represented premium automotive excellence for over a century. The 2020 rebrand by BECC Agency stripped the logo to a flat, transparent design, and a 2025 refinement for the Neue Klasse era removed inner chrome rings entirely, achieving a cleaner, more contemporary expression.",
  legal: {
    guidelinesUrl:
      "https://www.press.bmwgroup.com/global/article/search/category:2",
    dos: [
      "Use only official BMW-provided logos and marks",
      "Maintain minimum clear space around the BMW roundel",
      "Use the BMW roundel in approved color variants only",
      "Refer to the company as 'BMW' (all caps) in text",
    ],
    donts: [
      "Modify, distort, or alter the BMW roundel in any way",
      "Use the BMW name or logo to imply endorsement without authorization",
      "Combine the BMW roundel with other logos or symbols",
      "Recreate the BMW wordmark using substitute fonts",
    ],
  },
}
