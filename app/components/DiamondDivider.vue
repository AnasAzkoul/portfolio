<script setup lang="ts">
/**
 * The nested-diamond ornament set under the name on Home and in the Work centre.
 *
 * Usage:
 *   <DiamondDivider class="mx-auto mt-5 mb-[18px]" />
 *   <DiamondDivider size="small" class="mx-auto mt-3 mb-2.5" />
 *
 * It carries no spacing of its own; the parent places it.
 */
import {
  diamondDivider,
  type DiamondDividerVariants
} from './DiamondDivider.variants'

const { size = 'default' } = defineProps<{
  /** `default` is 44px (under the name), `small` 26px (the Work centre). */
  size?: DiamondDividerVariants['size']
}>()
</script>

<template>
  <svg viewBox="0 0 44 44" aria-hidden="true" :class="diamondDivider({ size })">
    <g class="fill-none stroke-gold">
      <path d="M22 2 L42 22 L22 42 L2 22 Z" />
      <path d="M22 9 L35 22 L22 35 L9 22 Z" />
      <circle cx="22" cy="22" r="2.6" class="fill-gold-hi stroke-none" />
    </g>
  </svg>
</template>
