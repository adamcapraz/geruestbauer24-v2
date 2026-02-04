/**
 * Converts German text to URL-safe slug
 * - Converts umlauts: ä->ae, ö->oe, ü->ue, ß->ss
 * - Lowercase, hyphen-separated
 */
export function slugify(text: string): string {
  if (!text) return ""
  
  return text
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[àáâãåā]/g, "a")
    .replace(/[èéêëēė]/g, "e")
    .replace(/[ìíîïī]/g, "i")
    .replace(/[òóôõøō]/g, "o")
    .replace(/[ùúûū]/g, "u")
    .replace(/[ñń]/g, "n")
    .replace(/[çć]/g, "c")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .trim()
}

/**
 * Generates a unique slug for a firma
 */
export function generateFirmaSlug(firmaName: string): string {
  return slugify(firmaName)
}

/**
 * Generates a city slug
 */
export function generateStadtSlug(stadtName: string): string {
  return slugify(stadtName)
}

/**
 * Alias for slugify - creates a URL-safe slug
 */
export function createSlug(text: string): string {
  return slugify(text)
}

/**
 * Converts a slug back to readable text (best effort)
 * muenchen -> München (approximation)
 */
export function denormalizeSlug(slug: string): string {
  if (!slug) return ""
  
  return slug
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}
