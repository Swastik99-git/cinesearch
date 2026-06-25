// ─────────────────────────────────────────────────────────────
//  ScrollToTop — two behaviours in one component
//
//  1. AUTO-SCROLL: whenever the route changes (pathname),
//     scroll back to the top of the page instantly.
//     Without this, navigating from a scrolled search page
//     to a details page starts you halfway down.
//
//  2. BACK-TO-TOP BUTTON: a floating button that appears
//     after scrolling 400px, smoothly scrolls back to top.
//
//  Mount this once inside <BrowserRouter> in App.jsx.
// ─────────────────────────────────────────────────────────────

import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

function ChevronUpIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth={2.5}
      strokeLinecap="round" strokeLinejoin="round"
      className="w-5 h-5" aria-hidden="true"
    >
      <path d="M18 15l-6-6-6 6" />
    </svg>
  )
}

export default function ScrollToTop() {
  const { pathname } = useLocation()
  const [visible, setVisible] = useState(false)

  // ── Behaviour 1: scroll to top on route change ────────────
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])

  // ── Behaviour 2: show/hide button based on scroll depth ───
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <button
      onClick={scrollToTop}
      aria-label="Back to top"
      className={`
        fixed bottom-6 right-6 z-40
        w-11 h-11 rounded-full
        bg-cinema-gold text-cinema-black
        flex items-center justify-center
        shadow-lg shadow-black/40
        transition-all duration-300 ease-out
        hover:bg-cinema-amber hover:scale-110
        hover:shadow-[0_0_20px_rgba(245,197,24,0.4)]
        active:scale-95
        focus-visible:outline-none focus-visible:ring-2
        focus-visible:ring-white
        ${visible
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-4 pointer-events-none'
        }
      `}
    >
      <ChevronUpIcon />
    </button>
  )
}
