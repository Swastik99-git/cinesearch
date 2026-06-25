// ─────────────────────────────────────────────────────────────
//  SearchFilters — sort bar + result count
//
//  Sits above the MovieGrid on the Search Results page.
//
//  Props:
//    totalResults — number  (from TMDB, e.g. 1234)
//    query        — string  (the settled debounced query)
//    sortBy       — string  (current sort key)
//    onSortChange — (key: string) => void
// ─────────────────────────────────────────────────────────────

import { formatNumber } from '../utils/helpers'

export const SORT_OPTIONS = [
  { label: 'Relevance',   value: 'relevance' },
  { label: 'Rating ↓',   value: 'rating_desc' },
  { label: 'Rating ↑',   value: 'rating_asc'  },
  { label: 'Newest',     value: 'date_desc'   },
  { label: 'Oldest',     value: 'date_asc'    },
]

// Client-side sort — TMDB search always returns by relevance,
// so we re-sort the results array ourselves.
export function applySortOrder(movies, sortBy) {
  if (!movies?.length) return []
  const arr = [...movies]
  switch (sortBy) {
    case 'rating_desc': return arr.sort((a, b) => b.vote_average - a.vote_average)
    case 'rating_asc':  return arr.sort((a, b) => a.vote_average - b.vote_average)
    case 'date_desc':   return arr.sort((a, b) => new Date(b.release_date) - new Date(a.release_date))
    case 'date_asc':    return arr.sort((a, b) => new Date(a.release_date) - new Date(b.release_date))
    default:            return arr // relevance — TMDB's original order
  }
}

export default function SearchFilters({
  totalResults = 0,
  query        = '',
  sortBy       = 'relevance',
  onSortChange,
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center
                    justify-between gap-3 mb-6">

      {/* ── Result count ─────────────────────────────────── */}
      <div>
        {query && totalResults > 0 && (
          <p className="text-cinema-muted text-sm animate-fade-in">
            <span className="text-cinema-text font-semibold">
              {formatNumber(totalResults)}
            </span>{' '}
            {totalResults === 1 ? 'result' : 'results'} for{' '}
            <span className="text-cinema-gold font-semibold">
              "{query}"
            </span>
          </p>
        )}
      </div>

      {/* ── Sort dropdown ─────────────────────────────────── */}
      <div className="flex items-center gap-2 text-sm shrink-0">
        <label htmlFor="sort-select" className="text-cinema-muted">
          Sort by
        </label>
        <select
          id="sort-select"
          value={sortBy}
          onChange={e => onSortChange(e.target.value)}
          className="
            bg-cinema-slate border border-cinema-border
            text-cinema-text text-sm rounded-lg px-3 py-1.5
            focus:outline-none focus:border-cinema-gold
            focus:ring-1 focus:ring-cinema-gold
            cursor-pointer transition-colors duration-200
          "
        >
          {SORT_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
