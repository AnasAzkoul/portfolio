import { afterEach, describe, expect, it, vi } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { enableAutoUnmount } from '@vue/test-utils'
import App from '~/app.vue'

// Mounted into the document, so focus really moves. Each test unmounts its
// app, so no earlier one is left listening for keys or navigations.
function visit(route: string) {
  return mountSuspended(App, { route, attachTo: document.body })
}

enableAutoUnmount(afterEach)

const focusedText = () => document.activeElement?.textContent?.trim()

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

  it('leaves focus at the top of the document on the first load', async () => {
    await visit('/story')
    await new Promise((resolve) => setTimeout(resolve, 50))
    expect(document.activeElement).toBe(document.body)
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
