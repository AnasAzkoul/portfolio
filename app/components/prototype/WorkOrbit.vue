<script setup lang="ts">
/**
 * PROTOTYPE, Work variant C "Orbit": no boxes at all.
 * The title sits in the lattice's centre and each project is a small inlaid
 * medallion on a faint ring, on the diagonals, with its name set beneath.
 * The ring is sized like the lattice, so the projects sit in its pattern.
 */
import { star } from '~/utils/geometry'
import { cartoucheJewel } from '~/components/Cartouche.variants'

const route = useRoute()
const starPath = star(30, 30, 26, 14, 8, -Math.PI / 2)
const twoDigits = (n: number) => String(n).padStart(2, '0')

// Diagonals, clockwise from the top right; radius as a share of the ring.
const RADIUS = 36
const placed = computed(() =>
  projects.map((project, i) => {
    const a = -Math.PI / 4 + (i * Math.PI) / 2
    return {
      project,
      left: `${50 + RADIUS * Math.cos(a)}%`,
      top: `${50 + RADIUS * Math.sin(a)}%`
    }
  })
)
</script>

<template>
  <!-- On a phone the ring stretches into a tall ellipse, so the names clear the title. -->
  <div
    class="relative size-[min(100dvh_-_96px,100vw)] max-[720px]:h-[min(100dvh_-_170px,620px)] max-[720px]:w-[calc(100vw_-_32px)]"
  >
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 size-full"
    >
      <circle
        cx="50"
        cy="50"
        :r="RADIUS"
        vector-effect="non-scaling-stroke"
        class="fill-none stroke-gold-hi/30 [stroke-width:1] [stroke-dasharray:2_5]"
      />
    </svg>

    <div
      class="absolute top-1/2 left-1/2 flex -translate-1/2 flex-col items-center text-center"
    >
      <h2
        tabindex="-1"
        class="text-[clamp(28px,4.4dvh,44px)] leading-none font-medium focus:outline-none"
      >
        Selected Work
      </h2>
      <DiamondDivider size="small" class="mx-auto mt-3 mb-2.5" />
      <div class="font-mono text-[10px] tracking-[3px] text-ink-dim">
        {{ twoDigits(projects.length) }} PROJECTS
      </div>
    </div>

    <NuxtLink
      v-for="({ project, left, top }, i) in placed"
      :key="project.slug"
      :to="{ path: `/work/${project.slug}`, query: route.query }"
      :style="{ left, top }"
      class="group absolute flex w-[150px] -translate-x-1/2 -translate-y-[38px] flex-col items-center text-center text-ink no-underline focus-visible:outline-none max-[720px]:w-[130px]"
    >
      <span
        class="grid size-[76px] place-items-center rounded-full border border-gold/45 bg-tile shadow-[inset_0_0_0_4px_var(--color-tile),inset_0_0_0_5px_--alpha(var(--color-gold)/20%)] transition-[border-color,box-shadow] duration-300 group-hover:border-gold-hi group-hover:shadow-[inset_0_0_0_4px_var(--color-tile),inset_0_0_0_5px_--alpha(var(--color-gold-hi)/45%),0_0_18px_--alpha(var(--color-gold-hi)/30%)] group-focus-visible:border-gold-hi max-[720px]:size-[60px]"
      >
        <svg
          viewBox="0 0 60 60"
          aria-hidden="true"
          class="size-[46px] transition-[rotate] duration-700 group-hover:rotate-[22.5deg] max-[720px]:size-[36px]"
        >
          <path
            :d="starPath"
            class="fill-none stroke-gold-hi stroke-1 opacity-60 group-hover:opacity-100"
          />
          <circle
            cx="30"
            cy="30"
            r="3.6"
            :class="cartoucheJewel({ jewel: project.jewel })"
          />
        </svg>
      </span>
      <span class="mt-3 font-mono text-[10px] tracking-[2px] text-gold">
        {{ twoDigits(i + 1) }}
      </span>
      <span
        class="mt-1 text-[clamp(18px,2.6dvh,23px)] leading-[1.05] font-medium transition-colors duration-300 group-hover:text-gold-hi group-focus-visible:text-gold-hi"
      >
        {{ project.name }}
      </span>
      <span
        class="mt-1.5 font-mono text-[9px] tracking-[2px] text-ink-dim max-[720px]:hidden"
      >
        {{ project.meta }}
      </span>
    </NuxtLink>
  </div>
</template>
