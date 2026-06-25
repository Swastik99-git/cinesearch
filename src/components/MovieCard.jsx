// ─────────────────────────────────────────────────────────────
//  MovieCard — core reusable movie display tile
//
//  Used on: Home (trending), Search Results, Movie Details (similar)
//
//  Props:
//    movie  — TMDB movie object
//    size   — 'sm' | 'md' (default: 'md')
//             sm → compact card for "similar" sidebars
//             md → standard grid card
//
//  Design decisions:
//    - Poster uses native lazy loading (no extra lib needed)
//    - Rating badge sits in the top-right corner of the poster
//    - Hover lifts the card and brightens the poster slightly
//    - Uses Link from RRD so the whole card is navigable
// ─────────────────────────────────────────────────────────────

import { Link } from 'react-router-dom'
import { IMG, FALLBACK_POSTER } from '../api/tmdb'
import { formatYear, formatRating, ratingColor } from '../utils/helpers'

// ── Star icon (inline SVG — no icon lib needed) ──────────────
function StarIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="w-3 h-3"
      aria-hidden="true"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0
               00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8
               2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755
               1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175
               0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1
               1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1
               1 0 00.951-.69l1.07-3.292z"
      />
    </svg>
  )
}

export default function MovieCard({ movie, size = 'md' }) {
  if (!movie) return null

  const {
    id,
    title,
    poster_path,
    release_date,
    vote_average,
  } = movie

  const rating     = formatRating(vote_average)
  const year       = formatYear(release_date)
  const ratingCls  = ratingColor(vote_average)
  const posterSrc  = IMG.poster(poster_path) || FALLBACK_POSTER
  const poster2x   = IMG.poster2x(poster_path)

  const isSmall = size === 'sm'

  return (
    <Link
      to={`/movie/${id}`}
      className="group flex flex-col gap-2 focus-visible:outline-none
                 focus-visible:ring-2 focus-visible:ring-cinema-gold
                 rounded-xl"
      aria-label={`${title} (${year})`}
    >
      {/* ── Poster ───────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-xl bg-cinema-slate">
        <img
          src={posterSrc}
          srcSet={poster2x ? `${posterSrc} 1x, ${poster2x} 2x` : undefined}
          alt={`${title} poster`}
          loading="lazy"
          decoding="async"
          className="w-full aspect-[2/3] object-cover
                     transition-transform duration-300 ease-out
                     group-hover:scale-105"
          onError={e => { e.currentTarget.src = FALLBACK_POSTER }}
        />

        {/* Gradient overlay — fades poster bottom for legibility */}
        <div
          className="absolute inset-0 bg-gradient-to-t
                     from-black/60 via-transparent to-transparent
                     opacity-0 group-hover:opacity-100
                     transition-opacity duration-300"
          aria-hidden="true"
        />

        {/* Rating badge — top right corner */}
        {vote_average > 0 && (
          <div className="absolute top-2 right-2">
            <span className="rating-badge shadow-lg">
              <StarIcon />
              {rating}
            </span>
          </div>
        )}
      </div>

      {/* ── Info ─────────────────────────────────────────── */}
      <div className="flex flex-col gap-0.5 px-0.5">
        <h3
          className={`
            font-semibold leading-snug text-cinema-text
            group-hover:text-cinema-gold transition-colors duration-200
            line-clamp-2
            ${isSmall ? 'text-sm' : 'text-base'}
          `}
        >
          {title}
        </h3>

        <div className="flex items-center gap-2 text-cinema-muted">
          {/* Year */}
          <span className={isSmall ? 'text-xs' : 'text-sm'}>
            {year}
          </span>

          {/* Dot separator */}
          {vote_average > 0 && (
            <>
              <span className="text-cinema-border" aria-hidden="true">·</span>
              {/* Rating (coloured by quality) */}
              <span className={`${isSmall ? 'text-xs' : 'text-sm'} font-medium ${ratingCls}`}>
                ★ {rating}
              </span>
            </>
          )}
        </div>
      </div>
    </Link>
  )
}
