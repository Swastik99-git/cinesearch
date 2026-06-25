// ─────────────────────────────────────────────────────────────
//  CastRow — horizontal scrollable cast strip
//
//  Props:
//    cast — array of TMDB cast objects (from credits.cast)
//    max  — how many cast members to show (default: 12)
// ─────────────────────────────────────────────────────────────

import { IMG, FALLBACK_PROFILE } from '../api/tmdb'

function CastCard({ member }) {
  const photo = IMG.profile(member.profile_path) || FALLBACK_PROFILE

  return (
    <li className="flex flex-col items-center gap-2 shrink-0 w-24 sm:w-28">
      {/* Profile photo */}
      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden
                      bg-cinema-slate border-2 border-cinema-border
                      flex items-center justify-center shrink-0">
        <img
          src={photo}
          alt={member.name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover object-top"
          onError={e => { e.currentTarget.src = FALLBACK_PROFILE }}
        />
      </div>

      {/* Name */}
      <div className="text-center">
        <p className="text-cinema-text text-xs sm:text-sm font-semibold
                      leading-snug line-clamp-2">
          {member.name}
        </p>
        {member.character && (
          <p className="text-cinema-muted text-xs leading-snug
                        line-clamp-2 mt-0.5">
            {member.character}
          </p>
        )}
      </div>
    </li>
  )
}

export default function CastRow({ cast = [], max = 12 }) {
  const visible = cast.slice(0, max)

  if (!visible.length) {
    return (
      <p className="text-cinema-muted text-sm">
        Cast information unavailable.
      </p>
    )
  }

  return (
    /* hide scrollbar visually but keep it functional */
    <ul
      className="flex gap-4 overflow-x-auto pb-3
                 scrollbar-none [-ms-overflow-style:none]
                 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      aria-label="Cast members"
    >
      {visible.map(member => (
        <CastCard key={member.cast_id ?? member.id} member={member} />
      ))}
    </ul>
  )
}
