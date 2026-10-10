import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import MosaicLattice from './MosaicLattice.vue'

describe('MosaicLattice', () => {
  it('renders every layer declaratively', async () => {
    const wrapper = await mountSuspended(MosaicLattice)
    expect(wrapper.findAll('g.hot')).toHaveLength(8)
    // 16 rays + 3 inner + 3 mid + 16 hot + 2 rosette + 56 triangles
    expect(wrapper.findAll('path')).toHaveLength(16 + 3 + 3 + 16 + 2 + 56)
    // 8 hit + 8 dots + 16 pearls + 2 rings
    expect(wrapper.findAll('circle')).toHaveLength(8 + 8 + 16 + 2)
  })
})
