import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { z } from "zod"
import type { Brand } from "@/cli/core/contracts"
import { filterBrands, getSimilarBrands } from "@/cli/core/filters"
import { findBrandBySlug, getBrandFacets } from "@/cli/core/query"
import { getData } from "./data.js"

const formatBrandColors = (brand: Brand): string =>
  brand.colors
    .map((c) => `  - ${c.name}: ${c.hex}${c.usage ? ` — ${c.usage}` : ""}`)
    .join("\n")

const formatBrandTypography = (brand: Brand): string =>
  brand.typography
    .map(
      (t) =>
        `  - ${t.name} (${t.role})${t.category ? ` [${t.category}]` : ""}${t.weights ? ` weights: ${t.weights.join(", ")}` : ""}`
    )
    .join("\n")

const formatReferenceBrand = (brand: Brand, index: number): string => {
  const lines = [`### ${index + 1}. ${brand.name} (${brand.industry})`]

  if (brand.description) {
    lines.push(`**Description**: ${brand.description}`)
  }

  lines.push("")
  lines.push(`**Color Palette**:\n${formatBrandColors(brand)}`)
  lines.push("")
  lines.push(`**Typography**:\n${formatBrandTypography(brand)}`)
  lines.push("")
  lines.push(`**Categories**: ${brand.categories.join(", ")}`)

  if (brand.tags && brand.tags.length > 0) {
    lines.push(`**Tags**: ${brand.tags.join(", ")}`)
  }

  if (brand.founded) {
    lines.push(`**Founded**: ${brand.founded}`)
  }

  return lines.join("\n")
}

const resolveBrands = async (slugs: string[]): Promise<Brand[]> => {
  const { brands } = await getData()
  const resolved: Brand[] = []

  for (const slug of slugs) {
    const brand = findBrandBySlug(brands, slug)
    if (brand) {
      resolved.push(brand)
    }
  }

  return resolved
}

export const registerPrompts = (server: McpServer) => {
  server.registerPrompt(
    "generate-branding-guide",
    {
      argsSchema: {
        companyDescription: z
          .string()
          .describe("What your company does — product, service, or mission"),
        companyIndustry: z
          .string()
          .describe(
            "Your company's industry (e.g. 'fintech', 'saas', 'e-commerce', 'healthcare')"
          ),
        companyName: z.string().describe("Name of your company"),
        companyValues: z
          .string()
          .describe(
            "Core values or brand attributes (e.g. 'innovation, trust, simplicity, speed')"
          ),
        referenceBrandSlugs: z
          .string()
          .describe(
            "Comma-separated slugs of 1-5 reference brands for inspiration (e.g. 'stripe,linear,vercel'). Use 'list-brands' or 'search-brands' to find slugs."
          ),
        targetAudience: z
          .string()
          .describe(
            "Target audience description (e.g. 'developers and engineering teams at startups')"
          ),
        tone: z
          .string()
          .optional()
          .describe(
            "Desired brand tone (e.g. 'professional', 'playful', 'bold', 'minimal', 'premium')"
          ),
      },
      description:
        "Generate a comprehensive branding guide for your company inspired by reference brands from the Loftlyy database. Provide your company details and select reference brands to create a complete brand identity system with colors, typography, logo direction, and brand voice.",
      title: "Generate Branding Guide",
    },
    async ({
      companyDescription,
      companyIndustry,
      companyName,
      companyValues,
      referenceBrandSlugs,
      targetAudience,
      tone,
    }) => {
      const slugs = referenceBrandSlugs
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
      const referenceBrands = await resolveBrands(slugs)

      const unresolvedSlugs = slugs.filter(
        (slug) =>
          !referenceBrands.some(
            (b) => b.slug === slug || b.slug === slug.toLowerCase()
          )
      )

      let unresolvedNote = ""
      if (unresolvedSlugs.length > 0) {
        unresolvedNote = `\n\n> Note: The following slugs could not be found: ${unresolvedSlugs.join(", ")}. Proceeding with the ${referenceBrands.length} resolved reference brand(s).\n`
      }

      const referenceBrandBlocks = referenceBrands
        .map((brand, i) => formatReferenceBrand(brand, i))
        .join("\n\n")

      const prompt = `You are a senior brand identity designer with expertise in visual systems, color theory, typography, and brand strategy. Create a comprehensive, production-ready branding guide for a new company.
${unresolvedNote}
## Company Profile

- **Name**: ${companyName}
- **Industry**: ${companyIndustry}
- **What they do**: ${companyDescription}
- **Core Values**: ${companyValues}
- **Target Audience**: ${targetAudience}${tone ? `\n- **Desired Tone**: ${tone}` : ""}

## Reference Brands for Inspiration

The following established brands have been selected as design inspiration. Analyze their branding choices — color palettes, typography systems, and positioning — and draw from their strengths while creating something unique.

${referenceBrandBlocks}

---

## Deliverables

Generate a complete branding guide with all of the following sections:

### 1. Brand Story & Positioning
Write a brand narrative (2-3 paragraphs) that captures ${companyName}'s essence. Define the brand's positioning statement and how it differentiates in the ${companyIndustry} space. Draw inspiration from how the reference brands position themselves.

### 2. Color Palette
Design a palette of 4-6 colors. For each color provide:
- **Color name** (creative, brand-specific name)
- **Hex code**
- **Usage guideline** (where and when to use it)

Include: 1 primary brand color, 1-2 secondary colors, 1 accent color, and 1-2 neutrals. Explain the rationale behind the palette choices and how they relate to the reference brands' color strategies.

### 3. Typography System
Recommend a complete type system with:
- **Primary typeface** (for headings/display) — name, suggested weights, why it works
- **Secondary typeface** (for body/UI) — name, suggested weights, why it works
- **Monospace typeface** (if relevant) — for code or data display

Explain the pairing rationale and how the type choices reflect the brand's personality. Reference the typography patterns from the inspiration brands.

### 4. Logo Direction
Describe the recommended logo approach:
- **Type**: wordmark, symbol/icon, combination mark, or lettermark
- **Style direction**: geometric, organic, minimal, bold, etc.
- **Key characteristics**: what makes it distinctive
- **Color usage**: which palette colors the logo should use

Do not create the logo — describe the creative direction for a designer to execute.

### 5. Brand Voice & Tone
Define the communication style:
- **Voice attributes** (3-4 adjectives that define how the brand speaks)
- **Tone spectrum** (when to be more formal vs casual)
- **Writing principles** (dos and don'ts for copy)
- **Example phrases** (tagline candidates, CTA examples)

### 6. Visual Identity Principles
- **Spacing & layout** guidelines
- **Imagery style** (photography direction, illustration style)
- **Iconography** approach (line, filled, duotone, etc.)
- **Motion & animation** principles (if applicable)

### 7. Brand Guidelines — Do's and Don'ts
Provide 5-7 clear do's and 5-7 don'ts for maintaining brand consistency. Cover logo usage, color application, typography, imagery, and messaging.`

      return {
        messages: [
          {
            content: { text: prompt, type: "text" as const },
            role: "user" as const,
          },
        ],
      }
    }
  )

  server.registerPrompt(
    "compare-brands",
    {
      argsSchema: {
        aspects: z
          .string()
          .optional()
          .describe(
            "Comma-separated aspects to compare: 'colors', 'typography', 'positioning', 'overall' (default: all)"
          ),
        slugs: z
          .string()
          .describe(
            "Comma-separated slugs of 2-5 brands to compare (e.g. 'apple,google,microsoft')"
          ),
      },
      description:
        "Compare the branding strategies of 2-5 brands side by side. Analyzes color palettes, typography choices, visual positioning, and overall brand personality.",
      title: "Compare Brand Identities",
    },
    async ({ aspects, slugs }) => {
      const slugList = slugs
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
      const brands = await resolveBrands(slugList)

      const aspectList = aspects
        ? aspects
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : ["colors", "typography", "positioning", "overall"]

      const brandBlocks = brands
        .map((brand, i) => formatReferenceBrand(brand, i))
        .join("\n\n")

      const aspectInstructions = aspectList
        .map((aspect) => {
          switch (aspect) {
            case "colors":
              return "- **Color Palettes**: Compare color choices, color families, contrast strategies, and emotional associations"
            case "typography":
              return "- **Typography**: Compare font selections, type hierarchies, weight usage, and readability approaches"
            case "positioning":
              return "- **Brand Positioning**: Compare market positioning, target audiences, brand personality, and messaging tone"
            case "overall":
              return "- **Overall Assessment**: Summarize key differentiators, shared patterns, and what makes each brand's identity effective"
            default:
              return `- **${aspect}**: Analyze this aspect across all brands`
          }
        })
        .join("\n")

      const prompt = `You are a brand identity analyst. Perform a detailed side-by-side comparison of the following ${brands.length} brands.

## Brands to Compare

${brandBlocks}

---

## Comparison Focus Areas

${aspectInstructions}

For each focus area, create a structured comparison that highlights:
1. **Similarities** — shared patterns or approaches
2. **Differences** — where the brands diverge
3. **Strengths** — what each brand does particularly well
4. **Takeaways** — actionable insights for someone building a new brand

Present the comparison in a clear, scannable format with tables or structured lists where appropriate.`

      return {
        messages: [
          {
            content: { text: prompt, type: "text" as const },
            role: "user" as const,
          },
        ],
      }
    }
  )

  server.registerPrompt(
    "suggest-color-palette",
    {
      argsSchema: {
        colorFamilies: z
          .string()
          .optional()
          .describe(
            "Comma-separated preferred color families (e.g. 'blue,neutral'). Valid: red, orange, yellow, green, blue, purple, pink, neutral."
          ),
        industry: z
          .string()
          .optional()
          .describe("Target industry for contextual recommendations"),
        referenceBrandSlug: z
          .string()
          .optional()
          .describe("A reference brand slug to base suggestions on"),
      },
      description:
        "Get color palette suggestions based on existing brand palettes in the Loftlyy database. Filter by color family or reference brand to get curated, data-driven palette recommendations.",
      title: "Suggest Color Palette",
    },
    async ({ colorFamilies, industry, referenceBrandSlug }) => {
      const { brands, sidebarBrands } = await getData()

      let relevantBrands: Brand[] = []
      const contextParts: string[] = []

      if (referenceBrandSlug) {
        const reference = findBrandBySlug(brands, referenceBrandSlug)
        if (reference) {
          relevantBrands = [
            reference,
            ...getSimilarBrands(reference, brands, 5),
          ]
          contextParts.push(
            `Based on ${reference.name} and its ${relevantBrands.length - 1} most similar brands`
          )
        }
      }

      if (colorFamilies) {
        const families = colorFamilies
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)

        if (families.length > 0) {
          const facets = getBrandFacets(sidebarBrands)
          const filtered = filterBrands(sidebarBrands, {
            colorFamilies: families.filter((f) =>
              facets.colorFamilies.includes(f)
            ),
            industries: [],
            query: "",
            tags: [],
            typographyStyles: [],
          })

          const filteredFullBrands = filtered
            .map((sb) => findBrandBySlug(brands, sb.slug))
            .filter((b): b is Brand => b !== undefined)

          relevantBrands = [
            ...relevantBrands,
            ...filteredFullBrands.filter(
              (b) => !relevantBrands.some((r) => r.slug === b.slug)
            ),
          ]
          contextParts.push(
            `Filtered by color families: ${families.join(", ")}`
          )
        }
      }

      if (industry) {
        const industryBrands = brands.filter((b) => b.industry === industry)
        relevantBrands = [
          ...relevantBrands,
          ...industryBrands.filter(
            (b) => !relevantBrands.some((r) => r.slug === b.slug)
          ),
        ]
        contextParts.push(`Industry context: ${industry}`)
      }

      if (relevantBrands.length === 0) {
        relevantBrands = brands.slice(0, 15)
        contextParts.push("Using top brands from the database")
      }

      const displayBrands = relevantBrands.slice(0, 15)

      const paletteBlocks = displayBrands
        .map(
          (brand) =>
            `**${brand.name}** (${brand.industry}):\n${brand.colors.map((c) => `  - ${c.name}: ${c.hex}${c.usage ? ` — ${c.usage}` : ""}`).join("\n")}`
        )
        .join("\n\n")

      const prompt = `You are a color theory expert and brand designer. Based on the following real-world brand color palettes, suggest 3 unique color palette options.

## Context
${contextParts.join(" | ")}

## Reference Palettes from Existing Brands

${paletteBlocks}

---

## Task

Create **3 distinct color palette suggestions**, each with 4-6 colors. For each palette:

1. **Palette Name** — a descriptive theme name
2. **Colors** — for each color provide:
   - Creative color name
   - Hex code
   - Role (primary, secondary, accent, neutral, etc.)
   - Usage guideline
3. **Inspiration** — which reference brand palettes influenced this suggestion and how
4. **Best For** — what type of brand/product this palette works best for
5. **Accessibility Note** — key contrast considerations

Make each palette distinct in mood: one bold/vibrant, one refined/muted, one balanced/versatile. Ground your suggestions in the real color data provided, not generic theory.`

      return {
        messages: [
          {
            content: { text: prompt, type: "text" as const },
            role: "user" as const,
          },
        ],
      }
    }
  )
}
