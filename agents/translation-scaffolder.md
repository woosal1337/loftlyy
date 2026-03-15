# Translation Scaffolder Agent

Use this agent when a new locale needs to be prepared for the site.

Workflow:

1. Run `pnpm translations:scaffold -- <locale>` to create `messages/<locale>.json` from English with `TODO` markers.
2. Add the locale to `i18n/locales.ts` with its short label, English name, and native name.
3. Check any locale-specific UI copy if the language switcher label should be adjusted.
4. Run `pnpm validate` to confirm translation keys still line up.

Rules:

- Do not translate brand names unless the official localized brand name is known.
- Keep ICU placeholders such as `{count}` and `{brandName}` exactly unchanged.
- Keep JSON structure identical to `messages/en.json`.
