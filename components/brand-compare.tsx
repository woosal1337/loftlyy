"use client"

import { useMemo, useRef, useState, useEffect } from "react"
import Image from "next/image"
import {
  IconPlus,
  IconX,
  IconCopy,
  IconCheck,
  IconArrowsShuffle2,
} from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import { useCompareState } from "@/hooks/use-compare-state"
import { CompareBrandPicker } from "@/components/compare-brand-picker"
import { BrandColors } from "@/components/brand-colors"
import { BrandTypography } from "@/components/brand-typography"
import type { Brand, SidebarBrand } from "@/lib/types"

export interface BrandCompareCopy {
  title: string
  description: string
  addBrand: string
  addAnother: string
  optional: string
  removeBrand: string
  clearAll: string
  searchBrands: string
  noBrandsFound: string
  maxReached: string
  quickStats: string
  colorsCount: string
  fontsCount: string
  founded: string
  headquarters: string
  shareComparison: string
  linkCopied: string
  emptyTitle: string
  emptyDescription: string
}

interface BrandCompareProps {
  allBrands: Brand[]
  sidebarBrands: SidebarBrand[]
  copy: BrandCompareCopy
  translatedIndustries: Record<string, string>
}

export function BrandCompare({
  allBrands,
  sidebarBrands,
  copy,
  translatedIndustries,
}: BrandCompareProps) {
  const availableSlugs = useMemo(
    () => allBrands.map((b) => b.slug),
    [allBrands]
  )
  const { selectedSlugs, addBrand, removeBrand, clearAll, MAX_COMPARE_BRANDS } =
    useCompareState(availableSlugs)

  const [pickerOpen, setPickerOpen] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null)

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    },
    []
  )

  const selectedBrands = useMemo(() => {
    const slugMap = new Map(allBrands.map((b) => [b.slug, b]))
    return selectedSlugs
      .map((slug) => slugMap.get(slug))
      .filter((b): b is Brand => b !== undefined)
  }, [allBrands, selectedSlugs])

  async function copyLink() {
    await navigator.clipboard.writeText(window.location.href)
    setLinkCopied(true)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setLinkCopied(false), 1500)
  }

  const emptySlots = MAX_COMPARE_BRANDS - selectedBrands.length

  return (
    <div className="flex flex-col gap-8 px-6 md:px-10">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-neutral-100 dark:bg-neutral-800">
              <IconArrowsShuffle2 className="size-4.5 text-neutral-600 dark:text-neutral-300" />
            </div>
            <h1 className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
              {copy.title}
            </h1>
          </div>
          {selectedBrands.length > 0 && (
            <div className="flex items-center gap-2">
              <button
                onClick={copyLink}
                className="flex items-center gap-1.5 rounded-full border border-neutral-200 px-3 py-1.5 text-[12px] font-medium text-neutral-600 transition-colors hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-neutral-600 dark:hover:bg-neutral-800"
              >
                {linkCopied ? (
                  <>
                    <IconCheck className="size-3 text-green-600" />
                    <span>{copy.linkCopied}</span>
                  </>
                ) : (
                  <>
                    <IconCopy className="size-3" />
                    <span>{copy.shareComparison}</span>
                  </>
                )}
              </button>
              <button
                onClick={clearAll}
                className="flex items-center gap-1.5 rounded-full border border-neutral-200 px-3 py-1.5 text-[12px] font-medium text-red-500 transition-colors hover:border-red-200 hover:bg-red-50 dark:border-neutral-700 dark:hover:border-red-900 dark:hover:bg-red-950/20"
              >
                <IconX className="size-3" />
                <span>{copy.clearAll}</span>
              </button>
            </div>
          )}
        </div>
        <p className="text-[14px] text-neutral-500 dark:text-neutral-400">
          {copy.description}
        </p>
      </div>

      {/* Comparison grid */}
      {selectedBrands.length === 0 ? (
        <div
          className={cn(
            "grid gap-4",
            "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          )}
        >
          {Array.from({ length: MAX_COMPARE_BRANDS }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPickerOpen(true)}
              className="group flex min-h-[200px] flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-neutral-200 transition-colors hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-800 dark:hover:border-neutral-700 dark:hover:bg-neutral-900/50"
            >
              <div className="flex size-10 items-center justify-center rounded-full bg-neutral-100 transition-colors group-hover:bg-neutral-200 dark:bg-neutral-800 dark:group-hover:bg-neutral-700">
                <IconPlus className="size-4.5 text-neutral-400 dark:text-neutral-500" />
              </div>
              <span className="text-sm font-medium text-neutral-400 dark:text-neutral-500">
                {i < 2
                  ? copy.addBrand
                  : `${copy.addAnother} (${copy.optional})`}
              </span>
            </button>
          ))}
        </div>
      ) : (
        <div
          className={cn(
            "grid gap-4",
            selectedBrands.length === 1
              ? "grid-cols-1 md:grid-cols-2"
              : selectedBrands.length === 2
                ? "grid-cols-1 md:grid-cols-2"
                : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          )}
        >
          {selectedBrands.map((brand) => (
            <CompareColumn
              key={brand.slug}
              brand={brand}
              translatedIndustry={
                translatedIndustries[brand.industry] ?? brand.industry
              }
              copy={copy}
              onRemove={() => removeBrand(brand.slug)}
            />
          ))}

          {/* Empty slots for adding more brands */}
          {emptySlots > 0 && (
            <button
              onClick={() => setPickerOpen(true)}
              className="group flex min-h-[200px] flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-neutral-200 transition-colors hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-800 dark:hover:border-neutral-700 dark:hover:bg-neutral-900/50"
            >
              <div className="flex size-10 items-center justify-center rounded-full bg-neutral-100 transition-colors group-hover:bg-neutral-200 dark:bg-neutral-800 dark:group-hover:bg-neutral-700">
                <IconPlus className="size-4.5 text-neutral-400 dark:text-neutral-500" />
              </div>
              <span className="text-sm font-medium text-neutral-400 dark:text-neutral-500">
                {copy.addAnother}
              </span>
            </button>
          )}
        </div>
      )}

      {/* Brand picker */}
      <CompareBrandPicker
        brands={sidebarBrands}
        selectedSlugs={selectedSlugs}
        onSelect={addBrand}
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        copy={{
          searchBrands: copy.searchBrands,
          noBrandsFound: copy.noBrandsFound,
        }}
      />
    </div>
  )
}

function CompareColumn({
  brand,
  translatedIndustry,
  copy,
  onRemove,
}: {
  brand: Brand
  translatedIndustry: string
  copy: BrandCompareCopy
  onRemove: () => void
}) {
  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-950">
      {/* Brand header */}
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-xl shadow-[0_0_0_0.5px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.06)] dark:shadow-[0_0_0_0.5px_rgba(255,255,255,0.06)]",
            /black|dark|slate|navy/i.test(brand.thumbnail.label)
              ? "bg-neutral-100 dark:bg-neutral-200"
              : /ivory|white|light/i.test(brand.thumbnail.label)
                ? "bg-neutral-800 dark:bg-neutral-800"
                : "bg-neutral-100 dark:bg-neutral-800"
          )}
        >
          <Image
            src={brand.thumbnail.src}
            alt={`${brand.name} logo`}
            width={44}
            height={44}
            className="h-full w-full object-contain p-2"
          />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <h2 className="text-[15px] font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
            {brand.name}
          </h2>
          <span className="text-[12px] text-neutral-500 dark:text-neutral-400">
            {translatedIndustry}
          </span>
        </div>
        <button
          onClick={onRemove}
          aria-label={copy.removeBrand}
          className="flex size-7 shrink-0 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-neutral-800 dark:hover:text-neutral-300"
        >
          <IconX className="size-3.5" />
        </button>
      </div>

      {/* Quick stats */}
      <div className="flex flex-wrap gap-2">
        <StatBadge
          label={copy.colorsCount.replace(
            "{count}",
            String(brand.colors.length)
          )}
        />
        <StatBadge
          label={copy.fontsCount.replace(
            "{count}",
            String(brand.typography.length)
          )}
        />
        {brand.founded && (
          <StatBadge label={`${copy.founded} ${brand.founded}`} />
        )}
        {brand.headquarters && <StatBadge label={brand.headquarters} />}
      </div>

      {/* Colors */}
      <BrandColors colors={brand.colors} />

      {/* Typography */}
      <BrandTypography typography={brand.typography} />
    </div>
  )
}

function StatBadge({ label }: { label: string }) {
  return (
    <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] font-medium text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
      {label}
    </span>
  )
}
