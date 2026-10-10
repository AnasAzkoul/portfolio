<script setup lang="ts">
/**
 * The fixed stage every view plays on: the turning lattice, the centre-glow
 * and vignette overlays, and the corner chrome (mark, nav, breadcrumb).
 * The page fills the viewport and never scrolls; the view goes in the slot.
 *
 * Pages steer it through definePageMeta: `turn` (0–4) turns the lattice,
 * `crumb` labels the footer breadcrumb.
 *
 * The view area centres the page and lets clicks through to the lattice's
 * stars; only the page's root element takes pointer events.
 */
defineSlots<{ default?: () => unknown }>()

const sections = [
  { label: 'WORK', to: '/work' },
  { label: 'STACK', to: '/stack' },
  { label: 'STORY', to: '/story' },
  { label: 'CONTACT', to: '/contact' }
] as const

const route = useRoute()

// A project under /work/… still counts as being on Work.
const currentSectionPath = computed(() => `/${route.path.split('/')[1]}`)
const crumbText = computed(
  () => `— ${route.meta.crumb ?? 'SELECT A SECTION'} —`
)
</script>

<template>
  <div
    class="relative h-dvh overflow-hidden bg-[radial-gradient(circle_at_50%_44%,var(--color-bg1)_0%,var(--color-bg2)_46%,var(--color-bg3)_100%)] text-ink"
  >
    <div
      data-lattice
      class="absolute inset-0 z-0 flex items-center justify-center"
    >
      <MosaicLattice
        :turn="route.meta.turn"
        class="size-[min(150dvh,150vw)] shrink-0"
      />
    </div>
    <div
      data-overlay="glow"
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 z-1 bg-[radial-gradient(circle_at_50%_46%,--alpha(var(--color-bg2)/92%)_0%,--alpha(var(--color-bg2)/55%)_16%,transparent_34%)]"
    />
    <div
      data-overlay="vignette"
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 z-1 bg-[radial-gradient(circle_at_50%_46%,transparent_52%,var(--color-bg3)_92%)]"
    />

    <div
      data-view-area
      class="pointer-events-none absolute inset-0 z-2 flex flex-col items-center justify-center px-6 pt-[90px] pb-[70px] *:pointer-events-auto max-[720px]:px-4 max-[720px]:pt-[70px] max-[720px]:pb-16"
    >
      <slot />
    </div>

    <NuxtLink
      data-mark
      to="/"
      class="absolute top-[34px] left-11 z-3 font-mono text-[13px] tracking-[3px] text-ink-dim no-underline focus-visible:outline-1 focus-visible:outline-offset-[5px] focus-visible:outline-gold max-[720px]:top-6 max-[720px]:left-6"
    >
      A. AZKOUL · <b class="font-normal text-gold-hi">EST. DAMASCUS</b>
    </NuxtLink>

    <nav
      aria-label="Sections"
      class="absolute top-9 right-11 z-3 flex gap-[26px] font-mono max-[720px]:top-auto max-[720px]:right-1/2 max-[720px]:bottom-[22px] max-[720px]:translate-x-1/2 max-[720px]:gap-[18px]"
    >
      <NuxtLink
        v-for="section in sections"
        :key="section.to"
        :to="section.to"
        :aria-current="currentSectionPath === section.to ? 'page' : undefined"
        class="relative text-xs tracking-[3px] text-ink-dim no-underline transition-colors duration-200 hover:text-gold-hi focus-visible:outline-1 focus-visible:outline-offset-[5px] focus-visible:outline-gold aria-[current=page]:text-gold-hi aria-[current=page]:after:absolute aria-[current=page]:after:-bottom-2.5 aria-[current=page]:after:left-1/2 aria-[current=page]:after:size-[5px] aria-[current=page]:after:-translate-x-1/2 aria-[current=page]:after:rotate-45 aria-[current=page]:after:border aria-[current=page]:after:border-gold-hi aria-[current=page]:after:content-['']"
      >
        {{ section.label }}
      </NuxtLink>
    </nav>

    <div
      data-crumb
      aria-hidden="true"
      class="absolute bottom-[30px] left-1/2 z-3 -translate-x-1/2 font-mono text-[11px] tracking-[4px] whitespace-nowrap text-ink-dim opacity-60 max-[720px]:hidden"
    >
      {{ crumbText }}
    </div>
  </div>
</template>
