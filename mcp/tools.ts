import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { z } from "zod"
import {
  filterSidebarBrands,
  getBrandFacets,
  getBrandPalette,
  getSimilarBrandsForSlug,
  requireBrandBySlug,
  searchSidebarBrands,
  validateFilterInput,
} from "@/cli/core/query"
import { getData } from "./data.js"
import { toMcpError } from "./errors.js"

const TOOL_ANNOTATIONS = {
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: false,
  readOnlyHint: true,
} as const

export const registerTools = (server: McpServer) => {
  server.registerTool(
    "list-brands",
    {
      annotations: TOOL_ANNOTATIONS,
      description:
        "List all brands in the Loftlyy database with name, slug, industry, categories, tags, and color/typography summaries. Use this to discover available brands before querying specific ones.",
      inputSchema: {
        limit: z
          .number()
          .int()
          .positive()
          .optional()
          .describe("Maximum number of brands to return"),
      },
      title: "List Brands",
    },
    async ({ limit }) => {
      try {
        const { sidebarBrands } = await getData()
        const results = limit ? sidebarBrands.slice(0, limit) : sidebarBrands

        return {
          content: [{ type: "text", text: JSON.stringify(results, null, 2) }],
        }
      } catch (error) {
        return toMcpError(error)
      }
    }
  )

  server.registerTool(
    "get-brand",
    {
      annotations: TOOL_ANNOTATIONS,
      description:
        "Get the complete brand profile by slug — colors (hex codes and usage), typography (fonts, weights, roles), assets, description, industry, categories, tags, founding year, headquarters, and brand philosophy. Case-insensitive slug.",
      inputSchema: {
        slug: z
          .string()
          .min(1)
          .describe(
            "Brand slug (e.g. 'apple', 'stripe', 'airbnb'). Case-insensitive."
          ),
      },
      title: "Get Brand Details",
    },
    async ({ slug }) => {
      try {
        const { brands } = await getData()
        const brand = requireBrandBySlug(brands, slug)

        return {
          content: [{ type: "text", text: JSON.stringify(brand, null, 2) }],
        }
      } catch (error) {
        return toMcpError(error)
      }
    }
  )

  server.registerTool(
    "search-brands",
    {
      annotations: TOOL_ANNOTATIONS,
      description:
        "Search brands by text keywords or hex color codes. Searches across brand names, descriptions, industries, categories, tags, color names, font names, and hex values. Example queries: 'design tools', '#FF0000', 'ai innovation blue'.",
      inputSchema: {
        query: z
          .string()
          .min(1)
          .describe(
            "Search query. Can include text keywords and/or hex color codes (e.g. '#FF5733')."
          ),
      },
      title: "Search Brands",
    },
    async ({ query }) => {
      try {
        const { sidebarBrands } = await getData()
        const results = searchSidebarBrands(sidebarBrands, query)

        return {
          content: [{ type: "text", text: JSON.stringify(results, null, 2) }],
        }
      } catch (error) {
        return toMcpError(error)
      }
    }
  )

  server.registerTool(
    "filter-brands",
    {
      annotations: TOOL_ANNOTATIONS,
      description:
        "Filter brands by industry, tags, color families, and typography styles. Multiple values within a filter are OR-combined; across filters they are AND-combined. Use the 'brand-facets' tool first to discover valid filter values.",
      inputSchema: {
        colorFamilies: z
          .array(z.string())
          .optional()
          .describe(
            "Color family values (e.g. ['blue', 'green', 'neutral']). Valid families: red, orange, yellow, green, blue, purple, pink, neutral."
          ),
        industries: z
          .array(z.string())
          .optional()
          .describe("Industry filter values (e.g. ['technology', 'fintech'])"),
        query: z
          .string()
          .optional()
          .describe("Optional text/hex search query to combine with filters"),
        tags: z
          .array(z.string())
          .optional()
          .describe("Tag filter values (e.g. ['innovation', 'design'])"),
        typographyStyles: z
          .array(z.string())
          .optional()
          .describe(
            "Typography category values (e.g. ['sans-serif', 'serif'])"
          ),
      },
      title: "Filter Brands",
    },
    async ({ colorFamilies, industries, query, tags, typographyStyles }) => {
      try {
        const { sidebarBrands } = await getData()
        const facets = getBrandFacets(sidebarBrands)
        const input = {
          colorFamilies: colorFamilies ?? [],
          industries: industries ?? [],
          query: query ?? "",
          tags: tags ?? [],
          typographyStyles: typographyStyles ?? [],
        }

        validateFilterInput(input, facets)
        const results = filterSidebarBrands(sidebarBrands, input)

        return {
          content: [{ type: "text", text: JSON.stringify(results, null, 2) }],
        }
      } catch (error) {
        return toMcpError(error)
      }
    }
  )

  server.registerTool(
    "similar-brands",
    {
      annotations: TOOL_ANNOTATIONS,
      description:
        "Find brands similar to a given brand using a weighted scoring algorithm: shared categories ×3, shared tags ×2, shared color families ×2, same industry ×1, shared typography styles ×1. Returns brands ranked by similarity score.",
      inputSchema: {
        limit: z
          .number()
          .int()
          .positive()
          .optional()
          .default(5)
          .describe("Maximum number of similar brands to return (default: 5)"),
        slug: z
          .string()
          .min(1)
          .describe("Slug of the reference brand to find similar brands for"),
      },
      title: "Find Similar Brands",
    },
    async ({ limit, slug }) => {
      try {
        const { brands } = await getData()
        const results = getSimilarBrandsForSlug(brands, slug, limit)

        return {
          content: [{ type: "text", text: JSON.stringify(results, null, 2) }],
        }
      } catch (error) {
        return toMcpError(error)
      }
    }
  )

  server.registerTool(
    "brand-palette",
    {
      annotations: TOOL_ANNOTATIONS,
      description:
        "Get the color palette for a specific brand. Returns color names, hex codes, and usage descriptions. Useful for design inspiration or extracting exact color values.",
      inputSchema: {
        slug: z.string().min(1).describe("Brand slug (e.g. 'apple', 'stripe')"),
      },
      title: "Get Brand Color Palette",
    },
    async ({ slug }) => {
      try {
        const { brands } = await getData()
        const brand = requireBrandBySlug(brands, slug)
        const palette = getBrandPalette(brand)

        return {
          content: [{ type: "text", text: JSON.stringify(palette, null, 2) }],
        }
      } catch (error) {
        return toMcpError(error)
      }
    }
  )

  server.registerTool(
    "brand-facets",
    {
      annotations: TOOL_ANNOTATIONS,
      description:
        "Get all available filter facet values across all brands: industries, tags, color families, and typography styles. Use this to discover valid filter values before calling the 'filter-brands' tool.",
      inputSchema: {},
      title: "Get Available Filter Values",
    },
    async () => {
      try {
        const { sidebarBrands } = await getData()
        const facets = getBrandFacets(sidebarBrands)

        return {
          content: [{ type: "text", text: JSON.stringify(facets, null, 2) }],
        }
      } catch (error) {
        return toMcpError(error)
      }
    }
  )
}
