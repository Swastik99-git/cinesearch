// ─────────────────────────────────────────────────────────────
//  SkeletonCard — shimmer placeholder for MovieCard
//
//  Exact same dimensions as MovieCard so the layout
//  doesn't shift when real cards load in.
//
//  Props:
//    count — how many skeletons to render (default: 1)
//
//  Usage:
//    <SkeletonCard count={20} />
// ─────────────────────────────────────────────────────────────

function SingleSkeleton() {
  return (
    <div className="flex flex-col gap-3 animate-fade-in">
      {/* Poster placeholder — 2:3 aspect ratio */}
      <div className="skeleton w-full aspect-[2/3] rounded-xl" />

      {/* Title line */}
      <div className="skeleton h-4 w-3/4 rounded" />

      {/* Subtitle line (date + rating) */}
      <div className="flex gap-2">
        <div className="skeleton h-3 w-1/3 rounded" />
        <div className="skeleton h-3 w-1/4 rounded" />
      </div>
    </div>
  )
}

export default function SkeletonCard({ count = 1 }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <SingleSkeleton key={i} />
      ))}
    </>
  )
}
