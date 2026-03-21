"use client"

import { type FormEvent, type ReactNode, useMemo, useState } from "react"
import {
  IconArrowUpRight,
  IconCheck,
  IconPlus,
  IconX,
} from "@tabler/icons-react"
import { Link } from "@/i18n/navigation"
import { useColorExplorerState } from "@/hooks/use-color-explorer"
import {
  getClosestColorSuggestions,
  matchBrandsByPalette,
  parseColorExplorerPaletteInput,
  toColorExplorerHex,
} from "@/lib/color-explorer"
import { hexToColorFamily } from "@/lib/filters"
import { cn } from "@/lib/utils"
import type {
  ClosestColorSuggestion,
  ColorExplorerEntry,
  ColorExplorerOccurrence,
  PaletteMatchResult,
  SidebarBrand,
} from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

type MatchSort = "best" | "exact" | "alphabetical"

interface PaletteColorItem {
  queryHex: string
  hex: string
  family: string
  isCatalog: boolean
}

export interface ColorExplorerCopy {
  title: string
  description: string
  allColors: string
  familyFilterTitle: string
  familySwatchCount: string
  usedByBrands: string
  paletteBuilderTitle: string
  clearPalette: string
  inspectColor: string
  removeColor: string
  matchCount: string
  paletteEmptyTitle: string
  paletteEmptyDescription: string
  colorContextTitle: string
  colorContextDescription: string
  matchingBrandsTitle: string
  matchingBrandsDescription: string
  matchingBrandsEmptyTitle: string
  matchingBrandsEmptyDescription: string
  score: string
  exact: string
  family: string
  missing: string
  exactCount: string
  familyCount: string
  coverage: string
  addToPalette: string
  removeFromPalette: string
  starterSwatchesTitle: string
  starterSwatchesDescription: string
  manualHexPlaceholder: string
  addHexes: string
  manualHexHelp: string
  closestColorsTitle: string
  sortBest: string
  sortExact: string
  sortAlphabetical: string
  industryFilterLabel: string
  allIndustries: string
}

interface ColorExplorerProps {
  brands: SidebarBrand[]
  entries: ColorExplorerEntry[]
  familyLabels: Record<string, string>
  familyOptions: {
    slug: string
    count: number
    hex: string
  }[]
  copy: ColorExplorerCopy
}

export function ColorExplorer({
  brands,
  entries,
  familyLabels,
  familyOptions,
  copy,
}: ColorExplorerProps) {
  const [draftPalette, setDraftPalette] = useState("")
  const [sortBy, setSortBy] = useState<MatchSort>("best")
  const [industryFilter, setIndustryFilter] = useState("all")

  const entryMap = useMemo(
    () => new Map(entries.map((entry) => [entry.hex.slice(1), entry])),
    [entries]
  )
  const {
    state,
    addPaletteColors,
    clearFamilies,
    toggleFamily,
    togglePaletteColor,
    removePaletteColor,
    clearPalette,
    setPalette,
    setSwatch,
  } = useColorExplorerState({
    availableFamilies: familyOptions.map((family) => family.slug),
    availableHexes: entries.map((entry) => entry.hex.slice(1)),
  })

  const visibleEntries = useMemo(
    () =>
      state.families.length > 0
        ? entries.filter((entry) => state.families.includes(entry.family))
        : entries,
    [entries, state.families]
  )

  const starterEntries = useMemo(
    () =>
      [...visibleEntries]
        .sort(
          (a, b) => b.brandCount - a.brandCount || a.hex.localeCompare(b.hex)
        )
        .slice(0, 12),
    [visibleEntries]
  )

  const paletteItems = useMemo<PaletteColorItem[]>(
    () =>
      state.palette.map((queryHex) => {
        const entry = entryMap.get(queryHex)
        const hex = toColorExplorerHex(queryHex)

        return {
          queryHex,
          hex,
          family: entry?.family ?? hexToColorFamily(hex),
          isCatalog: entry !== undefined,
        }
      }),
    [entryMap, state.palette]
  )

  const activeEntry = state.swatch ? (entryMap.get(state.swatch) ?? null) : null

  const matches = useMemo(
    () => matchBrandsByPalette(brands, state.palette),
    [brands, state.palette]
  )

  const draftHexes = useMemo(
    () => parseColorExplorerPaletteInput(draftPalette),
    [draftPalette]
  )

  const suggestionTarget =
    draftHexes.length === 1 && !entryMap.has(draftHexes[0])
      ? draftHexes[0]
      : null

  const closestSuggestions = useMemo<ClosestColorSuggestion[]>(
    () =>
      suggestionTarget
        ? getClosestColorSuggestions(entries, suggestionTarget).filter(
            (suggestion) => !state.palette.includes(suggestion.hex.slice(1))
          )
        : [],
    [entries, state.palette, suggestionTarget]
  )

  const industries = useMemo(
    () =>
      Array.from(new Set(matches.map((match) => match.brand.industry))).sort(
        (a, b) => a.localeCompare(b)
      ),
    [matches]
  )

  const visibleMatches = useMemo(() => {
    const filteredMatches =
      industryFilter === "all"
        ? matches
        : matches.filter((match) => match.brand.industry === industryFilter)

    if (sortBy === "best") return filteredMatches

    const nextMatches = [...filteredMatches]
    if (sortBy === "exact") {
      return nextMatches.sort(
        (a, b) =>
          b.exactMatches.length - a.exactMatches.length ||
          b.coverage - a.coverage ||
          b.score - a.score ||
          a.brand.name.localeCompare(b.brand.name)
      )
    }

    return nextMatches.sort((a, b) => a.brand.name.localeCompare(b.brand.name))
  }, [industryFilter, matches, sortBy])

  const handlePaletteSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextHexes = parseColorExplorerPaletteInput(draftPalette)
    if (nextHexes.length === 0) return

    addPaletteColors(nextHexes)
    setDraftPalette("")
  }

  const handleSuggestionClick = (suggestionHex: string) => {
    const suggestionQueryHex = suggestionHex.slice(1)
    if (!suggestionTarget) return

    if (state.palette.includes(suggestionTarget)) {
      setPalette(
        state.palette.map((hex) =>
          hex === suggestionTarget ? suggestionQueryHex : hex
        )
      )
    } else {
      addPaletteColors([suggestionQueryHex])
    }

    setDraftPalette("")
  }

  const hasPalette = paletteItems.length > 0

  return (
    <>
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-2">
          <h1 className="text-xl font-semibold tracking-tight text-neutral-950 sm:text-2xl dark:text-neutral-50">
            {copy.title}
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-neutral-600 dark:text-neutral-300">
            {copy.description}
          </p>
        </header>

        <PaletteStrip
          clearPalette={clearPalette}
          closestSuggestions={closestSuggestions}
          copy={copy}
          draftPalette={draftPalette}
          familyLabels={familyLabels}
          matchesCount={visibleMatches.length}
          onDraftPaletteChange={setDraftPalette}
          onSubmit={handlePaletteSubmit}
          onSuggestionClick={handleSuggestionClick}
          paletteItems={paletteItems}
          removePaletteColor={removePaletteColor}
          setSwatch={setSwatch}
        />

        {hasPalette && (
          <MatchResults
            copy={copy}
            industries={industries}
            industryFilter={industryFilter}
            matches={visibleMatches}
            onIndustryFilterChange={setIndustryFilter}
            onSortChange={setSortBy}
            setSwatch={setSwatch}
            sortBy={sortBy}
          />
        )}

        <section className="flex flex-col gap-3">
          <SectionLabel>{copy.familyFilterTitle}</SectionLabel>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={clearFamilies}
              aria-pressed={state.families.length === 0}
              className={cn(
                "inline-flex min-h-8 items-center gap-2 rounded-full border px-3 py-2 text-sm transition-colors",
                state.families.length === 0
                  ? "border-neutral-900 bg-neutral-900 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-950"
                  : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300 dark:hover:border-neutral-700 dark:hover:bg-neutral-900"
              )}
            >
              <span>{copy.allColors}</span>
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-[11px]",
                  state.families.length === 0
                    ? "bg-white/20 text-white dark:bg-black/10 dark:text-neutral-950"
                    : "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400"
                )}
              >
                {entries.length}
              </span>
            </button>
            {familyOptions.map((family) => {
              const isActive = state.families.includes(family.slug)

              return (
                <button
                  key={family.slug}
                  type="button"
                  onClick={() => toggleFamily(family.slug)}
                  aria-pressed={isActive}
                  className={cn(
                    "inline-flex min-h-8 items-center gap-2 rounded-full border px-3 py-2 text-sm transition-colors",
                    isActive
                      ? "border-neutral-900 bg-neutral-900 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-950"
                      : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300 dark:hover:border-neutral-700 dark:hover:bg-neutral-900"
                  )}
                >
                  <span
                    className="size-2.5 rounded-full shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)]"
                    style={{ backgroundColor: family.hex }}
                  />
                  <span>{familyLabels[family.slug] ?? family.slug}</span>
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-0.5 text-[11px]",
                      isActive
                        ? "bg-white/20 text-white dark:bg-black/10 dark:text-neutral-950"
                        : "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400"
                    )}
                  >
                    {family.count}
                  </span>
                </button>
              )
            })}
          </div>
        </section>

        {hasPalette ? (
          <section className="flex flex-col gap-4">
            <SectionLabel>
              {formatMessage(copy.familySwatchCount, {
                count: visibleEntries.length,
              })}
            </SectionLabel>
            <SwatchGrid
              copy={copy}
              entries={visibleEntries}
              activeHex={activeEntry?.hex ?? null}
              palette={state.palette}
              setSwatch={setSwatch}
              togglePaletteColor={togglePaletteColor}
            />
          </section>
        ) : (
          <section className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <SectionLabel>{copy.starterSwatchesTitle}</SectionLabel>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                {copy.starterSwatchesDescription}
              </p>
            </div>
            <SwatchGrid
              copy={copy}
              entries={starterEntries}
              activeHex={activeEntry?.hex ?? null}
              palette={state.palette}
              setSwatch={setSwatch}
              togglePaletteColor={togglePaletteColor}
            />
          </section>
        )}
      </div>

      <Dialog
        open={activeEntry !== null}
        onOpenChange={(open) => {
          if (!open) setSwatch(null)
        }}
      >
        <DialogContent className="max-h-[calc(100vh-2rem)] max-w-[calc(100%-1rem)] overflow-hidden rounded-[28px] border border-neutral-200/80 bg-white p-0 text-neutral-900 shadow-[0_40px_120px_-48px_rgba(15,23,42,0.45)] ring-1 ring-neutral-950/8 sm:max-w-5xl dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100 dark:ring-white/10">
          {activeEntry ? (
            <div className="grid max-h-[calc(100vh-2rem)] gap-0 lg:grid-cols-[280px_minmax(0,1fr)]">
              <div className="flex flex-col gap-5 border-b border-neutral-200 bg-neutral-50/80 p-6 lg:border-r lg:border-b-0 dark:border-neutral-800 dark:bg-neutral-900/60">
                <div
                  className="h-44 rounded-[22px] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)]"
                  style={{ backgroundColor: activeEntry.hex }}
                />
                <DialogHeader className="gap-2">
                  <DialogTitle className="font-mono text-[1.7rem] font-semibold tracking-[-0.04em] uppercase">
                    {activeEntry.hex}
                  </DialogTitle>
                </DialogHeader>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">
                    {familyLabels[activeEntry.family] ?? activeEntry.family}
                  </Badge>
                  <Badge variant="secondary">
                    {formatMessage(copy.usedByBrands, {
                      count: activeEntry.brandCount,
                    })}
                  </Badge>
                </div>
                <p className="text-sm leading-6 text-neutral-600 dark:text-neutral-300">
                  {copy.colorContextDescription}
                </p>
                <Button
                  variant={
                    state.palette.includes(activeEntry.hex.slice(1))
                      ? "secondary"
                      : "outline"
                  }
                  onClick={() =>
                    togglePaletteColor(activeEntry.hex.slice(1), {
                      inspect: true,
                    })
                  }
                  className="h-11 rounded-2xl bg-white/70 text-sm font-semibold shadow-sm backdrop-blur-sm dark:bg-neutral-900/90"
                >
                  {state.palette.includes(activeEntry.hex.slice(1)) ? (
                    <IconCheck className="size-4" />
                  ) : (
                    <IconPlus className="size-4" />
                  )}
                  {state.palette.includes(activeEntry.hex.slice(1))
                    ? copy.removeFromPalette
                    : copy.addToPalette}
                </Button>
              </div>

              <div className="flex min-h-0 flex-col">
                <div className="border-b border-neutral-200 px-6 py-5 dark:border-neutral-800">
                  <h2 className="text-base font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
                    {copy.colorContextTitle}
                  </h2>
                </div>
                <ScrollArea className="min-h-0 flex-1">
                  <div className="flex flex-col gap-3 p-6">
                    {activeEntry.occurrences.map(
                      (occurrence: ColorExplorerOccurrence) => (
                        <div
                          key={`${occurrence.brandSlug}-${occurrence.colorName}`}
                          className="rounded-[20px] border border-neutral-200 bg-white p-5 shadow-[0_18px_40px_-36px_rgba(15,23,42,0.18)] dark:border-neutral-800 dark:bg-neutral-950"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex min-w-0 flex-col gap-1">
                              <Link
                                href={`/${occurrence.brandSlug}`}
                                className="inline-flex items-center gap-1 text-base font-semibold text-neutral-900 transition-colors hover:text-neutral-600 dark:text-neutral-100 dark:hover:text-neutral-300"
                              >
                                {occurrence.brandName}
                                <IconArrowUpRight className="size-3.5" />
                              </Link>
                              <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                                {occurrence.colorName}
                              </span>
                            </div>
                          </div>
                          {occurrence.usage && (
                            <p className="mt-3 text-sm leading-7 text-neutral-600 dark:text-neutral-300">
                              {occurrence.usage}
                            </p>
                          )}
                        </div>
                      )
                    )}
                  </div>
                </ScrollArea>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  )
}

function formatMessage(
  template: string,
  values: Record<string, string | number> = {}
) {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => {
    const value = values[key]
    return value === undefined ? `{${key}}` : String(value)
  })
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
      {children}
    </p>
  )
}

function PaletteStrip({
  clearPalette,
  closestSuggestions,
  copy,
  draftPalette,
  familyLabels,
  matchesCount,
  onDraftPaletteChange,
  onSubmit,
  onSuggestionClick,
  paletteItems,
  removePaletteColor,
  setSwatch,
}: {
  clearPalette: () => void
  closestSuggestions: ClosestColorSuggestion[]
  copy: ColorExplorerCopy
  draftPalette: string
  familyLabels: Record<string, string>
  matchesCount: number
  onDraftPaletteChange: (value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onSuggestionClick: (hex: string) => void
  paletteItems: PaletteColorItem[]
  removePaletteColor: (hex: string) => void
  setSwatch: (hex: string | null) => void
}) {
  return (
    <Panel>
      <div className="flex items-center justify-between gap-3">
        <SectionLabel>{copy.paletteBuilderTitle}</SectionLabel>
        {paletteItems.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clearPalette}>
            <IconX className="size-4" />
            {copy.clearPalette}
          </Button>
        )}
      </div>

      <form className="flex flex-col gap-3" onSubmit={onSubmit}>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            type="text"
            value={draftPalette}
            onChange={(event) => onDraftPaletteChange(event.target.value)}
            placeholder={copy.manualHexPlaceholder}
            className="min-h-11 flex-1 rounded-2xl border border-neutral-200 bg-white px-4 text-sm text-neutral-900 transition-colors outline-none placeholder:text-neutral-400 focus:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-neutral-600"
          />
          <Button type="submit" className="min-h-11 rounded-2xl px-4">
            <IconPlus className="size-4" />
            {copy.addHexes}
          </Button>
        </div>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          {copy.manualHexHelp}
        </p>
      </form>

      {closestSuggestions.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium text-neutral-500 uppercase dark:text-neutral-400">
            {copy.closestColorsTitle}
          </p>
          <div className="flex flex-wrap gap-2">
            {closestSuggestions.map((suggestion: ClosestColorSuggestion) => (
              <button
                key={suggestion.hex}
                type="button"
                onClick={() => onSuggestionClick(suggestion.hex)}
                className="inline-flex min-h-9 items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-sm text-neutral-700 transition-colors hover:border-neutral-300 hover:bg-white dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-neutral-700 dark:hover:bg-neutral-950"
              >
                <span
                  className="size-3 rounded-full shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)]"
                  style={{ backgroundColor: suggestion.hex }}
                />
                <span className="font-mono text-xs font-medium uppercase">
                  {suggestion.hex}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {paletteItems.length > 0 ? (
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-2">
            {paletteItems.map((item: PaletteColorItem) => (
              <div
                key={item.queryHex}
                className="inline-flex min-h-11 items-center gap-2 rounded-2xl border border-neutral-200/80 bg-white py-1.5 pr-1.5 pl-1.5 shadow-[0_12px_32px_-28px_rgba(15,23,42,0.28)] dark:border-neutral-800 dark:bg-neutral-950"
              >
                <button
                  type="button"
                  onClick={() =>
                    item.isCatalog ? setSwatch(item.queryHex) : setSwatch(null)
                  }
                  className="size-8 rounded-xl shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)] transition-transform hover:scale-[1.04]"
                  style={{ backgroundColor: item.hex }}
                  aria-label={formatMessage(copy.inspectColor, {
                    hex: item.hex,
                  })}
                />
                <div className="flex min-w-0 flex-col gap-0.5 pr-1">
                  <span className="font-mono text-[12px] font-semibold tracking-[-0.02em] text-neutral-900 uppercase dark:text-neutral-100">
                    {item.hex}
                  </span>
                  <span className="text-[10px] font-medium tracking-[0.12em] text-neutral-400 uppercase dark:text-neutral-500">
                    {familyLabels[item.family] ?? item.family}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => removePaletteColor(item.queryHex)}
                  className="flex size-8 items-center justify-center rounded-xl border border-transparent bg-neutral-100 text-neutral-500 transition-colors hover:border-neutral-200 hover:bg-neutral-200 hover:text-neutral-900 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:border-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
                  aria-label={formatMessage(copy.removeColor, {
                    hex: item.hex,
                  })}
                >
                  <IconX className="size-3.5" />
                </button>
              </div>
            ))}
          </div>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {formatMessage(copy.matchCount, { count: matchesCount })}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
            {copy.paletteEmptyTitle}
          </p>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {copy.paletteEmptyDescription}
          </p>
        </div>
      )}
    </Panel>
  )
}

function MatchResults({
  copy,
  industries,
  industryFilter,
  matches,
  onIndustryFilterChange,
  onSortChange,
  setSwatch,
  sortBy,
}: {
  copy: ColorExplorerCopy
  industries: string[]
  industryFilter: string
  matches: PaletteMatchResult[]
  onIndustryFilterChange: (value: string) => void
  onSortChange: (value: MatchSort) => void
  setSwatch: (hex: string | null) => void
  sortBy: MatchSort
}) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <SectionLabel>{copy.matchingBrandsTitle}</SectionLabel>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {copy.matchingBrandsDescription}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-wrap gap-2">
            <SortChip
              active={sortBy === "best"}
              label={copy.sortBest}
              onClick={() => onSortChange("best")}
            />
            <SortChip
              active={sortBy === "exact"}
              label={copy.sortExact}
              onClick={() => onSortChange("exact")}
            />
            <SortChip
              active={sortBy === "alphabetical"}
              label={copy.sortAlphabetical}
              onClick={() => onSortChange("alphabetical")}
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
            <span>{copy.industryFilterLabel}</span>
            <select
              value={industryFilter}
              onChange={(event) => onIndustryFilterChange(event.target.value)}
              className="min-h-9 rounded-xl border border-neutral-200 bg-white px-3 text-sm text-neutral-900 transition-colors outline-none focus:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100 dark:focus:border-neutral-600"
            >
              <option value="all">{copy.allIndustries}</option>
              {industries.map((industry) => (
                <option key={industry} value={industry}>
                  {industry}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {matches.length > 0 ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {matches.map((match: PaletteMatchResult) => (
            <div
              key={match.brand.slug}
              className="rounded-[20px] border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-950"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 flex-col gap-1">
                  <Link
                    href={`/${match.brand.slug}`}
                    className="text-base font-semibold text-neutral-900 transition-colors hover:text-neutral-600 dark:text-neutral-100 dark:hover:text-neutral-300"
                  >
                    {match.brand.name}
                  </Link>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    {match.brand.industry}
                  </p>
                </div>
                <Badge variant="secondary">
                  {formatMessage(copy.score, { count: match.score })}
                </Badge>
              </div>

              {match.exactMatches.length > 0 && (
                <ResultMatchGroup
                  label={copy.exact}
                  matches={match.exactMatches}
                  setSwatch={setSwatch}
                />
              )}

              {match.familyFallbackMatches.length > 0 && (
                <ResultMatchGroup
                  label={copy.family}
                  matches={match.familyFallbackMatches}
                  setSwatch={setSwatch}
                  variant="family"
                />
              )}

              {match.missingSelectedColors.length > 0 && (
                <ResultMatchGroup
                  label={copy.missing}
                  matches={match.missingSelectedColors}
                  setSwatch={setSwatch}
                  variant="missing"
                />
              )}

              <p className="mt-4 text-xs text-neutral-500 dark:text-neutral-400">
                {formatMessage(copy.exactCount, {
                  count: match.exactMatches.length,
                })}{" "}
                ·{" "}
                {formatMessage(copy.familyCount, {
                  count: match.familyFallbackMatches.length,
                })}{" "}
                · {formatMessage(copy.coverage, { count: match.coverage })}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title={copy.matchingBrandsEmptyTitle}
          description={copy.matchingBrandsEmptyDescription}
        />
      )}
    </section>
  )
}

function SortChip({
  active,
  label,
  onClick,
}: {
  active: boolean
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex min-h-8 items-center rounded-full border px-3 py-1.5 text-sm transition-colors",
        active
          ? "border-neutral-900 bg-neutral-900 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-950"
          : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300 dark:hover:border-neutral-700 dark:hover:bg-neutral-900"
      )}
    >
      {label}
    </button>
  )
}

function ResultMatchGroup({
  label,
  matches,
  setSwatch,
  variant = "exact",
}: {
  label: string
  matches: string[]
  setSwatch: (hex: string | null) => void
  variant?: "exact" | "family" | "missing"
}) {
  return (
    <div className="mt-4 flex flex-col gap-2">
      <p className="text-xs font-medium text-neutral-500 uppercase dark:text-neutral-400">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {matches.map((hex: string) => (
          <ColorPill
            key={`${label}-${hex}`}
            hex={hex}
            label={label}
            onClick={() => setSwatch(hex.slice(1))}
            variant={variant}
          />
        ))}
      </div>
    </div>
  )
}

function SwatchGrid({
  copy,
  entries,
  activeHex,
  palette,
  setSwatch,
  togglePaletteColor,
}: {
  copy: ColorExplorerCopy
  entries: ColorExplorerEntry[]
  activeHex: string | null
  palette: string[]
  setSwatch: (hex: string | null) => void
  togglePaletteColor: (hex: string, options?: { inspect?: boolean }) => void
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {entries.map((entry: ColorExplorerEntry) => (
        <SwatchGridCard
          key={entry.hex}
          copy={copy}
          entry={entry}
          isActiveDialog={activeHex === entry.hex}
          isSelected={palette.includes(entry.hex.slice(1))}
          setSwatch={setSwatch}
          togglePaletteColor={togglePaletteColor}
        />
      ))}
    </div>
  )
}

function SwatchGridCard({
  copy,
  entry,
  isActiveDialog,
  isSelected,
  setSwatch,
  togglePaletteColor,
}: {
  copy: ColorExplorerCopy
  entry: ColorExplorerEntry
  isActiveDialog: boolean
  isSelected: boolean
  setSwatch: (hex: string | null) => void
  togglePaletteColor: (hex: string, options?: { inspect?: boolean }) => void
}) {
  const queryHex = entry.hex.slice(1)

  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-[20px] border bg-white p-3 transition-colors dark:bg-neutral-950",
        isSelected
          ? "border-neutral-900 dark:border-neutral-100"
          : isActiveDialog
            ? "border-neutral-400 dark:border-neutral-600"
            : "border-neutral-200 hover:border-neutral-300 dark:border-neutral-800 dark:hover:border-neutral-700"
      )}
    >
      <button
        type="button"
        onClick={() => setSwatch(queryHex)}
        className="flex w-full flex-col gap-3 text-left"
        aria-label={formatMessage(copy.inspectColor, {
          hex: entry.hex,
        })}
      >
        <div
          className="aspect-[4/3] rounded-[16px] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)]"
          style={{ backgroundColor: entry.hex }}
        />
        <span className="font-mono text-sm font-medium text-neutral-950 uppercase dark:text-neutral-50">
          {entry.hex}
        </span>
      </button>

      <Button
        variant={isSelected ? "secondary" : "ghost"}
        size="icon-sm"
        className="absolute top-4 right-4 z-10 rounded-[14px] bg-white/88 backdrop-blur-sm dark:bg-neutral-950/88"
        onClick={(event) => {
          event.stopPropagation()
          togglePaletteColor(queryHex, {
            inspect: false,
          })
        }}
        aria-label={
          isSelected
            ? formatMessage(copy.removeColor, {
                hex: entry.hex,
              })
            : copy.addToPalette
        }
      >
        {isSelected ? (
          <IconCheck className="size-4" />
        ) : (
          <IconPlus className="size-4" />
        )}
      </Button>
    </article>
  )
}

function Panel({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <section
      className={cn(
        "flex flex-col gap-4 rounded-[20px] border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-950",
        className
      )}
    >
      {children}
    </section>
  )
}

function EmptyState({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="rounded-[20px] border border-dashed border-neutral-200 bg-neutral-50 px-4 py-6 text-sm dark:border-neutral-800 dark:bg-neutral-900/70">
      <p className="font-medium text-neutral-900 dark:text-neutral-100">
        {title}
      </p>
      <p className="mt-1 text-neutral-500 dark:text-neutral-400">
        {description}
      </p>
    </div>
  )
}

function ColorPill({
  hex,
  label,
  onClick,
  variant = "exact",
}: {
  hex: string
  label: string
  onClick: () => void
  variant?: "exact" | "family" | "missing"
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
        variant === "exact"
          ? "border-neutral-200 bg-neutral-50 text-neutral-700 hover:border-neutral-300 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:border-neutral-600"
          : variant === "family"
            ? "border-dashed border-neutral-300 bg-neutral-50 text-neutral-600 hover:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-neutral-600"
            : "border-dashed border-neutral-200 bg-transparent text-neutral-400 hover:border-neutral-300 hover:text-neutral-600 dark:border-neutral-800 dark:text-neutral-500 dark:hover:border-neutral-700 dark:hover:text-neutral-300"
      )}
    >
      <span
        className="size-3 rounded-full shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)]"
        style={{ backgroundColor: hex }}
      />
      <span>{hex}</span>
      <span className="text-[10px] tracking-wide text-neutral-400 uppercase dark:text-neutral-500">
        {label}
      </span>
    </button>
  )
}
