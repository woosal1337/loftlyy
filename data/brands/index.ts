import type { Brand } from "@/lib/types"
import { discord } from "./discord"

export const brands: Brand[] = [discord].sort((a, b) =>
  a.name.localeCompare(b.name)
)

export const brandsBySlug: Record<string, Brand> = Object.fromEntries(
  brands.map((b) => [b.slug, b])
)

export function getAllBrands() {
  return brands
}

export function getBrandBySlug(slug: string) {
  return brandsBySlug[slug]
}

export function getBrandsByCategory(categorySlug: string) {
  return brands.filter((b) => b.categories.includes(categorySlug))
}
