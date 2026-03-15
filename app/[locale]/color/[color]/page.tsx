import { notFound } from "next/navigation"
import { setRequestLocale, getTranslations } from "next-intl/server"
import { getAllColorFamilies, getBrandsByColorFamily } from "@/data/brands"
import { getColorFamilyBySlug } from "@/data/color-families"
import { routing } from "@/i18n/routing"
import {
  ListingStructuredData,
  BreadcrumbStructuredData,
} from "@/components/structured-data"
import { BrandListingCard } from "@/components/brand-listing-card"
import { BrowseBySection } from "@/components/browse-by-section"
import {
  getRelatedCategoriesForBrands,
  getRelatedTagsForBrands,
} from "@/lib/filters"

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://loftlyy.com"

export async function generateStaticParams() {
  const families = getAllColorFamilies()
  return routing.locales.flatMap((locale) =>
    families.map((color) => ({ locale, color }))
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; color: string }>
}) {
  const { locale, color } = await params
  const brands = getBrandsByColorFamily(color)
  if (brands.length === 0) return {}

  const [t, tColors] = await Promise.all([
    getTranslations({ locale, namespace: "seo" }),
    getTranslations({ locale, namespace: "colorFamilies" }),
  ])

  const colorName = tColors(color)
  const title = t("colorTitle", { color: colorName })
  const description = t("colorDescription", {
    count: brands.length,
    color: colorName,
  })

  return {
    title,
    description,
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `/${l}/color/${color}`])
      ),
    },
    openGraph: {
      title,
      description,
      type: "website",
      locale,
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  }
}

export default async function ColorPage({
  params,
}: {
  params: Promise<{ locale: string; color: string }>
}) {
  const { locale, color } = await params
  setRequestLocale(locale)

  const brands = getBrandsByColorFamily(color)
  if (brands.length === 0) notFound()

  const colorFamily = getColorFamilyBySlug(color)
  const [t, tColors, tCat, tTags, tBrowse] = await Promise.all([
    getTranslations({ locale, namespace: "color" }),
    getTranslations({ locale, namespace: "colorFamilies" }),
    getTranslations({ locale, namespace: "categories" }),
    getTranslations({ locale, namespace: "tags" }),
    getTranslations({ locale, namespace: "browseBy" }),
  ])

  const colorName = tColors(color)
  const relatedCategories = getRelatedCategoriesForBrands(brands)
  const relatedTags = getRelatedTagsForBrands(brands)

  return (
    <main className="flex flex-col gap-8 p-8">
      <ListingStructuredData
        name={colorName}
        description={t("description", {
          count: brands.length,
          color: colorName,
        })}
        brands={brands}
        locale={locale}
      />
      <BreadcrumbStructuredData
        items={[
          { name: "Home", url: `${BASE_URL}/${locale}` },
          { name: colorName, url: `${BASE_URL}/${locale}/color/${color}` },
        ]}
      />
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          {colorFamily && (
            <div
              className="size-8 rounded-full border border-border"
              style={{ backgroundColor: colorFamily.hex }}
            />
          )}
          <h1 className="text-3xl font-bold text-pretty">
            {t("title", { color: colorName })}
          </h1>
        </div>
        <p className="text-muted-foreground">
          {t("description", { count: brands.length, color: colorName })}
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {brands.map((brand) => (
          <BrandListingCard key={brand.slug} brand={brand} />
        ))}
      </div>
      <div className="flex flex-col gap-6">
        <BrowseBySection
          title={tBrowse("relatedTags")}
          links={relatedTags.map((tag) => ({
            href: `/tag/${tag}`,
            label: tTags(tag),
          }))}
        />
        <BrowseBySection
          title={tBrowse("relatedCategories")}
          links={relatedCategories.map((cat) => ({
            href: `/category/${cat}`,
            label: tCat(cat),
          }))}
        />
      </div>
    </main>
  )
}
