<script setup lang="ts">
/**
 * PROTOTYPE, throw away once a phone menu is picked.
 * C · Sheet: the breadcrumb at the bottom becomes the button. It names the
 * current section and opens a sheet of section tiles within thumb reach,
 * with Home as the sixth tile.
 */
import { prototypeSections } from './menu-sections'
import { useMenuToggle } from './useMenuToggle'

const { current } = defineProps<{ current: string }>()
const { open, close, toggle } = useMenuToggle()

const here = computed(() => prototypeSections.find((s) => s.to === current))
const tiles = computed(() => [
  ...prototypeSections.map((s) => ({
    number: s.number,
    name: s.name,
    to: s.to as string
  })),
  { number: '00', name: 'Home', to: '/' }
])
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
        aria-hidden="true"
        class="fixed inset-0 z-3 bg-bg3/55"
        @click="close"
      />
    </Transition>

    <Transition
      enter-from-class="translate-y-full"
      leave-to-class="translate-y-full"
      enter-active-class="transition-[translate] duration-300 ease-out motion-reduce:transition-none"
      leave-active-class="transition-[translate] duration-200 ease-in motion-reduce:transition-none"
    >
      <div
        v-if="open"
        id="prototype-menu-c"
        class="fixed inset-x-0 bottom-0 z-4 border-t border-gold/45 bg-panel px-4 pt-6 pb-[max(20px,env(safe-area-inset-bottom))] shadow-[inset_0_5px_0_0_var(--color-panel),inset_0_6px_0_0_--alpha(var(--color-gold)/22%),0_-20px_60px_rgb(0_0_0/0.5)] backdrop-blur-[3px]"
      >
        <span
          aria-hidden="true"
          class="absolute top-0 left-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rotate-45 border border-gold bg-panel"
        />
        <div class="mx-auto max-w-[480px]">
          <div class="mb-3.5 flex items-center justify-between">
            <span class="font-mono text-[10px] tracking-[4px] text-gold-hi">
              SECTIONS
            </span>
            <button
              type="button"
              class="border border-gold/35 px-2.5 py-1.5 font-mono text-[10px] tracking-[2px] text-ink-dim transition-colors duration-200 hover:border-gold-hi hover:text-gold-hi"
              @click="close"
            >
              CLOSE ✕
            </button>
          </div>
          <nav aria-label="Sections">
            <ol class="grid grid-cols-2 gap-2.5">
              <li v-for="tile in tiles" :key="tile.to">
                <NuxtLink
                  :to="tile.to"
                  :aria-current="current === tile.to ? 'page' : undefined"
                  class="flex h-[78px] flex-col justify-between border p-3 no-underline transition-colors duration-200"
                  :class="
                    current === tile.to
                      ? 'border-gold-hi bg-gold/10 text-gold-hi'
                      : 'border-gold/25 text-ink hover:border-gold/60'
                  "
                  @click="close"
                >
                  <span class="font-mono text-[10px] tracking-[2px] text-gold">
                    {{ tile.number }}
                  </span>
                  <span class="text-[25px] leading-none font-medium">
                    {{ tile.name }}
                  </span>
                </NuxtLink>
              </li>
            </ol>
          </nav>
        </div>
      </div>
    </Transition>

    <button
      type="button"
      :aria-expanded="open"
      aria-controls="prototype-menu-c"
      class="fixed bottom-4 left-1/2 z-3 flex -translate-x-1/2 items-center gap-3 border border-gold/35 bg-panel px-4 py-3.5 font-mono text-[11px] tracking-[3px] whitespace-nowrap text-gold-hi backdrop-blur-[3px] transition-colors duration-200 hover:border-gold-hi focus-visible:outline-1 focus-visible:outline-gold"
      @click="toggle"
    >
      <span v-if="here" class="text-[10px] tracking-[2px] text-gold">
        {{ here.number }}
      </span>
      {{ here?.label ?? 'SECTIONS' }}
      <span
        aria-hidden="true"
        class="size-[6px] translate-y-[2px] rotate-45 border-t border-l border-gold-hi"
      />
    </button>
  </div>
</template>
