<script setup lang="ts">
/**
 * The fixed stage every view plays on: the turning lattice, the centre-glow
 * and vignette overlays, and the corner chrome (mark, nav, breadcrumb).
 * The page fills the viewport and never scrolls; the view goes in the slot.
 *
 * Below 900px the nav doesn't fit, so the section menu stands in for it.
 *
 * Pages steer it through definePageMeta: `turn` (0–5) turns the lattice,
 * `crumb` labels the footer breadcrumb, and `stage` picks the stage layout:
 * where the lattice stands beside the view from 1280px (see utils/stage.ts).
 * The lattice glides there when the page changes.
 *
 * The view area centres the page and lets clicks through to the lattice's
 * stars; only the page's root element takes pointer events.
 *
 * After each navigation, focus moves to the new view's heading: the one
 * heading in the view with tabindex="-1". Escape closes the view, one level
 * up: a case study to Projects, a section to Home.
 */
defineSlots<{ default?: () => unknown }>()

const route = useRoute()
const router = useRouter()
const nuxtApp = useNuxtApp()
const viewArea = useTemplateRef('viewArea')

// While the section menu is open, the page behind it is inert.
const menuOpen = ref(false)

// A project under /projects/… still counts as being on Projects.
const currentSectionPath = computed(() => `/${route.path.split('/')[1]}`)
const crumbText = computed(
  () => `— ${route.meta.crumb ?? 'SELECT A SECTION'} —`
)
const stage = computed(() => route.meta.stage ?? 'centre')
const stageClasses = computed(() => stageParts[stage.value])

// A case study opens over the Projects index, which keeps its own heading
// but is inert underneath, so that heading is passed over.
function focusViewHeading() {
  const headings = viewArea.value?.querySelectorAll<HTMLElement>(
    'h1[tabindex="-1"], h2[tabindex="-1"]'
  )
  const heading = [...(headings ?? [])].find((h) => !h.closest('[inert]'))
  heading?.focus({ preventScroll: true })
}

// Home has nowhere to close to.
const closeTo = computed(() => {
  const depth = route.path.split('/').filter(Boolean).length
  if (depth === 0) return undefined
  return depth > 1 ? currentSectionPath.value : '/'
})

// The open section menu claims Escape first (its listener is added before
// this one) and marks it handled, so the view behind stays open. A held key
// repeats; only the press itself closes a view, so it closes just the one.
function onKeydown(event: KeyboardEvent) {
  if (event.key !== 'Escape' || event.repeat || event.defaultPrevented) return
  if (closeTo.value) navigateTo(closeTo.value)
}

// The new view is only in place once its page has loaded and, under an
// out-in page transition, the old view has finished leaving. Nuxt's own
// scroll behaviour waits for the same two things, `~transitionPromise`
// included. Not awaited by the hook, so page loading isn't held up.
async function focusViewHeadingOnArrival() {
  await nuxtApp['~transitionPromise']
  await nextTick()
  focusViewHeading()
}

// Focus doesn't move on the first load: it starts at the top of the
// document then.
let stopFocusingViews: (() => void) | undefined
onMounted(() => {
  stopFocusingViews = router.afterEach((to, from, failure) => {
    if (failure || to.path === from.path) return
    nuxtApp.hooks.hookOnce('page:loading:end', () => {
      focusViewHeadingOnArrival()
    })
  })
  window.addEventListener('keydown', onKeydown)
})
onBeforeUnmount(() => {
  stopFocusingViews?.()
  window.removeEventListener('keydown', onKeydown)
})

// The lattice fades in once, just after the first load; the layout then
// stays mounted across routes, so it never fades again.
const latticeRevealed = ref(false)
let revealTimer: ReturnType<typeof setTimeout> | undefined
onMounted(() => {
  revealTimer = setTimeout(() => (latticeRevealed.value = true), 180)
})
onBeforeUnmount(() => clearTimeout(revealTimer))
</script>

<template>
  <div
    :data-stage="stage"
    class="relative h-dvh overflow-hidden bg-[radial-gradient(circle_at_50%_44%,var(--color-bg1)_0%,var(--color-bg2)_46%,var(--color-bg3)_100%)] text-ink"
    :class="stageClasses.stage"
  >
    <div
      data-lattice
      class="absolute inset-0 z-0 flex items-center justify-center [transition:opacity_1.6s_ease,scale_2s_ease] motion-reduce:scale-100 motion-reduce:opacity-100 motion-reduce:transition-none"
      :class="{ 'scale-[0.985] opacity-0': !latticeRevealed }"
    >
      <!-- Below 1280px the whole circle is always on screen, centred (the
           prototype drew it at 150% of the height and cropped the ring), with
           96px of height kept for the mark, nav and breadcrumb so the ring
           never runs under them. From 1280px it stands where the stage
           layout puts it, by its size and centre, and glides there. The
           glide is on this wrapper; the lattice's own transition turns it. -->
      <div
        data-lattice-place
        class="size-[min(100dvh_-_96px,100vw)] transition-[left,top,width,height,opacity,visibility] duration-1100 ease-settle motion-reduce:transition-none min-[1280px]:absolute min-[1280px]:top-[calc(var(--lattice-y)_-_var(--lattice-size)/2)] min-[1280px]:left-[calc(var(--lattice-x)_-_var(--lattice-size)/2)] min-[1280px]:size-(--lattice-size)"
        :class="stageClasses.lattice"
      >
        <MosaicLattice :turn="route.meta.turn" class="size-full" />
      </div>
    </div>
    <div
      data-overlay="glow"
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 z-1 bg-[radial-gradient(circle_at_50%_46%,--alpha(var(--color-bg2)/92%)_0%,--alpha(var(--color-bg2)/55%)_16%,transparent_34%)]"
      :class="stageClasses.glow"
    />
    <div
      data-overlay="vignette"
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 z-1 bg-[radial-gradient(circle_at_50%_46%,transparent_52%,var(--color-bg3)_92%)]"
      :class="stageClasses.vignette"
    />

    <!-- Ahead of the view in the DOM, so Tab reads the page as it looks:
         the mark, then the sections, then the view. -->
    <header>
      <!-- Above the open section menu, so the way home stays in view. Below
           360px its letters close up, so it clears the star opposite. -->
      <NuxtLink
        data-mark
        to="/"
        class="absolute top-[34px] left-11 z-5 font-mono text-[13px] tracking-[3px] text-ink-dim no-underline focus-visible:outline-1 focus-visible:outline-offset-[5px] focus-visible:outline-gold max-[720px]:top-6 max-[720px]:left-6 max-[360px]:tracking-[1.5px]"
      >
        A. AZKOUL · <b class="font-normal text-gold-hi">EST. DAMASCUS</b>
      </NuxtLink>

      <nav
        aria-label="Sections"
        class="absolute top-9 right-11 z-3 flex gap-[26px] font-mono max-[900px]:hidden"
      >
        <NuxtLink
          v-for="section in sections"
          :key="section.to"
          :to="section.to"
          :aria-current="currentSectionPath === section.to ? 'page' : undefined"
          class="relative text-[12px] tracking-[3px] text-ink-dim no-underline transition-[color] duration-200 ease-[ease] hover:text-gold-hi focus-visible:outline-1 focus-visible:outline-offset-[5px] focus-visible:outline-gold aria-[current=page]:text-gold-hi aria-[current=page]:after:absolute aria-[current=page]:after:-bottom-2.5 aria-[current=page]:after:left-1/2 aria-[current=page]:after:size-[5px] aria-[current=page]:after:-translate-x-1/2 aria-[current=page]:after:rotate-45 aria-[current=page]:after:border aria-[current=page]:after:border-gold-hi aria-[current=page]:after:content-['']"
        >
          {{ section.label }}
        </NuxtLink>
      </nav>

      <SectionMenu v-model:open="menuOpen" :current="currentSectionPath" />
    </header>

    <!-- --view-height is the height its padding leaves for the view, so a
         panel on a short screen stays clear of the mark and breadcrumb. -->
    <main
      ref="viewArea"
      data-view-area
      class="pointer-events-none absolute inset-0 z-2 flex flex-col items-center justify-center px-6 pt-[90px] pb-[70px] [--view-height:calc(100dvh_-_160px)] *:pointer-events-auto max-[720px]:px-4 max-[720px]:pt-[70px] max-[720px]:pb-6 max-[720px]:[--view-height:calc(100dvh_-_94px)]"
      :class="stageClasses.view"
      :inert="menuOpen"
    >
      <slot />
    </main>

    <div
      data-crumb
      aria-hidden="true"
      class="absolute bottom-[30px] left-1/2 z-3 -translate-x-1/2 font-mono text-[11px] tracking-[4px] whitespace-nowrap text-ink-dim opacity-60 max-[720px]:hidden"
    >
      {{ crumbText }}
    </div>
  </div>
</template>
