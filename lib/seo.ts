import type { Brand } from "@/lib/types"
const ABSOLUTE_URL_RE = /^https?:\/\//i
const TITLE_MAX_LENGTH = 65
const DESCRIPTION_MAX_LENGTH = 160

export const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL?.trim() || "https://loftlyy.com"

type TranslationValues = Record<string, string | number>
type TranslationFn = (key: string, values?: TranslationValues) => string

export interface SeoFaqItem {
  question: string
  answer: string
}

export type SummaryItemKind = "colors" | "typography" | "assets"

export interface SummaryItem {
  kind: SummaryItemKind
  text: string
}

export interface BrandSeoContent {
  title: string
  description: string
  keywords: string[]
  summaryParagraphs: string[]
  summaryItems: SummaryItem[]
  faqQuestions: SeoFaqItem[]
  imageUrls: string[]
  primaryImageUrl: string
}

function dedupe(values: string[]): string[] {
  return Array.from(new Set(values.filter(Boolean)))
}

function formatList(values: string[], locale: string, style: "long" | "short") {
  return new Intl.ListFormat(locale, {
    style,
    type: "conjunction",
  }).format(values)
}

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text
  }

  const sliced = text.slice(0, maxLength - 1).trimEnd()
  const lastSpace = sliced.lastIndexOf(" ")
  const safeSlice =
    lastSpace > maxLength / 2 ? sliced.slice(0, lastSpace) : sliced

  return `${safeSlice.replace(/[.,;:!?-]+$/u, "")}…`
}

function joinSentences(parts: string[]): string {
  return parts.map((part) => part.trim()).join(" ")
}

function takeWithinLimit(parts: string[], maxLength: number): string {
  const selected: string[] = []

  for (const part of parts) {
    const next = joinSentences([...selected, part])
    if (next.length <= maxLength || selected.length === 0) {
      selected.push(part)
      continue
    }
    break
  }

  return truncateText(joinSentences(selected), maxLength)
}

export function toAbsoluteUrl(path: string): string {
  if (!path) {
    return BASE_URL
  }

  if (ABSOLUTE_URL_RE.test(path)) {
    return path
  }

  return new URL(path, BASE_URL).toString()
}

function getTopHexCodes(brand: Brand): string[] {
  return dedupe(brand.colors.map((color) => color.hex.toUpperCase())).slice(
    0,
    3
  )
}

function getTopFontNames(brand: Brand): string[] {
  return dedupe(brand.typography.map((font) => font.name)).slice(0, 2)
}

function getDownloadFormats(brand: Brand): string[] {
  return dedupe(
    brand.assets
      .map((asset) => asset.format.toLowerCase())
      .filter((format) => format === "svg" || format === "png")
      .map((format) => format.toUpperCase())
  )
}

function getImageUrls(brand: Brand): string[] {
  const assetImages = dedupe(
    brand.assets.map((asset) => toAbsoluteUrl(asset.src))
  )
  if (assetImages.length > 0) {
    return assetImages.slice(0, 3)
  }

  return [toAbsoluteUrl(brand.thumbnail.src)]
}

export function composeBrandSeoContent({
  brand,
  locale,
  tSeo,
  translatedIndustry,
}: {
  brand: Brand
  locale: string
  tSeo: TranslationFn
  translatedIndustry: string
}): BrandSeoContent {
  const hexCodes = getTopHexCodes(brand)
  const fontNames = getTopFontNames(brand)
  const downloadFormats = getDownloadFormats(brand)
  const imageUrls = getImageUrls(brand)

  const titleSegments: string[] = []
  if (hexCodes.length > 0) {
    titleSegments.push(tSeo("titleColorsSegment"))
  }
  if (fontNames.length > 0) {
    titleSegments.push(tSeo("titleTypographySegment"))
  }
  if (brand.assets.length > 0) {
    titleSegments.push(tSeo("titleLogoSegment"))
  }

  const selectedTitleSegments: string[] = []
  for (const segment of titleSegments) {
    const candidate = tSeo("brandIntentTitle", {
      brandName: brand.name,
      segments: formatList(
        [...selectedTitleSegments, segment],
        locale,
        "short"
      ),
    })

    if (
      candidate.length <= TITLE_MAX_LENGTH ||
      selectedTitleSegments.length === 0
    ) {
      selectedTitleSegments.push(segment)
    }
  }

  const title =
    selectedTitleSegments.length > 0
      ? tSeo("brandIntentTitle", {
          brandName: brand.name,
          segments: formatList(selectedTitleSegments, locale, "short"),
        })
      : tSeo("brandTitle", { brandName: brand.name })

  const descriptionParts = [tSeo("metaIntro", { brandName: brand.name })]

  if (hexCodes.length > 0) {
    descriptionParts.push(
      tSeo("metaColorsClause", {
        brandName: brand.name,
        colors: formatList(hexCodes, locale, "long"),
      })
    )
  }

  if (fontNames.length > 0) {
    descriptionParts.push(
      tSeo("metaTypographyClause", {
        brandName: brand.name,
        fonts: formatList(fontNames, locale, "long"),
      })
    )
  }

  if (brand.assets.length > 0) {
    descriptionParts.push(
      downloadFormats.length > 0
        ? tSeo("metaLogoFormatsClause", {
            brandName: brand.name,
            formats: formatList(downloadFormats, locale, "long"),
          })
        : tSeo("metaLogoAvailableClause", { brandName: brand.name })
    )
  }

  const description = takeWithinLimit(descriptionParts, DESCRIPTION_MAX_LENGTH)

  const summaryParagraphs: string[] = []
  const summaryItems: SummaryItem[] = []
  if (hexCodes.length > 0) {
    const text = tSeo("summaryColors", {
      brandName: brand.name,
      colors: formatList(hexCodes, locale, "long"),
    })
    summaryParagraphs.push(text)
    summaryItems.push({ kind: "colors", text })
  }
  if (fontNames.length > 0) {
    const text = tSeo("summaryTypography", {
      brandName: brand.name,
      fonts: formatList(fontNames, locale, "long"),
    })
    summaryParagraphs.push(text)
    summaryItems.push({ kind: "typography", text })
  }
  if (brand.assets.length > 0) {
    const text =
      downloadFormats.length > 0
        ? tSeo("summaryLogoFormats", {
            brandName: brand.name,
            formats: formatList(downloadFormats, locale, "long"),
          })
        : tSeo("summaryLogoAvailable", { brandName: brand.name })
    summaryParagraphs.push(text)
    summaryItems.push({ kind: "assets", text })
  }

  const faqQuestions: SeoFaqItem[] = []
  if (hexCodes.length > 0) {
    faqQuestions.push({
      question: tSeo("faqColorQuestion", { brandName: brand.name }),
      answer: tSeo("faqColorAnswer", {
        brandName: brand.name,
        colors: formatList(hexCodes, locale, "long"),
      }),
    })
  }
  if (fontNames.length > 0) {
    faqQuestions.push({
      question: tSeo("faqFontQuestion", { brandName: brand.name }),
      answer: tSeo("faqFontAnswer", {
        brandName: brand.name,
        fonts: formatList(fontNames, locale, "long"),
      }),
    })
  }
  if (brand.assets.length > 0) {
    faqQuestions.push({
      question: tSeo("faqLogoQuestion", { brandName: brand.name }),
      answer:
        downloadFormats.length > 0
          ? tSeo("faqLogoFormatsAnswer", {
              brandName: brand.name,
              formats: formatList(downloadFormats, locale, "long"),
            })
          : tSeo("faqLogoAvailableAnswer", { brandName: brand.name }),
    })
  }

  faqQuestions.push({
    question: tSeo("faqIndustryQuestion", { brandName: brand.name }),
    answer: tSeo("faqIndustryAnswer", {
      brandName: brand.name,
      industry: translatedIndustry,
    }),
  })

  if (brand.founded) {
    faqQuestions.push({
      question: tSeo("faqFoundedQuestion", { brandName: brand.name }),
      answer: tSeo("faqFoundedAnswer", {
        brandName: brand.name,
        year: brand.founded,
      }),
    })
  }

  const keywords = dedupe([
    ...(hexCodes.length > 0
      ? [
          tSeo("keywordColors", { brandName: brand.name }),
          tSeo("keywordHexCodes", { brandName: brand.name }),
          ...hexCodes.map((hex) => `${brand.name} ${hex}`),
        ]
      : []),
    ...(fontNames.length > 0
      ? [
          tSeo("keywordTypography", { brandName: brand.name }),
          tSeo("keywordFont", { brandName: brand.name }),
          ...fontNames.map((font) => `${brand.name} ${font}`),
        ]
      : []),
    ...(brand.assets.length > 0
      ? [tSeo("keywordLogoDownload", { brandName: brand.name })]
      : []),
  ])

  return {
    title,
    description,
    keywords,
    summaryParagraphs,
    summaryItems,
    faqQuestions,
    imageUrls,
    primaryImageUrl: imageUrls[0] ?? toAbsoluteUrl(brand.thumbnail.src),
  }
}
