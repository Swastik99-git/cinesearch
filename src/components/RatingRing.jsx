// ─────────────────────────────────────────────────────────────
//  RatingRing — circular SVG rating indicator
//
//  Draws a progress ring from 0–100% based on the TMDB
//  vote_average (0–10 scale).
//
//  Props:
//    rating  — number 0–10  (TMDB vote_average)
//    size    — number        (SVG dimensions in px, default 80)
//    stroke  — number        (ring thickness, default 6)
// ─────────────────────────────────────────────────────────────

import { ratingColor } from '../utils/helpers'

export default function RatingRing({ rating = 0, size = 80, stroke = 6 }) {
  const radius      = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const percent     = Math.min(Math.max(rating / 10, 0), 1)
  const offset      = circumference * (1 - percent)

  // Colour: green ≥7, gold ≥5, red <5
  const ringColor =
    rating >= 7 ? '#4ade80' :
    rating >= 5 ? '#f5c518' : '#ef4444'

  const colorClass = ratingColor(rating)

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
      aria-label={`Rating: ${rating.toFixed(1)} out of 10`}
      role="img"
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"          /* start arc from 12 o'clock */
        aria-hidden="true"
      >
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#2a2a4a"
          strokeWidth={stroke}
        />
        {/* Filled arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={ringColor}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
        />
      </svg>

      {/* Centre label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`font-bold leading-none ${colorClass}`}
          style={{ fontSize: size * 0.22 }}
        >
          {rating > 0 ? rating.toFixed(1) : 'N/A'}
        </span>
        {rating > 0 && (
          <span className="text-cinema-muted leading-none"
            style={{ fontSize: size * 0.13 }}
          >
            /10
          </span>
        )}
      </div>
    </div>
  )
}
