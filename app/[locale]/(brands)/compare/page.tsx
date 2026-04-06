import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server"
import { getAllBrands, getAllSidebarBrands } from "@/data/brands"
import { routing } from "@/i18n/routing"
import { BrandCompare, type BrandCompareCopy } from "@/components/brand-compare"
import { BreadcrumbStructuredData } from "@/components/structured-data"
import { getStaticLocales } from "@/lib/static-params"

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://loftlyy.com"

export function generateStaticParams() {
  return getStaticLocales().map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "compare" })

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: `/${locale}/compare`,
      languages: Object.fromEntries(
        routing.locales.map((entryLocale) => [
          entryLocale,
          `/${entryLocale}/compare`,
        ])
      ),
    },
    openGraph: {
      title: t("metaTitle"),
      description: t("metaDescription"),
      type: "website",
      locale,
    },
    twitter: {
      card: "summary",
      title: t("metaTitle"),
      description: t("metaDescription"),
    },
  }
}

export default async function ComparePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const [messages, tCategories] = await Promise.all([
    getMessages({ locale }),
    getTranslations({ locale, namespace: "categories" }),
  ])

  const allBrands = getAllBrands()
  const sidebarBrands = getAllSidebarBrands()
  const copy = messages.compare as BrandCompareCopy

  const translatedIndustries: Record<string, string> = {}
  const industries = new Set(allBrands.map((b) => b.industry))
  for (const industry of industries) {
    translatedIndustries[industry] = tCategories(industry)
  }

  return (
    <main className="flex flex-col py-12">
      <BreadcrumbStructuredData
        items={[
          { name: "Home", url: `${BASE_URL}/${locale}` },
          { name: copy.title, url: `${BASE_URL}/${locale}/compare` },
        ]}
      />
      <BrandCompare
        allBrands={allBrands}
        sidebarBrands={sidebarBrands}
        copy={copy}
        translatedIndustries={translatedIndustries}
      />
    </main>
  )
}
