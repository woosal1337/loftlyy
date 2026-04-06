"use client"

import { useCallback, useMemo } from "react"
import { parseAsArrayOf, parseAsString, useQueryStates } from "nuqs"

const MAX_COMPARE_BRANDS = 3

const compareQueryStates = {
  brands: parseAsArrayOf(parseAsString, ","),
}

export function useCompareState(availableSlugs: string[]) {
  const availableSet = useMemo(() => new Set(availableSlugs), [availableSlugs])

  const [queryState, setQueryState] = useQueryStates(compareQueryStates, {
    history: "push",
    scroll: false,
    shallow: true,
  })

  const selectedSlugs = useMemo(() => {
    return (queryState.brands ?? [])
      .filter((slug) => availableSet.has(slug))
      .slice(0, MAX_COMPARE_BRANDS)
  }, [queryState.brands, availableSet])

  const addBrand = useCallback(
    (slug: string) => {
      if (
        selectedSlugs.length >= MAX_COMPARE_BRANDS ||
        selectedSlugs.includes(slug)
      )
        return
      void setQueryState({ brands: [...selectedSlugs, slug] })
    },
    [selectedSlugs, setQueryState]
  )

  const removeBrand = useCallback(
    (slug: string) => {
      const next = selectedSlugs.filter((s) => s !== slug)
      void setQueryState({ brands: next.length > 0 ? next : null })
    },
    [selectedSlugs, setQueryState]
  )

  const clearAll = useCallback(() => {
    void setQueryState({ brands: null })
  }, [setQueryState])

  return { selectedSlugs, addBrand, removeBrand, clearAll, MAX_COMPARE_BRANDS }
}
