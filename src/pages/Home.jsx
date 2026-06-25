// ─────────────────────────────────────────────────────────────
//  Home — landing page
//
//  Sections:
//    1. HeroSection  — full-bleed backdrop, search bar, feature film
//    2. Trending     — 2-tab toggle (This Week / Today) + MovieGrid
//
//  Data flow:
//    useFetch(fetchTrending) → { data, loading, error }
//      ↓
//    HeroSection  receives movies (for backdrop rotation)
//    MovieGrid    receives movies (for the grid)
//
//  The tab state is local — switching tab triggers a new fetch.
// ─────────────────────────────────────────────────────────────

import { useState } from 'react'
import { usePageTitle } from '../hooks/usePageTitle'
import { fetchTrending } from '../api/tmdb'
import { useFetch }      from '../hooks/useFetch'
import HeroSection       from '../components/HeroSection'
import MovieGrid         from '../components/MovieGrid'

// ── Tab definition ────────────────────────────────────────────
const TABS = [
  { label: 'This Week', value: 'week' },
  { label: 'Today',     value: 'day'  },
]

export default function Home() {
  usePageTitle()
  const [timeWindow, setTimeWindow] = useState('week')

  // Re-fetches automatically when timeWindow changes
  // because it's in the deps array
  const { data, loading, error, refetch } = useFetch(
    () => fetchTrending(timeWindow),
    [timeWindow]
  )

  const movies = data?.results ?? []

  return (
    <>
      {/* ── 1. Hero ──────────────────────────────────────── */}
      <HeroSection movies={movies} />

      {/* ── 2. Trending section ──────────────────────────── */}
      <section
        className="section-container py-12"
        aria-labelledby="trending-heading"
      >
        {/* Section header + tab switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center
                        justify-between gap-4 mb-8">

          {/* Heading */}
          <div>
            <p className="text-cinema-gold text-sm font-semibold
                          tracking-widest uppercase mb-1">
              What's Hot
            </p>
            <h2
              id="trending-heading"
              className="font-display text-4xl text-cinema-text tracking-wide"
            >
              TRENDING MOVIES
            </h2>
          </div>

          {/* Week / Day tab toggle */}
          <div
            role="tablist"
            aria-label="Trending time window"
            className="flex items-center bg-cinema-slate
                       border border-cinema-border rounded-full p-1 self-start sm:self-auto"
          >
            {TABS.map(tab => (
              <button
                key={tab.value}
                role="tab"
                aria-selected={timeWindow === tab.value}
                onClick={() => setTimeWindow(tab.value)}
                className={`
                  px-5 py-2 rounded-full text-sm font-medium
                  transition-all duration-200
                  focus-visible:outline-none focus-visible:ring-2
                  focus-visible:ring-cinema-gold
                  ${timeWindow === tab.value
                    ? 'bg-cinema-gold text-cinema-black shadow-sm'
                    : 'text-cinema-muted hover:text-cinema-text'
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Movie grid — handles loading / error / data internally */}
        <MovieGrid
          movies={movies}
          loading={loading}
          error={error}
          onRetry={refetch}
          skeletonCount={20}
          emptyMessage="No trending movies right now. Check back soon."
        />
      </section>
    </>
  )
}
