import { BrandSidebar } from "@/components/brand-sidebar"
import { MobileSidebarToggle } from "@/components/mobile-sidebar-toggle"
import { getAllSidebarBrands, getColorExplorerEntries } from "@/data/brands"

export default function BrandsLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const sidebarBrands = getAllSidebarBrands()
  const colorExplorerCount = getColorExplorerEntries().length

  return (
    <div className="flex h-dvh bg-white dark:bg-neutral-950">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:shadow-lg dark:focus:bg-neutral-900"
      >
        Skip to content
      </a>
      <BrandSidebar />
      <div className="flex flex-1 flex-col overflow-hidden border-l border-neutral-200 dark:border-neutral-800/50">
        <header className="flex shrink-0 items-center p-2 lg:hidden">
          <MobileSidebarToggle
            brands={sidebarBrands}
            colorExplorerCount={colorExplorerCount}
          />
        </header>
        <main id="main-content" className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
