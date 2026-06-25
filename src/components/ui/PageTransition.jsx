// ─────────────────────────────────────────────────────────────
//  PageTransition — fade-in wrapper on route change
//
//  Uses the pathname as a key so React unmounts/remounts
//  the wrapper on every navigation, triggering the CSS
//  animation fresh each time.
//
//  Why CSS instead of a library like Framer Motion?
//    Zero dependencies, instant load, 3 lines of CSS.
//    The animation is simple enough not to need a library.
//
//  Usage: wrap <Routes> in App.jsx with this component.
// ─────────────────────────────────────────────────────────────

import { useLocation } from 'react-router-dom'

export default function PageTransition({ children }) {
  const { pathname } = useLocation()

  return (
    <div
      key={pathname}
      className="animate-fade-in"
    >
      {children}
    </div>
  )
}
