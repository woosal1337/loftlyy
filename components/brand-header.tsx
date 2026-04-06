import Image from "next/image"
import { useTranslations } from "next-intl"
import { IconArrowsShuffle2 } from "@tabler/icons-react"
import { Link } from "@/i18n/navigation"
import { cn, buildUtmUrl } from "@/lib/utils"
import type { Brand } from "@/lib/types"

export function BrandHeader({
  brand,
  translatedDescription,
  translatedIndustry,
  translatedTags,
}: {
  brand: Brand
  translatedDescription: string
  translatedIndustry: string
  translatedTags: Record<string, string>
}) {
  const t = useTranslations("brand")

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-start gap-4">
        <div
          className={cn(
            "flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl shadow-[0_0_0_0.5px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.06)] dark:shadow-[0_0_0_0.5px_rgba(255,255,255,0.06)]",
            /black|dark|slate|navy/i.test(brand.thumbnail.label)
              ? "bg-neutral-100 dark:bg-neutral-200"
              : /ivory|white|light/i.test(brand.thumbnail.label)
                ? "bg-neutral-800 dark:bg-neutral-800"
                : "bg-neutral-100 dark:bg-neutral-800"
          )}
        >
          <Image
            src={brand.thumbnail.src}
            alt={`${brand.name} logo`}
            width={56}
            height={56}
            className="h-full w-full object-contain p-2.5"
            priority
          />
        </div>
        <div className="flex min-w-0 flex-col gap-0.5">
          <h1 className="text-xl font-semibold tracking-tight text-balance text-neutral-900 dark:text-neutral-100">
            {brand.name}
          </h1>
          <span className="text-[13px] text-neutral-500 dark:text-neutral-400">
            {translatedIndustry}
          </span>
        </div>
      </div>

      <p className="max-w-2xl text-[14px] leading-relaxed text-neutral-500 dark:text-neutral-400">
        {translatedDescription}
      </p>

      <div className="flex flex-wrap items-center gap-1.5 text-[12.5px] text-neutral-500 dark:text-neutral-400">
        {brand.tags?.map((tag, i) => (
          <span key={tag} className="flex items-center gap-1.5">
            {i > 0 && (
              <span className="text-neutral-400 dark:text-neutral-600">
                &middot;
              </span>
            )}
            <span>{translatedTags[tag] ?? tag}</span>
          </span>
        ))}
        {brand.url && (
          <>
            <span className="text-neutral-400 dark:text-neutral-600">
              &middot;
            </span>
            <a
              href={buildUtmUrl(brand.url, brand.slug)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-900 underline decoration-neutral-400 underline-offset-2 transition-colors hover:decoration-neutral-500 dark:text-neutral-300 dark:decoration-neutral-600"
            >
              {t("visitWebsite")} <span aria-hidden="true">&rsaquo;</span>
            </a>
          </>
        )}
        <span className="text-neutral-400 dark:text-neutral-600">&middot;</span>
        <Link
          href={`/compare?brands=${brand.slug}`}
          className="flex items-center gap-1 text-neutral-500 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200"
        >
          <IconArrowsShuffle2 className="size-3" />
          <span>{t("compareBrand")}</span>
        </Link>
      </div>
    </section>
  )
}
