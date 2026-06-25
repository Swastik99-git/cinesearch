// ─────────────────────────────────────────────────────────────
//  useMovieDetails
//
//  Fetches details + credits + videos + similar movies
//  in parallel using Promise.allSettled (via fetchMovieDetailsAll).
//
//  A failure in credits won't crash the details page —
//  each piece degrades independently.
//
//  Usage:
//    const { details, credits, videos, similar,
//            loading, error } = useMovieDetails(movieId)
// ─────────────────────────────────────────────────────────────

import { useState, useEffect } from "react";
import { fetchMovieDetailsAll } from "../api/tmdb";

export function useMovieDetails(id) {
  const [details, setDetails] = useState(null);
  const [credits, setCredits] = useState(null);
  const [videos, setVideos] = useState(null);
  const [similar, setSimilar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      // Reset previous movie's data immediately on id change
      setDetails(null);
      setCredits(null);
      setVideos(null);
      setSimilar(null);

      try {
        const result = await fetchMovieDetailsAll(id);

        if (cancelled) return;

        if (!result.details) {
          throw new Error("Movie not found.");
        }

        setDetails(result.details);
        setCredits(result.credits);
        setVideos(result.videos);
        setSimilar(result.similar);
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Failed to load movie details.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [id]);

  return { details, credits, videos, similar, loading, error };
}
