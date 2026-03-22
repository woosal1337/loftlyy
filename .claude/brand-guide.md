# Adding a New Brand — Agent Guide

Step-by-step guide for adding a new brand to Loftlyy. Follow every step in order.

---

## 1. Research the Brand

Before writing any code, gather:

- **Official brand page** (e.g., `brand.com/brand`, `brand.com/press`)
- **Colors**: hex values + usage descriptions
- **Typography**: font names, roles (headings, body, mono), weights, designer, foundry
- **Logo assets**: icon, wordmark, color variants (black, white, brand-color)
- **Brand philosophy / story**
- **Legal guidelines**: dos and donts, guidelines URL
- **Metadata**: founded year, headquarters, designer, last rebrand year

---

## 2. Create Asset Files

### Asset hosting — Cloudflare R2

All brand assets are hosted on **Cloudflare R2**, NOT in the local `public/` directory.

- **R2 bucket**: `loftlyy-assets`
- **Public URL**: `$NEXT_PUBLIC_ASSET_BASE_URL`
- **Key structure**: `brands/<slug>/<filename>`

Assets are served at: `$NEXT_PUBLIC_ASSET_BASE_URL/brands/<slug>/<filename>`

The app prepends `NEXT_PUBLIC_ASSET_BASE_URL` to all asset paths automatically.

### Directory structure (in R2)

```
brands/<slug>/
├── <slug>-logo-black.svg        # Icon — dark variant
├── <slug>-logo-white.svg        # Icon — light variant (triggers dark bg)
├── <slug>-logo-<brand-color>.svg # Icon — brand color variant
├── <slug>-wordmark-black.svg     # Wordmark — dark variant
├── <slug>-wordmark-white.svg     # Wordmark — light variant
└── fonts/
    ├── <font-name>.woff2         # Primary font specimen
    └── <font-name>.woff2         # Additional fonts
```

### Uploading assets to R2

Save files to a temporary local directory (e.g., `/tmp/brands/<slug>/`), then upload with correct content types:

```bash
# SVG files
wrangler r2 object put "loftlyy-assets/brands/<slug>/<filename>.svg" \
  --file="/tmp/brands/<slug>/<filename>.svg" \
  --content-type="image/svg+xml" \
  --remote

# Font files
wrangler r2 object put "loftlyy-assets/brands/<slug>/fonts/<font>.woff2" \
  --file="/tmp/brands/<slug>/fonts/<font>.woff2" \
  --content-type="font/woff2" \
  --remote

# PNG files (if any)
wrangler r2 object put "loftlyy-assets/brands/<slug>/<filename>.png" \
  --file="/tmp/brands/<slug>/<filename>.png" \
  --content-type="image/png" \
  --remote
```

**CRITICAL**: Always use `--content-type` and `--remote` flags. Without `--content-type`, files serve as raw text instead of rendering properly. Without `--remote`, files go to the local emulator only.

### SVG requirements

Every SVG **must** have explicit `width` and `height` attributes — not just `viewBox`:

```svg
<!-- WRONG -->
<svg viewBox="0 0 128 128" xmlns="...">

<!-- CORRECT -->
<svg width="128" height="128" viewBox="0 0 128 128" xmlns="...">
```

**Why**: Next.js `<Image>` renders SVGs as `<img>` tags. Without intrinsic `width`/`height`, the browser may collapse them to 0 size.

### SVG sizing rules

- **Icon logos**: Use `width`/`height` of at least **128x128** (or actual viewBox size if larger). SVGs with tiny dimensions (e.g., 16x16) will render as tiny dots in asset cards.
- **Wordmarks**: Match `width`/`height` to the viewBox dimensions.
- **ViewBox must tightly crop** the artwork. Excessive padding in the viewBox makes logos appear small. If the source SVG has lots of whitespace, tighten the viewBox to the path bounds.

### Color variant naming convention

The `BrandAssets` component uses a regex (`/ivory|white|light/i`) on asset labels to determine background color:

- Labels containing **"white"**, **"ivory"**, or **"light"** → dark background (`bg-neutral-800`)
- All other labels → light background (`bg-neutral-50`)

So name your assets accordingly:

- `"Brand Logo — Black"` → renders on light bg ✓
- `"Brand Logo — White"` → renders on dark bg ✓
- `"Brand Logo — Light Green"` → renders on dark bg ✓

### Fetching official assets

1. **Check the brand's official website** for downloadable SVG/PNG assets
2. **Check CDN paths**: many sites serve logos at predictable URLs:
   - `brand.com/press/logo.svg`
   - `brand.com/brand/assets/logo.svg`
   - `cdn.brand.com/logos/logo.svg`
3. **logo.wine** has many brand SVGs: `https://www.logo.wine/logo/Brand_Name`
4. **Never fabricate wordmarks** with `<text>` elements — they depend on local fonts and render inconsistently. Only use proper vector paths.
5. **Create color variants** by changing the `fill` attribute on existing SVGs.

---

## 3. Fetch Font Files

### Finding fonts

1. **Inspect the brand's website** for font URLs:
   ```bash
   curl -sL -A "Mozilla/5.0 ..." "https://brand.com" | grep -oiE '[a-zA-Z0-9/_:.-]*\.(woff2|woff|ttf)' | sort -u
   ```
2. **Check CDN paths** — many brands serve fonts from predictable CDN URLs
3. **Check `/_next/static/media/`** for Next.js sites
4. **System fonts** (e.g., SF Pro on macOS): use `pyftsubset` from fonttools to subset and convert:
   ```bash
   python3 -m venv /tmp/fonttools-env
   /tmp/fonttools-env/bin/pip install fonttools brotli
   /tmp/fonttools-env/bin/pyftsubset /path/to/font.ttf \
     --output-file=output.woff2 \
     --flavor=woff2 \
     --text="The quick brown fox jumps over the lazy dog. 0123456789 ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz !@#\$%&*()" \
     --layout-features='*'
   ```

### Font file requirements

- **Format**: `.woff2` preferred (smallest, best browser support)
- **Size**: Keep under ~200KB per file. Subset if needed (specimen text only).
- **One file per typography entry**: The `fontUrl` field loads one file for the specimen preview.
- **Do not use external URLs** (e.g., `https://foundry.com/font/`) as `fontUrl` — use local paths like `/brands/<slug>/fonts/file.woff2` which get served from R2.
- **Upload to R2** with `--content-type="font/woff2" --remote` — see "Uploading assets to R2" section above.

---

## 4. Create the Brand Data File

Create `data/brands/<slug>.ts`:

```typescript
import type { Brand } from "@/lib/types"

export const brandName: Brand = {
  slug: "brand-slug",
  name: "Brand Name",
  description: "2-3 sentence description of the brand.",
  url: "https://brand.com",
  industry: "industry-slug",        // must match a category in data/categories.ts
  categories: ["industry", "style-category", ...],
  tags: ["tag1", "tag2", "tag3", "tag4", "tag5"],
  colors: [
    {
      name: "Brand Blue",
      hex: "#0066FF",
      usage: "Primary brand color, used in logo and CTAs.",
    },
    // ... more colors
  ],
  typography: [
    {
      name: "Font Name",
      role: "Headings / Display",
      weights: ["400", "500", "700"],
      category: "sans-serif",       // "sans-serif" | "serif" | "monospace"
      designer: "Designer Name",
      foundry: "Foundry Name",
      fontUrl: "/brands/<slug>/fonts/font-file.woff2",
    },
    // ... more fonts
  ],
  assets: [
    {
      label: "Brand Logo — Black",   // label determines bg color
      src: "/brands/<slug>/logo-black.svg",
      width: 256,                    // MUST match SVG width attribute
      height: 256,                   // MUST match SVG height attribute
      format: "svg",
    },
    // ... more assets
  ],
  thumbnail: {
    label: "Brand Logo — Black",
    src: "/brands/<slug>/logo-black.svg",
    width: 256,
    height: 256,
    format: "svg",
  },
  dateAdded: "YYYY-MM-DD",          // today's date
  founded: 2020,
  headquarters: "City, Country",
  designer: "Design Team / Designer",
  lastRebranded: "2023",
  philosophy: "1-2 sentence brand philosophy quote in italics style.",
  legal: {
    guidelinesUrl: "https://brand.com/brand-guidelines",
    dos: [
      "Use official brand assets only",
      "Maintain clear space around logo",
    ],
    donts: [
      "Don't modify logo colors or proportions",
      "Don't imply endorsement without permission",
    ],
  },
}
```

---

## 5. Register the Brand

Add the import and include it in the array in `data/brands/index.ts`:

```typescript
import { brandName } from "./brand-slug"

export const brands: Brand[] = [
  anthropic,
  apple,
  brandName,
  discord,
  openai,
  spotify,
  wise,
].sort((a, b) => a.name.localeCompare(b.name))
```

---

## 6. Add Translations

Add the brand description in each locale file (`messages/<locale>.json`) under the `brands` namespace:

```json
{
  "brands": {
    "brand-slug": {
      "description": "Localized description..."
    }
  }
}
```

If the industry or tags are new, add translations for those too under `categories` and `tags`.

---

## 7. Verify

Run these checks before considering the brand done:

```bash
# 1. Verify assets uploaded to R2 (spot-check a few)
curl -sI "$NEXT_PUBLIC_ASSET_BASE_URL/brands/<slug>/<filename>.svg" | head -5
# Should return 200 with content-type: image/svg+xml

curl -sI "$NEXT_PUBLIC_ASSET_BASE_URL/brands/<slug>/fonts/<font>.woff2" | head -5
# Should return 200 with content-type: font/woff2

# 2. Type check
pnpm typecheck

# 3. Lint
pnpm check

# 4. Validate brand data & translations
pnpm validate

# 5. Dev server renders correctly
pnpm dev
# Visit /en/<slug> and verify:
#   - Thumbnail renders in sidebar at correct size
#   - All assets visible in asset cards
#   - White/light assets have dark backgrounds
#   - Typography specimens render in actual fonts
#   - Colors display correctly
#   - Similar brands section populates
```

---

## Common Pitfalls

| Issue                           | Cause                                        | Fix                                                   |
| ------------------------------- | -------------------------------------------- | ----------------------------------------------------- |
| Asset cards are blank           | SVG missing `width`/`height` attrs           | Add explicit `width` and `height` to `<svg>` element  |
| Icons appear tiny               | SVG `width`/`height` too small (e.g., 16x16) | Increase to 256x256+ (keep viewBox the same)          |
| Icon has too much whitespace    | ViewBox has padding around artwork           | Tighten viewBox to path bounds                        |
| White logo on white bg          | Label missing "white"/"light"/"ivory"        | Add variant keyword to label                          |
| Font specimen shows system font | `fontUrl` is external URL or missing         | Use local `/brands/<slug>/fonts/` path to .woff2 file |
| SVG renders as raw text         | Missing `--content-type` on R2 upload        | Re-upload with `--content-type="image/svg+xml"`       |
| Assets uploaded to local only   | Missing `--remote` flag on wrangler          | Re-upload with `--remote` flag                        |
| Dev server shows stale data     | `.next` cache                                | Delete `.next/` and restart `pnpm dev`                |
| Data dimensions don't match SVG | `width`/`height` in data ≠ SVG attrs         | Sync data values to actual SVG attributes             |
