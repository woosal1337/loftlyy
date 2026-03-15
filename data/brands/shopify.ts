import type { Brand } from "@/lib/types"

export const shopify: Brand = {
  slug: "shopify",
  name: "Shopify",
  description:
    "Shopify is a leading e-commerce platform that enables businesses of all sizes to create online stores, manage sales, and grow their brands. Founded in 2006 in Ottawa, Canada, Shopify powers millions of merchants in over 175 countries, providing tools for payments, shipping, marketing, and customer engagement.",
  url: "https://shopify.com",
  industry: "e-commerce",
  categories: ["e-commerce", "saas", "technology"],
  tags: [
    "e-commerce",
    "payments",
    "retail",
    "developer-tools",
    "platform",
  ],
  colors: [
    {
      name: "Shopify Green",
      hex: "#95BF47",
      usage: "Primary brand color, shopping bag icon, key accents.",
    },
    {
      name: "Dark Green",
      hex: "#5E8E3E",
      usage: "Shopping bag shadow, secondary green accent.",
    },
    {
      name: "Shopify Purple",
      hex: "#5A31F4",
      usage: "Digital primary, CTAs, links, interactive elements.",
    },
    {
      name: "Dark Navy",
      hex: "#004C3F",
      usage: "Dark backgrounds, headings, text emphasis.",
    },
    {
      name: "White",
      hex: "#FFFFFF",
      usage: "Backgrounds, light text on dark surfaces.",
    },
    {
      name: "Light Gray",
      hex: "#F4F6F8",
      usage: "Section backgrounds, cards, subtle dividers.",
    },
  ],
  typography: [
    {
      name: "PolySans",
      role: "Primary / Headings & Body",
      weights: ["500", "600", "700"],
      category: "sans-serif",
      designer: "Grillitype",
      foundry: "Grilli Type",
      fontUrl: "/brands/shopify/fonts/polysans-neutral.woff2",
    },
    {
      name: "IBM Plex Mono",
      role: "Code / Monospace",
      weights: ["400", "500"],
      category: "monospace",
      designer: "Mike Abbink",
      foundry: "IBM",
      fontUrl: "/brands/shopify/fonts/ibm-plex-mono-regular.woff2",
    },
  ],
  assets: [
    {
      label: "Shopify Logo — Color",
      src: "/brands/shopify/shopify-logo-black.svg",
      width: 500,
      height: 143,
      format: "svg",
    },
    {
      label: "Shopify Logo — White",
      src: "/brands/shopify/shopify-logo-white.svg",
      width: 500,
      height: 143,
      format: "svg",
    },
    {
      label: "Shopify Icon — Green",
      src: "/brands/shopify/shopify-icon-green.svg",
      width: 256,
      height: 256,
      format: "svg",
    },
    {
      label: "Shopify Icon — Black",
      src: "/brands/shopify/shopify-icon-black.svg",
      width: 256,
      height: 256,
      format: "svg",
    },
    {
      label: "Shopify Icon — White",
      src: "/brands/shopify/shopify-icon-white.svg",
      width: 256,
      height: 256,
      format: "svg",
    },
  ],
  thumbnail: {
    label: "Shopify Icon — Green",
    src: "/brands/shopify/shopify-icon-green.svg",
    width: 256,
    height: 256,
    format: "svg",
  },
  thumbnailDark: {
    label: "Shopify Icon — White",
    src: "/brands/shopify/shopify-icon-white.svg",
    width: 256,
    height: 256,
    format: "svg",
  },
  dateAdded: "2026-03-15",
  founded: 2006,
  headquarters: "Ottawa, Ontario, Canada",
  designer: "Shopify Design Team",
  lastRebranded: "2024",
  philosophy:
    "Shopify's brand identity centers on empowering entrepreneurship and making commerce accessible to everyone. The iconic shopping bag symbol and vibrant green palette reflect growth and possibility, while clean typography ensures the brand feels trustworthy and modern across every merchant touchpoint.",
  legal: {
    guidelinesUrl: "https://www.shopify.com/brand-assets",
    dos: [
      "Use official Shopify brand assets from the brand resources page",
      "Maintain minimum clear space around the Shopify logo",
      "Use the Shopify logo at 80px minimum for digital, 28mm for print",
      "Keep the 'S' on the Shopping Bag always white regardless of background",
    ],
    donts: [
      "Modify the Shopify logo proportions or colors outside approved variants",
      "Use the Shopify brand to imply partnership without written authorization",
      "Place the logo on visually busy or low-contrast backgrounds",
      "Associate the Shopify brand with illicit activities or deceptive practices",
    ],
  },
}
