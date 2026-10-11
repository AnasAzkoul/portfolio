<script setup lang="ts">
/**
 * The gold-framed overlay every section view opens in.
 *
 * Usage:
 *   <FramedPanel kicker="04 · OPEN TO FRONTEND ROLES IN NL" title="Contact"
 *                close-to="/" variant="narrow">
 *     ...body content; it scrolls inside the frame...
 *   </FramedPanel>
 *
 * The body sets its own `h3` (mono gold section labels) and `p` (reading
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
import { framedPanel, type FramedPanelVariants } from './FramedPanel.variants'

const { closeLabel = 'Close', variant = 'default' } = defineProps<{
  /** Small mono line above the title, e.g. "02 · TOOLS OF THE CRAFT". */
  kicker: string
  title: string
  /** Where the close link goes. */
  closeTo: RouteLocationRaw
  /** Accessible name for the close link. */
  closeLabel?: string
  /** `default` is 760px wide, `narrow` 560px; `fluid` fills its container. */
  variant?: FramedPanelVariants['variant']
}>()

defineSlots<{ default?: () => unknown }>()

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
  <section :class="framedPanel({ variant })" :aria-labelledby="titleId">
    <span
      v-for="corner in corners"
      :key="corner"
      :data-ornament="corner"
      aria-hidden="true"
      class="absolute size-2.5 rotate-45 border border-gold bg-panel"
      :class="{
        '-top-1.5 -left-1.5': corner === 'tl',
        '-top-1.5 -right-1.5': corner === 'tr',
        '-bottom-1.5 -left-1.5': corner === 'bl',
        '-right-1.5 -bottom-1.5': corner === 'br'
      }"
    />
    <header
      class="flex items-start justify-between gap-4 border-b border-gold/18 px-[34px] pt-7 pb-4 max-[720px]:px-[22px] max-[720px]:pt-[22px] max-[720px]:pb-3.5"
    >
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
        :to="closeTo"
        :aria-label="closeLabel"
        class="shrink-0 border border-gold/35 px-2.5 py-1.5 font-mono text-[10px] tracking-[2px] text-ink-dim no-underline transition-colors duration-200 hover:border-gold-hi hover:text-gold-hi focus-visible:border-gold-hi focus-visible:text-gold-hi focus-visible:outline-1 focus-visible:outline-offset-[3px] focus-visible:outline-gold"
      >
        ESC ✕
      </NuxtLink>
    </header>
    <div
      ref="body"
      data-panel-body
      :tabindex="bodyScrolls ? 0 : undefined"
      class="[scrollbar-width:thin] [scrollbar-color:--alpha(var(--color-gold)/40%)_transparent] overflow-y-auto overscroll-contain px-[34px] pt-2 pb-8 text-ink focus-visible:outline-1 focus-visible:-outline-offset-8 focus-visible:outline-gold max-[720px]:px-[22px] max-[720px]:pt-1.5 max-[720px]:pb-[26px] [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:font-mono [&_h3]:text-[11px] [&_h3]:font-normal [&_h3]:tracking-[4px] [&_h3]:text-gold [&_h3]:uppercase [&_p]:text-[19px] [&_p]:leading-[1.55] [&_p+p]:mt-3"
    >
      <slot />
    </div>
  </section>
</template>
