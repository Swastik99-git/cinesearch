// ─────────────────────────────────────────────────────────────
//  Navbar — sticky top navigation
//
//  Features:
//    - Logo links to Home
//    - Compact search bar (navigates to /search?q=…)
//    - Scrolled state: adds blur + border for depth
//    - Fully keyboard navigable
// ─────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'

// ── Search icon ───────────────────────────────────────────────
function SearchIcon({ className = 'w-4 h-4' }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
      fill="none" stroke="currentColor" strokeWidth={2}
      className={className} aria-hidden="true"
    >
      <circle cx="9" cy="9" r="6" />
      <path d="M15 15l3 3" strokeLinecap="round" />
    </svg>
  )
}

// ── Film reel logo mark ───────────────────────────────────────
function LogoMark() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
      fill="currentColor" className="w-6 h-6 text-cinema-gold"
      aria-hidden="true"
    >
      <path d="M2 6a2 2 0 012-2h16a2 2 0 012 2v12a2 2 0
               01-2 2H4a2 2 0 01-2-2V6zm2 0v2h2V6H4zm14
               0v2h2V6h-2zM4 10v2h2v-2H4zm14 0v2h2v-2h-2zM4
               14v2h2v-2H4zm14 0v2h2v-2h-2zM8 6v12h8V6H8z"/>
    </svg>
  )
}

export default function Navbar() {
  const navigate          = useNavigate()
  const [searchParams]    = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [scrolled, setScrolled] = useState(false)

  // Add a shadow + blur when user has scrolled down
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Keep the input in sync if the URL ?q= param changes
  // (e.g. user hits Back button)
  useEffect(() => {
    setQuery(searchParams.get('q') || '')
  }, [searchParams])

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = query.trim()
    if (!trimmed) return
    navigate(`/search?q=${encodeURIComponent(trimmed)}`)
  }

  return (
    <header
      className={`
        sticky top-0 z-50 w-full
        transition-all duration-300
        ${scrolled
          ? 'bg-cinema-black/90 backdrop-blur-md border-b border-cinema-border shadow-xl'
          : 'bg-transparent'
        }
      `}
    >
      <div className="section-container">
        <nav
          className="flex items-center justify-between h-16 gap-4"
          aria-label="Main navigation"
        >
          {/* ── Logo ──────────────────────────────────────── */}
          <Link
            to="/"
            className="flex items-center gap-2 shrink-0
                       focus-visible:outline-none focus-visible:ring-2
                       focus-visible:ring-cinema-gold rounded-lg"
            aria-label="CineSearch — Home"
          >
            <LogoMark />
            <span className="font-display text-2xl tracking-widest text-cinema-text
                             hidden sm:block">
              CINE<span className="text-cinema-gold">SEARCH</span>
            </span>
          </Link>

          {/* ── Search bar ────────────────────────────────── */}
          <form
            onSubmit={handleSubmit}
            className="flex-1 max-w-md"
            role="search"
          >
            <div className="relative group">
              <span className="absolute left-3 top-1/2 -translate-y-1/2
                               text-cinema-muted group-focus-within:text-cinema-gold
                               transition-colors duration-200 pointer-events-none">
                <SearchIcon />
              </span>

              <input
                type="search"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search movies…"
                aria-label="Search movies"
                className="
                  w-full pl-9 pr-4 py-2
                  bg-cinema-slate border border-cinema-border
                  rounded-full text-sm text-cinema-text
                  placeholder:text-cinema-muted
                  focus:outline-none focus:border-cinema-gold
                  focus:ring-1 focus:ring-cinema-gold
                  transition-all duration-200
                "
              />
            </div>
          </form>
        </nav>
      </div>
    </header>
  )
}
