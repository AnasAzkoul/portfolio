/**
 * How a view and the lattice share the screen (see "Stage layout" in
 * GLOSSARY.md). A page picks one through definePageMeta's `stage`; it applies
 * from 1280px wide, and below that every view is `centre`.
 */
export type Stage = 'centre' | 'focus' | 'beside' | 'horizon'

/** The classes the layout sets on each of its parts for a stage layout. */
interface StageParts {
  /**
   * On the stage itself: where the lattice stands, as its size and centre.
   * The lattice, the overlays and the view all read them.
   */
  stage: string
  /** On the lattice: anything beyond where it stands. */
  lattice?: string
  /** On the centre-glow overlay that darkens the lattice's heart. */
  glow?: string
  /** On the vignette overlay that darkens the edges. */
  vignette?: string
  /** On the view area. */
  view?: string
}

// The whole circle, centred, with 96px of height kept for the mark, nav and
// breadcrumb so the ring never runs under them.
const centred =
  '[--lattice-size:min(100dvh_-_96px,100vw)] [--lattice-x:50%] [--lattice-y:50%]'

// The vignette drawn round the lattice wherever it stands, at the same
// proportions as Home's.
const vignetteRoundLattice =
  'min-[1280px]:bg-[radial-gradient(circle_var(--lattice-size)_at_var(--lattice-x)_var(--lattice-y),transparent_56%,var(--color-bg3)_100%)]'

export const stageParts: Record<Stage, StageParts> = {
  centre: { stage: centred },

  // The lattice fades away, so nothing competes with the reading.
  focus: {
    stage: centred,
    lattice: 'min-[1280px]:invisible min-[1280px]:opacity-0'
  },

  // The lattice steps right, whole, and the view stands on its left. The
  // lattice is centred where the view area is (10px below the middle).
  beside: {
    stage:
      '[--lattice-size:min(100dvh_-_160px,46vw)] [--lattice-x:calc(100%_-_44px_-_var(--lattice-size)/2)] [--lattice-y:calc(50%_+_10px)]',
    glow: 'min-[1280px]:bg-[radial-gradient(circle_calc(var(--lattice-size)*0.365)_at_var(--lattice-x)_var(--lattice-y),--alpha(var(--color-bg2)/92%)_0%,--alpha(var(--color-bg2)/55%)_47%,transparent_100%)]',
    vignette: vignetteRoundLattice
  },

  // The lattice sinks until only its top (--lattice-rise of the height) shows,
  // an arch at the foot of the screen; the view stands at the top, above it.
  // Its heart is off screen, so there's no glow to darken it.
  horizon: {
    stage:
      '[--lattice-size:max(100vw,150dvh)] [--lattice-rise:40dvh] [--lattice-x:50%] [--lattice-y:calc(100%_-_var(--lattice-rise)_+_var(--lattice-size)/2)]',
    glow: 'min-[1280px]:bg-none',
    vignette: vignetteRoundLattice,
    view: 'min-[1280px]:justify-start'
  }
}
