// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', '@nuxt/fonts'],
  // Only .vue files are components, so a `*.variants.ts` can sit beside its component.
  components: [{ path: '~/components', extensions: ['.vue'] }],
  fonts: {
    // Downloaded at build time and served from our own origin.
    // No per-family `provider`: pinning one makes it ignore `defaults.fallbacks`.
    priority: ['google'],
    families: [
      {
        name: 'Cormorant Garamond',
        weights: [400, 500, 600],
        styles: ['normal', 'italic']
      },
      { name: 'Space Mono', weights: [400], styles: ['normal'] }
    ],
    defaults: {
      // Subsetting turns off automatic preload; the metric-matched fallbacks cover the swap.
      subsets: ['latin', 'latin-ext'],
      // Metric-adjusted local fonts shown until the web font loads, so the swap doesn't shift layout.
      fallbacks: {
        serif: ['Georgia', 'Times New Roman'],
        monospace: ['Courier New']
      }
    }
  },
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss()]
  },
  typescript: {
    strict: true,
    typeCheck: true
  }
})
