import { afterEach, describe, expect, it, vi } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { h, nextTick } from 'vue'
import DefaultLayout from './default.vue'

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

  it('tells the view how tall it can be, clear of the corner chrome', async () => {
    const wrapper = await mountAt('/')
    expect(wrapper.find('[data-view-area]').classes()).toEqual(
      expect.arrayContaining([
        'pt-[90px]',
        'pb-[70px]',
        '[--view-height:calc(100dvh_-_160px)]',
        'max-[720px]:pt-[70px]',
        'max-[720px]:pb-6',
        'max-[720px]:[--view-height:calc(100dvh_-_94px)]'
      ])
    )
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

  it('fits the whole lattice on screen, clear of the top and bottom chrome', async () => {
    const wrapper = await mountAt('/')
    expect(wrapper.find('[data-lattice-place]').classes()).toContain(
      'size-[min(100dvh_-_96px,100vw)]'
    )
  })

  it.each([
    ['/', 'centre'],
    ['/experience', 'focus'],
    ['/projects', 'horizon'],
    ['/projects/learnflow', 'horizon'],
    ['/contact', 'beside']
  ])('sets the stage layout from the page meta on %s', async (route, stage) => {
    const wrapper = await mountAt(route)
    expect(wrapper.attributes('data-stage')).toBe(stage)
  })

  it('from 1280px, stands the lattice where the stage layout puts it, and glides it there', async () => {
    const wrapper = await mountAt('/contact')
    expect(wrapper.classes()).toContain(
      '[--lattice-size:min(100dvh_-_160px,46vw)]'
    )
    expect(wrapper.find('[data-lattice-place]').classes()).toEqual(
      expect.arrayContaining([
        'min-[1280px]:absolute',
        'min-[1280px]:size-(--lattice-size)',
        'transition-[left,top,width,height,opacity,visibility]',
        'motion-reduce:transition-none'
      ])
    )
  })

  it('in focus, fades the lattice away from 1280px', async () => {
    const focus = await mountAt('/experience')
    expect(focus.find('[data-lattice-place]').classes()).toContain(
      'min-[1280px]:opacity-0'
    )
    const centre = await mountAt('/')
    expect(centre.find('[data-lattice-place]').classes()).not.toContain(
      'min-[1280px]:opacity-0'
    )
  })

  it('over the horizon, stands the view at the top from 1280px', async () => {
    const wrapper = await mountAt('/projects')
    expect(wrapper.find('[data-view-area]').classes()).toContain(
      'min-[1280px]:justify-start'
    )
  })

  it('fades the lattice in shortly after it mounts', async () => {
    const wrapper = await mountAt('/')
    const lattice = wrapper.find('[data-lattice]')
    expect(lattice.classes()).toContain('opacity-0')
    await vi.waitFor(() => expect(lattice.classes()).not.toContain('opacity-0'))
  })

  it.each([
    ['/', '0deg'],
    ['/experience', '22.5deg'],
    ['/projects', '45deg'],
    ['/contact', '112.5deg']
  ])('turns the lattice by the page meta on %s', async (route, angle) => {
    const wrapper = await mountAt(route)
    expect(wrapper.find('[data-lattice] svg').attributes('style')).toContain(
      `--turn: ${angle}`
    )
  })

  it('links the mark, the name, home', async () => {
    const wrapper = await mountAt('/projects')
    const mark = wrapper.find('[data-mark]')
    expect(mark.attributes('href')).toBe('/')
    expect(mark.text()).toBe('Anas Azkoul')
  })

  it('names each section in the nav in sentence case, and links it', async () => {
    const wrapper = await mountAt('/')
    const nav = wrapper.find('nav')
    expect(nav.attributes('aria-label')).toBe('Sections')
    expect(
      nav.findAll('a').map((a) => [a.text(), a.attributes('href')])
    ).toEqual([
      ['Experience', '/experience'],
      ['Projects', '/projects'],
      ['Stack', '/stack'],
      ['Story', '/story'],
      ['Contact', '/contact']
    ])
  })

  it.each([
    ['/', []],
    ['/projects', ['Projects']],
    ['/projects/learnflow', ['Projects']],
    ['/story', ['Story']]
  ])('marks the current section on %s', async (route, current) => {
    const wrapper = await mountAt(route)
    const marked = wrapper
      .findAll('nav a')
      .filter((a) => a.attributes('aria-current') === 'page')
      .map((a) => a.text())
    expect(marked).toEqual(current)
  })

  it('shows the breadcrumb from the page meta', async () => {
    const wrapper = await mountAt('/projects/learnflow')
    const crumb = wrapper.find('[data-crumb]')
    expect(crumb.text()).toBe('— PROJECTS —')
    expect(crumb.attributes('aria-hidden')).toBe('true')
  })

  it('shows no breadcrumb on Home, which names no crumb', async () => {
    const wrapper = await mountAt('/')
    expect(wrapper.find('[data-crumb]').exists()).toBe(false)
  })
})

describe('section menu', () => {
  type Wrapper = Awaited<ReturnType<typeof mountAt>>

  const toggle = (wrapper: Wrapper) => wrapper.find('[data-menu-toggle]')
  const menu = (wrapper: Wrapper) => wrapper.find('[data-section-menu]')

  async function openAt(route: string) {
    const wrapper = await mountAt(route)
    await toggle(wrapper).trigger('click')
    return wrapper
  }

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('stands in for the nav below 900px', async () => {
    const wrapper = await mountAt('/')
    expect(wrapper.find('nav').classes()).toContain('max-[900px]:hidden')
    expect(toggle(wrapper).element.parentElement?.classList).toContain(
      'min-[900px]:hidden'
    )
  })

  it('starts closed, behind a button named "Sections"', async () => {
    const wrapper = await mountAt('/')
    expect(toggle(wrapper).attributes('aria-label')).toBe('Sections')
    expect(toggle(wrapper).attributes('aria-expanded')).toBe('false')
    expect(menu(wrapper).exists()).toBe(false)
  })

  it('opens a numbered index of the sections, and the button becomes "Close sections"', async () => {
    const wrapper = await openAt('/')
    expect(toggle(wrapper).attributes('aria-label')).toBe('Close sections')
    expect(toggle(wrapper).attributes('aria-expanded')).toBe('true')
    expect(toggle(wrapper).attributes('aria-controls')).toBe(
      menu(wrapper).attributes('id')
    )
    expect(menu(wrapper).find('nav').attributes('aria-label')).toBe('Sections')
    expect(
      menu(wrapper)
        .findAll('a')
        .map((a) => [
          a.find('[data-number]').text(),
          a.find('[data-name]').text(),
          a.find('[data-subtitle]').text(),
          a.attributes('href')
        ])
    ).toEqual([
      ['01', 'Experience', 'Work experience', '/experience'],
      ['02', 'Projects', 'Selected projects', '/projects'],
      ['03', 'Stack', 'Tools of the craft', '/stack'],
      ['04', 'Story', 'How I came to the frontend', '/story'],
      ['05', 'Contact', 'Open to frontend roles in NL', '/contact']
    ])
  })

  it('lists the same sections as the nav', async () => {
    const wrapper = await openAt('/')
    const hrefs = (links: ReturnType<Wrapper['findAll']>) =>
      links.map((a) => a.attributes('href'))
    expect(hrefs(menu(wrapper).findAll('a'))).toEqual(
      hrefs(wrapper.find('nav').findAll('a'))
    )
  })

  it.each([
    ['/', []],
    ['/projects', ['Projects']],
    ['/projects/learnflow', ['Projects']],
    ['/story', ['Story']]
  ])('marks the current section on %s', async (route, current) => {
    const wrapper = await openAt(route)
    const marked = menu(wrapper)
      .findAll('a')
      .filter((a) => a.attributes('aria-current') === 'page')
      .map((a) => a.find('[data-name]').text())
    expect(marked).toEqual(current)
  })

  it('turns the star into an X while open', async () => {
    const wrapper = await mountAt('/')
    const squares = () =>
      toggle(wrapper)
        .findAll('[data-square]')
        .map((square) => square.classes())
    expect(squares()[0]).toContain('rotate-0')
    expect(squares()[1]).toContain('rotate-45')

    await toggle(wrapper).trigger('click')
    expect(squares()[0]).toEqual(
      expect.arrayContaining(['rotate-45', 'scale-x-[1.45]', 'scale-y-[0.23]'])
    )
    expect(squares()[1]).toEqual(
      expect.arrayContaining([
        'rotate-[135deg]',
        'scale-x-[1.45]',
        'scale-y-[0.23]'
      ])
    )
  })

  it('makes the page behind it inert while open, but not the mark', async () => {
    const wrapper = await mountAt('/')
    const area = wrapper.find('[data-view-area]')
    expect(area.attributes('inert')).toBeUndefined()
    await toggle(wrapper).trigger('click')
    expect(area.attributes('inert')).toBeDefined()
    expect(wrapper.find('[data-mark]').attributes('inert')).toBeUndefined()
    await toggle(wrapper).trigger('click')
    expect(area.attributes('inert')).toBeUndefined()
  })

  it('keeps the mark above the open menu', async () => {
    const wrapper = await openAt('/')
    expect(wrapper.find('[data-mark]').classes()).toContain('z-5')
    expect(menu(wrapper).classes()).toContain('z-4')
  })

  it('closes on the X', async () => {
    const wrapper = await openAt('/')
    await toggle(wrapper).trigger('click')
    expect(menu(wrapper).exists()).toBe(false)
    expect(toggle(wrapper).attributes('aria-expanded')).toBe('false')
  })

  it('closes on Escape and hands focus back to the button', async () => {
    const wrapper = await mountSuspended(DefaultLayout, {
      route: '/',
      attachTo: document.body
    })
    await toggle(wrapper).trigger('click')
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await nextTick()
    expect(menu(wrapper).exists()).toBe(false)
    expect(document.activeElement).toBe(toggle(wrapper).element)
    wrapper.unmount()
  })

  it('closes when the current section is picked again', async () => {
    const wrapper = await openAt('/projects')
    await menu(wrapper).find('a[href="/projects"]').trigger('click')
    expect(menu(wrapper).exists()).toBe(false)
  })

  it('hands focus back to the button when the current section is picked again', async () => {
    const wrapper = await mountSuspended(DefaultLayout, {
      route: '/projects',
      attachTo: document.body
    })
    await toggle(wrapper).trigger('click')
    const current = menu(wrapper).find('a[href="/projects"]')
    ;(current.element as HTMLElement).focus()
    await current.trigger('click')
    expect(menu(wrapper).exists()).toBe(false)
    expect(document.activeElement).toBe(toggle(wrapper).element)
    wrapper.unmount()
  })

  it('closes on any navigation', async () => {
    const wrapper = await openAt('/')
    await useRouter().push('/stack')
    await nextTick()
    expect(menu(wrapper).exists()).toBe(false)
  })

  it('closes when the screen grows to 900px, where the nav takes over', async () => {
    const wideScreen = window.matchMedia('(min-width: 900px)')
    vi.spyOn(window, 'matchMedia').mockReturnValue(wideScreen)
    const wrapper = await openAt('/')
    wideScreen.dispatchEvent(
      new MediaQueryListEvent('change', {
        matches: true,
        media: '(min-width: 900px)'
      })
    )
    await nextTick()
    expect(menu(wrapper).exists()).toBe(false)
  })
})
