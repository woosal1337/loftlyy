"use client"

import { useCallback, useMemo } from "react"
import { parseAsArrayOf, parseAsString, useQueryStates } from "nuqs"
import {
  MAX_COLOR_EXPLORER_PALETTE,
  parseColorExplorerFamilies,
  parseColorExplorerPalette,
  parseColorExplorerSwatch,
} from "@/lib/color-explorer"

interface ColorExplorerState {
  families: string[]
  palette: string[]
  swatch: string | null
}

const colorExplorerQueryStates = {
  family: parseAsArrayOf(parseAsString),
  palette: parseAsArrayOf(parseAsString),
  swatch: parseAsString,
}

export function useColorExplorerState(options: {
  availableFamilies: string[]
  availableHexes: string[]
}) {
  const { availableFamilies, availableHexes } = options
  const [queryState, setQueryState] = useQueryStates(colorExplorerQueryStates, {
    history: "replace",
    scroll: false,
    shallow: true,
  })

  const availableFamilySet = useMemo(
    () => new Set(availableFamilies),
    [availableFamilies]
  )
  const availableHexSet = useMemo(
    () => new Set(availableHexes),
    [availableHexes]
  )

  const state = useMemo<ColorExplorerState>(() => {
    const families = parseColorExplorerFamilies(
      queryState.family?.join(",") ?? null
    ).filter((family) => availableFamilySet.has(family))
    const palette = parseColorExplorerPalette(
      queryState.palette?.join(",") ?? null
    )
    const swatch = parseColorExplorerSwatch(queryState.swatch)

    return {
      families,
      palette,
      swatch: swatch && availableHexSet.has(swatch) ? swatch : null,
    }
  }, [availableFamilySet, availableHexSet, queryState])

  const replaceState = useCallback(
    (nextState: ColorExplorerState) => {
      const families = parseColorExplorerFamilies(nextState.families.join(","))
      const palette = parseColorExplorerPalette(nextState.palette.join(","))
      const swatch = parseColorExplorerSwatch(nextState.swatch)

      void setQueryState({
        family: families.length > 0 ? families : null,
        palette: palette.length > 0 ? palette : null,
        swatch: swatch && availableHexSet.has(swatch) ? swatch : null,
      })
    },
    [availableHexSet, setQueryState]
  )

  const toggleFamily = useCallback(
    (family: string) => {
      const families = state.families.includes(family)
        ? state.families.filter((value) => value !== family)
        : [...state.families, family]

      replaceState({ ...state, families })
    },
    [replaceState, state]
  )

  const clearFamilies = useCallback(() => {
    replaceState({
      ...state,
      families: [],
    })
  }, [replaceState, state])

  const togglePaletteColor = useCallback(
    (hex: string, options?: { inspect?: boolean }) => {
      const isSelected = state.palette.includes(hex)
      const palette = isSelected
        ? state.palette.filter((value) => value !== hex)
        : state.palette.length < MAX_COLOR_EXPLORER_PALETTE
          ? [...state.palette, hex]
          : state.palette

      replaceState({
        ...state,
        palette,
        swatch: options?.inspect ? hex : state.swatch,
      })
    },
    [replaceState, state]
  )

  const addPaletteColors = useCallback(
    (hexes: string[]) => {
      replaceState({
        ...state,
        palette: parseColorExplorerPalette(
          [...state.palette, ...hexes].join(",")
        ),
      })
    },
    [replaceState, state]
  )

  const setPalette = useCallback(
    (palette: string[]) => {
      replaceState({
        ...state,
        palette,
      })
    },
    [replaceState, state]
  )

  const removePaletteColor = useCallback(
    (hex: string) => {
      replaceState({
        ...state,
        palette: state.palette.filter((value) => value !== hex),
      })
    },
    [replaceState, state]
  )

  const clearPalette = useCallback(() => {
    replaceState({
      ...state,
      palette: [],
      swatch: null,
    })
  }, [replaceState, state])

  const setSwatch = useCallback(
    (hex: string | null) => {
      replaceState({
        ...state,
        swatch: hex,
      })
    },
    [replaceState, state]
  )

  return {
    state,
    clearFamilies,
    toggleFamily,
    togglePaletteColor,
    addPaletteColors,
    setPalette,
    removePaletteColor,
    clearPalette,
    setSwatch,
  }
}
