import { getAllBrands } from "@/data/brands"
import { routing } from "@/i18n/routing"
import { OG_SIZE } from "@/lib/og"
import { createListingOGImage } from "@/lib/og-listing"

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export const size = OG_SIZE
export const contentType = "image/png"

export default async function OGImage() {
  const brands = getAllBrands()

  return createListingOGImage({
    title: "Discover Real-World Brand Identities",
    count: brands.length,
  })
}
