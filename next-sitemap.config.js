import { readdirSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"

const __dirname = dirname(fileURLToPath(import.meta.url))

const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://loftlyy.com"

const locales = ["en", "es", "fr", "de", "ja", "it", "pt", "ko", "zh"]
const LOCALE_PREFIX_RE = /^\/(en|es|fr|de|ja|it|pt|ko|zh)(\/.*)?$/

// Auto-discover brand slugs from data/brands/ directory
const brandSlugs = readdirSync(join(__dirname, "data", "brands"))
  .filter((f) => f.endsWith(".ts") && f !== "index.ts")
  .map((f) => f.replace(".ts", ""))
  .sort()

function getAlternateRefs(path) {
  const match = path.match(LOCALE_PREFIX_RE)
  if (!match) {
    return []
  }

  const suffix = match[2] ?? ""

  return locales.map((locale) => ({
    hreflang: locale,
    href: `${SITE_URL}/${locale}${suffix}`,
    hrefIsAbsolute: true,
  }))
}

function getPathConfig(path) {
  if (path.match(LOCALE_PREFIX_RE)?.[2] === undefined) {
    return {
      changefreq: "daily",
      priority: 1.0,
    }
  }

  if (path.includes("/category/")) {
    return {
      changefreq: "daily",
      priority: 0.6,
    }
  }

  if (path.includes("/tag/")) {
    return {
      changefreq: "weekly",
      priority: 0.3,
    }
  }

  if (path.includes("/color/")) {
    return {
      changefreq: "weekly",
      priority: 0.2,
    }
  }

  if (path.endsWith("/colors")) {
    return {
      changefreq: "weekly",
      priority: 0.5,
    }
  }

  if (path.includes("/typography/")) {
    return {
      changefreq: "weekly",
      priority: 0.2,
    }
  }

  return {
    changefreq: "weekly",
    priority: 0.8,
  }
}

/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: SITE_URL,
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: ["**/opengraph-image*", "**/icon*", "**/apple-icon*"],
  additionalPaths: async (config) => {
    const paths = []

    for (const locale of locales) {
      paths.push(await config.transform(config, `/${locale}`))
      paths.push(await config.transform(config, `/${locale}/colors`))

      for (const slug of brandSlugs) {
        paths.push(await config.transform(config, `/${locale}/${slug}`))
      }
    }

    return paths.filter(Boolean)
  },
  transform: async (_config, path) => {
    if (
      path === "/_not-found" ||
      path.includes("opengraph-image") ||
      path.includes("icon") ||
      path.includes("apple-icon")
    ) {
      return null
    }

    const localizedMatch = path.match(LOCALE_PREFIX_RE)
    if (!localizedMatch) {
      return null
    }

    return {
      loc: path,
      alternateRefs: getAlternateRefs(path),
      ...getPathConfig(path),
      lastmod: new Date().toISOString(),
    }
  },
  robotsTxtOptions: {
    policies: [{ userAgent: "*", allow: "/" }],
  },
}

export default config
