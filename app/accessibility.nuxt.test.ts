import { afterEach, describe, expect, it, vi } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import {
  enableAutoUnmount,
  type BaseWrapper,
  type DOMWrapper
} from '@vue/test-utils'
import App from '~/app.vue'

// Mounted into the document, so focus really moves, and with real
// transitions (the test utils stub them), so a page transition plays as it
// does for a visitor. Each test unmounts its app, so no earlier one is left
// listening for keys or navigations.
function visit(route: string) {
  return mountSuspended(App, {
    route,
    attachTo: document.body,
    global: { stubs: { transition: false } }
  })
}

enableAutoUnmount(afterEach)

type Wrapper = Awaited<ReturnType<typeof visit>>

const focusedText = () => document.activeElement?.textContent?.trim()

// Everything the keyboard can reach: links, buttons, disclosure toggles and
// other tab stops.
const tabbable = (within: BaseWrapper<Node>) =>
  within
    .findAll('a[href], button, summary, [tabindex]')
    .filter((el) => el.attributes('tabindex') !== '-1')

// Long enough for anything that was going to happen to have happened.
const settle = () => new Promise((resolve) => setTimeout(resolve, 50))

// Every view, an open case study included.
const views = [
  '/',
  '/experience',
  '/projects',
  '/projects/client-portfolio',
  '/stack',
  '/story',
  '/contact'
]

describe('after each navigation', () => {
  it("moves focus to the new view's heading", async () => {
    await visit('/')
    await useRouter().push('/stack')
    await vi.waitFor(() => expect(focusedText()).toBe('Stack'))
    expect(document.activeElement?.tagName).toBe('H2')
  })

  it("moves focus to a case study's heading, not the index's under it", async () => {
    await visit('/projects')
    await useRouter().push('/projects/learnflow')
    await vi.waitFor(() => expect(focusedText()).toBe('LearnFlow'))
  })

  it("moves focus back to the index's heading when a case study closes", async () => {
    await visit('/projects/learnflow')
    await useRouter().push('/projects')
    await vi.waitFor(() => expect(focusedText()).toBe('Projects'))
  })

  it('moves focus to the picked section, out of the closing section menu', async () => {
    const wrapper = await visit('/')
    await wrapper.find('[data-menu-toggle]').trigger('click')
    await useRouter().push('/story')
    await vi.waitFor(() => expect(focusedText()).toBe('Story'))
  })

  it('waits for a page transition to bring the new view in', async () => {
    // An out-in transition: the old view leaves before the new one arrives.
    const transitioned = useRouter()
      .getRoutes()
      .filter((r) => r.path === '/' || r.path === '/stack')
    for (const r of transitioned) {
      r.meta.pageTransition = { name: 'page', mode: 'out-in' }
    }
    try {
      await visit('/')
      await useRouter().push('/stack')
      await vi.waitFor(() => expect(focusedText()).toBe('Stack'))
    } finally {
      for (const r of transitioned) delete r.meta.pageTransition
    }
  })

  it('leaves focus at the top of the document on the first load', async () => {
    await visit('/story')
    await settle()
    expect(document.activeElement).toBe(document.body)
  })
})

describe('Escape', () => {
  // Cancelable, like a real key press, so a handler can claim it.
  const pressEscape = () =>
    window.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', cancelable: true })
    )
  const currentPath = () => useRouter().currentRoute.value.fullPath

  it.each([
    ['/projects/learnflow', '/projects'],
    ['/projects', '/'],
    ['/experience', '/'],
    ['/contact', '/']
  ])('closes %s back to %s', async (route, closedTo) => {
    await visit(route)
    pressEscape()
    await vi.waitFor(() => expect(currentPath()).toBe(closedTo))
  })

  it('adds the closing to the history, so Back reopens the view', async () => {
    await visit('/stack')
    pressEscape()
    await vi.waitFor(() => expect(currentPath()).toBe('/'))
    useRouter().back()
    await vi.waitFor(() => expect(currentPath()).toBe('/stack'))
  })

  it('closes one view per press, however long Escape is held', async () => {
    await visit('/projects/learnflow')
    pressEscape()
    await vi.waitFor(() => expect(currentPath()).toBe('/projects'))
    // The key repeating while held down.
    window.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'Escape',
        repeat: true,
        cancelable: true
      })
    )
    await settle()
    expect(currentPath()).toBe('/projects')
  })

  it('does nothing on Home', async () => {
    await visit('/')
    pressEscape()
    await settle()
    expect(currentPath()).toBe('/')
  })

  it('only closes the section menu while it is open', async () => {
    const wrapper = await visit('/stack')
    await wrapper.find('[data-menu-toggle]').trigger('click')
    pressEscape()
    await vi.waitFor(() =>
      expect(wrapper.find('[data-section-menu]').exists()).toBe(false)
    )
    await settle()
    expect(currentPath()).toBe('/stack')
  })
})

describe('focus styles', () => {
  // Everything the keyboard can reach that lacks the 2px gold focus outline.
  const unoutlined = (wrapper: Wrapper) =>
    tabbable(wrapper)
      .filter(
        (el) =>
          !el.classes().includes('focus-visible:outline-2') ||
          !el.classes().includes('focus-visible:outline-gold')
      )
      .map((el) => el.text() || el.html())

  it.each(views)(
    'outlines everything focusable in 2px of gold on %s',
    async (route) => {
      const wrapper = await visit(route)
      expect(unoutlined(wrapper)).toEqual([])
    }
  )

  it('outlines the open section menu in 2px of gold', async () => {
    const wrapper = await visit('/')
    await wrapper.find('[data-menu-toggle]').trigger('click')
    expect(wrapper.findAll('[data-section-menu] a')).not.toHaveLength(0)
    expect(unoutlined(wrapper)).toEqual([])
  })
})

describe('text size', () => {
  // Each element set in a size under 12px, by its `text-[…px]` classes (a
  // clamp's first value is its smallest), with its text. happy-dom applies
  // no styles, so the classes are what there is to read.
  const tooSmall = (wrapper: Wrapper) =>
    wrapper.findAll('*').flatMap((el) =>
      el
        .classes()
        .map((c) => c.match(/(?:^|:)text-\[(?:clamp\()?([\d.]+)px/)?.[1])
        .filter((size) => size !== undefined && Number(size) < 12)
        .map((size) => `${size}px: ${el.text()}`)
    )

  it.each(views)('sets no text under 12px on %s', async (route) => {
    const wrapper = await visit(route)
    expect(tooSmall(wrapper)).toEqual([])
  })

  it('sets no text under 12px in the open section menu', async () => {
    const wrapper = await visit('/')
    await wrapper.find('[data-menu-toggle]').trigger('click')
    expect(wrapper.find('[data-section-menu]').exists()).toBe(true)
    expect(tooSmall(wrapper)).toEqual([])
  })
})

describe('symbols', () => {
  // Each run of text with an arrow in it that a screen reader would read out.
  const spokenArrows = (wrapper: Wrapper) =>
    wrapper
      .findAll('*')
      .flatMap(({ element }) =>
        [...element.childNodes]
          .filter(
            (node) =>
              node.nodeType === Node.TEXT_NODE &&
              /[→↗↓]/.test(node.textContent ?? '') &&
              !element.closest('[aria-hidden="true"]')
          )
          .map((node) => node.textContent?.trim())
      )

  it.each(views)(
    'hides every arrow from screen readers on %s',
    async (route) => {
      const wrapper = await visit(route)
      expect(spokenArrows(wrapper)).toEqual([])
    }
  )
})

describe('tab order', () => {
  // What a screen reader names a stop: its label, or else its text, less
  // anything hidden from assistive tech.
  const spokenName = (el: DOMWrapper<Element>) => {
    const label = el.attributes('aria-label')
    if (label) return label
    const copy = el.element.cloneNode(true) as Element
    copy.querySelectorAll('[aria-hidden="true"]').forEach((h) => h.remove())
    return copy.textContent?.replace(/\s+/g, ' ').trim()
  }

  // What a screen reader names each stop the keyboard reaches, in order.
  const stops = (wrapper: Wrapper) =>
    tabbable(wrapper)
      .filter((el) => !el.element.closest('[inert]'))
      .map(spokenName)

  it('runs from the mark and the sections into the view, as the page reads', async () => {
    const wrapper = await visit('/contact')
    expect(stops(wrapper)).toEqual([
      'Anas Azkoul',
      'Experience',
      'Projects',
      'Stack',
      'Story',
      'Contact',
      'Sections',
      'GitHub @ANASAZKOUL, opens in a new tab',
      'CV DOWNLOAD (PDF)'
    ])
  })

  it.each([
    '/',
    '/experience',
    '/projects',
    '/projects/learnflow',
    '/stack',
    '/story',
    '/contact'
  ])(
    'runs through the mark and sections, then the view, on %s',
    async (route) => {
      const wrapper = await visit(route)
      const viewStops = tabbable(wrapper.find('main'))
        .filter((el) => !el.element.closest('[inert]'))
        .map(spokenName)
      expect(stops(wrapper)).toEqual([
        'Anas Azkoul',
        'Experience',
        'Projects',
        'Stack',
        'Story',
        'Contact',
        'Sections',
        ...viewStops
      ])
    }
  )

  it('passes over the Projects index while a case study is open over it', async () => {
    const wrapper = await visit('/projects/client-portfolio')
    expect(stops(wrapper).slice(7)).toEqual([
      'Back to all projects',
      'github.com/AnasAzkoul/martin-portfolio, opens in a new tab'
    ])
  })

  it('keeps to the mark and the section menu while the menu is open', async () => {
    const wrapper = await visit('/contact')
    await wrapper.find('[data-menu-toggle]').trigger('click')
    expect(stops(wrapper)).toEqual([
      'Anas Azkoul',
      'Experience',
      'Projects',
      'Stack',
      'Story',
      'Contact',
      'Close sections',
      '01ExperienceWork experience',
      '02ProjectsSelected projects',
      '03StackTools of the craft',
      '04StoryHow I came to the frontend',
      '05ContactOpen to frontend roles in NL'
    ])
  })

  it('puts the view in the main landmark', async () => {
    const wrapper = await visit('/contact')
    expect(wrapper.find('main').find('section h2').text()).toBe('Contact')
  })
})

describe('route announcements', () => {
  it('declares the page English, so screen readers pick the right voice', async () => {
    await visit('/')
    await vi.waitFor(() => expect(document.documentElement.lang).toBe('en'))
  })

  it.each([
    ['/', 'Anas Azkoul'],
    ['/experience', 'Experience — Anas Azkoul'],
    ['/projects', 'Projects — Anas Azkoul'],
    ['/projects/client-portfolio', 'Client Portfolio Website — Anas Azkoul'],
    ['/stack', 'Stack — Anas Azkoul'],
    ['/story', 'Story — Anas Azkoul'],
    ['/contact', 'Contact — Anas Azkoul']
  ])('titles %s "%s"', async (route, title) => {
    await visit(route)
    await vi.waitFor(() => expect(document.title).toBe(title))
  })

  it("reads out the new view's title after each navigation", async () => {
    const wrapper = await visit('/')
    const announcer = () => wrapper.find('.nuxt-route-announcer [role=status]')
    expect(announcer().attributes('aria-live')).toBe('polite')
    await useRouter().push('/projects/learnflow')
    await vi.waitFor(() =>
      expect(announcer().text()).toBe('LearnFlow — Anas Azkoul')
    )
    await useRouter().push('/projects')
    await vi.waitFor(() =>
      expect(announcer().text()).toBe('Projects — Anas Azkoul')
    )
  })
})
