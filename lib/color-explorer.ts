import { colorFamilies } from "@/data/color-families"
import { hexToColorFamily, normalizeHex } from "@/lib/filters"
import type {
  ClosestColorSuggestion,
  ColorExplorerEntry,
  PaletteMatchResult,
  SidebarBrand,
} from "@/lib/types"

export const MAX_COLOR_EXPLORER_PALETTE = 5

export const colorFamilyOrder = colorFamilies.map((family) => family.slug)

const validColorFamilies = new Set(colorFamilyOrder)

export function toColorExplorerHex(hex: string): string {
  return hex.startsWith("#") ? hex : `#${hex}`
}

export function normalizeColorExplorerHex(value: string): string | null {
  const normalized = normalizeHex(value)
  return normalized ? normalized.slice(1) : null
}

export function parseColorExplorerPalette(value: string | null): string[] {
  if (!value) return []

  const uniquePalette = new Set<string>()
  for (const token of value.split(",")) {
    const normalized = normalizeColorExplorerHex(token)
    if (!normalized || uniquePalette.has(normalized)) continue

    uniquePalette.add(normalized)
    if (uniquePalette.size >= MAX_COLOR_EXPLORER_PALETTE) break
  }

  return Array.from(uniquePalette)
}

export function parseColorExplorerPaletteInput(value: string): string[] {
  if (!value.trim()) return []

  const uniquePalette = new Set<string>()
  for (const token of value.split(/[\s,]+/)) {
    const normalized = normalizeColorExplorerHex(token)
    if (!normalized || uniquePalette.has(normalized)) continue

    uniquePalette.add(normalized)
    if (uniquePalette.size >= MAX_COLOR_EXPLORER_PALETTE) break
  }

  return Array.from(uniquePalette)
}

export function parseColorExplorerFamilies(value: string | null): string[] {
  if (!value) return []

  const uniqueFamilies = new Set<string>()
  for (const token of value.split(",")) {
    const normalized = token.trim().toLowerCase()
    if (!validColorFamilies.has(normalized) || uniqueFamilies.has(normalized)) {
      continue
    }

    uniqueFamilies.add(normalized)
  }

  return Array.from(uniqueFamilies)
}

export function parseColorExplorerSwatch(value: string | null): string | null {
  return value ? normalizeColorExplorerHex(value) : null
}

export function serializeColorExplorerPalette(value: string[]): string | null {
  const palette = parseColorExplorerPalette(value.join(","))
  return palette.length > 0 ? palette.join(",") : null
}

export function serializeColorExplorerFamilies(value: string[]): string | null {
  const families = parseColorExplorerFamilies(value.join(","))
  return families.length > 0 ? families.join(",") : null
}

export function serializeColorExplorerSwatch(
  value: string | null
): string | null {
  return value ? normalizeColorExplorerHex(value) : null
}

export function matchBrandsByPalette(
  brands: SidebarBrand[],
  palette: string[]
): PaletteMatchResult[] {
  const normalizedPalette = parseColorExplorerPalette(palette.join(","))
  if (normalizedPalette.length === 0) return []

  const selectedColors = normalizedPalette.map((queryHex) => {
    const hex = toColorExplorerHex(queryHex)
    return {
      hex,
      family: hexToColorFamily(hex),
    }
  })

  return brands
    .map((brand) => {
      const brandHexes = new Set(
        brand.colors
          .map((color) => normalizeHex(color.hex))
          .filter((color): color is string => color !== null)
      )
      const brandFamilies = new Set(
        Array.from(brandHexes, (hex) => hexToColorFamily(hex))
      )

      const exactMatches: string[] = []
      const familyFallbackMatches: string[] = []
      let score = 0

      for (const selectedColor of selectedColors) {
        if (brandHexes.has(selectedColor.hex)) {
          exactMatches.push(selectedColor.hex)
          score += 14
          continue
        }

        if (brandFamilies.has(selectedColor.family)) {
          familyFallbackMatches.push(selectedColor.hex)
          score += 6
        }
      }

      const coverage = exactMatches.length + familyFallbackMatches.length
      if (coverage === 0) return null
      const matchedColors = new Set([...exactMatches, ...familyFallbackMatches])
      const missingSelectedColors = selectedColors
        .map((selectedColor) => selectedColor.hex)
        .filter((hex) => !matchedColors.has(hex))

      return {
        brand,
        score,
        exactMatches,
        familyFallbackMatches,
        missingSelectedColors,
        coverage,
      }
    })
    .filter((result): result is PaletteMatchResult => result !== null)
    .sort(
      (a, b) =>
        b.score - a.score ||
        b.exactMatches.length - a.exactMatches.length ||
        b.familyFallbackMatches.length - a.familyFallbackMatches.length ||
        a.brand.name.localeCompare(b.brand.name)
    )
}

function hexToRgb(hex: string) {
  const normalized = normalizeHex(hex)
  if (!normalized) return null

  const value = normalized.slice(1)
  return {
    red: Number.parseInt(value.slice(0, 2), 16),
    green: Number.parseInt(value.slice(2, 4), 16),
    blue: Number.parseInt(value.slice(4, 6), 16),
  }
}

function getRgbDistance(sourceHex: string, targetHex: string) {
  const source = hexToRgb(sourceHex)
  const target = hexToRgb(targetHex)
  if (!source || !target) return Number.POSITIVE_INFINITY

  const redDelta = source.red - target.red
  const greenDelta = source.green - target.green
  const blueDelta = source.blue - target.blue

  return Math.sqrt(
    redDelta * redDelta + greenDelta * greenDelta + blueDelta * blueDelta
  )
}

export function getClosestColorSuggestions(
  entries: ColorExplorerEntry[],
  queryHex: string,
  limit = 4
): ClosestColorSuggestion[] {
  const normalizedQueryHex = toColorExplorerHex(queryHex)

  return entries
    .filter((entry) => entry.hex !== normalizedQueryHex)
    .map((entry) => ({
      hex: entry.hex,
      family: entry.family,
      brandCount: entry.brandCount,
      distance: getRgbDistance(normalizedQueryHex, entry.hex),
    }))
    .sort(
      (a, b) =>
        a.distance - b.distance ||
        b.brandCount - a.brandCount ||
        a.hex.localeCompare(b.hex)
    )
    .slice(0, limit)
}
