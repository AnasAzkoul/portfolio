import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    // Plain Node keeps pure modules fast. A test that needs Nuxt auto-imports or
    // components opts in by naming itself `*.nuxt.test.ts` or living in `test/nuxt/`.
    environment: 'node'
  }
})
