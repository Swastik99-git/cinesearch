// ─────────────────────────────────────────────────────────────
//  ErrorMessage — friendly error display
//
//  Props:
//    title    — headline (default: 'Something went wrong')
//    message  — detail text
//    onRetry  — optional callback; shows a "Try Again" button
//    icon     — optional emoji / icon override
//
//  Usage:
//    <ErrorMessage message={error} onRetry={refetch} />
//    <ErrorMessage title="No results" message="Try a different title." />
// ─────────────────────────────────────────────────────────────

export default function ErrorMessage({
  title   = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
  onRetry,
  icon    = '🎬',
}) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center gap-4
                 text-center py-16 px-6 animate-fade-in"
    >
      {/* Big icon */}
      <span className="text-6xl select-none" aria-hidden="true">{icon}</span>

      {/* Headline */}
      <h2 className="font-display text-3xl text-cinema-text tracking-wide">
        {title}
      </h2>

      {/* Detail */}
      <p className="text-cinema-muted max-w-md leading-relaxed">
        {message}
      </p>

      {/* Retry button — only shown when handler is provided */}
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn-primary mt-2"
        >
          Try Again
        </button>
      )}
    </div>
  )
}
