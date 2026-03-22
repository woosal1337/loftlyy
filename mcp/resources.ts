import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js"
import { requireBrandBySlug } from "@/cli/core/query"
import { getData } from "./data.js"

export const registerResources = (server: McpServer) => {
  server.registerResource(
    "brand-profile",
    new ResourceTemplate("brand://{slug}", {
      list: async () => {
        const { brands } = await getData()

        return {
          resources: brands.map((brand) => ({
            description: `${brand.name} — ${brand.industry} · ${brand.colors.length} colors, ${brand.typography.length} fonts`,
            mimeType: "application/json" as const,
            name: brand.name,
            uri: `brand://${brand.slug}`,
          })),
        }
      },
    }),
    {
      description:
        "Complete brand identity profile including colors, typography, assets, philosophy, and guidelines",
      mimeType: "application/json",
      title: "Brand Profile",
    },
    async (uri, { slug }) => {
      const { brands } = await getData()
      const brand = requireBrandBySlug(brands, slug as string)

      return {
        contents: [
          {
            mimeType: "application/json" as const,
            text: JSON.stringify(brand, null, 2),
            uri: uri.href,
          },
        ],
      }
    }
  )
}
