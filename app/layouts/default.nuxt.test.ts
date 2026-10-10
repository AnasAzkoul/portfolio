import { beforeAll, describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { h } from 'vue'
import DefaultLayout from './default.vue'

const Blank = { render: () => null }

// The pages arrive with ANA-65; stand in for them with the meta they will set.
beforeAll(() => {
  const router = useRouter()
  router.addRoute({
    path: '/work',
    component: Blank,
    meta: { turn: 1, crumb: 'WORK' }
  })
  router.addRoute({
    path: '/work/:slug',
    component: Blank,
    meta: { turn: 1, crumb: 'WORK' }
  })
  router.addRoute({
    path: '/story',
    component: Blank,
    meta: { turn: 3, crumb: 'STORY' }
  })
})

function mountAt(route: string) {
  return mountSuspended(DefaultLayout, {
    route,
    slots: { default: () => h('p', { 'data-view': '' }, 'the view') }
  })
}

describe('default layout', () => {
  it('fills the viewport and never scrolls', async () => {
    const wrapper = await mountAt('/')
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['h-dvh', 'overflow-hidden'])
    )
  })

  it('renders the view in the view area, above the overlays', async () => {
    const wrapper = await mountAt('/')
    const area = wrapper.find('[data-view-area]')
    expect(area.classes()).toEqual(expect.arrayContaining(['absolute', 'z-2']))
    expect(area.find('[data-view]').text()).toBe('the view')
  })

  it('lays the lattice and both overlays behind the view, hidden from assistive tech', async () => {
    const wrapper = await mountAt('/')
    expect(wrapper.find('[data-lattice] svg').exists()).toBe(true)
    for (const overlay of ['glow', 'vignette']) {
      const el = wrapper.find(`[data-overlay="${overlay}"]`)
      expect(el.exists()).toBe(true)
      expect(el.attributes('aria-hidden')).toBe('true')
    }
  })

  it.each([
    ['/', '0deg'],
    ['/work', '22.5deg'],
    ['/story', '67.5deg']
  ])('turns the lattice by the page meta on %s', async (route, angle) => {
    const wrapper = await mountAt(route)
    expect(wrapper.find('[data-lattice] svg').attributes('style')).toContain(
      `--turn: ${angle}`
    )
  })

  it('links the mark home', async () => {
    const wrapper = await mountAt('/work')
    const mark = wrapper.find('[data-mark]')
    expect(mark.attributes('href')).toBe('/')
    expect(mark.text()).toBe('A. AZKOUL · EST. DAMASCUS')
  })

  it('names the nav and links every section', async () => {
    const wrapper = await mountAt('/')
    const nav = wrapper.find('nav')
    expect(nav.attributes('aria-label')).toBe('Sections')
    expect(
      nav.findAll('a').map((a) => [a.text(), a.attributes('href')])
    ).toEqual([
      ['WORK', '/work'],
      ['STACK', '/stack'],
      ['STORY', '/story'],
      ['CONTACT', '/contact']
    ])
  })

  it.each([
    ['/', []],
    ['/work', ['WORK']],
    ['/work/variant-system', ['WORK']],
    ['/story', ['STORY']]
  ])('marks the current section on %s', async (route, current) => {
    const wrapper = await mountAt(route)
    const marked = wrapper
      .findAll('nav a')
      .filter((a) => a.attributes('aria-current') === 'page')
      .map((a) => a.text())
    expect(marked).toEqual(current)
  })

  it.each([
    ['/', '— SELECT A SECTION —'],
    ['/work/variant-system', '— WORK —']
  ])('shows the breadcrumb from the page meta on %s', async (route, text) => {
    const wrapper = await mountAt(route)
    const crumb = wrapper.find('[data-crumb]')
    expect(crumb.text()).toBe(text)
    expect(crumb.attributes('aria-hidden')).toBe('true')
  })
})
