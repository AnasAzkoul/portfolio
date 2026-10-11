<script setup lang="ts">
/**
 * A small mono tag with a thin gold border, for the stack lists.
 *
 * Usage:
 *   <div class="flex flex-wrap gap-2">
 *     <Chip>Vue 3</Chip>
 *     <Chip>Nuxt</Chip>
 *   </div>
 */
defineSlots<{ default: () => unknown }>()
</script>

<template>
  <span
    data-chip
    class="inline-block border border-gold/35 px-2.5 py-[5px] font-mono text-[12px] tracking-[1px] text-ink"
  >
    <slot />
  </span>
</template>
