// ─────────────────────────────────────────────────────────────
//  useSearch — search-specific hook
//
//  Combines:
//    useDebounce  → don't fire on every keystroke
//    useFetch     → managed loading/error state
//
//  Also manages:
//    - Empty query short-circuit (no API call for blank input)
//    - Page state for pagination
//    - Accumulated results for "Load More" behaviour
//
//  Usage (Search Results page):
//    const { results, loading, error, totalResults, hasMore,
//            loadMore, query } = useSearch(queryParam)
// ─────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback, useRef } from "react";
import { searchMovies } from "../api/tmdb";
import { useDebounce } from "./useDebounce";

export function useSearch(rawQuery) {
  const query = useDebounce(rawQuery, 400); // wait for typing to settle
  const [page, setPage] = useState(1);
  const [results, setResults] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Track which query we last fetched so we can
  // reset results when the query changes
  const lastQuery = useRef("");

  const fetchPage = useCallback(async (q, p) => {
    if (!q?.trim()) {
      setResults([]);
      setTotalResults(0);
      setTotalPages(0);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await searchMovies(q, p);

      setTotalResults(data.total_results ?? 0);
      setTotalPages(data.total_pages ?? 0);

      setResults((prev) =>
        // First page of a new query → replace; subsequent pages → append
        p === 1 ? (data.results ?? []) : [...prev, ...(data.results ?? [])],
      );
    } catch (err) {
      setError(err.message || "Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Reset + fetch page 1 whenever the debounced query changes
  useEffect(() => {
    if (query !== lastQuery.current) {
      lastQuery.current = query;
      setPage(1);
      fetchPage(query, 1);
    }
  }, [query, fetchPage]);

  // Fetch next page when `page` increments (triggered by loadMore)
  useEffect(() => {
    if (page > 1) {
      fetchPage(query, page);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const loadMore = useCallback(() => {
    if (!loading && page < totalPages) {
      setPage((p) => p + 1);
    }
  }, [loading, page, totalPages]);

  return {
    query, // the debounced (settled) query string
    results, // array of movie objects
    loading, // true while fetching
    error, // error message string or null
    totalResults, // e.g. 1234 (from TMDB)
    hasMore: page < totalPages,
    loadMore,
  };
}
