Verify a brand's stored data against live internet sources and fix any inaccuracies. The brand slug is: $ARGUMENTS

You are fact-checking a brand's data file against authoritative live sources. The goal is 100% confidence in every field — verify everything, fix what's wrong, flag what you can't confirm.

Follow these steps in order. Use parallel tool calls wherever possible.

## Step 1: Load brand data

Read these two files in parallel:

- `data/brands/$ARGUMENTS.ts` — the brand's TypeScript data file
- `messages/en.json` — extract `brands.$ARGUMENTS.description` and `brands.$ARGUMENTS.philosophy`

Note the current value of every field: `name`, `url`, `founded`, `headquarters`, `designer`, `lastRebranded`, `description`, `philosophy`, `colors` (each hex + usage), `typography` (each font name + role), `categories`, `tags`, `legal.guidelinesUrl`, `legal.dos`, `legal.donts`.

Also note the English translations: `brands.$ARGUMENTS.description` and `brands.$ARGUMENTS.philosophy`.

## Step 2: Research from live sources

Launch all of these fetches **simultaneously** (parallel tool calls):

1. **Official website**: Fetch `brand.url` — confirm it returns 200 and check for brand/identity content
2. **Brand/press page**: Try fetching `<brand.url>/brand`, `<brand.url>/press`, `<brand.url>/newsroom`, `<brand.url>/identity` — take whichever responds
3. **Wikipedia**: Fetch `https://en.wikipedia.org/wiki/[Brand_Name]` — look for infobox data (founded, HQ, type, industry)
4. **Web search – history**: Search `"[Brand Name] founded year headquarters identity designer rebranding history"`
5. **Web search – brand identity**: Search `"[Brand Name] brand guidelines colors typography official"`
6. **Guidelines URL**: Fetch `brand.legal.guidelinesUrl` — check HTTP status; if 404/gone, search for the current URL

## Step 3: Verify each field

For every field below, cross-reference your findings and assign a confidence level:
- ✅ **Confirmed** — multiple authoritative sources agree with stored value
- ⚠️ **Discrepancy** — sources suggest a different value
- ❌ **Wrong** — stored value is clearly incorrect
- ❓ **Unverifiable** — no authoritative source found

| Field | Verification approach |
|---|---|
| `founded` | Wikipedia infobox, official About page, Crunchbase |
| `headquarters` | Wikipedia infobox, official About/Contact page |
| `designer` | Wikipedia, official brand guidelines, Brand New / It's Nice That design press |
| `lastRebranded` | Wikipedia, design press (Brand New, UnderConsideration), official announcements |
| `url` | Returns 200; no redirect to a different domain |
| `description` (.ts file) | Factually current; matches official About copy |
| `philosophy` (.ts file) | Reflects brand's actual design identity narrative |
| `colors` hex values | Match official brand guidelines, press kit, or design system docs |
| `typography` font names | Match official brand guidelines or detected fonts on brand website |
| `categories` / `tags` | Appropriate for the brand's current industry positioning |
| `legal.guidelinesUrl` | Returns 200 or 301/302; page actually contains brand guidelines |
| `legal.dos` | Consistent with official guidelines (if accessible) |
| `legal.donts` | Consistent with official guidelines (if accessible) |
| `brands.$ARGUMENTS.description` (en.json) | Up-to-date; matches current brand positioning |
| `brands.$ARGUMENTS.philosophy` (en.json) | Accurate; consistent with brand's identity narrative |

**Note on colors**: Hex values for brand colors can legitimately vary slightly between sources (screen rendering, print vs digital). Only flag a discrepancy if the difference is significant (>10% in any channel) or if official guidelines explicitly state a different value.

**Note on typography**: Font names must match exactly. If the brand uses a custom/proprietary font, verify its correct name.

## Step 4: Report findings

Print this exact structure, substituting real data:

```
## Brand: [Name] ([slug])
Last checked: [today's date]

### ✅ Confirmed correct ([N] fields)
- founded: [value] ✅
- headquarters: "[value]" ✅
- [field]: [value] ✅
...

### ⚠️ Discrepancies found ([N] fields)
- [field]: stored "[current value]" — sources indicate "[correct value]"
  Source: [URL or search result]
  Confidence: [X]%

### ❌ Incorrect ([N] fields)
- [field]: stored "[current value]" — actually "[correct value]"
  Source: [URL]
  Confidence: [X]%

### ❓ Could not verify ([N] fields)
- [field]: "[current value]" — no authoritative source found
  Action: Manual review recommended

### Guidelines URL
- legal.guidelinesUrl: [✅ accessible / ❌ returns 404 — suggested replacement: [URL]]

### Brand story (en.json)
- brands.[slug].description: [✅ current / ⚠️ outdated — [explanation]]
- brands.[slug].philosophy: [✅ accurate / ⚠️ inaccurate — [explanation]]
```

Always cite the specific source URL or search result for every discrepancy.

## Step 5: Apply high-confidence fixes

For every issue with **≥85% confidence**, apply the fix immediately:

**In `data/brands/$ARGUMENTS.ts`**:
- Update the incorrect field value(s)
- Preserve all formatting, code style, and surrounding structure exactly
- Do not change any field that was confirmed correct or unverifiable

**In `messages/en.json`** (if `description` or `philosophy` is outdated):
- Update `brands.$ARGUMENTS.description` and/or `brands.$ARGUMENTS.philosophy` with accurate, well-written copy
- Keep the same tone: semi-formal, concise, present-tense

**Propagate to all other locales** (only if en.json changed):
- Update `messages/es.json`, `messages/fr.json`, `messages/de.json`, `messages/ja.json`, `messages/it.json`, `messages/pt.json`, `messages/ko.json`, `messages/zh.json`
- Translate the updated English text accurately into each language — natural phrasing, correct diacritics, not literal translation

For items with **<85% confidence** or flagged as ❓ Unverifiable: do NOT modify the stored value. List them in the summary as requiring manual review.

## Step 6: Verify the fix

After all edits:

1. Run `pnpm typecheck` to confirm the brand data file is valid TypeScript
2. If typecheck fails, fix the error before finishing'
3. Verify all the changes by fetching content and re-verifying from the internet.

Print the final summary:

```
## Summary — [Brand Name]
- Fields checked: 15
- Confirmed correct: [N]
- Fixed automatically: [N] (list them)
- Requires manual review: [N] (list them with reason)
- Typecheck: ✅ passed / ❌ failed
```

If anything requires manual review, clearly state what needs to be checked and why.
