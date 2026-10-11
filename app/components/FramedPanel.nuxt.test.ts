import { afterEach, describe, expect, it, vi } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { nextTick } from 'vue'
import FramedPanel from './FramedPanel.vue'

const props = {
  kicker: '02 · TOOLS OF THE CRAFT',
  title: 'Stack',
  closeTo: '/'
}

describe('FramedPanel', () => {
  it('renders the kicker and the title as the heading', async () => {
    const wrapper = await mountSuspended(FramedPanel, { props })
    expect(wrapper.find('header').text()).toContain('02 · TOOLS OF THE CRAFT')
    expect(wrapper.find('h2').text()).toBe('Stack')
  })

  it('is a region labelled by its title', async () => {
    const wrapper = await mountSuspended(FramedPanel, { props })
    const id = wrapper.find('h2').attributes('id')
    expect(id).toBeTruthy()
    expect(wrapper.find('section').attributes('aria-labelledby')).toBe(id)
  })

  it('lets the title take programmatic focus', async () => {
    const wrapper = await mountSuspended(FramedPanel, { props })
    expect(wrapper.find('h2').attributes('tabindex')).toBe('-1')
  })

  it('closes by linking to closeTo, labelled "Close" by default', async () => {
    const wrapper = await mountSuspended(FramedPanel, { props })
    const close = wrapper.find('header a')
    expect(close.attributes('href')).toBe('/')
    expect(close.attributes('aria-label')).toBe('Close')
  })

  it('takes a custom close label', async () => {
    const wrapper = await mountSuspended(FramedPanel, {
      props: {
        ...props,
        closeTo: '/projects',
        closeLabel: 'Back to all projects'
      }
    })
    const close = wrapper.find('header a')
    expect(close.attributes('href')).toBe('/projects')
    expect(close.attributes('aria-label')).toBe('Back to all projects')
  })

  it('puts the default slot in a body that scrolls on its own', async () => {
    const wrapper = await mountSuspended(FramedPanel, {
      props,
      slots: { default: () => 'Body copy' }
    })
    const body = wrapper.find('[data-panel-body]')
    expect(body.text()).toBe('Body copy')
    expect(body.classes()).toEqual(
      expect.arrayContaining(['overflow-y-auto', 'overscroll-contain'])
    )
  })

  describe('a body taller than the frame', () => {
    // happy-dom lays nothing out, so this stands in for the browser: the body
    // measures `clientHeight` tall with content `scrollHeight` tall, and is
    // reported as soon as it's observed, as a browser does.
    function stubLayout(clientHeight: number, scrollHeight: number) {
      vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(
        clientHeight
      )
      vi.spyOn(HTMLElement.prototype, 'scrollHeight', 'get').mockReturnValue(
        scrollHeight
      )
      vi.stubGlobal(
        'ResizeObserver',
        class {
          constructor(private report: ResizeObserverCallback) {}
          observe(target: Element) {
            this.report(
              [{ target } as ResizeObserverEntry],
              this as unknown as ResizeObserver
            )
          }
          disconnect() {}
        }
      )
    }

    afterEach(() => {
      vi.restoreAllMocks()
      vi.unstubAllGlobals()
    })

    it('takes a tab stop, so the keyboard can scroll it', async () => {
      stubLayout(400, 900)
      const wrapper = await mountSuspended(FramedPanel, { props })
      await nextTick()
      const body = wrapper.find('[data-panel-body]')
      expect(body.attributes('tabindex')).toBe('0')
      expect(body.classes()).toEqual(
        expect.arrayContaining([
          'focus-visible:outline-1',
          'focus-visible:outline-gold'
        ])
      )
    })

    it('takes none when it all fits', async () => {
      stubLayout(400, 400)
      const wrapper = await mountSuspended(FramedPanel, { props })
      await nextTick()
      expect(
        wrapper.find('[data-panel-body]').attributes('tabindex')
      ).toBeUndefined()
    })
  })

  it('sets a diamond ornament on each corner, hidden from assistive tech', async () => {
    const wrapper = await mountSuspended(FramedPanel, { props })
    const ornaments = wrapper.findAll('[data-ornament]')
    expect(ornaments.map((o) => o.attributes('data-ornament'))).toEqual([
      'tl',
      'tr',
      'bl',
      'br'
    ])
    for (const o of ornaments) expect(o.attributes('aria-hidden')).toBe('true')
  })

  it('grows no taller than the view area has room for', async () => {
    const wrapper = await mountSuspended(FramedPanel, { props })
    expect(wrapper.find('section').classes()).toContain(
      'max-h-[min(74vh,720px,var(--view-height,100dvh))]'
    )
  })

  it.each([
    [undefined, 'w-[min(760px,92vw)]'],
    ['default', 'w-[min(760px,92vw)]'],
    ['narrow', 'w-[min(560px,92vw)]'],
    ['fluid', 'w-full']
  ] as const)('variant %s is %s wide', async (variant, width) => {
    const wrapper = await mountSuspended(FramedPanel, {
      props: { ...props, variant }
    })
    expect(wrapper.find('section').classes()).toContain(width)
  })

  it('has no close link without closeTo', async () => {
    const wrapper = await mountSuspended(FramedPanel, {
      props: { kicker: props.kicker, title: props.title }
    })
    expect(wrapper.find('header a').exists()).toBe(false)
  })

  // From 1280px a panel takes its page's stage layout (definePageMeta's
  // `stage`), so each case mounts it on a page that sets one.
  describe("from 1280px, in its page's stage layout", () => {
    const unframed = 'min-[1280px]:bg-transparent'
    const mountOn = (route: string) =>
      mountSuspended(FramedPanel, { props, route })

    it('stays framed where its page is centred', async () => {
      const wrapper = await mountOn('/')
      expect(wrapper.find('section').classes()).not.toContain(unframed)
      expect(wrapper.find('[data-focus-ornament]').exists()).toBe(false)
    })

    it('in focus, is one centred column with no frame', async () => {
      const wrapper = await mountOn('/experience')
      expect(wrapper.find('section').classes()).toEqual(
        expect.arrayContaining([
          unframed,
          'min-[1280px]:w-[min(680px,100%_-_88px)]'
        ])
      )
    })

    it("in focus, sets the lattice's star over the title and a diamond rule under it", async () => {
      const wrapper = await mountOn('/experience')
      const ornaments = wrapper.findAll('header [data-focus-ornament]')
      expect(ornaments.map((o) => o.attributes('data-focus-ornament'))).toEqual(
        ['star', 'rule']
      )
      for (const o of ornaments)
        expect(o.attributes('aria-hidden')).toBe('true')
    })

    it('beside the lattice, lines up with the mark, with no frame', async () => {
      const wrapper = await mountOn('/stack')
      expect(wrapper.find('section').classes()).toEqual(
        expect.arrayContaining([unframed, 'min-[1280px]:self-start'])
      )
      for (const corner of wrapper.findAll('[data-ornament]')) {
        expect(corner.classes()).toContain('min-[1280px]:hidden')
      }
    })

    it('with no frame, fades its body out at the scroll edges', async () => {
      const wrapper = await mountOn('/story')
      expect(wrapper.find('[data-panel-body]').classes().join(' ')).toMatch(
        /min-\[1280px\]:\[mask-image:/
      )
    })

    it('over the horizon, stays framed and ends at the arch', async () => {
      const wrapper = await mountOn('/projects/learnflow')
      expect(wrapper.find('section').classes()).toEqual(
        expect.arrayContaining([
          'min-[1280px]:h-[calc(100dvh_-_var(--lattice-rise)_-_30px)]'
        ])
      )
      expect(wrapper.find('section').classes()).not.toContain(unframed)
    })
  })
})
