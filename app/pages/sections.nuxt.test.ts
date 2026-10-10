import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import DefaultLayout from '~/layouts/default.vue'

// Every nav link needs a real page: `pnpm generate` crawls them and fails the
// build on a 404. Each page tells the layout how far to turn the lattice and
// what the breadcrumb says.
describe('section pages', () => {
  it.each([
    ['/work', '22.5deg', '— WORK —'],
    ['/stack', '45deg', '— STACK —'],
    ['/story', '67.5deg', '— STORY —'],
    ['/contact', '90deg', '— CONTACT —']
  ])(
    '%s turns the lattice %s and labels the breadcrumb',
    async (route, angle, crumb) => {
      const wrapper = await mountSuspended(DefaultLayout, { route })
      expect(wrapper.find('[data-lattice] svg').attributes('style')).toContain(
        `--turn: ${angle}`
      )
      expect(wrapper.find('[data-crumb]').text()).toBe(crumb)
    }
  )
})
