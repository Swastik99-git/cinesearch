// ─────────────────────────────────────────────────────────────
//  Footer — simple, clean site footer
// ─────────────────────────────────────────────────────────────

import { Link } from 'react-router-dom'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-20 border-t border-cinema-border bg-cinema-navy">
      <div className="section-container py-8">
        <div className="flex flex-col sm:flex-row items-center
                        justify-between gap-4 text-sm text-cinema-muted">

          {/* Brand */}
          <Link
            to="/"
            className="font-display text-xl tracking-widest
                       hover:text-cinema-gold transition-colors"
          >
            CINE<span className="text-cinema-gold">SEARCH</span>
          </Link>

          {/* Attribution */}
          <p className="text-center">
            Movie data provided by{' '}
            <a
              href="https://www.themoviedb.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cinema-gold hover:underline"
            >
              TMDB
            </a>
            {' '}· © {year} CineSearch
          </p>
        </div>
      </div>
    </footer>
  )
}
