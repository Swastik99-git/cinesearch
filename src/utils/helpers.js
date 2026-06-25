// ─────────────────────────────────────────────────────────────
//  helpers.js — pure utility functions
//  No React, no API calls. Safe to unit-test independently.
// ─────────────────────────────────────────────────────────────

/**
 * "2024-07-15"  →  "Jul 15, 2024"
 * Handles null / undefined gracefully.
 */
export function formatDate(dateStr) {
  if (!dateStr) return 'Release date unknown'
  const d = new Date(dateStr)
  if (isNaN(d)) return 'Release date unknown'
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

/**
 * "2024-07-15"  →  2024  (just the year)
 */
export function formatYear(dateStr) {
  if (!dateStr) return 'N/A'
  const year = new Date(dateStr).getFullYear()
  return isNaN(year) ? 'N/A' : String(year)
}

/**
 * 142  →  "2h 22m"
 * 45   →  "45m"
 * 0 / null → "Runtime unknown"
 */
export function formatRuntime(minutes) {
  if (!minutes || minutes <= 0) return 'Runtime unknown'
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m}m`
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}

/**
 * 7.842  →  "7.8"
 * 0 / null → "N/A"
 */
export function formatRating(vote) {
  if (!vote || vote === 0) return 'N/A'
  return Number(vote).toFixed(1)
}

/**
 * 1234567  →  "1,234,567"
 * Used for vote counts and budgets.
 */
export function formatNumber(n) {
  if (!n || n === 0) return 'N/A'
  return Number(n).toLocaleString('en-US')
}

/**
 * 150000000  →  "$150M"   (budget / revenue shorthand)
 * 2500000    →  "$2.5M"
 * 500000     →  "$500K"
 */
export function formatMoney(n) {
  if (!n || n === 0) return 'N/A'
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(0)}M`
  if (n >= 1_000)     return `$${(n / 1_000).toFixed(0)}K`
  return `$${n}`
}

/**
 * Clamp a rating 0–10 to a percentage 0–100 for progress bars.
 * 7.5  →  75
 */
export function ratingToPercent(vote) {
  if (!vote) return 0
  return Math.round((vote / 10) * 100)
}

/**
 * Return a Tailwind text-color class based on rating value.
 * ≥ 7   → green (good)
 * ≥ 5   → yellow (average)
 * < 5   → red (poor)
 */
export function ratingColor(vote) {
  if (!vote || vote === 0) return 'text-cinema-muted'
  if (vote >= 7)  return 'text-green-400'
  if (vote >= 5)  return 'text-cinema-gold'
  return 'text-red-400'
}

/**
 * Truncate a string to maxLen characters, appending "…"
 */
export function truncate(str, maxLen = 150) {
  if (!str) return ''
  return str.length <= maxLen ? str : str.slice(0, maxLen).trimEnd() + '…'
}

/**
 * Extract the YouTube trailer key from a TMDB videos response.
 * Prefers "Trailer" type, falls back to "Teaser", then first result.
 */
export function getTrailerKey(videosData) {
  if (!videosData?.results?.length) return null
  const results = videosData.results.filter(v => v.site === 'YouTube')
  return (
    results.find(v => v.type === 'Trailer')?.key ||
    results.find(v => v.type === 'Teaser')?.key  ||
    results[0]?.key ||
    null
  )
}

/**
 * Pick the top N cast members from a credits response.
 */
export function getTopCast(creditsData, n = 10) {
  if (!creditsData?.cast) return []
  return creditsData.cast.slice(0, n)
}
