import Image from "next/image"
import { Link } from "@/i18n/navigation"
import { Badge } from "@/components/ui/badge"
import type { Brand } from "@/lib/types"

export function BrandListingCard({ brand }: { brand: Brand }) {
  return (
    <Link
      href={`/${brand.slug}`}
      className="group flex flex-col gap-3 rounded-lg border border-border p-4 transition-colors hover:bg-muted"
    >
      <div className="flex h-20 items-center justify-center rounded-md bg-background p-3">
        <Image
          src={brand.thumbnail.src}
          alt={brand.name}
          width={brand.thumbnail.width}
          height={brand.thumbnail.height}
          className="max-h-full object-contain"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <h2 className="font-semibold">{brand.name}</h2>
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {brand.description}
        </p>
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="secondary">{brand.industry}</Badge>
        </div>
      </div>
    </Link>
  )
}
