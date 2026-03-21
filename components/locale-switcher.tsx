"use client"

import { useSearchParams } from "next/navigation"
import { useLocale } from "next-intl"
import { localeMetadata } from "@/i18n/locales"
import { usePathname, useRouter } from "@/i18n/navigation"
import { routing } from "@/i18n/routing"
import { searchParamsToQuery } from "@/lib/utils"

export function LocaleSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  function onLocaleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    router.replace(
      {
        pathname,
        query: searchParamsToQuery(searchParams),
      },
      {
        locale: e.target.value,
      }
    )
  }

  return (
    <select
      value={locale}
      onChange={onLocaleChange}
      name="locale"
      aria-label="Language"
      className="h-6 appearance-none rounded-md bg-neutral-100 px-2 text-[11px] font-medium text-neutral-600 outline-none focus-visible:ring-2 focus-visible:ring-ring dark:bg-neutral-800 dark:text-neutral-400"
    >
      {routing.locales.map((l) => (
        <option key={l} value={l}>
          {localeMetadata[l].shortLabel}
        </option>
      ))}
    </select>
  )
}
