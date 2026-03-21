import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

type SearchParamsLike = Pick<URLSearchParams, "keys" | "getAll">

export function searchParamsToQuery(
  searchParams: SearchParamsLike
): Record<string, string | string[]> {
  const query: Record<string, string | string[]> = {}

  for (const key of searchParams.keys()) {
    const values = searchParams.getAll(key)
    if (values.length === 0) continue

    query[key] = values.length === 1 ? values[0] : values
  }

  return query
}

export function buildUtmUrl(url: string, slug: string): string {
  const u = new URL(url)
  u.searchParams.set("utm_source", "loftlyy")
  u.searchParams.set("utm_medium", "referral")
  u.searchParams.set("utm_campaign", slug)
  return u.toString()
}
