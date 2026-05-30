export const siteConfig = {
  name: "WarungGemini",
  tagline: "AI Co-Founder untuk Warung & UMKM Indonesia",
  subTagline: "Dari chat jadi untung",
  description:
    "Catat jualan dan kelola stok warung dengan bantuan Mas Gemini.",
} as const;

export const chatExamples = [
  "jual 3 indomie 45 ribu",
  "jual kopi 5 gelas 25rb",
  "jual 2 indomie goreng 24 ribu",
] as const;

export const warungTypes = [
  { value: "kelontong", label: "Warung Kelontong", emoji: "🏪" },
  { value: "warteg", label: "Warteg", emoji: "🍛" },
  { value: "kios", label: "Kios", emoji: "🛒" },
] as const;

export type WarungType = (typeof warungTypes)[number]["value"];
