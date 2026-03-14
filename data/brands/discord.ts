import type { Brand } from "@/lib/types"

export const discord: Brand = {
  slug: "discord",
  name: "Discord",
  description:
    "Discord is a voice, video, and text communication platform designed for creating communities. Originally built for gamers, it has expanded to serve communities of all kinds — from study groups to art collectives to open-source projects. Discord's mission is to create space for everyone to find belonging.",
  url: "https://discord.com",
  industry: "social-media",
  categories: ["social-media", "saas", "geometric-logos"],
  tags: ["communication", "community", "gaming", "voice-chat", "messaging"],
  colors: [
    {
      name: "Blurple",
      hex: "#5865F2",
      usage: "Primary brand color. Used across the logo, buttons, links, and interactive elements.",
    },
    {
      name: "Green",
      hex: "#57F287",
      usage: "Success states, online status indicator, positive actions.",
    },
    {
      name: "Yellow",
      hex: "#FEE75C",
      usage: "Idle status, warnings, attention-grabbing accents.",
    },
    {
      name: "Fuchsia",
      hex: "#EB459E",
      usage: "Nitro branding, premium features, playful accents.",
    },
    {
      name: "Red",
      hex: "#ED4245",
      usage: "Error states, destructive actions, Do Not Disturb status.",
    },
    {
      name: "Not Quite Black",
      hex: "#23272A",
      usage: "Dark theme backgrounds, logo on light backgrounds.",
    },
    {
      name: "Dark (Not Black)",
      hex: "#2C2F33",
      usage: "Secondary dark backgrounds, sidebar in dark mode.",
    },
    {
      name: "Greyple",
      hex: "#99AAB5",
      usage: "Muted text, secondary text, offline status.",
    },
  ],
  typography: [
    {
      name: "Ginto Nord",
      role: "Display / Headlines",
      weights: ["700", "800", "900"],
      category: "sans-serif",
      designer: "Rui Abreu",
      foundry: "R-Typography",
      fontUrl: "/brands/discord/fonts/ginto-nord.woff2",
    },
    {
      name: "Ginto",
      role: "Subheadings / UI",
      weights: ["400", "500", "600", "700"],
      category: "sans-serif",
      designer: "Rui Abreu",
      foundry: "R-Typography",
      fontUrl: "/brands/discord/fonts/ginto.woff2",
    },
    {
      name: "gg sans",
      role: "Body / Interface",
      weights: ["400", "500", "600", "700"],
      category: "sans-serif",
      designer: "Discord Design Team",
      foundry: "Discord (custom)",
      fontUrl: "/brands/discord/fonts/gg-sans.woff2",
    },
  ],
  assets: [
    {
      label: "Clyde (Blurple)",
      src: "/brands/discord/logo-clyde.svg",
      width: 127,
      height: 96,
      format: "svg",
    },
    {
      label: "Clyde (White)",
      src: "/brands/discord/logo-clyde-white.svg",
      width: 127,
      height: 96,
      format: "svg",
    },
    {
      label: "Clyde (Dark)",
      src: "/brands/discord/logo-clyde-black.svg",
      width: 127,
      height: 96,
      format: "svg",
    },
    {
      label: "Full Wordmark",
      src: "/brands/discord/logo-wordmark.svg",
      width: 384,
      height: 96,
      format: "svg",
    },
  ],
  thumbnail: {
    label: "Clyde Icon",
    src: "/brands/discord/logo-clyde.svg",
    width: 127,
    height: 96,
    format: "svg",
  },
  dateAdded: "2026-03-14",
  founded: 2015,
  headquarters: "San Francisco, CA",
  designer: "Discord Design Team",
  lastRebranded: "2021",
  philosophy:
    "Playful, approachable, and inclusive. Discord's identity balances youthful energy with the clarity needed for a communication platform, using the iconic Clyde mascot and Blurple as anchors of recognition.",
  legal: {
    guidelinesUrl: "https://discord.com/branding",
    dos: [
      "You must have permission from Discord before using any of the Discord Marks or Brand Assets except as permitted in their guidelines.",
    ],
    donts: [
      "Incorporate the Discord Marks into the name of a Discord server, brand, company, URL, domain name, event, product name, logo, social media account, or trademark.",
      "Adopt any trademarks, trade dress, logos, domain names, or other features that are confusingly similar to the Discord Marks or Brand Assets.",
      "Copy or imitate the look and feel of the Discord website, desktop app, or mobile app, including characters, color combinations, graphics, sounds, imagery, presence icons, typefaces, or stylization.",
      "Use the Discord Marks and Brand Assets in a manner inconsistent with Discord's Terms of Service or Community Guidelines.",
      "Use the Discord Marks or Brand Assets on merchandise.",
    ],
  },
}
