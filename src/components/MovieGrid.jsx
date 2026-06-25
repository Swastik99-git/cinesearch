// ─────────────────────────────────────────────────────────────
//  MovieGrid — responsive grid of MovieCards
//
//  Handles all three states internally so pages stay clean:
//    loading → renders SkeletonCard × skeletonCount
//    error   → renders ErrorMessage with optional retry
//    data    → renders MovieCard for each movie
//
//  Props:
//    movies        — array of TMDB movie objects
//    loading       — boolean
//    error         — string | null
//    onRetry       — optional refetch callback
//    skeletonCount — how many skeletons while loading (default: 20)
//    cardSize      — passed to MovieCard: 'sm' | 'md'
//    emptyMessage  — text shown when movies is empty array
// ─────────────────────────────────────────────────────────────

import MovieCard    from './MovieCard'
import SkeletonCard from './SkeletonCard'
import ErrorMessage from './ui/ErrorMessage'

export default function MovieGrid({
  movies        = [],
  loading       = false,
  error         = null,
  onRetry,
  skeletonCount = 20,
  cardSize      = 'md',
  emptyMessage  = 'No movies found.',
}) {
  // ── Error state ───────────────────────────────────────────
  if (error) {
    return (
      <ErrorMessage
        message={error}
        onRetry={onRetry}
      />
    )
  }

  // ── Loading state (initial — no data yet) ─────────────────
  if (loading && movies.length === 0) {
    return (
      <div className={gridClasses}>
        <SkeletonCard count={skeletonCount} />
      </div>
    )
  }

  // ── Empty state ───────────────────────────────────────────
  if (!loading && movies.length === 0) {
    return (
      <ErrorMessage
        icon="🔍"
        title="No results"
        message={emptyMessage}
      />
    )
  }

  // ── Data state ────────────────────────────────────────────
  return (
    <div className={gridClasses}>
      {movies.map(movie => (
        <MovieCard key={movie.id} movie={movie} size={cardSize} />
      ))}

      {/* Append skeleton cards at the bottom when loading next page */}
      {loading && <SkeletonCard count={4} />}
    </div>
  )
}

// Responsive grid: 2 cols on mobile → 3 on sm → 4 on md → 5 on xl
const gridClasses = `
  grid
  grid-cols-2
  sm:grid-cols-3
  md:grid-cols-4
  xl:grid-cols-5
  gap-4
  sm:gap-6
`
