import { getColorExplorerEntries } from "@/data/brands"
import { routing } from "@/i18n/routing"
import { OG_SIZE } from "@/lib/og"
import { createListingOGImage } from "@/lib/og-listing"

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export const size = OG_SIZE
export const contentType = "image/png"

export default async function OGImage() {
  return createListingOGImage({
    title: "Color Explorer",
    count: getColorExplorerEntries().length,
    accentColor: "#3B82F6",
  })
}
