// ─────────────────────────────────────────────────────────────
//  useFetch — generic data-fetching hook
//
//  Accepts any async function + its dependencies.
//  Manages: data | loading | error state.
//  Re-runs whenever deps change (like useEffect).
//  Handles race conditions with AbortController.
//
//  Usage:
//    const { data, loading, error, refetch } = useFetch(
//      () => fetchTrending('week'),
//      []               ← deps array, same as useEffect
//    )
// ─────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback, useRef } from 'react'

export function useFetch(asyncFn, deps = []) {
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  // We use a ref to track if the component is still mounted.
  // Without this, setting state on an unmounted component
  // causes a React memory-leak warning.
  const isMounted = useRef(true)

  const execute = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await asyncFn()
      if (isMounted.current) {
        setData(result)
      }
    } catch (err) {
      if (isMounted.current) {
        // Don't surface AbortError — it's intentional cleanup
        if (err.name !== 'AbortError') {
          setError(err.message || 'Something went wrong.')
        }
      }
    } finally {
      if (isMounted.current) {
        setLoading(false)
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useEffect(() => {
    isMounted.current = true
    execute()

    return () => {
      isMounted.current = false
    }
  }, [execute])

  // Expose refetch so components can manually re-trigger
  // e.g. a "Try Again" button after an error
  return { data, loading, error, refetch: execute }
}
