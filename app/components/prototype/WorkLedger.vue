<script setup lang="ts">
/**
 * PROTOTYPE, Work variant B "Ledger": a contents page.
 * Work opens in a FramedPanel like every other section, with one row per
 * project: number, a large serif name, its kicker and stack line. Text-led,
 * and it takes a fifth or sixth project without a new layout.
 */
import { star } from '~/utils/geometry'
import { cartoucheJewel } from '~/components/Cartouche.variants'

const route = useRoute()
const starPath = star(9, 9, 8, 4.5, 8, -Math.PI / 2)
const twoDigits = (n: number) => String(n).padStart(2, '0')
</script>

<template>
  <FramedPanel kicker="01 · SELECTED WORK" title="Work" close-to="/">
    <ol class="mt-2">
      <li v-for="(project, i) in projects" :key="project.slug">
        <NuxtLink
          :to="{ path: `/work/${project.slug}`, query: route.query }"
          class="group grid grid-cols-[34px_1fr_auto] items-center gap-x-5 border-b border-gold/16 py-5 text-ink no-underline focus-visible:outline-none max-[720px]:grid-cols-[26px_1fr] max-[720px]:gap-x-3 max-[720px]:py-4"
        >
          <span class="font-mono text-[11px] tracking-[2px] text-gold">
            {{ twoDigits(i + 1) }}
          </span>
          <span>
            <span
              class="block text-[clamp(26px,3.2vw,36px)] leading-none font-medium transition-colors duration-300 group-hover:text-gold-hi group-focus-visible:text-gold-hi"
            >
              {{ project.name }}
            </span>
            <span
              class="mt-2 block font-mono text-[10px] tracking-[2px] text-ink-dim"
            >
              {{ project.kicker.replace(/^\d+ · /, '') }} · {{ project.meta }}
            </span>
          </span>
          <svg
            viewBox="0 0 18 18"
            aria-hidden="true"
            class="size-[22px] opacity-50 transition-[opacity,rotate] duration-500 group-hover:rotate-[22.5deg] group-hover:opacity-100 group-focus-visible:opacity-100 max-[720px]:hidden"
          >
            <path :d="starPath" class="fill-none stroke-gold-hi stroke-1" />
            <circle
              cx="9"
              cy="9"
              r="1.8"
              :class="cartoucheJewel({ jewel: project.jewel })"
            />
          </svg>
        </NuxtLink>
      </li>
    </ol>
  </FramedPanel>
</template>
