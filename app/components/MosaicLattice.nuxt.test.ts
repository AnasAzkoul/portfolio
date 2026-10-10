import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import MosaicLattice from './MosaicLattice.vue'

describe('MosaicLattice', () => {
  it('renders every lattice shape into the SVG', async () => {
    const lattice = buildLattice()
    const wrapper = await mountSuspended(MosaicLattice)

    const paths = [
      ...lattice.rays,
      ...lattice.inner,
      ...lattice.mid,
      ...lattice.hotStars.flatMap((s) => s.paths),
      ...lattice.rosette,
      ...lattice.border.triangles
    ]
    expect(wrapper.findAll('path').map((p) => p.attributes('d'))).toEqual(
      paths.map((p) => p.d)
    )

    const circles = [
      ...lattice.hotStars.flatMap((s) => [s.hit, s.dot]),
      ...lattice.pearls,
      ...lattice.border.rings
    ]
    expect(wrapper.findAll('circle')).toHaveLength(circles.length)
    expect(wrapper.findAll('g.hot')).toHaveLength(lattice.hotStars.length)
  })

  it('is decorative: hidden from assistive tech', async () => {
    const wrapper = await mountSuspended(MosaicLattice)
    expect(wrapper.find('svg').attributes('aria-hidden')).toBe('true')
  })
})
