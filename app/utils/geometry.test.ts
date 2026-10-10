import { describe, expect, it } from 'vitest'
import { girih, poly, pt, star } from './geometry'

describe('pt', () => {
  it('returns the point at radius r and angle a around the default centre', () => {
    const [x, y] = pt(100, 0)
    expect(x).toBeCloseTo(600)
    expect(y).toBeCloseTo(500)
  })

  it('measures angles clockwise from the +x axis (SVG y points down)', () => {
    const [x, y] = pt(100, Math.PI / 2)
    expect(x).toBeCloseTo(500)
    expect(y).toBeCloseTo(600)
  })

  it('accepts a custom centre', () => {
    const [x, y] = pt(10, 0, 20, 30)
    expect(x).toBeCloseTo(30)
    expect(y).toBeCloseTo(30)
  })
})

describe('poly', () => {
  it('draws a closed square', () => {
    expect(poly(0, 0, 10, 4, 0)).toBe(
      'M10.00 0.00 L0.00 10.00 L-10.00 0.00 L-0.00 -10.00 Z'
    )
  })
})

describe('star', () => {
  it('alternates outer and inner radii and closes', () => {
    expect(star(0, 0, 10, 5, 2, 0)).toBe(
      'M10.00 0.00 L0.00 5.00 L-10.00 0.00 L-0.00 -5.00 Z'
    )
  })

  it('has 2n vertices', () => {
    expect(star(0, 0, 10, 5, 8, 0).match(/[ML]/g)).toHaveLength(16)
  })
})

describe('girih', () => {
  it('connects every skip-th vertex and stays open', () => {
    expect(girih(0, 0, 10, 4, 1, 0)).toBe(
      'M10.00 0.00 L0.00 10.00 L-10.00 0.00 L-0.00 -10.00 L10.00 -0.00'
    )
  })

  it('returns to the start after n steps, drawing a star polygon', () => {
    const d = girih(0, 0, 10, 8, 3, 0)
    expect(d.match(/[ML]/g)).toHaveLength(9)
    expect(d.endsWith('Z')).toBe(false)
  })
})
