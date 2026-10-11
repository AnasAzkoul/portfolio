<script setup lang="ts">
/**
 * PROTOTYPE, throw away once a phone menu is picked.
 * A · Index: a MENU button opposite the mark opens a full-screen numbered
 * index of the sections, set like the Projects index, each with its kicker.
 */
import { prototypeSections } from './menu-sections'
import { useMenuToggle } from './useMenuToggle'

defineProps<{ current: string }>()
const { open, close, toggle } = useMenuToggle()
</script>

<template>
  <div class="min-[900px]:hidden">
    <Transition
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
      enter-active-class="transition-opacity duration-300 motion-reduce:transition-none"
      leave-active-class="transition-opacity duration-200 motion-reduce:transition-none"
    >
      <div
        v-if="open"
        id="prototype-menu-a"
        class="fixed inset-0 z-3 flex flex-col justify-center bg-bg2/94 px-6 backdrop-blur-[3px]"
      >
        <nav aria-label="Sections" class="mx-auto w-full max-w-[440px]">
          <div class="mb-2 font-mono text-[11px] tracking-[4px] text-gold-hi">
            SECTIONS
          </div>
          <ol class="border-t border-gold/18">
            <li
              v-for="(section, i) in prototypeSections"
              :key="section.to"
              class="prototype-rise"
              :style="{ animationDelay: `${80 + i * 55}ms` }"
            >
              <NuxtLink
                :to="section.to"
                :aria-current="current === section.to ? 'page' : undefined"
                class="flex items-center gap-4 border-b border-gold/18 py-4 no-underline"
                :class="current === section.to ? 'text-gold-hi' : 'text-ink'"
                @click="close"
              >
                <span class="font-mono text-[10px] tracking-[2px] text-gold">
                  {{ section.number }}
                </span>
                <span class="flex flex-col gap-2">
                  <span class="text-[34px] leading-none font-medium">
                    {{ section.name }}
                  </span>
                  <span
                    class="font-mono text-[9px] tracking-[2px] text-ink-dim"
                  >
                    {{ section.kicker }}
                  </span>
                </span>
                <span
                  aria-hidden="true"
                  class="ml-auto size-[7px] shrink-0 rotate-45 border border-gold-hi"
                  :class="current === section.to ? 'opacity-100' : 'opacity-0'"
                />
              </NuxtLink>
            </li>
          </ol>
        </nav>
      </div>
    </Transition>

    <button
      type="button"
      :aria-expanded="open"
      aria-controls="prototype-menu-a"
      class="fixed top-[22px] right-8 z-4 p-3 font-mono text-[12px] tracking-[3px] text-ink-dim transition-colors duration-200 hover:text-gold-hi focus-visible:outline-1 focus-visible:outline-gold max-[720px]:top-3 max-[720px]:right-3"
      :class="{ 'text-gold-hi': open }"
      :aria-label="open ? 'Close sections' : undefined"
      @click="toggle"
    >
      {{ open ? '✕' : 'MENU' }}
    </button>
  </div>
</template>

<style scoped>
.prototype-rise {
  animation: prototype-rise 0.45s ease both;
}
@keyframes prototype-rise {
  from {
    opacity: 0;
    translate: 0 10px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .prototype-rise {
    animation: none;
  }
}
</style>
