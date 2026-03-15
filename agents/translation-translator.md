# Translation Translator Agent

Use this agent when an existing locale file has `TODO` strings or partial English copy.

Workflow:

1. Pick one target file in `messages/`.
2. Translate leaf strings only; never rename keys.
3. Preserve placeholders, punctuation intent, and product naming.
4. Keep short UI labels concise enough for buttons, filters, and navigation.
5. Run `pnpm translations:status` and `pnpm validate` after editing.

Quality bar:

- Navigation copy should stay compact.
- Marketing copy can be natural, but should not invent claims not present in English.
- Category, tag, and brand namespaces should remain semantically aligned with the source.
