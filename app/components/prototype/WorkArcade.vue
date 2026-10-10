<script setup lang="ts">
/**
 * PROTOTYPE, Work variant D "Arcade": the projects as a row of tall
 * pointed-arch niches, like a mosque's arcade or a row of mihrabs, under
 * the title. Two by two on a phone.
 */
import { star } from '~/utils/geometry'
import { cartoucheJewel } from '~/components/Cartouche.variants'

const route = useRoute()
const starPath = star(17, 17, 15, 8.5, 8, -Math.PI / 2)
const twoDigits = (n: number) => String(n).padStart(2, '0')
</script>

<template>
  <div class="flex flex-col items-center">
    <div class="mb-7 flex flex-col items-center text-center max-[720px]:mb-4">
      <h2
        tabindex="-1"
        class="text-[clamp(28px,3.6vw,40px)] leading-none font-medium focus:outline-none"
      >
        Selected Work
      </h2>
      <DiamondDivider size="small" class="mx-auto mt-3 mb-2.5" />
      <div class="font-mono text-[10px] tracking-[3px] text-ink-dim">
        {{ twoDigits(projects.length) }} PROJECTS
      </div>
    </div>

    <div
      class="flex gap-5 max-[720px]:grid max-[720px]:grid-cols-2 max-[720px]:gap-3"
    >
      <NuxtLink
        v-for="(project, i) in projects"
        :key="project.slug"
        :to="{ path: `/work/${project.slug}`, query: route.query }"
        class="group relative flex h-[clamp(250px,46dvh,400px)] w-[clamp(150px,15vw,200px)] flex-col items-center justify-end gap-2 px-4 pb-9 text-center text-ink no-underline transition-transform duration-500 hover:-translate-y-1.5 focus-visible:-translate-y-1.5 focus-visible:outline-none max-[720px]:h-[min(30dvh,250px)] max-[720px]:w-[42vw] max-[720px]:pb-5"
      >
        <svg
          viewBox="0 0 100 200"
          preserveAspectRatio="none"
          aria-hidden="true"
          class="absolute inset-0 size-full"
        >
          <path
            d="M1 199 V74 C1 40 28 18 50 1 C72 18 99 40 99 74 V199 Z"
            vector-effect="non-scaling-stroke"
            class="fill-tile stroke-gold/45 transition-[stroke] duration-300 group-hover:stroke-gold-hi/85 group-focus-visible:stroke-gold-hi/85"
          />
          <path
            d="M6 194 V76 C6 45 31 25 50 9 C69 25 94 45 94 76 V194 Z"
            vector-effect="non-scaling-stroke"
            class="fill-none stroke-gold/18 transition-[stroke] duration-300 group-hover:stroke-gold-hi/40"
          />
        </svg>
        <span class="relative font-mono text-[10px] tracking-[2px] text-gold">
          {{ twoDigits(i + 1) }}
        </span>
        <svg
          viewBox="0 0 34 34"
          aria-hidden="true"
          class="relative size-[34px]"
        >
          <path
            :d="starPath"
            class="fill-none stroke-gold-hi stroke-1 opacity-45 transition-opacity duration-300 group-hover:opacity-95"
          />
          <circle
            cx="17"
            cy="17"
            r="2.4"
            :class="cartoucheJewel({ jewel: project.jewel })"
          />
        </svg>
        <span
          class="relative text-[clamp(18px,2vw,22px)] leading-[1.05] font-medium"
        >
          {{ project.name }}
        </span>
        <span
          class="relative font-mono text-[9px] tracking-[2px] text-ink-dim max-[720px]:hidden"
        >
          {{ project.meta }}
        </span>
      </NuxtLink>
    </div>
  </div>
</template>
