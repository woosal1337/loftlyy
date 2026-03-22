import { defineConfig } from "tsup"

export default defineConfig({
  banner: { js: "#!/usr/bin/env node" },
  clean: true,
  dts: false,
  entry: ["index.ts"],
  format: ["esm"],
  outDir: "dist",
  platform: "node",
  sourcemap: false,
  splitting: false,
  target: "node20",
})
