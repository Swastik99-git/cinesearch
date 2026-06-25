// ─────────────────────────────────────────────────────────────
//  SearchResults — /search?q=…
//
//  Layout:
//    ┌──────────────────────────────────┐
//    │  Breadcrumb  ← back to home      │
//    │  Page heading  "Results for X"   │
//    │  SearchFilters (count + sort)     │
//    │  MovieGrid (cards / skeletons)   │
//    │  Load More button                │
//    │  Empty state (no results)        │
//    └──────────────────────────────────┘
//
//  Data flow:
//    URL ?q=batman
//      → useSearch(rawQuery) debounces → fetches → {results, …}
//      → applySortOrder(results, sortBy) → sorted array
//      → <MovieGrid movies={sorted} />
//
//  Key behaviours:
//    - Typing updates the URL (Navbar search form)
//      and this page reacts to the URL change
//    - Sort is client-side only (no extra fetch)
//    - "Load More" appends next page via useSearch.loadMore()
//    - Empty query → friendly prompt to start searching
// ─────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react'
import { usePageTitle } from '../hooks/usePageTitle'
import { Link, useSearchParams } from 'react-router-dom'
import { useSearch }    from '../hooks/useSearch'
import MovieGrid        from '../components/MovieGrid'
import SearchFilters, { applySortOrder } from '../components/SearchFilters'
import SearchBar        from '../components/SearchBar'
import Spinner          from '../components/ui/Spinner'

// ── Chevron icon ──────────────────────────────────────────────
function ChevronLeft() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
      fill="none" stroke="currentColor" strokeWidth={2}
      strokeLinecap="round" strokeLinejoin="round"
      className="w-4 h-4" aria-hidden="true"
    >
      <path d="M13 16l-6-6 6-6" />
    </svg>
  )
}

export default function SearchResults() {
  const [searchParams]           = useSearchParams()
  const rawQuery                 = searchParams.get('q') || ''
  const [sortBy, setSortBy]      = useState('relevance')

  usePageTitle(rawQuery ? `""` : '', 'Results')
  // Reset sort whenever the query changes
  useEffect(() => { setSortBy('relevance') }, [rawQuery])

  const {
    query,        // debounced/settled query
    results,
    loading,
    error,
    totalResults,
    hasMore,
    loadMore,
  } = useSearch(rawQuery)

  // Apply client-side sort on top of the fetched results
  const sorted = applySortOrder(results, sortBy)

  // ── No query entered yet ──────────────────────────────────
  if (!rawQuery.trim()) {
    return (
      <div className="section-container py-16">
        <EmptyPrompt />
      </div>
    )
  }

  return (
    <div className="section-container py-8 animate-fade-in">

      {/* ── Breadcrumb ───────────────────────────────────── */}
      <nav aria-label="Breadcrumb" className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-cinema-muted text-sm
                     hover:text-cinema-gold transition-colors duration-200
                     focus-visible:outline-none focus-visible:ring-2
                     focus-visible:ring-cinema-gold rounded"
        >
          <ChevronLeft />
          Back to Home
        </Link>
      </nav>

      {/* ── Page heading ─────────────────────────────────── */}
      <div className="mb-8">
        <p className="text-cinema-gold text-sm font-semibold
                      tracking-widest uppercase mb-1">
          Search
        </p>
        <h1 className="font-display text-4xl sm:text-5xl text-cinema-text
                       tracking-wide">
          {query
            ? <>RESULTS FOR <span className="text-cinema-gold">"{query.toUpperCase()}"</span></>
            : 'SEARCHING…'
          }
        </h1>
      </div>

      {/* ── Inline search bar — refine without scrolling up ─ */}
      <div className="mb-8 max-w-xl">
        <div className="relative flex items-center group">
          <svg
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth={2}
            strokeLinecap="round" strokeLinejoin="round"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4
                       text-cinema-muted group-focus-within:text-cinema-gold
                       transition-colors pointer-events-none"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <SearchBar initialValue={rawQuery} />
        </div>
      </div>

      {/* ── Filters bar ──────────────────────────────────── */}
      {(results.length > 0 || loading) && (
        <SearchFilters
          totalResults={totalResults}
          query={query}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />
      )}

      {/* ── Results grid ─────────────────────────────────── */}
      <MovieGrid
        movies={sorted}
        loading={loading}
        error={error}
        skeletonCount={20}
        emptyMessage={
          query
            ? `No movies found for "${query}". Try a different title.`
            : 'Enter a movie title to search.'
        }
      />

      {/* ── Load More ────────────────────────────────────── */}
      {hasMore && !error && (
        <div className="flex justify-center mt-10">
          <button
            onClick={loadMore}
            disabled={loading}
            className="
              btn-ghost flex items-center gap-3
              min-w-[160px] justify-center
            "
          >
            {loading ? (
              <>
                <Spinner size="sm" />
                Loading…
              </>
            ) : (
              'Load More'
            )}
          </button>
        </div>
      )}

      {/* ── End of results notice ─────────────────────────── */}
      {!hasMore && results.length > 0 && !loading && (
        <p className="text-center text-cinema-muted text-sm mt-10">
          Showing all {totalResults.toLocaleString()} results
        </p>
      )}
    </div>
  )
}

// ── Empty prompt — shown when ?q= is blank ────────────────────
function EmptyPrompt() {
  return (
    <div className="flex flex-col items-center gap-8 py-12 animate-fade-in">
      {/* Icon */}
      <div className="w-24 h-24 rounded-full bg-cinema-slate
                      border border-cinema-border
                      flex items-center justify-center text-4xl">
        🎬
      </div>

      {/* Copy */}
      <div className="text-center">
        <h1 className="font-display text-5xl text-cinema-text tracking-wide mb-3">
          FIND YOUR FILM
        </h1>
        <p className="text-cinema-muted max-w-md leading-relaxed">
          Search millions of movies. Type a title, actor, or franchise to get started.
        </p>
      </div>

      {/* Big search bar */}
      <div className="w-full max-w-xl">
        <SearchBar autoFocus placeholder="What do you want to watch?" />
      </div>

      {/* Quick suggestions */}
      <div className="flex flex-wrap justify-center gap-2">
        {['Inception', 'The Godfather', 'Interstellar', 'Dune', 'Parasite', 'Oppenheimer'].map(title => (
          <Link
            key={title}
            to={`/search?q=${encodeURIComponent(title)}`}
            className="px-4 py-1.5 rounded-full text-sm
                       bg-cinema-slate border border-cinema-border
                       text-cinema-muted hover:text-cinema-gold
                       hover:border-cinema-gold transition-all duration-200"
          >
            {title}
          </Link>
        ))}
      </div>
    </div>
  )
}
