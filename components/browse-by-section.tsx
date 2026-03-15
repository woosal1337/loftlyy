import { Link } from "@/i18n/navigation"
import { Badge } from "@/components/ui/badge"

export function BrowseBySection({
  title,
  links,
}: {
  title: string
  links: { href: string; label: string; count?: number }[]
}) {
  if (links.length === 0) return null

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
        {title}
      </h2>
      <div className="flex flex-wrap gap-2">
        {links.map((link) => (
          <Link key={link.href} href={link.href}>
            <Badge
              variant="secondary"
              className="cursor-pointer hover:bg-muted"
            >
              {link.label}
              {link.count !== undefined && (
                <span className="ml-1 text-muted-foreground">
                  ({link.count})
                </span>
              )}
            </Badge>
          </Link>
        ))}
      </div>
    </div>
  )
}
