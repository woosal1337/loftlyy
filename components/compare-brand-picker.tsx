"use client"

import { useDeferredValue, useMemo, useRef, useState } from "react"
import Image from "next/image"
import { Command } from "cmdk"
import { IconSearch } from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import { filterBrands } from "@/lib/filters"
import type { SidebarBrand } from "@/lib/types"

interface CompareBrandPickerProps {
  brands: SidebarBrand[]
  selectedSlugs: string[]
  onSelect: (slug: string) => void
  open: boolean
  onOpenChange: (open: boolean) => void
  copy: {
    searchBrands: string
    noBrandsFound: string
  }
}

export function CompareBrandPicker({
  brands,
  selectedSlugs,
  onSelect,
  open,
  onOpenChange,
  copy,
}: CompareBrandPickerProps) {
  const [query, setQuery] = useState("")
  const listRef = useRef<HTMLDivElement>(null)
  const deferredQuery = useDeferredValue(query)

  const selectedSet = useMemo(() => new Set(selectedSlugs), [selectedSlugs])

  const filtered = useMemo(() => {
    const all = filterBrands(brands, {
      query: deferredQuery,
      industries: [],
      tags: [],
      colorFamilies: [],
      typographyStyles: [],
    })
    return all.filter((brand) => !selectedSet.has(brand.slug))
  }, [brands, deferredQuery, selectedSet])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="fixed inset-0 animate-in bg-black/10 backdrop-blur-xs duration-150 fade-in-0"
        onClick={() => {
          onOpenChange(false)
          setQuery("")
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            onOpenChange(false)
            setQuery("")
          }
        }}
      />

      <div
        className="fixed top-[20%] left-1/2 z-50 w-[95%] max-w-md -translate-x-1/2 animate-in overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-2xl duration-150 fade-in-0 zoom-in-95 slide-in-from-top-2 dark:border-neutral-800 dark:bg-neutral-950"
        role="dialog"
        aria-label={copy.searchBrands}
      >
        <Command
          shouldFilter={false}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              onOpenChange(false)
              setQuery("")
            }
          }}
        >
          <div className="flex items-center gap-2 border-b border-neutral-200 px-4 dark:border-neutral-800">
            <IconSearch
              className="size-3.5 text-neutral-400"
              aria-hidden="true"
            />
            <Command.Input
              value={query}
              onValueChange={setQuery}
              placeholder={copy.searchBrands}
              autoFocus
              className="w-full bg-transparent py-3 text-sm text-neutral-900 outline-none placeholder:text-neutral-400 dark:text-neutral-100"
            />
          </div>
          <Command.List
            ref={listRef}
            className="max-h-[360px] overflow-y-auto p-2"
          >
            {filtered.length === 0 && (
              <div className="py-6 text-center text-sm text-neutral-400">
                {copy.noBrandsFound}
              </div>
            )}

            {filtered.map((brand) => (
              <Command.Item
                key={brand.slug}
                value={brand.slug}
                onSelect={() => {
                  onSelect(brand.slug)
                  onOpenChange(false)
                  setQuery("")
                }}
                className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 text-sm text-neutral-600 data-[selected=true]:bg-neutral-100 dark:text-neutral-400 dark:data-[selected=true]:bg-neutral-800/50"
              >
                <div
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-[10px]",
                    /black|dark|slate|navy/i.test(brand.thumbnail.label)
                      ? "dark:bg-neutral-200"
                      : /ivory|white|light/i.test(brand.thumbnail.label)
                        ? "bg-neutral-800"
                        : ""
                  )}
                >
                  <Image
                    src={brand.thumbnail.src}
                    alt={brand.name}
                    width={36}
                    height={36}
                    className="size-full object-contain p-0.5"
                  />
                </div>
                <span className="font-medium">{brand.name}</span>
                <span className="ml-auto text-[11px] text-neutral-400">
                  {brand.industry}
                </span>
              </Command.Item>
            ))}
          </Command.List>
        </Command>
      </div>
    </div>
  )
}
