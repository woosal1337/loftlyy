const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://loftlyy.com"

const locales = ["en", "es", "fr", "de", "ja", "it", "pt", "ko", "zh"]

// Brand slugs must be kept in sync with data/brands/index.ts
const brandSlugs = [
  "airbnb",
  "amazon",
  "anthropic",
  "apple",
  "cursor",
  "discord",
  "figma",
  "github",
  "google",
  "linear",
  "meta",
  "microsoft",
  "notion",
  "nvidia",
  "openai",
  "slack",
  "spotify",
  "stripe",
  "tesla",
  "vercel",
  "vscode",
  "wise",
  "x",
]

/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: SITE_URL,
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: ["**/opengraph-image*", "**/icon*", "**/apple-icon*"],
  additionalPaths: async () => {
    const now = new Date().toISOString()
    const paths = []

    for (const locale of locales) {
      // Home pages
      paths.push({
        loc: `/${locale}`,
        changefreq: "daily",
        priority: 1.0,
        lastmod: now,
      })

      // Brand pages
      for (const slug of brandSlugs) {
        paths.push({
          loc: `/${locale}/${slug}`,
          changefreq: "weekly",
          priority: 0.8,
          lastmod: now,
        })
      }
    }

    return paths
  },
  transform: async (_config, path) => {
    // Skip opengraph-image and icon routes
    if (
      path.includes("opengraph-image") ||
      path.includes("icon") ||
      path.includes("apple-icon")
    ) {
      return null
    }

    // Home pages (in case auto-discovered)
    if (path.match(/^\/(en|es|fr|de|ja|it|pt|ko|zh)$/)) {
      return {
        loc: path,
        changefreq: "daily",
        priority: 1.0,
        lastmod: new Date().toISOString(),
      }
    }

    // Category pages
    if (path.includes("/category/")) {
      return {
        loc: path,
        changefreq: "daily",
        priority: 0.6,
        lastmod: new Date().toISOString(),
      }
    }

    // Tag pages
    if (path.includes("/tag/")) {
      return {
        loc: path,
        changefreq: "daily",
        priority: 0.5,
        lastmod: new Date().toISOString(),
      }
    }

    // Color pages
    if (path.includes("/color/")) {
      return {
        loc: path,
        changefreq: "weekly",
        priority: 0.4,
        lastmod: new Date().toISOString(),
      }
    }

    // Typography pages
    if (path.includes("/typography/")) {
      return {
        loc: path,
        changefreq: "weekly",
        priority: 0.4,
        lastmod: new Date().toISOString(),
      }
    }

    // Brand pages
    return {
      loc: path,
      changefreq: "weekly",
      priority: 0.8,
      lastmod: new Date().toISOString(),
    }
  },
  robotsTxtOptions: {
    policies: [{ userAgent: "*", allow: "/" }],
  },
}

export default config
