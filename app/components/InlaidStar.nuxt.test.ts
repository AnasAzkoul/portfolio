import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import InlaidStar from './InlaidStar.vue'

describe('InlaidStar', () => {
  it('draws an 8-point star, hidden from assistive tech', async () => {
    const wrapper = await mountSuspended(InlaidStar, {
      props: { jewel: 'red' }
    })
    expect(wrapper.attributes('aria-hidden')).toBe('true')
    const d = wrapper.find('path').attributes('d') ?? ''
    // 16 vertices: one move-to and 15 line-tos.
    expect(d.match(/[ML]/g)).toHaveLength(16)
  })

  it.each([
    ['red', 'fill-red'],
    ['pearl', 'fill-pearl'],
    ['green', 'fill-green'],
    ['gold', 'fill-gold-hi']
  ] as const)('sets a %s jewel at its heart', async (jewel, fill) => {
    const wrapper = await mountSuspended(InlaidStar, { props: { jewel } })
    expect(wrapper.find('circle[data-jewel]').classes()).toContain(fill)
  })
})
