export function normalizeProductName(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, " ");
}
