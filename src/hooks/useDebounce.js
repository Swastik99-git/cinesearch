// ─────────────────────────────────────────────────────────────
//  useDebounce
//
//  Delays updating a value until the user has stopped
//  changing it for `delay` milliseconds.
//
//  WHY THIS MATTERS:
//  Without debounce, typing "Batman" fires 6 API calls:
//    B → Ba → Bat → Batm → Batma → Batman
//  With 400ms debounce it fires just ONE — after the user stops.
//
//  Usage:
//    const debouncedQuery = useDebounce(query, 400)
//    // debouncedQuery only updates 400ms after query stops changing
// ─────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react'

export function useDebounce(value, delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    // Schedule the update
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // If value changes before delay expires, cancel the old timer
    // and start a new one — this is the key debounce mechanism
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}
