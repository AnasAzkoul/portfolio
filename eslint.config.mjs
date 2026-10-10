// @ts-check
import prettier from 'eslint-config-prettier'
import withNuxt from './.nuxt/eslint.config.mjs'

// Prettier owns formatting; turn off any ESLint rules that would fight it.
export default withNuxt(prettier)
