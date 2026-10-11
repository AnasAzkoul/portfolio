<script setup lang="ts">
/**
 * PROTOTYPE, throw away once a phone menu is picked.
 * Floating bar that cycles `?variant=` with its arrows or the ← → keys.
 */
const { variants, current } = defineProps<{
  variants: readonly { key: string; name: string }[]
  current: string
}>()

const router = useRouter()
const route = useRoute()

const index = computed(() =>
  Math.max(
    0,
    variants.findIndex((v) => v.key === current)
  )
)
const label = computed(() => {
  const v = variants[index.value]!
  return `${v.key} · ${v.name}`
})

function go(step: number) {
  const next =
    variants[(index.value + step + variants.length) % variants.length]!
  router.replace({ query: { ...route.query, variant: next.key } })
}

function onKey(event: KeyboardEvent) {
  const target = event.target as HTMLElement | null
  if (target?.closest('input, textarea, [contenteditable]')) return
  if (event.key === 'ArrowLeft') go(-1)
  if (event.key === 'ArrowRight') go(1)
}
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <div
    class="fixed top-[58px] left-3 z-50 flex items-center rounded-full bg-[#fff] px-1 py-0.5 [font-family:system-ui] text-[12px] text-[#000] shadow-[0_4px_24px_rgb(0_0_0/0.6)] min-[720px]:top-[70px] min-[720px]:left-9"
  >
    <button
      type="button"
      class="rounded-full px-2 py-1 hover:bg-[rgb(0_0_0/0.1)]"
      aria-label="Previous variant"
      @click="go(-1)"
    >
      ←
    </button>
    <span class="text-center font-semibold whitespace-nowrap">{{ label }}</span>
    <button
      type="button"
      class="rounded-full px-2 py-1 hover:bg-[rgb(0_0_0/0.1)]"
      aria-label="Next variant"
      @click="go(1)"
    >
      →
    </button>
  </div>
</template>
