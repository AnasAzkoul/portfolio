import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Cartouche from './Cartouche.vue'

const props = {
  number: '01',
  name: 'LearnFlow',
  meta: 'NUXT · HONO · CLOUDFLARE · AI',
  to: '/work/learnflow',
  jewel: 'red'
} as const

describe('Cartouche', () => {
  it('links to its project', async () => {
    const wrapper = await mountSuspended(Cartouche, { props })
    expect(wrapper.find('a').attributes('href')).toBe('/work/learnflow')
  })

  it('shows the number, the project name and the stack meta line', async () => {
    const wrapper = await mountSuspended(Cartouche, { props })
    expect(wrapper.find('[data-cartouche-number]').text()).toBe('01')
    expect(wrapper.find('[data-cartouche-name]').text()).toBe('LearnFlow')
    expect(wrapper.find('[data-cartouche-meta]').text()).toBe(
      'NUXT · HONO · CLOUDFLARE · AI'
    )
  })

  it('inlays an 8-point star, hidden from assistive tech', async () => {
    const wrapper = await mountSuspended(Cartouche, { props })
    const svg = wrapper.find('svg')
    expect(svg.attributes('aria-hidden')).toBe('true')
    const d = svg.find('[data-star]').attributes('d') ?? ''
    // 16 vertices: one move-to and 15 line-tos.
    expect(d.match(/[ML]/g)).toHaveLength(16)
  })

  it.each([
    ['red', 'fill-red'],
    ['pearl', 'fill-pearl'],
    ['green', 'fill-green'],
    ['gold', 'fill-gold-hi']
  ] as const)('sets a %s jewel dot in the star', async (jewel, fill) => {
    const wrapper = await mountSuspended(Cartouche, {
      props: { ...props, jewel }
    })
    expect(wrapper.find('circle[data-jewel]').classes()).toContain(fill)
  })

  it('emits its bounding-box centre on click', async () => {
    const wrapper = await mountSuspended(Cartouche, { props })
    const link = wrapper.find('a')
    link.element.getBoundingClientRect = () =>
      ({ left: 100, top: 40, width: 190, height: 190 }) as DOMRect
    await link.trigger('click')
    expect(wrapper.emitted('open')).toEqual([[{ x: 195, y: 135 }]])
  })

  it.each([
    ['meta', { metaKey: true }],
    ['ctrl', { ctrlKey: true }],
    ['shift', { shiftKey: true }],
    ['alt', { altKey: true }],
    ['middle-button', { button: 1 }]
  ])("doesn't emit on a %s click, which opens elsewhere", async (_, init) => {
    const wrapper = await mountSuspended(Cartouche, { props })
    await wrapper.find('a').trigger('click', init)
    expect(wrapper.emitted('open')).toBeUndefined()
  })
})
