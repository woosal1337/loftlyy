"use client"

import { useSearchParams } from "next/navigation"
import { usePathname, useRouter } from "@/i18n/navigation"
import { type FilterState, emptyFilters } from "@/lib/filters"
import { useCallback, useMemo } from "react"

function parseParam(params: URLSearchParams, key: string): string[] {
  const val = params.get(key)
  if (!val) return []
  return val.split(",").filter(Boolean)
}

function serializeParam(values: string[]): string | null {
  return values.length > 0 ? values.join(",") : null
}

export function useBrandFilters() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const filters: FilterState = useMemo(
    () => ({
      industries: parseParam(searchParams, "industry"),
      tags: parseParam(searchParams, "tag"),
      colorFamilies: parseParam(searchParams, "color"),
      typographyStyles: parseParam(searchParams, "typo"),
    }),
    [searchParams]
  )

  const hasActiveFilters = useMemo(
    () =>
      filters.industries.length > 0 ||
      filters.tags.length > 0 ||
      filters.colorFamilies.length > 0 ||
      filters.typographyStyles.length > 0,
    [filters]
  )

  const updateURL = useCallback(
    (newFilters: FilterState) => {
      const params = new URLSearchParams(searchParams.toString())

      const mapping: [keyof FilterState, string][] = [
        ["industries", "industry"],
        ["tags", "tag"],
        ["colorFamilies", "color"],
        ["typographyStyles", "typo"],
      ]

      for (const [key, param] of mapping) {
        const serialized = serializeParam(newFilters[key])
        if (serialized) {
          params.set(param, serialized)
        } else {
          params.delete(param)
        }
      }

      const qs = params.toString()
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    },
    [searchParams, router, pathname]
  )

  const toggleFilter = useCallback(
    (dimension: keyof FilterState, value: string) => {
      const current = [...filters[dimension]]
      const idx = current.indexOf(value)
      if (idx >= 0) {
        current.splice(idx, 1)
      } else {
        current.push(value)
      }
      updateURL({ ...filters, [dimension]: current })
    },
    [filters, updateURL]
  )

  const clearFilters = useCallback(() => {
    updateURL(emptyFilters)
  }, [updateURL])

  return { filters, hasActiveFilters, toggleFilter, clearFilters }
}
