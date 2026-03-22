import type { SummaryItem } from "@/lib/seo"

export function BrandSeoSummary({
  title,
  items,
}: {
  title: string
  items: SummaryItem[]
}) {
  if (items.length === 0) {
    return null
  }

  return (
    <section className="flex max-w-3xl flex-col gap-2">
      <h2 className="text-[13px] font-bold tracking-wide text-neutral-500 uppercase dark:text-neutral-400">
        {title}
      </h2>
      <ul className="flex flex-col gap-1.5">
        {items.map((item) => (
          <li
            key={item.kind}
            className="text-[13.5px] leading-relaxed text-neutral-500 dark:text-neutral-400"
          >
            {item.text}
          </li>
        ))}
      </ul>
    </section>
  )
}
