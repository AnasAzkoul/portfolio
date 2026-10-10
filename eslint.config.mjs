// @ts-check
import prettier from 'eslint-config-prettier'
import withNuxt from './.nuxt/eslint.config.mjs'

// Prettier owns formatting; turn off any ESLint rules that would fight it.
export default withNuxt(prettier, {
  // Components are named for the design's parts (Cartouche, Chip), which are single words.
  files: ['app/components/**/*.vue'],
  rules: { 'vue/multi-word-component-names': 'off' }
})
