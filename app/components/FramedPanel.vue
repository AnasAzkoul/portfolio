<script setup lang="ts">
/**
 * The gold-framed overlay every section view opens in.
 *
 * Usage:
 *   <FramedPanel kicker="02 · CLIENT PROJECT · 2022" title="Client Portfolio"
 *                close-to="/projects" close-label="Back to all projects">
 *     ...body content; it scrolls inside the frame...
 *   </FramedPanel>
 *
 * From 1280px it takes its page's stage layout (definePageMeta's `stage`):
 * framed over the lattice in `centre` and `horizon`, unframed on the bare
 * ground in `focus` and `beside`. In `focus` the lattice's star stands over
 * the title and a diamond rule under it. `useRoute` here is the page's own
 * route, so a page on its way out keeps its look while the next one loads.
 *
 * The body sets its own `h3` (serif gold subheadings) and `p` (reading
 * copy) styles, so content can use plain elements.
 *
 * The title has tabindex="-1" so the layout can move focus to it when the
 * view opens.
 *
 * A body taller than the frame takes a tab stop of its own, so the keyboard
 * can scroll it even when it holds nothing focusable (not every browser
 * gives a scroller one).
 */
import type { RouteLocationRaw } from 'vue-router'
import {
  framedPanel,
  framedPanelBody,
  framedPanelCorner,
  framedPanelHeader,
  type FramedPanelVariants
} from './FramedPanel.variants'

const {
  closeTo = undefined,
  closeLabel = 'Close',
  variant = 'default'
} = defineProps<{
  /** Small mono line above the title, e.g. "02 · TOOLS OF THE CRAFT". */
  kicker: string
  title: string
  /**
   * Where the close link goes. Without it there's no close link; Escape and
   * the nav still leave the view.
   */
  closeTo?: RouteLocationRaw
  /** Accessible name for the close link. */
  closeLabel?: string
  /** `default` is 760px wide, `narrow` 560px; `fluid` fills its container. */
  variant?: FramedPanelVariants['variant']
}>()

defineSlots<{ default?: () => unknown }>()

const route = useRoute()
const stage = computed(() => route.meta.stage ?? 'centre')

const titleId = useId()
const corners = ['tl', 'tr', 'bl', 'br'] as const

const body = useTemplateRef('body')
const bodyScrolls = ref(false)
function measureBody() {
  const el = body.value
  bodyScrolls.value = !!el && el.scrollHeight > el.clientHeight
}

// Measured again whenever the body resizes, e.g. with the window.
let bodyObserver: ResizeObserver | undefined
onMounted(() => {
  if (!body.value) return
  bodyObserver = new ResizeObserver(measureBody)
  bodyObserver.observe(body.value)
})
onBeforeUnmount(() => bodyObserver?.disconnect())
</script>

<template>
  <section :class="framedPanel({ variant, stage })" :aria-labelledby="titleId">
    <span
      v-for="corner in corners"
      :key="corner"
      :data-ornament="corner"
      aria-hidden="true"
      :class="[
        framedPanelCorner({ stage }),
        {
          '-top-1.5 -left-1.5': corner === 'tl',
          '-top-1.5 -right-1.5': corner === 'tr',
          '-bottom-1.5 -left-1.5': corner === 'bl',
          '-right-1.5 -bottom-1.5': corner === 'br'
        }
      ]"
    />
    <header
      class="flex items-start justify-between gap-4 border-b border-gold/18 px-[34px] pt-7 pb-4 max-[720px]:px-[22px] max-[720px]:pt-[22px] max-[720px]:pb-3.5"
      :class="framedPanelHeader({ stage })"
    >
      <!-- The lattice's 8-point star: two squares, its jewel gold as it
           belongs to no project. -->
      <svg
        v-if="stage === 'focus'"
        data-focus-ornament="star"
        viewBox="0 0 24 24"
        aria-hidden="true"
        class="mb-3.5 hidden size-[26px] fill-none stroke-gold-hi min-[1280px]:block"
      >
        <rect x="5.5" y="5.5" width="13" height="13" />
        <rect
          x="5.5"
          y="5.5"
          width="13"
          height="13"
          transform="rotate(45 12 12)"
        />
        <circle cx="12" cy="12" r="2" class="fill-gold-hi stroke-none" />
      </svg>
      <div>
        <div class="mb-2 font-mono text-[11px] tracking-[4px] text-gold-hi">
          {{ kicker }}
        </div>
        <h2
          :id="titleId"
          tabindex="-1"
          class="text-[clamp(28px,4vw,40px)] leading-none font-medium text-ink focus:outline-none"
        >
          {{ title }}
        </h2>
      </div>
      <NuxtLink
        v-if="closeTo"
        :to="closeTo"
        :aria-label="closeLabel"
        class="shrink-0 border border-gold/35 px-2.5 py-1.5 font-mono text-[10px] tracking-[2px] text-ink-dim no-underline transition-colors duration-200 hover:border-gold-hi hover:text-gold-hi focus-visible:border-gold-hi focus-visible:text-gold-hi focus-visible:outline-1 focus-visible:outline-offset-[3px] focus-visible:outline-gold"
      >
        ESC ✕
      </NuxtLink>
      <div
        v-if="stage === 'focus'"
        data-focus-ornament="rule"
        aria-hidden="true"
        class="mt-5 hidden items-center gap-2.5 min-[1280px]:flex"
      >
        <span class="h-px w-20 bg-gold/50" />
        <span class="size-[7px] rotate-45 border border-gold-hi" />
        <span class="h-px w-20 bg-gold/50" />
      </div>
    </header>
    <div
      ref="body"
      data-panel-body
      :tabindex="bodyScrolls ? 0 : undefined"
      :class="framedPanelBody({ stage })"
      class="[scrollbar-width:thin] [scrollbar-color:--alpha(var(--color-gold)/40%)_transparent] overflow-y-auto overscroll-contain px-[34px] pt-2 pb-8 text-ink focus-visible:outline-1 focus-visible:-outline-offset-8 focus-visible:outline-gold max-[720px]:px-[22px] max-[720px]:pt-1.5 max-[720px]:pb-[26px] [&_h3]:mt-7 [&_h3]:mb-2 [&_h3]:text-[22px] [&_h3]:leading-tight [&_h3]:font-semibold [&_h3]:text-gold [&_p]:text-[19px] [&_p]:leading-[1.55] [&_p+p]:mt-3"
    >
      <slot />
    </div>
  </section>
</template>
