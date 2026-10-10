<script setup lang="ts">
/**
 * A bracketed note marking copy that is still to be written.
 *
 * Usage:
 *   <DraftNote>add: repo or demo link once public</DraftNote>
 *
 * Every one is replaced with real copy before launch.
 */
defineSlots<{ default: () => unknown }>()
</script>

<template>
  <span data-draft-note class="text-draft italic">[<slot />]</span>
</template>
