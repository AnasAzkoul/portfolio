<script setup lang="ts">
/**
 * An 8-point gold star inlaid with a project's jewel accent at its heart.
 *
 * Usage:
 *   <InlaidStar jewel="red" class="size-[22px]" />
 *
 * It carries no size of its own; the parent sets it.
 */
import { star } from '~/utils/geometry'
import { inlaidStarJewel, type Jewel } from './InlaidStar.variants'

const { jewel } = defineProps<{ jewel: Jewel }>()

// In a 34 × 34 box, a point straight up.
const starPath = star(17, 17, 15, 8.5, 8, -Math.PI / 2)
</script>

<template>
  <svg data-inlaid-star viewBox="0 0 34 34" aria-hidden="true" class="block">
    <path :d="starPath" class="fill-none stroke-gold-hi stroke-1 opacity-70" />
    <circle
      data-jewel
      cx="17"
      cy="17"
      r="2.4"
      :class="inlaidStarJewel({ jewel })"
    />
  </svg>
</template>
