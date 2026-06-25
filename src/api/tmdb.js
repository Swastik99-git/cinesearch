// ─────────────────────────────────────────────────────────────
//  TMDB API — central API layer
//  All fetch calls live here. Components NEVER call fetch directly.
//  Docs: https://developer.themoviedb.org/docs
// ─────────────────────────────────────────────────────────────

const API_KEY  = import.meta.env.VITE_TMDB_API_KEY
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL || 'https://api.themoviedb.org/3'

// ── Image URL helpers ────────────────────────────────────────
//  TMDB returns partial paths like "/abc123.jpg"
//  We prefix with their CDN base + a size bucket.
//
//  Poster sizes:  w92 | w154 | w185 | w342 | w500 | w780 | original
//  Backdrop sizes: w300 | w780 | w1280 | original
//  Profile sizes:  w45  | w185 | h632  | original

export const IMG = {
  poster:  (path, size = 'w342')  => path ? `https://image.tmdb.org/t/p/${size}${path}` : null,
  poster2x:(path)                 => path ? `https://image.tmdb.org/t/p/w500${path}`    : null,
  backdrop:(path, size = 'w1280') => path ? `https://image.tmdb.org/t/p/${size}${path}` : null,
  profile: (path, size = 'w185')  => path ? `https://image.tmdb.org/t/p/${size}${path}` : null,
}

// ── Placeholder fallbacks ────────────────────────────────────
export const FALLBACK_POSTER   = 'https://placehold.co/342x513/1a1a2e/6b7280?text=No+Poster'
export const FALLBACK_BACKDROP = 'https://placehold.co/1280x720/0f0f1a/6b7280?text=No+Backdrop'
export const FALLBACK_PROFILE  = 'https://placehold.co/185x278/1a1a2e/6b7280?text=No+Photo'

// ── Core fetch wrapper ───────────────────────────────────────
//  Every API function calls this. It:
//    1. Appends the API key automatically
//    2. Throws a structured error on non-2xx responses
//    3. Returns parsed JSON
//
async function tmdbFetch(endpoint, params = {}) {
  if (!API_KEY) {
    throw new Error('TMDB API key missing. Check your .env file.')
  }

  const url = new URL(`${BASE_URL}${endpoint}`)

  // Merge caller params + required auth key
  const allParams = { api_key: API_KEY, language: 'en-US', ...params }
  Object.entries(allParams).forEach(([k, v]) => url.searchParams.set(k, v))

  const res = await fetch(url.toString())

  if (!res.ok) {
    // Pull TMDB's own status message when available
    const body = await res.json().catch(() => ({}))
    throw new Error(body.status_message || `HTTP ${res.status}: ${res.statusText}`)
  }

  return res.json()
}

// ─────────────────────────────────────────────────────────────
//  PUBLIC API FUNCTIONS
// ─────────────────────────────────────────────────────────────

/**
 * Trending movies — refreshes daily (time_window: 'day' | 'week')
 */
export async function fetchTrending(time_window = 'week', page = 1) {
  return tmdbFetch(`/trending/movie/${time_window}`, { page })
}

/**
 * Search movies by query string
 */
export async function searchMovies(query, page = 1) {
  if (!query?.trim()) return { results: [], total_results: 0, total_pages: 0 }
  return tmdbFetch('/search/movie', { query: query.trim(), page, include_adult: false })
}

/**
 * Full movie details — overview, runtime, genres, etc.
 */
export async function fetchMovieDetails(id) {
  return tmdbFetch(`/movie/${id}`)
}

/**
 * Movie credits — cast & crew
 */
export async function fetchMovieCredits(id) {
  return tmdbFetch(`/movie/${id}/credits`)
}

/**
 * Movie videos — trailers, teasers
 */
export async function fetchMovieVideos(id) {
  return tmdbFetch(`/movie/${id}/videos`)
}

/**
 * Similar movies — used on details page sidebar
 */
export async function fetchSimilarMovies(id, page = 1) {
  return tmdbFetch(`/movie/${id}/similar`, { page })
}

/**
 * Fetch everything needed for the details page in one shot.
 * Uses Promise.allSettled so a failing credits call
 * doesn't crash the whole page.
 */
export async function fetchMovieDetailsAll(id) {
  const [details, credits, videos, similar] = await Promise.allSettled([
    fetchMovieDetails(id),
    fetchMovieCredits(id),
    fetchMovieVideos(id),
    fetchSimilarMovies(id),
  ])

  return {
    details: details.status === 'fulfilled' ? details.value : null,
    credits: credits.status === 'fulfilled' ? credits.value : null,
    videos:  videos.status  === 'fulfilled' ? videos.value  : null,
    similar: similar.status === 'fulfilled' ? similar.value : null,
  }
}

/**
 * Genre list — used to map genre_id → genre name
 */
export async function fetchGenres() {
  return tmdbFetch('/genre/movie/list')
}
