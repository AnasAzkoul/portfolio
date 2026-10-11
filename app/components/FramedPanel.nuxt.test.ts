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
})
