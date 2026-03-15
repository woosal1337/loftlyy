export interface ColorFamily {
  slug: string
  hex: string
}

export const colorFamilies: ColorFamily[] = [
  { slug: "red", hex: "#E53E3E" },
  { slug: "orange", hex: "#ED8936" },
  { slug: "yellow", hex: "#ECC94B" },
  { slug: "green", hex: "#38A169" },
  { slug: "blue", hex: "#3B82F6" },
  { slug: "purple", hex: "#805AD5" },
  { slug: "pink", hex: "#ED64A6" },
  { slug: "neutral", hex: "#718096" },
]

export function getColorFamilyBySlug(slug: string) {
  return colorFamilies.find((c) => c.slug === slug)
}
