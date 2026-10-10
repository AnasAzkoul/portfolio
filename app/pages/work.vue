<script setup lang="ts">
/**
 * Work: a cartouche for each project, set around the title like the points
 * of a compass (two-by-two under the title on a phone).
 *
 * A project opens as the child route /work/<slug>, over the grid. The grid
 * stays mounted underneath, hidden and inert, so the panel can later grow
 * from the clicked cartouche and close back into it.
 */
definePageMeta({ turn: 1, crumb: 'WORK' })

const route = useRoute()
const projectOpen = computed(() => route.params.slug !== undefined)

// Clockwise from the top: north, east, south, west.
const areas = [
  '[grid-area:n]',
  '[grid-area:e]',
  '[grid-area:s]',
  '[grid-area:w]'
] as const

const twoDigits = (n: number) => String(n).padStart(2, '0')

// PROTOTYPE: Work layout variants, switched by `?variant=` in dev only.
// The last one picked is remembered, so closing a project keeps it.
const isDev = import.meta.dev
const prototypeVariants = [
  { key: 'A', name: 'Compass (current)' },
  { key: 'B', name: 'Ledger' },
  { key: 'C', name: 'Orbit' },
  { key: 'D', name: 'Arcade' },
  { key: 'E', name: 'Spotlight' }
] as const
const rememberedVariant = useState('prototype-work-variant', () => 'A')
const variant = computed(() => {
  if (!isDev) return 'A'
  const asked = route.query.variant
  return typeof asked === 'string' &&
    prototypeVariants.some((v) => v.key === asked)
    ? asked
    : rememberedVariant.value
})
watch(variant, (v) => (rememberedVariant.value = v), { immediate: true })
</script>

<template>
  <div class="grid place-items-center *:[grid-area:1/1]">
    <div
      v-if="variant === 'A'"
      data-work-grid
      class="grid grid-cols-[repeat(3,var(--c))] grid-rows-[repeat(3,var(--c))] gap-[18px] [--c:clamp(132px,21vh,190px)] [grid-template-areas:'._n_.'_'w_t_e'_'._s_.'] max-[720px]:grid-cols-[repeat(2,var(--c))] max-[720px]:grid-rows-[auto_var(--c)_var(--c)] max-[720px]:gap-3 max-[720px]:[--c:42vw] max-[720px]:[grid-template-areas:'t_t'_'n_e'_'w_s']"
      :class="{ invisible: projectOpen }"
      :inert="projectOpen"
    >
      <div
        class="flex flex-col items-center justify-center text-center [grid-area:t]"
      >
        <h2
          tabindex="-1"
          class="text-[clamp(24px,3vw,32px)] leading-none font-medium focus:outline-none"
        >
          Selected Work
        </h2>
        <DiamondDivider size="small" class="mx-auto mt-3 mb-2.5" />
        <div class="font-mono text-[10px] tracking-[3px] text-ink-dim">
          {{ twoDigits(projects.length) }} PROJECTS
        </div>
      </div>
      <Cartouche
        v-for="(project, i) in projects"
        :key="project.slug"
        :number="twoDigits(i + 1)"
        :name="project.name"
        :meta="project.meta"
        :to="`/work/${project.slug}`"
        :jewel="project.jewel"
        :class="areas[i]"
      />
    </div>
    <div v-else :class="{ invisible: projectOpen }" :inert="projectOpen">
      <PrototypeWorkLedger v-if="variant === 'B'" />
      <PrototypeWorkOrbit v-else-if="variant === 'C'" />
      <PrototypeWorkArcade v-else-if="variant === 'D'" />
      <PrototypeWorkSpotlight v-else-if="variant === 'E'" />
    </div>
    <NuxtPage />
    <PrototypeSwitcher
      v-if="isDev"
      :variants="prototypeVariants"
      :current="variant"
    />
  </div>
</template>
