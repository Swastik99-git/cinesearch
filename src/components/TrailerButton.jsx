// ─────────────────────────────────────────────────────────────
//  TrailerButton — opens YouTube trailer in a modal overlay
//
//  Why a modal instead of a new tab?
//    - Keeps the user on the page
//    - Feels more cinematic (lights-out overlay)
//    - Closer to what streaming services do
//
//  Props:
//    trailerKey — YouTube video ID string (from TMDB videos)
//    title      — movie title (for aria-label)
// ─────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react'

function PlayIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
      fill="currentColor" className="w-5 h-5" aria-hidden="true"
    >
      <path d="M8 5v14l11-7L8 5z" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth={2.5}
      strokeLinecap="round" className="w-5 h-5" aria-hidden="true"
    >
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  )
}

export default function TrailerButton({ trailerKey, title = 'movie' }) {
  const [open, setOpen] = useState(false)

  // Close on Escape key
  useEffect(() => {
    if (!open) return
    const handler = e => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open])

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!trailerKey) return null

  return (
    <>
      {/* ── Trigger button ───────────────────────────────── */}
      <button
        onClick={() => setOpen(true)}
        className="
          flex items-center gap-2
          border-2 border-white/30 text-white
          font-semibold px-6 py-3 rounded-full
          transition-all duration-200
          hover:border-cinema-gold hover:text-cinema-gold
          hover:shadow-[0_0_20px_rgba(245,197,24,0.2)]
          active:scale-95
          focus-visible:outline-none focus-visible:ring-2
          focus-visible:ring-cinema-gold
        "
        aria-label={`Watch ${title} trailer`}
      >
        <PlayIcon />
        Watch Trailer
      </button>

      {/* ── Modal overlay ─────────────────────────────────── */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center
                     bg-black/90 backdrop-blur-sm animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-label={`${title} trailer`}
          onClick={() => setOpen(false)}   /* click outside → close */
        >
          {/* Stop clicks inside the iframe from closing */}
          <div
            className="relative w-full max-w-4xl mx-4 aspect-video"
            onClick={e => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setOpen(false)}
              className="
                absolute -top-10 right-0
                text-white/70 hover:text-white
                focus-visible:outline-none focus-visible:ring-2
                focus-visible:ring-cinema-gold rounded
                transition-colors
              "
              aria-label="Close trailer"
            >
              <XIcon />
              <span className="sr-only">Close</span>
            </button>

            {/* YouTube embed */}
            <iframe
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0&modestbranding=1`}
              title={`${title} trailer`}
              allow="autoplay; encrypted-media; fullscreen"
              allowFullScreen
              className="w-full h-full rounded-xl border border-cinema-border"
            />
          </div>
        </div>
      )}
    </>
  )
}
