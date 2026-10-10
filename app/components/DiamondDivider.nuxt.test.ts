import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import DiamondDivider from './DiamondDivider.vue'

describe('DiamondDivider', () => {
  it('is decoration, hidden from assistive tech', async () => {
    const wrapper = await mountSuspended(DiamondDivider)
    expect(wrapper.attributes('aria-hidden')).toBe('true')
  })

  it('draws a diamond nested in a diamond, with a dot at the centre', async () => {
    const wrapper = await mountSuspended(DiamondDivider)
    expect(wrapper.findAll('path').map((p) => p.attributes('d'))).toEqual([
      'M22 2 L42 22 L22 42 L2 22 Z',
      'M22 9 L35 22 L22 35 L9 22 Z'
    ])
    const dot = wrapper.find('circle')
    expect([dot.attributes('cx'), dot.attributes('cy')]).toEqual(['22', '22'])
  })

  it.each([
    [undefined, 'size-11'],
    ['default', 'size-11'],
    ['small', 'size-[26px]']
  ] as const)('size %s is %s', async (size, sizeClass) => {
    const wrapper = await mountSuspended(DiamondDivider, { props: { size } })
    expect(wrapper.classes()).toContain(sizeClass)
  })
})
