import { describe, expect, it } from 'vitest'
import { CENTER as C, girih, star } from './geometry'
import { buildLattice, type Lattice } from './lattice'
import prototype from './prototype-lattice.fixture.json'

// Lines the prototype drew that we took out on purpose: they crossed the
// centre between the hot stars and made it look crowded.
const REMOVED_FROM_PROTOTYPE = [
  // Star-to-star lines: each hot star joined to the one three places over.
  girih(C, C, 252, 8, 3, Math.PI / 8),
  // Two overlapping squares, their corners between the hot stars.
  girih(C, C, 252, 8, 2, 0),
  // The outer rosette: a big 16-point star and its long interlace.
  star(C, C, 362, 252, 16, Math.PI / 16),
  girih(C, C, 362, 16, 6, Math.PI / 16)
]

/** The lattice as one flat list in paint order, hot stars nested as groups. */
function flatten(l: Lattice) {
  const round = (n: number) => +n.toFixed(2)
  const circle = (c: { cx: number; cy: number; r: number; cls: string }) => ({
    cx: round(c.cx),
    cy: round(c.cy),
    r: c.r,
    cls: c.cls
  })
  return [
    ...l.rays,
    ...l.inner,
    ...l.mid,
    ...l.hotStars.map((s) => ({
      g: 'hot',
      kids: [circle(s.hit), ...s.paths, circle(s.dot)]
    })),
    ...l.pearls.map(circle),
    ...l.border.rings.map(circle),
    ...l.border.triangles
  ]
}

describe('buildLattice', () => {
  const lattice = buildLattice()

  // Golden file: the shapes the prototype's imperative generator emitted
  // (docs/prototype/damascus-onepager.html), in paint order. Guards every
  // path, radius, rotation and class against drift.
  it('matches the prototype generator shape for shape, minus the removed lines', () => {
    const kept = prototype.filter(
      (shape) =>
        !REMOVED_FROM_PROTOTYPE.some((d) => 'd' in shape && shape.d === d)
    )
    // Every removed line really was in the prototype.
    expect(prototype.length - kept.length).toBe(REMOVED_FROM_PROTOTYPE.length)
    expect(flatten(lattice)).toEqual(kept)
  })

  it('radiates 16 lines from the inner ring to the border', () => {
    expect(lattice.rays).toHaveLength(16)
    expect(lattice.rays[0]).toEqual({
      d: 'M596.0 500.0L952.0 500.0',
      cls: 'g-fine'
    })
  })

  it('has an inner octagon, star and interlace', () => {
    expect(lattice.inner.map((p) => p.cls)).toEqual([
      'g-line2',
      'g-line',
      'g-fine'
    ])
  })

  it('has a mid octagon joining the hot stars, and nothing across it', () => {
    expect(lattice.mid.map((p) => p.cls)).toEqual(['g-line'])
  })

  it('sets eight hot stars on the octagon, cycling the jewel accents', () => {
    expect(lattice.hotStars).toHaveLength(8)
    expect(lattice.hotStars.map((s) => s.dot.cls)).toEqual([
      'acc-red',
      'acc-prl',
      'acc-grn',
      'acc-prl',
      'acc-red',
      'acc-prl',
      'acc-grn',
      'acc-prl'
    ])
    const { hit } = lattice.hotStars[0]!
    expect(Math.hypot(hit.cx - 500, hit.cy - 500)).toBeCloseTo(252)
    expect(hit.r).toBe(50)
  })

  it('places 16 pearl dots on the inner star tips', () => {
    expect(lattice.pearls).toHaveLength(16)
    expect(lattice.pearls.every((p) => p.cls === 'acc-prl')).toBe(true)
  })

  // Node and the browser can differ in the last digit of Math.sin, which
  // would make the server-rendered SVG fail to hydrate.
  it('rounds every circle centre to 2 decimals, as the paths are', () => {
    const circles = [
      ...lattice.hotStars.flatMap((s) => [s.hit, s.dot]),
      ...lattice.pearls,
      ...lattice.border.rings
    ]
    for (const { cx, cy } of circles) {
      expect(cx).toBe(+cx.toFixed(2))
      expect(cy).toBe(+cy.toFixed(2))
    }
  })

  it('frames the lattice with two rings and 56 alternating triangles', () => {
    expect(lattice.border.rings.map((r) => r.r)).toEqual([420, 454])
    expect(lattice.border.triangles).toHaveLength(56)
    expect(lattice.border.triangles[0]!.cls).toBe('g-fine')
    expect(lattice.border.triangles[1]!.cls).toBe('g-pearl')
    expect(lattice.border.triangles[0]!.d).toMatch(/^M[^Z]+Z$/)
  })
})
