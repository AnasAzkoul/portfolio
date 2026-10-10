<script setup lang="ts">
/**
 * A project tile on the Work view: number, an inlaid 8-point star with a
 * jewel dot, the project name and a stack meta line.
 *
 * Usage:
 *   <Cartouche number="04" name="LearnFlow" meta="NUXT · HONO · CLOUDFLARE · AI"
 *              to="/work/learnflow" jewel="gold" @open="origin = $event" />
 *
 * `open` carries the tile's centre in viewport pixels, so the detail panel
 * can grow from it.
 */
import type { RouteLocationRaw } from 'vue-router'
import { star } from '~/utils/geometry'
import { cartoucheJewel, type CartoucheJewel } from './Cartouche.variants'

const { jewel } = defineProps<{
  /** Two-digit position, e.g. "01". */
  number: string
  name: string
  /** Short mono stack line, e.g. "NUXT 4 · CLAUDE CODE". */
  meta: string
  to: RouteLocationRaw
  /** Colour of the jewel dot in the star. */
  jewel: CartoucheJewel
}>()

const emit = defineEmits<{ open: [centre: { x: number; y: number }] }>()

// 8-point star in a 34 × 34 box, a point straight up.
const starPath = star(17, 17, 15, 8.5, 8, -Math.PI / 2)

function onClick(event: MouseEvent) {
  // A modified click opens the project in a new tab or window: no panel grows here.
  const { metaKey, ctrlKey, shiftKey, altKey, button } = event
  if (metaKey || ctrlKey || shiftKey || altKey || button !== 0) return
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  emit('open', {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2
  })
}
</script>

<template>
  <NuxtLink
    :to="to"
    class="group flex flex-col items-center justify-center gap-2 border border-gold/38 bg-tile p-3.5 text-center text-ink no-underline shadow-[inset_0_0_0_4px_var(--color-tile),inset_0_0_0_5px_--alpha(var(--color-gold)/16%)] transition-[border-color,box-shadow] duration-350 hover:border-gold-hi/80 hover:shadow-[inset_0_0_0_4px_var(--color-tile),inset_0_0_0_5px_--alpha(var(--color-gold-hi)/40%),0_0_12px_--alpha(var(--color-gold-hi)/18%)] focus-visible:border-gold-hi/80 focus-visible:shadow-[inset_0_0_0_4px_var(--color-tile),inset_0_0_0_5px_--alpha(var(--color-gold-hi)/40%),0_0_12px_--alpha(var(--color-gold-hi)/18%)] focus-visible:outline-none"
    @click="onClick"
  >
    <span
      data-cartouche-number
      class="font-mono text-[10px] tracking-[2px] text-gold"
    >
      {{ number }}
    </span>
    <svg viewBox="0 0 34 34" aria-hidden="true" class="size-[34px]">
      <path
        data-star
        :d="starPath"
        class="fill-none stroke-gold-hi stroke-1 opacity-45 transition-opacity duration-350 group-hover:opacity-95 group-focus-visible:opacity-95"
      />
      <circle
        data-jewel
        cx="17"
        cy="17"
        r="2.4"
        :class="cartoucheJewel({ jewel })"
      />
    </svg>
    <span
      data-cartouche-name
      class="text-[clamp(17px,2vw,21px)] leading-[1.05] font-medium"
    >
      {{ name }}
    </span>
    <span
      data-cartouche-meta
      class="font-mono text-[9px] tracking-[2px] text-ink-dim"
    >
      {{ meta }}
    </span>
  </NuxtLink>
</template>
