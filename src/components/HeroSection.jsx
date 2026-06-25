// ─────────────────────────────────────────────────────────────
//  HeroSection — cinematic full-bleed hero
//
//  Design decisions:
//    - Uses real TMDB backdrop images (top trending movies)
//    - Rotates through 5 backdrops every 6 seconds
//    - Film-grain SVG overlay for texture
//    - Multi-layer gradient: darkens edges, keeps centre readable
//    - Bebas Neue display type for the headline
//    - SearchBar is the primary CTA, centered
//
//  Props:
//    movies — array of trending movie objects (from TMDB)
//             Used to pick backdrop images + featured title
// ─────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { IMG, FALLBACK_BACKDROP } from '../api/tmdb'
import SearchBar from './SearchBar'

// How many trending movies to rotate through
const FEATURE_COUNT    = 5
const ROTATION_INTERVAL = 6000 // ms

export default function HeroSection({ movies = [] }) {
  const [activeIdx, setActiveIdx] = useState(0)

  // Pick the top N movies with a backdrop available
  const featured = movies
    .filter(m => m.backdrop_path)
    .slice(0, FEATURE_COUNT)

  const activeMovie = featured[activeIdx] ?? null

  // Auto-rotate every 6s
  useEffect(() => {
    if (featured.length <= 1) return
    const timer = setInterval(() => {
      setActiveIdx(i => (i + 1) % featured.length)
    }, ROTATION_INTERVAL)
    return () => clearInterval(timer)
  }, [featured.length])

  return (
    <section
      className="relative w-full min-h-[85vh] flex items-center overflow-hidden"
      aria-label="Featured movies"
    >
      {/* ── Backdrop images (crossfade between them) ─────── */}
      <div className="absolute inset-0" aria-hidden="true">
        {featured.map((movie, idx) => (
          <div
            key={movie.id}
            className="absolute inset-0 transition-opacity duration-1000"
            style={{ opacity: idx === activeIdx ? 1 : 0 }}
          >
            <img
              src={IMG.backdrop(movie.backdrop_path) || FALLBACK_BACKDROP}
              alt=""
              className="w-full h-full object-cover object-center"
              loading={idx === 0 ? 'eager' : 'lazy'}
            />
          </div>
        ))}

        {/* Fallback solid colour if no movies yet */}
        {featured.length === 0 && (
          <div className="absolute inset-0 bg-cinema-navy" />
        )}
      </div>

      {/* ── Gradient overlays ────────────────────────────── */}
      {/* Bottom-up dark gradient — makes text readable */}
      <div
        className="absolute inset-0 bg-gradient-to-t
                   from-cinema-black via-cinema-black/60 to-cinema-black/20"
        aria-hidden="true"
      />
      {/* Side vignettes */}
      <div
        className="absolute inset-0 bg-gradient-to-r
                   from-cinema-black/70 via-transparent to-cinema-black/40"
        aria-hidden="true"
      />

      {/* ── Film-grain texture overlay ───────────────────── */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
        }}
        aria-hidden="true"
      />

      {/* ── Hero content ─────────────────────────────────── */}
      <div className="section-container relative z-10 w-full py-20">
        <div className="flex flex-col items-center text-center gap-8 max-w-4xl mx-auto">

          {/* Eyebrow label */}
          <div className="flex items-center gap-2 text-cinema-gold text-sm font-semibold
                          tracking-widest uppercase animate-fade-in">
            <span className="w-6 h-px bg-cinema-gold" aria-hidden="true" />
            Now Trending
            <span className="w-6 h-px bg-cinema-gold" aria-hidden="true" />
          </div>

          {/* Main headline */}
          <h1
            className="font-display text-6xl sm:text-7xl lg:text-8xl
                       text-white leading-none tracking-wide animate-fade-in"
            style={{ textShadow: '0 4px 30px rgba(0,0,0,0.6)' }}
          >
            DISCOVER YOUR
            <br />
            <span className="text-cinema-gold">NEXT FILM</span>
          </h1>

          {/* Subtitle — fades in with the active movie title */}
          {activeMovie && (
            <p
              key={activeMovie.id}
              className="text-white/70 text-base sm:text-lg max-w-lg
                         leading-relaxed animate-fade-in"
            >
              Featuring{' '}
              <Link
                to={`/movie/${activeMovie.id}`}
                className="text-white font-semibold hover:text-cinema-gold
                           transition-colors underline-offset-4 hover:underline"
              >
                {activeMovie.title}
              </Link>
              {' '}and millions more.
            </p>
          )}

          {/* Search bar */}
          <div className="w-full animate-fade-in">
            <SearchBar autoFocus={false} />
          </div>

          {/* Backdrop dot indicators */}
          {featured.length > 1 && (
            <div
              className="flex items-center gap-2"
              role="tablist"
              aria-label="Featured movie selector"
            >
              {featured.map((movie, idx) => (
                <button
                  key={movie.id}
                  role="tab"
                  aria-selected={idx === activeIdx}
                  aria-label={`Feature ${movie.title}`}
                  onClick={() => setActiveIdx(idx)}
                  className={`
                    rounded-full transition-all duration-300 focus-visible:outline-none
                    focus-visible:ring-2 focus-visible:ring-cinema-gold
                    ${idx === activeIdx
                      ? 'w-6 h-2 bg-cinema-gold'
                      : 'w-2 h-2 bg-white/30 hover:bg-white/60'
                    }
                  `}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Scroll-down indicator ────────────────────────── */}
      <div
        className="absolute bottom-6 left-1/2 -translate-x-1/2
                   text-white/40 animate-bounce"
        aria-hidden="true"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth={1.5}
          className="w-6 h-6"
        >
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  )
}
