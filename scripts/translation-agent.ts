import { existsSync } from "node:fs"
import { mkdir, readFile, writeFile } from "node:fs/promises"
import { basename, join } from "node:path"
import { locales } from "@/i18n/locales"

const ROOT = process.cwd()
const MESSAGES_DIR = join(ROOT, "messages")
const EN_MESSAGES_PATH = join(MESSAGES_DIR, "en.json")

type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue }

type JsonObject = { [key: string]: JsonValue }

async function loadJson(path: string): Promise<JsonObject> {
  const raw = await readFile(path, "utf-8")
  return JSON.parse(raw) as JsonObject
}

function flattenKeys(value: JsonValue, prefix = ""): string[] {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return prefix ? [prefix] : []
  }

  const keys: string[] = []
  for (const key of Object.keys(value)) {
    const nextPrefix = prefix ? `${prefix}.${key}` : key
    keys.push(...flattenKeys(value[key], nextPrefix))
  }
  return keys.sort()
}

function annotateForTranslation(
  value: JsonValue,
  locale: string,
  keyPath = ""
): JsonValue {
  if (typeof value === "string") {
    const prefix = `[TODO ${locale}]`
    return keyPath === "metadata.siteName" ? value : `${prefix} ${value}`
  }

  if (Array.isArray(value)) {
    return value.map((entry, index) =>
      annotateForTranslation(entry, locale, `${keyPath}[${index}]`)
    )
  }

  if (typeof value === "object" && value !== null) {
    const annotated: JsonObject = {}
    for (const [key, entry] of Object.entries(value)) {
      const nextKeyPath = keyPath ? `${keyPath}.${key}` : key
      annotated[key] = annotateForTranslation(entry, locale, nextKeyPath)
    }
    return annotated
  }

  return value
}

async function getStatus() {
  const source = await loadJson(EN_MESSAGES_PATH)
  const sourceKeys = flattenKeys(source)

  for (const locale of locales) {
    const path = join(MESSAGES_DIR, `${locale}.json`)
    const messages = await loadJson(path)
    const localeKeys = flattenKeys(messages)
    const missing = sourceKeys.filter((key) => !localeKeys.includes(key))
    const extra = localeKeys.filter((key) => !sourceKeys.includes(key))

    const summary =
      locale === "en"
        ? `[${locale}] source locale (${sourceKeys.length} keys)`
        : `[${locale}] missing=${missing.length} extra=${extra.length} total=${localeKeys.length}`

    // biome-ignore lint: CLI output
    console.log(summary)

    if (missing.length > 0) {
      // biome-ignore lint: CLI output
      console.log(`  missing: ${missing.slice(0, 10).join(", ")}`)
    }

    if (extra.length > 0) {
      // biome-ignore lint: CLI output
      console.log(`  extra: ${extra.slice(0, 10).join(", ")}`)
    }
  }
}

async function scaffoldLocale(locale: string) {
  const path = join(MESSAGES_DIR, `${locale}.json`)

  if (existsSync(path)) {
    throw new Error(`${basename(path)} already exists`)
  }

  await mkdir(MESSAGES_DIR, { recursive: true })
  const source = await loadJson(EN_MESSAGES_PATH)
  const annotated = annotateForTranslation(source, locale)

  await writeFile(path, `${JSON.stringify(annotated, null, 2)}\n`, "utf-8")

  // biome-ignore lint: CLI output
  console.log(`Created messages/${locale}.json`)
  // biome-ignore lint: CLI output
  console.log(
    `Next step: add "${locale}" to i18n/locales.ts before routing it live.`
  )
}

function printHelp() {
  // biome-ignore lint: CLI output
  console.log(`Translation agent commands:

  pnpm translations:status
  pnpm translations:scaffold -- <locale>

Examples:
  pnpm translations:status
  pnpm translations:scaffold -- it
`)
}

async function main() {
  const [, , command, ...args] = process.argv

  if (!command || command === "--help" || command === "-h") {
    printHelp()
    return
  }

  if (command === "status") {
    await getStatus()
    return
  }

  if (command === "scaffold") {
    const locale = args[0]?.trim().toLowerCase()
    if (!locale) {
      throw new Error(
        "Locale code is required, e.g. pnpm translations:scaffold -- it"
      )
    }

    await scaffoldLocale(locale)
    return
  }

  throw new Error(`Unknown command: ${command}`)
}

await main()
