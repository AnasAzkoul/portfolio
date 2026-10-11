<script setup lang="ts">
/**
 * PROTOTYPE, throw away once a phone menu is picked.
 * B · Dropdown: an eight-point star opposite the mark drops a small framed
 * card of the sections. The page stays in view behind it; the star turns
 * a step as it opens, like the lattice does.
 */
import { prototypeSections } from './menu-sections'
import { useMenuToggle } from './useMenuToggle'

defineProps<{ current: string }>()
const { open, close, toggle } = useMenuToggle()

const corners = [
  '-top-1.5 -left-1.5',
  '-top-1.5 -right-1.5',
  '-bottom-1.5 -left-1.5',
  '-right-1.5 -bottom-1.5'
]
</script>

<template>
  <div class="min-[900px]:hidden">
    <Transition
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
      enter-active-class="transition-opacity duration-200 motion-reduce:transition-none"
      leave-active-class="transition-opacity duration-150 motion-reduce:transition-none"
    >
      <div
        v-if="open"
        aria-hidden="true"
        class="fixed inset-0 z-3 bg-bg3/45"
        @click="close"
      />
    </Transition>

    <Transition
      enter-from-class="scale-95 opacity-0"
      leave-to-class="scale-95 opacity-0"
      enter-active-class="transition-[opacity,scale] duration-200 ease-out motion-reduce:transition-none"
      leave-active-class="transition-[opacity,scale] duration-150 ease-in motion-reduce:transition-none"
    >
      <nav
        v-if="open"
        id="prototype-menu-b"
        aria-label="Sections"
        class="fixed top-[78px] right-8 z-4 w-[250px] origin-top-right border border-gold/45 bg-panel shadow-[inset_0_0_0_5px_var(--color-panel),inset_0_0_0_6px_--alpha(var(--color-gold)/22%),0_20px_60px_rgb(0_0_0/0.5)] backdrop-blur-[3px] max-[720px]:top-16 max-[720px]:right-4"
      >
        <span
          v-for="corner in corners"
          :key="corner"
          aria-hidden="true"
          class="absolute size-2.5 rotate-45 border border-gold bg-panel"
          :class="corner"
        />
        <div
          class="border-b border-gold/18 px-5 pt-4 pb-3 font-mono text-[10px] tracking-[4px] text-gold-hi"
        >
          SECTIONS
        </div>
        <ol class="py-2">
          <li v-for="section in prototypeSections" :key="section.to">
            <NuxtLink
              :to="section.to"
              :aria-current="current === section.to ? 'page' : undefined"
              class="flex items-center gap-3.5 px-5 py-3 font-mono text-[12px] tracking-[3px] no-underline transition-colors duration-200"
              :class="
                current === section.to
                  ? 'text-gold-hi'
                  : 'text-ink-dim hover:text-ink'
              "
              @click="close"
            >
              <span class="text-[10px] tracking-[2px] text-gold">
                {{ section.number }}
              </span>
              {{ section.label }}
              <span
                aria-hidden="true"
                class="ml-auto size-[6px] rotate-45 border border-gold-hi"
                :class="current === section.to ? 'bg-gold-hi' : 'opacity-0'"
              />
            </NuxtLink>
          </li>
        </ol>
      </nav>
    </Transition>

    <button
      type="button"
      aria-label="Sections"
      :aria-expanded="open"
      aria-controls="prototype-menu-b"
      class="fixed top-[22px] right-8 z-4 grid size-11 place-items-center text-gold transition-colors duration-200 hover:text-gold-hi focus-visible:outline-1 focus-visible:outline-gold max-[720px]:top-3 max-[720px]:right-3"
      :class="{ 'text-gold-hi': open }"
      @click="toggle"
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        class="size-[24px] fill-none stroke-current stroke-[1.2] transition-transform duration-300 motion-reduce:transition-none"
        :class="{ 'rotate-[22.5deg]': open }"
      >
        <rect x="5.5" y="5.5" width="13" height="13" />
        <rect
          x="5.5"
          y="5.5"
          width="13"
          height="13"
          transform="rotate(45 12 12)"
        />
        <circle cx="12" cy="12" r="1.8" class="fill-gold-hi stroke-none" />
      </svg>
    </button>
  </div>
</template>
