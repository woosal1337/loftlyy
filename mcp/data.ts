import { existsSync } from "node:fs"
import { join } from "node:path"
import type { LoadedBrands, LoaderOptions } from "@/cli/core/contracts"
import { loadBrands } from "@/cli/core/loader"

let cached: LoadedBrands | null = null
let loadPromise: Promise<LoadedBrands> | null = null

const detectSource = (): "local" | "remote" => {
  const rootDir = process.env.LOFTLYY_ROOT_DIR ?? process.cwd()
  const localBrandsDir = join(rootDir, "data", "brands")
  return existsSync(localBrandsDir) ? "local" : "remote"
}

const getLoaderOptions = (): LoaderOptions => {
  const explicit = process.env.LOFTLYY_SOURCE
  const source =
    explicit === "local" || explicit === "remote" ? explicit : detectSource()

  return {
    baseUrl: process.env.LOFTLYY_BASE_URL,
    rootDir: process.env.LOFTLYY_ROOT_DIR,
    source,
    strict: process.env.LOFTLYY_STRICT === "true",
  }
}

export const getData = (): Promise<LoadedBrands> => {
  if (cached) return Promise.resolve(cached)

  if (!loadPromise) {
    loadPromise = loadBrands(getLoaderOptions()).then((data) => {
      cached = data
      return data
    })
  }

  return loadPromise
}
