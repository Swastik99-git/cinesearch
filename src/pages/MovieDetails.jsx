// ─────────────────────────────────────────────────────────────
//  MovieDetails — /movie/:id
//
//  Layout (top → bottom):
//    ┌──────────────────────────────────────────┐
//    │  Full-bleed backdrop + gradient overlay   │
//    │  ┌────────┐  Title, tagline, metadata     │
//    │  │ Poster │  Genre pills                  │
//    │  │        │  Rating ring + vote count      │
//    │  └────────┘  [ More Details ] [ Trailer ] │
//    ├──────────────────────────────────────────┤
//    │  Overview                                 │
//    ├──────────────────────────────────────────┤
//    │  Cast                                     │
//    ├──────────────────────────────────────────┤
//    │  Details grid (runtime, budget, revenue…) │
//    ├──────────────────────────────────────────┤
//    │  Similar Movies                           │
//    └──────────────────────────────────────────┘
//
//  Data:
//    useMovieDetails(id) → { details, credits, videos, similar }
//    All fetched in parallel via Promise.allSettled (Phase 2)
// ─────────────────────────────────────────────────────────────

import { useParams, Link } from "react-router-dom";
import { usePageTitle } from "../hooks/usePageTitle";
import { useMovieDetails } from "../hooks/useMovieDetails";
import { IMG, FALLBACK_POSTER, FALLBACK_BACKDROP } from "../api/tmdb";
import {
  formatDate,
  formatRuntime,
  formatRating,
  formatNumber,
  formatMoney,
  getTrailerKey,
  getTopCast,
} from "../utils/helpers";

import Spinner from "../components/ui/Spinner";
import ErrorMessage from "../components/ui/ErrorMessage";
import RatingRing from "../components/RatingRing";
import CastRow from "../components/CastRow";
import TrailerButton from "../components/TrailerButton";
import MovieGrid from "../components/MovieGrid";

// ── Small icon helpers (inline SVG, no lib) ───────────────────
const CalendarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="w-4 h-4 shrink-0"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5
      0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0
      012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2z"
      clipRule="evenodd"
    />
  </svg>
);
const ClockIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="w-4 h-4 shrink-0"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75
      0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z"
      clipRule="evenodd"
    />
  </svg>
);
const ChevronLeft = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-4 h-4"
    aria-hidden="true"
  >
    <path d="M13 16l-6-6 6-6" />
  </svg>
);

// ── Detail stat cell ──────────────────────────────────────────
function StatCell({ label, value }) {
  return (
    <div
      className="flex flex-col gap-1 p-4 bg-cinema-slate
                    rounded-xl border border-cinema-border"
    >
      <span
        className="text-cinema-muted text-xs font-semibold
                       tracking-widest uppercase"
      >
        {label}
      </span>
      <span className="text-cinema-text font-semibold text-base">{value}</span>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────
export default function MovieDetails() {
  const { id } = useParams();

  const { details, credits, videos, similar, loading, error } =
    useMovieDetails(id);

  usePageTitle(details?.title);

  // ── Loading state ─────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Spinner size="lg" label="Loading movie details…" />
          <p className="text-cinema-muted text-sm">Loading movie details…</p>
        </div>
      </div>
    );
  }

  // ── Error state ───────────────────────────────────────────
  if (error || !details) {
    return (
      <div className="section-container py-20">
        <ErrorMessage
          title="Movie not found"
          message={
            error || "We couldn't find that movie. It may have been removed."
          }
          icon="🎬"
        />
        <div className="flex justify-center mt-6">
          <Link to="/" className="btn-primary">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // ── Derived values ────────────────────────────────────────
  const {
    title,
    tagline,
    overview,
    poster_path,
    backdrop_path,
    release_date,
    runtime,
    status,
    vote_average,
    vote_count,
    genres = [],
    budget,
    revenue,
    production_companies = [],
    original_language,
  } = details;

  const posterSrc = IMG.poster(poster_path, "w500") || FALLBACK_POSTER;
  const backdropSrc = IMG.backdrop(backdrop_path) || FALLBACK_BACKDROP;
  const trailerKey = getTrailerKey(videos);
  const cast = getTopCast(credits, 12);
  const similarMovies = similar?.results ?? [];

  return (
    <article>
      {/* ════════════════════════════════════════════════════
          1.  HERO — backdrop + poster + key info
      ════════════════════════════════════════════════════ */}
      <section
        className="relative min-h-[70vh] flex items-end overflow-hidden"
        aria-label={`${title} hero`}
      >
        {/* Backdrop image */}
        <div className="absolute inset-0" aria-hidden="true">
          <img
            src={backdropSrc}
            alt=""
            className="w-full h-full object-cover object-center"
            loading="eager"
          />
          {/* Multi-layer gradient overlay */}
          <div
            className="absolute inset-0 bg-gradient-to-t
            from-cinema-black via-cinema-black/70 to-cinema-black/10"
          />
          <div
            className="absolute inset-0 bg-gradient-to-r
            from-cinema-black/80 via-transparent to-transparent"
          />
        </div>

        {/* Content */}
        <div className="relative z-10 section-container w-full py-12">
          {/* Back link */}
          <Link
            to="/"
            onClick={(e) => {
              e.preventDefault();
              window.history.back();
            }}
            className="inline-flex items-center gap-1 text-white/60 text-sm
                       hover:text-cinema-gold transition-colors mb-8
                       focus-visible:outline-none focus-visible:ring-2
                       focus-visible:ring-cinema-gold rounded"
          >
            <ChevronLeft />
            Go Back
          </Link>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* ── Poster ──────────────────────────────────── */}
            <div className="shrink-0 w-40 sm:w-52 md:w-64 animate-fade-in">
              <img
                src={posterSrc}
                alt={`${title} poster`}
                className="w-full rounded-2xl shadow-2xl border border-white/10
                           ring-1 ring-cinema-border"
                onError={(e) => {
                  e.currentTarget.src = FALLBACK_POSTER;
                }}
              />
            </div>

            {/* ── Text block ──────────────────────────────── */}
            <div className="flex flex-col gap-4 animate-fade-in flex-1">
              {/* Status pill */}
              {status && (
                <span
                  className="self-start px-3 py-1 rounded-full text-xs
                                 font-semibold tracking-wider uppercase
                                 bg-cinema-gold/20 text-cinema-gold
                                 border border-cinema-gold/30"
                >
                  {status}
                </span>
              )}

              {/* Title */}
              <h1
                className="font-display text-4xl sm:text-5xl lg:text-6xl
                             text-white leading-tight tracking-wide"
              >
                {title.toUpperCase()}
              </h1>

              {/* Tagline */}
              {tagline && (
                <p className="text-white/60 text-lg italic">"{tagline}"</p>
              )}

              {/* Meta row: date + runtime */}
              <div className="flex flex-wrap items-center gap-4 text-white/70 text-sm">
                <span className="flex items-center gap-1.5">
                  <CalendarIcon />
                  {formatDate(release_date)}
                </span>
                {runtime > 0 && (
                  <>
                    <span className="text-white/30" aria-hidden="true">
                      ·
                    </span>
                    <span className="flex items-center gap-1.5">
                      <ClockIcon />
                      {formatRuntime(runtime)}
                    </span>
                  </>
                )}
                {original_language && (
                  <>
                    <span className="text-white/30" aria-hidden="true">
                      ·
                    </span>
                    <span className="uppercase font-medium tracking-wider">
                      {original_language}
                    </span>
                  </>
                )}
              </div>

              {/* Genre pills */}
              {genres.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {genres.map((g) => (
                    <span
                      key={g.id}
                      className="px-3 py-1 rounded-full text-xs font-medium
                                 bg-white/10 border border-white/15
                                 text-white/80"
                    >
                      {g.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Rating + CTA buttons */}
              <div className="flex flex-wrap items-center gap-6 mt-2">
                {/* Rating ring */}
                {vote_average > 0 && (
                  <div className="flex items-center gap-3">
                    <RatingRing rating={vote_average} size={72} />
                    <div className="flex flex-col">
                      <span className="text-white text-sm font-semibold">
                        User Score
                      </span>
                      <span className="text-white/50 text-xs">
                        {formatNumber(vote_count)} votes
                      </span>
                    </div>
                  </div>
                )}

                {/* Trailer button */}
                <TrailerButton trailerKey={trailerKey} title={title} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          2.  OVERVIEW
      ════════════════════════════════════════════════════ */}
      {overview && (
        <section className="section-container py-10 border-t border-cinema-border">
          <h2
            className="font-display text-3xl text-cinema-text
                         tracking-wide mb-4"
          >
            OVERVIEW
          </h2>
          <p className="text-cinema-muted leading-relaxed max-w-3xl text-base sm:text-lg">
            {overview}
          </p>
        </section>
      )}

      {/* ════════════════════════════════════════════════════
          3.  CAST
      ════════════════════════════════════════════════════ */}
      {cast.length > 0 && (
        <section className="section-container py-10 border-t border-cinema-border">
          <h2
            className="font-display text-3xl text-cinema-text
                         tracking-wide mb-6"
          >
            TOP CAST
          </h2>
          <CastRow cast={cast} />
        </section>
      )}

      {/* ════════════════════════════════════════════════════
          4.  DETAILS GRID
      ════════════════════════════════════════════════════ */}
      <section className="section-container py-10 border-t border-cinema-border">
        <h2
          className="font-display text-3xl text-cinema-text
                       tracking-wide mb-6"
        >
          DETAILS
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          <StatCell label="Status" value={status || "N/A"} />
          <StatCell label="Release Date" value={formatDate(release_date)} />
          <StatCell label="Runtime" value={formatRuntime(runtime)} />
          <StatCell
            label="Language"
            value={original_language?.toUpperCase() || "N/A"}
          />
          <StatCell label="Budget" value={formatMoney(budget)} />
          <StatCell label="Revenue" value={formatMoney(revenue)} />
          <StatCell
            label="Vote Average"
            value={`${formatRating(vote_average)} / 10`}
          />
          <StatCell label="Vote Count" value={formatNumber(vote_count)} />
          {production_companies.length > 0 && (
            <div className="col-span-2 sm:col-span-3 lg:col-span-4">
              <StatCell
                label="Production"
                value={production_companies
                  .slice(0, 3)
                  .map((c) => c.name)
                  .join(" · ")}
              />
            </div>
          )}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          5.  SIMILAR MOVIES
      ════════════════════════════════════════════════════ */}
      {similarMovies.length > 0 && (
        <section className="section-container py-10 border-t border-cinema-border">
          <h2
            className="font-display text-3xl text-cinema-text
                         tracking-wide mb-6"
          >
            YOU MIGHT ALSO LIKE
          </h2>
          <MovieGrid
            movies={similarMovies.slice(0, 10)}
            loading={false}
            skeletonCount={5}
            emptyMessage="No similar movies found."
          />
        </section>
      )}
    </article>
  );
}
