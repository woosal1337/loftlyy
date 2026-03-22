Add a new brand to Loftlyy. The brand name is: $ARGUMENTS

Follow these steps in order. Do not skip any step. Use parallel tool calls wherever possible.

## Step 1: Research

First, use the OpenBrand API to extract brand assets automatically:

```bash
curl "https://openbrand.sh/api/extract?url=https://<brand-domain>" \
  -H "Authorization: Bearer $OPENBRAND_API_KEY"
```

This returns colors, fonts, logos, and other brand data. Use WebFetch to call the API and parse the JSON response. The API key should be set as an environment variable.

Then supplement with WebFetch to the brand's official website and gather anything missing:

- Brand description (2-3 sentences)
- Official colors with hex values and usage descriptions
- Typography: font names, roles, weights, designer, foundry
- Founded year, headquarters, designer/design team, last rebrand year
- Brand philosophy (1-2 sentence summary)
- Legal guidelines URL and dos/donts

Also check `data/categories.ts` for available industry/style categories.

## Step 2: Fetch Logo Assets

Find official SVG logos. Try these sources in order:

1. Brand's official press/brand page
2. `https://www.logo.wine/logo/Brand_Name` via WebFetch
3. Brand's website HTML for inline SVG or CDN paths:
   ```bash
   curl -sL -A "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" "https://brand.com" | grep -oiE '[a-zA-Z0-9/_:.-]*\.svg' | sort -u
   ```

Create at minimum these variants:

- `<slug>-logo-black.svg` — dark fill for light backgrounds
- `<slug>-logo-white.svg` — white fill for dark backgrounds (label MUST contain "White")
- Additional brand-color variants if applicable

**CRITICAL SVG rules:**

- Every SVG MUST have explicit `width` and `height` attributes, not just `viewBox`
- Icon logos: minimum 128x128 dimensions (increase `width`/`height` if viewBox is small like 16x16 — keep viewBox the same)
- ViewBox must tightly crop the artwork — no excessive padding
- NEVER fabricate wordmarks with `<text>` elements — only use proper vector paths
- Create color variants by changing the `fill` attribute

Save SVGs to a temporary local directory (e.g., `/tmp/brands/<slug>/`), then upload each to Cloudflare R2:

```bash
wrangler r2 object put "loftlyy-assets/brands/<slug>/<filename>.svg" \
  --file="/tmp/brands/<slug>/<filename>.svg" \
  --content-type="image/svg+xml" \
  --remote
```

## Step 3: Fetch Font Files

Find the brand's actual font files as `.woff2`:

```bash
curl -sL -A "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" "https://brand.com" | grep -oiE '[a-zA-Z0-9/_:.-]*\.(woff2|woff|ttf)' | sort -u
```

Also check subpages (blog, docs, developer portal) if the homepage doesn't yield results. Try predictable CDN paths.

For system fonts (e.g., SF Pro on macOS), use pyftsubset to subset:

```bash
python3 -m venv /tmp/fonttools-env && /tmp/fonttools-env/bin/pip install fonttools brotli
/tmp/fonttools-env/bin/pyftsubset /path/to/font.ttf --output-file=output.woff2 --flavor=woff2 --text="The quick brown fox jumps over the lazy dog. 0123456789 ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz !@#\$%&*()" --layout-features='*'
```

Requirements:

- Must be `.woff2` format, under 200KB each
- Asset paths in brand data use `/brands/<slug>/fonts/` — these are served from R2, NEVER use external URLs as `fontUrl`
- One file per typography entry in the data

Save font files to a temporary local directory, then upload to Cloudflare R2:

```bash
wrangler r2 object put "loftlyy-assets/brands/<slug>/fonts/<font-file>.woff2" \
  --file="/tmp/brands/<slug>/fonts/<font-file>.woff2" \
  --content-type="font/woff2" \
  --remote
```

## Step 4: Create Brand Data File

Create `data/brands/<slug>.ts` following the `Brand` type from `lib/types.ts`.

Key rules:

- `width`/`height` in assets and thumbnail MUST exactly match the SVG's `width`/`height` attributes
- Asset labels containing "white", "ivory", or "light" (case-insensitive) get dark backgrounds automatically
- Asset labels containing "black", "dark", "slate", or "navy" (case-insensitive) get light backgrounds in dark mode automatically
- Set `thumbnailDark` to a white/light variant of the logo for dark mode visibility (if the brand has one)
- `fontUrl` must be a local path like `/brands/<slug>/fonts/file.woff2`
- `industry` must match a slug in `data/categories.ts`
- Use today's date for `dateAdded`

## Step 5: Register the Brand

Edit `data/brands/index.ts`:

1. Add the import
2. Add the brand to the `brands` array (it's auto-sorted by name)

## Step 6: Add Translations

Add the brand's description and philosophy to **all 9** locale files in `messages/`:

- `messages/en.json` — English
- `messages/es.json` — Spanish
- `messages/fr.json` — French
- `messages/de.json` — German
- `messages/ja.json` — Japanese
- `messages/it.json` — Italian
- `messages/pt.json` — Portuguese
- `messages/ko.json` — Korean
- `messages/zh.json` — Chinese

Add under `brands.<slug>.description` and `brands.<slug>.philosophy`. If the industry or tags are new, add those translations under `categories` and `tags` too in **all 9 locales**.

## Step 7: Verify

Run the validation suite:

```bash
pnpm validate && pnpm typecheck
```

This checks:

- All brand data fields are complete and valid
- All translations are consistent across all 9 locales
- Brand categories and tags have matching translations

Also verify that assets were uploaded to R2 by spot-checking a URL:

```bash
curl -sI "$NEXT_PUBLIC_ASSET_BASE_URL/brands/<slug>/<filename>.svg" | head -5
```

You should see a `200 OK` with `content-type: image/svg+xml`.

Report the verification results. If anything fails, fix it before finishing.
