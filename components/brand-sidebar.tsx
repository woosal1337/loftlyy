import { Suspense } from "react"
import Image from "next/image"
import { IconHeart } from "@tabler/icons-react"
import { Link } from "@/i18n/navigation"
import { getAllBrands } from "@/data/brands"
import { LocaleSwitcher } from "./locale-switcher"
import { BrandSidebarSearch } from "./brand-sidebar-search"

export function BrandSidebar() {
  const brands = getAllBrands()

  return (
    <aside
      className="hidden h-full w-[272px] shrink-0 flex-col gap-4 bg-white p-4 lg:flex dark:bg-neutral-950"
      id="brand-sidebar"
    >
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src="/logo.webp"
              alt="Loftlyy"
              width={28}
              height={28}
              className="rounded-lg"
            />
            <div className="flex flex-col">
              <span className="text-[15px] font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
                Loftlyy
              </span>
              <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400">
                by Hanoa Studio
              </span>
            </div>
          </Link>
          <LocaleSwitcher />
        </div>
      </div>
      <Suspense>
        <BrandSidebarSearch brands={brands} />
      </Suspense>
      <a
        href="https://github.com/sponsors/preetsuthar17"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 rounded-lg border border-neutral-200 px-3 py-2 text-[13px] font-medium text-neutral-600 transition-colors hover:bg-neutral-50 hover:text-neutral-900 dark:border-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-800/50 dark:hover:text-neutral-200"
      >
        <IconHeart size={15} />
        Support us
      </a>
    </aside>
  )
}
