Verify and fix translation quality across all locale files. If a locale code is provided, check only that locale: $ARGUMENTS

You are auditing the translation files in `messages/` against `messages/en.json` (the source of truth). The project uses next-intl with 9 locales: en, es, fr, de, ja, it, pt, ko, zh.

Follow these steps in order. Use parallel tool calls wherever possible.

## Step 1: Load translation files

Read `messages/en.json` and the target locale files in parallel.

- If `$ARGUMENTS` is a valid locale code (es, fr, de, ja, it, pt, ko, zh), check only that locale.
- If `$ARGUMENTS` is empty or blank, check all 8 non-English locales.

Read all relevant files simultaneously.

## Step 2: Structural check — missing and extra keys

Recursively walk all key paths in `en.json`. For each target locale:

- **Missing keys**: paths present in `en.json` but absent in the locale file → these must be added
- **Extra/orphaned keys**: paths present in the locale but not in `en.json` → flag for review (may be stale remnants)

Record the full dot-notation key path for each issue (e.g. `brands.tesla.description`, `seo.tagTitle`).

## Step 3: Placeholder integrity check

For every string in `en.json` that contains `{variable}` placeholders, verify the translated string contains:
- The **same set** of placeholder names (e.g. `{brandName}`, `{count}`, `{category}`)
- No added, removed, or renamed placeholders

Broken placeholders cause **runtime errors** in next-intl — treat these as critical issues.

## Step 4: Untranslated content check

Flag strings in non-English locales that are character-for-character identical to the English value, unless the content is legitimately language-neutral:

- Brand names (e.g. "Tesla", "Nike") — skip
- The word "Loftlyy" — skip
- URLs — skip
- Single-character strings or punctuation-only strings — skip
- Everything else that's identical to English → flag as untranslated

## Step 5: Semantic and quality review

Use your language knowledge to review translation quality. Focus exhaustively on these UI namespaces: `metadata`, `home`, `nav`, `brand`, `category`, `seo`, `categories`, `tags`, `colorFamilies`, `typographyStyles`, `browseBy`, `common`.

For the `brands.*` namespace (90+ entries), spot-check 10 random brand entries per locale rather than reviewing all.

Check for:
- **Diacritics and special characters**: accents (é, è, ê), umlauts (ä, ö, ü, ß), cedillas (ç), tildes (ñ), etc.
- **Natural phrasing**: not overly literal or word-for-word machine translation
- **Apostrophes and contractions**: e.g. `d'Abode` not `d Abode`, `l'identité` not `l identité`
- **Consistent terminology**: the same concept should use the same word across all keys in a locale (e.g. "Typography" shouldn't be "Typographie" in one key and "Police de caractères" in another)
- **Tone/register match**: English is semi-formal and concise — translations should match
- **Encoding artifacts**: curly quotes vs straight quotes, em-dashes vs hyphens

## Step 6: Report findings

Print a structured report. Group by locale, then by check type:

```
## Locale: de (German)

### ❌ Missing keys (N)
- brands.abode.description
- brands.abode.philosophy
- tags.some-tag

### ⚠️ Placeholder issues (N)
- seo.brandDescription: EN requires {brandName}, {industry} — DE has only {brandName}

### ⚠️ Untranslated strings (N)
- home.subheadline: value is identical to English

### ⚠️ Quality issues (N)
- nav.clearFilters: "Clear all" left in English
- brand.legalNotice: missing apostrophe — "de Loftlyy" should be checked
- [key]: [specific issue and suggested fix]

---
```

If a locale has no issues, print: `## Locale: xx — ✅ No issues found`

## Step 7: Apply fixes

For every issue found, apply fixes directly to the locale JSON files:

- **Missing keys**: translate the English value accurately into the target language and insert the key at the correct position in the JSON structure
- **Placeholder issues**: rewrite the translated string to include all required `{variable}` placeholders — preserve the translation but restore the placeholders
- **Untranslated strings**: provide an accurate translation
- **Quality issues**: apply the specific correction (fix diacritic, apostrophe, rephrase, etc.)

When translating, produce high-quality, natural-sounding text — not literal translations. Match the tone and conciseness of the English source.

**Do not change** the JSON structure, key ordering (beyond inserting missing keys in the right place), or any keys that have no issues.

## Step 8: Confirm fixes

After writing all fixes, re-read each modified file and confirm:

- All previously missing keys are now present
- All placeholder issues are resolved
- Print a final summary:

```
## Summary
- Locales checked: N
- Total issues found: N
  - Missing keys: N
  - Placeholder issues: N
  - Untranslated strings: N
  - Quality issues: N
- Issues fixed: N
- Issues requiring manual review: N (list them)
```

If any issue could not be confidently fixed (e.g. a brand description you're unsure how to translate accurately), list it under "requires manual review" rather than guessing.
