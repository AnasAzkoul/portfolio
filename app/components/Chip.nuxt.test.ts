import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Chip from './Chip.vue'

describe('Chip', () => {
  it('shows its label', async () => {
    const wrapper = await mountSuspended(Chip, {
      slots: { default: () => 'Vue 3' }
    })
    expect(wrapper.text()).toBe('Vue 3')
  })
})
