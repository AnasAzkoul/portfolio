import { describe, expect, it, vi } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { nextTick } from 'vue'
import App from '~/app.vue'

// The test utils stub <Transition> out by default; these tests need the real one.
function visit(route: string) {
  return mountSuspended(App, {
    route,
    global: { stubs: { transition: false } }
  })
}

type Wrapper = Awaited<ReturnType<typeof visit>>

// Notes each page that arrives in the view area: its title, its classes and
// whether the page it replaces had already gone. It reads them the moment the
// page arrives, before the transition has had a frame to run.
function watchArrivals(wrapper: Wrapper, leaving: Element) {
  const arrivals: {
    title: string | null | undefined
    classes: string[]
    replacedGone: boolean
  }[] = []
  const observer = new MutationObserver((records) => {
    for (const { addedNodes } of records) {
      for (const node of addedNodes) {
        if (node instanceof HTMLElement) {
          arrivals.push({
            title: node.querySelector('h2')?.textContent,
            classes: [...node.classList],
            replacedGone: !leaving.isConnected
          })
        }
      }
    }
  })
  observer.observe(wrapper.find('[data-view-area]').element, {
    childList: true
  })
  return { arrivals, stop: () => observer.disconnect() }
}

describe('moving between sections', () => {
  it('fades the old section out, then the new one in', async () => {
    const wrapper = await visit('/experience')
    const leaving = wrapper.find('[data-view-area] section').element
    const { arrivals, stop } = watchArrivals(wrapper, leaving)

    await useRouter().push('/stack')
    await nextTick()
    expect(leaving.classList).toContain('page-leave-active')
    expect(arrivals).toEqual([])

    await vi.waitFor(() => expect(arrivals).toHaveLength(1))
    expect(arrivals[0]).toMatchObject({ title: 'Stack', replacedGone: true })
    expect(arrivals[0]!.classes).toContain('page-enter-active')

    stop()
    wrapper.unmount()
  })
})
