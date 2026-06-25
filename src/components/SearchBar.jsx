// ─────────────────────────────────────────────────────────────
//  SearchBar — hero-sized search input
//
//  Different from the Navbar's compact search:
//    - Larger, more prominent (this is the primary CTA)
//    - Animated focus ring
//    - Submit button visible at all times
//    - Autofocus optional (hero uses it, reuse elsewhere without)
//
//  Props:
//    onSearch    — (query: string) => void
//    placeholder — string
//    autoFocus   — boolean (default: false)
//    initialValue— string (pre-fill from URL param)
// ─────────────────────────────────────────────────────────────

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function SearchIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth={2.5}
      strokeLinecap="round" strokeLinejoin="round"
      className="w-5 h-5" aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  )
}

export default function SearchBar({
  placeholder  = 'Search for a movie…',
  autoFocus    = false,
  initialValue = '',
}) {
  const [query, setQuery] = useState(initialValue)
  const navigate          = useNavigate()

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = query.trim()
    if (!trimmed) return
    navigate(`/search?q=${encodeURIComponent(trimmed)}`)
  }

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      className="w-full max-w-2xl mx-auto"
    >
      <div className="relative flex items-center group">
        {/* Input */}
        <input
          type="search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          aria-label="Search movies"
          className="
            w-full
            pl-6 pr-36 py-4
            text-base sm:text-lg
            bg-white/10 backdrop-blur-sm
            border-2 border-white/20
            rounded-full
            text-white placeholder:text-white/50
            focus:outline-none
            focus:border-cinema-gold
            focus:bg-white/15
            focus:shadow-[0_0_40px_rgba(245,197,24,0.2)]
            transition-all duration-300
          "
        />

        {/* Submit button — sits inside the input visually */}
        <button
          type="submit"
          disabled={!query.trim()}
          className="
            absolute right-2
            flex items-center gap-2
            bg-cinema-gold text-cinema-black
            font-semibold text-sm
            px-5 py-2.5 rounded-full
            transition-all duration-200
            hover:bg-cinema-amber
            hover:shadow-[0_0_20px_rgba(245,197,24,0.5)]
            disabled:opacity-40 disabled:cursor-not-allowed
            active:scale-95
            focus-visible:outline-none
            focus-visible:ring-2 focus-visible:ring-white
          "
          aria-label="Search"
        >
          <SearchIcon />
          <span className="hidden sm:inline">Search</span>
        </button>
      </div>

      {/* Hint text below */}
      <p className="text-center text-white/40 text-sm mt-3">
        Try "Inception", "The Godfather", or "Dune"
      </p>
    </form>
  )
}
