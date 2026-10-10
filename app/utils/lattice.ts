import { CENTER, girih, poly, pt, star } from './geometry'

export interface LatticePath {
  d: string
  cls: string
}

export interface LatticeCircle {
  cx: number
  cy: number
  r: number
  cls: string
}

export interface HotStar {
  hit: LatticeCircle
  paths: LatticePath[]
  dot: LatticeCircle
}

export interface Lattice {
  rays: LatticePath[]
  inner: LatticePath[]
  mid: LatticePath[]
  hotStars: HotStar[]
  rosette: LatticePath[]
  pearls: LatticeCircle[]
  border: { rings: LatticeCircle[]; triangles: LatticePath[] }
}

const C = CENTER
const EIGHTH = Math.PI / 8
const HOT_ACCENTS = ['acc-red', 'acc-prl', 'acc-grn', 'acc-prl']
const TRIANGLES = 56

const fmt1 = ([x, y]: [number, number]) => `${x.toFixed(1)} ${y.toFixed(1)}`

function rays(): LatticePath[] {
  return Array.from({ length: 16 }, (_, i) => ({
    d: `M${fmt1(pt(96, i * EIGHTH))}L${fmt1(pt(452, i * EIGHTH))}`,
    cls: 'g-fine'
  }))
}

function hotStars(): HotStar[] {
  return Array.from({ length: 8 }, (_, k) => {
    const [cx, cy] = pt(252, k * (Math.PI / 4) + EIGHTH)
    return {
      hit: { cx, cy, r: 50, cls: 'hit' },
      paths: [
        { d: star(cx, cy, 48, 27, 8, EIGHTH), cls: 'g-line2' },
        { d: poly(cx, cy, 20, 8, 0), cls: 'g-fine' }
      ],
      dot: { cx, cy, r: 3.4, cls: HOT_ACCENTS[k % 4]! }
    }
  })
}

function triangles(): LatticePath[] {
  return Array.from({ length: TRIANGLES }, (_, m) => {
    const step = (2 * Math.PI) / TRIANGLES
    const a0 = m * step
    const a1 = (m + 1) * step
    const am = (a0 + a1) / 2
    const even = m % 2 === 0
    // Even: base on the inner ring, apex out. Odd: base on the outer ring, apex in.
    const [rBase, rApex] = even ? [420, 454] : [454, 420]
    return {
      d: `M${fmt1(pt(rBase, a0))}L${fmt1(pt(rBase, a1))}L${fmt1(pt(rApex, am))}Z`,
      cls: even ? 'g-fine' : 'g-pearl'
    }
  })
}

/** Every shape of the mosaic lattice, grouped by layer and in paint order. */
export function buildLattice(): Lattice {
  return {
    rays: rays(),
    inner: [
      { d: poly(C, C, 80, 8, EIGHTH), cls: 'g-line2' },
      { d: star(C, C, 152, 94, 16, 0), cls: 'g-line' },
      { d: girih(C, C, 120, 8, 3, EIGHTH), cls: 'g-fine' }
    ],
    mid: [
      { d: poly(C, C, 252, 8, EIGHTH), cls: 'g-line' },
      { d: girih(C, C, 252, 8, 2, 0), cls: 'g-fine' },
      { d: girih(C, C, 252, 8, 3, EIGHTH), cls: 'g-fine' }
    ],
    hotStars: hotStars(),
    rosette: [
      { d: star(C, C, 362, 252, 16, Math.PI / 16), cls: 'g-line' },
      { d: girih(C, C, 362, 16, 6, Math.PI / 16), cls: 'g-fine' }
    ],
    pearls: Array.from({ length: 16 }, (_, t) => {
      const [cx, cy] = pt(152, t * EIGHTH)
      return { cx, cy, r: 2.1, cls: 'acc-prl' }
    }),
    border: {
      rings: [420, 454].map((r) => ({ cx: C, cy: C, r, cls: 'g-fine' })),
      triangles: triangles()
    }
  }
}
