// ─────────────────────────────────────────────────────────────
//  usePageTitle — sets the browser tab <title> per page
//
//  Why this matters:
//    Without it every page shows "CineSearch" in the tab.
//    With it: "Inception | CineSearch", "Batman Results | CineSearch"
//    This also helps with browser history and bookmarks.
//
//  Usage:
//    usePageTitle('Inception')        → "Inception | CineSearch"
//    usePageTitle()                   → "CineSearch"
//    usePageTitle('Batman', 'Results')→ "Batman Results | CineSearch"
// ─────────────────────────────────────────────────────────────

import { useEffect } from 'react'

const APP_NAME = 'CineSearch'

export function usePageTitle(...parts) {
  useEffect(() => {
    const filtered = parts.filter(Boolean)
    document.title = filtered.length
      ? `${filtered.join(' ')} | ${APP_NAME}`
      : APP_NAME

    // Reset to app name when component unmounts
    return () => { document.title = APP_NAME }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...parts])
}
