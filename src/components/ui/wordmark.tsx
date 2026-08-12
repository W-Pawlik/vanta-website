import { cn } from '@/lib/utils/cn'

/**
 * The VANTA logotype, inlined from the supplied SVG.
 *
 * Two decisions worth knowing:
 *
 * 1. The letters are `currentColor`, not a baked fill. The delivered files were a
 *    light and a dark variant of identical geometry, which would mean maintaining
 *    the same shape twice; one component that inherits text colour covers the dark
 *    page, the light Process section and any hover state for free.
 * 2. The two small accent wedges use `--color-accent`, so the mark follows the
 *    toned-down lime (#C3F53B) instead of the original #C7FF38 baked into the file.
 *
 * Sizing has two modes. `fit="type"` (default) drives height from the font size, so
 * `className="text-2xl"` sets the logo height the way it would set type. `fit="block"`
 * fills the container width instead — for the oversized footer mark, where the shape
 * is a graphic element rather than a piece of typography.
 */
export function Wordmark({
  className,
  fit = 'type',
}: {
  className?: string
  fit?: 'type' | 'block'
}) {
  return (
    <span className={cn(fit === 'type' ? 'inline-flex items-center' : 'block w-full', className)}>
      <svg
        viewBox="0 0 995 158"
        // Decorative: every call site provides its own accessible name, either via
        // the wrapping link's aria-label or the sr-only text below.
        aria-hidden="true"
        focusable="false"
        preserveAspectRatio="xMidYMid meet"
        className={fit === 'type' ? 'h-[0.82em] w-auto' : 'h-auto w-full'}
      >
        <g fill="currentColor">
          <polygon points="0,0 47,0 114,119 188,0 232,0 142,158 92,158" />
          <polygon points="193,158 294,158 309,125 258,120 309,39 374,158 416,158 331,0 281,0" />
          <polygon points="434,0 435,158 473,158 474,53 579,158 622,158 621,0 583,0 582,103 478,0" />
          <polygon points="641,0 641,35 705,35 705,158 742,158 743,35 802,35 816,0" />
          <polygon points="771,158 871,158 886,125 835,120 886,39 951,158 995,158 909,0 860,0" />
        </g>
        <g fill="var(--color-accent)">
          <polygon points="310,125 298,127 282,158 293,158" />
          <polygon points="887,125 876,125 859,158 870,158" />
        </g>
      </svg>
      <span className="sr-only">VANTA</span>
    </span>
  )
}
