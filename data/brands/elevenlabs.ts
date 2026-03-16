import type { Brand } from "@/lib/types"

export const elevenlabs: Brand = {
  slug: "elevenlabs",
  name: "ElevenLabs",
  description:
    "ElevenLabs is an AI audio research company specializing in realistic text-to-speech synthesis, voice cloning, and conversational AI. Founded in 2022, the platform enables creators and developers to generate lifelike speech with natural emotion and intonation across 32 languages.",
  url: "https://elevenlabs.io",
  industry: "ai",
  categories: ["ai", "technology", "saas", "minimal-logos"],
  tags: ["artificial-intelligence", "developer-tools", "voice-ai"],
  colors: [
    {
      name: "Black",
      hex: "#000000",
      usage:
        "Primary brand color, logo, and text. Reflects research and engineering focus.",
    },
    {
      name: "White",
      hex: "#FFFFFF",
      usage: "Backgrounds, inverted logo, and dark mode surfaces.",
    },
    {
      name: "Neutral 100",
      hex: "#F5F5F5",
      usage: "Light backgrounds, cards, and subtle surfaces.",
    },
    {
      name: "Blue",
      hex: "#5D79DF",
      usage: "Accent color for interactive elements and highlights.",
    },
    {
      name: "Green",
      hex: "#10B978",
      usage: "Success states, positive indicators, and secondary accents.",
    },
  ],
  typography: [
    {
      name: "Waldenburg",
      role: "Display / Headings",
      weights: ["400", "700"],
      category: "sans-serif",
      designer: "KMR",
      foundry: "KMR",
      fontUrl: "/brands/elevenlabs/fonts/waldenburg-buch.woff2",
    },
    {
      name: "Inter",
      role: "Body / UI",
      weights: ["400", "500", "600", "700"],
      category: "sans-serif",
      designer: "Rasmus Andersson",
      foundry: "Google Fonts",
      fontUrl: "/brands/elevenlabs/fonts/inter-regular.woff2",
    },
  ],
  assets: [
    {
      label: "ElevenLabs Wordmark — Black",
      src: "/brands/elevenlabs/elevenlabs-logo-black.svg",
      width: 694,
      height: 90,
      format: "svg",
    },
    {
      label: "ElevenLabs Wordmark — White",
      src: "/brands/elevenlabs/elevenlabs-logo-white.svg",
      width: 694,
      height: 90,
      format: "svg",
    },
    {
      label: "ElevenLabs Symbol — Black",
      src: "/brands/elevenlabs/elevenlabs-symbol-black.svg",
      width: 876,
      height: 876,
      format: "svg",
    },
    {
      label: "ElevenLabs Symbol — White",
      src: "/brands/elevenlabs/elevenlabs-symbol-white.svg",
      width: 876,
      height: 876,
      format: "svg",
    },
  ],
  thumbnail: {
    label: "ElevenLabs Symbol — Black",
    src: "/brands/elevenlabs/elevenlabs-symbol-black.svg",
    width: 876,
    height: 876,
    format: "svg",
  },
  thumbnailDark: {
    label: "ElevenLabs Symbol — White",
    src: "/brands/elevenlabs/elevenlabs-symbol-white.svg",
    width: 876,
    height: 876,
    format: "svg",
  },
  dateAdded: "2026-03-16",
  founded: 2022,
  headquarters: "New York City, New York",
  designer: "Basement Studio",
  lastRebranded: "2024",
  philosophy:
    "ElevenLabs' brand identity is built on stark minimalism — a black-and-white palette that signals its research-driven foundation. The iconic double vertical lines abstract the number eleven while evoking a pause button, bridging the gap between audio technology and visual identity with elegant simplicity.",
  legal: {
    guidelinesUrl: "https://elevenlabs.io/brand",
    dos: [
      "Use official ElevenLabs brand assets from the brand page",
      "Maintain the minimum clear space equal to the logo height",
      "Use the logo on clean, uncluttered backgrounds",
      "Reference ElevenLabs accurately when describing the platform",
    ],
    donts: [
      "Modify, distort, or rotate the ElevenLabs logo",
      "Change the logo colors or apply gradients",
      "Place the logo on busy backgrounds that reduce legibility",
      "Combine the logo with other marks or create lockups",
    ],
  },
}
