<script setup lang="ts">
/**
 * The section menu, for screens narrower than 900px, where the nav doesn't
 * fit: a star button opposite the mark that opens a full-screen numbered
 * index of the sections. While the menu is open, the star's two squares
 * flatten and turn into an X.
 *
 * Usage:
 *   <SectionMenu v-model:open="menuOpen" :current="currentSectionPath" />
 *
 * It closes on the X, on Escape, on any navigation, and when the screen
 * grows to 900px, where the nav takes over. The parent makes the page
 * behind it inert while `open` is true.
 */
const open = defineModel<boolean>('open', { default: false })

defineProps<{
  /** The current section's route, e.g. "/projects"; its row is marked. */
  current: string
}>()

const menuId = useId()
const toggleButton = useTemplateRef('toggle')
const route = useRoute()

const twoDigits = (n: number) => String(n).padStart(2, '0')

// Closed, the squares sit at 0° and 45°: the star. Open, each flattens into
// a thin bar and turns, one to 45° and one to 135°: the X.
const squares = computed(() =>
  open.value
    ? [
        'rotate-45 scale-x-[1.45] scale-y-[0.23]',
        'rotate-[135deg] scale-x-[1.45] scale-y-[0.23]'
      ]
    : ['rotate-0', 'rotate-45']
)

function toggle() {
  open.value = !open.value
}

function close() {
  open.value = false
}

// Escape closes it and hands focus back to the button. It marks the key
// handled, so the view behind doesn't close too.
function onKeydown(event: KeyboardEvent) {
  if (event.key !== 'Escape' || !open.value) return
  event.preventDefault()
  close()
  toggleButton.value?.focus()
}

// Picking a section navigates; picking the current one doesn't, so its
// link closes the menu itself.
watch(() => route.fullPath, close)

// From 900px the menu is hidden and the nav shows, so it mustn't stay open.
let wideScreen: MediaQueryList | undefined
function onWideScreenChange(event: MediaQueryListEvent) {
  if (event.matches) close()
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
  wideScreen = window.matchMedia('(min-width: 900px)')
  wideScreen.addEventListener('change', onWideScreenChange)
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  wideScreen?.removeEventListener('change', onWideScreenChange)
})
</script>

<template>
  <div class="min-[900px]:hidden">
    <button
      ref="toggle"
      type="button"
      data-menu-toggle
      :aria-label="open ? 'Close sections' : 'Sections'"
      :aria-expanded="open"
      :aria-controls="menuId"
      class="fixed top-[22px] right-8 z-5 grid size-11 place-items-center transition-colors duration-200 hover:text-gold-hi focus-visible:outline-1 focus-visible:outline-gold max-[720px]:top-3 max-[720px]:right-3"
      :class="open ? 'text-gold-hi' : 'text-gold'"
      @click="toggle"
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        class="size-6 fill-none stroke-current stroke-[1.2]"
      >
        <rect
          v-for="(turn, i) in squares"
          :key="i"
          data-square
          x="5.5"
          y="5.5"
          width="13"
          height="13"
          vector-effect="non-scaling-stroke"
          class="origin-center transition-transform duration-[350ms] ease-[cubic-bezier(0.6,0,0.2,1)] [transform-box:fill-box] motion-reduce:transition-none"
          :class="turn"
        />
        <circle cx="12" cy="12" r="1.8" class="fill-gold-hi stroke-none" />
      </svg>
    </button>

    <Transition
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
      enter-active-class="transition-opacity duration-300 motion-reduce:transition-none"
      leave-active-class="transition-opacity duration-200 motion-reduce:transition-none"
    >
      <div
        v-if="open"
        :id="menuId"
        data-section-menu
        class="fixed inset-0 z-4 flex flex-col justify-center bg-bg2/94 px-6 backdrop-blur-[3px]"
      >
        <nav aria-label="Sections" class="mx-auto w-full max-w-[440px]">
          <div class="mb-2 font-mono text-[11px] tracking-[4px] text-gold-hi">
            SECTIONS
          </div>
          <ol class="border-t border-gold/18">
            <li
              v-for="(section, i) in sections"
              :key="section.to"
              class="rise"
              :style="{ animationDelay: `${80 + i * 55}ms` }"
            >
              <NuxtLink
                :to="section.to"
                :aria-current="current === section.to ? 'page' : undefined"
                class="flex items-center gap-4 border-b border-gold/18 py-4 no-underline focus-visible:outline-1 focus-visible:outline-gold"
                :class="current === section.to ? 'text-gold-hi' : 'text-ink'"
                @click="close"
              >
                <span
                  data-number
                  class="font-mono text-[10px] tracking-[2px] text-gold"
                >
                  {{ twoDigits(i + 1) }}
                </span>
                <span class="flex flex-col gap-2">
                  <span data-name class="text-[34px] leading-none font-medium">
                    {{ section.name }}
                  </span>
                  <span
                    data-subtitle
                    class="font-mono text-[9px] tracking-[2px] text-ink-dim"
                  >
                    {{ section.subtitle }}
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
  </div>
</template>

<style scoped>
/* Each row rises into place, a beat after the one above. */
.rise {
  animation: rise 0.45s ease both;
}
@keyframes rise {
  from {
    opacity: 0;
    translate: 0 10px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .rise {
    animation: none;
  }
}
</style>
