import { readFile } from "node:fs/promises"
import { join } from "node:path"

export const OG_SIZE = { width: 1200, height: 630 }

let fontCache: ArrayBuffer | null = null

export async function getInterBoldFont(): Promise<ArrayBuffer> {
  if (fontCache) return fontCache
  const fontPath = join(process.cwd(), "app/fonts/Inter-Bold.ttf")
  const buffer = await readFile(fontPath)
  fontCache = buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength
  )
  return fontCache
}

export function contrastingBackground(hex: string): string {
  const r = Number.parseInt(hex.slice(1, 3), 16)
  const g = Number.parseInt(hex.slice(3, 5), 16)
  const b = Number.parseInt(hex.slice(5, 7), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5 ? "#0a0a0a" : "#fafafa"
}

export function textColorForBackground(bgHex: string): string {
  return bgHex === "#0a0a0a" ? "#fafafa" : "#0a0a0a"
}
