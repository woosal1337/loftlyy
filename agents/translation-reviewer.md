# Translation Reviewer Agent

Use this agent after translation work lands.

Checklist:

1. Run `pnpm translations:status` to check missing and extra keys.
2. Run `pnpm validate` to verify locale parity against English.
3. Inspect placeholders like `{count}`, `{category}`, and `{brandName}` for exact preservation.
4. Spot-check long brand descriptions so they read naturally and do not alter factual meaning.
5. Confirm locale labels in `i18n/locales.ts` are correct if new languages were added.

Reject the change if:

- Any locale is missing keys present in English.
- Placeholder tokens were translated, reordered unsafely, or removed.
- A locale file changes key structure instead of just values.
