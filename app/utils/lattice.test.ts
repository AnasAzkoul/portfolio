import { describe, expect, it } from 'vitest'
import { buildLattice, type Lattice } from './lattice'
import prototype from './prototype-lattice.fixture.json'

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
    ...l.rosette,
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
  it('matches the prototype generator shape for shape', () => {
    expect(flatten(lattice)).toEqual(prototype)
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

  it('has a mid octagon with its two interlaces', () => {
    expect(lattice.mid.map((p) => p.cls)).toEqual([
      'g-line',
      'g-fine',
      'g-fine'
    ])
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

  it('has an outer rosette of a star and an interlace', () => {
    expect(lattice.rosette).toHaveLength(2)
  })

  it('places 16 pearl dots on the inner star tips', () => {
    expect(lattice.pearls).toHaveLength(16)
    expect(lattice.pearls.every((p) => p.cls === 'acc-prl')).toBe(true)
  })

  it('frames the lattice with two rings and 56 alternating triangles', () => {
    expect(lattice.border.rings.map((r) => r.r)).toEqual([420, 454])
    expect(lattice.border.triangles).toHaveLength(56)
    expect(lattice.border.triangles[0]!.cls).toBe('g-fine')
    expect(lattice.border.triangles[1]!.cls).toBe('g-pearl')
    expect(lattice.border.triangles[0]!.d).toMatch(/^M[^Z]+Z$/)
  })
})
