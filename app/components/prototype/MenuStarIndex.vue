<script setup lang="ts">
/**
 * PROTOTYPE, throw away once a phone menu is picked.
 * E · Star index: B's eight-point star opens A's full-screen index. As it
 * opens, the star's two squares flatten into thin inlaid bars and turn
 * into an X, the jewel staying where they cross.
 */
import { prototypeSections } from './menu-sections'
import { useMenuToggle } from './useMenuToggle'

defineProps<{ current: string }>()
const { open, close, toggle } = useMenuToggle()

// Each square squashes along its own axes, then turns: one to 45°, one to 135°.
const bar = 'scale-x-[1.45] scale-y-[0.23]'
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
        id="prototype-menu-e"
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
      :aria-label="open ? 'Close sections' : 'Sections'"
      :aria-expanded="open"
      aria-controls="prototype-menu-e"
      class="fixed top-[22px] right-8 z-4 grid size-11 place-items-center text-gold transition-colors duration-200 hover:text-gold-hi focus-visible:outline-1 focus-visible:outline-gold max-[720px]:top-3 max-[720px]:right-3"
      :class="{ 'text-gold-hi': open }"
      @click="toggle"
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        class="size-[24px] fill-none stroke-current stroke-[1.2]"
      >
        <rect
          x="5.5"
          y="5.5"
          width="13"
          height="13"
          vector-effect="non-scaling-stroke"
          class="origin-center transition-transform duration-[350ms] ease-[cubic-bezier(0.6,0,0.2,1)] [transform-box:fill-box] motion-reduce:transition-none"
          :class="open ? ['rotate-45', bar] : 'rotate-0'"
        />
        <rect
          x="5.5"
          y="5.5"
          width="13"
          height="13"
          vector-effect="non-scaling-stroke"
          class="origin-center transition-transform duration-[350ms] ease-[cubic-bezier(0.6,0,0.2,1)] [transform-box:fill-box] motion-reduce:transition-none"
          :class="open ? ['rotate-[135deg]', bar] : 'rotate-45'"
        />
        <circle cx="12" cy="12" r="1.8" class="fill-gold-hi stroke-none" />
      </svg>
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
