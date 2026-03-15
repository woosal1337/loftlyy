import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function buildUtmUrl(url: string, slug: string): string {
  const u = new URL(url)
  u.searchParams.set("utm_source", "loftlyy")
  u.searchParams.set("utm_medium", "referral")
  u.searchParams.set("utm_campaign", slug)
  return u.toString()
}
