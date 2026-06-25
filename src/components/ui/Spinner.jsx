// ─────────────────────────────────────────────────────────────
//  Spinner — animated loading indicator
//
//  Props:
//    size   — 'sm' | 'md' | 'lg'  (default: 'md')
//    label  — screen-reader text   (default: 'Loading…')
//
//  Usage:
//    <Spinner />
//    <Spinner size="lg" label="Loading movies…" />
// ─────────────────────────────────────────────────────────────

const sizes = {
  sm: 'w-4 h-4 border-2',
  md: 'w-8 h-8 border-2',
  lg: 'w-12 h-12 border-[3px]',
}

export default function Spinner({ size = 'md', label = 'Loading…' }) {
  return (
    <div role="status" className="flex items-center justify-center">
      <span
        aria-hidden="true"
        className={`
          ${sizes[size]}
          rounded-full
          border-cinema-border
          border-t-cinema-gold
          animate-spin
        `}
      />
      {/* Visually hidden but readable by screen readers */}
      <span className="sr-only">{label}</span>
    </div>
  )
}
